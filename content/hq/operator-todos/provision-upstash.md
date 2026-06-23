---
id: provision-upstash
title: Provision Upstash Redis on notes, tasks, and roadmap
status: open
priority: P0
blocking: true
phase: Phase 1
why: Rate limiting only exists in analytics today — abuse, signup spam, and AI-cost amplification are unthrottled elsewhere.
href: /hq/health
date: 2026-06-23
---

## Steps

1. Vercel -> Integrations -> Upstash -> add a Redis database for each of notes, tasks, roadmap.
2. Confirm `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` are injected into each project.
3. Eng lifts the shared limiter from `analytics/src/lib/ratelimit.ts` and applies it; verify limits enforce once env is present.
