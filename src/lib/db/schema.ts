import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const ENTITLEMENT_SOURCES = [
  "workspace_subscription",
  "event_pass",
  "student_edu",
  "venue_edition",
  "compliments",
  "review_access",
] as const;
export type EntitlementSource = (typeof ENTITLEMENT_SOURCES)[number];

export const ENTITLEMENT_TIERS = [
  "free",
  "event",
  "wedding",
  "workspace",
  "studio",
] as const;
export type EntitlementTier = (typeof ENTITLEMENT_TIERS)[number];

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
    metadata: text("metadata"),
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
  ],
);

export type Entitlement = typeof entitlements.$inferSelect;
export type NewEntitlement = typeof entitlements.$inferInsert;

/**
 * Venue patronage plan. Ratified 2026-05-16 (venue-editions-paid-tier):
 * the venue pays Signal Studio, it is no longer "with our compliments".
 *
 *  none    , legacy / not a venue / unclassified.
 *  pilot   , in-flight free pilot, not yet converted (e.g. Lamb's Hill
 *             pre-conversion). Counts as distribution, never as revenue.
 *  founding, paid, founding-cohort price-locked at €1,500/yr for life.
 *  paid    , paid at the standard €1,500–€4,000/yr band.
 *
 * Only `founding` and `paid` rows WITH a non-null `paidAt` are revenue.
 * "Cash in the door" is the honest metric, a signed-but-unpaid venue is
 * not money, and HQ Traction must never render it as money.
 */
export const VENUE_PLANS = ["none", "pilot", "founding", "paid"] as const;
export type VenuePlan = (typeof VENUE_PLANS)[number];

export const sponsors = sqliteTable(
  "sponsors",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    contactEmail: text("contact_email").notNull(),
    brandMeta: text("brand_meta"),
    /* ── Paid Venue Edition ledger (2026-05-16). Additive + nullable so
       legacy sponsor rows stay valid. The venue PAYS, these fields are
       the only source HQ Traction may treat as revenue. */
    venuePlan: text("venue_plan").notNull().default("none"),
    /** Annual patronage, in cents. The real number, not the band. */
    annualAmountCents: integer("annual_amount_cents"),
    /** Founding cohort: €1,500/yr locked for life. Permanence, not a discount. */
    foundingLocked: integer("founding_locked"),
    /** Prepaid annual term window. */
    termStartsAt: integer("term_starts_at"),
    termEndsAt: integer("term_ends_at"),
    /** When the prepay cash actually landed. Null = signed, not yet money. */
    paidAt: integer("paid_at"),
    /** Agreed couple-code cap. Null = unlimited (the default register). */
    codeAllotment: integer("code_allotment"),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [index("sponsors_venue_plan_idx").on(table.venuePlan)],
);

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

// ── Outreach CRM ──────────────────────────────────────────────────────────────

export const PROSPECT_STAGES = [
  "to_contact",
  "contacted",
  "replied",
  "demo_booked",
  "pilot_active",
  "not_interested",
  "later",
] as const;
export type ProspectStage = (typeof PROSPECT_STAGES)[number];

export const prospectsTable = sqliteTable(
  "prospects",
  {
    id: text("id").primaryKey(),
    organisation: text("organisation").notNull(),
    segment: text("segment").notNull().default("venue"),
    contactName: text("contact_name").notNull().default(""),
    role: text("role").notNull().default(""),
    email: text("email").notNull().default(""),
    website: text("website").notNull().default(""),
    location: text("location").notNull().default(""),
    source: text("source").notNull().default(""),
    /** snake_case stage, see PROSPECT_STAGES */
    stage: text("stage").$type<ProspectStage>().notNull().default("to_contact"),
    /** ISO date string "YYYY-MM-DD", null if never contacted */
    lastContactedAt: text("last_contacted_at"),
    /** ISO date string "YYYY-MM-DD", null if not set */
    nextFollowUpAt: text("next_follow_up_at"),
    personalisationNote: text("personalisation_note").notNull().default(""),
    offerSent: text("offer_sent").notNull().default(""),
    outcome: text("outcome").notNull().default(""),
    notes: text("notes").notNull().default(""),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("prospects_stage_idx").on(table.stage),
    index("prospects_next_follow_up_idx").on(table.nextFollowUpAt),
  ],
);

export type DbProspect = typeof prospectsTable.$inferSelect;
export type NewDbProspect = typeof prospectsTable.$inferInsert;

// ── Cron runs ─────────────────────────────────────────────────────────────────

export const CRON_RUN_SOURCES = ["analytics_daily", "tasks_digest"] as const;
export type CronRunSource = (typeof CRON_RUN_SOURCES)[number];

export const cronRuns = sqliteTable(
  "cron_runs",
  {
    id: text("id").primaryKey(),
    source: text("source").notNull(),
    ranAt: integer("ran_at").notNull(),
    ok: integer("ok").notNull(),
    considered: integer("considered"),
    sent: integer("sent"),
    skipped: integer("skipped"),
    failed: integer("failed"),
    isMondayUtc: integer("is_monday_utc"),
    notes: text("notes"),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("cron_runs_source_ran_at_idx").on(table.source, table.ranAt),
  ],
);

export type CronRun = typeof cronRuns.$inferSelect;
export type NewCronRun = typeof cronRuns.$inferInsert;
