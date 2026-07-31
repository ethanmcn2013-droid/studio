---
id: tasks-board-truth
title: Tasks board truth programme
product: tasks
status: In Progress
lastVerified: 2026-07-30
---

# Tasks board truth programme

A founder review of the Tasks board on 2026-07-30 found four surface
complaints. Investigating them found something larger: **the production board
is the design-lab prototype, and the real board is dead code.**

## Root cause

| Date | Dispatch | Effect |
|---|---|---|
| 2026-07-17 | T·96 | Ships column rename and colour. |
| 2026-07-19 | T·98 | Extends it: create form, reorder, delete-with-destination. |
| 2026-07-20 | T·99 | Ports the design-lab tree into production. Its own text: "The T·98 board rework … [is] dropped in line with the one-to-one decision." Parity was "verified by side-by-side render rather than a spec list." |

A render comparison cannot see a missing capability. `components/app/board/board-app.tsx`
exports `BoardApp` and nothing has imported it since 2026-07-20. The live board
is `components/hybrid/options/a/board-view.tsx`, whose columns come from a
hardcoded five-value const.

**Standing rule added:** a one-to-one render port is gated on a capability
inventory, not a screenshot. Any control present in the outgoing component and
absent in the incoming one is a blocking finding.

## Open risk: the `waiting` lane

The lab runs five statuses against a four-lane schema. The adapter writes
`waiting: "waiting" as LaneId` — out-of-contract text in a column typed
`todo | doing | review | done`.

`share-board.tsx`, `print-board.tsx` and `embed-view.tsx` all iterate the
canonical four lanes, so **any task in Waiting is invisible on every share
link, print output and public embed.** A client opening a shared board does not
see that work. Production row count not yet measured. Cleared by Phase 2.

## Shipped

- **T·114** (2026-07-30, PR #68). The brief's title and description were
  persisting to localStorage keyed by *display name*: device-local, invisible
  to collaborators, shared between two projects with the same display name,
  orphaned by rename. Description now lives on `workspaces.description`
  (migration 0022, applied to production). Title commits through the
  `renameBoardAction` the brief had been shadowing. Lands D-011: the hardcoded
  `Workspace ›` crumb is gone and a contract test now fails the build if any
  component authors the noun. That test found fifteen further leaks across
  Notes, Timeline, Signal, the share email and the onboarding picker.
- **T·115** (2026-07-30, PR #69). Sidebar subtraction: duplicated product name,
  the second "mine" row, Saved views, and the promoted Archived row all
  removed. Fields is list-only rather than disabled on the landing view.
  Repairs the flaky Timeline switcher smoke.

## Remaining

| Phase | Work | Gate |
|---|---|---|
| 2 | Port the column config into the live board; retire the `waiting` raw-text hack; teach share, print and embed the column config; delete `board-app.tsx` | **Live data migration** rewriting `lane` values |
| 3 | `doneKeys` + one `isDone()` predicate, replacing bare `lane === "done"` in ~12 modules; add `tasks.completedAt` | Schema add |
| 5 | Budget over the existing `tasks.cents`; fix the hardcoded USD; `workspaces.budgetCents` and `currency` | Schema add |

Boundary ratified for Phase 5: Tasks may restate a number the operator entered.
It must never compute, forecast, convert or publish a financial claim, and
money does not render on share, print, embed or `/p/{slug}`.

## Decisions

- **D-011 amendment (2026-07-30):** the generic planning-period noun ships as
  **Season**, not Program. "Programme" is the running order on the day to the
  wedding and venue audience, and the surface renders a date range.
  `Initiative` stays reserved.
- **BRAND.md §6.5:** the Tasks CTA changes from `Open the workspace` to
  `Open the project`, matching the shipped share email.
