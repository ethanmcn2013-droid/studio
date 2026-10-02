import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createElement } from "react";
import { ImageResponse } from "next/og";
import { PNG } from "pngjs";
import { buildFavicon, FAVICON_SIZES } from "./favicon-artifacts.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const require = createRequire(import.meta.url);
const { SuiteMark, SIGNAL_INDIGO, SIGNAL_INDIGO_ON_DARK, SIGNAL_FLOOR, TILE_COVERAGE } = require("../../src/lib/brand/suite-mark.tsx");
const { STUDIO_BROWSER_ICONS, STATIC_BROWSER_ICON } = require("../../src/lib/brand/browser-icons.ts");
const read = (path) => readFileSync(join(root, path));
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

// The ring and dot as redrawn on 2026-10-02 (round 2, Q24) to match the mark
// the home page draws: its indigo, a dot 41% of the ring, a ring never under
// two pixels. It replaces the seal on studio 839fd493 (anchor indigo, 36%
// dot, a one-pixel ring at 16px). Resealed deliberately, with the rendered
// sheet at content/hq/design-reviews/2026-10-02-home-page-v3/
// round2-site-icons-contact-sheet.png.
const CANONICAL_MARK_SHA256 =
  "064b4bdc31df3993de4f061c8a2b30a25128c98a8ef1a892627be9024c943801";

test("the shared renderer preserves the committed Signal artwork", () => {
  const source = read("src/lib/brand/suite-mark.tsx").toString().replace(/\r\n?/g, "\n");
  assert.equal(createHash("sha256").update(source).digest("hex"), CANONICAL_MARK_SHA256,
    "SuiteMark changed. Review the dot and ring geometry before updating the artwork seal.");
});

test("the ICO fallback contains the actual shared mark at every tab size", async () => {
  const actual = read("public/favicon.ico");
  const expected = await buildFavicon();
  assert.ok(actual.equals(expected),
    "favicon.ico differs from SuiteMark. Run pnpm brand:icons, then inspect the rendered icon.");
  assert.equal(actual.readUInt16LE(0), 0);
  assert.equal(actual.readUInt16LE(2), 1);
  assert.equal(actual.readUInt16LE(4), FAVICON_SIZES.length);

  FAVICON_SIZES.forEach((size, index) => {
    const entry = 6 + index * 16;
    assert.equal(actual[entry] || 256, size);
    assert.equal(actual[entry + 1] || 256, size);
    const length = actual.readUInt32LE(entry + 8);
    const offset = actual.readUInt32LE(entry + 12);
    const png = actual.subarray(offset, offset + length);
    assert.equal(png.length, length);
    assert.deepEqual(png.subarray(0, 8), PNG_SIGNATURE);
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
    assertTransparentMark(png);
  });
});

function assertTransparentMark(buffer) {
  const png = PNG.sync.read(buffer);
  const pixel = (x, y) => [...png.data.subarray((y * png.width + x) * 4, (y * png.width + x) * 4 + 4)];
  for (const [x, y] of [[0, 0], [png.width - 1, 0], [0, png.height - 1], [png.width - 1, png.height - 1]]) {
    assert.equal(pixel(x, y)[3], 0, "browser favicon must have no background");
  }
  const INDIGO = [104, 96, 255]; // SIGNAL_INDIGO
  assert.deepEqual(pixel(png.width / 2, png.height / 2), [...INDIGO, 255], "solid indigo centre dot");
  const isIndigo = (p) => p[3] > 240 && INDIGO.every((channel, i) => Math.abs(p[i] - channel) <= 2);
  if (png.width === 16) {
    // Pixel hinting: the ring is two whole pixels at the top of the frame
    // and the gap inside it is clear. One soft pixel was the old defect.
    assert.ok(pixel(8, 1)[3] > 200 && pixel(8, 2)[3] > 240, "the 16px ring must be two solid pixels wide");
    assert.ok(pixel(8, 4)[3] < 16, "the 16px gap between ring and dot must be clear");
  }
  if (png.width === 32) {
    assert.equal(pixel(16, 7)[3], 0, "the space between the dot and ring must be transparent");
    assert.ok(isIndigo(pixel(16, 3)), "the indigo ring must remain visible");
  }
}

function assertOpaqueTile(buffer) {
  const png = PNG.sync.read(buffer);
  for (let i = 3; i < png.data.length; i += 4) {
    if (png.data[i] !== 255) assert.fail("install tiles must have no transparent pixels: iOS fills them with black");
  }
  // Full bleed: every corner is the floor, so no rounded corner is baked in.
  for (const [x, y] of [[0, 0], [png.width - 1, 0], [0, png.height - 1], [png.width - 1, png.height - 1]]) {
    assert.deepEqual([...png.data.subarray((y * png.width + x) * 4, (y * png.width + x) * 4 + 3)], [12, 12, 13]);
  }
}

test("browser, Apple and install routes render the same suite artwork", async () => {
  for (const [file, canvas, background, coverage] of [
    ["icon.tsx", 32, "transparent", undefined],
    ["apple-icon.tsx", 180, SIGNAL_FLOOR, TILE_COVERAGE],
    ["icon2.tsx", 192, SIGNAL_FLOOR, TILE_COVERAGE],
    ["icon1.tsx", 512, SIGNAL_FLOOR, TILE_COVERAGE],
  ]) {
    const route = require(`../../src/app/${file}`);
    assert.deepEqual(route.size, { width: canvas, height: canvas });
    assert.equal(route.contentType, "image/png");
    const actual = Buffer.from(await route.default().arrayBuffer());
    const expected = new ImageResponse(createElement(SuiteMark, { canvas, background, coverage }), route.size);
    assert.ok(actual.equals(Buffer.from(await expected.arrayBuffer())), `${file} drifted from SuiteMark`);
    if (file === "icon.tsx") assertTransparentMark(actual);
    else assertOpaqueTile(actual);
  }
});

test("the SVG tab icon is the same mark, with a lighter indigo for dark tab strips", () => {
  const svg = read("public/icon.svg").toString();
  assert.ok(svg.includes(`.mark { color: ${SIGNAL_INDIGO}; }`), "icon.svg must use the mark indigo");
  assert.match(svg, /@media \(prefers-color-scheme: dark\)/);
  assert.ok(svg.includes(`.mark { color: ${SIGNAL_INDIGO_ON_DARK}; }`), "icon.svg must lighten on a dark strip");
  // 16 unit box: a 2 unit ring 14 wide, and a dot 41% of that.
  assert.match(svg, /viewBox="0 0 16 16"/);
  assert.match(svg, /r="6" fill="none" stroke="currentColor" stroke-width="2"/);
  assert.match(svg, /r="2\.87" fill="currentColor"/);
});

test("page metadata declares each icon with the sizes it really holds", () => {
  const strip = (entry) => ({ ...entry, url: entry.url.replace(/\?v=.*$/, "") });
  assert.deepEqual(STUDIO_BROWSER_ICONS.icon.map(strip), [
    // The ICO holds four frames; it used to be announced as 256x256 only.
    { url: "/favicon.ico", type: "image/x-icon", sizes: FAVICON_SIZES.map((size) => `${size}x${size}`).join(" ") },
    { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    { url: "/icon", type: "image/png", sizes: "32x32" },
  ]);
  assert.deepEqual(STUDIO_BROWSER_ICONS.apple.map(strip), [{
    url: "/apple-icon", type: "image/png", sizes: "180x180",
  }]);
  for (const entry of [...STUDIO_BROWSER_ICONS.icon, ...STUDIO_BROWSER_ICONS.apple]) {
    assert.match(entry.url, /\?v=[a-z0-9-]+$/, "every icon link carries the artwork version");
  }
  // Next adds its own, wrongly sized, link for a favicon.ico in src/app.
  assert.equal(existsSync(join(root, "src/app/favicon.ico")), false, "favicon.ico lives in public/");
  assert.match(read("src/app/layout.tsx").toString(), /icons:\s*STUDIO_BROWSER_ICONS/);
});

test("hosted static brand pages and deck mirrors use the same favicon", () => {
  const brandDir = join(root, "public/brand");
  if (!existsSync(brandDir)) return;
  assert.deepEqual(read(`public/brand/assets/${STATIC_BROWSER_ICON}`), read("public/favicon.ico"));
  const requiredPages = new Set([
    "business-loan-pack-2026.html", "market-entry-deck-2026.html", "loading-review-2026.html",
  ]);
  for (const name of readdirSync(brandDir).filter((name) => name.endsWith(".html"))) {
    const html = read(`public/brand/${name}`).toString();
    const icons = html.match(/<link\b[^>]*\brel=["'](?:shortcut )?icon["'][^>]*>/gi) ?? [];
    if (requiredPages.has(name)) assert.equal(icons.length, 1, `${name} needs one canonical favicon`);
    for (const icon of icons) {
      assert.ok(icon.includes(`href="assets/${STATIC_BROWSER_ICON}"`), `${name} overrides the suite favicon`);
    }
  }
});
