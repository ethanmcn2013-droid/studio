---
id: venues-page-founding-25-copy
title: Ship the approved /venues copy for the Founding 25
status: done
cleared: "2026-08-08 - live /venues publishes the Founding 25, EUR 1000 founding rate, EUR 1500 standard rate, and 18-month terms"
priority: P0
blocking: false
phase: VEF-2026 · Commercial gate
why: The copy is approved. The live page still publishes the retired offer until it ships, and it cannot ship alone because it depends on WP-01's uncommitted price constant.
href: /venues
date: 2026-08-03
---

> **COPY APPROVED by the founder, 2026-08-03.** What remains is not a decision,
> it is a merge. See "What is actually blocking it" below.

The change is written, built and verified. **It is not deployed.**

## What the page says now

€1,500 per venue with no founding rate, "the founding cohort, the first fifteen
venues, lock €1,500 a year for as long as they stay", and a closing line offering
a founding group of fifteen.

## What the prepared change says

Two prices, €1,000 leading and €1,500 secondary, both marked as including VAT at
the prevailing rate. Twenty-five places, numbered 01/25 to 25/25 and assigned when
payment clears. Founder access bounded at one call a year. The roadmap boundary
stated as a benefit: nothing gets built for one venue. The couple term carries the
grace rule, so a long engagement never runs out before the day.

No remaining-places counter. A static page cannot make a true-at-send claim about
how many places are left, and the programme rules forbid one that is not verifiable.

## What is actually blocking it

Not approval. Three mechanical things, all recorded here so the next session does
not have to rediscover them.

1. **The working tree holds four packages at once.** 121 files are modified
   across WP-01, WP-02, WP-03 and WP-10. Committing from here ships all four.
2. **The branch is `feat/homepage-reduction-relay`**, which belongs to unrelated
   work. This needs its own branch.
3. **WP-10 cannot ship alone.** `VENUE_EDITION_FOUNDING_ANNUAL_PRICE_EUR` lives in
   `src/lib/venue-edition.ts`, which is WP-01's file and is still uncommitted.
   Four WP-10 files import it: `financial-model.ts`, `commercial-terms.test.ts`,
   `mark-venue-paid.ts`, and the contract check asserts on it. A WP-10-only commit
   would not build. The coupling is deliberate, so a divergence breaks the build
   rather than passing silently, but it means the two packages merge together.

## Steps

1. Let WP-01 finish, or take its `venue-edition.ts` into the same commit.
2. Branch off `main`, commit WP-01 + WP-10 together, open one PR.
3. Merge. The page deploys with it.

Nothing has been committed or pushed.

## What is not in this todo

The three public decks under `/brand/` still carry flat €1,500 venue economics,
including the lender pack. That is tracked separately in the WP-10 packet, section
3.4, because correcting a document that may already sit with a lender is a
disclosure decision rather than a file edit.
