import assert from "node:assert/strict";
import { test } from "node:test";
import { getTableColumns } from "drizzle-orm";

import { venueSurfaceViews } from "@/lib/db/schema";
import {
  isPrefetchRequest,
  readPageViews,
  recordPageView,
  summarisePageViews,
  utcDayKey,
  utcDayWindow,
  type VenueSurfaceViewRow,
  type VenueSurfaceViewStore,
} from "./venue-edition-page-views";

function headersOf(entries: Record<string, string> = {}) {
  const lower = new Map(
    Object.entries(entries).map(([key, value]) => [key.toLowerCase(), value]),
  );
  return { get: (name: string) => lower.get(name.toLowerCase()) ?? null };
}

function storeOf(
  rows: VenueSurfaceViewRow[],
  onIncrement?: (surface: string, day: string) => void,
): VenueSurfaceViewStore {
  return {
    async increment(surface, day) {
      onIncrement?.(surface, day);
    },
    async read(_surface, days) {
      return rows.filter((row) => days.includes(row.day));
    },
  };
}

// ── The stored shape ─────────────────────────────────────────────────────────

test("the store holds a surface, a day and a count, and nothing that identifies a reader", () => {
  const columns = Object.keys(getTableColumns(venueSurfaceViews)).sort();
  assert.deepEqual(columns, [
    "day",
    "firstRecordedAt",
    "surface",
    "updatedAt",
    "views",
  ]);

  // E09.01 §6.1 frozen forbidden list, plus the fields a page-view counter is
  // most likely to acquire by accident. Adding any of them fails here.
  const forbidden = [
    "ip",
    "ipAddress",
    "userAgent",
    "user_agent",
    "referrer",
    "referer",
    "path",
    "url",
    "href",
    "slug",
    "token",
    "tokenHash",
    "sessionHash",
    "sessionId",
    "visitorId",
    "cookieId",
    "clerkId",
    "userId",
    "country",
    "region",
    "device",
    "browser",
  ];
  for (const field of forbidden) {
    assert.equal(
      columns.includes(field),
      false,
      `venue_surface_views must never carry ${field}`,
    );
  }
});

// ── Days ─────────────────────────────────────────────────────────────────────

test("the day key is the UTC calendar day", () => {
  assert.equal(utcDayKey(Date.UTC(2026, 7, 3, 12, 0, 0)), "2026-08-03");
  // Just before and just after UTC midnight: two different days, no local drift.
  assert.equal(utcDayKey(Date.UTC(2026, 7, 3, 23, 59, 59)), "2026-08-03");
  assert.equal(utcDayKey(Date.UTC(2026, 7, 4, 0, 0, 0)), "2026-08-04");
});

test("the window is generated, oldest first, so coverage is declared against it", () => {
  assert.deepEqual(utcDayWindow(Date.UTC(2026, 7, 3), 3), [
    "2026-08-01",
    "2026-08-02",
    "2026-08-03",
  ]);
  assert.deepEqual(utcDayWindow(Date.UTC(2026, 7, 3), 1), ["2026-08-03"]);
  assert.equal(utcDayWindow(Date.UTC(2026, 7, 3), 0).length, 1);
  assert.equal(utcDayWindow(Date.UTC(2026, 7, 3), 30).length, 30);
});

// ── Recording ────────────────────────────────────────────────────────────────

test("a prefetch is the router warming a page, not a person opening it", async () => {
  assert.equal(isPrefetchRequest(headersOf({ "Next-Router-Prefetch": "1" })), true);
  assert.equal(
    isPrefetchRequest(headersOf({ "Sec-Purpose": "prefetch;prerender" })),
    true,
  );
  assert.equal(isPrefetchRequest(headersOf({ Purpose: "prefetch" })), true);
  assert.equal(isPrefetchRequest(headersOf({ RSC: "1" })), false);
  assert.equal(isPrefetchRequest(headersOf()), false);

  let increments = 0;
  const outcome = await recordPageView("venues", {
    store: storeOf([], () => {
      increments += 1;
    }),
    headers: headersOf({ "Next-Router-Prefetch": "1" }),
    now: Date.UTC(2026, 7, 3),
  });
  assert.deepEqual(outcome, { recorded: false, reason: "prefetch" });
  assert.equal(increments, 0);
});

test("a real view increments the surface for that UTC day", async () => {
  const seen: Array<[string, string]> = [];
  const outcome = await recordPageView("venues_demo", {
    store: storeOf([], (surface, day) => seen.push([surface, day])),
    headers: headersOf({ RSC: "1" }),
    now: Date.UTC(2026, 7, 3, 9, 30),
  });
  assert.deepEqual(outcome, {
    recorded: true,
    surface: "venues_demo",
    day: "2026-08-03",
  });
  assert.deepEqual(seen, [["venues_demo", "2026-08-03"]]);
});

test("a missing store and a failed write are outcomes, never exceptions", async () => {
  assert.deepEqual(
    await recordPageView("venues", { store: null, headers: headersOf() }),
    { recorded: false, reason: "store-not-configured" },
  );

  const throwing: VenueSurfaceViewStore = {
    async increment() {
      throw new Error("libsql unreachable");
    },
    async read() {
      return [];
    },
  };
  assert.deepEqual(
    await recordPageView("venues", { store: throwing, headers: headersOf() }),
    { recorded: false, reason: "write-failed" },
  );
});

// ── Reading: the honesty contract ────────────────────────────────────────────

const WINDOW = ["2026-08-01", "2026-08-02", "2026-08-03"];

test("a full window reads exact", () => {
  assert.deepEqual(
    summarisePageViews(WINDOW, [
      { day: "2026-08-01", views: 4 },
      { day: "2026-08-02", views: 0 },
      { day: "2026-08-03", views: 7 },
    ]),
    { state: "exact", value: 11 },
  );
});

test("a day with no row is a gap, so the total is a lower bound", () => {
  // The failure this forbids: reporting 11 as if the missing day were zero.
  assert.deepEqual(
    summarisePageViews(WINDOW, [
      { day: "2026-08-01", views: 4 },
      { day: "2026-08-03", views: 7 },
    ]),
    { state: "lower_bound", value: 11 },
  );
});

test("no rows at all is unavailable, never zero", () => {
  assert.deepEqual(summarisePageViews(WINDOW, []), {
    state: "unavailable",
    reason: "no-record",
  });
});

test("a stored zero is a real zero, and only a stored zero is", () => {
  // The distinction the whole design turns on: a recorded quiet day is exact,
  // an unrecorded day is not a quiet day.
  assert.deepEqual(
    summarisePageViews(["2026-08-03"], [{ day: "2026-08-03", views: 0 }]),
    { state: "exact", value: 0 },
  );
  assert.deepEqual(summarisePageViews(["2026-08-03"], []), {
    state: "unavailable",
    reason: "no-record",
  });
});

test("rows outside the window are ignored and a corrupt count is a gap", () => {
  assert.deepEqual(
    summarisePageViews(WINDOW, [
      { day: "2026-07-31", views: 9_000 },
      { day: "2026-08-01", views: 4 },
      { day: "2026-08-02", views: -1 },
      { day: "2026-08-03", views: 1.5 },
    ]),
    { state: "lower_bound", value: 4 },
  );
});

test("an unconfigured store, an empty period and a failed read all read unavailable", async () => {
  assert.deepEqual(await readPageViews("venues", { store: null, days: WINDOW }), {
    state: "unavailable",
    reason: "store-not-configured",
  });

  assert.deepEqual(
    await readPageViews("venues", { store: storeOf([]), days: [] }),
    { state: "unavailable", reason: "no-period" },
  );

  const throwing: VenueSurfaceViewStore = {
    async increment() {},
    async read() {
      throw new Error("libsql unreachable");
    },
  };
  assert.deepEqual(
    await readPageViews("venues", { store: throwing, days: WINDOW }),
    { state: "unavailable", reason: "read-failed" },
  );
});

test("the read never returns a bare number without a state", async () => {
  const value = await readPageViews("venues", {
    store: storeOf([{ day: "2026-08-03", views: 3 }]),
    days: WINDOW,
  });
  assert.equal(value.state, "lower_bound");
  assert.equal("value" in value ? value.value : null, 3);
});
