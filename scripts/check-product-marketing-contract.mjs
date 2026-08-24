import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFileSync } from "node:fs";

/**
 * Product marketing page contract.
 *
 * Rewritten 2026-07-28. The page used to be hero gesture + "day in the work"
 * tab strip + boundary band, and this file asserted the shape of all three.
 * A product page is now its hero, so the contract is about the hero: that the
 * page renders one, that every product resolves to its own, and that the
 * retired sections have not crept back.
 *
 * Note on the previous revision: it asserted /ProductHeroGesture/ against the
 * page source, which kept passing after the gesture was deleted because the
 * string survived in a comment explaining the deletion. Assertions below are
 * written against JSX tags and import specifiers so prose cannot satisfy them.
 */

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const resolve = (path) => new URL(path, import.meta.url);

const page = read("../src/components/marketing/product-marketing-page.tsx");
const hero = read("../src/components/marketing/heroes/product-hero.tsx");
const handoff = read(
  "../src/components/marketing/handoff/product-handoff.tsx",
);
const handoffData = read(
  "../src/components/marketing/handoff-lab/data.ts",
);
const footer = read("../src/components/landing/site-footer.tsx");

// ── The page is hero, handoff, close ───────────────────────────────────────
assert.match(page, /<ProductHero\s+product=\{product\}\s*\/>/);
assert.match(page, /<ProductPills\s+current=\{product\}\s*\/>/);
assert.match(page, /<ProductHandoff\s+product=\{product\}\s*\/>/);
assert.match(page, /<SiteFooter\s*\/>/);

// The close: the product's refusal, then the one action the site asks for.
assert.match(page, /\{definition\.boundary\}/);
assert.match(page, /href="\/waitlist"/);
assert.match(page, />Join the waitlist</);

// ── The handoff walks the suite and exits at the waitlist ──────────────────
// Notes → Tasks → Timeline is the current product sequence. Home owns the
// briefing front door; the private lab retains Signal only as provenance.
assert.match(handoffData, /nextHref: "\/tasks"/);
assert.match(handoffData, /nextHref: "\/timeline"/);
assert.match(
  handoffData,
  /timeline:\s*\{[\s\S]*?caption:\s*"Timeline → Home"[\s\S]*?nextHref:\s*null/,
);
assert.match(handoffData, /signal:\s*\{[\s\S]*?nextHref:\s*null/);
// Scroll drives the selected scene directly; reduced motion settles instantly.
assert.match(handoff, /LivingArtifact/);
assert.match(handoff, /useScroll/);
assert.match(handoff, /useReducedMotion/);
assert.match(handoff, /target:\s*stageRef/);
assert.match(handoff, /offset:\s*\["start 78%", "start 50%"\]/);
assert.doesNotMatch(handoff, /IntersectionObserver/);
assert.doesNotMatch(handoffData, /Open task/i);

// ── The retired sections stay retired ──────────────────────────────────────
assert.doesNotMatch(page, /<DayInWorkExperience/);
assert.doesNotMatch(page, /<ProductHeroGesture/);
assert.doesNotMatch(page, /id="day-in-the-work"/);
assert.doesNotMatch(page, /styles\.boundary/);
assert.ok(
  !existsSync(resolve("../src/components/marketing/day-in-work")),
  "day-in-work components were removed with the section; do not reinstate " +
    "without also restoring its contract",
);

// ── Every product resolves to its own hero ─────────────────────────────────
for (const [product, component] of [
  ["tasks", "TasksTheBoard"],
  ["timeline", "TimelineTheLine"],
  ["notes", "NotesBeforeItLeaves"],
  ["signal", "SignalTheRead"],
]) {
  assert.match(
    hero,
    new RegExp(`import \\{ ${component} \\}`),
    `${product} hero import missing`,
  );
  assert.match(hero, new RegExp(`<${component}\\s*/>`), `${product} hero unused`);
}
// Signal is the fallthrough return, so it carries no product comparison.
for (const product of ["tasks", "timeline", "notes"]) {
  assert.match(hero, new RegExp(`product === "${product}"`));
}

// ── Footer stays compact on mobile ─────────────────────────────────────────
assert.match(footer, /grid-cols-2/);
assert.match(footer, /lg:grid-cols-\[1\.35fr_repeat\(4,1fr\)\]/);

console.log(
  "[product-marketing-contract] ok (three-product handoff + Home close, legacy Signal hero retained, compact mobile footer)",
);
