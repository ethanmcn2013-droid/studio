#!/usr/bin/env node
// Builds the home page's product captures in public/landing/<version>/ from
// the lab originals (remote-redesign, work/2026-10-01-landing-v3-2026-10/shots/product).
//
//   node scripts/build-landing-shots.mjs [path-to-lab-shots/product]
//
// src/components/home/shots.json says which rows of each capture a frame can
// show. Each file is cut to exactly those rows, so nothing is sent that the
// page cannot show and a frame never has to shift its picture up or down.
//
//   desk    1440 CSS px wide captures. A "wide" one keeps its whole width
//           (the page shows the main panel from 1272 px and the whole window
//           from 1680 px); the rest are cut to their own panel. 1x and 2x.
//   tablet  1024 CSS px wide captures, cut the same way. 2x only: they are
//           always drawn a little under their own size.
//   phone   390 CSS px wide captures. 2x and 3x.
//
// The folder name is a hash of every file written, so /landing/<version>/ can
// be cached for good and a new capture can never be served stale. The hash
// goes to src/components/home/shot-manifest.json. Only resizes down. sharp
// comes with Next, so this adds no dependency.
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");

const SRC =
  process.argv[2] ??
  path.resolve(
    "../../remote-redesign/design-landing-v3-directions/work/2026-10-01-landing-v3-2026-10/shots/product",
  );
const HOME = path.resolve("src/components/home");
const registry = JSON.parse(readFileSync(path.join(HOME, "shots.json"), "utf8"));
const PUBLIC = path.resolve("public/landing");
const TMP = path.join(PUBLIC, ".building");
rmSync(TMP, { recursive: true, force: true });
mkdirSync(TMP, { recursive: true });

const PLAN = {
  desk: { scales: [[1, 86], [2, 76]] },
  tablet: { scales: [[2, 78]] },
  phone: { scales: [[2, 82], [3, 74]] },
};

const hash = createHash("sha256");
let total = 0;
for (const [name, entry] of Object.entries(registry.shots)) {
  const kind = registry[entry.kind];
  let left = 0;
  let width = kind.sourceWidth;
  if (entry.kind !== "phone" && !entry.wide) {
    left = entry.x ?? kind.panelX;
    width = entry.w ?? kind.panelWidth;
  }
  for (const theme of ["dark", "light"]) {
    // A second cut of a capture that is already used names it in `source`.
    const file = path.join(SRC, `${entry.source ?? name}-${theme}.png`);
    const meta = await sharp(file).metadata();
    const density = meta.width / kind.sourceWidth;
    const px = (n) => Math.round(n * density);
    if (px(entry.y + entry.h) > meta.height) throw new Error(`${name}: rows ${entry.y} to ${entry.y + entry.h} run past the capture`);
    const cut = await sharp(file)
      .extract({ left: px(left), top: px(entry.y), width: px(width), height: px(entry.h) })
      .png()
      .toBuffer();
    for (const [scale, quality] of PLAN[entry.kind].scales) {
      if (scale > density) throw new Error(`${name}: ${scale}x would upscale a ${density}x capture`);
      const out = `${name}-${theme}-${scale}x.webp`;
      const buffer = await sharp(cut)
        .resize({ width: width * scale, height: entry.h * scale, fit: "fill", kernel: "lanczos3" })
        .webp({ quality, effort: 6, smartSubsample: true })
        .toBuffer();
      writeFileSync(path.join(TMP, out), buffer);
      hash.update(out).update(buffer);
      total += buffer.length / 1024;
      console.log(`${out.padEnd(44)} ${(buffer.length / 1024).toFixed(0).padStart(5)} KB`);
    }
  }
}

const version = hash.digest("hex").slice(0, 10);
for (const old of readdirSync(PUBLIC)) if (old !== ".building") rmSync(path.join(PUBLIC, old), { recursive: true, force: true });
const OUT = path.join(PUBLIC, version);
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true });
renameSync(TMP, OUT);
writeFileSync(path.join(HOME, "shot-manifest.json"), `${JSON.stringify({ version }, null, 2)}\n`);
console.log(`total ${(total / 1024).toFixed(2)} MB in ${OUT}`);
