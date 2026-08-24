export type GuidelineSectionId =
  | "introduction"
  | "logo"
  | "color"
  | "typography"
  | "motion"
  | "voice-and-tone"
  | "moodboard"
  | "applications"
  | "assets";

export type GuidelineTheme = "paper" | "soft" | "ink" | "indigo";

export interface GuidelineSection {
  id: GuidelineSectionId;
  number: string;
  label: string;
  title: string;
  summary: string;
  theme: GuidelineTheme;
  anchor: `#${GuidelineSectionId}`;
}

export type BrandAssetCategory =
  | "Wordmarks"
  | "Marks"
  | "App icons"
  | "Product marks"
  | "Tokens"
  | "Motion"
  | "Imagery"
  | "Templates"
  | "Print";

export interface BrandAsset {
  id: string;
  category: BrandAssetCategory;
  title: string;
  filename: string;
  format: string;
  dimensions: string;
  bytes: number;
  version: string;
  preview: string;
  downloadUrl: string;
  external?: boolean;
}

export type ApplicationStatus = "live" | "approved" | "concept";
