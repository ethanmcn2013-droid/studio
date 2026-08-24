// venue-map-links.test.mjs — tests on the one property in E13.16 whose failure
// is not annoying but unrecoverable:
//
//   A token, once minted, is never minted again for that account.
//
// Everything else in the link layer can be fixed by re-running a tool. This
// cannot. D-013 point 4 runs four touches over weeks against one URL per venue
// (E11.05-07 section 7.2), so a re-run that rotated a token would 404 a link
// already sitting in a venue's inbox, and the only remedy after that is an
// apology. Every test below exists because a plausible edit to the generator
// breaks that property quietly.
//
// Plus the guard, because a mapping file that turns a URL back into a real
// business is the one file in this tree that must never carry a venue name.
//
//   node --test tools/venue-map-links.test.mjs
//
// Pure functions only. Nothing here touches the network, reads private/ or
// writes to the tree.

import test from "node:test";
import assert from "node:assert/strict";

import {
  assertNoVenueNameInUrls,
  assertTokensPreserved,
  buildLinks,
  DEFAULT_ORIGIN,
  filmUrlFor,
  guardLinkFile,
  landingUrlFor,
  LINKS_SCHEMA_VERSION,
  LINK_PATH_PREFIX,
  mintToken,
  pinSegment,
  TOKEN_LENGTH,
  TOKEN_PATTERN,
} from "./venue-map-links.mjs";
import { pinIdFor } from "./venue-map-export.mjs";

/* --------------------------------------------------------------- fixtures */

const cohortOf = (n, count) => ({
  number: n,
  size: count,
  short: 0,
  venues: Array.from({ length: count }, (_, i) => ({
    position: i + 1,
    account_id: `VEN-${String(i + 1).padStart(4, "0")}`,
  })),
});

const build = (existing, cohort, options = {}) =>
  buildLinks(existing, cohort, { today: "2026-08-03", ...options });

/* ------------------------------------------------------------- the token */

test("a token is high-entropy, URL-safe, and starts with a letter", () => {
  for (let i = 0; i < 200; i += 1) {
    const token = mintToken();
    assert.equal(token.length, TOKEN_LENGTH);
    assert.match(token, TOKEN_PATTERN);
    // The leading letter is load-bearing: it removes every position where the
    // export guard's Irish-landline pattern (\b0(8[3-9]|6[1-9]|21|1)...) could
    // match a token sitting after a "/" or a '"'. A token beginning 0871234567
    // would refuse a legitimate export with a message about personal data.
    assert.ok(/^[A-Za-z]/.test(token));
  }
});

test("a token is not derived from anything — two mints for one account differ", () => {
  // The whole point of the token is that holding one, or holding the account id
  // space, does not let you compute the other twenty-four in the cohort.
  const cohort = cohortOf(1, 1);
  const first = build(null, cohort).file.links[0].token;
  const second = build(null, cohort).file.links[0].token;
  assert.notEqual(first, second, "a derived token can be computed for every venue in the cohort");
});

test("tokens do not collide across a run far larger than any real cohort", () => {
  const tokens = new Set();
  for (let i = 0; i < 5000; i += 1) tokens.add(mintToken());
  assert.equal(tokens.size, 5000);
});

/* --------------------------------------------------------- the stability */

test("re-running yields the SAME token for an account that already has one", () => {
  const cohort = cohortOf(1, 25);
  const first = build(null, cohort);
  const second = build(first.file, cohort);

  assert.equal(first.counts.minted, 25);
  assert.equal(first.counts.reused, 0);
  assert.equal(second.counts.minted, 0, "a re-run must mint nothing");
  assert.equal(second.counts.reused, 25);

  const before = new Map(first.file.links.map((l) => [l.accountId, l.token]));
  for (const link of second.file.links) {
    assert.equal(link.token, before.get(link.accountId), `${link.accountId} was re-minted`);
  }
  assert.deepEqual(assertTokensPreserved(first.file, second.file), []);
});

test("the minted date is preserved too, so it means when the link came into existence", () => {
  const cohort = cohortOf(1, 3);
  const first = build(null, cohort, { today: "2026-08-03" });
  const second = build(first.file, cohort, { today: "2026-09-14" });
  for (const link of second.file.links) {
    assert.equal(link.generatedOn, "2026-08-03");
  }
});

test("a run is additive: a new account is minted, every existing one is untouched", () => {
  const first = build(null, cohortOf(1, 10));
  const second = build(first.file, cohortOf(1, 12));

  assert.equal(second.counts.reused, 10);
  assert.equal(second.counts.minted, 2);
  assert.equal(second.counts.written, 12);
  assert.deepEqual(assertTokensPreserved(first.file, second.file), []);
});

test("an account that leaves the cohort keeps its link rather than losing it", () => {
  // A token that may already have been sent has to keep resolving whatever the
  // cohort file says today. Dropping the row leaves a live URL with nothing
  // behind it, which is the same failure as re-minting.
  const first = build(null, cohortOf(1, 10));
  const second = build(first.file, cohortOf(1, 8));

  assert.equal(second.counts.written, 10);
  assert.equal(second.counts.carried, 2);
  assert.deepEqual(assertTokensPreserved(first.file, second.file), []);
  assert.ok(second.warnings.some((w) => w.includes("must keep resolving")));
});

test("assertTokensPreserved catches a re-mint and a drop, which the counts alone would not", () => {
  const cohort = cohortOf(1, 3);
  const first = build(null, cohort);

  const reminted = JSON.parse(JSON.stringify(first.file));
  reminted.links[1].token = mintToken();
  const remint = assertTokensPreserved(first.file, reminted);
  assert.equal(remint.length, 1);
  assert.match(remint[0].kind, /re-minted/);

  const dropped = JSON.parse(JSON.stringify(first.file));
  dropped.links.splice(0, 1);
  const drop = assertTokensPreserved(first.file, dropped);
  assert.equal(drop.length, 1);
  assert.match(drop[0].kind, /dropped/);
});

/* ------------------------------------------------------- the sent barrier */

test("a link that has been sent may not have its URL changed", () => {
  const cohort = cohortOf(1, 2);
  const first = build(null, cohort);
  first.file.links[0].sentOn = "2026-08-10";

  const moved = build(first.file, cohort, { origin: "https://signal.studio" });
  assert.equal(moved.findings.length, 1);
  assert.match(moved.findings[0].kind, /already been sent/);
});

test("before anything is sent, a URL change is a warning and the token still survives", () => {
  const cohort = cohortOf(1, 2);
  const first = build(null, cohort);
  const moved = build(first.file, cohort, { origin: "https://signal.studio" });

  assert.deepEqual(moved.findings, []);
  assert.equal(moved.counts.minted, 0, "changing the origin must not mint a new token");
  assert.ok(moved.warnings.some((w) => w.includes("stops being safe")));
  assert.deepEqual(assertTokensPreserved(first.file, moved.file), []);
});

/* ----------------------------------------------------------- the URL shape */

test("the landing URL is origin + /v/ + token, with no query string and no venue name", () => {
  const link = build(null, cohortOf(1, 1)).file.links[0];
  assert.equal(link.landingUrl, `${DEFAULT_ORIGIN}${LINK_PATH_PREFIX}${link.token}`);
  assert.ok(!link.landingUrl.includes("?"), "identifiers in a query string get forwarded and logged");
  assert.equal(landingUrlFor("https://signalstudio.ie/", "Abc"), "https://signalstudio.ie/v/Abc");
});

test("the pin id is the map payload's, so the film and the link are the same venue", () => {
  const link = build(null, cohortOf(1, 1)).file.links[0];
  assert.equal(link.pinId, pinIdFor(link.accountId));
  assert.match(link.pinId, /^pin_[0-9a-f]{12}$/);
});

test("an absent film URL is null, never a plausible hostname", () => {
  // Object storage is assumption A-3 and has not been adopted. Missing shows as
  // missing; a guessed CDN hostname is a dead URL in the file that says where
  // things are.
  assert.equal(filmUrlFor(null, "Abc"), null);
  assert.equal(build(null, cohortOf(1, 1)).file.links[0].filmUrl, null);
  const hosted = build(null, cohortOf(1, 1), { mediaBase: "https://blob.example/v/" });
  assert.equal(hosted.file.links[0].filmUrl.startsWith("https://blob.example/v/"), true);

  // And a later run that does not name a media base leaves it alone, for the
  // same reason a run without --renders leaves a thumbnail alone.
  const later = build(hosted.file, cohortOf(1, 1));
  assert.equal(later.file.links[0].filmUrl, hosted.file.links[0].filmUrl);
});

test("a run that is not resolving posters leaves the ones a previous run found", () => {
  // Without --renders the tool is not answering the poster question, which is
  // not the same as answering it "none". A run to add one new account must not
  // blank twenty-five thumbnails on its way past.
  const cohort = cohortOf(1, 3);
  const resolved = build(null, cohort, { posterFor: (pinId) => `out/${pinId}.png` });
  const later = build(resolved.file, cohort);
  assert.equal(later.counts.withThumbnail, 3);
  for (const link of later.file.links) assert.equal(link.thumbnailPath, `out/${link.pinId}.png`);

  // With --renders and nothing found, it clears: that is a re-resolution, and a
  // path to a deleted file is a lie the file would keep telling.
  const cleared = build(resolved.file, cohort, { posterFor: () => null });
  assert.equal(cleared.counts.withThumbnail, 0);
});

test("an unrendered poster is null, and a resolved one is keyed to the pin, not the token", () => {
  const bare = build(null, cohortOf(1, 1)).file.links[0];
  assert.equal(bare.thumbnailPath, null);

  const withPoster = build(null, cohortOf(1, 1), {
    posterFor: (pinId) => `out/venue-films/cohort-1/film__${pinId}__r001.png`,
  });
  const link = withPoster.file.links[0];
  assert.ok(link.thumbnailPath.includes(link.pinId));
  assert.ok(!link.thumbnailPath.includes(link.token), "a token in a path is a credential in a log line");
  assert.deepEqual(guardLinkFile(withPoster.file, []).findings, []);
});

/* ---------------------------------------------------------------- the guard */

test("a clean file passes the guard", () => {
  const built = build(null, cohortOf(1, 25));
  const guard = guardLinkFile(built.file, []);
  assert.equal(guard.clean, true, JSON.stringify(guard.findings));
});

test("the guard catches a token in a thumbnail path", () => {
  const built = build(null, cohortOf(1, 1));
  built.file.links[0].thumbnailPath = `out/${built.file.links[0].token}.png`;
  const guard = guardLinkFile(built.file, []);
  assert.equal(guard.clean, false);
  assert.ok(guard.findings.some((f) => f.kind.includes("carries the token")));
});

test("the guard catches a duplicate token, a foreign origin and a query string", () => {
  const built = build(null, cohortOf(1, 2));
  built.file.links[1].token = built.file.links[0].token;
  built.file.links[1].landingUrl = `https://elsewhere.example/v/${built.file.links[0].token}?venue=1`;
  const guard = guardLinkFile(built.file, []);
  assert.equal(guard.clean, false);
  assert.ok(guard.findings.some((f) => f.kind === "duplicate token"));
  assert.ok(guard.findings.some((f) => f.kind.includes("not on the declared origin")));
  assert.ok(guard.findings.some((f) => f.kind.includes("query string")));
});

test("the guard catches a pin id that does not belong to its account", () => {
  const built = build(null, cohortOf(1, 2));
  built.file.links[0].pinId = built.file.links[1].pinId;
  const guard = guardLinkFile(built.file, []);
  assert.equal(guard.clean, false);
  assert.ok(guard.findings.some((f) => f.kind.includes("does not match the account")));
});

test("the guard carries venue-export's fatal PII rules — a contact field or an email stops the write", () => {
  const withField = build(null, cohortOf(1, 1));
  withField.file.links[0].email = "bookings@somewhere.ie";
  const a = guardLinkFile(withField.file, []);
  assert.equal(a.clean, false);
  assert.ok(a.findings.some((f) => f.kind.includes('forbidden contact field "email"')));

  const withValue = build(null, cohortOf(1, 1));
  withValue.file.note = "bookings@somewhere.ie";
  const b = guardLinkFile(withValue.file, []);
  assert.equal(b.clean, false);
  assert.ok(b.findings.some((f) => f.kind === "email address"));
});

test("the guard never echoes the value it found", () => {
  const secret = "bookings@somewhere.ie";
  const built = build(null, cohortOf(1, 1));
  built.file.note = secret;
  const guard = guardLinkFile(built.file, []);
  assert.ok(!JSON.stringify(guard.findings).includes(secret),
    "a report that quotes the leaked address has leaked it again");
});

/* ------------------------------------------------------ venue names in URLs */

test("a venue name in a URL is caught, wherever in the URL it sits", () => {
  const rows = [{ account_id: "VEN-0001", venue_name: "Glenmara House" }];
  const built = build(null, cohortOf(1, 1));

  assert.deepEqual(assertNoVenueNameInUrls(built.file, rows), [], "a token-only URL is clean");

  const slugged = JSON.parse(JSON.stringify(built.file));
  slugged.links[0].landingUrl = `${DEFAULT_ORIGIN}/v/glenmara-house-${slugged.links[0].token}`;
  assert.equal(assertNoVenueNameInUrls(slugged, rows).length, 1);

  const squashed = JSON.parse(JSON.stringify(built.file));
  squashed.links[0].thumbnailPath = `out/glenmarahouse/poster.png`;
  assert.equal(assertNoVenueNameInUrls(squashed, rows).length, 1);
});

test("a pin id is matched in the form a render filename actually carries", () => {
  // signal-motion's safeSegment lowercases every filename segment and collapses
  // everything outside [a-z0-9-] to a hyphen, so pin_78864023a9a4 lands on disk
  // as pin-78864023a9a4. Searching for the underscored form finds nothing, for
  // every venue in the cohort, with no error anywhere.
  assert.equal(pinSegment("pin_78864023a9a4"), "pin-78864023a9a4");
  assert.equal(pinSegment("PIN_78864023A9A4"), "pin-78864023a9a4");

  const built = build(null, cohortOf(1, 1), {
    posterFor: (pinId) =>
      `out/limerick-first/1/signal-motion__limerick-map-v1__${pinSegment(pinId)}`
      + `__limerickfirstmap-16x9__review-16x9-v1__r001__f0360.jpeg`,
  });
  const link = built.file.links[0];
  assert.ok(link.thumbnailPath.includes(pinSegment(link.pinId)));
  assert.ok(!link.thumbnailPath.includes(link.pinId), "the raw form is not what is on disk");
  assert.deepEqual(guardLinkFile(built.file, []).findings, []);
  // And the opaque parts are still excluded from the venue-name scan in that form.
  assert.deepEqual(
    assertNoVenueNameInUrls(built.file, [{ account_id: "VEN-0001", venue_name: "Pin House" }]),
    [],
  );
});

test("the name check does not fire on the random parts of a URL", () => {
  // A 24-character token lowercases to 24 symbols from 36. Scanned whole, it
  // contains a four-letter name by accident often enough that a clean export
  // would be refused about one run in four, so the opaque parts are removed
  // before scanning. This test is what stops a future edit putting them back.
  const rows = [
    { account_id: "VEN-0001", venue_name: "Cafe" },
    { account_id: "VEN-0002", venue_name: "Face" },
    { account_id: "VEN-0003", venue_name: "Deaf" },
  ];
  for (let run = 0; run < 200; run += 1) {
    const built = build(null, cohortOf(1, 25), {
      posterFor: (pinId) => `out/venue-films/cohort-1/${pinId}.png`,
    });
    assert.deepEqual(assertNoVenueNameInUrls(built.file, rows), [],
      "a random token or digest cannot leak a name it never encoded");
  }
});

/* ------------------------------------------------------------ the file shape */

test("the file declares its version and a size that matches its body", () => {
  const built = build(null, cohortOf(1, 25));
  assert.equal(built.file.schemaVersion, LINKS_SCHEMA_VERSION);
  assert.equal(built.file.generatedFor.cohort, 1);
  assert.equal(built.file.generatedFor.size, built.file.links.length);
  assert.equal(built.file.links.length, 25);
});

test("the file carries no field beyond the seven the contract names", () => {
  // A strict shape here is what stops "just for debugging" adding a venue name,
  // a contact or an email to the one file that maps a URL back to a business.
  const expected = [
    "accountId", "pinId", "token", "landingUrl", "filmUrl", "thumbnailPath",
    "generatedOn", "sentOn",
  ].sort();
  for (const link of build(null, cohortOf(1, 5)).file.links) {
    assert.deepEqual(Object.keys(link).sort(), expected);
  }
});
