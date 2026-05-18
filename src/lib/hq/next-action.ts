import { seedHqData } from "@/lib/hq/data";

/**
 * The next physical act, and the clock it hangs on — derived, not authored.
 *
 * Deliberately self-contained. It does NOT import the proof-gate module:
 * that is a parallel session's uncommitted work, and coupling the forcing
 * function to it is the cross-session contamination the operating contract
 * forbids. The small slice of clock logic duplicated here reads the same
 * committed source (seedHqData.prospects) against the ratified 2026-05-18
 * review dates (decision #4) — stable constants, not a moving target.
 * If/when the proof gate lands in main, this can be re-pointed at it; until
 * then the forcing function stands alone and ships alone.
 *
 * While the clock is inert, HQ's only job is to put the one unavoidable
 * action a tap away: the pre-addressed email to the next venue in the
 * ratified Track A first-send order (project_venue_outreach_drafted /
 * venue-edition-outreach.md). The load-bearing personalised sentence is
 * NOT in code — it is the founder's to write per send. HQ surfaces the
 * venue, the inbox, the ratified subject, and points at the doc.
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

/** Concrete kill-clock dates — 2026-05-18 strategy review, decision #4. */
const OUTREACH_START = "2026-05-25"; // first five SENT, not drafted
const EXPIRY = "2026-08-07"; // 60-day kill-clock expiry

function parseDay(s: string): number | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const t = Date.parse(`${s}T00:00:00Z`);
  return Number.isNaN(t) ? null : t;
}

function daysBetween(fromMs: number, toMs: number): number {
  return Math.round((toMs - fromMs) / 86_400_000);
}

export type OutreachClock = {
  /** True until the first founder-signed send is logged. */
  inert: boolean;
  /** Logged sends (prospects with a lastContacted date). */
  sent: number;
  /** Whole days to the outreach-start deadline (negative once passed). */
  daysToStart: number;
  startDate: string;
  /** Deadline passed with the gate still unmoved. */
  startMissed: boolean;
  /** One honest sentence the eye can read in full. */
  line: string;
};

export type NextAction = {
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

function loggedSends(): number {
  const prospects = seedHqData.prospects ?? [];
  let sent = 0;
  for (const p of prospects) {
    if (parseDay(p.lastContacted) != null) sent += 1;
  }
  return sent;
}

export function getOutreachClock(): OutreachClock {
  const now = Date.now();
  const sent = loggedSends();
  const startMs = parseDay(OUTREACH_START)!;
  const expiryMs = parseDay(EXPIRY)!;
  const daysToStart = daysBetween(now, startMs);
  const inert = sent === 0;
  const startMissed = inert && now > startMs;

  let line: string;
  if (inert) {
    line =
      daysToStart >= 0
        ? `The 60-day window has not started — zero founder-signed sends are logged. ${daysToStart} day${daysToStart === 1 ? "" : "s"} to the outreach-start deadline (${OUTREACH_START}). The clock starts the day an email is sent, not the day it is drafted.`
        : `The outreach-start deadline (${OUTREACH_START}) has passed with zero sends. This is not discipline — it is the decision not made.`;
  } else if (now > expiryMs) {
    line = `60-day window expired ${EXPIRY}. ${sent} sent total. Spine §8 kill/pivot evaluation is due.`;
  } else {
    const dToExpiry = daysBetween(now, expiryMs);
    line = `Running. ${sent} send${sent === 1 ? "" : "s"} logged. ${dToExpiry} day${dToExpiry === 1 ? "" : "s"} to the ${EXPIRY} expiry.`;
  }

  return { inert, sent, daysToStart, startDate: OUTREACH_START, startMissed, line };
}

/**
 * The next un-sent Track A venue, or null when all five are sent (at which
 * point the clock is no longer inert anyway and HQ reverts to the scroll).
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
