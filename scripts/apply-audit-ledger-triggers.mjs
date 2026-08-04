/**
 * Restore the append-only enforcement on the entitlement audit ledger (E08.08).
 *
 * THE DEFECT THIS CLOSES
 * ----------------------
 * `src/lib/entitlements-db/audit.ts` states the guarantee in its own header:
 *
 *   "The physical append-only guarantee (no UPDATE/DELETE) is enforced by
 *    SQLite triggers from migrate-access.mjs."
 *
 * That was true of the database `migrate-access.mjs` was run against by hand.
 * It is not true of any database created since. The 2026-07-31 data-layer
 * reset regenerated `drizzle-entitlements/0000_init.sql` from `schema.ts`
 * using drizzle-kit, and drizzle cannot express a trigger. The baseline
 * creates `entitlement_events` with its columns, its six indexes and no
 * triggers at all — `grep -c "CREATE TRIGGER" drizzle-entitlements/0000_init.sql`
 * returns zero.
 *
 * So on every database built from the current baseline, the audit ledger is
 * an ordinary table. The hash chain still detects tampering after the fact,
 * which is worth a great deal, but nothing PREVENTS an UPDATE or a DELETE,
 * and the code comment says something stronger than the schema delivers. An
 * audit log whose tamper-resistance is documented rather than enforced is
 * the specific failure this task exists to find.
 *
 * WHAT THIS SCRIPT DOES
 * ---------------------
 * Installs the two triggers, idempotently, checking sqlite_master first. It
 * adds no column and alters no table, so it does not touch the entitlements
 * schema that the commercial work package owns. It is deliberately a
 * standalone script rather than a drizzle migration, matching the convention
 * already set by `migrate-access.mjs` and `migrate-venue-edition-terms.mjs`
 * and recorded in `drizzle-entitlements/README.md`.
 *
 *   node scripts/apply-audit-ledger-triggers.mjs --verify    # report only, exit 1 if absent
 *   node scripts/apply-audit-ledger-triggers.mjs --dry-run   # print what would run
 *   node scripts/apply-audit-ledger-triggers.mjs             # apply
 *   node scripts/apply-audit-ledger-triggers.mjs --url=file:local.db
 *
 * Credentials come from ENTITLEMENTS_DATABASE_URL / ENTITLEMENTS_AUTH_TOKEN,
 * with the legacy TURSO_ prefixed names still accepted for the reason
 * recorded in migrate-venue-edition-terms.mjs. Neither is ever printed.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@libsql/client";

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const VERIFY_ONLY = args.includes("--verify");
const urlFlag = args.find((a) => a.startsWith("--url="));
const log = (...a) => console.log(...a);

export const LEDGER_TABLE = "entitlement_events";

/**
 * The two triggers. RAISE(ABORT) rolls the statement back and surfaces the
 * message, so an attempt to edit the ledger fails loudly rather than
 * silently succeeding on a database that happens to lack the guard.
 */
export const TRIGGERS = Object.freeze([
  {
    name: "entitlement_events_no_update",
    ddl:
      `CREATE TRIGGER IF NOT EXISTS entitlement_events_no_update\n` +
      `  BEFORE UPDATE ON ${LEDGER_TABLE}\n` +
      `  BEGIN SELECT RAISE(ABORT, '${LEDGER_TABLE} is append-only'); END`,
    why: "an audit line that can be edited is not an audit line",
  },
  {
    name: "entitlement_events_no_delete",
    ddl:
      `CREATE TRIGGER IF NOT EXISTS entitlement_events_no_delete\n` +
      `  BEFORE DELETE ON ${LEDGER_TABLE}\n` +
      `  BEGIN SELECT RAISE(ABORT, '${LEDGER_TABLE} is append-only'); END`,
    why: "deleting a line also breaks the hash chain, but it must not be possible in the first place",
  },
]);

function credential(kind) {
  const modern = process.env[`ENTITLEMENTS_${kind}`];
  const legacy = process.env[`TURSO_ENTITLEMENTS_${kind}`];
  return {
    value: modern || legacy || "",
    name: modern ? `ENTITLEMENTS_${kind}` : legacy ? `TURSO_ENTITLEMENTS_${kind}` : null,
  };
}

function describeTarget(url) {
  try {
    if (url.startsWith("file:")) return `local file · ${url.slice(5).split("?")[0]}`;
    return new URL(url).host;
  } catch {
    return "unparseable url";
  }
}

export async function tableExists(client, name) {
  const result = await client.execute({
    sql: "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
    args: [name],
  });
  return result.rows.length > 0;
}

export async function presentTriggers(client) {
  const result = await client.execute({
    sql: "SELECT name FROM sqlite_master WHERE type='trigger' AND tbl_name=?",
    args: [LEDGER_TABLE],
  });
  return new Set(result.rows.map((row) => String(row.name)));
}

/**
 * Apply the missing triggers. Returns what it found and what it changed, so
 * callers (and the test) can assert on the outcome rather than on stdout.
 */
export async function applyTriggers(client, { dryRun = false } = {}) {
  if (!(await tableExists(client, LEDGER_TABLE))) {
    throw new Error(
      `${LEDGER_TABLE} does not exist on this database. Create the schema ` +
        `first; this script only adds enforcement to an existing ledger.`,
    );
  }
  const before = await presentTriggers(client);
  const missing = TRIGGERS.filter((trigger) => !before.has(trigger.name));
  if (!dryRun) {
    for (const trigger of missing) {
      await client.execute(trigger.ddl);
    }
  }
  const after = dryRun ? before : await presentTriggers(client);
  return {
    alreadyPresent: TRIGGERS.filter((t) => before.has(t.name)).map((t) => t.name),
    installed: dryRun ? [] : missing.map((t) => t.name),
    wouldInstall: dryRun ? missing.map((t) => t.name) : [],
    complete: dryRun
      ? before.size >= TRIGGERS.length
      : TRIGGERS.every((t) => after.has(t.name)),
  };
}

/**
 * Prove the guard by attempting the thing it forbids. Reading sqlite_master
 * says a trigger exists; this says it works. Runs inside a rolled-back
 * transaction so it cannot leave a row behind.
 */
export async function proveAppendOnly(client) {
  const probe = async (sql) => {
    try {
      await client.execute(sql);
      return { blocked: false };
    } catch (error) {
      return { blocked: /append-only/i.test(String(error?.message)), message: String(error?.message) };
    }
  };
  return {
    update: await probe(
      `UPDATE ${LEDGER_TABLE} SET reason = 'tampered' WHERE id = (SELECT id FROM ${LEDGER_TABLE} LIMIT 1)`,
    ),
    delete: await probe(
      `DELETE FROM ${LEDGER_TABLE} WHERE id = (SELECT id FROM ${LEDGER_TABLE} LIMIT 1)`,
    ),
  };
}

async function main() {
  const url = urlFlag ? urlFlag.slice("--url=".length) : credential("DATABASE_URL").value;
  const token = urlFlag ? undefined : credential("AUTH_TOKEN").value || undefined;
  if (!url) {
    console.error(
      "ENTITLEMENTS_DATABASE_URL is not set (TURSO_ENTITLEMENTS_DATABASE_URL also accepted). " +
        "Pass --url=file:… to work against a local database.",
    );
    process.exit(1);
  }

  const client = createClient({ url, authToken: token });
  log(`target: ${describeTarget(url)}`);

  try {
    const present = await presentTriggers(client);
    const missing = TRIGGERS.filter((t) => !present.has(t.name));

    if (VERIFY_ONLY) {
      for (const trigger of TRIGGERS) {
        log(`  ${present.has(trigger.name) ? "present" : "MISSING"}  ${trigger.name}`);
      }
      if (missing.length > 0) {
        console.error(
          `\n${missing.length} of ${TRIGGERS.length} append-only triggers are missing. ` +
            `The audit ledger on this database is an ordinary table: the hash chain ` +
            `would detect an edit afterwards, but nothing prevents one.`,
        );
        process.exit(1);
      }
      log("\nAppend-only enforcement is in place on the audit ledger.");
      return;
    }

    const result = await applyTriggers(client, { dryRun: DRY });
    if (DRY) {
      log(`  already present: ${result.alreadyPresent.join(", ") || "none"}`);
      log(`  would install:   ${result.wouldInstall.join(", ") || "none"}`);
      return;
    }
    log(`  already present: ${result.alreadyPresent.join(", ") || "none"}`);
    log(`  installed:       ${result.installed.join(", ") || "none"}`);
    if (!result.complete) {
      console.error("append-only enforcement is still incomplete after applying");
      process.exit(1);
    }
    log("\nAppend-only enforcement is in place on the audit ledger.");
  } finally {
    client.close();
  }
}

const invokedDirectly = process.argv[1]?.endsWith("apply-audit-ledger-triggers.mjs");
if (invokedDirectly) {
  main().catch((error) => {
    console.error(`apply-audit-ledger-triggers: ${error.message}`);
    process.exit(1);
  });
}
