import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { AUDIT_DIMENSIONS } from "./lib.mjs";
import { evaluateAuditProof, isRenderedEvidenceReference } from "./gate.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const scores = Object.fromEntries(AUDIT_DIMENSIONS.map((dimension) => [dimension, 4]));

function experience(auditStatus = "registered") {
  return {
    id: "studio.page.test",
    product: "studio",
    requiredStates: ["default"],
    requiredBreakpoints: ["mobile"],
    auditStatus,
  };
}

function audit(overrides = {}) {
  return {
    id: "audit-test-default-mobile",
    experienceId: "studio.page.test",
    state: "default",
    breakpoint: "mobile",
    scores,
    overallScore: 4,
    evidence: ["proof.png"],
    reviewer: "founder",
    reviewedAt: "2026-07-15",
    pass: true,
    ...overrides,
  };
}

function finding(overrides = {}) {
  return {
    id: "dq-test-blocker",
    experienceId: "studio.page.test",
    product: "studio",
    state: "default",
    breakpoint: "mobile",
    severity: "release-blocking",
    status: "accepted-exception",
    ...overrides,
  };
}

function exception(overrides = {}) {
  return {
    id: "exception-test-blocker",
    findingIds: ["dq-test-blocker"],
    rationale: "Temporary controlled risk.",
    owner: "founder",
    scope: "studio.page.test",
    approvedBy: "founder",
    approvedAt: "2026-07-15",
    approvalSource: "content/hq/decisions/test.md",
    expiresAt: "2026-08-15",
    remediationPlan: "Remove the exception after remediation.",
    ...overrides,
  };
}

function evaluate({
  entry = experience(),
  auditRecords = [audit()],
  findingRecords = [],
  exceptionRecords = [],
  evidenceReferenceExists = () => true,
} = {}) {
  return evaluateAuditProof({
    registry: { experiences: [entry] },
    audits: auditRecords,
    findings: findingRecords,
    exceptions: exceptionRecords,
    asOf: "2026-07-15",
    root,
    evidenceReferenceExists,
  });
}

test("registry passing cannot certify an empty audit matrix", () => {
  const result = evaluate({ entry: experience("passing"), auditRecords: [] });
  assert.equal(result.requiredAuditCells.length, 1);
  assert.equal(result.missingAuditCells.length, 1);
  assert.equal(result.provenPassingExperienceIds.size, 0);
  assert.deepEqual(result.falsePassingExperienceIds, ["studio.page.test"]);
  assert(result.errors.some((error) => error.includes("not backed by a complete passing audit matrix")));
});

test("an audit state must be canonical and required by its experience", () => {
  const unknown = evaluate({ auditRecords: [audit({ state: "invented-state" })] });
  assert(unknown.errors.some((error) => error.includes("unknown state invented-state")));
  assert.equal(unknown.provenPassingExperienceIds.size, 0);

  const unrequired = evaluate({ auditRecords: [audit({ state: "success" })] });
  assert(unrequired.errors.some((error) => error.includes("state success is not required")));
  assert.equal(unrequired.provenPassingExperienceIds.size, 0);
});

test("duplicate audit tuples cannot satisfy the matrix", () => {
  const result = evaluate({
    auditRecords: [audit(), audit({ id: "audit-test-duplicate" })],
  });
  assert.equal(result.duplicateAuditCells.length, 1);
  assert.equal(result.provenPassingExperienceIds.size, 0);
  assert(result.errors.some((error) => error.includes("duplicate audit tuple")));
});

test("a passing audit requires a current rendered artifact", () => {
  const result = evaluate({ evidenceReferenceExists: () => false });
  assert.equal(result.provenPassingExperienceIds.size, 0);
  assert(result.errors.some((error) => error.includes("current rendered evidence is required")));
  assert(result.errors.some((error) => error.includes("pass must be false")));
});

test("rendered evidence is content-addressed and stale bytes fail closed", () => {
  const evidenceRoot = mkdtempSync(path.join(tmpdir(), "signal-rendered-evidence-"));
  try {
    const file = path.join(evidenceRoot, "proof.png");
    const original = Buffer.from("rendered proof bytes");
    writeFileSync(file, original);
    const hash = createHash("sha256").update(original).digest("hex");
    assert.equal(isRenderedEvidenceReference(`proof.png#sha256=${hash}`, evidenceRoot), true);
    assert.equal(isRenderedEvidenceReference("proof.png", evidenceRoot), false);
    writeFileSync(file, Buffer.from("stale replacement bytes"));
    assert.equal(isRenderedEvidenceReference(`proof.png#sha256=${hash}`, evidenceRoot), false);
  } finally {
    rmSync(evidenceRoot, { recursive: true, force: true });
  }
});

test("only a linked active founder-approved exception clears a release blocker", () => {
  const acceptedFinding = finding({ exceptionId: "exception-test-blocker" });
  const result = evaluate({
    findingRecords: [acceptedFinding],
    exceptionRecords: [exception()],
  });
  assert.equal(result.errors.length, 0);
  assert.equal(result.validAcceptedFindingIds.has(acceptedFinding.id), true);
  assert.equal(result.openFindings.length, 0);
  assert.equal(result.provenPassingExperienceIds.has("studio.page.test"), true);
});

for (const [label, findingPatch, exceptionPatch, expected] of [
  ["missing link", {}, {}, "requires exceptionId"],
  ["unknown link", { exceptionId: "exception-unknown" }, {}, "unknown exception"],
  ["expired", { exceptionId: "exception-test-blocker" }, { expiresAt: "2026-07-14" }, "expired exception"],
  ["non-founder approval", { exceptionId: "exception-test-blocker" }, { approvedBy: "agent" }, "approvedBy must be founder"],
  ["out-of-scope link", { exceptionId: "exception-test-blocker" }, { findingIds: ["dq-other"] }, "does not include this finding"],
]) {
  test(`accepted exception fails closed for ${label}`, () => {
    const exceptionRecords = label === "missing link" || label === "unknown link"
      ? []
      : [exception(exceptionPatch)];
    const result = evaluate({
      findingRecords: [finding(findingPatch)],
      exceptionRecords,
    });
    assert.equal(result.provenPassingExperienceIds.size, 0);
    assert(result.errors.some((error) => error.includes(expected)), result.errors.join("\n"));
  });
}

test("the founder-requested score anchors are pinned exactly", () => {
  const rubric = readFileSync(path.join(root, "docs", "experience", "AUDIT_RUBRIC.md"), "utf8");
  for (const row of [
    "| 0 | Broken or absent |",
    "| 1 | Functional but materially deficient |",
    "| 2 | Competent |",
    "| 3 | Polished |",
    "| 4 | Studio-grade |",
  ]) {
    assert.match(rubric, new RegExp(row.replace(/[|\-]/g, "\\$&")));
  }
});
