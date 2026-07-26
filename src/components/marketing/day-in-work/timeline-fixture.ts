import type { AudienceTimelineDto } from "./timeline-artifact-types";

/**
 * The signed Mara and Finn proof. This is public marketing fixture data only;
 * it contains no live customer, workspace, or source identifiers.
 */
export const MARA_FINN_TIMELINE = Object.freeze({
  version: 1,
  audienceKind: "couple",
  publicationId: "marketing-mara-finn",
  label: "Mara & Finn",
  ownerDisplayLabel: "Shared by Mara & Finn",
  primaryDate: { label: "Wedding day", date: "2026-10-03" },
  lastUpdatedAt: "2026-07-21T18:30:00.000Z",
  today: "2026-07-22",
  sections: [
    {
      state: "covered",
      label: "Covered",
      items: [
        {
          publicId: "mara-finn-yes",
          title: "We said yes",
          date: "2026-01-02",
          state: "covered",
        },
        {
          publicId: "mara-finn-venue",
          title: "The Orchard reserved",
          date: "2026-04-18",
          state: "covered",
        },
      ],
    },
    {
      state: "now",
      label: "Now",
      items: [
        {
          publicId: "mara-finn-menu",
          title: "Menu tasting at The Orchard",
          date: "2026-08-01",
          state: "now",
        },
      ],
    },
    {
      state: "next",
      label: "Next",
      items: [
        {
          publicId: "mara-finn-invitations",
          title: "Send the invitations",
          date: "2026-08-08",
          state: "next",
        },
        {
          publicId: "mara-finn-fitting",
          title: "Final dress fitting",
          date: "2026-08-22",
          state: "next",
        },
        {
          publicId: "mara-finn-music",
          title: "Choose the evening music",
          date: "2026-08-29",
          state: "next",
        },
      ],
    },
    {
      state: "later",
      label: "Later",
      items: [
        {
          publicId: "mara-finn-guests",
          title: "Final guest numbers",
          date: "2026-09-05",
          state: "later",
        },
        {
          publicId: "mara-finn-walkthrough",
          title: "Venue walk-through",
          date: "2026-09-19",
          state: "later",
        },
        {
          publicId: "mara-finn-wedding",
          title: "Wedding day",
          date: "2026-10-03",
          state: "later",
        },
      ],
    },
    {
      state: "cancelled",
      label: "Cancelled",
      items: [
        {
          publicId: "mara-finn-hotel",
          title: "City hotel shortlist",
          state: "cancelled",
        },
      ],
    },
  ],
} as const satisfies AudienceTimelineDto);
