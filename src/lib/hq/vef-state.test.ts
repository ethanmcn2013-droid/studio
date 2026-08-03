import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import {
  daysBetween,
  isoDate,
  readVefRegisters,
  readVefState,
} from "./vef-state";
import { resolveBlueprintMetrics, resolveCrmStageCoverage } from "./blueprint";

/**
 * The honesty contract is the thing under test.
 *
 * The founder dashboard's whole claim is that a number on it is real. That
 * only holds if an unreadable source produces *nothing* rather than a zero,
 * so these tests spend most of their effort on the failure paths: no file,
 * bad JSON, right JSON but the wrong shape. Each one must return a read
 * state and a null snapshot, and the blueprint resolver must fall through to
 * a placeholder rather than render "0".
 */

async function withRoot(
  files: Record<string, string>,
  run: () => Promise<void>,
): Promise<void> {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "vef-state-"));
  const previous = process.env.VEF_CONTROL_ROOT;
  try {
    for (const [name, body] of Object.entries(files)) {
      await fs.writeFile(path.join(dir, name), body, "utf-8");
    }
    process.env.VEF_CONTROL_ROOT = dir;
    await run();
  } finally {
    if (previous === undefined) delete process.env.VEF_CONTROL_ROOT;
    else process.env.VEF_CONTROL_ROOT = previous;
    await fs.rm(dir, { recursive: true, force: true });
  }
}

/** A minimal register that satisfies the structural check. */
function registerFixture(overrides: Record<string, unknown> = {}): string {
  return JSON.stringify({
    schemaVersion: "1.0.0",
    project: {
      id: "VEF-2026",
      releaseDate: "2026-09-01",
      releaseMilestoneName: "Working release",
      completionCondition: "25 venues signed, paid, configured, onboarded.",
      currentPhase: "Phase 2",
      health: { rag: "amber", reason: "Because." },
    },
    baseline: { state: "approved" },
    releaseGates: [
      { id: "commercial", name: "Commercial", owner: "founder", status: "passed", exitCriteria: ["a"], blockers: [], evidence: [{ ref: "x" }] },
      { id: "legal", name: "Legal", owner: "founder", status: "not_started", exitCriteria: ["a"], blockers: [{ note: "b" }] },
      { id: "product", name: "Product", owner: "claude_code", status: "in_progress", exitCriteria: ["a"] },
      { id: "data", name: "Data", owner: "claude_code", status: "not_started", exitCriteria: ["a"] },
      { id: "creative", name: "Creative", owner: "codex_motion", status: "not_started", exitCriteria: ["a"] },
      { id: "sales_readiness", name: "Sales readiness", owner: "founder", status: "waived", exitCriteria: ["a"], waiver: { note: "n", date: "2026-08-01", by: "founder" } },
    ],
    commercial: {
      target: { foundingVenues: 25, geography: "Greater Limerick" },
      foundingPlacesAvailable: 25,
      researchedAccountUniverse: 219,
      invitationsIssued: 4,
      responses: 2,
      qualifiedMeetings: 1,
      demonstrations: 1,
      proposals: 1,
      signedAgreements: 1,
      paidAgreements: 1,
      configuredVenueAccounts: 0,
      onboardedVenues: 0,
      firstCoupleInvitations: 0,
      firstCoupleActivations: 0,
    },
    tasks: [
      { id: "E01.01", status: "done" },
      { id: "E01.02", status: "founder_review" },
      { id: "E02.01", status: "blocked" },
      { id: "E02.02", status: "in_progress" },
    ],
    counts: {
      byStatus: { done: 1, founder_review: 1, blocked: 1, in_progress: 1 },
      verifiedCompletion: {
        basis: "provisional_task_count",
        value: 25,
        numerator: 1,
        denominator: 4,
        unit: "tasks",
        provisional: true,
      },
    },
    freezes: [{ id: "ui", name: "UI freeze", date: "2026-08-20", status: "open" }],
    meta: { lastUpdatedAt: "2026-08-03T00:00:00.000Z", lastValidatedAt: null },
    ...overrides,
  });
}

/* ── The happy path ──────────────────────────────────────────────────── */

test("reads the register and reports gate, ladder and queue state", async () => {
  await withRoot({ "PROJECT_STATE.json": registerFixture() }, async () => {
    const result = await readVefState();
    assert.equal(result.read, "ok");
    if (result.read !== "ok") return;
    const s = result.state;

    assert.equal(s.releaseDate, "2026-09-01");
    assert.equal(s.gatesTotal, 6);
    // "waived" is not "passed". A waiver is a founder decision to ship
    // without the evidence, and counting it as passed would launder that.
    assert.equal(s.gatesPassed, 1);
    assert.equal(s.gates.find((g) => g.id === "sales_readiness")?.waived, true);
    assert.equal(s.gates.find((g) => g.id === "legal")?.blockers, 1);

    assert.equal(s.founding25.ladder.length, 12);
    assert.equal(s.founding25.ladder[0].label, "researched");
    // E11.01 §2.1: the sales counter is venue invitations, not couple codes.
    assert.equal(s.founding25.ladder[1].label, "venue invitations sent");
    assert.equal(s.founding25.monotonic, true);

    assert.equal(s.queue.founderReview, 1);
    assert.deepEqual(s.queue.founderReviewIds, ["E01.02"]);
    assert.equal(s.queue.blocked, 1);
    assert.deepEqual(s.queue.blockedIds, ["E02.01"]);
    assert.equal(s.countsDrifted, false);
    assert.equal(s.completion?.value, 25);
  });
});

/* ── The failure paths, which are the point ──────────────────────────── */

test("a missing register reports unreadable and no state", async () => {
  await withRoot({}, async () => {
    const result = await readVefState();
    assert.equal(result.read, "unreadable");
    assert.equal(result.state, null);
    assert.match(result.note ?? "", /not found/i);
  });
});

test("a register that is not JSON reports malformed and no state", async () => {
  await withRoot({ "PROJECT_STATE.json": "{ not json" }, async () => {
    const result = await readVefState();
    assert.equal(result.read, "malformed");
    assert.equal(result.state, null);
  });
});

test("valid JSON of the wrong shape is malformed, not an empty programme", async () => {
  await withRoot({ "PROJECT_STATE.json": '{"hello":"world"}' }, async () => {
    const result = await readVefState();
    assert.equal(result.read, "malformed");
    assert.equal(result.state, null);
  });
});

test("an absent counter is omitted from the ladder, never rendered as zero", async () => {
  const body = registerFixture({
    commercial: {
      target: { foundingVenues: 25, geography: "Greater Limerick" },
      researchedAccountUniverse: 219,
      // every other counter absent
    },
  });
  await withRoot({ "PROJECT_STATE.json": body }, async () => {
    const result = await readVefState();
    assert.equal(result.read, "ok");
    if (result.read !== "ok") return;
    assert.equal(result.state.founding25.ladder.length, 1);
    assert.equal(result.state.founding25.placesAvailable, null);
  });
});

test("a cumulative counter that rises down the ladder is reported as a break", async () => {
  const body = registerFixture({
    commercial: {
      target: { foundingVenues: 25, geography: "Greater Limerick" },
      researchedAccountUniverse: 10,
      invitationsIssued: 2,
      signedAgreements: 1,
      // paid cannot exceed signed (E11.01 §7)
      paidAgreements: 3,
    },
  });
  await withRoot({ "PROJECT_STATE.json": body }, async () => {
    const result = await readVefState();
    assert.equal(result.read, "ok");
    if (result.read !== "ok") return;
    assert.equal(result.state.founding25.monotonic, false);
    assert.match(result.state.founding25.monotonicBreaks[0], /paid > signed/);
  });
});

test("derived counts that disagree with the task list are flagged", async () => {
  const body = registerFixture({
    counts: { byStatus: { done: 99 }, verifiedCompletion: null },
  });
  await withRoot({ "PROJECT_STATE.json": body }, async () => {
    const result = await readVefState();
    assert.equal(result.read, "ok");
    if (result.read !== "ok") return;
    assert.equal(result.state.countsDrifted, true);
    assert.equal(result.state.completion, null);
  });
});

/* ── The registers ───────────────────────────────────────────────────── */

test("register scan counts entries, distinct ids and duplicates", async () => {
  const decisions = [
    "## D-001 — One",
    "- **Status:** approved",
    "## D-002 — Two",
    "- **Status:** approved",
    "## D-002 — Two again, same id",
    "- **Status:** proposed",
  ].join("\n");
  await withRoot({ "DECISIONS.md": decisions }, async () => {
    const r = await readVefRegisters();
    assert.equal(r.decisions.read, "ok");
    assert.equal(r.decisions.entries, 3);
    assert.equal(r.decisions.distinct, 2);
    assert.deepEqual(r.decisions.duplicates, ["D-002"]);
    assert.equal(r.decisions.headline, 2);
    // RAID.md was not written into the root.
    assert.equal(r.raid.read, "unreadable");
    assert.equal(r.raid.entries, null);
  });
});

/* ── The resolver must not turn a null into a zero ───────────────────── */

const EMPTY_LIVE = {
  mrrEur: null,
  activeGrants: null,
  venuePipeline: null,
  studentSignups: null,
  activationPct: null,
  retentionPct: null,
  churnPct: null,
  onboardingPct: null,
  modulesActive: null,
  runway: null,
  vef: null,
  paidVenuesLedger: null,
};

test("an unreadable VEF register leaves every VEF metric unrendered", () => {
  const metrics = resolveBlueprintMetrics(EMPTY_LIVE);
  for (const key of [
    "founding-25",
    "days-to-release",
    "release-gates",
    "verified-completion",
  ] as const) {
    const m = metrics.find((x) => x.key === key);
    assert.ok(m, `${key} is missing from the catalog`);
    assert.equal(m.live, false);
    assert.equal(m.display, "—");
    assert.notEqual(m.display, "0");
  }
});

test("the sponsor ledger outranks the hand-maintained tracker", () => {
  const vef = {
    daysToRelease: 29,
    gatesPassed: 0,
    gatesTotal: 6,
    completionPct: 33.8,
    completionNumerator: 71,
    completionDenominator: 210,
    completionBasis: "provisional_task_count",
    completionProvisional: true,
    paidTracker: 0,
    foundingTarget: 25,
  };
  const withLedger = resolveBlueprintMetrics({
    ...EMPTY_LIVE,
    vef,
    paidVenuesLedger: 3,
  }).find((m) => m.key === "founding-25");
  assert.equal(withLedger?.display, "3/25");
  assert.match(withLedger?.liveNote ?? "", /sponsor ledger/);

  const trackerOnly = resolveBlueprintMetrics({
    ...EMPTY_LIVE,
    vef,
    paidVenuesLedger: null,
  }).find((m) => m.key === "founding-25");
  assert.equal(trackerOnly?.display, "0/25");
  // The fallback has to say it is a fallback.
  assert.match(trackerOnly?.liveNote ?? "", /ledger unread/);
});

/* ── The CRM finding, derived from shipped code ──────────────────────── */

test("the CRM's shipped pipeline cannot reach the completion condition", () => {
  const shipped = ["to_contact", "contacted", "replied", "demo_booked", "pilot_active"];
  const coverage = resolveCrmStageCoverage(shipped);
  assert.equal(coverage.total, 12);
  assert.equal(coverage.expressible, 4);
  assert.equal(coverage.reachesCompletionCondition, false);
  assert.ok(coverage.missing.includes("onboarded"));
  assert.ok(coverage.missing.includes("paid"));
  // pilot_active maps to no ratified Venue Edition stage at all.
  assert.deepEqual(coverage.orphanCrmTokens, ["pilot_active"]);
});

test("extending the CRM vocabulary moves the coverage figure on its own", () => {
  // Not a proposal, a guard: the panel must correct itself rather than
  // keep reporting a stale finding after the schema grows.
  const coverage = resolveCrmStageCoverage(["to_contact", "contacted"]);
  assert.equal(coverage.expressible, 2);
});

/* ── Date arithmetic ─────────────────────────────────────────────────── */

test("daysBetween is whole days, signed, and null on bad input", () => {
  assert.equal(daysBetween("2026-08-03", "2026-09-01"), 29);
  assert.equal(daysBetween("2026-09-02", "2026-09-01"), -1);
  assert.equal(daysBetween("2026-08-03", "2026-08-03"), 0);
  assert.equal(daysBetween("not-a-date", "2026-09-01"), null);
  assert.equal(daysBetween("2026-08-03", ""), null);
});

test("isoDate is date-only UTC", () => {
  assert.equal(isoDate(new Date("2026-08-03T23:30:00Z")), "2026-08-03");
});
