---
id: migration-p08-005-google-oauth-console
title: Google OAuth console update - only if Notes calendar goes forward
status: open
priority: P2
blocking: false
phase: Consolidation Phase 8
why: Notes calendar-spawn is feature-flagged OFF in production. If it ever ships from the unified app, its Google OAuth redirect URI must be re-registered.
href: /hq/decisions
date: 2026-07-21
---

## Steps

1. No action now. If the calendar feature is turned on post-cutover: add the unified app's callback URL in Google Cloud Console and migrate the connect/callback routes.
2. Until then the old Notes deployment keeps the routes (flag off, inert).
