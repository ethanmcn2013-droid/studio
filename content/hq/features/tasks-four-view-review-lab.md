---
id: tasks-four-view-review-lab
title: Signal Tasks four-view review lab
product: Signal Tasks
category: Core
status: Review
priority: High
effort: Medium
impact: High
owner: Ethan
principleAlignment: 95
---

## Review surface

The Phase 1 Tasks redesign is preserved as an isolated, fixture-backed review lab. It is not production Tasks data and it does not write to the Tasks database. The preview is deployment-protected by the existing Vercel project controls.

- Lab: [Open the Tasks design lab](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=a&view=board&dataset=normal&density=compact&mode=default)
- Deployment inspector: [Vercel deployment](https://vercel.com/ethanmcn2013-1730s-projects/tasks-redesign/AoqPdxmy3pbjUhHb5XYkRPb33tsq)
- Source branch: `codex/tasks-four-view-design-lab`
- Source commit: `48b2e0b`

## Saved design set

All three directions are available across Board, List, Timeline, and Calendar views:

- Option A — [Board](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=a&view=board&dataset=normal&density=compact&mode=default) · [List](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=a&view=list&dataset=normal&density=compact&mode=default) · [Timeline](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=a&view=timeline&dataset=normal&density=compact&mode=default) · [Calendar](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=a&view=calendar&dataset=normal&density=compact&mode=default)
- Option B — [Board](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=b&view=board&dataset=normal&density=compact&mode=default) · [List](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=b&view=list&dataset=normal&density=compact&mode=default) · [Timeline](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=b&view=timeline&dataset=normal&density=compact&mode=default) · [Calendar](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=b&view=calendar&dataset=normal&density=compact&mode=default)
- Option C — [Board](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=c&view=board&dataset=normal&density=compact&mode=default) · [List](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=c&view=list&dataset=normal&density=compact&mode=default) · [Timeline](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=c&view=timeline&dataset=normal&density=compact&mode=default) · [Calendar](https://tasks-redesign-hfw039hea-ethanmcn2013-1730s-projects.vercel.app/__design-lab/tasks?option=c&view=calendar&dataset=normal&density=compact&mode=default)

## Review contract

The lab uses deterministic normal-density fixtures and session-only interactions. Review the options for hierarchy, schedule visibility, density, empty/loading/error states, and interaction confidence. No option has been selected as the production direction yet; the next human gate is `SELECT A`, `SELECT B`, `SELECT C`, or `SELECT HYBRID`.

Saved: 2026-07-16 · deployed as a Vercel preview from the isolated Tasks design-lab branch.
