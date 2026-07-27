---
id: schedule-sponsored-use-jobs
title: Schedule the sponsored-use rollup and the day-30 sealing job
status: open
priority: P2
blocking: false
why: Both jobs are written and tested, but nothing runs them; the sealing job in particular has a hard cadence, and missing it turns real retention into indeterminate.
href: /hq/account-review
date: 2026-07-27
---

Phase B is built. The daily rollup and the day-30 sealing job exist, are unit
tested, and have no schedule. Neither can run until the entitlements
credentials land, so this sits behind
[apply-sponsor-requests-migration](/hq/action-center).

**The sealing cadence is a real constraint, not a preference.** A workspace's
day-30 band spans days 25 to 35 after its first action, and raw events are
deleted at 35 days. At the moment a band closes, its oldest day is 10 days old,
which is comfortably inside retention — but only if the sealing job runs at
least every 24 days. Miss that and bands seal as `indeterminate`, which is
excluded from both numerator and denominator. That is the honest failure and it
is never a zero, but it is a permanent hole in that cohort: the events are gone
and cannot be recomputed.

Daily is the sensible cadence for both. Nothing here needs to be clever.

## Steps

1. Apply the migration first. Without the tables there is nothing to roll up.
2. Schedule the daily rollup to run after 06:00 venue-local for closed days.
   Europe/Dublin is the default calendar; `sponsors.reporting_timezone`
   overrides it per venue when that is ever populated.
3. Schedule the day-30 sealing pass. Daily, and never less often than every
   24 days.
4. Schedule the 35-day event sweep. It must run *after* the rollup for a day,
   never before.
5. Confirm one venue produces a daily row, then mark this done.

Until all of this runs, Account Usage renders `unavailable`, which is accurate.
