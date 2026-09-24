/**
 * HQ monitors the App's live crons, not the retired standalone Signal job.
 * Source-level contract: runs.ts imports server-only and the database.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const runs = readFileSync("src/lib/cron/runs.ts", "utf8");
const schema = readFileSync("src/lib/db/schema.ts", "utf8");

const monitored = [...runs.matchAll(/\{ source: "([a-z_]+)", label:/g)].map((m) => m[1]);
const accepted = [...(schema.match(/CRON_RUN_SOURCES = \[([^\]]*)\]/)?.[1] ?? "").matchAll(/"([a-z_]+)"/g)].map((m) => m[1]);

test("HQ monitors exactly the App's three crons", () => {
  assert.deepEqual(monitored, ["app_analytics_snapshots", "app_drive_grant_repair", "tasks_digest"]);
});

test("every monitored job is an accepted ping source", () => {
  for (const source of monitored) assert.ok(accepted.includes(source), source);
});

test("the retired Signal briefing job is accepted but not monitored", () => {
  assert.ok(accepted.includes("analytics_daily"));
  assert.ok(!monitored.includes("analytics_daily"));
});
