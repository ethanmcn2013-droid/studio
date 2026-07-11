import assert from "node:assert/strict";
import test from "node:test";
import { PLATFORM_PACKAGE_NAMES, PLATFORM_PACKAGE_VERSION, canUseCapability, scrubTelemetry } from "./platform-contract";

test("platform contract is versioned and lists the required shared seams", () => {
  assert.equal(PLATFORM_PACKAGE_VERSION, 1);
  assert.ok(PLATFORM_PACKAGE_NAMES.includes("identity-tenancy"));
  assert.ok(PLATFORM_PACKAGE_NAMES.includes("telemetry"));
});

test("telemetry scrubbing removes credentials and PII keys", () => {
  const event = scrubTelemetry({ name: "read", traceId: "trace", properties: { email: "a@example.com", token: "secret", count: 2 } });
  assert.deepEqual(event.properties, { count: 2 });
});

test("capability resolver fails closed", () => {
  assert.equal(canUseCapability("active", "briefing.read", "briefing.read"), true);
  assert.equal(canUseCapability("revoked", "briefing.read", "briefing.read"), false);
  assert.equal(canUseCapability("active", "briefing.read", "tasks.write"), false);
});
