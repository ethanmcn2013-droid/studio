---
id: migration-p08-002-stage-env-vars
title: Stage the unified app's environment variables in the tasks Vercel project
status: open
priority: P0
blocking: true
phase: Consolidation Phase 8
why: The unified app reads the existing product databases through renamed variables; without them staged, Stage A/B cannot run.
href: /hq/decisions
date: 2026-07-21
---

## Steps

1. Vercel -> tasks project -> Env Vars: add the runbook section-5 list (NOTES_*, TIMELINE_*, SIGNAL_ANALYTICS_*, SIGNAL_PREFS_*, NEXT_PUBLIC_TIMELINE_SITE_URL) in Preview scope now, Production scope before Stage B.
2. Values are the EXISTING per-product Turso credentials, renamed - no new infrastructure.
3. Confirm TASKS_API_URL is set on preview scope (self-origin).
