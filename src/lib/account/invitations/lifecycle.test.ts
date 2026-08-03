import assert from "node:assert/strict";
import test from "node:test";

import { SPONSOR_INVITATION_STATES } from "@/lib/entitlements-db/schema";
import {
  DAY_MS,
  INVITATION_ACTIONS,
  INVITATION_STATES,
  STALE_INVITATION_DAYS,
  canTransition,
  describeInvitationAction,
  describeInvitationState,
  invitationStaleness,
  legalActions,
  resolveInvitationState,
  staleAlertLine,
  summariseStaleness,
  transitionRule,
  type InvitationState,
} from "./lifecycle";

const NOW = Date.UTC(2026, 7, 3, 12, 0, 0);

test("the state list has not drifted from the schema", () => {
  assert.deepEqual(
    [...INVITATION_STATES],
    [...SPONSOR_INVITATION_STATES],
    "lifecycle.ts declares the states locally to stay client-safe; this is the drift guard",
  );
});

test("accept and decline are refused to a venue actor", () => {
  for (const action of ["accept", "decline"] as const) {
    const verdict = canTransition("sent", action, "venue");
    assert.equal(verdict.allowed, false);
    assert.match(
      verdict.allowed === false ? verdict.reason : "",
      /never set by hand/i,
    );
  }
});

test("a redeemed code moves the invitation to accepted, whatever the record says", () => {
  const resolved = resolveInvitationState({
    recorded: { state: "sent", sentAt: NOW - 5 * DAY_MS },
    ledger: { codeStatus: "redeemed", redeemedAt: NOW - DAY_MS },
    nowMs: NOW,
  });
  assert.equal(resolved.state, "accepted");
  assert.equal(resolved.source, "ledger");
  assert.equal(resolved.acceptedAt, NOW - DAY_MS);
});

test("a record claiming accepted with no redemption is reported as a discrepancy, not believed", () => {
  const resolved = resolveInvitationState({
    recorded: { state: "accepted", sentAt: NOW - 3 * DAY_MS },
    ledger: { codeStatus: "minted", deliveredAt: NOW - 3 * DAY_MS },
    nowMs: NOW,
  });
  assert.equal(resolved.state, "sent", "the ledger has no redemption, so it is not accepted");
  assert.ok(resolved.discrepancy, "the disagreement must be surfaced");
  assert.match(resolved.discrepancy ?? "", /not counted as opened/i);
});

test("an invitation sent with no send date is unknown staleness, never fresh and never zero", () => {
  const resolved = resolveInvitationState({
    recorded: { state: "sent", sentAt: null },
    ledger: { codeStatus: "minted", deliveredAt: null },
    nowMs: NOW,
  });
  assert.equal(resolved.state, "sent");
  assert.equal(resolved.sentAt, null, "a missing timestamp stays null, it never becomes 0");
  assert.equal(resolved.staleness.state, "unknown");
  assert.equal(
    "daysSinceSent" in resolved.staleness,
    false,
    "an unknown verdict must not carry a hidden day count",
  );
});

test("staleness is computed against the declared threshold, at the boundary", () => {
  const atThreshold = invitationStaleness({
    state: "sent",
    sentAt: NOW - STALE_INVITATION_DAYS * DAY_MS,
    nowMs: NOW,
  });
  assert.equal(atThreshold.state, "stale");

  const oneDayShort = invitationStaleness({
    state: "sent",
    sentAt: NOW - (STALE_INVITATION_DAYS - 1) * DAY_MS,
    nowMs: NOW,
  });
  assert.equal(oneDayShort.state, "fresh");
});

test("a send date in the future is unknown, not a fresh invitation", () => {
  const verdict = invitationStaleness({
    state: "sent",
    sentAt: NOW + DAY_MS,
    nowMs: NOW,
  });
  assert.equal(verdict.state, "unknown");
});

test("only the sent state can be stale", () => {
  for (const state of INVITATION_STATES) {
    if (state === "sent") continue;
    const verdict = invitationStaleness({
      state,
      sentAt: NOW - 90 * DAY_MS,
      nowMs: NOW,
    });
    assert.equal(verdict.state, "not_applicable", `${state} must not be stale`);
  }
});

test("an expired code reads as expired even when it was delivered", () => {
  const resolved = resolveInvitationState({
    recorded: null,
    ledger: {
      codeStatus: "minted",
      deliveredAt: NOW - 40 * DAY_MS,
      expiresAt: NOW - DAY_MS,
    },
    nowMs: NOW,
  });
  assert.equal(resolved.state, "expired");
  assert.equal(resolved.source, "clock");
});

test("a redeemed code past its expiry still reads as accepted", () => {
  const resolved = resolveInvitationState({
    recorded: null,
    ledger: {
      codeStatus: "redeemed",
      redeemedAt: NOW - 10 * DAY_MS,
      expiresAt: NOW - DAY_MS,
    },
    nowMs: NOW,
  });
  assert.equal(resolved.state, "accepted", "ledger facts outrank the clock");
});

test("nothing on either side resolves to not_sent, flagged as a fallback", () => {
  const resolved = resolveInvitationState({
    recorded: null,
    ledger: { codeStatus: "minted" },
    nowMs: NOW,
  });
  assert.equal(resolved.state, "not_sent");
  assert.equal(resolved.source, "default");
  assert.equal(resolved.sentAt, null);
});

test("every destructive action carries a confirm word and every safe one does not", () => {
  for (const action of INVITATION_ACTIONS) {
    const rule = transitionRule(action);
    assert.equal(
      rule.destructive,
      rule.confirmWord !== null,
      `${action}: destructive and confirmWord must agree`,
    );
  }
});

test("revoke, replace and expire are the destructive set", () => {
  const destructive = INVITATION_ACTIONS.filter(
    (action) => transitionRule(action).destructive,
  );
  assert.deepEqual([...destructive], ["revoke", "replace", "expire"]);
});

test("accepted, declined and revoked offer a venue no further action", () => {
  for (const state of ["accepted", "declined", "revoked"] as InvitationState[]) {
    assert.deepEqual(legalActions(state, "venue"), [], `${state} must be terminal`);
  }
});

test("expired is not terminal: it can still be revoked or replaced", () => {
  const actions = legalActions("expired", "venue");
  assert.ok(actions.includes("revoke"));
  assert.ok(actions.includes("replace"));
  assert.equal(actions.includes("resend"), false);
});

test("every state and every action has venue-facing copy free of banned vocabulary", () => {
  const banned = /\ballotment\b|\bseats?\b|\bcodes? remaining\b|—|!/i;
  for (const state of INVITATION_STATES) {
    const copy = describeInvitationState(state);
    assert.ok(copy.label.length > 0 && copy.meaning.length > 0);
    assert.doesNotMatch(`${copy.label} ${copy.meaning}`, banned, state);
  }
  for (const action of INVITATION_ACTIONS) {
    const copy = describeInvitationAction(action);
    assert.doesNotMatch(`${copy.label} ${copy.detail}`, banned, action);
  }
});

test("the send actions say plainly that no message leaves the system", () => {
  assert.match(describeInvitationAction("mark_sent").detail, /sends no email/i);
  assert.match(describeInvitationAction("resend").detail, /hand-off/i);
});

test("unknown staleness is counted separately and never folded into stale", () => {
  const summary = summariseStaleness([
    { state: "stale", daysSinceSent: 20, thresholdDays: 14 },
    { state: "unknown", reason: "no send date" },
    { state: "unknown", reason: "no send date" },
    { state: "fresh", daysSinceSent: 2, thresholdDays: 14 },
    { state: "not_applicable", reason: "settled" },
  ]);
  assert.deepEqual(summary, { stale: 1, unknown: 2, thresholdDays: 14 });

  const line = staleAlertLine(summary);
  assert.match(line ?? "", /1 invitation has been with a couple for over 14 days/);
  assert.match(line ?? "", /2 more have no send date recorded/);
});

test("an empty summary produces no alert line rather than a zero", () => {
  const line = staleAlertLine({ stale: 0, unknown: 0, thresholdDays: 14 });
  assert.equal(line, null, "zero findings must not render as a finding");
});
