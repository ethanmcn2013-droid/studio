#!/usr/bin/env node
import { createHash } from "node:crypto";
import {
  existsSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { AUDIT_DIMENSIONS } from "./lib.mjs";

export const FOUNDER_APPROVER = "Ethan McNamara";
export const REQUIRED_BREAKPOINTS = ["mobile", "tablet", "desktop", "wide"];

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const CONFIG_VERSION = "signal-founder-evidence-config/1";
const REVIEW_VERSION = "signal-review/2";

function fail(message) {
  throw new Error(message);
}

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function unique(values) {
  return [...new Set(values)];
}

function normaliseRelative(value) {
  return String(value ?? "").replaceAll("\\", "/");
}

function resolveRelative(base, relative, requiredPrefix) {
  const normalised = normaliseRelative(relative);
  if (
    !normalised ||
    path.isAbsolute(normalised) ||
    normalised.split("/").includes("..") ||
    (requiredPrefix && !normalised.startsWith(`${requiredPrefix}/`))
  ) {
    fail(`unsafe evidence path: ${relative ?? "<missing>"}`);
  }
  const resolvedBase = path.resolve(base);
  const resolved = path.resolve(resolvedBase, ...normalised.split("/"));
  if (!resolved.startsWith(`${resolvedBase}${path.sep}`)) {
    fail(`evidence path escapes ${resolvedBase}: ${relative}`);
  }
  return { normalised, resolved };
}

function requireExistingFile(base, relative, requiredPrefix) {
  const evidence = resolveRelative(base, relative, requiredPrefix);
  if (!existsSync(evidence.resolved) || !statSync(evidence.resolved).isFile()) {
    fail(`evidence file is missing: ${evidence.normalised}`);
  }
  if (statSync(evidence.resolved).size === 0) fail(`evidence file is empty: ${evidence.normalised}`);
  return evidence;
}

function requirePng(base, relative, requiredPrefix) {
  const evidence = requireExistingFile(base, relative, requiredPrefix);
  if (!evidence.normalised.toLowerCase().endsWith(".png")) {
    fail(`evidence is not a PNG: ${evidence.normalised}`);
  }
  const bytes = readFileSync(evidence.resolved);
  if (bytes.length < PNG_SIGNATURE.length || !bytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    fail(`evidence has an invalid PNG signature: ${evidence.normalised}`);
  }
  return evidence;
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function safeId(value) {
  return value.replaceAll(".", "-").replace(/[^a-z0-9-]/g, "-");
}

function tupleKey(experienceId, state, breakpoint) {
  return `${experienceId}:${state}:${breakpoint}`;
}

function reviewId(experienceId, state, breakpoint, candidateHash) {
  return `review-founder-baseline-${safeId(experienceId)}-${safeId(state)}-${breakpoint}-${candidateHash.slice(0, 12)}`;
}

function auditId(experienceId, state, breakpoint) {
  return `audit-golden-${safeId(experienceId)}-${safeId(state)}-${breakpoint}`;
}

function candidatePath(experienceId, state, breakpoint) {
  return `screenshots/${safeId(experienceId)}/${state}/${breakpoint}.png`;
}

function baselinePath(experienceId, state, breakpoint) {
  return `baselines/${safeId(experienceId)}/${state}/${breakpoint}.png`;
}

function validateApproval(config, repoRoot) {
  if (config?.schemaVersion !== CONFIG_VERSION) fail(`config schema must be ${CONFIG_VERSION}`);
  const approval = config.approval;
  if (!approval || approval.actor !== FOUNDER_APPROVER) {
    fail(`approval.actor must be exactly ${FOUNDER_APPROVER}`);
  }
  if (!nonEmpty(approval.approvedAt) || Number.isNaN(Date.parse(approval.approvedAt))) {
    fail("approval.approvedAt must be an ISO date-time");
  }
  if (!nonEmpty(approval.approvalSource)) fail("approval.approvalSource is required");
  requireExistingFile(repoRoot, approval.approvalSource);
  if (!nonEmpty(approval.note)) fail("approval.note is required");
  for (const field of ["changeReferences", "designSystemReferences"]) {
    if (approval[field] !== undefined && !Array.isArray(approval[field])) {
      fail(`approval.${field} must be an array when supplied`);
    }
  }
  return approval;
}

function registryEntry(registry, experienceId) {
  const matches = registry.experiences.filter((entry) => entry.id === experienceId);
  if (matches.length !== 1) fail(`${experienceId}: expected exactly one registry entry, found ${matches.length}`);
  return matches[0];
}

export function verifyCaptureResult({ result, entry, outputRoot, requireCandidateFile = true }) {
  const key = tupleKey(result.experienceId, result.state, result.breakpoint);
  if (result.experienceId !== entry.id) fail(`${key}: capture does not match its registry entry`);
  if (result.product !== entry.product) fail(`${key}: capture product does not match the registry`);
  if (!entry.requiredStates.includes(result.state)) fail(`${key}: capture state is not declared by the registry`);
  if (!entry.requiredBreakpoints.includes(result.breakpoint)) {
    fail(`${key}: capture breakpoint is not declared by the registry`);
  }
  if (result.pass !== true) fail(`${key}: capture pass must be true`);
  if (result.navigationError !== null) fail(`${key}: navigationError must be null`);
  if (!Number.isInteger(result.status) || result.status < 200 || result.status >= 300) {
    fail(`${key}: HTTP status must be 2xx`);
  }
  if (
    !result.accessibility ||
    result.accessibility.violations !== 0 ||
    result.accessibility.blocking !== 0 ||
    !Array.isArray(result.accessibility.ruleIds) ||
    !Array.isArray(result.accessibility.details) ||
    result.accessibility.ruleIds.length !== 0 ||
    result.accessibility.details.length !== 0
  ) {
    fail(`${key}: Axe result must be present and contain zero violations`);
  }
  if (!result.runtime || result.runtime.overflowPixels !== 0) {
    fail(`${key}: horizontal overflow must be exactly zero`);
  }
  if (!Array.isArray(result.runtime.consoleErrors) || result.runtime.consoleErrors.length !== 0) {
    fail(`${key}: console errors must be present as an empty array`);
  }
  if (!Array.isArray(result.runtime.pageErrors) || result.runtime.pageErrors.length !== 0) {
    fail(`${key}: page errors must be present as an empty array`);
  }

  const expectedCandidate = candidatePath(result.experienceId, result.state, result.breakpoint);
  if (normaliseRelative(result.candidateScreenshot) !== expectedCandidate) {
    fail(`${key}: candidate path must be exactly ${expectedCandidate}`);
  }
  if (!/^[a-f0-9]{64}$/.test(result.candidateHash ?? "")) {
    fail(`${key}: manifest candidate hash must be SHA-256`);
  }
  const candidate = requireCandidateFile ? requirePng(outputRoot, expectedCandidate, "screenshots") : null;
  const actualHash = candidate ? sha256(candidate.resolved) : result.candidateHash;
  if (candidate && actualHash !== result.candidateHash) fail(`${key}: candidate bytes do not match the manifest hash`);

  return {
    key,
    result,
    entry,
    candidate,
    candidateHash: actualHash,
    baselineRelative: baselinePath(result.experienceId, result.state, result.breakpoint),
  };
}

function selectionBreakpoints(selection, requireAll = false) {
  const breakpoints = selection.breakpoints ?? REQUIRED_BREAKPOINTS;
  if (!Array.isArray(breakpoints) || breakpoints.length === 0) fail("selection breakpoints are required");
  if (new Set(breakpoints).size !== breakpoints.length) fail("selection breakpoints must be unique");
  for (const breakpoint of breakpoints) {
    if (!REQUIRED_BREAKPOINTS.includes(breakpoint)) fail(`unknown breakpoint ${breakpoint}`);
  }
  if (requireAll && (
    breakpoints.length !== REQUIRED_BREAKPOINTS.length ||
    REQUIRED_BREAKPOINTS.some((breakpoint) => !breakpoints.includes(breakpoint))
  )) {
    fail(`${selection.experienceId}:${selection.state}: golden evidence requires all four breakpoints`);
  }
  return breakpoints;
}

function selectedCaptures({ manifest, registry, selections, outputRoot, requireAll = false }) {
  if (manifest?.schemaVersion !== "signal-experience-capture/1" || !Array.isArray(manifest.results)) {
    fail("capture manifest is invalid");
  }
  if (!Array.isArray(selections) || selections.length === 0) fail("at least one selection is required");
  const verified = [];
  const seen = new Set();
  for (const selection of selections) {
    if (!nonEmpty(selection.experienceId) || !nonEmpty(selection.state)) {
      fail("each selection requires experienceId and state");
    }
    const entry = registryEntry(registry, selection.experienceId);
    if (!entry.requiredStates.includes(selection.state)) {
      fail(`${selection.experienceId}: state ${selection.state} is not declared by the registry`);
    }
    for (const breakpoint of selectionBreakpoints(selection, requireAll)) {
      const key = tupleKey(selection.experienceId, selection.state, breakpoint);
      if (seen.has(key)) fail(`${key}: duplicate selection`);
      seen.add(key);
      const matches = manifest.results.filter(
        (result) =>
          result.experienceId === selection.experienceId &&
          result.state === selection.state &&
          result.breakpoint === breakpoint,
      );
      if (matches.length !== 1) fail(`${key}: expected exactly one capture result, found ${matches.length}`);
      verified.push(verifyCaptureResult({ result: matches[0], entry, outputRoot }));
    }
  }
  return verified;
}

export function createSchemaValidator({ repoRoot, schemaFile }) {
  const schema = JSON.parse(readFileSync(path.join(repoRoot, "experience", "schemas", schemaFile), "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  return (value, label) => {
    if (!validate(value)) {
      fail(`${label} is not schema-valid: ${validate.errors.map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ")}`);
    }
  };
}

function upsertById(collection, value) {
  const next = [...collection];
  const index = next.findIndex((item) => item.id === value.id);
  if (index === -1) next.push(value);
  else next[index] = value;
  return next;
}

export function prepareFounderReviews({
  repoRoot,
  outputRoot,
  manifest,
  registry,
  reviewsCollection,
  config,
  validateReview = createSchemaValidator({ repoRoot, schemaFile: "review.schema.json" }),
}) {
  const approval = validateApproval(config, repoRoot);
  const verified = selectedCaptures({
    manifest,
    registry,
    selections: config.reviewSelections,
    outputRoot,
  });
  let reviews = [...reviewsCollection.reviews];
  const preparedIds = [];
  for (const capture of verified) {
    const { result, entry, candidateHash, baselineRelative } = capture;
    const id = reviewId(result.experienceId, result.state, result.breakpoint, candidateHash);
    const previous = reviews.find((review) => review.id === id);
    const approvalEntry = {
      status: "approved",
      actor: FOUNDER_APPROVER,
      at: approval.approvedAt,
      note: approval.note,
    };
    const priorHistory = Array.isArray(previous?.approvalHistory) ? previous.approvalHistory : [];
    const approvalHistory = priorHistory.some(
      (entry) =>
        entry.status === approvalEntry.status &&
        entry.actor === approvalEntry.actor &&
        entry.at === approvalEntry.at &&
        entry.note === approvalEntry.note,
    )
      ? priorHistory
      : [...priorHistory, approvalEntry];
    const review = {
      schemaVersion: REVIEW_VERSION,
      id,
      experienceId: result.experienceId,
      product: result.product,
      routeOrTrigger: entry.route ?? entry.trigger,
      state: result.state,
      breakpoint: result.breakpoint,
      baselineScreenshot: baselineRelative,
      candidateScreenshot: result.candidateScreenshot,
      diffScreenshot: result.diffScreenshot ?? null,
      scoreBefore: null,
      scoreAfter: null,
      findingIds: [],
      annotations: [
        "Founder-authorized review of the exact captured candidate.",
        `Candidate SHA-256: ${candidateHash}`,
        `Approval source: ${approval.approvalSource}`,
      ],
      severity: null,
      owner: entry.designOwner || "product-taste-design-integrity",
      approvalHistory,
      resolutionEvidence: [`experience/output/${result.candidateScreenshot}`],
      status: "approved",
      designSystemReferences: unique(
        approval.designSystemReferences ?? ["docs/experience/SIGNAL_EXPERIENCE_STANDARD.md"],
      ),
      codeReferences: [entry.source],
      changeReferences: unique([approval.approvalSource, ...(approval.changeReferences ?? [])]),
    };
    validateReview(review, id);
    reviews = upsertById(reviews, review);
    preparedIds.push(id);
  }
  return {
    collection: { ...reviewsCollection, reviews },
    preparedIds,
  };
}

function scoreMatrix(reference) {
  const matrix = reference.scoresByBreakpoint;
  if (!matrix || typeof matrix !== "object") {
    fail(`${reference.experienceId}:${reference.state}: scoresByBreakpoint is required`);
  }
  if (
    Object.keys(matrix).length !== REQUIRED_BREAKPOINTS.length ||
    Object.keys(matrix).some((breakpoint) => !REQUIRED_BREAKPOINTS.includes(breakpoint))
  ) {
    fail(`${reference.experienceId}:${reference.state}: score matrix must contain exactly four breakpoints`);
  }
  for (const breakpoint of REQUIRED_BREAKPOINTS) {
    const scores = matrix[breakpoint];
    const keys = Object.keys(scores ?? {});
    if (
      keys.length !== AUDIT_DIMENSIONS.length ||
      AUDIT_DIMENSIONS.some((dimension) => !Object.hasOwn(scores ?? {}, dimension))
    ) {
      fail(`${reference.experienceId}:${reference.state}:${breakpoint}: all 13 scores are required`);
    }
    for (const dimension of AUDIT_DIMENSIONS) {
      const value = scores[dimension];
      if (!Number.isInteger(value) || value < 0 || value > 4) {
        fail(`${reference.experienceId}:${reference.state}:${breakpoint}:${dimension}: score must be an integer 0..4`);
      }
    }
  }
  return matrix;
}

function calculateOverall(scores) {
  return Math.round(
    (AUDIT_DIMENSIONS.reduce((total, dimension) => total + scores[dimension], 0) /
      AUDIT_DIMENSIONS.length) * 100,
  ) / 100;
}

function goldenReferences(config) {
  const golden = config.goldenSet;
  if (!golden || !nonEmpty(golden.approvalTask) || !Array.isArray(golden.references) || !golden.references.length) {
    fail("goldenSet.approvalTask and goldenSet.references are required");
  }
  const ids = golden.references.map((reference) => reference.experienceId);
  if (new Set(ids).size !== ids.length) fail("goldenSet references must have unique experience IDs");
  for (const reference of golden.references) {
    selectionBreakpoints({ ...reference, breakpoints: REQUIRED_BREAKPOINTS }, true);
    scoreMatrix(reference);
  }
  return golden.references;
}

function scoringProvenance(config, repoRoot) {
  const golden = config.goldenSet;
  if (!nonEmpty(golden?.scoredBy)) fail("goldenSet.scoredBy is required");
  if (golden.scoredBy === FOUNDER_APPROVER) {
    fail("goldenSet.scoredBy must name the delegated reviewer, not the founder approver");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(golden?.scoredAt ?? "")) {
    fail("goldenSet.scoredAt must be an ISO date");
  }
  const parsed = new Date(`${golden.scoredAt}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== golden.scoredAt) {
    fail("goldenSet.scoredAt must be a valid ISO date");
  }
  if (!nonEmpty(golden.scoringSource)) fail("goldenSet.scoringSource is required");
  requireExistingFile(repoRoot, golden.scoringSource);
  return {
    reviewer: golden.scoredBy,
    reviewedAt: golden.scoredAt,
    source: golden.scoringSource,
  };
}

function verifyBaseline({ experienceRoot, capture }) {
  const baseline = requirePng(experienceRoot, capture.baselineRelative, "baselines");
  if (sha256(baseline.resolved) !== capture.candidateHash) {
    fail(`${capture.key}: baseline bytes do not match the reviewed candidate`);
  }
  if (
    normaliseRelative(capture.result.baselineScreenshot) !== capture.baselineRelative ||
    capture.result.visual?.state !== "approved" ||
    capture.result.approvedBy !== FOUNDER_APPROVER ||
    capture.result.approvedCandidateHash !== capture.candidateHash ||
    !nonEmpty(capture.result.approvedAt) ||
    Number.isNaN(Date.parse(capture.result.approvedAt))
  ) {
    fail(`${capture.key}: capture manifest lacks exact founder baseline-approval provenance`);
  }
  return baseline;
}

function matchingReview({ reviewsCollection, capture, approval, validateReview }) {
  const expectedId = reviewId(
    capture.result.experienceId,
    capture.result.state,
    capture.result.breakpoint,
    capture.candidateHash,
  );
  const matches = reviewsCollection.reviews.filter((review) => review.id === expectedId);
  if (matches.length !== 1) fail(`${capture.key}: expected exactly one review ${expectedId}, found ${matches.length}`);
  const review = matches[0];
  validateReview(review, expectedId);
  if (
    review.experienceId !== capture.result.experienceId ||
    review.product !== capture.result.product ||
    review.state !== capture.result.state ||
    review.breakpoint !== capture.result.breakpoint ||
    normaliseRelative(review.candidateScreenshot) !== capture.result.candidateScreenshot ||
    normaliseRelative(review.baselineScreenshot) !== capture.baselineRelative ||
    review.status !== "approved" ||
    !review.changeReferences.includes(approval.approvalSource) ||
    !review.annotations.includes(`Candidate SHA-256: ${capture.candidateHash}`) ||
    !review.approvalHistory.some(
      (history) =>
        history.status === "approved" &&
        history.actor === FOUNDER_APPROVER &&
        history.at === approval.approvedAt &&
        nonEmpty(history.note),
    )
  ) {
    fail(`${capture.key}: review does not exactly match the candidate, baseline, actor, and approval source`);
  }
  return review;
}

function blockingFinding(findingsCollection, experienceId) {
  return (findingsCollection?.findings ?? []).find(
    (finding) =>
      finding.experienceId === experienceId &&
      finding.severity === "release-blocking" &&
      finding.status !== "resolved",
  );
}

export function prepareFounderAudits({
  repoRoot,
  experienceRoot,
  outputRoot,
  manifest,
  registry,
  reviewsCollection,
  auditsCollection,
  findingsCollection = { findings: [] },
  config,
  validateReview = createSchemaValidator({ repoRoot, schemaFile: "review.schema.json" }),
  validateAudit = createSchemaValidator({ repoRoot, schemaFile: "audit.schema.json" }),
}) {
  const approval = validateApproval(config, repoRoot);
  const references = goldenReferences(config);
  const scoring = scoringProvenance(config, repoRoot);
  const captures = selectedCaptures({ manifest, registry, selections: references, outputRoot, requireAll: true });
  let audits = [...auditsCollection.audits];
  const preparedIds = [];
  for (const capture of captures) {
    verifyBaseline({ experienceRoot, capture });
    const review = matchingReview({ reviewsCollection, capture, approval, validateReview });
    const blocker = blockingFinding(findingsCollection, capture.result.experienceId);
    if (blocker) fail(`${capture.key}: unresolved release-blocking finding ${blocker.id}`);
    const reference = references.find((item) => item.experienceId === capture.result.experienceId);
    const scores = reference.scoresByBreakpoint[capture.result.breakpoint];
    const overallScore = calculateOverall(scores);
    if (Math.min(...AUDIT_DIMENSIONS.map((dimension) => scores[dimension])) < 3 || overallScore < 3.5) {
      fail(`${capture.key}: supplied scores do not meet the golden-set pass threshold`);
    }
    const id = auditId(capture.result.experienceId, capture.result.state, capture.result.breakpoint);
    const audit = {
      id,
      experienceId: capture.result.experienceId,
      state: capture.result.state,
      breakpoint: capture.result.breakpoint,
      scores,
      overallScore,
      evidence: [
        `experience/${capture.baselineRelative}#sha256=${capture.candidateHash}`,
        `experience/reviews.json#${review.id}`,
        scoring.source,
      ],
      reviewer: scoring.reviewer,
      reviewedAt: scoring.reviewedAt,
      pass: true,
    };
    validateAudit(audit, id);
    audits = upsertById(audits, audit);
    preparedIds.push(id);
  }
  return {
    collection: { ...auditsCollection, audits },
    preparedIds,
  };
}

function exactAudit({ auditsCollection, capture, reference, scoring, review, validateAudit }) {
  const expectedId = auditId(capture.result.experienceId, capture.result.state, capture.result.breakpoint);
  const tupleMatches = auditsCollection.audits.filter(
    (audit) =>
      audit.experienceId === capture.result.experienceId &&
      audit.state === capture.result.state &&
      audit.breakpoint === capture.result.breakpoint,
  );
  if (tupleMatches.length !== 1 || tupleMatches[0].id !== expectedId) {
    fail(`${capture.key}: expected one exact audit ${expectedId}`);
  }
  const audit = tupleMatches[0];
  validateAudit(audit, expectedId);
  const expectedScores = reference.scoresByBreakpoint[capture.result.breakpoint];
  if (AUDIT_DIMENSIONS.some((dimension) => audit.scores[dimension] !== expectedScores[dimension])) {
    fail(`${capture.key}: audit scores do not match the supplied score matrix`);
  }
  const expectedOverall = calculateOverall(expectedScores);
  if (
    audit.overallScore !== expectedOverall ||
    audit.pass !== true ||
    audit.reviewer !== scoring.reviewer ||
    audit.reviewedAt !== scoring.reviewedAt ||
    !audit.evidence.includes(`experience/${capture.baselineRelative}#sha256=${capture.candidateHash}`) ||
    !audit.evidence.includes(`experience/reviews.json#${review.id}`) ||
    !audit.evidence.includes(scoring.source) ||
    Math.min(...AUDIT_DIMENSIONS.map((dimension) => expectedScores[dimension])) < 3 ||
    expectedOverall < 3.5
  ) {
    fail(`${capture.key}: audit is not an exact passing record for the approved baseline`);
  }
  return audit;
}

function promotedCoverage(current, complete) {
  if (complete) return "complete";
  if (current === "blocked") return "blocked";
  return "partial";
}

function completeEvidenceMatrix({
  entry,
  manifest,
  outputRoot,
  experienceRoot,
  reviewsCollection,
  auditsCollection,
  approval,
  validateReview,
  validateAudit,
}) {
  try {
    for (const state of entry.requiredStates) {
      for (const breakpoint of entry.requiredBreakpoints) {
        const results = manifest.results.filter(
          (result) =>
            result.experienceId === entry.id &&
            result.state === state &&
            result.breakpoint === breakpoint,
        );
        if (results.length !== 1) return false;
        const capture = verifyCaptureResult({ result: results[0], entry, outputRoot });
        verifyBaseline({ experienceRoot, capture });
        const review = matchingReview({ reviewsCollection, capture, approval, validateReview });

        const expectedId = auditId(entry.id, state, breakpoint);
        const audits = auditsCollection.audits.filter(
          (audit) =>
            audit.experienceId === entry.id &&
            audit.state === state &&
            audit.breakpoint === breakpoint,
        );
        if (audits.length !== 1 || audits[0].id !== expectedId) return false;
        const audit = audits[0];
        validateAudit(audit, expectedId);
        const overall = calculateOverall(audit.scores ?? {});
        if (
          audit.pass !== true ||
          !nonEmpty(audit.reviewer) ||
          overall !== audit.overallScore ||
          overall < 3.5 ||
          !audit.evidence.includes(`experience/${capture.baselineRelative}#sha256=${capture.candidateHash}`) ||
          !audit.evidence.includes(`experience/reviews.json#${review.id}`) ||
          AUDIT_DIMENSIONS.some(
            (dimension) => !Number.isInteger(audit.scores?.[dimension]) || audit.scores[dimension] < 3,
          )
        ) {
          return false;
        }
      }
    }
    return true;
  } catch {
    return false;
  }
}

export function finalizeFounderEvidence({
  repoRoot,
  experienceRoot,
  outputRoot,
  manifest,
  registry,
  reviewsCollection,
  auditsCollection,
  overrides,
  findingsCollection = { findings: [] },
  config,
  validateReview = createSchemaValidator({ repoRoot, schemaFile: "review.schema.json" }),
  validateAudit = createSchemaValidator({ repoRoot, schemaFile: "audit.schema.json" }),
  validateGoldenSet = createSchemaValidator({ repoRoot, schemaFile: "golden-set.schema.json" }),
}) {
  const approval = validateApproval(config, repoRoot);
  const references = goldenReferences(config);
  const scoring = scoringProvenance(config, repoRoot);
  const captures = selectedCaptures({ manifest, registry, selections: references, outputRoot, requireAll: true });
  const capturesByExperience = new Map();
  for (const capture of captures) {
    verifyBaseline({ experienceRoot, capture });
    const review = matchingReview({ reviewsCollection, capture, approval, validateReview });
    const reference = references.find((item) => item.experienceId === capture.result.experienceId);
    const audit = exactAudit({
      auditsCollection,
      capture,
      reference,
      scoring,
      review,
      validateAudit,
    });
    const blocker = blockingFinding(findingsCollection, capture.result.experienceId);
    if (blocker) fail(`${capture.key}: unresolved release-blocking finding ${blocker.id}`);
    const cells = capturesByExperience.get(capture.result.experienceId) ?? [];
    cells.push({ capture, review, audit });
    capturesByExperience.set(capture.result.experienceId, cells);
  }

  const goldenSetReferences = references.map((reference) => {
    const cells = capturesByExperience.get(reference.experienceId) ?? [];
    if (cells.length !== REQUIRED_BREAKPOINTS.length) {
      fail(`${reference.experienceId}:${reference.state}: exactly four verified cells are required`);
    }
    const byBreakpoint = new Map(cells.map((cell) => [cell.capture.result.breakpoint, cell]));
    const record = (selector) => Object.fromEntries(
      REQUIRED_BREAKPOINTS.map((breakpoint) => [breakpoint, selector(byBreakpoint.get(breakpoint))]),
    );
    return {
      experienceId: reference.experienceId,
      state: reference.state,
      baselineScreenshots: record((cell) => `experience/${cell.capture.baselineRelative}`),
      reviewIds: record((cell) => cell.review.id),
      auditIds: record((cell) => cell.audit.id),
    };
  });

  const goldenSet = {
    schemaVersion: "signal-experience-golden-set/2",
    status: "approved",
    approvalTask: config.goldenSet.approvalTask,
    approvalRole: "founder",
    approvedBy: FOUNDER_APPROVER,
    approvedAt: approval.approvedAt,
    approvalSource: approval.approvalSource,
    scoredBy: scoring.reviewer,
    scoredAt: scoring.reviewedAt,
    scoringSource: scoring.source,
    experienceIds: references.map((reference) => reference.experienceId),
    references: goldenSetReferences,
  };
  validateGoldenSet(goldenSet, "golden set");

  const nextOverrides = {
    ...overrides,
    experiences: { ...(overrides.experiences ?? {}) },
  };
  references.forEach((reference, index) => {
    const entry = registryEntry(registry, reference.experienceId);
    const current = nextOverrides.experiences[entry.id] ?? {};
    const complete = completeEvidenceMatrix({
      entry,
      manifest,
      outputRoot,
      experienceRoot,
      reviewsCollection,
      auditsCollection,
      approval,
      validateReview,
      validateAudit,
    });
    const meanScore = Math.round(
      ((capturesByExperience.get(entry.id) ?? []).reduce((total, cell) => total + cell.audit.overallScore, 0) /
        REQUIRED_BREAKPOINTS.length) * 100,
    ) / 100;
    const protectedStatus = ["blocked", "under-remediation", "exception"].includes(current.auditStatus)
      ? current.auditStatus
      : null;
    nextOverrides.experiences[entry.id] = {
      ...current,
      auditStatus: complete ? "passing" : protectedStatus ?? "baseline-captured",
      auditScore: meanScore,
      screenshotCoverage: promotedCoverage(current.screenshotCoverage, complete),
      accessibilityCoverage: promotedCoverage(current.accessibilityCoverage, complete),
      lastReviewedAt: approval.approvedAt.slice(0, 10),
      approvedBaselineReference: `experience/golden-set.json#/references/${index}`,
    };
  });

  const nextRegistry = {
    ...registry,
    experiences: registry.experiences.map((entry) => ({
      ...entry,
      ...(nextOverrides.experiences[entry.id] ?? {}),
    })),
  };

  return { goldenSet, overrides: nextOverrides, registry: nextRegistry };
}

export function approvedGoldenSetEvidenceErrors({
  repoRoot,
  experienceRoot,
  outputRoot,
  goldenSet,
  manifest,
  registry,
  reviewsCollection,
  auditsCollection,
  findingsCollection = { findings: [] },
  validateReview = createSchemaValidator({ repoRoot, schemaFile: "review.schema.json" }),
  validateAudit = createSchemaValidator({ repoRoot, schemaFile: "audit.schema.json" }),
}) {
  if (goldenSet?.status !== "approved") return [];
  try {
    if (goldenSet.schemaVersion !== "signal-experience-golden-set/2") {
      fail("approved golden sets must use signal-experience-golden-set/2");
    }
    if (goldenSet.approvalRole !== "founder") fail("approved golden set approvalRole must be founder");
    const approval = validateApproval({
      schemaVersion: CONFIG_VERSION,
      approval: {
        actor: goldenSet.approvedBy,
        approvedAt: goldenSet.approvedAt,
        approvalSource: goldenSet.approvalSource,
        note: "Golden-set founder approval.",
      },
    }, repoRoot);
    const scoring = scoringProvenance({ goldenSet }, repoRoot);
    if (!Array.isArray(goldenSet.references) || goldenSet.references.length === 0) {
      fail("approved golden set references are required");
    }
    const referencedIds = goldenSet.references.map((reference) => reference.experienceId);
    if (
      JSON.stringify(referencedIds) !== JSON.stringify(goldenSet.experienceIds) ||
      new Set(referencedIds).size !== referencedIds.length
    ) {
      fail("golden set experienceIds must exactly match its unique references");
    }

    for (const reference of goldenSet.references) {
      const entry = registryEntry(registry, reference.experienceId);
      if (!entry.requiredStates.includes(reference.state)) {
        fail(`${entry.id}: golden state ${reference.state} is not declared by the registry`);
      }
      const blocker = blockingFinding(findingsCollection, entry.id);
      if (blocker) fail(`${entry.id}: unresolved release-blocking finding ${blocker.id}`);
      for (const breakpoint of REQUIRED_BREAKPOINTS) {
        const matches = manifest?.results?.filter(
          (result) =>
            result.experienceId === entry.id &&
            result.state === reference.state &&
            result.breakpoint === breakpoint,
        ) ?? [];
        if (matches.length !== 1) {
          fail(`${entry.id}:${reference.state}:${breakpoint}: expected exactly one capture result`);
        }
        const capture = verifyCaptureResult({
          result: matches[0],
          entry,
          outputRoot,
          requireCandidateFile: false,
        });
        verifyBaseline({ experienceRoot, capture });
        if (reference.baselineScreenshots[breakpoint] !== `experience/${capture.baselineRelative}`) {
          fail(`${capture.key}: golden baseline reference does not match the captured bytes`);
        }
        const review = matchingReview({ reviewsCollection, capture, approval, validateReview });
        if (reference.reviewIds[breakpoint] !== review.id) {
          fail(`${capture.key}: golden review reference does not match the exact founder review`);
        }

        const expectedAuditId = auditId(entry.id, reference.state, breakpoint);
        const audits = auditsCollection.audits.filter(
          (audit) =>
            audit.experienceId === entry.id &&
            audit.state === reference.state &&
            audit.breakpoint === breakpoint,
        );
        if (
          audits.length !== 1 ||
          audits[0].id !== expectedAuditId ||
          reference.auditIds[breakpoint] !== expectedAuditId
        ) {
          fail(`${capture.key}: golden audit reference is not exact`);
        }
        const audit = audits[0];
        validateAudit(audit, expectedAuditId);
        const overall = calculateOverall(audit.scores ?? {});
        if (
          audit.pass !== true ||
          audit.reviewer !== scoring.reviewer ||
          audit.reviewedAt !== scoring.reviewedAt ||
          overall !== audit.overallScore ||
          overall < 3.5 ||
          AUDIT_DIMENSIONS.some(
            (dimension) => !Number.isInteger(audit.scores?.[dimension]) || audit.scores[dimension] < 3,
          ) ||
          !audit.evidence.includes(`experience/${capture.baselineRelative}#sha256=${capture.candidateHash}`) ||
          !audit.evidence.includes(`experience/reviews.json#${review.id}`) ||
          !audit.evidence.includes(scoring.source)
        ) {
          fail(`${capture.key}: golden audit does not prove the exact baseline and review`);
        }
      }
    }
    return [];
  } catch (error) {
    return [`goldenSet evidence: ${error.message}`];
  }
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function commandLineArguments(argv) {
  const [command, ...args] = argv;
  let configFile;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--config") configFile = args[index + 1];
    else if (args[index].startsWith("--config=")) configFile = args[index].slice("--config=".length);
  }
  if (!["prepare-reviews", "prepare-audits", "finalize"].includes(command) || !configFile) {
    fail("usage: founder-evidence.mjs <prepare-reviews|prepare-audits|finalize> --config <file> [--dry-run]");
  }
  return { command, configFile, dryRun: args.includes("--dry-run") };
}

export function runCli(argv = process.argv.slice(2), repoRoot = process.cwd()) {
  const { command, configFile, dryRun } = commandLineArguments(argv);
  const experienceRoot = path.join(repoRoot, "experience");
  const outputRoot = path.join(experienceRoot, "output");
  const config = readJson(path.resolve(repoRoot, configFile));
  const common = {
    repoRoot,
    experienceRoot,
    outputRoot,
    config,
    manifest: readJson(path.join(outputRoot, "capture-manifest.json")),
    registry: readJson(path.join(experienceRoot, "registry.json")),
  };

  if (command === "prepare-reviews") {
    const file = path.join(experienceRoot, "reviews.json");
    const prepared = prepareFounderReviews({ ...common, reviewsCollection: readJson(file) });
    if (!dryRun) writeJson(file, prepared.collection);
    return { command, dryRun, count: prepared.preparedIds.length };
  }

  const reviewsCollection = readJson(path.join(experienceRoot, "reviews.json"));
  const auditsFile = path.join(experienceRoot, "audits.json");
  const findingsCollection = readJson(path.join(experienceRoot, "findings.json"));
  if (command === "prepare-audits") {
    const prepared = prepareFounderAudits({
      ...common,
      reviewsCollection,
      auditsCollection: readJson(auditsFile),
      findingsCollection,
    });
    if (!dryRun) writeJson(auditsFile, prepared.collection);
    return { command, dryRun, count: prepared.preparedIds.length };
  }

  const overridesFile = path.join(experienceRoot, "overrides.json");
  const goldenSetFile = path.join(experienceRoot, "golden-set.json");
  const registryFile = path.join(experienceRoot, "registry.json");
  const finalized = finalizeFounderEvidence({
    ...common,
    reviewsCollection,
    auditsCollection: readJson(auditsFile),
    overrides: readJson(overridesFile),
    findingsCollection,
  });
  createSchemaValidator({ repoRoot, schemaFile: "registry.schema.json" })(
    finalized.registry,
    "materialized registry",
  );
  if (!dryRun) {
    writeJson(overridesFile, finalized.overrides);
    writeJson(goldenSetFile, finalized.goldenSet);
    writeJson(registryFile, finalized.registry);
  }
  return { command, dryRun, count: finalized.goldenSet.references.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = runCli();
    console.log(`experience:founder-evidence: ${result.command} ${result.dryRun ? "dry-run " : ""}pass (${result.count})`);
  } catch (error) {
    console.error(`experience:founder-evidence: failed\n  x ${error.message}`);
    process.exitCode = 1;
  }
}
