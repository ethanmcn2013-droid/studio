---
id: migration-p10-001-production-db-tokens
title: Paste the four production database credentials so Notes, Timeline and Signal go data-live
status: open
priority: P0
blocking: true
phase: Consolidation Phase 10
why: The unified app is live on tasks.signalstudio.ie, but the production credentials for the notes/timeline/signal databases are stored as unreadable "sensitive" values, so they could not be copied programmatically. Until pasted, those three modules show error states for signed-in users (Tasks is fully live; nothing is lost; old apps still serve their own users).
href: /hq/decisions
date: 2026-07-21
---

## Steps

1. Turso dashboard: for each of the three production databases (the notes, roadmap/timeline, and analytics instances, plus the signal-analytics prefs instance), copy the database URL and create a token.
2. Vercel -> tasks project -> Environment Variables -> add for Production: NOTES_DATABASE_URL + NOTES_AUTH_TOKEN, TIMELINE_DATABASE_URL + TIMELINE_AUTH_TOKEN, SIGNAL_ANALYTICS_DATABASE_URL + SIGNAL_ANALYTICS_AUTH_TOKEN, SIGNAL_PREFS_DATABASE_URL + SIGNAL_PREFS_AUTH_TOKEN. (Preview scope is already staged with the preview databases.)
3. Redeploy the tasks project (or push any commit). The three modules go data-live instantly.
4. Then Stage C (redirects from the old product apps) can proceed - reply "go stage C" and it will be executed per the runbook.
