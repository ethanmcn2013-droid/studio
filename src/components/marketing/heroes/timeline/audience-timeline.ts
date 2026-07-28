/**
 * Types-only shim of `tasks/src/modules/timeline/lib/audience-timeline.ts`.
 *
 * The upstream file imports `node:crypto` for share-token handling, which
 * cannot cross into a client bundle. The artifact and its model only ever use
 * the type declarations below, copied verbatim from upstream. Keep them in
 * sync if the DTO version moves.
 */

export const AUDIENCE_TIMELINE_DTO_VERSION = 1 as const;
export const AUDIENCE_KINDS = ["class", "module", "couple"] as const;
export const AUDIENCE_ITEM_STATES = [
  "covered",
  "now",
  "next",
  "later",
  "cancelled",
] as const;

export type AudienceKind = (typeof AUDIENCE_KINDS)[number];
export type AudienceItemState = (typeof AUDIENCE_ITEM_STATES)[number];

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

export type AudienceTimelineDto = Readonly<{
  version: typeof AUDIENCE_TIMELINE_DTO_VERSION;
  audienceKind: AudienceKind;
  publicationId: string;
  label: string;
  ownerDisplayLabel?: string;
  primaryDate?: Readonly<{ label: string; date: string }>;
  lastUpdatedAt: string;
  today: string;
  sections: readonly AudienceTimelineSectionDto[];
}>;
