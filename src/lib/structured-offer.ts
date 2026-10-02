/**
 * The billing period for a recurring plan in schema.org structured data.
 *
 * A bare `price` on an Offer reads as a one-off amount. Student is billed
 * once a year and Pro once a month, so those two offers carry their period.
 *
 * This lives outside the root layout on purpose. The Venue Edition contract
 * (scripts/check-venue-edition-contract.mjs) keeps the layout free of any
 * price specification so the Venue Edition offer can never grow one; the
 * consumer plans get their period from here and the Venue Edition offer
 * stays one exact offer with no price.
 */
export function recurringPrice(amountCents: number, every: "P1M" | "P1Y") {
  return {
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(amountCents / 100),
      priceCurrency: "EUR",
      billingDuration: every,
      unitText: every === "P1Y" ? "year" : "month",
    },
  };
}
