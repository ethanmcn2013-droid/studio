#!/usr/bin/env node
/**
 * Apply the entitlements migration set to a fresh in-memory libSQL database and
 * assert the result, so "the migration is correct" is a thing that was run
 * rather than a thing that was read.
 *
 * Two properties matter here and neither is visible by inspection:
 *
 * 1. The metric-dictionary DEFAULT is `account-metrics.v2` on both tables that
 *    carry it. On `sponsor_usage_daily` that column is also part of the
 *    composite primary key, so a row inserted without an explicit version is
 *    keyed under whatever the default says. A retired name there is not a label
 *    problem, it is a key.
 * 2. Every column the shipped code reads or writes actually exists. Six of them
 *    were declared in `schema.ts` and created by no migration, which means a
 *    database built from the baseline could not run the code at all.
 *
 * Run: node scripts/check-entitlements-migrations.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@libsql/client";

const DIR = join(process.cwd(), "drizzle-entitlements");
const JOURNAL = JSON.parse(readFileSync(join(DIR, "meta", "_journal.json"), "utf8"));

const failures = [];
function check(label, condition, detail = "") {
  if (condition) {
    console.log(`  ok   ${label}`);
  } else {
    failures.push(`${label}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const client = createClient({ url: "file::memory:" });

console.log("applying migrations");
for (const entry of JOURNAL.entries) {
  const sql = readFileSync(join(DIR, `${entry.tag}.sql`), "utf8");
  const statements = sql
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await client.execute(statement);
  }
  console.log(`  applied ${entry.tag} (${statements.length} statements)`);
}

async function columns(table) {
  const result = await client.execute(`PRAGMA table_info(${table})`);
  return new Map(result.rows.map((row) => [row.name, row]));
}

console.log("\nmetric dictionary default");
for (const table of ["sponsor_usage_daily", "sponsor_report_snapshots"]) {
  const cols = await columns(table);
  const col = cols.get("metric_dictionary_version");
  const value = col ? String(col.dflt_value) : "<missing>";
  check(
    `${table}.metric_dictionary_version defaults to account-metrics.v2`,
    value.includes("account-metrics.v2"),
    value,
  );
  check(
    `${table}.metric_dictionary_version no longer defaults to the retired name`,
    !value.includes("venue-metrics.v1"),
    value,
  );
}

console.log("\nthe default is a key, not a label");
await client.execute(
  `INSERT INTO sponsors (id, slug, name, contact_email) VALUES ('sp_1','sp-1','Sponsor One','one@example.invalid')`,
);
await client.execute(
  `INSERT INTO sponsor_usage_daily
     (sponsor_id, local_date, hash_salt_epoch, active_workspaces, active_subjects,
      first_action_workspaces, eligible_workspaces, meaningful_actions,
      coverage_mask, expected_mask, data_through)
   VALUES ('sp_1','2026-08-01','abc12345',1,1,1,3,1,15,15,0)`,
);
const keyed = await client.execute(
  `SELECT metric_dictionary_version FROM sponsor_usage_daily`,
);
check(
  "a row inserted without an explicit version is keyed under account-metrics.v2",
  keyed.rows[0].metric_dictionary_version === "account-metrics.v2",
  String(keyed.rows[0].metric_dictionary_version),
);

console.log("\ncolumns the shipped code depends on");
const entitlementCols = await columns("entitlements");
check(
  "entitlements.wedding_date exists (R-015: D-010 access term needs it)",
  entitlementCols.has("wedding_date"),
);
const sponsorCols = await columns("sponsors");
for (const column of [
  "allotment_mode",
  "founding_number",
  "founding_number_assigned_at",
  "annual_wedding_count",
  "fair_use_ceiling",
]) {
  check(`sponsors.${column} exists`, sponsorCols.has(column));
}

console.log("\nindexes survived the table rebuild");
const indexes = await client.execute(
  `SELECT name FROM sqlite_master WHERE type = 'index' AND name NOT LIKE 'sqlite_%'`,
);
const names = new Set(indexes.rows.map((row) => String(row.name)));
for (const expected of [
  "sponsor_usage_daily_sponsor_date_idx",
  "sponsor_usage_daily_epoch_idx",
  "sponsor_usage_events_sponsor_date_idx",
  "sponsor_workspace_lifecycle_first_action_idx",
  "entitlements_wedding_date_idx",
]) {
  check(`index ${expected} exists`, names.has(expected));
}

client.close();

console.log("");
if (failures.length > 0) {
  console.error(`${failures.length} check(s) failed:`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log("entitlements migration set applies cleanly and asserts out.");
