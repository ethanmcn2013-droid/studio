/**
 * E12.11 — the Founding Venue certificate, as data.
 *
 * ── The one rule that shapes everything else ─────────────────────────────
 * THE CERTIFICATE CANNOT EXIST BEFORE THE PAYMENT CLEARS.
 *
 * D-009 point 6 and `FOUNDING_25_PROGRAMME_MECHANICS.md` section 2: the number
 * is assigned when the first payment clears. Not at signature, not on invoice,
 * not on a verbal yes. Payment is the only event that cannot be walked back,
 * and that is the whole of why 01/25 is worth having.
 *
 * So `buildFoundingCertificate` is a function that refuses. It returns a
 * refusal, with a reason, for every input that is not a paid founding venue
 * holding a valid number. There is no code path that produces a certificate
 * with a blank number, and no code path that produces one from a signature.
 *
 * The existing physical exploration gets this wrong, and it is the reason this
 * task exists rather than a reprint. `src/app/hq/partner-card/page.tsx` states
 * "the number is still written by hand, in front of the venue, at signing" and
 * "the number field stays blank until a real venue signs". Both describe
 * assignment at signature. Under D-009 point 6 a card handed over at signature
 * either carries a number the venue has not earned, or carries a blank that
 * invites someone to write one in. Recorded in
 * `evidence/E12.10-E12.13-venue-artefacts.md` section 5 as defect C-1.
 *
 * ── The second rule ──────────────────────────────────────────────────────
 * IT MUST NOT IMPLY PERMANENCE. A certificate is the single most likely object
 * in this programme to be read as a promise that outlives the agreement. It
 * hangs on a wall. So the founding rate appears with its condition attached in
 * the same block, never as a bare number, and the words "for life", "forever"
 * and "in perpetuity" are refused by the test rather than merely avoided by
 * the author.
 *
 * ── The third rule ───────────────────────────────────────────────────────
 * A NUMBER IS NEVER REUSED. A venue that lapses in year three keeps 07/25
 * historically and the place shows closed, not open. The certificate records
 * an event that happened, so it does not carry a validity window and it is not
 * reissued when the agreement renews.
 *
 * ── What ratified each fact ──────────────────────────────────────────────
 *   The number, 01/25 to 25/25, assigned on cleared payment       D-009.6
 *   EUR 1,000 a year prepaid, inclusive of VAT               D-009.1 · D-021
 *   The lock holds on continuous renewal without lapse            D-009.3
 *   The rate follows the property                                 D-009.4
 *   Programme term is Founding 25, a venue in it is a founding venue D-033
 *   Nothing may imply legal approval                              D-016
 *
 * Pure and client-safe. The number arithmetic is
 * `src/lib/venue-founding-number.ts`, which is the E02.13 implementation, and
 * this module does not restate a rule that lives there.
 */

import {
  FOUNDING_PLACES,
  foundingNumberRefusal,
  formatFoundingNumber,
  isValidFoundingNumber,
} from "./venue-founding-number";

/* ── Input ──────────────────────────────────────────────────────────────── */

export type FoundingCertificateInput = {
  /** The trading name, as the owner writes it. */
  venueName: string;
  /** 1 to 25. The number already assigned by the register, never chosen here. */
  foundingNumber: number | null;
  /**
   * The day the first payment cleared, already formatted for print, for
   * example "14 September 2026". A date is a fact about an event that
   * happened, so it is rendered as given rather than computed here.
   */
  paymentClearedOn: string;
  /** The venue's plan, from the register. Only `founding` receives a number. */
  venuePlan: string;
};

export const EMPTY_CERTIFICATE_INPUT: FoundingCertificateInput = {
  venueName: "",
  foundingNumber: null,
  paymentClearedOn: "",
  venuePlan: "founding",
};

/* ── Output ─────────────────────────────────────────────────────────────── */

export type CertificateLine = { label: string; value: string };

export type FoundingCertificate =
  | {
      state: "refused";
      /** Plain English, written to be read by the founder, not parsed. */
      reason: string;
    }
  | {
      state: "issued";
      /** `NN/25`. */
      number: string;
      venueName: string;
      /** The single statement of fact the certificate makes. */
      statement: string;
      /** The record block. Label and value, printed as a list. */
      record: CertificateLine[];
      /** The rate and every condition that holds it, in one block. */
      terms: string[];
      /** The closing line. Names the signer and nothing else. */
      signature: string;
    };

/* ── The words ──────────────────────────────────────────────────────────── */

const SIGNATURE = "Ethan McNamara · Signal Studio · signalstudio.ie";

/**
 * The rate, with the conditions in the same block. Never a bare number on a
 * wall. Every line traces: D-009.1 and D-021 for the rate and the VAT wording,
 * D-009.3 for what holds it, D-009.4 for change of control.
 */
const TERMS_LINES = [
  "The founding rate is €1,000 a year, prepaid, including VAT at the prevailing rate. The standard rate is €1,500 a year on the same basis.",
  "The founding rate holds for as long as the agreement renews continuously without lapse.",
  "It follows the property. It survives a sale, an operator change and a rebrand. It does not travel to other venues a new owner brings.",
  "This certificate records an event. It is not the agreement, and it does not grant access on its own.",
];

/**
 * The one statement the certificate makes, as a sentence rather than a title.
 * It says what happened and when, and it stops.
 */
function statementFor(venueName: string, number: string): string {
  return `${venueName} holds place ${number} in the Founding 25, assigned when the first payment cleared.`;
}

/* ── The build, which refuses ───────────────────────────────────────────── */

export function buildFoundingCertificate(
  input: FoundingCertificateInput,
): FoundingCertificate {
  const venueName = input.venueName.trim();
  const clearedOn = input.paymentClearedOn.trim();

  if (venueName.length === 0) {
    return { state: "refused", reason: "no venue name" };
  }

  if (clearedOn.length === 0) {
    return {
      state: "refused",
      reason:
        "payment has not cleared. A number is assigned on cleared payment, never on signature",
    };
  }

  // The register's own refusal rules, not a second copy of them. The date
  // above is the print form; `paidAt` here is the fact that a payment exists.
  const refusal = foundingNumberRefusal({
    paidAt: 1,
    existingNumber: null,
    venuePlan: input.venuePlan,
  });
  if (refusal) {
    return { state: "refused", reason: refusal };
  }

  if (!isValidFoundingNumber(input.foundingNumber)) {
    return {
      state: "refused",
      reason: `no founding number held. A number is 01 to ${FOUNDING_PLACES}, assigned by the register when payment clears`,
    };
  }

  const number = formatFoundingNumber(input.foundingNumber);
  if (!number) {
    return { state: "refused", reason: "the founding number is not valid" };
  }

  return {
    state: "issued",
    number,
    venueName,
    statement: statementFor(venueName, number),
    record: [
      { label: "Place", value: number },
      { label: "Venue", value: venueName },
      { label: "Payment cleared", value: clearedOn },
      { label: "Programme", value: `Founding 25 · ${FOUNDING_PLACES} places` },
    ],
    terms: TERMS_LINES,
    signature: SIGNATURE,
  };
}

/** Every string a venue reads on the certificate, for the sweep. */
export function foundingCertificateProse(
  certificate: FoundingCertificate,
): string[] {
  if (certificate.state === "refused") return [certificate.reason];
  return [
    certificate.number,
    certificate.venueName,
    certificate.statement,
    ...certificate.record.flatMap((line) => [line.label, line.value]),
    ...certificate.terms,
    certificate.signature,
  ];
}

export const FOUNDING_CERTIFICATE_TERMS = TERMS_LINES;
