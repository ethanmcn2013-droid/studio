// Generate active thumbnails for the Decks library. Logs into HQ, then
// captures each deck's first slide into public/hq/deck-thumbs/<id>.jpg.
//
//   node scripts/hq-redesign/deck-thumbs.mjs [port]
//
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const port = process.argv[2] ?? "3009";
const base = `http://localhost:${port}`;
const password = process.env.SIGNAL_HQ_PASSWORD || "Limerick2030";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "..", "public", "hq", "deck-thumbs");
mkdirSync(outDir, { recursive: true });

const src = await readFile(join(here, "..", "..", "src", "lib", "hq", "decks.ts"), "utf8");
const decks = [];
const re = /\{\s*id:\s*"([^"]+)"[\s\S]*?\n\s*\},/g;
let m;
while ((m = re.exec(src))) {
  const block = m[0];
  const get = (k) => (block.match(new RegExp(`${k}:\\s*"([^"]*)"`)) || [])[1];
  if (!/hasThumb:\s*true/.test(block)) continue;
  decks.push({ id: m[1], href: get("href"), captureUrl: get("captureUrl"), authed: /authed:\s*true/.test(block) });
}

const run = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const page = await context.newPage();

  await page.goto(`${base}/hq/access`, { waitUntil: "domcontentloaded" });
  await page.fill('input[name="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle" }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);

  let ok = 0;
  for (const deck of decks) {
    const target = deck.captureUrl ?? deck.href;
    const url = target.startsWith("http") ? target : base + target;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(1400);
      // Internal /hq deck routes carry the shell rail; clip it out.
      const clip = deck.authed
        ? { x: 265, y: 57, width: 1015, height: 743 }
        : { x: 0, y: 0, width: 1280, height: 800 };
      await page.screenshot({ path: join(outDir, `${deck.id}.jpg`), type: "jpeg", quality: 70, clip });
      ok += 1;
      console.log(`  ✓ ${deck.id}  ${url}`);
    } catch (e) {
      console.log(`  ✗ ${deck.id}  ${url}  (${e.message.split("\n")[0]})`);
    }
  }
  console.log(`\n${ok}/${decks.length} deck thumbnails captured → public/hq/deck-thumbs/`);
  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });
