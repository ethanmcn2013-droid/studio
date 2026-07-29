import { createHash } from "node:crypto";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const manifestPath = path.join(publicDir, "brand", "guidelines", "manifest.json");
const checksumsPath = path.join(publicDir, "brand", "guidelines", "checksums.sha256");
const archivePath = path.join(publicDir, "brand", "signal-studio-brand-kit-v2.zip");
const usagePath = path.join(publicDir, "brand", "guidelines", "USAGE.txt");

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const stage = await mkdtemp(path.join(tmpdir(), "signal-studio-brand-kit-v2-"));
const checksumLines = [];

function categorySlug(category) {
  return category.toLowerCase().replaceAll(" ", "-");
}
function sourcePath(downloadUrl) {
  return path.join(publicDir, ...downloadUrl.replace(/^\//, "").split("/"));
}

async function hashFile(file) {
  const contents = await readFile(file);
  return createHash("sha256").update(contents).digest("hex");
}

try {
  for (const asset of manifest.assets) {
    if (asset.external) continue;
    const source = sourcePath(asset.downloadUrl);
    const relative = path.posix.join(categorySlug(asset.category), asset.filename);
    const destination = path.join(stage, ...relative.split("/"));
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
    checksumLines.push(`${await hashFile(source)}  ${relative}`);
  }

  checksumLines.sort();
  const checksumText = `${checksumLines.join("\n")}\n`;
  await writeFile(checksumsPath, checksumText, "utf8");
  await writeFile(path.join(stage, "checksums.sha256"), checksumText, "utf8");
  await copyFile(usagePath, path.join(stage, "USAGE.txt"));
  await copyFile(manifestPath, path.join(stage, "kit-manifest.json"));

  await rm(archivePath, { force: true });
  if (process.platform === "win32") {
    await execFileAsync("powershell.exe", [
      "-NoProfile",
      "-Command",
      `Compress-Archive -Path '${path.join(stage, "*")}' -DestinationPath '${archivePath}' -Force`,
    ]);
  } else {
    await execFileAsync("zip", ["-qr", archivePath, "."], { cwd: stage });
  }

  console.log(`Built ${path.relative(root, archivePath)} from ${checksumLines.length} approved files.`);
} finally {
  await rm(stage, { recursive: true, force: true });
}
