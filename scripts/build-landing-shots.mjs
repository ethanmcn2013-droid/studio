#!/usr/bin/env node
// One-off: builds the home page's product captures in public/landing/ from the
// lab originals (remote-redesign, work/2026-10-01-landing-v3-2026-10/shots/product).
//
//   node scripts/build-landing-shots.mjs [path-to-lab-shots/product]
//
// Desk captures are 1440 CSS px wide and ship at 1x (1440) and 2x (2880).
// Phone captures are 390 CSS px wide and ship at 2x (780) and 3x (1170); the
// page never draws one source pixel larger than one CSS pixel. Only resizes
// down. sharp comes with Next, so this adds no dependency.
//
// Each capture keeps its full canvas, so the page's crop coordinates are the
// product's own, but the parts the page can never show are painted flat so
// they cost almost nothing to send: the app sidebar on desk captures (every
// shot is held right of x 249) and the rows above and below the band a shot
// can reach at its widest frame. The bands are worked out from the crop
// values in src/components/home/ (see the notes beside each entry).
import { createRequire } from "node:module";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");

const SRC =
  process.argv[2] ??
  path.resolve(
    "../../remote-redesign/design-landing-v3-directions/work/2026-10-01-landing-v3-2026-10/shots/product",
  );
const OUT = path.resolve("public/landing");
mkdirSync(OUT, { recursive: true });

// [name, first row kept, last row kept, canvas height] in CSS px.
// Stage layers (ratio 1.36, 0.97 scale) are at most 892 wide: 676 rows from y.
// Plates (ratio 1.6) are at most 1180 wide: 738 rows from y.
const DESK_MIN_X = 249;
const DESK = [
  ["home-desk", 70, 747],
  ["a-board-desk", 212, 889],
  ["a-list-desk", 170, 847],
  ["calendar-desk", 160, 837],
  ["a-overview-desk", 66, 771], // stage from 66, the one-task strip to 770
  ["projects-desk", 60, 798],
  ["ledger-desk", 60, 798],
  ["project-home-desk", 60, 798],
  ["a-timeline-desk", 176, 980, 1000], // ratio 1.42 at 1140 wide; the capture is 1900 tall
  ["files-desk", 138, 824],
  ["analytics-wall-desk", 60, 798],
  ["analytics-ask-desk", 112, 850],
];
// Phone frames show exactly --y to --y + --h.
const PHONE = [
  ["home-phone", 118, 638],
  ["board-task-phone", 48, 568],
  ["list-task-phone", 268, 788],
  ["calendar-phone", 222, 742],
  ["overview-phone", 66, 586],
  ["projects-phone", 44, 664],
  ["ledger-phone", 44, 664],
  ["project-home-phone", 44, 664],
  ["a-timeline-phone", 132, 902, 920], // the capture is 1900 tall
  ["files-phone", 128, 718],
  ["analytics-wall-phone", 60, 700],
  ["analytics-ask-phone", 204, 844],
];
const FLAT = { dark: { r: 28, g: 28, b: 28 }, light: { r: 255, g: 255, b: 255 } };
const MARGIN = 3;

let total = 0;
async function build([name, y0, y1, canvas], theme, cssWidth, minX, scales) {
  const file = path.join(SRC, `${name}-${theme}.png`);
  const meta = await sharp(file).metadata();
  const density = meta.width / cssWidth;
  const height = canvas ? Math.round(canvas * density) : meta.height;
  const px = (n) => Math.round(n * density);
  const flat = (left, top, w, h) =>
    w > 0 && h > 0
      ? [{ input: { create: { width: w, height: h, channels: 3, background: FLAT[theme] } }, left, top }]
      : [];
  const top = Math.max(0, px(y0 - MARGIN));
  const bottom = Math.min(height, px(y1 + MARGIN));
  const left = Math.max(0, px(minX - MARGIN));
  const masks = [
    ...flat(0, 0, meta.width, top),
    ...flat(0, bottom, meta.width, height - bottom),
    ...flat(0, top, left, bottom - top),
  ];
  const base = await sharp(file)
    .extract({ left: 0, top: 0, width: meta.width, height })
    .composite(masks)
    .png()
    .toBuffer();
  for (const [scale, quality] of scales) {
    if (scale > density) throw new Error(`${name}: ${scale}x would upscale a ${density}x capture`);
    const out = path.join(OUT, `${name}-${theme}-${scale}x.webp`);
    await sharp(base)
      .resize({ width: cssWidth * scale, kernel: "lanczos3" })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toFile(out);
    const kb = statSync(out).size / 1024;
    total += kb;
    console.log(`${path.basename(out).padEnd(44)} ${kb.toFixed(0).padStart(5)} KB`);
  }
}

for (const theme of ["dark", "light"]) {
  for (const shot of DESK) await build(shot, theme, 1440, DESK_MIN_X, [[1, 86], [2, 76]]);
  for (const shot of PHONE) await build(shot, theme, 390, 0, [[2, 82], [3, 74]]);
}
console.log(`total ${(total / 1024).toFixed(2)} MB in ${OUT}`);
