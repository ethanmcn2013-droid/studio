export type AudienceKind = "class" | "module" | "couple";
export type AudienceItemState =
  | "covered"
  | "now"
  | "next"
  | "later"
  | "cancelled";

export type AudienceTimelineItemDto = Readonly<{
  publicId: string;
  title: string;
  date?: string;
  state: AudienceItemState;
}>;

export type AudienceTimelineSectionDto = Readonly<{
  state: AudienceItemState;
  label: string;
  items: readonly AudienceTimelineItemDto[];
}>;

/**
 * Marketing mirrors the strict public Timeline DTO instead of accepting an
 * app object. Keep this shape in lockstep with the consolidated app contract.
 */
export type AudienceTimelineDto = Readonly<{
  version: 1;
  audienceKind: AudienceKind;
  publicationId: string;
  label: string;
  ownerDisplayLabel?: string;
  primaryDate?: Readonly<{ label: string; date: string }>;
  lastUpdatedAt: string;
  today: string;
  sections: readonly AudienceTimelineSectionDto[];
}>;
