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

## Eng progress (2026-06-23)

- **tasks: DONE.** `tasks/src/lib/ratelimit.ts` ships a gated + fail-open
  limiter (REST-API twin of analytics' SDK version) wired as a per-user burst
  cap on the interactive AI actions (draft reply, summarize thread). It is a
  no-op until step 2 lands, then enforces automatically with no deploy. Tune
  via `TASKS_AI_RATE_LIMIT` / `TASKS_AI_RATE_WINDOW`.
- **notes, roadmap: still TODO** — no limiter wired yet; provisioning unblocks
  it but eng must still apply it in those repos.
