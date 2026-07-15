#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DIMENSION_BY_TYPE = {
  spacing: "layout-and-composition",
  layout: "layout-and-composition",
  color: "design-system-coherence",
  copy: "typography-and-content",
  a11y: "accessibility",
  behavior: "interaction-quality",
  other: "implementation-fidelity",
};
const SEVERITY_BY_PRIORITY = { P1: "release-blocking", P2: "high", P3: "medium" };
const STATES = new Set([
  "default", "first-use", "empty", "populated", "loading", "slow-loading",
  "partial-failure", "error", "success", "restricted", "disabled", "read-only",
  "dense", "long-content", "saved", "unsaved", "reduced-motion", "keyboard-only",
]);

function slug(value) {
  return String(value).replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
}

function canonicalBreakpoint(issue) {
  if (["mobile", "tablet", "desktop", "wide"].includes(issue.breakpoint)) return issue.breakpoint;
  if (issue.breakpoint === "wide-desktop") return "wide";
  const width = Number(issue.viewport?.w ?? issue.viewport?.width ?? 0);
  if (width < 600) return "mobile";
  if (width < 1024) return "tablet";
  if (width < 1440) return "desktop";
  return "wide";
}

function routeMatches(template, actual) {
  const pattern = template
    .split("/")
    .map((segment) => {
      if (/^\[\[\.\.\..+\]\]$/.test(segment)) return ".*";
      if (/^\[\.\.\..+\]$/.test(segment)) return ".+";
      if (/^\[.+\]$/.test(segment)) return "[^/]+";
      return segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("/");
  return new RegExp(`^${pattern}/?$`).test(actual);
}

function resolveExperienceId(issue, registry) {
  const ids = new Set(registry.experiences.map((entry) => entry.id));
  if (issue.experienceId && ids.has(issue.experienceId)) return issue.experienceId;
  let route = issue.routeGroup;
  if (!route && issue.pageUrl) {
    try { route = new URL(issue.pageUrl).pathname; } catch { route = null; }
  }
  if (!route) return null;
  const candidates = registry.experiences.filter(
    (entry) => entry.product === issue.product && entry.route && routeMatches(entry.route, route),
  );
  const page = candidates.find((entry) => entry.surfaceType === "page");
  return (page ?? candidates[0])?.id ?? null;
}

function v2Issue(issue) {
  if (issue.evidence) return issue;
  const target = issue.target ?? {};
  return {
    ...issue,
    evidence: {
      selector: target.selector ?? null,
      domPath: target.domPath ?? null,
      componentGuess: target.componentGuess ?? null,
      accessibleName: target.accessibleName ?? null,
      box: target.box ?? null,
      computedStyles: target.computed ?? {},
      annotations: {
        title: issue.title ?? "",
        comment: issue.comment ?? "",
        priority: issue.priority ?? "P2",
        type: issue.type ?? "other",
        pinKind: issue.pinKind ?? "region",
      },
      screenshot: {
        ref: issue.screenshot?.ref ?? null,
        capturedAt: issue.screenshot?.capturedAt ?? null,
      },
    },
  };
}

export function adaptSignalReview(record, registry) {
  if (!["signal-review/1", "signal-review/2"].includes(record?.schemaVersion)) {
    throw new Error("Signal Review import must use signal-review/1 or signal-review/2");
  }
  const session = record.session;
  if (!session?.id || !Array.isArray(session.issues)) throw new Error("Signal Review import requires session.id and session.issues");
  const findings = [];
  const reviews = [];
  for (const rawIssue of session.issues) {
    const issue = v2Issue(rawIssue);
    const experienceId = resolveExperienceId(issue, registry);
    if (!experienceId) throw new Error(`Cannot resolve issue ${issue.id ?? issue.number} to a registered experience`);
    const experience = registry.experiences.find((entry) => entry.id === experienceId);
    const breakpoint = canonicalBreakpoint(issue);
    const state = STATES.has(issue.state) ? issue.state : "default";
    const findingId = `dq-review-${slug(session.id)}-${String(issue.number ?? findings.length + 1).padStart(2, "0")}`;
    const comment = issue.evidence.annotations?.comment || issue.comment || "Review issue";
    const selector = issue.evidence.selector || issue.evidence.domPath || "region annotation";
    const createdAt = String(issue.createdAt ?? session.createdAt ?? new Date().toISOString()).slice(0, 10);
    findings.push({
      id: findingId,
      experienceId,
      product: experience.product,
      surface: issue.pageUrl || issue.routeGroup || experience.route || experience.trigger,
      state,
      breakpoint,
      dimension: DIMENSION_BY_TYPE[issue.type] ?? "implementation-fidelity",
      severity: SEVERITY_BY_PRIORITY[issue.priority] ?? "medium",
      evidence: [
        `Signal Review ${session.id}, issue ${issue.number ?? findings.length + 1}`,
        `${selector}: ${comment}`,
        ...(issue.evidence.screenshot?.ref ? [`Screenshot ${issue.evidence.screenshot.ref}`] : []),
      ],
      violatedStandard: `docs/experience/SIGNAL_EXPERIENCE_STANDARD.md#${DIMENSION_BY_TYPE[issue.type] ?? "implementation-fidelity"}`,
      impact: issue.interpretation || comment,
      recommendation: issue.fixPrompt || `Resolve the annotated ${issue.type ?? "implementation"} issue and attach rendered verification.`,
      scope: "local",
      confidence: 0.95,
      owner: experience.engineeringOwner,
      status: "open",
      resolutionEvidence: [],
      source: "human-review",
      createdAt,
      resolvedAt: null,
    });
    reviews.push({
      schemaVersion: "signal-review/2",
      id: `review-${slug(session.id)}-${String(issue.number ?? reviews.length + 1).padStart(2, "0")}`,
      experienceId,
      product: experience.product,
      routeOrTrigger: issue.pageUrl || issue.routeGroup || experience.route || experience.trigger,
      state,
      breakpoint,
      baselineScreenshot: null,
      candidateScreenshot: issue.evidence.screenshot?.ref ?? null,
      diffScreenshot: null,
      scoreBefore: null,
      scoreAfter: null,
      findingIds: [findingId],
      annotations: [comment],
      severity: SEVERITY_BY_PRIORITY[issue.priority] ?? "medium",
      owner: experience.designOwner,
      approvalHistory: [{ status: "captured", actor: "signal-review", at: issue.createdAt ?? session.createdAt, note: comment }],
      resolutionEvidence: [],
      status: "captured",
      designSystemReferences: ["docs/experience/SIGNAL_EXPERIENCE_STANDARD.md"],
      codeReferences: [experience.source, ...(issue.evidence.componentGuess ? [issue.evidence.componentGuess] : [])],
      changeReferences: [],
    });
  }
  return { findings, reviews };
}

export function mergeSignalReview({ adapted, findingsCollection, reviewsCollection, overrides }) {
  const existingFindingIds = new Set(findingsCollection.findings.map((item) => item.id));
  const existingReviewIds = new Set(reviewsCollection.reviews.map((item) => item.id));
  for (const finding of adapted.findings) {
    if (existingFindingIds.has(finding.id)) throw new Error(`Finding ${finding.id} already exists`);
    findingsCollection.findings.push(finding);
    const current = overrides.experiences[finding.experienceId] ?? {};
    overrides.experiences[finding.experienceId] = {
      ...current,
      auditStatus: "under-remediation",
      openFindingIds: [...new Set([...(current.openFindingIds ?? []), finding.id])],
    };
  }
  for (const review of adapted.reviews) {
    if (existingReviewIds.has(review.id)) throw new Error(`Review ${review.id} already exists`);
    reviewsCollection.reviews.push(review);
  }
  return { findingsCollection, reviewsCollection, overrides };
}

async function main() {
  const source = process.argv.find((argument) => !argument.startsWith("--") && argument !== process.argv[1]);
  if (!source) throw new Error("Usage: node scripts/experience/adapters/signal-review.mjs <export.json> [--write]");
  const root = process.cwd();
  const experience = path.join(root, "experience");
  const record = JSON.parse(readFileSync(path.resolve(source), "utf8"));
  const registry = JSON.parse(readFileSync(path.join(experience, "registry.json"), "utf8"));
  const adapted = adaptSignalReview(record, registry);
  if (!process.argv.includes("--write")) {
    console.log(JSON.stringify(adapted, null, 2));
    return;
  }
  const findingsFile = path.join(experience, "findings.json");
  const reviewsFile = path.join(experience, "reviews.json");
  const overridesFile = path.join(experience, "overrides.json");
  const merged = mergeSignalReview({
    adapted,
    findingsCollection: JSON.parse(readFileSync(findingsFile, "utf8")),
    reviewsCollection: JSON.parse(readFileSync(reviewsFile, "utf8")),
    overrides: JSON.parse(readFileSync(overridesFile, "utf8")),
  });
  writeFileSync(findingsFile, `${JSON.stringify(merged.findingsCollection, null, 2)}\n`);
  writeFileSync(reviewsFile, `${JSON.stringify(merged.reviewsCollection, null, 2)}\n`);
  writeFileSync(overridesFile, `${JSON.stringify(merged.overrides, null, 2)}\n`);
  console.log(`Imported ${adapted.findings.length} Signal Review finding(s). Run experience:discover -- --write, then validate.`);
}

if (pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
