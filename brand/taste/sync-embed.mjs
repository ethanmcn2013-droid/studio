#!/usr/bin/env node
// Regenerate rater.html's ITEMS_EMBED block from items.json (so double-click works).
// Run after editing items.json: node sync-embed.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = dirname(fileURLToPath(import.meta.url));
const items = JSON.parse(readFileSync(join(DIR, "items.json"), "utf8")).items
  .map(({ id, subject, text, axes }) => ({ id, subject, text, axes }));
const embed = `const ITEMS_EMBED = {"items":[\n` +
  items.map((i) => "  " + JSON.stringify(i)).join(",\n") + `\n]};`;

const raterPath = join(DIR, "rater.html");
let html = readFileSync(raterPath, "utf8");
const re = /const ITEMS_EMBED = \{"items":\[[\s\S]*?\n\]\};/;
if (!re.test(html)) { console.error("Could not find ITEMS_EMBED block in rater.html"); process.exit(1); }
html = html.replace(re, embed);
writeFileSync(raterPath, html);
console.log(`sync-embed: rater.html now carries ${items.length} items.`);
