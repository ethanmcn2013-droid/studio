import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { approveExistingCandidates, capturePlanErrors } from "./capture-approval.mjs";

const APPROVER = "Ethan McNamara (delegated to Codex)";
const APPROVED_AT = "2026-07-15T21:30:00.000Z";

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function makeFixture(overrides = {}) {
  const root = mkdtempSync(path.join(tmpdir(), "signal-capture-approval-"));
  const experienceRoot = path.join(root, "experience");
  const outputRoot = path.join(experienceRoot, "output");
  const candidateRelative = "screenshots/studio-page-root/default/mobile.png";
  const baselineRelative = "baselines/studio-page-root/default/mobile.png";
  const candidateFile = path.join(outputRoot, ...candidateRelative.split("/"));
  const candidate = Buffer.from("reviewed candidate bytes");
  mkdirSync(path.dirname(candidateFile), { recursive: true });
  writeFileSync(candidateFile, candidate);

  const result = {
    experienceId: "studio.page.root",
    product: "studio",
    state: "default",
    breakpoint: "mobile",
    viewport: { width: 390, height: 844 },
    url: "https://signalstudio.ie/",
    status: 200,
    navigationError: null,
    candidateScreenshot: candidateRelative,
    baselineScreenshot: null,
    diffScreenshot: null,
    candidateHash: sha256(candidate),
    visual: { state: "missing", changedPixels: null, ratio: null },
    accessibility: { violations: 0, blocking: 0, ruleIds: [], details: [] },
    runtime: { overflowPixels: 0, focusTarget: "a", navigation: null, consoleErrors: [], pageErrors: [] },
    pass: true,
    ...overrides.result,
  };
  const registry = {
    experiences: [{ id: result.experienceId, requiredStates: ["default"], ...overrides.registryEntry }],
  };
  const review = {
    experienceId: result.experienceId,
    product: result.product,
    state: result.state,
    breakpoint: result.breakpoint,
    candidateScreenshot: candidateRelative,
    baselineScreenshot: baselineRelative,
    status: "approved",
    approvalHistory: [{ status: "approved", actor: APPROVER, at: APPROVED_AT, note: "Reviewed at all required gates." }],
    ...overrides.review,
  };
  const manifest = {
    schemaVersion: "signal-experience-capture/1",
    capturedAt: "2026-07-15T21:00:00.000Z",
    approvedBy: null,
    determinism: {},
    summary: { captures: 1, passing: 1, requiringReview: 0, visualChanges: 0, missingBaselines: 1 },
    results: [result],
  };
  return { root, experienceRoot, outputRoot, candidate, baselineRelative, registry, reviews: { reviews: [review] }, manifest };
}

function withFixture(overrides, run) {
  const fixture = makeFixture(overrides);
  try {
    return run(fixture);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
}

test("capture plan state must be declared by the registry", () => {
  assert.deepEqual(
    capturePlanErrors({
      plan: { pilotSet: [{ experienceId: "studio.page.root", state: "populated" }] },
      registry: { experiences: [{ id: "studio.page.root", requiredStates: ["default"] }] },
    }),
    ["studio.page.root: capture state populated is not declared in requiredStates (default)"],
  );
});

test("approval promotes the exact reviewed candidate and records per-result provenance", () =>
  withFixture({}, (fixture) => {
    const approved = approveExistingCandidates({
      ...fixture,
      approvedBy: APPROVER,
      approvedAt: APPROVED_AT,
      selectedExperience: "studio.page.root",
    });
    const result = approved.results[0];
    const baselineFile = path.join(fixture.experienceRoot, ...fixture.baselineRelative.split("/"));
    assert.deepEqual(readFileSync(baselineFile), fixture.candidate);
    assert.equal(result.baselineScreenshot, fixture.baselineRelative);
    assert.equal(result.visual.state, "approved");
    assert.equal(result.approvedBy, APPROVER);
    assert.equal(result.approvedAt, APPROVED_AT);
    assert.equal(result.approvedCandidateHash, fixture.manifest.results[0].candidateHash);
    assert.equal(approved.approvedBy, APPROVER);
    assert.equal(approved.summary.missingBaselines, 0);
  }));

test("approval refuses a failed capture even when a review says approved", () =>
  withFixture({ result: { pass: false } }, (fixture) => {
    assert.throws(
      () => approveExistingCandidates({ ...fixture, approvedBy: APPROVER, approvedAt: APPROVED_AT }),
      /capture is not passing/,
    );
  }));

test("approval refuses console errors that the legacy pass flag did not include", () =>
  withFixture({ result: { runtime: { overflowPixels: 0, consoleErrors: ["boom"], pageErrors: [] } } }, (fixture) => {
    assert.throws(
      () => approveExistingCandidates({ ...fixture, approvedBy: APPROVER, approvedAt: APPROVED_AT }),
      /console errors are present/,
    );
  }));

test("approval refuses candidate bytes that do not match the manifest hash", () =>
  withFixture({ result: { candidateHash: "0".repeat(64) } }, (fixture) => {
    assert.throws(
      () => approveExistingCandidates({ ...fixture, approvedBy: APPROVER, approvedAt: APPROVED_AT }),
      /candidate hash does not match/,
    );
  }));

test("approval refuses a review by a different actor", () =>
  withFixture(
    { review: { approvalHistory: [{ status: "approved", actor: "someone else", at: APPROVED_AT, note: "No." }] } },
    (fixture) => {
      assert.throws(
        () => approveExistingCandidates({ ...fixture, approvedBy: APPROVER, approvedAt: APPROVED_AT }),
        /matching approved review/,
      );
    },
  ));

test("approved review history is structured and includes an approved entry", () => {
  const schema = JSON.parse(readFileSync(path.resolve("experience/schemas/review.schema.json"), "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const review = {
    schemaVersion: "signal-review/2",
    id: "review-studio-root-mobile",
    experienceId: "studio.page.root",
    product: "studio",
    routeOrTrigger: "/",
    state: "default",
    breakpoint: "mobile",
    baselineScreenshot: "baselines/studio-page-root/default/mobile.png",
    candidateScreenshot: "screenshots/studio-page-root/default/mobile.png",
    diffScreenshot: null,
    scoreBefore: null,
    scoreAfter: 4,
    findingIds: [],
    annotations: ["Founder-delegated visual review complete."],
    severity: null,
    owner: "product-taste-design-integrity",
    approvalHistory: [{ status: "approved", actor: APPROVER, at: APPROVED_AT, note: "Approved." }],
    resolutionEvidence: [],
    status: "approved",
    designSystemReferences: ["docs/experience/SIGNAL_EXPERIENCE_STANDARD.md"],
    codeReferences: ["src/app/page.tsx"],
    changeReferences: ["64ec7e7"],
  };
  assert.equal(validate(review), true, JSON.stringify(validate.errors));
  review.approvalHistory = [{ status: "captured", actor: APPROVER, at: APPROVED_AT, note: "Captured." }];
  assert.equal(validate(review), false);
});
