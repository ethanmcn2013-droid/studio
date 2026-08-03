import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { remainingAllotment } from "@/lib/venue-allotment";
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

  /* R-016, legacy branch. A `limited` sponsor whose cap was never recorded is
   * neither unlimited nor exhausted. It has no answer, and the surface must
   * say so rather than manufacture a zero. */
  function unrecordedSnapshot(
    over: { allotmentMode?: string | null; codesIssued?: number } = {},
  ) {
    return projectVenueAccessSnapshot({
      nowMs: Date.parse("2026-08-03T12:00:00.000Z"),
      sponsor: {
        id: "sp_6",
        slug: "unrecorded-house",
        name: "Unrecorded House",
        venuePlan: "paid",
        paid: true,
        termStartsAt: null,
        termEndsAt: null,
        codeAllotment: null,
        allotmentMode: "limited",
        codesIssued: 0,
        ...over,
      },
      codes: [],
    });
  }

  it("R-016: a limited venue with nothing recorded is unavailable, not zero", () => {
    const snapshot = unrecordedSnapshot();
    assert.equal(snapshot.access.allotted.state, "unavailable");
    assert.equal(snapshot.access.available.state, "unavailable");
    assert.equal(snapshot.adoption.allotted.state, "unavailable");
    // The exact failure this guards: a fabricated 0 on the Overview journey.
    assert.equal(
      JSON.stringify(snapshot.access.allotted).includes('"value":0'),
      false,
    );
    assert.equal(
      JSON.stringify(snapshot.access.available).includes('"value":0'),
      false,
    );
    assert.deepEqual(assertSnapshotPrivacy(snapshot), []);
  });

  it("R-016: it is never told its headroom is exhausted", () => {
    const snapshot = unrecordedSnapshot();
    assert.notEqual(snapshot.nextAction.id, "request-more");
    assert.equal(snapshot.nextAction.id, "confirm-access-record");
    assert.doesNotMatch(snapshot.nextAction.detail, /exhausted/i);
    assert.doesNotMatch(JSON.stringify(snapshot.nextAction), /allotment/i);
    assert.equal(
      snapshot.access.attention.some((a) => a.id === "no-remaining"),
      false,
    );
  });

  it("R-016: the missing record is surfaced rather than hidden", () => {
    const snapshot = unrecordedSnapshot();
    assert.equal(
      snapshot.access.attention.some((a) => a.id === "access-record-missing"),
      true,
    );
  });

  it("R-016: the projection agrees with remainingAllotment on the same input", () => {
    const sponsor = {
      allotmentMode: "limited" as const,
      codeAllotment: null,
      codesIssued: 0,
    };
    assert.equal(remainingAllotment(sponsor), null);
    const snapshot = unrecordedSnapshot();
    assert.equal(snapshot.access.available.state, "unavailable");
  });

  it("R-016: an unrecorded cap stays unavailable even once codes are issued", () => {
    const snapshot = unrecordedSnapshot({ codesIssued: 3 });
    assert.equal(snapshot.access.allotted.state, "unavailable");
    assert.equal(snapshot.access.available.state, "unavailable");
    // Issued is still a fact about what happened, so it stays exact.
    assert.equal(
      snapshot.access.issued.state === "exact" && snapshot.access.issued.value,
      3,
    );
  });

  it("R-016: a sponsor with no mode at all and no cap is also unavailable", () => {
    // Pre-migration rows arrive with neither field set.
    const snapshot = unrecordedSnapshot({ allotmentMode: null });
    assert.equal(snapshot.access.allotted.state, "unavailable");
    assert.equal(snapshot.nextAction.id, "confirm-access-record");
  });

  it("the live report advertises only the format the server will serve", () => {
    // The live download route refuses `pdf`; offering it was a broken button.
    const snapshot = unrecordedSnapshot();
    assert.deepEqual(snapshot.reports[0]?.formats, ["csv"]);
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

  /* D-032 R6. The five prohibited strings on this path were unreachable only
   * because the live path is dark. The moment the migration lands they are
   * the first thing an exhausted venue reads, so the guard runs over every
   * branch rather than over the one branch a test happened to build. */
  describe("D-032 R6: prohibited vocabulary on the live projection", () => {
    function limitedSnapshot(codeAllotment: number, codesIssued: number) {
      return projectVenueAccessSnapshot({
        nowMs: Date.parse("2026-08-03T12:00:00.000Z"),
        sponsor: {
          id: "sp_r6",
          slug: "r6-house",
          name: "R6 House",
          venuePlan: "paid",
          paid: true,
          termStartsAt: null,
          termEndsAt: null,
          codeAllotment,
          allotmentMode: "limited",
          codesIssued,
        },
        codes: [],
      });
    }

    const BRANCHES: Array<[string, ReturnType<typeof limitedSnapshot>]> = [
      ["exhausted limited", limitedSnapshot(4, 4)],
      ["limited with headroom", limitedSnapshot(10, 2)],
      ["counter drift", limitedSnapshot(10, 99)],
      ["unlimited", unlimitedSnapshot(4)],
      ["unrecorded", unrecordedSnapshot()],
    ];

    /**
     * Only the strings a person reads.
     *
     * Sweeping `JSON.stringify(snapshot)` sweeps the field names too, and
     * `access.allotted` is a contract identifier, not copy. That is the same
     * distinction `prohibited-claims.v1.json` draws with `copyOnly`, and a
     * guard that cannot draw it either fails on the contract or gets deleted.
     */
    const NON_COPY_KEYS = new Set([
      "id",
      "snapshotId",
      "reportId",
      "accountId",
      "filenameStem",
      "state",
      "standing",
      "edition",
      "definitionVersion",
      "coverageState",
      "formats",
      "maskedCode",
      "target",
    ]);

    function copyStrings(node: unknown, key = ""): string[] {
      if (typeof node === "string") {
        return NON_COPY_KEYS.has(key) ? [] : [node];
      }
      if (Array.isArray(node)) return node.flatMap((v) => copyStrings(v, key));
      if (node && typeof node === "object") {
        return Object.entries(node).flatMap(([k, v]) => copyStrings(v, k));
      }
      return [];
    }

    // D-020 / E09.02 section 8, mirroring the p5 patterns in
    // prohibited-claims.v1.json, plus the two BRAND.md punctuation bans.
    const BANNED: Array<[RegExp, string]> = [
      [/\ballotment\b/i, "D-020"],
      [/\ballotted\b/i, "D-020"],
      [/\bcodes remaining\b/i, "D-020"],
      [/\bseats?\b/i, "D-020"],
      [/\bheadroom\b/i, "D-020"],
      [/—/, "BRAND.md section 3, em dash"],
      [/!/, "BRAND.md section 3, exclamation mark"],
    ];

    for (const [name, snapshot] of BRANCHES) {
      it(`${name}: every string a venue reads is clean`, () => {
        for (const text of copyStrings(snapshot)) {
          for (const [pattern, basis] of BANNED) {
            assert.doesNotMatch(text, pattern, `${name} (${basis}): ${text}`);
          }
        }
      });
    }

    it("the guard reads real strings rather than passing on an empty list", () => {
      const strings = copyStrings(BRANCHES[0][1]);
      assert.ok(strings.length > 20, `only ${strings.length} strings collected`);
      assert.ok(strings.includes("Request more access for Signal Studio review"));
    });

    it("an exhausted limited venue is still told something useful", () => {
      const snapshot = limitedSnapshot(4, 4);
      assert.equal(snapshot.nextAction.id, "request-more");
      // The constraint is the wording, not the fact. It still says what
      // happened and what the venue can do about it.
      assert.match(snapshot.nextAction.detail, /has been issued/);
      assert.match(snapshot.nextAction.detail, /record a request/);
      assert.equal(
        snapshot.access.attention.some((a) => a.id === "no-remaining"),
        true,
      );
    });

    it("a missing date reads as not recorded, never as a dash", () => {
      const snapshot = limitedSnapshot(4, 1);
      assert.equal(snapshot.term.start, "Not recorded");
      assert.equal(snapshot.term.end, "Not recorded");
    });
  });
});
