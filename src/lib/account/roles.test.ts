import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { roleCan, roleDenialReason } from "./roles";

describe("Account roles", () => {
  it("gives owners member and preference control", () => {
    assert.equal(roleCan("owner", "manage_members"), true);
    assert.equal(roleCan("owner", "edit_reporting_preferences"), true);
    assert.equal(roleCan("owner", "download_reports"), true);
    assert.equal(roleDenialReason("owner", "request_access"), null);
  });

  it("keeps managers from member changes", () => {
    assert.equal(roleCan("manager", "manage_members"), false);
    assert.equal(roleCan("manager", "download_reports"), true);
    assert.equal(roleCan("manager", "request_access"), true);
    assert.match(
      roleDenialReason("manager", "manage_members") ?? "",
      /Only Owners/,
    );
  });

  it("keeps viewers read-only for reports and usage", () => {
    assert.equal(roleCan("viewer", "view_usage"), true);
    assert.equal(roleCan("viewer", "view_reports"), true);
    assert.equal(roleCan("viewer", "download_reports"), false);
    assert.equal(roleCan("viewer", "request_access"), false);
    assert.equal(roleCan("viewer", "manage_members"), false);
    assert.match(
      roleDenialReason("viewer", "request_access") ?? "",
      /Viewers can inspect access/,
    );
    assert.match(
      roleDenialReason("viewer", "download_reports") ?? "",
      /PDF and CSV download/,
    );
  });
});
