import { seedHqData } from "@/lib/hq/data";

/**
 * The next physical act — derived, not authored.
 *
 * While the proof-gate clock is inert, HQ's only job is to put the one
 * unavoidable action a tap away. Not a metric. Not a prompt. The actual
 * pre-addressed email to the next venue in the ratified Track A first-send
 * order (project_venue_outreach_drafted_2026_05_16 / venue-edition-outreach.md).
 *
 * Track A order is a ratified decision, not a ranking the code invents:
 * the sharp 4-star independent wedge — owner reachable on a wedding inbox,
 * real volume, short decision path. Each id maps to a committed prospect
 * row; a missing or already-sent row is skipped, not faked.
 *
 * The load-bearing personalised sentence is NOT in code — it lives in
 * signal-growth/outbound/venue-edition-outreach.md and is the founder's
 * to write per send. HQ surfaces the venue, the inbox, the pre-set
 * subject, and points at the doc. It does not pretend to write the
 * sentence that earns the reply.
 */

/** Ratified Track A first-send order. Decision, not heuristic. */
const TRACK_A_ORDER = [
  "hotel-clontarf-castle-hotel",
  "hotel-harvey-s-point",
  "hotel-montenotte-hotel",
  "hotel-imperial-hotel",
  "hotel-waterford-castle",
] as const;

const RATIFIED_SUBJECT = "Founding Venue Programme";

export type NextAction = {
  /** Venue name, verbatim from the committed prospect row. */
  organisation: string;
  email: string;
  location: string;
  /** Pre-addressed, subject set — one tap opens the draft. */
  mailtoHref: string;
  /** Position in the ratified send order, 1-based. */
  ordinal: number;
  /** How many Track A venues remain unsent (this one included). */
  remaining: number;
  /** Where the load-bearing sentence lives — HQ never authors it. */
  draftDoc: string;
} | null;

/**
 * Returns the next un-sent Track A venue, or null when all five are sent
 * (at which point the clock is no longer inert anyway and HQ reverts).
 */
export function getNextOutreachAction(): NextAction {
  const prospects = seedHqData.prospects ?? [];
  const byId = new Map(prospects.map((p) => [p.id, p]));

  const unsent = TRACK_A_ORDER.map((id) => byId.get(id)).filter(
    (p): p is NonNullable<typeof p> =>
      !!p && p.status === "To Contact" && !p.lastContacted,
  );

  if (unsent.length === 0) return null;

  const next = unsent[0];
  const ordinal =
    TRACK_A_ORDER.indexOf(next.id as (typeof TRACK_A_ORDER)[number]) + 1;

  return {
    organisation: next.organisation,
    email: next.email,
    location: next.location,
    mailtoHref: `mailto:${next.email}?subject=${encodeURIComponent(RATIFIED_SUBJECT)}`,
    ordinal,
    remaining: unsent.length,
    draftDoc: "signal-growth/outbound/venue-edition-outreach.md",
  };
}
