import assert from "node:assert/strict";
import { test } from "node:test";

import { attributeAction, type RedemptionLink } from "./attribution";

const SUBJECT = "s".repeat(32);
const DAY = 86_400_000;
const REDEEMED = 1_785_000_000_000;

function link(overrides: Partial<RedemptionLink> = {}): RedemptionLink {
  return {
    subjectIdHash: SUBJECT,
    sponsorId: "sponsor_glenmara",
    redeemedAt: REDEEMED,
    endedAt: null,
    origin: "production",
    ...overrides,
  };
}

test("an action inside the sponsored window attributes to the sponsor", () => {
  const result = attributeAction({ subjectIdHash: SUBJECT, occurredAt: REDEEMED + DAY }, [link()]);
  assert.equal(result.attributed, true);
  if (result.attributed) assert.equal(result.sponsorId, "sponsor_glenmara");
});

test("a subject with no redemption is not attributed", () => {
  const result = attributeAction({ subjectIdHash: "z".repeat(32), occurredAt: REDEEMED }, [link()]);
  assert.equal(result.attributed, false);
  if (!result.attributed) assert.equal(result.reason, "no-redemption");
});

test("work done before redemption is not sponsored use", () => {
  const result = attributeAction({ subjectIdHash: SUBJECT, occurredAt: REDEEMED - DAY }, [link()]);
  assert.equal(result.attributed, false);
  if (!result.attributed) assert.equal(result.reason, "before-redemption");
});

test("work done after access ended is outside the window", () => {
  const result = attributeAction(
    { subjectIdHash: SUBJECT, occurredAt: REDEEMED + 10 * DAY },
    [link({ endedAt: REDEEMED + 5 * DAY })],
  );
  assert.equal(result.attributed, false);
  if (!result.attributed) assert.equal(result.reason, "after-access-ended");
});

test("two sponsors covering the same moment is ambiguous, so neither is credited", () => {
  const result = attributeAction({ subjectIdHash: SUBJECT, occurredAt: REDEEMED + DAY }, [
    link(),
    link({ sponsorId: "sponsor_ashford" }),
  ]);
  assert.equal(result.attributed, false);
  if (!result.attributed) assert.equal(result.reason, "ambiguous-sponsor");
});

test("demo, seed, and view-as chains never count as real use", () => {
  for (const origin of ["demo", "seed", "view-as"] as const) {
    const result = attributeAction(
      { subjectIdHash: SUBJECT, occurredAt: REDEEMED + DAY },
      [link({ origin })],
    );
    assert.equal(result.attributed, false, `${origin} must not count`);
    if (!result.attributed) assert.equal(result.reason, "non-production-origin");
  }
});

test("the boundary moments of the window are inclusive", () => {
  assert.equal(
    attributeAction({ subjectIdHash: SUBJECT, occurredAt: REDEEMED }, [link()]).attributed,
    true,
  );
  assert.equal(
    attributeAction({ subjectIdHash: SUBJECT, occurredAt: REDEEMED + 5 * DAY }, [
      link({ endedAt: REDEEMED + 5 * DAY }),
    ]).attributed,
    true,
  );
});

test("the same sponsor recorded twice is not ambiguous", () => {
  const result = attributeAction({ subjectIdHash: SUBJECT, occurredAt: REDEEMED + DAY }, [
    link(),
    link({ redeemedAt: REDEEMED - DAY }),
  ]);
  assert.equal(result.attributed, true);
});
