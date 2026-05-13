#!/usr/bin/env node
/**
 * One-shot data migration from Studio's local DB to the shared
 * signal-entitlements DB. Run once during E-2; idempotent — re-runs
 * skip rows that already exist.
 *
 *   node scripts/migrate-entitlements-to-shared.mjs
 *
 * Reads:  TURSO_STUDIO_DATABASE_URL + TURSO_STUDIO_AUTH_TOKEN
 * Writes: TURSO_ENTITLEMENTS_DATABASE_URL + TURSO_ENTITLEMENTS_AUTH_TOKEN
 *
 * Tables migrated: sponsors, license_codes, entitlements, redemptions.
 */
import { createClient } from "@libsql/client";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(here, "../.env.local") });
config({ path: resolve(here, "../.env") });

const src = createClient({
  url: process.env.TURSO_STUDIO_DATABASE_URL,
  authToken: process.env.TURSO_STUDIO_AUTH_TOKEN,
});

const dest = createClient({
  url: process.env.TURSO_ENTITLEMENTS_DATABASE_URL,
  authToken: process.env.TURSO_ENTITLEMENTS_AUTH_TOKEN,
});

async function migrate(table, columns) {
  const { rows } = await src.execute(`SELECT * FROM ${table}`);
  if (rows.length === 0) {
    console.log(`${table}: 0 rows, skipping`);
    return;
  }
  const placeholders = columns.map(() => "?").join(", ");
  const colList = columns.join(", ");
  let copied = 0;
  let skipped = 0;
  for (const row of rows) {
    const values = columns.map((c) => row[c] ?? null);
    try {
      await dest.execute({
        sql: `INSERT INTO ${table} (${colList}) VALUES (${placeholders})`,
        args: values,
      });
      copied++;
    } catch (e) {
      if (String(e).includes("UNIQUE constraint")) {
        skipped++;
      } else {
        throw e;
      }
    }
  }
  console.log(`${table}: ${copied} copied, ${skipped} skipped (already present)`);
}

const SCHEMAS = {
  sponsors: [
    "id",
    "slug",
    "name",
    "contact_email",
    "brand_meta",
    "created_at",
    "updated_at",
  ],
  license_codes: [
    "id",
    "sponsor_id",
    "code",
    "status",
    "source_type",
    "tier",
    "duration_days",
    "redeemed_by_user_id",
    "redeemed_at",
    "created_at",
    "updated_at",
  ],
  entitlements: [
    "id",
    "user_clerk_id",
    "tier",
    "source",
    "source_ref",
    "granted_at",
    "expires_at",
    "status",
    "metadata",
    "created_at",
    "updated_at",
  ],
  redemptions: [
    "id",
    "code_id",
    "user_clerk_id",
    "entitlement_id",
    "ip_hash",
    "user_agent",
    "redeemed_at",
  ],
};

console.log("Migrating studio → signal-entitlements");
console.log("src:", process.env.TURSO_STUDIO_DATABASE_URL);
console.log("dest:", process.env.TURSO_ENTITLEMENTS_DATABASE_URL);
console.log();

await migrate("sponsors", SCHEMAS.sponsors);
await migrate("license_codes", SCHEMAS.license_codes);
await migrate("entitlements", SCHEMAS.entitlements);
await migrate("redemptions", SCHEMAS.redemptions);

console.log();
console.log("Done.");
process.exit(0);
