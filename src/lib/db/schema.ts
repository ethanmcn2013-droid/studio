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

export const sponsors = sqliteTable(
  "sponsors",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    contactEmail: text("contact_email").notNull(),
    brandMeta: text("brand_meta"),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at")
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
);

export type Sponsor = typeof sponsors.$inferSelect;
export type NewSponsor = typeof sponsors.$inferInsert;

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

export const CRON_RUN_SOURCES = ["analytics_daily"] as const;
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
