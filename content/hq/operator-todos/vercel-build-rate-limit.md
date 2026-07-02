---
id: vercel-build-rate-limit
title: Vercel Hobby build rate limit is blocking production deploys (loading canon stuck)
status: open
priority: P0
blocking: true
phase: Phase 1
why: All five projects hit "Deployment rate limited — retry in 24 hours" on 2026-07-02 ~16:30 UTC. The loading-canon commits are merged to main but never deployed — notes, tasks, timeline, and signal are still serving the pre-canon build. Anything pushed before the window resets will also silently fail to deploy.
href: https://vercel.com/ethanmcn2013-1730s-projects
date: 2026-07-02
---

## Steps

1. Decide: upgrade the Vercel account to Pro (removes the Hobby 100-deploys/day cap) or accept the ~24h wait (window resets ~2026-07-03 16:30 UTC).
2. After the window resets (or upgrade), redeploy each project's latest main from the Vercel dashboard, or push an empty commit per repo — the failed commits do NOT auto-retry.
3. Longer term: the concurrent autonomous committers push many small commits per day across five projects; consider batching pushes or using `[skip ci]`/ignored build steps for docs-only commits to stay under the cap.
