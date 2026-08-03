/**
 * The one definition of the Venue Edition cash-ledger table — E08.01, E08.02.
 *
 * This file exists because of a defect, not because of a preference. The table
 * was defined three times: once in `scripts/migrate-venue-billing.mjs` (what
 * production gets), once in `src/lib/entitlements-db/schema.ts` (what the
 * application queries), and once inline in
 * `src/lib/entitlements-db/venue-billing.test.ts` (what the tests ran against).
 * The test's copy carried a comment claiming it was "kept identical on purpose",
 * which is a promise no reviewer can check and no CI run can enforce. Three
 * hand-maintained copies of a money table is how a column silently stops
 * existing in production while every test stays green.
 *
 * So the migration and the tests now read the same strings from here, and
 * `venue-billing-ddl.test.mjs` asserts these strings agree with the drizzle
 * schema column-for-column. Drift becomes a failing test rather than a
 * discovery.
 *
 * Plain `.mjs` with no imports so the migration script (node), the TypeScript
 * tests (tsx) and the schema-drift check can all load it.
 */

export const VENUE_BILLING_TABLE = "sponsor_price_agreements";

/**
 * Column order and types are load-bearing: `venue-billing-ddl.test.mjs` parses
 * this string and compares the column set to the drizzle table definition.
 */
export const CREATE_VENUE_BILLING_TABLE = `CREATE TABLE ${VENUE_BILLING_TABLE} (
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

export const VENUE_BILLING_INDEXES = [
  {
    name: "sponsor_price_agreements_sponsor_idx",
    ddl: `CREATE INDEX IF NOT EXISTS sponsor_price_agreements_sponsor_idx ON ${VENUE_BILLING_TABLE} (sponsor_id, effective_from)`,
  },
  {
    name: "sponsor_price_agreements_paid_idx",
    ddl: `CREATE INDEX IF NOT EXISTS sponsor_price_agreements_paid_idx ON ${VENUE_BILLING_TABLE} (paid_at)`,
  },
  {
    // The real guarantee against a double-recorded payment. A writer that
    // checks first and inserts second is a race; this is not.
    name: "sponsor_price_agreements_term_idx",
    ddl: `CREATE UNIQUE INDEX IF NOT EXISTS sponsor_price_agreements_term_idx ON ${VENUE_BILLING_TABLE} (sponsor_id, effective_from)`,
  },
];

/**
 * Append-only as a property of the database rather than a convention in the
 * writer. Same discipline `entitlement_events` already runs under.
 */
export const VENUE_BILLING_TRIGGERS = [
  {
    name: "sponsor_price_agreements_no_update",
    ddl: `CREATE TRIGGER sponsor_price_agreements_no_update
          BEFORE UPDATE ON ${VENUE_BILLING_TABLE}
          BEGIN SELECT RAISE(ABORT, 'sponsor_price_agreements is append-only: a recorded term is never edited'); END`,
  },
  {
    name: "sponsor_price_agreements_no_delete",
    ddl: `CREATE TRIGGER sponsor_price_agreements_no_delete
          BEFORE DELETE ON ${VENUE_BILLING_TABLE}
          BEGIN SELECT RAISE(ABORT, 'sponsor_price_agreements is append-only: a recorded term is never deleted'); END`,
  },
];

/** Every statement that builds the ledger, in the order it must be applied. */
export function venueBillingDdlStatements() {
  return [
    CREATE_VENUE_BILLING_TABLE,
    ...VENUE_BILLING_INDEXES.map((i) => i.ddl),
    ...VENUE_BILLING_TRIGGERS.map((t) => t.ddl),
  ];
}

/**
 * Column names parsed out of `CREATE_VENUE_BILLING_TABLE`, in declaration
 * order. Used by the drift check, so the check reads the same string the
 * migration executes rather than a list somebody kept up to date by hand.
 */
export function venueBillingColumnNames() {
  const body = CREATE_VENUE_BILLING_TABLE.slice(
    CREATE_VENUE_BILLING_TABLE.indexOf("(") + 1,
    CREATE_VENUE_BILLING_TABLE.lastIndexOf(")"),
  );
  const columns = [];
  let depth = 0;
  let current = "";
  for (const char of body) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "," && depth === 0) {
      columns.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  columns.push(current);
  return columns
    .map((line) => line.trim().split(/\s+/)[0])
    .filter((name) => name.length > 0);
}
