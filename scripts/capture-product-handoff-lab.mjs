import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const plan = JSON.parse(
  await readFile(
    path.join(root, "experience", "product-handoff-review-capture-plan.json"),
    "utf8",
  ),
);
const baseURL =
  process.env.HANDOFF_LAB_BASE_URL ?? "http://127.0.0.1:4387";
const outputDir = path.resolve(
  process.env.HANDOFF_EVIDENCE_DIR ??
    path.join(root, "experience", "output", "product-handoff"),
);
const framesDir = path.join(outputDir, "frames");
await mkdir(framesDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const manifest = {
  schemaVersion: "signal-product-handoff-capture-manifest/1",
  createdAt: new Date().toISOString(),
  source: baseURL,
  captures: [],
};

try {
  for (const viewport of plan.viewports) {
    const context = await browser.newContext({
      viewport,
      colorScheme: "light",
      locale: "en-GB",
      timezoneId: "Europe/London",
      reducedMotion: "no-preference",
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    for (const option of plan.directions) {
      for (const product of plan.products) {
        for (const progress of plan.progressFrames) {
          const query = new URLSearchParams({
            option,
            product,
            progress: String(progress),
            motion: "auto",
            viewport: "auto",
          });
          const response = await page.goto(
            `${baseURL}${plan.reviewPath}?${query}`,
            { waitUntil: "networkidle" },
          );
          if (!response?.ok()) {
            throw new Error(
              `Capture route failed: ${response?.status()} ${query}`,
            );
          }
          const file = `${viewport.name}-${option}-${product}-${Math.round(
            progress * 100,
          )
            .toString()
            .padStart(3, "0")}.png`;
          const target = path.join(framesDir, file);
          const preview = page.getByTestId("handoff-preview");
          await preview.screenshot({
            animations: "disabled",
            caret: "hide",
            path: target,
          });
          manifest.captures.push({
            file: path.relative(outputDir, target).replaceAll("\\", "/"),
            viewport: viewport.name,
            option,
            product,
            progress,
            motion: "auto",
          });
        }
      }
    }
    await context.close();
  }

  for (const viewport of plan.reducedMotion) {
    const context = await browser.newContext({
      viewport,
      colorScheme: "light",
      locale: "en-GB",
      timezoneId: "Europe/London",
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    for (const option of plan.directions) {
      for (const product of plan.products) {
        const query = new URLSearchParams({
          option,
          product,
          progress: "0",
          motion: "reduce",
          viewport: "auto",
        });
        const response = await page.goto(
          `${baseURL}${plan.reviewPath}?${query}`,
          { waitUntil: "networkidle" },
        );
        if (!response?.ok()) {
          throw new Error(
            `Reduced-motion capture failed: ${response?.status()} ${query}`,
          );
        }
        const file = `${viewport.name}-${option}-${product}-reduced.png`;
        const target = path.join(framesDir, file);
        await page.getByTestId("handoff-preview").screenshot({
          animations: "disabled",
          caret: "hide",
          path: target,
        });
        manifest.captures.push({
          file: path.relative(outputDir, target).replaceAll("\\", "/"),
          viewport: viewport.name,
          option,
          product,
          progress: 1,
          motion: "reduce",
        });
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(outputDir, "capture-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
  "utf8",
);
console.log(
  `[product-handoff-capture] ${manifest.captures.length} deterministic frames -> ${outputDir}`,
);
