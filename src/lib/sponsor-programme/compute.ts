import { addLocalDays, isLocalDayClosed, toLocalDate } from "../account/instrumentation/local-date";
import { LIMITATIONS, MIN_CELL, CONTRIBUTION_RETENTION_DAYS, PROGRAMME_CONFIGURATIONS, REPORT_POLICY,
  type ClaimUnit, type Contribution, type Feedback, type MetricName, type Programme,
  type ReleasedMetric, type SponsorReport } from "./contract";
import { privatizeHistogram } from "./noise";

export function monthWindow(month: string) {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month) || Number(month.slice(0, 4)) < 2000) throw new Error("invalid_month");
  const [year, m] = month.split("-").map(Number);
  const start = `${month}-01`;
  const end = new Date(Date.UTC(year, m, 0, 12)).toISOString().slice(0, 10);
  const next = new Date(Date.UTC(year, m, 1, 12)).toISOString().slice(0, 7);
  return { start, end, next };
}
export function reportWindow(claimMonth: string) {
  const cohort = monthWindow(claimMonth);
  const activity = monthWindow(cohort.next);
  return { cohort, activity, followupThrough: addLocalDays(activity.end, 35) };
}
export type ComputeInput = {
  programme: Programme; claimMonth: string; now: number; dataThrough: string;
  claims: readonly ClaimUnit[]; contributions: readonly Contribution[];
  /** Complete authoritative enumeration, never inferred from event senders. */
  claimsComplete: boolean;
  /** Attested closed days for this action class, including measured quiet days. */
  coveredDates: ReadonlySet<string>;
  feedback?: readonly Feedback[];
};
export type Computation = { report: SponsorReport; unitKeys: string[]; scopeKeys: string[]; sourceEpoch: string | null };
const names: MetricName[] = ["claimed", "startedPlanning", "usedDuringPeriod", "returnedPlanning", "feedbackRespondents", "reportedUseful"];
const unavailable = (): ReleasedMetric => ({ state: "unavailable", reason: "measurement_incomplete" });
const withheld = (): ReleasedMetric => ({ state: "withheld", reason: "release_policy" });
function estimate(n: number): ReleasedMetric { return { state: "privacy_estimate", value: Math.round(n / MIN_CELL) * MIN_CELL }; }
function everyDay(start: string, end: string, covered: ReadonlySet<string>) {
  for (let date = start; date <= end; date = addLocalDays(date, 1)) if (!covered.has(date)) return false;
  return true;
}
/** Fixed disjoint claim cohort. One joint partition guards every behavioural marginal. */
export function computeReport(input: ComputeInput, noise?: () => number): Computation {
  const { programme, claimMonth } = input;
  if (programme.status !== "internal" || !PROGRAMME_CONFIGURATIONS[programme.kind].ready) throw new Error("programme_disabled");
  const { cohort, activity, followupThrough } = reportWindow(claimMonth);
  const metrics = Object.fromEntries(names.map(name => [name, unavailable()])) as SponsorReport["metrics"];
  const report: SponsorReport = {
    schema: REPORT_POLICY, programmeId: programme.id,
    recipientUnit: PROGRAMME_CONFIGURATIONS[programme.kind].unit,
    cohort: { kind: "claim_month", month: claimMonth },
    period: { start: activity.start, end: activity.end, timezone: programme.timezone, followupThrough },
    dataThrough: input.dataThrough, coverage: "unavailable", measurement: "deliberate_task_creation", metrics, limitations: LIMITATIONS,
  };
  if (!isLocalDayClosed(followupThrough, input.now, programme.timezone) || input.dataThrough < followupThrough) {
    for (const name of names) metrics[name] = { state: "not_yet_observable", reason: "followup_open" };
    return { report, unitKeys: [], scopeKeys: [], sourceEpoch: null };
  }
  const units = input.claims.filter(c => c.claimedOn >= cohort.start && c.claimedOn <= cohort.end);
  const keys = new Set(units.map(c => c.unitKey));
  const scopes = new Set(units.map(c => c.scopeHash));
  const epochs = new Set(units.map(c => c.epoch));
  // Duplicate/overlapping gifts and epochs are ambiguous, never guessed or summed.
  if (!input.claimsComplete || keys.size !== units.length || scopes.size !== units.length || epochs.size > 1) {
    return { report, unitKeys: [], scopeKeys: [], sourceEpoch: null };
  }
  const result = { report, unitKeys: [...keys].sort(), scopeKeys: [...scopes].sort(), sourceEpoch: [...epochs][0] ?? null };
  // A universal deadline, independent of activity, prevents expired contributions
  // being treated as zeros before the retention worker has run.
  if (toLocalDate(input.now - CONTRIBUTION_RETENTION_DAYS * 86400000, programme.timezone) >= cohort.start) return result;
  if (units.length < MIN_CELL) { for (const name of names) metrics[name] = withheld(); return result; }
  const complete = programme.measurementStartsOn <= cohort.start && units.every(u => u.measurementAllowed &&
    u.accessStartsOn <= u.claimedOn && u.accessEndsOn >= followupThrough &&
    everyDay(u.claimedOn, followupThrough, input.coveredDates));
  // A choice, expiry or coverage gap is not an inactive gift. Hide the whole cohort's behaviour.
  if (!complete) { report.coverage = input.coveredDates.size ? "partial" : "unavailable"; return result; }
  report.coverage = "complete";
  const cells = new Map<string, number>();
  const feedback = new Map<string, boolean>();
  for (const response of programme.feedbackCollection === "enabled" ? input.feedback ?? [] : []) {
    if (!keys.has(response.unitKey) || feedback.has(response.unitKey)) throw new Error("invalid_feedback_cohort");
    feedback.set(response.unitKey, response.useful);
  }
  for (const unit of units) {
    const dates = [...new Set(input.contributions.filter(c => c.unitKey === unit.unitKey && c.localDate >= unit.claimedOn && c.localDate <= followupThrough).map(c => c.localDate))].sort();
    const first = dates.find(d => d <= activity.end);
    const started = first !== undefined;
    const active = dates.some(d => d >= activity.start && d <= activity.end);
    const returned = first !== undefined && dates.some(d => d > first && d <= addLocalDays(first, 35));
    const responded = feedback.has(unit.unitKey);
    const useful = feedback.get(unit.unitKey) === true;
    const signature = [started, active, returned, responded, useful].map(Number).join("");
    cells.set(signature, (cells.get(signature) ?? 0) + 1);
  }
  // Sample once during publication. All outputs/suppression decisions are
  // postprocessing of this same noised joint vector, never raw sparse cells.
  const privateCells = privatizeHistogram(cells, noise);
  const totals: Record<MetricName, number> = { claimed: 0, startedPlanning: 0, usedDuringPeriod: 0, returnedPlanning: 0, feedbackRespondents: 0, reportedUseful: 0 };
  const flags: MetricName[] = ["startedPlanning", "usedDuringPeriod", "returnedPlanning", "feedbackRespondents", "reportedUseful"];
  for (const [signature, count] of privateCells) {
    totals.claimed += count;
    flags.forEach((name, i) => { if (signature[i] === "1") totals[name] += count; });
  }
  // Sum signed cells before clamping; clamping each bin biases small cohorts up.
  const denominator = Math.max(0, totals.claimed);
  for (const name of names) totals[name] = Math.max(0, Math.min(denominator, totals[name]));
  // Semantic inequalities are postprocessing of the same private vector.
  totals.usedDuringPeriod = Math.min(totals.usedDuringPeriod, totals.startedPlanning);
  totals.returnedPlanning = Math.min(totals.returnedPlanning, totals.startedPlanning);
  totals.reportedUseful = Math.min(totals.reportedUseful, totals.feedbackRespondents);
  for (const name of names) {
    const n = totals[name];
    metrics[name] = denominator < MIN_CELL || (name !== "claimed" && (n < MIN_CELL || denominator - n < MIN_CELL)) ? withheld() : estimate(n);
  }
  if (programme.feedbackCollection === "disabled") {
    metrics.feedbackRespondents = { state: "unavailable", reason: "not_collected" };
    metrics.reportedUseful = { state: "unavailable", reason: "not_collected" };
  }
  return result;
}
