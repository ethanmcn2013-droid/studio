/**
 * Proof that the recovery drill can fail (E08.09).
 *
 * The drill this replaced could not fail. So the only assertion worth making
 * about the new one is the one the old one could never have passed: break the
 * restore in each of the three ways a restore actually breaks, and require the
 * drill's own verification steps to notice.
 *
 * The three failure modes, in the order they matter:
 *   1. Rows are lost or altered  → the content hash must differ.
 *   2. Schema objects are lost   → indexes and triggers must be reported missing.
 *   3. Enforcement is lost while the data looks perfect → the append-only
 *      guard must be provably absent on the restored copy.
 *
 * (3) is the one that motivated this file. A restore that replays every row
 * and drops the triggers passes any check that only compares data, and the
 * audit ledger it produces is an ordinary table wearing an audit ledger's name.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import { createClient } from "@libsql/client";
import {
  buildSource,
  compare,
  dump,
  measure,
  proveAppendOnly,
  restore,
  runDrill,
  seed,
} from "./recovery-drill.mjs";

let workDir;
let serial = 0;
const open = [];

function fresh(name) {
  const client = createClient({
    url: `file:${path.join(workDir, `${name}-${serial++}.db`).replaceAll("\\", "/")}`,
  });
  open.push(client);
  return client;
}

/** A built, seeded source database plus its snapshot. */
async function sourceAndSnapshot() {
  const source = fresh("source");
  await buildSource(source);
  await seed(source);
  return { source, snapshot: await dump(source) };
}

before(() => {
  workDir = fs.mkdtempSync(path.join(os.tmpdir(), "signal-recovery-drill-test-"));
});

after(() => {
  for (const client of open) {
    try {
      client.close();
    } catch {
      // already closed
    }
  }
  try {
    fs.rmSync(workDir, { recursive: true, force: true });
  } catch (error) {
    if (error?.code !== "EPERM") throw error;
  }
});

describe("recovery drill", () => {
  it("passes end to end on an intact restore", async () => {
    const report = await runDrill();
    assert.equal(report.ok, true);
    assert.equal(report.appendOnlyProvenOnRestore, true);
    assert.ok(report.rowsVerified > 0, "a drill that verifies zero rows verifies nothing");
    assert.ok(report.tablesVerified > 1, "the drill must cover the real schema, not one probe table");
    assert.equal(report.triggersRestored, 2, "both append-only triggers must be restored");
  });

  it("exercises the tables that hold the commercial record", async () => {
    const { snapshot } = await sourceAndSnapshot();
    const populated = snapshot.manifest.filter((t) => t.rows > 0).map((t) => t.name).sort();
    assert.deepEqual(
      populated,
      ["entitlement_events", "license_codes", "redemptions", "sponsors"],
      "a drill that does not carry sponsors, codes, redemptions and the audit ledger " +
        "has not rehearsed anything that matters",
    );
  });

  it("detects a restore that lost a row", async () => {
    const { snapshot } = await sourceAndSnapshot();
    const restored = fresh("lost-row");
    const damaged = {
      ...snapshot,
      data: snapshot.data.map((entry) =>
        entry.table === "license_codes"
          ? { ...entry, rows: entry.rows.slice(0, 1) }
          : entry,
      ),
    };
    await restore(restored, damaged);

    const measured = await measure(restored, snapshot.manifest.map((t) => t.name));
    const differences = compare(snapshot.manifest, measured);
    assert.deepEqual(
      differences.map((d) => [d.table, d.reason]),
      [["license_codes", "row count differs"]],
    );
  });

  it("detects a restore that altered a value while keeping the row count", async () => {
    const { snapshot } = await sourceAndSnapshot();
    const restored = fresh("altered");
    const damaged = {
      ...snapshot,
      data: snapshot.data.map((entry) => {
        if (entry.table !== "sponsors") return entry;
        const amountIndex = entry.columns.indexOf("annual_amount_cents");
        assert.ok(amountIndex >= 0, "fixture must carry the recorded annual amount");
        return {
          ...entry,
          rows: entry.rows.map((row) =>
            row.map((value, index) => (index === amountIndex ? 150000 : value)),
          ),
        };
      }),
    };
    await restore(restored, damaged);

    const measured = await measure(restored, snapshot.manifest.map((t) => t.name));
    const differences = compare(snapshot.manifest, measured);
    assert.deepEqual(
      differences.map((d) => [d.table, d.reason]),
      [["sponsors", "content hash differs"]],
      "a founding venue silently restored at the standard price must not pass",
    );
  });

  it("detects a restore that replayed every row and dropped the triggers", async () => {
    const { snapshot } = await sourceAndSnapshot();
    const restored = fresh("no-triggers");
    const dataOnly = {
      ...snapshot,
      objects: snapshot.objects.filter((object) => object.type !== "trigger"),
    };
    await restore(restored, dataOnly);

    // The data is perfect. This is the whole point of the case.
    const measured = await measure(restored, snapshot.manifest.map((t) => t.name));
    assert.deepEqual(
      compare(snapshot.manifest, measured),
      [],
      "the fixture must be data-identical, or this case proves nothing",
    );

    const schema = await restored.execute(
      "SELECT type, name FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%'",
    );
    const present = new Set(schema.rows.map((row) => `${row.type}:${row.name}`));
    const missing = snapshot.ddl.triggers.filter((name) => !present.has(`trigger:${name}`));
    assert.deepEqual(missing.sort(), [
      "entitlement_events_no_delete",
      "entitlement_events_no_update",
    ]);

    const guard = await proveAppendOnly(restored);
    assert.equal(guard.update.blocked, false, "an unguarded ledger accepts an UPDATE");
    assert.equal(guard.delete.blocked, false, "an unguarded ledger accepts a DELETE");
  });

  it("detects a restore that lost an index", async () => {
    const { snapshot } = await sourceAndSnapshot();
    assert.ok(snapshot.ddl.indexes.length > 0, "the baseline must define indexes");
    const restored = fresh("no-index");
    const dropped = snapshot.ddl.indexes[0];
    await restore(restored, {
      ...snapshot,
      objects: snapshot.objects.filter((object) => object.name !== dropped),
    });

    const schema = await restored.execute(
      "SELECT type, name FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%'",
    );
    const present = new Set(schema.rows.map((row) => `${row.type}:${row.name}`));
    assert.equal(present.has(`index:${dropped}`), false);
  });

  it("proves the source ledger is guarded before the drill claims anything", async () => {
    const { source } = await sourceAndSnapshot();
    const guard = await proveAppendOnly(source);
    assert.equal(guard.update.blocked, true);
    assert.equal(guard.delete.blocked, true);
    assert.match(guard.update.message, /append-only/i);
  });
});
