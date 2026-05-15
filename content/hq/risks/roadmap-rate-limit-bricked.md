---
id: roadmap-rate-limit-bricked
title: Signal Roadmap prod has no Upstash env, so the rate limiter denies 100% of workspace/project/source writes.
category: Product
likelihood: High
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-05-18
---

## Mitigation

Confirmed 2026-05-15 via `vercel env ls production` on the linked `roadmap` project (prj_3OGGF…): only TURSO + Clerk vars present, no `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. `rate-limit.ts` deliberately fail-closes in production when Upstash is unconfigured, so every `createWorkspaceAction`, `createProjectAction`, and `saveProjectSourceAction` call on the live site returns "Too many requests" and fails — the product's core write path is dead in prod. R·4 widened the surface by adding a limit to `createProjectAction` (the slate is otherwise net-safe).

Operator chose to provision Upstash rather than soften the fail-closed policy (the alternative — falling back to the in-memory limiter when Upstash was never configured — was rejected to keep distributed brute-force protection intact). Operator action: create an Upstash Redis instance (free tier is sufficient), then the agent sets `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` on the Roadmap Vercel project (Production) via `vercel env add` and triggers a redeploy. No code change. Write paths stay bricked until both vars land and prod redeploys. Same fail-closed pattern likely affects any other suite product whose `rate-limit.ts` runs unconfigured in prod — worth a sweep when this is closed.
