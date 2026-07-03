/**
 * Tests for the pure `shapeNativePayload` shaper.
 *
 * Run: pnpm exec tsx --test src/server/today/shape-native.test.ts
 *
 * Covers the load-bearing server-decides logic the iOS client trusts:
 *  - Time-of-day greeting (§2)
 *  - "This Evening" visibility (§2)
 *  - Anchor card priority (§1 R3)
 *  - Section composition + visibility flags (§1)
 *
 * Timezone-sensitive cases use a fixed `nowMs` and an explicit IANA tz
 * so the suite is deterministic across CI runners.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  pickGreetingPhrase,
  shapeNativePayload,
  shouldShowEvening,
} from "./shape-native";
import type { TodayNativeRequest, TodayResponse } from "./types";

// 2026-05-21 14:30 UTC. In Europe/Dublin (UTC+1 in May), local hour = 15.
// In America/Los_Angeles (UTC-7 in May), local hour = 07.
const NOW_MS = new Date("2026-05-21T14:30:00Z").getTime();

const baseRequest: TodayNativeRequest = {
  clerkId: "user_test",
  email: "anya.smith@example.ie",
  name: "Anya Smith",
  timezone: "Europe/Dublin",
  locale: "en-IE",
  nowMs: NOW_MS,
};

function emptyResponse(): TodayResponse {
  return {
    generatedAt: NOW_MS,
    tasks: null,
    notes: null,
    roadmap: null,
    analytics: null,
    reads: {
      tasks: "ok",
      notes: "ok",
      roadmap: "ok",
      analytics: "ok",
    },
  };
}

// ── Greeting phrase logic ─────────────────────────────────────────────────

test("greeting: 04:00–11:59 says good morning", () => {
  assert.equal(pickGreetingPhrase("Anya", 4), "Good morning, Anya.");
  assert.equal(pickGreetingPhrase("Anya", 8), "Good morning, Anya.");
  assert.equal(pickGreetingPhrase("Anya", 11), "Good morning, Anya.");
});

test("greeting: 12:00–18:59 says afternoon", () => {
  assert.equal(pickGreetingPhrase("Anya", 12), "Afternoon, Anya.");
  assert.equal(pickGreetingPhrase("Anya", 14), "Afternoon, Anya.");
  assert.equal(pickGreetingPhrase("Anya", 18), "Afternoon, Anya.");
});

test("greeting: 19:00–02:59 says evening", () => {
  assert.equal(pickGreetingPhrase("Anya", 19), "Evening, Anya.");
  assert.equal(pickGreetingPhrase("Anya", 23), "Evening, Anya.");
  assert.equal(pickGreetingPhrase("Anya", 0), "Evening, Anya.");
  assert.equal(pickGreetingPhrase("Anya", 2), "Evening, Anya.");
});

test("greeting: 03:00–03:59 is the up-late band", () => {
  assert.equal(pickGreetingPhrase("Anya", 3), "Up late, Anya.");
});

test("greeting: blank name falls back to 'there'", () => {
  assert.equal(pickGreetingPhrase("", 9), "Good morning, there.");
  assert.equal(pickGreetingPhrase("   ", 9), "Good morning, there.");
});

// ── This Evening visibility ───────────────────────────────────────────────

test("evening: visible 15:00–02:59, hidden otherwise", () => {
  // Hidden band (03:00–14:59)
  for (const h of [3, 4, 10, 11, 12, 14]) {
    assert.equal(shouldShowEvening(h), false, `hour ${h} should hide evening`);
  }
  // Visible band (15:00–02:59)
  for (const h of [15, 18, 19, 23, 0, 2]) {
    assert.equal(shouldShowEvening(h), true, `hour ${h} should show evening`);
  }
});

// ── Anchor card selection ─────────────────────────────────────────────────

test("anchor: prefers shipped-last-24h tasks when present", () => {
  const response = emptyResponse();
  response.tasks = [
    {
      workspaceId: "ws1",
      workspaceName: "Hartwell Wedding",
      inYourCourt: 3,
      blocked: 0,
      shippedLast24h: 4,
    },
  ];
  const payload = shapeNativePayload(response, baseRequest);
  assert.equal(payload.anchor.numeral, "4");
  assert.equal(payload.anchor.productSlug, "tasks");
  assert.match(payload.anchor.label, /tasks shipped/);
  assert.equal(payload.anchor.supportingLine, "3 still in your court.");
});

test("anchor: falls through to roadmap shipped-this-week", () => {
  const response = emptyResponse();
  response.roadmap = { upcoming: [], shippedLast7d: 2 };
  const payload = shapeNativePayload(response, baseRequest);
  assert.equal(payload.anchor.numeral, "2");
  assert.equal(payload.anchor.productSlug, "roadmap");
  assert.match(payload.anchor.label, /milestones shipped this week/);
});

test("anchor: falls through to in-your-court count", () => {
  const response = emptyResponse();
  response.tasks = [
    {
      workspaceId: "ws1",
      workspaceName: "Hartwell Wedding",
      inYourCourt: 5,
      blocked: 0,
      shippedLast24h: 0,
    },
  ];
  const payload = shapeNativePayload(response, baseRequest);
  assert.equal(payload.anchor.numeral, "5");
  assert.equal(payload.anchor.productSlug, "tasks");
  assert.match(payload.anchor.label, /items in your court today/);
});

test("anchor: falls through to notes total", () => {
  const response = emptyResponse();
  response.notes = { total: 7, lastTouchedAt: null, lastExcerpt: null };
  const payload = shapeNativePayload(response, baseRequest);
  assert.equal(payload.anchor.numeral, "7");
  assert.equal(payload.anchor.productSlug, "notes");
});

test("anchor: 'welcome' state when no data anywhere", () => {
  const response = emptyResponse();
  const payload = shapeNativePayload(response, baseRequest);
  assert.equal(payload.anchor.numeral, "—");
  assert.match(payload.anchor.label, /Your day starts here/);
});

test("anchor: singular vs plural labels are correct", () => {
  const response = emptyResponse();
  response.tasks = [
    {
      workspaceId: "ws1",
      workspaceName: "Test",
      inYourCourt: 0,
      blocked: 0,
      shippedLast24h: 1,
    },
  ];
  const payload = shapeNativePayload(response, baseRequest);
  assert.match(payload.anchor.label, /task shipped in the last day$/);
});

// ── Section composition ───────────────────────────────────────────────────

test("sections: 'today' is always visible regardless of data", () => {
  const payload = shapeNativePayload(emptyResponse(), baseRequest);
  const today = payload.sections.find((s) => s.id === "today");
  assert.ok(today);
  assert.equal(today.visible, true);
  assert.deepEqual(today.items, []);
});

test("sections: 'today' items are workspace-level, with metadata", () => {
  const response = emptyResponse();
  response.tasks = [
    {
      workspaceId: "ws-hartwell",
      workspaceName: "Hartwell Wedding",
      inYourCourt: 3,
      blocked: 1,
      shippedLast24h: 0,
    },
    {
      workspaceId: "ws-glenmara",
      workspaceName: "Glenmara Project",
      inYourCourt: 2,
      blocked: 0,
      shippedLast24h: 0,
    },
  ];
  const payload = shapeNativePayload(response, baseRequest);
  const today = payload.sections.find((s) => s.id === "today")!;
  assert.equal(today.items.length, 2);
  assert.equal(today.items[0]!.title, "Hartwell Wedding");
  assert.equal(today.items[0]!.meta, "3 in your court · 1 blocked");
  assert.equal(today.items[0]!.deepLink, "https://tasks.signalstudio.ie/app/workspaces/ws-hartwell");
  assert.equal(today.items[1]!.meta, "2 in your court");
});

test("sections: 'today' omits workspaces with zero court+blocked", () => {
  const response = emptyResponse();
  response.tasks = [
    {
      workspaceId: "ws-empty",
      workspaceName: "Empty",
      inYourCourt: 0,
      blocked: 0,
      shippedLast24h: 4,
    },
  ];
  const payload = shapeNativePayload(response, baseRequest);
  const today = payload.sections.find((s) => s.id === "today")!;
  assert.equal(today.items.length, 0);
});

test("sections: 'evening' tracks visibility per local hour", () => {
  // NOW_MS = 14:30 UTC = 15:30 Dublin (May DST), evening visible.
  const dublin = shapeNativePayload(emptyResponse(), baseRequest);
  assert.equal(dublin.sections.find((s) => s.id === "evening")!.visible, true);

  // 14:30 UTC = 07:30 Pacific, evening hidden.
  const pacific = shapeNativePayload(emptyResponse(), {
    ...baseRequest,
    timezone: "America/Los_Angeles",
  });
  assert.equal(pacific.sections.find((s) => s.id === "evening")!.visible, false);
});

test("sections: 'upcoming' visible only with milestones", () => {
  const response = emptyResponse();
  const noPayload = shapeNativePayload(response, baseRequest);
  assert.equal(noPayload.sections.find((s) => s.id === "upcoming")!.visible, false);

  response.roadmap = {
    upcoming: [
      {
        workspaceSlug: "lambs-hill",
        workspaceName: "Lamb's Hill",
        title: "Final walkthrough",
        targetDate: "2026-05-26",
        status: "next",
      },
    ],
    shippedLast7d: 0,
  };
  const withPayload = shapeNativePayload(response, baseRequest);
  const upcoming = withPayload.sections.find((s) => s.id === "upcoming")!;
  assert.equal(upcoming.visible, true);
  assert.equal(upcoming.items.length, 1);
  assert.equal(upcoming.items[0]!.title, "Final walkthrough");
  assert.match(upcoming.items[0]!.meta!, /Lamb's Hill/);
  assert.equal(upcoming.items[0]!.deepLink, "https://timeline.signalstudio.ie/lambs-hill");
});

test("sections: 'caught' surfaces only notes touched within 36h", () => {
  const response = emptyResponse();
  response.notes = {
    total: 5,
    lastTouchedAt: NOW_MS - 3_600_000, // 1h ago
    lastExcerpt: "Voice memo, caterer follow-up",
  };
  const recent = shapeNativePayload(response, baseRequest);
  const caught = recent.sections.find((s) => s.id === "caught")!;
  assert.equal(caught.visible, true);
  assert.equal(caught.items.length, 1);
  assert.equal(caught.items[0]!.title, "Voice memo, caterer follow-up");

  response.notes.lastTouchedAt = NOW_MS - 48 * 3_600_000; // 48h ago
  const stale = shapeNativePayload(response, baseRequest);
  assert.equal(stale.sections.find((s) => s.id === "caught")!.visible, false);
});

// ── User resolution ───────────────────────────────────────────────────────

test("user: first name extraction from full name", () => {
  const payload = shapeNativePayload(emptyResponse(), baseRequest);
  assert.equal(payload.user.name, "Anya");
});

test("user: falls back to email local-part stem when name missing", () => {
  const payload = shapeNativePayload(emptyResponse(), {
    ...baseRequest,
    name: undefined,
    email: "anya.smith@example.ie",
  });
  assert.equal(payload.user.name, "Anya");
  assert.match(payload.greeting.phrase, /Anya/);
});

test("user: timezone falls back to analytics, then UTC", () => {
  const response = emptyResponse();
  response.analytics = { enabled: true, timezone: "Europe/London", cadence: "daily" };

  const fromAnalytics = shapeNativePayload(response, {
    ...baseRequest,
    timezone: undefined,
  });
  assert.equal(fromAnalytics.user.timezone, "Europe/London");

  const fromUtc = shapeNativePayload(emptyResponse(), {
    ...baseRequest,
    timezone: undefined,
  });
  assert.equal(fromUtc.user.timezone, "UTC");
});

// ── Meta envelope ─────────────────────────────────────────────────────────

test("meta: passes through reads health map", () => {
  const response = emptyResponse();
  response.reads = { tasks: "ok", notes: "error", roadmap: "skipped_no_env", analytics: "ok" };
  const payload = shapeNativePayload(response, baseRequest);
  assert.deepEqual(payload.meta.reads, response.reads);
});

test("meta: lastUpdated and serverGeneratedAt are ISO strings", () => {
  const payload = shapeNativePayload(emptyResponse(), baseRequest);
  assert.match(payload.meta.lastUpdated, /^\d{4}-\d{2}-\d{2}T/);
  assert.match(payload.meta.serverGeneratedAt, /^\d{4}-\d{2}-\d{2}T/);
});
