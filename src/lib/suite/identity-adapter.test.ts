import assert from "node:assert/strict";
import test from "node:test";
import { resolveSuiteAccess } from "./identity-adapter";

const base = {
  subject: "user_1",
  status: "active" as const,
  workspaceId: "ws_1",
  role: "member" as const,
  entitlement: {
    product: "tasks",
    capability: "workspace.read",
    status: "active" as const,
    expiresAt: "2030-01-01T00:00:00.000Z",
  },
};

test("member resolves only explicit member capabilities", () => {
  const access = resolveSuiteAccess(base, { now: Date.parse("2027-01-01"), requiredProduct: "tasks", requiredCapability: "object.write" });
  assert.ok(access);
  assert.equal(access.role, "member");
  assert.equal(access.capabilities.has("workspace.manage"), false);
  assert.equal(access.entitled, true);
});

test("guest cannot manage or write workspace", () => {
  const access = resolveSuiteAccess({ ...base, role: "guest" }, { requiredCapability: "workspace.write" });
  assert.equal(access, null);
});

test("removed or suspended identity fails closed", () => {
  assert.equal(resolveSuiteAccess({ ...base, status: "suspended" }), null);
  assert.equal(resolveSuiteAccess({ ...base, entitlement: { ...base.entitlement, status: "revoked" } }, { requiredProduct: "tasks" }), null);
});

test("expired entitlement fails closed", () => {
  const access = resolveSuiteAccess({ ...base, entitlement: { ...base.entitlement, expiresAt: "2020-01-01T00:00:00.000Z" } }, { now: Date.parse("2027-01-01"), requiredProduct: "tasks" });
  assert.equal(access, null);
});
