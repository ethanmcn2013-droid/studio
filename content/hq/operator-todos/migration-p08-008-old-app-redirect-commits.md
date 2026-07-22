---
id: migration-p08-008-old-app-redirect-commits
title: Author, test and deploy the three old-app redirect commits for Stage C
status: done
priority: P1
blocking: false
phase: Consolidation Phase 8
why: The Stage C redirects live in the notes/timeline/signal repos, not the unified branch. They do not exist yet and Stage C cannot happen without them.
href: /hq/decisions
date: 2026-07-21
---

## DONE 2026-07-22
next.config `redirects()` added and deployed to all three old apps (main):
notes (f9bf96b) /app -> tasks/app/notes; timeline (f7428f1) /app -> tasks/app/plan,
/app/audience -> /app/plan/audience, /app/plan/:slug preserved; signal (cea4d0f)
/app + tabs -> tasks/app/brief, /app/onboarding + /app/settings/notifications mapped.
Verified live (308s to the unified app). Excluded per plan: /app/account and
/app/settings/account (GDPR — P08-007), all marketing, and never-retire routes
(/u/:token, /api/unsubscribe, timeline public pages). No regressions.

## Steps

1. Engineering task (can be delegated back to the migration programme): add next.config redirects per the runbook section-3 map to each of the three old apps, excluding marketing, never-retire routes, and (per P08-007) the /app/account routes.
2. Deep-link-test each on a Vercel preview before deploying.
3. Deploy at the Stage C window, not before.
