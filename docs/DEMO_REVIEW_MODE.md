# Demo / Review Mode — Signal Studio (suite)

This is the canonical, suite-level explanation of the access-mode architecture.
Each product repo (`notes`, `tasks`, `analytics`/Signal, `roadmap`/Timeline)
ships a `DEMO_MODE.md` with its own specifics; this document is the shared
contract they reference.

## Why this exists

Before any taste / design improvement cycle can run, Signal Studio needs to be
**visually inspectable, navigable, and reviewable** — by collaborators, motion
partners, lenders, and by Claude Code / Fable — without an auth wall in the way.
But "just remove auth" would be a security mess and would risk exposing real
user data. So instead we built a controlled, intentional **Demo / Review Mode**
that sits cleanly alongside the production auth model.

## The four access modes

A single env-driven layer (`src/lib/access-mode.ts`, identical in every repo)
resolves the current mode from `SIGNAL_ACCESS_MODE` (server) and
`NEXT_PUBLIC_SIGNAL_ACCESS_MODE` (client):

| Mode | Auth gate | Identity | Data |
|------|-----------|----------|------|
| `production` | Clerk required | Real Clerk user | Real Turso DB (per-tenant) |
| `development` | Keyless dev bypass (pre-existing) | Dev fallback identity | Real DB / dev |
| `demo` | **None — `/app/*` is public** | Synthetic demo user | **In-memory seed only** |
| `review` | Same as demo | Synthetic demo user | In-memory seed only |

`review` is functionally identical to `demo`; it exists as a distinct label so
review deployments and louder dev messaging can be targeted separately.

Resolution order: explicit `*_ACCESS_MODE` wins; then `NEXT_PUBLIC_DEMO_MODE=true`
maps to `demo`; otherwise the default is `production` under
`NODE_ENV=production`, else `development`.

## The safety invariant (why this isn't a security hole)

**Demo / review never unlock the real database.** They swap in a synthetic
identity that is bound to an in-memory seed dataset:

- the proxy (`src/proxy.ts`) skips the Clerk `/app` gate in demo/review — one
  branch; the production code path is byte-for-byte unchanged;
- the server auth layer resolves to a constant `DEMO_USER`/`DEMO_WORKSPACE`;
- every read short-circuits to the product's `server/demo/*` (or reused demo
  data) **before any `db` call**.

So even if the flag were accidentally set on a build that still carries DB
credentials, there is **no real tenant data reachable** on the demo path — the
queries that would touch real rows are never executed. Turning the flag off
restores the exact production gate with zero other code changes.

## How to enable

**Locally** (any repo):
```bash
cp .env.example .env.local
# set both:
SIGNAL_ACCESS_MODE=demo            # or review
NEXT_PUBLIC_SIGNAL_ACCESS_MODE=demo
npm run dev                        # studio uses pnpm
```

**Preview deployment (Vercel):** set both env vars to `demo` (or `review`) on
the preview environment for that product. No Clerk or Turso keys are required
for the app to render — preview deploys work standalone.

To run the whole suite in review mode, set the two vars on all five Vercel
projects (studio, notes, tasks, signal, timeline).

## How to disable / restore production auth

Set both vars back to `production` (or remove them — production is the default
in a production build) and redeploy. Nothing else to undo.

## Demo data — where it lives

| Product | Demo data | Persona |
|---------|-----------|---------|
| Notes | `notes/src/server/demo/notes-demo.ts` | Wedding-venue duty manager's notebook |
| Tasks | `tasks/src/server/demo/tasks-demo.ts` | The Orchard — events board |
| Timeline | `roadmap/src/lib/roadmap/demo-data.ts` | Product roadmap workspace |
| Signal | `analytics/src/lib/briefing/mock-source.ts` | Wedding 2026 daily briefing |

All seed content is realistic, premium, no-lorem-ipsum, and supports the brand
story — calm coordination for normal people. No real person's data is used.

## The review hub

`https://signalstudio.ie/review` (`studio/src/app/review/page.tsx`) is a single
index linking directly to all four product `/app` surfaces and the marketing
pages. It is `noindex`. Use it as the entry point for any design-review cycle.

## The development banner

`src/components/dev-banner.tsx` (in each repo) renders a subtle, dismissible
"In development — expected launch September 1st." pill outside production.
Configurable via `NEXT_PUBLIC_DEV_BANNER_TEXT`; hidden entirely in production.

## Security considerations / remaining technical debt

- **Writes** in demo mode still resolve `requireUser()` to the demo identity and
  may reach a write action; the review surfaces are read-focused, so demo write
  round-trips aren't seeded. If interactive demo writes are wanted later, branch
  the write actions to an in-memory/no-op store per repo.
- Secondary surfaces that lazily call server actions on interaction (cross-
  workspace search, onboarding, settings, feedback) are inert in demo — they
  return empty/no-op rather than crashing. That's correct, not broken.
- The four repos carry parallel copies of `access-mode.ts` and `dev-banner.tsx`
  (no shared package in this multi-repo setup). Keep them in sync; this doc is
  the canonical shape.
