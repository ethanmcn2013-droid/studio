import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, beforeEach, test } from "node:test";
import { spawnSync } from "node:child_process";
import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import type { VenuePaymentInput } from "./venue-payment";
import * as sharedSchema from "./schema";
import * as studioSchema from "../db/schema";
import { verifyChainRows } from "./pure";

// Real disposable SQLite engines. No provider calls and no production env copy.
const DDL = [
  `CREATE TABLE sponsors (
    id text PRIMARY KEY, slug text NOT NULL UNIQUE, name text NOT NULL,
    contact_email text NOT NULL, brand_meta text, venue_plan text NOT NULL DEFAULT 'none',
    annual_amount_cents integer, founding_locked integer, term_starts_at integer,
    term_ends_at integer, paid_at integer, founding_number integer,
    founding_number_assigned_at integer, code_allotment integer,
    allotment_mode text NOT NULL DEFAULT 'limited', annual_wedding_count integer,
    fair_use_ceiling integer, codes_issued integer NOT NULL DEFAULT 0,
    kind text NOT NULL DEFAULT 'venue', reporting_timezone text,
    created_at integer NOT NULL DEFAULT (unixepoch()*1000),
    updated_at integer NOT NULL DEFAULT (unixepoch()*1000)
  )`,
  `CREATE TABLE entitlement_events (
    id text PRIMARY KEY, entitlement_id text, user_clerk_id text, sponsor_id text,
    batch_id text, actor_id text, actor_name text, action text NOT NULL, reason text,
    before_json text, after_json text, origin text, prev_hash text, row_hash text,
    stripe_event_id text, created_at integer NOT NULL DEFAULT (unixepoch()*1000)
  )`,
  `CREATE TABLE allotment_ledger (
    id text PRIMARY KEY, sponsor_id text NOT NULL, delta integer NOT NULL,
    reason text NOT NULL, actor_id text, term_starts_at integer, term_ends_at integer,
    created_at integer NOT NULL DEFAULT (unixepoch()*1000)
  )`,
];
let sharedClient: Client;
let studioClient: Client;
let shared: ReturnType<typeof drizzle<typeof sharedSchema>>;
let studio: ReturnType<typeof drizzle<typeof studioSchema>>;
let payment: typeof import("./venue-payment");
let onboarding: typeof import("./venues");
let dir: string;
let sharedUrl: string;
let studioUrl: string;
const actor = { actorId: "test-operator", actorName: "Test Operator", kind: "operator" as const, velocityExempt: false };
const paidAt = Date.parse("2025-08-01T12:00:00.000Z");
const receipt: VenuePaymentInput = {
  slug: "test-venue", plan: "founding", reference: "synthetic-receipt-001",
  paidAt, amountCents: 100000, actorId: actor.actorId, actorName: actor.actorName,
};
const pay = (overrides: Partial<VenuePaymentInput> = {}) => payment.recordVenuePayment({ ...receipt, ...overrides }, { shared, studio });
const row = async (client: Client) => (await client.execute("SELECT * FROM sponsors WHERE slug = 'test-venue'")).rows[0];
const eventCount = async () => Number((await sharedClient.execute("SELECT count(*) AS n FROM entitlement_events")).rows[0].n);
async function seed(client: Client, id = "test-venue") {
  await client.execute({ sql: "INSERT INTO sponsors (id,slug,name,contact_email) VALUES (?,?,?,?)", args: [id, id, "Synthetic venue", "venue@example.invalid"] });
}

before(async () => {
  dir = mkdtempSync(path.join(os.tmpdir(), "signal-commercial-"));
  sharedUrl = `file:${path.join(dir, "shared.db").replaceAll("\\", "/")}`;
  studioUrl = `file:${path.join(dir, "studio.db").replaceAll("\\", "/")}`;
  sharedClient = createClient({ url: sharedUrl });
  studioClient = createClient({ url: studioUrl });
  for (const client of [sharedClient, studioClient]) for (const sql of DDL) await client.execute(sql);
  shared = drizzle(sharedClient, { schema: sharedSchema });
  studio = drizzle(studioClient, { schema: studioSchema });
  process.env.ENTITLEMENTS_DATABASE_URL = sharedUrl;
  process.env.ENTITLEMENTS_AUTH_TOKEN = "";
  process.env.SIGNAL_HQ_OPERATORS = "test-operator:Test Operator";
  payment = await import("./venue-payment");
  onboarding = await import("./venues");
});

beforeEach(async () => {
  for (const client of [sharedClient, studioClient]) {
    await client.execute("DROP TRIGGER IF EXISTS refuse_write");
    for (const table of ["entitlement_events", "allotment_ledger", "sponsors"]) await client.execute(`DELETE FROM ${table}`);
    await seed(client);
  }
});
after(() => { sharedClient.close(); studioClient.close(); });

test("selecting a paid plan creates no payment, and onboarding preserves paid financial history", async () => {
  for (const plan of ["pilot", "founding", "paid"] as const) {
    const result = await onboarding.onboardVenue({ name: `New ${plan}`, contactEmail: "test@example.invalid", venuePlan: plan, allotmentMode: "unlimited", actor });
    assert.equal(result.paid, false);
    const rows = await sharedClient.execute({ sql: "SELECT paid_at FROM sponsors WHERE id = ?", args: [result.id] });
    assert.equal(rows.rows[0].paid_at, null);
  }
  await pay();
  const prior = await row(sharedClient);
  const result = await onboarding.onboardVenue({ slug: "test-venue", name: "Updated venue", contactEmail: "updated@example.invalid", venuePlan: "founding", termMonths: 99, allotmentMode: "unlimited", actor });
  assert.equal(result.paid, true);
  const updated = await row(sharedClient);
  for (const key of ["paid_at", "annual_amount_cents", "founding_locked", "term_starts_at", "term_ends_at"]) assert.equal(updated[key], prior[key]);
  assert.equal(updated.name, "Updated venue");
  await assert.rejects(onboarding.onboardVenue({ slug: "test-venue", name: "Changed plan", contactEmail: "test@example.invalid", venuePlan: "paid", allotmentMode: "unlimited", actor }), /payment review/);
});

test("re-onboarding an unpaid venue remains unpaid and limited allotment deltas stay correct", async () => {
  for (const allotment of [5, 12, 12]) {
    const result = await onboarding.onboardVenue({ slug: "test-venue", name: "Synthetic venue", contactEmail: "test@example.invalid", venuePlan: "paid", allotmentMode: "limited", allotment, actor });
    assert.equal(result.paid, false);
  }
  assert.equal((await row(sharedClient)).paid_at, null);
  const totals = await sharedClient.execute("SELECT sum(delta) AS total FROM allotment_ledger");
  assert.equal(totals.rows[0].total, 12);
});

test("cleared payment records exact retained terms and hash-chained evidence, then repeats without changes", async () => {
  const first = await pay();
  const original = await row(studioClient);
  const second = await pay();
  assert.equal(second.replayed, true);
  assert.equal(second.eventId, first.eventId);
  assert.equal(await eventCount(), 1);
  assert.equal(original.paid_at, paidAt);
  assert.equal(original.annual_amount_cents, 100000);
  assert.equal(original.founding_locked, 1);
  assert.equal(original.term_ends_at, paidAt + 365 * 86400000);
  assert.deepEqual(await row(studioClient), original);
  const events = await shared.select().from(sharedSchema.entitlementEvents);
  assert.equal(verifyChainRows(events).ok, true);
  assert.doesNotMatch(JSON.stringify(events), /synthetic-receipt-001|example.invalid/);
});

test("shared audit failure rolls back payment and leaves Studio untouched", async () => {
  await sharedClient.execute("CREATE TRIGGER refuse_write BEFORE INSERT ON entitlement_events BEGIN SELECT RAISE(ABORT, 'synthetic audit failure'); END");
  await assert.rejects(pay());
  assert.equal((await row(sharedClient)).paid_at, null);
  assert.equal((await row(studioClient)).paid_at, null);
  assert.equal(await eventCount(), 0);
});

test("mirror failure is explicit and the same receipt repairs it without a new payment or term", async () => {
  await studioClient.execute("CREATE TRIGGER refuse_write BEFORE UPDATE ON sponsors BEGIN SELECT RAISE(ABORT, 'synthetic mirror failure'); END");
  await assert.rejects(pay(), payment.VenuePaymentMirrorError);
  assert.equal((await row(sharedClient)).paid_at, paidAt);
  assert.equal((await row(studioClient)).paid_at, null);
  assert.equal(await eventCount(), 1);
  await studioClient.execute("DROP TRIGGER refuse_write");
  const repaired = await pay();
  assert.equal(repaired.replayed, true);
  assert.equal((await row(studioClient)).paid_at, paidAt);
  assert.equal(await eventCount(), 1);
});

test("missing shared or Studio sponsors fail rather than reporting a zero-row mirror success", async () => {
  await sharedClient.execute("DELETE FROM sponsors");
  await assert.rejects(pay(), /Shared venue sponsor is missing/);
  assert.equal((await row(studioClient)).paid_at, null);
  await seed(sharedClient);
  await studioClient.execute("DELETE FROM sponsors");
  await assert.rejects(pay(), /Studio sponsor is missing/);
  assert.equal((await row(sharedClient)).paid_at, null);
  assert.equal(await eventCount(), 0);
});

test("reference conflicts, future payment, wrong amounts and anonymous operators cannot create evidence", async () => {
  for (const change of [
    { reference: "" }, { paidAt: Date.now() + 86400000 }, { amountCents: 150000 },
    { amountCents: 99999 }, { actorId: "" }, { actorId: "not-in-roster" },
  ]) await assert.rejects(pay(change));
  assert.equal(await eventCount(), 0);
  await pay();
  await assert.rejects(pay({ paidAt: paidAt + 1000 }), /different evidence/);
  await assert.rejects(pay({ reference: "another-receipt" }), /not newer/);
  await seed(sharedClient, "other-venue");
  await seed(studioClient, "other-venue");
  await assert.rejects(pay({ slug: "other-venue" }), /different evidence/);
  assert.equal(await eventCount(), 1);
});

test("old receipt cannot roll back a later payment, and continuous Founding rate is retained", async () => {
  await pay();
  await assert.rejects(pay({ reference: "wrong-rate", paidAt: paidAt + 86400000, plan: "paid", amountCents: 150000 }), /retains its Founding rate/);
  await assert.rejects(pay({ reference: "early-renewal", paidAt: paidAt + 86400000 }), /Early renewal/);
  await pay({ reference: "later-payment", paidAt: paidAt + 365 * 86400000 });
  await assert.rejects(pay(), /superseded/);
  assert.equal((await row(studioClient)).paid_at, paidAt + 365 * 86400000);
  assert.equal(await eventCount(), 2);
});

test("standard annual payment uses 150000 cents and no Founding lock", async () => {
  await pay({ plan: "paid", amountCents: 150000 });
  assert.equal((await row(studioClient)).annual_amount_cents, 150000);
  assert.equal((await row(sharedClient)).founding_locked, null);
});

test("CLI exits nonzero on a partial mirror and succeeds when the identical command repairs it", async () => {
  const root = process.cwd();
  const args = [path.join(root, "node_modules/tsx/dist/cli.mjs"), "--tsconfig", path.join(root, "tsconfig.json"), path.join(root, "scripts/mark-venue-paid.ts"),
    "test-venue", "founding", "--reference", receipt.reference, "--paid-at", new Date(paidAt).toISOString(), "--amount-cents", "100000", "--actor-id", actor.actorId, "--actor-name", actor.actorName];
  const env = { ...process.env, STUDIO_DATABASE_URL: studioUrl, STUDIO_AUTH_TOKEN: "", ENTITLEMENTS_DATABASE_URL: sharedUrl, ENTITLEMENTS_AUTH_TOKEN: "" };
  // cwd has no .env files; all database inputs point to disposable files.
  await studioClient.execute("CREATE TRIGGER refuse_write BEFORE UPDATE ON sponsors BEGIN SELECT RAISE(ABORT, 'synthetic mirror failure'); END");
  const failed = spawnSync(process.execPath, args, { cwd: dir, env, encoding: "utf8" });
  assert.equal(failed.status, 1, failed.stderr);
  assert.match(failed.stderr, /Studio mirror is incomplete/);
  await studioClient.execute("DROP TRIGGER refuse_write");
  const repaired = spawnSync(process.execPath, args, { cwd: dir, env, encoding: "utf8" });
  assert.equal(repaired.status, 0, repaired.stderr);
  assert.match(repaired.stdout, /existing evidence replayed.*mirror complete/);
  assert.equal(await eventCount(), 1);
});

test("concurrent identical receipts converge to one evidence event across independent SQLite connections", async () => {
  const sharedOther = createClient({ url: sharedUrl });
  const studioOther = createClient({ url: studioUrl });
  try {
    await Promise.allSettled([
      pay(),
      payment.recordVenuePayment(receipt, {
        shared: drizzle(sharedOther, { schema: sharedSchema }),
        studio: drizzle(studioOther, { schema: studioSchema }),
      }),
    ]);
    // SQLite may report write contention; a retry of the same receipt must
    // converge without a second event or a shifted term on either side.
    const retry = await pay();
    assert.equal(retry.replayed, true);
    assert.equal(await eventCount(), 1);
    assert.equal((await row(studioClient)).paid_at, paidAt);
    assert.equal((await row(sharedClient)).term_ends_at, paidAt + 365 * 86400000);
  } finally {
    sharedOther.close();
    studioOther.close();
  }
});
