/**
 * Draws the link-preview card (1200x630) and writes it to public/share/.
 *
 *   node scripts/brand/render-share-card.mjs http://127.0.0.1:<port>
 *
 * It needs the site running, built or in dev, because the card is set in
 * the site's own Geist: the script opens a page for its fonts, replaces the
 * body with the card and takes a picture. Run it when the headline, the
 * mark or the home page's dark floor changes, look at the result, bump the
 * version in src/lib/brand/share-card.ts and in the redirects in
 * next.config.ts, and commit the new file.
 *
 * The card is the home page's dark look: its floor, the ring and dot, the
 * name, and the headline with "not" in the page's indigo.
 */
import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const base = process.argv[2];
if (!base) throw new Error("Usage: render-share-card.mjs <base url of a running site>");
const out = new URL("../../public/share/signal-studio-card-v2.png", import.meta.url);
mkdirSync(new URL("./", out), { recursive: true });

const CARD = `
<style>
  html, body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background: rgb(12 12 13) !important; }
  .card {
    position: relative; width: 1200px; height: 630px; box-sizing: border-box; overflow: hidden;
    padding: 64px 72px; display: flex; flex-direction: column; justify-content: space-between;
    background: rgb(12 12 13); color: rgb(241 241 239);
    font-family: var(--font-geist-sans), sans-serif; font-feature-settings: "ss01", "cv11";
    -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
  }
  .rings i { position: absolute; left: 1010px; top: 150px; border-radius: 50%; border: 1px solid rgba(255, 255, 255, 0.16); width: 360px; height: 360px; margin: -180px 0 0 -180px; }
  .rings i + i { border-color: rgba(255, 255, 255, 0.09); width: 620px; height: 620px; margin: -310px 0 0 -310px; }
  .rings i + i + i { border-color: rgba(255, 255, 255, 0.05); width: 900px; height: 900px; margin: -450px 0 0 -450px; }
  .rings b { position: absolute; left: 1010px; top: 150px; width: 148px; height: 148px; margin: -74px 0 0 -74px; border-radius: 50%; background: rgb(104 96 255); }
  .brand { position: relative; display: flex; align-items: center; gap: 16px; font-size: 34px; font-weight: 500; letter-spacing: -0.025em; }
  .brand svg { width: 44px; height: 44px; display: block; }
  h1 { position: relative; margin: 0; max-width: 860px; font-size: 104px; line-height: 0.96; letter-spacing: -0.052em; font-weight: 600; }
  h1 em { font-style: normal; color: rgb(125 120 255); }
  .foot { position: relative; font-size: 26px; letter-spacing: -0.01em; color: rgb(180 180 177); }
</style>
<div class="card">
  <div class="rings"><i></i><i></i><i></i><b></b></div>
  <div class="brand">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="none" stroke="rgb(104 96 255)" stroke-width="2"/><circle cx="12" cy="12" r="4.7" fill="rgb(104 96 255)"/></svg>
    signal studio
  </div>
  <div>
    <h1>Project management for people <em>not</em> in tech.</h1>
  </div>
  <div class="foot">signalstudio.ie</div>
</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`${base}/about`, { waitUntil: "networkidle" });
await page.evaluate((card) => {
  document.body.className = "";
  document.body.innerHTML = card;
}, CARD);
await page.evaluate(async () => {
  await Promise.all([500, 600].map((weight) => document.fonts.load(`${weight} 40px Geist`)));
  await document.fonts.ready;
});
const family = await page.evaluate(() => getComputedStyle(document.querySelector("h1")).fontFamily);
if (!/geist/i.test(family)) throw new Error(`The card is not set in Geist (got ${family}).`);
await page.screenshot({ path: decodeURIComponent(out.pathname).replace(/^\/([A-Za-z]:)/, "$1"), clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log("Share card written: public/share/signal-studio-card-v2.png");
