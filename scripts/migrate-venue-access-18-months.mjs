#!/usr/bin/env node

/**
 * Migrate existing Venue Edition couple access from 365 to 548 days.
 *
 * Tasks is authoritative for runtime code redemption and entitlement expiry.
 * The shared and Studio license_codes tables are audit mirrors. This command
 * is read-only unless --apply is passed explicitly.
 *
 * Required env:
 *   TASKS_DATABASE_URL + TASKS_AUTH_TOKEN
 *   TURSO_ENTITLEMENTS_DATABASE_URL + TURSO_ENTITLEMENTS_AUTH_TOKEN
 *   TURSO_STUDIO_DATABASE_URL + TURSO_STUDIO_AUTH_TOKEN
 *
 * Run:
 *   pnpm venue:migrate-access-18mo          # dry-run (default)
 *   pnpm venue:migrate-access-18mo --apply  # guarded write
 */

import { createHash, timingSafeEqual } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createClient } from "@libsql/client";
import { config } from "dotenv";

export const OLD_DURATION_DAYS = 365;
export const NEW_DURATION_DAYS = 548;
export const DAY_SECONDS = 86_400;
export const LIVE_AUDITED_CODE_COUNT = 23;
export const LIVE_AUDITED_CODE_DIGEST =
  "8ca762af65e0281b6a8688406e7b95b6f0ff66a05ef3dd9788e15e8c0d4abf46";

const VENUE_SOURCE = "venue_edition";
const WEDDING_TIER = "wedding";
const COMP_SOURCE = "comp";
const ENTITLEMENT_NOTE_PREFIX = "comp:";
const QUERY_CHUNK_SIZE = 200;

export class MigrationInvariantError extends Error {
  constructor(message) {
    super(message);
    this.name = "MigrationInvariantError";
  }
}

function invariant(condition, message) {
  if (!condition) throw new MigrationInvariantError(message);
}

/**
 * Resolve the one-time live audit pin. Future migrations may override it, but
 * only by supplying a count and digest together from a separate dry-run.
 */
export function resolveApplyPin(expectedCountRaw, expectedDigestRaw) {
  const hasCount = expectedCountRaw !== undefined;
  const hasDigest = expectedDigestRaw !== undefined;
  invariant(
    hasCount === hasDigest,
    "--expected-count and --expected-digest must be supplied together",
  );

  if (!hasCount) {
    return {
      count: LIVE_AUDITED_CODE_COUNT,
      digest: LIVE_AUDITED_CODE_DIGEST,
      source: "live-audit-default",
    };
  }

  invariant(/^\d+$/.test(expectedCountRaw), "--expected-count must be a non-negative integer");
  const count = Number(expectedCountRaw);
  invariant(Number.isSafeInteger(count), "--expected-count must be a safe integer");
  const digest = expectedDigestRaw.toLowerCase();
  invariant(
    /^[a-f0-9]{64}$/.test(digest),
    "--expected-digest must be a 64-character SHA-256 hex digest",
  );
  return { count, digest, source: "explicit-override" };
}

/** Fail closed unless the audited count and code-set digest both match. */
export function assertApplyPin(tasksSnapshot, pin) {
  invariant(
    tasksSnapshot.rows.length === pin.count,
    `Apply pin count mismatch: observed ${tasksSnapshot.rows.length}, expected ${pin.count}`,
  );
  const observed = Buffer.from(tasksSnapshot.codeDigest, "hex");
  const expected = Buffer.from(pin.digest, "hex");
  invariant(
    observed.length === expected.length && timingSafeEqual(observed, expected),
    `Apply pin digest mismatch: observed sha256:${tasksSnapshot.codeDigest}, expected sha256:${pin.digest}`,
  );
}

function digestValues(values) {
  const canonical = [...values].map(String).sort().join("\n");
  return createHash("sha256").update(canonical).digest("hex");
}

/** A non-reversible digest for comparing code sets without printing codes. */
export function digestCodes(codes) {
  return digestValues(codes.map((code) => String(code).trim().toUpperCase()));
}

function codeFingerprint(code) {
  return createHash("sha256").update(String(code)).digest("hex").slice(0, 12);
}

function integer(value, label) {
  const number = typeof value === "bigint" ? Number(value) : value;
  invariant(
    typeof number === "number" && Number.isSafeInteger(number),
    `${label} must be a safe integer`,
  );
  return number;
}

function requiredString(value, label) {
  invariant(typeof value === "string" && value.length > 0, `${label} must be a non-empty string`);
  return value;
}

function parseVenueNotes(rawNotes, code) {
  if (typeof rawNotes !== "string" || rawNotes.length === 0) return null;

  let parsed;
  try {
    parsed = JSON.parse(rawNotes);
  } catch {
    invariant(
      !rawNotes.includes(VENUE_SOURCE),
      `Tasks code ${codeFingerprint(code)} looks like Venue Edition but has invalid JSON notes`,
    );
    return null;
  }

  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    invariant(
      !rawNotes.includes(VENUE_SOURCE),
      `Tasks code ${codeFingerprint(code)} has non-object Venue Edition notes`,
    );
    return null;
  }

  return parsed.source_type === VENUE_SOURCE ? parsed : null;
}

function venueRowsFromCompRows(compRows) {
  const venueRows = [];
  const seen = new Set();

  for (const raw of compRows) {
    const code = requiredString(raw.code, "comp_codes.code");
    const notes = parseVenueNotes(raw.notes, code);
    if (!notes) continue;

    invariant(code === code.trim().toUpperCase(), `Tasks code ${codeFingerprint(code)} is not canonical uppercase`);
    invariant(!seen.has(code), `Tasks contains duplicate Venue Edition code ${codeFingerprint(code)}`);
    seen.add(code);

    const tier = requiredString(raw.tier, `Tasks code ${codeFingerprint(code)} tier`);
    const durationDays = integer(
      raw.duration_days,
      `Tasks code ${codeFingerprint(code)} duration_days`,
    );
    const quantity = integer(raw.quantity, `Tasks code ${codeFingerprint(code)} quantity`);
    const redeemed = integer(raw.redeemed, `Tasks code ${codeFingerprint(code)} redeemed`);

    invariant(tier === WEDDING_TIER, `Tasks code ${codeFingerprint(code)} is not wedding tier`);
    invariant(
      durationDays === OLD_DURATION_DAYS || durationDays === NEW_DURATION_DAYS,
      `Tasks code ${codeFingerprint(code)} has unexpected duration ${durationDays}`,
    );
    invariant(quantity === 1, `Tasks code ${codeFingerprint(code)} has quantity ${quantity}, expected 1`);
    invariant(
      redeemed === 0 || redeemed === quantity,
      `Tasks code ${codeFingerprint(code)} must be unredeemed (0) or exhausted (redeemed=quantity)`,
    );

    if (Object.hasOwn(notes, "studio_tier")) {
      invariant(
        notes.studio_tier === WEDDING_TIER,
        `Tasks code ${codeFingerprint(code)} notes carry an unexpected studio_tier`,
      );
    }
    if (Object.hasOwn(notes, "studio_duration_days")) {
      invariant(
        notes.studio_duration_days === durationDays,
        `Tasks code ${codeFingerprint(code)} notes disagree with duration_days`,
      );
    }

    venueRows.push({ code, durationDays, quantity, redeemed });
  }

  return venueRows.sort((a, b) => a.code.localeCompare(b.code));
}

/**
 * Validate Tasks rows and the exact entitlements joined by notes='comp:'||code.
 * Entitlements outside that exact code set, including seed rows, are ignored.
 */
export function validateTasksSnapshot(compRows, entitlementRows) {
  const venueRows = venueRowsFromCompRows(compRows);
  const venueCodes = new Set(venueRows.map((row) => row.code));
  const entitlementsByCode = new Map(venueRows.map((row) => [row.code, []]));

  for (const raw of entitlementRows) {
    const notes = requiredString(raw.notes, "entitlements.notes");
    invariant(
      notes.startsWith(ENTITLEMENT_NOTE_PREFIX),
      "Tasks entitlement query returned a row without a comp: note",
    );
    const code = notes.slice(ENTITLEMENT_NOTE_PREFIX.length);
    invariant(
      venueCodes.has(code),
      `Tasks entitlement references unexpected code ${codeFingerprint(code)}`,
    );
    entitlementsByCode.get(code).push(raw);
  }

  const rows = venueRows.map((row) => {
    const joined = entitlementsByCode.get(row.code) ?? [];
    const fingerprint = codeFingerprint(row.code);

    if (row.redeemed === 0) {
      invariant(joined.length === 0, `Unredeemed Tasks code ${fingerprint} has an entitlement`);
      return { ...row, entitlement: null };
    }

    invariant(
      row.redeemed === row.quantity,
      `Redeemed Tasks code ${fingerprint} is not exhausted`,
    );
    invariant(joined.length === 1, `Redeemed Tasks code ${fingerprint} must join exactly one entitlement`);

    const entitlement = joined[0];
    invariant(
      entitlement.source === COMP_SOURCE,
      `Tasks entitlement for code ${fingerprint} is not source=comp`,
    );
    invariant(
      entitlement.tier === WEDDING_TIER,
      `Tasks entitlement for code ${fingerprint} is not wedding tier`,
    );
    invariant(
      entitlement.notes === `${ENTITLEMENT_NOTE_PREFIX}${row.code}`,
      `Tasks entitlement for code ${fingerprint} has an unexpected notes join`,
    );

    const startedAt = integer(
      entitlement.started_at,
      `Tasks entitlement for code ${fingerprint} started_at`,
    );
    const expiresAt = integer(
      entitlement.expires_at,
      `Tasks entitlement for code ${fingerprint} expires_at`,
    );
    invariant(
      expiresAt - startedAt === row.durationDays * DAY_SECONDS,
      `Tasks entitlement for code ${fingerprint} does not span exactly ${row.durationDays} days`,
    );

    return {
      ...row,
      entitlement: {
        id: requiredString(entitlement.id, `Tasks entitlement for code ${fingerprint} id`),
        startedAt,
        expiresAt,
      },
    };
  });

  const targetRows = rows.filter((row) => row.durationDays === OLD_DURATION_DAYS);
  const alreadyMigratedRows = rows.filter((row) => row.durationDays === NEW_DURATION_DAYS);
  const redeemedRows = rows.filter((row) => row.redeemed === row.quantity);
  const unredeemedRows = rows.filter((row) => row.redeemed === 0);
  const stateDigest = digestValues(
    rows.map((row) =>
      [
        row.code,
        row.durationDays,
        row.redeemed,
        row.entitlement?.id ?? "",
        row.entitlement?.startedAt ?? "",
        row.entitlement?.expiresAt ?? "",
      ].join("|"),
    ),
  );

  invariant(
    entitlementRows.length === redeemedRows.length,
    `Tasks join count ${entitlementRows.length} does not match redeemed count ${redeemedRows.length}`,
  );

  return {
    rows,
    targetRows,
    alreadyMigratedRows,
    redeemedRows,
    unredeemedRows,
    codeDigest: digestCodes(rows.map((row) => row.code)),
    targetDigest: digestCodes(targetRows.map((row) => row.code)),
    stateDigest,
  };
}

function setDifference(left, right) {
  const rightSet = new Set(right);
  return left.filter((value) => !rightSet.has(value));
}

/** Validate one audit mirror against the exact Tasks Venue Edition code set. */
export function validateMirrorSnapshot(name, mirrorRows, tasksSnapshot) {
  const rows = [];
  const seen = new Set();

  for (const raw of mirrorRows) {
    const code = requiredString(raw.code, `${name} license_codes.code`);
    invariant(code === code.trim().toUpperCase(), `${name} code ${codeFingerprint(code)} is not canonical uppercase`);
    invariant(!seen.has(code), `${name} contains duplicate code ${codeFingerprint(code)}`);
    seen.add(code);

    const sourceType = requiredString(raw.source_type, `${name} code ${codeFingerprint(code)} source_type`);
    const tier = requiredString(raw.tier, `${name} code ${codeFingerprint(code)} tier`);
    const durationDays = integer(
      raw.duration_days,
      `${name} code ${codeFingerprint(code)} duration_days`,
    );

    invariant(sourceType === VENUE_SOURCE, `${name} code ${codeFingerprint(code)} is not venue_edition`);
    invariant(tier === WEDDING_TIER, `${name} code ${codeFingerprint(code)} is not wedding tier`);
    invariant(
      durationDays === OLD_DURATION_DAYS || durationDays === NEW_DURATION_DAYS,
      `${name} code ${codeFingerprint(code)} has unexpected duration ${durationDays}`,
    );

    rows.push({ code, durationDays });
  }

  rows.sort((a, b) => a.code.localeCompare(b.code));
  const taskCodes = tasksSnapshot.rows.map((row) => row.code);
  const mirrorCodes = rows.map((row) => row.code);
  const missing = setDifference(taskCodes, mirrorCodes);
  const extra = setDifference(mirrorCodes, taskCodes);

  invariant(
    missing.length === 0 && extra.length === 0,
    `${name} code-set mismatch (missing=${missing.length}, extra=${extra.length}, ` +
      `missing_fingerprints=${missing.slice(0, 3).map(codeFingerprint).join(",") || "none"}, ` +
      `extra_fingerprints=${extra.slice(0, 3).map(codeFingerprint).join(",") || "none"})`,
  );

  const tasksByCode = new Map(tasksSnapshot.rows.map((row) => [row.code, row]));
  for (const row of rows) {
    const taskRow = tasksByCode.get(row.code);
    invariant(
      taskRow && taskRow.durationDays === row.durationDays,
      `${name} code ${codeFingerprint(row.code)} duration does not match Tasks`,
    );
  }

  return {
    name,
    rows,
    codeDigest: digestCodes(mirrorCodes),
    stateDigest: digestValues(rows.map((row) => `${row.code}|${row.durationDays}`)),
  };
}

function sqlPlaceholders(count) {
  return Array.from({ length: count }, () => "?").join(", ");
}

async function queryEntitlementsForCodes(executor, codes) {
  const rows = [];
  for (let index = 0; index < codes.length; index += QUERY_CHUNK_SIZE) {
    const chunk = codes.slice(index, index + QUERY_CHUNK_SIZE);
    const notes = chunk.map((code) => `${ENTITLEMENT_NOTE_PREFIX}${code}`);
    const result = await executor.execute({
      sql: `SELECT id, tier, source, started_at, expires_at, notes
            FROM entitlements
            WHERE notes IN (${sqlPlaceholders(notes.length)})
            ORDER BY notes, id`,
      args: notes,
    });
    rows.push(...result.rows);
  }
  return rows;
}

async function readTasksSnapshot(executor) {
  const compRows = (
    await executor.execute(
      `SELECT code, tier, duration_days, quantity, redeemed, notes
       FROM comp_codes
       ORDER BY code`,
    )
  ).rows;
  const venueRows = venueRowsFromCompRows(compRows);
  const entitlementRows = await queryEntitlementsForCodes(
    executor,
    venueRows.map((row) => row.code),
  );
  return validateTasksSnapshot(compRows, entitlementRows);
}

async function readMirrorSnapshot(name, executor, tasksSnapshot) {
  // Deliberately do not read or filter status. Tasks is authoritative for
  // redemption state; mirrors only prove code/source/tier/duration parity.
  const rows = await readMirrorRows(executor);
  return validateMirrorSnapshot(name, rows, tasksSnapshot);
}

async function readMirrorRows(executor) {
  return (
    await executor.execute({
      sql: `SELECT code, source_type, tier, duration_days
            FROM license_codes
            WHERE source_type = ?
            ORDER BY code`,
      args: [VENUE_SOURCE],
    })
  ).rows;
}

async function auditTopology(topology) {
  const tasks = await readTasksSnapshot(topology.tasks.db);
  const mirrors = [];
  for (const mirror of topology.mirrors) {
    mirrors.push(await readMirrorSnapshot(mirror.name, mirror.db, tasks));
  }
  return { tasks, mirrors };
}

function classifyTasksMigrationState(current, initial) {
  if (current.codeDigest !== initial.codeDigest) return "invalid";
  const currentByCode = new Map(current.rows.map((row) => [row.code, row]));
  const targetStates = [];

  for (const original of initial.rows) {
    const row = currentByCode.get(original.code);
    if (!row || row.redeemed !== original.redeemed || row.quantity !== original.quantity) {
      return "invalid";
    }
    if (original.durationDays === NEW_DURATION_DAYS) {
      if (row.durationDays !== NEW_DURATION_DAYS) return "invalid";
      continue;
    }
    targetStates.push(row.durationDays);
  }

  if (targetStates.every((duration) => duration === OLD_DURATION_DAYS)) return "old";
  if (targetStates.every((duration) => duration === NEW_DURATION_DAYS)) return "new";
  return "mixed";
}

function expectedTasksRows(initial, targetDuration) {
  return {
    rows: initial.rows.map((row) => ({
      ...row,
      durationDays:
        row.durationDays === OLD_DURATION_DAYS ? targetDuration : row.durationDays,
    })),
  };
}

function classifyMirrorMigrationState(name, rows, initialTasks) {
  try {
    validateMirrorSnapshot(name, rows, expectedTasksRows(initialTasks, OLD_DURATION_DAYS));
    return "old";
  } catch {
    try {
      validateMirrorSnapshot(name, rows, expectedTasksRows(initialTasks, NEW_DURATION_DAYS));
      return "new";
    } catch {
      return "invalid";
    }
  }
}

/** Decide the only safe recovery after an uncertain distributed commit. */
export function recoveryAction(classification) {
  const mirrorStates = Object.values(classification.mirrors);
  if (classification.tasks === "new" && mirrorStates.every((state) => state === "new")) {
    return "accept-committed";
  }
  if (
    classification.tasks === "old" &&
    mirrorStates.every((state) => state === "old" || state === "new")
  ) {
    return mirrorStates.some((state) => state === "new")
      ? "compensate-mirrors"
      : "already-restored";
  }
  return "manual-audit";
}

async function classifyTopologyState(connections, initialAudit) {
  const tasks = await readTasksSnapshot(connections.tasks.db);
  const mirrors = {};
  for (const mirror of connections.mirrors) {
    const rows = await readMirrorRows(mirror.db);
    mirrors[mirror.name] = classifyMirrorMigrationState(
      mirror.name,
      rows,
      initialAudit.tasks,
    );
  }
  return {
    tasks: classifyTasksMigrationState(tasks, initialAudit.tasks),
    mirrors,
  };
}

function sleep(milliseconds) {
  return new Promise((done) => setTimeout(done, milliseconds));
}

async function classifyTopologyWithRetry(connections, initialAudit) {
  let previousKey = null;
  let stableReads = 0;
  const observations = [];

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const classification = await classifyTopologyState(connections, initialAudit);
      const key = JSON.stringify(classification);
      observations.push(key);
      if (key === previousKey) stableReads += 1;
      else stableReads = 1;
      previousKey = key;
      if (stableReads >= 2) return classification;
    } catch (error) {
      observations.push(`read-error:${error instanceof Error ? error.message : String(error)}`);
      previousKey = null;
      stableReads = 0;
    }
    if (attempt < 3) await sleep(150 * 2 ** attempt);
  }

  throw new MigrationInvariantError(
    `Could not obtain two stable post-commit classifications; no compensation attempted. ` +
      `Observations: ${observations.join(" | ")}`,
  );
}

async function auditFullyMigratedWithRetry(connections, originalCodeDigest) {
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const audit = await auditTopology({
        tasks: connections.tasks,
        mirrors: connections.mirrors,
      });
      assertFullyMigrated(audit, originalCodeDigest);
      return audit;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await sleep(150 * 2 ** attempt);
    }
  }
  throw lastError;
}

function assertSameAudit(before, after) {
  invariant(before.tasks.stateDigest === after.tasks.stateDigest, "Tasks changed between audit and write lock");
  invariant(before.mirrors.length === after.mirrors.length, "Configured mirror set changed before apply");
  for (let index = 0; index < before.mirrors.length; index += 1) {
    invariant(
      before.mirrors[index].name === after.mirrors[index].name &&
        before.mirrors[index].stateDigest === after.mirrors[index].stateDigest,
      `${before.mirrors[index].name} changed between audit and write lock`,
    );
  }
}

function assertFullyMigrated(audit, originalCodeDigest) {
  invariant(audit.tasks.codeDigest === originalCodeDigest, "Tasks code set changed during migration");
  invariant(audit.tasks.targetRows.length === 0, "Tasks still contains 365-day Venue Edition codes");
  invariant(
    audit.tasks.rows.every((row) => row.durationDays === NEW_DURATION_DAYS),
    "Tasks contains a Venue Edition code that is not 548 days",
  );
  for (const mirror of audit.mirrors) {
    invariant(mirror.codeDigest === originalCodeDigest, `${mirror.name} code set changed during migration`);
    invariant(
      mirror.rows.every((row) => row.durationDays === NEW_DURATION_DAYS),
      `${mirror.name} still contains a Venue Edition code that is not 548 days`,
    );
  }
}

function describeAudit(audit, label) {
  const { tasks } = audit;
  console.log(`\n${label}`);
  console.log(`  Venue codes: ${tasks.rows.length}`);
  console.log(`  Pending 365 -> 548: ${tasks.targetRows.length}`);
  console.log(`  Already 548: ${tasks.alreadyMigratedRows.length}`);
  console.log(`  Unredeemed (redeemed=0): ${tasks.unredeemedRows.length}`);
  console.log(`  Exhausted (redeemed=quantity): ${tasks.redeemedRows.length}`);
  console.log(`  Exact joined entitlements: ${tasks.redeemedRows.length}`);
  console.log(`  Code-set digest: sha256:${tasks.codeDigest}`);
  for (const mirror of audit.mirrors) {
    console.log(`  ${mirror.name}: ${mirror.rows.length} exact codes, digest sha256:${mirror.codeDigest}`);
  }
}

async function updateTasks(transaction, targetRows) {
  const statements = [];

  for (const row of targetRows) {
    statements.push({
      label: `Tasks comp_code ${codeFingerprint(row.code)}`,
      statement: {
        sql: `UPDATE comp_codes
              SET duration_days = ?,
                  notes = json_set(notes, '$.studio_duration_days', ?)
              WHERE code = ?
                AND tier = ?
                AND duration_days = ?
                AND quantity = 1
                AND redeemed IN (0, quantity)
                AND json_valid(notes)
                AND json_extract(notes, '$.source_type') = ?`,
        args: [
          NEW_DURATION_DAYS,
          NEW_DURATION_DAYS,
          row.code,
          WEDDING_TIER,
          OLD_DURATION_DAYS,
          VENUE_SOURCE,
        ],
      },
    });

    if (row.redeemed === row.quantity) {
      statements.push({
        label: `Tasks entitlement ${codeFingerprint(row.code)}`,
        statement: {
          // Set from started_at. Never add 183 days to the prior expiry.
          sql: `UPDATE entitlements
                SET expires_at = started_at + ?
                WHERE notes = ?
                  AND source = ?
                  AND tier = ?
                  AND expires_at - started_at = ?`,
          args: [
            NEW_DURATION_DAYS * DAY_SECONDS,
            `${ENTITLEMENT_NOTE_PREFIX}${row.code}`,
            COMP_SOURCE,
            WEDDING_TIER,
            OLD_DURATION_DAYS * DAY_SECONDS,
          ],
        },
      });
    }
  }

  const results = await transaction.batch(statements.map((entry) => entry.statement));
  for (let index = 0; index < results.length; index += 1) {
    invariant(
      results[index].rowsAffected === 1,
      `${statements[index].label} updated ${results[index].rowsAffected} rows, expected 1`,
    );
  }
}

async function updateMirror(name, transaction, targetRows) {
  const statements = targetRows.map((row) => ({
    sql: `UPDATE license_codes
          SET duration_days = ?
          WHERE code = ?
            AND source_type = ?
            AND tier = ?
            AND duration_days = ?`,
    args: [NEW_DURATION_DAYS, row.code, VENUE_SOURCE, WEDDING_TIER, OLD_DURATION_DAYS],
  }));
  const results = await transaction.batch(statements);
  for (let index = 0; index < results.length; index += 1) {
    invariant(
      results[index].rowsAffected === 1,
      `${name} code ${codeFingerprint(targetRows[index].code)} updated ` +
        `${results[index].rowsAffected} rows, expected 1`,
    );
  }
}

async function rollbackQuietly(transaction) {
  if (!transaction) return;
  try {
    await transaction.rollback();
  } catch {
    // A committed/closed transaction cannot roll back. The caller separately
    // verifies committed state and compensates mirrors if a later commit fails.
  }
}

async function compensateMirror(connection, targetRows) {
  const transaction = await connection.db.transaction("write");
  try {
    const results = await transaction.batch(
      targetRows.map((row) => ({
        sql: `UPDATE license_codes
              SET duration_days = ?
              WHERE code = ?
                AND source_type = ?
                AND tier = ?
                AND duration_days = ?`,
        args: [OLD_DURATION_DAYS, row.code, VENUE_SOURCE, WEDDING_TIER, NEW_DURATION_DAYS],
      })),
    );
    invariant(
      results.every((result) => result.rowsAffected === 0 || result.rowsAffected === 1),
      `${connection.name} compensation returned an impossible row count`,
    );
    await transaction.commit();
  } catch (error) {
    await rollbackQuietly(transaction);
    throw error;
  }
}

async function applyMigration(connections, initialAudit) {
  const transactions = new Map();
  const targetRows = initialAudit.tasks.targetRows;

  try {
    for (const connection of [connections.tasks, ...connections.mirrors]) {
      transactions.set(connection.name, await connection.db.transaction("write"));
    }

    const lockedTopology = {
      tasks: { name: connections.tasks.name, db: transactions.get(connections.tasks.name) },
      mirrors: connections.mirrors.map((mirror) => ({
        name: mirror.name,
        db: transactions.get(mirror.name),
      })),
    };
    const lockedAudit = await auditTopology(lockedTopology);
    assertSameAudit(initialAudit, lockedAudit);

    await updateTasks(transactions.get(connections.tasks.name), targetRows);
    for (const mirror of connections.mirrors) {
      await updateMirror(mirror.name, transactions.get(mirror.name), targetRows);
    }

    const inTransactionAudit = await auditTopology(lockedTopology);
    assertFullyMigrated(inTransactionAudit, initialAudit.tasks.codeDigest);

    // Commit audit mirrors first and Tasks (the runtime authority) last. If a
    // mirror commit succeeds but a later commit fails, restore that mirror to
    // 365 while Tasks is still uncommitted.
    for (const mirror of connections.mirrors) {
      await transactions.get(mirror.name).commit();
    }
    await transactions.get(connections.tasks.name).commit();
  } catch (error) {
    for (const transaction of transactions.values()) await rollbackQuietly(transaction);

    // A network error can make a commit result uncertain even when the server
    // accepted it. Require two identical classifications across bounded,
    // backed-off reads before choosing any recovery. A single failed or stale
    // read can never trigger compensation.
    let classification;
    try {
      classification = await classifyTopologyWithRetry(connections, initialAudit);
    } catch (classificationError) {
      throw new MigrationInvariantError(
        `Migration outcome is uncertain. No compensation was attempted. ` +
          `Stop and audit all three databases before any rerun. Classification error: ` +
          `${String(classificationError)}. Original error: ${String(error)}`,
      );
    }

    const action = recoveryAction(classification);
    if (action === "accept-committed") {
      return auditFullyMigratedWithRetry(connections, initialAudit.tasks.codeDigest);
    }
    if (action === "manual-audit") {
      throw new MigrationInvariantError(
        `Migration outcome requires manual audit; no compensation was attempted. ` +
          `Stable classification: ${JSON.stringify(classification)}. ` +
          `Original error: ${String(error)}`,
      );
    }

    const compensationFailures = [];
    if (action === "compensate-mirrors") {
      for (const mirror of connections.mirrors) {
        try {
          await compensateMirror(mirror, targetRows);
        } catch (compensationError) {
          compensationFailures.push(`${mirror.name}: ${String(compensationError)}`);
        }
      }
    }
    if (compensationFailures.length > 0) {
      throw new MigrationInvariantError(
        `Migration failed and mirror compensation also failed (${compensationFailures.join("; ")}). ` +
          `Stop and audit all three databases before any rerun. Original error: ${String(error)}`,
      );
    }

    try {
      const restoredAudit = await auditTopology({
        tasks: connections.tasks,
        mirrors: connections.mirrors,
      });
      assertSameAudit(initialAudit, restoredAudit);
    } catch (restoreError) {
      throw new MigrationInvariantError(
        `Migration failed and the original three-store state could not be re-verified. ` +
          `Stop and audit before any rerun. Restore error: ${String(restoreError)}. ` +
          `Original error: ${String(error)}`,
      );
    }
    throw error;
  }

  return auditFullyMigratedWithRetry(connections, initialAudit.tasks.codeDigest);
}

function parseArgs(args) {
  const expectedCountArgs = args.filter((arg) => arg.startsWith("--expected-count="));
  const expectedDigestArgs = args.filter((arg) => arg.startsWith("--expected-digest="));
  const unknown = args.filter(
    (arg) =>
      !["--apply", "--dry-run", "--help", "-h"].includes(arg) &&
      !arg.startsWith("--expected-count=") &&
      !arg.startsWith("--expected-digest="),
  );
  invariant(unknown.length === 0, `Unknown argument(s): ${unknown.join(", ")}`);
  invariant(expectedCountArgs.length <= 1, "--expected-count may only be supplied once");
  invariant(expectedDigestArgs.length <= 1, "--expected-digest may only be supplied once");
  invariant(
    !(args.includes("--apply") && args.includes("--dry-run")),
    "Choose either --apply or --dry-run, not both",
  );
  const expectedCount = expectedCountArgs[0]?.slice("--expected-count=".length);
  const expectedDigest = expectedDigestArgs[0]?.slice("--expected-digest=".length);
  // Validate paired override syntax even on dry-run/help so a typo can never
  // be carried forward into an apply command.
  resolveApplyPin(expectedCount, expectedDigest);
  return {
    apply: args.includes("--apply"),
    help: args.includes("--help") || args.includes("-h"),
    expectedCount,
    expectedDigest,
  };
}

function envConnection(name, urlName, tokenName) {
  const url = process.env[urlName]?.trim();
  const token = process.env[tokenName]?.trim();
  invariant(url, `Missing env ${urlName}`);
  invariant(
    token || url.startsWith("file:"),
    `Missing env ${tokenName} for remote ${name} database`,
  );
  return {
    name,
    db: createClient({ url, authToken: token || undefined }),
  };
}

function createConnections() {
  return {
    tasks: envConnection("Tasks", "TASKS_DATABASE_URL", "TASKS_AUTH_TOKEN"),
    mirrors: [
      envConnection(
        "Shared entitlements mirror",
        "TURSO_ENTITLEMENTS_DATABASE_URL",
        "TURSO_ENTITLEMENTS_AUTH_TOKEN",
      ),
      envConnection("Studio local mirror", "TURSO_STUDIO_DATABASE_URL", "TURSO_STUDIO_AUTH_TOKEN"),
    ],
  };
}

function printHelp() {
  console.log(`Usage: pnpm venue:migrate-access-18mo [--dry-run | --apply]
       [--expected-count=N --expected-digest=SHA256]

Default: --dry-run (SELECT queries only)
  --dry-run  Audit Tasks plus both mirrors. Never writes.
  --apply    Repeat the audit under write locks, update exact rows, verify,
             commit mirrors first and Tasks last, then verify again.

Apply is pinned by default to the independently audited live set:
  count=${LIVE_AUDITED_CODE_COUNT}
  sha256:${LIVE_AUDITED_CODE_DIGEST}

Both expected-* flags are required together to override that pin for a future,
separately audited code set.

All three database connections are required. The script prints counts and a
SHA-256 code-set digest, never the redemption codes themselves.`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const here = dirname(fileURLToPath(import.meta.url));
  config({ path: resolve(here, "../.env.local"), quiet: true });
  config({ path: resolve(here, "../.env"), quiet: true });

  const connections = createConnections();
  try {
    console.log(args.apply ? "Venue Edition 18-month migration: APPLY" : "Venue Edition 18-month migration: DRY RUN");
    console.log("Tasks is authoritative. Shared and Studio status fields are not used.");

    const initialAudit = await auditTopology({
      tasks: connections.tasks,
      mirrors: connections.mirrors,
    });
    describeAudit(initialAudit, "Preflight parity audit");
    const applyPin = resolveApplyPin(args.expectedCount, args.expectedDigest);
    const pinMatches =
      initialAudit.tasks.rows.length === applyPin.count &&
      initialAudit.tasks.codeDigest === applyPin.digest;
    console.log(
      `  Apply pin (${applyPin.source}): count=${applyPin.count}, ` +
        `sha256:${applyPin.digest} [${pinMatches ? "MATCH" : "MISMATCH"}]`,
    );

    if (!args.apply) {
      console.log("\nDRY RUN complete. No writes were attempted.");
      console.log(
        initialAudit.tasks.targetRows.length === 0
          ? "State is already fully migrated; --apply would be a no-op."
          : "Run the same command with --apply only after reviewing these counts and digest.",
      );
      return;
    }

    if (initialAudit.tasks.targetRows.length === 0) {
      assertFullyMigrated(initialAudit, initialAudit.tasks.codeDigest);
      console.log("\nNo-op. Every exact Venue Edition row is already 548 days in all three databases.");
      return;
    }

    assertApplyPin(initialAudit.tasks, applyPin);
    console.log(`\nApply pin matched (${applyPin.source}).`);

    const postAudit = await applyMigration(connections, initialAudit);
    describeAudit(postAudit, "Post-commit verification");
    console.log("\nAPPLY complete. Tasks entitlements now expire at started_at + 548 days.");
  } finally {
    connections.tasks.db.close();
    for (const mirror of connections.mirrors) mirror.db.close();
  }
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  main().catch((error) => {
    console.error(`\nABORTED: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
}
