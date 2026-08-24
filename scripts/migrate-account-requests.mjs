/**
 * Additive Account V1 migration: sponsor_requests on signal-entitlements.
 *
 * Idempotent. Safe to re-run.
 *
 *   node scripts/migrate-account-requests.mjs
 *   node scripts/migrate-account-requests.mjs --dry-run
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@libsql/client";

const DRY = process.argv.includes("--dry-run");
const log = (...a) => console.log(...a);

async function tableExists(c, name) {
  const r = await c.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
    [name],
  );
  return r.rows.length > 0;
}

async function run(c, sql) {
  if (DRY) {
    log("  DRY would run:", sql.replace(/\s+/g, " ").slice(0, 100));
    return;
  }
  await c.execute(sql);
}

async function migrate(c, label) {
  log(`\n[${label}] sponsor_requests`);
  await run(
    c,
    `CREATE TABLE IF NOT EXISTS sponsor_requests (
      id text PRIMARY KEY,
      sponsor_id text NOT NULL REFERENCES sponsors(id),
      requesting_member_id text NOT NULL,
      kind text NOT NULL CHECK (kind IN ('more_codes', 'report', 'support', 'profile_change')),
      requested_quantity integer,
      note text NOT NULL DEFAULT '',
      state text NOT NULL DEFAULT 'open'
        CHECK (state IN ('open', 'approved', 'declined', 'fulfilled', 'canceled')),
      operator_actor_id text,
      decision_reason text,
      created_at integer NOT NULL DEFAULT (unixepoch() * 1000),
      decided_at integer,
      fulfilled_at integer
    )`,
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS sponsor_requests_sponsor_state_idx ON sponsor_requests (sponsor_id, state)",
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS sponsor_requests_created_idx ON sponsor_requests (created_at)",
  );

  const ok = await tableExists(c, "sponsor_requests");
  log(
    ok
      ? `[${label}] VERIFIED — sponsor_requests present.`
      : `[${label}] MISSING sponsor_requests`,
  );
  return ok;
}

log(
  DRY
    ? "=== migrate-account-requests DRY RUN ==="
    : "=== migrate-account-requests APPLY ===",
);

const url = process.env.ENTITLEMENTS_DATABASE_URL;
const token = process.env.ENTITLEMENTS_AUTH_TOKEN;
if (!url) {
  log("SKIP — ENTITLEMENTS_DATABASE_URL not set");
  process.exit(0);
}

const client = createClient({ url, authToken: token });
const ok = await migrate(client, "signal-entitlements");
process.exit(ok ? 0 : 1);
