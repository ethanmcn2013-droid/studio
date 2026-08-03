import { config } from "dotenv";
import {
  VENUE_EDITION_ANNUAL_PRICE_EUR,
  VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR,
  venueEditionAnnualAmountCents,
} from "../src/lib/venue-edition";

config({ path: ".env.local" });
config({ path: ".env" });

/**
 * Record cash received for one annual Venue Edition term.
 *
 * ── What changed on 2026-08-03, and why it mattered ───────────────────────
 *
 * This script used to write the cash ledger itself: it set five columns on
 * `sponsors` and mirrored them to the shared entitlements database. Four things
 * were wrong with that, and all four were invisible because the script printed
 * a success line either way.
 *
 *   1. **It never assigned the founding number.** D-009 point 6 assigns a
 *      number on cleared payment, and this was the only thing that recorded a
 *      cleared payment. A founding venue could be marked paid and hold no
 *      number at all.
 *   2. **It kept no history.** `annual_amount_cents` is one mutable column, so
 *      the next renewal overwrote the last one. E08.02 requires that a venue
 *      which joined at EUR 1,000 still reads EUR 1,000 after the standard price
 *      moves, and that each past term keeps the amount actually charged.
 *   3. **It wrote no audit line**, so money arrived with no actor and no route.
 *   4. **It was not idempotent.** Running it twice moved the term window
 *      forward silently, which is how a venue loses a month it paid for.
 *
 * It now records through `recordAnnualPrepayment`, which is the single writer
 * carrying all of those guards. This script's remaining job is to be a decent
 * command line: parse arguments, refuse nonsense, and print what happened.
 *
 * **There is no payment provider for venues.** Stripe carries the workspace,
 * studio, wedding and event tiers and has no venue price id. Venue money is
 * invoiced out of band and the cleared payment is recorded here by hand. That
 * is the process. Nothing in this output presents it as automatic.
 *
 * Usage:
 *   pnpm tsx scripts/mark-venue-paid.ts <sponsor-slug> <plan> [--vat-rate <bp>]
 *     plan: founding | paid
 *     founding records the Founding 25 rate and sets the rate lock.
 *     --vat-rate takes basis points (2300 = 23%). OMIT IT unless the treatment
 *     has actually been determined: the rate is recorded as "not determined"
 *     rather than as zero, because zero is a claim (R-014, R-018, R-022).
 *
 * Example:
 *   pnpm tsx scripts/mark-venue-paid.ts lambs-hill founding
 */

function fail(msg: string): never {
  console.error(msg);
  process.exit(1);
}

async function main() {
  const argv = process.argv.slice(2);
  const positional: string[] = [];
  let vatRateBasisPoints: number | null = null;
  let note: string | null = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--vat-rate") {
      const raw = argv[i + 1];
      i += 1;
      const parsed = Number(raw);
      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 10_000) {
        fail(`--vat-rate takes basis points as a whole number 0-10000 (2300 = 23%); got '${raw}'.`);
      }
      vatRateBasisPoints = parsed;
      continue;
    }
    if (arg === "--note") {
      note = argv[i + 1] ?? null;
      i += 1;
      continue;
    }
    if (arg === "--founding") {
      // Accepted and ignored: the plan argument already says so. Kept so an
      // older runbook line does not fail.
      continue;
    }
    if (arg.startsWith("--")) {
      fail(
        `Venue Edition is fixed at EUR ${VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR.toLocaleString("en-IE")}/year founding, EUR ${VENUE_EDITION_ANNUAL_PRICE_EUR.toLocaleString("en-IE")}/year standard, both inclusive of VAT at the prevailing rate. Remove unexpected argument: ${arg}.`,
      );
    }
    positional.push(arg);
  }

  const [slug, plan] = positional;

  if (!slug || !plan) {
    fail(
      [
        "Usage: pnpm tsx scripts/mark-venue-paid.ts <sponsor-slug> <plan> [--vat-rate <bp>]",
        "  plan: founding | paid",
        `  founding: EUR ${VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR.toLocaleString("en-IE")}/year, inclusive of VAT at the prevailing rate`,
        `  paid:     EUR ${VENUE_EDITION_ANNUAL_PRICE_EUR.toLocaleString("en-IE")}/year, inclusive of VAT at the prevailing rate`,
        "  founding also sets the rate lock, held while the agreement renews continuously",
        "",
        "Records one append-only annual term, refreshes the sponsor's current",
        "position, writes an audit line, and assigns the founding number on a",
        "founding plan. Run on cleared payment, not on signature.",
      ].join("\n"),
    );
  }

  if (plan !== "founding" && plan !== "paid") {
    fail(`plan must be 'founding' or 'paid'; got '${plan}'.`);
  }

  const amountCents = venueEditionAnnualAmountCents(plan);
  if (amountCents == null) {
    fail(`plan '${plan}' has no annual amount; only founding and paid are cash.`);
  }

  const { recordAnnualPrepayment } = await import(
    "../src/lib/entitlements-db/venue-billing"
  );
  const { formatVenuePrice, vatInclusive, describeVatBreakdown } = await import(
    "../src/lib/venue-money"
  );

  const paidAtMs = Date.now();
  const result = await recordAnnualPrepayment({
    sponsorSlug: slug,
    venuePlan: plan,
    // The amount is passed so the writer can refuse a mismatch. It is checked
    // against the plan's ratified price and then discarded — the price of
    // record always comes from the plan, never from this command line.
    amountReceivedCents: amountCents,
    paidAtMs,
    vatRateBasisPoints,
    actor: {
      actorId: process.env.SIGNAL_OPERATOR_ID?.trim() || "cli:mark-venue-paid",
      actorName: process.env.SIGNAL_OPERATOR_NAME?.trim() || "Operator (CLI)",
      kind: "operator",
      velocityExempt: false,
    },
    recordedVia: "cli:mark-venue-paid",
    note,
    origin: "cli:mark-venue-paid",
  });

  if (result.state === "refused") {
    fail(`[mark-venue-paid] REFUSED — ${result.reason}\nNothing was recorded.`);
  }

  if (result.state === "already_recorded") {
    console.log(
      `[mark-venue-paid] ${slug}: this term is already recorded (agreement ${result.agreementId}). Nothing was written a second time.`,
    );
    return;
  }

  const amount = vatInclusive({ grossCents: result.amount.grossCents, vatRateBasisPoints });
  console.log(`[mark-venue-paid] ${slug} -> ${plan}`);
  console.log(`  term:      ${new Date(result.termStartsAtMs).toISOString().slice(0, 10)} to ${new Date(result.termEndsAtMs).toISOString().slice(0, 10)}`);
  console.log(`  price:     ${formatVenuePrice(amount)}`);
  console.log(`  ledger:    ${describeVatBreakdown(amount)}`);
  console.log(`  agreement: ${result.agreementId} (append-only; it cannot be edited or deleted)`);

  if (plan === "founding") {
    const label = result.foundingNumber?.label;
    if (label) {
      console.log(`  number:    ${label} — assigned on cleared payment (D-009 point 6)`);
      console.log("  the rate lock holds while the agreement renews continuously without lapse");
    } else {
      console.error(
        `  number:    NOT ASSIGNED — assignment returned '${result.foundingNumber?.state ?? "unknown"}'.`,
      );
      console.error(
        "  The payment IS recorded. Assign the number before telling this venue which place it holds.",
      );
      process.exit(1);
    }
  }

  // ── Mirror to the studio-local sponsors row ────────────────────────────
  //
  // HQ Traction reads `@/lib/db`, not the shared entitlements database
  // (src/lib/hq/traction.ts imports sponsors from @/lib/db/schema and treats
  // `venue_plan` + `paid_at` + `annual_amount_cents` as the revenue source).
  // The shared ledger above is the record of the money; this row is a cache so
  // Traction sees it.
  //
  // The previous version of this script swallowed a mirror failure in a
  // console.warn and exited 0. A cash-ledger writer that reports success while
  // half of it did not land is worse than one that fails, so this exits
  // non-zero and says exactly what is and is not recorded.
  try {
    const { db } = await import("../src/lib/db");
    const { sponsors: localSponsors } = await import("../src/lib/db/schema");
    const { eq } = await import("drizzle-orm");
    await db
      .update(localSponsors)
      .set({
        venuePlan: plan,
        annualAmountCents: result.amount.grossCents,
        foundingLocked: plan === "founding" ? 1 : null,
        termStartsAt: result.termStartsAtMs,
        termEndsAt: result.termEndsAtMs,
        paidAt: paidAtMs,
        updatedAt: paidAtMs,
      })
      .where(eq(localSponsors.slug, slug));
    console.log("  traction:  studio-local sponsors row refreshed");
  } catch (err) {
    console.error("");
    console.error(
      `[mark-venue-paid] The payment IS recorded in the shared ledger (agreement ${result.agreementId}) and that record stands.`,
    );
    console.error(
      "[mark-venue-paid] The studio-local mirror FAILED, so HQ Traction will not show this venue as revenue until it is rerun:",
    );
    console.error(`  ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
