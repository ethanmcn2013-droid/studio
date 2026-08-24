import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(root, "public");
const productWordmarksDir = path.join(publicDir, "brand", "kit", "svg", "product-wordmarks");
const productWordmarkPngDir = path.join(publicDir, "brand", "kit", "png", "product-wordmarks");
const logosDir = path.join(publicDir, "brand", "logos");
const legacyZipPath = path.join(publicDir, "brand", "signal-studio-brand-kit.zip");
const guidelinesDir = path.join(publicDir, "brand", "guidelines");
const manifestPath = path.join(guidelinesDir, "manifest.json");
const checksumsPath = path.join(guidelinesDir, "checksums.sha256");
const v2ZipPath = path.join(publicDir, "brand", "signal-studio-brand-kit-v2.zip");

const expectedProductWordmarks = new Map([
  ["notes.svg", "notes"],
  ["tasks.svg", "tasks"],
  ["timeline.svg", "timeline"],
  ["signal.svg", "signal"],
]);

const expectedLogos = new Map([
  ["signal-timeline.svg", "timeline"],
  ["signal-timeline-full.svg", "signal timeline"],
  ["signal.svg", "signal"],
  ["signal-full.svg", "signal"],
  ["mark-timeline.svg", "timeline mark"],
  ["mark-signal.svg", "signal mark"],
]);

const retiredNames = /\b(roadmap|analytics)\b/i;
const deprecatedKitExposure = /\bcream\b|#c9a96a|antique gold/i;
const requiredCategories = new Set([
  "Wordmarks",
  "Marks",
  "App icons",
  "Product marks",
  "Tokens",
  "Motion",
  "Imagery",
  "Templates",
  "Print",
]);
const failures = [];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function publicPath(downloadUrl) {
  return path.join(publicDir, ...downloadUrl.replace(/^\//, "").split("/"));
}

function categorySlug(category) {
  return category.toLowerCase().replaceAll(" ", "-");
}

async function fileHash(file) {
  const contents = await readFile(file);
  return createHash("sha256").update(contents).digest("hex");
}

async function assertDirectoryCanon(dir, expected) {
  const names = await readdir(dir);
  for (const name of names) {
    if (retiredNames.test(name)) {
      failures.push(`${path.relative(root, path.join(dir, name))}: stale filename`);
    }
  }

  for (const [name, label] of expected) {
    const file = path.join(dir, name);
    let source = "";
    try {
      source = await readFile(file, "utf8");
    } catch {
      failures.push(`${path.relative(root, file)}: missing canonical asset`);
      continue;
    }

    if (retiredNames.test(source)) {
      failures.push(`${path.relative(root, file)}: stale product text`);
    }

    const ariaPattern = new RegExp(`aria-label=["']${escapeRegExp(label)}["']`, "i");
    if (!ariaPattern.test(source)) {
      failures.push(`${path.relative(root, file)}: missing aria-label="${label}"`);
    }

    if (name.includes("timeline") && !/timeline/.test(source)) {
      failures.push(`${path.relative(root, file)}: missing rendered timeline text`);
    }

    if ((name === "signal.svg" || name === "signal-full.svg") && !/>signal</.test(source)) {
      failures.push(`${path.relative(root, file)}: missing rendered signal text`);
    }
  }
}

async function assertCanonicalPngs() {
  const names = await readdir(productWordmarkPngDir);
  for (const name of names) {
    if (retiredNames.test(name)) {
      failures.push(`${path.relative(root, path.join(productWordmarkPngDir, name))}: stale filename`);
    }
  }

  for (const base of ["notes", "tasks", "timeline", "signal"]) {
    for (const size of [128, 256, 512]) {
      const file = path.join(productWordmarkPngDir, `${base}-${size}.png`);
      try {
        const info = await stat(file);
        if (info.size <= 0) failures.push(`${path.relative(root, file)}: empty PNG`);
      } catch {
        failures.push(`${path.relative(root, file)}: missing canonical PNG`);
      }
    }
  }
}

async function assertNonEmpty(file, label) {
  try {
    const info = await stat(file);
    if (info.size <= 0) failures.push(`${path.relative(root, file)}: empty ${label}`);
  } catch {
    failures.push(`${path.relative(root, file)}: missing ${label}`);
  }
}

async function listZip(file) {
  const attempts =
    process.platform === "win32"
      ? [
          ["tar", ["-tf", file]],
          [
            "powershell.exe",
            [
              "-NoProfile",
              "-Command",
              `Add-Type -AssemblyName System.IO.Compression.FileSystem; [IO.Compression.ZipFile]::OpenRead('${file}').Entries.FullName`,
            ],
          ],
        ]
      : [
          ["unzip", ["-Z1", file]],
          ["tar", ["-tf", file]],
        ];

  for (const [command, args] of attempts) {
    try {
      const { stdout } = await execFileAsync(command, args);
      return stdout
        .split(/\r?\n/)
        .map((entry) => entry.trim().replaceAll("\\", "/").replace(/^\.\//, ""))
        .filter((entry) => entry && !entry.endsWith("/"));
    } catch {
      continue;
    }
  }
  throw new Error("No ZIP listing command is available.");
}

async function assertGuidelinesManifest() {
  let manifest;
  let raw;
  try {
    raw = await readFile(manifestPath, "utf8");
    manifest = JSON.parse(raw);
  } catch {
    failures.push(`${path.relative(root, manifestPath)}: unreadable manifest`);
    return;
  }

  if (manifest.version !== "2.0.0") {
    failures.push(`${path.relative(root, manifestPath)}: expected version 2.0.0`);
  }
  if (retiredNames.test(raw)) {
    failures.push(`${path.relative(root, manifestPath)}: retired product name exposed`);
  }
  if (deprecatedKitExposure.test(raw)) {
    failures.push(`${path.relative(root, manifestPath)}: deprecated palette exposed`);
  }

  const ids = new Set();
  const archivePaths = new Set(["USAGE.txt", "checksums.sha256", "kit-manifest.json"]);
  const checksums = new Map();
  try {
    const checksumText = await readFile(checksumsPath, "utf8");
    for (const line of checksumText.trim().split(/\r?\n/)) {
      const match = line.match(/^([a-f0-9]{64})\s{2}(.+)$/);
      if (match) checksums.set(match[2].replaceAll("\\", "/"), match[1]);
    }
  } catch {
    failures.push(`${path.relative(root, checksumsPath)}: missing checksum manifest`);
  }

  for (const asset of manifest.assets ?? []) {
    if (!asset.id || ids.has(asset.id)) {
      failures.push(`${path.relative(root, manifestPath)}: duplicate or missing asset id ${asset.id ?? "(missing)"}`);
    }
    ids.add(asset.id);

    if (!requiredCategories.has(asset.category)) {
      failures.push(`${path.relative(root, manifestPath)}: unknown category ${asset.category}`);
    }
    if (retiredNames.test(`${asset.title} ${asset.filename} ${asset.downloadUrl}`)) {
      failures.push(`${path.relative(root, manifestPath)}: retired name in ${asset.id}`);
    }
    if (deprecatedKitExposure.test(`${asset.title} ${asset.filename} ${asset.downloadUrl}`)) {
      failures.push(`${path.relative(root, manifestPath)}: deprecated palette in ${asset.id}`);
    }
    if (asset.external) continue;
    if (!asset.downloadUrl?.startsWith("/")) {
      failures.push(`${path.relative(root, manifestPath)}: ${asset.id} is not a public local URL`);
      continue;
    }

    const file = publicPath(asset.downloadUrl);
    const archiveRelative = path.posix.join(categorySlug(asset.category), asset.filename);
    archivePaths.add(archiveRelative);
    try {
      const info = await stat(file);
      if (info.size !== asset.bytes) {
        failures.push(`${path.relative(root, file)}: manifest bytes ${asset.bytes}, actual ${info.size}`);
      }
      const expectedHash = checksums.get(archiveRelative);
      if (!expectedHash) {
        failures.push(`${path.relative(root, checksumsPath)}: missing ${archiveRelative}`);
      } else if ((await fileHash(file)) !== expectedHash) {
        failures.push(`${path.relative(root, file)}: checksum mismatch`);
      }
    } catch {
      failures.push(`${path.relative(root, file)}: missing manifest asset`);
    }
  }

  if (ids.size < 20) {
    failures.push(`${path.relative(root, manifestPath)}: expected a useful asset library, found ${ids.size}`);
  }

  try {
    const entries = new Set(await listZip(v2ZipPath));
    for (const expected of archivePaths) {
      if (!entries.has(expected)) {
        failures.push(`${path.relative(root, v2ZipPath)}: missing ${expected}`);
      }
    }
    for (const entry of entries) {
      if (retiredNames.test(entry)) {
        failures.push(`${path.relative(root, v2ZipPath)}: retired product entry ${entry}`);
      }
      if (deprecatedKitExposure.test(entry)) {
        failures.push(`${path.relative(root, v2ZipPath)}: deprecated palette entry ${entry}`);
      }
      if (!archivePaths.has(entry)) {
        failures.push(`${path.relative(root, v2ZipPath)}: unmanifested entry ${entry}`);
      }
    }
  } catch (error) {
    failures.push(`${path.relative(root, v2ZipPath)}: ${error.message}`);
  }
}

await assertDirectoryCanon(productWordmarksDir, expectedProductWordmarks);
await assertDirectoryCanon(logosDir, expectedLogos);
await assertCanonicalPngs();
await assertNonEmpty(legacyZipPath, "compatibility brand kit zip");
await assertNonEmpty(v2ZipPath, "brand kit v2 zip");
await assertGuidelinesManifest();

if (failures.length > 0) {
  console.error("Brand asset canon check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Brand asset canon check passed.");
