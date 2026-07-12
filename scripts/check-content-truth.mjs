import fs from "node:fs";
import path from "node:path";

const studio = process.cwd();
const parent = path.resolve(studio, "..");
const aliases = {
  tasks: fs.existsSync(path.join(parent, "tasks")) ? "tasks" : null,
  signal: fs.existsSync(path.join(parent, "analytics")) ? "analytics" : "signal",
};
const contract = JSON.parse(
  fs.readFileSync(path.join(studio, "contracts", "commercial-terms.v1.json"), "utf8"),
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
  'requireVerifiedAmount("event")',
  "current Event price must consume the canonical verified amount",
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

if (contract.broadLaunchDate !== null) {
  failures.push("commercial contract must not invent a broad launch date");
}
if (contract.plans.pro.annualAmountCents !== null) {
  failures.push("commercial contract must keep Pro annual unresolved until ratified");
}

if (failures.length) {
  console.error("[content-truth] failed");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}
console.log("[content-truth] ok");
