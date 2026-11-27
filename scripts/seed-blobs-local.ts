import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const ROOT = process.cwd();
const D1_DIR = path.join(ROOT, ".wrangler", "state", "v3", "d1", "miniflare-D1DatabaseObject");
const CHUNK_SIZE = 32 * 1024;

const main = () => {
  if (!fs.existsSync(D1_DIR)) {
    throw new Error(`Local D1 directory not found at ${D1_DIR}. Run db:migrate:local first.`);
  }
  const sqliteFiles = fs.readdirSync(D1_DIR).filter((f) => f.endsWith(".sqlite"));
  if (sqliteFiles.length === 0) {
    throw new Error("No .sqlite file found in local Miniflare D1 state.");
  }

  const binaryFiles: Array<{ src: string; key: string; mime: string }> = [
    { src: "cntl11.mp4", key: "cases/cntl/video-11-nam.mp4", mime: "video/mp4" },
    { src: "CV_Le Thuy Trang_Social & Content MKT.pdf", key: "profile/cv-le-thuy-trang.pdf", mime: "application/pdf" },
  ];

  for (const sqliteFile of sqliteFiles) {
    const dbPath = path.join(D1_DIR, sqliteFile);
    const db = new DatabaseSync(dbPath);
    const hasTable = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='media_objects'")
      .get();
    if (!hasTable) {
      db.close();
      continue;
    }

    const delChunks = db.prepare("DELETE FROM media_chunks WHERE key = ?");
    const delObj = db.prepare("DELETE FROM media_objects WHERE key = ?");
    const insObj = db.prepare(
      "INSERT INTO media_objects (key, content_type, size, etag) VALUES (?, ?, ?, ?)",
    );
    const insChunk = db.prepare(
      "INSERT INTO media_chunks (key, chunk_index, data) VALUES (?, ?, ?)",
    );

    for (const bf of binaryFiles) {
      const fullSrc = path.join(ROOT, bf.src);
      const buf = fs.existsSync(fullSrc)
        ? fs.readFileSync(fullSrc)
        : Buffer.alloc(4096, 0x6d); // Synthetic 4KB fixture in CI where raw .mp4/.pdf are gitignored
      const hash = crypto.createHash("sha1").update(buf).digest("hex").slice(0, 12);

      db.exec("BEGIN TRANSACTION");
      delChunks.run(bf.key);
      delObj.run(bf.key);
      insObj.run(bf.key, bf.mime, buf.byteLength, `"${hash}"`);

      const totalChunks = Math.ceil(buf.byteLength / CHUNK_SIZE);
      for (let idx = 0; idx < totalChunks; idx++) {
        const slice = buf.subarray(idx * CHUNK_SIZE, Math.min(buf.byteLength, (idx + 1) * CHUNK_SIZE));
        insChunk.run(bf.key, idx, slice);
      }
      db.exec("COMMIT");
      console.log(`Seeded ${bf.key} (${totalChunks} chunks, ${buf.byteLength} bytes) -> ${sqliteFile}`);
    }

    db.close();
  }
};

main();
