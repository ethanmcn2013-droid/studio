import commercialTerms from "../../contracts/commercial-terms.v2.json";

export const COMMERCIAL_TERMS_VERSION = commercialTerms.version;
export const COMMERCIAL_TERMS = Object.freeze(commercialTerms);

export type CommercialPlanId = keyof typeof commercialTerms.plans;
export type ConsumerPlanId = "free" | "student" | "pro" | "event";

export function formatEuroCents(amountCents: number): string {
  if (!Number.isInteger(amountCents) || amountCents < 0) {
    throw new RangeError("amountCents must be a non-negative integer");
  }
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: commercialTerms.currency,
    minimumFractionDigits: amountCents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amountCents / 100);
}

/** A ratified amount is not evidence that a plan is available or enforced. */
export function requireVerifiedAmount(plan: CommercialPlanId): number {
  const value = commercialTerms.plans[plan];
  const amount =
    "amountCents" in value
      ? value.amountCents
      : "monthlyAmountCents" in value
        ? value.monthlyAmountCents
        : value.annualAmountCents;
  if (typeof amount !== "number") {
    throw new Error("No verified amount for plan: " + plan);
  }
  return amount;
}

function countLabel(value: number | null): string {
  if (value === null) return "See terms before purchase";
  if (value === 1) return "One";
  if (value === 3) return "Three";
  return String(value);
}

/**
 * Customer-facing pricing facts derived from the ratified contract.
 *
 * The contract stores billing semantics such as Free's `forever` cadence,
 * but public copy must not turn an internal cadence into a permanence promise.
 * This adapter deliberately presents it as "No recurring charge". Unknown
 * editor limits stay unknown until the purchase terms are ratified.
 */
export function getConsumerPricingPresentation() {
  const { free, student, pro, event } = commercialTerms.plans;
  return Object.freeze({
    availability:
      commercialTerms.accessState === "waitlist_first"
        ? "Access opens in small batches."
        : "Access is open.",
    vatStatement: `All prices are ${commercialTerms.vat.publicStatement}.`,
    plans: Object.freeze({
      free: Object.freeze({
        name: free.publicName,
        price: formatEuroCents(free.amountCents),
        workspaceLimit: countLabel(free.workspaceLimit),
        editingGuestLimit: countLabel(free.editingGuestLimit),
        access: "No recurring charge",
      }),
      student: Object.freeze({
        name: student.publicName,
        /**
         * The name the acquisition programme is published under, which is not
         * the plan's own name: the price card says "Student" because that is
         * what a reader buys, and the page says "Student Edition" because that
         * is what the programme is called. Both come from the contract, the
         * same way the venue plan carries `founding.programmeName`.
         */
        programmeName: student.programmeName,
        price: formatEuroCents(student.amountCents),
        workspaceLimit: countLabel(student.workspaceLimit),
        editingGuestLimit: countLabel(student.editingGuestLimit),
        access: "Annual student re-verification",
      }),
      pro: Object.freeze({
        name: pro.publicName,
        price: formatEuroCents(pro.monthlyAmountCents),
        annualPrice: formatEuroCents(pro.annualAmountCents),
        workspaceLimit:
          pro.workspaceLimitBasis === "unlimited"
            ? "Unlimited"
            : countLabel(pro.workspaceLimit),
        editingGuestLimit: countLabel(pro.editingGuestLimit),
        access: "While subscribed",
      }),
      event: Object.freeze({
        name: event.publicName,
        price: formatEuroCents(event.amountCents),
        workspaceLimit: "One event",
        editingGuestLimit: countLabel(null),
        availableForNewPurchase: event.newSalesAvailable,
        // The retained postWindow value is intended policy, not a shipped archive.
        access: "New Event purchases are currently unavailable.",
      }),
    }),
  });
}
