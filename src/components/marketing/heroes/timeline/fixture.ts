import type { AudienceTimelineDto } from "@/components/marketing/heroes/timeline/audience-timeline";
import { REVIEW_SUITE_PRESENTATION } from "@/lib/review-suite-presentation";

/**
 * Public half of the deterministic Mara & Finn review fixture.
 *
 * IDs, dates, wording and states deliberately match
 * app/src/lib/review-suite-fixture.ts. Marketing is not allowed to invent a
 * second version of the same named workspace for visual convenience.
 */
export const TIMELINE_HERO_FIXTURE: AudienceTimelineDto = {
  version: 1,
  audienceKind: "couple",
  publicationId: "demo-audience-publication",
  label: REVIEW_SUITE_PRESENTATION.project.name,
  ownerDisplayLabel: `Shared by ${REVIEW_SUITE_PRESENTATION.project.name}`,
  primaryDate: { label: "Wedding day", date: "2026-10-03" },
  lastUpdatedAt: REVIEW_SUITE_PRESENTATION.lastUpdatedAt,
  today: REVIEW_SUITE_PRESENTATION.reviewToday,
  sections: [
    {
      state: "covered",
      label: "Done",
      items: [
        { publicId: "demo-audience-item-yes", title: "We said yes", date: "2026-01-02", state: "covered" },
        { publicId: "demo-audience-item-venue", title: "The Orchard reserved", date: "2026-04-18", state: "covered" },
      ],
    },
    {
      state: "now",
      label: "Now",
      items: [
        { publicId: "demo-audience-item-menu", title: REVIEW_SUITE_PRESENTATION.journey.task, date: REVIEW_SUITE_PRESENTATION.journey.milestoneDate, state: "now" },
      ],
    },
    {
      state: "next",
      label: "Soon",
      items: [
        { publicId: "demo-audience-item-invitations", title: "Send the invitations", date: "2026-08-08", state: "next" },
        { publicId: "demo-audience-item-fitting", title: "Final dress fitting", date: "2026-08-22", state: "next" },
        { publicId: "demo-audience-item-music", title: "Choose the evening music", date: "2026-08-29", state: "next" },
      ],
    },
    {
      state: "later",
      label: "Later",
      items: [
        { publicId: "demo-audience-item-guests", title: "Final guest numbers", date: "2026-09-05", state: "later" },
        { publicId: "demo-audience-item-walkthrough", title: "Venue walk-through", date: "2026-09-19", state: "later" },
        { publicId: "demo-audience-item-wedding", title: "Wedding day", date: "2026-10-03", state: "later" },
      ],
    },
    {
      state: "cancelled",
      label: "Set aside",
      items: [
        { publicId: "demo-audience-item-hotel", title: "City hotel shortlist", state: "cancelled" },
      ],
    },
  ],
};

export const HOMEPAGE_RELAY_TIMELINE_FIXTURE: AudienceTimelineDto = {
  ...TIMELINE_HERO_FIXTURE,
  publicationId: "homepage-relay-wedding",
};
