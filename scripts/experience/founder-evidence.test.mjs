import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { AUDIT_DIMENSIONS } from "./lib.mjs";
import {
  FOUNDER_APPROVER,
  REQUIRED_BREAKPOINTS,
  approvedGoldenSetEvidenceErrors,
  createSchemaValidator,
  finalizeFounderEvidence,
  prepareFounderAudits,
  prepareFounderReviews,
} from "./founder-evidence.mjs";

const APPROVED_AT = "2026-07-15T22:30:00.000Z";
const APPROVAL_SOURCE = "content/hq/decisions/founder-authorization.md";
const SCORING_SOURCE = "content/hq/decisions/specialist-score-receipt.md";
const SCORING_REVIEWER = "Codex independent visual review";
const ONE_PIXEL_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function scores(value = 4) {
  return Object.fromEntries(AUDIT_DIMENSIONS.map((dimension) => [dimension, value]));
}

function clone(value) {
  return structuredClone(value);
}

function makeFixture() {
  const root = mkdtempSync(path.join(tmpdir(), "signal-founder-evidence-"));
  const experienceRoot = path.join(root, "experience");
  const outputRoot = path.join(experienceRoot, "output");
  mkdirSync(path.join(experienceRoot, "schemas"), { recursive: true });
  for (const schema of ["review.schema.json", "audit.schema.json", "golden-set.schema.json"]) {
    copyFileSync(
      path.resolve("experience", "schemas", schema),
      path.join(experienceRoot, "schemas", schema),
    );
  }
  const approvalFile = path.join(root, ...APPROVAL_SOURCE.split("/"));
  mkdirSync(path.dirname(approvalFile), { recursive: true });
  writeFileSync(approvalFile, "Founder authorization evidence.\n");
  const scoringFile = path.join(root, ...SCORING_SOURCE.split("/"));
  mkdirSync(path.dirname(scoringFile), { recursive: true });
  writeFileSync(scoringFile, "Independent specialist score evidence.\n");

  const entry = {
    id: "studio.page.design",
    product: "studio",
    route: "/design",
    source: "studio/src/app/design/page.tsx",
    designOwner: "product-taste-design-integrity",
    requiredStates: ["default"],
    requiredBreakpoints: REQUIRED_BREAKPOINTS,
  };
  const results = REQUIRED_BREAKPOINTS.map((breakpoint) => {
    const relative = `screenshots/studio-page-design/default/${breakpoint}.png`;
    const file = path.join(outputRoot, ...relative.split("/"));
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, ONE_PIXEL_PNG);
    return {
      experienceId: entry.id,
      product: entry.product,
      state: "default",
      breakpoint,
      viewport: { width: 390, height: 844 },
      url: "https://signalstudio.ie/design",
      status: 200,
      navigationError: null,
      candidateScreenshot: relative,
      baselineScreenshot: null,
      diffScreenshot: null,
      candidateHash: sha256(ONE_PIXEL_PNG),
      visual: { state: "missing", changedPixels: null, ratio: null },
      accessibility: { violations: 0, blocking: 0, ruleIds: [], details: [] },
      runtime: { overflowPixels: 0, consoleErrors: [], pageErrors: [] },
      pass: true,
    };
  });
  const manifest = {
    schemaVersion: "signal-experience-capture/1",
    capturedAt: APPROVED_AT,
    results,
  };
  const registry = { experiences: [entry] };
  const config = {
    schemaVersion: "signal-founder-evidence-config/1",
    approval: {
      actor: FOUNDER_APPROVER,
      approvedAt: APPROVED_AT,
      approvalSource: APPROVAL_SOURCE,
      note: "Founder approved the exact captured candidates.",
    },
    reviewSelections: [{ experienceId: entry.id, state: "default" }],
    goldenSet: {
      approvalTask: "approve-experience-golden-set",
      scoredBy: SCORING_REVIEWER,
      scoredAt: "2026-07-15",
      scoringSource: SCORING_SOURCE,
      references: [{
        experienceId: entry.id,
        state: "default",
        scoresByBreakpoint: Object.fromEntries(REQUIRED_BREAKPOINTS.map((breakpoint) => [breakpoint, scores()])),
      }],
    },
  };
  return {
    root,
    repoRoot: root,
    experienceRoot,
    outputRoot,
    manifest,
    registry,
    config,
    reviewsCollection: { schemaVersion: "signal-review-collection/1", reviews: [{ id: "unrelated" }] },
    auditsCollection: { schemaVersion: "signal-experience-audits/1", audits: [] },
    findingsCollection: { findings: [] },
    overrides: { schemaVersion: "signal-experience-overrides/1", experiences: {} },
  };
}

function withFixture(run) {
  const fixture = makeFixture();
  try {
    return run(fixture);
  } finally {
    rmSync(fixture.root, { recursive: true, force: true });
  }
}

function prepareReviews(fixture, overrides = {}) {
  return prepareFounderReviews({
    repoRoot: fixture.root,
    outputRoot: fixture.outputRoot,
    manifest: fixture.manifest,
    registry: fixture.registry,
    reviewsCollection: fixture.reviewsCollection,
    config: fixture.config,
    ...overrides,
  });
}

function copyBaselines(fixture) {
  for (const result of fixture.manifest.results) {
    const baseline = result.candidateScreenshot.replace(/^screenshots\//, "baselines/");
    const source = path.join(fixture.outputRoot, ...result.candidateScreenshot.split("/"));
    const destination = path.join(fixture.experienceRoot, ...baseline.split("/"));
    mkdirSync(path.dirname(destination), { recursive: true });
    copyFileSync(source, destination);
    result.baselineScreenshot = baseline;
    result.visual.state = "approved";
    result.approvedBy = FOUNDER_APPROVER;
    result.approvedAt = APPROVED_AT;
    result.approvedCandidateHash = result.candidateHash;
  }
}

test("review preparation verifies exact candidates and idempotently upserts schema-valid founder records", () =>
  withFixture((fixture) => {
    const prepared = prepareReviews(fixture);
    assert.equal(prepared.preparedIds.length, 4);
    assert.equal(prepared.collection.reviews.length, 5);
    const mobile = prepared.collection.reviews.find((review) => review.breakpoint === "mobile");
    assert.equal(mobile.candidateScreenshot, "screenshots/studio-page-design/default/mobile.png");
    assert.equal(mobile.baselineScreenshot, "baselines/studio-page-design/default/mobile.png");
    assert.equal(mobile.approvalHistory[0].actor, FOUNDER_APPROVER);
    assert.ok(mobile.changeReferences.includes(APPROVAL_SOURCE));
    assert.match(mobile.annotations.join("\n"), /Candidate SHA-256:/);

    const withHistory = clone(prepared.collection);
    withHistory.reviews.find((review) => review.id === mobile.id).approvalHistory.unshift({
      status: "captured",
      actor: "Codex capture runner",
      at: "2026-07-15T22:00:00.000Z",
      note: "Candidate captured for founder review.",
    });
    const repeated = prepareReviews(fixture, { reviewsCollection: withHistory });
    assert.equal(repeated.collection.reviews.length, 5);
    assert.deepEqual(repeated.preparedIds, prepared.preparedIds);
    assert.equal(repeated.collection.reviews.find((review) => review.id === mobile.id).approvalHistory.length, 2);
  }));

test("review preparation fails closed on pass, hash, Axe, overflow, console, page, and path evidence", () =>
  withFixture((fixture) => {
    const cases = [
      ["pass", (result) => { result.pass = false; }],
      ["hash", (result) => { result.candidateHash = "0".repeat(64); }],
      ["Axe", (result) => { result.accessibility.violations = 1; result.accessibility.ruleIds = ["image-alt"]; }],
      ["overflow", (result) => { result.runtime.overflowPixels = 1; }],
      ["console", (result) => { result.runtime.consoleErrors = ["boom"]; }],
      ["page", (result) => { result.runtime.pageErrors = ["boom"]; }],
      ["path", (result) => { result.candidateScreenshot = "screenshots/not-the-candidate.png"; }],
    ];
    for (const [label, mutate] of cases) {
      const manifest = clone(fixture.manifest);
      mutate(manifest.results[0]);
      assert.throws(
        () => prepareReviews(fixture, { manifest }),
        undefined,
        `${label} evidence should be rejected`,
      );
    }
  }));

test("audit preparation requires copied baselines and uses only the supplied passing score matrix", () =>
  withFixture((fixture) => {
    const reviews = prepareReviews(fixture).collection;
    assert.throws(
      () => prepareFounderAudits({
        ...fixture,
        reviewsCollection: reviews,
      }),
      /baseline.*missing|evidence file is missing/,
    );

    copyBaselines(fixture);
    const wrongApproverManifest = clone(fixture.manifest);
    wrongApproverManifest.results[0].approvedBy = "Codex";
    assert.throws(
      () => prepareFounderAudits({
        ...fixture,
        manifest: wrongApproverManifest,
        reviewsCollection: reviews,
      }),
      /baseline-approval provenance/,
    );
    const prepared = prepareFounderAudits({ ...fixture, reviewsCollection: reviews });
    assert.equal(prepared.preparedIds.length, 4);
    assert.equal(prepared.collection.audits.length, 4);
    assert.ok(prepared.collection.audits.every((audit) => audit.pass && audit.overallScore === 4));
    assert.ok(prepared.collection.audits.every((audit) => audit.reviewer === SCORING_REVIEWER));
    assert.ok(prepared.collection.audits.every((audit) => audit.evidence.some((item) => item.includes("#sha256="))));

    const failingConfig = clone(fixture.config);
    failingConfig.goldenSet.references[0].scoresByBreakpoint.mobile.accessibility = 2;
    assert.throws(
      () => prepareFounderAudits({ ...fixture, config: failingConfig, reviewsCollection: reviews }),
      /pass threshold/,
    );
    const founderScoredConfig = clone(fixture.config);
    founderScoredConfig.goldenSet.scoredBy = FOUNDER_APPROVER;
    assert.throws(
      () => prepareFounderAudits({
        ...fixture,
        config: founderScoredConfig,
        reviewsCollection: reviews,
      }),
      /delegated reviewer/,
    );
  }));

test("finalization requires four exact reviews, baselines, and passing audits before writing golden v2 data", () =>
  withFixture((fixture) => {
    const reviews = prepareReviews(fixture).collection;
    copyBaselines(fixture);
    assert.throws(
      () => finalizeFounderEvidence({ ...fixture, reviewsCollection: reviews }),
      /expected one exact audit/,
    );

    const audits = prepareFounderAudits({ ...fixture, reviewsCollection: reviews }).collection;
    const finalized = finalizeFounderEvidence({
      ...fixture,
      reviewsCollection: reviews,
      auditsCollection: audits,
    });
    assert.equal(finalized.goldenSet.schemaVersion, "signal-experience-golden-set/2");
    assert.equal(finalized.goldenSet.approvedBy, FOUNDER_APPROVER);
    assert.equal(finalized.goldenSet.scoredBy, SCORING_REVIEWER);
    assert.deepEqual(finalized.goldenSet.experienceIds, ["studio.page.design"]);
    assert.deepEqual(Object.keys(finalized.goldenSet.references[0].baselineScreenshots), REQUIRED_BREAKPOINTS);
    assert.equal(
      finalized.goldenSet.references[0].baselineScreenshots.mobile,
      "experience/baselines/studio-page-design/default/mobile.png",
    );
    const override = finalized.overrides.experiences["studio.page.design"];
    assert.equal(override.auditStatus, "passing");
    assert.equal(override.screenshotCoverage, "complete");
    assert.equal(override.fixtureCoverage, undefined);
    assert.equal(override.automatedTestCoverage, undefined);
    assert.equal(override.approvedBaselineReference, "experience/golden-set.json#/references/0");
    assert.equal(finalized.registry.experiences[0].approvedBaselineReference, override.approvedBaselineReference);
    const incompleteRegistry = clone(fixture.registry);
    incompleteRegistry.experiences[0].requiredStates.push("error");
    const incomplete = finalizeFounderEvidence({
      ...fixture,
      registry: incompleteRegistry,
      reviewsCollection: reviews,
      auditsCollection: audits,
    });
    assert.equal(incomplete.overrides.experiences["studio.page.design"].auditStatus, "baseline-captured");
    assert.equal(incomplete.overrides.experiences["studio.page.design"].screenshotCoverage, "partial");
    assert.equal(incomplete.overrides.experiences["studio.page.design"].fixtureCoverage, undefined);
    const semanticArgs = {
      repoRoot: fixture.repoRoot,
      experienceRoot: fixture.experienceRoot,
      outputRoot: fixture.outputRoot,
      goldenSet: finalized.goldenSet,
      manifest: fixture.manifest,
      registry: fixture.registry,
      reviewsCollection: reviews,
      auditsCollection: audits,
      findingsCollection: fixture.findingsCollection,
    };
    assert.deepEqual(approvedGoldenSetEvidenceErrors(semanticArgs), []);
    const wrongReviewGoldenSet = clone(finalized.goldenSet);
    wrongReviewGoldenSet.references[0].reviewIds.mobile = "review-not-the-approved-candidate";
    assert.match(
      approvedGoldenSetEvidenceErrors({ ...semanticArgs, goldenSet: wrongReviewGoldenSet }).join("\n"),
      /review reference/,
    );
    const mobileBaseline = path.join(
      fixture.experienceRoot,
      "baselines",
      "studio-page-design",
      "default",
      "mobile.png",
    );
    writeFileSync(mobileBaseline, Buffer.concat([ONE_PIXEL_PNG, Buffer.from("stale-baseline")]));
    assert.match(approvedGoldenSetEvidenceErrors(semanticArgs).join("\n"), /baseline bytes/);
    copyFileSync(
      path.join(fixture.outputRoot, "screenshots", "studio-page-design", "default", "mobile.png"),
      mobileBaseline,
    );

    const tamperedAudits = clone(audits);
    tamperedAudits.audits[0].scores.accessibility = 3;
    tamperedAudits.audits[0].overallScore = 3.92;
    assert.throws(
      () => finalizeFounderEvidence({
        ...fixture,
        reviewsCollection: reviews,
        auditsCollection: tamperedAudits,
      }),
      /score matrix/,
    );

    const recapturedManifest = clone(fixture.manifest);
    const recapturedMobile = recapturedManifest.results.find((result) => result.breakpoint === "mobile");
    const recapturedBytes = Buffer.concat([ONE_PIXEL_PNG, Buffer.from("new-render")]);
    writeFileSync(
      path.join(fixture.outputRoot, ...recapturedMobile.candidateScreenshot.split("/")),
      recapturedBytes,
    );
    recapturedMobile.candidateHash = sha256(recapturedBytes);
    recapturedMobile.approvedCandidateHash = recapturedMobile.candidateHash;
    recapturedMobile.approvedAt = APPROVED_AT;
    recapturedMobile.approvedBy = FOUNDER_APPROVER;
    recapturedMobile.visual.state = "approved";
    const recapturedReviews = prepareReviews(fixture, {
      manifest: recapturedManifest,
      reviewsCollection: reviews,
    }).collection;
    assert.equal(recapturedReviews.reviews.length, reviews.reviews.length + 1);
    assert.ok(reviews.reviews.every((review) => recapturedReviews.reviews.some((candidate) => candidate.id === review.id)));
    copyFileSync(
      path.join(fixture.outputRoot, ...recapturedMobile.candidateScreenshot.split("/")),
      path.join(
        fixture.experienceRoot,
        ...recapturedMobile.candidateScreenshot.replace(/^screenshots\//, "baselines/").split("/"),
      ),
    );
    assert.throws(
      () => finalizeFounderEvidence({
        ...fixture,
        manifest: recapturedManifest,
        reviewsCollection: recapturedReviews,
        auditsCollection: audits,
      }),
      /exact passing record/,
    );
    const recapturedAudits = prepareFounderAudits({
      ...fixture,
      manifest: recapturedManifest,
      reviewsCollection: recapturedReviews,
      auditsCollection: audits,
    }).collection;
    assert.doesNotThrow(() => finalizeFounderEvidence({
      ...fixture,
      manifest: recapturedManifest,
      reviewsCollection: recapturedReviews,
      auditsCollection: recapturedAudits,
    }));
  }));

test("golden-set schema retains provisional v1 compatibility and validates finalized v2", () =>
  withFixture((fixture) => {
    const validate = createSchemaValidator({ repoRoot: fixture.root, schemaFile: "golden-set.schema.json" });
    assert.doesNotThrow(() => validate({
      schemaVersion: "signal-experience-golden-set/1",
      status: "provisional",
      approvalTask: "approve-experience-golden-set",
      experienceIds: ["studio.page.design"],
    }, "v1 golden set"));
    assert.throws(() => validate({
      schemaVersion: "signal-experience-golden-set/1",
      status: "approved",
      approvalTask: "approve-experience-golden-set",
      experienceIds: ["studio.page.design"],
    }, "v1 approved golden set"));
    assert.throws(() => validate({
      schemaVersion: "signal-experience-golden-set/2",
      status: "approved",
      approvalTask: "approve-experience-golden-set",
      approvalRole: "operator",
      approvedBy: "Codex",
      approvedAt: APPROVED_AT,
      approvalSource: APPROVAL_SOURCE,
      scoredBy: SCORING_REVIEWER,
      scoredAt: "2026-07-15",
      scoringSource: SCORING_SOURCE,
      experienceIds: ["studio.page.design"],
      references: [],
    }, "invalid v2 golden set"));

    const reviews = prepareReviews(fixture).collection;
    copyBaselines(fixture);
    const audits = prepareFounderAudits({ ...fixture, reviewsCollection: reviews }).collection;
    const finalized = finalizeFounderEvidence({
      ...fixture,
      reviewsCollection: reviews,
      auditsCollection: audits,
    });
    assert.doesNotThrow(() => validate(finalized.goldenSet, "v2 golden set"));
  }));
