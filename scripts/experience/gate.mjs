import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  AUDIT_DIMENSIONS,
  EXPERIENCE_STATES,
} from "./lib.mjs";

export function auditTupleKey(experienceId, state, breakpoint) {
  return `${experienceId}:${state}:${breakpoint}`;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function isActiveFounderApprovedException(exception, asOf) {
  return Boolean(
    exception &&
      exception.approvedBy === "founder" &&
      isIsoDate(exception.approvedAt) &&
      exception.approvedAt <= asOf &&
      isIsoDate(exception.expiresAt) &&
      exception.approvedAt <= exception.expiresAt &&
      exception.expiresAt >= asOf &&
      Array.isArray(exception.findingIds) &&
      exception.findingIds.length > 0 &&
      isNonEmptyString(exception.approvalSource) &&
      isNonEmptyString(exception.remediationPlan),
  );
}

export function isRenderedEvidenceReference(reference, root = process.cwd()) {
  if (!isNonEmptyString(reference) || path.isAbsolute(reference)) return false;
  const [relative, fragment, ...extraFragments] = reference.trim().split("#");
  const expectedHash = /^sha256=([a-f0-9]{64})$/.exec(fragment ?? "")?.[1];
  if (!expectedHash || extraFragments.length) return false;
  const normalized = relative.replaceAll("/", path.sep);
  const resolvedRoot = path.resolve(root);
  const target = path.resolve(resolvedRoot, normalized);
  if (!target.startsWith(`${resolvedRoot}${path.sep}`)) return false;
  if (!/\.(?:avif|gif|html|jpe?g|pdf|png|svg|webp)$/i.test(target)) return false;
  if (!existsSync(target)) return false;
  try {
    const stat = statSync(target);
    return (
      stat.isFile() &&
      stat.size > 0 &&
      createHash("sha256").update(readFileSync(target)).digest("hex") === expectedHash
    );
  } catch {
    return false;
  }
}

export function evaluateAuditProof({
  registry,
  audits,
  findings,
  exceptions,
  asOf,
  root = process.cwd(),
  evidenceReferenceExists = (reference) => isRenderedEvidenceReference(reference, root),
}) {
  const errors = [];
  const experiencesById = new Map(registry.experiences.map((entry) => [entry.id, entry]));
  const findingsById = new Map(findings.map((finding) => [finding.id, finding]));
  const exceptionsById = new Map();

  for (const exception of exceptions) {
    if (exceptionsById.has(exception.id)) errors.push(`duplicate exception ${exception.id}`);
    exceptionsById.set(exception.id, exception);
    for (const field of ["rationale", "owner", "scope", "approvalSource", "remediationPlan"]) {
      if (!isNonEmptyString(exception[field])) errors.push(`${exception.id}: missing ${field}`);
    }
    if (exception.approvedBy !== "founder") errors.push(`${exception.id}: approvedBy must be founder`);
    if (!isIsoDate(exception.approvedAt) || exception.approvedAt > asOf) {
      errors.push(`${exception.id}: founder approval must be recorded on or before ${asOf}`);
    }
    if (!isIsoDate(exception.expiresAt) || exception.expiresAt < asOf) {
      errors.push(`expired exception ${exception.id}`);
    }
    if (exception.approvedAt && exception.expiresAt && exception.approvedAt > exception.expiresAt) {
      errors.push(`${exception.id}: approval date must not follow expiry`);
    }
    if (!Array.isArray(exception.findingIds) || !exception.findingIds.length) {
      errors.push(`${exception.id}: linked findingIds are required`);
    } else if (new Set(exception.findingIds).size !== exception.findingIds.length) {
      errors.push(`${exception.id}: linked findingIds must be unique`);
    }
  }

  const validAcceptedFindingIds = new Set();
  for (const finding of findings) {
    const entry = experiencesById.get(finding.experienceId);
    if (entry) {
      if (!EXPERIENCE_STATES.includes(finding.state)) {
        errors.push(`${finding.id}: unknown state ${finding.state}`);
      }
      if (!entry.requiredBreakpoints.includes(finding.breakpoint)) {
        errors.push(`${finding.id}: breakpoint ${finding.breakpoint} is not required by ${entry.id}`);
      }
    }
    if (finding.status !== "accepted-exception") continue;
    if (!finding.exceptionId) {
      errors.push(`${finding.id}: accepted-exception requires exceptionId`);
      continue;
    }
    const exception = exceptionsById.get(finding.exceptionId);
    if (!exception) {
      errors.push(`${finding.id}: unknown exception ${finding.exceptionId}`);
      continue;
    }
    if (!isActiveFounderApprovedException(exception, asOf)) {
      errors.push(`${finding.id}: exception ${exception.id} is not active and founder-approved`);
      continue;
    }
    if (!exception.findingIds.includes(finding.id)) {
      errors.push(`${finding.id}: exception ${exception.id} does not include this finding`);
      continue;
    }
    validAcceptedFindingIds.add(finding.id);
  }

  for (const exception of exceptions) {
    for (const findingId of exception.findingIds ?? []) {
      const finding = findingsById.get(findingId);
      if (!finding) errors.push(`${exception.id}: unknown linked finding ${findingId}`);
      else if (finding.status !== "accepted-exception" || finding.exceptionId !== exception.id) {
        errors.push(`${exception.id}: finding ${findingId} does not link back as accepted-exception`);
      }
    }
  }

  const openFindings = findings.filter(
    (finding) => finding.status !== "resolved" && !validAcceptedFindingIds.has(finding.id),
  );
  const auditsByTuple = new Map();
  const auditIds = new Set();
  const validPassingAuditIds = new Set();

  for (const audit of audits) {
    let recordValid = true;
    const issue = (message) => {
      recordValid = false;
      errors.push(message);
    };
    if (auditIds.has(audit.id)) issue(`duplicate audit ${audit.id}`);
    auditIds.add(audit.id);
    const entry = experiencesById.get(audit.experienceId);
    if (!entry) {
      issue(`${audit.id}: unknown experience ${audit.experienceId}`);
      continue;
    }
    if (!EXPERIENCE_STATES.includes(audit.state)) {
      issue(`${audit.id}: unknown state ${audit.state}`);
    } else if (!entry.requiredStates.includes(audit.state)) {
      issue(`${audit.id}: state ${audit.state} is not required by ${entry.id}`);
    }
    if (!entry.requiredBreakpoints.includes(audit.breakpoint)) {
      issue(`${audit.id}: breakpoint ${audit.breakpoint} is not required by ${entry.id}`);
    }
    const tuple = auditTupleKey(audit.experienceId, audit.state, audit.breakpoint);
    const tupleAudits = auditsByTuple.get(tuple) ?? [];
    tupleAudits.push(audit);
    auditsByTuple.set(tuple, tupleAudits);

    const scoreKeys = Object.keys(audit.scores ?? {});
    const hasAllScores =
      scoreKeys.length === AUDIT_DIMENSIONS.length &&
      AUDIT_DIMENSIONS.every((dimension) => scoreKeys.includes(dimension));
    if (!hasAllScores) issue(`${audit.id}: all 13 audit dimensions are required`);
    const values = hasAllScores ? AUDIT_DIMENSIONS.map((dimension) => audit.scores[dimension]) : [];
    const scoresValid = values.length > 0 && values.every(
      (value) => Number.isInteger(value) && value >= 0 && value <= 4,
    );
    if (!scoresValid) issue(`${audit.id}: scores must be integers 0..4`);
    const calculated = scoresValid
      ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100
      : null;
    if (calculated !== null && calculated !== audit.overallScore) {
      issue(`${audit.id}: overallScore must be ${calculated}`);
    }
    const evidenceValid =
      Array.isArray(audit.evidence) &&
      audit.evidence.some((reference) => evidenceReferenceExists(reference));
    if (!evidenceValid) issue(`${audit.id}: current rendered evidence is required`);
    const blockers = openFindings.some(
      (finding) =>
        finding.experienceId === audit.experienceId &&
        finding.severity === "release-blocking",
    );
    const expectedPass = Boolean(
      scoresValid &&
      Math.min(...values) >= 3 &&
      calculated >= 3.5 &&
      evidenceValid &&
      !blockers,
    );
    if (audit.pass !== expectedPass) issue(`${audit.id}: pass must be ${expectedPass}`);
    if (recordValid && audit.pass) validPassingAuditIds.add(audit.id);
  }

  const duplicateAuditCells = [];
  for (const [tuple, tupleAudits] of auditsByTuple) {
    if (tupleAudits.length > 1) {
      duplicateAuditCells.push(tuple);
      errors.push(`${tuple}: duplicate audit tuple`);
    }
  }

  const requiredAuditCells = [];
  const missingAuditCells = [];
  const nonPassingAuditCells = [];
  const provenPassingExperienceIds = new Set();
  let passingAuditCells = 0;
  for (const entry of registry.experiences) {
    let experiencePasses = true;
    for (const state of entry.requiredStates) {
      for (const breakpoint of entry.requiredBreakpoints) {
        const tuple = auditTupleKey(entry.id, state, breakpoint);
        requiredAuditCells.push(tuple);
        const tupleAudits = auditsByTuple.get(tuple) ?? [];
        if (!tupleAudits.length) missingAuditCells.push(tuple);
        const passes =
          tupleAudits.length === 1 &&
          validPassingAuditIds.has(tupleAudits[0].id);
        if (passes) passingAuditCells += 1;
        else {
          experiencePasses = false;
          nonPassingAuditCells.push(tuple);
        }
      }
    }
    if (experiencePasses) provenPassingExperienceIds.add(entry.id);
  }

  const falsePassingExperienceIds = registry.experiences
    .filter(
      (entry) =>
        entry.auditStatus === "passing" &&
        !provenPassingExperienceIds.has(entry.id),
    )
    .map((entry) => entry.id);
  for (const id of falsePassingExperienceIds) {
    errors.push(`${id}: auditStatus passing is not backed by a complete passing audit matrix`);
  }

  return {
    errors,
    openFindings,
    validAcceptedFindingIds,
    requiredAuditCells,
    missingAuditCells,
    nonPassingAuditCells,
    duplicateAuditCells,
    passingAuditCells,
    provenPassingExperienceIds,
    falsePassingExperienceIds,
  };
}
