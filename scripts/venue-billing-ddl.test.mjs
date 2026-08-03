import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import {
  CREATE_VENUE_BILLING_TABLE,
  VENUE_BILLING_INDEXES,
  VENUE_BILLING_TABLE,
  VENUE_BILLING_TRIGGERS,
  venueBillingColumnNames,
  venueBillingDdlStatements,
} from "./venue-billing-ddl.mjs";

/**
 * The drift check — E08.01, E08.02.
 *
 * The application queries `sponsor_price_agreements` through the drizzle table
 * in `src/lib/entitlements-db/schema.ts`. The database gets its columns from
 * `scripts/venue-billing-ddl.mjs`. Nothing connected the two: drizzle does not
 * verify a table exists, and a `SELECT` of a column SQLite has never heard of
 * fails at runtime, on the one code path that handles money, in front of a
 * founding venue.
 *
 * The checkpoint that introduced this table shipped with THREE hand-maintained
 * copies of it and a code comment asserting they matched. This test is what
 * that comment should have been.
 *
 * Parsing the drizzle file as text rather than importing it is deliberate:
 * `schema.ts` pulls in `server-only`, and a check that needs a runtime shim to
 * run is a check that gets skipped.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(here, "..", "src", "lib", "entitlements-db", "schema.ts");

/** The `sponsorPriceAgreements` block of schema.ts, as source text. */
function schemaBlock() {
  const source = readFileSync(schemaPath, "utf8");
  const start = source.indexOf("export const sponsorPriceAgreements = sqliteTable(");
  assert.notEqual(
    start,
    -1,
    "sponsorPriceAgreements is gone from schema.ts — the ledger table has no drizzle definition",
  );
  const end = source.indexOf("\nexport type SponsorPriceAgreement", start);
  assert.notEqual(end, -1, "could not find the end of the sponsorPriceAgreements block");
  return source.slice(start, end);
}

test("the drizzle table and the migration DDL declare the same columns", () => {
  const block = schemaBlock();
  // Column builders read `integer("gross_amount_cents")` / `text("note")`.
  const declared = [...block.matchAll(/\b(?:text|integer)\(\s*"([a-z0-9_]+)"/g)].map(
    (m) => m[1],
  );
  const inDdl = venueBillingColumnNames();

  assert.ok(inDdl.length >= 18, `the DDL parser found only ${inDdl.length} columns`);

  const missingFromDdl = declared.filter((c) => !inDdl.includes(c));
  assert.deepEqual(
    missingFromDdl,
    [],
    `schema.ts queries columns the migration never creates: ${missingFromDdl.join(", ")}. A read of these fails at runtime on the money path.`,
  );

  const missingFromSchema = inDdl.filter((c) => !declared.includes(c));
  assert.deepEqual(
    missingFromSchema,
    [],
    `the migration creates columns schema.ts does not declare: ${missingFromSchema.join(", ")}. Either the application cannot read them or they are dead weight in a money table.`,
  );
});

test("the drizzle table name matches the table the migration creates", () => {
  assert.match(schemaBlock(), new RegExp(`sqliteTable\\(\\s*\\n?\\s*"${VENUE_BILLING_TABLE}"`));
});

test("the money columns keep the shape D-021 requires", () => {
  const ddl = CREATE_VENUE_BILLING_TABLE;
  // Gross is what the venue pays and it is never optional.
  assert.match(ddl, /gross_amount_cents integer NOT NULL/);
  assert.match(ddl, /amount_received_cents integer NOT NULL/);
  // Null means "not determined", so the derived columns must be nullable. A
  // NOT NULL here would force a zero, and zero is a claim about VAT treatment
  // that nobody is entitled to make yet (R-014, R-018, R-022).
  assert.match(ddl, /vat_rate_basis_points integer(?!\s+NOT NULL)/);
  assert.match(ddl, /net_amount_cents integer(?!\s+NOT NULL)/);
  assert.match(ddl, /vat_amount_cents integer(?!\s+NOT NULL)/);
  assert.match(ddl, /vat_basis text NOT NULL DEFAULT 'inclusive'/);
});

test("the unique term index is present, because the writer's check is a race", () => {
  const unique = VENUE_BILLING_INDEXES.find((i) => /UNIQUE/.test(i.ddl));
  assert.ok(unique, "no UNIQUE index on (sponsor_id, effective_from)");
  assert.match(unique.ddl, /\(sponsor_id, effective_from\)/);
});

test("both append-only triggers are declared and abort rather than warn", () => {
  assert.equal(VENUE_BILLING_TRIGGERS.length, 2);
  const kinds = VENUE_BILLING_TRIGGERS.map((t) => t.ddl.match(/BEFORE (UPDATE|DELETE)/)?.[1]);
  assert.deepEqual(kinds.sort(), ["DELETE", "UPDATE"]);
  for (const trigger of VENUE_BILLING_TRIGGERS) {
    assert.match(trigger.ddl, /RAISE\(ABORT/);
  }
});

test("every DDL statement is one statement, so no runner has to split it", () => {
  // The migration runner splitting trap that has cost this workspace two cycles
  // applies to multi-statement .sql files. This module hands the client one
  // statement at a time; this test keeps it that way.
  for (const statement of venueBillingDdlStatements()) {
    const withoutTriggerBody = statement.replace(/BEGIN[\s\S]*END/, "BEGIN_END");
    assert.ok(
      !withoutTriggerBody.includes(";"),
      `a DDL statement contains a semicolon outside a trigger body, so a naive splitter would run only part of it:\n${statement}`,
    );
  }
});
