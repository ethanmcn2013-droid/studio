/**
 * Proof that the entitlements integrity checks fire (E08.09).
 *
 * WHY THIS SUITE IS SHAPED THE WAY IT IS
 * --------------------------------------
 * The first version of this file shared ONE database across every case. It
 * went red the moment it was run: `paid-venue-without-term` reported four
 * violations where the case had planted one, because three earlier cases had
 * each left behind a paid sponsor with no term window. The assertions were
 * counting the whole fixture's accumulated damage rather than the violation
 * under test, and an order-dependent count is not a proof that a check fires.
 *
 * So every case now gets its own database, built from the checked-in
 * baseline. That makes two things true that were not true before: a case
 * asserts on exactly what it planted, and the clean-run assertion means the
 * database really is clean rather than clean-so-far.
 *
 * The second correction: the `sponsor_price_agreements` DDL was written out
 * again here by hand. It now comes from `scripts/venue-billing-ddl.mjs`, the
 * single definition the migration and the billing tests also read, so this
 * suite cannot drift into testing a table shape production does not have.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { createClient } from "@libsql/client";
import {
  CHECKS,
  FOUNDING_AMOUNT_CENTS,
  STANDARD_AMOUNT_CENTS,
  ledgerEnforcement,
  runChecks,
  summarise,
} from "./check-entitlements-integrity.mjs";
import { applyTriggers } from "./apply-audit-ledger-triggers.mjs";
import { venueBillingDdlStatements } from "./venue-billing-ddl.mjs";

const projectRoot = path.resolve(import.meta.dirname, "..");
const baselinePath = path.join(projectRoot, "drizzle-entitlements", "0000_init.sql");

/** Split on `--> statement-breakpoint`, never on semicolons. */
function baselineStatements() {
  return fs
    .readFileSync(baselinePath, "utf8")
    .split("--> statement-breakpoint")
    .map((segment) =>
      segment
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim(),
    )
    .filter(Boolean);
}

/**
 * Columns added by hand-run migration scripts rather than by the drizzle
 * baseline, which is behind `schema.ts`. Created here so the checks that
 * depend on them are exercised rather than skipped. Additive and
 * existence-tolerant, exactly as the real scripts are.
 */
const POST_BASELINE_COLUMNS = [
  "ALTER TABLE sponsors ADD COLUMN founding_number integer",
  "ALTER TABLE sponsors ADD COLUMN founding_number_assigned_at integer",
  "ALTER TABLE sponsors ADD COLUMN allotment_mode text NOT NULL DEFAULT 'limited'",
];

let workDir;
let dbSerial = 0;
const openClients = [];

/** A fresh database with the full schema. One per case, by design. */
async function freshDatabase() {
  const file = path.join(workDir, `entitlements-${dbSerial++}.db`);
  const client = createClient({ url: `file:${file.replaceAll("\\", "/")}` });
  openClients.push(client);
  await client.execute("PRAGMA foreign_keys = OFF");
  for (const sql of baselineStatements()) await client.execute(sql);
  for (const sql of POST_BASELINE_COLUMNS) {
    try {
      await client.execute(sql);
    } catch (error) {
      if (!/duplicate column/i.test(String(error?.message))) throw error;
    }
  }
  for (const sql of venueBillingDdlStatements()) await client.execute(sql);
  return client;
}

async function sponsor(client, id, overrides = {}) {
  const row = {
    id,
    slug: id,
    name: `Venue ${id}`,
    contact_email: `${id}@example.test`,
    venue_plan: "none",
    codes_issued: 0,
    kind: "venue",
    created_at: 1,
    updated_at: 1,
    ...overrides,
  };
  const columns = Object.keys(row);
  await client.execute({
    sql: `INSERT INTO sponsors (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
    args: Object.values(row),
  });
}

async function priceAgreement(client, id, overrides = {}) {
  const row = {
    id,
    sponsor_id: "v-good",
    venue_plan: "founding",
    gross_amount_cents: FOUNDING_AMOUNT_CENTS,
    amount_received_cents: FOUNDING_AMOUNT_CENTS,
    vat_basis: "inclusive",
    founding_locked: 1,
    price_basis: "D-009+D-021",
    effective_from: 1750000000000,
    effective_to: 1780000000000,
    paid_at: 1750000000000,
    recorded_by: "founder",
    recorded_via: "cli:mark-venue-paid",
    ...overrides,
  };
  const columns = Object.keys(row);
  await client.execute({
    sql: `INSERT INTO sponsor_price_agreements (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
    args: Object.values(row),
  });
}

/** A venue recorded exactly as the commercial position says it should be. */
async function correctlyRecordedFoundingVenue(client) {
  await sponsor(client, "v-good", {
    venue_plan: "founding",
    annual_amount_cents: FOUNDING_AMOUNT_CENTS,
    founding_locked: 1,
    founding_number: 1,
    founding_number_assigned_at: 1750000000000,
    paid_at: 1750000000000,
    term_starts_at: 1750000000000,
    term_ends_at: 1780000000000,
  });
  await priceAgreement(client, "pa-1");
}

async function licenseCode(client, id, overrides = {}) {
  const row = {
    id,
    sponsor_id: "v-good",
    code: id.toUpperCase(),
    status: "minted",
    source_type: "venue_edition",
    tier: "wedding",
    created_at: 1,
    updated_at: 1,
    ...overrides,
  };
  const columns = Object.keys(row);
  await client.execute({
    sql: `INSERT INTO license_codes (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
    args: Object.values(row),
  });
}

/**
 * Run one check and assert it caught exactly the planted subject — and that
 * NO other check fired. The second half is what stops a check that simply
 * always returns rows from passing as a working check.
 */
async function assertOnlyViolation(client, id, subject) {
  const all = await runChecks(client);
  const firing = all.filter((r) => r.violations > 0);
  assert.deepEqual(
    firing.map((r) => r.id),
    [id],
    `expected only ${id} to fire; got ${firing.map((r) => r.id).join(", ") || "nothing"}`,
  );
  const result = firing[0];
  assert.equal(result.violations, 1, `${id} should report exactly one violation`);
  assert.deepEqual(result.sample, [subject]);
  return result;
}

before(() => {
  workDir = fs.mkdtempSync(path.join(os.tmpdir(), "signal-entitlements-integrity-"));
});

after(() => {
  for (const client of openClients) {
    try {
      client.close();
    } catch {
      // already closed
    }
  }
  try {
    fs.rmSync(workDir, { recursive: true, force: true });
  } catch (error) {
    // Windows can hold a SQLite handle briefly after close.
    if (error?.code !== "EPERM") throw error;
  }
});

describe("entitlements integrity checks", () => {
  it("skips nothing on a database with the full schema", async () => {
    const client = await freshDatabase();
    const results = await runChecks(client);
    assert.deepEqual(
      results.filter((r) => r.skipped).map((r) => `${r.id}: ${r.skipped}`),
      [],
      "a skipped check is a check that is not protecting anything",
    );
  });

  it("a correctly-recorded founding venue violates nothing", async () => {
    const client = await freshDatabase();
    await correctlyRecordedFoundingVenue(client);
    const results = await runChecks(client);
    assert.deepEqual(
      results.filter((r) => r.violations > 0).map((r) => r.id),
      [],
      "a correctly-recorded venue must not trip any check",
    );
    assert.equal(summarise(results, { applicable: false, missing: [] }).ok, true);
  });

  it("catches two venues holding the same founding place", async () => {
    const client = await freshDatabase();
    await sponsor(client, "v-dup-a", {
      founding_number: 7,
      paid_at: 1,
      term_starts_at: 1,
      term_ends_at: 2,
      venue_plan: "none",
    });
    await sponsor(client, "v-dup-b", {
      founding_number: 7,
      paid_at: 1,
      term_starts_at: 1,
      term_ends_at: 2,
      venue_plan: "none",
    });
    await assertOnlyViolation(client, "duplicate-founding-number", "7");
  });

  it("catches a founding number outside 1 to 25", async () => {
    const client = await freshDatabase();
    await sponsor(client, "v-26", {
      founding_number: 26,
      paid_at: 1,
      term_starts_at: 1,
      term_ends_at: 2,
    });
    await assertOnlyViolation(client, "founding-number-out-of-range", "v-26");
  });

  it("catches a founding number assigned before payment cleared", async () => {
    const client = await freshDatabase();
    await sponsor(client, "v-early", { founding_number: 12 });
    await assertOnlyViolation(client, "founding-number-without-payment", "v-early");
  });

  it("catches a venue recorded as paid with no term window", async () => {
    const client = await freshDatabase();
    // venue_plan 'none' so the price-agreement check does not also fire; this
    // case is about the term window and nothing else.
    await sponsor(client, "v-noterm", { venue_plan: "none", paid_at: 1750000000000 });
    await assertOnlyViolation(client, "paid-venue-without-term", "v-noterm");
  });

  it("catches an inverted term window", async () => {
    const client = await freshDatabase();
    await sponsor(client, "v-inverted", {
      term_starts_at: 1780000000000,
      term_ends_at: 1750000000000,
    });
    await assertOnlyViolation(client, "term-window-inverted", "v-inverted");
  });

  it("catches a founding venue recorded at the standard price", async () => {
    const client = await freshDatabase();
    await sponsor(client, "v-overcharged", {
      venue_plan: "founding",
      annual_amount_cents: STANDARD_AMOUNT_CENTS,
    });
    await assertOnlyViolation(client, "founding-plan-charged-standard-price", "v-overcharged");
  });

  it("catches a standard venue recorded at the founding price", async () => {
    const client = await freshDatabase();
    await sponsor(client, "v-undercharged", {
      venue_plan: "paid",
      annual_amount_cents: FOUNDING_AMOUNT_CENTS,
    });
    await assertOnlyViolation(client, "standard-plan-charged-founding-price", "v-undercharged");
  });

  it("catches a rate lock on a venue that is not on the founding plan", async () => {
    const client = await freshDatabase();
    await sponsor(client, "v-falselock", { venue_plan: "paid", founding_locked: 1 });
    await assertOnlyViolation(client, "founding-lock-without-founding-plan", "v-falselock");
  });

  it("catches money received with no price agreement on file", async () => {
    const client = await freshDatabase();
    await sponsor(client, "v-noagreement", {
      venue_plan: "founding",
      annual_amount_cents: FOUNDING_AMOUNT_CENTS,
      paid_at: 1750000000000,
      term_starts_at: 1750000000000,
      term_ends_at: 1780000000000,
    });
    await assertOnlyViolation(client, "paid-venue-without-price-agreement", "v-noagreement");
  });

  it("catches a price agreement recorded on a non-inclusive VAT basis", async () => {
    const client = await freshDatabase();
    await correctlyRecordedFoundingVenue(client);
    await priceAgreement(client, "pa-excl", {
      vat_basis: "exclusive",
      price_basis: "pre-D-021",
      effective_from: 1,
      effective_to: 2,
      paid_at: 1,
    });
    await assertOnlyViolation(client, "price-agreement-not-vat-inclusive", "pa-excl");
  });

  it("catches a price agreement attached to no venue", async () => {
    const client = await freshDatabase();
    await priceAgreement(client, "pa-orphan", { sponsor_id: "v-gone" });
    await assertOnlyViolation(client, "price-agreement-orphaned", "pa-orphan");
  });

  it("catches a license code belonging to no venue", async () => {
    const client = await freshDatabase();
    await licenseCode(client, "lc-orphan", { sponsor_id: "v-gone" });
    await assertOnlyViolation(client, "license-code-orphaned", "lc-orphan");
  });

  it("catches a code marked redeemed with no redemption record", async () => {
    const client = await freshDatabase();
    await correctlyRecordedFoundingVenue(client);
    await licenseCode(client, "lc-ghost", { status: "redeemed" });
    await assertOnlyViolation(client, "redeemed-code-without-redemption", "lc-ghost");
  });

  it("catches one code redeemed by two different people", async () => {
    const client = await freshDatabase();
    await correctlyRecordedFoundingVenue(client);
    await licenseCode(client, "lc-shared", { status: "redeemed" });
    for (const [id, subject] of [["r-1", "clerk-a"], ["r-2", "clerk-b"]]) {
      await client.execute({
        sql: "INSERT INTO redemptions (id, code_id, user_clerk_id, redeemed_at) VALUES (?,?,?,?)",
        args: [id, "lc-shared", subject, 1],
      });
    }
    await assertOnlyViolation(client, "code-redeemed-twice", "lc-shared");
  });

  it("warns, without failing the run, when an unlimited venue still carries a seat count", async () => {
    const client = await freshDatabase();
    await sponsor(client, "v-seatcount", { allotment_mode: "unlimited", code_allotment: 10 });
    const result = await assertOnlyViolation(
      client,
      "unlimited-sponsor-carrying-a-seat-count",
      "v-seatcount",
    );
    assert.equal(result.severity, "warn");
    const summary = summarise(await runChecks(client), { applicable: false, missing: [] });
    assert.equal(summary.ok, true, "a warning must not fail the run");
    assert.equal(summary.warningChecks, 1);
  });

  it("catches an audit line with no chain hash", async () => {
    const client = await freshDatabase();
    await client.execute({
      sql: "INSERT INTO entitlement_events (id, action, created_at) VALUES (?,?,?)",
      args: ["ev-unhashed", "sponsor_created", 1],
    });
    await assertOnlyViolation(client, "audit-ledger-missing-hash", "ev-unhashed");
  });

  it("reports missing append-only triggers as a failing run, then passes once installed", async () => {
    const client = await freshDatabase();
    const before = await ledgerEnforcement(client);
    assert.equal(before.applicable, true);
    assert.deepEqual(
      before.missing.slice().sort(),
      ["entitlement_events_no_delete", "entitlement_events_no_update"],
      "a database built from the checked-in baseline has no append-only enforcement",
    );
    assert.equal(
      summarise([], before).ok,
      false,
      "a clean ledger with no enforcement is not a passing run",
    );

    await applyTriggers(client);
    const afterInstall = await ledgerEnforcement(client);
    assert.deepEqual(afterInstall.missing, []);
    assert.equal(summarise([], afterInstall).ok, true);
  });

  it("skips, rather than silently passes, when a table is absent", async () => {
    const empty = createClient({
      url: `file:${path.join(workDir, "bare.db").replaceAll("\\", "/")}`,
    });
    openClients.push(empty);
    await empty.execute("CREATE TABLE unrelated (id text primary key)");
    const results = await runChecks(empty);
    assert.ok(results.every((r) => r.skipped));
    const summary = summarise(results, await ledgerEnforcement(empty));
    assert.equal(summary.checksRun, 0);
    assert.equal(summary.checksSkipped, CHECKS.length);
  });

  it("refuses a check whose SQL is not a SELECT", async () => {
    const client = await freshDatabase();
    await assert.rejects(
      () =>
        runChecks(client, [
          {
            id: "bad",
            severity: "error",
            tables: ["sponsors"],
            title: "t",
            why: "w",
            sql: "DELETE FROM sponsors",
          },
        ]),
      /read-only/,
    );
  });
});
