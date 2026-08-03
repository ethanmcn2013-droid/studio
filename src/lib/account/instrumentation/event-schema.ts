/**
 * venue-meaningful-action.v1 — the only shape a product may emit to describe
 * sponsored use.
 *
 * The contract is `docs/account/EVENT_SCHEMA_MEANINGFUL_ACTION_V1.md`. An event
 * says that someone holding sponsored access committed a real action in a
 * product. It carries no content, no identity, and no destination, so the
 * Account surface can prove the benefit without ever seeing the work.
 *
 * This file is duplicated byte-for-byte between `app/` and `studio/`. The app
 * emits against it and Studio ingests against it, so a change made in one copy
 * and not the other lets a product emit something ingest will reject, silently,
 * for as long as nobody looks. Change both copies and
 * `venue-meaningful-action.v1.json` in one commit or change none of them.
 */

export const INSTRUMENTATION_VERSION = "instrumentation.v1" as const;
export const EVENT_SCHEMA_VERSION = "venue-meaningful-action.v1" as const;

/**
 * The metric dictionary these events are computed under.
 *
 * `venue-metrics.v1` was written for the retired 15-venue code-allotment model
 * and is retired as a name by E09.01 §0. Nothing may pin it again.
 */
export const METRIC_DICTIONARY_VERSION = "account-metrics.v2" as const;

export type SponsoredProduct = "notes" | "tasks" | "timeline" | "signal";

/** Allowlisted kinds per product. A kind is only valid under its own product. */
export const MEANINGFUL_ACTION_KINDS = {
  notes: ["note_created", "note_materially_edited"],
  tasks: [
    "task_created",
    "task_completed",
    "task_reopened",
    "task_reassigned",
    "task_rescheduled",
    "task_status_changed",
  ],
  timeline: [
    "timeline_created",
    "timeline_curated",
    "timeline_published",
    "timeline_unpublished",
  ],
  signal: ["briefing_deliberately_opened", "briefing_acknowledged"],
} as const satisfies Record<SponsoredProduct, readonly string[]>;

export type MeaningfulActionKind =
  (typeof MEANINGFUL_ACTION_KINDS)[SponsoredProduct][number];

/**
 * Kinds that existed and are now reserved. Rejected by name rather than merely
 * absent from the allowlist, so the rejection reason says why.
 *
 * `timeline_visibility_changed` fired on unpublish and only on unpublish
 * (E09.01 §3.4). Its name invited every reader to treat it as evidence of
 * sharing, which counts a couple taking their Timeline down as a couple putting
 * it up. It is renamed to `timeline_unpublished` and the old name is reserved
 * for nothing, permanently.
 */
export const RETIRED_ACTION_KINDS: Readonly<Record<string, string>> = {
  timeline_visibility_changed:
    "fires on unpublish only; renamed to timeline_unpublished by E09.01 section 3.4 and reserved",
};

/**
 * The only kinds a sharing computation may read. E09.02 acceptance criterion 8
 * says `timeline_visibility_changed` appears in no sharing computation; this
 * constant is how that is checked rather than remembered.
 *
 * `timeline_unpublished` is deliberately absent. An unpublish is the couple
 * withdrawing a share, and it is never evidence of one.
 */
export const SHARING_KINDS: readonly MeaningfulActionKind[] = ["timeline_published"];

/**
 * Kinds that may never start a workspace's clock.
 *
 * E09.02 §2 accepts any qualifying Tier 1 event of any kind as a first useful
 * action. Read literally, that made `timeline_unpublished` — a couple taking
 * their Timeline down — the moment the venue's gift landed. D-032 R10 excludes
 * it, on exactly the reasoning that already keeps it out of every sharing
 * computation (E09.02 acceptance criterion 8): a withdrawal is not an arrival.
 *
 * Nothing else belongs here. A kind earns a place on this list only where the
 * action it records is a couple undoing something they had already done.
 */
export const FIRST_USEFUL_ACTION_EXCLUDED_KINDS: readonly MeaningfulActionKind[] = [
  "timeline_unpublished",
];

/**
 * True when a kind may set, or move, a workspace's first useful action.
 *
 * The rule lives beside the allowlist rather than inside the rollup so that one
 * answer serves every computation. A second copy in a projector is how the
 * declared rule and the enforced one drift apart. D-032 R10.
 */
export function qualifiesAsFirstUsefulAction(kind: string): boolean {
  return !(FIRST_USEFUL_ACTION_EXCLUDED_KINDS as readonly string[]).includes(kind);
}

/**
 * Allowlisted kinds with no call site anywhere in the product.
 *
 * `briefing_acknowledged` is structurally zero (E09.01 §3.5).
 *
 * **E09.02 §9.8 is ratified (D-032 R9, 2026-08-03): this kind comes off the
 * allowlist until it has a call site, and the removal is recorded so E09.03
 * restores it deliberately.** It has not been removed yet. Removing a kind
 * changes the emitted-event contract in both repos and the JSON contract with
 * it, which belongs to E09.03's change rather than to the ratification pass.
 *
 * The earlier version of this comment justified keeping it by calling §9 an
 * open founder call. That is no longer true, and the entry is left here rather
 * than quietly deleted so the gap is visible instead of forgotten.
 *
 * Either way the coverage envelope reports Signal as one of two kinds
 * instrumented, so the absence shows as coverage rather than as a zero, which
 * is the whole rule.
 */
export const UNWIRED_ACTION_KINDS: readonly string[] = ["briefing_acknowledged"];

/** Kinds with a live call site, per product. Drives the per-product kind mask. */
export function wiredKindsFor(product: SponsoredProduct): readonly string[] {
  return MEANINGFUL_ACTION_KINDS[product].filter(
    (kind) => !UNWIRED_ACTION_KINDS.includes(kind),
  );
}

export type VenueMeaningfulActionV1 = {
  eventId: string;
  instrumentationVersion: typeof INSTRUMENTATION_VERSION;
  product: SponsoredProduct;
  kind: MeaningfulActionKind;
  occurredAt: number;
  subjectIdHash: string;
  workspaceIdHash: string;
};

const REQUIRED_KEYS = [
  "eventId",
  "instrumentationVersion",
  "product",
  "kind",
  "occurredAt",
  "subjectIdHash",
  "workspaceIdHash",
] as const;

/**
 * Keys that must never appear. Checked at every depth and rejected rather than
 * stripped: a silent strip would let a future field leak the first time someone
 * forgets this list exists.
 *
 * The Venue Edition additions (E09.01 §6.2) are in here too. Booking status is
 * the load-bearing one: Signal Studio does not hold, process, infer or report
 * whether a couple has a signed booking with a venue, and a field that arrived
 * on an event would make that claim true by accident.
 */
export const FORBIDDEN_FIELDS = new Set([
  // 6.1 — the frozen list
  "title",
  "name",
  "body",
  "content",
  "text",
  "description",
  "note",
  "comment",
  "email",
  "emailaddress",
  "phone",
  "url",
  "href",
  "path",
  "slug",
  "filename",
  "attachment",
  "clerkid",
  "userid",
  "workspaceid",
  "subjectid",
  "code",
  "accesscode",
  "token",
  "secret",
  "ip",
  "useragent",
  // 6.2 — booking and relationship status, the D-020 boundary
  "bookingstatus",
  "bookingreference",
  "bookingconfirmed",
  "contractsigned",
  "depositpaid",
  "isbookedcouple",
  "venuecontractref",
  // 6.2 — couple and wedding identity
  "couplename",
  "partnername",
  "partner1",
  "partner2",
  "weddingdate",
  "primarydate",
  "ceremonydetail",
  "venueofceremony",
  "guestcount",
  "guestlist",
  "dietary",
  "allergy",
  "rsvp",
  // 6.2 — private planning content and structure
  "projectname",
  "projectslug",
  "tasktitle",
  "taskid",
  "noteid",
  "notetitle",
  "milestone",
  "milestonelabel",
  "label",
  "tag",
  "checklist",
  "budget",
  "amount",
  "supplier",
  "vendor",
  "briefing",
  "briefingtext",
  "summary",
  // 6.2 — relationship data
  "collaborators",
  "collaboratorcount",
  "members",
  "memberlist",
  "invitees",
  "inviteemail",
  "assignee",
  "assigneename",
  // 6.2 — internal keys that exist but must not travel onward
  "sessionhash",
  "tokenhash",
  "publicationid",
  "sharetoken",
  "publicurl",
  "hashsalt",
  "saltepoch",
]);

const HASH_PATTERN = /^[0-9a-f]{32}$/;

export type EventValidation =
  | { ok: true; event: VenueMeaningfulActionV1 }
  | { ok: false; reason: string };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Walks the whole payload so a forbidden key cannot hide inside a nested object. */
function findForbiddenKey(value: unknown, depth = 0): string | null {
  if (depth > 6) return "payload nested too deeply";
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findForbiddenKey(item, depth + 1);
      if (found) return found;
    }
    return null;
  }
  if (!isPlainObject(value)) return null;
  for (const [key, nested] of Object.entries(value)) {
    if (FORBIDDEN_FIELDS.has(key.toLowerCase())) return key;
    const found = findForbiddenKey(nested, depth + 1);
    if (found) return found;
  }
  return null;
}

export function isAllowedKind(product: string, kind: string): boolean {
  const kinds = MEANINGFUL_ACTION_KINDS[product as SponsoredProduct] as
    | readonly string[]
    | undefined;
  return Boolean(kinds?.includes(kind));
}

export function retiredKindReason(kind: string): string | null {
  return RETIRED_ACTION_KINDS[kind] ?? null;
}

/**
 * Validates a candidate event. Rejects anything that is not exactly the seven
 * contracted fields with a kind that belongs to its product.
 */
export function validateMeaningfulAction(input: unknown): EventValidation {
  if (!isPlainObject(input)) return { ok: false, reason: "event must be an object" };

  const forbidden = findForbiddenKey(input);
  if (forbidden) return { ok: false, reason: `forbidden field ${forbidden}` };

  const keys = Object.keys(input);
  const extra = keys.filter((key) => !(REQUIRED_KEYS as readonly string[]).includes(key));
  if (extra.length > 0) return { ok: false, reason: `unexpected field ${extra[0]}` };
  const missing = REQUIRED_KEYS.filter((key) => !keys.includes(key));
  if (missing.length > 0) return { ok: false, reason: `missing field ${missing[0]}` };

  const { eventId, instrumentationVersion, product, kind, occurredAt, subjectIdHash, workspaceIdHash } =
    input as Record<string, unknown>;

  if (typeof eventId !== "string" || eventId.trim() === "")
    return { ok: false, reason: "eventId must be a non-empty string" };
  if (instrumentationVersion !== INSTRUMENTATION_VERSION)
    return { ok: false, reason: "unsupported instrumentation version" };
  if (typeof product !== "string" || !(product in MEANINGFUL_ACTION_KINDS))
    return { ok: false, reason: "unknown product" };
  if (typeof kind === "string") {
    const retired = retiredKindReason(kind);
    if (retired) return { ok: false, reason: `kind ${kind} is retired: ${retired}` };
  }
  if (typeof kind !== "string" || !isAllowedKind(product, kind))
    return { ok: false, reason: `kind ${String(kind)} is not allowed for ${product}` };
  if (typeof occurredAt !== "number" || !Number.isFinite(occurredAt) || occurredAt <= 0)
    return { ok: false, reason: "occurredAt must be a positive timestamp" };
  if (typeof subjectIdHash !== "string" || !HASH_PATTERN.test(subjectIdHash))
    return { ok: false, reason: "subjectIdHash must be a 32-character hash" };
  if (typeof workspaceIdHash !== "string" || !HASH_PATTERN.test(workspaceIdHash))
    return { ok: false, reason: "workspaceIdHash must be a 32-character hash" };

  return {
    ok: true,
    event: {
      eventId,
      instrumentationVersion: INSTRUMENTATION_VERSION,
      product: product as SponsoredProduct,
      kind: kind as MeaningfulActionKind,
      occurredAt,
      subjectIdHash,
      workspaceIdHash,
    },
  };
}
