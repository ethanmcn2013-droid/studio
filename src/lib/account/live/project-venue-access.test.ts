import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assertSnapshotPrivacy } from "../privacy";
import { maskLicenseCode } from "./mask-code";
import { projectVenueAccessSnapshot } from "./project-venue-access";

describe("maskLicenseCode", () => {
  it("never echoes the plaintext code", () => {
    const code = "SECRET-CODE-99";
    const masked = maskLicenseCode(code);
    assert.equal(masked.includes("••••"), true);
    assert.equal(masked.includes("SECRET"), false);
    assert.equal(masked.includes(code), false);
  });
});

describe("projectVenueAccessSnapshot", () => {
  it("projects live access with unavailable behavioural metrics", () => {
    const snapshot = projectVenueAccessSnapshot({
      nowMs: Date.parse("2026-07-26T12:00:00.000Z"),
      sponsor: {
        id: "sp_1",
        slug: "glenmara-house",
        name: "Glenmara House",
        venuePlan: "paid",
        paid: true,
        termStartsAt: Date.parse("2026-01-01T00:00:00.000Z"),
        termEndsAt: Date.parse("2026-12-31T00:00:00.000Z"),
        codeAllotment: 40,
        codesIssued: 2,
      },
      codes: [
        {
          id: "c1",
          code: "GH-ALPHA-21",
          status: "minted",
          createdAt: Date.parse("2026-07-01T00:00:00.000Z"),
          redeemedAt: null,
        },
        {
          id: "c2",
          code: "GH-BETA-08",
          status: "redeemed",
          createdAt: Date.parse("2026-06-01T00:00:00.000Z"),
          redeemedAt: Date.parse("2026-06-15T00:00:00.000Z"),
        },
      ],
    });

    assert.equal(snapshot.sampleLabel, "LIVE ACCESS PREVIEW · USAGE UNAVAILABLE.");
    assert.equal(snapshot.access.allotted.state, "exact");
    assert.equal(snapshot.access.allotted.state === "exact" && snapshot.access.allotted.value, 40);
    assert.equal(snapshot.access.available.state === "exact" && snapshot.access.available.value, 38);
    assert.equal(snapshot.access.redeemed.state === "exact" && snapshot.access.redeemed.value, 1);
    assert.equal(snapshot.coverage.state, "unavailable");
    assert.equal(snapshot.adoption.firstUsefulAction.state, "unavailable");
    assert.equal(snapshot.access.codes.every((row) => row.maskedCode.includes("••••")), true);
    assert.equal(
      JSON.stringify(snapshot).includes("GH-ALPHA-21"),
      false,
    );
    assert.deepEqual(assertSnapshotPrivacy(snapshot), []);
  });

  it("flags allotment drift without inventing zeros for usage", () => {
    const snapshot = projectVenueAccessSnapshot({
      nowMs: Date.parse("2026-07-26T12:00:00.000Z"),
      sponsor: {
        id: "sp_2",
        slug: "ashford-barn",
        name: "Ashford Barn",
        venuePlan: "pilot",
        paid: false,
        termStartsAt: null,
        termEndsAt: null,
        codeAllotment: 8,
        codesIssued: 1,
      },
      codes: [
        {
          id: "c1",
          code: "AB-ONE-11",
          status: "minted",
          createdAt: 1,
          redeemedAt: null,
        },
        {
          id: "c2",
          code: "AB-TWO-12",
          status: "minted",
          createdAt: 2,
          redeemedAt: null,
        },
      ],
    });

    assert.equal(snapshot.access.reconciliation.state, "attention");
    assert.equal(snapshot.access.attention.some((a) => a.id === "allotment-drift"), true);
    assert.equal(snapshot.adoption.activeRecently.state, "unavailable");
  });

  /* R-016. A venue sold "no seats, no per-couple maths" must not be shown a
   * seat count, a headroom warning, or a request-more-codes next action. */
  function unlimitedSnapshot(codesIssued: number, codeAllotment: number | null = null) {
    return projectVenueAccessSnapshot({
      nowMs: Date.parse("2026-08-03T12:00:00.000Z"),
      sponsor: {
        id: "sp_3",
        slug: "glenmara-house",
        name: "Glenmara House",
        venuePlan: "founding",
        paid: true,
        termStartsAt: Date.parse("2026-01-01T00:00:00.000Z"),
        termEndsAt: Date.parse("2026-12-31T00:00:00.000Z"),
        codeAllotment,
        allotmentMode: "unlimited",
        codesIssued,
      },
      codes: Array.from({ length: codesIssued }, (_, i) => ({
        id: `c${i}`,
        code: `GH-CODE-${i}`,
        status: i === 0 ? "redeemed" : "minted",
        createdAt: Date.parse("2026-07-01T00:00:00.000Z") + i,
        redeemedAt: i === 0 ? Date.parse("2026-07-10T00:00:00.000Z") : null,
      })),
    });
  }

  it("R-016: an unlimited venue is never shown a seat count", () => {
    const snapshot = unlimitedSnapshot(4);
    assert.equal(snapshot.access.allotted.state, "unlimited");
    assert.equal(snapshot.access.available.state, "unlimited");
    assert.equal(snapshot.adoption.allotted.state, "unlimited");
    // Issued and redeemed remain real counts — those are facts about what
    // happened, not a cap on what may happen.
    assert.equal(snapshot.access.issued.state === "exact" && snapshot.access.issued.value, 4);
    assert.equal(snapshot.access.redeemed.state === "exact" && snapshot.access.redeemed.value, 1);
    assert.deepEqual(assertSnapshotPrivacy(snapshot), []);
  });

  it("R-016: the headroom warning is suppressed, not merely zero", () => {
    // A stale cap still on the row must not resurrect the warning.
    const snapshot = unlimitedSnapshot(10, 10);
    assert.equal(
      snapshot.access.attention.some((a) => a.id === "no-remaining"),
      false,
    );
    assert.equal(snapshot.access.allotted.state, "unlimited");
  });

  it("R-016: the next action is to issue, never to request more", () => {
    const snapshot = unlimitedSnapshot(10, 10);
    assert.equal(snapshot.nextAction.id, "issue-next");
    assert.doesNotMatch(snapshot.nextAction.detail, /exhausted/i);
    assert.doesNotMatch(snapshot.nextAction.detail, /allotment/i);
  });

  it("nothing in an unlimited snapshot reads as a seat number", () => {
    const snapshot = unlimitedSnapshot(3, 3);
    const serialised = JSON.stringify(snapshot);
    assert.doesNotMatch(serialised, /remaining allotment headroom/i);
    assert.doesNotMatch(serialised, /codes remain against allotment/i);
  });

  it("a limited venue is unchanged by the unlimited branch", () => {
    const snapshot = projectVenueAccessSnapshot({
      nowMs: Date.parse("2026-08-03T12:00:00.000Z"),
      sponsor: {
        id: "sp_4",
        slug: "capped-house",
        name: "Capped House",
        venuePlan: "pilot",
        paid: false,
        termStartsAt: null,
        termEndsAt: null,
        codeAllotment: 4,
        allotmentMode: "limited",
        codesIssued: 4,
      },
      codes: Array.from({ length: 4 }, (_, i) => ({
        id: `c${i}`,
        code: `CH-CODE-${i}`,
        status: "minted",
        createdAt: i,
        redeemedAt: null,
      })),
    });
    assert.equal(snapshot.access.allotted.state === "exact" && snapshot.access.allotted.value, 4);
    assert.equal(snapshot.access.available.state === "exact" && snapshot.access.available.value, 0);
    assert.equal(snapshot.access.attention.some((a) => a.id === "no-remaining"), true);
    assert.equal(snapshot.nextAction.id, "request-more");
  });

  it("a sponsor with no mode recorded keeps the capped behaviour", () => {
    // Every pre-migration row arrives here without the field.
    const snapshot = projectVenueAccessSnapshot({
      nowMs: Date.parse("2026-08-03T12:00:00.000Z"),
      sponsor: {
        id: "sp_5",
        slug: "legacy-house",
        name: "Legacy House",
        venuePlan: "paid",
        paid: true,
        termStartsAt: null,
        termEndsAt: null,
        codeAllotment: 8,
        codesIssued: 2,
      },
      codes: [],
    });
    assert.equal(snapshot.access.available.state === "exact" && snapshot.access.available.value, 6);
  });
});
