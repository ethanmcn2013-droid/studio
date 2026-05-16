import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

/**
 * mark-venue-paid — record that a venue has PAID for its annual Venue
 * Edition. The deliberate alternative to a self-serve €1,500–€4,000
 * checkout: per docs/MARKETING_PLAN_6MO.md the venue is a founder-closed
 * B2B conversation with annual-prepay-on-signature. A public "buy €4,000"
 * button would be the exact SaaS register BRAND.md §3 forbids. So the
 * operator runs this once, on the call, when the money lands.
 *
 * Writes the sponsor ledger on Studio's local DB (what HQ Traction
 * reads) and mirrors to the shared signal-entitlements DB, matching the
 * dual-write discipline in issue-codes.ts. `paid_at` is set to NOW —
 * "cash in the door" is the honest metric; do not run this on signature,
 * run it on payment.
 *
 * Usage:
 *   pnpm tsx scripts/mark-venue-paid.ts <sponsor-slug> <plan> <eur/yr> [--founding]
 *     plan:    founding | paid
 *     eur/yr:  e.g. 1500  (founding cohort) or 2500 / 4000
 *     --founding  also sets the for-life price lock flag
 *
 *   pnpm tsx scripts/mark-venue-paid.ts lambs-hill founding 1500 --founding
 */

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

async function main() {
  const [, , slug, plan, eurArg, ...flags] = process.argv;
  const founding = flags.includes("--founding");

  if (!slug || !plan || !eurArg) {
    fail(
      [
        "Usage: pnpm tsx scripts/mark-venue-paid.ts <sponsor-slug> <plan> <eur/yr> [--founding]",
        "  plan:   founding | paid",
        "  eur/yr: annual patronage in euros (e.g. 1500)",
        "  --founding: set the €1,500-for-life price lock",
        "",
        "Sets venue_plan, annual_amount_cents, founding_locked, the prepaid",
        "annual term window, and paid_at = now. Run on payment, not signature.",
      ].join("\n"),
    );
  }

  if (plan !== "founding" && plan !== "paid") {
    fail(`plan must be 'founding' or 'paid' — got '${plan}'.`);
  }
  const eur = Number(eurArg);
  if (!Number.isFinite(eur) || eur <= 0) {
    fail(`eur/yr must be a positive number — got '${eurArg}'.`);
  }
  if (eur < 1500 || eur > 4000) {
    console.warn(
      `[mark-venue-paid] ⚠ €${eur}/yr is outside the ratified €1,500–€4,000 band. Continuing — verify this is intentional.`,
    );
  }

  const { db } = await import("../src/lib/db");
  const { sponsors } = await import("../src/lib/db/schema");
  const { eq } = await import("drizzle-orm");

  const sponsor = await db.query.sponsors.findFirst({
    where: eq(sponsors.slug, slug),
  });
  if (!sponsor) {
    fail(
      `No sponsor with slug '${slug}'. Create the sponsor first (issue-codes.ts path), then mark it paid.`,
    );
  }

  const now = Date.now();
  const ledger = {
    venuePlan: plan,
    annualAmountCents: Math.round(eur * 100),
    foundingLocked: founding ? 1 : null,
    termStartsAt: now,
    termEndsAt: now + ONE_YEAR_MS,
    paidAt: now,
    updatedAt: now,
  };

  await db.update(sponsors).set(ledger).where(eq(sponsors.slug, slug));
  console.log(
    `[mark-venue-paid] ${slug} → ${plan} · €${eur}/yr${founding ? " · founding-locked" : ""} · paid_at set. Studio local written.`,
  );

  // Mirror to shared signal-entitlements (same discipline as issue-codes).
  try {
    const { entitlementsDb } = await import(
      "../src/lib/entitlements-db/client"
    );
    const { sponsors: sharedSponsors } = await import(
      "../src/lib/entitlements-db/schema"
    );
    await entitlementsDb()
      .update(sharedSponsors)
      .set(ledger)
      .where(eq(sharedSponsors.slug, slug));
    console.log("[mark-venue-paid] shared signal-entitlements mirror written.");
  } catch (err) {
    console.warn(
      "[mark-venue-paid] shared mirror failed (Studio local is written and authoritative for HQ Traction):",
      err instanceof Error ? err.message : err,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
