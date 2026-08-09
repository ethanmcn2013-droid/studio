import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const pricing = readFileSync(path.join(process.cwd(), "src", "app", "pricing", "page.tsx"), "utf8");
const home = readFileSync(path.join(process.cwd(), "src", "app", "page.tsx"), "utf8");
const fixture = readFileSync(
  path.join(process.cwd(), "src", "components", "marketing", "heroes", "timeline", "fixture.ts"),
  "utf8",
);

describe("Wave 2 public truth contract", () => {
  it("renders the four ratified plan shapes without the retired universal promise", () => {
    for (const plan of ["free", "student", "pro", "event"]) {
      assert.match(pricing, new RegExp(`requireVerifiedAmount\\("${plan}"\\)`));
    }
    for (const phrase of ["€120", "Unlimited", "12 months, then read-only"]) {
      assert.ok(pricing.includes(phrase));
    }
    assert.doesNotMatch(pricing, /One price|No seat tax|Invite who you need|price does not move/i);
    for (const plan of ["Free", "Student", "Pro", "Event"]) {
      assert.match(pricing, new RegExp(`Join the ${plan} waitlist`));
    }
  });

  it("keeps the landing story to hero, product proof, wedge, and invitation", () => {
    assert.doesNotMatch(home, /RevealManifesto/);
    assert.match(home, /RevealHero/);
    assert.match(home, /RevealProductRelay/);
    assert.match(home, /RevealClosing/);
  });

  it("pins the public Mara and Finn proof to the canonical fixture date", () => {
    assert.match(fixture, /2026-10-03/);
    assert.match(fixture, /2026-07-16/);
    assert.match(fixture, /Shared by Mara & Finn/);
  });
});
