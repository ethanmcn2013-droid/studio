/**
 * The refusal set, once, as executable patterns.
 *
 * WHY THIS FILE EXISTS. `src/lib/venue-proposal.test.ts` (E12.09) proved the
 * pattern: the ban list lives as regular expressions in a test rather than as
 * prose in a comment, because a banned string written into a comment is a hit
 * in the commercial gate that sweeps the file, and a ban list that has to
 * exempt itself stops being read.
 *
 * E12.10, E12.11, E12.12 and E12.13 each need the same sweep. Four more copies
 * of the same forty-nine expressions is how two ban lists happen, and two ban
 * lists is how a term survives on one surface after being retired on another.
 * That is R-042 in one sentence. So the list is here, once, and every artefact
 * test imports it.
 *
 * WHAT IT IS NOT. It is not the authority. The authority is
 * `docs/execution/venue-edition-and-films/evidence/copy/prohibited-claims.v1.json`,
 * which is the venue-distributable list and the one the repository sweep reads.
 * This file is that list expressed as assertions a unit test can run against a
 * string in memory before it ever reaches a file. If the two disagree, the JSON
 * wins and this file is wrong.
 *
 * KNOWN DUPLICATION, RECORDED RATHER THAN HIDDEN. `venue-proposal.test.ts`
 * still carries its own inline copy of this list. It is founder-approved work
 * on a stacked branch and editing it to import this module would rewrite an
 * approved artefact to make a new one tidier. The consolidation is recommended
 * as a follow-up in `evidence/E12.10-E12.13-venue-artefacts.md` section 9.
 *
 * Rules are labelled by id alone. `prohibited-claims.v1.json` is the
 * description.
 *
 * Pure, no imports, client-safe.
 */

export type Refusal = readonly [RegExp, string];

/**
 * Every rule that binds a venue-facing or couple-facing string.
 *
 * `partner` and `member` are here because D-033 ratified R-042: the programme
 * is the Founding 25 and a venue in it is a founding venue. The term is retired,
 * not deprecated, so a new artefact that reintroduces it fails a test rather
 * than surviving to a review nine months later.
 */
export const VENUE_COPY_REFUSALS: readonly Refusal[] = [
  // P1 · permanence. The trap that has already caught this programme once.
  [/\bfor life\b/i, "P1"],
  [/\bforever\b/i, "P1"],
  [/\blifetime\b/i, "P1"],
  [/\bin perpetuity\b/i, "P1"],
  [/\bperpetual\b/i, "P1"],
  [/\bnever expires?\b/i, "P1"],
  [/\bguaranteed\b/i, "P1"],
  [/\balways be here\b/i, "P1"],

  // P2 · D-016. Nothing may state or imply legal or accounting review.
  [/\bsolicitor\b/i, "P2"],
  [/\baccountant\b/i, "P2"],
  [/\blegally (?:approved|reviewed)\b/i, "P2"],
  [/\bprofessionally drafted\b/i, "P2"],

  // P3 · data protection and security adjectives.
  [/\bGDPR\b/i, "P3"],
  [/\bfully compliant\b/i, "P3"],
  [/\bbank[- ]grade\b/i, "P3"],
  [/\bmilitary[- ]grade\b/i, "P3"],
  [/\bend[- ]to[- ]end encrypted\b/i, "P3"],

  // P5 · P6 · no entitlement number, no seat language, in either direction.
  [/\ballotment\b/i, "P5"],
  [/\bseat count\b/i, "P5"],
  [/\bper[- ]seat\b/i, "P5"],
  [/\bcodes remaining\b/i, "P5"],
  [/\bno seats\b/i, "P6"],

  // P8 · special-category data about people who consented to nothing.
  [/\bdietary\b/i, "P8"],
  [/\ballerg/i, "P8"],

  // P12 · every price is inclusive of VAT at the prevailing rate.
  [/\+\s*VAT\b/i, "P12"],
  [/\bex(?:cl)?\.?\s*VAT\b/i, "P12"],
  [/\bplus VAT\b/i, "P12"],

  // P13 · manufactured urgency and scarcity that can go stale.
  [/\bact now\b/i, "P13"],
  [/\blimited time\b/i, "P13"],
  [/\bwhile places last\b/i, "P13"],
  [/\bonly \d+ places? left\b/i, "P13"],
  [/\blast chance\b/i, "P13"],

  // D-027.3 · branding is the venue's name only.
  [/\bco[- ]branded\b/i, "D-027.3"],
  [/\byour logo\b/i, "D-027.3"],
  [/\bwelcome message\b/i, "D-027.3"],

  // D-001.4 · exactly three visible things, and no fourth.
  [/\bcouple separately consents\b/i, "D-001.4"],

  // BRAND.md section 3 · SaaS fluff.
  [/\bseamless(?:ly)?\b/i, "saas-fluff"],
  [/\beffortless(?:ly)?\b/i, "saas-fluff"],
  [/\bturnkey\b/i, "saas-fluff"],
  [/\bwhite[- ]label\b/i, "saas-fluff"],
  [/\bbest[- ]in[- ]class\b/i, "saas-fluff"],
  [/\bunlock\b/i, "saas-fluff"],

  // Banned programme terms. D-033 retired the first two outright.
  [/\bpartner\b/i, "banned-programme-term"],
  [/\bmember\b/i, "banned-programme-term"],
  [/\binvestor\b/i, "banned-programme-term"],
  [/\bexclusive\b/i, "banned-programme-term"],
  [/\bcertified\b/i, "banned-programme-term"],

  // BRAND.md section 3 · punctuation.
  [/—/, "em-dash"],
  [/!/, "exclamation"],
] as const;

/**
 * The bare-term rule, P7, which needs its own shape because it is conditional
 * rather than absolute. "18 months" is permitted only when the grace half of
 * the term travels with it in the same string.
 *
 * D-010 point 2 and D-022: 18 months from redemption, or 3 months past the
 * wedding, whichever is later. A couple with a two-year engagement who hears
 * the short version believes they lose access before the day, which is the one
 * outcome the term was designed to prevent.
 */
export const BARE_TERM_PATTERN = /\b(?:18|eighteen)\s*months?\b/i;

export const TERM_GRACE_PATTERN =
  /\b(?:3|three)\s*months?\s*(?:past|after|beyond)\b/i;

/** True when a string mentions the term without the grace rule beside it. */
export function hasBareAccessTerm(line: string): boolean {
  return BARE_TERM_PATTERN.test(line) && !TERM_GRACE_PATTERN.test(line);
}

/**
 * Sweep a set of lines and return every violation found, as
 * `{ rule, line }`. Returning rather than throwing lets a test report all
 * failures in one run instead of stopping at the first.
 */
export function sweepVenueCopy(lines: readonly string[]): Array<{
  rule: string;
  line: string;
}> {
  const found: Array<{ rule: string; line: string }> = [];
  for (const line of lines) {
    for (const [pattern, rule] of VENUE_COPY_REFUSALS) {
      if (pattern.test(line)) found.push({ rule, line });
    }
    if (hasBareAccessTerm(line)) found.push({ rule: "P7", line });
  }
  return found;
}
