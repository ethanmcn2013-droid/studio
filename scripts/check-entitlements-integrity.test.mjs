/**
 * Proof that the entitlements integrity checks fire (E08.09).
 *
 * The fixture is built from the checked-in baseline, so the SQL is exercised
 * against the schema a real database actually has. Every error-severity
 * check is given a violation and asserted to catch it, and the clean case is
 * asserted first so a check that always fires would be caught here.
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
 * Columns and tables added by hand-run migration scripts rather than by the
 * baseline. Created here so the checks that depend on them are exercised
 * rather than skipped. Additive and existence-checked, exactly as the real
 * scripts are.
 */
const POST_BASELINE = [
  "ALTER TABLE sponsors ADD COLUMN founding_number integer",
  "ALTER TABLE sponsors ADD COLUMN founding_number_assigned_at integer",
  "ALTER TABLE sponsors ADD COLUMN allotment_mode text NOT NULL DEFAULT 'limited'",
  `CREATE TABLE IF NOT EXISTS sponsor_price_agreements (
     id text PRIMARY KEY,
     sponsor_id text NOT NULL,
     venue_plan text NOT NULL,
     gross_amount_cents integer NOT NULL,
     amount_received_cents integer NOT NULL,
     vat_basis text NOT NULL DEFAULT 'inclusive',
     vat_rate_basis_points integer,
     net_amount_cents integer,
     vat_amount_cents integer,
     founding_locked integer NOT NULL DEFAULT 0,
     price_basis text NOT NULL,
     effective_from integer NOT NULL,
     effective_to integer NOT NULL,
     paid_at integer NOT NULL,
     recorded_by text NOT NULL,
     recorded_via text NOT NULL,
     note text,
     created_at integer NOT NULL DEFAULT (unixepoch() * 1000)
   )`,
];

let workDir;
let client;
let dbPath;

async function sponsor(id, overrides = {}) {
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

async function violationsOf(id) {
  const [result] = await runChecks(client, CHECKS.filter((c) => c.id === id));
  return result;
}

before(async () => {
  workDir = fs.mkdtempSync(path.join(os.tmpdir(), "signal-entitlements-integrity-"));
  dbPath = path.join(workDir, "entitlements.db");
  client = createClient({ url: `file:${dbPath.replaceAll("\\", "/")}` });
  await client.execute("PRAGMA foreign_keys = OFF");
  for (const sql of baselineStatements()) await client.execute(sql);
  for (const sql of POST_BASELINE) {
    try {
      await client.execute(sql);
    } catch (error) {
      // The baseline may already carry the column if a migration landed.
      if (!/duplicate column/i.test(String(error?.message))) throw error;
    }
  }
});

after(() => {
  try {
    client?.close();
  } catch {
    // already closed
  }
  try {
    fs.rmSync(workDir, { recursive: true, force: true });
  } catch (error) {
    if (error?.code !== "EPERM") throw error;
  }
});

describe("entitlements integrity checks", () => {
  it("skips nothing on a database with the full schema", async () => {
    const results = await runChecks(client);
    const skipped = results.filter((r) => r.skipped);
    assert.deepEqual(
      skipped.map((r) => `${r.id}: ${r.skipped}`),
      [],
      "a skipped check is a check that is not protecting anything",
    );
  });

  it("a correctly-recorded founding venue violates nothing", async () => {
    await sponsor("v-good", {
      venue_plan: "founding",
      annual_amount_cents: FOUNDING_AMOUNT_CENTS,
      founding_locked: 1,
      founding_number: 1,
      founding_number_assigned_at: 1750000000000,
      paid_at: 1750000000000,
      term_starts_at: 1750000000000,
      term_ends_at: 1780000000000,
    });
    await client.execute({
      sql:
        `INSERT INTO sponsor_price_agreements (id, sponsor_id, venue_plan, gross_amount_cents, ` +
        `amount_received_cents, vat_basis, founding_locked, price_basis, effective_from, ` +
        `effective_to, paid_at, recorded_by, recorded_via) ` +
        `VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        "pa-1", "v-good", "founding", FOUNDING_AMOUNT_CENTS, FOUNDING_AMOUNT_CENTS,
        "inclusive", 1, "D-009+D-021", 1750000000000, 1780000000000, 1750000000000,
        "founder", "cli:mark-venue-paid",
      ],
    });

    const results = await runChecks(client);
    assert.deepEqual(
      results.filter((r) => r.violations > 0).map((r) => r.id),
      [],
      "a correctly-recorded venue must not trip any check",
    );
    assert.equal(summarise(results, { applicable: false, missing: [] }).ok, true);
  });

  it("catches two venues holding the same founding place", async () => {
    await sponsor("v-dup-a", { founding_number: 7, paid_at: 1 });
    await sponsor("v-dup-b", { founding_number: 7, paid_at: 1 });
    const result = await violationsOf("duplicate-founding-number");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["7"]);
  });

  it("catches a founding number outside 1 to 25", async () => {
    await sponsor("v-26", { founding_number: 26, paid_at: 1 });
    const result = await violationsOf("founding-number-out-of-range");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["v-26"]);
  });

  it("catches a founding number assigned before payment cleared", async () => {
    await sponsor("v-early", { founding_number: 12 });
    const result = await violationsOf("founding-number-without-payment");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["v-early"]);
  });

  it("catches a venue recorded as paid with no term window", async () => {
    await sponsor("v-noterm", { venue_plan: "paid", paid_at: 1750000000000 });
    const result = await violationsOf("paid-venue-without-term");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["v-noterm"]);
  });

  it("catches an inverted term window", async () => {
    await sponsor("v-inverted", {
      term_starts_at: 1780000000000,
      term_ends_at: 1750000000000,
    });
    const result = await violationsOf("term-window-inverted");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["v-inverted"]);
  });

  it("catches a founding venue recorded at the standard price", async () => {
    await sponsor("v-overcharged", {
      venue_plan: "founding",
      annual_amount_cents: STANDARD_AMOUNT_CENTS,
    });
    const result = await violationsOf("founding-plan-charged-standard-price");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["v-overcharged"]);
  });

  it("catches a standard venue recorded at the founding price", async () => {
    await sponsor("v-undercharged", {
      venue_plan: "paid",
      annual_amount_cents: FOUNDING_AMOUNT_CENTS,
    });
    const result = await violationsOf("standard-plan-charged-founding-price");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["v-undercharged"]);
  });

  it("catches a rate lock on a venue that is not on the founding plan", async () => {
    await sponsor("v-falselock", { venue_plan: "paid", founding_locked: 1 });
    const result = await violationsOf("founding-lock-without-founding-plan");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["v-falselock"]);
  });

  it("catches money received with no price agreement on file", async () => {
    await sponsor("v-noagreement", {
      venue_plan: "founding",
      annual_amount_cents: FOUNDING_AMOUNT_CENTS,
      paid_at: 1750000000000,
      term_starts_at: 1750000000000,
      term_ends_at: 1780000000000,
    });
    const result = await violationsOf("paid-venue-without-price-agreement");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["v-noagreement"]);
  });

  it("catches a price agreement recorded on a non-inclusive VAT basis", async () => {
    await client.execute({
      sql:
        `INSERT INTO sponsor_price_agreements (id, sponsor_id, venue_plan, gross_amount_cents, ` +
        `amount_received_cents, vat_basis, price_basis, effective_from, effective_to, paid_at, ` +
        `recorded_by, recorded_via) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        "pa-excl", "v-good", "founding", FOUNDING_AMOUNT_CENTS, FOUNDING_AMOUNT_CENTS,
        "exclusive", "pre-D-021", 1, 2, 1, "founder", "cli:mark-venue-paid",
      ],
    });
    const result = await violationsOf("price-agreement-not-vat-inclusive");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["pa-excl"]);
  });

  it("catches a price agreement attached to no venue", async () => {
    await client.execute({
      sql:
        `INSERT INTO sponsor_price_agreements (id, sponsor_id, venue_plan, gross_amount_cents, ` +
        `amount_received_cents, price_basis, effective_from, effective_to, paid_at, ` +
        `recorded_by, recorded_via) VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      args: [
        "pa-orphan", "v-gone", "paid", STANDARD_AMOUNT_CENTS, STANDARD_AMOUNT_CENTS,
        "D-009", 1, 2, 1, "founder", "cli:mark-venue-paid",
      ],
    });
    const result = await violationsOf("price-agreement-orphaned");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["pa-orphan"]);
  });

  it("catches a license code belonging to no venue", async () => {
    await client.execute({
      sql:
        `INSERT INTO license_codes (id, sponsor_id, code, status, source_type, tier, created_at, updated_at) ` +
        `VALUES (?,?,?,?,?,?,?,?)`,
      args: ["lc-orphan", "v-gone", "CODE-ORPHAN", "minted", "venue_edition", "wedding", 1, 1],
    });
    const result = await violationsOf("license-code-orphaned");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["lc-orphan"]);
  });

  it("catches a code marked redeemed with no redemption record", async () => {
    await client.execute({
      sql:
        `INSERT INTO license_codes (id, sponsor_id, code, status, source_type, tier, created_at, updated_at) ` +
        `VALUES (?,?,?,?,?,?,?,?)`,
      args: ["lc-ghost", "v-good", "CODE-GHOST", "redeemed", "venue_edition", "wedding", 1, 1],
    });
    const result = await violationsOf("redeemed-code-without-redemption");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["lc-ghost"]);
  });

  it("catches one code redeemed by two different people", async () => {
    await client.execute({
      sql:
        `INSERT INTO license_codes (id, sponsor_id, code, status, source_type, tier, created_at, updated_at) ` +
        `VALUES (?,?,?,?,?,?,?,?)`,
      args: ["lc-shared", "v-good", "CODE-SHARED", "redeemed", "venue_edition", "wedding", 1, 1],
    });
    for (const [id, subject] of [["r-1", "clerk-a"], ["r-2", "clerk-b"]]) {
      await client.execute({
        sql: "INSERT INTO redemptions (id, code_id, user_clerk_id, redeemed_at) VALUES (?,?,?,?)",
        args: [id, "lc-shared", subject, 1],
      });
    }
    const result = await violationsOf("code-redeemed-twice");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["lc-shared"]);
  });

  it("warns when an unlimited venue still carries a seat count", async () => {
    await sponsor("v-seatcount", { allotment_mode: "unlimited", code_allotment: 10 });
    const result = await violationsOf("unlimited-sponsor-carrying-a-seat-count");
    assert.equal(result.violations, 1);
    assert.equal(result.severity, "warn");
  });

  it("catches an audit line with no chain hash", async () => {
    await client.execute({
      sql: "INSERT INTO entitlement_events (id, action, created_at) VALUES (?,?,?)",
      args: ["ev-unhashed", "sponsor_created", 1],
    });
    const result = await violationsOf("audit-ledger-missing-hash");
    assert.equal(result.violations, 1);
    assert.deepEqual(result.sample, ["ev-unhashed"]);
  });

  it("reports missing append-only triggers as a failing run, then passes once installed", async () => {
    const before = await ledgerEnforcement(client);
    assert.equal(before.applicable, true);
    assert.deepEqual(before.missing.sort(), [
      "entitlement_events_no_delete",
      "entitlement_events_no_update",
    ]);
    assert.equal(summarise([], before).ok, false);

    await applyTriggers(client);
    const afterInstall = await ledgerEnforcement(client);
    assert.deepEqual(afterInstall.missing, []);
    assert.equal(summarise([], afterInstall).ok, true);
  });

  it("skips, rather than silently passes, when a table is absent", async () => {
    const empty = createClient({ url: `file:${path.join(workDir, "bare.db").replaceAll("\\", "/")}` });
    try {
      await empty.execute("CREATE TABLE unrelated (id text primary key)");
      const results = await runChecks(empty);
      assert.ok(results.every((r) => r.skipped));
      const summary = summarise(results, await ledgerEnforcement(empty));
      assert.equal(summary.checksRun, 0);
      assert.equal(summary.checksSkipped, CHECKS.length);
    } finally {
      empty.close();
    }
  });

  it("refuses a check whose SQL is not a SELECT", async () => {
    await assert.rejects(
      () =>
        runChecks(client, [
          { id: "bad", severity: "error", tables: ["sponsors"], title: "t", why: "w", sql: "DELETE FROM sponsors" },
        ]),
      /read-only/,
    );
  });
});
