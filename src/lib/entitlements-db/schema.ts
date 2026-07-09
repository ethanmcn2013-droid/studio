import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
  codeAllotment: integer("code_allotment"),
  /* Maintained counter: the single runtime headroom source for the mint
     cap. Reconciled nightly against COUNT(license_codes) + SUM(allotment_ledger). */
  codesIssued: integer("codes_issued").notNull().default(0),
  /* Distinguishes a venue/patron from any future sponsor kind. */
  kind: text("kind").notNull().default("venue"),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export type Sponsor = typeof sponsors.$inferSelect;
export type NewSponsor = typeof sponsors.$inferInsert;

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
