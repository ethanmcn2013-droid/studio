import assert from "node:assert/strict";
import { test } from "node:test";

import { hashIdentity } from "./emitter";
import {
  ingestMeaningfulAction,
  saltEpoch,
  toRedemptionLinks,
  type IngestDeps,
} from "./ingest";
import { createTestEntitlementsDb, seedRedeemedCode, seedSponsor } from "./test-db";

const SALT = "salt-of-at-least-sixteen";
const CLERK_ID = "user_abc";
const REDEEMED_AT = Date.UTC(2026, 5, 1, 9);
const OCCURRED_AT = Date.UTC(2026, 5, 10, 9);

const EVENTS_DDL = `CREATE TABLE sponsor_usage_events (
  event_id text PRIMARY KEY,
  instrumentation_version text NOT NULL DEFAULT 'instrumentation.v1',
  product text NOT NULL,
  kind text NOT NULL,
  occurred_at integer NOT NULL,
  subject_id_hash text NOT NULL,
  workspace_id_hash text NOT NULL,
  sponsor_id text REFERENCES sponsors(id),
  attribution_state text NOT NULL,
  attribution_reason text,
  hash_salt_epoch text NOT NULL,
  local_date text NOT NULL,
  ingested_at integer NOT NULL DEFAULT (unixepoch() * 1000)
)`;

function event(overrides: Record<string, unknown> = {}) {
  return {
    eventId: "evt_1",
    instrumentationVersion: "instrumentation.v1",
    product: "tasks",
    kind: "task_completed",
    occurredAt: OCCURRED_AT,
    subjectIdHash: hashIdentity(CLERK_ID, SALT),
    workspaceIdHash: hashIdentity("ws_1", SALT),
    ...overrides,
  };
}

async function harness() {
  const db = await createTestEntitlementsDb([EVENTS_DDL]);
  await seedSponsor(db, { id: "sp_1", slug: "glenmara" });
  await seedRedeemedCode(db, {
    sponsorId: "sp_1",
    codeId: "lc_1",
    code: "GH-1",
    userClerkId: CLERK_ID,
    redeemedAt: REDEEMED_AT,
  });

  // The real read path: redemptions -> license_codes -> sponsors, hashed here.
  const rows = await db.client.execute(`
    SELECT r.user_clerk_id AS user_clerk_id, lc.sponsor_id AS sponsor_id,
           r.redeemed_at AS redeemed_at
    FROM redemptions r
    JOIN license_codes lc ON lc.id = r.code_id`);
  const links = toRedemptionLinks(
    rows.rows.map((r) => ({
      userClerkId: String(r.user_clerk_id),
      sponsorId: String(r.sponsor_id),
      redeemedAt: Number(r.redeemed_at),
    })),
    SALT,
  );

  const insert: IngestDeps["insert"] = async (row) => {
    await db.client.execute({
      sql: `INSERT INTO sponsor_usage_events
              (event_id, instrumentation_version, product, kind, occurred_at,
               subject_id_hash, workspace_id_hash, sponsor_id, attribution_state,
               attribution_reason, hash_salt_epoch, local_date)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
            ON CONFLICT(event_id) DO NOTHING`,
      args: [
        row.eventId,
        row.instrumentationVersion,
        row.product,
        row.kind,
        row.occurredAt,
        row.subjectIdHash,
        row.workspaceIdHash,
        row.sponsorId,
        row.attributionState,
        row.attributionReason,
        row.hashSaltEpoch,
        row.localDate,
      ],
    });
  };

  return { db, links, deps: { insert, links, salt: SALT } satisfies IngestDeps };
}

test("a sponsored action attributes to the venue through the redemption chain", async () => {
  const { db, deps } = await harness();
  const outcome = await ingestMeaningfulAction(event(), deps);
  assert.equal(outcome.stored, true);
  if (outcome.stored) {
    assert.equal(outcome.attribution, "attributed");
    assert.equal(outcome.sponsorId, "sp_1");
  }
  const stored = await db.client.execute("SELECT * FROM sponsor_usage_events");
  assert.equal(stored.rows.length, 1);
  assert.equal(stored.rows[0].sponsor_id, "sp_1");
  assert.equal(stored.rows[0].local_date, "2026-06-10");
  db.close();
});

test("replaying an event id does not double count", async () => {
  const { db, deps } = await harness();
  await ingestMeaningfulAction(event(), deps);
  await ingestMeaningfulAction(event(), deps);
  await ingestMeaningfulAction(event(), deps);
  const stored = await db.client.execute(
    "SELECT count(*) c FROM sponsor_usage_events",
  );
  assert.equal(Number(stored.rows[0].c), 1);
  db.close();
});

test("an unknown subject is stored unattributed, not credited to a venue", async () => {
  const { db, deps } = await harness();
  const outcome = await ingestMeaningfulAction(
    event({ eventId: "evt_2", subjectIdHash: hashIdentity("stranger", SALT) }),
    deps,
  );
  assert.equal(outcome.stored, true);
  if (outcome.stored) assert.equal(outcome.attribution, "unattributed");
  const row = (
    await db.client.execute("SELECT * FROM sponsor_usage_events WHERE event_id='evt_2'")
  ).rows[0];
  assert.equal(row.sponsor_id, null);
  assert.equal(row.attribution_state, "unattributed");
  assert.equal(row.attribution_reason, "no-redemption");
  db.close();
});

test("action before redemption is not sponsored use", async () => {
  const { db, deps } = await harness();
  await ingestMeaningfulAction(
    event({ eventId: "evt_3", occurredAt: REDEEMED_AT - 86_400_000 }),
    deps,
  );
  const row = (
    await db.client.execute("SELECT * FROM sponsor_usage_events WHERE event_id='evt_3'")
  ).rows[0];
  assert.equal(row.sponsor_id, null);
  assert.equal(row.attribution_reason, "before-redemption");
  db.close();
});

test("a missing salt stores nothing, because a config fault is not low adoption", async () => {
  const { db, deps } = await harness();
  const outcome = await ingestMeaningfulAction(event(), { ...deps, salt: null });
  assert.equal(outcome.stored, false);
  if (!outcome.stored) assert.equal(outcome.reason, "salt-unavailable");
  const stored = await db.client.execute(
    "SELECT count(*) c FROM sponsor_usage_events",
  );
  assert.equal(Number(stored.rows[0].c), 0);
  db.close();
});

test("an invalid event never reaches the database", async () => {
  const { db, deps } = await harness();
  for (const bad of [
    event({ kind: "page_view" }),
    event({ title: "a private note title" }),
    event({ subjectIdHash: "user_abc" }),
    { nonsense: true },
  ]) {
    const outcome = await ingestMeaningfulAction(bad, deps);
    assert.equal(outcome.stored, false);
  }
  const stored = await db.client.execute(
    "SELECT count(*) c FROM sponsor_usage_events",
  );
  assert.equal(Number(stored.rows[0].c), 0);
  db.close();
});

test("no raw identifier is written to the event row", async () => {
  const { db, deps } = await harness();
  await ingestMeaningfulAction(event(), deps);
  const dump = JSON.stringify(
    (await db.client.execute("SELECT * FROM sponsor_usage_events")).rows,
  );
  assert.ok(!dump.includes(CLERK_ID), "the clerk id must not be stored");
  assert.ok(!dump.includes("ws_1"), "the workspace id must not be stored");
  assert.ok(!dump.includes("GH-1"), "no code value may appear");
  db.close();
});

test("the salt epoch is recorded so a rotation reads as a coverage break", async () => {
  const { db, deps } = await harness();
  await ingestMeaningfulAction(event(), deps);
  const row = (await db.client.execute("SELECT * FROM sponsor_usage_events")).rows[0];
  assert.equal(row.hash_salt_epoch, saltEpoch(SALT));
  assert.notEqual(saltEpoch(SALT), saltEpoch("a-different-salt-entirely"));
  db.close();
});

test("the epoch fingerprint does not expose the salt", () => {
  const epoch = saltEpoch(SALT);
  assert.match(epoch, /^[0-9a-f]{8}$/);
  assert.ok(!epoch.includes(SALT));
});

test("a venue-local evening in summer files under the venue day", async () => {
  const { db, deps } = await harness();
  // 22:30 UTC on 15 June is 23:30 in Dublin: still the 15th locally.
  await ingestMeaningfulAction(
    event({ eventId: "evt_dst", occurredAt: Date.UTC(2026, 5, 15, 22, 30) }),
    deps,
  );
  const row = (
    await db.client.execute(
      "SELECT local_date FROM sponsor_usage_events WHERE event_id='evt_dst'",
    )
  ).rows[0];
  assert.equal(row.local_date, "2026-06-15");
  db.close();
});
