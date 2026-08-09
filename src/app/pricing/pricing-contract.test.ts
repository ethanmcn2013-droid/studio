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
const presentation = readFileSync(
  path.join(process.cwd(), "src", "lib", "review-suite-presentation.ts"),
  "utf8",
);

describe("Wave 2 public truth contract", () => {
  it("renders the four public access shapes without the retired universal promise", () => {
    assert.match(pricing, /getConsumerPricingPresentation/);
    assert.doesNotMatch(pricing, /One price|No seat tax|Invite who you need|price does not move/i);
    assert.doesNotMatch(pricing, /Forever|Does not expire|No product add-ons|lock away product capability/i);
    assert.match(pricing, /PRICING\.vatStatement/);
    for (const plan of ["Free", "Student", "Pro"]) {
      assert.match(pricing, new RegExp(`Join the ${plan} waitlist`));
    }
    assert.match(pricing, /name: "Enterprise"/);
    assert.match(pricing, /Contact our sales team/);
    assert.doesNotMatch(pricing, /Join the Event waitlist|pricing_event/);
  });

  it("keeps the landing story to hero, product proof, wedge, and invitation", () => {
    assert.doesNotMatch(home, /RevealManifesto/);
    assert.match(home, /RevealHero/);
    assert.match(home, /RevealProductRelay/);
    assert.match(home, /RevealClosing/);
  });

  it("pins the public Mara and Finn proof to the canonical fixture date", () => {
    assert.match(fixture, /2026-10-03/);
    assert.match(fixture, /REVIEW_SUITE_PRESENTATION\.reviewToday/);
    assert.match(fixture, /REVIEW_SUITE_PRESENTATION\.project\.name/);
    assert.match(presentation, /name: "Mara & Finn"/);
    assert.match(presentation, /reviewToday: "2026-07-16"/);
  });
});
