---
id: apply-signal-surfaced-items-migration
title: Apply the surfaced_items migration to the Signal Turso DB
status: open
priority: P1
blocking: false
phase: Competitive-steal wave 1
why: Until it runs, briefing carry-overs cannot age ("still waiting — day 3") and the aging half of Signal PR #8 stays dormant. Dismissals and the all-clear work regardless.
href: https://github.com/ethanmcn2013-droid/signal/pull/8
date: 2026-07-01
---

## Steps

1. Merge Signal PR #8 (all-clear destination + dismiss-sticks + carry-over aging).
2. From the analytics repo: `turso db shell <signal-db> < drizzle/0003_surfaced_items.sql`.
3. While there, confirm `drizzle/0002_briefing_feedback.sql` was applied — the dismiss-sticks read depends on that table existing; the code is fail-safe either way.
4. Next quiet morning, open signal.signalstudio.ie/app and confirm the all-clear composition renders; the day after a carried item surfaces, confirm the "still waiting — day 2" note appears.
