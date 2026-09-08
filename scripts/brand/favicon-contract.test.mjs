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
const { SuiteMark } = require("../../src/lib/brand/suite-mark.tsx");
const { STUDIO_BROWSER_ICONS, STATIC_BROWSER_ICON } = require("../../src/lib/brand/browser-icons.ts");
const read = (path) => readFileSync(join(root, path));
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

// Ethan's committed dot + broadcast-ring artwork, studio 839fd493.
// Transparency is a browser treatment; the underlying mark stays unchanged.
const CANONICAL_MARK_SHA256 =
  "4b00fa51d93e967dfda92641394e806e4a097a1047b453c064e6681520f5f14d";

test("the shared renderer preserves the committed Signal artwork", () => {
  const source = read("src/lib/brand/suite-mark.tsx").toString().replace(/\r\n?/g, "\n");
  assert.equal(createHash("sha256").update(source).digest("hex"), CANONICAL_MARK_SHA256,
    "SuiteMark changed. Review the dot and ring geometry before updating the artwork seal.");
});

test("the ICO fallback contains the actual shared mark at every tab size", async () => {
  const actual = read("src/app/favicon.ico");
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
  assert.deepEqual(pixel(png.width / 2, png.height / 2), [79, 70, 229, 255], "solid indigo center dot");
  if (png.width === 32) {
    assert.equal(pixel(16, 8)[3], 0, "the space between the dot and ring must be transparent");
    const ring = pixel(16, 5);
    assert.ok(ring[3] > 240, "the indigo broadcast ring must remain visible");
    assert.ok(Math.abs(ring[0] - 79) <= 2 && Math.abs(ring[1] - 70) <= 2 && Math.abs(ring[2] - 229) <= 2);
  }
}

test("browser, Apple and install routes render the same suite artwork", async () => {
  for (const [file, canvas, borderRadius, background] of [
    ["icon.tsx", 32, 0, "transparent"],
    ["apple-icon.tsx", 180, 36, "#ffffff"],
    ["icon1.tsx", 512, 0, "#ffffff"],
  ]) {
    const route = require(`../../src/app/${file}`);
    assert.deepEqual(route.size, { width: canvas, height: canvas });
    assert.equal(route.contentType, "image/png");
    const actual = Buffer.from(await route.default().arrayBuffer());
    const expected = new ImageResponse(createElement(SuiteMark, { canvas, borderRadius, background }), route.size);
    assert.ok(actual.equals(Buffer.from(await expected.arrayBuffer())), `${file} drifted from SuiteMark`);
    if (file === "icon.tsx") assertTransparentMark(actual);
  }
});

test("page metadata selects the transparent browser icon and keeps the Apple tile", () => {
  assert.deepEqual(STUDIO_BROWSER_ICONS.icon, [{
    url: "/icon?v=transparent-dot-ring-20260908", type: "image/png", sizes: "32x32",
  }]);
  assert.deepEqual(STUDIO_BROWSER_ICONS.apple, [{
    url: "/apple-icon", type: "image/png", sizes: "180x180",
  }]);
  assert.match(read("src/app/layout.tsx").toString(), /icons:\s*STUDIO_BROWSER_ICONS/);
});

test("hosted static brand pages and deck mirrors use the same favicon", () => {
  const brandDir = join(root, "public/brand");
  if (!existsSync(brandDir)) return;
  assert.deepEqual(read(`public/brand/assets/${STATIC_BROWSER_ICON}`), read("src/app/favicon.ico"));
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
