---
id: tasks-refuses-two-date-model
title: Tasks refuses the do-date vs deadline two-date model.
category: Product
date: 2026-07-01
status: Active
reviewDate: 2026-10-01
relatedObjects: [Signal Tasks, Signal, BRAND.md §2.2, tasks PR #11]
---

## Decision

Signal Tasks keeps one date per task. The competitive-steal council's "do-date vs deadline" two-date model is refused, not deferred.

## Reason

The model's stated purpose — killing false-overdue red — targets a failure Tasks does not have. Tasks paints no overdue red anywhere: past-date chips render in quiet ink and the shipped answer to a slipped date is the one-tap "Roll forward to tomorrow." A second date field is configuration tax on the 80% (BRAND.md §2.2) — a distinction to learn before capture. And `dueAt` crosses the product boundary into Signal's read model, so splitting its semantics would ripple through roughly twenty-one files plus the atlas contract for negative user value.

## Alternatives considered

Additive `doAt` column with "by {date}" parsed as deadline — rejected for the reasons above. What shipped instead: My Week's Today / This evening dayparts (tasks PR #11), which deepen the daily read using only the time the user actually typed, with zero new configuration.

## Risks

If Tasks ever grows genuinely hard deadlines (invoices, filings) alongside plan dates, this decision should be revisited against real user language — the refusal is about configuration tax, not about pretending deadlines don't exist.
