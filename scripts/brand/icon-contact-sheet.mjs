/**
 * Renders the browser and install icons onto one sheet, so a person can look
 * at them before they ship.
 *
 *   node --import tsx scripts/brand/icon-contact-sheet.mjs <out.png>
 *
 * Each row is one piece of artwork at 16, 32, 48, 180 and 512 pixels, on a
 * light tab strip (white) and on a dark one (Chrome's dark strip grey). The
 * last row magnifies the 16 and 32 pixel frames ten times with no smoothing,
 * to show the ring is whole pixels and not grey mush.
 */
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createElement } from "react";
import { ImageResponse } from "next/og";
import { chromium } from "@playwright/test";

const require = createRequire(import.meta.url);
const { SuiteMark, SIGNAL_FLOOR, TILE_COVERAGE, SIGNAL_INDIGO_ON_DARK } = require("../../src/lib/brand/suite-mark.tsx");

const out = process.argv[2];
if (!out) throw new Error("Usage: icon-contact-sheet.mjs <out.png>");

const SIZES = [16, 32, 48, 180, 512];
const LIGHT = "#ffffff";
const DARK = "#202124";

async function png(props, canvas) {
  const response = new ImageResponse(createElement(SuiteMark, { canvas, ...props }), { width: canvas, height: canvas });
  return `data:image/png;base64,${Buffer.from(await response.arrayBuffer()).toString("base64")}`;
}

const svgSource = readFileSync(new URL("../../public/icon.svg", import.meta.url), "utf8");
const svgLight = `data:image/svg+xml;base64,${Buffer.from(svgSource).toString("base64")}`;
// What a browser in a dark colour scheme draws: the dark rule, applied.
const svgDarkSource = svgSource.replace(/\.mark \{ color: [^;]+; \}/, `.mark { color: ${SIGNAL_INDIGO_ON_DARK}; }`);
const svgDark = `data:image/svg+xml;base64,${Buffer.from(svgDarkSource).toString("base64")}`;

const rows = [
  {
    label: "icon.svg (Chrome, Edge, Firefox). The dark strip shows its dark-scheme rule.",
    light: Object.fromEntries(SIZES.map((size) => [size, svgLight])),
    dark: Object.fromEntries(SIZES.map((size) => [size, svgDark])),
  },
  {
    label: "favicon.ico frames and /icon (PNG, transparent). One colour for both strips.",
    light: Object.fromEntries(await Promise.all(SIZES.map(async (size) => [size, await png({ background: "transparent" }, size)]))),
  },
  {
    label: "/apple-icon (180), /icon2 (192) and /icon1 (512): the install tile, full bleed.",
    light: Object.fromEntries(await Promise.all(SIZES.map(async (size) => [size, await png({ background: SIGNAL_FLOOR, coverage: TILE_COVERAGE }, size)]))),
  },
];
for (const row of rows) row.dark ??= row.light;

const cell = (src, size) => `<figure><img src="${src}" width="${size}" height="${size}" alt=""><figcaption>${size}</figcaption></figure>`;
const strip = (row, ground, key) => `<div class="strip" style="background:${ground}">${SIZES.map((size) => cell(row[key][size], size)).join("")}</div>`;
const zoom = (src, size, ground) => `<figure style="background:${ground}"><img class="zoom" src="${src}" width="${size * 10}" height="${size * 10}" alt=""><figcaption>${size}px, ten times</figcaption></figure>`;

const html = `<!doctype html><meta charset="utf-8"><style>
  body { margin: 0; padding: 24px; font: 13px/1.4 system-ui, sans-serif; background: #e9e9ec; color: #222; width: 1960px; }
  h2 { font-size: 13px; font-weight: 600; margin: 22px 0 8px; }
  .pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .strip { display: flex; align-items: flex-end; gap: 28px; padding: 20px; border-radius: 8px; }
  figure { margin: 0; display: grid; justify-items: center; gap: 8px; padding: 0; }
  figcaption { font-size: 11px; color: #8a8a8f; }
  .zooms { display: flex; gap: 12px; flex-wrap: wrap; }
  .zooms figure { padding: 20px; border-radius: 8px; }
  .zoom { image-rendering: pixelated; }
</style>
${rows.map((row) => `<h2>${row.label}</h2><div class="pair">${strip(row, LIGHT, "light")}${strip(row, DARK, "dark")}</div>`).join("")}
<h2>The tab frames, magnified with no smoothing</h2>
<div class="zooms">
  ${zoom(rows[1].light[16], 16, LIGHT)}${zoom(rows[1].light[16], 16, DARK)}${zoom(rows[1].light[32], 32, LIGHT)}${zoom(rows[1].light[32], 32, DARK)}
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 2008, height: 900 }, deviceScaleFactor: 1 });
await page.setContent(html);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log(`Icon contact sheet written: ${out}`);
