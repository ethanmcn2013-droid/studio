/**
 * Additive migration on signal-entitlements for the Venue Edition cash ledger.
 *
 *   E08.01 / E08.02 / E08.03   sponsor_price_agreements
 *
 * One append-only row per prepaid annual term, so a venue that joined at
 * EUR 1,000 still reads EUR 1,000 after the standard price moves, and every
 * prepayment stays individually identifiable for retrospective VAT correction
 * (R-014, R-022).
 *
 * Three things this creates beyond the table itself:
 *
 *   - a UNIQUE index on (sponsor_id, effective_from), so the same payment
 *     recorded twice is refused by the database rather than by whichever writer
 *     happened to check first;
 *   - BEFORE UPDATE and BEFORE DELETE triggers that RAISE(ABORT), which is what
 *     makes "append-only" a property of the database instead of a convention.
 *     Same discipline entitlement_events already runs under;
 *   - nothing else. It does not backfill. A venue whose payment predates this
 *     table has no agreement row, which reads as "no recorded term" rather than
 *     as a term at today's price.
 *
 * Additive and idempotent: every object is created only if absent, and existing
 * rows are never touched.
 *
 * Not a drizzle migration, for the reason recorded in migrate-access.mjs: the
 * tracked drizzle chain is desynced from the live database because columns were
 * ALTERed in outside it. (The `--> statement-breakpoint` splitting trap that has
 * cost this workspace two cycles applies to drizzle .sql files; this script
 * executes each statement individually and is not exposed to it.)
 *
 *   node scripts/migrate-venue-billing.mjs --dry-run
 *   node scripts/migrate-venue-billing.mjs
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@libsql/client";

const DRY = process.argv.includes("--dry-run");
const log = (...a) => console.log(...a);

/** Accept both credential names — see migrate-venue-edition-terms.mjs. */
function credential(kind) {
  const modern = process.env[`ENTITLEMENTS_${kind}`];
  const legacy = process.env[`TURSO_ENTITLEMENTS_${kind}`];
  const value = modern || legacy;
  return {
    value: value || "",
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

const TABLE = "sponsor_price_agreements";

const CREATE_TABLE = `CREATE TABLE ${TABLE} (
  id text PRIMARY KEY NOT NULL,
  sponsor_id text NOT NULL REFERENCES sponsors(id),
  venue_plan text NOT NULL,
  gross_amount_cents integer NOT NULL,
  amount_received_cents integer NOT NULL,
  vat_basis text NOT NULL DEFAULT 'inclusive',
  vat_rate_basis_points integer,
  net_amount_cents integer,
  vat_amount_cents integer,
  founding_locked integer NOT NULL DEFAULT 0,
  price_basis text NOT NULL,
  effective_from integer NOT NULL,
  effective_to integer NOT NULL,
  paid_at integer NOT NULL,
  recorded_by text NOT NULL,
  recorded_via text NOT NULL,
  note text,
  created_at integer NOT NULL DEFAULT (unixepoch() * 1000)
)`;

const INDEXES = [
  {
    name: "sponsor_price_agreements_sponsor_idx",
    ddl: `CREATE INDEX IF NOT EXISTS sponsor_price_agreements_sponsor_idx ON ${TABLE} (sponsor_id, effective_from)`,
  },
  {
    name: "sponsor_price_agreements_paid_idx",
    ddl: `CREATE INDEX IF NOT EXISTS sponsor_price_agreements_paid_idx ON ${TABLE} (paid_at)`,
  },
  {
    // The real guarantee against a double-recorded payment. A writer that
    // checks first and inserts second is a race; this is not.
    name: "sponsor_price_agreements_term_idx",
    ddl: `CREATE UNIQUE INDEX IF NOT EXISTS sponsor_price_agreements_term_idx ON ${TABLE} (sponsor_id, effective_from)`,
  },
];

const TRIGGERS = [
  {
    name: "sponsor_price_agreements_no_update",
    ddl: `CREATE TRIGGER sponsor_price_agreements_no_update
          BEFORE UPDATE ON ${TABLE}
          BEGIN SELECT RAISE(ABORT, 'sponsor_price_agreements is append-only: a recorded term is never edited'); END`,
  },
  {
    name: "sponsor_price_agreements_no_delete",
    ddl: `CREATE TRIGGER sponsor_price_agreements_no_delete
          BEFORE DELETE ON ${TABLE}
          BEGIN SELECT RAISE(ABORT, 'sponsor_price_agreements is append-only: a recorded term is never deleted'); END`,
  },
];

async function tableExists(c, name) {
  const r = await c.execute({
    sql: "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
    args: [name],
  });
  return r.rows.length > 0;
}

async function objectExists(c, type, name) {
  const r = await c.execute({
    sql: "SELECT name FROM sqlite_master WHERE type=? AND name=?",
    args: [type, name],
  });
  return r.rows.length > 0;
}

async function run(c, sql) {
  if (DRY) {
    log("  DRY would run:", sql.replace(/\s+/g, " ").slice(0, 140));
    return;
  }
  await c.execute(sql);
}

async function migrate(c, label) {
  // Fail closed rather than half-apply: the foreign key target must exist.
  if (!(await tableExists(c, "sponsors"))) {
    log(`[${label}] ABORT — table 'sponsors' is missing. Run migrate-access.mjs first.`);
    return false;
  }

  if (await tableExists(c, TABLE)) {
    log(`  skip (exists): table ${TABLE}`);
  } else {
    log(`  add: table ${TABLE} — one append-only row per prepaid annual term`);
    await run(c, CREATE_TABLE);
  }

  for (const idx of INDEXES) {
    if (await objectExists(c, "index", idx.name)) {
      log(`  skip (exists): index ${idx.name}`);
      continue;
    }
    log(`  add: index ${idx.name}`);
    await run(c, idx.ddl);
  }

  for (const trg of TRIGGERS) {
    if (await objectExists(c, "trigger", trg.name)) {
      log(`  skip (exists): trigger ${trg.name}`);
      continue;
    }
    log(`  add: trigger ${trg.name} — append-only enforced by the database`);
    await run(c, trg.ddl);
  }

  return verify(c, label);
}

/**
 * Prove the append-only guarantee rather than assert it.
 *
 * A trigger that exists in `sqlite_master` and does not fire is worse than no
 * trigger at all, because the table name says append-only and a reviewer stops
 * looking. So a probe row is written, an UPDATE and a DELETE are attempted
 * against it, and the whole thing is rolled back — the probe never survives the
 * migration.
 *
 * Returns a list of failures, empty when both triggers fired.
 */
async function probeAppendOnly(c, label) {
  const stamp = Date.now();
  const probeSponsor = `sp-probe-${stamp}`;
  const probeAgreement = `pa-probe-${stamp}`;
  const failures = [];
  const tx = await c.transaction("write");
  try {
    await tx.execute({
      sql: "INSERT INTO sponsors (id, slug, name, contact_email) VALUES (?, ?, ?, ?)",
      args: [probeSponsor, probeSponsor, "Append-only probe", "probe@example.invalid"],
    });
    await tx.execute({
      sql: `INSERT INTO ${TABLE}
            (id, sponsor_id, venue_plan, gross_amount_cents, amount_received_cents,
             price_basis, effective_from, effective_to, paid_at, recorded_by, recorded_via)
            VALUES (?, ?, 'paid', 150000, 150000, 'migration probe', 0, 1, 0, 'migration', 'probe')`,
      args: [probeAgreement, probeSponsor],
    });

    let updateRefused = false;
    try {
      await tx.execute({
        sql: `UPDATE ${TABLE} SET note = 'tampered' WHERE id = ?`,
        args: [probeAgreement],
      });
    } catch {
      updateRefused = true;
    }
    if (!updateRefused) failures.push("the append-only UPDATE trigger did not fire");

    let deleteRefused = false;
    try {
      await tx.execute({
        sql: `DELETE FROM ${TABLE} WHERE id = ?`,
        args: [probeAgreement],
      });
    } catch {
      deleteRefused = true;
    }
    if (!deleteRefused) failures.push("the append-only DELETE trigger did not fire");
  } catch (err) {
    failures.push(`append-only probe could not run: ${err?.message ?? err}`);
  } finally {
    try {
      await tx.rollback();
    } catch {
      /* a rolled-back or closed transaction is the state we wanted */
    }
  }

  const leftovers = await c.execute({
    sql: `SELECT COUNT(*) AS n FROM ${TABLE} WHERE id = ?`,
    args: [probeAgreement],
  });
  if (Number(leftovers.rows[0]?.n ?? 0) !== 0) {
    failures.push("the append-only probe row survived the rollback and cannot be deleted");
  }
  if (failures.length > 0) log(`[${label}] append-only probe: ${failures.join("; ")}`);
  return failures;
}

async function verify(c, label) {
  if (DRY) {
    log(`[${label}] DRY RUN — nothing applied, nothing verified.`);
    return true;
  }

  const missing = [];
  if (!(await tableExists(c, TABLE))) missing.push(`table ${TABLE}`);
  for (const idx of INDEXES) {
    if (!(await objectExists(c, "index", idx.name))) missing.push(`index ${idx.name}`);
  }
  for (const trg of TRIGGERS) {
    if (!(await objectExists(c, "trigger", trg.name))) missing.push(`trigger ${trg.name}`);
  }

  if (missing.length === 0) {
    missing.push(...(await probeAppendOnly(c, label)));
  }

  if (missing.length > 0) {
    log(`[${label}] STILL MISSING: ${missing.join(", ")}`);
    return false;
  }
  log(
    `[${label}] VERIFIED — ${TABLE} present, unique term index present, append-only triggers present and firing.`,
  );
  return true;
}

log(DRY ? "=== migrate-venue-billing DRY RUN ===" : "=== migrate-venue-billing APPLY ===");

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

const client = createClient({ url: dbUrl.value, authToken: dbToken.value || undefined });
const ok = await migrate(client, "signal-entitlements");

if (ok && !DRY) {
  log("");
  log("Done. Annual prepaid terms can now be recorded, and a recorded term cannot be edited or deleted.");
  log("Nothing was backfilled: a payment recorded before this table has no agreement row.");
}
process.exit(ok ? 0 : 1);
