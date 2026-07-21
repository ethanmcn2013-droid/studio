---
id: signal-progressive-depth
title: Keep Briefing as Signal's default and put Overview, Trends, and Evidence beneath it.
category: Product
date: 2026-07-13
status: Active
reviewDate: 2026-08-13
relatedObjects: [Signal, Briefing, Overview, Trends, Evidence, Signal Notes, Signal Tasks, Signal Timeline]
---

## Decision

Signal opens on zero to three things that genuinely need the user now. Overview, Trends, and Evidence add progressive depth inside the same Signal context. They do not become a fifth product or a blank dashboard builder.

The deterministic layer owns metrics, observation detection, ranking, suppression, comparisons, coverage, and evidence. An optional server-side narrative provider may only phrase verified facts and must always fall back to curated wording.

## Reason

The short Briefing is still the clearest first answer, but a trusted conclusion needs a path to the facts. Keeping the deeper read inside Signal lets a user inspect the workspace, see change over time, and open the real Note, Task, decision, dependency, or milestone without losing scope.

The progressive shape preserves the product promise while closing the trust gap left by a Briefing that could say "why this" but could not show the full comparison and source records.

## Alternatives considered

Keep Signal as Briefing only. This preserves surface restraint but forces users into other products to validate every claim and breaks context.

Build a separate analytics or dashboard product. Rejected because it fragments the four-product system, duplicates authentication and data boundaries, and turns Signal into the category it exists to refuse.

Ship a configurable dashboard first. Rejected because the user would have to design the answer before receiving value.

## Risks

Overview can accumulate cards until it reads like a generic dashboard. Trends can imply precision the source history does not support. Cross-product Evidence can leak private records if membership and record policy are treated as filters instead of hard authorization. A narrative provider can weaken trust if it is allowed to invent causes.

## Notes

The release is feature-flagged and production-off by default. Promotion requires live staging proof of tenant isolation, source links, coverage honesty, keyboard behavior, and current build/test results. Product contract and implementation detail live in Signal's `docs/PRODUCT.md` and `docs/ADR-2026-07-13-SIGNAL-PROGRESSIVE-ANALYTICS.md`.
