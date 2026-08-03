/**
 * The runtime link registry for `/v/<token>`.
 *
 * ── What this is, and what it deliberately is not ────────────────────────
 *
 * `E13.16-link-and-destination-contract.md` section 2 defines
 * `signal-film-links/v2`: the operator-side file written by
 * `tools/venue-map-links.mjs`, kept under `private/`, gitignored, eleven
 * fields and no twelfth. **This module does not read that file and does not
 * extend it.** That file is E13.16's and lives in another package.
 *
 * This is the *destination's* projection of it: the fields the page needs in
 * order to render, joined to the operator file by `accountId`. It is supplied
 * to the deployment through one environment variable so that no venue name and
 * no token is ever committed to this repository.
 *
 * ── The safety properties, each traceable ────────────────────────────────
 *
 *  - **Fail closed.** No variable, a malformed document, or a single refused
 *    row produces an empty registry, and an empty registry 404s every token.
 *    A partially valid mapping is the state E13.16 criteria 16 and 17 call a
 *    fatal finding, so it is treated as fatal for the whole document rather
 *    than silently dropping the rows that failed.
 *  - **No oracle.** Resolution scans the whole list and compares every token
 *    with a length-independent, early-exit-free comparison, so an unknown
 *    token costs the same work as a known one (section 6).
 *  - **Exactly one live link per venue.** Zero is fatal because the account is
 *    unreachable; two is fatal because two live links for one venue is the
 *    condition the file exists to prevent (criterion 17).
 *  - **No venue name in any URL.** Criterion 4, enforced here as well as in
 *    the generator, because this is the half that reaches a browser.
 */

export const VENUE_INVITATION_LINKS_VERSION = "venue-invitation-links.v1";

/** E13.16 section 1: 24 characters, leading letter, URL-safe alphabet. */
export const VENUE_INVITATION_TOKEN_PATTERN = /^[A-Za-z][A-Za-z0-9]{23}$/;

/** The join key everywhere in this programme. Never a venue name. */
export const VENUE_ACCOUNT_ID_PATTERN = /^VEN-\d{4}$/;

/** 01/25 through 25/25. D-009 point 6. */
export const FOUNDING_NUMBER_PATTERN = /^(?:0[1-9]|1\d|2[0-5])\/25$/;

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** The two states that share one URL. E13.16 section 3. */
export type VenueInvitationState = "invitation" | "proposal";

/** E13.16 section 12.1. A row with no status is a fatal finding. */
export type VenueInvitationStatus = "active" | "replaced" | "revoked";

/**
 * The proposal slots. E11.11 section 2: every slot is filled before sending,
 * and a slot left unfilled is a send defect. So an incomplete proposal row is
 * refused here rather than rendered with a gap in it.
 */
export type VenueInvitationProposal = {
  /** The person the walkthrough was with. Rendered once, in the salutation. */
  firstName: string;
  /** `YYYY-MM-DD`. The date of the walkthrough. */
  walkthroughDate: string;
  /** `YYYY-MM-DD`. Fourteen days from the proposal, D-009 point 7. */
  holdEndsOn: string;
  /** Places already taken. Verified against the register at the moment of sending. */
  paidCount: number;
  /** The next free number, `NN/25`. */
  nextFreeNumber: string;
};

/**
 * A film is optional and its captions are not. E13.16 section 3.1 requires a
 * `.vtt` track because most first views are muted, so a film without one is
 * refused rather than rendered silently.
 */
export type VenueInvitationFilm = {
  url: string;
  posterUrl: string;
  captionsUrl: string;
};

export type VenueInvitationLink = {
  token: string;
  accountId: string;
  /** Rendered on the page. Never in a URL, never in metadata. */
  venueName: string;
  state: VenueInvitationState;
  status: VenueInvitationStatus;
  /** From the account record, for the click event. E13.16 section 4.2. */
  cohort: number;
  touch: string;
  film: VenueInvitationFilm | null;
  proposal: VenueInvitationProposal | null;
};

export type VenueInvitationRegistry = {
  links: readonly VenueInvitationLink[];
  /** Empty when the registry loaded cleanly. Never rendered to a visitor. */
  refusals: readonly string[];
};

export const EMPTY_VENUE_INVITATION_REGISTRY: VenueInvitationRegistry = {
  links: [],
  refusals: [],
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) return false;
  const ms = Date.parse(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(ms)) return false;
  return new Date(ms).toISOString().slice(0, 10) === value;
}

/**
 * Criterion 4, enforced on the half that reaches a browser. A venue name in a
 * media URL puts it into CDN logs, referrer headers and every thread the page
 * is forwarded into, which is the exact reasoning D-032 R13 used to settle the
 * URL shape.
 */
function urlContainsVenueName(url: string, venueName: string): boolean {
  const words = venueName
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((word) => word.length >= 4);
  if (words.length === 0) return false;
  const haystack = url.toLowerCase();
  return words.some((word) => haystack.includes(word));
}

function readFilm(
  raw: unknown,
  venueName: string,
  where: string,
  refusals: string[],
): VenueInvitationFilm | null {
  if (raw == null) return null;
  if (!isPlainObject(raw)) {
    refusals.push(`${where}: film must be an object or null`);
    return null;
  }
  const url = raw.url;
  const posterUrl = raw.posterUrl;
  const captionsUrl = raw.captionsUrl;
  if (typeof url !== "string" || url.length === 0) {
    refusals.push(`${where}: film.url is required when a film is present`);
    return null;
  }
  if (typeof posterUrl !== "string" || posterUrl.length === 0) {
    refusals.push(`${where}: film.posterUrl is required, autoplay is forbidden`);
    return null;
  }
  if (typeof captionsUrl !== "string" || captionsUrl.length === 0) {
    refusals.push(
      `${where}: film.captionsUrl is required, most first views are muted`,
    );
    return null;
  }
  for (const [field, value] of [
    ["url", url],
    ["posterUrl", posterUrl],
    ["captionsUrl", captionsUrl],
  ] as const) {
    if (urlContainsVenueName(value, venueName)) {
      refusals.push(`${where}: film.${field} contains the venue name`);
      return null;
    }
  }
  return { url, posterUrl, captionsUrl };
}

function readProposal(
  raw: unknown,
  where: string,
  refusals: string[],
): VenueInvitationProposal | null {
  if (!isPlainObject(raw)) {
    refusals.push(`${where}: proposal is required when state is "proposal"`);
    return null;
  }
  const { firstName, walkthroughDate, holdEndsOn, paidCount, nextFreeNumber } =
    raw;
  let ok = true;
  if (typeof firstName !== "string" || firstName.trim().length === 0) {
    refusals.push(`${where}: proposal.firstName is an unfilled slot`);
    ok = false;
  }
  if (!isIsoDate(walkthroughDate)) {
    refusals.push(`${where}: proposal.walkthroughDate must be YYYY-MM-DD`);
    ok = false;
  }
  if (!isIsoDate(holdEndsOn)) {
    refusals.push(`${where}: proposal.holdEndsOn must be YYYY-MM-DD`);
    ok = false;
  }
  if (
    typeof paidCount !== "number" ||
    !Number.isInteger(paidCount) ||
    paidCount < 0 ||
    paidCount > 25
  ) {
    refusals.push(`${where}: proposal.paidCount must be a whole number 0 to 25`);
    ok = false;
  }
  if (
    typeof nextFreeNumber !== "string" ||
    !FOUNDING_NUMBER_PATTERN.test(nextFreeNumber)
  ) {
    refusals.push(`${where}: proposal.nextFreeNumber must read NN/25`);
    ok = false;
  }
  if (!ok) return null;
  return {
    firstName: (firstName as string).trim(),
    walkthroughDate: walkthroughDate as string,
    holdEndsOn: holdEndsOn as string,
    paidCount: paidCount as number,
    nextFreeNumber: nextFreeNumber as string,
  };
}

/**
 * Parse and validate a registry document. Pure: no environment, no clock, no
 * filesystem, so the whole refusal surface is testable.
 */
export function parseVenueInvitationLinks(
  input: unknown,
): VenueInvitationRegistry {
  const refusals: string[] = [];

  let document: unknown = input;
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed.length === 0) return EMPTY_VENUE_INVITATION_REGISTRY;
    try {
      document = JSON.parse(trimmed);
    } catch {
      return { links: [], refusals: ["registry is not valid JSON"] };
    }
  }

  if (!isPlainObject(document)) {
    return { links: [], refusals: ["registry must be a JSON object"] };
  }
  if (document.version !== VENUE_INVITATION_LINKS_VERSION) {
    return {
      links: [],
      refusals: [
        `registry version must be "${VENUE_INVITATION_LINKS_VERSION}"`,
      ],
    };
  }
  if (!Array.isArray(document.links)) {
    return { links: [], refusals: ["registry.links must be an array"] };
  }

  const links: VenueInvitationLink[] = [];
  const seenTokens = new Set<string>();
  const activeByAccount = new Map<string, number>();
  const liveByAccount = new Map<string, number>();
  const knownAccounts = new Set<string>();

  document.links.forEach((raw, index) => {
    const where = `links[${index}]`;
    if (!isPlainObject(raw)) {
      refusals.push(`${where}: each link must be an object`);
      return;
    }

    const { token, accountId, venueName, state, status, cohort, touch } = raw;

    if (typeof token !== "string" || !VENUE_INVITATION_TOKEN_PATTERN.test(token)) {
      refusals.push(
        `${where}: token must be 24 characters, starting with a letter`,
      );
      return;
    }
    if (seenTokens.has(token)) {
      refusals.push(`${where}: duplicate token`);
      return;
    }
    seenTokens.add(token);

    if (
      typeof accountId !== "string" ||
      !VENUE_ACCOUNT_ID_PATTERN.test(accountId)
    ) {
      refusals.push(`${where}: accountId must read VEN-nnnn`);
      return;
    }
    knownAccounts.add(accountId);

    if (typeof venueName !== "string" || venueName.trim().length === 0) {
      refusals.push(`${where}: venueName is required`);
      return;
    }

    if (state !== "invitation" && state !== "proposal") {
      refusals.push(`${where}: state must be "invitation" or "proposal"`);
      return;
    }
    if (status !== "active" && status !== "replaced" && status !== "revoked") {
      refusals.push(
        `${where}: status must be "active", "replaced" or "revoked", never absent`,
      );
      return;
    }

    if (typeof cohort !== "number" || !Number.isInteger(cohort) || cohort < 1) {
      refusals.push(`${where}: cohort must be a whole number of at least 1`);
      return;
    }
    if (typeof touch !== "string" || touch.trim().length === 0) {
      refusals.push(`${where}: touch is required, it is carried on the event`);
      return;
    }

    const name = venueName.trim();
    if (urlContainsVenueName(token, name)) {
      refusals.push(`${where}: the token contains the venue name`);
      return;
    }

    const film = readFilm(raw.film, name, where, refusals);
    if (raw.film != null && film === null) return;

    let proposal: VenueInvitationProposal | null = null;
    if (state === "proposal") {
      proposal = readProposal(raw.proposal, where, refusals);
      if (proposal === null) return;
    } else if (raw.proposal != null) {
      refusals.push(
        `${where}: proposal slots must be absent while the state is "invitation"`,
      );
      return;
    }

    if (status === "active") {
      activeByAccount.set(accountId, (activeByAccount.get(accountId) ?? 0) + 1);
    }
    if (status !== "revoked") {
      liveByAccount.set(accountId, (liveByAccount.get(accountId) ?? 0) + 1);
    }

    links.push({
      token,
      accountId,
      venueName: name,
      state,
      status,
      cohort,
      touch: touch.trim(),
      film,
      proposal,
    });
  });

  /**
   * Criterion 17, with the one distinction the criterion does not make because
   * it was written about the cohort file rather than the destination's copy of
   * it.
   *
   * Two active links for one venue is fatal either way: that is the condition
   * the mapping exists to prevent.
   *
   * Zero active links is fatal **only while the venue is still in the
   * programme**, which is what a `replaced` row means: it still needs to reach
   * the page and it cannot. A venue whose rows are all `revoked` has said stop
   * (section 12.5), and being unreachable is the point rather than a defect.
   * Its rows come out of this document entirely when its outreach observation
   * is deleted under section 5; until then they resolve to the same 404 as an
   * unknown token.
   */
  for (const accountId of knownAccounts) {
    const active = activeByAccount.get(accountId) ?? 0;
    const live = liveByAccount.get(accountId) ?? 0;
    if (active > 1) {
      refusals.push(
        `${accountId}: ${active} active links, exactly one is permitted`,
      );
    } else if (active === 0 && live > 0) {
      refusals.push(
        `${accountId}: no active link, the venue cannot reach the page`,
      );
    }
  }

  if (refusals.length > 0) return { links: [], refusals };
  return { links, refusals: [] };
}

/**
 * Compare two strings without an early exit. Length is compared as data rather
 * than as a branch, so a wrong-length token costs the same as a wrong-value
 * one. E13.16 section 6: the response time must not reveal which is which.
 */
function constantTimeEquals(a: string, b: string): boolean {
  const length = Math.max(a.length, b.length);
  let difference = a.length ^ b.length;
  for (let i = 0; i < length; i += 1) {
    difference |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return difference === 0;
}

/**
 * Resolve a token against a registry. Scans every row and never returns early,
 * so a miss does the same work as a hit.
 */
export function resolveVenueInvitationLink(
  registry: VenueInvitationRegistry,
  token: string,
): VenueInvitationLink | null {
  let found: VenueInvitationLink | null = null;
  for (const link of registry.links) {
    if (constantTimeEquals(link.token, token)) found = link;
  }
  if (found === null) return null;
  // A revoked link is indistinguishable from an unknown one, by contract.
  if (found.status === "revoked") return null;
  return found;
}

let cached: VenueInvitationRegistry | null = null;

/**
 * The deployment's registry, parsed once. `VENUE_INVITATION_LINKS` holds the
 * JSON document. Absent means every token 404s, which is the correct state for
 * a preview build and for any environment the cohort has not been loaded into.
 */
export function getVenueInvitationRegistry(
  raw: string | undefined = process.env.VENUE_INVITATION_LINKS,
): VenueInvitationRegistry {
  if (cached !== null) return cached;
  const registry =
    raw === undefined || raw.trim().length === 0
      ? EMPTY_VENUE_INVITATION_REGISTRY
      : parseVenueInvitationLinks(raw);
  cached = registry;
  return registry;
}

/** Test seam. Never called from a route. */
export function resetVenueInvitationRegistryCache(): void {
  cached = null;
}
