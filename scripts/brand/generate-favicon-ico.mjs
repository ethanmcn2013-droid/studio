import { existsSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { buildFavicon } from "./favicon-artifacts.mjs";

const require = createRequire(import.meta.url);
const { STATIC_BROWSER_ICON } = require("../../src/lib/brand/browser-icons.ts");

const root = new URL("../../", import.meta.url);
const icon = await buildFavicon();
writeFileSync(new URL("src/app/favicon.ico", root), icon);

// The deck publisher copies assets/ references to the static mirror hosts.
const brandAssets = new URL("public/brand/assets/", root);
if (existsSync(brandAssets)) {
  writeFileSync(new URL(STATIC_BROWSER_ICON, brandAssets), icon);
}
console.log(`Signal favicon generated: 16/32/48/256, ${icon.length} bytes.`);
