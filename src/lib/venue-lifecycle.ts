/**
 * Venue Edition lifecycle — the state machine, written down and executable.
 *
 * Covers VEF-2026 E04.03 (invitation states), E04.07 (the lifecycle from
 * invitation through active planning, post-wedding access, Keepsake and
 * deletion), E04.11 (edge cases) and E04.12 (deterministic fixtures).
 *
 * ── The central architectural claim ────────────────────────────────────
 *
 * There are TWO axes, not one, and they are deliberately orthogonal:
 *
 *   ACCESS       what the couple can do with their workspace
 *   SPONSORSHIP  the commercial link between a venue and that workspace
 *
 * **No sponsorship transition may ever change the access state.** That is not
 * a style preference. It is D-020 point 2, which Signal Studio commits to in
 * writing to every founding venue: *any workspace already redeemed keeps its
 * full term plus Keepsake, whatever happens to the licence. Only new issuance
 * stops.* And it is D-020 point 3: when a venue releases a workspace, the
 * couple keeps their content and only the branding comes off.
 *
 * Collapsing the two axes into one enum is the mistake this file exists to
 * prevent, because the failure it produces — a couple losing their wedding
 * planning because a venue did not renew — is the worst outcome available to
 * this product.
 *
 * Pure and client-safe. No database, no I/O.
 */

import {
  coupleAccessExpiryMs,
  normaliseWeddingDateMs,
} from "./venue-edition";

/* ── Axis 1: the invitation (the code) · E04.03 ──────────────────────────── */

/**
 * `created`   minted, not handed to anyone
 * `sent`      delivered to the couple (delivered_at recorded)
 * `opened`    the couple loaded the redemption page
 * `redeemed`  claimed, an entitlement exists
 * `expired`   the code's own expiry passed before redemption
 * `revoked`   withdrawn by Signal Studio or the venue
 * `replaced`  superseded by a reissue, which carries the same intent
 *
 * `opened` is a FIRST-PARTY PAGE LOAD of `/redeem/{code}`, and nothing else.
 * It is explicitly not an email open. D-013 point 3 bans open pixels — "open
 * tracking on a cold email to people you want a trust relationship with is a
 * bad trade" — and that ban stands. A page the couple deliberately opened is a
 * different fact from a pixel fired without their knowledge, and only the
 * first one is recorded here.
 */
export const INVITATION_STATES = [
  "created",
  "sent",
  "opened",
  "redeemed",
  "expired",
  "revoked",
  "replaced",
] as const;
export type InvitationState = (typeof INVITATION_STATES)[number];

export const INVITATION_TERMINAL_STATES: readonly InvitationState[] = [
  "redeemed",
  "expired",
  "revoked",
  "replaced",
];

export type InvitationEvent =
  | "deliver"
  | "open"
  | "redeem"
  | "expire"
  | "revoke"
  | "replace";

const INVITATION_TRANSITIONS: Record<
  InvitationState,
  Partial<Record<InvitationEvent, InvitationState>>
> = {
  // A code can be re-delivered (the couple lost the email) without moving on.
  created: {
    deliver: "sent",
    open: "opened",
    redeem: "redeemed",
    expire: "expired",
    revoke: "revoked",
    replace: "replaced",
  },
  sent: {
    deliver: "sent",
    open: "opened",
    redeem: "redeemed",
    expire: "expired",
    revoke: "revoked",
    replace: "replaced",
  },
  // Opening twice is ordinary. It must not be an error.
  opened: {
    deliver: "sent",
    open: "opened",
    redeem: "redeemed",
    expire: "expired",
    revoke: "revoked",
    replace: "replaced",
  },
  // Terminal. A redeemed code is spent; revoking it would strand the
  // entitlement it already produced, which the access axis forbids.
  redeemed: {},
  // An expired or revoked code can still be replaced by a reissue, which is
  // exactly what a venue does when a couple comes back late.
  expired: { replace: "replaced", revoke: "revoked" },
  revoked: { replace: "replaced" },
  replaced: {},
};

export function nextInvitationState(
  from: InvitationState,
  event: InvitationEvent,
): InvitationState | null {
  return INVITATION_TRANSITIONS[from][event] ?? null;
}

export function isInvitationTerminal(state: InvitationState): boolean {
  return INVITATION_TERMINAL_STATES.includes(state);
}

/* ── Axis 2: couple access · E04.07 ──────────────────────────────────────── */

/**
 * `invited`   a code exists for this couple; nothing has been claimed
 * `active`    redeemed, inside the term, full product
 * `keepsake`  the term has ended: free, read-only, indefinite while the
 *             service exists, with a one-click export the couple owns
 *             (D-010 point 3). Never described as "forever", and it carries
 *             no storage guarantee.
 * `deleted`   erased at the couple's request
 *
 * There is deliberately no separate "post-wedding" state. The wedding day is
 * not an access event: D-010 and D-022 fold it into the term itself, so a
 * couple is `active` until `max(redemption + 548 days, wedding + 90 days)` and
 * `keepsake` after. A state that changed on the wedding day would be a state
 * that could fire on the wedding day.
 */
export const COUPLE_ACCESS_STATES = [
  "invited",
  "active",
  "keepsake",
  "deleted",
] as const;
export type CoupleAccessState = (typeof COUPLE_ACCESS_STATES)[number];

export type CoupleAccessEvent = "redeem" | "term_ends" | "erase";

const ACCESS_TRANSITIONS: Record<
  CoupleAccessState,
  Partial<Record<CoupleAccessEvent, CoupleAccessState>>
> = {
  invited: { redeem: "active", erase: "deleted" },
  active: { term_ends: "keepsake", erase: "deleted" },
  // Keepsake never expires on its own. It ends when the couple ends it, or if
  // the service ends — and the service ending is not a state transition this
  // machine gets to make on a couple's behalf.
  keepsake: { erase: "deleted" },
  deleted: {},
};

export function nextCoupleAccessState(
  from: CoupleAccessState,
  event: CoupleAccessEvent,
): CoupleAccessState | null {
  return ACCESS_TRANSITIONS[from][event] ?? null;
}

/**
 * Derive the access state from the data, rather than storing it. A stored
 * state is a second source of truth that drifts; the entitlement row already
 * carries every fact this needs.
 */
export function deriveCoupleAccessState(input: {
  redeemedAtMs: number | null;
  expiresAtMs: number | null;
  erasedAtMs?: number | null;
  nowMs: number;
}): CoupleAccessState {
  if (input.erasedAtMs != null && input.erasedAtMs <= input.nowMs) return "deleted";
  if (input.redeemedAtMs == null) return "invited";
  if (input.expiresAtMs == null) return "active";
  return input.expiresAtMs > input.nowMs ? "active" : "keepsake";
}

/* ── Axis 3: sponsorship · E04.06 ────────────────────────────────────────── */

/**
 * `pending`   the venue issued a code, nobody has claimed it
 * `active`    a couple redeemed it; the venue's name and branding are on the
 *             workspace and it counts toward the venue's adoption evidence
 * `released`  the venue released the link (D-020 point 3: the couple cancelled
 *             or moved venue). Branding and the venue name come off within
 *             24 hours; the couple keeps everything.
 * `ended`     the venue's licence lapsed. Existing workspaces are untouched;
 *             only new issuance stops (D-020 point 2).
 * `revoked`   withdrawn by Signal Studio, for cause.
 *
 * Every one of the last three leaves the ACCESS axis exactly where it was.
 */
export const SPONSORSHIP_STATES = [
  "pending",
  "active",
  "released",
  "ended",
  "revoked",
] as const;
export type SponsorshipState = (typeof SPONSORSHIP_STATES)[number];

export type SponsorshipEvent = "redeem" | "release" | "licence_lapses" | "revoke";

const SPONSORSHIP_TRANSITIONS: Record<
  SponsorshipState,
  Partial<Record<SponsorshipEvent, SponsorshipState>>
> = {
  pending: { redeem: "active", release: "released", licence_lapses: "ended", revoke: "revoked" },
  active: { release: "released", licence_lapses: "ended", revoke: "revoked" },
  released: { revoke: "revoked" },
  ended: { release: "released", revoke: "revoked" },
  revoked: {},
};

export function nextSponsorshipState(
  from: SponsorshipState,
  event: SponsorshipEvent,
): SponsorshipState | null {
  return SPONSORSHIP_TRANSITIONS[from][event] ?? null;
}

/** Sponsorship states in which the venue's branding may appear on a workspace. */
export function sponsorBrandingVisible(state: SponsorshipState): boolean {
  return state === "active";
}

/**
 * D-020 point 3. Branding and the venue's name come off within 24 hours of a
 * release. Expressed as a deadline so it is checkable rather than aspirational.
 */
export const BRANDING_REMOVAL_DEADLINE_MS = 24 * 60 * 60 * 1000;

export function brandingRemovalDeadlineMs(releasedAtMs: number): number {
  return releasedAtMs + BRANDING_REMOVAL_DEADLINE_MS;
}

/* ── The invariant that ties the axes together ───────────────────────────── */

/**
 * The commitment made to every founding venue, as a function.
 *
 * D-020 point 2, stated unprompted in the outreach email and the agreement:
 * a workspace already redeemed keeps its full term plus Keepsake whatever
 * happens to the licence. Only new issuance stops.
 *
 * Returns the access state after a sponsorship event, which is always the
 * access state before it. Any future change that makes this function return
 * something else is a change to the commercial promise, and goes through
 * change control rather than through a pull request.
 */
export function accessAfterSponsorshipEvent(input: {
  accessState: CoupleAccessState;
  event: SponsorshipEvent;
}): CoupleAccessState {
  return input.accessState;
}

/** Can this venue issue a new sponsored workspace right now? */
export function canIssueNewSponsorship(sponsorshipState: SponsorshipState): boolean {
  return sponsorshipState === "pending" || sponsorshipState === "active";
}

/* ── Deterministic fixtures · E04.12 ─────────────────────────────────────── */

/**
 * One fixture per lifecycle state, on a fixed clock, so every state can be
 * loaded, screenshotted, tested and reviewed without waiting eighteen months
 * for one of them to occur.
 *
 * The clock is pinned. Anything derived from `Date.now()` in a fixture is a
 * fixture that means something different tomorrow.
 */
export const LIFECYCLE_FIXTURE_NOW_MS = Date.parse("2027-06-01T12:00:00.000Z");

export type LifecycleFixture = {
  id: string;
  label: string;
  /** What this fixture is for. Reviewers read this, not the field values. */
  proves: string;
  invitation: InvitationState;
  access: CoupleAccessState;
  sponsorship: SponsorshipState;
  redeemedAtMs: number | null;
  weddingDateMs: number | null;
  expiresAtMs: number | null;
  erasedAtMs: number | null;
};

const day = (iso: string) => Date.parse(iso);

function sponsoredExpiry(redeemedAtMs: number, weddingDate: string | null): number {
  return coupleAccessExpiryMs({
    redeemedAtMs,
    weddingDateMs: normaliseWeddingDateMs(weddingDate),
  });
}

export const LIFECYCLE_FIXTURES: readonly LifecycleFixture[] = [
  {
    id: "invited-unsent",
    label: "Minted, not yet delivered",
    proves: "A code exists and nothing about the couple does.",
    invitation: "created",
    access: "invited",
    sponsorship: "pending",
    redeemedAtMs: null,
    weddingDateMs: null,
    expiresAtMs: null,
    erasedAtMs: null,
  },
  {
    id: "invited-sent",
    label: "Delivered, not opened",
    proves: "Delivery is recorded without any claim about the couple reading it.",
    invitation: "sent",
    access: "invited",
    sponsorship: "pending",
    redeemedAtMs: null,
    weddingDateMs: null,
    expiresAtMs: null,
    erasedAtMs: null,
  },
  {
    id: "invited-opened",
    label: "Redemption page opened",
    proves: "A first-party page load, which is not an email open.",
    invitation: "opened",
    access: "invited",
    sponsorship: "pending",
    redeemedAtMs: null,
    weddingDateMs: null,
    expiresAtMs: null,
    erasedAtMs: null,
  },
  {
    id: "invited-expired",
    label: "Code expired before redemption",
    proves: "An unredeemed code can lapse without ever touching the access axis.",
    invitation: "expired",
    access: "invited",
    sponsorship: "pending",
    redeemedAtMs: null,
    weddingDateMs: null,
    expiresAtMs: null,
    erasedAtMs: null,
  },
  {
    id: "invited-revoked",
    label: "Code withdrawn before redemption",
    proves: "Withdrawal is only ever available before a claim exists.",
    invitation: "revoked",
    access: "invited",
    sponsorship: "pending",
    redeemedAtMs: null,
    weddingDateMs: null,
    expiresAtMs: null,
    erasedAtMs: null,
  },
  {
    id: "invited-replaced",
    label: "Code reissued",
    proves: "A venue can reissue; the superseded code is closed, not deleted.",
    invitation: "replaced",
    access: "invited",
    sponsorship: "pending",
    redeemedAtMs: null,
    weddingDateMs: null,
    expiresAtMs: null,
    erasedAtMs: null,
  },
  {
    id: "active-short-lead",
    label: "Active, wedding inside the 548-day floor",
    proves: "The ratified floor governs when the wedding is close.",
    invitation: "redeemed",
    access: "active",
    sponsorship: "active",
    redeemedAtMs: day("2027-03-01T10:00:00.000Z"),
    weddingDateMs: normaliseWeddingDateMs("2027-09-04"),
    expiresAtMs: sponsoredExpiry(day("2027-03-01T10:00:00.000Z"), "2027-09-04"),
    erasedAtMs: null,
  },
  {
    id: "active-long-lead",
    label: "Active, wedding beyond the floor (R-015)",
    proves:
      "The exact case the grace rule exists for: under a flat 548-day term this couple lost the product a year before their wedding.",
    invitation: "redeemed",
    access: "active",
    sponsorship: "active",
    redeemedAtMs: day("2027-03-01T10:00:00.000Z"),
    weddingDateMs: normaliseWeddingDateMs("2029-09-16"),
    expiresAtMs: sponsoredExpiry(day("2027-03-01T10:00:00.000Z"), "2029-09-16"),
    erasedAtMs: null,
  },
  {
    id: "active-no-date",
    label: "Active, wedding date not supplied",
    proves: "An unknown date falls back to the floor and is never worse than the shipped behaviour.",
    invitation: "redeemed",
    access: "active",
    sponsorship: "active",
    redeemedAtMs: day("2027-03-01T10:00:00.000Z"),
    weddingDateMs: null,
    expiresAtMs: sponsoredExpiry(day("2027-03-01T10:00:00.000Z"), null),
    erasedAtMs: null,
  },
  {
    id: "active-licence-ended",
    label: "Active, but the venue's licence has lapsed",
    proves:
      "D-020 point 2, the survival sentence: the licence ends and the couple's access does not move.",
    invitation: "redeemed",
    access: "active",
    sponsorship: "ended",
    redeemedAtMs: day("2026-09-01T10:00:00.000Z"),
    weddingDateMs: normaliseWeddingDateMs("2028-04-14"),
    expiresAtMs: sponsoredExpiry(day("2026-09-01T10:00:00.000Z"), "2028-04-14"),
    erasedAtMs: null,
  },
  {
    id: "active-released",
    label: "Active, venue released the workspace",
    proves:
      "D-020 point 3: the couple moved venue, keeps everything, and only the branding comes off.",
    invitation: "redeemed",
    access: "active",
    sponsorship: "released",
    redeemedAtMs: day("2026-11-20T10:00:00.000Z"),
    weddingDateMs: normaliseWeddingDateMs("2028-02-05"),
    expiresAtMs: sponsoredExpiry(day("2026-11-20T10:00:00.000Z"), "2028-02-05"),
    erasedAtMs: null,
  },
  {
    id: "keepsake",
    label: "Term ended, Keepsake",
    proves:
      "Free, read-only, indefinite while the service exists, with an export the couple owns. Never 'forever'.",
    invitation: "redeemed",
    access: "keepsake",
    sponsorship: "active",
    redeemedAtMs: day("2024-01-10T10:00:00.000Z"),
    weddingDateMs: normaliseWeddingDateMs("2025-05-31"),
    expiresAtMs: sponsoredExpiry(day("2024-01-10T10:00:00.000Z"), "2025-05-31"),
    erasedAtMs: null,
  },
  {
    id: "keepsake-released",
    label: "Keepsake, sponsorship released",
    proves: "Keepsake outlives the commercial link entirely.",
    invitation: "redeemed",
    access: "keepsake",
    sponsorship: "released",
    redeemedAtMs: day("2024-01-10T10:00:00.000Z"),
    weddingDateMs: normaliseWeddingDateMs("2025-05-31"),
    expiresAtMs: sponsoredExpiry(day("2024-01-10T10:00:00.000Z"), "2025-05-31"),
    erasedAtMs: null,
  },
  {
    id: "deleted",
    label: "Erased at the couple's request",
    proves: "Erasure is terminal and reachable from every access state.",
    invitation: "redeemed",
    access: "deleted",
    sponsorship: "revoked",
    redeemedAtMs: day("2025-02-02T10:00:00.000Z"),
    weddingDateMs: normaliseWeddingDateMs("2026-06-06"),
    expiresAtMs: sponsoredExpiry(day("2025-02-02T10:00:00.000Z"), "2026-06-06"),
    erasedAtMs: day("2026-10-01T09:00:00.000Z"),
  },
];

export function lifecycleFixture(id: string): LifecycleFixture | undefined {
  return LIFECYCLE_FIXTURES.find((f) => f.id === id);
}
