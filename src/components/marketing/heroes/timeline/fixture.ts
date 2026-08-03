import type { AudienceTimelineDto } from "@/components/marketing/heroes/timeline/audience-timeline";

/**
 * A frozen wedding plan for the Timeline hero.
 *
 * Dates are fixed rather than derived from the clock, the same refusal the
 * Signal hero holds with its frozen dateline: a marketing hero must read the
 * same on every visit and must never quietly drift into the past. `today` sits
 * 47 days before the wedding, so the TimeLens has a real countdown to show
 * and the completed rail covers a believable share of the plan.
 *
 * The wedding is 2026-10-03, ratified by D-032 R1 on 2026-08-03 as the one
 * demonstration wedding date across the suite. It matches `DEMO_WEDDING_DATE`
 * in the app repo (`app/src/lib/demo-clock.ts`). This hero previously said
 * 2026-09-12, which is now retired.
 *
 * Every date in this fixture moved 21 days later in that change, so the shape
 * of the plan is unchanged: the same 14-day milestone pitch, the same 47-day
 * countdown, the same position of `today` between the second and third
 * milestones. Only the calendar it hangs on moved. The dates cannot be
 * imported from the app repo, so if the wedding date moves again, every date
 * below moves with it by the same number of days.
 */
export const TIMELINE_HERO_FIXTURE: AudienceTimelineDto = {
  version: 1,
  audienceKind: "couple",
  publicationId: "hero-the-wedding",
  label: "Mara and Finn",
  ownerDisplayLabel: "Mara",
  primaryDate: { label: "The wedding", date: "2026-10-03" },
  lastUpdatedAt: "2026-08-17T09:14:00.000Z",
  today: "2026-08-17",
  // The six milestones sit at an even 14-day pitch: 23 Jul, 6 Aug, 20 Aug,
  // 3 Sept, 17 Sept, 1 Oct. The artifact places points by date, so an even
  // cadence in the data is what produces even spacing on the rail, and the
  // entrance stagger (each point wakes as the drawing line reaches it) then
  // falls on an even beat too. A real plan is lumpy; a demo plan should not
  // be, because the lumpiness reads as a bug rather than as data.
  //
  // The series is placed so `today` (17 Aug) falls between the second and
  // third milestones. That matters: the artifact derives a milestone's state
  // from its date, so a "now" milestone dated in the past renders as overdue
  // rather than as the current one, and the indigo next-milestone marker
  // never appears. The wedding is 3 Oct, keeping the 47-day countdown.
  //
  // `primaryDate` is part of the axis the artifact scales positions against
  // (`artifact/timeline-artifact-model.ts`, calendarPositions). Moving the
  // wedding without moving the milestones would stretch the axis past the
  // last point and push the six points off their even pitch, which is why
  // this is a whole-fixture shift rather than a one-line date change.
  sections: [
    {
      state: "covered",
      label: "Done",
      items: [
        { publicId: "m1", title: "Venue booked", date: "2026-07-23", state: "covered" },
        {
          publicId: "m2",
          title: "Photographer confirmed",
          date: "2026-08-06",
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
          date: "2026-08-20",
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
          date: "2026-09-03",
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
          date: "2026-09-17",
          state: "later",
        },
        {
          publicId: "m6",
          title: "Final headcount to the venue",
          date: "2026-10-01",
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
          date: "2026-08-10",
          state: "cancelled",
        },
      ],
    },
  ],
};

export const HOMEPAGE_RELAY_TIMELINE_FIXTURE: AudienceTimelineDto = {
  ...TIMELINE_HERO_FIXTURE,
  publicationId: "homepage-relay-wedding",
  sections: TIMELINE_HERO_FIXTURE.sections.map((section) => ({
    ...section,
    items: section.items.map((item) =>
      item.publicId === "m3"
        ? { ...item, title: "Side room held after six" }
        : item,
    ),
  })),
};
