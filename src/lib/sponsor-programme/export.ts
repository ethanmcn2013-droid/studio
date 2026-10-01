import type { SponsorReport, ReleasedMetric } from "./contract";
export function metricLabel(metric: ReleasedMetric): string {
  switch (metric.state) {
    case "privacy_estimate": return `About ${metric.value}`;
    case "withheld": return "Not enough aggregated data";
    case "unavailable": return metric.reason === "not_collected" ? "Not collected" : "Measurement incomplete";
    case "not_yet_observable": return "Follow-up still open";
  }
}
/** CSV contains only the same approved projection returned by JSON. */
export function reportCsv(report: SponsorReport): string {
  const quote = (value: string) => `"${value.replaceAll('"', '""')}"`;
  return [["Metric", "Result", "Claim cohort", "Activity period"], ...Object.entries(report.metrics).map(([name, metric]) =>
    [name, metricLabel(metric), report.cohort.month, `${report.period.start} to ${report.period.end}`])]
    .map(row => row.map(quote).join(",")).join("\r\n") + "\r\n";
}
/** Minimal receiving view; the frontend team owns the eventual visual design. */
export function reportHtml(report: SponsorReport): string {
  const escape = (s: string) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const labels: Record<string, string> = { claimed: "Claimed couple gifts", startedPlanning: "Started planning", usedDuringPeriod: "Used during the activity period", returnedPlanning: "Returned to planning", feedbackRespondents: "Feedback respondents", reportedUseful: "Reported useful" };
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Internal sponsor report</title><body><main><h1>Internal sponsor report</h1><p>Gifts claimed in ${escape(report.cohort.month)}. Activity from ${escape(report.period.start)} to ${escape(report.period.end)} (${escape(report.period.timezone)}).</p><p>Follow-up through ${escape(report.period.followupThrough)}. Coverage: ${escape(report.coverage)}.</p><table><caption>Aggregate recipient evidence</caption><thead><tr><th scope="col">Measure</th><th scope="col">Result</th></tr></thead><tbody>${Object.entries(report.metrics).map(([key, metric]) => `<tr><th scope="row">${escape(labels[key] ?? key)}</th><td>${escape(metricLabel(metric))}</td></tr>`).join("")}</tbody></table><h2>How to read this report</h2><ul>${report.limitations.map(s => `<li>${escape(s)}</li>`).join("")}</ul></main></body></html>`;
}
