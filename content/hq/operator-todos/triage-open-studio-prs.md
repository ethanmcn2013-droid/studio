---
id: triage-open-studio-prs
title: Triage the eight pre-session studio PRs still open
status: open
priority: P1
blocking: false
effort: quick
phase: Phase 2
why: Eight PRs from before the 2026-08-12 session sit open against a main that has since cut the estate to eighteen pages; at least one targets a page that no longer exists, and every stale PR is a merge hazard for the next session.
href: https://github.com/ethanmcn2013-droid/studio/pulls
date: 2026-08-12
---

## The list (as of 2026-08-12)

- **#119** studio · contact — route enquiries by intent. **Almost certainly
  obsolete**: D5 (approved) deleted /contact and folded it into /about.
- **#117** studio · design — brand guidelines v2 review lab. Check against
  the estate cut — the `__design-lab` routes were deleted and deliberately
  404 now.
- **#121** feat(home): ship the live editorial proof relay.
- **#123** studio · interactions — make motion stoppable and truthful.
  Check overlap with the wave-7 motion contract work on the app side.
- **#136** HQ · the Tasks panel review, its blockers, and the risk it
  surfaced.
- **#138** S·161 · what actually enforces the north star.
- **#140** Fix I-011: register ids allocate under the lock.
- **#146** Update the preferred visual canon with selected hooks.

## Steps

1. Ten minutes: close the obsolete ones with a one-line reason, keep what
   still earns a rebase.
2. Anything kept needs `main` merged in before it can pass the up-to-date
   branch protection.
