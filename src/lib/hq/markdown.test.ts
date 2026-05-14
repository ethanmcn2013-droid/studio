/**
 * Tests for the HQ markdown parser's pure functions.
 *
 * Run: npx tsx --test src/lib/hq/markdown.test.ts
 *
 * Uses node:test + node:assert — no new dependency. Covers the
 * load-bearing pieces: frontmatter parsing across three array
 * syntaxes (inline-no-quotes / JSON / single-value), H2 body
 * section split, sort-by-date, status tally.
 */

import test from "node:test";
import assert from "node:assert/strict";

import {
  countByStatus,
  parseFrontmatter,
  sortByDateDesc,
  splitH2Sections,
  toEntry,
  type HqMarkdownEntry,
} from "./markdown-parser";

test("parseFrontmatter: inline arrays without commas in values", () => {
  const raw = `---
id: alpha
title: Alpha decision
relatedObjects: [Signal Tasks, Signal Roadmap]
---

## Decision

The body.
`;
  const { fm, body } = parseFrontmatter(raw);
  assert.equal(fm.id, "alpha");
  assert.equal(fm.title, "Alpha decision");
  assert.deepEqual(fm.relatedObjects, ["Signal Tasks", "Signal Roadmap"]);
  assert.ok(body.startsWith("## Decision"));
});

test("parseFrontmatter: JSON arrays survive comma-in-string values", () => {
  const raw = `---
id: alpha
majorFeatures: ["First item","Second (with, embedded, commas)","Third"]
---

body
`;
  const { fm } = parseFrontmatter(raw);
  assert.deepEqual(fm.majorFeatures, [
    "First item",
    "Second (with, embedded, commas)",
    "Third",
  ]);
});

test("parseFrontmatter: quoted scalar strips quotes", () => {
  const raw = `---
id: alpha
title: "Quoted title"
---
`;
  const { fm } = parseFrontmatter(raw);
  assert.equal(fm.title, "Quoted title");
});

test("parseFrontmatter: no frontmatter block returns body as-is", () => {
  const raw = `just a body, no frontmatter`;
  const { fm, body } = parseFrontmatter(raw);
  assert.deepEqual(fm, {});
  assert.equal(body, "just a body, no frontmatter");
});

test("parseFrontmatter: empty array literal", () => {
  const raw = `---
id: alpha
tags: []
---
`;
  const { fm } = parseFrontmatter(raw);
  assert.deepEqual(fm.tags, []);
});

test("splitH2Sections: walks H2 headings into named map", () => {
  const body = `## Decision

One.

## Reason

Two.

## Notes

Three.`;
  const sections = splitH2Sections(body);
  assert.equal(sections.Decision, "One.");
  assert.equal(sections.Reason, "Two.");
  assert.equal(sections.Notes, "Three.");
});

test("splitH2Sections: H3 inside a section stays with the parent", () => {
  const body = `## Decision

One.

### Sub heading

Sub body.

## Reason

Two.`;
  const sections = splitH2Sections(body);
  assert.match(sections.Decision, /Sub heading/);
  assert.equal(sections.Reason, "Two.");
});

test("toEntry: missing frontmatter fields fall back to defaults", () => {
  const entry = toEntry({ id: "alpha" }, "## Decision\n\nBody.", "alpha.md");
  assert.equal(entry.fm.id, "alpha");
  assert.equal(entry.fm.title, "alpha");
  assert.deepEqual(entry.fm.relatedObjects, []);
  assert.equal(entry.fm.status, undefined);
  assert.equal(entry.sections.Decision, "Body.");
});

test("toEntry: title defaults to fileSlug when frontmatter missing", () => {
  const entry = toEntry({}, "", "my-slug.md");
  assert.equal(entry.fm.id, "my-slug");
  assert.equal(entry.fm.title, "my-slug");
});

test("sortByDateDesc: most recent first; ties break by title", () => {
  const entries: HqMarkdownEntry[] = [
    toEntry({ id: "a", title: "A", date: "2026-05-10" }, "", "a.md"),
    toEntry({ id: "c", title: "C", date: "2026-05-15" }, "", "c.md"),
    toEntry({ id: "b", title: "B", date: "2026-05-15" }, "", "b.md"),
  ];
  const sorted = sortByDateDesc(entries);
  assert.deepEqual(
    sorted.map((e) => e.fm.id),
    ["b", "c", "a"],
  );
});

test("countByStatus: tallies frontmatter status field; missing → '—'", () => {
  const entries: HqMarkdownEntry[] = [
    toEntry({ id: "a", status: "Active" }, "", "a.md"),
    toEntry({ id: "b", status: "Active" }, "", "b.md"),
    toEntry({ id: "c", status: "Revisit" }, "", "c.md"),
    toEntry({ id: "d" }, "", "d.md"),
  ];
  const counts = countByStatus(entries);
  assert.equal(counts.Active, 2);
  assert.equal(counts.Revisit, 1);
  assert.equal(counts["—"], 1);
});
