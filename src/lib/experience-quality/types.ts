import type { ProductId } from "@/lib/suite/contracts";

export const EXPERIENCE_SCHEMA_VERSION = "signal-experience/1" as const;
export const REVIEW_SCHEMA_VERSION = "signal-review/2" as const;

export const EXPERIENCE_CLASSES = [
  "customer-product",
  "company-public",
  "founder-operator",
] as const;

export const AUDIT_DIMENSIONS = [
  "purpose-and-task-clarity",
  "information-architecture",
  "visual-hierarchy",
  "typography-and-content",
  "layout-and-composition",
  "interaction-quality",
  "state-completeness",
  "accessibility",
  "responsive-behavior",
  "performance-and-perceived-speed",
  "design-system-coherence",
  "brand-distinction-and-craft",
  "implementation-fidelity",
] as const;

export type AuditDimension = (typeof AUDIT_DIMENSIONS)[number];
export type ExperienceProduct = ProductId | "signal-review";
export type ExperienceClass = (typeof EXPERIENCE_CLASSES)[number];
export type ExperienceSurfaceType =
  | "page"
  | "nested-view"
  | "embedded-workspace"
  | "dialog"
  | "drawer"
  | "popover"
  | "menu"
  | "command-palette"
  | "onboarding"
  | "authentication"
  | "invitation"
  | "shared-link"
  | "loading"
  | "empty"
  | "error"
  | "success"
  | "restricted"
  | "notification"
  | "report"
  | "export"
  | "email"
  | "extension-overlay";

export type ScreenArchetype =
  | "application-shell-and-navigation"
  | "dashboard-or-command-centre"
  | "list-and-data-table"
  | "detail-or-record-view"
  | "create-and-edit-form"
  | "editor-or-canvas"
  | "review-and-approval-workspace"
  | "search-and-command-interface"
  | "settings-and-administration"
  | "onboarding-and-authentication"
  | "feedback-interruption-and-exception"
  | "public-information-and-proof";

export type ExperienceState =
  | "default"
  | "first-use"
  | "empty"
  | "populated"
  | "loading"
  | "slow-loading"
  | "partial-failure"
  | "error"
  | "success"
  | "restricted"
  | "disabled"
  | "read-only"
  | "dense"
  | "long-content"
  | "saved"
  | "unsaved"
  | "reduced-motion"
  | "keyboard-only";

export type BreakpointId = "mobile" | "tablet" | "desktop" | "wide";
export type ReviewTier = "critical" | "core" | "supporting";
export type AuditStatus =
  | "registered"
  | "baseline-captured"
  | "under-remediation"
  | "passing"
  | "blocked"
  | "exception";
export type CoverageStatus = "none" | "partial" | "complete" | "blocked";

export type IntentionalException = Readonly<{
  id: string;
  rationale: string;
  owner: string;
  scope: string;
  approvalSource: string;
  expiresAt: string;
  remediationPlan: string;
}>;

export type ExperienceEntry = Readonly<{
  id: string;
  product: ExperienceProduct;
  experienceClass: ExperienceClass;
  surfaceType: ExperienceSurfaceType;
  route?: string;
  trigger?: string;
  source: string;
  parentJourney: string;
  archetype: ScreenArchetype;
  primaryJob: string;
  primaryAction: string;
  roles: readonly string[];
  requiredStates: readonly ExperienceState[];
  requiredBreakpoints: readonly BreakpointId[];
  componentDependencies: readonly string[];
  patternDependencies: readonly string[];
  reviewTier: ReviewTier;
  designOwner: string;
  engineeringOwner: string;
  implementationStatus: "live" | "preview" | "legacy" | "planned";
  auditStatus: AuditStatus;
  auditScore: number | null;
  openFindingIds: readonly string[];
  automatedTestCoverage: CoverageStatus;
  screenshotCoverage: CoverageStatus;
  accessibilityCoverage: CoverageStatus;
  fixtureCoverage: CoverageStatus;
  lastReviewedAt: string | null;
  approvedBaselineReference: string | null;
  intentionalExceptions: readonly IntentionalException[];
  materialityHash: string;
}>;

export type ExperienceRegistry = Readonly<{
  schemaVersion: typeof EXPERIENCE_SCHEMA_VERSION;
  generatedAt: string;
  breakpoints: Readonly<Record<BreakpointId, { width: number; height: number }>>;
  experiences: readonly ExperienceEntry[];
}>;

export type AuditScores = Readonly<Record<AuditDimension, 0 | 1 | 2 | 3 | 4>>;

export type ExperienceAudit = Readonly<{
  id: string;
  experienceId: string;
  state: ExperienceState;
  breakpoint: BreakpointId;
  scores: AuditScores;
  overallScore: number;
  evidence: readonly string[];
  reviewer: string;
  reviewedAt: string;
  pass: boolean;
}>;

export type FindingSeverity =
  | "release-blocking"
  | "high"
  | "medium"
  | "low"
  | "opportunity";

export type FindingScope = "local" | "systemic" | "pattern" | "journey";
export type FindingStatus =
  | "open"
  | "acknowledged"
  | "in-progress"
  | "resolved"
  | "accepted-exception";

export type ExperienceFinding = Readonly<{
  id: string;
  experienceId: string;
  product: ExperienceProduct;
  surface: string;
  state: ExperienceState;
  breakpoint: BreakpointId;
  dimension: AuditDimension;
  severity: FindingSeverity;
  evidence: readonly string[];
  violatedStandard: string;
  impact: string;
  recommendation: string;
  scope: FindingScope;
  confidence: number;
  owner: string;
  status: FindingStatus;
  resolutionEvidence: readonly string[];
  source: "deterministic" | "specialist-review" | "human-review";
  createdAt: string;
  resolvedAt: string | null;
}>;

export type ReviewStatus =
  | "draft"
  | "captured"
  | "acknowledged"
  | "approved"
  | "changes-requested"
  | "resolved";

export type ReviewRecord = Readonly<{
  schemaVersion: typeof REVIEW_SCHEMA_VERSION;
  id: string;
  experienceId: string;
  product: ExperienceProduct;
  routeOrTrigger: string;
  state: ExperienceState;
  breakpoint: BreakpointId;
  baselineScreenshot: string | null;
  candidateScreenshot: string | null;
  diffScreenshot: string | null;
  scoreBefore: number | null;
  scoreAfter: number | null;
  findingIds: readonly string[];
  annotations: readonly string[];
  severity: FindingSeverity | null;
  owner: string;
  approvalHistory: readonly {
    status: ReviewStatus;
    actor: string;
    at: string;
    note: string;
  }[];
  resolutionEvidence: readonly string[];
  status: ReviewStatus;
  designSystemReferences: readonly string[];
  codeReferences: readonly string[];
  changeReferences: readonly string[];
}>;

export const STUDIO_GRADE_MINIMUM = 3 as const;
export const STUDIO_GRADE_OVERALL = 3.5 as const;

export function scoreAudit(scores: AuditScores): number {
  const values = AUDIT_DIMENSIONS.map((dimension) => scores[dimension]);
  return Math.round((values.reduce<number>((sum, value) => sum + value, 0) / values.length) * 100) / 100;
}

export function meetsStudioGradeGate(
  scores: AuditScores,
  findings: readonly ExperienceFinding[],
): boolean {
  return (
    Math.min(...AUDIT_DIMENSIONS.map((dimension) => scores[dimension])) >=
      STUDIO_GRADE_MINIMUM &&
    scoreAudit(scores) >= STUDIO_GRADE_OVERALL &&
    !findings.some(
      (finding) =>
        !["resolved", "accepted-exception"].includes(finding.status) &&
        finding.severity === "release-blocking",
    )
  );
}
