import assert from "node:assert/strict";
import { test } from "node:test";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import {
  isVenueEditionCommercialPath,
  isVenueInvitationPath,
  VENUE_INVITATION_PATH_PREFIX,
  VENUE_INVITATION_ROBOTS_DISALLOW,
} from "./paths";

/**
 * E13.16 acceptance criterion 11 and section 7.
 *
 * The point of these tests is not that the predicate works. It is that the
 * four consumers agree with it, so a future edit to any one of them fails here
 * rather than publishing a private page into a sitemap.
 */

const SAMPLE = `${VENUE_INVITATION_PATH_PREFIX}/Kf3rNqW8dJ2mBv5tXcYp7Lz1`;

test("the private prefix matches itself and everything under it", () => {
  assert.equal(isVenueInvitationPath("/v"), true);
  assert.equal(isVenueInvitationPath("/v/"), true);
  assert.equal(isVenueInvitationPath(SAMPLE), true);
  assert.equal(isVenueInvitationPath(`${SAMPLE}?x=1`), true);
});

test("the private prefix does not swallow neighbouring paths", () => {
  for (const path of ["/venues", "/venues/demo", "/vault", "/", "/video"]) {
    assert.equal(isVenueInvitationPath(path), false, path);
  }
});

test("D-032 R8: /v and /venues are both third-party-free surfaces", () => {
  for (const path of [
    "/v",
    SAMPLE,
    "/venues",
    "/venues/demo",
    "/venues/privacy",
  ]) {
    assert.equal(isVenueEditionCommercialPath(path), true, path);
  }
});

test("D-032 R8 does not reach the rest of the site", () => {
  for (const path of ["/", "/pricing", "/weddings", "/vault", "/about"]) {
    assert.equal(isVenueEditionCommercialPath(path), false, path);
  }
});

test("criterion 11, half one: robots.ts disallows the private prefix", () => {
  const rules = robots().rules;
  const rule = Array.isArray(rules) ? rules[0] : rules;
  const disallow = rule?.disallow;
  const entries = Array.isArray(disallow) ? disallow : [disallow];
  assert.ok(
    entries.includes(VENUE_INVITATION_ROBOTS_DISALLOW),
    `robots.ts must disallow ${VENUE_INVITATION_ROBOTS_DISALLOW}`,
  );
});

test("criterion 11, half two: no private path reaches the sitemap", () => {
  for (const entry of sitemap()) {
    const path = new URL(entry.url).pathname;
    assert.equal(
      isVenueInvitationPath(path),
      false,
      `${entry.url} is a private path and must not be published`,
    );
  }
});
