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

## Verdict — SELECT B (2026-07-17)

The founder selected **Option B, Editorial Project Room** (also the panel's top score, 9.50) and Phase 2 shipped to production Tasks the same day (Tasks dispatch T·93, tasks PR #31): workspace brief on all four views with an operator-editable purpose line, lane and group narration, timeline commitments strip, and the selected-day calendar agenda — on production machinery, with 46/46 production-build browser evidence at both breakpoints and four reviewed materiality receipts. The lab below remains the reference record of all three directions.

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
