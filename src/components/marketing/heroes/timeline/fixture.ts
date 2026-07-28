import type { AudienceTimelineDto } from "@/components/marketing/heroes/timeline/audience-timeline";

/**
 * A frozen wedding plan for the Timeline hero.
 *
 * Dates are fixed rather than derived from the clock, the same refusal the
 * Signal hero holds with its frozen dateline: a marketing hero must read the
 * same on every visit and must never quietly drift into the past. `today` sits
 * 47 days before the wedding, so the TimeLens has a real countdown to show
 * and the completed rail covers a believable share of the plan.
 */
export const TIMELINE_HERO_FIXTURE: AudienceTimelineDto = {
  version: 1,
  audienceKind: "couple",
  publicationId: "hero-the-wedding",
  label: "Mara and Finn",
  ownerDisplayLabel: "Mara",
  primaryDate: { label: "The wedding", date: "2026-09-12" },
  lastUpdatedAt: "2026-07-27T09:14:00.000Z",
  today: "2026-07-27",
  // The six milestones sit at an even 16-day pitch: 12 Jun, 28 Jun, 14 Jul,
  // 30 Jul, 15 Aug, 31 Aug. The artifact places points by date, so an even
  // cadence in the data is what produces even spacing on the rail, and the
  // entrance stagger (each point wakes as the drawing line reaches it) then
  // falls on an even beat too. A real plan is lumpy; a demo plan should not
  // be, because the lumpiness reads as a bug rather than as data.
  //
  // The pitch is 14 days: 2 Jul, 16 Jul, 30 Jul, 13 Aug, 27 Aug, 10 Sept.
  // The series is placed so `today` (27 Jul) falls between the second and
  // third milestones. That matters: the artifact derives a milestone's state
  // from its date, so a "now" milestone dated in the past renders as overdue
  // rather than as the current one, and the indigo next-milestone marker
  // never appears. The wedding stays 12 Sept, keeping the 47-day countdown.
  sections: [
    {
      state: "covered",
      label: "Done",
      items: [
        { publicId: "m1", title: "Venue booked", date: "2026-07-02", state: "covered" },
        {
          publicId: "m2",
          title: "Photographer confirmed",
          date: "2026-07-16",
          state: "covered",
        },
      ],
    },
    {
      state: "now",
      label: "Now",
      items: [
        {
          publicId: "m3",
          title: "Confirm the florist",
          date: "2026-07-30",
          state: "now",
        },
      ],
    },
    {
      state: "next",
      label: "Soon",
      items: [
        {
          publicId: "m4",
          title: "Send the invitations",
          date: "2026-08-13",
          state: "next",
        },
      ],
    },
    {
      state: "later",
      label: "Later",
      items: [
        {
          publicId: "m5",
          title: "Draw the seating plan",
          date: "2026-08-27",
          state: "later",
        },
        {
          publicId: "m6",
          title: "Final headcount to the venue",
          date: "2026-09-10",
          state: "later",
        },
      ],
    },
    {
      state: "cancelled",
      label: "Set aside",
      items: [
        {
          // Dated inside the milestone range on purpose: a set-aside item
          // outside it would stretch the date-to-position mapping and pull
          // the six points off their even pitch.
          publicId: "m7",
          title: "A second venue viewing",
          date: "2026-07-20",
          state: "cancelled",
        },
      ],
    },
  ],
};
