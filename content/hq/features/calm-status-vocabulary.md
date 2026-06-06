---
id: calm-status-vocabulary
title: Calm status vocabulary
product: Signal Studio (suite-wide)
category: Foundation
status: Shipping
priority: High
effort: Medium
impact: High
owner: Ethan
principleAlignment: 98
relatedCampaign: Founder LinkedIn Build-in-Public
relatedMetric: First-five-seconds legibility for non-technical owners
---

## Notes

A suite-wide Tier 1 move from the calm-coordination brief: every product
defaults to a small, human status vocabulary — `To do · Moving · Waiting ·
Needs Attention · Done` — replacing PM-flavoured words like "In progress",
"In review", "Backlog", and "Blocked". The goal is that a venue owner can
open any Signal Studio product and know what each column means without
reading docs.

**Shipped (2026-06-06):**
- Signal Tasks default board lanes — `doing` renders as "Moving", `review`
  renders as "Waiting" (T·81). LaneId enum and per-workspace column
  renames untouched.
- Signal Tasks personal landing — `/app/my-tasks` is now "My week", a
  five-section editorial briefing (Today · Needs attention · Waiting
  on you · This week · Done this week) instead of a lane-grouped table
  (T·82). Restated the brief's claim that the personal view should
  feel like an editorial briefing, not a dashboard.

**Next:**
- Signal Roadmap — DB status enum currently uses `blocked`; replace with
  `waiting` (semantic-equivalent) and surface "Needs Attention" as a
  derived signal (Tier 3 attention layer) rather than a manual state.
- Signal Notes — note status / checklist vocabulary audit.
- Signal Analytics — align "Overdue / Waiting too long / At risk"
  attention cards to the same language.

**Refusal:** "Needs Attention" stays a *derived* state on the analytics
layer, not a fifth manual lane. Adding a 5th lane would touch board drag,
templates, exports, and CSV across four repos for a state every product
can compute from idle days, missing owners, and overdue children. The
spec's own restraint principle — "choose the simpler, calmer option" —
favours derived over manual here.
