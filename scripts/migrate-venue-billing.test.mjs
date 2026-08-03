import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { createClient } from "@libsql/client";

const projectRoot = path.resolve(import.meta.dirname, "..");
const migration = path.join(projectRoot, "scripts", "migrate-venue-billing.mjs");

function fileUrl(filePath) {
  return `file:${filePath.replaceAll("\\", "/")}`;
}

/**
 * A libsql connection caches column metadata, so every assertion reads through
 * a connection opened after the migration ran. The trap is documented in full
 * in migrate-venue-edition-terms.test.mjs.
 */
async function withFreshClient(databaseUrl, fn) {
  const client = createClient({ url: databaseUrl });
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}

async function cleanup(temp) {
  try {
    await rm(temp, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  } catch {
    /* the OS reclaims its own temp directory */
  }
}

function runMigrationRaw(databaseUrl, extraArgs = []) {
  return spawnSync(process.execPath, [migration, ...extraArgs], {
    cwd: projectRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      TURSO_STUDIO_DATABASE_URL: "",
      TURSO_STUDIO_AUTH_TOKEN: "",
      ENTITLEMENTS_DATABASE_URL: databaseUrl,
      ENTITLEMENTS_AUTH_TOKEN: "",
      TURSO_ENTITLEMENTS_DATABASE_URL: databaseUrl,
      TURSO_ENTITLEMENTS_AUTH_TOKEN: "",
    },
  });
}

function runMigration(databaseUrl) {
  const result = runMigrationRaw(databaseUrl);
  assert.equal(
    result.status,
    0,
    `migration failed\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
  );
  assert.match(result.stdout, /VERIFIED/);
  return result;
}

/** The pre-migration shape: sponsors exists, the ledger table does not. */
async function seedPreMigrationSchema(databaseUrl) {
  await withFreshClient(databaseUrl, (client) =>
    client.batch([
      `CREATE TABLE sponsors (
        id text PRIMARY KEY,
        slug text NOT NULL UNIQUE,
        name text NOT NULL,
        contact_email text NOT NULL,
        venue_plan text NOT NULL DEFAULT 'none',
        annual_amount_cents integer,
        founding_locked integer,
        term_starts_at integer,
        term_ends_at integer,
        paid_at integer
      )`,
      `INSERT INTO sponsors (id, slug, name, contact_email, venue_plan)
       VALUES ('sp_a', 'lambs-hill', 'Lambs Hill', 'a@example.invalid', 'founding')`,
      `INSERT INTO sponsors (id, slug, name, contact_email, venue_plan)
       VALUES ('sp_b', 'other-house', 'Other House', 'b@example.invalid', 'paid')`,
    ]),
  );
}

async function withMigratedDb(prefix, fn) {
  const temp = await mkdtemp(path.join(os.tmpdir(), prefix));
  const databaseUrl = fileUrl(path.join(temp, "entitlements.db"));
  try {
    await seedPreMigrationSchema(databaseUrl);
    return await fn(databaseUrl);
  } finally {
    await cleanup(temp);
  }
}

const AGREEMENT_COLUMNS = [
  "id",
  "sponsor_id",
  "venue_plan",
  "gross_amount_cents",
  "amount_received_cents",
  "vat_basis",
  "vat_rate_basis_points",
  "net_amount_cents",
  "vat_amount_cents",
  "founding_locked",
  "price_basis",
  "effective_from",
  "effective_to",
  "paid_at",
  "recorded_by",
  "recorded_via",
  "note",
  "created_at",
];

test("the migration creates the ledger table, its indexes and its triggers, and is idempotent", async () => {
  await withMigratedDb("signal-venue-billing-", async (databaseUrl) => {
    runMigration(databaseUrl);
    const second = runMigration(databaseUrl);
    assert.match(second.stdout, /skip \(exists\): table sponsor_price_agreements/);
    assert.match(second.stdout, /skip \(exists\): index sponsor_price_agreements_term_idx/);
    assert.match(second.stdout, /skip \(exists\): trigger sponsor_price_agreements_no_update/);

    await withFreshClient(databaseUrl, async (client) => {
      const cols = (await client.execute("PRAGMA table_info(sponsor_price_agreements)")).rows.map(
        (r) => String(r.name),
      );
      for (const col of AGREEMENT_COLUMNS) {
        assert.equal(cols.includes(col), true, `sponsor_price_agreements.${col} missing`);
      }

      for (const name of [
        "sponsor_price_agreements_sponsor_idx",
        "sponsor_price_agreements_paid_idx",
        "sponsor_price_agreements_term_idx",
      ]) {
        const idx = await client.execute({
          sql: "SELECT name FROM sqlite_master WHERE type='index' AND name=?",
          args: [name],
        });
        assert.equal(idx.rows.length, 1, `${name} missing`);
      }
      for (const name of [
        "sponsor_price_agreements_no_update",
        "sponsor_price_agreements_no_delete",
      ]) {
        const trg = await client.execute({
          sql: "SELECT name FROM sqlite_master WHERE type='trigger' AND name=?",
          args: [name],
        });
        assert.equal(trg.rows.length, 1, `${name} missing`);
      }
    });
  });
});

test("a recorded term cannot be edited or deleted", async () => {
  await withMigratedDb("signal-venue-billing-append-", async (databaseUrl) => {
    runMigration(databaseUrl);

    await withFreshClient(databaseUrl, async (client) => {
      await client.execute(
        `INSERT INTO sponsor_price_agreements
         (id, sponsor_id, venue_plan, gross_amount_cents, amount_received_cents,
          price_basis, effective_from, effective_to, paid_at, recorded_by, recorded_via)
         VALUES ('pa_1', 'sp_a', 'founding', 100000, 100000, 'D-009 · D-021', 1000, 2000, 1000, 'op', 'test')`,
      );

      await assert.rejects(
        client.execute("UPDATE sponsor_price_agreements SET gross_amount_cents = 150000 WHERE id = 'pa_1'"),
        /append-only/,
        "rewriting a historical price must be refused by the database",
      );
      await assert.rejects(
        client.execute("DELETE FROM sponsor_price_agreements WHERE id = 'pa_1'"),
        /append-only/,
      );

      const row = await client.execute("SELECT gross_amount_cents FROM sponsor_price_agreements WHERE id = 'pa_1'");
      assert.equal(Number(row.rows[0].gross_amount_cents), 100_000, "the EUR 1,000 term survived unchanged");
    });
  });
});

test("the same term cannot be recorded twice", async () => {
  await withMigratedDb("signal-venue-billing-dupe-", async (databaseUrl) => {
    runMigration(databaseUrl);

    await withFreshClient(databaseUrl, async (client) => {
      const insert = (id) =>
        client.execute({
          sql: `INSERT INTO sponsor_price_agreements
                (id, sponsor_id, venue_plan, gross_amount_cents, amount_received_cents,
                 price_basis, effective_from, effective_to, paid_at, recorded_by, recorded_via)
                VALUES (?, 'sp_b', 'paid', 150000, 150000, 'D-009 · D-021', 5000, 6000, 5000, 'op', 'test')`,
          args: [id],
        });
      await insert("pa_dup_1");
      await assert.rejects(insert("pa_dup_2"), /UNIQUE constraint failed/);
    });
  });
});

test("the append-only probe leaves nothing behind", async () => {
  await withMigratedDb("signal-venue-billing-probe-", async (databaseUrl) => {
    runMigration(databaseUrl);

    await withFreshClient(databaseUrl, async (client) => {
      const agreements = await client.execute("SELECT COUNT(*) AS n FROM sponsor_price_agreements");
      assert.equal(Number(agreements.rows[0].n), 0, "the migration probe row must be rolled back");
      const probeSponsors = await client.execute(
        "SELECT COUNT(*) AS n FROM sponsors WHERE id LIKE 'sp-probe-%'",
      );
      assert.equal(Number(probeSponsors.rows[0].n), 0, "the migration probe sponsor must be rolled back");
    });
  });
});

test("a dry run applies nothing", async () => {
  await withMigratedDb("signal-venue-billing-dry-", async (databaseUrl) => {
    const result = runMigrationRaw(databaseUrl, ["--dry-run"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /DRY RUN/);
    assert.doesNotMatch(result.stdout, /VERIFIED/);

    await withFreshClient(databaseUrl, async (client) => {
      const table = await client.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='sponsor_price_agreements'",
      );
      assert.equal(table.rows.length, 0);
    });
  });
});

test("the migration fails closed when sponsors is absent", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "signal-venue-billing-empty-"));
  const databaseUrl = fileUrl(path.join(temp, "entitlements.db"));
  try {
    await withFreshClient(databaseUrl, (client) =>
      client.execute("CREATE TABLE unrelated (id text PRIMARY KEY)"),
    );
    const result = runMigrationRaw(databaseUrl);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /ABORT — table 'sponsors' is missing/);
  } finally {
    await cleanup(temp);
  }
});
