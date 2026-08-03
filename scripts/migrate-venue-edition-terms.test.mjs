import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { createClient } from "@libsql/client";

const projectRoot = path.resolve(import.meta.dirname, "..");
const migration = path.join(projectRoot, "scripts", "migrate-venue-edition-terms.mjs");

function fileUrl(filePath) {
  return `file:${filePath.replaceAll("\\", "/")}`;
}

/**
 * TRAP, paid for once here so nobody pays for it again.
 *
 * A libsql connection caches column metadata. A client opened BEFORE an
 * `ALTER TABLE ... ADD COLUMN` keeps returning the old column list, and
 * `SELECT *` hands back the new column under the literal key `"undefined"`.
 * `PRAGMA table_info` bypasses the cache, so a test that only PRAGMAs looks
 * green while a test that selects looks broken — and neither is telling you
 * about the migration.
 *
 * Every assertion below therefore reads through a connection opened after the
 * migration ran. Seeding uses its own connection and closes it first.
 */
async function withFreshClient(databaseUrl, fn) {
  const client = createClient({ url: databaseUrl });
  try {
    return await fn(client);
  } finally {
    await client.close();
  }
}

/** Best-effort teardown: on Windows libsql can hold the file briefly after
 *  close, and an EBUSY deleting a scratch directory says nothing about the
 *  migration under test. */
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

/** The pre-migration shape, with the columns this migration owns absent. */
async function seedPreMigrationSchema(databaseUrl) {
  await withFreshClient(databaseUrl, (client) =>
    client.batch([
      `CREATE TABLE sponsors (
        id text PRIMARY KEY,
        slug text NOT NULL UNIQUE,
        name text NOT NULL,
        contact_email text NOT NULL,
        venue_plan text NOT NULL DEFAULT 'none',
        code_allotment integer,
        codes_issued integer NOT NULL DEFAULT 0
      )`,
      `CREATE TABLE entitlements (
        id text PRIMARY KEY,
        user_clerk_id text NOT NULL,
        tier text NOT NULL,
        source text NOT NULL,
        source_ref text,
        expires_at integer,
        status text NOT NULL DEFAULT 'active'
      )`,
      `INSERT INTO sponsors (id, slug, name, contact_email, venue_plan, code_allotment, codes_issued)
       VALUES ('sp_capped', 'capped-house', 'Capped House', 'a@example.test', 'paid', 40, 12)`,
      `INSERT INTO sponsors (id, slug, name, contact_email, venue_plan, code_allotment, codes_issued)
       VALUES ('sp_nullcap', 'null-cap-barn', 'Null Cap Barn', 'b@example.test', 'pilot', NULL, 0)`,
      `INSERT INTO entitlements (id, user_clerk_id, tier, source, expires_at)
       VALUES ('ent_1', 'user_1', 'wedding', 'venue_edition', 1900000000000)`,
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

test("the migration adds every column and index, and is idempotent", async () => {
  await withMigratedDb("signal-venue-terms-", async (databaseUrl) => {
    runMigration(databaseUrl);
    // Twice: a re-run must be a no-op, not a duplicate-column error.
    const second = runMigration(databaseUrl);
    assert.match(second.stdout, /skip \(exists\): sponsors\.allotment_mode/);
    assert.match(second.stdout, /skip \(exists\): entitlements\.wedding_date/);
    assert.match(second.stdout, /skip \(exists\): index entitlements_wedding_date_idx/);

    await withFreshClient(databaseUrl, async (client) => {
      const entCols = new Set(
        (await client.execute("PRAGMA table_info(entitlements)")).rows.map((r) =>
          String(r.name),
        ),
      );
      assert.equal(entCols.has("wedding_date"), true, "entitlements.wedding_date missing");

      const sponsorCols = new Set(
        (await client.execute("PRAGMA table_info(sponsors)")).rows.map((r) =>
          String(r.name),
        ),
      );
      for (const col of ["allotment_mode", "annual_wedding_count", "fair_use_ceiling"]) {
        assert.equal(sponsorCols.has(col), true, `sponsors.${col} missing`);
      }

      const idx = await client.execute(
        "SELECT name FROM sqlite_master WHERE type='index' AND name='entitlements_wedding_date_idx'",
      );
      assert.equal(idx.rows.length, 1, "wedding-date index missing");
    });
  });
});

test("no existing venue silently becomes unlimited", async () => {
  await withMigratedDb("signal-venue-terms-safety-", async (databaseUrl) => {
    runMigration(databaseUrl);

    await withFreshClient(databaseUrl, async (client) => {
      const modes = await client.execute(
        "SELECT id, allotment_mode, code_allotment FROM sponsors ORDER BY id",
      );
      assert.deepEqual(
        modes.rows.map((r) => [String(r.id), String(r.allotment_mode)]),
        [
          ["sp_capped", "limited"],
          ["sp_nullcap", "limited"],
        ],
      );

      // The null-cap sponsor is the dangerous one: under a "null means
      // unlimited" design it would have flipped to unlimited on migration.
      // It must stay capped-null, which the mint refuses exactly as before.
      const nullCap = modes.rows.find((r) => String(r.id) === "sp_nullcap");
      assert.equal(nullCap.code_allotment, null);
      assert.equal(String(nullCap.allotment_mode), "limited");

      const unlimited = await client.execute(
        "SELECT COUNT(*) AS n FROM sponsors WHERE allotment_mode = 'unlimited'",
      );
      assert.equal(Number(unlimited.rows[0].n), 0);
    });
  });
});

test("existing data survives untouched", async () => {
  await withMigratedDb("signal-venue-terms-data-", async (databaseUrl) => {
    runMigration(databaseUrl);

    await withFreshClient(databaseUrl, async (client) => {
      const ent = await client.execute("SELECT * FROM entitlements WHERE id = 'ent_1'");
      assert.equal(Number(ent.rows[0].expires_at), 1_900_000_000_000);
      assert.equal(ent.rows[0].wedding_date, null);

      const sponsor = await client.execute("SELECT * FROM sponsors WHERE id = 'sp_capped'");
      assert.equal(Number(sponsor.rows[0].code_allotment), 40);
      assert.equal(Number(sponsor.rows[0].codes_issued), 12);
      assert.equal(sponsor.rows[0].annual_wedding_count, null);
      assert.equal(sponsor.rows[0].fair_use_ceiling, null);
    });
  });
});

test("a dry run applies nothing", async () => {
  await withMigratedDb("signal-venue-terms-dry-", async (databaseUrl) => {
    const result = runMigrationRaw(databaseUrl, ["--dry-run"]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /DRY RUN/);
    assert.doesNotMatch(result.stdout, /VERIFIED/);

    await withFreshClient(databaseUrl, async (client) => {
      const sponsorCols = new Set(
        (await client.execute("PRAGMA table_info(sponsors)")).rows.map((r) =>
          String(r.name),
        ),
      );
      assert.equal(sponsorCols.has("allotment_mode"), false);
    });
  });
});

test("the migration fails closed when the base tables are absent", async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "signal-venue-terms-empty-"));
  const databaseUrl = fileUrl(path.join(temp, "entitlements.db"));
  try {
    await withFreshClient(databaseUrl, (client) =>
      client.execute("CREATE TABLE unrelated (id text PRIMARY KEY)"),
    );
    const result = runMigrationRaw(databaseUrl);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /ABORT — table 'entitlements' is missing/);
  } finally {
    await cleanup(temp);
  }
});
