/**
 * A recovery drill that actually rehearses recovery (E08.09).
 *
 * WHAT IT REPLACES, AND WHY
 * -------------------------
 * `scripts/run-recovery-drill.mjs` was wired to `pnpm recovery:drill` and
 * exited zero every time. It created a two-row table called `recovery_probe`
 * that exists nowhere in this product, copied those two rows into a second
 * file through `JSON.stringify`, compared the string to itself, then wrote
 * `{"release":"v1"}` to a file and read it back. No schema of ours was
 * involved, no dump format of ours was involved, and nothing it asserted
 * could have failed. It was a green light wired to nothing, which is worse
 * than no drill: `docs/RECOVERY.md` lists "rehearse one restore" as the open
 * critical action, and a passing `recovery:drill` reads like it is closed.
 *
 * WHAT THIS ONE DOES
 * ------------------
 * The entitlements database is the commercial record — sponsors, founding
 * numbers, license codes, redemptions and the audit ledger. This drill:
 *
 *   1. Builds it from the checked-in `drizzle-entitlements/0000_init.sql`
 *      baseline plus the hand-run column migrations, the same way a real
 *      database is built.
 *   2. Installs the append-only audit triggers.
 *   3. Writes representative commercial rows, including a signed audit line.
 *   4. Takes a logical dump: schema objects and rows, in the order a restore
 *      needs them.
 *   5. Restores into a SEPARATE throwaway database.
 *   6. Verifies the restore by re-reading it: per-table row counts and
 *      order-independent content hashes, recomputed from the restored
 *      database rather than trusted from the dump.
 *   7. Verifies every index and trigger came back, then PROVES the append-only
 *      guard works on the restored copy by attempting an UPDATE and a DELETE
 *      and requiring both to be refused.
 *
 * Step 7 is the point. A restore that replays rows and drops triggers looks
 * completely correct and has silently lost an enforced invariant. That is the
 * exact defect this workspace already had: drizzle cannot express a trigger,
 * so the regenerated baseline creates the audit ledger as an ordinary table.
 *
 * The drill is self-contained. It touches only temporary files and never
 * connects to a real database, so it is safe to run anywhere, including CI.
 *
 *   node scripts/recovery-drill.mjs
 *   node scripts/recovery-drill.mjs --json
 */
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createClient } from "@libsql/client";
import { applyTriggers, TRIGGERS } from "./apply-audit-ledger-triggers.mjs";

const projectRoot = path.resolve(import.meta.dirname, "..");

/** Split on `--> statement-breakpoint`, never on semicolons. */
export function baselineStatements() {
  return fs
    .readFileSync(
      path.join(projectRoot, "drizzle-entitlements", "0000_init.sql"),
      "utf8",
    )
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

/** Columns the hand-run migration scripts add on top of the drizzle baseline. */
export const POST_BASELINE_COLUMNS = Object.freeze([
  "ALTER TABLE sponsors ADD COLUMN founding_number integer",
  "ALTER TABLE sponsors ADD COLUMN founding_number_assigned_at integer",
  "ALTER TABLE sponsors ADD COLUMN allotment_mode text NOT NULL DEFAULT 'limited'",
]);

function sha256(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

/**
 * Content hash for one table. Rows are canonicalised and SORTED before
 * hashing, so the hash describes the SET of rows. A restore into a fresh
 * database does not reproduce source rowids, so an order-sensitive hash would
 * report a false mismatch on a correct restore.
 */
export function tableHash(columns, rows) {
  return sha256(
    JSON.stringify(columns) +
      "\n" +
      rows.map((values) => JSON.stringify(values)).join("\n"),
  );
}

function encode(value) {
  if (value === null || value === undefined) return null;
  if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
    const buffer = Buffer.from(value instanceof ArrayBuffer ? value : value.buffer);
    return { $blob: buffer.toString("base64") };
  }
  if (typeof value === "bigint") return { $int: value.toString() };
  return value;
}

function decode(value) {
  if (value && typeof value === "object" && "$blob" in value) {
    return Buffer.from(value.$blob, "base64");
  }
  if (value && typeof value === "object" && "$int" in value) return BigInt(value.$int);
  return value;
}

export async function buildSource(client) {
  await client.execute("PRAGMA foreign_keys = OFF");
  for (const sql of baselineStatements()) await client.execute(sql);
  for (const sql of POST_BASELINE_COLUMNS) {
    try {
      await client.execute(sql);
    } catch (error) {
      if (!/duplicate column/i.test(String(error?.message))) throw error;
    }
  }
  await applyTriggers(client);
}

/**
 * Representative commercial rows. Deliberately not a token probe table: if
 * the drill does not exercise the tables that hold the money and the consent
 * record, it has not rehearsed anything that matters.
 */
export async function seed(client) {
  await client.execute({
    sql:
      "INSERT INTO sponsors (id, slug, name, contact_email, venue_plan, codes_issued, kind, " +
      "founding_number, founding_number_assigned_at, annual_amount_cents, founding_locked, " +
      "term_starts_at, term_ends_at, paid_at, created_at, updated_at) " +
      "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    args: [
      "sp-drill", "drill-venue", "Drill Venue", "drill@example.test", "founding", 2,
      "venue", 1, 1750000000000, 100000, 1, 1750000000000, 1781536000000,
      1750000000000, 1750000000000, 1750000000000,
    ],
  });
  for (const [id, code, status] of [
    ["lc-drill-1", "DRILL-0001", "minted"],
    ["lc-drill-2", "DRILL-0002", "redeemed"],
  ]) {
    await client.execute({
      sql:
        "INSERT INTO license_codes (id, sponsor_id, code, status, source_type, tier, " +
        "created_at, updated_at) VALUES (?,?,?,?,?,?,?,?)",
      args: [id, "sp-drill", code, status, "venue_edition", "wedding", 1, 1],
    });
  }
  await client.execute({
    sql: "INSERT INTO redemptions (id, code_id, user_clerk_id, redeemed_at) VALUES (?,?,?,?)",
    args: ["rd-drill", "lc-drill-2", "clerk-drill", 1750000000000],
  });
  // An audit line with its chain hashes, so the restore has something whose
  // integrity is checkable rather than merely present.
  const rowHash = sha256("drill:sponsor_paid:sp-drill");
  await client.execute({
    sql:
      "INSERT INTO entitlement_events (id, action, sponsor_id, reason, prev_hash, row_hash, " +
      "created_at) VALUES (?,?,?,?,?,?,?)",
    args: [
      "ev-drill", "sponsor_paid", "sp-drill", "recovery drill",
      "GENESIS", rowHash, 1750000000000,
    ],
  });
}

/** Read every schema object and every row. Ordered so a restore can replay it. */
export async function dump(client) {
  const schema = await client.execute(
    "SELECT type, name, sql FROM sqlite_schema WHERE sql IS NOT NULL " +
      "AND name NOT LIKE 'sqlite_%' ORDER BY CASE type WHEN 'table' THEN 0 " +
      "WHEN 'index' THEN 1 WHEN 'trigger' THEN 2 ELSE 3 END, name",
  );
  const objects = schema.rows.map((row) => ({
    type: String(row.type),
    name: String(row.name),
    sql: String(row.sql),
  }));
  const tables = objects.filter((o) => o.type === "table").map((o) => o.name);

  const data = [];
  const manifest = [];
  for (const table of tables) {
    const result = await client.execute(`SELECT * FROM "${table}"`);
    const columns = result.columns.slice();
    const rows = result.rows.map((row) => columns.map((_, i) => encode(row[i])));
    if (rows.length > 0) data.push({ table, columns, rows });
    manifest.push({
      name: table,
      columns,
      rows: rows.length,
      sha256: tableHash(columns, rows.map((r) => JSON.stringify(r)).sort().map(JSON.parse)),
    });
  }
  return {
    objects,
    data,
    manifest,
    ddl: {
      indexes: objects.filter((o) => o.type === "index").map((o) => o.name),
      triggers: objects.filter((o) => o.type === "trigger").map((o) => o.name),
    },
  };
}

/**
 * Replay a dump into a fresh database. Tables first, then rows, then indexes
 * and triggers LAST — an append-only trigger installed before the rows are
 * inserted would refuse its own restore.
 */
export async function restore(client, snapshot) {
  await client.execute("PRAGMA foreign_keys = OFF");
  for (const object of snapshot.objects) {
    if (object.type === "table") await client.execute(object.sql);
  }
  for (const { table, columns, rows } of snapshot.data) {
    for (const values of rows) {
      await client.execute({
        sql:
          `INSERT INTO "${table}" (${columns.map((c) => `"${c}"`).join(", ")}) ` +
          `VALUES (${columns.map(() => "?").join(", ")})`,
        args: values.map(decode),
      });
    }
  }
  for (const object of snapshot.objects) {
    if (object.type !== "table") await client.execute(object.sql);
  }
}

/** Recompute counts and hashes FROM THE RESTORED DATABASE, not from the dump. */
export async function measure(client, tableNames) {
  const out = [];
  for (const name of tableNames) {
    const result = await client.execute(`SELECT * FROM "${name}"`);
    const columns = result.columns.slice();
    const rows = result.rows.map((row) => columns.map((_, i) => encode(row[i])));
    out.push({
      name,
      columns,
      rows: rows.length,
      sha256: tableHash(columns, rows.map((r) => JSON.stringify(r)).sort().map(JSON.parse)),
    });
  }
  return out;
}

export function compare(manifest, measured) {
  const byName = new Map(measured.map((entry) => [entry.name, entry]));
  const differences = [];
  for (const expected of manifest) {
    const actual = byName.get(expected.name);
    if (!actual) {
      differences.push({ table: expected.name, reason: "missing from restored database" });
      continue;
    }
    if (actual.rows !== expected.rows) {
      differences.push({
        table: expected.name,
        reason: "row count differs",
        expected: expected.rows,
        actual: actual.rows,
      });
      continue;
    }
    if (actual.sha256 !== expected.sha256) {
      differences.push({ table: expected.name, reason: "content hash differs" });
    }
  }
  return differences;
}

/** Attempt the two things the ledger forbids. Both must be refused. */
export async function proveAppendOnly(client) {
  const attempt = async (sql) => {
    try {
      await client.execute(sql);
      return { blocked: false };
    } catch (error) {
      return {
        blocked: /append-only/i.test(String(error?.message)),
        message: String(error?.message),
      };
    }
  };
  return {
    update: await attempt(
      "UPDATE entitlement_events SET reason = 'tampered' WHERE id = 'ev-drill'",
    ),
    delete: await attempt("DELETE FROM entitlement_events WHERE id = 'ev-drill'"),
  };
}

/**
 * Run the whole drill. Returns a report. Throws on any failure, so a caller
 * that ignores the report still cannot mistake a broken drill for a passing
 * one.
 */
export async function runDrill() {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "signal-recovery-drill-"));
  const url = (name) =>
    `file:${path.join(workDir, name).replaceAll("\\", "/")}`;
  const source = createClient({ url: url("source.db") });
  const restored = createClient({ url: url("restored.db") });
  const startedAt = Date.now();

  try {
    await buildSource(source);
    await seed(source);

    const beforeGuard = await proveAppendOnly(source);
    assert.ok(
      beforeGuard.update.blocked && beforeGuard.delete.blocked,
      "the source ledger must be append-only before the drill means anything",
    );

    const snapshot = await dump(source);
    await restore(restored, snapshot);

    const measured = await measure(
      restored,
      snapshot.manifest.map((entry) => entry.name),
    );
    const differences = compare(snapshot.manifest, measured);
    assert.deepEqual(differences, [], "restored data does not match the snapshot");

    const schema = await restored.execute(
      "SELECT type, name FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%'",
    );
    const present = new Set(schema.rows.map((row) => `${row.type}:${row.name}`));
    const missingDdl = [
      ...snapshot.ddl.indexes.map((name) => `index:${name}`),
      ...snapshot.ddl.triggers.map((name) => `trigger:${name}`),
    ].filter((key) => !present.has(key));
    assert.deepEqual(missingDdl, [], "the restore lost schema objects");

    const afterGuard = await proveAppendOnly(restored);
    assert.ok(
      afterGuard.update.blocked,
      "the restored ledger accepted an UPDATE: append-only enforcement was lost in the restore",
    );
    assert.ok(
      afterGuard.delete.blocked,
      "the restored ledger accepted a DELETE: append-only enforcement was lost in the restore",
    );

    const rowsVerified = snapshot.manifest.reduce((sum, t) => sum + t.rows, 0);
    return {
      ok: true,
      elapsedMs: Date.now() - startedAt,
      tablesVerified: snapshot.manifest.length,
      rowsVerified,
      indexesRestored: snapshot.ddl.indexes.length,
      triggersRestored: snapshot.ddl.triggers.length,
      appendOnlyProvenOnRestore: true,
      expectedTriggers: TRIGGERS.map((t) => t.name),
    };
  } finally {
    source.close();
    restored.close();
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
    } catch (error) {
      // Windows can hold a SQLite handle briefly after close. A leftover
      // uniquely-named temp directory beats failing a drill that passed.
      if (error?.code !== "EPERM") throw error;
    }
  }
}

const invokedDirectly = process.argv[1]?.endsWith("recovery-drill.mjs");
if (invokedDirectly) {
  const asJson = process.argv.includes("--json");
  runDrill().then(
    (report) => {
      if (asJson) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(
          `recovery drill: PASSED in ${report.elapsedMs} ms.\n` +
            `  ${report.rowsVerified} rows across ${report.tablesVerified} tables ` +
            `restored and re-verified from the restored database\n` +
            `  ${report.indexesRestored} indexes and ${report.triggersRestored} triggers recreated\n` +
            `  append-only enforcement proven on the RESTORED ledger, not assumed`,
        );
      }
      process.exit(0);
    },
    (error) => {
      console.error(`recovery drill: FAILED — ${error.message}`);
      process.exit(1);
    },
  );
}
