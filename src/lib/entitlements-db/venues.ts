import "server-only";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { entitlementsDb } from "./client";
import { allotmentLedger, sponsors } from "./schema";
import { requireActor, type MutationActor } from "./guard";

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
};

/**
 * Create or update a venue and record its payment + term + allotment in one
 * transaction. Idempotent on slug: re-onboarding an existing venue updates it
 * rather than duplicating. Requires a positive allotment (a paid/founding
 * venue MUST have a non-null allotment before any code can be minted).
 */
export async function onboardVenue(input: {
  name: string;
  contactEmail: string;
  venuePlan: OnboardPlan;
  allotment: number;
  actor: MutationActor;
  slug?: string | null;
  annualAmountCents?: number | null;
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
  if (!Number.isInteger(input.allotment) || input.allotment < 1) {
    throw new Error("onboardVenue: allotment must be a positive integer");
  }
  const slug = slugify(input.slug?.trim() || name);
  if (!slug) throw new Error("onboardVenue: could not derive a slug");

  const isPaidPlan = input.venuePlan === "founding" || input.venuePlan === "paid";
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
    // code_allotment even when a venue is re-onboarded with a new number.
    const allotmentDelta = input.allotment - (existing[0]?.codeAllotment ?? 0);

    if (created) {
      await tx.insert(sponsors).values({
        id,
        slug,
        name,
        contactEmail,
        venuePlan: input.venuePlan,
        kind: "venue",
        annualAmountCents: input.annualAmountCents ?? null,
        foundingLocked: input.venuePlan === "founding" ? 1 : null,
        termStartsAt,
        termEndsAt,
        paidAt: isPaidPlan ? now : null,
        codeAllotment: input.allotment,
      });
    } else {
      await tx
        .update(sponsors)
        .set({
          name,
          contactEmail,
          venuePlan: input.venuePlan,
          annualAmountCents: input.annualAmountCents ?? null,
          foundingLocked: input.venuePlan === "founding" ? 1 : null,
          termStartsAt,
          termEndsAt,
          paidAt: isPaidPlan ? now : null,
          codeAllotment: input.allotment,
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

    return { id, slug, created, paid: isPaidPlan };
  });
}
