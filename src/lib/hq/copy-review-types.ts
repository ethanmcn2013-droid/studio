export type CopyReviewStatus =
  | "approved"
  | "needs_review"
  | "rejected"
  | "needs_work"
  | "deferred";

export type CopyReviewExposure =
  | "public"
  | "product"
  | "internal"
  | "legal"
  | "marketing";

export type CopyReviewRiskLevel = "low" | "medium" | "high";

export type CopyReviewType =
  | "headline"
  | "subheading"
  | "body"
  | "cta"
  | "tooltip"
  | "empty_state"
  | "error"
  | "pricing"
  | "onboarding"
  | "navigation"
  | "legal"
  | "marketing"
  | "metadata"
  | "alt_text"
  | "unknown";

export type CopyInventoryItem = {
  id: string;
  text: string;
  previousText?: string;
  location: string;
  line: number;
  route?: string;
  productArea: string;
  audience?: string;
  component?: string;
  copyType: CopyReviewType;
  exposure: CopyReviewExposure;
  hash: string;
  previousHash?: string;
  lastModified: string;
  changedAt?: string;
  whyChanged?: string;
  riskScore: number;
  riskLevel: CopyReviewRiskLevel;
  aiNotes: string[];
  flags: string[];
};

export type CopyInventory = {
  schemaVersion: 1;
  generatedAt: string;
  sourceRoot: string;
  itemCount: number;
  items: CopyInventoryItem[];
};

export type CopyReviewHistoryEntry = {
  hash: string;
  status: Exclude<CopyReviewStatus, "needs_review">;
  reviewedAt: string;
  comment?: string;
  reviewer: "founder" | "codex";
};

export type CopyReviewRecord = {
  itemId: string;
  currentStatus: Exclude<CopyReviewStatus, "needs_review">;
  reviewedHash: string;
  approvedHash?: string;
  approvedText?: string;
  lastReviewedAt: string;
  founderComments: string[];
  history: CopyReviewHistoryEntry[];
  hallOfFame?: boolean;
  hallCategory?: string;
};

export type CopyGuidanceRule = {
  id: string;
  text: string;
  sourceItemId?: string;
  sourceHash?: string;
  tags: string[];
  createdAt: string;
  sentiment: "approved" | "rejected" | "needs_work" | "principle";
};

export type CopyReviewState = {
  schemaVersion: 1;
  updatedAt: string;
  reviews: Record<string, CopyReviewRecord>;
  guidance: CopyGuidanceRule[];
};

export type CopyReviewItem = CopyInventoryItem & {
  status: CopyReviewStatus;
  approvedHash?: string;
  previousApprovedText?: string;
  lastReviewedAt?: string;
  founderComments: string[];
  reviewHistory: CopyReviewHistoryEntry[];
  isChanged: boolean;
  isNew: boolean;
  isHallOfFame: boolean;
  hallCategory?: string;
};

export type CopyReviewMetric = {
  label: string;
  value: string;
  note: string;
  tone: "accent" | "warn" | "critical" | "quiet";
};

export type CopyReviewHeatmapCell = {
  key: string;
  label: string;
  approved: number;
  needsReview: number;
  rejected: number;
  needsWork: number;
  deferred: number;
  total: number;
  approvedPct: number;
};

export type CopyReviewSnapshot = {
  generatedAt: string;
  stateUpdatedAt: string;
  inventoryPath: string;
  statePath: string;
  items: CopyReviewItem[];
  metrics: CopyReviewMetric[];
  heatmap: {
    product: CopyReviewHeatmapCell[];
    page: CopyReviewHeatmapCell[];
    audience: CopyReviewHeatmapCell[];
    type: CopyReviewHeatmapCell[];
    risk: CopyReviewHeatmapCell[];
    exposure: CopyReviewHeatmapCell[];
    change: CopyReviewHeatmapCell[];
  };
  guidance: CopyGuidanceRule[];
  hallOfFame: CopyReviewItem[];
  weeklyReview: {
    items: CopyReviewItem[];
    estimatedMinutes: number;
    canBatchApprove: number;
  };
  searchPresets: Array<{
    label: string;
    query: string;
    type?: CopyReviewType;
    audience?: string;
    exposure?: CopyReviewExposure;
  }>;
};
