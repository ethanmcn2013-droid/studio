/**
 * E07.10 · the distribution kit. One copy source of truth.
 *
 * Every word a couple reads comes from here, so it can be reviewed once,
 * frozen once (copy freeze is 2026-08-21) and swept by a string check. It was
 * previously a component-local `const` with a body and no subject, which is
 * why it could not be reviewed as copy at all.
 *
 * ## Rules these strings are bound by
 *
 *  - **D-027 point 3.** Venue branding at launch is the venue's NAME ONLY. No
 *    logo, no venue-written message. Nothing here may imply that a venue's
 *    logo or its own words appear in the couple's workspace, so the card
 *    carries a name and never a mark, and there is no free-text field for a
 *    venue to write into.
 *  - **D-020 · E09.02 §8.** No seats, no allotment, no codes remaining, no
 *    "X of your 60". A couple is a couple, not a unit of stock.
 *  - **D-009 point 3.** Never "for life", never "forever".
 *  - **D-016.** Nothing may state or imply legal, solicitor or accountant
 *    approval.
 *  - **D-021.** Prices are VAT-inclusive. No price appears in couple-facing
 *    copy at all: the couple pays nothing and saying so with a number invites
 *    the question of what it would otherwise cost.
 *  - **D-010.** Couple access runs 18 months from redemption **or** three
 *    months past the wedding, whichever is later. Saying only "18 months"
 *    would understate it for most couples, so both halves are stated.
 *  - **BRAND.md §3.** Declarative, plain English, no em dashes, no
 *    exclamation marks, no marketing register.
 *
 * Typography: real apostrophes (U+2019) and a middot for title separators.
 * These are checked by `copy.test.ts`.
 */

import { VENUE_EDITION_COUPLE_ACCESS_MONTHS } from "@/lib/venue-edition";

/**
 * Where a couple's link points.
 *
 * `signalstudio.ie/redeem/<CODE>` is a real route
 * (`studio/src/app/redeem/[code]/page.tsx`) which looks the code up and then
 * hands off to the app. The previous constant was
 * `signalstudio.ie/redeem/venue-welcome`, where `venue-welcome` was read as
 * the code — so every couple who followed it landed on the invalid-code page.
 *
 * Kept as a function rather than a constant because a link without a code is
 * not a welcome link, it is a dead end, and a constant invites exactly that.
 */
export function welcomeLinkFor(code: string, origin?: string): string {
  const base = (origin ?? STUDIO_ORIGIN_DEFAULT).replace(/\/+$/, "");
  return `${base}/redeem/${encodeURIComponent(code.trim().toUpperCase())}`;
}

/**
 * Read from the environment where one is set so preview builds link to
 * themselves, falling back to the canonical origin. Mirrors
 * `@/lib/product-urls`, which cannot be imported here without pulling its
 * whole URL contract into a module the print path also uses.
 */
const STUDIO_ORIGIN_DEFAULT = (
  process.env.NEXT_PUBLIC_STUDIO_URL ?? "https://signalstudio.ie"
).replace(/\/+$/, "");

export type InvitationCopyInput = {
  /** The venue's name. D-027 point 3: the name is the whole of the branding. */
  venueName: string;
  /** The couple's code. Plaintext, and never stored in a snapshot. */
  code: string;
  /** Override for previews and tests. */
  origin?: string;
};

export type InvitationEmail = {
  subject: string;
  body: string;
};

/**
 * The wording a venue sends from its own address.
 *
 * **No message leaves Signal Studio.** This is text for a person to paste into
 * their own email. The surface says so, and this comment exists so nobody
 * later mistakes the presence of a subject line for the presence of a mailer.
 */
export function invitationEmail(input: InvitationCopyInput): InvitationEmail {
  const link = welcomeLinkFor(input.code, input.origin);
  return {
    subject: `Your wedding planning workspace, from ${input.venueName}`,
    body: [
      `${input.venueName} has arranged a Signal Studio workspace for your wedding.`,
      "",
      "It is one place to plan. Notes for the thinking, Tasks for the doing, and a Timeline you can share with the people who need it. Plain English throughout.",
      "",
      "Open your link to start:",
      link,
      "",
      `Your access runs for ${VENUE_EDITION_COUPLE_ACCESS_MONTHS} months from the day you open it, or three months past your wedding, whichever is later.`,
      "",
      `${input.venueName} never sees your notes, your tasks or your plans. They see that you took this up, and nothing else.`,
    ].join("\n"),
  };
}

/** The two lines a person reads out over the phone or writes on a card. */
export function welcomeCardText(input: InvitationCopyInput): string {
  return [
    `${input.venueName} · Signal Studio`,
    `Your wedding planning workspace: ${welcomeLinkFor(input.code, input.origin)}`,
    `Code: ${input.code.trim().toUpperCase()}`,
  ].join("\n");
}

export type WelcomeCardCopy = {
  eyebrow: string;
  headline: string;
  body: string;
  codeLabel: string;
  fine: string;
};

/**
 * The card's words, separate from the card's markup.
 *
 * Split apart so the decision sweep runs over prose rather than over HTML.
 * Scanning the document as a whole made `<!doctype html>` register as an
 * exclamation mark, which is the kind of false positive that gets a
 * copy check switched off.
 */
export function welcomeCardCopy(input: InvitationCopyInput): WelcomeCardCopy {
  return {
    eyebrow: `Compliments of ${input.venueName}`,
    headline: "Your wedding planning workspace is ready.",
    body: "One place to plan. Notes for the thinking, Tasks for the doing, and a Timeline you can share with the people who need it.",
    codeLabel: "Code",
    fine: `Your access runs for ${VENUE_EDITION_COUPLE_ACCESS_MONTHS} months from the day you open it, or three months past your wedding, whichever is later. ${input.venueName} never sees your notes, your tasks or your plans.`,
  };
}

/**
 * The printable welcome card, as a complete standalone HTML document.
 *
 * "Printable" previously meant two lines on the clipboard, which is not an
 * artefact. This returns a document a browser can print to A6 or hand to a
 * printer, sized for a card that sits in a wedding folder.
 *
 * Self-contained by design: no external font, no image, no script. It is
 * opened in a sandboxed iframe by the Access panel and printed from there, so
 * anything it referenced would be a request the surface cannot make.
 *
 * The venue appears as a name set in the page's own type. There is no logo
 * slot, and there is no field a venue can write its own message into, because
 * D-027 point 3 says the name is the whole of the branding at launch.
 */
export function welcomeCardHtml(input: InvitationCopyInput): string {
  const link = welcomeLinkFor(input.code, input.origin);
  const copy = welcomeCardCopy(input);
  const venue = escapeHtml(input.venueName);
  const code = escapeHtml(input.code.trim().toUpperCase());
  const href = escapeHtml(link);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${venue} &middot; Signal Studio welcome card</title>
<style>
  @page { size: A6 landscape; margin: 12mm; }
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #14161a;
    font-family: Georgia, "Iowan Old Style", "Times New Roman", serif;
    font-feature-settings: "kern" 1, "liga" 1;
    text-rendering: optimizeLegibility;
  }
  .card {
    max-width: 62ch;
    margin: 0 auto;
    padding: 28px 32px 32px;
  }
  .venue {
    margin: 0 0 22px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5b6270;
  }
  h1 {
    margin: 0 0 14px;
    font-size: 25px;
    line-height: 1.24;
    font-weight: 600;
    hyphens: none;
  }
  p {
    margin: 0 0 14px;
    font-size: 14px;
    line-height: 1.45;
    color: #34383f;
  }
  .link {
    margin: 20px 0 8px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    font-size: 13px;
    line-height: 1.4;
    word-break: break-all;
    color: #14161a;
  }
  .code {
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
    font-size: 15px;
    letter-spacing: 0.08em;
    font-variant-numeric: tabular-nums lining-nums;
  }
  .fine {
    margin: 22px 0 0;
    padding-top: 14px;
    border-top: 1px solid #dfe2e7;
    font-size: 11.5px;
    line-height: 1.5;
    color: #5b6270;
  }
  @media print {
    .card { padding: 0; }
    p, h1 { orphans: 2; widows: 2; }
  }
</style>
</head>
<body>
  <div class="card">
    <p class="venue">${escapeHtml(copy.eyebrow)}</p>
    <h1>${escapeHtml(copy.headline)}</h1>
    <p>${escapeHtml(copy.body)}</p>
    <p class="link"><a href="${href}">${href}</a></p>
    <p>${escapeHtml(copy.codeLabel)}: <span class="code">${code}</span></p>
    <p class="fine">${escapeHtml(copy.fine)}</p>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Words that may never appear in couple-facing or venue-facing invitation
 * copy, with the decision that bans each one.
 *
 * `copy.test.ts` runs every string this module produces through this list.
 * The commercial gate (`evidence/gates/commercial.json` item 5) requires a
 * sweep returning zero hits for "allotment"; this is that sweep, run on every
 * build rather than by hand.
 */
export const BANNED_INVITATION_TERMS: ReadonlyArray<{
  pattern: RegExp;
  decision: string;
}> = [
  { pattern: /\ballotment\b/i, decision: "D-020" },
  { pattern: /\bseats?\b/i, decision: "D-020" },
  { pattern: /\bcodes? remaining\b/i, decision: "D-020" },
  { pattern: /\blicence[s]? allotted\b/i, decision: "D-020" },
  { pattern: /\bfor life\b/i, decision: "D-009 point 3" },
  { pattern: /\bforever\b/i, decision: "D-009 point 3" },
  { pattern: /\bsolicitor\b/i, decision: "D-016" },
  { pattern: /\blegally (approved|reviewed)\b/i, decision: "D-016" },
  { pattern: /\bunlimited couples\b/i, decision: "D-020 · fair use is not a promise of volume" },
];

/** Front-facing register rules from BRAND.md §3 that a regex can decide. */
export const BANNED_INVITATION_GLYPHS: ReadonlyArray<{
  pattern: RegExp;
  rule: string;
}> = [
  { pattern: /—/, rule: "BRAND.md §3: em dashes are banned in front-facing copy" },
  { pattern: /!/, rule: "BRAND.md §3: no exclamation marks anywhere" },
  { pattern: /\bAI\b/, rule: "BRAND.md §3: AI-marketing register" },
  { pattern: /\bseamless\b/i, rule: "BRAND.md §3: SaaS fluff" },
  { pattern: /\bsupercharge\b/i, rule: "BRAND.md §3: SaaS fluff" },
];

export type CopyViolation = { term: string; basis: string };

/** Every rule above, run over one string. Empty means the string is clean. */
export function scanInvitationCopy(text: string): CopyViolation[] {
  const violations: CopyViolation[] = [];
  for (const { pattern, decision } of BANNED_INVITATION_TERMS) {
    const hit = text.match(pattern);
    if (hit) violations.push({ term: hit[0], basis: decision });
  }
  for (const { pattern, rule } of BANNED_INVITATION_GLYPHS) {
    const hit = text.match(pattern);
    if (hit) violations.push({ term: hit[0], basis: rule });
  }
  return violations;
}
