import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildVenueLinkReplacedLog,
  buildVenuePageViewedEvent,
  createInMemoryViewCounter,
  VENUE_EVENT_FORBIDDEN_KEYS,
  VENUE_PAGE_VIEWED_FIELDS,
  venuePageViewedIdempotencyKey,
} from "./event";

/**
 * E13.16 acceptance criterion 8: "The destination route records exactly the
 * fields in section 4.2 and no others, proven by a schema-level test that
 * rejects rather than trims."
 *
 * Rejecting rather than trimming is the whole point. A trimmed field is a
 * field somebody added on purpose and did not notice was dropped; a rejected
 * one fails the build, which is where a change to this contract belongs.
 */

const VALID = {
  accountId: "VEN-0042",
  occurredAt: Date.UTC(2026, 7, 3, 11, 15, 0),
  cohort: 1,
  touch: "email_1",
  state: "invitation" as const,
  firstView: true,
  repeatViewCount: 0,
};

test("section 4.2 is seven fields, and this is the list", () => {
  assert.deepEqual([...VENUE_PAGE_VIEWED_FIELDS], [
    "accountId",
    "occurredAt",
    "cohort",
    "touch",
    "state",
    "firstView",
    "repeatViewCount",
  ]);
});

test("a valid event is built unchanged", () => {
  assert.deepEqual(buildVenuePageViewedEvent({ ...VALID }), VALID);
});

test("an extra field is rejected, never trimmed", () => {
  assert.throws(
    () => buildVenuePageViewedEvent({ ...VALID, sessionId: "abc" }),
    /is not one of them/,
  );
});

test("D-032 R14: a user-agent class cannot be added quietly", () => {
  assert.throws(
    () => buildVenuePageViewedEvent({ ...VALID, userAgentClass: "mobile" }),
    /is not one of them/,
  );
});

test("every field on the never-list is refused by name", () => {
  for (const key of VENUE_EVENT_FORBIDDEN_KEYS) {
    assert.throws(
      () => buildVenuePageViewedEvent({ ...VALID, [key]: "x" }),
      new RegExp(key, "i"),
      key,
    );
  }
});

test("a missing field is refused", () => {
  for (const key of VENUE_PAGE_VIEWED_FIELDS) {
    const input: Record<string, unknown> = { ...VALID };
    delete input[key];
    assert.throws(() => buildVenuePageViewedEvent(input), /missing/, key);
  }
});

test("the token never reaches the event", () => {
  assert.throws(
    () => buildVenuePageViewedEvent({ ...VALID, token: "Kf3rNqW8dJ2mBv5tXcYp7Lz1" }),
    /token/i,
  );
});

test("field types are checked rather than coerced", () => {
  assert.throws(() => buildVenuePageViewedEvent({ ...VALID, accountId: "glenmara" }), /VEN-nnnn/);
  assert.throws(() => buildVenuePageViewedEvent({ ...VALID, cohort: 0 }), /cohort/);
  assert.throws(() => buildVenuePageViewedEvent({ ...VALID, state: "proposed" }), /state/);
  assert.throws(() => buildVenuePageViewedEvent({ ...VALID, firstView: "yes" }), /firstView/);
  assert.throws(
    () => buildVenuePageViewedEvent({ ...VALID, repeatViewCount: -1 }),
    /repeatViewCount/,
  );
});

test("the idempotency key folds a day, so eleven refreshes are one row", () => {
  const morning = buildVenuePageViewedEvent({
    ...VALID,
    occurredAt: Date.UTC(2026, 7, 3, 9, 0, 0),
  });
  const evening = buildVenuePageViewedEvent({
    ...VALID,
    occurredAt: Date.UTC(2026, 7, 3, 21, 0, 0),
    firstView: false,
    repeatViewCount: 4,
  });
  assert.equal(
    venuePageViewedIdempotencyKey(morning),
    venuePageViewedIdempotencyKey(evening),
  );
});

test("the idempotency key separates two days", () => {
  const monday = buildVenuePageViewedEvent({ ...VALID });
  const tuesday = buildVenuePageViewedEvent({
    ...VALID,
    occurredAt: Date.UTC(2026, 7, 4, 11, 15, 0),
  });
  assert.notEqual(
    venuePageViewedIdempotencyKey(monday),
    venuePageViewedIdempotencyKey(tuesday),
  );
});

test("the idempotency key separates two accounts", () => {
  const a = buildVenuePageViewedEvent({ ...VALID });
  const b = buildVenuePageViewedEvent({ ...VALID, accountId: "VEN-0043" });
  assert.notEqual(venuePageViewedIdempotencyKey(a), venuePageViewedIdempotencyKey(b));
});

test("the view counter reports the first view once", () => {
  const counter = createInMemoryViewCounter();
  assert.equal(counter.count("VEN-0042"), 0);
  assert.equal(counter.count("VEN-0042"), 1);
  assert.equal(counter.count("VEN-0043"), 0);
});

test("section 12.6: a replaced hit is three fields and no fourth", () => {
  const line = buildVenueLinkReplacedLog({
    accountId: "VEN-0042",
    occurredAt: VALID.occurredAt,
  });
  assert.deepEqual(Object.keys(line), ["accountId", "occurredAt", "outcome"]);
  assert.equal(line.outcome, "replaced");
});
