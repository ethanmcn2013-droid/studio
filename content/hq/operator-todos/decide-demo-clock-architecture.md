---
id: decide-demo-clock-architecture
title: Decide how the demo workspace tells the time
status: open
priority: P1
blocking: false
effort: quick
phase: Phase 2
why: The review clock is pinned to 16 July and drifts a day further behind reality every day; Timeline's whole proposition is a countdown, and in the demo the countdown is wrong.
href: /hq
date: 2026-08-12
---

## The decision

The seed-data workspace lives on one pinned calendar
(`app/src/lib/review-suite-fixture.ts` · `reviewToday: "2026-07-16"`,
drift-guarded against `PINNED_REVIEW_CALENDAR_FRAME`). The 2026-08-12
closing review scored Timeline's copy 6.8 largely because the demo presents
past dates as future ("79 days to go" where the true figure is 52).

The session's closing fixes made the demo internally coherent — every
surface now reads the same pinned clock — but the clock itself still
diverges from the wall by a day per day.

Two honest options, one call:

1. **Date-relative fixture.** Milestone offsets stored as days-from-today,
   `reviewToday` derived at render. The demo is always true, but every
   materiality receipt, screenshot baseline and playwright attestation that
   seals fixture content must be re-cut, and determinism needs care
   (server and client must render the same derived day).
2. **Keep the pin, add a staleness gate.** A build-time check fails when
   `reviewToday` falls more than a few days behind now, forcing a scheduled
   re-pin plus receipt rebind (the rebind procedure is proven and scripted).

## Steps

1. Pick option 1 or 2.
2. Open a session with the decision; the rebind procedure lives in the
   design-programme memory and has been executed twice.
