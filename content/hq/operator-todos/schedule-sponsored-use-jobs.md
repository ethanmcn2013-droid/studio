---
id: schedule-sponsored-use-jobs
title: Set CRON_SECRET so the sponsored-use job can run
status: open
priority: P2
blocking: false
why: The nightly job is written and scheduled, but it answers 401 until the shared cron secret exists, and the day-30 sealing cadence it protects is unforgiving once missed.
href: /hq/account-review
date: 2026-07-27
---

The nightly job now exists at `/api/cron/sponsored-use` and is scheduled in
`vercel.json` for 06:20 UTC. The three steps run in one handler, in the only
safe order — roll up closed days, seal day-30 bands, then sweep expired events —
because sweeping first would delete evidence nobody had counted yet, and events
cannot be recovered.

Two things stand between it and running.

**1. `CRON_SECRET` is not set.** The route uses the same bearer check as
`/api/cron/access-reconcile`. Vercel only sends the header when the variable
exists, so until it does the job answers 401 every night. This is the one thing
that needs you.

**2. The entitlements credentials.** Once the secret is set, the job returns a
clean skip (`entitlements-not-configured`) rather than an error until the
sponsored-use migration is applied. That is tracked separately as
`apply-sponsor-requests-migration`.

## Why the cadence matters

A workspace's day-30 band spans days 25 to 35 after its first action, and raw
events are deleted at 35 days. When a band closes, its oldest day is 10 days
old, so there is real slack — but only while the job runs. If sealing falls
more than **20 days** behind, bands begin closing on days whose events are
already gone and those cohorts seal `indeterminate`: excluded from both
numerator and denominator, permanently, because the evidence is unrecoverable.

That is the honest outcome and it is never reported as a zero. It is still a
hole, so `assessCadence` in
`src/lib/account/instrumentation/sealing.ts` reports the gap and the number of
at-risk cohorts rather than letting it be discovered in a venue's report months
later.

## Steps

1. Set `CRON_SECRET` on the studio Vercel project. Any high-entropy value.
2. Confirm one run: it should answer `200` with
   `skipped: "entitlements-not-configured"` until the migration lands.
3. After the migration, confirm a run reports a sweep and a sealing cadence.
4. Mark this done once a nightly run is clean.

Until all of this runs, Account Usage renders `unavailable`, which is accurate.
