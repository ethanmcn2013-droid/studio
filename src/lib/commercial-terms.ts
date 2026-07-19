import commercialTerms from "../../contracts/commercial-terms.v1.json";

export const COMMERCIAL_TERMS_VERSION = commercialTerms.version;
export const COMMERCIAL_TERMS = Object.freeze(commercialTerms);

export type CommercialPlanId = keyof typeof commercialTerms.plans;

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
