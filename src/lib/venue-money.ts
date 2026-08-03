/**
 * VAT-inclusive money for Venue Edition — D-021.
 *
 * ── The one rule this module exists to make structural ────────────────────
 *
 * **Gross is the input. Net is derived. Net is never an input.**
 *
 * D-021 ratified EUR 1,500 standard and EUR 1,000 for the Founding 25 as the
 * amounts a venue *pays*. VAT at the prevailing rate comes out of that number,
 * it is never added to it. The failure this guards against is arithmetic drift:
 * somebody records EUR 813.01 net, a later surface adds 23% back, and the venue
 * is quoted EUR 1,000.00 in one place and EUR 999.99 in another. Under a price
 * lock that cannot be corrected (R-022), a rounding artefact becomes permanent.
 *
 * So a `VatInclusiveAmount` can only be built from a gross figure. There is no
 * constructor that accepts a net amount, and `vatCents` is always
 * `gross - net`, which makes "net plus VAT equals gross" true by construction
 * rather than by rounding luck.
 *
 * ── What this module deliberately does NOT claim ──────────────────────────
 *
 * Whether Signal Studio is an accountable person is **unconfirmed**
 * (`contracts/commercial-terms.v2.json` → `vat.accountablePersonStatus`). The
 * Revenue MyEnquiries submission drafted at
 * `docs/execution/venue-edition-and-films/evidence/E02.07-revenue-myenquiries-submission.md`
 * has not been filed. Nothing here states, implies or assumes that any VAT
 * treatment has been confirmed by Revenue or reviewed by an accountant
 * (D-016, R-013).
 *
 * That is why `vatRateBasisPoints` is nullable and why a null rate produces a
 * null net rather than a zero one. **Null means "not determined".** Zero would
 * mean "determined to be zero-rated", which is a claim nobody is entitled to
 * make yet. R-014 requires every prepayment to stay individually identifiable
 * so the treatment can be corrected retrospectively; recording an undetermined
 * rate as 0% is exactly how that correction becomes impossible.
 *
 * Pure and client-safe. No database, no I/O.
 */

/** Percentage points times 100. 2300 = 23%. Integers only. */
export type VatRateBasisPoints = number;

/**
 * The exact public wording ratified in D-021 and carried in
 * `contracts/commercial-terms.v2.json` → `vat.publicStatement`.
 *
 * Every venue-facing money string uses this. Never "plus VAT", never "ex VAT",
 * never a separate VAT line that reads as an addition.
 */
export const VAT_INCLUSIVE_STATEMENT = "inclusive of VAT at the prevailing rate";

/**
 * Phrases that turn an inclusive price into an exclusive one in a reader's
 * head. Used by the copy check below and by the source-contract test.
 */
export const VAT_EXCLUSIVE_PHRASES: readonly string[] = [
  "plus vat",
  "+ vat",
  "ex vat",
  "ex. vat",
  "excluding vat",
  "exclusive of vat",
  "vat will be added",
  "vat is added",
  "before vat",
  "net of vat",
];

declare const vatInclusiveBrand: unique symbol;

/**
 * A money amount that knows it is VAT-inclusive.
 *
 * Branded so an object literal cannot be passed where one of these is
 * expected. The brand is not decoration: it is what stops a caller assembling
 * `{ grossCents: 100000, netCents: 100000 }` and having it type-check.
 */
export type VatInclusiveAmount = {
  readonly [vatInclusiveBrand]: true;
  /** What the venue pays. The authoritative number on every surface. */
  readonly grossCents: number;
  /** The rate applied to this payment, or null when the treatment is not determined. */
  readonly vatRateBasisPoints: VatRateBasisPoints | null;
  /** Derived from gross. Null when the rate is null. Never an input. */
  readonly netCents: number | null;
  /** `gross - net`, so the three always reconcile exactly. Null when the rate is null. */
  readonly vatCents: number | null;
};

/** The state of the VAT treatment on a recorded amount. */
export type VatTreatment = "not_determined" | "applied";

export function vatTreatmentOf(amount: VatInclusiveAmount): VatTreatment {
  return amount.vatRateBasisPoints == null ? "not_determined" : "applied";
}

/**
 * The ONLY constructor. Takes the gross amount the venue pays and, optionally,
 * the rate applied to it.
 *
 * @param grossCents          what the venue pays, in cents. Must be a
 *                            non-negative integer.
 * @param vatRateBasisPoints  the rate applied to this payment, or null/omitted
 *                            when the treatment has not been determined.
 */
export function vatInclusive(input: {
  grossCents: number;
  vatRateBasisPoints?: VatRateBasisPoints | null;
}): VatInclusiveAmount {
  const gross = input.grossCents;
  if (!Number.isInteger(gross) || gross < 0) {
    throw new Error(
      `vatInclusive: grossCents must be a non-negative whole number of cents (got ${String(gross)})`,
    );
  }
  const rate = input.vatRateBasisPoints ?? null;
  if (rate == null) {
    return {
      grossCents: gross,
      vatRateBasisPoints: null,
      netCents: null,
      vatCents: null,
    } as VatInclusiveAmount;
  }
  if (!Number.isInteger(rate) || rate < 0 || rate > 10_000) {
    throw new Error(
      `vatInclusive: vatRateBasisPoints must be a whole number between 0 and 10000 (got ${String(rate)})`,
    );
  }
  // net = gross / (1 + rate). Computed in integer cents from gross, then vat is
  // the remainder, so net + vat === gross for every input without exception.
  const netCents = Math.round((gross * 10_000) / (10_000 + rate));
  return {
    grossCents: gross,
    vatRateBasisPoints: rate,
    netCents,
    vatCents: gross - netCents,
  } as VatInclusiveAmount;
}

/**
 * Rebuild an amount from stored columns. Used only by the database read path.
 *
 * Note what it takes: gross and rate. It does **not** take the stored net —
 * the net is recomputed from gross so a corrupted or hand-edited net column
 * can never become the number a venue sees.
 */
export function vatInclusiveFromRecord(record: {
  grossAmountCents: number;
  vatRateBasisPoints: number | null;
}): VatInclusiveAmount {
  return vatInclusive({
    grossCents: record.grossAmountCents,
    vatRateBasisPoints: record.vatRateBasisPoints,
  });
}

/** Two amounts are the same money when gross and rate match. */
export function sameAmount(a: VatInclusiveAmount, b: VatInclusiveAmount): boolean {
  return (
    a.grossCents === b.grossCents && a.vatRateBasisPoints === b.vatRateBasisPoints
  );
}

/* ── Formatting ──────────────────────────────────────────────────────────── */

/**
 * Group digits by thousands with a comma. Hand-rolled rather than
 * `toLocaleString`, because Node builds without full ICU silently fall back to
 * a different grouping and a price that renders differently on the server and
 * in CI is a price nobody can check.
 */
function group(whole: string): string {
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** `100000` → `"1,000"`, `99999` → `"999.99"`. */
export function formatEurCents(cents: number): string {
  if (!Number.isInteger(cents)) {
    throw new Error(`formatEurCents: cents must be a whole number (got ${String(cents)})`);
  }
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const whole = group(String(Math.floor(abs / 100)));
  const remainder = abs % 100;
  const body = remainder === 0 ? whole : `${whole}.${String(remainder).padStart(2, "0")}`;
  return negative ? `-${body}` : body;
}

/**
 * The venue-facing money string. Always gross, always carrying the D-021
 * wording, and there is no variant that omits the wording.
 *
 * `formatVenuePrice(vatInclusive({ grossCents: 100_000 }))`
 *   → `"EUR 1,000 inclusive of VAT at the prevailing rate"`
 */
export function formatVenuePrice(
  amount: VatInclusiveAmount,
  options?: { symbol?: "EUR" | "€" },
): string {
  const symbol = options?.symbol ?? "EUR";
  const spacer = symbol === "EUR" ? " " : "";
  return `${symbol}${spacer}${formatEurCents(amount.grossCents)} ${VAT_INCLUSIVE_STATEMENT}`;
}

/**
 * The internal breakdown, for the cash ledger and nothing else. It is not a
 * venue-facing string: a venue is never shown a net figure, because showing one
 * invites the reading that VAT is being added on top.
 *
 * When the rate is not determined it says so rather than printing a number.
 */
export function describeVatBreakdown(amount: VatInclusiveAmount): string {
  if (amount.vatRateBasisPoints == null || amount.netCents == null) {
    return `gross EUR ${formatEurCents(amount.grossCents)}; VAT treatment not determined, so no net is recorded`;
  }
  const rate = (amount.vatRateBasisPoints / 100).toFixed(
    amount.vatRateBasisPoints % 100 === 0 ? 0 : 2,
  );
  return `gross EUR ${formatEurCents(amount.grossCents)} = net EUR ${formatEurCents(
    amount.netCents,
  )} + VAT EUR ${formatEurCents(amount.vatCents as number)} at ${rate}%`;
}

/* ── Copy guard ──────────────────────────────────────────────────────────── */

/**
 * Refusal reason if a piece of venue-facing copy would misstate the price
 * basis, or null when it is clean.
 *
 * Two failures, both real:
 *   1. It says VAT is added on top. D-021 says it is not.
 *   2. It quotes a euro amount and never says the price is VAT-inclusive.
 *      Silence on VAT against 25 signed documents is the irreversible half of
 *      R-018, and D-021 accepted the inclusive position knowing that.
 */
export function venuePriceCopyRefusal(copy: string): string | null {
  const lower = copy.toLowerCase();
  for (const phrase of VAT_EXCLUSIVE_PHRASES) {
    if (lower.includes(phrase)) {
      return `copy says ${JSON.stringify(phrase)}; Venue Edition prices are ${VAT_INCLUSIVE_STATEMENT} (D-021)`;
    }
  }
  const quotesMoney = /(?:€|EUR)\s?\d/i.test(copy);
  if (quotesMoney && !lower.includes(VAT_INCLUSIVE_STATEMENT.toLowerCase())) {
    return `copy quotes a price without the ratified basis; add ${JSON.stringify(VAT_INCLUSIVE_STATEMENT)} (D-021)`;
  }
  return null;
}
