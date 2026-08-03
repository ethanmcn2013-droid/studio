---
id: ratify-project-vocabulary
title: Ratify the Project vocabulary changes an agent shipped on your behalf
status: open
priority: P1
blocking: false
phase: Board truth programme
why: Two brand decisions were made and shipped inside T·114 that are yours to ratify, not an agent's.
href: /hq
date: 2026-07-30
---

# Ratify the Project vocabulary changes

D-011 ratified "Projects = Tasks workspaces" on 2026-07-21 and had not landed.
T·114 landed it. Two parts of that work were judgement calls made on your
behalf and shipped. Both are reversible; neither should stand unratified.

## 1. BRAND.md §6.5, the Tasks call to action

Was `Open the workspace`. Now `Open the project`.

The share email already carried the old string in production, so the handbook
and the product were contradicting each other either way. The product string
was changed first and the handbook followed in studio PR #126.

**Confirm, or say which way you want it and it gets changed in both places.**

## 2. The planning-period noun: Season, not Program

D-011 says "Programs = planning periods". The generic default shipped as
**Season** instead, on the reasoning that to a wedding or venue operator a
programme is the running order on the day, and the surface renders a date
range rather than a strategic thrust. `Initiative` was left reserved rather
than spent on a time window.

This is an amendment to a ratified decision, recorded in
`docs/brand-guide/naming/LOCKED_OPERATING_VOCABULARY.md`.

**Confirm the amendment, or restore Program.**

Context-specific names were already correct and are untouched: a school year
holds Classes, a semester holds Modules, a wedding season holds Weddings.

## Enforcement now in place

`tasks/src/lib/planning/vocabulary.test.ts` fails the build if any component
writes the user-facing noun into JSX text, `aria-label`, `title`, `placeholder`
or `alt`. The vocabulary map is the only allowed source. Whichever way you
ratify, the words now change in one file.
