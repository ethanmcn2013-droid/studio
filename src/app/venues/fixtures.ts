import type { AudienceTimelineDto } from "@/components/marketing/heroes/timeline/audience-timeline";
import type { SignalReadItem } from "@/components/marketing/heroes/signal/the-read";

/**
 * The sample workspace shown in the two product views on this page.
 *
 * Canon, and the reason these exist rather than the shipped hero fixtures:
 * this page names Glenmara House in its provenance strip, so every string a
 * reader can see inside the product chrome has to agree with it. The shipped
 * `TIMELINE_HERO_FIXTURE` is Mara and Finn but carries no venue at all, and
 * `HOMEPAGE_RELAY_TIMELINE_FIXTURE` inherits the same gap.
 *
 * Dates are frozen, never derived from the clock: a marketing surface must
 * read the same on every visit and must never drift into the past. The pitch
 * and the position of `today` are copied from the shipped fixture on purpose,
 * because the artifact derives a milestone's state from its date, and a "now"
 * milestone dated in the past renders as overdue instead of current.
 *
 * `today` is Wednesday 29 July 2026, and that one date governs three surfaces
 * that a reader can see at once: this card's "Updated 29 Jul 2026", the
 * provenance strip above the two previews, and the Signal frame's label, which
 * carries the 09:00 timestamp proving the briefing is a morning note. They
 * previously disagreed, so the page said 27 July while the product inside it
 * said Wednesday the 29th.
 */
export const VENUE_TIMELINE_FIXTURE: AudienceTimelineDto = {
  version: 1,
  audienceKind: "couple",
  publicationId: "venues-wedding",
  label: "Mara and Finn",
  ownerDisplayLabel: "Mara",
  primaryDate: { label: "The wedding", date: "2026-09-12" },
  lastUpdatedAt: "2026-07-29T09:14:00.000Z",
  today: "2026-07-29",
  sections: [
    {
      state: "covered",
      label: "Done",
      items: [
        {
          publicId: "v1",
          title: "Glenmara House booked",
          date: "2026-07-02",
          state: "covered",
        },
        {
          publicId: "v2",
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
          publicId: "v3",
          title: "Menu tasting at Glenmara House",
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
          publicId: "v4",
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
          publicId: "v5",
          title: "Draw the seating plan",
          date: "2026-08-27",
          state: "later",
        },
        {
          publicId: "v6",
          title: "Final headcount to Glenmara House",
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
          publicId: "v7",
          title: "A second venue viewing",
          date: "2026-07-20",
          state: "cancelled",
        },
      ],
    },
  ],
};

/**
 * The couple's morning briefing. This is the note Mara and Finn get, not
 * anything the venue receives, which is why both items read as the couple's
 * own work and neither carries a venue-side action.
 */
export const VENUE_SIGNAL_ITEMS: SignalReadItem[] = [
  {
    ordinal: "01",
    claim: "now",
    title: "The menu tasting needs a final count.",
    why: "Glenmara House asked for numbers before Thursday. The count is still open in Tasks.",
    receipts: ["Notes + Tasks", "updated today"],
    action: "Open task",
  },
  {
    ordinal: "02",
    claim: "next",
    title: "Invitations follow two weeks later.",
    why: "The plan Mara and Finn share with their families puts them on 13 August.",
    receipts: ["Timeline", "current share"],
    action: "Open timeline",
  },
];
