import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productWordmarksDir = path.join(root, "public", "brand", "kit", "svg", "product-wordmarks");
const productWordmarkPngDir = path.join(root, "public", "brand", "kit", "png", "product-wordmarks");
const logosDir = path.join(root, "public", "brand", "logos");
const zipPath = path.join(root, "public", "brand", "signal-studio-brand-kit.zip");

const expectedProductWordmarks = new Map([
  ["tasks.svg", "tasks"],
  ["timeline.svg", "timeline"],
  ["signal.svg", "signal"],
  ["notes.svg", "notes"],
]);

const expectedLogos = new Map([
  ["signal-timeline.svg", "timeline"],
  ["signal-timeline-full.svg", "signal timeline"],
  ["signal.svg", "signal"],
  ["signal-full.svg", "signal"],
  ["mark-timeline.svg", "timeline mark"],
  ["mark-signal.svg", "signal mark"],
]);

const forbidden = /\b(roadmap|analytics)\b/i;
const failures = [];

async function assertDirectoryCanon(dir, expected) {
  const names = await readdir(dir);
  for (const name of names) {
    if (forbidden.test(name)) {
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

    if (forbidden.test(source)) {
      failures.push(`${path.relative(root, file)}: stale roadmap/analytics text`);
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
    if (forbidden.test(name)) {
      failures.push(`${path.relative(root, path.join(productWordmarkPngDir, name))}: stale filename`);
    }
  }

  for (const base of ["timeline", "signal"]) {
    for (const size of [128, 256, 512]) {
      const file = path.join(productWordmarkPngDir, `${base}-${size}.png`);
      try {
        const info = await stat(file);
        if (info.size <= 0) {
          failures.push(`${path.relative(root, file)}: empty PNG`);
        }
      } catch {
        failures.push(`${path.relative(root, file)}: missing canonical PNG`);
      }
    }
  }
}

async function assertBrandZip() {
  try {
    const info = await stat(zipPath);
    if (info.size <= 0) {
      failures.push(`${path.relative(root, zipPath)}: empty brand kit zip`);
    }
  } catch {
    failures.push(`${path.relative(root, zipPath)}: missing brand kit zip`);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

await assertDirectoryCanon(productWordmarksDir, expectedProductWordmarks);
await assertDirectoryCanon(logosDir, expectedLogos);
await assertCanonicalPngs();
await assertBrandZip();

if (failures.length > 0) {
  console.error("Brand asset canon check failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("Brand asset canon check passed.");
