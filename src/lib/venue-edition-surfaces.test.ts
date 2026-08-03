import assert from "node:assert/strict";
import { test } from "node:test";

import {
  VENUE_EDITION_SURFACE_KEYS,
  allowsThirdPartyAnalytics,
  isVenueEditionSurface,
  normalisePathname,
  venueEditionSurface,
  venueEditionSurfaceLabel,
} from "./venue-edition-surfaces";

test("the four Venue Edition commercial surfaces are named once", () => {
  assert.deepEqual(
    [...VENUE_EDITION_SURFACE_KEYS],
    ["venues", "venues_demo", "private_venue_page", "redeem"],
  );
  for (const key of VENUE_EDITION_SURFACE_KEYS) {
    assert.equal(typeof venueEditionSurfaceLabel(key), "string");
    assert.ok(venueEditionSurfaceLabel(key).length > 0);
  }
});

test("each surface resolves to its own key", () => {
  assert.equal(venueEditionSurface("/venues"), "venues");
  assert.equal(venueEditionSurface("/venues/demo"), "venues_demo");
  assert.equal(venueEditionSurface("/v/7Kq2mXvR4nBt9wDs"), "private_venue_page");
  assert.equal(venueEditionSurface("/redeem"), "redeem");
  assert.equal(venueEditionSurface("/redeem/GM-0241"), "redeem");
});

test("a section matches its children but never a longer sibling name", () => {
  // The failure this guards: a naive startsWith("/v") silencing the tag on
  // /venues, /vault or /video, or startsWith("/venues") swallowing /venuesomething.
  assert.equal(venueEditionSurface("/venuesomething"), null);
  assert.equal(venueEditionSurface("/venue"), null);
  assert.equal(venueEditionSurface("/vault"), null);
  assert.equal(venueEditionSurface("/video"), null);
  assert.equal(venueEditionSurface("/redeemed"), null);
  assert.equal(venueEditionSurface("/venues/demo/detail"), "venues_demo");
  assert.equal(venueEditionSurface("/venues/anything-added-later"), "venues");
});

test("the rest of the site is untouched", () => {
  for (const path of [
    "/",
    "/pricing",
    "/about",
    "/weddings",
    "/tasks",
    "/timeline",
    "/waitlist",
    "/dispatch",
    "/hq/account-review",
  ]) {
    assert.equal(venueEditionSurface(path), null, path);
    assert.equal(allowsThirdPartyAnalytics(path), true, path);
  }
});

test("third-party analytics is refused on every Venue Edition surface", () => {
  for (const path of ["/venues", "/venues/demo", "/v/abc123", "/redeem"]) {
    assert.equal(isVenueEditionSurface(path), true, path);
    assert.equal(allowsThirdPartyAnalytics(path), false, path);
  }
});

test("a trailing slash, a query, a fragment and an absolute URL are the same page", () => {
  assert.equal(venueEditionSurface("/venues/"), "venues");
  assert.equal(venueEditionSurface("/venues?source=studio_site"), "venues");
  assert.equal(venueEditionSurface("/venues#price"), "venues");
  assert.equal(venueEditionSurface("/VENUES"), "venues");
  assert.equal(
    venueEditionSurface("https://signalstudio.ie/venues/demo?touch=site"),
    "venues_demo",
  );
});

test("junk resolves to the root and is not a Venue Edition surface", () => {
  assert.equal(normalisePathname(""), "/");
  assert.equal(normalisePathname("   "), "/");
  assert.equal(normalisePathname("http://["), "/");
  assert.equal(normalisePathname("venues"), "/venues");
  assert.equal(venueEditionSurface(""), null);
  // usePathname() can be null before hydration; the caller coalesces to "".
  assert.equal(allowsThirdPartyAnalytics(""), true);
});

test("the surface key never carries the private film token", () => {
  const token = "7Kq2mXvR4nBt9wDs";
  const key = venueEditionSurface(`/v/${token}`);
  assert.equal(key, "private_venue_page");
  assert.equal(String(key).includes(token), false);
  assert.equal(venueEditionSurfaceLabel("private_venue_page").includes(token), false);
});
