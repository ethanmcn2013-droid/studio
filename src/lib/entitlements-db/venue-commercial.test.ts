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
import { rowHashOf } from "./pure";
import { getProofGate } from "../hq/proofgate";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { DbProspect } from "../db/schema";
import { getModeledRunway } from "../hq/financial-model";

// Real disposable SQLite engines. No provider calls and no production env copy.
const DDL = [
  `CREATE TABLE entitlements (id text PRIMARY KEY, status text, tier text, source text)`,
  `CREATE TABLE license_codes (id text PRIMARY KEY, status text)`,
  `CREATE TABLE redemptions (id text PRIMARY KEY)`,
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
let getTraction: typeof import("../hq/traction").getTraction;
let computeBurndown: typeof import("../hq/traction").computeBurndown;
let formatEur: typeof import("../hq/traction").formatEur;
let deriveVerdict: typeof import("../hq/verdict").deriveVerdict;
let getHqSnapshot: typeof import("../hq/operating-system").getHqSnapshot;
let getHqReport: typeof import("../hq/operating-system").getHqReport;
let HqTraction: typeof import("../../components/hq/hq-traction").HqTraction;
let HqProofGate: typeof import("../../components/hq/hq-proof-gate").HqProofGate;
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
  ({ getTraction, computeBurndown, formatEur } = await import("../hq/traction"));
  ({ deriveVerdict } = await import("../hq/verdict"));
  ({ getHqSnapshot, getHqReport } = await import("../hq/operating-system"));
  ({ HqTraction } = await import("../../components/hq/hq-traction"));
  ({ HqProofGate } = await import("../../components/hq/hq-proof-gate"));
});

beforeEach(async () => {
  for (const client of [sharedClient, studioClient]) {
    await client.execute("DROP TRIGGER IF EXISTS refuse_write");
    for (const table of ["entitlement_events", "allotment_ledger", "sponsors", "entitlements", "license_codes", "redemptions"]) await client.execute(`DELETE FROM ${table}`);
    await seed(client);
  }
});
after(() => { sharedClient.close(); studioClient.close(); });

const readTraction = (now = Date.now()) => getTraction({ shared, studio }, now);
const emptyInbox: Parameters<typeof deriveVerdict>[0]["inbox"] = { generatedAt: "2026-09-04T12:00:00Z", items: [], tierCounts: { high: 0, mid: 0, low: 0 } };
const clearPulse: Parameters<typeof deriveVerdict>[0]["pulse"] = { level: "clear", signals: [], counts: { critical: 0, watch: 0 } };

test("populated legacy paid rows and plan choices do not pass cash or paid proof", async () => {
  for (const client of [sharedClient, studioClient]) {
    await client.execute({ sql: "UPDATE sponsors SET venue_plan='founding', paid_at=?, annual_amount_cents=100000, founding_locked=1 WHERE slug='test-venue'", args: [paidAt] });
  }
  await seed(studioClient, "mirror-only");
  await studioClient.execute({ sql: "UPDATE sponsors SET venue_plan='paid', paid_at=?, annual_amount_cents=150000 WHERE slug='mirror-only'", args: [paidAt] });
  await seed(sharedClient, "selected-plan");
  await sharedClient.execute("UPDATE sponsors SET venue_plan='paid' WHERE slug='selected-plan'");
  await studioClient.execute("INSERT INTO entitlements VALUES ('grant-1','active','workspace','venue_edition')");
  await studioClient.execute("INSERT INTO license_codes VALUES ('code-1','redeemed')");
  const state = await readTraction();
  assert.equal(state.available, true);
  if (!state.available) return;
  assert.equal(state.cashCollectedEur, 0);
  assert.equal(state.paidVenues, 0);
  assert.equal(state.foundingVenues, 0);
  assert.equal(state.unverifiedPaidVenues, 2, "mirror duplicates count once by slug");
  assert.equal(state.selectedUnpaidVenues, 1);
  assert.equal(state.couplesSeeded, 1);
  const proof = getProofGate(state, []);
  assert.equal(proof.metrics.paidPilots.kind === "live" && proof.metrics.paidPilots.met, false);
  const html = renderToStaticMarkup(createElement(HqTraction, { state })) +
    renderToStaticMarkup(createElement(HqProofGate, { gate: proof }));
  assert.match(html, /2 legacy or unmatched paid claims excluded/);
  assert.doesNotMatch(html, /cash in the door|slope starts now|half-year target|paid by tier/);
  const verdict = deriveVerdict({ inbox: emptyInbox, pulse: clearPulse, traction: state });
  assert.match(verdict.headline, /2 paid claims/);
  assert.doesNotMatch(verdict.action, /Contact venues|no venue signed/);
});

test("real payment receipts feed exact cash through traction, proof and all report projections", async () => {
  await pay();
  for (const client of [sharedClient, studioClient]) await seed(client, "standard-venue");
  await pay({ slug: "standard-venue", plan: "paid", amountCents: 150000, reference: "synthetic-standard" });
  await pay();
  const state = await readTraction();
  assert.equal(state.available, true);
  if (!state.available) return;
  assert.equal(state.cashCollectedEur, 2500);
  assert.equal(state.paidVenues, 2);
  assert.equal(state.foundingVenues, 1);
  assert.equal(state.unverifiedPaidVenues, 0);
  assert.equal(formatEur(1500), "€1,500");
  assert.deepEqual(getModeledRunway(2500), getModeledRunway(0), "payment does not prove the company funds itself");
  const proof = getProofGate(state, []);
  assert.equal(proof.metrics.paidPilots.kind === "live" && proof.metrics.paidPilots.met, true);
  assert.match(renderToStaticMarkup(createElement(HqTraction, { state })), /€2,500/);
  const snapshot = getHqSnapshot([], state);
  const report = getHqReport([], state);
  assert.equal(snapshot.cashCollected, "€2,500");
  assert.equal(report.metrics[0].value, "€2,500");
  assert.match(report.metrics[0].source, /shared.*receipt/);
  assert.match(report.metrics[0].target, /historical/);
  assert.equal(report.metrics[1].value, "2");
  assert.doesNotMatch(JSON.stringify({ snapshot, report }), /10 by M3|send the first founder letters/);
});

test("canonical receipt remains proof when the Studio mirror write fails", async () => {
  await studioClient.execute("CREATE TRIGGER refuse_write BEFORE UPDATE ON sponsors BEGIN SELECT RAISE(ABORT, 'synthetic mirror failure'); END");
  await assert.rejects(pay(), /mirror is incomplete/);
  assert.equal((await row(studioClient)).paid_at, null);
  const state = await readTraction();
  assert.equal(state.available && state.cashCollectedEur, 1000);
  assert.equal(state.available && state.paidVenues, 1);
});

test("superseded annual receipts count only the current financial record once", async () => {
  await pay();
  await pay({ paidAt: Date.parse("2026-08-01T12:00:00Z"), reference: "synthetic-renewal" });
  assert.equal(await eventCount(), 2);
  const state = await readTraction();
  assert.equal(state.available && state.paidVenues, 1);
  assert.equal(state.available && state.cashCollectedEur, 1000, "not a lifetime cumulative cash claim");
});

test("every current financial field must still match the payment receipt", async () => {
  await pay();
  const original = await row(sharedClient);
  for (const [field, changed] of [
    ["venue_plan", "paid"], ["annual_amount_cents", 150000], ["founding_locked", null],
    ["paid_at", paidAt + 1], ["term_starts_at", paidAt + 1], ["term_ends_at", paidAt + 1],
  ] as const) {
    await sharedClient.execute({ sql: `UPDATE sponsors SET ${field}=? WHERE slug='test-venue'`, args: [changed] });
    const state = await readTraction();
    assert.equal(state.available && state.paidVenues, 0, field);
    assert.equal(state.available && state.unverifiedPaidVenues, 1, field);
    await sharedClient.execute({ sql: `UPDATE sponsors SET ${field}=? WHERE slug='test-venue'`, args: [original[field]] });
  }
});

test("malformed, misbound, future and corrupted receipts cannot verify a paid claim", async () => {
  await pay();
  const [original] = await shared.select().from(sharedSchema.entitlementEvents);
  const evidence = JSON.parse(original.afterJson!);
  const variants = [
    { afterJson: "not json" }, { afterJson: JSON.stringify({ ...evidence, version: 99 }) },
    { afterJson: JSON.stringify({ ...evidence, slug: "another-venue" }) },
    { afterJson: JSON.stringify({ ...evidence, evidenceKey: "wrong-reference" }) },
    { action: "grant" }, { sponsorId: "another-venue" }, { actorId: null },
    { origin: "legacy-import" }, { createdAt: Date.now() + 86400000 },
  ];
  for (const patch of variants) {
    const event = { ...original, ...patch };
    // A consistent row hash alone must not make an incompatible receipt valid.
    await shared.update(sharedSchema.entitlementEvents).set({ ...event, rowHash: rowHashOf(event.prevHash!, event) });
    const state = await readTraction();
    assert.equal(state.available && state.paidVenues, 0, JSON.stringify(patch));
  }
  await shared.update(sharedSchema.entitlementEvents).set({ ...original, rowHash: "corrupted" });
  const corrupted = await readTraction();
  assert.equal(corrupted.available && corrupted.paidVenues, 0);
});

test("an unread canonical audit cannot fall back to the populated Studio paid mirror", async () => {
  await pay();
  await sharedClient.execute("ALTER TABLE entitlement_events RENAME TO unavailable_events");
  try {
    const state = await readTraction();
    assert.equal(state.available, false);
    assert.equal(getProofGate(state, []).metrics.paidPilots.kind, "unread");
  } finally {
    await sharedClient.execute("ALTER TABLE unavailable_events RENAME TO entitlement_events");
  }
});

test("cash and populated January CRM contacts cannot start a clock or authorise outreach", async () => {
  await pay();
  const contacts = ["2026-05-25", "2027-01-21"].map((day) => ({
    id: day, segment: "venue", stage: "demo_booked", lastContactedAt: day, nextFollowUpAt: null,
  } as DbProspect));
  for (const day of ["2026-09-04", "2027-01-20", "2027-01-21", "2027-02-25", "2028-01-21"]) {
    const now = Date.parse(`${day}T12:00:00Z`);
    const state = await readTraction(now);
    assert.equal(state.available, true);
    if (!state.available) continue;
    const clock = computeBurndown(250000, 250000, now);
    assert.equal(clock.state, day < "2027-01-21" ? "prelaunch" : "inert");
    assert.equal(clock.campaignStart, null);
    assert.equal(clock.campaignEnd, null);
    assert.equal(clock.m3Gate, null);
    const proof = getProofGate(state, contacts, now);
    assert.equal(proof.clock.state, clock.state);
    assert.equal(proof.clock.milestones.some(m => m.done || m.missed), false);
    const snapshot = getHqSnapshot(contacts, state, now);
    assert.equal(snapshot.founderSends, proof.sent);
    const verdict = deriveVerdict({ inbox: emptyInbox, pulse: clearPulse, traction: state });
    assert.doesNotMatch(JSON.stringify({ clock, proof, snapshot, verdict }), /2026-11-16|2026-08-16|Contact venues|send the first founder letters|behind the slope/);
  }
  const state = await readTraction();
  const snapshot = getHqSnapshot(undefined, state);
  assert.equal(snapshot.crmAvailable, false);
  assert.equal(getHqReport(undefined, state).metrics[2].value, "unread");
});

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
