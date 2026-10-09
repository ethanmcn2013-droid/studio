import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { createClient } from "@libsql/client";
import { addLocalDays } from "../account/instrumentation/local-date";
import { computeReport, reportWindow, type ComputeInput } from "./compute";
import { PROGRAMME_SCHEMA_SQL } from "./schema";
import { getReport, publishReport, restrictProgrammeFamily } from "./storage";
import { createReportAssertion, verifyReportAssertion } from "./auth";
import { parseSponsorReport } from "./validation";
import { reportCsv } from "./export";
import { handleReport, handleInvitations } from "./handlers";

export function specimenInput(): ComputeInput {
  const coveredDates = new Set<string>();
  for (let d = "2026-06-01"; d <= "2026-09-04"; d = addLocalDays(d, 1)) coveredDates.add(d);
  return {
    programme: { id: "venue-programme", sponsorId: "venue-synthetic", kind: "venue", timezone: "Europe/Dublin", agreementVersion: "commercial-terms.v2", measurementStartsOn: "2026-06-01", status: "internal", feedbackCollection: "disabled" },
    claimMonth: "2026-06", now: Date.parse("2026-09-06T12:00:00Z"), dataThrough: "2026-09-04", claimsComplete: true, coveredDates,
    claims: Array.from({ length: 40 }, (_, i) => ({ unitKey: `private-gift-${i}`, scopeHash: `private-project-${i}`, epoch: "aaaaaaaa", claimedOn: "2026-06-15", accessStartsOn: "2026-06-15", accessEndsOn: "2027-12-15", measurementAllowed: true })),
    contributions: Array.from({ length: 30 }, (_, i) => (i < 10 ? ["2026-06-20", "2026-07-10"] : i < 20 ? ["2026-07-20"] : ["2026-06-20", "2026-06-21"]).map(localDate => ({ unitKey: `private-gift-${i}`, localDate }))).flat(),
  };
}
test("one couple gift counted once despite repeated actions; monthly distinct is not summed daily", () => {
  const input = specimenInput();
  input.contributions = [...input.contributions, ...input.contributions];
  const { report } = computeReport(input, () => 0);
  assert.deepEqual(report.metrics.usedDuringPeriod, { state: "privacy_estimate", value: 20 });
  assert.deepEqual(report.metrics.startedPlanning, { state: "privacy_estimate", value: 30 });
  assert.deepEqual(report.metrics.returnedPlanning, { state: "privacy_estimate", value: 20 });
  assert.equal(report.coverage, "complete");
  assert.doesNotMatch(JSON.stringify(report), /private-gift|private-project|unitKey|scopeHash|subject/);
  assert.doesNotMatch(reportCsv(report), /private-gift|private-project/);
});
test("release decisions use the noised vector, including empty joint cells", () => {
  const input = specimenInput();
  input.contributions = [...input.contributions, { unitKey: "private-gift-39", localDate: "2026-07-21" }];
  let draws = 0;
  const { report } = computeReport(input, () => { draws++; return 0; });
  assert.equal(draws, 32);
  assert.deepEqual(report.metrics.usedDuringPeriod, { state: "privacy_estimate", value: 20 });
  assert.equal(computeReport(input, () => -100).report.metrics.usedDuringPeriod.state, "withheld");
  assert.deepEqual(report.metrics.feedbackRespondents, { state: "unavailable", reason: "not_collected" });
});
test("publication deadline prevents expired history becoming inactivity even before retention runs", () => {
  const input = specimenInput();
  input.now = Date.parse("2026-09-09T12:00:00Z");
  input.contributions = [];
  const { report } = computeReport(input, () => { throw new Error("must not sample expired history"); });
  assert.equal(report.coverage, "unavailable");
  assert.equal(report.metrics.startedPlanning.state, "unavailable");
});
test("missing telemetry, expired access, measurement withdrawal and partial enumeration never become zero", () => {
  for (const scenario of ["gap", "expired", "choice", "enumeration"] as const) {
    const input = specimenInput();
    if (scenario === "gap") input.coveredDates = new Set();
    if (scenario === "expired") input.claims = input.claims.map((u, i) => i ? u : { ...u, accessEndsOn: "2026-07-01" });
    if (scenario === "choice") input.claims = input.claims.map((u, i) => i ? u : { ...u, measurementAllowed: false });
    if (scenario === "enumeration") input.claimsComplete = false;
    assert.equal(computeReport(input).report.metrics.usedDuringPeriod.state, "unavailable", scenario);
  }
});
test("return cohort stays unobservable until complete 35-day followup and timezone close", () => {
  const input = specimenInput();
  input.now = Date.parse("2026-09-05T02:00:00Z");
  assert.equal(computeReport(input).report.metrics.returnedPlanning.state, "not_yet_observable");
  assert.equal(reportWindow("2026-12").activity.start, "2027-01-01");
  assert.throws(() => reportWindow("2026-13"));
});
test("duplicate gifts, shared scope ambiguity and salt rotations fail closed", () => {
  for (const change of ["key", "scope", "epoch"]) {
    const input = specimenInput();
    input.claims = input.claims.map((u, i) => i !== 1 ? u : { ...u,
      ...(change === "key" ? { unitKey: input.claims[0].unitKey } : change === "scope" ? { scopeHash: input.claims[0].scopeHash } : { epoch: "bbbbbbbb" }) });
    assert.equal(computeReport(input).report.metrics.usedDuringPeriod.state, "unavailable");
  }
});
test("education configurations cannot inherit venue access or enable collection", () => {
  for (const kind of ["student", "teacher", "individual"] as const) {
    const input = specimenInput(); input.programme.kind = kind;
    assert.throws(() => computeReport(input), /programme_disabled/);
  }
});
test("purpose-specific assertion rejects expiry, tampering and extra segments", () => {
  const secret = "synthetic-report-auth-secret-32-characters";
  const token = createReportAssertion("report-reader", secret, 1000);
  assert.equal(verifyReportAssertion(token, secret, 1001), "report-reader");
  assert.throws(() => verifyReportAssertion(token, secret, 1300));
  assert.throws(() => verifyReportAssertion(token + ".suffix", secret, 1001));
  assert.throws(() => verifyReportAssertion(token, "different-synthetic-secret-32-characters", 1001));
});
test("real SQLite publication is immutable, role-bound, export-separated, erasable and overlap-safe", async () => {
  const dir = await mkdtemp(join(tmpdir(), "sponsor-report-"));
  const db = createClient({ url: pathToFileURL(join(dir, "entitlements.db")).href });
  try {
    await db.executeMultiple("CREATE TABLE sponsors(id TEXT PRIMARY KEY); CREATE TABLE license_codes(id TEXT PRIMARY KEY); INSERT INTO sponsors VALUES ('venue-synthetic');" + PROGRAMME_SCHEMA_SQL);
    await db.execute("INSERT INTO sponsor_programmes VALUES ('venue-programme','venue-synthetic','venue','Europe/Dublin','commercial-terms.v2','2026-06-01','internal','sponsor-cohort.v1','disabled')");
    const input = specimenInput();
    await db.execute({ sql: "INSERT INTO sponsor_programme_members VALUES (?,?,?,?,NULL)", args: [input.programme.id, "reader", "report_read", input.now + 100000] });
    const report = await publishReport(db, input);
    assert.deepEqual(await getReport(db, input.programme.id, input.claimMonth, "reader", false, input.now), report);
    const secret = "synthetic-purpose-separated-report-secret";
    const token = createReportAssertion("reader", secret, Math.floor(input.now / 1000));
    const request = (query = "", bearer = token) => new Request(`http://isolated.test/api/sponsor-programmes/venue-programme/reports/2026-06${query}`, { headers: { authorization: `Bearer ${bearer}` } });
    const deps = { db, secret, enabled: true, now: () => input.now };
    const json = await handleReport(request(), input.programme.id, input.claimMonth, deps);
    assert.equal(json.status, 200); assert.match(json.headers.get("cache-control")!, /no-store/);
    assert.deepEqual(await json.json(), report);
    const html = await handleReport(request("?format=html"), input.programme.id, input.claimMonth, deps);
    assert.equal(html.status, 200); assert.match(await html.text(), /Internal sponsor report/);
    assert.equal((await handleReport(request("?format=csv"), input.programme.id, input.claimMonth, deps)).status, 403);
    assert.equal((await handleReport(request("?recipient=private-gift-0"), input.programme.id, input.claimMonth, deps)).status, 409);
    assert.equal((await handleReport(request("", token + "x"), input.programme.id, input.claimMonth, deps)).status, 403);
    assert.equal((await handleInvitations(request(), input.programme.id, deps)).status, 403);
    await assert.rejects(getReport(db, input.programme.id, input.claimMonth, "reader", true, input.now), /forbidden/);
    await assert.rejects(getReport(db, input.programme.id, input.claimMonth, "foreign-user", false, input.now), /forbidden/);
    const changed = specimenInput(); changed.contributions = [];
    assert.deepEqual(await publishReport(db, changed), report, "same cohort retry returns the identical frozen projection");
    const later = specimenInput(); later.claimMonth = "2026-07"; later.now = Date.parse("2026-10-10T12:00:00Z"); later.dataThrough = "2026-10-05";
    later.claims = later.claims.map(u => ({ ...u, claimedOn: "2026-07-15" }));
    await assert.rejects(publishReport(db, later), /conflict/);
    await db.execute("UPDATE sponsor_programme_members SET revoked_at=1");
    assert.equal((await handleReport(request(), input.programme.id, input.claimMonth, deps)).status, 403);
    await assert.rejects(getReport(db, input.programme.id, input.claimMonth, "reader", false, input.now), /forbidden/);
    const tx = await db.transaction("write"); await restrictProgrammeFamily(tx, [input.programme.sponsorId]); await tx.commit(); tx.close();
    assert.equal((await db.execute("SELECT payload_json FROM sponsor_programme_reports")).rows[0].payload_json, null);
    await assert.rejects(publishReport(db, input), /restricted/);
  } finally { db.close(); /* Windows libSQL retains handles until exit; preserve isolated scratch. */ }
});




test("persisted projection refuses hidden fields, hidden withheld values and unapproved exact counts", () => {
  const valid = computeReport(specimenInput(), () => 0).report;
  assert.deepEqual(parseSponsorReport(valid), valid);
  for (const value of [
    { ...valid, recipientId: "private" },
    { ...valid, metrics: { ...valid.metrics, usedDuringPeriod: { state: "withheld", reason: "release_policy", value: 1 } } },
    { ...valid, metrics: { ...valid.metrics, usedDuringPeriod: { state: "exact", value: 20 } } },
    { ...valid, metrics: { ...valid.metrics, usedDuringPeriod: { state: "privacy_estimate", value: NaN } } },
    { ...valid, period: { ...valid.period, workspaceId: "private" } },
  ]) assert.throws(() => parseSponsorReport(value));
});
