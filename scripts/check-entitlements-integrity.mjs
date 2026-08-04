/**
 * Read-only data-integrity checks for the shared entitlements database (E08.09).
 *
 * WHY THIS EXISTS
 * ---------------
 * The entitlements database is the commercial record: which venue is on
 * which plan, what they were charged, which founding place they hold, which
 * couple redeemed which code, and the audit ledger over all of it. It is
 * written by a hand-run CLI, by the Stripe webhook in the app, and by
 * several hand-run migration scripts. Nothing checks that the result is
 * coherent.
 *
 * These invariants are the ones where being wrong is expensive with a real
 * venue rather than merely untidy: two venues holding the same founding
 * place, a venue recorded as paid with no price agreement behind it, a
 * founding rate charged at the standard price, an audit ledger whose hash
 * chain no longer verifies.
 *
 * Every check is SELECT-only and is skipped, with that fact reported, when
 * the table it needs does not exist on the target database. A check that
 * quietly disappears because a migration has not run yet would be worse
 * than no check at all.
 *
 *   node scripts/check-entitlements-integrity.mjs
 *   node scripts/check-entitlements-integrity.mjs --url=file:local.db --json
 *
 * Exit 0 when every error-severity check is clean, 1 otherwise.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@libsql/client";

/** Both prices are VAT-INCLUSIVE under D-021. Kept as literals here on
 *  purpose: this script's job is to disagree with the application when the
 *  application is wrong, so it must not import the value it is checking. */
export const FOUNDING_AMOUNT_CENTS = 100000;
export const STANDARD_AMOUNT_CENTS = 150000;
export const FOUNDING_PLACES = 25;

/** @type {ReadonlyArray<{id:string,severity:"error"|"warn",tables:string[],title:string,why:string,sql:string}>} */
export const CHECKS = Object.freeze([
  {
    id: "duplicate-founding-number",
    severity: "error",
    tables: ["sponsors"],
    title: "No two venues hold the same founding place",
    why:
      "Two venues both told they are 07/25 cannot be walked back, with " +
      "exactly the people whose reference value is why they were recruited.",
    sql: `SELECT CAST(founding_number AS TEXT) AS subject FROM sponsors
          WHERE founding_number IS NOT NULL
          GROUP BY founding_number HAVING COUNT(*) > 1`,
  },
  {
    id: "founding-number-out-of-range",
    severity: "error",
    tables: ["sponsors"],
    title: `Every assigned founding number is between 1 and ${FOUNDING_PLACES}`,
    why: "The programme is the Founding 25. A 26th place does not exist.",
    sql: `SELECT id AS subject FROM sponsors
          WHERE founding_number IS NOT NULL
            AND (founding_number < 1 OR founding_number > ${FOUNDING_PLACES})`,
  },
  {
    id: "founding-number-without-payment",
    severity: "error",
    tables: ["sponsors"],
    title: "A founding number is only held by a venue whose payment cleared",
    why:
      "D-009 point 6: the number is assigned on cleared payment, never on " +
      "signature. A number against an unpaid venue is the promise made early.",
    sql: `SELECT id AS subject FROM sponsors
          WHERE founding_number IS NOT NULL AND paid_at IS NULL`,
  },
  {
    id: "paid-venue-without-term",
    severity: "error",
    tables: ["sponsors"],
    title: "Every venue recorded as paid has a term window",
    why:
      "Without term_starts_at and term_ends_at there is no renewal date, so " +
      "nothing can tell the venue or the operator when the year runs out.",
    sql: `SELECT id AS subject FROM sponsors
          WHERE paid_at IS NOT NULL
            AND (term_starts_at IS NULL OR term_ends_at IS NULL)`,
  },
  {
    id: "term-window-inverted",
    severity: "error",
    tables: ["sponsors"],
    title: "Every term window ends after it starts",
    why: "An inverted window makes a live venue look permanently lapsed.",
    sql: `SELECT id AS subject FROM sponsors
          WHERE term_starts_at IS NOT NULL AND term_ends_at IS NOT NULL
            AND term_ends_at <= term_starts_at`,
  },
  {
    id: "founding-plan-charged-standard-price",
    severity: "error",
    tables: ["sponsors"],
    title: `A founding venue is recorded at EUR ${FOUNDING_AMOUNT_CENTS / 100}, not the standard price`,
    why:
      "This exact defect shipped: mark-venue-paid wrote the standard price " +
      "for both plans, so every founding venue would have been recorded in " +
      "the cash ledger at EUR 1,500 against EUR 1,000 actually received.",
    sql: `SELECT id AS subject FROM sponsors
          WHERE venue_plan = 'founding' AND annual_amount_cents IS NOT NULL
            AND annual_amount_cents <> ${FOUNDING_AMOUNT_CENTS}`,
  },
  {
    id: "standard-plan-charged-founding-price",
    severity: "error",
    tables: ["sponsors"],
    title: `A standard venue is recorded at EUR ${STANDARD_AMOUNT_CENTS / 100}`,
    why: "The mirror of the above, and it quietly loses EUR 500 a year.",
    sql: `SELECT id AS subject FROM sponsors
          WHERE venue_plan = 'paid' AND annual_amount_cents IS NOT NULL
            AND annual_amount_cents <> ${STANDARD_AMOUNT_CENTS}`,
  },
  {
    id: "founding-lock-without-founding-plan",
    severity: "error",
    tables: ["sponsors"],
    title: "The founding rate lock is only set on a founding venue",
    why:
      "founding_locked on a standard agreement claims a rate lock that was " +
      "never sold, and D-009's lock is the hardest promise in the programme.",
    sql: `SELECT id AS subject FROM sponsors
          WHERE founding_locked = 1 AND venue_plan <> 'founding'`,
  },
  {
    id: "paid-venue-without-price-agreement",
    severity: "error",
    tables: ["sponsors", "sponsor_price_agreements"],
    title: "Every venue recorded as paid has a price agreement behind it",
    why:
      "R-014 and R-022 both depend on every prepayment being individually " +
      "identifiable so the VAT treatment can be corrected retrospectively. A " +
      "paid venue with no agreement row is money received with no basis on file.",
    sql: `SELECT s.id AS subject FROM sponsors s
          WHERE s.paid_at IS NOT NULL
            AND s.venue_plan IN ('founding', 'paid')
            AND NOT EXISTS (
              SELECT 1 FROM sponsor_price_agreements a WHERE a.sponsor_id = s.id
            )`,
  },
  {
    id: "price-agreement-orphaned",
    severity: "error",
    tables: ["sponsors", "sponsor_price_agreements"],
    title: "No price agreement points at a venue that does not exist",
    why: "An agreement with no venue is revenue attributed to nobody.",
    sql: `SELECT a.id AS subject FROM sponsor_price_agreements a
          WHERE NOT EXISTS (SELECT 1 FROM sponsors s WHERE s.id = a.sponsor_id)`,
  },
  {
    id: "price-agreement-not-vat-inclusive",
    severity: "error",
    tables: ["sponsor_price_agreements"],
    title: "Every price agreement is recorded on the VAT-inclusive basis",
    why:
      "D-021 ratified VAT-inclusive pricing. A row on any other basis means " +
      "the recorded amount and the published price mean different things.",
    sql: `SELECT id AS subject FROM sponsor_price_agreements
          WHERE vat_basis <> 'inclusive'`,
  },
  {
    id: "license-code-orphaned",
    severity: "error",
    tables: ["license_codes", "sponsors"],
    title: "No license code belongs to a venue that does not exist",
    why:
      "An orphaned code is a live invitation nobody can trace back to the " +
      "venue that issued it, so it can neither be revoked nor attributed.",
    sql: `SELECT c.id AS subject FROM license_codes c
          WHERE NOT EXISTS (SELECT 1 FROM sponsors s WHERE s.id = c.sponsor_id)`,
  },
  {
    id: "redeemed-code-without-redemption",
    severity: "error",
    tables: ["license_codes", "redemptions"],
    title: "Every code marked redeemed has a redemption record",
    why:
      "The redemption row is where the couple's access term begins. A code " +
      "marked redeemed with no row is a couple with no recorded start date.",
    sql: `SELECT c.id AS subject FROM license_codes c
          WHERE c.status = 'redeemed'
            AND NOT EXISTS (SELECT 1 FROM redemptions r WHERE r.code_id = c.id)`,
  },
  {
    id: "code-redeemed-twice",
    severity: "error",
    tables: ["redemptions"],
    title: "No code has been redeemed by two different people",
    why:
      "One invitation, one couple. Two subjects on one code means two " +
      "households share a workspace neither chose to share.",
    sql: `SELECT code_id AS subject FROM redemptions
          GROUP BY code_id HAVING COUNT(DISTINCT user_clerk_id) > 1`,
  },
  {
    id: "unlimited-sponsor-carrying-a-seat-count",
    severity: "warn",
    tables: ["sponsors"],
    title: "A venue on the unlimited model carries no seat count",
    why:
      "D-020: no seat count appears anywhere. A leftover code_allotment on " +
      "an unlimited sponsor is the number that would get shown by accident.",
    sql: `SELECT id AS subject FROM sponsors
          WHERE allotment_mode = 'unlimited' AND code_allotment IS NOT NULL`,
  },
  {
    id: "audit-ledger-missing-hash",
    severity: "error",
    tables: ["entitlement_events"],
    title: "Every audit line carries its chain hashes",
    why:
      "A line with a null row_hash cannot be verified and breaks the chain " +
      "for every line after it.",
    sql: `SELECT id AS subject FROM entitlement_events
          WHERE row_hash IS NULL OR prev_hash IS NULL`,
  },
]);

const SELECT_ONLY = /^\s*SELECT\b/i;

async function existingTables(client) {
  const result = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table'",
  );
  return new Set(result.rows.map((row) => String(row.name)));
}

export async function runChecks(client, checks = CHECKS, { sampleLimit = 5 } = {}) {
  const tables = await existingTables(client);
  const results = [];
  for (const check of checks) {
    if (!SELECT_ONLY.test(check.sql)) {
      throw new Error(`check "${check.id}" is not a SELECT; this script is read-only`);
    }
    const missing = check.tables.filter((name) => !tables.has(name));
    if (missing.length > 0) {
      results.push({
        id: check.id,
        severity: check.severity,
        title: check.title,
        why: check.why,
        skipped: `table(s) absent: ${missing.join(", ")}`,
        violations: 0,
        sample: [],
      });
      continue;
    }
    const result = await client.execute(check.sql);
    const subjects = result.rows.map((row) => String(row.subject));
    results.push({
      id: check.id,
      severity: check.severity,
      title: check.title,
      why: check.why,
      skipped: null,
      violations: subjects.length,
      sample: subjects.slice(0, sampleLimit),
    });
  }
  return results;
}

/**
 * The append-only triggers are enforcement, not data, so they are reported
 * separately. A ledger with intact rows and no triggers is not intact, it is
 * unprotected.
 */
export async function ledgerEnforcement(client) {
  const tables = await existingTables(client);
  if (!tables.has("entitlement_events")) {
    return { applicable: false, present: [], missing: [] };
  }
  const result = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='trigger' AND tbl_name='entitlement_events'",
  );
  const present = result.rows.map((row) => String(row.name));
  const expected = ["entitlement_events_no_update", "entitlement_events_no_delete"];
  return {
    applicable: true,
    present,
    missing: expected.filter((name) => !present.includes(name)),
  };
}

export function summarise(results, enforcement) {
  const errors = results.filter(
    (r) => r.severity === "error" && !r.skipped && r.violations > 0,
  );
  const warnings = results.filter(
    (r) => r.severity === "warn" && !r.skipped && r.violations > 0,
  );
  const skipped = results.filter((r) => r.skipped);
  const enforcementBroken = Boolean(enforcement?.applicable && enforcement.missing.length > 0);
  return {
    ok: errors.length === 0 && !enforcementBroken,
    checksRun: results.length - skipped.length,
    checksSkipped: skipped.length,
    failingChecks: errors.length,
    warningChecks: warnings.length,
    ledgerEnforcementMissing: enforcement?.missing ?? [],
  };
}

function credential(kind) {
  return (
    process.env[`ENTITLEMENTS_${kind}`] ||
    process.env[`TURSO_ENTITLEMENTS_${kind}`] ||
    ""
  );
}

async function main() {
  const args = process.argv.slice(2);
  const urlFlag = args.find((a) => a.startsWith("--url="));
  const asJson = args.includes("--json");
  const url = urlFlag ? urlFlag.slice("--url=".length) : credential("DATABASE_URL");
  if (!url) {
    console.error(
      "ENTITLEMENTS_DATABASE_URL is not set. Pass --url=file:… for a local database.",
    );
    process.exit(1);
  }
  const client = createClient({
    url,
    authToken: urlFlag ? undefined : credential("AUTH_TOKEN") || undefined,
  });

  let results;
  let enforcement;
  try {
    results = await runChecks(client);
    enforcement = await ledgerEnforcement(client);
  } finally {
    client.close();
  }
  const summary = summarise(results, enforcement);

  if (asJson) {
    console.log(JSON.stringify({ summary, enforcement, results }, null, 2));
  } else {
    console.log(`Entitlements integrity — ${results.length} invariants\n`);
    for (const result of results) {
      const mark = result.skipped
        ? "SKIP"
        : result.violations === 0
          ? "PASS"
          : result.severity === "error"
            ? "FAIL"
            : "WARN";
      console.log(`[${mark}] ${result.id} — ${result.title}`);
      if (result.skipped) console.log(`       ${result.skipped}`);
      if (result.violations > 0) {
        console.log(`       ${result.violations} violation(s). ${result.why}`);
        console.log(`       sample: ${result.sample.join(", ")}`);
      }
    }
    if (enforcement.applicable) {
      console.log(
        `\n[${enforcement.missing.length === 0 ? "PASS" : "FAIL"}] audit ledger append-only triggers` +
          (enforcement.missing.length
            ? `\n       missing: ${enforcement.missing.join(", ")}` +
              `\n       run: node scripts/apply-audit-ledger-triggers.mjs`
            : ""),
      );
    }
    console.log(
      `\n${summary.checksRun} checks run, ${summary.checksSkipped} skipped, ` +
        `${summary.failingChecks} failing, ${summary.warningChecks} warning.`,
    );
  }

  process.exit(summary.ok ? 0 : 1);
}

const invokedDirectly = process.argv[1]?.endsWith("check-entitlements-integrity.mjs");
if (invokedDirectly) {
  main().catch((error) => {
    console.error(`check-entitlements-integrity: ${error.message}`);
    process.exit(1);
  });
}
