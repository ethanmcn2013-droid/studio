---
id: tasks-board-truth
title: Tasks board truth programme
product: tasks
status: Shipped
lastVerified: 2026-07-31
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

## The four-view capability audit (2026-07-31)

Before phase 2 was written, a full inventory of every dead component
against its mounted counterpart found the T·99 blast radius covered all
four views, not just the board: 3,992 orphaned lines including
`card-actions.tsx`, plus three live defects — the assign menu offered
eight design-lab fixture people on production data (choosing one wrote a
fixture id into `tasks.assignees` while real members rendered as nothing),
the Filter/Sort/Save-view band was unmounted on every view, and no
share, export, print or subscribe control existed on any of the four
views. Full inventory:
`signal-studio-workspace/BOARD-TRUTH-CAPABILITY-INVENTORY-2026-07-31.md`.

## Shipped (continued)

- **T·119** (2026-07-31, PR #75). Members resolve server-side and hydrate
  the assign menu and avatars; the fixture roster is confined to the
  design lab. An empty roster reads as empty, never as fake people.
- **T·121** (2026-07-31, PR #77). Phase 2. The live board renders and manages
  config-driven columns (add-after from the header "+", pinned append,
  rename, describe, recolour with true-tint swatches, soft limits, move,
  safe delete with destination); share, print, embed and the CSV and
  Markdown exports group and label by the same columns; `LANES` defaults
  align to the shipped vocabulary so a guest's "Blocked" never disagrees
  with the operator's "Queued" again; migration 0024 retires the raw-text
  waiting lane (claim + canonical lane + seeded configs); `board-app.tsx`
  and `card-actions.tsx` are deleted. Production counts measured
  read-only via the db-migrate measure command before execution (1 waiting row moved; verified 0 after apply). The parallel data-layer reset shipped as T·120 (PR #76) with its own migration 0023, and this release renumbered on top of it.

- **T·122** (2026-07-31). Phase 3. `doneKeys` joins the column config with
  one `isTaskDone()` predicate behind every surface (the column menu gains
  "Counts as done"); every write path stamps `tasks.completedAt` on real
  done transitions (migration 0025, activity-log-provable backfill only);
  Signal reads the stamp before reconstructing; lane moves and completion
  toggles now clear custom-column claims. Known edge: the cross-project
  "Your work" SQL rollup still counts the canonical Done lane only.

- **T·124** (2026-07-31). Phase 5. One currency label and one operator
  budget per project (migration 0026); the brief restates the sum with
  coverage first ("EUR 1,684 of EUR 50,000. 2 tasks costed, 24 without a
  price."); the hardcoded USD formatter is gone. Boundary held: restate
  and sum only, nothing converted or forecast, no money on share, print,
  embed or /p/{slug}.

- **T·125** (2026-07-31, PR #81). Block 4b — the programme's close. The
  room tools are remounted into the hybrid view bar on all four views:
  Filter (widened to priority, column by name, owner by name, and date),
  Sort, and saved views with their full save/apply/delete loop restored
  in-panel; the Share, export, print and calendar-subscribe cluster rides
  every view. The list regains per-row completion, inline priority, the
  description line and owner names; the schedule regains per-row
  completion; the calendar regains its phone day-list and a visible
  Subscribe button; empty projects greet with the guided first-run state,
  and a filter that admits nothing says so with the way back. The last
  2,856 orphaned lines (list/calendar/timeline apps, export menu, room
  view bar and helpers) are deleted — every loss in the 2026-07-31
  capability audit is either restored or deliberately retired, and the
  four views' behavior has exactly one source. Evidence: 128/128
  materiality checks attested, fixtures refreshed, full gate chain, live
  DB-verified round trips.

## Remaining

Nothing. The programme closed with T·125; every audit finding is
resolved. Recorded follow-up edges live with their owners: the
cross-project "Your work" rollup counts the canonical Done lane only,
and the Signal mirror reads default done semantics.

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
