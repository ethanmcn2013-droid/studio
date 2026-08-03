/**
 * Proof of the audit-ledger defect and of its fix (E08.08).
 *
 * The first test is the important one. It builds a database from the
 * CHECKED-IN baseline — `drizzle-entitlements/0000_init.sql`, the file every
 * new entitlements database is created from — and shows that an audit row
 * can be silently updated and deleted on it. That is the live defect, and it
 * is asserted rather than described so nobody has to take it on trust.
 *
 * The rest prove the fix: the triggers install, they are idempotent, they
 * actually block the operations, and appends still work afterwards.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { createClient } from "@libsql/client";
import {
  LEDGER_TABLE,
  TRIGGERS,
  applyTriggers,
  presentTriggers,
  proveAppendOnly,
} from "./apply-audit-ledger-triggers.mjs";

const projectRoot = path.resolve(import.meta.dirname, "..");
const baselinePath = path.join(projectRoot, "drizzle-entitlements", "0000_init.sql");

function fileUrl(filePath) {
  return `file:${filePath.replaceAll("\\", "/")}`;
}

/**
 * Split the baseline the way the migration runner does.
 *
 * `--> statement-breakpoint`, NOT semicolons. Splitting a migration on
 * semicolons truncates any statement containing a trigger body, which is
 * exactly the class of statement this file is about.
 */
function baselineStatements() {
  const body = fs.readFileSync(baselinePath, "utf8");
  return body
    .split("--> statement-breakpoint")
    .map((segment) =>
      segment
        .split("\n")
        .filter((line) => !line.trim().startsWith("--"))
        .join("\n")
        .trim(),
    )
    .filter(Boolean);
}

async function freshBaselineDb(dir, name) {
  const dbPath = path.join(dir, name);
  const client = createClient({ url: fileUrl(dbPath) });
  for (const sql of baselineStatements()) {
    await client.execute(sql);
  }
  await client.execute({
    sql:
      `INSERT INTO ${LEDGER_TABLE} (id, action, reason, prev_hash, row_hash, created_at) ` +
      `VALUES (?, ?, ?, ?, ?, ?)`,
    args: ["ev-1", "sponsor_created", "seed line", "GENESIS", "hash-1", 1750000000000],
  });
  return { client, dbPath };
}

let workDir;

before(() => {
  workDir = fs.mkdtempSync(path.join(os.tmpdir(), "signal-ledger-triggers-"));
});

after(() => {
  try {
    fs.rmSync(workDir, { recursive: true, force: true });
  } catch (error) {
    if (error?.code !== "EPERM") throw error;
  }
});

describe("entitlement audit ledger, append-only enforcement", () => {
  it("the checked-in baseline declares no triggers at all", () => {
    const body = fs.readFileSync(baselinePath, "utf8");
    const declared = (body.match(/CREATE TRIGGER/gi) ?? []).length;
    assert.equal(
      declared,
      0,
      "if this now fails, the baseline has grown triggers and this script " +
        "may be redundant. Check before deleting it.",
    );
  });

  it("DEFECT: a database built from the baseline lets an audit line be edited and deleted", async () => {
    const { client } = await freshBaselineDb(workDir, "defect.db");
    try {
      assert.equal((await presentTriggers(client)).size, 0);

      await client.execute(
        `UPDATE ${LEDGER_TABLE} SET reason = 'quietly rewritten' WHERE id = 'ev-1'`,
      );
      const edited = await client.execute(
        `SELECT reason FROM ${LEDGER_TABLE} WHERE id = 'ev-1'`,
      );
      assert.equal(
        edited.rows[0].reason,
        "quietly rewritten",
        "the audit line was editable, which is the defect under test",
      );

      await client.execute(`DELETE FROM ${LEDGER_TABLE} WHERE id = 'ev-1'`);
      const remaining = await client.execute(`SELECT COUNT(*) AS n FROM ${LEDGER_TABLE}`);
      assert.equal(Number(remaining.rows[0].n), 0, "the audit line was deletable");
    } finally {
      client.close();
    }
  });

  it("installs both triggers on a baseline database", async () => {
    const { client } = await freshBaselineDb(workDir, "apply.db");
    try {
      const result = await applyTriggers(client);
      assert.deepEqual(result.installed.sort(), TRIGGERS.map((t) => t.name).sort());
      assert.equal(result.complete, true);
      assert.equal((await presentTriggers(client)).size, TRIGGERS.length);
    } finally {
      client.close();
    }
  });

  it("blocks UPDATE and DELETE once installed, with a message that names the reason", async () => {
    const { client } = await freshBaselineDb(workDir, "blocked.db");
    try {
      await applyTriggers(client);
      const proof = await proveAppendOnly(client);
      assert.equal(proof.update.blocked, true, proof.update.message);
      assert.equal(proof.delete.blocked, true, proof.delete.message);

      const survived = await client.execute(
        `SELECT reason FROM ${LEDGER_TABLE} WHERE id = 'ev-1'`,
      );
      assert.equal(survived.rows[0].reason, "seed line");
    } finally {
      client.close();
    }
  });

  it("still allows appends, so the ledger keeps working", async () => {
    const { client } = await freshBaselineDb(workDir, "append.db");
    try {
      await applyTriggers(client);
      await client.execute({
        sql:
          `INSERT INTO ${LEDGER_TABLE} (id, action, reason, prev_hash, row_hash, created_at) ` +
          `VALUES (?, ?, ?, ?, ?, ?)`,
        args: ["ev-2", "sponsor_paid", "second line", "hash-1", "hash-2", 1750000001000],
      });
      const count = await client.execute(`SELECT COUNT(*) AS n FROM ${LEDGER_TABLE}`);
      assert.equal(Number(count.rows[0].n), 2);
    } finally {
      client.close();
    }
  });

  it("is idempotent, so a re-run is safe", async () => {
    const { client } = await freshBaselineDb(workDir, "idempotent.db");
    try {
      await applyTriggers(client);
      const second = await applyTriggers(client);
      assert.deepEqual(second.installed, []);
      assert.deepEqual(second.alreadyPresent.sort(), TRIGGERS.map((t) => t.name).sort());
      assert.equal(second.complete, true);
    } finally {
      client.close();
    }
  });

  it("--dry-run changes nothing", async () => {
    const { client } = await freshBaselineDb(workDir, "dryrun.db");
    try {
      const result = await applyTriggers(client, { dryRun: true });
      assert.equal(result.wouldInstall.length, TRIGGERS.length);
      assert.equal((await presentTriggers(client)).size, 0);
    } finally {
      client.close();
    }
  });

  it("refuses to run against a database with no ledger table", async () => {
    const dbPath = path.join(workDir, "empty.db");
    const client = createClient({ url: fileUrl(dbPath) });
    try {
      await client.execute("CREATE TABLE unrelated (id text primary key)");
      await assert.rejects(() => applyTriggers(client), /does not exist/);
    } finally {
      client.close();
    }
  });

  it("audit.ts does not claim an enforcement the schema does not deliver", () => {
    // E08.08. The header of `src/lib/entitlements-db/audit.ts` used to say the
    // physical append-only guarantee "is enforced by SQLite triggers from
    // migrate-access.mjs". Every database built since the 2026-07-31 reset
    // makes that false, and a comment stating a control that is not there is
    // how a control stops being applied without anyone noticing. This test
    // exists because the corrected wording is a claim about a real control and
    // deserves to be held, not because comments normally need tests.
    const source = fs.readFileSync(
      path.join(import.meta.dirname, "..", "src", "lib", "entitlements-db", "audit.ts"),
      "utf8",
    );
    assert.doesNotMatch(
      source,
      /is enforced by SQLite triggers from migrate-access\.mjs/,
      "audit.ts must not re-state the retired claim that the ledger is " +
        "physically append-only on every database",
    );
    assert.match(
      source,
      /nothing PREVENTS one unless/,
      "audit.ts must say plainly that the hash chain detects and the triggers prevent",
    );
    for (const trigger of TRIGGERS) {
      assert.ok(
        source.includes(trigger.name),
        `audit.ts must name ${trigger.name}, so a reader knows what to install`,
      );
    }
  });
});
