// Generate active thumbnails for the Make gallery. Logs into HQ once, then
// captures each lab's real surface (internal rooms, brand galleries, and the
// public product homepages) into public/hq/lab-thumbs/<id>.jpg.
//
//   node scripts/hq-redesign/lab-thumbs.mjs [port]
//
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const port = process.argv[2] ?? "3009";
const base = `http://localhost:${port}`;
const password = process.env.SIGNAL_HQ_PASSWORD || "Limerick2030";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "..", "public", "hq", "lab-thumbs");
mkdirSync(outDir, { recursive: true });

// Load the registry (TS) shape by importing the compiled list via a tiny inline
// mirror — we only need id + capture target + authed, so read from the source.
const modUrl = pathToFileURL(join(here, "..", "..", "src", "lib", "hq", "make-labs.ts")).href;
const src = await (await import("node:fs/promises")).readFile(fileURLToPath(modUrl), "utf8");

// Minimal parse: pull each { id, ... href, captureUrl, authed, hasThumb } block.
const labs = [];
const re = /\{\s*id:\s*"([^"]+)"[\s\S]*?\n\s*\},/g;
let m;
while ((m = re.exec(src))) {
  const block = m[0];
  const get = (k) => {
    const mm = block.match(new RegExp(`${k}:\\s*"([^"]*)"`));
    return mm ? mm[1] : undefined;
  };
  const bool = (k) => new RegExp(`${k}:\\s*true`).test(block);
  const hasThumb = bool("hasThumb");
  if (!hasThumb) continue;
  // External thumbs (other repos / production) are captured by lab-thumbs-external.mjs.
  if (/thumbSource:\s*"external"/.test(block)) continue;
  labs.push({
    id: m[1],
    href: get("href"),
    captureUrl: get("captureUrl"),
    authed: bool("authed"),
    external: bool("external"),
  });
}

const run = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const page = await context.newPage();

  // Log into HQ once so internal /hq rooms render (cookie is on this context).
  await page.goto(`${base}/hq/access`, { waitUntil: "domcontentloaded" });
  await page.fill('input[name="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle" }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);

  let ok = 0;
  for (const lab of labs) {
    const target = lab.captureUrl ?? lab.href;
    const url = target.startsWith("http") ? target : base + target;
    try {
      await page.goto(url, { waitUntil: lab.external ? "load" : "networkidle", timeout: 25000 });
      await page.waitForTimeout(lab.external ? 1800 : 900);
      // Internal /hq rooms carry the shell rail + topbar; clip it out so the
      // thumbnail shows pure room content, not repeated chrome.
      const clip = lab.authed
        ? { x: 265, y: 57, width: 1015, height: 743 }
        : { x: 0, y: 0, width: 1280, height: 800 };
      await page.screenshot({ path: join(outDir, `${lab.id}.jpg`), type: "jpeg", quality: 68, clip });
      ok += 1;
      console.log(`  ✓ ${lab.id}  ${url}`);
    } catch (e) {
      console.log(`  ✗ ${lab.id}  ${url}  (${e.message.split("\n")[0]})`);
    }
  }
  console.log(`\n${ok}/${labs.length} thumbnails captured → public/hq/lab-thumbs/`);
  await browser.close();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
