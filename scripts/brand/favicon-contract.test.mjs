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
const { SuiteMark, SIGNAL_INDIGO, SIGNAL_INDIGO_ON_DARK, SIGNAL_TILE, TILE_COVERAGE } = require("../../src/lib/brand/suite-mark.tsx");
const { STUDIO_BROWSER_ICONS, STATIC_BROWSER_ICON, BROWSER_ICON_VERSION } = require("../../src/lib/brand/browser-icons.ts");
const read = (path) => readFileSync(join(root, path));
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

// The ring and dot as redrawn on 2026-10-02 (round 2, Q24) to match the mark
// the home page draws: its indigo, a dot 41% of the ring, a ring never under
// two pixels. It replaces the seal on studio 839fd493 (anchor indigo, 36%
// dot, a one-pixel ring at 16px). Resealed deliberately, with the rendered
// sheet at content/hq/design-reviews/2026-10-02-home-page-v3/
// round2-site-icons-contact-sheet.png.
//
// Resealed 2026-10-05 on the founder's instruction that no icon has a black
// background: "it should have no background, like it's floating". The ring
// and dot geometry is unchanged. The dark install tile (SIGNAL_FLOOR) is
// gone; the two icons that cannot float sit on white (SIGNAL_TILE). Sheet:
// content/hq/design-reviews/2026-10-02-home-page-v3/
// favicon-floating-contact-sheet.png.
const CANONICAL_MARK_SHA256 =
  "cecf345ce2289a7ca24919d3705eec1fe018085f7dd2cb23217c1d74874d4983";

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
    assertTransparentMark(png, `favicon.ico ${size}px frame`);
  });
});

const INDIGO = [104, 96, 255]; // SIGNAL_INDIGO
const WHITE = [255, 255, 255]; // SIGNAL_TILE
const corners = (png) => [[0, 0], [png.width - 1, 0], [0, png.height - 1], [png.width - 1, png.height - 1]];
const pixelAt = (png, x, y) => [...png.data.subarray((y * png.width + x) * 4, (y * png.width + x) * 4 + 4)];

/**
 * The rule the founder set on 2026-10-05: no icon, anywhere, has a dark
 * background. Every pixel that is drawn at all is the indigo mark, the white
 * tile or the soft edge between them; all three keep blue at full strength.
 * A black or dark tile, a dark corner or a dark fringe fails here.
 */
function assertNoDarkPixels(png, label) {
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] < 8) continue;
    if (png.data[i + 2] < 200) {
      const at = i / 4;
      assert.fail(`${label} has a dark pixel at ${at % png.width},${Math.floor(at / png.width)}: rgba(${[...png.data.subarray(i, i + 4)]}). No icon may have a dark background.`);
    }
  }
}

/** A floating icon: the mark and nothing else. Clear outside the ring and between ring and dot. */
function assertTransparentMark(buffer, label = "browser favicon") {
  const png = PNG.sync.read(buffer);
  const pixel = (x, y) => pixelAt(png, x, y);
  for (const [x, y] of corners(png)) {
    assert.equal(pixel(x, y)[3], 0, `${label} must have no background`);
  }
  // The whole outer edge is clear, not only the four corners.
  for (let n = 0; n < png.width; n += 1) {
    for (const [x, y] of [[n, 0], [n, png.height - 1], [0, n], [png.width - 1, n]]) {
      assert.equal(pixel(x, y)[3], 0, `${label} must be clear along its edge`);
    }
  }
  assertNoDarkPixels(png, label);
  assert.deepEqual(pixel(png.width / 2, png.height / 2), [...INDIGO, 255], "solid indigo centre dot");
  const isIndigo = (p) => p[3] > 240 && INDIGO.every((channel, i) => Math.abs(p[i] - channel) <= 2);
  // Nothing but the mark is drawn: every solid pixel is the indigo.
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] > 240) assert.ok(isIndigo([...png.data.subarray(i, i + 4)]), `${label} draws something other than the mark`);
  }
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

/**
 * The two icons that cannot float (Apple touch, maskable): the mark on
 * white. Opaque, because iOS fills transparent pixels with black; white to
 * every edge, so no corner is baked in; and white everywhere outside the
 * maskable safe zone, so a launcher's mask clips the field and never the mark.
 */
function assertWhiteTile(buffer, label) {
  const png = PNG.sync.read(buffer);
  for (let i = 3; i < png.data.length; i += 4) {
    if (png.data[i] !== 255) assert.fail(`${label} must have no transparent pixels: iOS fills them with black`);
  }
  for (const [x, y] of corners(png)) {
    assert.deepEqual(pixelAt(png, x, y).slice(0, 3), WHITE, `${label} must be white to its corners`);
  }
  assertNoDarkPixels(png, label);
  const centre = (png.width - 1) / 2;
  const safe = png.width * 0.4;
  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      if (Math.hypot(x - centre, y - centre) <= safe) continue;
      const [r, g, b] = pixelAt(png, x, y);
      if (r !== 255 || g !== 255 || b !== 255) assert.fail(`${label} draws outside the maskable safe zone at ${x},${y}`);
    }
  }
  assert.deepEqual(pixelAt(png, png.width / 2, png.height / 2), [...INDIGO, 255], `${label} carries the indigo dot`);
}

const ICON_ROUTES = [
  // file, canvas, background, coverage
  ["icon.tsx", 32, "transparent", undefined],
  ["icon2.tsx", 192, "transparent", undefined],
  ["icon1.tsx", 512, "transparent", undefined],
  ["apple-icon.tsx", 180, SIGNAL_TILE, TILE_COVERAGE],
  ["icon4.tsx", 192, SIGNAL_TILE, TILE_COVERAGE],
  ["icon3.tsx", 512, SIGNAL_TILE, TILE_COVERAGE],
];
const renderRoute = async (file) => Buffer.from(await require(`../../src/app/${file}`).default().arrayBuffer());

test("every icon route is the suite artwork: floating, or on white where it cannot float", async () => {
  assert.equal(SIGNAL_TILE, "rgb(255, 255, 255)", "the only tile colour is white");
  // Every icon route in src/app is listed above, so a new one cannot skip the rule.
  const served = readdirSync(join(root, "src/app")).filter((name) => /^(apple-)?icon\d?\.tsx$/.test(name)).sort();
  assert.deepEqual(served, ICON_ROUTES.map(([file]) => file).sort());

  for (const [file, canvas, background, coverage] of ICON_ROUTES) {
    const route = require(`../../src/app/${file}`);
    assert.deepEqual(route.size, { width: canvas, height: canvas });
    assert.equal(route.contentType, "image/png");
    const actual = await renderRoute(file);
    const expected = new ImageResponse(createElement(SuiteMark, { canvas, background, coverage }), route.size);
    assert.ok(actual.equals(Buffer.from(await expected.arrayBuffer())), `${file} drifted from SuiteMark`);
    if (background === "transparent") assertTransparentMark(actual, file);
    else assertWhiteTile(actual, file);
  }
});

test("the manifest offers the floating mark, a white maskable tile and a white splash", async () => {
  const manifest = require("../../src/app/manifest.ts").default();
  assert.deepEqual(manifest.icons, [
    { src: "/icon2", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/icon4", sizes: "192x192", type: "image/png", purpose: "maskable" },
    { src: "/icon1", sizes: "512x512", type: "image/png", purpose: "any" },
    { src: "/icon3", sizes: "512x512", type: "image/png", purpose: "maskable" },
  ]);
  for (const icon of manifest.icons) {
    const buffer = await renderRoute(`${icon.src.slice(1)}.tsx`);
    const { width, height } = PNG.sync.read(buffer);
    assert.equal(`${width}x${height}`, icon.sizes);
    // "any" is drawn as given, so it floats. "maskable" is cut to a shape, so it is filled.
    if (icon.purpose === "any") assertTransparentMark(buffer, `manifest ${icon.src}`);
    else assertWhiteTile(buffer, `manifest ${icon.src}`);
  }
  assert.equal(manifest.background_color, "rgb(255, 255, 255)", "the install splash is white, never dark");
  assert.equal(manifest.theme_color, "rgb(255, 255, 255)");
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
  // No background: two circles and nothing else, and no colour but the two indigos.
  assert.equal((svg.match(/<(rect|path|polygon|ellipse|image|use)\b/g) ?? []).length, 0, "icon.svg must draw only the ring and dot");
  assert.equal((svg.match(/<circle\b/g) ?? []).length, 2);
  assert.doesNotMatch(svg, /background/i);
  assert.deepEqual([...new Set(svg.match(/#[0-9a-f]{3,8}\b/gi))].sort(), [SIGNAL_INDIGO, SIGNAL_INDIGO_ON_DARK].sort());
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
  // Bumped with the 2026-10-05 change so no browser keeps a cached dark tile.
  assert.equal(BROWSER_ICON_VERSION, "floating-20261005");
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
