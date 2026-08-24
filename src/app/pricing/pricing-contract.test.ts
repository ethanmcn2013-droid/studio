import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

function source(...parts: string[]): string {
  return readFileSync(path.join(process.cwd(), ...parts), "utf8");
}

const pricing = source("src", "app", "pricing", "page.tsx");
const picker = source("src", "app", "pricing", "plan-picker.tsx");
const pricingCss = source("src", "app", "pricing", "pricing.module.css");
const waitlistPage = source("src", "app", "waitlist", "page.tsx");
const waitlistLine = source("src", "app", "waitlist", "waitlist-line.tsx");
const proxy = source("src", "proxy.ts");
const layout = source("src", "app", "layout.tsx");
const manifest = source("src", "app", "manifest.ts");
const home = source("src", "app", "page.tsx");
const fixture = source(
  "src",
  "components",
  "marketing",
  "heroes",
  "timeline",
  "fixture.ts",
);
const presentation = source("src", "lib", "review-suite-presentation.ts");

describe("public pricing truth and decision contract", () => {
  it("renders exactly Free, Student, Pro and Enterprise as the public ladder", () => {
    assert.match(pricing, /getConsumerPricingPresentation/);
    assert.match(pricing, /id: "free"/);
    assert.match(pricing, /id: "student"/);
    assert.match(pricing, /id: "pro"/);
    assert.match(pricing, /id: "enterprise"/);

    for (const plan of ["Free", "Student", "Pro"]) {
      assert.match(pricing, new RegExp(`Join the ${plan} waitlist`));
    }
    assert.match(pricing, /cta: "Discuss Enterprise"/);
    assert.match(pricing, /subject=enterprise/);
    assert.doesNotMatch(pricing, /Join the Event waitlist|pricing_event|id: "event"/);
  });

  it("derives all published consumer amounts and terms from the contract adapter", () => {
    for (const term of [
      "PRICING.plans.free.price",
      "PRICING.plans.student.price",
      "PRICING.plans.pro.price",
      "PRICING.plans.pro.annualPrice",
      "PRICING.plans.free.workspaceLimit",
      "PRICING.plans.student.workspaceLimit",
      "PRICING.plans.pro.workspaceLimit",
      "PRICING.vatStatement",
    ]) {
      assert.match(pricing, new RegExp(term.replaceAll(".", "\\.")));
    }
    assert.doesNotMatch(
      pricing,
      /Free forever|Does not expire|unlimited editing guests|No seat tax|price lock/i,
    );
  });

  it("keeps Enterprise founder-led and free of unsupported capability claims", () => {
    assert.match(pricing, /Your note goes to Ethan, Signal Studio’s founder/);
    assert.match(pricing, /Scoped together/);
    assert.doesNotMatch(
      pricing,
      /SSO|SAML|SLA|RBAC|audit logs?|enterprise-grade|dedicated success|priority support/i,
    );
  });

  it("uses one typed plan model for the ledger and comparison", () => {
    assert.match(picker, /export type PricingPlan/);
    assert.match(picker, /comparison: Readonly<Record<PricingComparisonKey, string>>/);
    assert.match(pricing, /plan\.comparison\[row\.key\]/);
    assert.doesNotMatch(pricing, /values: \[/);
  });

  it("carries a plan-specific waitlist path and confirms it on arrival", () => {
    for (const id of ["free", "student", "pro"]) {
      assert.match(
        pricing,
        new RegExp(`waitlistHref\\("pricing_${id}", "${id}"\\)`),
      );
    }
    assert.match(waitlistPage, /artifact=\{artifact\}/);
    assert.match(waitlistLine, /pricing_free: "Free"/);
    assert.match(waitlistLine, /pricing_student: "Student"/);
    assert.match(waitlistLine, /pricing_pro: "Pro"/);
    assert.match(waitlistLine, /You came from/);
    assert.match(waitlistLine, /You can change plans\s+before access/);
  });

  it("leaves pricing available to signed-in people choosing or changing access", () => {
    const marketingPaths = proxy.match(
      /const MARKETING_PATHS = new Set\(\[[\s\S]*?\]\);/,
    )?.[0];
    assert.ok(marketingPaths);
    assert.doesNotMatch(marketingPaths, /"\/pricing"/);
    assert.match(proxy, /matcher:[\s\S]*"\/pricing"/);
  });

  it("publishes the four-plan name contract in metadata, structured data and the manifest", () => {
    assert.match(pricing, /canonical: "\/pricing"/);
    for (const name of ["Free", "Student", "Pro", "Enterprise"]) {
      assert.match(layout, new RegExp(`name: "${name}"`));
    }
    assert.doesNotMatch(layout, /name: "Workspace"/);
    assert.match(manifest, /Free, Student, Pro and Enterprise/);
  });

  it("uses real first-party proof and bounded state motion", () => {
    assert.match(pricing, /HOMEPAGE_RELAY_TIMELINE_FIXTURE/);
    assert.match(pricing, /REVIEW_SUITE_PRESENTATION/);
    assert.match(pricing, /ProductSignatureWordmark/);
    assert.match(pricing, /No controls, no invented fields/);
    assert.doesNotMatch(pricing, /TimelineTheLine/);
    assert.match(pricingCss, /plan-panel-arrive/);
    assert.match(pricingCss, /prefers-reduced-motion: reduce/);
    assert.doesNotMatch(pricingCss, /animation-iteration-count:\s*infinite/);
  });

  it("keeps the public pricing voice free of dashes, hype and recommendation theatre", () => {
    assert.doesNotMatch(pricing, /—|–/);
    assert.doesNotMatch(picker, /—|–/);
    assert.doesNotMatch(
      pricing + picker,
      /world-class|seamless|robust|supercharge|most popular|recommended/i,
    );
  });
});

describe("public story proof contract", () => {
  it("keeps the landing story to hero, product proof, wedge and invitation", () => {
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
