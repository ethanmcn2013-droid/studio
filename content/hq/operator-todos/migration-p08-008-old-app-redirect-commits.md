---
id: migration-p08-008-old-app-redirect-commits
title: Author, test and deploy the three old-app redirect commits for Stage C
status: open
priority: P1
blocking: true
phase: Consolidation Phase 8
why: The Stage C redirects live in the notes/timeline/signal repos, not the unified branch. They do not exist yet and Stage C cannot happen without them.
href: /hq/decisions
date: 2026-07-21
---

## Steps

1. Engineering task (can be delegated back to the migration programme): add next.config redirects per the runbook section-3 map to each of the three old apps, excluding marketing, never-retire routes, and (per P08-007) the /app/account routes.
2. Deep-link-test each on a Vercel preview before deploying.
3. Deploy at the Stage C window, not before.
