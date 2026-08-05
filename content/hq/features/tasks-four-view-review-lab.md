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

## T·126 — the panel review and its repairs (2026-07-31, tasks PR #85)

An eight-lens design panel reviewed the shipped product against its own
contracts — typography, interaction, information architecture,
accessibility, voice, cross-view consistency, motion-contract compliance,
and the phone build — working from captures of the running app, the source,
and live browser probes. It raised 88 findings; an adversarial verification
stage re-opened every citation and re-ran the probes, folding six as
duplicates and correcting five severities. **Nothing was refuted. 82 held,
five of them blockers**, which is the honest measure of how far a surface
that passed its own gates had drifted from what it promised.

**The five blockers.** Six create affordances silently destroyed the task
(graded as risk `silent-write-failure`). The detail panel declared
`aria-modal` and never took focus, leaving keyboard and screen-reader users
operating dimmed controls behind it. That same panel still spoke the retired
four-lane status model, so a task claimed by a custom column showed the wrong
status and Waiting was unreachable — and its assign menu offered the design
lab's fixture cast against live data. A reference to `--spring-press`, a
variable defined nowhere in the repo, invalidated the entire transition
declaration on cards, schedule bars and calendar chips, so the completion
feedback both motion documents describe as shipped did not exist. And the
board crushed its own column names to one or two characters, because the
editable description shared their single no-wrap row.

**What the repairs corrected beyond them.** Completion is a circle and
selection a square everywhere (the two had been pixel-identical twins sitting
side by side); one milestone colour across board, schedule and calendar; done
work reads as done on the calendar; the schedule's due ticks follow the
shared amber/red grammar instead of painting everything alarm-red; "Schedule"
replaces every leaked "Timeline" label beside a product named Timeline; one
name for the personal queue, one create verb, one finish verb, one priority
scale without P-codes; day-month dates everywhere (the brief had been
printing US-format `08/01` two inches from the same date written `1 Aug`);
read-only surfaces stopped rendering disabled invitations to act. The phone
build lost a tablet strip that leaked through a cascade-layer gap, gained a
Schedule that paints today on arrival and calendar controls that actually
drive the day list, and a planning rail that overlays rather than crushing
the workspace to 110px.

**The grace pass.** Every font size in the four view modules moved onto the
brand ramp — 335 declarations, an 11px floor, nothing beneath it — and
uppercase eyebrows took their full 0.12em. The working-tools stylesheet was
829 lines of which the live surfaces were five classes running at 9px; it is
now 67 lines on the ramp with the motion contract's anchored-layer entrance.
The tools bar gained a single accent act: Add task alone wears the brand.
Schedule bars now preserve the grab offset, so a bar dropped where the hand
put it stays there; the view tabs became real links with per-view titles.

**Verification.** Typecheck, lint, 402 unit and contract tests, production
build, design-system drift, the full attested browser suite (128 cases across
mobile, tablet, desktop and wide) and an axe re-scan reporting zero
violations on all four views and with the detail panel open — where three
had stood before.

**The lesson worth keeping.** Every one of these surfaces was green. The
gates verified structure, coverage and receipts; none of them could see that
a create button destroyed work, that a modal never took focus, or that a
column could not say its own name. **A panel of independent readers found in
one morning what a year of passing gates could not**, which argues for making
adversarial review a periodic instrument rather than a one-off.

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
