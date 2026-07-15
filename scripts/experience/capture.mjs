#!/usr/bin/env node
import { createHash } from "node:crypto";
import {
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
import {
  approvalProvenanceForBaseline,
  approveExistingCandidates,
  capturePlanErrors,
  manifestApprovedBy,
} from "./capture-approval.mjs";
import {
  captureAuthentication,
  signInForCapture,
} from "./capture-auth.mjs";

const ROOT = process.cwd();
const EXPERIENCE = path.join(ROOT, "experience");
const OUTPUT = path.join(EXPERIENCE, "output");
const args = new Set(process.argv.slice(2));
const approve = args.has("--approve");
const publicOnly = args.has("--public-only");
const protectedOnly = args.has("--protected-only");
const selectedBreakpoint = process.argv.find((arg) => arg.startsWith("--breakpoint="))?.split("=")[1];
const selectedExperience = process.argv.find((arg) => arg.startsWith("--experience="))?.split("=")[1];

const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const plan = readJson(path.join(EXPERIENCE, "capture-plan.json"));
const config = readJson(path.join(EXPERIENCE, "config.json"));
const registry = readJson(path.join(EXPERIENCE, "registry.json"));
const registryById = new Map(registry.experiences.map((entry) => [entry.id, entry]));

if (publicOnly && protectedOnly) {
  console.error("experience:capture: --public-only and --protected-only are mutually exclusive");
  process.exit(1);
}

const planErrors = capturePlanErrors({ plan, registry });
if (planErrors.length) {
  console.error(`experience:capture: invalid capture plan\n${planErrors.map((error) => `  x ${error}`).join("\n")}`);
  process.exit(1);
}

function hashFile(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function resolveProductUrl(item, sourceUrl) {
  const product = registryById.get(item.experienceId).product;
  const override = process.env[`EXPERIENCE_BASE_URL_${product.replaceAll("-", "_").toUpperCase()}`];
  if (!override) return sourceUrl;
  const parsed = new URL(sourceUrl);
  const route = parsed.pathname + parsed.search;
  return `${override.replace(/\/$/, "")}${route}`;
}

function resolveUrl(item) {
  if (item.authentication?.kind === "hq-password" && process.env.EXPERIENCE_HQ_URL?.trim()) {
    return process.env.EXPERIENCE_HQ_URL.trim();
  }
  return resolveProductUrl(item, item.url);
}

async function waitForRenderedAssets(page) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;

    const inViewport = (element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth;
    };
    const decodeImage = async (image) => {
      await Promise.race([
        (async () => {
          if (!image.complete) {
            await new Promise((resolve, reject) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", () => reject(new Error(`image failed to load: ${image.currentSrc || image.src}`)), { once: true });
            });
          }
          if (!image.naturalWidth) throw new Error(`image has no rendered pixels: ${image.currentSrc || image.src}`);
          if (typeof image.decode === "function") await image.decode();
        })(),
        new Promise((_, reject) => setTimeout(() => reject(new Error(`image timed out: ${image.currentSrc || image.src}`)), 10_000)),
      ]);
    };

    const posterImages = [...document.querySelectorAll("video[poster]")].filter(inViewport).map((video) => {
      const image = new Image();
      image.src = new URL(video.getAttribute("poster"), document.baseURI).href;
      return image;
    });
    await Promise.all([...document.images].filter(inViewport).concat(posterImages).map(decodeImage));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function prepareDeterministicMedia(page) {
  await page.evaluate(async () => {
    const videos = [...document.querySelectorAll("video")].filter((video) => {
      const rect = video.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.right > 0 && rect.top < innerHeight && rect.left < innerWidth;
    });
    for (const video of videos) {
      if (video.readyState === 0) {
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error("video metadata did not load")), 10_000);
          video.addEventListener("loadedmetadata", () => {
            clearTimeout(timeout);
            resolve();
          }, { once: true });
          video.addEventListener("error", () => {
            clearTimeout(timeout);
            reject(new Error("video metadata failed to load"));
          }, { once: true });
        });
      }
      video.pause();
      if (video.currentTime !== 0) video.currentTime = 0;
    }
  });
  const controlledVideos = page.locator("video[controls]");
  if ((await controlledVideos.count()) > 0) {
    await controlledVideos.first().hover({ position: { x: 8, y: 8 } });
    await page.waitForTimeout(150);
  }
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

const existingManifestFile = path.join(OUTPUT, "capture-manifest.json");
const previousResults = existsSync(existingManifestFile)
  ? JSON.parse(readFileSync(existingManifestFile, "utf8")).results ?? []
  : [];

if (approve) {
  if (!process.env.SIGNAL_EXPERIENCE_BASELINE_APPROVED_BY) {
    console.error("experience:capture: --approve requires SIGNAL_EXPERIENCE_BASELINE_APPROVED_BY");
    process.exit(1);
  }
  if (!existsSync(existingManifestFile)) {
    console.error("experience:capture: --approve requires an existing capture manifest");
    process.exit(1);
  }
  try {
    const manifest = readJson(existingManifestFile);
    const reviews = readJson(path.join(EXPERIENCE, "reviews.json"));
    const approvedManifest = approveExistingCandidates({
      experienceRoot: EXPERIENCE,
      outputRoot: OUTPUT,
      manifest,
      reviews,
      registry,
      approvedBy: process.env.SIGNAL_EXPERIENCE_BASELINE_APPROVED_BY,
      selectedExperience,
      selectedBreakpoint,
    });
    writeFileSync(existingManifestFile, `${JSON.stringify(approvedManifest, null, 2)}\n`);
    console.log(JSON.stringify(approvedManifest.summary, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(`experience:capture: approval refused: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

mkdirSync(path.join(OUTPUT, "screenshots"), { recursive: true });
mkdirSync(path.join(OUTPUT, "diffs"), { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = previousResults.filter((result) => {
  const experienceWillRun = !selectedExperience || result.experienceId === selectedExperience;
  const breakpointWillRun = !selectedBreakpoint || result.breakpoint === selectedBreakpoint;
  return !(experienceWillRun && breakpointWillRun);
});

try {
  for (const item of plan.pilotSet) {
    if (selectedExperience && item.experienceId !== selectedExperience) continue;
    if (publicOnly && item.authentication) continue;
    if (protectedOnly && !item.authentication) continue;
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
      let authentication = null;
      try {
        authentication = captureAuthentication(item);
        if (authentication) {
          await signInForCapture({
            page,
            authentication,
            signInUrl: resolveProductUrl(item, authentication.signInUrl),
          });
          consoleErrors.length = 0;
          pageErrors.length = 0;
        }
        response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
        const expectedPath = new URL(url).pathname.replace(/\/$/, "") || "/";
        const actualPath = new URL(page.url()).pathname.replace(/\/$/, "") || "/";
        if (actualPath !== expectedPath) {
          throw new Error(`unexpected final route ${actualPath}; expected ${expectedPath}`);
        }
        await page.addStyleTag({
          content: "*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition-duration:0s!important;caret-color:transparent!important}html{scroll-behavior:auto!important}video::-webkit-media-controls-timeline{visibility:hidden!important}",
        });
        await waitForRenderedAssets(page);
        await page.waitForTimeout(plan.determinism.settleMilliseconds);
        await prepareDeterministicMedia(page);
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
      const previousResult = previousResults.find(
        (result) =>
          result.experienceId === item.experienceId &&
          result.state === item.state &&
          result.breakpoint === breakpoint,
      );
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
        authentication: authentication
          ? { kind: authentication.kind, fixture: authentication.fixture, authenticated: !navigationError }
          : null,
        pass:
          !navigationError &&
          Boolean(response?.ok()) &&
          runtime.overflowPixels === 0 &&
          blockingAxe.length === 0 &&
          pageErrors.length === 0,
        ...approvalProvenanceForBaseline({ previousResult, baselineFile }),
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
  approvedBy: manifestApprovedBy(results),
  determinism: plan.determinism,
  summary: {
    captures: results.length,
    passing: results.filter((result) => result.pass).length,
    requiringReview: results.filter((result) => !result.pass).length,
    visualChanges: results.filter((result) => result.visual.state === "changed").length,
    missingBaselines: results.filter((result) => !result.baselineScreenshot).length,
  },
  results,
};
writeFileSync(path.join(OUTPUT, "capture-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify(manifest.summary, null, 2));
