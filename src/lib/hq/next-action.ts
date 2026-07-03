import type { DbProspect } from "@/lib/db/schema";
import { seedHqData } from "@/lib/hq/data";

/**
 * The next physical act, derived, not authored.
 *
 * Single responsibility: pick the next un-sent Track A venue. Clock /
 * inert-state truth lives in proofgate.ts (the canonical, adopted source);
 * this module deliberately does NOT duplicate it any more, one source for
 * the clock, one source for the next venue, composed in page.tsx.
 *
 * The load-bearing personalised sentence is NOT in code, it is the
 * founder's to write per send (project_venue_outreach_drafted /
 * venue-edition-outreach.md). HQ surfaces the venue, the inbox, the
 * ratified subject, and points at the doc. It never fakes the sentence.
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
  organisation: string;
  email: string;
  location: string;
  /** Pre-addressed, subject set, one tap opens the draft. */
  mailtoHref: string;
  /** Position in the ratified send order, 1-based. */
  ordinal: number;
  /** How many Track A venues remain unsent (this one included). */
  remaining: number;
  /** Where the load-bearing sentence lives, HQ never authors it. */
  draftDoc: string;
} | null;

/**
 * The next un-sent Track A venue, or null when all five are sent (at which
 * point the clock is no longer inert anyway and HQ reverts to the scroll).
 */
export function getNextOutreachAction(dbProspects?: DbProspect[]): NextAction {
  // Prefer live DB prospects; fall back to seed data
  const byId = dbProspects
    ? new Map(
        dbProspects.map((p) => [
          p.id,
          { id: p.id, organisation: p.organisation, email: p.email, location: p.location, stage: p.stage, lastContactedAt: p.lastContactedAt },
        ]),
      )
    : new Map((seedHqData.prospects ?? []).map((p) => [p.id, { id: p.id, organisation: p.organisation, email: p.email, location: p.location, stage: "to_contact" as const, lastContactedAt: p.lastContacted || null }]));

  const unsent = TRACK_A_ORDER.map((id) => byId.get(id)).filter(
    (p): p is NonNullable<typeof p> =>
      !!p && p.stage === "to_contact" && !p.lastContactedAt,
  );

  if (unsent.length === 0) return null;

  const next = unsent[0]!;
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
