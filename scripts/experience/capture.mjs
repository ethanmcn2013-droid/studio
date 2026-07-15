#!/usr/bin/env node
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { chromium } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const ROOT = process.cwd();
const EXPERIENCE = path.join(ROOT, "experience");
const OUTPUT = path.join(EXPERIENCE, "output");
const args = new Set(process.argv.slice(2));
const approve = args.has("--approve");
const selectedBreakpoint = process.argv.find((arg) => arg.startsWith("--breakpoint="))?.split("=")[1];
const selectedExperience = process.argv.find((arg) => arg.startsWith("--experience="))?.split("=")[1];

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const plan = readJson(path.join(EXPERIENCE, "capture-plan.json"));
const config = readJson(path.join(EXPERIENCE, "config.json"));
const registry = readJson(path.join(EXPERIENCE, "registry.json"));
const registryById = new Map(registry.experiences.map((entry) => [entry.id, entry]));

if (approve && !process.env.SIGNAL_EXPERIENCE_BASELINE_APPROVED_BY) {
  console.error("experience:capture: --approve requires SIGNAL_EXPERIENCE_BASELINE_APPROVED_BY");
  process.exit(1);
}

for (const item of plan.pilotSet) {
  if (!registryById.has(item.experienceId)) {
    console.error(`experience:capture: unknown experience ${item.experienceId}`);
    process.exit(1);
  }
}

function hashFile(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function resolveUrl(item) {
  const product = registryById.get(item.experienceId).product;
  const override = process.env[`EXPERIENCE_BASE_URL_${product.replaceAll("-", "_").toUpperCase()}`];
  if (!override) return item.url;
  const route = new URL(item.url).pathname + new URL(item.url).search;
  return `${override.replace(/\/$/, "")}${route}`;
}

function comparePng(candidateFile, baselineFile, diffFile) {
  if (!existsSync(baselineFile)) return { state: "missing", changedPixels: null, ratio: null };
  const candidate = PNG.sync.read(readFileSync(candidateFile));
  const baseline = PNG.sync.read(readFileSync(baselineFile));
  if (candidate.width !== baseline.width || candidate.height !== baseline.height) {
    return { state: "changed", changedPixels: candidate.width * candidate.height, ratio: 1, reason: "dimensions" };
  }
  const diff = new PNG({ width: candidate.width, height: candidate.height });
  const changedPixels = pixelmatch(
    baseline.data,
    candidate.data,
    diff.data,
    candidate.width,
    candidate.height,
    { threshold: 0.1, includeAA: false },
  );
  const ratio = changedPixels / (candidate.width * candidate.height);
  if (changedPixels > 0) {
    mkdirSync(path.dirname(diffFile), { recursive: true });
    writeFileSync(diffFile, PNG.sync.write(diff));
  }
  return { state: changedPixels === 0 ? "unchanged" : "changed", changedPixels, ratio };
}

mkdirSync(path.join(OUTPUT, "screenshots"), { recursive: true });
mkdirSync(path.join(OUTPUT, "diffs"), { recursive: true });
const browser = await chromium.launch({ headless: true });
const existingManifestFile = path.join(OUTPUT, "capture-manifest.json");
const previousResults = existsSync(existingManifestFile)
  ? JSON.parse(readFileSync(existingManifestFile, "utf8")).results ?? []
  : [];
const results = previousResults.filter((result) => {
  const experienceWillRun = !selectedExperience || result.experienceId === selectedExperience;
  const breakpointWillRun = !selectedBreakpoint || result.breakpoint === selectedBreakpoint;
  return !(experienceWillRun && breakpointWillRun);
});

try {
  for (const item of plan.pilotSet) {
    if (selectedExperience && item.experienceId !== selectedExperience) continue;
    for (const [breakpoint, viewport] of Object.entries(config.breakpoints)) {
      if (selectedBreakpoint && breakpoint !== selectedBreakpoint) continue;
      const context = await browser.newContext({
        viewport,
        locale: plan.determinism.locale,
        timezoneId: plan.determinism.timezoneId,
        colorScheme: plan.determinism.colorScheme,
        reducedMotion: plan.determinism.reducedMotion,
        serviceWorkers: "block",
      });
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));
      const url = resolveUrl(item);
      let response = null;
      let navigationError = null;
      try {
        response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
        await page.addStyleTag({
          content: "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;caret-color:transparent!important}html{scroll-behavior:auto!important}",
        });
        await page.waitForTimeout(plan.determinism.settleMilliseconds);
      } catch (error) {
        navigationError = error instanceof Error ? error.message : String(error);
      }

      const safeId = item.experienceId.replaceAll(".", "-");
      const candidateRelative = `screenshots/${safeId}/${item.state}/${breakpoint}.png`;
      const baselineRelative = `baselines/${safeId}/${item.state}/${breakpoint}.png`;
      const diffRelative = `diffs/${safeId}/${item.state}/${breakpoint}.png`;
      const candidateFile = path.join(OUTPUT, candidateRelative);
      const baselineFile = path.join(EXPERIENCE, baselineRelative);
      const diffFile = path.join(OUTPUT, diffRelative);
      mkdirSync(path.dirname(candidateFile), { recursive: true });
      if (!navigationError) {
        await page.screenshot({ path: candidateFile, animations: "disabled", fullPage: false });
      }

      let axe = { violations: [] };
      let runtime = { overflowPixels: null, focusTarget: null, navigation: null };
      if (!navigationError) {
        axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
        await page.keyboard.press("Tab");
        runtime = await page.evaluate(() => {
          const root = document.documentElement;
          const active = document.activeElement;
          const nav = performance.getEntriesByType("navigation")[0];
          return {
            overflowPixels: Math.max(0, root.scrollWidth - root.clientWidth),
            focusTarget: active
              ? `${active.tagName.toLowerCase()}${active.id ? `#${active.id}` : ""}${active.getAttribute("aria-label") ? `[aria-label=\"${active.getAttribute("aria-label")}\"]` : ""}`
              : null,
            navigation: nav
              ? { duration: Math.round(nav.duration), domContentLoaded: Math.round(nav.domContentLoadedEventEnd) }
              : null,
          };
        });
      }

      const visual = navigationError
        ? { state: "not-captured", changedPixels: null, ratio: null }
        : comparePng(candidateFile, baselineFile, diffFile);
      if (approve && !navigationError) {
        mkdirSync(path.dirname(baselineFile), { recursive: true });
        copyFileSync(candidateFile, baselineFile);
        visual.state = "approved";
      }

      const blockingAxe = axe.violations.filter((violation) =>
        ["serious", "critical"].includes(violation.impact ?? ""),
      );
      results.push({
        experienceId: item.experienceId,
        product: registryById.get(item.experienceId).product,
        state: item.state,
        breakpoint,
        viewport,
        url,
        status: response?.status() ?? null,
        navigationError,
        candidateScreenshot: navigationError ? null : candidateRelative,
        baselineScreenshot: existsSync(baselineFile) ? baselineRelative : null,
        diffScreenshot: existsSync(diffFile) ? diffRelative : null,
        candidateHash: navigationError ? null : hashFile(candidateFile),
        visual,
        accessibility: {
          violations: axe.violations.length,
          blocking: blockingAxe.length,
          ruleIds: axe.violations.map((violation) => violation.id),
          details: axe.violations.map((violation) => ({
            id: violation.id,
            impact: violation.impact,
            help: violation.help,
            nodes: violation.nodes.slice(0, 8).map((node) => ({
              target: node.target,
              failureSummary: node.failureSummary,
            })),
          })),
        },
        runtime: { ...runtime, consoleErrors, pageErrors },
        pass:
          !navigationError &&
          Boolean(response?.ok()) &&
          runtime.overflowPixels === 0 &&
          blockingAxe.length === 0 &&
          pageErrors.length === 0,
      });
      await context.close();
      process.stdout.write(`${item.experienceId} ${breakpoint}: ${results.at(-1).pass ? "pass" : "review"}\n`);
    }
  }
} finally {
  await browser.close();
}

const manifest = {
  schemaVersion: "signal-experience-capture/1",
  capturedAt: new Date().toISOString(),
  approvedBy: approve ? process.env.SIGNAL_EXPERIENCE_BASELINE_APPROVED_BY : null,
  determinism: plan.determinism,
  summary: {
    captures: results.length,
    passing: results.filter((result) => result.pass).length,
    requiringReview: results.filter((result) => !result.pass).length,
    visualChanges: results.filter((result) => result.visual.state === "changed").length,
    missingBaselines: results.filter((result) => result.visual.state === "missing").length,
  },
  results,
};
writeFileSync(path.join(OUTPUT, "capture-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest.summary, null, 2));
