import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
} from "node:fs";
import path from "node:path";

const APPROVED_REVIEW_STATUSES = new Set(["approved"]);

function normaliseRelative(file) {
  return String(file ?? "").replaceAll("\\", "/");
}

function resolveEvidenceFile(root, relative, requiredPrefix) {
  const normalised = normaliseRelative(relative);
  if (
    !normalised ||
    path.isAbsolute(normalised) ||
    !normalised.startsWith(`${requiredPrefix}/`) ||
    normalised.split("/").includes("..")
  ) {
    throw new Error(`unsafe ${requiredPrefix} evidence path: ${relative ?? "<missing>"}`);
  }
  const base = path.resolve(root);
  const resolved = path.resolve(base, ...normalised.split("/"));
  if (!resolved.startsWith(`${base}${path.sep}`)) {
    throw new Error(`evidence path escapes ${base}: ${relative}`);
  }
  return { normalised, resolved };
}

function hashFile(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function resultKey(result) {
  return `${result.experienceId}:${result.state}:${result.breakpoint}`;
}

function captureResultFailure(result) {
  if (result.pass !== true) return "capture is not passing";
  if (result.navigationError) return `navigation failed: ${result.navigationError}`;
  if (!Number.isInteger(result.status) || result.status < 200 || result.status >= 300) {
    return `HTTP status is ${result.status ?? "missing"}`;
  }
  if (result.accessibility?.blocking !== 0) {
    return `${result.accessibility?.blocking ?? "unknown"} blocking accessibility violations`;
  }
  if (result.runtime?.overflowPixels !== 0) {
    return `${result.runtime?.overflowPixels ?? "unknown"}px horizontal overflow`;
  }
  if ((result.runtime?.consoleErrors?.length ?? 0) > 0) return "console errors are present";
  if ((result.runtime?.pageErrors?.length ?? 0) > 0) return "page errors are present";
  return null;
}

function matchingApprovedReview({ reviews, result, baselineRelative, approvedBy }) {
  return reviews.find((review) => {
    if (
      review.experienceId !== result.experienceId ||
      review.product !== result.product ||
      review.state !== result.state ||
      review.breakpoint !== result.breakpoint ||
      normaliseRelative(review.candidateScreenshot) !== normaliseRelative(result.candidateScreenshot) ||
      normaliseRelative(review.baselineScreenshot) !== baselineRelative ||
      !APPROVED_REVIEW_STATUSES.has(review.status)
    ) {
      return false;
    }
    return review.approvalHistory?.some(
      (entry) =>
        entry.status === "approved" &&
        entry.actor === approvedBy &&
        typeof entry.note === "string" &&
        entry.note.trim().length > 0 &&
        !Number.isNaN(Date.parse(entry.at)),
    );
  });
}

export function capturePlanErrors({ plan, registry }) {
  const byId = new Map(registry.experiences.map((entry) => [entry.id, entry]));
  const errors = [];
  for (const item of plan.pilotSet) {
    const experience = byId.get(item.experienceId);
    if (!experience) {
      errors.push(`unknown experience ${item.experienceId}`);
      continue;
    }
    if (!experience.requiredStates.includes(item.state)) {
      errors.push(
        `${item.experienceId}: capture state ${item.state} is not declared in requiredStates (${experience.requiredStates.join(", ")})`,
      );
    }
  }
  return errors;
}

export function manifestApprovedBy(results) {
  if (!results.length || results.some((result) => !result.approvedBy || !result.approvedCandidateHash)) {
    return null;
  }
  const approvers = new Set(results.map((result) => result.approvedBy));
  return approvers.size === 1 ? [...approvers][0] : null;
}

export function approvalProvenanceForBaseline({ previousResult, baselineFile }) {
  if (
    !previousResult?.approvedBy ||
    !previousResult?.approvedAt ||
    !previousResult?.approvedCandidateHash ||
    !existsSync(baselineFile) ||
    hashFile(baselineFile) !== previousResult.approvedCandidateHash
  ) {
    return {};
  }
  return {
    approvedBy: previousResult.approvedBy,
    approvedAt: previousResult.approvedAt,
    approvedCandidateHash: previousResult.approvedCandidateHash,
  };
}

export function approveExistingCandidates({
  experienceRoot,
  outputRoot,
  manifest,
  reviews,
  registry,
  approvedBy,
  selectedExperience,
  selectedBreakpoint,
  approvedAt = new Date().toISOString(),
}) {
  if (!approvedBy?.trim()) throw new Error("SIGNAL_EXPERIENCE_BASELINE_APPROVED_BY is required");
  if (Number.isNaN(Date.parse(approvedAt))) throw new Error(`invalid approval timestamp: ${approvedAt}`);

  const registryById = new Map(registry.experiences.map((entry) => [entry.id, entry]));
  const selected = manifest.results.filter(
    (result) =>
      (!selectedExperience || result.experienceId === selectedExperience) &&
      (!selectedBreakpoint || result.breakpoint === selectedBreakpoint),
  );
  if (!selected.length) {
    throw new Error(
      `no captured candidates match ${selectedExperience ?? "all experiences"}/${selectedBreakpoint ?? "all breakpoints"}`,
    );
  }

  const approvals = selected.map((result) => {
    const key = resultKey(result);
    const experience = registryById.get(result.experienceId);
    if (!experience) throw new Error(`${key}: experience is not registered`);
    if (!experience.requiredStates.includes(result.state)) {
      throw new Error(`${key}: state is not declared by the registry`);
    }
    const failure = captureResultFailure(result);
    if (failure) throw new Error(`${key}: cannot approve because ${failure}`);

    const candidate = resolveEvidenceFile(outputRoot, result.candidateScreenshot, "screenshots");
    if (!existsSync(candidate.resolved)) throw new Error(`${key}: candidate file is missing`);
    const candidateHash = hashFile(candidate.resolved);
    if (!result.candidateHash || candidateHash !== result.candidateHash) {
      throw new Error(`${key}: candidate hash does not match the manifest`);
    }

    const baselineRelative = candidate.normalised.replace(/^screenshots\//, "baselines/");
    const baseline = resolveEvidenceFile(experienceRoot, baselineRelative, "baselines");
    const review = matchingApprovedReview({
      reviews: reviews.reviews,
      result,
      baselineRelative,
      approvedBy: approvedBy.trim(),
    });
    if (!review) {
      throw new Error(`${key}: matching approved review by ${approvedBy.trim()} is required`);
    }
    return { result, candidate, baseline, baselineRelative, candidateHash };
  });

  for (const approval of approvals) {
    mkdirSync(path.dirname(approval.baseline.resolved), { recursive: true });
    copyFileSync(approval.candidate.resolved, approval.baseline.resolved);
  }

  const approvedKeys = new Map(approvals.map((approval) => [resultKey(approval.result), approval]));
  const results = manifest.results.map((result) => {
    const approval = approvedKeys.get(resultKey(result));
    if (!approval) return result;
    return {
      ...result,
      baselineScreenshot: approval.baselineRelative,
      visual: { ...result.visual, state: "approved" },
      approvedBy: approvedBy.trim(),
      approvedAt,
      approvedCandidateHash: approval.candidateHash,
    };
  });

  return {
    ...manifest,
    approvedBy: manifestApprovedBy(results),
    summary: {
      captures: results.length,
      passing: results.filter((result) => result.pass).length,
      requiringReview: results.filter((result) => !result.pass).length,
      visualChanges: results.filter((result) => result.visual.state === "changed").length,
      missingBaselines: results.filter((result) => !result.baselineScreenshot).length,
    },
    results,
  };
}
