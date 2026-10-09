import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createClient } from "@libsql/client";
import { applyVenueFulfilmentMigration } from "./migrate-venue-fulfilment.mjs";
import { applyUsageDeliveryMigration } from "./migrate-usage-delivery.mjs";
import { applyUsageWorkspaceErasureMigration } from "./migrate-usage-workspace-erasure.mjs";
import { applySponsorProgrammeMigration } from "./migrate-sponsor-programme.mjs";

async function fixture(fn) {
  const dir = mkdtempSync(join(tmpdir(), "sponsor-programme-migration-"));
  const client = createClient({ url: pathToFileURL(join(dir, "test.db")).href });
  try {
    await client.executeMultiple(readFileSync(new URL("../drizzle-entitlements/0000_init.sql", import.meta.url), "utf8"));
    await applyVenueFulfilmentMigration(client);
    await applyUsageDeliveryMigration(client);
    await applyUsageWorkspaceErasureMigration(client);
    await fn(client);
  } finally {
    client.close();
    try { rmSync(dir, { recursive: true, force: true }); }
    catch (error) { if (!["EBUSY", "EPERM"].includes(error.code)) throw error; }
  }
}

test("sponsor programme migration applies to a disposable file, proves exact keys and FKs, and is idempotent", () => fixture(async client => {
  assert.equal((await applySponsorProgrammeMigration(client)).state, "applied");
  assert.equal((await applySponsorProgrammeMigration(client)).state, "already_applied");
  const collection = (await client.execute("PRAGMA table_info(sponsor_programmes)")).rows.find(row => row.name === "feedback_collection");
  assert.equal(collection.type, "TEXT");
  assert.equal(collection.notnull, 1);
  assert.equal(collection.dflt_value, "'disabled'");
  const membersPk = (await client.execute("PRAGMA table_info(sponsor_programme_members)")).rows
    .filter(row => Number(row.pk) > 0).sort((a, b) => Number(a.pk) - Number(b.pk)).map(row => row.name);
  assert.deepEqual(membersPk, ["programme_id", "subject_id", "capability"]);
  const inviteFks = (await client.execute("PRAGMA foreign_key_list(sponsor_programme_invitations)")).rows
    .map(row => [row.from, row.table, row.to]).sort((a, b) => a[0].localeCompare(b[0]));
  assert.deepEqual(inviteFks, [["license_code_id", "license_codes", "id"], ["programme_id", "sponsor_programmes", "id"]]);
}));

test("additive SQL matches the source contract without schema drift", () => {
  const source = readFileSync(new URL("../src/lib/sponsor-programme/schema.ts", import.meta.url), "utf8");
  const match = source.match(/export const PROGRAMME_SCHEMA_SQL = `([\s\S]*?)`;/);
  assert.ok(match, "programme schema source contract exists");
  const normalize = value => value.replace(/-->(\s*)statement-breakpoint/g, "").split(";")
    .map(statement => statement.replace(/\s+/g, " ").trim()).filter(Boolean).sort();
  const sourceStatements = normalize(match[1]);
  const migrationStatements = normalize(readFileSync(new URL("../drizzle-entitlements/0004_sponsor_programme.sql", import.meta.url), "utf8"));
  assert.deepEqual(migrationStatements, sourceStatements);
});

test("refuses to adopt a pre-existing partial schema and leaves the migration unapplied", () => fixture(async client => {
  await client.execute("CREATE TABLE sponsor_programmes(id TEXT PRIMARY KEY)");
  await assert.rejects(() => applySponsorProgrammeMigration(client), /exist without a migration receipt/);
  assert.equal((await client.execute("SELECT id FROM signal_additive_migrations WHERE id='0004_sponsor_programme'")).rows.length, 0);
  assert.equal((await client.execute("SELECT name FROM sqlite_master WHERE name='sponsor_programme_members'")).rows.length, 0);
}));

test("a partial pre-existing schema is rejected without applying new objects or recording a receipt", () => fixture(async client => {
  await client.execute("CREATE TABLE sponsor_programme_coverage(wrong TEXT)");
  await assert.rejects(() => applySponsorProgrammeMigration(client), /exist without a migration receipt/);
  assert.equal((await client.execute("SELECT name FROM sqlite_master WHERE name='sponsor_programmes'")).rows.length, 0);
  assert.equal((await client.execute("SELECT id FROM signal_additive_migrations WHERE id='0004_sponsor_programme'")).rows.length, 0);
}));

test("rejects missing or structurally wrong objects after a recorded application", () => fixture(async client => {
  await applySponsorProgrammeMigration(client);
  await client.execute("DROP INDEX sponsor_programme_contribution_expiry");
  await client.execute("CREATE INDEX sponsor_programme_contribution_expiry ON sponsor_programme_contributions(unit_key)");
  await assert.rejects(() => applySponsorProgrammeMigration(client), /expiry index proof/);
  await client.execute("DROP INDEX sponsor_programme_contribution_expiry");
  await client.execute("CREATE INDEX sponsor_programme_contribution_expiry ON sponsor_programme_contributions(expires_at)");
  await client.execute("DROP TABLE sponsor_programme_coverage");
  await assert.rejects(() => applySponsorProgrammeMigration(client), /schema proof failed: sponsor_programme_coverage/);
}));
