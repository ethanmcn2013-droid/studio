#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const EXPERIENCE = path.join(ROOT, "experience");
const OUTPUT = path.join(EXPERIENCE, "output");
const enforce = process.argv.includes("--enforce");
const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const registry = readJson(path.join(EXPERIENCE, "registry.json"));
const specialists = readJson(path.join(EXPERIENCE, "specialists.json"));
const captureFile = path.join(OUTPUT, "capture-manifest.json");
const capture = existsSync(captureFile) ? readJson(captureFile) : null;

function observation(result, specialist, rule, severity, dimension, evidence, recommendation) {
  return {
    id: `ux-auto-${result.experienceId.replaceAll(".", "-")}-${result.breakpoint}-${rule}`,
    experienceId: result.experienceId,
    product: result.product,
    state: result.state,
    breakpoint: result.breakpoint,
    specialist,
    rule,
    severity,
    dimension,
    evidence,
    recommendation,
    deterministic: true,
  };
}

const observations = [];
for (const result of capture?.results ?? []) {
  if (result.navigationError || result.status == null || result.status >= 400) {
    observations.push(observation(
      result,
      "implementation-fidelity",
      "route-runtime-failure",
      "release-blocking",
      "implementation-fidelity",
      [`${result.url} returned ${result.status ?? "no response"}`, result.navigationError ?? "navigation failed"],
      "Repair the route in the same deterministic environment and attach a clean re-capture.",
    ));
  }
  if (result.accessibility.blocking > 0) {
    observations.push(observation(
      result,
      "accessibility",
      "blocking-axe-violation",
      "release-blocking",
      "accessibility",
      result.accessibility.details?.flatMap((violation) =>
        violation.nodes.map((node) => `${violation.id} ${node.target.join(" ")}: ${node.failureSummary}`),
      ) ?? result.accessibility.ruleIds,
      "Resolve every serious or critical axe node; rerun keyboard and rendered contrast checks at this breakpoint.",
    ));
  }
  if ((result.runtime.overflowPixels ?? 0) > 0) {
    observations.push(observation(
      result,
      "responsive-behavior",
      "horizontal-overflow",
      "high",
      "responsive-behavior",
      [`${result.runtime.overflowPixels}px horizontal overflow at ${result.viewport.width}x${result.viewport.height}`],
      "Remove the overflowing constraint and verify content, focus rings, and fixed overlays remain in the viewport.",
    ));
  }
  if (result.runtime.pageErrors.length > 0 || result.runtime.consoleErrors.length > 0) {
    observations.push(observation(
      result,
      "implementation-fidelity",
      "runtime-errors",
      result.runtime.pageErrors.length ? "release-blocking" : "high",
      "implementation-fidelity",
      [...result.runtime.pageErrors, ...result.runtime.consoleErrors],
      "Remove the runtime error at its source; do not suppress console evidence in the capture harness.",
    ));
  }
  if ((result.runtime.navigation?.duration ?? 0) > 4000) {
    observations.push(observation(
      result,
      "performance",
      "slow-navigation",
      "medium",
      "performance-and-perceived-speed",
      [`Navigation duration ${result.runtime.navigation.duration}ms`],
      "Profile the navigation and preserve a meaningful loading state while reducing the measured duration.",
    ));
  }
}

const subjectiveReviewQueue = [...new Set((capture?.results ?? []).map((result) => result.experienceId))].map((experienceId) => ({
  experienceId,
  status: "human-review-required",
  dimensions: [
    "purpose-and-task-clarity",
    "information-architecture",
    "visual-hierarchy",
    "typography-and-content",
    "layout-and-composition",
    "brand-distinction-and-craft",
    "implementation-fidelity",
  ],
  instruction: "Review the rendered baseline and candidate. Record 0-4 scores with concrete evidence; no score is inferred from automated checks.",
}));

const coverage = {
  experiences: registry.experiences.length,
  automatedComplete: registry.experiences.filter((entry) => entry.automatedTestCoverage === "complete").length,
  screenshotsComplete: registry.experiences.filter((entry) => entry.screenshotCoverage === "complete").length,
  accessibilityComplete: registry.experiences.filter((entry) => entry.accessibilityCoverage === "complete").length,
  fixturesComplete: registry.experiences.filter((entry) => entry.fixtureCoverage === "complete").length,
};
const report = {
  schemaVersion: "signal-ux-assurance-report/1",
  generatedAt: new Date().toISOString(),
  modes: specialists.specialists,
  policy: specialists.rule,
  captureAvailable: Boolean(capture),
  coverage,
  observations,
  subjectiveReviewQueue,
  gate: {
    releaseBlocking: observations.filter((item) => item.severity === "release-blocking").length,
    high: observations.filter((item) => item.severity === "high").length,
    pass: observations.every((item) => !["release-blocking", "high"].includes(item.severity)),
  },
};
mkdirSync(OUTPUT, { recursive: true });
writeFileSync(path.join(OUTPUT, "ux-assurance-report.json"), `${JSON.stringify(report, null, 2)}\n`);
writeFileSync(
  path.join(OUTPUT, "ux-assurance-report.md"),
  [
    "# UX Assurance report",
    "",
    `Generated: ${report.generatedAt}`,
    `Gate: **${report.gate.pass ? "pass" : "review required"}**`,
    "",
    `- ${observations.length} deterministic observations`,
    `- ${report.gate.releaseBlocking} release-blocking`,
    `- ${report.gate.high} high`,
    `- ${subjectiveReviewQueue.length} experiences awaiting evidence-based human scoring`,
    "",
    "Automation emits evidence and actionable findings. It does not assign visual taste, clarity, brand, or composition scores.",
    "",
    ...observations.flatMap((item) => [
      `## ${item.id}`,
      "",
      `${item.severity} · ${item.dimension} · ${item.experienceId} · ${item.breakpoint}`,
      "",
      ...item.evidence.map((line) => `- ${line}`),
      "",
      `Recommendation: ${item.recommendation}`,
      "",
    ]),
  ].join("\n"),
);
console.log(JSON.stringify(report.gate, null, 2));
if (enforce && !report.gate.pass) process.exit(1);
