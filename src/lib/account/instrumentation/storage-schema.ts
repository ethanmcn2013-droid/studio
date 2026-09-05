import { sqliteTable, text, integer, primaryKey, index } from "drizzle-orm/sqlite-core";
import { sponsors } from "@/lib/entitlements-db/schema";
/** Minimal deletion lookup surviving raw-event expiry; never projected to HQ. */
export const usageSubjectWorkspaces = sqliteTable("usage_subject_workspaces", {
  epoch: text("epoch").notNull(), subjectIdHash: text("subject_id_hash").notNull(),
  workspaceIdHash: text("workspace_id_hash").notNull(), sponsorId: text("sponsor_id").notNull().references(()=>sponsors.id),
  updatedAt: integer("updated_at").notNull(),
}, t => [primaryKey({ columns: [t.epoch,t.subjectIdHash,t.workspaceIdHash,t.sponsorId] }),
  index("usage_subject_retention_idx").on(t.updatedAt)]);
/** Blocks a signed event already in flight when erasure commits. */
export const usageErasureTombstones = sqliteTable("usage_erasure_tombstones", {
  epoch: text("epoch").notNull(), subjectIdHash: text("subject_id_hash").notNull(),
  erasedAt: integer("erased_at").notNull(),
}, t => [primaryKey({ columns: [t.epoch,t.subjectIdHash] })]);
