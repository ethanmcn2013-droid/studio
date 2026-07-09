"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import {
  expireSharedEntitlement,
  writeSharedEntitlement,
} from "@/lib/entitlements-db/writes";
import {
  ENTITLEMENT_SOURCES,
  ENTITLEMENT_TIERS,
  type EntitlementSource,
  type EntitlementTier,
} from "@/lib/entitlements-db/schema";

/**
 * HQ-side server actions for granting / expiring entitlements.
 *
 * Auth: HQ cookie. The /api/internal/entitlements/grant + /expire
 * routes still exist for CLI / curl use; these actions are the
 * operator-UI path inside /hq, which reuses the same shared-DB
 * writers without needing the STUDIO_OPS_SECRET bearer.
 */

async function requireHq(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access?from=/hq/entitlements");
}

export type GrantFormResult =
  | { ok: true; id: string; created: boolean }
  | { error: string };

export async function grantAction(
  _prev: GrantFormResult | null,
  formData: FormData,
): Promise<GrantFormResult> {
  await requireHq();

  const userClerkId = (formData.get("userClerkId") as string | null)?.trim() ?? "";
  const tier = (formData.get("tier") as string | null) ?? "";
  const source = (formData.get("source") as string | null) ?? "";
  const sourceRef = ((formData.get("sourceRef") as string | null) ?? "").trim();
  const durationDaysRaw = (formData.get("durationDays") as string | null) ?? "";

  if (!userClerkId) return { error: "userClerkId is required" };
  if (!ENTITLEMENT_TIERS.includes(tier as EntitlementTier))
    return { error: `tier must be one of ${ENTITLEMENT_TIERS.join(" | ")}` };
  if (!ENTITLEMENT_SOURCES.includes(source as EntitlementSource))
    return { error: `source must be one of ${ENTITLEMENT_SOURCES.join(" | ")}` };

  const durationDays = durationDaysRaw ? Number.parseInt(durationDaysRaw, 10) : null;
  const expiresAtMs =
    durationDays != null && durationDays > 0
      ? Date.now() + durationDays * 24 * 60 * 60 * 1000
      : null;

  try {
    const result = await writeSharedEntitlement({
      userClerkId,
      tier: tier as EntitlementTier,
      source: source as EntitlementSource,
      sourceRef: sourceRef || `manual:${source}:${userClerkId}`,
      expiresAtMs,
      metadata: { origin: "studio-hq", grantedAt: new Date().toISOString() },
    });
    revalidatePath("/hq/entitlements");
    return { ok: true, ...result };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown error" };
  }
}

export async function expireAction(formData: FormData): Promise<void> {
  await requireHq();
  const sourceRef = (formData.get("sourceRef") as string | null) ?? "";
  if (!sourceRef) return;
  try {
    await expireSharedEntitlement({ sourceRef });
  } catch (err) {
    console.warn("[hq expire] failed:", err);
  }
  revalidatePath("/hq/entitlements");
}
