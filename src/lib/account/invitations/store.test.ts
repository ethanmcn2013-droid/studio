import assert from "node:assert/strict";
import { mkdtempSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { createClient, type Client } from "@libsql/client";

/**
 * Invitation administration against a real SQLite engine.
 *
 * `sponsor_activations` had never been read or written in production, so the
 * pure lifecycle tests in `lifecycle.test.ts` prove the rules and this file
 * proves the rules survive contact with a database: the sha256 join between
 * the activation and the code ledger, the transaction that refuses to commit
 * a state change without its audit line, the cross-tenant refusal, the
 * server-side type-to-confirm, and paging over the full set rather than over
 * the rows already in hand.
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
  `CREATE TABLE license_codes (
     id text PRIMARY KEY,
     sponsor_id text NOT NULL,
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
  `CREATE TABLE sponsor_activations (
     id text PRIMARY KEY,
     sponsor_id text NOT NULL,
     entitlement_id text,
     entitlement_source text NOT NULL,
     entitlement_source_ref_hash text,
     owner_subject_id text NOT NULL,
     canonical_workspace_id text,
     sponsor_season_reference text,
     sponsor_local_reference text,
     state text NOT NULL DEFAULT 'pending',
     invitation_state text NOT NULL DEFAULT 'not_sent',
     invitation_sent_at integer,
     invitation_accepted_at integer,
     invitation_declined_at integer,
     activated_at integer,
     ended_at integer,
     revoked_at integer,
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
];

const operator = {
  actorId: "op-test",
  actorName: "Test Operator",
  kind: "operator" as const,
  velocityExempt: false,
};

let client: Client;
let store: typeof import("./store");

async function seedVenue(id: string) {
  await client.execute({
    sql: `INSERT INTO sponsors (id, slug, name, contact_email, venue_plan, paid_at, code_allotment)
          VALUES (?, ?, ?, ?, 'founding', ?, 40)`,
    args: [id, id, `Venue ${id}`, `${id}@example.invalid`, Date.now()],
  });
}

async function seedCode(input: {
  id: string;
  sponsorId: string;
  code: string;
  status?: string;
  createdAt?: number;
  deliveredAt?: number | null;
  redeemedAt?: number | null;
  expiresAt?: number | null;
}) {
  await client.execute({
    sql: `INSERT INTO license_codes
            (id, sponsor_id, code, status, source_type, tier, created_at, delivered_at, redeemed_at, expires_at)
          VALUES (?, ?, ?, ?, 'venue_edition', 'wedding', ?, ?, ?, ?)`,
    args: [
      input.id,
      input.sponsorId,
      input.code,
      input.status ?? "minted",
      input.createdAt ?? Date.now(),
      input.deliveredAt ?? null,
      input.redeemedAt ?? null,
      input.expiresAt ?? null,
    ],
  });
}

const events = async () => {
  const r = await client.execute(
    "SELECT action, reason, after_json, actor_id, prev_hash, row_hash FROM entitlement_events ORDER BY created_at, id",
  );
  return r.rows;
};

const activationOf = async (id: string) => {
  const r = await client.execute({
    sql: "SELECT * FROM sponsor_activations WHERE sponsor_id = ? LIMIT 1",
    args: [id],
  });
  return r.rows[0] ?? null;
};

before(async () => {
  const temp = mkdtempSync(path.join(os.tmpdir(), "signal-invitations-"));
  const url = `file:${path.join(temp, "entitlements.db").replaceAll("\\", "/")}`;
  client = createClient({ url });
  for (const statement of DDL) await client.execute(statement);
  // Both names: the 2026-07-31 stack reset renamed these, and setting only
  // one leaves the suite green on one side of the rename.
  process.env.ENTITLEMENTS_DATABASE_URL = url;
  process.env.ENTITLEMENTS_AUTH_TOKEN = "";
  process.env.TURSO_ENTITLEMENTS_DATABASE_URL = url;
  process.env.TURSO_ENTITLEMENTS_AUTH_TOKEN = "";
  store = await import("./store");
});

after(async () => {
  await client.close();
});

describe("reading invitations", () => {
  it("resolves an unpaired code as an invitation nobody has sent", async () => {
    await seedVenue("v-read");
    await seedCode({ id: "c-1", sponsorId: "v-read", code: "SIG-AAAA-0001" });

    const result = await store.listInvitations({ sponsorId: "v-read" });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.page.rows.length, 1);
    assert.equal(result.page.rows[0].resolved.state, "not_sent");
    assert.equal(result.page.rows[0].invitationId, null);
  });

  it("never carries a plaintext code out of the store", async () => {
    const result = await store.listInvitations({ sponsorId: "v-read" });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const serialised = JSON.stringify(result.page);
    assert.doesNotMatch(serialised, /SIG-AAAA-0001/, "plaintext must never leave");
    assert.match(result.page.rows[0].maskedCode, /••••/);
  });

  it("a redeemed code reads as accepted with no activation row at all", async () => {
    await seedVenue("v-redeemed");
    await seedCode({
      id: "c-r",
      sponsorId: "v-redeemed",
      code: "SIG-BBBB-0002",
      status: "redeemed",
      redeemedAt: Date.now() - 86_400_000,
    });
    const result = await store.listInvitations({ sponsorId: "v-redeemed" });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.page.rows[0].resolved.state, "accepted");
    assert.equal(result.page.rows[0].resolved.source, "ledger");
  });

  it("pages over the full set and reports the true total", async () => {
    await seedVenue("v-many");
    for (let i = 0; i < 45; i += 1) {
      await seedCode({
        id: `c-many-${i}`,
        sponsorId: "v-many",
        code: `SIG-MANY-${String(i).padStart(4, "0")}`,
        createdAt: 1_000_000 + i,
      });
    }

    const first = await store.listInvitations({ sponsorId: "v-many" });
    assert.equal(first.ok, true);
    if (!first.ok) return;
    assert.equal(first.page.rows.length, 40, "one page");
    assert.equal(first.page.total, 45, "the total is the account's, not the page's");

    const second = await store.listInvitations({
      sponsorId: "v-many",
      pageIndex: 1,
    });
    assert.equal(second.ok, true);
    if (!second.ok) return;
    assert.equal(second.page.rows.length, 5, "the rows the old slice(0, 40) dropped");

    const firstKeys = new Set(first.page.rows.map((r) => r.codeId));
    for (const row of second.page.rows) {
      assert.equal(firstKeys.has(row.codeId), false, "pages must not overlap");
    }
  });

  it("search runs over every row, not only the current page", async () => {
    // SIG-MANY-0044 is the OLDEST row, so it sorts onto page 2. A search that
    // only saw page 1 would find nothing. This is the truncation defect.
    const result = await store.listInvitations({
      sponsorId: "v-many",
      search: "44",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.page.matched, 1);
    assert.equal(result.page.rows[0].maskedCode, "SI-••••-44");
    assert.equal(result.page.total, 45, "the total still describes the account");
  });

  it("a search that matches nothing returns an empty page, not the unfiltered set", async () => {
    const result = await store.listInvitations({
      sponsorId: "v-many",
      search: "zzzzzz",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.page.rows.length, 0);
    assert.equal(result.page.matched, 0);
  });
});

describe("mutating invitations", () => {
  it("records a hand-off, writes the activation row and its audit line together", async () => {
    await seedVenue("v-send");
    await seedCode({ id: "c-s", sponsorId: "v-send", code: "SIG-CCCC-0003" });

    const before = (await events()).length;
    const result = await store.applyInvitationAction({
      sponsorId: "v-send",
      codeId: "c-s",
      action: "mark_sent",
      actor: operator,
    });
    assert.equal(result.ok, true);

    const row = await activationOf("v-send");
    assert.ok(row, "an activation row now exists for the first time");
    assert.equal(row?.invitation_state, "sent");
    assert.ok(row?.invitation_sent_at, "the send timestamp is recorded");
    assert.match(
      String(row?.owner_subject_id),
      /^pending:/,
      "an unopened invitation has an opaque owner, never an email",
    );

    const after = await events();
    assert.equal(after.length, before + 1, "exactly one audit line");
    const line = after[after.length - 1];
    assert.equal(line.actor_id, "op-test");
    assert.equal(line.reason, "invitation.mark_sent");
    assert.ok(line.row_hash, "the audit line is chained");
    assert.doesNotMatch(
      String(line.after_json),
      /SIG-CCCC-0003/,
      "the plaintext code never enters the ledger",
    );
  });

  it("the state it wrote is the state it reads back", async () => {
    const result = await store.listInvitations({ sponsorId: "v-send" });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.page.rows[0].resolved.state, "sent");
    assert.equal(result.page.rows[0].resolved.source, "record");
    assert.ok(result.page.rows[0].invitationId, "the row is now joined by sha256");
  });

  it("refuses a destructive action without the exact confirm word", async () => {
    const wrong = await store.applyInvitationAction({
      sponsorId: "v-send",
      codeId: "c-s",
      action: "revoke",
      actor: operator,
      confirm: "revoke",
    });
    assert.equal(wrong.ok, false);
    assert.match(wrong.ok === false ? wrong.error : "", /Type REVOKE to confirm/);

    const none = await store.applyInvitationAction({
      sponsorId: "v-send",
      codeId: "c-s",
      action: "revoke",
      actor: operator,
    });
    assert.equal(none.ok, false);

    const row = await activationOf("v-send");
    assert.equal(row?.invitation_state, "sent", "nothing was written");
  });

  it("accepts the destructive action with the confirm word and records it", async () => {
    const ok = await store.applyInvitationAction({
      sponsorId: "v-send",
      codeId: "c-s",
      action: "revoke",
      actor: operator,
      confirm: "REVOKE",
    });
    assert.equal(ok.ok, true);
    const row = await activationOf("v-send");
    assert.equal(row?.invitation_state, "revoked");
    assert.ok(row?.revoked_at);

    const line = (await events()).pop();
    assert.equal(line?.action, "revoke");
    assert.equal(line?.reason, "invitation.revoke");
  });

  it("refuses an illegal transition rather than writing it", async () => {
    const result = await store.applyInvitationAction({
      sponsorId: "v-send",
      codeId: "c-s",
      action: "mark_sent",
      actor: operator,
    });
    assert.equal(result.ok, false);
    assert.match(
      result.ok === false ? result.error : "",
      /withdrawn/i,
      "the refusal is stated to the venue, not as a state name",
    );
  });

  it("stamps revoked_at when the revoke creates the activation row itself", async () => {
    // Withdrawing an invitation that was never marked sent takes the INSERT
    // branch, not the UPDATE branch. It wrote invitation_state='revoked' with
    // revoked_at NULL and state='pending' — a row claiming a revocation with
    // no revocation on it. Caught in the browser, not by the earlier tests,
    // because every one of them revoked a row that already existed.
    await seedVenue("v-fresh-revoke");
    await seedCode({
      id: "c-fr",
      sponsorId: "v-fresh-revoke",
      code: "SIG-HHHH-0008",
    });

    const result = await store.applyInvitationAction({
      sponsorId: "v-fresh-revoke",
      codeId: "c-fr",
      action: "revoke",
      actor: operator,
      confirm: "REVOKE",
    });
    assert.equal(result.ok, true);

    const row = await activationOf("v-fresh-revoke");
    assert.equal(row?.invitation_state, "revoked");
    assert.ok(row?.revoked_at, "a revoked row must carry when it was revoked");
    assert.equal(row?.state, "revoked", "the activation state must agree");
  });

  it("refuses a code belonging to another venue", async () => {
    await seedVenue("v-other");
    await seedCode({ id: "c-other", sponsorId: "v-other", code: "SIG-DDDD-0004" });

    const result = await store.applyInvitationAction({
      // The attacker names their own venue and someone else's code.
      sponsorId: "v-send",
      codeId: "c-other",
      action: "mark_sent",
      actor: operator,
    });
    assert.equal(result.ok, false);
    assert.match(
      result.ok === false ? result.error : "",
      /does not belong to this account/,
    );
    assert.equal(await activationOf("v-other"), null, "nothing was written");
  });

  it("refuses a system-only transition taken by hand", async () => {
    await seedVenue("v-accept");
    await seedCode({ id: "c-a", sponsorId: "v-accept", code: "SIG-EEEE-0005" });
    const result = await store.applyInvitationAction({
      sponsorId: "v-accept",
      codeId: "c-a",
      action: "accept",
      actor: operator,
    });
    assert.equal(result.ok, false);
    assert.match(result.ok === false ? result.error : "", /never set by hand/i);
  });
});

describe("the distribution kit path", () => {
  it("returns the plaintext code once and audits it as an export", async () => {
    await seedVenue("v-kit");
    await seedCode({ id: "c-k", sponsorId: "v-kit", code: "SIG-FFFF-0006" });

    const result = await store.revealInvitationLink({
      sponsorId: "v-kit",
      codeId: "c-k",
      actor: operator,
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.code, "SIG-FFFF-0006");
    assert.equal(result.venueName, "Venue v-kit");

    const line = (await events()).pop();
    assert.equal(line?.action, "export");
    assert.equal(line?.reason, "invitation.reveal_link");
    assert.doesNotMatch(String(line?.after_json), /SIG-FFFF-0006/);
  });

  it("refuses to produce a link for a withdrawn invitation", async () => {
    await seedCode({
      id: "c-k2",
      sponsorId: "v-kit",
      code: "SIG-FFFF-0007",
      status: "revoked",
    });
    const result = await store.revealInvitationLink({
      sponsorId: "v-kit",
      codeId: "c-k2",
      actor: operator,
    });
    assert.equal(result.ok, false);
    assert.match(result.ok === false ? result.error : "", /no longer works/);
  });

  it("refuses a code belonging to another venue", async () => {
    const result = await store.revealInvitationLink({
      sponsorId: "v-kit",
      codeId: "c-other",
      actor: operator,
    });
    assert.equal(result.ok, false);
  });
});

describe("creating an invitation", () => {
  it("pairs the oldest unpaired code and records it", async () => {
    await seedVenue("v-create");
    await seedCode({
      id: "c-new-old",
      sponsorId: "v-create",
      code: "SIG-GGGG-0001",
      createdAt: 1_000,
    });
    await seedCode({
      id: "c-new-new",
      sponsorId: "v-create",
      code: "SIG-GGGG-0002",
      createdAt: 2_000,
    });

    const result = await store.createInvitation({
      sponsorId: "v-create",
      actor: operator,
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.state, "not_sent");

    const rows = await client.execute({
      sql: "SELECT entitlement_source_ref_hash FROM sponsor_activations WHERE sponsor_id = ?",
      args: ["v-create"],
    });
    assert.equal(rows.rows.length, 1);
    assert.equal(
      rows.rows[0].entitlement_source_ref_hash,
      store.codeRefHash("SIG-GGGG-0001"),
      "the oldest code is paired first",
    );
  });

  it("does not pair the same code twice", async () => {
    const second = await store.createInvitation({
      sponsorId: "v-create",
      actor: operator,
    });
    assert.equal(second.ok, true);
    const rows = await client.execute({
      sql: "SELECT entitlement_source_ref_hash FROM sponsor_activations WHERE sponsor_id = ?",
      args: ["v-create"],
    });
    assert.equal(rows.rows.length, 2);
    const hashes = rows.rows.map((r) => r.entitlement_source_ref_hash);
    assert.equal(new Set(hashes).size, 2, "two codes, two activations");
  });

  it("refuses rather than minting when the venue has nothing unused", async () => {
    const third = await store.createInvitation({
      sponsorId: "v-create",
      actor: operator,
    });
    assert.equal(third.ok, false);
    assert.match(
      third.ok === false ? third.error : "",
      /Signal HQ Access is the only place new access is created/,
    );
  });

  it("the refusal carries no prohibited vocabulary", async () => {
    const result = await store.createInvitation({
      sponsorId: "v-create",
      actor: operator,
    });
    assert.equal(result.ok, false);
    const text = result.ok === false ? result.error : "";
    assert.doesNotMatch(text, /allotment|\bseats?\b|codes remaining/i);
  });
});
