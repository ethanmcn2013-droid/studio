import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { createClient } from "@libsql/client";

import {
  DAY_SECONDS,
  MigrationInvariantError,
  NEW_DURATION_DAYS,
  OLD_DURATION_DAYS,
  assertApplyPin,
  digestCodes,
  recoveryAction,
  resolveApplyPin,
  validateMirrorSnapshot,
  validateTasksSnapshot,
} from "./migrate-venue-access-18-months.mjs";

const STARTED_AT = 1_700_000_000;

function compRow({ code, durationDays, redeemed }) {
  return {
    code,
    tier: "wedding",
    duration_days: durationDays,
    quantity: 1,
    redeemed,
    notes: JSON.stringify({
      sponsor_slug: "test-venue",
      sponsor_name: "Test Venue",
      source_type: "venue_edition",
      studio_tier: "wedding",
      studio_duration_days: durationDays,
    }),
  };
}

function entitlementRow({ code, durationDays }) {
  return {
    id: `ent-${code}`,
    tier: "wedding",
    source: "comp",
    started_at: STARTED_AT,
    expires_at: STARTED_AT + durationDays * DAY_SECONDS,
    notes: `comp:${code}`,
  };
}

function mirrorRows(tasksSnapshot) {
  return tasksSnapshot.rows.map((row) => ({
    code: row.code,
    source_type: "venue_edition",
    tier: "wedding",
    duration_days: row.durationDays,
    // Status is intentionally contradictory. Mirror validation must not use it.
    status: row.redeemed ? "minted" : "redeemed",
  }));
}

test("validates the exact unredeemed/exhausted split and 365-day entitlement join", () => {
  const compRows = [
    compRow({ code: "VENUE-AAAAA", durationDays: OLD_DURATION_DAYS, redeemed: 0 }),
    compRow({ code: "VENUE-BBBBB", durationDays: OLD_DURATION_DAYS, redeemed: 1 }),
    // Unrelated non-venue rows do not enter the migration set.
    {
      code: "STUDENT-CCCCC",
      tier: "workspace",
      duration_days: 365,
      quantity: 1,
      redeemed: 1,
      notes: "student:example.edu",
    },
  ];
  const entitlements = [
    entitlementRow({ code: "VENUE-BBBBB", durationDays: OLD_DURATION_DAYS }),
    // An unmatched seed entitlement is outside the exact comp:<venue-code> query.
  ];

  const snapshot = validateTasksSnapshot(compRows, entitlements);

  assert.equal(snapshot.rows.length, 2);
  assert.equal(snapshot.targetRows.length, 2);
  assert.equal(snapshot.unredeemedRows.length, 1);
  assert.equal(snapshot.redeemedRows.length, 1);
  assert.equal(snapshot.alreadyMigratedRows.length, 0);
  assert.equal(snapshot.codeDigest, digestCodes(["VENUE-AAAAA", "VENUE-BBBBB"]));
});

test("accepts a fully migrated snapshot so reruns can be a no-op", () => {
  const compRows = [
    compRow({ code: "VENUE-AAAAA", durationDays: NEW_DURATION_DAYS, redeemed: 0 }),
    compRow({ code: "VENUE-BBBBB", durationDays: NEW_DURATION_DAYS, redeemed: 1 }),
  ];
  const snapshot = validateTasksSnapshot(compRows, [
    entitlementRow({ code: "VENUE-BBBBB", durationDays: NEW_DURATION_DAYS }),
  ]);

  assert.equal(snapshot.targetRows.length, 0);
  assert.equal(snapshot.alreadyMigratedRows.length, 2);
});

test("fails closed when a redeemed code has the wrong entitlement interval", () => {
  const compRows = [
    compRow({ code: "VENUE-AAAAA", durationDays: OLD_DURATION_DAYS, redeemed: 1 }),
  ];
  const entitlement = entitlementRow({ code: "VENUE-AAAAA", durationDays: OLD_DURATION_DAYS });
  entitlement.expires_at += DAY_SECONDS;

  assert.throws(
    () => validateTasksSnapshot(compRows, [entitlement]),
    (error) =>
      error instanceof MigrationInvariantError &&
      /does not span exactly 365 days/.test(error.message),
  );
});

test("fails closed when Venue Edition JSON notes disagree with the code duration", () => {
  const row = compRow({ code: "VENUE-AAAAA", durationDays: OLD_DURATION_DAYS, redeemed: 0 });
  row.notes = JSON.stringify({
    source_type: "venue_edition",
    studio_tier: "wedding",
    studio_duration_days: NEW_DURATION_DAYS,
  });

  assert.throws(
    () => validateTasksSnapshot([row], []),
    (error) =>
      error instanceof MigrationInvariantError &&
      /notes disagree with duration_days/.test(error.message),
  );
});

test("mirror validation ignores status but requires exact code and duration parity", () => {
  const tasks = validateTasksSnapshot(
    [
      compRow({ code: "VENUE-AAAAA", durationDays: OLD_DURATION_DAYS, redeemed: 0 }),
      compRow({ code: "VENUE-BBBBB", durationDays: OLD_DURATION_DAYS, redeemed: 1 }),
    ],
    [entitlementRow({ code: "VENUE-BBBBB", durationDays: OLD_DURATION_DAYS })],
  );

  const mirror = validateMirrorSnapshot("shared", mirrorRows(tasks), tasks);
  assert.equal(mirror.rows.length, 2);
  assert.equal(mirror.codeDigest, tasks.codeDigest);

  const missing = mirrorRows(tasks).slice(0, 1);
  assert.throws(
    () => validateMirrorSnapshot("shared", missing, tasks),
    (error) => error instanceof MigrationInvariantError && /code-set mismatch/.test(error.message),
  );

  const wrongDuration = mirrorRows(tasks);
  wrongDuration[0].duration_days = NEW_DURATION_DAYS;
  assert.throws(
    () => validateMirrorSnapshot("shared", wrongDuration, tasks),
    (error) =>
      error instanceof MigrationInvariantError && /duration does not match Tasks/.test(error.message),
  );
});

test("digest is stable across input order and does not expose codes", () => {
  const first = digestCodes(["VENUE-BBBBB", "VENUE-AAAAA"]);
  const second = digestCodes(["VENUE-AAAAA", "VENUE-BBBBB"]);

  assert.equal(first, second);
  assert.match(first, /^[a-f0-9]{64}$/);
  assert.equal(first.includes("VENUE"), false);
});

test("apply pin fails closed on missing paired overrides and count/digest mismatch", () => {
  assert.throws(
    () => resolveApplyPin("23", undefined),
    (error) =>
      error instanceof MigrationInvariantError && /must be supplied together/.test(error.message),
  );

  const snapshot = validateTasksSnapshot(
    [compRow({ code: "VENUE-AAAAA", durationDays: OLD_DURATION_DAYS, redeemed: 0 })],
    [],
  );
  const exactPin = resolveApplyPin("1", snapshot.codeDigest);
  assert.doesNotThrow(() => assertApplyPin(snapshot, exactPin));
  assert.throws(
    () => assertApplyPin(snapshot, { ...exactPin, count: 2 }),
    (error) => error instanceof MigrationInvariantError && /count mismatch/.test(error.message),
  );
  assert.throws(
    () => assertApplyPin(snapshot, { ...exactPin, digest: "0".repeat(64) }),
    (error) => error instanceof MigrationInvariantError && /digest mismatch/.test(error.message),
  );
});

test("ambiguous commit recovery never compensates when Tasks may already be new", () => {
  assert.equal(
    recoveryAction({
      tasks: "new",
      mirrors: { shared: "new", studio: "new" },
    }),
    "accept-committed",
  );
  assert.equal(
    recoveryAction({
      tasks: "new",
      mirrors: { shared: "new", studio: "old" },
    }),
    "manual-audit",
  );
  assert.equal(
    recoveryAction({
      tasks: "old",
      mirrors: { shared: "new", studio: "old" },
    }),
    "compensate-mirrors",
  );
  assert.equal(
    recoveryAction({
      tasks: "old",
      mirrors: { shared: "old", studio: "old" },
    }),
    "already-restored",
  );
  assert.equal(
    recoveryAction({
      tasks: "mixed",
      mirrors: { shared: "new", studio: "old" },
    }),
    "manual-audit",
  );
});

async function removeFixtureWithRetry(path) {
  let lastError;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      await rm(path, { recursive: true, force: true });
      return;
    } catch (error) {
      lastError = error;
      await new Promise((done) => setTimeout(done, 50));
    }
  }
  if (lastError?.code === "EBUSY") {
    // The embedded Windows driver can keep a closed file handle until this
    // test process exits. A detached helper removes the fixture as soon as the
    // parent releases it; it never touches anything outside this exact path.
    const cleanup = spawn(
      process.execPath,
      [
        "-e",
        `const { rm } = require("node:fs/promises");
         const target = process.argv[1];
         (async () => {
           for (let i = 0; i < 100; i += 1) {
             try { await rm(target, { recursive: true, force: true }); return; }
             catch { await new Promise((done) => setTimeout(done, 100)); }
           }
           process.exitCode = 1;
         })();`,
        path,
      ],
      { detached: true, stdio: "ignore", windowsHide: true },
    );
    cleanup.unref();
    return;
  }
  throw lastError;
}

test("CLI dry-run, apply, and rerun no-op work against disposable local databases", async () => {
  const fixture = await mkdtemp(join(tmpdir(), "venue-access-migration-test-"));
  const fileUrl = (name) => `file:${join(fixture, name).replaceAll("\\", "/")}`;
  const tasksUrl = fileUrl("tasks.db");
  const sharedUrl = fileUrl("shared.db");
  const studioUrl = fileUrl("studio.db");
  const tasks = createClient({ url: tasksUrl });
  const shared = createClient({ url: sharedUrl });
  const studio = createClient({ url: studioUrl });

  try {
    await tasks.executeMultiple(`
      CREATE TABLE comp_codes (
        code TEXT PRIMARY KEY,
        tier TEXT NOT NULL,
        duration_days INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        redeemed INTEGER NOT NULL,
        notes TEXT
      );
      CREATE TABLE entitlements (
        id TEXT PRIMARY KEY,
        tier TEXT NOT NULL,
        source TEXT NOT NULL,
        started_at INTEGER NOT NULL,
        expires_at INTEGER,
        notes TEXT
      );
    `);
    await tasks.batch(
      [
        {
          sql: "INSERT INTO comp_codes VALUES (?, ?, ?, ?, ?, ?)",
          args: [
            "VENUE-AAAAA",
            "wedding",
            OLD_DURATION_DAYS,
            1,
            0,
            compRow({ code: "VENUE-AAAAA", durationDays: OLD_DURATION_DAYS, redeemed: 0 }).notes,
          ],
        },
        {
          sql: "INSERT INTO comp_codes VALUES (?, ?, ?, ?, ?, ?)",
          args: [
            "VENUE-BBBBB",
            "wedding",
            OLD_DURATION_DAYS,
            1,
            1,
            compRow({ code: "VENUE-BBBBB", durationDays: OLD_DURATION_DAYS, redeemed: 1 }).notes,
          ],
        },
        {
          sql: "INSERT INTO entitlements VALUES (?, ?, ?, ?, ?, ?)",
          args: [
            "ent-b",
            "wedding",
            "comp",
            STARTED_AT,
            STARTED_AT + OLD_DURATION_DAYS * DAY_SECONDS,
            "comp:VENUE-BBBBB",
          ],
        },
        {
          sql: "INSERT INTO entitlements VALUES (?, ?, ?, ?, ?, ?)",
          args: [
            "seed-unmatched",
            "wedding",
            "comp",
            STARTED_AT,
            STARTED_AT + OLD_DURATION_DAYS * DAY_SECONDS,
            "seed:unmatched",
          ],
        },
      ],
      "write",
    );

    for (const mirror of [shared, studio]) {
      await mirror.executeMultiple(`
        CREATE TABLE license_codes (
          code TEXT PRIMARY KEY,
          source_type TEXT NOT NULL,
          tier TEXT NOT NULL,
          duration_days INTEGER
        );
      `);
      await mirror.batch(
        ["VENUE-AAAAA", "VENUE-BBBBB"].map((code) => ({
          sql: "INSERT INTO license_codes VALUES (?, ?, ?, ?)",
          args: [code, "venue_edition", "wedding", OLD_DURATION_DAYS],
        })),
        "write",
      );
    }

    tasks.close();
    shared.close();
    studio.close();

    const script = resolve("scripts/migrate-venue-access-18-months.mjs");
    const env = {
      ...process.env,
      TASKS_DATABASE_URL: tasksUrl,
      TASKS_AUTH_TOKEN: "",
      TURSO_ENTITLEMENTS_DATABASE_URL: sharedUrl,
      TURSO_ENTITLEMENTS_AUTH_TOKEN: "",
      TURSO_STUDIO_DATABASE_URL: studioUrl,
      TURSO_STUDIO_AUTH_TOKEN: "",
    };
    const run = (args) =>
      spawnSync(process.execPath, [script, ...args], {
        cwd: process.cwd(),
        env,
        encoding: "utf8",
      });

    const dryRun = run([]);
    assert.equal(dryRun.status, 0, dryRun.stderr);
    assert.match(dryRun.stdout, /Pending 365 -> 548: 2/);
    assert.match(dryRun.stdout, /DRY RUN complete\. No writes were attempted\./);
    const observedDigest = dryRun.stdout.match(/Code-set digest: sha256:([a-f0-9]{64})/)?.[1];
    assert.ok(observedDigest);

    const dryRunCheck = createClient({ url: tasksUrl });
    const beforeApply = await dryRunCheck.execute(
      "SELECT COUNT(*) AS n FROM comp_codes WHERE duration_days = 365",
    );
    dryRunCheck.close();
    assert.equal(beforeApply.rows[0].n, 2);

    const unpinnedApply = run(["--apply"]);
    assert.notEqual(unpinnedApply.status, 0);
    assert.match(unpinnedApply.stderr, /Apply pin count mismatch/);

    const oneSidedOverride = run(["--apply", "--expected-count=2"]);
    assert.notEqual(oneSidedOverride.status, 0);
    assert.match(oneSidedOverride.stderr, /must be supplied together/);

    const apply = run([
      "--apply",
      "--expected-count=2",
      `--expected-digest=${observedDigest}`,
    ]);
    assert.equal(apply.status, 0, apply.stderr);
    assert.match(apply.stdout, /Post-commit verification/);
    assert.match(apply.stdout, /Pending 365 -> 548: 0/);
    assert.match(apply.stdout, /started_at \+ 548 days/);

    const noOp = run([]);
    assert.equal(noOp.status, 0, noOp.stderr);
    assert.match(noOp.stdout, /State is already fully migrated; --apply would be a no-op\./);
  } finally {
    tasks.close();
    shared.close();
    studio.close();
    await removeFixtureWithRetry(fixture);
  }
});
