/**
 * The invitation lifecycle — pure, client-safe, no database.
 *
 * ## Why this module exists and what it decided
 *
 * Two tables describe the same thing and nothing joined them:
 *
 *  - `license_codes` is the ledger. One row per code, three statuses
 *    (`minted | redeemed | revoked`) plus two nullable delivery columns
 *    (`delivered_at`, `expires_at`). It is written by the mint and the redeem
 *    path and is the only record that a couple actually took the benefit up.
 *  - `sponsor_activations` is the model. Six invitation states
 *    (`not_sent | sent | accepted | declined | expired | revoked`) with sent,
 *    accepted and declined timestamps. It has never been read or written in
 *    production.
 *
 * The substrate decision, made here and recorded so it is not re-made
 * silently: **`sponsor_activations` carries the invitation, `license_codes`
 * carries the truth about redemption, and the ledger outranks the record.**
 * Neither table alone can answer "where is this invitation" — the record
 * cannot know a couple redeemed (nothing writes back to it) and the ledger
 * cannot express `sent` or `declined` (it has no such statuses). So the
 * resolution below reads both and states which one answered.
 *
 * That ranking mirrors the rule already shipped in
 * `live/project-venue-access.ts`: ledger facts outrank the clock, and the
 * clock outranks an assumption.
 *
 * ## What this module refuses to do
 *
 * It never coerces a missing timestamp into a decision. An invitation marked
 * `sent` with no send timestamp is `unknown` staleness, never "fresh" and
 * never zero days old. Absent evidence is reported as absent.
 *
 * It never sends anything. `mark_sent` records that a human handed an
 * invitation over. No message leaves this system, and the wording in
 * `describeInvitationAction` says so in the same register as the surface.
 *
 * Client-safe on purpose: no `server-only`, no drizzle import, so it can be
 * unit-tested without a database and imported by a React component. The
 * database reads and writes live in `./store.ts`, which does import
 * `server-only`. `lifecycle.test.ts` asserts the state list here has not
 * drifted from `SPONSOR_INVITATION_STATES` in the schema.
 */

/** Mirrors `SPONSOR_INVITATION_STATES`. Drift is caught by lifecycle.test.ts. */
export const INVITATION_STATES = [
  "not_sent",
  "sent",
  "accepted",
  "declined",
  "expired",
  "revoked",
] as const;

export type InvitationState = (typeof INVITATION_STATES)[number];

export const INVITATION_ACTIONS = [
  "create",
  "mark_sent",
  "resend",
  "reveal_link",
  "revoke",
  "replace",
  "expire",
  "accept",
  "decline",
] as const;

export type InvitationAction = (typeof INVITATION_ACTIONS)[number];

/**
 * Who may take an action.
 *
 * `venue` actions are taken by a person administering the account. `system`
 * actions are consequences of a couple's own behaviour and are derived from
 * the code ledger — a venue must never be able to declare that a couple
 * accepted, because the venue does not know and the claim would end up in a
 * report.
 */
export type InvitationActor = "venue" | "system";

export type TransitionRule = {
  /** States the action may be taken from. Empty means it needs no prior row. */
  from: readonly InvitationState[];
  /** Resulting state, or null when the action changes no state. */
  to: InvitationState | null;
  actor: InvitationActor;
  /**
   * Destructive actions end a couple's route in. They carry type-to-confirm
   * friction on the surface and are enforced server-side, the way
   * `hq/entitlements/actions.ts` already enforces its own.
   */
  destructive: boolean;
  /** The exact word a person must type to confirm. Null when none is needed. */
  confirmWord: string | null;
};

const TRANSITIONS: Record<InvitationAction, TransitionRule> = {
  create: {
    from: [],
    to: "not_sent",
    actor: "venue",
    destructive: false,
    confirmWord: null,
  },
  mark_sent: {
    from: ["not_sent"],
    to: "sent",
    actor: "venue",
    destructive: false,
    confirmWord: null,
  },
  resend: {
    from: ["sent"],
    to: "sent",
    actor: "venue",
    destructive: false,
    confirmWord: null,
  },
  reveal_link: {
    from: ["not_sent", "sent"],
    to: null,
    actor: "venue",
    destructive: false,
    confirmWord: null,
  },
  revoke: {
    from: ["not_sent", "sent", "expired"],
    to: "revoked",
    actor: "venue",
    destructive: true,
    confirmWord: "REVOKE",
  },
  replace: {
    from: ["not_sent", "sent", "expired"],
    to: "revoked",
    actor: "venue",
    destructive: true,
    confirmWord: "REPLACE",
  },
  expire: {
    from: ["not_sent", "sent"],
    to: "expired",
    actor: "venue",
    destructive: true,
    confirmWord: "EXPIRE",
  },
  accept: {
    from: ["not_sent", "sent"],
    to: "accepted",
    actor: "system",
    destructive: false,
    confirmWord: null,
  },
  decline: {
    from: ["sent"],
    to: "declined",
    actor: "system",
    destructive: false,
    confirmWord: null,
  },
};

/**
 * States from which no venue action remains.
 *
 * `expired` is deliberately NOT terminal: an expired invitation can still be
 * revoked for the record or replaced with a fresh one, which is the whole
 * point of noticing it expired.
 */
export const TERMINAL_STATES: readonly InvitationState[] = [
  "accepted",
  "declined",
  "revoked",
];

export function transitionRule(action: InvitationAction): TransitionRule {
  return TRANSITIONS[action];
}

export type TransitionVerdict =
  | { allowed: true }
  | { allowed: false; reason: string };

/**
 * Whether an action is legal from a state, with venue-facing wording for the
 * refusal. The reason is copy: it is rendered as the disabled control's title
 * and read out by a screen reader, so it says what is true rather than naming
 * a state machine.
 */
export function canTransition(
  state: InvitationState,
  action: InvitationAction,
  actor: InvitationActor = "venue",
): TransitionVerdict {
  const rule = TRANSITIONS[action];
  if (rule.actor !== actor) {
    return {
      allowed: false,
      reason:
        rule.actor === "system"
          ? "Only a couple’s own redemption can move an invitation here. It is never set by hand."
          : "This action belongs to the venue, not to an automated writer.",
    };
  }
  if (action === "create") return { allowed: true };
  if (rule.from.includes(state)) return { allowed: true };
  return { allowed: false, reason: refusalFor(state, action) };
}

function refusalFor(state: InvitationState, action: InvitationAction): string {
  switch (state) {
    case "accepted":
      return "This couple has already opened their workspace. Their access is managed in Signal HQ Access, not here.";
    case "declined":
      return "This couple said no. Send a new invitation instead of reopening this one.";
    case "revoked":
      return "This invitation was withdrawn. Create a new one if the couple still needs access.";
    case "expired":
      return action === "mark_sent" || action === "resend"
        ? "This invitation has passed its date. Replace it to send a working link."
        : "This invitation has passed its date.";
    case "not_sent":
      return action === "resend"
        ? "Nothing has gone out yet. Mark it as sent once you have passed it on."
        : "This invitation has not gone out yet.";
    case "sent":
      return action === "mark_sent"
        ? "This one is already out. Use resend if you passed it on again."
        : "This invitation is already out.";
  }
}

/** Every action this actor may take from this state, in surface order. */
export function legalActions(
  state: InvitationState,
  actor: InvitationActor = "venue",
): InvitationAction[] {
  return INVITATION_ACTIONS.filter(
    (action) =>
      action !== "create" && canTransition(state, action, actor).allowed,
  );
}

export type StateDescription = {
  /** The word shown in the row. */
  label: string;
  /** What it means to the venue, in plain English. One sentence. */
  meaning: string;
};

/**
 * What each state means to a venue.
 *
 * Deliberately free of D-020 vocabulary: no seats, no allotment, no codes
 * remaining. An invitation is a couple, not a unit of stock.
 */
const STATE_COPY: Record<InvitationState, StateDescription> = {
  not_sent: {
    label: "Ready",
    meaning: "Made and waiting. Nothing has gone to the couple yet.",
  },
  sent: {
    label: "With the couple",
    meaning: "You have passed this on. The couple has not opened it yet.",
  },
  accepted: {
    label: "Opened",
    meaning: "The couple opened their workspace. What they write stays theirs.",
  },
  declined: {
    label: "Declined",
    meaning: "The couple told you they do not want it.",
  },
  expired: {
    label: "Out of date",
    meaning: "This one passed its date before anyone opened it.",
  },
  revoked: {
    label: "Withdrawn",
    meaning: "You took this one back. The link no longer works.",
  },
};

export function describeInvitationState(
  state: InvitationState,
): StateDescription {
  return STATE_COPY[state];
}

export type ActionDescription = {
  /** Control label. */
  label: string;
  /** What actually happens, said plainly. */
  detail: string;
};

/**
 * What each action does.
 *
 * "Send" is the one that has to be honest and is the one most likely to be
 * misread: **no message leaves this system.** The venue sends the email
 * itself, from its own address, using the wording in `./copy.ts`. Marking it
 * sent records that a human did so. Every string below says that plainly
 * rather than implying a delivery this product does not perform.
 */
const ACTION_COPY: Record<InvitationAction, ActionDescription> = {
  create: {
    label: "Invite a couple",
    detail:
      "Makes one invitation and its link. Nothing goes out until you pass it on.",
  },
  mark_sent: {
    label: "Mark as sent",
    detail:
      "Records that you passed this on. Signal Studio sends no email, so this is your note that a person did.",
  },
  resend: {
    label: "Mark as sent again",
    detail:
      "Records a second hand-off of the same link. The link itself does not change.",
  },
  reveal_link: {
    label: "Copy link",
    detail:
      "Shows the couple’s link once so you can paste it into your own email. The link is not stored on this page.",
  },
  revoke: {
    label: "Withdraw",
    detail: "Stops this link working. The couple cannot open it after this.",
  },
  replace: {
    label: "Replace",
    detail:
      "Withdraws this link and makes a fresh one for the same couple. The old link stops working.",
  },
  expire: {
    label: "Close off",
    detail:
      "Marks this one as out of date and stops the link working. Use it when a booking falls through.",
  },
  accept: {
    label: "Opened",
    detail:
      "Set by the couple opening their workspace. It is never set by hand.",
  },
  decline: {
    label: "Declined",
    detail: "Set when a couple turns the offer down. It is never set by hand.",
  },
};

export function describeInvitationAction(
  action: InvitationAction,
): ActionDescription {
  return ACTION_COPY[action];
}

// ── Staleness ───────────────────────────────────────────────────────────

/**
 * An invitation is stale when it went to a couple and nothing came back.
 *
 * The threshold is declared once, here, and imported everywhere. It is not
 * duplicated into a component or a query, because a threshold that appears
 * twice is a threshold that can be changed in one place and not the other —
 * the exact failure already found in `instrumentation/daily-metrics.ts`.
 */
export const STALE_INVITATION_DAYS = 14;

export const DAY_MS = 24 * 60 * 60 * 1000;

export type StalenessVerdict =
  | { state: "stale"; daysSinceSent: number; thresholdDays: number }
  | { state: "fresh"; daysSinceSent: number; thresholdDays: number }
  /** The state cannot be stale — it never went out, or it already landed. */
  | { state: "not_applicable"; reason: string }
  /** It went out but there is no send date, so staleness cannot be computed. */
  | { state: "unknown"; reason: string };

/**
 * Compute staleness, or say that it cannot be computed.
 *
 * The `unknown` branch is the point of this function. `sponsor_activations`
 * has never been written, and `license_codes.delivered_at` is deliberately
 * un-backfilled, so most live rows have no send date at all. Returning
 * "not stale" for those would be a claim about evidence that does not exist,
 * and it would hide exactly the invitations a venue most needs to chase.
 */
export function invitationStaleness(input: {
  state: InvitationState;
  sentAt: number | null | undefined;
  nowMs: number;
  thresholdDays?: number;
}): StalenessVerdict {
  const thresholdDays = input.thresholdDays ?? STALE_INVITATION_DAYS;

  if (input.state !== "sent") {
    return {
      state: "not_applicable",
      reason:
        input.state === "not_sent"
          ? "Nothing has gone to this couple yet."
          : "This invitation is already settled.",
    };
  }

  if (input.sentAt == null || !Number.isFinite(input.sentAt)) {
    return {
      state: "unknown",
      reason:
        "No send date was recorded for this invitation, so how long it has been out cannot be worked out.",
    };
  }

  const elapsed = input.nowMs - input.sentAt;
  // A send date in the future is corrupt data, not a fresh invitation.
  if (elapsed < 0) {
    return {
      state: "unknown",
      reason:
        "The recorded send date is later than today, so how long it has been out cannot be worked out.",
    };
  }

  const daysSinceSent = Math.floor(elapsed / DAY_MS);
  return daysSinceSent >= thresholdDays
    ? { state: "stale", daysSinceSent, thresholdDays }
    : { state: "fresh", daysSinceSent, thresholdDays };
}

// ── Resolution: the join between the record and the ledger ──────────────

/** The `license_codes` side. Every field is optional and may be null. */
export type InvitationLedgerFacts = {
  codeStatus?: string | null;
  redeemedAt?: number | null;
  deliveredAt?: number | null;
  expiresAt?: number | null;
};

/** The `sponsor_activations` side. Absent entirely for an unmodelled code. */
export type RecordedInvitation = {
  state?: InvitationState | null;
  sentAt?: number | null;
  acceptedAt?: number | null;
  declinedAt?: number | null;
  revokedAt?: number | null;
};

export type ResolvedInvitation = {
  state: InvitationState;
  /**
   * Which side answered. `ledger` means `license_codes` decided, `record`
   * means `sponsor_activations` did, `clock` means the expiry date did, and
   * `default` means neither side had anything and the row falls back to
   * not_sent. Carried so a reader can tell a fact from a fallback.
   */
  source: "ledger" | "record" | "clock" | "default";
  /** Null when no send date exists on either side. Never 0. */
  sentAt: number | null;
  acceptedAt: number | null;
  staleness: StalenessVerdict;
  /**
   * Set when the two sides disagree in a way a person should look at. Null
   * when they agree or when only one side had anything to say.
   */
  discrepancy: string | null;
};

/**
 * Resolve one invitation from both sides.
 *
 * The ladder, highest first, mirroring the one already shipped for code rows:
 *
 *  1. the code was redeemed          → accepted   (only the ledger knows this)
 *  2. the code was revoked           → revoked
 *  3. the record says declined       → declined   (only the record knows this)
 *  4. the record says revoked        → revoked
 *  5. the expiry date has passed     → expired
 *  6. either side shows a hand-off   → sent
 *  7. nothing                        → not_sent
 *
 * A record claiming `accepted` with no redemption in the ledger is reported as
 * a discrepancy rather than believed. It is the one disagreement that would
 * put a couple in an adoption count who never arrived.
 */
export function resolveInvitationState(input: {
  recorded?: RecordedInvitation | null;
  ledger?: InvitationLedgerFacts | null;
  nowMs: number;
  thresholdDays?: number;
}): ResolvedInvitation {
  const recorded = input.recorded ?? {};
  const ledger = input.ledger ?? {};
  const sentAt = firstTimestamp(recorded.sentAt, ledger.deliveredAt);

  const settle = (
    state: InvitationState,
    source: ResolvedInvitation["source"],
    acceptedAt: number | null,
    discrepancy: string | null,
  ): ResolvedInvitation => ({
    state,
    source,
    sentAt,
    acceptedAt,
    staleness: invitationStaleness({
      state,
      sentAt,
      nowMs: input.nowMs,
      thresholdDays: input.thresholdDays,
    }),
    discrepancy,
  });

  if (ledger.codeStatus === "redeemed") {
    return settle(
      "accepted",
      "ledger",
      firstTimestamp(ledger.redeemedAt, recorded.acceptedAt),
      recorded.state === "revoked" || recorded.state === "declined"
        ? "The couple opened their workspace, but this invitation is recorded as closed. The opening is the fact; the record needs correcting."
        : null,
    );
  }

  if (ledger.codeStatus === "revoked") {
    return settle("revoked", "ledger", null, null);
  }

  if (recorded.state === "declined") return settle("declined", "record", null, null);
  if (recorded.state === "revoked") return settle("revoked", "record", null, null);

  const acceptedWithoutRedemption =
    recorded.state === "accepted"
      ? "This invitation is recorded as opened, but no redemption exists against the code. It is not counted as opened until the ledger agrees."
      : null;

  if (ledger.expiresAt != null && ledger.expiresAt <= input.nowMs) {
    return settle("expired", "clock", null, acceptedWithoutRedemption);
  }

  if (sentAt != null || recorded.state === "sent") {
    return settle(
      "sent",
      recorded.sentAt != null ? "record" : "ledger",
      null,
      acceptedWithoutRedemption,
    );
  }

  return settle("not_sent", "default", null, acceptedWithoutRedemption);
}

function firstTimestamp(
  ...candidates: Array<number | null | undefined>
): number | null {
  for (const candidate of candidates) {
    if (candidate != null && Number.isFinite(candidate)) return candidate;
  }
  return null;
}

// ── Roll-up for the surface ─────────────────────────────────────────────

export type StaleSummary = {
  /** Invitations out longer than the threshold with nothing back. */
  stale: number;
  /**
   * Invitations out where no send date exists, so staleness is unknown. Never
   * folded into `stale` and never folded into zero: they are a different
   * question and they are reported as their own number.
   */
  unknown: number;
  thresholdDays: number;
};

export function summariseStaleness(
  verdicts: readonly StalenessVerdict[],
  thresholdDays: number = STALE_INVITATION_DAYS,
): StaleSummary {
  let stale = 0;
  let unknown = 0;
  for (const verdict of verdicts) {
    if (verdict.state === "stale") stale += 1;
    if (verdict.state === "unknown") unknown += 1;
  }
  return { stale, unknown, thresholdDays };
}

/**
 * One venue-facing sentence for the stale alert, or null when there is
 * nothing to say.
 *
 * Returns null rather than "0 stale invitations" — an absence is not a
 * finding, and a surface that reports zeroes teaches people to ignore it.
 */
export function staleAlertLine(summary: StaleSummary): string | null {
  const parts: string[] = [];
  if (summary.stale > 0) {
    parts.push(
      summary.stale === 1
        ? `1 invitation has been with a couple for over ${summary.thresholdDays} days with nothing back.`
        : `${summary.stale} invitations have been with couples for over ${summary.thresholdDays} days with nothing back.`,
    );
  }
  if (summary.unknown > 0) {
    parts.push(
      summary.unknown === 1
        ? "1 more has no send date recorded, so it cannot be checked."
        : `${summary.unknown} more have no send date recorded, so they cannot be checked.`,
    );
  }
  return parts.length > 0 ? parts.join(" ") : null;
}
