/**
 * In-memory entitlements database for tests.
 *
 * The production entitlements credentials are deliberately not available to
 * this repository's test run, and they should not be: a suite that needs a
 * live customer database is a suite nobody runs. Every instrumentation module
 * that touches SQL is therefore proven against a real SQLite engine held in
 * memory, with the same DDL shape as `signal-entitlements`.
 *
 * Only the tables the instrumentation path actually reads are created here. If
 * a test needs another table, add it rather than reaching for the real
 * database.
 */

import { createClient, type Client } from "@libsql/client";

export type TestDb = { client: Client; close: () => void };

const BASE_DDL = [
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
     codes_issued integer NOT NULL DEFAULT 0,
     kind text NOT NULL DEFAULT 'venue',
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
     created_at integer NOT NULL DEFAULT (unixepoch() * 1000),
     updated_at integer NOT NULL DEFAULT (unixepoch() * 1000)
   )`,
  `CREATE TABLE redemptions (
     id text PRIMARY KEY,
     code_id text NOT NULL REFERENCES license_codes(id),
     user_clerk_id text NOT NULL,
     entitlement_id text,
     ip_hash text,
     user_agent text,
     redeemed_at integer NOT NULL DEFAULT (unixepoch() * 1000)
   )`,
  `CREATE TABLE sponsor_activations (
     id text PRIMARY KEY,
     sponsor_id text NOT NULL REFERENCES sponsors(id),
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
];

/** Fresh, isolated database per call. Tests never share state. */
export async function createTestEntitlementsDb(
  extraDdl: readonly string[] = [],
): Promise<TestDb> {
  const client = createClient({ url: "file::memory:" });
  for (const statement of [...BASE_DDL, ...extraDdl]) {
    await client.execute(statement);
  }
  return { client, close: () => client.close() };
}

export type SeedSponsorInput = {
  id: string;
  slug?: string;
  name?: string;
  codeAllotment?: number | null;
  termStartsAt?: number | null;
  termEndsAt?: number | null;
};

export async function seedSponsor(db: TestDb, input: SeedSponsorInput): Promise<void> {
  await db.client.execute({
    sql: `INSERT INTO sponsors
            (id, slug, name, contact_email, venue_plan, code_allotment,
             term_starts_at, term_ends_at, codes_issued, kind, created_at, updated_at)
          VALUES (?, ?, ?, ?, 'venue_edition', ?, ?, ?, 0, 'venue', ?, ?)`,
    args: [
      input.id,
      input.slug ?? input.id,
      input.name ?? input.id,
      `${input.slug ?? input.id}@example.invalid`,
      input.codeAllotment ?? 40,
      input.termStartsAt ?? null,
      input.termEndsAt ?? null,
      0,
      0,
    ],
  });
}

export type SeedRedemptionInput = {
  sponsorId: string;
  codeId: string;
  code: string;
  userClerkId: string;
  redeemedAt: number;
  status?: string;
};

/** A minted code plus the redemption that links a subject to the sponsor. */
export async function seedRedeemedCode(
  db: TestDb,
  input: SeedRedemptionInput,
): Promise<void> {
  await db.client.execute({
    sql: `INSERT INTO license_codes
            (id, sponsor_id, code, status, source_type, tier, redeemed_by_user_id,
             redeemed_at, created_at, updated_at)
          VALUES (?, ?, ?, ?, 'venue', 'venue_edition', ?, ?, ?, ?)`,
    args: [
      input.codeId,
      input.sponsorId,
      input.code,
      input.status ?? "redeemed",
      input.userClerkId,
      input.redeemedAt,
      input.redeemedAt,
      input.redeemedAt,
    ],
  });
  await db.client.execute({
    sql: `INSERT INTO redemptions (id, code_id, user_clerk_id, redeemed_at)
          VALUES (?, ?, ?, ?)`,
    args: [`red_${input.codeId}`, input.codeId, input.userClerkId, input.redeemedAt],
  });
}
