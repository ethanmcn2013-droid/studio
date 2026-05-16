---
id: roadmap-rate-limit-bricked
title: Signal Roadmap prod has no Upstash env, so the rate limiter denies 100% of workspace/project/source writes.
category: Product
likelihood: High
impact: High
status: Blocked
owner: Ethan
reviewDate: 2026-05-20
---

## Mitigation

Status set to Blocked 2026-05-16 — this is not "needs attention", it is down. Confirmed 2026-05-15 via `vercel env ls production` on the linked `roadmap` project: only TURSO + Clerk vars, no `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. `rate-limit.ts` fail-closes in production when Upstash is unconfigured, so every `createWorkspaceAction`, `createProjectAction`, and `saveProjectSourceAction` on the live site returns "Too many requests". Roadmap's core write path is dead in prod.

Deliberately NOT cleared in this program-health pass: it is genuinely broken and clearing it would be a lie. It is operator-gated by design — the operator chose to provision Upstash rather than soften the fail-closed policy (in-memory fallback was rejected to keep distributed brute-force protection intact). It stays a critical until the env lands.

Operator action (the one manual step, ~5 min, free): create an Upstash Redis database via the Vercel Marketplace and connect it to the `roadmap` project. The Vercel↔Upstash integration auto-injects `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`. Then the agent confirms the vars and triggers a Production redeploy — no code change. Step-by-step lives in the operator action pack. Sweep owed when closed: any other suite product whose `rate-limit.ts` runs unconfigured in prod has the same latent failure.

## Notes

Critical, honest, operator-gated. Cleared only when Upstash is connected and prod redeploys green.
