---
id: vercel-build-rate-limit
title: Vercel build rate limit — only Notes remains blocked (SDS Wave 4 + loading canon stuck there)
status: open
priority: P0
blocking: true
phase: Phase 1
why: Four of the five projects recovered on 2026-07-02 evening — the SDS 2.0 wave merges rebuilt signal, studio, tasks, and timeline, carrying the stranded loading-canon commits live (verified in production CSS). Notes is the one project still rate-limited ("retry in 24 hours"), so notes.signalstudio.ie serves the pre-canon, pre-Wave-4 build — the retired green look stays live until it rebuilds.
href: https://vercel.com/ethanmcn2013-1730s-projects
date: 2026-07-02
---

## Steps

1. Decide: upgrade the Vercel account to Pro (removes the Hobby build cap) or accept the wait (notes' window resets ~2026-07-03 16:30 UTC).
2. After the reset (or upgrade), redeploy **notes** latest main (`a8a7ba3` or later) — dashboard redeploy or an empty commit. Failed deploys do NOT auto-retry. The other four projects need nothing.
3. Longer term: the concurrent autonomous committers push many small commits per day across five projects; consider batching pushes or using `[skip ci]`/ignored build steps for docs-only commits to stay under the cap.

**Update 2026-07-02 (SDS Wave 4):** Notes' fold-in to the suite register (dispatch N·30/S·109) is merged to main and build-verified locally; only this deploy gate keeps it off production.
