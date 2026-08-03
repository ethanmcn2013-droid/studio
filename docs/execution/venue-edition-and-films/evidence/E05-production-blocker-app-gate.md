# The `/app` gate blocker, fixed

**Date:** 2026-08-03 · **Package:** WP-08 (Wave 3), closed by the orchestrating session
**Branch:** `claude/wp08-couple` · **Not merged.** Founder review required.

---

## What was broken

The E05/E06 audit recorded this as the first of two production blockers, and it was the
one that mattered most: **nothing else in E05 was demonstrable until it landed.**

`src/app/app/layout.tsx:16` called `requireAppAccess()`. That function
(`src/server/require-app-access.ts:23`) is allowlist-only and redirects to `/waitlist`
when `isEmailAllowed(email)` is false.

The membership-aware extension written precisely to prevent this,
`requireAppAccessTasks()` (`src/server/app-access.ts:29`), was wired **inside** the layout,
at `src/components/app/tasks-runtime-shell.tsx:67`. The outer gate fired first and won.

`app-access.ts`'s own header comment describes the failure its misplacement permitted:

> an invited non-allowlisted user would accept the invite, burn the token, then bounce
> to /waitlist forever — worst-of-both.

I re-confirmed the defect on current `origin/main` before changing anything.

## The fix

`src/app/app/layout.tsx` now awaits `requireAppAccessTasks()`.

It is a strict superset of the function it replaces: identical allowlist fast path, plus a
fallback for a user holding a `workspace_members` row. It cannot make access more
restrictive than before.

## Why this also fixes the redeemed couple, not just the invited collaborator

The audit noted redemption "grants an entitlement and touches no allowlist", which left
open whether the membership fallback would catch a redeemed couple. It does, and I traced
it rather than assuming:

- `src/server/actions/comp.ts:206` calls `ensureUserProvisioned(userId)` **before**
  inserting the entitlement.
- `src/server/db/ensure-user.ts:108` runs
  `INSERT OR IGNORE INTO workspace_members (workspace_id, user_id, role)`.

So a redeemed couple holds a membership row by the time they reach the gate. Both routes in
are covered by one change.

## Verification

| Check | Command | Result |
|---|---|---|
| Types | `pnpm typecheck` | exit 0 |
| Full suite | `pnpm test` | **exit 0, zero failures**, 15 segments |
| Boundary test in isolation | `node --import tsx --import ./src/test/register-server-only.mjs --test src/modules/timeline/server/unpublished-timeline-boundary.test.ts` | 7 pass, 0 fail |

## The second finding, which is arguably worse than the blocker

Three tests written during this wave to prove the programme's central privacy promises
**were not registered in `package.json` and therefore never ran in CI**:

- `src/modules/timeline/server/unpublished-timeline-boundary.test.ts` — the venue cannot
  reach an unpublished Timeline
- `src/modules/signal/lib/briefing/wedding-briefing-selectivity.test.ts`
- `src/server/venue-never-a-collaborator.test.ts` — a venue never gains workspace access

A control that exists only in an unregistered file is the same defect class as R-028, where
D-011's rate floor ran in a test and nowhere else. As one verifier put it, deleting the
publish gate on main would have shipped green.

All three are now registered. `unpublished-timeline-boundary.test.ts` needed its own
segment carrying `--import ./src/test/register-server-only.mjs`; without it the file cannot
resolve `server-only` and reports as an error rather than a failure, which is how it would
have been missed a second time.

A fourth test was added to pin this fix: `src/server/app-gate-contract.test.mjs`. It asserts
against **source text on purpose** and says so in its own header. The defect here was never
a logic bug — `requireAppAccessTasks` was correct all along and was simply called in the
wrong place. Only the wiring can catch that, so only the wiring is asserted. The test does
not claim to prove access behaviour.

## What is NOT fixed, and why I did not fix it

**Blocker 2 — a couple can never get a Timeline workspace — remains open.**
`createWorkspaceAction` (`src/modules/timeline/server/actions/workspaces.ts:93`) still has
zero callers; `getCurrentWorkspace` returns `workspaces[0] ?? null`, which is null forever
in production, so `/app/timeline` renders a permanent empty state advising "Create a
workspace in Tasks first", which does nothing.

I left it deliberately. Wiring it requires deciding **when** a couple's Timeline is created
and **what it is seeded with**, and that decision reaches into the wedding template (E05.03)
and into the published artifact surface (E06), which is explicitly out of Wave 3 and blocked
on **R-031** — whether a sponsored couple's artifact belongs on the search-indexable `/p`
at all. Choosing a seeding policy here would pre-empt a founder decision that changes the
build. Timeline is the film's hero, so this should be the first thing Wave 4 takes up once
R-031 is answered.
