/**
 * Additive migration on signal-entitlements for the two ratified Venue Edition
 * terms the shipped schema could not express.
 *
 *   R-015 / D-022  entitlements.wedding_date
 *                  Lets expires_at carry max(redemption + 548d, wedding + 90d)
 *                  instead of a flat 548 days that strands a long-lead booking
 *                  before its own wedding.
 *
 *   R-016 / D-020  sponsors.allotment_mode
 *                  sponsors.annual_wedding_count
 *                  sponsors.fair_use_ceiling
 *                  Lets "every couple you book, unlimited" be represented at
 *                  all, and replaces the onboarding form's undecided default
 *                  of ten with a ceiling computed from the venue's own number.
 *
 * Additive and idempotent. Every column is added only if absent, and
 * allotment_mode backfills to 'limited' — the pre-migration behaviour — so
 * applying this changes nothing until a venue is deliberately switched.
 *
 * Not a drizzle migration, for the reason recorded in migrate-access.mjs: the
 * tracked drizzle chain is desynced from the live database because columns
 * were ALTERed in outside it, so a bare drizzle ALTER errors on prod. This
 * checks pragma_table_info and adds only what is missing.
 *
 *   node scripts/migrate-venue-edition-terms.mjs --dry-run
 *   node scripts/migrate-venue-edition-terms.mjs
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@libsql/client";

const DRY = process.argv.includes("--dry-run");
const log = (...a) => console.log(...a);

/**
 * Accept both credential names.
 *
 * INFRASTRUCTURE.md's env convention (post 2026-07-31 reset) is
 * `ENTITLEMENTS_DATABASE_URL`, rule 1 being "never encode the vendor in a
 * variable name". Every line of shipped studio code still reads
 * `TURSO_ENTITLEMENTS_DATABASE_URL`. Until that drift is closed, a migration
 * that accepts only one of them fails for a reason that has nothing to do with
 * the migration.
 */
function credential(kind) {
  const modern = process.env[`ENTITLEMENTS_${kind}`];
  const legacy = process.env[`TURSO_ENTITLEMENTS_${kind}`];
  const value = modern || legacy;
  return {
    value: value || "",
    name: modern ? `ENTITLEMENTS_${kind}` : legacy ? `TURSO_ENTITLEMENTS_${kind}` : null,
  };
}

/** The database host, so an operator can confirm the target before applying.
 *  Never prints the token, and never prints the query string. */
function describeTarget(url) {
  try {
    if (url.startsWith("file:")) return `local file · ${url.slice(5).split("?")[0]}`;
    return new URL(url).host;
  } catch {
    return "unparseable url";
  }
}

/** Column additions, in the order they are applied. */
const COLUMNS = [
  {
    table: "entitlements",
    column: "wedding_date",
    ddl: "wedding_date integer",
    why: "R-015: the couple's wedding day, UTC midnight",
  },
  {
    table: "sponsors",
    column: "allotment_mode",
    ddl: "allotment_mode text NOT NULL DEFAULT 'limited'",
    why: "R-016: 'limited' | 'unlimited'",
  },
  {
    table: "sponsors",
    column: "annual_wedding_count",
    ddl: "annual_wedding_count integer",
    why: "D-020 point 4: collected after signature, sets the ceiling not the price",
  },
  {
    table: "sponsors",
    column: "fair_use_ceiling",
    ddl: "fair_use_ceiling integer",
    why: "D-020 point 1: notifies, never blocks",
  },
  {
    table: "sponsors",
    column: "founding_number",
    ddl: "founding_number integer",
    why: "E02.13: the Founding Venue place, 1 to 25, assigned on cleared payment",
  },
  {
    table: "sponsors",
    column: "founding_number_assigned_at",
    ddl: "founding_number_assigned_at integer",
    why: "E02.13: when the payment cleared and the number was taken",
  },
];

const INDEXES = [
  {
    name: "entitlements_wedding_date_idx",
    ddl: "CREATE INDEX IF NOT EXISTS entitlements_wedding_date_idx ON entitlements (wedding_date)",
  },
  {
    // PARTIAL unique: only assigned numbers are constrained, so any number of
    // venues may sit at NULL while no two can ever hold the same place. This
    // is the whole mechanism that stops two founding venues both being told
    // they are 07/25, which is unrecoverable with exactly the people whose
    // reference value is why they were recruited.
    name: "sponsors_founding_number_idx",
    ddl: "CREATE UNIQUE INDEX IF NOT EXISTS sponsors_founding_number_idx ON sponsors (founding_number) WHERE founding_number IS NOT NULL",
    guard: async (c) => {
      const dupes = await c.execute(
        `SELECT founding_number, COUNT(*) AS n FROM sponsors
         WHERE founding_number IS NOT NULL GROUP BY founding_number HAVING n > 1`,
      );
      if (dupes.rows.length > 0) {
        const detail = dupes.rows
          .map((r) => `${r.founding_number} held by ${r.n} venues`)
          .join(", ");
        throw new Error(
          `founding_number duplicates require explicit reconciliation before the unique index: ${detail}`,
        );
      }
    },
  },
];

async function tableExists(c, name) {
  const r = await c.execute({
    sql: "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
    args: [name],
  });
  return r.rows.length > 0;
}

async function columnNames(c, table) {
  const r = await c.execute(`PRAGMA table_info(${table})`);
  return new Set(r.rows.map((row) => String(row.name)));
}

async function indexExists(c, name) {
  const r = await c.execute({
    sql: "SELECT name FROM sqlite_master WHERE type='index' AND name=?",
    args: [name],
  });
  return r.rows.length > 0;
}

async function run(c, sql) {
  if (DRY) {
    log("  DRY would run:", sql.replace(/\s+/g, " "));
    return;
  }
  await c.execute(sql);
}

async function migrate(c, label) {
  // Fail closed rather than half-apply: both tables must already exist.
  for (const table of ["entitlements", "sponsors"]) {
    if (!(await tableExists(c, table))) {
      log(`[${label}] ABORT — table '${table}' is missing. Run migrate-access.mjs first.`);
      return false;
    }
  }

  for (const col of COLUMNS) {
    const have = await columnNames(c, col.table);
    if (have.has(col.column)) {
      log(`  skip (exists): ${col.table}.${col.column}`);
      continue;
    }
    log(`  add: ${col.table}.${col.column} — ${col.why}`);
    await run(c, `ALTER TABLE ${col.table} ADD ${col.ddl}`);
  }

  for (const idx of INDEXES) {
    if (await indexExists(c, idx.name)) {
      log(`  skip (exists): index ${idx.name}`);
      continue;
    }
    // Fail closed rather than half-apply: a unique index over dirty data
    // errors mid-migration and leaves the operator guessing.
    if (idx.guard && !DRY) await idx.guard(c);
    log(`  add: index ${idx.name}`);
    await run(c, idx.ddl);
  }

  // Existing rows predate the column and must read as 'limited'. The DEFAULT
  // covers the ALTER itself; this covers any row an earlier partial run left
  // null, and is a no-op on a clean apply.
  await run(
    c,
    "UPDATE sponsors SET allotment_mode = 'limited' WHERE allotment_mode IS NULL",
  );

  return verify(c, label);
}

async function verify(c, label) {
  if (DRY) {
    log(`[${label}] DRY RUN — nothing applied, nothing verified.`);
    return true;
  }

  const missing = [];
  for (const col of COLUMNS) {
    const have = await columnNames(c, col.table);
    if (!have.has(col.column)) missing.push(`${col.table}.${col.column}`);
  }
  for (const idx of INDEXES) {
    if (!(await indexExists(c, idx.name))) missing.push(`index ${idx.name}`);
  }

  const nullModes = await c.execute(
    "SELECT COUNT(*) AS n FROM sponsors WHERE allotment_mode IS NULL",
  );
  const nullCount = Number(nullModes.rows[0]?.n ?? 0);
  if (nullCount > 0) missing.push(`${nullCount} sponsors with a null allotment_mode`);

  // Nothing may have silently become unlimited. This migration only makes
  // unlimited REPRESENTABLE; switching a venue to it is a separate, deliberate
  // operator action.
  const unlimited = await c.execute(
    "SELECT COUNT(*) AS n FROM sponsors WHERE allotment_mode = 'unlimited'",
  );
  log(`[${label}] sponsors on unlimited: ${Number(unlimited.rows[0]?.n ?? 0)}`);

  if (missing.length > 0) {
    log(`[${label}] STILL MISSING: ${missing.join(", ")}`);
    return false;
  }
  log(`[${label}] VERIFIED — wedding_date, allotment_mode, annual_wedding_count, fair_use_ceiling, founding_number present.`);
  return true;
}

log(
  DRY
    ? "=== migrate-venue-edition-terms DRY RUN ==="
    : "=== migrate-venue-edition-terms APPLY ===",
);

const dbUrl = credential("DATABASE_URL");
const dbToken = credential("AUTH_TOKEN");

if (!dbUrl.value) {
  log("");
  log("STOPPED — no database credentials found.");
  log("");
  log("Add these two lines to studio/.env.local, then run this again:");
  log("");
  log("  TURSO_ENTITLEMENTS_DATABASE_URL=libsql://<your-entitlements-host>");
  log("  TURSO_ENTITLEMENTS_AUTH_TOKEN=<your-token>");
  log("");
  log("(ENTITLEMENTS_DATABASE_URL and ENTITLEMENTS_AUTH_TOKEN also work.)");
  log("Nothing was changed.");
  process.exit(1);
}

log(`Database:   ${describeTarget(dbUrl.value)}`);
log(`Read from:  ${dbUrl.name}${dbToken.name ? ` and ${dbToken.name}` : " (no token set)"}`);
log("");

const client = createClient({
  url: dbUrl.value,
  authToken: dbToken.value || undefined,
});
const ok = await migrate(client, "signal-entitlements");

if (ok && !DRY) {
  log("");
  log("Done. The couple access term and the unlimited entitlement can now be stored.");
  log("No venue was switched to unlimited — that stays a deliberate, separate action.");
}
process.exit(ok ? 0 : 1);
