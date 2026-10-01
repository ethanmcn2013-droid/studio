/** Sponsor reports are a separate aggregate projection, never an access grant. */
export const REPORT_POLICY = "sponsor-cohort.v1" as const;
export const MIN_CELL = 10;
export const CONTRIBUTION_RETENTION_DAYS = 100;
export type ProgrammeKind = "venue" | "student" | "teacher" | "individual";
export type Programme = {
  id: string; sponsorId: string; kind: ProgrammeKind; timezone: string;
  agreementVersion: string; measurementStartsOn: string;
  status: "internal" | "disabled" | "restricted";
  feedbackCollection: "disabled" | "enabled";
};
export const PROGRAMME_CONFIGURATIONS = {
  venue: { unit: "couple gift", scope: "sponsored_project", allowance: "unlimited", access: "existing_venue_terms", ready: true },
  student: { unit: "student membership", scope: "unresolved", allowance: "unresolved", access: "agreement_required", ready: false },
  teacher: { unit: "teacher membership", scope: "unresolved", allowance: "unresolved", access: "agreement_required", ready: false },
  individual: { unit: "individual membership", scope: "unresolved", allowance: "unresolved", access: "agreement_required", ready: false },
} as const;
export type ReleasedMetric =
  | { state: "privacy_estimate"; value: number }
  | { state: "withheld"; reason: "release_policy" }
  | { state: "unavailable"; reason: "measurement_incomplete" | "not_collected" }
  | { state: "not_yet_observable"; reason: "followup_open" };
export type MetricName = "claimed" | "startedPlanning" | "usedDuringPeriod" | "returnedPlanning" | "feedbackRespondents" | "reportedUseful";
export type SponsorReport = {
  schema: typeof REPORT_POLICY;
  programmeId: string;
  recipientUnit: string;
  cohort: { kind: "claim_month"; month: string };
  period: { start: string; end: string; timezone: string; followupThrough: string };
  dataThrough: string;
  coverage: "complete" | "partial" | "unavailable";
  measurement: "deliberate_task_creation";
  metrics: Record<MetricName, ReleasedMetric>;
  limitations: readonly string[];
};
/** Private inputs. Neither unit nor scope nor actor identifiers may be serialized. */
export type ClaimUnit = {
  unitKey: string; scopeHash: string; epoch: string; claimedOn: string;
  accessStartsOn: string; accessEndsOn: string; measurementAllowed: boolean;
};
export type Contribution = { unitKey: string; localDate: string };
export type Feedback = { unitKey: string; useful: boolean };
export const LIMITATIONS = [
  "This report follows gifts claimed in one month; it is not a count of all recipients currently using the app.",
  "Use means successful, deliberate task creation in the sponsored Project. Other planning activity is not measured.",
  "Counts are privacy-protected estimates rounded to tens, not exact counts or guaranteed ranges. Withheld and unavailable measures contain no hidden values.",
  "Reported usefulness is optional respondent feedback, not evidence of causal financial or personal benefit.",
  "This internal policy is a review candidate; it does not establish anonymity or authorize external release.",
] as const;
