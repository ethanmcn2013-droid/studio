---
id: select-timeline-design-direction
title: Select the Signal Timeline design direction
status: open
priority: P1
blocking: true
phase: Timeline redesign · Phase 1
why: Phase 2 cannot alter the real owner, public, update, or detail surfaces until the founder selects A, B, C, or an exact hybrid.
href: https://roadmap-m7f3csrq3-ethanmcn2013-1730s-projects.vercel.app/__design-lab/timeline?option=b&surface=owner&dataset=wedding&density=normal&state=default&viewport=responsive&preview=working
date: 2026-07-18
action: "Review all three directions across all four surfaces, then record one exact selection command."
product: "Signal Timeline"
recommended: "A owner ledger + B public timeline + B shared update + B item detail, with C's Before/Now receipt only for real bucket moves."
alternatives: ["SELECT A — Quiet Direction Ledger", "SELECT B — Editorial Plan Room", "SELECT C — Signal Horizon", "SELECT HYBRID — followed by the exact components to combine"]
default: "Production Timeline remains unchanged and Phase 2 remains blocked."
consequence: "Without an explicit direction, implementation would collapse the review gate and risk mixing incompatible interaction and layout systems."
trigger: "After reviewing the protected Phase 1 lab and before any production Timeline redesign begins."
links: ["https://github.com/ethanmcn2013-droid/timeline/pull/24", "https://vercel.com/ethanmcn2013-1730s-projects/roadmap/3W6krhr15HicXNWQ5bSkNDxMDFyH", "../features/timeline-four-surface-review-lab.md"]
---

## Steps

1. Open Options A, B, and C in the protected review lab. Review each direction's Owner Plan, Public Timeline, Shared Update, and Item Detail surfaces.
2. Exercise the dataset, density, state, working/published, edit, move, hide, restore, delete, undo, publish, attribution, keyboard, and mobile controls. The lab is synthetic and cannot change production data.
3. Compare the tradeoffs: A is the strongest daily owner instrument, B is the strongest public and update system, and C is the strongest distinctive movement idea.
4. Review the recommended synthesis: A owner ledger + B public timeline + B shared update + B item detail, with C's Before/Now receipt only for real bucket moves. This is a recommendation, not a selection.
5. Record exactly one of the following commands in the Timeline decision log:

```text
SELECT A — Quiet Direction Ledger
SELECT B — Editorial Plan Room
SELECT C — Signal Horizon
SELECT HYBRID — followed by the exact components to combine
```

6. For `SELECT HYBRID`, name every selected surface or bounded component. Phrases such as “mostly B” or “take the best parts” are not implementation decisions.
7. Keep this task `open` until the exact selection, rationale, date, and Phase 2 boundaries are recorded in the Timeline decision log.

## Done when

The founder's exact selection command is recorded, the selected surfaces or components are unambiguous, and Phase 2 can begin without interpreting taste or silently combining directions.

## Current evidence

- All three directions clear the 9.5 category floor; consensus scores are A 9.78, B 9.81, and C 9.76.
- 18 model checks, 52 browser checks, 94 screenshot captures, and 7 account-boundary checks pass.
- The protected preview is READY and Vercel Authentication is scoped to Preview deployments.
- Production Timeline routes and data remain unchanged.
