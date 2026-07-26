/**
 * Generate deterministic Account review PDF/CSV samples into private/account-samples.
 * Uses Playwright at generation time only — not in the deployed app runtime.
 *
 *   npx tsx scripts/account/generate-samples.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { snapshotToCsv } from "../../src/lib/account/csv";
import { getVenueFixture } from "../../src/lib/account/fixtures";
import { snapshotToReportHtml } from "../../src/lib/account/pdf-html";
import {
  ACCOUNT_SAMPLE_FIXTURES,
  accountSamplePath,
  accountSamplesDir,
} from "../../src/lib/account/samples";

async function main() {
  const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
  mkdirSync(accountSamplesDir(root), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const fixture of ACCOUNT_SAMPLE_FIXTURES) {
    const snapshot = getVenueFixture(fixture);
    const csvPath = accountSamplePath(fixture, "csv", root);
    const pdfPath = accountSamplePath(fixture, "pdf", root);
    const html = snapshotToReportHtml(snapshot);

    writeFileSync(csvPath, snapshotToCsv(snapshot), "utf8");
    await page.setContent(html, { waitUntil: "load" });
    const text = await page.locator("body").innerText();
    if (!text.includes("SAMPLE · DETERMINISTIC REVIEW DATA.")) {
      throw new Error(`${fixture}: PDF source HTML missing sample mark`);
    }
    writeFileSync(`${pdfPath}.txt`, text, "utf8");
    await page.pdf({
      path: pdfPath,
      format: "A4",
      printBackground: true,
      tagged: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });
    console.log(`wrote ${fixture}.csv + ${fixture}.pdf`);
  }

  await browser.close();
  console.log(`samples → ${accountSamplesDir(root)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
