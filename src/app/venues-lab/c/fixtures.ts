/**
 * Fixture data for Variant C. Canon only: the venue is Glenmara House, the
 * couple are Mara and Finn (venue-copy.ts fixture canon). Nothing here is
 * marketing copy; it is the sample workspace the two product views render.
 */

import type { SignalReadItem } from "@/components/marketing/heroes/signal/the-read";
import type { AudienceTimelineDto } from "@/components/marketing/heroes/timeline/audience-timeline";
import { TIMELINE_HERO_FIXTURE } from "@/components/marketing/heroes/timeline/fixture";

/**
 * The couple's own briefing. The point of showing it on a venue page is that
 * the venue never sees this screen: it is the couple's, and it names the
 * venue only because the couple is waiting on the venue.
 */
export const TERMS_SIGNAL_ITEMS: SignalReadItem[] = [
  {
    ordinal: "01",
    claim: "now",
    title: "Glenmara House has not answered on the side room.",
    why: "Mara asked on Tuesday. The request is still open in Tasks.",
    receipts: ["Notes + Tasks", "updated today"],
    action: "Open task",
  },
  {
    ordinal: "02",
    claim: "next",
    title: "The shared plan changes when the room is confirmed.",
    why: "Family and suppliers read the plan. The milestone publishes on confirmation, not before.",
    receipts: ["Timeline", "current share"],
    action: "Open timeline",
  },
];

/**
 * The shared plan. Built from the frozen product fixture so the dates, the
 * countdown and the rail geometry stay exactly as the product renders them;
 * two milestone titles are renamed onto venue canon.
 *
 * HOMEPAGE_RELAY_TIMELINE_FIXTURE is deliberately not reused: its "now"
 * milestone is written for the homepage relay story, and the relay strip that
 * accompanies it on the homepage names a venue that is not canon here.
 */
export const TERMS_TIMELINE_FIXTURE: AudienceTimelineDto = {
  ...TIMELINE_HERO_FIXTURE,
  publicationId: "venues-lab-c-wedding",
  sections: TIMELINE_HERO_FIXTURE.sections.map((section) => ({
    ...section,
    items: section.items.map((item) => {
      if (item.publicId === "m1") {
        return { ...item, title: "Glenmara House booked" };
      }
      if (item.publicId === "m3") {
        return { ...item, title: "Confirm the side room" };
      }
      return item;
    }),
  })),
};
