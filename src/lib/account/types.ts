/**
 * Signal Studio Account — canonical product contract types.
 *
 * One discriminated snapshot drives UI, accessibility text, PDF, and CSV.
 * Withheld and unavailable variants must never carry a hidden raw value.
 */

export type AccountEdition = "venue" | "education" | "organisation";

export type CoverageState =
  | "complete"
  | "partial"
  | "suppressed"
  | "unavailable";

export type AccountRole = "owner" | "manager" | "viewer";

export type AccessCodeState =
  | "available"
  | "issued"
  | "redeemed"
  | "revoked"
  | "expired";

export type MetricValue =
  | { state: "exact"; value: number; denominator?: number }
  | { state: "lower_bound"; value: number; denominator?: number }
  | { state: "withheld"; reason: "small_group" }
  | { state: "unavailable"; reason: string }
  /**
   * There is no number, and that is the answer — not a suppression and not a
   * gap in the data. Venue Edition entitlement is every couple who books
   * (D-020), so a sponsored venue's allotment and headroom have no count to
   * show. Rendering them as 0, or as "Unavailable", would both be lies about a
   * venue that was sold "no seats, no per-couple maths".
   */
  | { state: "unlimited" };

export type AccountIdentity = {
  accountId: string;
  name: string;
  edition: AccountEdition;
  editionLabel: string;
  recipientNoun: string;
  recipientNounPlural: string;
};

export type AccountTerm = {
  label: string;
  start: string;
  end: string;
  renewalDate: string;
  standing: "account_active" | "attention" | "ended";
  standingLabel: string;
};

export type ReportingCoverage = {
  state: CoverageState;
  label: string;
  detail: string;
  dataThrough: string;
  periodStart: string;
  periodEnd: string;
  periodLabel: string;
  definitionVersion: string;
  /** Observed coverage is omitted when it could reveal suppressed behaviour. */
  modulesCovered?: number;
  modulesExpected: number;
  daysCovered?: number;
  daysExpected?: number;
};

export type AccessLifecycle = {
  allotted: MetricValue;
  available: MetricValue;
  issued: MetricValue;
  redeemed: MetricValue;
  reconciliation: {
    state: "checked" | "attention";
    label: string;
    detail: string;
  };
  codes: AccessCodeRow[];
  attention: AccessAttention[];
};

export type AccessCodeRow = {
  maskedCode: string;
  state: AccessCodeState;
  issuedOn: string | null;
  redeemedOn: string | null;
  expiresOn: string | null;
  note: string;
};

export type AccessAttention = {
  id: string;
  label: string;
  detail: string;
};

export type AdoptionLifecycle = {
  allotted: MetricValue;
  issued: MetricValue;
  redeemed: MetricValue;
  firstUsefulAction: MetricValue;
  activeRecently: MetricValue;
  continuedAfter30Days: MetricValue;
  daysWithSponsoredUse: MetricValue;
};

export type ProductReach = {
  product: "Notes" | "Tasks" | "Timeline" | "Signal";
  workspacesReached: MetricValue;
  supportingDetail: string;
};

export type AccountReport = {
  reportId: string;
  title: string;
  periodLabel: string;
  coverageState: CoverageState;
  coverageLabel: string;
  dataThrough: string;
  generatedOn: string;
  formats: Array<"pdf" | "csv">;
  filenameStem: string;
};

export type AccountMember = {
  memberId: string;
  displayName: string;
  role: AccountRole;
  roleLabel: string;
  status: "active" | "invited";
};

export type PrivacyReceipt = {
  headline: string;
  body: string;
  postureLabel: string;
  withheldRule: string;
  neverIncludes: string[];
};

export type AccountNextAction = {
  id: string;
  label: string;
  detail: string;
  target: "access" | "usage" | "reports" | "account" | "none";
};

/** Review fixtures vs HQ live access preview (usage still unavailable). */
export type AccountSampleLabel =
  | "SAMPLE · DETERMINISTIC REVIEW DATA."
  | "LIVE ACCESS PREVIEW · USAGE UNAVAILABLE."
  | "LIVE ACCESS AND USAGE."
  /** A closed period frozen into a snapshot. It carries no SAMPLE or LIVE
   *  qualifier because it is neither: it is the record of a finished month. */
  | "FROZEN REPORT · CLOSED PERIOD.";

export type AccountSnapshot = {
  snapshotId: string;
  definitionVersion: string;
  edition: AccountEdition;
  sampleLabel: AccountSampleLabel;
  account: AccountIdentity;
  term: AccountTerm;
  coverage: ReportingCoverage;
  access: AccessLifecycle;
  adoption: AdoptionLifecycle;
  productReach: ProductReach[];
  reports: AccountReport[];
  members: AccountMember[];
  privacyReceipt: PrivacyReceipt;
  nextAction: AccountNextAction;
  brandLines: {
    hero: string;
    usage: string;
    privacy: string;
  };
};

export type DesignConceptId =
  | "account-brief"
  | "access-ledger"
  | "guided-review";

export type DesignConceptMeta = {
  id: DesignConceptId;
  name: string;
  thesis: string;
  tests: string;
};
