/**
 * Additive Phase B migration: sponsored-use instrumentation on
 * signal-entitlements.
 *
 * Idempotent. Safe to re-run.
 *
 *   node scripts/migrate-sponsor-usage.mjs
 *   node scripts/migrate-sponsor-usage.mjs --dry-run
 *
 * Nothing here is destructive and nothing is backfilled. The two new
 * license_codes columns stay NULL on every existing row, because a default
 * would manufacture a delivery record that never happened.
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

async function columnExists(c, table, column) {
  const r = await c.execute(`PRAGMA table_info(${table})`);
  return r.rows.some((row) => row.name === column);
}

async function run(c, sql) {
  if (DRY) {
    log("  DRY would run:", sql.replace(/\s+/g, " ").slice(0, 110));
    return;
  }
  await c.execute(sql);
}

/** sqlite has no ADD COLUMN IF NOT EXISTS, so the guard is the pragma. */
async function addColumn(c, table, column, definition) {
  if (await columnExists(c, table, column)) {
    log(`  ${table}.${column} already present`);
    return;
  }
  await run(c, `ALTER TABLE ${table} ADD COLUMN ${definition}`);
  log(`  ${table}.${column} added`);
}

async function migrate(c, label) {
  log(`\n[${label}] sponsored-use instrumentation`);

  // ── B4: delivery ledger on license_codes ──────────────────────────────
  await addColumn(c, "license_codes", "delivered_at", "delivered_at integer");
  await addColumn(c, "license_codes", "expires_at", "expires_at integer");
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS license_codes_sponsor_delivered_idx ON license_codes (sponsor_id, delivered_at)",
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS license_codes_expires_at_idx ON license_codes (expires_at)",
  );

  // ── Reporting calendar, nullable: null means Europe/Dublin ────────────
  await addColumn(c, "sponsors", "reporting_timezone", "reporting_timezone text");

  // ── B2: the short-lived event stream ──────────────────────────────────
  await run(
    c,
    `CREATE TABLE IF NOT EXISTS sponsor_usage_events (
      event_id text PRIMARY KEY,
      instrumentation_version text NOT NULL DEFAULT 'instrumentation.v1',
      product text NOT NULL,
      kind text NOT NULL,
      occurred_at integer NOT NULL,
      subject_id_hash text NOT NULL,
      workspace_id_hash text NOT NULL,
      sponsor_id text REFERENCES sponsors(id),
      attribution_state text NOT NULL
        CHECK (attribution_state IN ('attributed', 'unattributed', 'excluded')),
      attribution_reason text,
      hash_salt_epoch text NOT NULL,
      local_date text NOT NULL,
      ingested_at integer NOT NULL DEFAULT (unixepoch() * 1000),
      CHECK (
        (attribution_state = 'attributed' AND sponsor_id IS NOT NULL)
        OR (attribution_state <> 'attributed' AND sponsor_id IS NULL)
      ),
      CHECK (product IN ('notes', 'tasks', 'timeline', 'signal')),
      CHECK (local_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]')
    )`,
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS sponsor_usage_events_sponsor_date_idx ON sponsor_usage_events (sponsor_id, local_date, workspace_id_hash)",
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS sponsor_usage_events_occurred_idx ON sponsor_usage_events (occurred_at)",
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS sponsor_usage_events_state_date_idx ON sponsor_usage_events (attribution_state, local_date)",
  );

  // ── B3: the projections that survive the sweep ────────────────────────
  await run(
    c,
    `CREATE TABLE IF NOT EXISTS sponsor_usage_daily (
      sponsor_id text NOT NULL REFERENCES sponsors(id),
      local_date text NOT NULL,
      metric_dictionary_version text NOT NULL DEFAULT 'venue-metrics.v1',
      instrumentation_version text NOT NULL DEFAULT 'instrumentation.v1',
      timezone text NOT NULL DEFAULT 'Europe/Dublin',
      hash_salt_epoch text NOT NULL,
      active_workspaces integer NOT NULL,
      active_subjects integer NOT NULL,
      first_action_workspaces integer NOT NULL,
      eligible_workspaces integer NOT NULL,
      meaningful_actions integer NOT NULL,
      notes_actions integer,
      notes_workspaces integer,
      tasks_actions integer,
      tasks_workspaces integer,
      timeline_actions integer,
      timeline_workspaces integer,
      signal_actions integer,
      signal_workspaces integer,
      coverage_mask integer NOT NULL,
      expected_mask integer NOT NULL,
      data_through integer NOT NULL,
      revision integer NOT NULL DEFAULT 1,
      computed_at integer NOT NULL DEFAULT (unixepoch() * 1000),
      last_repaired_at integer,
      PRIMARY KEY (sponsor_id, local_date, metric_dictionary_version)
    )`,
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS sponsor_usage_daily_sponsor_date_idx ON sponsor_usage_daily (sponsor_id, local_date)",
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS sponsor_usage_daily_epoch_idx ON sponsor_usage_daily (sponsor_id, hash_salt_epoch)",
  );

  await run(
    c,
    `CREATE TABLE IF NOT EXISTS sponsor_workspace_lifecycle (
      sponsor_id text NOT NULL REFERENCES sponsors(id),
      workspace_id_hash text NOT NULL,
      hash_salt_epoch text NOT NULL,
      first_action_local_date text NOT NULL,
      last_action_local_date text NOT NULL,
      notes_last_action_local_date text,
      tasks_last_action_local_date text,
      timeline_last_action_local_date text,
      signal_last_action_local_date text,
      day30_state text CHECK (
        day30_state IS NULL
        OR day30_state IN ('returned', 'not_returned', 'indeterminate')
      ),
      day30_sealed_at integer,
      created_at integer NOT NULL DEFAULT (unixepoch() * 1000),
      updated_at integer NOT NULL DEFAULT (unixepoch() * 1000),
      PRIMARY KEY (sponsor_id, workspace_id_hash, hash_salt_epoch)
    )`,
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS sponsor_workspace_lifecycle_last_action_idx ON sponsor_workspace_lifecycle (sponsor_id, hash_salt_epoch, last_action_local_date)",
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS sponsor_workspace_lifecycle_first_action_idx ON sponsor_workspace_lifecycle (sponsor_id, hash_salt_epoch, first_action_local_date)",
  );

  // ── B6: frozen reports for closed periods ─────────────────────────────
  await run(
    c,
    `CREATE TABLE IF NOT EXISTS sponsor_report_snapshots (
      id text PRIMARY KEY,
      sponsor_id text NOT NULL REFERENCES sponsors(id),
      period_start text NOT NULL,
      period_end text NOT NULL,
      period_label text NOT NULL,
      metric_dictionary_version text NOT NULL DEFAULT 'venue-metrics.v1',
      timezone text NOT NULL DEFAULT 'Europe/Dublin',
      hash_salt_epoch text NOT NULL,
      payload_json text NOT NULL,
      coverage_state text NOT NULL,
      suppression_applied integer NOT NULL DEFAULT 0,
      eligible_workspaces integer NOT NULL,
      content_hash text NOT NULL,
      data_through integer NOT NULL,
      frozen_at integer NOT NULL DEFAULT (unixepoch() * 1000)
    )`,
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS sponsor_report_snapshots_sponsor_period_idx ON sponsor_report_snapshots (sponsor_id, period_start, period_end)",
  );
  await run(
    c,
    "CREATE INDEX IF NOT EXISTS sponsor_report_snapshots_frozen_idx ON sponsor_report_snapshots (frozen_at)",
  );

  if (DRY) return true;

  const tables = [
    "sponsor_usage_events",
    "sponsor_usage_daily",
    "sponsor_workspace_lifecycle",
    "sponsor_report_snapshots",
  ];
  let ok = true;
  for (const table of tables) {
    const present = await tableExists(c, table);
    log(present ? `[${label}] VERIFIED — ${table}` : `[${label}] MISSING ${table}`);
    ok = ok && present;
  }
  for (const [table, column] of [
    ["license_codes", "delivered_at"],
    ["license_codes", "expires_at"],
    ["sponsors", "reporting_timezone"],
  ]) {
    const present = await columnExists(c, table, column);
    log(
      present
        ? `[${label}] VERIFIED — ${table}.${column}`
        : `[${label}] MISSING ${table}.${column}`,
    );
    ok = ok && present;
  }
  return ok;
}

log(
  DRY
    ? "=== migrate-sponsor-usage DRY RUN ==="
    : "=== migrate-sponsor-usage APPLY ===",
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
