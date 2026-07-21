---
id: migration-p08-004-signal-email-home
title: Decide the long-term home of Signal's briefing emails
status: open
priority: P1
blocking: false
phase: Consolidation Phase 8
why: The email cron still runs on the old Signal deployment (by design). Retiring that app requires moving email; keeping it costs nothing.
href: /hq/decisions
date: 2026-07-21
---

## Steps

1. Recommended default: keep the old Signal deployment alive indefinitely as an email-only service (cron + Resend + unsubscribe). Zero migration risk; unsubscribe links in sent emails keep working forever.
2. Alternative: port cron+email into the unified app at Stage D (engineering task, needs its own verification pass).
3. Needed by Stage D only.
