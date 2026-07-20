// Capture thumbnails for labs that live off this repo/branch: other product
// dev servers and the production email lab (studio main). Writes into
// public/hq/lab-thumbs/. Run the relevant dev servers first.
//
//   node scripts/hq-redesign/lab-thumbs-external.mjs
//
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "..", "public", "hq", "lab-thumbs");
mkdirSync(outDir, { recursive: true });
const password = process.env.SIGNAL_HQ_PASSWORD || "Limerick2030";

// Each target: id + url + optional prod-HQ login + optional settle wait.
// The hero showrooms capture each lab's flagship direction at its settled frame
// (the intro plays once), so they use a longer wait than the default 1500ms.
const TARGETS = [
  { id: "showroom-notes", url: "https://notes-git-feat-notes-hero-lab-ethanmcn2013-1730s-projects.vercel.app/lab/the-notebook", wait: 6000 },
  { id: "showroom-timeline", url: "https://roadmap-git-feat-timeline-hero-lab-ethanmcn2013-1730s-projects.vercel.app/lab/the-line", wait: 6000 },
  { id: "showroom-signal", url: "https://analytics-git-feat-signal-he-e7c2cb-ethanmcn2013-1730s-projects.vercel.app/lab/the-brief", wait: 6000 },
  { id: "parked-tasks-hero", url: "http://localhost:3012/lab" },
  { id: "lab-email", url: "https://signalstudio.ie/hq/email-lab", hqLogin: "https://signalstudio.ie/hq/access" },
];

const run = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  let ok = 0;

  for (const t of TARGETS) {
    try {
      if (t.hqLogin) {
        await page.goto(t.hqLogin, { waitUntil: "domcontentloaded", timeout: 25000 });
        await page.fill('input[name="password"]', password);
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle" }).catch(() => {}),
          page.click('button[type="submit"]'),
        ]);
      }
      await page.goto(t.url, { waitUntil: "networkidle", timeout: 45000 });
      await page.waitForTimeout(t.wait ?? 1500);
      await page.screenshot({
        path: join(outDir, `${t.id}.jpg`),
        type: "jpeg",
        quality: 68,
        clip: { x: 0, y: 0, width: 1280, height: 800 },
      });
      ok += 1;
      console.log(`  ✓ ${t.id}  ${t.url}`);
    } catch (e) {
      console.log(`  ✗ ${t.id}  ${t.url}  (${e.message.split("\n")[0]})`);
    }
  }
  console.log(`\n${ok}/${TARGETS.length} external thumbnails captured.`);
  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });
