#!/usr/bin/env node
/**
 * venue-map-links.mjs — mints one unguessable link per account in a cohort and
 * writes the private token→account mapping (E13.16).
 *
 * WHY THIS IS A SEPARATE FILE FROM THE RENDER. signal-motion's render manifests
 * are `.strict()` and deliberately secret-free (`src/render/manifest-schema.ts`,
 * signal-motion/AGENTS.md: "Never log or serialize tokens, secrets, cookies,
 * credentials, signed URLs, or authorization headers"). A tracked URL is a
 * credential — it is the only thing standing between a cold email and somebody
 * else's private venue page — so it may not appear in a manifest, in props, in a
 * fixture or anywhere else inside that repository. The link layer therefore sits
 * BESIDE the render, never inside it. The two are joined by `pinId`, which is
 * already opaque and already public.
 *
 * WHAT THIS FILE HOLDS AND WHY IT IS PRIVATE. A token, and the account it was
 * minted for. That pair is exactly the thing that must not leak: the token will
 * be sent to one named business, so anyone holding this file can turn a URL back
 * into a venue. It is written under `private/`, which is gitignored with
 * exceptions only for README.md and venues.template.csv, and the tool refuses to
 * write anywhere else.
 *
 * WHAT IT DELIBERATELY DOES NOT HOLD. No venue name, no contact, no email, no
 * phone. `account_id` is the join key, as it is everywhere else in this
 * programme. The URL carries the token and nothing else — see THE URL SHAPE.
 *
 * TOKENS ARE MINTED ONCE AND NEVER RE-MINTED. Re-running this tool is additive:
 * an account that already has a token keeps it, byte for byte. That is not a
 * convenience, it is the whole safety property. E11.05-07 section 7.2 puts one
 * link per venue "for the life of the relationship", and D-013 point 4 runs four
 * touches over weeks — so a re-run that rotated tokens would silently 404 every
 * link already sitting in somebody's inbox. The run prints reused against minted
 * so the property is visible rather than assumed, and `assertTokensPreserved`
 * fails the write if a single stored token changed.
 *
 * THE URL SHAPE, AND AN UNRESOLVED CONFLICT.
 *
 *   this tool:            https://signalstudio.ie/v/<token>
 *   E11.05-07 sec 7.1:    https://signalstudio.ie/v/<venue-slug>-<token>
 *
 * Both are argued. The slug reads legitimate to the recipient and makes the
 * personalisation visible before the click. Against it: `consent_public_naming`
 * and `consent_map_publication` are `unknown` for all 219 accounts, and a slug in
 * a path puts a venue's name into browser history, proxy logs, CDN logs, referrer
 * headers and every chat thread the link is pasted into. This tool takes the
 * narrower position because it is the reversible one — a slug can be added to a
 * scheme that never had one; a name that has already been sent cannot be recalled
 * — and because a token that encodes a venue name is refused by
 * `assertNoVenueNameInUrls` below. The conflict is recorded in
 * evidence/E13.16-link-and-destination-contract.md as an open founder question,
 * not silently reconciled. See WORKFLOWS section 8.
 *
 * Commands
 *   --cohort=<n>           required. The cohort to mint links for.
 *   --out=<path>           default private/film-links-cohort-<n>.json
 *   --origin=<url>         default https://signalstudio.ie
 *   --media-base=<url>     optional. Absent means filmUrl is null, which is the
 *                          honest state: object storage is assumption A-3 and has
 *                          not been adopted.
 *   --renders=<dir>        optional. Resolve each account's poster frame by
 *                          finding the one *<pinId>*.png in this directory.
 *   --payload=<path>       default private/map-payload.json. Cross-checked when
 *                          its cohort matches.
 *
 *   node tools/venue-map-links.mjs --cohort=1
 */

import { randomBytes } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { guardText } from "./venue-export.mjs";
import { parseCsv, pinIdFor } from "./venue-map-export.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const PRIVATE_DIR = join(ROOT, "private");
const VENUES_CSV = join(PRIVATE_DIR, "venues.csv");
const COHORTS_JSON = join(PRIVATE_DIR, "cohort-convert.json");
const DEFAULT_PAYLOAD = join(PRIVATE_DIR, "map-payload.json");

/* ----------------------------------------------------------------- contract */

/** The file version. The E12 destination route parses against this literal, so
 *  changing it is a breaking change to the route and both sides move together. */
export const LINKS_SCHEMA_VERSION = "signal-film-links/v1";

/** Where the private venue page lives. One path segment, one token, no query
 *  string: E11.05-07 section 7.1 refuses a query string on this URL because a
 *  private page for a named business does not need its identifiers in something
 *  that gets forwarded, pasted and logged by every proxy on the way. */
export const LINK_PATH_PREFIX = "/v/";

export const DEFAULT_ORIGIN = "https://signalstudio.ie";

/**
 * Token length and alphabet.
 *
 * E11.05-07 section 7.1 sets the floor at 16 characters from a URL-safe
 * alphabet. 24 characters of base62 is about 143 bits, which is far past
 * anything a guessing attack reaches and still short enough to sit in a plain
 * founder email without looking like a payment link.
 */
export const TOKEN_LENGTH = 24;
const TOKEN_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const TOKEN_FIRST_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

/**
 * THE FIRST CHARACTER IS ALWAYS A LETTER, AND THAT IS LOAD-BEARING.
 *
 * `guardText` scans this file's rendered bytes for Irish phone numbers with
 * `\b0(8[3-9]|6[1-9]|21|1)[\s-]?\d{3}[\s-]?\d{3,4}\b`. A token that opened with a
 * zero and happened to continue in the shape of an Irish mobile number sits
 * immediately after a `/` in its URL and after a `"` in its JSON, both of which
 * are word boundaries — so a perfectly good token would be refused with a message
 * about personal data that nobody could act on. Forcing a letter first removes
 * every position where `\b0` can occur, because base62 contains no non-word
 * character to create a boundary mid-token.
 *
 * (Written without an example number on purpose: this file is itself swept, and a
 * comment that demonstrates the pattern trips the guard it is explaining.)
 *
 * Same reasoning as the `pin_` prefix in venue-map-export.mjs. A guard that
 * blocks a legitimate export is a guard somebody switches off.
 */
export const TOKEN_PATTERN = new RegExp(`^[A-Za-z][A-Za-z0-9]{${TOKEN_LENGTH - 1}}$`);

/**
 * Columns that must never exist, whatever a future caller thinks it needs.
 *
 * Duplicated from venue-export.mjs, which does not export its copy. Kept in the
 * same order and with the same entries so a diff between the two files is a
 * one-line read — the same choice venue-map-export.mjs made for the same reason.
 */
const FORBIDDEN_COLUMNS = [
  "contact_name", "contact", "name_of_contact", "email", "email_address", "e_mail",
  "phone", "telephone", "mobile", "postal_address", "address", "linkedin",
  "linkedin_url", "twitter_handle", "personal_email", "direct_dial", "first_name",
  "last_name", "surname",
];

/* ------------------------------------------------------------------- token */

/**
 * One token. Uniform over the alphabet, from the OS CSPRNG.
 *
 * Rejection sampling rather than `byte % 62`, which would make the first eight
 * characters of the alphabet 1.6 percent more likely than the rest. That bias is
 * not an attack in itself; taking it anyway is how a token generator ends up
 * being described as "roughly random" in a review it should have passed cleanly.
 *
 * NOT DERIVED FROM ANYTHING. Not the account id, not the venue name, not the
 * cohort, not the pin id, not the clock. E11.05-07 section 7.1 requires exactly
 * this: a derived token is a token anybody holding the derivation can compute for
 * every venue in the cohort, which is the enumeration the token exists to stop.
 * The test asserts two mints for the same account differ.
 */
export function mintToken(random = randomBytes) {
  const pick = (alphabet) => {
    const limit = 256 - (256 % alphabet.length);
    for (;;) {
      const byte = random(1)[0];
      if (byte < limit) return alphabet[byte % alphabet.length];
    }
  };
  let token = pick(TOKEN_FIRST_ALPHABET);
  while (token.length < TOKEN_LENGTH) token += pick(TOKEN_ALPHABET);
  return token;
}

/** Image formats the render profiles produce for a still. `.jpeg` is the review
 *  profiles' frame format and `.png` the masters'; both are legitimate posters
 *  and neither is chosen by this tool. */
const POSTER_EXTENSIONS = [".png", ".jpeg", ".jpg"];

/**
 * A pin id as it appears in a filename.
 *
 * signal-motion's `safeSegment` (src/render/filename.ts) lowercases every segment
 * and collapses everything outside `[a-z0-9-]` to a hyphen, so `pin_78864023a9a4`
 * is written to disk as `pin-78864023a9a4`.
 *
 * SEARCHING FOR THE UNDERSCORED FORM FINDS NOTHING, FOR EVERY VENUE, SILENTLY.
 * That is what the first version of the poster resolver below did. It is
 * duplicated here rather than imported because this file may not import from that
 * repository, and `posterCarriesPin` in signal-motion/src/render/poster.ts is the
 * other half of the same rule.
 */
export const pinSegment = (pinId) => pinId.toLowerCase().replace(/[^a-z0-9-]+/g, "-");

export const landingUrlFor = (origin, token) =>
  `${origin.replace(/\/+$/, "")}${LINK_PATH_PREFIX}${token}`;

/**
 * The film asset URL, or null.
 *
 * Null is the correct answer today and not a gap to be filled in with a
 * plausible hostname. E11.05-07 section 7.3 records object storage as
 * **assumption A-3**: Vercel Blob is recommended, it is not currently a
 * dependency of studio, and the plan's allowance has not been checked. Writing a
 * CDN hostname that nobody has provisioned would put a dead URL in a file whose
 * whole job is to be correct about where things are.
 *
 * Keyed to the TOKEN, per E11.05-07 section 7.3 — a file path built from the
 * venue name would be guessable and would defeat the token. Never sent to a
 * venue: the venue gets the page, never the file (section 8).
 */
export const filmUrlFor = (mediaBase, token) =>
  mediaBase ? `${mediaBase.replace(/\/+$/, "")}/${token}/film.mp4` : null;

/* ------------------------------------------------------------------- build */

/**
 * Build the link file for one cohort. Pure: takes parsed inputs, returns
 * `{ file, findings, warnings, counts }` and writes nothing.
 *
 * `existing` is the previously written file or null. Every fatal condition is
 * collected rather than thrown on first sight, so a run against a broken input
 * reports all of it at once instead of one problem per rerun.
 */
export function buildLinks(
  existing,
  cohort,
  {
    origin = DEFAULT_ORIGIN,
    mediaBase = null,
    today = new Date().toISOString().slice(0, 10),
    // Undefined means "this run is not resolving posters", which is different
    // from "this run resolved none". A run without --renders must leave a
    // thumbnail that a previous run found exactly where it was; a run WITH
    // --renders that no longer finds it clears it, because that is a re-resolution
    // and a path to a deleted file is a lie the file would keep telling.
    posterFor = undefined,
    random = randomBytes,
  } = {},
) {
  const findings = [];
  const warnings = [];

  const previous = new Map(
    (existing?.links ?? []).map((link) => [link.accountId, link]),
  );

  const links = [];
  const seenTokens = new Set();
  let reused = 0;
  let minted = 0;

  for (const member of cohort.venues) {
    const accountId = member.account_id;
    const before = previous.get(accountId);

    // THE STABILITY PROPERTY. An account that already has a token keeps it, and
    // keeps the date it was minted on, so `generatedOn` reads as "when this link
    // came into existence" rather than "when this file was last touched".
    const token = before?.token ?? mintToken(random);
    if (before?.token) reused += 1;
    else minted += 1;

    if (!TOKEN_PATTERN.test(token)) {
      findings.push({ where: accountId, kind: "token is not in the expected form" });
      continue;
    }
    if (seenTokens.has(token)) {
      findings.push({ where: accountId, kind: "token collision" });
      continue;
    }
    seenTokens.add(token);

    const landingUrl = landingUrlFor(origin, token);

    // AN ALREADY-SENT LINK IS NEVER INVALIDATED. `sentOn` is set by the operator
    // when the touch goes out. Once it is set, a change to the origin or the path
    // shape would break a URL that is already in somebody's inbox, so it stops
    // the run rather than quietly rewriting the file.
    if (before && before.sentOn && before.landingUrl !== landingUrl) {
      findings.push({
        where: accountId,
        kind: "landing URL would change for a link that has already been sent",
      });
      continue;
    }
    if (before && !before.sentOn && before.landingUrl !== landingUrl) {
      warnings.push(
        `${accountId}: landing URL changed. The token is unchanged and nothing has been sent `
        + `against this account, so this is safe today. It stops being safe the moment sentOn is set.`,
      );
    }

    links.push({
      accountId,
      pinId: pinIdFor(accountId),
      token,
      // The page, and the only URL that ever goes in an email.
      landingUrl,
      // The media file the page loads. Never sent to a venue.
      filmUrl: mediaBase ? filmUrlFor(mediaBase, token) : before?.filmUrl ?? null,
      // The poster frame on disk, or null when no render has produced one yet.
      // Missing shows as missing; it is never an empty string and never a guess.
      thumbnailPath: posterFor ? posterFor(pinIdFor(accountId)) : before?.thumbnailPath ?? null,
      generatedOn: before?.generatedOn ?? today,
      sentOn: before?.sentOn ?? null,
    });
  }

  // Accounts that were in the file and are not in the cohort any more. Their
  // links are KEPT: a token that has been sent stays resolvable whatever the
  // cohort file says today, and dropping the row would leave a live URL with
  // nothing behind it.
  const carried = [];
  for (const [accountId, link] of previous) {
    if (links.some((row) => row.accountId === accountId)) continue;
    carried.push(link);
    warnings.push(
      `${accountId}: in the link file but not in cohort ${cohort.number}. The link is kept, `
      + `because a token that may already have been sent must keep resolving.`,
    );
  }
  links.push(...carried);

  const file = {
    schemaVersion: LINKS_SCHEMA_VERSION,
    generatedFor: { cohort: cohort.number, size: links.length },
    origin: origin.replace(/\/+$/, ""),
    mediaBase: mediaBase ? mediaBase.replace(/\/+$/, "") : null,
    links,
  };

  const counts = {
    requested: cohort.venues.length,
    written: links.length,
    reused,
    minted,
    carried: carried.length,
    withFilmUrl: links.filter((link) => link.filmUrl !== null).length,
    withThumbnail: links.filter((link) => link.thumbnailPath !== null).length,
    sent: links.filter((link) => link.sentOn !== null).length,
  };

  return { file, findings, warnings, counts };
}

/* ------------------------------------------------------------------- guard */

/**
 * Every token that existed before this run still exists, unchanged.
 *
 * Stated as its own assertion rather than left as a property of the loop above,
 * because it is the one failure that is invisible until a venue clicks a link
 * that no longer resolves — by which point the film has been sent and the only
 * remedy is an apology.
 */
export function assertTokensPreserved(existing, file) {
  const findings = [];
  const after = new Map(file.links.map((link) => [link.accountId, link.token]));
  for (const link of existing?.links ?? []) {
    if (!after.has(link.accountId)) {
      findings.push({ where: link.accountId, kind: "an existing link was dropped" });
      continue;
    }
    if (after.get(link.accountId) !== link.token) {
      findings.push({ where: link.accountId, kind: "an existing token was re-minted" });
    }
  }
  return findings;
}

/**
 * No URL in the file contains a venue's name.
 *
 * The token cannot encode one by construction — it is base62 from the CSPRNG —
 * but the URL is assembled from an origin, a prefix and a token, and any of the
 * three could acquire a name in a future edit. This checks the assembled bytes
 * against the real names in the operational file, which is the only place that
 * question can actually be answered.
 *
 * Normalised the way a slug would be: lowercased, non-alphanumerics collapsed to
 * a hyphen, and also with them removed entirely, so both `glenmara-house` and
 * `glenmarahouse` are caught.
 *
 * THE OPAQUE PARTS ARE REMOVED BEFORE SCANNING, and that is not a weakening of
 * the check. A 24-character base62 token lowercases to 24 symbols drawn from 36,
 * so over 25 links and 219 candidate names it will contain a four-letter name by
 * accident often enough to matter — the first version of this function would have
 * failed a clean export roughly one run in four. A random string cannot leak a
 * name it never encoded, so the token and the pin digest are stripped and what
 * remains — the origin, the path prefix, the directory structure, the extension —
 * is scanned in full. That is exactly the part a future edit could put a slug in.
 *
 * Names of three characters or fewer are skipped after normalising: they are not
 * a leak, and matching them would flag a URL for containing three letters.
 * The finding never quotes the name it matched.
 */
export function assertNoVenueNameInUrls(file, venueRows) {
  const findings = [];
  const scannable = file.links.flatMap((link) => {
    // Lowercased BEFORE stripping, and the pin's filename form included, because
    // a render filename carries both in `safeSegment`'s flattened casing.
    const opaque = [link.token, link.pinId, link.pinId ? pinSegment(link.pinId) : null]
      .filter(Boolean)
      .map((value) => value.toLowerCase());
    return [link.landingUrl, link.filmUrl, link.thumbnailPath]
      .filter(Boolean)
      .map((url) =>
        opaque.reduce((text, part) => text.split(part).join("·"), url.toLowerCase()),
      );
  });
  for (const row of venueRows) {
    const name = (row.venue_name ?? "").trim();
    const hyphenated = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const squashed = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
    for (const candidate of [hyphenated, squashed]) {
      if (candidate.length < 4) continue;
      if (scannable.some((url) => url.includes(candidate))) {
        findings.push({ where: row.account_id, kind: "a venue name appears inside a URL" });
        break;
      }
    }
  }
  return findings;
}

/**
 * The fatal guard, modelled on venue-export.mjs and venue-map-export.mjs:
 * findings are `{where, kind}`, never carry the offending value, every one is
 * fatal, and a single finding means nothing is written at all.
 *
 * Four layers, because they catch different mistakes:
 *   structure   the file's own invariants — a malformed token, a duplicate, a
 *               link whose pin id does not match its account
 *   keys        a forbidden contact column arriving as an object key at any depth
 *   text        the serialised bytes, through the same regexes the CSV export uses
 *   names       a venue name inside a URL, checked against the operational file
 */
export function guardLinkFile(file, venueRows = []) {
  const findings = [];

  if (file.schemaVersion !== LINKS_SCHEMA_VERSION) {
    findings.push({ where: "schemaVersion", kind: `expected ${LINKS_SCHEMA_VERSION}` });
  }
  if (file.generatedFor.size !== file.links.length) {
    findings.push({
      where: "generatedFor.size",
      kind: `${file.generatedFor.size} declared against ${file.links.length} links`,
    });
  }

  const seenTokens = new Set();
  const seenAccounts = new Set();
  file.links.forEach((link, i) => {
    const where = `links[${i}]`;
    if (!TOKEN_PATTERN.test(link.token ?? "")) {
      findings.push({ where, kind: "token is not in the expected form" });
    }
    if (seenTokens.has(link.token)) findings.push({ where, kind: "duplicate token" });
    seenTokens.add(link.token);
    if (seenAccounts.has(link.accountId)) findings.push({ where, kind: "duplicate account" });
    seenAccounts.add(link.accountId);
    if (link.pinId !== pinIdFor(link.accountId)) {
      findings.push({ where, kind: "pin id does not match the account id" });
    }
    if (!link.landingUrl?.startsWith(`${file.origin}${LINK_PATH_PREFIX}`)) {
      findings.push({ where, kind: "landing URL is not on the declared origin" });
    }
    if (link.landingUrl?.includes("?")) {
      findings.push({ where, kind: "landing URL carries a query string" });
    }
    if (!link.landingUrl?.endsWith(link.token ?? "")) {
      findings.push({ where, kind: "landing URL does not end in the token" });
    }
    // The token is a credential. A local artifact path is written to logs, listed
    // in terminals and pasted into reviews, so it is keyed to the pin id instead.
    //
    // Compared case-insensitively because signal-motion's `safeSegment`
    // lowercases every filename segment: a token written into a render filename
    // arrives back here in lower case, and a case-sensitive `includes` would walk
    // straight past the leak it exists to catch.
    if (
      link.thumbnailPath && link.token
      && link.thumbnailPath.toLowerCase().includes(link.token.toLowerCase())
    ) {
      findings.push({ where, kind: "thumbnail path carries the token" });
    }
  });

  const walkKeys = (value, path) => {
    if (Array.isArray(value)) return value.forEach((v, i) => walkKeys(v, `${path}[${i}]`));
    if (value === null || typeof value !== "object") return;
    for (const [key, child] of Object.entries(value)) {
      if (FORBIDDEN_COLUMNS.includes(key.toLowerCase())) {
        findings.push({ where: `${path}.${key}`, kind: `forbidden contact field "${key}"` });
      }
      walkKeys(child, `${path}.${key}`);
    }
  };
  walkKeys(file, "file");

  const serialised = JSON.stringify(file, null, 2);
  for (const column of FORBIDDEN_COLUMNS) {
    if (new RegExp(`"${column}"\\s*:`, "i").test(serialised)) {
      findings.push({ where: "serialised file", kind: `forbidden contact field "${column}"` });
    }
  }
  const text = guardText(serialised, "film-links");
  for (const f of text.findings) findings.push({ where: `serialised line ${f.line}`, kind: f.kind });

  findings.push(...assertNoVenueNameInUrls(file, venueRows));

  return { findings, serialised, clean: findings.length === 0 };
}

/* -------------------------------------------------------------------- main */

function parseArgs(argv) {
  const args = {
    cohort: null,
    out: null,
    origin: DEFAULT_ORIGIN,
    mediaBase: null,
    renders: null,
    payload: DEFAULT_PAYLOAD,
  };
  const take = (arg, name) => {
    const match = new RegExp(`^--${name}=(.+)$`).exec(arg);
    return match ? match[1] : null;
  };
  for (const arg of argv) {
    const cohort = take(arg, "cohort");
    if (cohort) { args.cohort = Number(cohort); continue; }
    const out = take(arg, "out");
    if (out) { args.out = out; continue; }
    const origin = take(arg, "origin");
    if (origin) { args.origin = origin; continue; }
    const media = take(arg, "media-base");
    if (media) { args.mediaBase = media; continue; }
    const renders = take(arg, "renders");
    if (renders) { args.renders = renders; continue; }
    const payload = take(arg, "payload");
    if (payload) { args.payload = payload; continue; }
    if (arg.startsWith("--")) args.unknown = arg;
  }
  return args;
}

function refuse(findings) {
  console.error(`REFUSED. ${findings.length} finding(s). Nothing was written.`);
  findings.slice(0, 30).forEach((f) => console.error(`  ${f.where}: ${f.kind}`));
  if (findings.length > 30) console.error(`  ... and ${findings.length - 30} more`);
  process.exit(1);
}

const USAGE =
  "Usage: node tools/venue-map-links.mjs --cohort=<n> [--out=<path>] [--origin=<url>] "
  + "[--media-base=<url>] [--renders=<dir>] [--payload=<path>]";

/**
 * Resolve one account's poster frame from a render directory.
 *
 * The pipeline (E13.15) owns the render filename. This tool does not guess it: it
 * looks for the one image in the directory whose name contains the pin id, and
 * treats zero as "not rendered yet" and more than one as a fault. That is the
 * whole coupling between the two halves, and it is why the contract document
 * requires the pin id to appear in every personalised render filename.
 */
function posterResolver(rendersDir, findings) {
  // Undefined, not a resolver that always answers null: see buildLinks.
  if (!rendersDir) return undefined;
  const dir = resolve(rendersDir);
  if (!existsSync(dir)) {
    findings.push({ where: "--renders", kind: "directory does not exist" });
    return () => null;
  }
  const files = readdirSync(dir).filter((name) =>
    POSTER_EXTENSIONS.some((extension) => name.toLowerCase().endsWith(extension)),
  );
  return (pinId) => {
    const needle = pinSegment(pinId);
    const matches = files.filter((name) => name.toLowerCase().includes(needle));
    if (matches.length === 0) return null;
    if (matches.length > 1) {
      findings.push({ where: pinId, kind: `${matches.length} poster frames match one pin` });
      return null;
    }
    return join(dir, matches[0]).split(sep).join("/");
  };
}

function main(argv) {
  const args = parseArgs(argv);
  if (args.unknown) {
    console.error(`Unknown option ${args.unknown}.`);
    console.error(USAGE);
    process.exit(1);
  }
  if (args.cohort === null || !Number.isInteger(args.cohort)) {
    console.error("--cohort=<n> is required.");
    console.error(USAGE);
    process.exit(1);
  }

  const outPath = resolve(args.out ?? join(PRIVATE_DIR, `film-links-cohort-${args.cohort}.json`));
  // The mapping turns a URL back into a real business. It lives under private/,
  // which is gitignored, and the tool refuses to be pointed anywhere else.
  const inside = relative(PRIVATE_DIR, outPath);
  if (inside.startsWith("..") || resolve(PRIVATE_DIR, inside) !== outPath) {
    console.error("REFUSED. The link file maps tokens to real venues and must be written");
    console.error(`inside ${PRIVATE_DIR}, which is gitignored. Nothing was written.`);
    process.exit(1);
  }

  const venueRows = parseCsv(readFileSync(VENUES_CSV, "utf8"));
  const convert = JSON.parse(readFileSync(COHORTS_JSON, "utf8"));
  const cohort = (convert.cohorts ?? []).find((c) => c.number === args.cohort);
  if (!cohort) {
    const present = (convert.cohorts ?? []).map((c) => c.number).join(", ");
    refuse([{
      where: `--cohort=${args.cohort}`,
      kind:
        args.cohort === 4
          ? "cohort 4 does not exist. The ratified 45-minute ring holds 43 contactable "
            + "accounts, which fills one cohort and part of a second. See "
            + "venue-universe/03-UNIVERSE.md section 5"
          : `no cohort ${args.cohort} in cohort-convert.json (present: ${present || "none"})`,
    }]);
  }

  const existing = existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf8")) : null;
  if (existing && existing.schemaVersion !== LINKS_SCHEMA_VERSION) {
    refuse([{ where: outPath, kind: `existing file is ${existing.schemaVersion}, not ${LINKS_SCHEMA_VERSION}` }]);
  }

  const findings = [];
  const posterFor = posterResolver(args.renders, findings);

  const built = buildLinks(existing, cohort, {
    origin: args.origin,
    mediaBase: args.mediaBase,
    posterFor,
  });
  findings.push(...built.findings);
  findings.push(...assertTokensPreserved(existing, built.file));

  // The pin ids must be the ones the map payload actually renders, or the film a
  // venue watches and the link it clicks belong to two different venues.
  let payloadChecked = false;
  const payloadPath = resolve(args.payload);
  if (existsSync(payloadPath)) {
    const payload = JSON.parse(readFileSync(payloadPath, "utf8"));
    if (payload.generatedFor?.cohort === cohort.number) {
      payloadChecked = true;
      const inPayload = new Set(payload.pins.map((pin) => pin.pinId));
      for (const link of built.file.links) {
        if (!inPayload.has(link.pinId)) {
          findings.push({ where: link.accountId, kind: "pin id is not in the map payload" });
        }
      }
      for (const pin of payload.pins) {
        if (!built.file.links.some((link) => link.pinId === pin.pinId)) {
          findings.push({ where: pin.pinId, kind: "payload pin has no link" });
        }
      }
    }
  }

  if (findings.length) refuse(findings);

  const guard = guardLinkFile(built.file, venueRows);
  if (!guard.clean) refuse(guard.findings);

  writeFileSync(outPath, `${guard.serialised}\n`);

  const { counts } = built;
  console.log(`Wrote ${counts.written} links → ${outPath}`);
  console.log(`Schema: ${LINKS_SCHEMA_VERSION}. Cohort ${cohort.number}. Guard: clean.`);
  console.log("");
  console.log("Tokens");
  console.log(`  reused             ${counts.reused}`);
  console.log(`  minted             ${counts.minted}`);
  console.log(`  carried from a previous cohort run  ${counts.carried}`);
  console.log(
    counts.reused === 0
      ? "  First run for this cohort. Every token is new and nothing has been invalidated."
      : "  Every token that existed before this run still exists, unchanged.",
  );
  console.log("Destinations");
  console.log(`  landing URLs       ${counts.written}`);
  console.log(`  film asset URLs    ${counts.withFilmUrl}`);
  console.log(`  poster frames      ${counts.withThumbnail}`);
  console.log(`  marked sent        ${counts.sent}`);
  if (counts.withFilmUrl === 0) {
    console.log("  No film asset URL: object storage is assumption A-3 and is not adopted.");
    console.log("  Pass --media-base once it is. Absent is recorded as null, never as a guess.");
  }
  if (counts.withThumbnail === 0) {
    console.log("  No poster frame resolved. Pass --renders=<dir> after the render run.");
  }
  console.log("Cross-checks");
  console.log(`  pin ids match the map payload       ${payloadChecked ? "yes" : "not checked"}`);
  console.log("  venue name inside any URL           0");
  console.log("  query string on any landing URL     0");

  if (built.warnings.length) {
    console.log("");
    console.log("Warnings");
    built.warnings.forEach((w) => console.log(`  ${w}`));
  }
}

/**
 * Only dispatch when this file IS the command. Without this, importing it from a
 * test runs the CLI, hits the usage branch and exits the test process.
 */
const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) main(process.argv.slice(2));
