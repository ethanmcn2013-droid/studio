"use server";

import { randomInt, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { HQ_ACCESS_COOKIE, verifyHqToken } from "@/lib/hq/auth";
import { resolveHqOperatorActor } from "@/lib/hq/operator-identity";
import { entitlementsDb } from "@/lib/entitlements-db/client";
import { grantBatches } from "@/lib/entitlements-db/schema";
import {
  writeSharedEntitlement,
  revokeEntitlementById,
  revokeEntitlementsBulk,
} from "@/lib/entitlements-db/writes";
import { mintLicenseCodes, reconcileCodes } from "@/lib/entitlements-db/codes";
import { systemActor } from "@/lib/entitlements-db/guard";
import { GRANT_TIER_OPTIONS } from "@/lib/hq/access";
import { getPerson } from "@/lib/hq/access";

/**
 * Server actions for the Access console (/hq/entitlements). Auth: HQ cookie.
 * Every mutation resolves a named operator (resolveHqOperatorActor) and goes
 * through the entitlements-db writers, which carry the audit ledger + the
 * blast-radius envelope. Destructive-action friction (type-to-confirm) is
 * ALSO enforced here on the server, not only in the UI, so it can't be
 * skipped by posting the form directly.
 */

const CONSOLE = "/hq/entitlements";

async function requireHq(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(HQ_ACCESS_COOKIE)?.value ?? "";
  const valid = token ? await verifyHqToken(token) : false;
  if (!valid) redirect("/hq/access?from=/hq/entitlements");
}

function field(fd: FormData, key: string): string {
  return ((fd.get(key) as string | null) ?? "").trim();
}

// ── Give access (grant, optionally as a named batch) ────────────────────
export type GiveAccessResult =
  | { ok: true; granted: number; existed: number; invalid: string[]; batchSlug: string | null }
  | { error: string };

export async function giveAccessAction(
  _prev: GiveAccessResult | null,
  fd: FormData,
): Promise<GiveAccessResult> {
  await requireHq();

  const marketing = field(fd, "marketingTier");
  const option = GRANT_TIER_OPTIONS.find((o) => o.marketing === marketing);
  if (!option) return { error: "Pick a plan." };

  const reason = field(fd, "reason");
  if (!reason) return { error: "A reason is required." };

  const rawIds = field(fd, "clerkIds");
  const ids = Array.from(
    new Set(
      rawIds
        .split(/[\s,]+/)
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  );
  if (ids.length === 0) return { error: "Add at least one Clerk user id." };

  const durationRaw = field(fd, "durationDays");
  const durationDays = durationRaw ? Number.parseInt(durationRaw, 10) : null;
  const expiresAtMs =
    durationDays != null && durationDays > 0
      ? Date.now() + durationDays * 24 * 60 * 60 * 1000
      : null;

  const batchLabel = field(fd, "batchLabel");
  let batchId: string | null = null;
  let batchSlug: string | null = null;

  try {
    const actor = await resolveHqOperatorActor();

    if (batchLabel) {
      const slug = batchLabel
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 48);
      batchSlug = slug || `batch-${Date.now()}`;
      batchId = `b-${randomUUID().replace(/-/g, "").slice(0, 16)}`;
      const db = entitlementsDb();
      await db
        .insert(grantBatches)
        .values({
          id: batchId,
          slug: batchSlug,
          label: batchLabel,
          kind: "cohort",
          tier: option.tier,
          allotment: null,
          reason,
          grantedBy: actor.actorId,
          defaultExpiresAt: expiresAtMs,
        })
        .onConflictDoNothing();
    }

    const source = batchId ? "batch_grant" : option.source;
    let granted = 0;
    let existed = 0;
    const invalid: string[] = [];

    for (const id of ids) {
      if (!id.startsWith("user_")) {
        invalid.push(id);
        continue;
      }
      const sourceRef = batchSlug ? `${batchSlug}:${id}` : `hq:${option.marketing}:${id}`;
      const res = await writeSharedEntitlement({
        userClerkId: id,
        tier: option.tier,
        source,
        sourceRef,
        actor,
        expiresAtMs,
        grantReason: reason,
        batchId,
        origin: "studio-hq",
        metadata: { origin: "studio-hq", plan: option.marketing },
      });
      if (res.created) granted += 1;
      else existed += 1;
    }

    revalidatePath(CONSOLE);
    return { ok: true, granted, existed, invalid, batchSlug };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown error" };
  }
}

// ── Revoke a single row (type-to-confirm enforced server-side) ──────────
export async function revokeRowAction(fd: FormData): Promise<void> {
  await requireHq();
  const entitlementId = field(fd, "entitlementId");
  const reason = field(fd, "reason");
  const confirm = field(fd, "confirm");
  const lookup = field(fd, "lookup");
  if (!entitlementId || !reason) return;
  if (confirm !== "REVOKE") return; // friction gate, server-enforced
  try {
    const actor = await resolveHqOperatorActor();
    await revokeEntitlementById({ entitlementId, reason, actor, origin: "hq" });
  } catch (err) {
    console.warn("[access revokeRow] failed:", err);
  }
  if (lookup) revalidatePath(`${CONSOLE}/${lookup}`);
  revalidatePath(CONSOLE);
}

// ── Revoke ALL active rows for a person (type-to-confirm enforced) ──────
export async function revokeAllAction(fd: FormData): Promise<void> {
  await requireHq();
  const clerkId = field(fd, "clerkId");
  const reason = field(fd, "reason");
  const confirm = field(fd, "confirm");
  if (!clerkId || !reason) return;
  if (confirm !== "REVOKE ALL") return; // friction gate, server-enforced
  try {
    const actor = await resolveHqOperatorActor();
    const person = await getPerson(clerkId);
    if (!person.ok) return;
    const activeIds = person.data.rows.filter((r) => r.status === "active").map((r) => r.id);
    if (activeIds.length === 0) return;
    await revokeEntitlementsBulk({
      entitlementIds: activeIds,
      reason,
      actor,
      origin: "hq",
    });
  } catch (err) {
    console.warn("[access revokeAll] failed:", err);
  }
  revalidatePath(`${CONSOLE}/${clerkId}`);
  revalidatePath(CONSOLE);
}

// ── Reconcile now (orphan repair + drift report) ────────────────────────
export async function reconcileNowAction(): Promise<void> {
  await requireHq();
  try {
    await reconcileCodes({ actor: systemActor("reconcile-cron") });
  } catch (err) {
    console.warn("[access reconcile] failed:", err);
  }
  revalidatePath(CONSOLE);
}

// ── Mint venue codes (allotment-capped) ─────────────────────────────────
export type MintResult = { ok: true; minted: number } | { error: string };

const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no ambiguous glyphs
function genLicenseCode(): string {
  const block = () =>
    Array.from({ length: 4 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
  return `SIG-${block()}-${block()}`;
}

export async function mintCodesAction(
  _prev: MintResult | null,
  fd: FormData,
): Promise<MintResult> {
  await requireHq();
  const sponsorId = field(fd, "sponsorId");
  const marketing = field(fd, "marketingTier");
  const countRaw = field(fd, "count");
  const durationRaw = field(fd, "durationDays");
  if (!sponsorId) return { error: "Missing venue." };
  const option = GRANT_TIER_OPTIONS.find((o) => o.marketing === marketing);
  if (!option) return { error: "Pick a plan." };
  const count = Number.parseInt(countRaw, 10);
  if (!Number.isInteger(count) || count < 1) return { error: "Count must be at least 1." };
  const durationDays = durationRaw ? Number.parseInt(durationRaw, 10) : null;

  try {
    const actor = await resolveHqOperatorActor();
    const codes = Array.from({ length: count }, () => ({ code: genLicenseCode() }));
    const res = await mintLicenseCodes({
      sponsorId,
      codes,
      tier: option.tier,
      sourceType: "venue_edition",
      durationDays,
      actor,
      origin: "hq",
    });
    revalidatePath(CONSOLE);
    return { ok: true, minted: res.minted };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "unknown error" };
  }
}
