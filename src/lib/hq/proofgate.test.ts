import assert from "node:assert/strict";
import test from "node:test";
import { getProofGate } from "./proofgate";
import type { TractionState } from "./traction";
import type { DbProspect } from "../db/schema";

// Only these fields are consumed by the proof projection. All counts are synthetic.
const traction = {
  available: true, paidVenues: 2, signedUnpaidVenues: 3,
  couplesSeeded: 9876, codesRedeemed: 17,
} as TractionState;
const date = (day: string) => Date.parse(`${day}T12:00:00Z`);
const prospect = (day: string | null, segment = "venue", stage = "demo_booked") => ({ lastContactedAt: day, segment, stage }) as DbProspect;

test("redemption is distribution; entitlement and code counts never become useful activation", () => {
  const gate = getProofGate(traction, [], date("2027-01-22"));
  assert.deepEqual(gate.metrics.codesRedeemed, {
    kind: "live", n: 17, target: 0, met: false,
    note: "all sources · access redemption only · not couples or useful actions",
  });
  assert.equal(gate.metrics.couplesActivated.kind, "unread");
  assert.equal(gate.metrics.sharedArtifacts.kind, "unread");
  assert.doesNotMatch(JSON.stringify(gate), /9876/);
});

test("missing ledgers and CRM stay unread rather than falling back to examples or zero use", () => {
  const gate = getProofGate({ available: false, reason: "Synthetic offline source" }, undefined, date("2026-09-04"));
  for (const metric of Object.values(gate.metrics)) assert.equal(metric.kind, "unread");
  assert.equal(gate.sent, 0);
  assert.equal(gate.firstSendDay, null);
});

test("January target keeps the clock in internal testing and never automatically passes a milestone", () => {
  for (const day of ["2026-09-04", "2027-01-20", "2027-01-21", "2027-03-25"]) {
    const gate = getProofGate(traction, [prospect("2026-05-25")], date(day));
    assert.equal(gate.clock.state, day < "2027-01-21" ? "prelaunch" : "inert");
    assert.equal(gate.clock.milestones[0].date, "2027-01-21");
    assert.equal(gate.clock.milestones[0].done, false);
    assert.equal(gate.clock.milestones[0].missed, false);
    assert.match(gate.clock.line, /manual/);
    assert.doesNotMatch(gate.clock.line, /2026-08-07|expired/);
  }
});

test("venue proof excludes historical, future, invalid, unsent and other-segment CRM records", () => {
  const gate = getProofGate(traction, [
    prospect("2026-05-25"), prospect("2027-01-23"), prospect("2027-02-30"),
    prospect(null), prospect("not-a-date"), prospect("2027-01-21", "student"),
    prospect("2027-01-21", "venue", "replied"), prospect("2027-01-22"),
  ], date("2027-01-22"));
  assert.equal(gate.sent, 2);
  assert.equal(gate.firstSendDay, "2027-01-21");
  assert.equal(gate.metrics.qualifiedReplies.kind === "live" && gate.metrics.qualifiedReplies.n, 2);
  assert.equal(gate.metrics.bookedCalls.kind === "live" && gate.metrics.bookedCalls.n, 1);
  assert.equal(gate.clock.state, "running");
  assert.match(gate.clock.line, /do not establish launch approval/);
});

test("launch readiness uses January and never equates cash or a passed target with release approval", async () => {
  const { getLaunchReadiness } = await import("./launch");
  for (const day of ["2026-09-04", "2027-01-21", "2027-03-25"]) {
    const readiness = getLaunchReadiness(999, date(day));
    assert.equal(readiness.launchDate, "2027-01-21");
    assert.equal(readiness.launched, false);
    assert.equal(readiness.cleared, 0);
    assert.deepEqual(readiness.gates.map((g) => g.key), ["user_launch", "first_outreach"]);
    assert.ok(readiness.gates.every((g) => g.state === "pending" && !g.live));
  }
});
