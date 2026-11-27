import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_MEDIA_DIR = path.join(ROOT, "public", "_media");
const MANIFEST_PATH = path.join(ROOT, "scripts", "media-manifest.json");

type ManifestEntry = {
  key: string;
  contentType: string;
  width: number;
  height: number;
  bytes: number;
  etag: string;
};

const extractDataUris = (htmlPath: string): Array<{ mime: string; buffer: Buffer }> => {
  const html = fs.readFileSync(htmlPath, "utf8");
  const regex = /data:([a-zA-Z0-9/+.-]+);base64,([A-Za-z0-9+/=]+)/g;
  const results: Array<{ mime: string; buffer: Buffer }> = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    const mime = match[1] ?? "image/jpeg";
    const b64 = match[2] ?? "";
    results.push({ mime, buffer: Buffer.from(b64, "base64") });
  }
  return results;
};

const writeWebp = async (
  sourceBuffer: Buffer,
  sourceMime: string,
  relKey: string,
  manifest: Record<string, ManifestEntry>,
): Promise<void> => {
  const destPath = path.join(OUT_MEDIA_DIR, ...relKey.split("/"));
  fs.mkdirSync(path.dirname(destPath), { recursive: true });

  let outBuffer: Buffer;
  let width = 0;
  let height = 0;

  if (sourceMime === "image/webp") {
    const meta = await sharp(sourceBuffer).metadata();
    outBuffer = sourceBuffer;
    width = meta.width ?? 590;
    height = meta.height ?? 601;
  } else {
    const pipeline = sharp(sourceBuffer).webp({ quality: 84, effort: 4 });
    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
    outBuffer = data;
    width = info.width;
    height = info.height;
  }

  fs.writeFileSync(destPath, outBuffer);
  const hash = crypto.createHash("sha1").update(outBuffer).digest("hex").slice(0, 12);
  manifest[relKey] = {
    key: relKey,
    contentType: "image/webp",
    width,
    height,
    bytes: outBuffer.byteLength,
    etag: `"${hash}"`,
  };
};

const main = async () => {
  fs.mkdirSync(OUT_MEDIA_DIR, { recursive: true });
  const manifest: Record<string, ManifestEntry> = {};

  // 1. Portfolio_LeThuyTrang.html (27 images)
  const homeUris = extractDataUris(path.join(ROOT, "Portfolio_LeThuyTrang.html"));
  const homeKeys: string[] = [
    "hero/portrait.webp",
    "design/bloomsky/cover.webp",
    "design/works/hoa-lo.webp",
    "design/works/cake-bliss.webp",
    "design/works/com-tuoi-moc-mien.webp",
    "design/works/dalat-hasfarm.webp",
    ...Array.from({ length: 21 }, (_, i) => `design/bloomsky/p${String(i + 1).padStart(2, "0")}.webp`),
  ];

  for (let i = 0; i < homeKeys.length; i++) {
    const item = homeUris[i];
    const key = homeKeys[i];
    if (item && key) {
      await writeWebp(item.buffer, item.mime, key, manifest);
    }
  }

  // 2. case-woori.html (11 images)
  const wooriUris = extractDataUris(path.join(ROOT, "case-woori.html"));
  const wooriKeys: string[] = [
    "cases/woori/cover-01.webp",
    "cases/woori/cover-02.webp",
    "cases/woori/cover-03.webp",
    ...Array.from({ length: 8 }, (_, i) => `cases/woori/storyboard-${String(i + 1).padStart(2, "0")}.webp`),
  ];
  for (let i = 0; i < wooriKeys.length; i++) {
    const item = wooriUris[i];
    const key = wooriKeys[i];
    if (item && key) {
      await writeWebp(item.buffer, item.mime, key, manifest);
    }
  }

  // 3. case-cntl.html (23 images)
  const cntlUris = extractDataUris(path.join(ROOT, "case-cntl.html"));
  const cntlKeys: string[] = [
    "cases/cntl/cover.webp",
    "cases/cntl/feed-before-context.webp",
    "cases/cntl/pillar-01.webp",
    "cases/cntl/pillar-02.webp",
    "cases/cntl/pillar-03.webp",
    "cases/cntl/ba-before.webp",
    "cases/cntl/ba-after.webp",
    "cases/cntl/stage-before.webp",
    "cases/cntl/stage-after.webp",
    "cases/cntl/dish-01.webp",
    "cases/cntl/dish-02.webp",
    "cases/cntl/dish-03.webp",
    "cases/cntl/dish-04.webp",
    "cases/cntl/branch-q5.webp",
    "cases/cntl/branch-joy.webp",
    "cases/cntl/video-11-nam-poster.webp",
    "cases/cntl/opening-cn30.webp",
    "cases/cntl/opening-pdg.webp",
    "cases/cntl/tet-01.webp",
    "cases/cntl/tet-02.webp",
    "cases/cntl/tet-03.webp",
    "cases/cntl/tet-04.webp",
    "cases/cntl/koc-workshop.webp",
  ];
  for (let i = 0; i < cntlKeys.length; i++) {
    const item = cntlUris[i];
    const key = cntlKeys[i];
    if (item && key) {
      await writeWebp(item.buffer, item.mime, key, manifest);
    }
  }

  // 4. case-phl.html (24 images)
  const phlUris = extractDataUris(path.join(ROOT, "case-phl.html"));
  const phlKeys: string[] = [
    "cases/phl/cover.webp",
    "cases/phl/press-dantri.webp",
    "cases/phl/press-vnexpress.webp",
    "cases/phl/press-tuoitre.webp",
    "cases/phl/press-dnsg.webp",
    "cases/phl/press-vietcetera.webp",
    "cases/phl/csr-vinh-long.webp",
    "cases/phl/btd-01.webp",
    "cases/phl/btd-02.webp",
    "cases/phl/btd-03.webp",
    "cases/phl/btd-04.webp",
    "cases/phl/btd-05.webp",
    "cases/phl/btd-06.webp",
    "cases/phl/outing-2025.webp",
    "cases/phl/caa-trophy.webp",
    "cases/phl/ceo-msg-vi.webp",
    "cases/phl/ceo-msg-en.webp",
    "cases/phl/social-2612.webp",
    "cases/phl/social-3112.webp",
    "cases/phl/web-hero.webp",
    "cases/phl/web-home-full.webp",
    "cases/phl/web-product-full.webp",
    "cases/phl/web-claims.webp",
    "cases/phl/web-health.webp",
  ];
  for (let i = 0; i < phlKeys.length; i++) {
    const item = phlUris[i];
    const key = phlKeys[i];
    if (item && key) {
      await writeWebp(item.buffer, item.mime, key, manifest);
    }
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  const totalBytes = Object.values(manifest).reduce((sum, m) => sum + m.bytes, 0);
  console.log(
    `Prepared ${Object.keys(manifest).length} WebP images (${(totalBytes / 1024 / 1024).toFixed(2)} MB) -> public/_media/`,
  );
};

void main();
