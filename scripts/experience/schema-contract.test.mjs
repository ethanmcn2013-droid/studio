import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { AUDIT_DIMENSIONS } from "./lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const schemas = path.join(root, "experience", "schemas");
const ajv = new Ajv2020({ allErrors: true, strict: true, strictRequired: false });
addFormats(ajv);
const compile = (name) => ajv.compile(JSON.parse(readFileSync(path.join(schemas, name), "utf8")));
const validateAudit = compile("audit.schema.json");
const validateFinding = compile("finding.schema.json");
const validateException = compile("exception.schema.json");
const validateRegistry = compile("registry.schema.json");
const scores = Object.fromEntries(AUDIT_DIMENSIONS.map((dimension) => [dimension, 4]));

const audit = {
  id: "audit-test",
  experienceId: "studio.page.test",
  state: "default",
  breakpoint: "mobile",
  scores,
  overallScore: 4,
  evidence: ["experience/baselines/test.png"],
  reviewer: "founder",
  reviewedAt: "2026-07-15",
  pass: true,
};

const registry = {
  schemaVersion: "signal-experience/1",
  generatedAt: "2026-07-15",
  breakpoints: {
    mobile: { width: 390, height: 844 },
    tablet: { width: 768, height: 1024 },
    desktop: { width: 1280, height: 900 },
    wide: { width: 1440, height: 960 },
  },
  experiences: [
    {
      id: "studio.page.test",
      product: "studio",
      experienceClass: "company-public",
      surfaceType: "page",
      route: "/test",
      source: "studio/src/app/test/page.tsx",
      parentJourney: "test",
      archetype: "public-information-and-proof",
      primaryJob: "Test the schema.",
      primaryAction: "Finish testing.",
      roles: ["public"],
      requiredStates: ["default"],
      requiredBreakpoints: ["mobile", "tablet", "desktop", "wide"],
      reviewTier: "supporting",
      designOwner: "founder",
      engineeringOwner: "founder",
      implementationStatus: "live",
      auditStatus: "registered",
      auditScore: null,
      openFindingIds: [],
      automatedTestCoverage: "none",
      screenshotCoverage: "none",
      accessibilityCoverage: "none",
      fixtureCoverage: "none",
      lastReviewedAt: null,
      approvedBaselineReference: null,
      intentionalExceptions: [],
      materialityHash: "0123456789abcdef",
    },
  ],
};

const acceptedFinding = {
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
  impact: "The test blocks release.",
  recommendation: "Fix it.",
  scope: "local",
  confidence: 1,
  owner: "founder",
  status: "accepted-exception",
  resolutionEvidence: [],
  source: "human-review",
  createdAt: "2026-07-15",
  resolvedAt: null,
};

const approvedException = {
  id: "exception-test-blocker",
  findingIds: ["dq-test-blocker"],
  rationale: "Temporary controlled risk.",
  owner: "founder",
  scope: "studio.page.test",
  approvedBy: "founder",
  approvedAt: "2026-07-15",
  approvalSource: "content/hq/decisions/test.md",
  expiresAt: "2026-08-15",
  remediationPlan: "Fix and remove the exception.",
};

test("audit schema rejects arbitrary states and blank evidence", () => {
  assert.equal(validateAudit(audit), true, JSON.stringify(validateAudit.errors));
  assert.equal(validateAudit({ ...audit, state: "invented-state" }), false);
  assert.equal(validateAudit({ ...audit, evidence: ["   "] }), false);
});

test("registry schema rejects arbitrary or duplicate states", () => {
  assert.equal(validateRegistry(registry), true, JSON.stringify(validateRegistry.errors));
  const arbitrary = structuredClone(registry);
  arbitrary.experiences[0].requiredStates = ["invented-state"];
  assert.equal(validateRegistry(arbitrary), false);
  const duplicate = structuredClone(registry);
  duplicate.experiences[0].requiredStates = ["default", "default"];
  assert.equal(validateRegistry(duplicate), false);
});

test("accepted-exception findings require an explicit exception link", () => {
  assert.equal(validateFinding(acceptedFinding), false);
  assert.equal(
    validateFinding({ ...acceptedFinding, exceptionId: "exception-test-blocker" }),
    true,
    JSON.stringify(validateFinding.errors),
  );
});

test("exception schema requires explicit founder approval and linked findings", () => {
  assert.equal(validateException(approvedException), true, JSON.stringify(validateException.errors));
  const { approvedBy: _approvedBy, ...withoutApprover } = approvedException;
  assert.equal(validateException(withoutApprover), false);
  assert.equal(validateException({ ...approvedException, approvedBy: "agent" }), false);
  assert.equal(validateException({ ...approvedException, findingIds: [] }), false);
});
