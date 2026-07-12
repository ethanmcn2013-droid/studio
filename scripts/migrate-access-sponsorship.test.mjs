import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { createClient } from "@libsql/client";

const projectRoot = path.resolve(import.meta.dirname, "..");
const migration = path.join(projectRoot, "scripts", "migrate-access.mjs");

function fileUrl(filePath) {
  return `file:${filePath.replaceAll("\\", "/")}`;
}

function runMigration(databaseUrl) {
  const result = spawnSync(process.execPath, [migration], {
    cwd: projectRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      TURSO_STUDIO_DATABASE_URL: "",
      TURSO_STUDIO_AUTH_TOKEN: "",
      TURSO_ENTITLEMENTS_DATABASE_URL: databaseUrl,
      TURSO_ENTITLEMENTS_AUTH_TOKEN: "",
    },
  });
  assert.equal(
    result.status,
    0,
    `migration failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
  assert.match(result.stdout, /VERIFIED/);
}

function runMigrationRaw(databaseUrl) {
  return spawnSync(process.execPath, [migration], {
    cwd: projectRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      TURSO_STUDIO_DATABASE_URL: "",
      TURSO_STUDIO_AUTH_TOKEN: "",
      TURSO_ENTITLEMENTS_DATABASE_URL: databaseUrl,
      TURSO_ENTITLEMENTS_AUTH_TOKEN: "",
    },
  });
}

test("sponsorship migration is idempotent and enforces the consent boundary", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "signal-sponsor-migration-"));
  const databaseUrl = fileUrl(path.join(temp, "entitlements.db"));
  const client = createClient({ url: databaseUrl });

  try {
    // Minimal pre-access-system shape. The migration owns all additive fields.
    await client.batch([
      `CREATE TABLE sponsors (
        id text PRIMARY KEY,
        venue_plan text NOT NULL DEFAULT 'none'
      )`,
      `CREATE TABLE entitlements (
        id text PRIMARY KEY,
        user_clerk_id text NOT NULL,
        source text NOT NULL,
        source_ref text,
        stripe_subscription_id text
      )`,
      "CREATE TABLE license_codes (id text PRIMARY KEY)",
      "INSERT INTO sponsors (id) VALUES ('sponsor_1')",
    ]);

    runMigration(databaseUrl);
    runMigration(databaseUrl);

    const objects = await client.execute(
      `SELECT type, name FROM sqlite_master
       WHERE name LIKE 'sponsor_activations%'
          OR name LIKE 'sponsor_consent_grants%'
       ORDER BY type, name`,
    );
    const names = new Set(objects.rows.map((row) => String(row.name)));
    for (const name of [
      "sponsor_activations",
      "sponsor_activations_sponsor_state_idx",
      "sponsor_activations_owner_state_idx",
      "sponsor_activations_workspace_idx",
      "sponsor_activations_entitlement_idx",
      "sponsor_activations_sponsor_reference_idx",
      "sponsor_consent_grants",
      "sponsor_consent_grants_activation_idx",
      "sponsor_consent_grants_owner_idx",
      "sponsor_consent_grants_revoked_idx",
      "sponsor_consent_grants_active_field_idx",
    ]) {
      assert.equal(names.has(name), true, `missing ${name}`);
    }

    await client.execute({
      sql: `INSERT INTO sponsor_activations (
        id, sponsor_id, entitlement_source, owner_subject_id, state
      ) VALUES (?, ?, ?, ?, ?)`,
      args: [
        "activation_1",
        "sponsor_1",
        "venue_edition",
        "subject_owner_1",
        "active",
      ],
    });
    await client.execute({
      sql: `INSERT INTO sponsor_consent_grants (
        id, activation_id, field_key, receipt_version, receipt_hash,
        receipt_at, granted_by_owner_subject_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        "grant_1",
        "activation_1",
        "workspace.label",
        "receipt-v1",
        "a".repeat(64),
        1_800_000_000_000,
        "subject_owner_1",
      ],
    });

    await assert.rejects(
      client.execute({
        sql: `INSERT INTO sponsor_consent_grants (
          id, activation_id, field_key, receipt_version, receipt_hash,
          receipt_at, granted_by_owner_subject_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          "grant_duplicate",
          "activation_1",
          "workspace.label",
          "receipt-v1",
          "b".repeat(64),
          1_800_000_000_001,
          "subject_owner_1",
        ],
      }),
      /UNIQUE constraint failed/,
    );

    await assert.rejects(
      client.execute({
        sql: `INSERT INTO sponsor_consent_grants (
          id, activation_id, field_key, receipt_version, receipt_hash,
          receipt_at, granted_by_owner_subject_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          "grant_forbidden",
          "activation_1",
          "tasks.items",
          "receipt-v1",
          "c".repeat(64),
          1_800_000_000_002,
          "subject_owner_1",
        ],
      }),
      /CHECK constraint failed/,
    );
  } finally {
    await client.close();
    await rm(temp, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 100,
    });
  }
});

test("migration fails closed and preserves duplicate entitlement rows", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "signal-access-duplicates-"));
  const databaseUrl = fileUrl(path.join(temp, "entitlements.db"));
  const client = createClient({ url: databaseUrl });

  try {
    await client.batch([
      `CREATE TABLE sponsors (
        id text PRIMARY KEY,
        venue_plan text NOT NULL DEFAULT 'none'
      )`,
      `CREATE TABLE entitlements (
        id text PRIMARY KEY,
        user_clerk_id text NOT NULL,
        source text NOT NULL,
        source_ref text,
        stripe_subscription_id text
      )`,
      "CREATE TABLE license_codes (id text PRIMARY KEY)",
      "INSERT INTO sponsors (id) VALUES ('sponsor_1')",
      `INSERT INTO entitlements (id, user_clerk_id, source, source_ref)
       VALUES ('ent_old', 'user_1', 'event_pass', 'event_1')`,
      `INSERT INTO entitlements (id, user_clerk_id, source, source_ref)
       VALUES ('ent_new', 'user_1', 'event_pass', 'event_1')`,
    ]);

    const result = runMigrationRaw(databaseUrl);
    assert.notEqual(result.status, 0);
    assert.match(`${result.stdout}\n${result.stderr}`, /manual reconciliation required/);

    const rows = await client.execute(
      "SELECT id FROM entitlements ORDER BY id",
    );
    assert.deepEqual(
      rows.rows.map((row) => String(row.id)),
      ["ent_new", "ent_old"],
    );

    const index = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='index' AND name='entitlements_dedup_ref'",
    );
    assert.equal(index.rows.length, 0);
  } finally {
    await client.close();
    await rm(temp, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 100,
    });
  }
});
