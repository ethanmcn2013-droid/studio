import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { VENUE_EDITION_COUPLE_ACCESS_MONTHS } from "@/lib/venue-edition";
import {
  invitationEmail,
  scanInvitationCopy,
  welcomeCardCopy,
  welcomeCardHtml,
  welcomeCardText,
  welcomeLinkFor,
} from "./copy";

const INPUT = {
  venueName: "Glenmara House",
  code: "SIG-ABCD-EFGH",
  origin: "https://signalstudio.ie",
};

/**
 * Every string this module puts in front of a person.
 *
 * Prose only. The card's markup is checked separately: sweeping the whole HTML
 * document made `<!doctype html>` read as an exclamation mark, and a copy
 * check that cries wolf is a copy check somebody switches off.
 */
function allCopy(): Array<{ where: string; text: string }> {
  const email = invitationEmail(INPUT);
  const card = welcomeCardCopy(INPUT);
  return [
    { where: "email subject", text: email.subject },
    { where: "email body", text: email.body },
    { where: "card text", text: welcomeCardText(INPUT) },
    { where: "card eyebrow", text: card.eyebrow },
    { where: "card headline", text: card.headline },
    { where: "card body", text: card.body },
    { where: "card fine print", text: card.fine },
  ];
}

test("the welcome link carries the code and resolves to the real redeem route", () => {
  assert.equal(
    welcomeLinkFor("SIG-ABCD-EFGH", "https://signalstudio.ie"),
    "https://signalstudio.ie/redeem/SIG-ABCD-EFGH",
  );
});

test("the welcome link never ships without a code", () => {
  // The defect this replaces: a constant `/redeem/venue-welcome`, where
  // `venue-welcome` was read as the code, so every couple hit invalid-code.
  const link = welcomeLinkFor(INPUT.code);
  assert.doesNotMatch(link, /venue-welcome/);
  assert.match(link, /\/redeem\/SIG-ABCD-EFGH$/);
});

test("the link normalises case and trims, so a copied code still works", () => {
  assert.equal(
    welcomeLinkFor("  sig-abcd-efgh  ", "https://signalstudio.ie/"),
    "https://signalstudio.ie/redeem/SIG-ABCD-EFGH",
  );
});

test("the email has a subject as well as a body", () => {
  const email = invitationEmail(INPUT);
  assert.ok(email.subject.trim().length > 0, "a body with no subject is not an email");
  assert.match(email.subject, /Glenmara House/);
  assert.match(email.body, /https:\/\/signalstudio\.ie\/redeem\/SIG-ABCD-EFGH/);
});

test("every venue-facing and couple-facing string passes the decision sweep", () => {
  for (const { where, text } of allCopy()) {
    const violations = scanInvitationCopy(text);
    assert.deepEqual(
      violations,
      [],
      `${where}: ${violations.map((v) => `${v.term} (${v.basis})`).join(", ")}`,
    );
  }
});

test("the commercial gate's allotment sweep returns zero hits", () => {
  // evidence/gates/commercial.json item 5 requires exactly this, with a file
  // list and an output. This is that sweep, run on every build.
  for (const { where, text } of allCopy()) {
    assert.doesNotMatch(text, /allotment/i, where);
  }
});

test("D-009 point 3: the access term is never described as permanent", () => {
  for (const { where, text } of allCopy()) {
    assert.doesNotMatch(text, /for life|forever|permanent/i, where);
  }
});

test("D-010: the access term states both halves, not only the 18 months", () => {
  const body = invitationEmail(INPUT).body;
  assert.match(body, new RegExp(`${VENUE_EDITION_COUPLE_ACCESS_MONTHS} months`));
  assert.match(body, /three months past your wedding, whichever is later/);
});

test("D-021: no price appears in couple-facing copy", () => {
  for (const { where, text } of allCopy()) {
    assert.doesNotMatch(text, /€|\bEUR\b|\bVAT\b/i, where);
  }
});

test("D-027 point 3: the venue appears as a name, with no logo and no venue message", () => {
  const html = welcomeCardHtml(INPUT);
  assert.match(html, /Glenmara House/);
  assert.doesNotMatch(html, /<img|logo|\.svg|\.png/i, "no mark may be implied");
  assert.doesNotMatch(
    html,
    /your message|custom message|venue message/i,
    "no venue-written words",
  );
});

test("the printable card renders exactly the card copy, so the two cannot drift", () => {
  const html = welcomeCardHtml(INPUT);
  const copy = welcomeCardCopy(INPUT);
  for (const line of [copy.eyebrow, copy.headline, copy.body, copy.fine]) {
    assert.ok(html.includes(line), `card markup is missing: ${line}`);
  }
});

test("the printable card is a complete self-contained document", () => {
  const html = welcomeCardHtml(INPUT);
  assert.match(html, /^<!doctype html>/i);
  assert.match(html, /@page\s*\{/, "it must be laid out for paper, not for a tab");
  assert.doesNotMatch(html, /<script/i, "no script in a printed artefact");
  assert.doesNotMatch(
    html,
    /https?:\/\/(?!signalstudio\.ie)/,
    "no external font, image or stylesheet request",
  );
});

test("the printable card escapes a venue name that contains markup", () => {
  const html = welcomeCardHtml({
    ...INPUT,
    venueName: '<script>alert("x")</script>',
  });
  assert.doesNotMatch(html, /<script>alert/);
  assert.match(html, /&lt;script&gt;/);
});

test("no front-facing string carries an em dash or an exclamation mark", () => {
  for (const { where, text } of allCopy()) {
    assert.doesNotMatch(text, /—/, `${where}: BRAND.md §3 bans em dashes`);
    assert.doesNotMatch(text, /!/, `${where}: BRAND.md §3 bans exclamation marks`);
  }
});

test("the privacy promise is stated to the couple in the couple's own terms", () => {
  const body = invitationEmail(INPUT).body;
  assert.match(body, /never sees your notes, your tasks or your plans/);
});

/**
 * D-032 R5. The account-review tree is the most venue-facing artefact in the
 * programme, and until this change it was the only major one the copy sweep
 * did not read. It is now listed surface by surface in
 * `prohibited-claims.v1.json`, because that file's reader takes literal paths
 * and not globs.
 *
 * A literal list rots: a new panel is a new venue-facing surface that nothing
 * sweeps. So the list is checked against the directory here rather than
 * trusted. The permanent fix is glob expansion in the reader, which lives in
 * another package's column.
 */
const STUDIO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../..",
);
const ACCOUNT_REVIEW_DIR = "src/app/hq/account-review";

function copySurfacePaths(): Set<string> {
  const claims = JSON.parse(
    readFileSync(
      path.join(
        STUDIO_ROOT,
        "docs/execution/venue-edition-and-films/evidence/copy/prohibited-claims.v1.json",
      ),
      "utf8",
    ),
  ) as { surfaces: { enforced: Array<{ path: string }>; tracked: Array<{ path: string }> } };
  return new Set(
    [...claims.surfaces.enforced, ...claims.surfaces.tracked].map((s) => s.path),
  );
}

function sourceFilesUnder(relDir: string): string[] {
  const out: string[] = [];
  const walk = (rel: string) => {
    for (const entry of readdirSync(path.join(STUDIO_ROOT, rel), {
      withFileTypes: true,
    })) {
      const next = `${rel}/${entry.name}`;
      if (entry.isDirectory()) walk(next);
      else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
        out.push(next);
      }
    }
  };
  walk(relDir);
  return out.sort();
}

test("every account-review source file is on the copy sweep's surface list", () => {
  const listed = copySurfacePaths();
  const missing = sourceFilesUnder(ACCOUNT_REVIEW_DIR).filter(
    (file) => !listed.has(file),
  );
  assert.deepEqual(
    missing,
    [],
    `these venue-facing files are swept by nothing: ${missing.join(", ")}. ` +
      "Add them to prohibited-claims.v1.json surfaces.tracked.",
  );
});

test("the surface list carries no account-review path that has been deleted", () => {
  const onDisk = new Set(sourceFilesUnder(ACCOUNT_REVIEW_DIR));
  const stale = [...copySurfacePaths()].filter(
    (p) => p.startsWith(`${ACCOUNT_REVIEW_DIR}/`) && !onDisk.has(p),
  );
  assert.deepEqual(stale, [], `listed but absent: ${stale.join(", ")}`);
});

test("the sweep actually catches a violation rather than passing everything", () => {
  const violations = scanInvitationCopy(
    "Your allotment of seats lasts forever, reviewed by our solicitor.",
  );
  const terms = violations.map((v) => v.term.toLowerCase());
  assert.ok(terms.includes("allotment"));
  assert.ok(terms.includes("seats"));
  assert.ok(terms.includes("forever"));
  assert.ok(terms.includes("solicitor"));
});
