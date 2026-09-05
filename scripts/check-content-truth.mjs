import fs from "node:fs";
import path from "node:path";

const studio = process.cwd();
const parent = path.resolve(studio, "..");
const aliases = {
  tasks: fs.existsSync(path.join(parent, "tasks")) ? "tasks" : null,
  signal: fs.existsSync(path.join(parent, "analytics")) ? "analytics" : "signal",
};
const contract = JSON.parse(
  fs.readFileSync(path.join(studio, "contracts", "commercial-terms.v2.json"), "utf8"),
);
const failures = [];

function source(root, relative) {
  const file = path.join(root, relative);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function forbid(file, text, reason) {
  const value = source(studio, file);
  if (value.includes(text)) failures.push(file + ": " + reason);
}

function requireText(file, text, reason) {
  const value = source(studio, file);
  if (!value.includes(text)) failures.push(file + ": " + reason);
}

requireText(
  "src/app/pricing/page.tsx",
  "getConsumerPricingPresentation",
  "current pricing must consume the canonical customer-facing contract adapter",
);
requireText(
  "src/lib/commercial-terms.ts",
  "event.amountCents",
  "the pricing adapter must derive the Event amount from the canonical contract",
);
requireText(
  "src/app/students/page.tsx",
  'requireVerifiedAmount("student")',
  "current Student price must consume the canonical verified amount",
);
forbid(
  "src/app/pricing/page.tsx",
  "€79",
  "current Event copy must not contain the retired price",
);
forbid(
  "src/app/pricing/page.tsx",
  "€100",
  "unresolved Pro annual pricing must not be advertised",
);
forbid(
  "src/app/pricing/page.tsx",
  "verified student email",
  "Student verification is unresolved",
);
forbid(
  "src/app/students/page.tsx",
  "€49",
  "Committee Workspace is not an authorised offer",
);
forbid(
  "src/app/weddings/page.tsx",
  "twelve months",
  "Venue-sponsored access is eighteen months",
);
forbid(
  "src/app/venues/page.tsx",
  "See every couple’s plan",
  "sponsorship cannot promise private plan access",
);
forbid(
  "src/app/venues/page.tsx",
  "On track",
  "the public example must not invent a composite state",
);
for (const file of [
  "src/components/reveal/reveal-hero.tsx",
  "src/app/waitlist/page.tsx",
  "src/app/waitlist/waitlist-line.tsx",
  "src/app/students/page.tsx",
  "src/app/press/page.tsx",
]) {
  forbid(file, "1 September 2026", "broad launch date is unresolved");
  forbid(file, "from 1 September", "staged access must not be clock-authorized");
}
for (const file of [
  "public/brand/business-loan-pack-2026.html",
  "public/brand/market-entry-deck-2026.html",
  "public/brand/pitch-deck-2026.html",
  "public/brand/press/index.html",
  "signal-growth/pricing-wireframe.html",
]) {
  requireText(file, 'name="robots" content="noindex', "stale artifact must not be indexed");
}
requireText(
  "public/brand/students.html",
  'http-equiv="refresh" content="0; url=/students"',
  "retired static Student page must route to the canonical surface",
);

const weekdays = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};
const months = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11,
};
const signalRoot = path.join(parent, aliases.signal);
const dateline = source(signalRoot, "src/components/landing/the-brief-hero.tsx");
for (const match of dateline.matchAll(/\b(SUNDAY|MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY)\s*[·|,]\s*(\d{1,2})\s+(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\s+(20\d{2})\b/g)) {
  const [, weekday, day, month, year] = match;
  const actual = new Date(Date.UTC(Number(year), months[month], Number(day))).getUTCDay();
  if (actual !== weekdays[weekday]) {
    failures.push(
      "signal/src/components/landing/the-brief-hero.tsx: weekday/date mismatch for " +
        match[0],
    );
  }
}

if (contract.broadLaunchDate !== "2027-01-21" ||
    contract.launchProgramme?.firstOutreachDate !== "2027-01-21") {
  failures.push("commercial contract must retain the approved January 21 launch and first-outreach target");
}
if (contract.broadLaunchPolicy !== "manual_go_no_go_only" ||
    contract.accessState !== "waitlist_first" ||
    contract.launchProgramme?.automaticAccessOpening !== false ||
    contract.launchProgramme?.prelaunchMode !== "internal_testing_only" ||
    JSON.stringify(contract.launchProgramme?.manualGates) !== JSON.stringify(["user_launch", "first_outreach"])) {
  failures.push("January target must keep internal testing and separate manual launch/outreach gates");
}
if (contract.plans.pro.annualAmountCents !== 12000) {
  failures.push("commercial contract must keep the ratified Pro annual price at EUR 120");
}
if (contract.unresolved.length !== 0) {
  failures.push("commercial contract must not retain choices ratified on 2026-08-08");
}

// These active Atlas entries had repeatedly retained retired suite topology.
// Dated snapshots live outside content/atlas and keep their original evidence.
for (const file of [
  "content/atlas/signal-studio-umbrella.md",
  "content/atlas/five-products-as-a-system.md",
  "content/atlas/pricing-and-entitlements.md",
]) {
  const current = source(studio, file);
  if (!current || /\b(?:four|five) (?:shippable )?products\b|cardinality (?:at|is) four|No private workspaces in Timeline/i.test(current)) {
    failures.push(file + ": active Atlas must not revive retired product or privacy topology");
  }
  requireText(file, "docs/execution/january-2027/PROGRAMME.md", "current evidence must resolve to the January programme");
}
forbid("content/hq/features/project-files-in-drive.md", "**The 50 MB ceiling disappears", "provider capacity is not the enforced App upload limit");
forbid("content/hq/risks/drive-refresh-token-custody.md", "Not yet mitigated — the substrate does not exist", "implemented encryption must not be described as absent");

if (failures.length) {
  console.error("[content-truth] failed");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}
console.log("[content-truth] ok");
