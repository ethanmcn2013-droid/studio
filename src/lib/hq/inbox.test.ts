/**
 * Tests for the HQ inbox aggregator's pure sort + count helper.
 *
 * Run: npx tsx --test src/lib/hq/inbox.test.ts
 *
 * The fs/cron-reading bits live in inbox.ts behind `server-only` and
 * aren't easy to test without mocks. The pure finalize step that
 * gives the inbox its visible shape — tier ranking, date ordering,
 * tier counts — lives in inbox-pure and is what these tests cover.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { finalizeInbox, type InboxItem } from "./inbox-pure";

function item(
  partial: Partial<InboxItem> & {
    id: string;
    tier: InboxItem["tier"];
    source: InboxItem["source"];
    title: string;
  },
): InboxItem {
  return {
    detail: partial.detail ?? "",
    href: partial.href,
    date: partial.date,
    ...partial,
  };
}

test("finalizeInbox: empty input → empty result with zero tier counts", () => {
  const { items, tierCounts } = finalizeInbox([]);
  assert.equal(items.length, 0);
  assert.deepEqual(tierCounts, { high: 0, mid: 0, low: 0 });
});

test("finalizeInbox: sorts high → mid → low", () => {
  const input: InboxItem[] = [
    item({ id: "a", tier: "low", source: "prospect", title: "A" }),
    item({ id: "b", tier: "high", source: "vercel-deploy", title: "B" }),
    item({ id: "c", tier: "mid", source: "risk", title: "C" }),
  ];
  const { items } = finalizeInbox(input);
  assert.deepEqual(
    items.map((i) => i.id),
    ["b", "c", "a"],
  );
});

test("finalizeInbox: within tier, oldest date first", () => {
  const input: InboxItem[] = [
    item({ id: "newer", tier: "high", source: "risk", title: "Newer", date: "2026-05-10" }),
    item({ id: "older", tier: "high", source: "risk", title: "Older", date: "2026-05-05" }),
    item({ id: "newest", tier: "high", source: "risk", title: "Newest", date: "2026-05-14" }),
  ];
  const { items } = finalizeInbox(input);
  assert.deepEqual(
    items.map((i) => i.id),
    ["older", "newer", "newest"],
  );
});

test("finalizeInbox: undated items sort after dated ones within tier", () => {
  const input: InboxItem[] = [
    item({ id: "undated", tier: "mid", source: "risk", title: "Undated" }),
    item({ id: "dated", tier: "mid", source: "risk", title: "Dated", date: "2026-05-10" }),
  ];
  const { items } = finalizeInbox(input);
  assert.deepEqual(
    items.map((i) => i.id),
    ["dated", "undated"],
  );
});

test("finalizeInbox: ties on tier+date break by title alphabetically", () => {
  const input: InboxItem[] = [
    item({ id: "b", tier: "low", source: "decision-review", title: "Beta", date: "2026-05-10" }),
    item({ id: "a", tier: "low", source: "decision-review", title: "Alpha", date: "2026-05-10" }),
    item({ id: "c", tier: "low", source: "decision-review", title: "Charlie", date: "2026-05-10" }),
  ];
  const { items } = finalizeInbox(input);
  assert.deepEqual(
    items.map((i) => i.id),
    ["a", "b", "c"],
  );
});

test("finalizeInbox: tier counts tally accurately", () => {
  const input: InboxItem[] = [
    item({ id: "h1", tier: "high", source: "vercel-deploy", title: "H1" }),
    item({ id: "h2", tier: "high", source: "vercel-deploy", title: "H2" }),
    item({ id: "m1", tier: "mid", source: "risk", title: "M1" }),
    item({ id: "l1", tier: "low", source: "decision-review", title: "L1" }),
    item({ id: "l2", tier: "low", source: "decision-review", title: "L2" }),
    item({ id: "l3", tier: "low", source: "prospect", title: "L3" }),
  ];
  const { tierCounts } = finalizeInbox(input);
  assert.deepEqual(tierCounts, { high: 2, mid: 1, low: 3 });
});

test("finalizeInbox: doesn't mutate the input array", () => {
  const input: InboxItem[] = [
    item({ id: "a", tier: "low", source: "decision-review", title: "A" }),
    item({ id: "b", tier: "high", source: "vercel-deploy", title: "B" }),
  ];
  const inputOrder = input.map((i) => i.id);
  finalizeInbox(input);
  assert.deepEqual(
    input.map((i) => i.id),
    inputOrder,
  );
});
