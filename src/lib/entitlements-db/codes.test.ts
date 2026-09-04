import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { createClient, type Client } from "@libsql/client";

import {
  VENUE_EDITION_COUPLE_ACCESS_DAYS,
  VENUE_EDITION_WEDDING_GRACE_DAYS,
  normaliseWeddingDateMs,
} from "@/lib/venue-edition";
import { AnomalySignal } from "./guard";

/**
 * The real writers, against a real SQLite engine.
 *
 * January Venue issuance uses the separate recoverable service. These tests
 * retain generic allotment coverage and prove historical claims keep their
 * terms while the raw Venue issuer is closed. Historical rows are fixture
 * inputs, never newly created production authority.
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
  `CREATE TABLE license_codes (
     id text PRIMARY KEY,
     sponsor_id text NOT NULL REFERENCES sponsors(id),
     code text NOT NULL UNIQUE,
     status text NOT NULL DEFAULT 'minted',
     source_type text NOT NULL,
     tier text NOT NULL,
     duration_days integer,
     redeemed_by_user_id text,
     redeemed_at integer,
     batch_id text,
     recipient_email_hash text,
     delivered_at integer,
     expires_at integer,
     created_at integer NOT NULL DEFAULT (unixepoch() * 1000),
     updated_at integer NOT NULL DEFAULT (unixepoch() * 1000)
   )`,
  `CREATE TABLE entitlements (
     id text PRIMARY KEY,
     user_clerk_id text NOT NULL,
     tier text NOT NULL,
     source text NOT NULL,
     source_ref text,
     granted_at integer NOT NULL DEFAULT (unixepoch() * 1000),
     expires_at integer,
     status text NOT NULL DEFAULT 'active',
     stripe_customer_id text,
     stripe_subscription_id text,
     metadata text,
     batch_id text,
     granted_by text,
     grant_reason text,
     billing_state text,
     grace_until integer,
     current_period_end integer,
     cancel_at_period_end integer,
     stripe_price_id text,
     email_hash text,
     clerk_id_dead integer,
     wedding_date integer,
     created_at integer NOT NULL DEFAULT (unixepoch() * 1000),
     updated_at integer NOT NULL DEFAULT (unixepoch() * 1000)
   )`,
  `CREATE TABLE redemptions (
     id text PRIMARY KEY,
     code_id text NOT NULL REFERENCES license_codes(id),
     user_clerk_id text NOT NULL,
     entitlement_id text REFERENCES entitlements(id),
     ip_hash text,
     user_agent text,
     redeemed_at integer NOT NULL DEFAULT (unixepoch() * 1000)
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
];

type Codes = typeof import("./codes");
type Guard = typeof import("./guard");

let client: Client;
let codes: Codes;
let guard: Guard;
const anomalies: AnomalySignal[] = [];

const operator = {
  actorId: "op-test",
  actorName: "Test Operator",
  kind: "operator" as const,
  velocityExempt: false,
};

let codeSeq = 0;
const nextCode = () => `SIG-TEST-${(codeSeq += 1).toString().padStart(4, "0")}`;

async function seedSponsor(input: {
  id: string;
  allotmentMode?: string;
  codeAllotment?: number | null;
  fairUseCeiling?: number | null;
  termStartsAt?: number | null;
}) {
  await client.execute({
    sql: `INSERT INTO sponsors
            (id, slug, name, contact_email, venue_plan, code_allotment,
             allotment_mode, fair_use_ceiling, term_starts_at, codes_issued)
          VALUES (?, ?, ?, ?, 'paid', ?, ?, ?, ?, 0)`,
    args: [
      input.id,
      input.id,
      input.id,
      `${input.id}@example.invalid`,
      input.codeAllotment ?? null,
      input.allotmentMode ?? "limited",
      input.fairUseCeiling ?? null,
      input.termStartsAt ?? null,
    ],
  });
}

before(async () => {
  const temp = mkdtempSync(path.join(os.tmpdir(), "signal-codes-test-"));
  const url = `file:${path.join(temp, "entitlements.db").replaceAll("\\", "/")}`;
  client = createClient({ url });
  for (const statement of DDL) await client.execute(statement);

  // Set before importing: client-core reads the env at module load.
  // Both names, deliberately. The 2026-07-31 stack reset renamed these to
  // ENTITLEMENTS_DATABASE_URL (INFRASTRUCTURE.md: never encode the vendor in a
  // variable name), and branches cut before that still read the TURSO_ prefix.
  // Setting one leaves the test passing on one side of the rename and failing
  // on the other, which is how CI caught this.
  process.env.ENTITLEMENTS_DATABASE_URL = url;
  process.env.ENTITLEMENTS_AUTH_TOKEN = "";
  process.env.TURSO_ENTITLEMENTS_DATABASE_URL = url;
  process.env.TURSO_ENTITLEMENTS_AUTH_TOKEN = "";
  codes = await import("./codes");
  guard = await import("./guard");
  guard.onAnomaly((s) => anomalies.push(s));
});

after(async () => {
  await client.close();
});

/* ── R-016: unlimited is mintable ───────────────────────────────────────── */

describe("mintLicenseCodes · retained non-Venue allotment", () => {
  it("still refuses a limited sponsor with no headroom", async () => {
    await seedSponsor({ id: "sp-capped", codeAllotment: 2 });
    await codes.mintLicenseCodes({
      sponsorId: "sp-capped",
      codes: [{ code: nextCode() }, { code: nextCode() }],
      tier: "wedding",
      sourceType: "compliments",
      durationDays: VENUE_EDITION_COUPLE_ACCESS_DAYS,
      actor: operator,
    });
    await assert.rejects(
      codes.mintLicenseCodes({
        sponsorId: "sp-capped",
        codes: [{ code: nextCode() }],
        tier: "wedding",
        sourceType: "compliments",
        durationDays: VENUE_EDITION_COUPLE_ACCESS_DAYS,
        actor: operator,
      }),
      /would exceed allotment/,
    );
  });

  it("still refuses a limited sponsor with a null allotment", async () => {
    // The pre-R-016 contract: null means not mint-eligible. Unchanged.
    await seedSponsor({ id: "sp-nullcap", codeAllotment: null });
    await assert.rejects(
      codes.mintLicenseCodes({
        sponsorId: "sp-nullcap",
        codes: [{ code: nextCode() }],
        tier: "wedding",
        sourceType: "compliments",
        durationDays: VENUE_EDITION_COUPLE_ACCESS_DAYS,
        actor: operator,
      }),
      /would exceed allotment/,
    );
  });

  it("an unlimited sponsor mints past any cap, repeatedly", async () => {
    await seedSponsor({
      id: "sp-unlimited",
      allotmentMode: "unlimited",
      codeAllotment: null,
    });
    for (let round = 0; round < 3; round += 1) {
      const res = await codes.mintLicenseCodes({
        sponsorId: "sp-unlimited",
        codes: [{ code: nextCode() }, { code: nextCode() }],
        tier: "wedding",
        sourceType: "compliments",
        durationDays: VENUE_EDITION_COUPLE_ACCESS_DAYS,
        actor: operator,
      });
      assert.equal(res.minted, 2);
    }
    const row = await client.execute(
      "SELECT codes_issued FROM sponsors WHERE id = 'sp-unlimited'",
    );
    // The counter still moves — drift reconciliation depends on it.
    assert.equal(Number(row.rows[0].codes_issued), 6);
  });

  it("D-020: crossing the fair-use ceiling alerts and still issues", async () => {
    await seedSponsor({
      id: "sp-fairuse",
      allotmentMode: "unlimited",
      fairUseCeiling: 2,
      termStartsAt: 0,
    });
    anomalies.length = 0;
    const res = await codes.mintLicenseCodes({
      sponsorId: "sp-fairuse",
      codes: [{ code: nextCode() }, { code: nextCode() }, { code: nextCode() }],
      tier: "wedding",
      sourceType: "compliments",
      durationDays: VENUE_EDITION_COUPLE_ACCESS_DAYS,
      actor: operator,
    });
    assert.equal(res.minted, 3, "fair use must never block issuance");
    const fairUse = anomalies.filter((a) => a.kind === "fair_use");
    assert.equal(fairUse.length, 1, "expected exactly one fair-use alert");
    assert.match(fairUse[0].detail, /crosses its fair-use ceiling 2/);
  });

  it("stays quiet below the ceiling", async () => {
    await seedSponsor({
      id: "sp-quiet",
      allotmentMode: "unlimited",
      fairUseCeiling: 50,
      termStartsAt: 0,
    });
    anomalies.length = 0;
    await codes.mintLicenseCodes({
      sponsorId: "sp-quiet",
      codes: [{ code: nextCode() }],
      tier: "wedding",
      sourceType: "compliments",
      durationDays: VENUE_EDITION_COUPLE_ACCESS_DAYS,
      actor: operator,
    });
    assert.equal(anomalies.filter((a) => a.kind === "fair_use").length, 0);
  });
});

/* ── R-015: the mint guard ──────────────────────────────────────────────── */

describe("mintLicenseCodes · Venue Edition terms", () => {
  it("raw Venue issuance is closed even with valid longer terms", async () => {
    await seedSponsor({ id: "sp-longlead", codeAllotment: 10 });
    await assert.rejects(codes.mintLicenseCodes({
      sponsorId: "sp-longlead",
      codes: [{ code: nextCode() }],
      tier: "wedding",
      sourceType: "venue_edition",
      durationDays: 1_200,
      actor: operator,
    }), /Raw issuance is closed/);
  });

  it("refuses anything shorter than the ratified 548 days", async () => {
    await seedSponsor({ id: "sp-short", codeAllotment: 10 });
    await assert.rejects(
      codes.mintLicenseCodes({
        sponsorId: "sp-short",
        codes: [{ code: nextCode() }],
        tier: "wedding",
        sourceType: "venue_edition",
        durationDays: 365,
        actor: operator,
      }),
      /at least 548 days/,
    );
  });

  it("refuses a null duration rather than granting perpetual access", async () => {
    await seedSponsor({ id: "sp-null-duration", codeAllotment: 10 });
    await assert.rejects(
      codes.mintLicenseCodes({
        sponsorId: "sp-null-duration",
        codes: [{ code: nextCode() }],
        tier: "wedding",
        sourceType: "venue_edition",
        durationDays: null,
        actor: operator,
      }),
      /explicit duration/,
    );
  });

  it("refuses the wrong tier", async () => {
    await seedSponsor({ id: "sp-wrongtier", codeAllotment: 10 });
    await assert.rejects(
      codes.mintLicenseCodes({
        sponsorId: "sp-wrongtier",
        codes: [{ code: nextCode() }],
        tier: "studio",
        sourceType: "venue_edition",
        durationDays: VENUE_EDITION_COUPLE_ACCESS_DAYS,
        actor: operator,
      }),
      /wedding tier/,
    );
  });
});

async function seedHistoricalCode(code: string, sponsorId: string, durationDays: number, batchId: string | null = null) {
  await client.execute({sql: "INSERT INTO license_codes (id,sponsor_id,code,status,tier,source_type,duration_days,batch_id) VALUES (?,?,?,'minted','wedding','venue_edition',?,?)",
    args:["legacy-"+code,sponsorId,code,durationDays,batchId]});
}

describe("canonical Venue issuance has one grant authority",()=>{
  it("refuses reserved code or batch provenance through generic raw mint",async()=>{
    await seedSponsor({id:"sp-reserved",codeAllotment:10});
    for(const input of [{code:"VENUE-ABCDE-FGHJK",batchId:null},{code:nextCode(),batchId:"vi-"+"1".repeat(32)}]){
      await assert.rejects(codes.mintLicenseCodes({sponsorId:"sp-reserved",codes:[{code:input.code}],sourceType:"compliments",
        tier:"wedding",durationDays:548,batchId:input.batchId,actor:operator}),/Raw issuance is closed/);
    }
    assert.equal(Number((await client.execute("SELECT codes_issued FROM sponsors WHERE id='sp-reserved'")).rows[0].codes_issued),0);
  });
  it("shared redeem and orphan repair cannot infer a grant for App-owned issuance",async()=>{
    const code=nextCode();await seedHistoricalCode(code,"sp-reserved",548,"vi-"+"2".repeat(32));
    assert.equal((await codes.redeemLicenseCode({code,userClerkId:"user_canonical",actor:operator})).state,"invalid");
    await client.execute({sql:"INSERT INTO redemptions (id,code_id,user_clerk_id) VALUES ('orphan-canonical',?,'user_canonical')",args:["legacy-"+code]});
    const result=await codes.reconcileCodes({actor:operator});
    assert.equal(result.orphansRepaired,0);
    assert.equal((await client.execute("SELECT id FROM entitlements WHERE user_clerk_id='user_canonical'")).rows.length,0);
    assert.equal((await client.execute("SELECT entitlement_id FROM redemptions WHERE id='orphan-canonical'")).rows[0].entitlement_id,null);
  });
});
/* ── R-015: redemption expiry ───────────────────────────────────────────── */

describe("redeemLicenseCode · access term", () => {
  async function mintOne(sponsorId: string, durationDays: number) {
    const code = nextCode();
    await seedHistoricalCode(code,sponsorId,durationDays);
    return code;
  }

  it("R-015: a long-lead wedding survives to 90 days past the day", async () => {
    await seedSponsor({ id: "sp-redeem", codeAllotment: 50 });
    const code = await mintOne("sp-redeem", VENUE_EDITION_COUPLE_ACCESS_DAYS);
    const weddingDate = "2029-09-16";

    const before = Date.now();
    const res = await codes.redeemLicenseCode({
      code,
      userClerkId: "user_longlead",
      actor: operator,
      weddingDate,
    });
    assert.equal(res.state, "redeemed");

    const row = await client.execute({
      sql: "SELECT expires_at, wedding_date FROM entitlements WHERE user_clerk_id = ?",
      args: ["user_longlead"],
    });
    const expiresAt = Number(row.rows[0].expires_at);
    const weddingMs = normaliseWeddingDateMs(weddingDate)!;

    assert.equal(Number(row.rows[0].wedding_date), weddingMs);
    assert.equal(expiresAt, weddingMs + VENUE_EDITION_WEDDING_GRACE_DAYS * DAY);
    // The defect this exists to prevent: the flat term expired pre-wedding.
    assert.ok(
      before + VENUE_EDITION_COUPLE_ACCESS_DAYS * DAY < weddingMs,
      "the shipped flat term would have expired before the wedding",
    );
    assert.ok(expiresAt > weddingMs, "access must outlast the wedding day");
  });

  it("falls back to the 548-day floor when no date is given", async () => {
    const code = await mintOne("sp-redeem", VENUE_EDITION_COUPLE_ACCESS_DAYS);
    const before = Date.now();
    await codes.redeemLicenseCode({
      code,
      userClerkId: "user_nodate",
      actor: operator,
    });
    const row = await client.execute({
      sql: "SELECT expires_at, wedding_date FROM entitlements WHERE user_clerk_id = ?",
      args: ["user_nodate"],
    });
    assert.equal(row.rows[0].wedding_date, null);
    const expiresAt = Number(row.rows[0].expires_at);
    assert.ok(expiresAt >= before + VENUE_EDITION_COUPLE_ACCESS_DAYS * DAY);
    assert.ok(expiresAt <= Date.now() + VENUE_EDITION_COUPLE_ACCESS_DAYS * DAY);
  });

  it("keeps a longer minted duration when the couple gives no date", async () => {
    const code = await mintOne("sp-redeem", 1_200);
    const before = Date.now();
    await codes.redeemLicenseCode({
      code,
      userClerkId: "user_mintedlong",
      actor: operator,
    });
    const row = await client.execute({
      sql: "SELECT expires_at FROM entitlements WHERE user_clerk_id = ?",
      args: ["user_mintedlong"],
    });
    assert.ok(Number(row.rows[0].expires_at) >= before + 1_200 * DAY);
  });

  it("ignores an unparseable date rather than shortening the term", async () => {
    const code = await mintOne("sp-redeem", VENUE_EDITION_COUPLE_ACCESS_DAYS);
    const before = Date.now();
    await codes.redeemLicenseCode({
      code,
      userClerkId: "user_baddate",
      actor: operator,
      weddingDate: "16/09/2029",
    });
    const row = await client.execute({
      sql: "SELECT expires_at, wedding_date FROM entitlements WHERE user_clerk_id = ?",
      args: ["user_baddate"],
    });
    assert.equal(row.rows[0].wedding_date, null);
    assert.ok(
      Number(row.rows[0].expires_at) >= before + VENUE_EDITION_COUPLE_ACCESS_DAYS * DAY,
    );
  });
});

/* ── D-022 point 3: recompute, later only ───────────────────────────────── */

describe("setCoupleWeddingDate", () => {
  async function redeemFor(userClerkId: string, weddingDate?: string) {
    const code = nextCode();
    await seedHistoricalCode(code,"sp-recompute",VENUE_EDITION_COUPLE_ACCESS_DAYS);
    const res = await codes.redeemLicenseCode({
      code,
      userClerkId,
      actor: operator,
      weddingDate,
    });
    assert.equal(res.state, "redeemed");
    return (res as { entitlementId: string }).entitlementId;
  }

  before(async () => {
    await seedSponsor({ id: "sp-recompute", codeAllotment: 100 });
  });

  it("extends access when a date arrives after redemption", async () => {
    const entitlementId = await redeemFor("user_late_date");
    const rowBefore = await client.execute({
      sql: "SELECT expires_at FROM entitlements WHERE id = ?",
      args: [entitlementId],
    });
    const wasExpiring = Number(rowBefore.rows[0].expires_at);

    const res = await codes.setCoupleWeddingDate({
      entitlementId,
      weddingDate: "2030-06-01",
      actor: operator,
    });
    assert.equal(res.state, "updated");
    const expected = normaliseWeddingDateMs("2030-06-01")! + 90 * DAY;
    assert.equal(res.state === "updated" && res.expiresAt, expected);
    assert.ok(expected > wasExpiring);
  });

  it("extends on postponement", async () => {
    const entitlementId = await redeemFor("user_postponed", "2028-05-20");
    await codes.setCoupleWeddingDate({
      entitlementId,
      weddingDate: "2029-05-19",
      actor: operator,
    });
    const row = await client.execute({
      sql: "SELECT expires_at, wedding_date FROM entitlements WHERE id = ?",
      args: [entitlementId],
    });
    assert.equal(
      Number(row.rows[0].expires_at),
      normaliseWeddingDateMs("2029-05-19")! + 90 * DAY,
    );
    assert.equal(
      Number(row.rows[0].wedding_date),
      normaliseWeddingDateMs("2029-05-19"),
    );
  });

  it("never shortens when the date moves earlier", async () => {
    const entitlementId = await redeemFor("user_corrected", "2031-05-18");
    const rowBefore = await client.execute({
      sql: "SELECT expires_at FROM entitlements WHERE id = ?",
      args: [entitlementId],
    });
    const longExpiry = Number(rowBefore.rows[0].expires_at);

    await codes.setCoupleWeddingDate({
      entitlementId,
      weddingDate: "2028-05-18",
      actor: operator,
    });
    const rowAfter = await client.execute({
      sql: "SELECT expires_at, wedding_date FROM entitlements WHERE id = ?",
      args: [entitlementId],
    });
    assert.equal(Number(rowAfter.rows[0].expires_at), longExpiry);
    // The date itself is corrected; only the expiry is held.
    assert.equal(
      Number(rowAfter.rows[0].wedding_date),
      normaliseWeddingDateMs("2028-05-18"),
    );
  });

  it("never shortens when the date is cleared", async () => {
    const entitlementId = await redeemFor("user_cleared", "2031-01-10");
    const before = await client.execute({
      sql: "SELECT expires_at FROM entitlements WHERE id = ?",
      args: [entitlementId],
    });
    await codes.setCoupleWeddingDate({
      entitlementId,
      weddingDate: null,
      actor: operator,
    });
    const after = await client.execute({
      sql: "SELECT expires_at, wedding_date FROM entitlements WHERE id = ?",
      args: [entitlementId],
    });
    assert.equal(
      Number(after.rows[0].expires_at),
      Number(before.rows[0].expires_at),
    );
    assert.equal(after.rows[0].wedding_date, null);
  });

  it("is idempotent", async () => {
    const entitlementId = await redeemFor("user_idempotent", "2030-03-03");
    const first = await codes.setCoupleWeddingDate({
      entitlementId,
      weddingDate: "2030-03-03",
      actor: operator,
    });
    assert.equal(first.state, "unchanged");
  });

  it("writes an extend event that carries no wedding date", async () => {
    const entitlementId = await redeemFor("user_audited");
    await codes.setCoupleWeddingDate({
      entitlementId,
      weddingDate: "2030-08-08",
      actor: operator,
    });
    const events = await client.execute({
      sql: "SELECT action, reason, before_json, after_json FROM entitlement_events WHERE entitlement_id = ? AND action = 'extend'",
      args: [entitlementId],
    });
    assert.equal(events.rows.length, 1);
    const payload = `${events.rows[0].before_json}${events.rows[0].after_json}`;
    assert.doesNotMatch(payload, /2030-08-08/);
    assert.doesNotMatch(payload, /weddingDate/);
    assert.match(String(events.rows[0].reason), /never shortened/);
  });

  it("refuses a malformed date", async () => {
    const entitlementId = await redeemFor("user_malformed");
    const res = await codes.setCoupleWeddingDate({
      entitlementId,
      weddingDate: "next summer",
      actor: operator,
    });
    assert.equal(res.state, "invalid_date");
  });

  it("refuses a non-sponsored entitlement", async () => {
    await client.execute({
      sql: `INSERT INTO entitlements (id, user_clerk_id, tier, source, granted_at, expires_at)
            VALUES ('ent-paid', 'user_paid', 'workspace', 'workspace_subscription', ?, ?)`,
      args: [Date.now(), Date.now() + 365 * DAY],
    });
    const res = await codes.setCoupleWeddingDate({
      entitlementId: "ent-paid",
      weddingDate: "2030-01-01",
      actor: operator,
    });
    assert.equal(res.state, "not_sponsored");
  });

  it("reports a missing entitlement rather than throwing", async () => {
    const res = await codes.setCoupleWeddingDate({
      entitlementId: "ent-does-not-exist",
      weddingDate: "2030-01-01",
      actor: operator,
    });
    assert.equal(res.state, "not_found");
  });
});
