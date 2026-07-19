// HQ redesign visual QA harness. Logs in through the real password gate
// (never weakens it), then captures full-page screenshots of representative
// routes at representative widths.
//
//   node scripts/hq-redesign/shot.mjs <before|after> [port]
//
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const label = process.argv[2] ?? "after";
const port = process.argv[3] ?? "3009";
const base = `http://localhost:${port}`;
const password = process.env.SIGNAL_HQ_PASSWORD || "Limerick2030";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "..", "docs", "hq-redesign", "screenshots", label);
mkdirSync(outDir, { recursive: true });

// route slug -> [widths]
const SHOTS = [
  { slug: "today", path: "/hq", widths: [1440, 390] },
  { slug: "founders-circle", path: "/hq/founders-circle", widths: [1440] },
  { slug: "crm", path: "/hq/crm", widths: [1440] },
  { slug: "reporting", path: "/hq/reporting", widths: [1440] },
  { slug: "vault", path: "/hq/vault", widths: [1440] },
  { slug: "action-center", path: "/hq/action-center", widths: [1440] },
  { slug: "experience-quality", path: "/hq/experience-quality", widths: [1440] },
  { slug: "today-tablet", path: "/hq", widths: [768] },
  { slug: "today-wide", path: "/hq", widths: [1728] },
];

const run = async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Real login: submit the password form, receive the access cookie.
  await page.goto(`${base}/hq/access`, { waitUntil: "domcontentloaded" });
  await page.fill('input[name="password"]', password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle" }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);

  for (const shot of SHOTS) {
    for (const width of shot.widths) {
      await page.setViewportSize({ width, height: 900 });
      const resp = await page.goto(`${base}${shot.path}`, { waitUntil: "networkidle" }).catch((e) => {
        console.log(`  skip ${shot.path} @${width}: ${e.message}`);
        return null;
      });
      if (!resp) continue;
      await page.waitForTimeout(600);
      const name = `${shot.slug}-${width}.png`;
      await page.screenshot({ path: join(outDir, name), fullPage: true });
      console.log(`  ${label}/${name}  (${resp.status()})`);
    }
  }

  await browser.close();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
