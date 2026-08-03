import "server-only";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { allotmentLedger, sponsors } from "./schema";
import { requireActor, type MutationActor } from "./guard";
import { venueEditionAnnualAmountCents } from "@/lib/venue-edition";
import {
  DEFAULT_ALLOTMENT_MODE,
  fairUseCeilingFor,
  isAllotmentMode,
  type AllotmentMode,
} from "@/lib/venue-allotment";

/**
 * Venue lifecycle writers — the no-terminal replacement for the CLI scripts
 * that used to create sponsors and set their paid Venue-Edition ledger.
 *
 * Onboarding is one transaction: upsert the sponsor, set its plan + term +
 * allotment, and write the allotment_ledger provenance entry. A venue counts
 * as revenue (isPaidVenue) only when the plan is founding/paid AND cash has
 * landed (paidAt), so a pilot with an allotment is provisioned but not
 * counted as paid.
 */

const DAY = 24 * 60 * 60 * 1000;
const genId = () => `s-${randomUUID().replace(/-/g, "").slice(0, 16)}`;

export const ONBOARD_PLANS = ["pilot", "founding", "paid"] as const;
export type OnboardPlan = (typeof ONBOARD_PLANS)[number];

function slugify(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export type OnboardVenueResult = {
  id: string;
  slug: string;
  created: boolean;
  paid: boolean;
  allotmentMode: AllotmentMode;
  /** Null for a limited venue. Monitoring only — it never blocks issuance. */
  fairUseCeiling: number | null;
};

/**
 * Create or update a venue and record its payment + term + allotment in one
 * transaction. Idempotent on slug: re-onboarding an existing venue updates it
 * rather than duplicating.
 *
 * Two issuance shapes (R-016):
 *
 *  - `unlimited` — the ratified Venue Edition entitlement (D-020): every
 *    couple who books, for as long as the licence is current. No cap. The
 *    venue's own annual wedding count is collected here, AFTER signature, and
 *    sets a fair-use monitoring ceiling that alerts and never blocks. It never
 *    sets the price and it never changes at renewal.
 *  - `limited` — an explicit positive cap, for pilots and anything that is not
 *    the standard offer.
 *
 * The old contract required a positive allotment on every venue, which is why
 * the console form shipped a `defaultValue={10}` nobody decided. Ten was the
 * real entitlement of every venue onboarded through it.
 */
export async function onboardVenue(input: {
  name: string;
  contactEmail: string;
  venuePlan: OnboardPlan;
  actor: MutationActor;
  /** Required when allotmentMode is 'limited'; ignored when 'unlimited'. */
  allotment?: number | null;
  allotmentMode?: AllotmentMode;
  /** D-020 point 4. Collected after signature. Sets the ceiling, never the price. */
  annualWeddingCount?: number | null;
  slug?: string | null;
  termMonths?: number | null;
  reason?: string | null;
}): Promise<OnboardVenueResult> {
  const actor = requireActor(input.actor);
  const name = input.name.trim();
  if (!name) throw new Error("onboardVenue: name required");
  const contactEmail = input.contactEmail.trim();
  if (!contactEmail) throw new Error("onboardVenue: contactEmail required");
  if (!(ONBOARD_PLANS as readonly string[]).includes(input.venuePlan)) {
    throw new Error(`onboardVenue: unknown plan '${input.venuePlan}'`);
  }
  const allotmentMode: AllotmentMode = input.allotmentMode ?? DEFAULT_ALLOTMENT_MODE;
  if (!isAllotmentMode(allotmentMode)) {
    throw new Error(`onboardVenue: unknown allotment mode '${allotmentMode}'`);
  }
  const unlimited = allotmentMode === "unlimited";
  if (!unlimited && (!Number.isInteger(input.allotment) || (input.allotment ?? 0) < 1)) {
    throw new Error(
      "onboardVenue: a limited venue needs a positive allotment (use allotmentMode 'unlimited' for the standard Venue Edition entitlement)",
    );
  }
  if (
    input.annualWeddingCount != null &&
    (!Number.isInteger(input.annualWeddingCount) || input.annualWeddingCount < 0)
  ) {
    throw new Error("onboardVenue: annualWeddingCount must be a whole number");
  }
  const annualWeddingCount = input.annualWeddingCount ?? null;
  const fairUseCeiling = unlimited ? fairUseCeilingFor(annualWeddingCount) : null;
  // An unlimited venue keeps a null cap, so a later switch back to 'limited'
  // fails closed on the mint rather than inheriting a stale number.
  const codeAllotment = unlimited ? null : (input.allotment as number);
  const slug = slugify(input.slug?.trim() || name);
  if (!slug) throw new Error("onboardVenue: could not derive a slug");

  const isPaidPlan = input.venuePlan === "founding" || input.venuePlan === "paid";
  const annualAmountCents = venueEditionAnnualAmountCents(input.venuePlan);
  const db = entitlementsDb();
  const now = Date.now();
  const termStartsAt = now;
  const termEndsAt =
    input.termMonths && input.termMonths > 0 ? now + input.termMonths * 30 * DAY : null;

  return db.transaction(async (tx) => {
    const existing = await tx
      .select({ id: sponsors.id, codeAllotment: sponsors.codeAllotment })
      .from(sponsors)
      .where(eq(sponsors.slug, slug))
      .limit(1);

    const id = existing[0]?.id ?? genId();
    const created = !existing[0];
    // Ledger records the CHANGE in allotment, so SUM(delta) stays equal to
    // code_allotment even when a venue is re-onboarded with a new number. An
    // unlimited venue has no number to change, so it writes no delta — the
    // ledger answers "why does this venue have N codes", and "unlimited" is
    // not an answer that arithmetic can carry.
    const allotmentDelta = unlimited
      ? 0
      : (codeAllotment as number) - (existing[0]?.codeAllotment ?? 0);

    if (created) {
      await tx.insert(sponsors).values({
        id,
        slug,
        name,
        contactEmail,
        venuePlan: input.venuePlan,
        kind: "venue",
        annualAmountCents,
        foundingLocked: input.venuePlan === "founding" ? 1 : null,
        termStartsAt,
        termEndsAt,
        paidAt: isPaidPlan ? now : null,
        codeAllotment,
        allotmentMode,
        annualWeddingCount,
        fairUseCeiling,
      });
    } else {
      await tx
        .update(sponsors)
        .set({
          name,
          contactEmail,
          venuePlan: input.venuePlan,
          annualAmountCents,
          foundingLocked: input.venuePlan === "founding" ? 1 : null,
          termStartsAt,
          termEndsAt,
          paidAt: isPaidPlan ? now : null,
          codeAllotment,
          allotmentMode,
          annualWeddingCount,
          fairUseCeiling,
          updatedAt: now,
        })
        .where(eq(sponsors.id, id));
    }

    // Provenance for "why N codes": the allotment CHANGE is a ledger line.
    if (allotmentDelta !== 0) {
      await tx.insert(allotmentLedger).values({
        id: `al-${randomUUID().replace(/-/g, "").slice(0, 16)}`,
        sponsorId: id,
        delta: allotmentDelta,
        reason: input.reason?.trim() || `onboard ${input.venuePlan}`,
        actorId: actor.actorId,
        termStartsAt,
        termEndsAt,
      });
    }

    return { id, slug, created, paid: isPaidPlan, allotmentMode, fairUseCeiling };
  });
}
