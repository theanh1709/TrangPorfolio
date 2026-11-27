import { and, asc, eq, gte, lte } from "drizzle-orm";
import { getDb } from "~/lib/db/client";
import { mediaChunks, mediaObjects } from "~/lib/db/schema";
import { isSafeMediaKey, parseRangeHeader } from "~/lib/media";
import type { Route } from "./+types/media.$";

const MIME_BY_EXT: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  avif: "image/avif",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
  pdf: "application/pdf",
};

const getMimeType = (key: string): string => {
  const ext = key.split(".").pop()?.toLowerCase() ?? "";
  return MIME_BY_EXT[ext] ?? "application/octet-stream";
};

const CHUNK_SIZE = 32 * 1024; // 32 KB per D1 blob row (under 100 KB SQL statement limit)

export const loader = async ({ params, request, context }: Route.LoaderArgs) => {
  const key = params["*"];
  if (!isSafeMediaKey(key)) {
    return new Response("Bad Request", { status: 400 });
  }

  const env = context.cloudflare.env;
  const ifNoneMatch = request.headers.get("If-None-Match");
  const rangeHeader = request.headers.get("Range");
  const isImmutable = !key.endsWith(".pdf");
  const cacheControl = isImmutable
    ? "public, max-age=31536000, immutable"
    : "public, max-age=86400";

  // 1. Primary: Cloudflare R2 bucket when bound
  if (env.MEDIA) {
    const r2Obj = await env.MEDIA.get(key, {
      range: request.headers,
      onlyIf: request.headers,
    });

    if (r2Obj) {
      const headers = new Headers();
      r2Obj.writeHttpMetadata(headers);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", getMimeType(key));
      }
      headers.set("ETag", r2Obj.httpEtag);
      headers.set("Accept-Ranges", "bytes");
      headers.set("Cache-Control", cacheControl);

      if (!("body" in r2Obj) || !r2Obj.body) {
        return new Response(null, { status: 304, headers });
      }

      if (rangeHeader && r2Obj.range && "offset" in r2Obj.range && r2Obj.range.length !== undefined) {
        const start = r2Obj.range.offset ?? 0;
        const end = start + r2Obj.range.length - 1;
        headers.set("Content-Range", `bytes ${start}-${end}/${r2Obj.size}`);
        headers.set("Content-Length", String(r2Obj.range.length));
        return new Response(r2Obj.body, { status: 206, headers });
      }

      headers.set("Content-Length", String(r2Obj.size));
      return new Response(r2Obj.body, { status: 200, headers });
    }
  }

  // 2. Secondary: Cloudflare Workers Static Assets (/_media/<key>)
  if (env.ASSETS) {
    const assetUrl = new URL(`/_media/${key}`, request.url);
    const assetRes = await env.ASSETS.fetch(new Request(assetUrl.toString(), { method: "GET" }));
    if (assetRes.ok) {
      const etag = assetRes.headers.get("ETag") ?? `W/"${key}"`;
      const headers = new Headers();
      headers.set("Content-Type", assetRes.headers.get("Content-Type") ?? getMimeType(key));
      headers.set("ETag", etag);
      headers.set("Accept-Ranges", "bytes");
      headers.set("Cache-Control", cacheControl);

      if (ifNoneMatch && ifNoneMatch === etag) {
        return new Response(null, { status: 304, headers });
      }

      if (rangeHeader) {
        const buf = new Uint8Array(await assetRes.arrayBuffer());
        const parsed = parseRangeHeader(rangeHeader, buf.byteLength);
        if (parsed === "unsatisfiable") {
          headers.set("Content-Range", `bytes */${buf.byteLength}`);
          return new Response(null, { status: 416, headers });
        }
        if (parsed) {
          const slice = buf.subarray(parsed.offset, parsed.end + 1);
          headers.set("Content-Range", `bytes ${parsed.offset}-${parsed.end}/${buf.byteLength}`);
          headers.set("Content-Length", String(slice.byteLength));
          return new Response(slice, { status: 206, headers });
        }
      }

      return new Response(assetRes.body, { status: 200, headers });
    }
  }

  // 3. Tertiary: D1 chunked binary blob store (for MP4/PDF excluded from Git when R2 isn't enabled)
  const db = getDb(env.DB);
  const [meta] = await db
    .select()
    .from(mediaObjects)
    .where(eq(mediaObjects.key, key))
    .limit(1);

  if (!meta) {
    return new Response("Not Found", { status: 404 });
  }

  const headers = new Headers({
    "Content-Type": meta.contentType || getMimeType(key),
    ETag: meta.etag,
    "Accept-Ranges": "bytes",
    "Cache-Control": cacheControl,
  });

  if (ifNoneMatch && ifNoneMatch === meta.etag) {
    return new Response(null, { status: 304, headers });
  }

  const parsedRange = parseRangeHeader(rangeHeader, meta.size);
  if (parsedRange === "unsatisfiable") {
    headers.set("Content-Range", `bytes */${meta.size}`);
    return new Response(null, { status: 416, headers });
  }

  const startByte = parsedRange ? parsedRange.offset : 0;
  const endByte = parsedRange ? parsedRange.end : meta.size - 1;
  const startChunk = Math.floor(startByte / CHUNK_SIZE);
  const endChunk = Math.floor(endByte / CHUNK_SIZE);

  const chunks = await db
    .select()
    .from(mediaChunks)
    .where(
      and(
        eq(mediaChunks.key, key),
        gte(mediaChunks.chunkIndex, startChunk),
        lte(mediaChunks.chunkIndex, endChunk),
      ),
    )
    .orderBy(asc(mediaChunks.chunkIndex));

  const outLength = endByte - startByte + 1;
  const output = new Uint8Array(outLength);
  let writeOffset = 0;

  for (const chunk of chunks) {
    const chunkBytes =
      chunk.data instanceof Uint8Array
        ? chunk.data
        : new Uint8Array(chunk.data as ArrayBufferLike);
    const chunkStartGlobal = chunk.chunkIndex * CHUNK_SIZE;
    const sliceStart = Math.max(0, startByte - chunkStartGlobal);
    const sliceEnd = Math.min(chunkBytes.byteLength, endByte - chunkStartGlobal + 1);
    if (sliceEnd > sliceStart) {
      const sub = chunkBytes.subarray(sliceStart, sliceEnd);
      output.set(sub, writeOffset);
      writeOffset += sub.byteLength;
    }
  }

  headers.set("Content-Length", String(writeOffset));
  if (parsedRange) {
    headers.set("Content-Range", `bytes ${startByte}-${startByte + writeOffset - 1}/${meta.size}`);
    return new Response(output.subarray(0, writeOffset), { status: 206, headers });
  }

  return new Response(output.subarray(0, writeOffset), { status: 200, headers });
};
