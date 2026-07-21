---
id: migration-p08-007-gdpr-before-redirects
title: Keep old account pages un-redirected until unified per-module data export and delete exist
status: open
priority: P1
blocking: true
phase: Consolidation Phase 8
why: The unified app's settings page does not yet purge Notes/Timeline/Signal data on account deletion. Redirecting the old account pages away before that exists would weaken the right-to-erasure.
href: /hq/decisions
date: 2026-07-21
---

## Steps

1. Recommended default: at Stage C, redirect everything EXCEPT the old /app/account routes - they keep serving on the old deployments (each app still owns its own export/delete).
2. Alternative: build per-module export+delete into the unified /app/settings first, verify against each module database, then redirect account pages too.
3. Needed before Stage C account-route redirects only; Stage B is unaffected.
