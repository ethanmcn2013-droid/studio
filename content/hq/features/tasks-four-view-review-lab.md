---
id: tasks-four-view-review-lab
title: Signal Tasks four-view review lab
product: Signal Tasks
category: Core
status: Shipped
priority: High
effort: Medium
impact: High
owner: Ethan
principleAlignment: 95
---

## Verdict — SELECT B (2026-07-17), now mirrored 1:1 in production

The founder selected **Option B, Editorial Project Room** (also the panel's top score, 9.50) and Phase 2 shipped to production Tasks the same day (Tasks dispatch T·93, tasks PR #31). A later review found the ported production surface had drifted from the lab, so **T·95 (tasks PR #33) brought production to a 1:1 match with the Option B lab** — the charcoal four-product rail, the Projects sidebar with its real planning-period tree and live counts, the full-bleed brief band, the 52px room view bar with working search/filter/sort/fields/density/save-view, and the lab's board/list/timeline/calendar grammar — with the **Studio Bar (T·94) as the only sanctioned difference** between lab and production. 46/46 production-build browser evidence at both breakpoints, verified side-by-side against frozen lab reference captures. The lab below remains the reference record of all three directions and the frozen parity spec.

**T·96 refinements (tasks PR #34):** the Studio Bar slimmed to 40px with a single top-left mark (the duplicate home dot retired), and the kanban gained editable column names (Rename overflow item, hover pencil, double-click) plus a per-column soft colour picker — neutral/indigo/rose/amber/emerald/sky/violet, each on an existing system token, applied as a whisper-soft lane tint and coloured dot (never a block, cards stay neutral). Colours persist per column per workspace in the board meta record. 46/46 browser evidence, Axe clean.

## T·106 — the board world-class pass (2026-07-29, tasks PR #60)

Three operator-directed phases took the production board from a correct
surface to a designed one, and every task gained a human number.

**Colour and structure.** Lanes sit on paper with the marketing hero's tone
grammar (2px header rule, 220px wash, full-strength pip; the backlog stays
plain), scroll independently, collapse to a slim toned rail with a real
width animation, and the same tone grammar follows into the List view's
group bands, which also stopped painting only a third of their row (a
display:flex on the spanning table cell had been voiding its colSpan since
the lab port). Type across the shell, rail, toolbar, and all four views
came up to a 10px floor from 6-9px labels.

**Truth details.** Cards read "Due today" warm and "Due 2 days ago" red
from the server calendar frame the panel now also reads; the card checkbox
completes the task (selection moved to modifier-click and Space); adding a
task is an inline composer in the lane, not an Untitled task under a panel
that steals the screen; milestones toggle from a diamond on the card with
a real optimistic path (the flag previously had none anywhere).

**Task numbers.** Every task carries a per-workspace counter (T-14) shown
in the panel header. Allocation is an atomic MAX+1 subquery inside the
INSERT with a partial unique index as the concurrency backstop
(drizzle/0021, receipt-backed; applied to production through the new
dispatch-only db-migrate workflow with backup, isolated dry run, and a
tasks-migration-execution/1 receipt). The hex id remains the stable key.

**Deliberately deferred.** Forty micro-interaction sites are catalogued in
tasks/docs/DELIGHT_CATALOG.md and stay unanimated until the operator's
reference review assigns each family a treatment or an explicit restraint.

## Review surface

The Phase 1 Tasks redesign is preserved as an isolated, fixture-backed review lab. It is not production Tasks data and it does not write to the Tasks database. The preview is deployment-protected by the existing Vercel project controls.

- Lab: [Open the Tasks design lab](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=a&view=board&dataset=normal&density=compact&mode=default)
- Deployment inspector: [Vercel deployment](https://vercel.com/ethanmcn2013-1730s-projects/tasks-redesign/dpl_6xdJ8scZzVUAeFFt4XChjeyffbJ8)
- Source branch: `feat/option-b-signal-shell`
- Source commit: `b49d530`

## Saved design set

All three directions are available across Board, List, Timeline, and Calendar views:

- Option A — [Board](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=a&view=board&dataset=normal&density=compact&mode=default) · [List](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=a&view=list&dataset=normal&density=compact&mode=default) · [Timeline](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=a&view=timeline&dataset=normal&density=compact&mode=default) · [Calendar](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=a&view=calendar&dataset=normal&density=compact&mode=default)
- Option B — [Board](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=b&view=board&dataset=normal&density=compact&mode=default) · [List](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=b&view=list&dataset=normal&density=compact&mode=default) · [Timeline](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=b&view=timeline&dataset=normal&density=compact&mode=default) · [Calendar](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=b&view=calendar&dataset=normal&density=compact&mode=default)
- Option C — [Board](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=c&view=board&dataset=normal&density=compact&mode=default) · [List](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=c&view=list&dataset=normal&density=compact&mode=default) · [Timeline](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=c&view=timeline&dataset=normal&density=compact&mode=default) · [Calendar](https://tasks-redesign-9d300zh45-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=c&view=calendar&dataset=normal&density=compact&mode=default)

## Review contract

The lab uses deterministic normal-density fixtures and session-only interactions. Review the options for hierarchy, schedule visibility, density, empty/loading/error states, and interaction confidence. No option has been selected as the production direction yet; the next human gate is `SELECT A`, `SELECT B`, `SELECT C`, or `SELECT HYBRID`.

Saved: 2026-07-16 · deployed as a Vercel preview from the isolated Tasks design-lab branch.

Refreshed: 2026-07-17 · the preview now builds from `feat/option-b-signal-shell`: Option B carries the Signal two-level navigation shell (product rail plus projects sidebar) and the brief drops its milestones panel.

**T·97 refinements (tasks PR #35):** the workspace title in the brief is now editable inline (renameBoardAction, per workspace); the Projects sidebar gained an Add project control (createProjectAction — creates a workspace with owner membership and switches to it); the room view bar dropped the redundant second search, the result count, and the Live dot, and unified its Share/overflow buttons to the lab tool-button style; the scope pill was retired from the Studio Bar. 46/46 browser evidence, Axe clean.
