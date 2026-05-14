---
id: templates-cross-suite-canonical
title: Templates are a cross-suite primitive owned by the studio repo. Tasks is the only product with a template gall…
category: Product
date: 2026-05-12
status: Active
reviewDate: 2026-07-12
relatedObjects: [docs/TEMPLATES_STRATEGY.md, tasks/lib/templates.ts, signal-growth/seo/template-strategy.md, BRAND.md §2.1]
---

## Decision

Templates are a cross-suite primitive owned by the studio repo. Tasks is the only product with a template gallery; Notes, Roadmap, and Analytics consume template metadata via lazy expression on first visit.

## Reason

The workspace creator persona searches for the artefact ('wedding planning checklist'), not the tool. Templates are the front door to the suite, not a setup shortcut. One canonical template definition rippling through four layers preserves the 'discipline sustained across the suite' moat; four parallel template galleries would destroy it.

## Alternatives considered

Per-product template galleries (each of Tasks, Roadmap, Notes maintains its own list). Faster to ship in any one product; corrodes the cross-suite discipline that is the moat.

## Risks

Sync mechanism (build-time copy of slices into each product) adds coordination cost on template change. Five anchor templates instead of one means more upfront work before validating the apply-and-watch loop. Marketing-month anchor has the highest BRAND-voice risk and may need a name + scope swap.

## Notes

Locked 2026-05-12. Five anchor templates (one per §2.1 archetype): wedding-planning-workspace (lift to 4-layer), trades-job-pipeline, final-paper-sprint (lift from Tasks-only), freelance-client-engagement, local-business-monthly-rhythm. Existing 13 Tasks-only specialty templates stay as Tasks-only. Sequenced as Cycles T-1 through T-7 in TEMPLATES_STRATEGY.md. Four sub-decisions resolved same-day per Ethan's brand-aligned proceed: (a) sync script not workspace package, (b) all five anchors committed not one-then-watch, (c) marketing-month swapped for monthly-rhythm to honour BRAND.md §2 operator-real voice, (d) lazy expression not eager seed — each product's brand gesture (pulse/slide/tick/caret) is itself a reveal.
