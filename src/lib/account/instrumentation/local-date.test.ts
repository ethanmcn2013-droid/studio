import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DEFAULT_ACCOUNT_TIME_ZONE,
  isLocalDayClosed,
  localDatesBetween,
  toLocalDate,
} from "./local-date";

/** 2026-06-15 22:30 UTC. In Dublin summer time this is already the 15th at 23:30. */
const SUMMER_LATE_UTC = Date.UTC(2026, 5, 15, 22, 30);
/** 2026-06-15 23:30 UTC — Dublin has rolled over to the 16th. */
const SUMMER_ROLLOVER_UTC = Date.UTC(2026, 5, 15, 23, 30);
/** 2026-01-15 23:30 UTC. Dublin runs UTC in winter, so it is still the 15th. */
const WINTER_LATE_UTC = Date.UTC(2026, 0, 15, 23, 30);

test("the default zone is the one the account contract names", () => {
  assert.equal(DEFAULT_ACCOUNT_TIME_ZONE, "Europe/Dublin");
});

test("a local date is the venue's day, not the UTC day", () => {
  // The bug this prevents: late-evening summer activity filed under the day before.
  assert.equal(toLocalDate(SUMMER_LATE_UTC), "2026-06-15");
  assert.equal(toLocalDate(SUMMER_ROLLOVER_UTC), "2026-06-16");
  assert.notEqual(
    toLocalDate(SUMMER_ROLLOVER_UTC),
    new Date(SUMMER_ROLLOVER_UTC).toISOString().slice(0, 10),
  );
});

test("winter timestamps agree with UTC, because Dublin is UTC then", () => {
  assert.equal(toLocalDate(WINTER_LATE_UTC), "2026-01-15");
  assert.equal(
    toLocalDate(WINTER_LATE_UTC),
    new Date(WINTER_LATE_UTC).toISOString().slice(0, 10),
  );
});

test("dates are returned as YYYY-MM-DD", () => {
  assert.match(toLocalDate(Date.UTC(2026, 10, 3, 9)), /^\d{4}-\d{2}-\d{2}$/);
});

test("a non-finite timestamp is refused rather than silently bucketed", () => {
  assert.throws(() => toLocalDate(Number.NaN), /finite timestamp/);
});

test("a window lists every local day inclusively, oldest first", () => {
  const days = localDatesBetween(
    Date.UTC(2026, 5, 1, 12),
    Date.UTC(2026, 5, 5, 12),
  );
  assert.deepEqual(days, [
    "2026-06-01",
    "2026-06-02",
    "2026-06-03",
    "2026-06-04",
    "2026-06-05",
  ]);
});

test("the spring-forward day is not skipped", () => {
  // Ireland springs forward on 2026-03-29; that local day is only 23 hours long.
  const days = localDatesBetween(
    Date.UTC(2026, 2, 28, 12),
    Date.UTC(2026, 2, 30, 12),
  );
  assert.deepEqual(days, ["2026-03-28", "2026-03-29", "2026-03-30"]);
});

test("the autumn-back day appears exactly once", () => {
  // 2026-10-25 is 25 hours long locally; it must not be counted twice.
  const days = localDatesBetween(
    Date.UTC(2026, 9, 24, 12),
    Date.UTC(2026, 9, 26, 12),
  );
  assert.deepEqual(days, ["2026-10-24", "2026-10-25", "2026-10-26"]);
});

test("an inverted window yields nothing", () => {
  assert.deepEqual(localDatesBetween(Date.UTC(2026, 5, 5), Date.UTC(2026, 5, 1)), []);
});

test("today is never closed, so a partial day cannot be reported as whole", () => {
  const now = Date.UTC(2026, 5, 15, 14);
  assert.equal(isLocalDayClosed(toLocalDate(now), now), false);
});

test("a future day is never closed", () => {
  const now = Date.UTC(2026, 5, 15, 14);
  assert.equal(isLocalDayClosed("2026-06-16", now), false);
});

test("yesterday closes only after the local grace hour", () => {
  const beforeGrace = Date.UTC(2026, 0, 16, 3); // 03:00 Dublin, winter
  const afterGrace = Date.UTC(2026, 0, 16, 8); // 08:00 Dublin
  assert.equal(isLocalDayClosed("2026-01-15", beforeGrace), false);
  assert.equal(isLocalDayClosed("2026-01-15", afterGrace), true);
});

test("older days are closed regardless of the grace hour", () => {
  const early = Date.UTC(2026, 0, 16, 1);
  assert.equal(isLocalDayClosed("2026-01-10", early), true);
});
