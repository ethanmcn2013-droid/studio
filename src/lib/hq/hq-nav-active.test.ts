import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { activeHref, resolveHqLocation } from "./hq-nav";

describe("HQ nav active matching", () => {
  it("does not let /hq steal nested account-review", () => {
    assert.equal(activeHref("/hq/account-review"), "/hq/account-review");
    const crumb = resolveHqLocation("/hq/account-review");
    assert.equal(crumb.href, "/hq/account-review");
    assert.equal(crumb.page, "Account review");
    assert.equal(crumb.group, "Systems");
  });

  it("still resolves exact Today", () => {
    assert.equal(activeHref("/hq"), "/hq");
    assert.equal(resolveHqLocation("/hq").page, "Today");
  });

  it("resolves owned legacy venue-portal redirect under Account review", () => {
    assert.equal(activeHref("/hq/venue-portal-review"), "/hq/account-review");
  });
});
