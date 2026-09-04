import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import {
  SPONSOR_CONSENT_POLICY_VERSION,
  type SponsorConsentField,
} from "./sponsorship-policy";

/**
 * Canonical schema for the cross-product Signal entitlements DB.
 *
 * Lives on its own Turso DB (signal-entitlements), readable by all
 * five product repos, writable by Tasks (via the Stripe webhook) and
 * Studio (via comp-code redemption + manual admin grants).
 *
 * Tier + source vocabularies are LOCKED to the marketing pricing
 * surface (signalstudio.ie/pricing). Renaming any value here is a
 * brand decision, not a technical one.
 *
 * Mirrors the original Studio schema at src/lib/db/schema.ts but:
 *   - adds stripe_customer_id + stripe_subscription_id (deferred in
 *     the Tasks-side implementation; finally landing here)
 *   - adds a processed_webhooks table for cross-product idempotency
 *
 * Studio's own DB (ethanmcnamara-studio) keeps cron_runs + the HQ
 * dashboard's local-first data, only the entitlements stack moves
 * here.
 */

/** Tier vocabulary, matches the public pricing page. */
export const ENTITLEMENT_TIERS = [
  "free",
  "event",
  "wedding",
  "workspace",
  "studio",
] as const;
export type EntitlementTier = (typeof ENTITLEMENT_TIERS)[number];

/** Source vocabulary, where a row came from. */
export const ENTITLEMENT_SOURCES = [
  "workspace_subscription",
  "event_pass",
  "student_edu",
  "venue_edition",
  "compliments",
  "review_access",
  "batch_grant",
] as const;
export type EntitlementSource = (typeof ENTITLEMENT_SOURCES)[number];

/**
 * Billing lifecycle sub-state — the WHY behind `status`. `status`
 * (active|expired|revoked) stays the access gate the resolver reads;
 * `billing_state` explains it (a past_due row is still status=active
 * during the grace window). 'none' = a grant overlay (comp/batch/venue),
 * which has no billing clock.
 */
export const BILLING_STATES = [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "refunded",
  "disputed",
  "none",
] as const;
export type BillingState = (typeof BILLING_STATES)[number];

export const ENTITLEMENT_STATUSES = ["active", "expired", "revoked"] as const;
export type EntitlementStatus = (typeof ENTITLEMENT_STATUSES)[number];

export const entitlements = sqliteTable(
  "entitlements",
  {
    id: text("id").primaryKey(),
    userClerkId: text("user_clerk_id").notNull(),
    tier: text("tier").notNull(),
    source: text("source").notNull(),
    sourceRef: text("source_ref"),
    grantedAt: integer("granted_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    expiresAt: integer("expires_at"),
    status: text("status").notNull().default("active"),
    stripeCustomerId: text("stripe_customer_id"),
    stripeSubscriptionId: text("stripe_subscription_id"),
    metadata: text("metadata"),
    // --- access-system additions (2026-07-09) — all nullable/additive ---
    /** Cohort this grant belongs to (grant_batches.id), if any. */
    batchId: text("batch_id"),
    /** Who/what wrote this row: operator id, 'stripe-webhook', 'redeem-flow', 'reconcile-cron'. */
    grantedBy: text("granted_by"),
    grantReason: text("grant_reason"),
    /** Billing sub-state (see BILLING_STATES). null on legacy rows = unknown. */
    billingState: text("billing_state"),
    /** Dunning window end; on past_due we hold expires_at forward to this. */
    graceUntil: integer("grace_until"),
    currentPeriodEnd: integer("current_period_end"),
    cancelAtPeriodEnd: integer("cancel_at_period_end"),
    stripePriceId: text("stripe_price_id"),
    /** Salted hash of the verified email — operator search + GDPR crypto-shred. NOT plaintext. */
    emailHash: text("email_hash"),
    /** 1 when this row's Clerk id was stranded by an account merge, pending re-point. */
    clerkIdDead: integer("clerk_id_dead"),
    /**
     * R-015 · D-022. The couple's wedding day, as the UTC-midnight instant that
     * starts it. Present only on sponsored wedding rows, and only once the
     * couple has supplied a date.
     *
     * It exists so `expires_at` can carry the ratified term —
     * `max(redemption + 548 days, wedding date + 90 days)` — instead of a flat
     * 548 days that would strand a long-lead booking before its own wedding.
     *
     * This is a PROJECTION, not the source of truth. The couple owns the date
     * in the Tasks workspace (`workspaces.primary_date`); this column is
     * written at redemption and on recompute so the shared entitlement can be
     * evaluated without reaching into product content. It is deliberately
     * absent from `SPONSOR_DEFAULT_FIELDS`, so no venue reads it without the
     * existing consent projection.
     */
    weddingDate: integer("wedding_date"),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("entitlements_user_clerk_id_idx").on(table.userClerkId),
    index("entitlements_status_expires_at_idx").on(
      table.status,
      table.expiresAt,
    ),
    index("entitlements_stripe_customer_idx").on(table.stripeCustomerId),
    index("entitlements_stripe_subscription_idx").on(
      table.stripeSubscriptionId,
    ),
    index("entitlements_batch_id_idx").on(table.batchId),
    index("entitlements_email_hash_idx").on(table.emailHash),
    index("entitlements_wedding_date_idx").on(table.weddingDate),
    // The two partial UNIQUE dedup indexes (WHERE source_ref / stripe_subscription_id
    // IS NOT NULL) are created in the idempotent migration script, since drizzle's
    // partial-unique-index support is version-fragile and the real enforcement is
    // at the DB layer. See scripts/migrate-access.mjs.
  ],
);

export type Entitlement = typeof entitlements.$inferSelect;
export type NewEntitlement = typeof entitlements.$inferInsert;

/**
 * Venue patronage plan, mirrors src/lib/db/schema.ts (the studio-local
 * ledger HQ Traction reads). Kept shape-identical so the entitlements
 * stack can dual-write sponsor records like it dual-writes entitlements.
 * Ratified 2026-05-16 (venue-editions-paid-tier): the venue pays.
 */
export const VENUE_PLANS = ["none", "pilot", "founding", "paid"] as const;
export type VenuePlan = (typeof VENUE_PLANS)[number];

export const sponsors = sqliteTable("sponsors", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  contactEmail: text("contact_email").notNull(),
  brandMeta: text("brand_meta"),
  /* Paid Venue Edition ledger (2026-05-16). Additive + nullable. */
  venuePlan: text("venue_plan").notNull().default("none"),
  annualAmountCents: integer("annual_amount_cents"),
  foundingLocked: integer("founding_locked"),
  termStartsAt: integer("term_starts_at"),
  termEndsAt: integer("term_ends_at"),
  paidAt: integer("paid_at"),
  /**
   * E02.13 · D-009 point 6. The Founding Venue place, 1 to 25, rendered
   * everywhere as `NN/25`.
   *
   * Assigned when the first payment CLEARS — never on signature, never on
   * invoice. A UNIQUE index (partial, created in the migration script) makes
   * two venues holding the same number impossible rather than unlikely.
   *
   * Never reused. A venue that lapses keeps its number historically and its
   * place shows as closed rather than open, so this column stays populated on
   * a lapsed row. The one exception is a payment reversal, which withdraws the
   * number and returns the place to the pool.
   */
  foundingNumber: integer("founding_number"),
  foundingNumberAssignedAt: integer("founding_number_assigned_at"),
  /** The hard cap, meaningful ONLY when allotment_mode = 'limited'. Null there
   *  still means "not mint-eligible" — the pre-R-016 contract, unchanged. */
  codeAllotment: integer("code_allotment"),
  /**
   * R-016 · D-020. 'limited' | 'unlimited'. Every existing row backfills to
   * 'limited', so behaviour before and after the migration is identical until
   * a venue is deliberately switched.
   *
   * 'unlimited' is the ratified Venue Edition entitlement: every couple who
   * books, for as long as the licence is current. The mint stops consulting
   * code_allotment entirely for these sponsors.
   */
  allotmentMode: text("allotment_mode").notNull().default("limited"),
  /**
   * D-020 point 4: collected AFTER signature as an onboarding field, never as
   * a contract term. It sets the issuance ceiling. It never sets the price and
   * it never changes at renewal.
   */
  annualWeddingCount: integer("annual_wedding_count"),
  /**
   * The fair-use monitoring threshold derived from annual_wedding_count.
   * D-020 point 1: crossing it ALERTS Signal HQ and keeps issuing. Nothing in
   * the mint path may ever refuse on this number, and it never appears in a
   * document that also says unlimited.
   */
  fairUseCeiling: integer("fair_use_ceiling"),
  /* Maintained counter: the single runtime headroom source for the mint
     cap. Reconciled nightly against COUNT(license_codes) + SUM(allotment_ledger). */
  codesIssued: integer("codes_issued").notNull().default(0),
  /* Distinguishes a venue/patron from any future sponsor kind. */
  kind: text("kind").notNull().default("venue"),
  /** IANA zone for this venue reporting calendar. Null means Europe/Dublin. */
  reportingTimezone: text("reporting_timezone"),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export type Sponsor = typeof sponsors.$inferSelect;
export type NewSponsor = typeof sponsors.$inferInsert;

/**
 * Sponsorship is orthogonal to workspace membership. These records live only
 * in the canonical shared entitlements store: the Studio-local sponsor ledger
 * remains a transitional commercial ledger and does not get activation or
 * consent tables. A canonical workspace id below is association metadata only.
 */
export const SPONSOR_ACTIVATION_STATES = [
  "pending",
  "active",
  "ended",
  "revoked",
] as const;
export type SponsorActivationState =
  (typeof SPONSOR_ACTIVATION_STATES)[number];

export const SPONSOR_INVITATION_STATES = [
  "not_sent",
  "sent",
  "accepted",
  "declined",
  "expired",
  "revoked",
] as const;
export type SponsorInvitationState =
  (typeof SPONSOR_INVITATION_STATES)[number];

export const sponsorActivations = sqliteTable(
  "sponsor_activations",
  {
    id: text("id").primaryKey(),
    sponsorId: text("sponsor_id")
      .notNull()
      .references(() => sponsors.id),
    /** Optional entitlement projection behind this activation. */
    entitlementId: text("entitlement_id").references(() => entitlements.id),
    entitlementSource: text("entitlement_source")
      .$type<EntitlementSource>()
      .notNull(),
    /** SHA-256 of a source reference. Never store a raw license code here. */
    entitlementSourceRefHash: text("entitlement_source_ref_hash"),
    /** Opaque suite subject id for the owner. Never an email address. */
    ownerSubjectId: text("owner_subject_id").notNull(),
    /** Association only. It never creates or proves a Tasks membership. */
    canonicalWorkspaceId: text("canonical_workspace_id"),
    sponsorSeasonReference: text("sponsor_season_reference"),
    sponsorLocalReference: text("sponsor_local_reference"),
    state: text("state")
      .$type<SponsorActivationState>()
      .notNull()
      .default("pending"),
    invitationState: text("invitation_state")
      .$type<SponsorInvitationState>()
      .notNull()
      .default("not_sent"),
    invitationSentAt: integer("invitation_sent_at"),
    invitationAcceptedAt: integer("invitation_accepted_at"),
    invitationDeclinedAt: integer("invitation_declined_at"),
    activatedAt: integer("activated_at"),
    endedAt: integer("ended_at"),
    revokedAt: integer("revoked_at"),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("sponsor_activations_sponsor_state_idx").on(
      table.sponsorId,
      table.state,
    ),
    index("sponsor_activations_owner_state_idx").on(
      table.ownerSubjectId,
      table.state,
    ),
    index("sponsor_activations_workspace_idx").on(
      table.canonicalWorkspaceId,
    ),
    index("sponsor_activations_entitlement_idx").on(table.entitlementId),
    index("sponsor_activations_sponsor_reference_idx").on(
      table.sponsorId,
      table.sponsorSeasonReference,
      table.sponsorLocalReference,
    ),
  ],
);

export type SponsorActivation = typeof sponsorActivations.$inferSelect;
export type NewSponsorActivation = typeof sponsorActivations.$inferInsert;

/**
 * One active row grants one named metadata field. The allowlist comes from the
 * pure sponsorship policy. Notes, Tasks, private Timeline data, comments,
 * attachments, collaborators, and membership never have representable fields.
 */
export const sponsorConsentGrants = sqliteTable(
  "sponsor_consent_grants",
  {
    id: text("id").primaryKey(),
    activationId: text("activation_id")
      .notNull()
      .references(() => sponsorActivations.id),
    fieldKey: text("field_key").$type<SponsorConsentField>().notNull(),
    policyVersion: text("policy_version")
      .notNull()
      .default(SPONSOR_CONSENT_POLICY_VERSION),
    receiptVersion: text("receipt_version").notNull(),
    /** SHA-256 of the immutable consent receipt. No private payload. */
    receiptHash: text("receipt_hash").notNull(),
    receiptAt: integer("receipt_at").notNull(),
    grantedByOwnerSubjectId: text("granted_by_owner_subject_id").notNull(),
    grantedAt: integer("granted_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    revokedByOwnerSubjectId: text("revoked_by_owner_subject_id"),
    revokedAt: integer("revoked_at"),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("sponsor_consent_grants_activation_idx").on(table.activationId),
    index("sponsor_consent_grants_owner_idx").on(
      table.grantedByOwnerSubjectId,
    ),
    index("sponsor_consent_grants_revoked_idx").on(table.revokedAt),
    // One-active-grant-per-field is enforced by a partial UNIQUE index in
    // scripts/migrate-access.mjs, where SQLite's predicate is explicit.
  ],
);

export type SponsorConsentGrant = typeof sponsorConsentGrants.$inferSelect;
export type NewSponsorConsentGrant = typeof sponsorConsentGrants.$inferInsert;

/** A venue is revenue only when paid (founding or paid) AND cash landed. */
export function isPaidVenue(s: Pick<Sponsor, "venuePlan" | "paidAt">): boolean {
  return (
    (s.venuePlan === "founding" || s.venuePlan === "paid") && s.paidAt != null
  );
}

export const LICENSE_CODE_STATUSES = ["minted", "redeemed", "revoked"] as const;
export type LicenseCodeStatus = (typeof LICENSE_CODE_STATUSES)[number];

export const licenseCodes = sqliteTable(
  "license_codes",
  {
    id: text("id").primaryKey(),
    sponsorId: text("sponsor_id")
      .notNull()
      .references(() => sponsors.id),
    code: text("code").notNull().unique(),
    status: text("status").notNull().default("minted"),
    sourceType: text("source_type").notNull(),
    tier: text("tier").notNull(),
    durationDays: integer("duration_days"),
    redeemedByUserId: text("redeemed_by_user_id"),
    redeemedAt: integer("redeemed_at"),
    /** Cohort this code was minted for (grant_batches.id), if any. */
    batchId: text("batch_id"),
    /** Recipient lock for high-tier cohort codes: only this email may redeem. */
    recipientEmailHash: text("recipient_email_hash"),
    /** When the code was handed to a recipient. NULL means delivery was never
     *  recorded, which is not the same as a claim that it did not happen;
     *  Account reads NULL as available rather than inventing an issue date. */
    deliveredAt: integer("delivered_at"),
    /** When the code stops being redeemable. NULL means no expiry is tracked. */
    expiresAt: integer("expires_at"),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("license_codes_sponsor_id_idx").on(table.sponsorId),
    index("license_codes_status_idx").on(table.status),
    index("license_codes_batch_id_idx").on(table.batchId),
    index("license_codes_sponsor_delivered_idx").on(
      table.sponsorId,
      table.deliveredAt,
    ),
    index("license_codes_expires_at_idx").on(table.expiresAt),
  ],
);

export type LicenseCode = typeof licenseCodes.$inferSelect;
export type NewLicenseCode = typeof licenseCodes.$inferInsert;

export const redemptions = sqliteTable(
  "redemptions",
  {
    id: text("id").primaryKey(),
    codeId: text("code_id")
      .notNull()
      .references(() => licenseCodes.id),
    userClerkId: text("user_clerk_id").notNull(),
    entitlementId: text("entitlement_id").references(() => entitlements.id),
    ipHash: text("ip_hash"),
    userAgent: text("user_agent"),
    redeemedAt: integer("redeemed_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("redemptions_code_id_idx").on(table.codeId),
    index("redemptions_user_clerk_id_idx").on(table.userClerkId),
  ],
);

export type Redemption = typeof redemptions.$inferSelect;
export type NewRedemption = typeof redemptions.$inferInsert;

/**
 * Cross-product webhook dedup. Stripe webhooks land in Tasks today;
 * other writers (Studio admin grants, Clerk hooks if ever needed)
 * may land directly. A shared dedup table prevents duplicate writes
 * when retries fan out.
 */
export const processedWebhooks = sqliteTable(
  "processed_webhooks",
  {
    id: text("id").primaryKey(),
    source: text("source").notNull(),
    eventId: text("event_id").notNull(),
    processedAt: integer("processed_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("processed_webhooks_source_event_idx").on(
      table.source,
      table.eventId,
    ),
  ],
);

export type ProcessedWebhook = typeof processedWebhooks.$inferSelect;
export type NewProcessedWebhook = typeof processedWebhooks.$inferInsert;

/* ── Access system (2026-07-09) ─────────────────────────────────────
 * grant_batches, entitlement_events (append-only audit ledger),
 * allotment_ledger. See docs/LICENSING_ACCESS_DESIGN.md.
 * ------------------------------------------------------------------ */

/** A named cohort (press, friends, team) granted in bulk. A sibling of
 *  `sponsors`, NEVER collapsed into it — kept distinct on purpose. */
export const GRANT_BATCH_KINDS = [
  "press",
  "partner",
  "friends",
  "team",
  "cohort",
  "pilot",
] as const;
export type GrantBatchKind = (typeof GRANT_BATCH_KINDS)[number];

export const grantBatches = sqliteTable("grant_batches", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  label: text("label").notNull(),
  kind: text("kind").notNull().default("cohort"),
  tier: text("tier").notNull().default("workspace"),
  /** null = unlimited. */
  allotment: integer("allotment"),
  reason: text("reason").notNull(),
  grantedBy: text("granted_by"),
  defaultExpiresAt: integer("default_expires_at"),
  perpetual: integer("perpetual").notNull().default(0),
  closedAt: integer("closed_at"),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export type GrantBatch = typeof grantBatches.$inferSelect;
export type NewGrantBatch = typeof grantBatches.$inferInsert;

/**
 * Append-only audit ledger. Physically enforced insert-only by SQLite
 * triggers (RAISE(ABORT) on UPDATE/DELETE, created in the migration
 * script), plus a per-row hash-chain (prev_hash/row_hash) computed over
 * NON-PII fields only — so GDPR crypto-shredding of email/ip hashes never
 * breaks tamper-evidence. NEVER write PII into before_json/after_json.
 */
export const ENTITLEMENT_EVENT_ACTIONS = [
  "venue_payment",
  "grant",
  "revoke",
  "expire",
  "extend",
  "reinstate",
  "redeem",
  "mint",
  "refund",
  "dispute",
  "repoint",
  "export",
  "view_as",
  "shred",
] as const;
export type EntitlementEventAction =
  (typeof ENTITLEMENT_EVENT_ACTIONS)[number];

export const entitlementEvents = sqliteTable(
  "entitlement_events",
  {
    id: text("id").primaryKey(),
    entitlementId: text("entitlement_id"),
    userClerkId: text("user_clerk_id"),
    sponsorId: text("sponsor_id"),
    batchId: text("batch_id"),
    actorId: text("actor_id"),
    actorName: text("actor_name"),
    action: text("action").notNull(),
    reason: text("reason"),
    beforeJson: text("before_json"),
    afterJson: text("after_json"),
    origin: text("origin"),
    prevHash: text("prev_hash"),
    rowHash: text("row_hash"),
    stripeEventId: text("stripe_event_id"),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("entitlement_events_user_idx").on(
      table.userClerkId,
      table.createdAt,
    ),
    index("entitlement_events_entitlement_idx").on(table.entitlementId),
    index("entitlement_events_batch_idx").on(table.batchId),
    index("entitlement_events_sponsor_idx").on(table.sponsorId),
    index("entitlement_events_action_idx").on(table.action),
    // Backs the per-operator velocity cap (guard.ts assertVelocity).
    index("entitlement_events_actor_idx").on(table.actorId, table.createdAt),
  ],
);

export type EntitlementEvent = typeof entitlementEvents.$inferSelect;
export type NewEntitlementEvent = typeof entitlementEvents.$inferInsert;

/** Provenance for "why does this venue have N codes". codes_issued on
 *  sponsors is the runtime cap; this is the audit trail behind it. */
export const allotmentLedger = sqliteTable(
  "allotment_ledger",
  {
    id: text("id").primaryKey(),
    sponsorId: text("sponsor_id")
      .notNull()
      .references(() => sponsors.id),
    delta: integer("delta").notNull(),
    reason: text("reason").notNull(),
    actorId: text("actor_id"),
    termStartsAt: integer("term_starts_at"),
    termEndsAt: integer("term_ends_at"),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [index("allotment_ledger_sponsor_idx").on(table.sponsorId)],
);

export type AllotmentLedgerEntry = typeof allotmentLedger.$inferSelect;
export type NewAllotmentLedgerEntry = typeof allotmentLedger.$inferInsert;

/**
 * Account / portal may create a request. It may not fulfill it.
 * Approving more codes remains an HQ Access ledger write.
 */
export const SPONSOR_REQUEST_KINDS = [
  "more_codes",
  "report",
  "support",
  "profile_change",
] as const;
export type SponsorRequestKind = (typeof SPONSOR_REQUEST_KINDS)[number];

export const SPONSOR_REQUEST_STATES = [
  "open",
  "approved",
  "declined",
  "fulfilled",
  "canceled",
] as const;
export type SponsorRequestState = (typeof SPONSOR_REQUEST_STATES)[number];

export const sponsorRequests = sqliteTable(
  "sponsor_requests",
  {
    id: text("id").primaryKey(),
    sponsorId: text("sponsor_id")
      .notNull()
      .references(() => sponsors.id),
    /** Opaque member/subject id when portal membership exists; HQ preview uses operator id. */
    requestingMemberId: text("requesting_member_id").notNull(),
    kind: text("kind").$type<SponsorRequestKind>().notNull(),
    requestedQuantity: integer("requested_quantity"),
    note: text("note").notNull().default(""),
    state: text("state")
      .$type<SponsorRequestState>()
      .notNull()
      .default("open"),
    operatorActorId: text("operator_actor_id"),
    decisionReason: text("decision_reason"),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    decidedAt: integer("decided_at"),
    fulfilledAt: integer("fulfilled_at"),
  },
  (table) => [
    index("sponsor_requests_sponsor_state_idx").on(table.sponsorId, table.state),
    index("sponsor_requests_created_idx").on(table.createdAt),
  ],
);

export type SponsorRequest = typeof sponsorRequests.$inferSelect;
export type NewSponsorRequest = typeof sponsorRequests.$inferInsert;

/* ── Sponsored-use instrumentation (Phase B) ─────────────────────────
 * Three projections and one short-lived event stream. Nothing here can
 * name a person: subject and workspace arrive already salted and hashed,
 * and the projections that survive carry counts only.
 * -------------------------------------------------------------------- */

export const METRIC_DICTIONARY_VERSION = "venue-metrics.v1" as const;

export const SPONSOR_USAGE_ATTRIBUTION_STATES = [
  "attributed",
  "unattributed",
  "excluded",
] as const;
export type SponsorUsageAttributionState =
  (typeof SPONSOR_USAGE_ATTRIBUTION_STATES)[number];

/**
 * Raw sponsored-use events. Short-lived by design: a 35-day sweep deletes them
 * and the daily projection survives instead. Keeping the stream would mean
 * holding a per-person activity log to answer a question about totals.
 */
export const sponsorUsageEvents = sqliteTable(
  "sponsor_usage_events",
  {
    /** The venue-meaningful-action.v1 idempotency key, and the sole primary
     *  key: a replay must land on this row rather than beside it. */
    eventId: text("event_id").primaryKey(),
    instrumentationVersion: text("instrumentation_version")
      .notNull()
      .default("instrumentation.v1"),
    product: text("product").notNull(),
    kind: text("kind").notNull(),
    occurredAt: integer("occurred_at").notNull(),
    subjectIdHash: text("subject_id_hash").notNull(),
    workspaceIdHash: text("workspace_id_hash").notNull(),
    /** Null unless attribution succeeded. */
    sponsorId: text("sponsor_id").references(() => sponsors.id),
    attributionState: text("attribution_state")
      .$type<SponsorUsageAttributionState>()
      .notNull(),
    /** The rejection reason when not attributed; null when attributed. */
    attributionReason: text("attribution_reason"),
    /** Which salt produced the hashes. Rows across epochs are never compared;
     *  a rotation is a coverage break, not a fall in activity. */
    hashSaltEpoch: text("hash_salt_epoch").notNull(),
    /** Venue-local calendar day of occurredAt, as YYYY-MM-DD. */
    localDate: text("local_date").notNull(),
    ingestedAt: integer("ingested_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("sponsor_usage_events_sponsor_date_idx").on(
      table.sponsorId,
      table.localDate,
      table.workspaceIdHash,
    ),
    index("sponsor_usage_events_occurred_idx").on(table.occurredAt),
    index("sponsor_usage_events_state_date_idx").on(
      table.attributionState,
      table.localDate,
    ),
  ],
);

export type SponsorUsageEvent = typeof sponsorUsageEvents.$inferSelect;
export type NewSponsorUsageEvent = typeof sponsorUsageEvents.$inferInsert;

/**
 * One aggregate row per sponsor, per venue-local day, per dictionary version.
 *
 * The per-product counters are nullable on purpose. NULL means the product was
 * not instrumented that day; 0 means it was instrumented and nothing happened.
 * Defaulting them to 0 would turn "we did not measure" into "nothing
 * happened", which is the one claim this table exists never to make.
 */
export const sponsorUsageDaily = sqliteTable(
  "sponsor_usage_daily",
  {
    sponsorId: text("sponsor_id")
      .notNull()
      .references(() => sponsors.id),
    localDate: text("local_date").notNull(),
    metricDictionaryVersion: text("metric_dictionary_version")
      .notNull()
      .default(METRIC_DICTIONARY_VERSION),
    instrumentationVersion: text("instrumentation_version")
      .notNull()
      .default("instrumentation.v1"),
    /** The zone localDate was computed in, so a later zone change reads as a
     *  visible break rather than a silent reinterpretation of history. */
    timezone: text("timezone").notNull().default("Europe/Dublin"),
    hashSaltEpoch: text("hash_salt_epoch").notNull(),

    activeWorkspaces: integer("active_workspaces").notNull(),
    activeSubjects: integer("active_subjects").notNull(),
    firstActionWorkspaces: integer("first_action_workspaces").notNull(),
    /** The suppression denominator, taken from access rather than from event
     *  volume: a quiet venue must not be mistaken for a small one. */
    eligibleWorkspaces: integer("eligible_workspaces").notNull(),
    meaningfulActions: integer("meaningful_actions").notNull(),

    notesActions: integer("notes_actions"),
    notesWorkspaces: integer("notes_workspaces"),
    tasksActions: integer("tasks_actions"),
    tasksWorkspaces: integer("tasks_workspaces"),
    timelineActions: integer("timeline_actions"),
    timelineWorkspaces: integer("timeline_workspaces"),
    signalActions: integer("signal_actions"),
    signalWorkspaces: integer("signal_workspaces"),

    /** Products instrumented on this date (notes 1, tasks 2, timeline 4,
     *  signal 8), and what was expected at rollup time. Storing both keeps a
     *  later product from retroactively downgrading closed days. */
    coverageMask: integer("coverage_mask").notNull(),
    expectedMask: integer("expected_mask").notNull(),

    /** The instant through which this row is authoritative. */
    dataThrough: integer("data_through").notNull(),
    revision: integer("revision").notNull().default(1),
    computedAt: integer("computed_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    lastRepairedAt: integer("last_repaired_at"),
  },
  (table) => [
    primaryKey({
      columns: [table.sponsorId, table.localDate, table.metricDictionaryVersion],
    }),
    index("sponsor_usage_daily_sponsor_date_idx").on(
      table.sponsorId,
      table.localDate,
    ),
    index("sponsor_usage_daily_epoch_idx").on(table.sponsorId, table.hashSaltEpoch),
  ],
);

export type SponsorUsageDailyRow = typeof sponsorUsageDaily.$inferSelect;
export type NewSponsorUsageDailyRow = typeof sponsorUsageDaily.$inferInsert;

export const DAY30_STATES = ["returned", "not_returned", "indeterminate"] as const;
export type Day30State = (typeof DAY30_STATES)[number];

/**
 * Minimal per-workspace lifecycle. Day-30 continuation and trailing distinct
 * counts cannot be recovered from daily rows, because per-day distincts do not
 * sum and the events are swept, so the few facts those metrics need are kept
 * here and nothing else is.
 *
 * Advance-only: dates move forward, or back to the earliest, and are never
 * rebuilt from events, because after the sweep a rebuild would quietly
 * truncate history. The workspace hash is internal to the projector and must
 * never reach a snapshot, an export, or a report.
 */
export const sponsorWorkspaceLifecycle = sqliteTable(
  "sponsor_workspace_lifecycle",
  {
    sponsorId: text("sponsor_id")
      .notNull()
      .references(() => sponsors.id),
    workspaceIdHash: text("workspace_id_hash").notNull(),
    hashSaltEpoch: text("hash_salt_epoch").notNull(),

    firstActionLocalDate: text("first_action_local_date").notNull(),
    lastActionLocalDate: text("last_action_local_date").notNull(),

    notesLastActionLocalDate: text("notes_last_action_local_date"),
    tasksLastActionLocalDate: text("tasks_last_action_local_date"),
    timelineLastActionLocalDate: text("timeline_last_action_local_date"),
    signalLastActionLocalDate: text("signal_last_action_local_date"),

    /** Set once the day-35 boundary closes. Null means the cohort is still
     *  open, which keeps the row out of both numerator and denominator. */
    day30State: text("day30_state").$type<Day30State>(),
    day30SealedAt: integer("day30_sealed_at"),

    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    primaryKey({
      columns: [table.sponsorId, table.workspaceIdHash, table.hashSaltEpoch],
    }),
    index("sponsor_workspace_lifecycle_last_action_idx").on(
      table.sponsorId,
      table.hashSaltEpoch,
      table.lastActionLocalDate,
    ),
    index("sponsor_workspace_lifecycle_first_action_idx").on(
      table.sponsorId,
      table.hashSaltEpoch,
      table.firstActionLocalDate,
    ),
  ],
);

export type SponsorWorkspaceLifecycle =
  typeof sponsorWorkspaceLifecycle.$inferSelect;
export type NewSponsorWorkspaceLifecycle =
  typeof sponsorWorkspaceLifecycle.$inferInsert;

/**
 * A frozen report for a closed period. Once written it is never recomputed: a
 * venue that received a report in March must be able to open the same numbers
 * in June. The content hash makes a later edit detectable rather than merely
 * discouraged.
 */
export const sponsorReportSnapshots = sqliteTable(
  "sponsor_report_snapshots",
  {
    id: text("id").primaryKey(),
    sponsorId: text("sponsor_id")
      .notNull()
      .references(() => sponsors.id),
    periodStart: text("period_start").notNull(),
    periodEnd: text("period_end").notNull(),
    periodLabel: text("period_label").notNull(),
    metricDictionaryVersion: text("metric_dictionary_version")
      .notNull()
      .default(METRIC_DICTIONARY_VERSION),
    timezone: text("timezone").notNull().default("Europe/Dublin"),
    hashSaltEpoch: text("hash_salt_epoch").notNull(),
    /** The frozen payload, already suppressed. Never re-derived on read. */
    payloadJson: text("payload_json").notNull(),
    coverageState: text("coverage_state").notNull(),
    suppressionApplied: integer("suppression_applied").notNull().default(0),
    eligibleWorkspaces: integer("eligible_workspaces").notNull(),
    contentHash: text("content_hash").notNull(),
    dataThrough: integer("data_through").notNull(),
    frozenAt: integer("frozen_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("sponsor_report_snapshots_sponsor_period_idx").on(
      table.sponsorId,
      table.periodStart,
      table.periodEnd,
    ),
    index("sponsor_report_snapshots_frozen_idx").on(table.frozenAt),
  ],
);

export type SponsorReportSnapshot = typeof sponsorReportSnapshots.$inferSelect;
export type NewSponsorReportSnapshot = typeof sponsorReportSnapshots.$inferInsert;
