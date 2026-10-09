import { LIMITATIONS, REPORT_POLICY, type SponsorReport } from "./contract";
import { reportWindow } from "./compute";

const metricNames = ["claimed", "startedPlanning", "usedDuringPeriod", "returnedPlanning", "feedbackRespondents", "reportedUseful"];
function record(value: unknown, keys: readonly string[]): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value) ||
    Object.keys(value).sort().join() !== [...keys].sort().join()) throw new Error("invalid_report");
  return value as Record<string, unknown>;
}
const date = (v: unknown) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v;
/** Hash integrity alone is insufficient: never serve unapproved persisted fields. */
export function parseSponsorReport(value: unknown): SponsorReport {
  const r = record(value, ["schema", "programmeId", "recipientUnit", "cohort", "period", "dataThrough", "coverage", "measurement", "metrics", "limitations"]);
  if (r.schema !== REPORT_POLICY || typeof r.programmeId !== "string" || !/^[A-Za-z0-9_-]{1,96}$/.test(r.programmeId) ||
    r.recipientUnit !== "couple gift" || r.measurement !== "deliberate_task_creation" || !date(r.dataThrough) ||
    !["complete", "partial", "unavailable"].includes(String(r.coverage)) || JSON.stringify(r.limitations) !== JSON.stringify(LIMITATIONS)) throw new Error("invalid_report");
  const cohort = record(r.cohort, ["kind", "month"]);
  if (cohort.kind !== "claim_month" || typeof cohort.month !== "string") throw new Error("invalid_report");
  const window = reportWindow(cohort.month);
  const period = record(r.period, ["start", "end", "timezone", "followupThrough"]);
  if (period.start !== window.activity.start || period.end !== window.activity.end || period.followupThrough !== window.followupThrough || typeof period.timezone !== "string") throw new Error("invalid_report");
  new Intl.DateTimeFormat("en", { timeZone: period.timezone });
  const metrics = record(r.metrics, metricNames);
  for (const value of Object.values(metrics)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("invalid_report");
    const m = value as Record<string, unknown>;
    if (m.state === "privacy_estimate") {
      record(m, ["state", "value"]);
      if (!Number.isSafeInteger(m.value) || Number(m.value) < 0 || Number(m.value) % 10) throw new Error("invalid_report");
    } else {
      record(m, ["state", "reason"]);
      if (!(m.state === "withheld" && m.reason === "release_policy") &&
        !(m.state === "unavailable" && ["measurement_incomplete", "not_collected"].includes(String(m.reason))) &&
        !(m.state === "not_yet_observable" && m.reason === "followup_open")) throw new Error("invalid_report");
    }
  }
  return value as SponsorReport;
}
