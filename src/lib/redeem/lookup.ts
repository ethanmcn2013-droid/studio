import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  type EntitlementSource,
  type EntitlementTier,
  licenseCodes,
  sponsors,
} from "@/lib/db/schema";

export type RedemptionLookup =
  | {
      state: "claimable";
      code: string;
      sponsor: {
        slug: string;
        name: string;
        brandMeta: Record<string, unknown> | null;
      };
      sourceType: EntitlementSource;
      tier: EntitlementTier;
      durationDays: number | null;
    }
  | { state: "already_used"; code: string; sponsorName: string | null }
  | { state: "revoked"; code: string; sponsorName: string | null }
  | { state: "invalid"; code: string }
  | { state: "network_error"; code: string };

function parseBrandMeta(raw: string | null): Record<string, unknown> | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function lookupRedemption(
  code: string,
): Promise<RedemptionLookup> {
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return { state: "invalid", code };

  try {
    const rows = await db
      .select({
        codeStatus: licenseCodes.status,
        sourceType: licenseCodes.sourceType,
        tier: licenseCodes.tier,
        durationDays: licenseCodes.durationDays,
        sponsorSlug: sponsors.slug,
        sponsorName: sponsors.name,
        sponsorBrandMeta: sponsors.brandMeta,
      })
      .from(licenseCodes)
      .innerJoin(sponsors, eq(sponsors.id, licenseCodes.sponsorId))
      .where(eq(licenseCodes.code, trimmed))
      .limit(1);

    if (rows.length === 0) return { state: "invalid", code: trimmed };

    const row = rows[0];
    if (row.codeStatus === "redeemed") {
      return {
        state: "already_used",
        code: trimmed,
        sponsorName: row.sponsorName,
      };
    }
    if (row.codeStatus === "revoked") {
      return {
        state: "revoked",
        code: trimmed,
        sponsorName: row.sponsorName,
      };
    }

    return {
      state: "claimable",
      code: trimmed,
      sponsor: {
        slug: row.sponsorSlug,
        name: row.sponsorName,
        brandMeta: parseBrandMeta(row.sponsorBrandMeta),
      },
      sourceType: row.sourceType as EntitlementSource,
      tier: row.tier as EntitlementTier,
      durationDays: row.durationDays,
    };
  } catch (err) {
    console.error("[lookupRedemption] DB error", err);
    return { state: "network_error", code: trimmed };
  }
}
