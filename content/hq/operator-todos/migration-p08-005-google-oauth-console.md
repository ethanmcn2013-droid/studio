---
id: migration-p08-005-google-oauth-console
title: Google OAuth console update - only if Notes calendar goes forward
status: done
priority: P2
blocking: false
phase: Consolidation Phase 8
why: Notes calendar-spawn is feature-flagged OFF in production. If it ever ships from the unified app, its Google OAuth redirect URI must be re-registered.
href: /hq/decisions
date: 2026-07-22
---

## PARKED 2026-07-22 — no action now
The Notes calendar feature stays OFF. Its OAuth + cron routes currently live on the old Notes deployment, which is being retired; nothing uses them (flag off, no connections). Resolved as parked.

If the calendar feature is ever turned on from the unified app: port the calendar routes (notes src/app/api/calendar/* + the daily cron) into the unified app behind NOTES_CALENDAR_SPAWN_ENABLED, then in Google Cloud Console add the unified app callback URL (https://app.signalstudio.ie/api/calendar/google/callback) as an authorized redirect URI. Only then flip the flag.

## Steps

1. No action now. If the calendar feature is turned on post-cutover: add the unified app's callback URL in Google Cloud Console and migrate the connect/callback routes.
2. Until then the old Notes deployment keeps the routes (flag off, inert).
