/**
 * Access-system migration (idempotent, existence-checked, safe to re-run).
 *
 * WHY a script and not a drizzle migration: the tracked drizzle-entitlements
 * chain is only 0000_init.sql, but scripts/apply-venue-ledger.mjs already
 * ALTERed the 7 venue columns into prod OUTSIDE that chain (tracking-table
 * desync). A bare drizzle ALTER would error on the live DB. So we check
 * pragma_table_info / sqlite_master and add only what is missing, exactly
 * like apply-venue-ledger.mjs.
 *
 * This applies the access-system schema (see docs/LICENSING_ACCESS_DESIGN.md):
 *   sponsors: codes_issued, kind (+ studio-local for dual-write parity)
 *   entitlements: 10 lifecycle/attribution/PII-hash columns + helper indexes
 *   grant_batches, entitlement_events (append-only triggers + hash-chain),
 *   allotment_ledger, license_codes.batch_id/recipient_email_hash
 *   two PARTIAL UNIQUE dedup indexes (dedup existing rows FIRST)
 *
 * Run: node scripts/migrate-access.mjs           (apply)
 *      node scripts/migrate-access.mjs --dry-run  (report only, no writes)
 *
 * Reads creds from env (or .env.local): TURSO_ENTITLEMENTS_DATABASE_URL /
 * _AUTH_TOKEN (the canonical shared DB) and TURSO_STUDIO_DATABASE_URL /
 * _AUTH_TOKEN (studio-local sponsors, kept in parity during transition).
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@libsql/client";

const DRY = process.argv.includes("--dry-run");
const log = (...a) => console.log(...a);

async function cols(c, table) {
  const r = await c.execute(`SELECT name FROM pragma_table_info('${table}')`);
  return new Set(r.rows.map((row) => row.name));
}
async function tableExists(c, name) {
  const r = await c.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
    [name],
  );
  return r.rows.length > 0;
}
async function run(c, sql, args = []) {
  if (DRY) {
    log("  DRY would run:", sql.replace(/\s+/g, " ").slice(0, 90));
    return;
  }
  await c.execute({ sql, args });
}

/** Add a column only if absent. */
async function addColumn(c, table, col, ddl) {
  const have = await cols(c, table);
  if (have.has(col)) {
    log(`  skip (exists): ${table}.${col}`);
    return;
  }
  await run(c, `ALTER TABLE ${table} ADD ${ddl}`);
  log(`  added: ${table}.${col}`);
}

async function migrateSponsors(c, label) {
  log(`\n[${label}] sponsors: codes_issued + kind`);
  await addColumn(c, "sponsors", "codes_issued", "codes_issued integer NOT NULL DEFAULT 0");
  await addColumn(c, "sponsors", "kind", "kind text NOT NULL DEFAULT 'venue'");
  await run(c, "CREATE INDEX IF NOT EXISTS sponsors_venue_plan_idx ON sponsors (venue_plan)");
}

async function migrateShared(c, label) {
  log(`\n[${label}] entitlements: lifecycle/attribution/PII columns`);
  const ent = [
    ["batch_id", "batch_id text"],
    ["granted_by", "granted_by text"],
    ["grant_reason", "grant_reason text"],
    ["billing_state", "billing_state text"],
    ["grace_until", "grace_until integer"],
    ["current_period_end", "current_period_end integer"],
    ["cancel_at_period_end", "cancel_at_period_end integer"],
    ["stripe_price_id", "stripe_price_id text"],
    ["email_hash", "email_hash text"],
    ["clerk_id_dead", "clerk_id_dead integer"],
  ];
  for (const [col, ddl] of ent) await addColumn(c, "entitlements", col, ddl);

  log(`\n[${label}] entitlements: helper indexes`);
  await run(c, "CREATE INDEX IF NOT EXISTS entitlements_batch_id_idx ON entitlements (batch_id)");
  await run(c, "CREATE INDEX IF NOT EXISTS entitlements_email_hash_idx ON entitlements (email_hash)");

  log(`\n[${label}] license_codes: batch_id + recipient_email_hash`);
  await addColumn(c, "license_codes", "batch_id", "batch_id text");
  await addColumn(c, "license_codes", "recipient_email_hash", "recipient_email_hash text");
  await run(c, "CREATE INDEX IF NOT EXISTS license_codes_batch_id_idx ON license_codes (batch_id)");

  log(`\n[${label}] grant_batches`);
  await run(c, `CREATE TABLE IF NOT EXISTS grant_batches (
    id text PRIMARY KEY,
    slug text NOT NULL UNIQUE,
    label text NOT NULL,
    kind text NOT NULL DEFAULT 'cohort',
    tier text NOT NULL DEFAULT 'workspace',
    allotment integer,
    reason text NOT NULL,
    granted_by text,
    default_expires_at integer,
    perpetual integer NOT NULL DEFAULT 0,
    closed_at integer,
    created_at integer NOT NULL DEFAULT (unixepoch() * 1000),
    updated_at integer NOT NULL DEFAULT (unixepoch() * 1000)
  )`);

  log(`\n[${label}] entitlement_events (append-only ledger)`);
  await run(c, `CREATE TABLE IF NOT EXISTS entitlement_events (
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
  )`);
  await run(c, "CREATE INDEX IF NOT EXISTS entitlement_events_user_idx ON entitlement_events (user_clerk_id, created_at)");
  await run(c, "CREATE INDEX IF NOT EXISTS entitlement_events_entitlement_idx ON entitlement_events (entitlement_id)");
  await run(c, "CREATE INDEX IF NOT EXISTS entitlement_events_batch_idx ON entitlement_events (batch_id)");
  await run(c, "CREATE INDEX IF NOT EXISTS entitlement_events_sponsor_idx ON entitlement_events (sponsor_id)");
  await run(c, "CREATE INDEX IF NOT EXISTS entitlement_events_action_idx ON entitlement_events (action)");
  await run(c, "CREATE INDEX IF NOT EXISTS entitlement_events_actor_idx ON entitlement_events (actor_id, created_at)");
  // Physically append-only: block UPDATE and DELETE at the DB layer.
  await run(c, `CREATE TRIGGER IF NOT EXISTS entitlement_events_no_update
    BEFORE UPDATE ON entitlement_events
    BEGIN SELECT RAISE(ABORT, 'entitlement_events is append-only'); END`);
  await run(c, `CREATE TRIGGER IF NOT EXISTS entitlement_events_no_delete
    BEFORE DELETE ON entitlement_events
    BEGIN SELECT RAISE(ABORT, 'entitlement_events is append-only'); END`);

  log(`\n[${label}] allotment_ledger`);
  await run(c, `CREATE TABLE IF NOT EXISTS allotment_ledger (
    id text PRIMARY KEY,
    sponsor_id text NOT NULL REFERENCES sponsors(id),
    delta integer NOT NULL,
    reason text NOT NULL,
    actor_id text,
    term_starts_at integer,
    term_ends_at integer,
    created_at integer NOT NULL DEFAULT (unixepoch() * 1000)
  )`);
  await run(c, "CREATE INDEX IF NOT EXISTS allotment_ledger_sponsor_idx ON allotment_ledger (sponsor_id)");

  // --- Dedup BEFORE the partial unique indexes, or CREATE UNIQUE INDEX fails ---
  log(`\n[${label}] dedup check before unique indexes`);
  await dedupBeforeUnique(
    c,
    label,
    "entitlements_dedup_ref",
    "user_clerk_id, source, source_ref",
    "source_ref IS NOT NULL",
  );
  await dedupBeforeUnique(
    c,
    label,
    "entitlements_dedup_sub",
    "user_clerk_id, stripe_subscription_id",
    "stripe_subscription_id IS NOT NULL",
  );
}

/** Report (and, unless --dry-run, collapse) duplicate groups, keeping the
 *  newest rowid per group, then create the partial UNIQUE index. */
async function dedupBeforeUnique(c, label, idxName, groupCols, whereClause) {
  const dupSql = `SELECT ${groupCols}, COUNT(*) n, MAX(rowid) keep
    FROM entitlements WHERE ${whereClause}
    GROUP BY ${groupCols} HAVING n > 1`;
  const dups = await c.execute(dupSql);
  if (dups.rows.length > 0) {
    log(`  [${label}] ${idxName}: found ${dups.rows.length} duplicate group(s) — collapsing to newest`);
    for (const row of dups.rows) log(`    dup:`, JSON.stringify(row));
    if (!DRY) {
      // Delete non-newest rows in each violating group.
      await c.execute(
        `DELETE FROM entitlements WHERE ${whereClause} AND rowid NOT IN (
           SELECT MAX(rowid) FROM entitlements WHERE ${whereClause} GROUP BY ${groupCols}
         )`,
      );
    }
  } else {
    log(`  [${label}] ${idxName}: no duplicates`);
  }
  await run(
    c,
    `CREATE UNIQUE INDEX IF NOT EXISTS ${idxName} ON entitlements (${groupCols}) WHERE ${whereClause}`,
  );
}

async function verify(c, label) {
  const ent = await cols(c, "entitlements");
  const spo = await cols(c, "sponsors");
  const wantEnt = ["batch_id", "billing_state", "grace_until", "email_hash", "clerk_id_dead"];
  const wantSpo = ["codes_issued", "kind"];
  const missing = [
    ...wantEnt.filter((x) => !ent.has(x)).map((x) => `entitlements.${x}`),
    ...wantSpo.filter((x) => !spo.has(x)).map((x) => `sponsors.${x}`),
  ];
  const tables = ["grant_batches", "entitlement_events", "allotment_ledger"];
  for (const t of tables) if (!(await tableExists(c, t))) missing.push(`table:${t}`);
  log(
    missing.length === 0
      ? `[${label}] VERIFIED — access-system schema present.`
      : `[${label}] STILL MISSING: ${missing.join(", ")}`,
  );
  return missing.length === 0;
}

async function applyTo(label, url, authToken, opts) {
  if (!url) {
    log(`\n[${label}] SKIP — url env not set`);
    return true;
  }
  const c = createClient({ url, authToken });
  await migrateSponsors(c, label);
  if (opts.shared) await migrateShared(c, label);
  return DRY ? true : verify(c, label);
}

log(DRY ? "=== migrate-access DRY RUN (no writes) ===" : "=== migrate-access APPLY ===");
// Studio-local: keep sponsors in parity (HQ Traction reads it during transition).
const okStudio = await applyTo(
  "studio",
  process.env.TURSO_STUDIO_DATABASE_URL,
  process.env.TURSO_STUDIO_AUTH_TOKEN,
  { shared: false },
);
// signal-entitlements: the canonical access store — full access-system schema.
const okShared = await applyTo(
  "signal-entitlements",
  process.env.TURSO_ENTITLEMENTS_DATABASE_URL,
  process.env.TURSO_ENTITLEMENTS_AUTH_TOKEN,
  { shared: true },
);
process.exit(okStudio && okShared ? 0 : 1);
