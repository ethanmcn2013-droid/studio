---
id: roadmap-rate-limit-bricked
title: Signal Timeline prod has no Upstash env, so the rate limiter denies 100% of workspace/project/source writes.
category: Product
likelihood: Low
impact: High
status: Resolved
owner: Ethan
reviewDate: 2026-05-17
---

## Resolution

Cleared 2026-05-17. Operator provisioned Upstash; both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are present on the `roadmap` project's Production environment, and the live prod deployment is newer than the env (so it is baked in). Verified end-to-end, not assumed: a live round-trip against the prod credentials ran the exact limiter pipeline — `PING` → `PONG`, `INCR` → 1, `EXPIRE … NX` → 1, `TTL` → 60 — HTTP 200. The fail-closed branch is no longer reachable in prod; `create-workspace`, `create-project`, and `save-source` writes go through the Redis sliding-window path. Timeline's core write path is live.

Cross-suite sweep — done 2026-05-17, clean. The latent fail-closed failure is Timeline-specific. Tasks: no rate limiter (only a comment naming Upstash as a future substrate). Signal: no rate limiter. Notes: `api/capture/email/route.ts` has an in-memory throttle that fails *open* (no Upstash, no prod deny branch) and is additionally auth-gated by `NOTES_CAPTURE_INBOUND_SECRET` — different, weaker (per-lambda) protection model, but not this blocker. No other product gates writes on a prod fail-closed Upstash check.

## Mitigation (historical)

Status set to Blocked 2026-05-16 — this is not "needs attention", it is down. Confirmed 2026-05-15 via `vercel env ls production` on the linked `roadmap` project: only TURSO + Clerk vars, no `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`. `rate-limit.ts` fail-closes in production when Upstash is unconfigured, so every `createWorkspaceAction`, `createProjectAction`, and `saveProjectSourceAction` on the live site returns "Too many requests". Timeline's core write path is dead in prod.

Deliberately NOT cleared in this program-health pass: it is genuinely broken and clearing it would be a lie. It is operator-gated by design — the operator chose to provision Upstash rather than soften the fail-closed policy (in-memory fallback was rejected to keep distributed brute-force protection intact). It stays a critical until the env lands.

Operator action (the one manual step, ~5 min, free): create an Upstash Redis database via the Vercel Marketplace and connect it to the `roadmap` project. The Vercel↔Upstash integration auto-injects `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`. Then the agent confirms the vars and triggers a Production redeploy — no code change. Step-by-step lives in the operator action pack. Sweep owed when closed: any other suite product whose `rate-limit.ts` runs unconfigured in prod has the same latent failure.

## Notes

Critical, honest, operator-gated. Cleared only when Upstash is connected and prod redeploys green.
