import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import { assertSnapshotPrivacy } from "../privacy";
import {
  LIVE_ACCESS_CODE_COLUMNS,
  LIVE_ACCESS_CODE_FIELDS,
} from "./code-columns";
import {
  projectVenueAccessSnapshot,
  type LiveVenueAccessInput,
  type LiveVenueCodeRow,
} from "./project-venue-access";

const NOW = Date.parse("2026-07-27T12:00:00.000Z");
const MINTED_AT = Date.parse("2026-07-01T00:00:00.000Z");

function code(overrides: Partial<LiveVenueCodeRow> = {}): LiveVenueCodeRow {
  return {
    id: "c1",
    code: "GH-ALPHA-21",
    status: "minted",
    createdAt: MINTED_AT,
    redeemedAt: null,
    ...overrides,
  };
}

function input(codes: LiveVenueCodeRow[]): LiveVenueAccessInput {
  return {
    nowMs: NOW,
    sponsor: {
      id: "sp_1",
      slug: "glenmara-house",
      name: "Glenmara House",
      venuePlan: "paid",
      paid: true,
      termStartsAt: Date.parse("2026-01-01T00:00:00.000Z"),
      termEndsAt: Date.parse("2026-12-31T00:00:00.000Z"),
      codeAllotment: 40,
      codesIssued: codes.length,
    },
    codes,
  };
}

function firstRow(codes: LiveVenueCodeRow[]) {
  return projectVenueAccessSnapshot(input(codes)).access.codes[0];
}

describe("access delivery state", () => {
  it("treats a minted code with no delivery data as available", () => {
    const row = firstRow([code()]);
    assert.equal(row.state, "available");
    assert.equal(row.issuedOn, null);
    assert.equal(row.expiresOn, null);
    assert.match(row.note, /delivery not tracked/);
  });

  it("treats a delivered code as issued and shows the delivery date", () => {
    const row = firstRow([
      code({ deliveredAt: Date.parse("2026-07-10T00:00:00.000Z") }),
    ]);
    assert.equal(row.state, "issued");
    assert.equal(row.issuedOn, "2026-07-10");
    assert.match(row.note, /not yet redeemed/);
  });

  it("treats a passed expiry as expired", () => {
    const row = firstRow([
      code({ expiresAt: Date.parse("2026-07-20T00:00:00.000Z") }),
    ]);
    assert.equal(row.state, "expired");
    assert.equal(row.expiresOn, "2026-07-20");
  });

  it("treats the expiry boundary as inclusive", () => {
    assert.equal(firstRow([code({ expiresAt: NOW })]).state, "expired");
    assert.equal(firstRow([code({ expiresAt: NOW + 1 })]).state, "available");
  });

  it("keeps a redeemed code redeemed even after its expiry passes", () => {
    // The entitlement the redemption produced carries its own expiry; the code
    // row must not claim the benefit lapsed.
    const row = firstRow([
      code({
        status: "redeemed",
        redeemedAt: Date.parse("2026-07-05T00:00:00.000Z"),
        expiresAt: Date.parse("2026-07-10T00:00:00.000Z"),
      }),
    ]);
    assert.equal(row.state, "redeemed");
  });

  it("keeps a revoked code revoked above every other signal", () => {
    const row = firstRow([
      code({
        status: "revoked",
        deliveredAt: Date.parse("2026-07-02T00:00:00.000Z"),
        expiresAt: Date.parse("2026-07-03T00:00:00.000Z"),
      }),
    ]);
    assert.equal(row.state, "revoked");
  });

  it("says not delivered yet once the venue records any delivery", () => {
    const snapshot = projectVenueAccessSnapshot(
      input([
        code({ id: "c1", code: "GH-ALPHA-21" }),
        code({
          id: "c2",
          code: "GH-BETA-22",
          deliveredAt: Date.parse("2026-07-11T00:00:00.000Z"),
        }),
      ]),
    );
    const undelivered = snapshot.access.codes.find((r) => r.state === "available");
    assert.ok(undelivered);
    assert.match(undelivered.note, /not delivered yet/);
  });

  it("produces an identical snapshot when both columns are absent", () => {
    // The safety property: a venue with no delivery data must be unaffected by
    // the columns existing at all.
    const withoutColumns = projectVenueAccessSnapshot(
      input([
        code({ id: "c1", code: "GH-ALPHA-21" }),
        code({
          id: "c2",
          code: "GH-BETA-22",
          status: "redeemed",
          redeemedAt: Date.parse("2026-07-12T00:00:00.000Z"),
        }),
        code({ id: "c3", code: "GH-GAMMA-23", status: "revoked" }),
      ]),
    );
    const withNulls = projectVenueAccessSnapshot(
      input([
        code({ id: "c1", code: "GH-ALPHA-21", deliveredAt: null, expiresAt: null }),
        code({
          id: "c2",
          code: "GH-BETA-22",
          status: "redeemed",
          redeemedAt: Date.parse("2026-07-12T00:00:00.000Z"),
          deliveredAt: null,
          expiresAt: null,
        }),
        code({
          id: "c3",
          code: "GH-GAMMA-23",
          status: "revoked",
          deliveredAt: null,
          expiresAt: null,
        }),
      ]),
    );
    assert.deepEqual(withNulls, withoutColumns);
    assert.equal(
      JSON.stringify(withNulls),
      JSON.stringify(withoutColumns),
      "an all-null delivery ledger must render byte-identically",
    );
  });

  it("preserves the legacy mint-date fallback for redeemed and revoked rows", () => {
    const redeemed = firstRow([
      code({ status: "redeemed", redeemedAt: Date.parse("2026-07-12T00:00:00.000Z") }),
    ]);
    assert.equal(redeemed.issuedOn, "2026-07-01");
  });

  /* The ladder above is only reachable if the query asks for the columns it
   * branches on. It did not, so `issued` and `expired` were unreachable on
   * live data and an expired code rendered as available — as safe to send. */
  it("the live query asks for every column the ladder branches on", () => {
    assert.deepEqual(
      Object.keys(LIVE_ACCESS_CODE_COLUMNS).sort(),
      [...LIVE_ACCESS_CODE_FIELDS].sort(),
    );
    assert.ok(LIVE_ACCESS_CODE_FIELDS.includes("deliveredAt"));
    assert.ok(LIVE_ACCESS_CODE_FIELDS.includes("expiresAt"));
  });

  it("the selection maps to the real license_codes delivery columns", () => {
    assert.equal(LIVE_ACCESS_CODE_COLUMNS.deliveredAt.name, "delivered_at");
    assert.equal(LIVE_ACCESS_CODE_COLUMNS.expiresAt.name, "expires_at");
  });

  it("the loader selects through that constant, not a private column list", () => {
    const source = readFileSync(
      new URL("./load-venue-access.ts", import.meta.url),
      "utf8",
    );
    assert.match(source, /\.select\(LIVE_ACCESS_CODE_COLUMNS\)/);
    assert.doesNotMatch(
      source,
      /redeemedAt:\s*licenseCodes\.redeemedAt/,
      "an inline column list is how the delivery columns went missing",
    );
  });

  it("never leaks a plaintext code through the new states", () => {
    const snapshot = projectVenueAccessSnapshot(
      input([
        code({
          deliveredAt: Date.parse("2026-07-10T00:00:00.000Z"),
          expiresAt: Date.parse("2026-07-20T00:00:00.000Z"),
        }),
      ]),
    );
    assertSnapshotPrivacy(snapshot);
    assert.ok(!JSON.stringify(snapshot).includes("GH-ALPHA-21"));
  });

  it("leaves allotment metrics untouched, because they count headroom not rows", () => {
    const expired = projectVenueAccessSnapshot(
      input([code({ expiresAt: Date.parse("2026-07-20T00:00:00.000Z") })]),
    );
    const plain = projectVenueAccessSnapshot(input([code()]));
    assert.deepEqual(expired.access.allotted, plain.access.allotted);
    assert.deepEqual(expired.access.available, plain.access.available);
    assert.deepEqual(expired.access.issued, plain.access.issued);
  });
});
