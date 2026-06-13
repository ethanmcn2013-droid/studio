# Suite Consolidation — Decision Record

Date: 2026-05-17
Status: **Decided (conditional) — build gated, not started**
Decision owner: Ethan
Convened: strategy + ux-director + creative-director + architect (parallel review), PM synthesis

---

## The question

"Consolidate the four products (Tasks / Timeline / Notes / Signal) system-wise into
one signed-in system with instant, zero-load jumps between products — still presented
as separate products, and marketed that way." Trigger observation: Timeline's board is
"just a kanban" and Tasks already has a better one; repeated views look like an oversight.

## The reframe (load-bearing)

The question bundles four separate decisions:

| # | Sub-decision | Verdict |
|---|---|---|
| 1 | Unify the sign-in (one session, no second auth wall) | **Yes — highest leverage, cheap** |
| 2 | Make cross-product jumps *feel* instant (shared shell + prefetch + same-tab) | **Yes — S-tier illusion, no re-platform** |
| 3 | Collapse 4 repos into one platform / one DB | **No — XL, collides with live work; defer or never** |
| 4 | *Market* "one system, instant jump" as a headline | **No headline; build the craft, don't sell it** |

The felt instant-jump is a property of #1 + #2, not #3. A monorepo/DB merge is **not**
required to get the experience.

## Director positions (converged independently)

- **Strategy:** One workspace branded as four. Consolidate the runtime, never market it
  ("if you can't describe it without sounding like ClickUp, don't say it"). Hard condition:
  public Timeline stays a **no-account, forwardable** surface — it must not be dragged
  behind auth, or the lead-product story fractures. Gate behind ≥1 paid venue pilot.
- **UX:** Real pain is the *second sign-in*, not reload latency. Venue coordinator switches
  contextually, not rapid-fire. Fix: one Clerk session, SuiteLauncher → same-tab, URL-passed
  context. Auth fragmentation already forces hacks (Signal joins on email, not clerk_id).
- **Creative:** Yes only if the inter-product transition is a brand primitive — a dot-morph
  shared element that travels the jump and re-tunes to the destination gesture. Ships **with
  v1 or not at all**; deferring it = "Linear with a Signal logo."
- **Architect:** Consolidate shell + auth only; defer platform & DB. Option (a) staged.
  One Clerk app + `.signalstudio.ie`-scoped cookie is the real unlock (and forces a one-time
  re-auth). Monorepo mid-flight = the documented deploy footgun at 4×.

## Resolved tension: market it vs build it

Strategy and Creative directly conflicted. Resolution (PM): **build the dot-morph transition
(Creative), never headline "instant jump / one system" (Strategy).** A transition users
*discover* reinforces the brand; a banner that sells it erodes the moat. Ship the craft, stay
quiet about it.

## Two-kanban question

Not true duplication. Tasks board = private granular execution. Timeline view = public,
no-account, milestone-level direction ("public IS the architecture" — locked refusal). Same
shape, different altitude, different audience. **Do not merge.** Cheap fix: relabel Timeline's
internal markdown editor so the altitude is legible ("Edit your public timeline"). Perception
bug, not structural.

## Sequenced plan

| Phase | Action | Tier | Gate |
|---|---|---|---|
| 0 | Clear Timeline Upstash prod blocker (live outage, unrelated, outranks this) | S | Now — operator |
| 1 | Let the 3 live context windows (venue / entitlements / front-door) land + quiesce | — | Hard prereq for any repo-structural work |
| 2 | One Clerk app, `.signalstudio.ie` cookie. Scheduled solo cutover, one-time re-auth | L | After Phase 1 |
| 3 | SuiteLauncher → same-tab + cross-product prefetch + shared shell + **dot-morph transition shipped with it** | M | With Phase 2 |
| 4 | Turborepo / one platform | XL | Only if a venue pilot pays. Else never |
| 5 | DB unification | XL | Never, unless a concrete product requirement forces it |

## Make-or-break verifications (owned by whoever builds)

1. Dot-morph holds 60fps on a mid-range Android **before** it is called a feature.
2. Public Timeline proven no-auth + forwardable **on a branch** before the Clerk merge commits.

## PM dissent (recorded)

The Clerk cutover is genuinely dangerous: Vercel-only keys, CSP-unvalidatable locally, all
sessions invalidate, prod-only human verification. Doing it speculatively — zero paid pilots,
three live sessions — is the wrong sequencing even though the destination is right. Adopt the
plan; do not start before Phase 1 clears and a pilot is in motion.

## Not committed

This file is an untracked working-tree artifact. The studio branch carries live parallel
sessions (`product-switcher.tsx`, `reveal-*`, `venues`, `pricing` all modified). Commit owed
once those sessions quiesce — surgical staging only, do not blind-commit.
