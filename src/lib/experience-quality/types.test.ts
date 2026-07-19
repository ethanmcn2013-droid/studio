import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AUDIT_DIMENSIONS,
  type AuditScores,
  type ExperienceException,
  type ExperienceFinding,
  meetsStudioGradeGate,
} from "./types";

const scores = Object.fromEntries(
  AUDIT_DIMENSIONS.map((dimension) => [dimension, 4]),
) as AuditScores;
const renderedAudit = {
  scores,
  evidence: [`experience/baselines/test.png#sha256=${"0".repeat(64)}`],
};
const blocker: ExperienceFinding = {
  id: "dq-test-blocker",
  experienceId: "studio.page.test",
  product: "studio",
  surface: "/test",
  state: "default",
  breakpoint: "mobile",
  dimension: "implementation-fidelity",
  severity: "release-blocking",
  evidence: ["Rendered test evidence"],
  violatedStandard: "docs/experience/AUDIT_RUBRIC.md",
  impact: "The experience cannot ship.",
  recommendation: "Resolve the blocker.",
  scope: "local",
  confidence: 1,
  owner: "founder",
  status: "accepted-exception",
  resolutionEvidence: [],
  source: "human-review",
  createdAt: "2026-07-15",
  resolvedAt: null,
};
const approvedException: ExperienceException = {
  id: "exception-test-blocker",
  findingIds: [blocker.id],
  rationale: "Temporary controlled risk.",
  owner: "founder",
  scope: blocker.experienceId,
  approvedBy: "founder",
  approvedAt: "2026-07-15",
  approvalSource: "content/hq/decisions/test.md",
  expiresAt: "2026-08-15",
  remediationPlan: "Resolve the blocker and remove the exception.",
};

test("the TypeScript gate fails without rendered evidence", () => {
  assert.equal(meetsStudioGradeGate({ scores, evidence: [] }, []), false);
  assert.equal(meetsStudioGradeGate({ scores, evidence: ["   "] }, []), false);
  assert.equal(meetsStudioGradeGate({ scores, evidence: ["experience/baselines/test.png"] }, []), false);
  assert.equal(meetsStudioGradeGate(renderedAudit, []), true);
});

test("the TypeScript gate rejects unlinked accepted exceptions", () => {
  assert.equal(meetsStudioGradeGate(renderedAudit, [blocker], [], "2026-07-15"), false);
  assert.equal(
    meetsStudioGradeGate(
      renderedAudit,
      [{ ...blocker, exceptionId: approvedException.id }],
      [approvedException],
      "2026-07-15",
    ),
    true,
  );
});

test("the TypeScript gate rejects expired or non-founder exceptions", () => {
  const linked = { ...blocker, exceptionId: approvedException.id };
  assert.equal(
    meetsStudioGradeGate(
      renderedAudit,
      [linked],
      [{ ...approvedException, expiresAt: "2026-07-14" }],
      "2026-07-15",
    ),
    false,
  );
  assert.equal(
    meetsStudioGradeGate(
      renderedAudit,
      [linked],
      [{ ...approvedException, approvedBy: "agent" as "founder" }],
      "2026-07-15",
    ),
    false,
  );
});
