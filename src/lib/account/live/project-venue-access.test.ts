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
});
