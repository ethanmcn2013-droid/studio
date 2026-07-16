#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { AUDIT_DIMENSIONS, EXPERIENCE_CLASSES, registryMetrics } from "./lib.mjs";
import { evaluateAuditProof } from "./gate.mjs";
import { approvedGoldenSetEvidenceErrors } from "./founder-evidence.mjs";

const ROOT = process.cwd();
const EXPERIENCE = path.join(ROOT, "experience");
const OUTPUT = path.join(EXPERIENCE, "output");
const enforce = process.argv.includes("--enforce");
const enforceCapture = process.env.EXPERIENCE_ENFORCE_CAPTURE === "1";
const readJson = (name) => JSON.parse(readFileSync(path.join(EXPERIENCE, name), "utf8"));
const registry = readJson("registry.json");
const findings = readJson("findings.json");
const audits = readJson("audits.json");
const exceptions = readJson("exceptions.json");
const reviews = readJson("reviews.json");
const taxonomy = readJson("taxonomy.json");
const golden = readJson("golden-set.json");
const baseline = readJson("baseline.json");
const overrides = readJson("overrides.json");
const specialists = readJson("specialists.json");
const conformance = readJson("conformance.json");
const captureFile = path.join(OUTPUT, "capture-manifest.json");
const capture = existsSync(captureFile) ? JSON.parse(readFileSync(captureFile, "utf8")) : null;

const errors = [];
errors.push(...approvedGoldenSetEvidenceErrors({
  repoRoot: ROOT,
  experienceRoot: EXPERIENCE,
  outputRoot: OUTPUT,
  goldenSet: golden,
  manifest: capture,
  registry,
  reviewsCollection: reviews,
  auditsCollection: audits,
  findingsCollection: findings,
}));
const ids = new Set(registry.experiences.map((entry) => entry.id));
const findingIds = new Set();
const today = new Date().toISOString().slice(0, 10);

const conformanceIds = new Set();
for (const repository of conformance.repositories) {
  if (conformanceIds.has(repository.id)) errors.push(`duplicate conformance repository ${repository.id}`);
  conformanceIds.add(repository.id);
  if (repository.applicable && repository.status === "not-applicable") {
    errors.push(`${repository.id}: applicable conformance repository cannot be not-applicable`);
  }
  if (!repository.evidence?.length) errors.push(`${repository.id}: conformance evidence is required`);
}

for (const id of Object.keys(overrides.experiences ?? {})) {
  if (!ids.has(id)) errors.push(`override references unknown experience ${id}`);
}
for (const item of taxonomy.archetypes) {
  for (const id of item.representatives) if (!ids.has(id)) errors.push(`taxonomy ${item.id} references unknown ${id}`);
}
const taxonomyClassIds = new Set((taxonomy.experienceClasses ?? []).map((item) => item.id));
for (const experienceClass of EXPERIENCE_CLASSES) {
  if (!taxonomyClassIds.has(experienceClass)) errors.push(`taxonomy is missing experience class ${experienceClass}`);
}
for (const item of taxonomy.experienceClasses ?? []) {
  if (!EXPERIENCE_CLASSES.includes(item.id)) errors.push(`taxonomy has unknown experience class ${item.id}`);
  if (!item.scope || !item.audience) errors.push(`taxonomy experience class ${item.id} requires scope and audience`);
}
for (const id of golden.experienceIds) if (!ids.has(id)) errors.push(`golden set references unknown ${id}`);

for (const finding of findings.findings) {
  if (findingIds.has(finding.id)) errors.push(`duplicate finding ${finding.id}`);
  findingIds.add(finding.id);
  if (!ids.has(finding.experienceId)) errors.push(`${finding.id}: unknown experience ${finding.experienceId}`);
  if (!AUDIT_DIMENSIONS.includes(finding.dimension)) errors.push(`${finding.id}: unknown dimension ${finding.dimension}`);
  if (!Array.isArray(finding.evidence) || !finding.evidence.length) errors.push(`${finding.id}: evidence is required`);
  if (finding.confidence < 0 || finding.confidence > 1) errors.push(`${finding.id}: confidence must be 0..1`);
  if (finding.status === "resolved" && !finding.resolutionEvidence?.length) errors.push(`${finding.id}: resolution evidence is required`);
  if (finding.status !== "resolved" && finding.resolvedAt) errors.push(`${finding.id}: unresolved finding has resolvedAt`);
}

const auditProof = evaluateAuditProof({
  registry,
  audits: audits.audits,
  findings: findings.findings,
  exceptions: exceptions.exceptions,
  asOf: today,
  root: ROOT,
});
errors.push(...auditProof.errors);

for (const entry of registry.experiences) {
  for (const findingId of entry.openFindingIds ?? []) {
    const finding = findings.findings.find((candidate) => candidate.id === findingId);
    if (!finding) errors.push(`${entry.id}: unknown open finding ${findingId}`);
    else if (finding.experienceId !== entry.id) errors.push(`${entry.id}: finding ${findingId} belongs to ${finding.experienceId}`);
    else if (finding.status === "resolved") errors.push(`${entry.id}: resolved finding ${findingId} remains open`);
  }
}
for (const finding of findings.findings.filter((item) => item.status !== "resolved")) {
  const entry = registry.experiences.find((candidate) => candidate.id === finding.experienceId);
  if (entry && !entry.openFindingIds.includes(finding.id)) errors.push(`${finding.id}: open finding missing from registry entry`);
}

for (const review of reviews.reviews) {
  if (review.schemaVersion !== "signal-review/2") errors.push(`${review.id}: unsupported review schema`);
  if (!ids.has(review.experienceId)) errors.push(`${review.id}: unknown experience ${review.experienceId}`);
  for (const findingId of review.findingIds) if (!findingIds.has(findingId)) errors.push(`${review.id}: unknown finding ${findingId}`);
}

const specialistDimensions = new Set(specialists.specialists.flatMap((specialist) => specialist.dimensions));
for (const dimension of AUDIT_DIMENSIONS) if (!specialistDimensions.has(dimension)) errors.push(`no specialist owns ${dimension}`);

const open = auditProof.openFindings;
const baselineIds = new Set(baseline.allowedOpenFindingIds);
const unbaselinedHighRisk = open.filter(
  (finding) => ["release-blocking", "high"].includes(finding.severity) && !baselineIds.has(finding.id),
);
const staleBaseline = baseline.allowedOpenFindingIds.filter((id) => !findingIds.has(id));
if (staleBaseline.length) errors.push(`baseline references missing findings: ${staleBaseline.join(", ")}`);

const captureRegressions = (capture?.results ?? []).filter(
  (result) =>
    !result.pass ||
    (result.visual.state === "changed" &&
      !reviews.reviews.some(
        (review) =>
          review.experienceId === result.experienceId &&
          review.breakpoint === result.breakpoint &&
          ["approved", "resolved"].includes(review.status),
      )),
);

const captureResults = capture?.results ?? [];
const capturedStateVariants = new Set(
  captureResults.map((result) => `${result.experienceId}:${result.state}`),
).size;
const capturedBreakpointVariants = new Set(
  captureResults.map((result) => `${result.experienceId}:${result.breakpoint}`),
).size;
const accessibilityPassing = captureResults.filter(
  (result) => result.accessibility?.blocking === 0 && result.runtime?.pageErrors?.length === 0,
).length;
const mean = (values) =>
  values.length
    ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100
    : null;
const scoreGroups = (key) =>
  Object.fromEntries(
    [...new Set(registry.experiences.map((entry) => entry[key]))]
      .sort()
      .map((value) => {
        const experienceIds = new Set(
          registry.experiences.filter((entry) => entry[key] === value).map((entry) => entry.id),
        );
        const groupAudits = audits.audits.filter((audit) => experienceIds.has(audit.experienceId));
        return [value, { audits: groupAudits.length, averageScore: mean(groupAudits.map((audit) => audit.overallScore)) }];
      }),
  );
const unresolvedFindingAges = open.map((finding) => {
  const created = new Date(`${finding.createdAt}T00:00:00Z`).getTime();
  const now = new Date(`${today}T00:00:00Z`).getTime();
  return Math.max(0, Math.floor((now - created) / 86_400_000));
});
const reviewedExperienceIds = new Set([
  ...registry.experiences.filter((entry) => entry.lastReviewedAt).map((entry) => entry.id),
  ...audits.audits.map((audit) => audit.experienceId),
  ...reviews.reviews.map((review) => review.experienceId),
  ...captureResults.map((result) => result.experienceId),
]);
const applicableConformance = conformance.repositories.filter((repository) => repository.applicable);
const passingConformance = applicableConformance.filter((repository) => repository.status === "pass");

const assertedMetrics = registryMetrics(registry);
const metrics = {
  ...assertedMetrics,
  passing: auditProof.provenPassingExperienceIds.size,
  assertedPassing: assertedMetrics.passing,
};
const productReports = Object.fromEntries(
  Object.keys(metrics.products).map((product) => {
    const productExperiences = registry.experiences.filter((entry) => entry.product === product);
    const productOpenFindings = open.filter((finding) => finding.product === product);
    return [
      product,
      {
        experiences: productExperiences.length,
        critical: productExperiences.filter((entry) => entry.reviewTier === "critical").length,
        passing: productExperiences.filter((entry) => auditProof.provenPassingExperienceIds.has(entry.id)).length,
        openFindings: productOpenFindings.length,
        releaseBlocking: productOpenFindings.filter((finding) => finding.severity === "release-blocking").length,
      },
    ];
  }),
);
const experienceClassReports = Object.fromEntries(
  Object.keys(metrics.experienceClasses).map((experienceClass) => {
    const classExperiences = registry.experiences.filter(
      (entry) => entry.experienceClass === experienceClass,
    );
    const classIds = new Set(classExperiences.map((entry) => entry.id));
    const classOpenFindings = open.filter((finding) => classIds.has(finding.experienceId));
    return [
      experienceClass,
      {
        experiences: classExperiences.length,
        critical: classExperiences.filter((entry) => entry.reviewTier === "critical").length,
        passing: classExperiences.filter((entry) => auditProof.provenPassingExperienceIds.has(entry.id)).length,
        openFindings: classOpenFindings.length,
        releaseBlocking: classOpenFindings.filter((finding) => finding.severity === "release-blocking").length,
      },
    ];
  }),
);

const unresolvedReleaseBlockers = open.filter(
  (finding) => finding.severity === "release-blocking",
);
const certificationReasons = [
  ...(errors.length ? [`${errors.length} structural validation errors`] : []),
  ...(unresolvedReleaseBlockers.length
    ? [`${unresolvedReleaseBlockers.length} unresolved release-blocking findings`]
    : []),
  ...(unbaselinedHighRisk.length
    ? [`${unbaselinedHighRisk.length} unbaselined high-risk findings`]
    : []),
  ...(golden.status !== "approved" ? [`golden set is ${golden.status}`] : []),
  ...(auditProof.nonPassingAuditCells.length
    ? [
        `${auditProof.passingAuditCells}/${auditProof.requiredAuditCells.length} required state/breakpoint audit cells pass`,
      ]
    : []),
  ...(!capture ? ["rendered capture manifest is missing"] : []),
  ...(capture?.summary?.missingBaselines
    ? [`${capture.summary.missingBaselines} visual baselines await approval`]
    : []),
  ...(captureRegressions.length
    ? [`${captureRegressions.length} capture regressions require review`]
    : []),
  ...(passingConformance.length !== applicableConformance.length
    ? [
        `${passingConformance.length}/${applicableConformance.length} applicable repositories pass design-system conformance`,
      ]
    : []),
];

const report = {
  schemaVersion: "signal-design-quality-report/1",
  generatedAt: new Date().toISOString(),
  status: errors.length ? "invalid" : unbaselinedHighRisk.length || captureRegressions.length ? "regression" : "baseline-held",
  readiness: {
    status: certificationReasons.length ? "not-certified" : "certified",
    reasons: certificationReasons,
  },
  standard: { dimensions: AUDIT_DIMENSIONS, categoryMinimum: 3, overallMinimum: 3.5 },
  inventory: metrics,
  experienceClasses: experienceClassReports,
  products: productReports,
  findings: {
    total: findings.findings.length,
    open: open.length,
    releaseBlocking: open.filter((finding) => finding.severity === "release-blocking").length,
    high: open.filter((finding) => finding.severity === "high").length,
    resolved: findings.findings.filter((finding) => finding.status === "resolved").length,
    unbaselinedHighRisk: unbaselinedHighRisk.map((finding) => finding.id),
    oldestOpenDays: unresolvedFindingAges.length ? Math.max(...unresolvedFindingAges) : 0,
    averageOpenDays: mean(unresolvedFindingAges) ?? 0,
  },
  audits: {
    total: audits.audits.length,
    requiredCells: auditProof.requiredAuditCells.length,
    passing: auditProof.passingAuditCells,
    failing: auditProof.nonPassingAuditCells.length,
    missing: auditProof.missingAuditCells.length,
    duplicate: auditProof.duplicateAuditCells.length,
    falsePassingExperienceIds: auditProof.falsePassingExperienceIds,
    byProduct: scoreGroups("product"),
    byExperienceClass: scoreGroups("experienceClass"),
    byArchetype: scoreGroups("archetype"),
  },
  coverage: {
    registry: {
      registered: registry.experiences.length,
      validationErrors: errors.length,
    },
    states: {
      capturedVariants: capturedStateVariants,
      requiredVariants: metrics.stateVariants,
      completeFixtureExperiences: metrics.fixtureCoverage,
    },
    breakpoints: {
      capturedVariants: capturedBreakpointVariants,
      requiredVariants: metrics.breakpointVariants,
      completeScreenshotExperiences: metrics.screenshotCoverage,
    },
    accessibility: {
      passingCaptures: accessibilityPassing,
      totalCaptures: captureResults.length,
      completeExperiences: metrics.accessibilityCoverage,
    },
    designSystemConformance: {
      passingRepositories: passingConformance.length,
      applicableRepositories: applicableConformance.length,
      rate: applicableConformance.length
        ? Math.round((passingConformance.length / applicableConformance.length) * 10_000) / 100
        : null,
      generatedAt: conformance.generatedAt,
      status: passingConformance.length === applicableConformance.length ? "pass" : "fail",
    },
  },
  capture: capture?.summary ?? null,
  captureRegressions: captureRegressions.map((result) => `${result.experienceId}:${result.breakpoint}`),
  visualRegression: {
    status: captureRegressions.length ? "review-required" : captureResults.length ? "pilot-clean" : "not-captured",
    missingBaselines: capture?.summary?.missingBaselines ?? 0,
    approvedBaselines: captureResults.filter((result) => result.visual?.state !== "missing").length,
  },
  governance: {
    underRemediation: metrics.underRemediation,
    legacyExperiences: registry.experiences.filter((entry) => entry.implementationStatus === "legacy").length,
    acceptedExceptions: findings.findings.filter((finding) => finding.status === "accepted-exception").length,
    validAcceptedExceptions: auditProof.validAcceptedFindingIds.size,
    activeExceptions: exceptions.exceptions.length,
    expiredExceptions: exceptions.exceptions.filter((item) => !item.expiresAt || item.expiresAt < today).length,
    notReviewedSinceMaterialChange: registry.experiences.filter((entry) => !reviewedExperienceIds.has(entry.id)).length,
  },
  goldenSet: { status: golden.status, count: golden.experienceIds.length, approvalTask: golden.approvalTask },
  structuralErrors: errors,
};

mkdirSync(OUTPUT, { recursive: true });
writeFileSync(path.join(OUTPUT, "quality-report.json"), `${JSON.stringify(report, null, 2)}\n`);
const markdown = [
  "# Signal design quality report",
  "",
  `Generated: ${report.generatedAt}`,
  `Status: **${report.status}**`,
  `Readiness: **${report.readiness.status}**`,
  "",
  "## Inventory",
  "",
  `- ${metrics.experiences} registered experiences`,
  `- ${metrics.stateVariants} required state variants`,
  `- ${metrics.breakpointVariants} required breakpoint variants`,
  `- ${auditProof.requiredAuditCells.length} required state/breakpoint audit cells`,
  `- ${metrics.passing} evidence-proven Studio-grade experiences (${metrics.assertedPassing} registry assertions)`,
  `- ${metrics.experienceClasses["customer-product"]} customer-product experiences across Tasks, Timeline, Signal, and Notes`,
  `- ${metrics.experienceClasses["company-public"]} company-public Studio experiences`,
  `- ${metrics.experienceClasses["founder-operator"]} founder-operator experiences across Signal HQ and Signal Review`,
  `- ${capturedStateVariants}/${metrics.stateVariants} required state variants have rendered pilot evidence`,
  `- ${capturedBreakpointVariants}/${metrics.breakpointVariants} required breakpoint variants have rendered pilot evidence`,
  `- ${accessibilityPassing}/${captureResults.length} rendered pilot captures pass deterministic accessibility/runtime gates`,
  `- ${passingConformance.length}/${applicableConformance.length} governed repositories pass design-system conformance`,
  "",
  "## Experience classes",
  "",
  "Tasks, Timeline, Signal, and Notes are the four customer products. The Studio public site is the company and brand surface. Signal HQ is the internal founder-operator control plane, and Signal Review is its manual-review instrument.",
  "",
  "| Experience class | Experiences | Critical | Passing | Open findings | Release blocking |",
  "|---|---:|---:|---:|---:|---:|",
  ...Object.entries(experienceClassReports).map(([experienceClass, item]) => `| ${experienceClass} | ${item.experiences} | ${item.critical} | ${item.passing} | ${item.openFindings} | ${item.releaseBlocking} |`),
  "",
  "## Source systems",
  "",
  "| Product | Experiences | Critical | Passing | Open findings | Release blocking |",
  "|---|---:|---:|---:|---:|---:|",
  ...Object.entries(productReports).map(([product, item]) => `| ${product} | ${item.experiences} | ${item.critical} | ${item.passing} | ${item.openFindings} | ${item.releaseBlocking} |`),
  "",
  "## Gate",
  "",
  `- Structural errors: ${errors.length}`,
  `- Passing audit cells: ${auditProof.passingAuditCells}/${auditProof.requiredAuditCells.length}`,
  `- Missing audit cells: ${auditProof.missingAuditCells.length}`,
  `- Duplicate audit cells: ${auditProof.duplicateAuditCells.length}`,
  `- False passing assertions: ${auditProof.falsePassingExperienceIds.length}`,
  `- Unbaselined high-risk findings: ${unbaselinedHighRisk.length}`,
  `- Capture regressions requiring review: ${captureRegressions.length}`,
  `- Missing founder-approved visual baselines: ${capture?.summary?.missingBaselines ?? 0}`,
  `- Open findings: ${open.length} (${open.filter((finding) => finding.severity === "release-blocking").length} release-blocking, ${open.filter((finding) => finding.severity === "high").length} high)`,
  `- Experiences under remediation: ${metrics.underRemediation}`,
  `- Experiences not yet reviewed since registration/material change: ${registry.experiences.length - reviewedExperienceIds.size}`,
  `- Expired exceptions: ${exceptions.exceptions.filter((item) => !item.expiresAt || item.expiresAt < today).length}`,
  `- Golden set: ${golden.status}`,
  ...report.readiness.reasons.map((reason) => `- Certification blocker: ${reason}`),
  "",
  "A passing inventory count is not a launch claim. A surface is Studio grade only after all 13 scores, rendered evidence, deterministic checks, and hard blockers pass.",
  "",
].join("\n");
writeFileSync(path.join(OUTPUT, "quality-report.md"), markdown);

const cards = (capture?.results ?? []).map((result) => `
  <article class="card" data-status="${result.pass ? "pass" : "review"}">
    <div class="frame">${result.candidateScreenshot ? `<img src="${result.candidateScreenshot}" alt="${result.experienceId}, ${result.breakpoint}" loading="lazy">` : "<p>Capture unavailable</p>"}</div>
    <div class="meta"><span>${result.product} / ${result.breakpoint}</span><strong>${result.pass ? "pass" : "review"}</strong></div>
    <h2>${result.experienceId}</h2>
    <p>${result.status ?? "no response"} · ${result.accessibility.blocking} blocking a11y · ${result.runtime.overflowPixels ?? "?"}px overflow · ${result.visual.state}</p>
  </article>`).join("");
const gallery = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Signal Experience Gallery</title><style>
:root{font-family:Arial,sans-serif;color:#18181b;background:#f6f6f3}*{box-sizing:border-box}body{margin:0}header{padding:56px max(24px,5vw) 28px;border-bottom:1px solid #d9d9d3}header p{max-width:68ch;color:#666660}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:18px;padding:28px max(24px,5vw) 64px}.card{background:white;border:1px solid #d9d9d3;border-radius:14px;overflow:hidden}.frame{aspect-ratio:16/10;background:#ecece8;overflow:hidden}.frame img{width:100%;height:100%;object-fit:cover;object-position:top}.meta{display:flex;justify-content:space-between;padding:14px 16px 0;text-transform:uppercase;letter-spacing:.08em;font-size:11px}.meta strong{color:#4f46e5}.card h2{font-size:18px;margin:12px 16px 6px}.card p{font-size:13px;color:#666660;margin:0 16px 18px;line-height:1.5}</style></head><body><header><small>SIGNAL HQ / FOUNDER-OPERATOR CONTROL PLANE</small><h1>Rendered evidence, not taste by assertion.</h1><p>${metrics.experiences} registered experiences across four customer products, the Studio company surface, and the private HQ and Signal Review instruments. Review status is evidence, not launch approval.</p></header><main class="grid">${cards || "<p>No capture manifest yet. Run the capture command.</p>"}</main></body></html>`;
writeFileSync(path.join(OUTPUT, "gallery.html"), gallery);

if (errors.length) console.error(errors.map((error) => `x ${error}`).join("\n"));
console.log(JSON.stringify({ status: report.status, structuralErrors: errors.length, unbaselinedHighRisk: unbaselinedHighRisk.length, captureRegressions: captureRegressions.length }, null, 2));
if (errors.length || (enforce && (unbaselinedHighRisk.length || (enforceCapture && captureRegressions.length)))) process.exit(1);
