import { config } from "dotenv";
import {
  VENUE_EDITION_ANNUAL_PRICE_CENTS,
  VENUE_EDITION_ANNUAL_PRICE_EUR,
} from "../src/lib/venue-edition";

config({ path: ".env.local" });
config({ path: ".env" });

/**
 * Record cash received for one annual Venue Edition. The price is fixed in
 * code so a venue cannot be put onto a negotiated size or multi-site tier.
 * Run this on payment, never on signature.
 *
 * Usage:
 *   pnpm tsx scripts/mark-venue-paid.ts <sponsor-slug> <plan>
 *     plan: founding | paid
 *     The founding plan always records the lifetime price lock.
 *
 * Example:
 *   pnpm tsx scripts/mark-venue-paid.ts lambs-hill founding
 */

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

async function main() {
  const [, , slug, plan, ...flags] = process.argv;
  const unknownFlags = flags.filter((flag) => flag !== "--founding");

  if (!slug || !plan) {
    fail(
      [
        "Usage: pnpm tsx scripts/mark-venue-paid.ts <sponsor-slug> <plan>",
        "  plan: founding | paid",
        `  price: fixed at EUR ${VENUE_EDITION_ANNUAL_PRICE_EUR.toLocaleString("en-IE")}/year`,
        "  founding automatically records the lifetime price lock",
        "",
        "Sets venue_plan, annual_amount_cents, founding_locked, the prepaid",
        "annual term window, and paid_at = now. Run on payment, not signature.",
      ].join("\n"),
    );
  }

  if (plan !== "founding" && plan !== "paid") {
    fail(`plan must be 'founding' or 'paid'; got '${plan}'.`);
  }
  if (flags.includes("--founding") && plan !== "founding") {
    fail("--founding is only valid with the founding plan");
  }
  if (unknownFlags.length > 0) {
    fail(
      `Venue Edition is fixed at EUR ${VENUE_EDITION_ANNUAL_PRICE_EUR.toLocaleString("en-IE")}/year. Remove unexpected argument(s): ${unknownFlags.join(" ")}.`,
    );
  }
  const founding = plan === "founding";

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
    annualAmountCents: VENUE_EDITION_ANNUAL_PRICE_CENTS,
    foundingLocked: founding ? 1 : null,
    termStartsAt: now,
    termEndsAt: now + ONE_YEAR_MS,
    paidAt: now,
    updatedAt: now,
  };

  await db.update(sponsors).set(ledger).where(eq(sponsors.slug, slug));
  console.log(
    `[mark-venue-paid] ${slug} -> ${plan} | EUR ${VENUE_EDITION_ANNUAL_PRICE_EUR.toLocaleString("en-IE")}/yr${founding ? " | founding-locked" : ""} | paid_at set. Studio local written.`,
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
