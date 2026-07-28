import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseURL =
  process.env.HANDOFF_LAB_BASE_URL ?? "http://127.0.0.1:4387";
const outputDir = path.resolve(
  process.env.HANDOFF_EVIDENCE_DIR ??
    path.join(process.cwd(), "experience", "output", "product-handoff"),
);
const videosDir = path.join(outputDir, "videos");
await mkdir(videosDir, { recursive: true });

const recordings = [
  {
    file: "living-artifact-notes-mobile.webm",
    option: "a",
    product: "notes",
    viewport: { width: 390, height: 844 },
  },
  {
    file: "living-artifact-product-walk.webm",
    option: "a",
    product: "walk",
    viewport: { width: 1440, height: 960 },
  },
  {
    file: "provenance-rail-product-walk.webm",
    option: "b",
    product: "walk",
    viewport: { width: 1440, height: 960 },
  },
  {
    file: "editorial-cause-product-walk.webm",
    option: "c",
    product: "walk",
    viewport: { width: 1440, height: 960 },
  },
];

const browser = await chromium.launch({ headless: true });
try {
  for (const recording of recordings) {
    const context = await browser.newContext({
      viewport: recording.viewport,
      colorScheme: "light",
      locale: "en-GB",
      timezoneId: "Europe/London",
      reducedMotion: "no-preference",
      recordVideo: {
        dir: videosDir,
        size: recording.viewport,
      },
    });
    const page = await context.newPage();
    const video = page.video();
    const query = new URLSearchParams({
      option: recording.option,
      product: recording.product,
      progress: "0",
      motion: "auto",
      viewport: "auto",
    });
    await page.goto(
      `${baseURL}/__design-lab/product-handoff?${query}`,
      { waitUntil: "networkidle" },
    );
    await page.getByTestId("handoff-preview").scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await page
      .locator("button")
      .filter({ hasText: "Replay" })
      .first()
      .click();
    await page.waitForTimeout(3_700);
    await context.close();
    await video?.saveAs(path.join(videosDir, recording.file));
  }
} finally {
  await browser.close();
}

console.log(
  `[product-handoff-record] ${recordings.length} motion reviews -> ${videosDir}`,
);
