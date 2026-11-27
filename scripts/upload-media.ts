import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "scripts", "media-manifest.json");
const BUCKET = process.env.R2_BUCKET ?? "portfolio-media";
const MODE = process.argv.includes("--remote") ? "--remote" : "--local";

type ManifestEntry = {
  key: string;
  contentType: string;
};

const main = () => {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error("Missing scripts/media-manifest.json. Run prepare-assets first.");
  }
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Record<string, ManifestEntry>;
  const wranglerCli = path.join(ROOT, "node_modules", "wrangler", "bin", "wrangler.js");

  for (const entry of Object.values(manifest)) {
    const filePath = path.join(ROOT, "public", "_media", ...entry.key.split("/"));
    execFileSync(
      process.execPath,
      [
        wranglerCli,
        "r2",
        "object",
        "put",
        `${BUCKET}/${entry.key}`,
        `--file=${filePath}`,
        `--content-type=${entry.contentType}`,
        MODE,
      ],
      { stdio: "inherit" },
    );
  }
};

main();
