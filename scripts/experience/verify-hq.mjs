#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";

const baseUrl = process.env.EXPERIENCE_HQ_URL ?? "http://localhost:4320";
const password = process.env.SIGNAL_HQ_PASSWORD;
if (!password) {
  console.error("experience:verify-hq requires SIGNAL_HQ_PASSWORD for the local review server");
  process.exit(1);
}

const targets = {
  mobile: { width: 390, height: 844 },
  wide: { width: 1440, height: 960 },
};
const selectedTarget = process.env.EXPERIENCE_HQ_BREAKPOINT;
const output = path.join(process.cwd(), "experience", "output", "hq-gallery");
const registry = JSON.parse(
  readFileSync(path.join(process.cwd(), "experience", "registry.json"), "utf8"),
);
const findings = JSON.parse(
  readFileSync(path.join(process.cwd(), "experience", "findings.json"), "utf8"),
).findings;
const expectedFounderOperatorRows = registry.experiences.filter(
  (entry) => entry.experienceClass === "founder-operator",
).length;
const releaseBlockingFindingIds = new Set(
  findings
    .filter((finding) => finding.severity === "release-blocking")
    .map((finding) => finding.id),
);
const expectedReleaseBlockingRows = registry.experiences.filter((entry) =>
  entry.openFindingIds.some((findingId) => releaseBlockingFindingIds.has(findingId)),
).length;
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  for (const [name, viewport] of Object.entries(targets)) {
    if (selectedTarget && name !== selectedTarget) continue;
    const context = await browser.newContext({ viewport, locale: "en-GB", timezoneId: "Europe/London", reducedMotion: "reduce" });
    const token = createHash("sha256").update(`signal-hq-session:v1:${password}`).digest("hex");
    await context.addCookies([{ name: "signal_hq_access", value: token, url: `${baseUrl}/hq` }]);
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto(`${baseUrl}/hq/experience-quality`, { waitUntil: "domcontentloaded" });
    if (page.url().includes("/hq/access")) failures.push(`${name}: HQ access token was rejected`);
    await page.getByRole("heading", { level: 1, name: /quality system is visible/i }).waitFor();
    await page.getByText(/four customer products/i).first().waitFor();
    const rows = await page.locator('[role="row"]').count();
    const advancedFilters = await page
      .locator('select[name="archetype"], select[name="severity"], select[name="score"], select[name="state"], select[name="breakpoint"]')
      .count();
    const overflow = await page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    const blocking = axe.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));
    await page.screenshot({ path: path.join(output, `${name}-viewport.png`), fullPage: false, animations: "disabled" });
    await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true, animations: "disabled" });
    let releaseBlockingRows = null;
    let founderOperatorRows = null;
    if (name === "wide") {
      await page.goto(`${baseUrl}/hq/experience-quality?severity=release-blocking`, { waitUntil: "domcontentloaded" });
      await page.getByRole("heading", { level: 2, name: /governed surfaces/i }).waitFor();
      releaseBlockingRows = (await page.locator('[role="row"]').count()) - 1;
      if (releaseBlockingRows !== expectedReleaseBlockingRows) {
        failures.push(
          `${name}: release-blocking filter returned ${releaseBlockingRows}, expected ${expectedReleaseBlockingRows}`,
        );
      }
      await page.goto(`${baseUrl}/hq/experience-quality?experienceClass=founder-operator`, { waitUntil: "domcontentloaded" });
      await page.getByRole("heading", { level: 2, name: /governed surfaces/i }).waitFor();
      founderOperatorRows = (await page.locator('[role="row"]').count()) - 1;
      if (founderOperatorRows !== expectedFounderOperatorRows) {
        failures.push(`${name}: founder-operator filter returned ${founderOperatorRows}, expected ${expectedFounderOperatorRows}`);
      }
    }
    const result = {
      name,
      rows,
      advancedFilters,
      releaseBlockingRows,
      founderOperatorRows,
      overflow,
      blocking: blocking.map((item) => ({
        id: item.id,
        nodes: item.nodes.slice(0, 12).map((node) => ({ target: node.target, failureSummary: node.failureSummary })),
      })),
      consoleErrors,
      pageErrors,
    };
    if (rows < 200) failures.push(`${name}: expected the full registry, found ${rows} rows`);
    if (advancedFilters !== 5) failures.push(`${name}: expected five advanced evidence filters, found ${advancedFilters}`);
    if (overflow) failures.push(`${name}: ${overflow}px horizontal overflow`);
    if (blocking.length) failures.push(`${name}: blocking axe rules ${blocking.map((item) => item.id).join(", ")}`);
    if (pageErrors.length) failures.push(`${name}: page errors ${pageErrors.join("; ")}`);
    console.log(JSON.stringify(result));
    await context.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log("experience:verify-hq: pass");
