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
  | { state: "unavailable"; reason: string };

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
  modulesCovered: number;
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

export type AccountSnapshot = {
  snapshotId: string;
  definitionVersion: string;
  edition: AccountEdition;
  sampleLabel: "SAMPLE · DETERMINISTIC REVIEW DATA.";
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
