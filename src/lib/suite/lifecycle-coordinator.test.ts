import assert from "node:assert/strict";
import test from "node:test";
import { executeLifecyclePlan, planLifecycle } from "./lifecycle-coordinator";

test("delete plans cover every product and derived store", () => {
  const plan = planLifecycle({ action: "delete", subject: "user_1", workspaceId: "ws_1" });
  assert.equal(plan.length, 9);
  assert.ok(plan.every((operation) => operation.destructive));
  assert.ok(plan.some((operation) => operation.store === "backups"));
  assert.ok(plan.every((operation) => operation.idempotencyKey.includes("user_1")));
});

test("suspension can be account-scoped but never accepts email as identity", () => {
  const plan = planLifecycle({ action: "suspend", subject: "user_1" });
  assert.equal(plan.length, 9);
  assert.throws(() => planLifecycle({ action: "suspend", subject: "" }));
});

test("workspace-scoped actions require an explicit workspace", () => {
  assert.throws(() => planLifecycle({ action: "remove-membership", subject: "user_1" }));
  assert.throws(() => planLifecycle({ action: "revoke-entitlement", subject: "user_1" }));
});

test("execution is idempotent for duplicate operation keys", async () => {
  const plan = planLifecycle({ action: "delete", subject: "user_1", workspaceId: "ws_1" });
  const calls: string[] = [];
  const result = await executeLifecyclePlan([...plan, plan[0]!], async (operation) => {
    calls.push(operation.idempotencyKey);
  });
  assert.equal(result.applied, 9);
  assert.equal(calls.length, 9);
});
