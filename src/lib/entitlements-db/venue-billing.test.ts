import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { createClient, type Client } from "@libsql/client";

import { annualTermEndsAtMs } from "@/lib/venue-billing";
// Plain .mjs, shared with the migration script — that sharing is the point.
import { venueBillingDdlStatements } from "../../../scripts/venue-billing-ddl.mjs";

/**
 * The Venue Edition cash ledger against a real SQLite engine.
 *
 * What is being protected, in order of how bad it is to get wrong:
 *
 *   1. A lapse must not move one couple's access. D-020 point 2 is stated
 *      unprompted in the outreach email and the agreement, and it is the
 *      promise that stops the worst outcome this product can produce.
 *   2. A founding venue must never be recorded at the standard price. That
 *      defect shipped once (I-002).
 *   3. A historical price must survive a price change.
 *   4. A cleared payment must actually assign the founding number. Before this
 *      writer existed, the only thing that recorded a payment never called the
 *      assigner.
 *
 * Run with the server-only shim:
 *   npx tsx --import ./src/test/register-server-only.mjs --test <this file>
 */

const DAY = 24 * 60 * 60 * 1000;

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
  `CREATE TABLE entitlements (
     id text PRIMARY KEY,
     user_clerk_id text NOT NULL,
     tier text NOT NULL,
     source text NOT NULL,
     source_ref text,
     granted_at integer NOT NULL DEFAULT (unixepoch() * 1000),
     expires_at integer,
     status text NOT NULL DEFAULT 'active',
     wedding_date integer,
     created_at integer NOT NULL DEFAULT (unixepoch() * 1000),
     updated_at integer NOT NULL DEFAULT (unixepoch() * 1000)
   )`,
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
  // The ledger table, its indexes and its append-only triggers come from the
  // module the migration itself executes. The previous version of this file
  // carried its own copy with a comment promising it was "kept identical on
  // purpose" — a promise nothing could check. These tests now run against the
  // statements production gets.
  ...venueBillingDdlStatements(),
];

let client: Client;
let mod: typeof import("./venue-billing");

const operator = {
  actorId: "op-test",
  actorName: "Test Operator",
  kind: "operator" as const,
  velocityExempt: false,
};

const TERM_START = Date.parse("2026-09-01T10:00:00.000Z");
const TERM_END = annualTermEndsAtMs(TERM_START);

async function seedVenue(input: { id: string; plan?: string }) {
  await client.execute({
    sql: `INSERT INTO sponsors (id, slug, name, contact_email, venue_plan)
          VALUES (?, ?, ?, ?, ?)`,
    args: [input.id, input.id, input.id, `${input.id}@example.invalid`, input.plan ?? "founding"],
  });
}

const sponsorRow = async (id: string) => {
  const r = await client.execute({ sql: "SELECT * FROM sponsors WHERE id = ?", args: [id] });
  return r.rows[0];
};

before(async () => {
  const temp = mkdtempSync(path.join(os.tmpdir(), "signal-venue-billing-"));
  const url = `file:${path.join(temp, "entitlements.db").replaceAll("\\", "/")}`;
  client = createClient({ url });
  for (const statement of DDL) await client.execute(statement);
  process.env.ENTITLEMENTS_DATABASE_URL = url;
  process.env.ENTITLEMENTS_AUTH_TOKEN = "";
  process.env.TURSO_ENTITLEMENTS_DATABASE_URL = url;
  process.env.TURSO_ENTITLEMENTS_AUTH_TOKEN = "";
  mod = await import("./venue-billing");
});

after(async () => {
  await client.close();
});

describe("recordAnnualPrepayment", () => {
  it("records a founding term and assigns the founding number in the same operation", async () => {
    await seedVenue({ id: "v-founding" });
    const result = await mod.recordAnnualPrepayment({
      sponsorId: "v-founding",
      venuePlan: "founding",
      amountReceivedCents: 100_000,
      paidAtMs: TERM_START,
      actor: operator,
      recordedVia: "cli:mark-venue-paid",
    });
    assert.equal(result.state, "recorded");
    if (result.state !== "recorded") return;

    assert.equal(result.amount.grossCents, 100_000);
    assert.equal(result.termEndsAtMs, TERM_END);
    // The gap this closes: the only writer that recorded a cleared payment
    // never called the assigner, so a venue could be marked paid and hold no
    // number at all.
    assert.equal(result.foundingNumber?.label, "01/25");

    const sponsor = await sponsorRow("v-founding");
    assert.equal(Number(sponsor.annual_amount_cents), 100_000);
    assert.equal(Number(sponsor.founding_locked), 1);
    assert.equal(Number(sponsor.paid_at), TERM_START);
    assert.equal(Number(sponsor.term_ends_at), TERM_END);
    assert.equal(Number(sponsor.founding_number), 1);
  });

  it("records the standard term at the standard price and assigns no number", async () => {
    await seedVenue({ id: "v-standard", plan: "paid" });
    const result = await mod.recordAnnualPrepayment({
      sponsorId: "v-standard",
      venuePlan: "paid",
      amountReceivedCents: 150_000,
      paidAtMs: TERM_START,
      actor: operator,
      recordedVia: "cli:mark-venue-paid",
    });
    assert.equal(result.state, "recorded");
    if (result.state !== "recorded") return;
    assert.equal(result.amount.grossCents, 150_000);
    assert.equal(result.foundingNumber, undefined);
    assert.equal((await sponsorRow("v-standard")).founding_number, null);
  });

  it("refuses the standard price against a founding agreement", async () => {
    // I-002: mark-venue-paid.ts wrote the standard price for both plans, so
    // every founding venue would have been in the cash ledger at EUR 1,500
    // against EUR 1,000 actually received.
    await seedVenue({ id: "v-wrong-price" });
    const result = await mod.recordAnnualPrepayment({
      sponsorId: "v-wrong-price",
      venuePlan: "founding",
      amountReceivedCents: 150_000,
      paidAtMs: TERM_START,
      actor: operator,
      recordedVia: "cli:mark-venue-paid",
    });
    assert.equal(result.state, "refused");
    assert.match(result.state === "refused" ? result.reason : "", /I-002/);

    const rows = await client.execute({
      sql: "SELECT COUNT(*) AS n FROM sponsor_price_agreements WHERE sponsor_id = ?",
      args: ["v-wrong-price"],
    });
    assert.equal(Number(rows.rows[0].n), 0, "a refused payment writes nothing");
    assert.equal((await sponsorRow("v-wrong-price")).paid_at, null);
  });

  it("refuses the founding price against a standard agreement", async () => {
    await seedVenue({ id: "v-wrong-price-2", plan: "paid" });
    const result = await mod.recordAnnualPrepayment({
      sponsorId: "v-wrong-price-2",
      venuePlan: "paid",
      amountReceivedCents: 100_000,
      paidAtMs: TERM_START,
      actor: operator,
      recordedVia: "cli:mark-venue-paid",
    });
    assert.equal(result.state, "refused");
  });

  it("refuses a write with no identified actor and no recording route", async () => {
    await seedVenue({ id: "v-noactor" });
    await assert.rejects(
      mod.recordAnnualPrepayment({
        sponsorId: "v-noactor",
        venuePlan: "founding",
        amountReceivedCents: 100_000,
        paidAtMs: TERM_START,
        actor: null as never,
        recordedVia: "cli:mark-venue-paid",
      }),
      /no identified actor/,
    );
    const noRoute = await mod.recordAnnualPrepayment({
      sponsorId: "v-noactor",
      venuePlan: "founding",
      amountReceivedCents: 100_000,
      paidAtMs: TERM_START,
      actor: operator,
      recordedVia: "  ",
    });
    assert.equal(noRoute.state, "refused");
    assert.match(noRoute.state === "refused" ? noRoute.reason : "", /recordedVia/);
  });

  it("is idempotent: the same payment recorded twice is one term", async () => {
    const again = await mod.recordAnnualPrepayment({
      sponsorId: "v-founding",
      venuePlan: "founding",
      amountReceivedCents: 100_000,
      paidAtMs: TERM_START,
      actor: operator,
      recordedVia: "cli:mark-venue-paid",
    });
    assert.equal(again.state, "already_recorded");
    const rows = await client.execute({
      sql: "SELECT COUNT(*) AS n FROM sponsor_price_agreements WHERE sponsor_id = ?",
      args: ["v-founding"],
    });
    assert.equal(Number(rows.rows[0].n), 1);
  });

  it("records the VAT treatment as undetermined rather than as zero", async () => {
    const row = await client.execute({
      sql: "SELECT vat_basis, vat_rate_basis_points, net_amount_cents, vat_amount_cents FROM sponsor_price_agreements WHERE sponsor_id = ?",
      args: ["v-founding"],
    });
    assert.equal(String(row.rows[0].vat_basis), "inclusive");
    assert.equal(row.rows[0].vat_rate_basis_points, null);
    assert.equal(row.rows[0].net_amount_cents, null, "null means not determined; zero would be a claim");
    assert.equal(row.rows[0].vat_amount_cents, null);
  });

  it("stores the derived net when a rate is supplied, and it reconciles to gross", async () => {
    await seedVenue({ id: "v-rated", plan: "paid" });
    const result = await mod.recordAnnualPrepayment({
      sponsorId: "v-rated",
      venuePlan: "paid",
      amountReceivedCents: 150_000,
      paidAtMs: TERM_START,
      vatRateBasisPoints: 2300,
      actor: operator,
      recordedVia: "cli:mark-venue-paid",
    });
    assert.equal(result.state, "recorded");
    const row = await client.execute({
      sql: "SELECT gross_amount_cents, net_amount_cents, vat_amount_cents FROM sponsor_price_agreements WHERE sponsor_id = ?",
      args: ["v-rated"],
    });
    const gross = Number(row.rows[0].gross_amount_cents);
    const net = Number(row.rows[0].net_amount_cents);
    const vat = Number(row.rows[0].vat_amount_cents);
    assert.equal(net, 121_951);
    assert.equal(net + vat, gross);
  });

  it("writes one audit line per recorded term", async () => {
    const events = await client.execute({
      sql: "SELECT action, reason, origin FROM entitlement_events WHERE sponsor_id = ? AND action = 'grant' ORDER BY created_at",
      args: ["v-founding"],
    });
    // One for the term, one for the founding number.
    assert.equal(events.rows.length, 2);
    assert.match(String(events.rows[0].reason), /annual prepaid term recorded/);
    assert.match(String(events.rows[0].reason), /inclusive of VAT at the prevailing rate/);
    assert.match(String(events.rows[1].reason), /01\/25 assigned on cleared payment/);
  });
});

describe("the historical price record", () => {
  it("survives a price change, per term", async () => {
    // Year two is recorded at the founding rate. A third term is then written
    // directly at a hypothetical future standard price of EUR 1,800 — the
    // change E08.02 exists to survive.
    const year2Start = TERM_END;
    const year2 = await mod.recordAnnualPrepayment({
      sponsorId: "v-founding",
      venuePlan: "founding",
      amountReceivedCents: 100_000,
      paidAtMs: year2Start,
      termStartsAtMs: year2Start,
      actor: operator,
      recordedVia: "cli:mark-venue-paid",
    });
    assert.equal(year2.state, "recorded");

    const year3Start = annualTermEndsAtMs(year2Start);
    await client.execute({
      sql: `INSERT INTO sponsor_price_agreements
            (id, sponsor_id, venue_plan, gross_amount_cents, amount_received_cents,
             price_basis, effective_from, effective_to, paid_at, recorded_by, recorded_via)
            VALUES ('pa-future', 'v-founding', 'paid', 180000, 180000,
                    'hypothetical future standard price', ?, ?, ?, 'op', 'test')`,
      args: [year3Start, annualTermEndsAtMs(year3Start), year3Start],
    });

    const inYear1 = await mod.priceOnDate("v-founding", TERM_START + DAY);
    assert.equal(inYear1?.amount.grossCents, 100_000, "the first term still reads EUR 1,000");
    const inYear2 = await mod.priceOnDate("v-founding", year2Start + DAY);
    assert.equal(inYear2?.amount.grossCents, 100_000);
    const inYear3 = await mod.priceOnDate("v-founding", year3Start + DAY);
    assert.equal(inYear3?.amount.grossCents, 180_000);

    const history = await mod.priceAgreementHistory("v-founding");
    assert.equal(history.length, 3);
    assert.deepEqual(
      history.map((h) => h.grossAmountCents),
      [100_000, 100_000, 180_000],
      "each term keeps the amount it was actually charged",
    );
    assert.equal((await mod.currentPriceAgreement("v-founding"))?.amount.grossCents, 180_000);
  });

  it("refuses to renew a held founding lock onto the standard plan", async () => {
    // Its own venue on purpose: the tests above leave v-founding carrying a
    // directly-inserted future standard term, which is exactly the fixture
    // state that would make this test pass for the wrong reason.
    await seedVenue({ id: "v-lock" });
    const first = await mod.recordAnnualPrepayment({
      sponsorId: "v-lock",
      venuePlan: "founding",
      amountReceivedCents: 100_000,
      paidAtMs: TERM_START,
      actor: operator,
      recordedVia: "cli:mark-venue-paid",
    });
    assert.equal(first.state, "recorded");

    // Year two is offered as a standard EUR 1,500 agreement: a correct amount
    // for the plan named, which is all prepaymentRefusal checks. Without
    // planChangeRefusal this writes, every historical row stays intact, and the
    // EUR 1,000 lock ends with no lapse on record anywhere.
    const before = await mod.priceAgreementHistory("v-lock");
    const year2Start = annualTermEndsAtMs(TERM_START);
    const attempt = await mod.recordAnnualPrepayment({
      sponsorId: "v-lock",
      venuePlan: "paid",
      amountReceivedCents: 150_000,
      paidAtMs: year2Start,
      termStartsAtMs: year2Start,
      actor: operator,
      recordedVia: "cli:mark-venue-paid",
    });
    assert.equal(attempt.state, "refused", "a held founding lock was downgraded");
    assert.match(
      attempt.state === "refused" ? attempt.reason : "",
      /renews continuously without lapse/,
    );

    // Nothing was written, and the venue still reads EUR 1,000.
    const after = await mod.priceAgreementHistory("v-lock");
    assert.equal(after.length, before.length, "a refused renewal still wrote a row");
    assert.equal(
      (await mod.priceOnDate("v-lock", TERM_START + DAY))?.amount.grossCents,
      100_000,
    );

    // And the renewal on its own plan is still accepted, so the guard refuses
    // the plan change rather than renewal itself.
    const renewed = await mod.recordAnnualPrepayment({
      sponsorId: "v-lock",
      venuePlan: "founding",
      amountReceivedCents: 100_000,
      paidAtMs: year2Start,
      termStartsAtMs: year2Start,
      actor: operator,
      recordedVia: "cli:mark-venue-paid",
    });
    assert.equal(renewed.state, "recorded");
  });

  it("cannot be rewritten or deleted", async () => {
    await assert.rejects(
      client.execute(
        "UPDATE sponsor_price_agreements SET gross_amount_cents = 180000 WHERE sponsor_id = 'v-founding' AND effective_from = " +
          TERM_START,
      ),
      /append-only/,
    );
    await assert.rejects(
      client.execute("DELETE FROM sponsor_price_agreements WHERE sponsor_id = 'v-founding'"),
      /append-only/,
    );
    const still = await mod.priceOnDate("v-founding", TERM_START + DAY);
    assert.equal(still?.amount.grossCents, 100_000);
  });

  it("reports no price for a date outside every term", async () => {
    assert.equal(await mod.priceOnDate("v-founding", TERM_START - DAY), null);
    assert.equal(await mod.currentPriceAgreement("v-standard-missing"), null);
  });
});

describe("recordVenueLapse", () => {
  it("refuses to declare a lapse the term does not support", async () => {
    const result = await mod.recordVenueLapse({
      sponsorId: "v-founding",
      reason: "not renewed",
      actor: operator,
      nowMs: TERM_START + DAY,
    });
    assert.equal(result.state, "refused");
    assert.match(result.state === "refused" ? result.reason : "", /'current', not lapsed/);
  });

  it("refuses without a reason", async () => {
    const result = await mod.recordVenueLapse({
      sponsorId: "v-founding",
      reason: "   ",
      actor: operator,
      nowMs: TERM_END + 400 * DAY,
    });
    assert.equal(result.state, "refused");
    assert.match(result.state === "refused" ? result.reason : "", /reason is required/);
  });

  it("does not shorten one couple's access, and does not take the founding number", async () => {
    // The invariant that must never move. A sponsored entitlement is created
    // for this venue's couple, then the venue lapses.
    const coupleExpiry = TERM_END + 900 * DAY;
    await client.execute({
      sql: `INSERT INTO entitlements (id, user_clerk_id, tier, source, source_ref, expires_at, status)
            VALUES ('ent-couple', 'user_couple', 'wedding', 'venue_edition', 'v-founding', ?, 'active')`,
      args: [coupleExpiry],
    });

    const beforeNumber = Number((await sponsorRow("v-founding")).founding_number);
    const result = await mod.recordVenueLapse({
      sponsorId: "v-founding",
      reason: "the third annual term was not renewed and the grace window closed",
      actor: operator,
      nowMs: annualTermEndsAtMs(annualTermEndsAtMs(TERM_END)) + 400 * DAY,
    });
    assert.equal(result.state, "recorded");
    if (result.state !== "recorded") return;
    assert.equal(result.foundingLock, "broken_by_lapse");
    assert.equal(result.foundingNumberKept, "01/25");

    const couple = await client.execute("SELECT expires_at, status FROM entitlements WHERE id = 'ent-couple'");
    assert.equal(Number(couple.rows[0].expires_at), coupleExpiry, "a lapse must not shorten couple access");
    assert.equal(String(couple.rows[0].status), "active");

    const after = await sponsorRow("v-founding");
    assert.equal(Number(after.founding_number), beforeNumber, "a lapse never returns the place to the pool");

    const events = await client.execute({
      sql: "SELECT reason, after_json FROM entitlement_events WHERE sponsor_id = ? AND action = 'expire'",
      args: ["v-founding"],
    });
    assert.equal(events.rows.length, 1);
    assert.match(String(events.rows[0].reason), /New issuance stops/);
    assert.match(String(events.rows[0].reason), /keeps its full term plus Keepsake/);
    assert.match(String(events.rows[0].after_json), /"entitlementsTouched":0/);
  });
});

describe("venueRenewalWorklist", () => {
  it("lists paying venues with a derived state and one action each", async () => {
    const worklist = await mod.venueRenewalWorklist({ nowMs: TERM_END - 10 * DAY });
    const slugs = worklist.map((v) => v.slug).sort();
    assert.ok(slugs.includes("v-founding"));
    assert.ok(slugs.includes("v-standard"));

    // A venue on a paying plan that has never paid is the operator's most
    // important row, not one to hide: it is a signed founding agreement with no
    // cleared payment, so it holds no founding number yet (D-009 point 6). An
    // earlier version of this test asserted it was absent, which contradicted
    // its own message and was the one red assertion in the checkpoint.
    const unpaid = worklist.find((v) => v.slug === "v-noactor");
    assert.ok(unpaid, "a founding venue awaiting its first payment must be on the worklist");
    assert.equal(unpaid.billing.state, "never_paid");
    assert.equal(unpaid.action.kind, "record_first_payment");
    assert.equal(unpaid.foundingNumberLabel, null, "no cleared payment, no founding number");
    assert.equal(unpaid.billing.lapsed, false, "never paying is not a lapse");

    const founding = worklist.find((v) => v.slug === "v-founding");
    assert.ok(founding);
    assert.equal(founding.foundingNumberLabel, "01/25");
    assert.equal(founding.amount?.grossCents, 180_000, "the worklist shows the current term");
    assert.equal(founding.billing.policyRatified, false, "the operator sees that the window is unratified");
  });

  it("reports a lapsed venue as lapsed and a venue inside grace as not lapsed", async () => {
    const inGrace = await mod.venueRenewalWorklist({ nowMs: TERM_END + 10 * DAY });
    const standard = inGrace.find((v) => v.slug === "v-standard");
    assert.equal(standard?.billing.state, "grace");
    assert.equal(standard?.billing.lapsed, false);
    assert.equal(standard?.action.kind, "chase_payment");

    const lapsed = await mod.venueRenewalWorklist({ nowMs: TERM_END + 400 * DAY });
    const standardLater = lapsed.find((v) => v.slug === "v-standard");
    assert.equal(standardLater?.billing.state, "lapsed");
    assert.equal(standardLater?.action.kind, "record_lapse");
    assert.equal(standardLater?.foundingLock, "not_applicable");
  });
});
