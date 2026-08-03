import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { createClient, type Client } from "@libsql/client";

/**
 * Founding number assignment against a real SQLite engine.
 *
 * The promise being protected: no two venues ever hold the same place. The
 * pure rules are tested in `src/lib/venue-founding-number.test.ts`; this proves
 * the writer and, critically, the partial UNIQUE index that makes losing a race
 * harmless rather than silent.
 *
 * Run with the server-only shim:
 *   npx tsx --import ./src/test/register-server-only.mjs --test <this file>
 */

const DDL = [
  `CREATE TABLE sponsors (
     id text PRIMARY KEY,
     slug text NOT NULL UNIQUE,
     name text NOT NULL,
     contact_email text NOT NULL,
     brand_meta text,
     venue_plan text NOT NULL DEFAULT 'none',
     annual_amount_cents integer,
     founding_locked integer,
     term_starts_at integer,
     term_ends_at integer,
     paid_at integer,
     founding_number integer,
     founding_number_assigned_at integer,
     code_allotment integer,
     allotment_mode text NOT NULL DEFAULT 'limited',
     annual_wedding_count integer,
     fair_use_ceiling integer,
     codes_issued integer NOT NULL DEFAULT 0,
     kind text NOT NULL DEFAULT 'venue',
     reporting_timezone text,
     created_at integer NOT NULL DEFAULT (unixepoch() * 1000),
     updated_at integer NOT NULL DEFAULT (unixepoch() * 1000)
   )`,
  `CREATE UNIQUE INDEX sponsors_founding_number_idx
     ON sponsors (founding_number) WHERE founding_number IS NOT NULL`,
  `CREATE TABLE entitlement_events (
     id text PRIMARY KEY,
     entitlement_id text,
     user_clerk_id text,
     sponsor_id text,
     batch_id text,
     actor_id text,
     actor_name text,
     action text NOT NULL,
     reason text,
     before_json text,
     after_json text,
     origin text,
     prev_hash text,
     row_hash text,
     stripe_event_id text,
     created_at integer NOT NULL DEFAULT (unixepoch() * 1000)
   )`,
];

let client: Client;
let mod: typeof import("./founding-numbers");

const operator = {
  actorId: "op-test",
  actorName: "Test Operator",
  kind: "operator" as const,
  velocityExempt: false,
};

async function seed(input: {
  id: string;
  plan?: string;
  paidAt?: number | null;
  foundingNumber?: number | null;
}) {
  await client.execute({
    sql: `INSERT INTO sponsors (id, slug, name, contact_email, venue_plan, paid_at, founding_number)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      input.id,
      input.id,
      input.id,
      `${input.id}@example.invalid`,
      input.plan ?? "founding",
      input.paidAt === undefined ? Date.now() : input.paidAt,
      input.foundingNumber ?? null,
    ],
  });
}

const numberOf = async (id: string) => {
  const r = await client.execute({
    sql: "SELECT founding_number FROM sponsors WHERE id = ?",
    args: [id],
  });
  return r.rows[0]?.founding_number ?? null;
};

before(async () => {
  const temp = mkdtempSync(path.join(os.tmpdir(), "signal-founding-"));
  const url = `file:${path.join(temp, "entitlements.db").replaceAll("\\", "/")}`;
  client = createClient({ url });
  for (const statement of DDL) await client.execute(statement);
  process.env.TURSO_ENTITLEMENTS_DATABASE_URL = url;
  process.env.TURSO_ENTITLEMENTS_AUTH_TOKEN = "";
  mod = await import("./founding-numbers");
});

after(async () => {
  await client.close();
});

describe("assignFoundingNumber", () => {
  it("gives the first paid founding venue 01/25", async () => {
    await seed({ id: "v-first" });
    const res = await mod.assignFoundingNumber({ sponsorId: "v-first", actor: operator });
    assert.equal(res.state, "assigned");
    assert.equal(res.state === "assigned" && res.label, "01/25");
    assert.equal(Number(await numberOf("v-first")), 1);
  });

  it("gives the next venue the next place", async () => {
    await seed({ id: "v-second" });
    const res = await mod.assignFoundingNumber({ sponsorId: "v-second", actor: operator });
    assert.equal(res.state === "assigned" && res.label, "02/25");
  });

  it("refuses before the payment clears", async () => {
    // Not at signature, not on invoice, not on a verbal yes.
    await seed({ id: "v-signed-unpaid", paidAt: null });
    const res = await mod.assignFoundingNumber({
      sponsorId: "v-signed-unpaid",
      actor: operator,
    });
    assert.equal(res.state, "refused");
    assert.match(res.state === "refused" ? res.reason : "", /payment has not cleared/);
    assert.equal(await numberOf("v-signed-unpaid"), null);
  });

  it("refuses a venue that is not on the founding plan", async () => {
    await seed({ id: "v-standard", plan: "paid" });
    const res = await mod.assignFoundingNumber({ sponsorId: "v-standard", actor: operator });
    assert.equal(res.state, "refused");
    assert.match(res.state === "refused" ? res.reason : "", /only founding venues/);
  });

  it("is idempotent — a second call returns the same number, not a second one", async () => {
    const first = await mod.assignFoundingNumber({ sponsorId: "v-first", actor: operator });
    assert.equal(first.state, "already_assigned");
    assert.equal(first.state === "already_assigned" && first.number, 1);
    const rows = await client.execute(
      "SELECT COUNT(*) AS n FROM sponsors WHERE founding_number = 1",
    );
    assert.equal(Number(rows.rows[0].n), 1);
  });

  it("skips a number already held and never reissues it", async () => {
    // A venue that lapsed keeps 03/25. The next assignment must go to 04/25.
    await seed({ id: "v-lapsed", foundingNumber: 3 });
    await seed({ id: "v-next" });
    const res = await mod.assignFoundingNumber({ sponsorId: "v-next", actor: operator });
    assert.equal(res.state === "assigned" && res.label, "04/25");
    assert.equal(Number(await numberOf("v-lapsed")), 3);
  });

  it("records the assignment in the audit ledger", async () => {
    const events = await client.execute({
      sql: "SELECT action, reason, origin FROM entitlement_events WHERE sponsor_id = ?",
      args: ["v-first"],
    });
    assert.equal(events.rows.length, 1);
    assert.equal(String(events.rows[0].action), "grant");
    assert.match(String(events.rows[0].reason), /01\/25 assigned on cleared payment/);
    assert.equal(String(events.rows[0].origin), "founding-number");
  });
});

describe("the unique index is the real guarantee", () => {
  it("the database refuses a duplicate number outright", async () => {
    // If the application logic is ever wrong, this is what stops two venues
    // being told they are both 07/25.
    await seed({ id: "v-holds-seven", foundingNumber: 7 });
    await seed({ id: "v-wants-seven" });
    await assert.rejects(
      client.execute({
        sql: "UPDATE sponsors SET founding_number = 7 WHERE id = ?",
        args: ["v-wants-seven"],
      }),
      /UNIQUE constraint failed/,
    );
  });

  it("any number of venues may hold no number at all", async () => {
    await seed({ id: "v-none-a", paidAt: null });
    await seed({ id: "v-none-b", paidAt: null });
    const rows = await client.execute(
      "SELECT COUNT(*) AS n FROM sponsors WHERE founding_number IS NULL",
    );
    assert.ok(Number(rows.rows[0].n) >= 2, "the partial index must not constrain NULLs");
  });

  it("a run of assignments never repeats a number", async () => {
    // NOTE ON WHAT IS AND IS NOT PROVED HERE.
    // True write concurrency is not exercisable against the local-file libsql
    // driver: it serialises writes and raises SQLITE_BUSY rather than running
    // them, so a Promise.all here would test the driver, not this code.
    // Production runs on Turso, which handles concurrent writes server-side.
    // The guarantee that survives either way is the partial UNIQUE index
    // (proved above) plus the retry path (proved in the isRetryable tests
    // below), and this proves the ordinary sequential path allocates cleanly.
    const ids = ["c-1", "c-2", "c-3", "c-4", "c-5"];
    for (const id of ids) await seed({ id });
    const assigned: number[] = [];
    for (const id of ids) {
      const res = await mod.assignFoundingNumber({ sponsorId: id, actor: operator });
      assert.equal(res.state, "assigned", `${id} should get a place`);
      assigned.push((res as { number: number }).number);
    }
    assert.equal(new Set(assigned).size, assigned.length, "two venues got the same number");
    for (const n of assigned) assert.ok(n >= 1 && n <= 25);
  });

  it("recognises the two recoverable failures through drizzle's wrapper", () => {
    // The defect this replaces: drizzle wraps the driver error as
    // `Failed query: update "sponsors" …`, so matching only the top-level
    // message turned a recoverable race into a thrown request. Both shapes
    // arrive nested, which is why the cause chain is walked.
    const wrapped = (cause: unknown) => {
      const e = new Error('Failed query: update "sponsors" set "founding_number" = ?');
      (e as { cause?: unknown }).cause = cause;
      return e;
    };

    const unique = new Error("SQLITE_CONSTRAINT: UNIQUE constraint failed: sponsors.founding_number");
    (unique as { code?: string }).code = "SQLITE_CONSTRAINT_UNIQUE";
    assert.equal(mod.isRetryable(wrapped(unique)), true, "a lost race must retry");

    const busy = new Error("SQLITE_BUSY: database is locked");
    (busy as { code?: string }).code = "SQLITE_BUSY";
    assert.equal(mod.isRetryable(wrapped(busy)), true, "a momentary lock must retry");

    // Anything else is a real failure and must surface, not spin.
    assert.equal(mod.isRetryable(wrapped(new Error("no such column: founding_number"))), false);
    assert.equal(mod.isRetryable(new Error("boom")), false);
    assert.equal(mod.isRetryable(null), false);
    assert.equal(mod.isRetryable("UNIQUE constraint failed"), true);

    // A self-referential cause chain must not hang the retry loop.
    const loop = new Error("Failed query");
    (loop as { cause?: unknown }).cause = loop;
    assert.equal(mod.isRetryable(loop), false);
  });
});

describe("withdrawFoundingNumber", () => {
  it("returns the place to the pool on a reversed payment", async () => {
    await seed({ id: "v-reversed", foundingNumber: 20 });
    const res = await mod.withdrawFoundingNumber({
      sponsorId: "v-reversed",
      reason: "payment reversed by the bank on 2026-09-14",
      actor: operator,
    });
    assert.equal(res.state, "withdrawn");
    assert.equal(res.state === "withdrawn" && res.label, "20/25");
    assert.equal(await numberOf("v-reversed"), null);

    // The freed place is genuinely reusable — this is the one case where a
    // number goes back.
    await seed({ id: "v-takes-twenty", paidAt: Date.now() });
    const taken = await client.execute(
      "SELECT COUNT(*) AS n FROM sponsors WHERE founding_number = 20",
    );
    assert.equal(Number(taken.rows[0].n), 0);
  });

  it("requires a reason, because the venue is told", async () => {
    await seed({ id: "v-noreason", foundingNumber: 21 });
    const res = await mod.withdrawFoundingNumber({
      sponsorId: "v-noreason",
      reason: "   ",
      actor: operator,
    });
    assert.equal(res.state, "refused");
    assert.equal(Number(await numberOf("v-noreason")), 21, "nothing may change without a reason");
  });

  it("records the withdrawal and its reason in the audit ledger", async () => {
    const events = await client.execute({
      sql: "SELECT action, reason FROM entitlement_events WHERE sponsor_id = ? AND action = 'revoke'",
      args: ["v-reversed"],
    });
    assert.equal(events.rows.length, 1);
    assert.match(String(events.rows[0].reason), /20\/25 withdrawn: payment reversed/);
  });

  it("reports a venue that holds no number rather than throwing", async () => {
    await seed({ id: "v-nonumber", paidAt: null });
    const res = await mod.withdrawFoundingNumber({
      sponsorId: "v-nonumber",
      reason: "tidy-up",
      actor: operator,
    });
    assert.equal(res.state, "no_number");
  });
});

describe("programme status", () => {
  it("reports places honestly, for scarcity claims", async () => {
    const status = await mod.foundingProgrammeStatus();
    assert.equal(status.taken.length + status.remaining, 25);
    assert.deepEqual(
      status.taken,
      [...status.taken].sort((a, b) => a - b),
      "taken places should read in order",
    );
    assert.equal(status.closed, status.remaining === 0);
  });
});
