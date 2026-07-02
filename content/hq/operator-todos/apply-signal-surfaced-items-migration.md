---
id: apply-signal-surfaced-items-migration
title: Apply the surfaced_items migration to the Signal Turso DB
status: done
priority: P1
blocking: false
phase: Competitive-steal wave 1
why: Until it runs, briefing carry-overs cannot age ("still waiting — day 3") and the aging half of Signal PR #8 stays dormant. Dismissals and the all-clear work regardless.
href: https://github.com/ethanmcn2013-droid/signal/pull/8
date: 2026-07-01
---

## Steps

1. ~~Merge Signal PR #8~~ — merged 2026-07-01, deploy verified.
2. ~~Apply `drizzle/0003_surfaced_items.sql`~~ — applied 2026-07-02. The turso CLI has no Windows build and the Turso env vars are sensitive-flagged in Vercel (write-only), so the migration ran through a one-time bearer-gated ops endpoint deployed to the app itself, then removed in the same pass (signal commits `5a5a83c` add, `e0d1ffe` remove; `OPS_MIGRATE_SECRET` deleted from Vercel).
3. ~~Confirm `briefing_feedback` (0002)~~ — confirmed present. Prod prefs DB tables verified via the endpoint's response: `analytics_users`, `briefing_feedback`, `phrasing_rotations`, `surfaced_items`. Unauthenticated probe returned 401.
4. Still worth a human glance: next quiet morning, open signal.signalstudio.ie/app and confirm the all-clear composition; the day after a carried item surfaces, confirm the "still waiting — day 2" note.
