import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import type {
  ExperienceAudit,
  ExperienceFinding,
  ExperienceRegistry,
  ReviewRecord,
} from "./types";

type CaptureResult = Readonly<{
  experienceId: string;
  product: string;
  state: string;
  breakpoint: string;
  viewport: { width: number; height: number };
  url: string;
  status: number | null;
  candidateScreenshot: string | null;
  baselineScreenshot: string | null;
  diffScreenshot: string | null;
  visual: { state: string; ratio: number | null };
  accessibility: { violations: number; blocking: number; ruleIds: readonly string[] };
  runtime: {
    overflowPixels: number | null;
    focusTarget: string | null;
    consoleErrors: readonly string[];
    pageErrors: readonly string[];
  };
  pass: boolean;
}>;

type CaptureManifest = Readonly<{
  capturedAt: string;
  summary: {
    captures: number;
    passing: number;
    requiringReview: number;
    visualChanges: number;
    missingBaselines: number;
  };
  results: readonly CaptureResult[];
}>;

type QualityReport = Readonly<{
  generatedAt: string;
  status: string;
  inventory: {
    experiences: number;
    stateVariants: number;
    breakpointVariants: number;
    products: Readonly<Record<string, number>>;
    experienceClasses: Readonly<Record<string, number>>;
    passing: number;
    underRemediation: number;
  };
  findings: { total: number; open: number; releaseBlocking: number; high: number; resolved: number };
  audits: { total: number; passing: number; failing: number };
  goldenSet: { status: string; count: number; approvalTask: string };
  structuralErrors: readonly string[];
}>;

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, "utf8")) as T;
}

function readOptional<T>(file: string): T | null {
  return existsSync(file) ? readJson<T>(file) : null;
}

function availableEvidencePath(base: string, file: string | null) {
  if (!file || file.includes("..") || path.isAbsolute(file)) return null;
  const resolvedBase = path.resolve(base);
  const target = path.resolve(resolvedBase, file.replaceAll("/", path.sep));
  if (!target.startsWith(`${resolvedBase}${path.sep}`) || !existsSync(target)) return null;
  return file;
}

export function loadExperienceQualityData() {
  const root = process.cwd();
  const experience = path.join(root, "experience");
  const output = path.join(experience, "output");
  const registry = readJson<ExperienceRegistry>(path.join(experience, "registry.json"));
  const findings = readJson<{ findings: ExperienceFinding[] }>(path.join(experience, "findings.json"));
  const audits = readJson<{ audits: ExperienceAudit[] }>(path.join(experience, "audits.json"));
  const reviews = readJson<{ reviews: ReviewRecord[] }>(path.join(experience, "reviews.json"));
  const capture = readOptional<CaptureManifest>(path.join(output, "capture-manifest.json"));
  return {
    registry,
    findings: findings.findings,
    audits: audits.audits,
    reviews: reviews.reviews,
    capture: capture
      ? {
          ...capture,
          results: capture.results.map((result) => ({
            ...result,
            candidateScreenshot: availableEvidencePath(output, result.candidateScreenshot),
            baselineScreenshot: availableEvidencePath(experience, result.baselineScreenshot),
            diffScreenshot: availableEvidencePath(output, result.diffScreenshot),
          })),
        }
      : null,
    report: readOptional<QualityReport>(path.join(output, "quality-report.json")),
  };
}
