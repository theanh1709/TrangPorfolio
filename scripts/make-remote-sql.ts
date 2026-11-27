import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CHUNK = 32 * 1024;
const out: string[] = [fs.readFileSync(path.join(ROOT, "drizzle", "seed", "seed.sql"), "utf8")];

const binaryFiles: Array<[string, string, string]> = [
  ["cntl11.mp4", "cases/cntl/video-11-nam.mp4", "video/mp4"],
  ["CV_Le Thuy Trang_Social & Content MKT.pdf", "profile/cv-le-thuy-trang.pdf", "application/pdf"],
];

for (const [src, key, mime] of binaryFiles) {
  const full = path.join(ROOT, src);
  if (!fs.existsSync(full)) continue;
  const buf = fs.readFileSync(full);
  const etag = `"${crypto.createHash("sha1").update(buf).digest("hex").slice(0, 12)}"`;
  out.push(`DELETE FROM media_chunks WHERE key = '${key}';`);
  out.push(`DELETE FROM media_objects WHERE key = '${key}';`);
  out.push(
    `INSERT INTO media_objects (key, content_type, size, etag) VALUES ('${key}', '${mime}', ${buf.byteLength}, '${etag}');`,
  );
  const n = Math.ceil(buf.byteLength / CHUNK);
  for (let i = 0; i < n; i++) {
    const hex = buf.subarray(i * CHUNK, Math.min(buf.byteLength, (i + 1) * CHUNK)).toString("hex");
    out.push(`INSERT INTO media_chunks (key, chunk_index, data) VALUES ('${key}', ${i}, X'${hex}');`);
  }
}

const fullSql = Buffer.from(out.join("\n") + "\n", "utf8");
fs.mkdirSync(path.join(ROOT, ".wrangler"), { recursive: true });
fs.writeFileSync(path.join(ROOT, ".wrangler", "remote-import.sql"), fullSql);
console.log("REMOTE_SQL_MD5=" + crypto.createHash("md5").update(fullSql).digest("hex"));
