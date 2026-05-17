# Phase 4 — Turborepo Migration Plan (NOT executed; trigger-gated)

Date: 2026-05-17
Status: **Plan only. Not executed.** Trigger to execute: a venue pilot pays
(SC·1 condition). Phase 5 (DB merge) remains "never unless a concrete product
requirement forces it" — explicitly out of scope of this plan.

## Why this is a plan, not a commit

Phases 0–3 shipped the consolidation value: one production Clerk instance on
`*.signalstudio.ie` (Phase 2 — shared session) + same-tab/prefetch/preconnect/
dot-morph instant-jump (Phase 3). That is ~80% of the felt benefit at near-zero
risk. Phase 4 (collapse 5 repos into one Turborepo) is an XL re-platform whose
value over the shipped state is marginal and whose blast radius is all 5 prod
apps at once. It must be staged and verified, never big-banged. Phase 5 (merge
the separate Turso DBs) is rejected: it collapses the Analytics read-only
isolation boundary and the Notes→Tasks cross-DB edge — a security/correctness
regression, not a refactor.

## Preconditions before any step runs

1. A venue pilot has paid (SC·1 trigger) — engineering spend is justified.
2. A 2–3 day window with no parallel sessions and no pending prod incidents.
3. Full prod DB backups (Turso) for all 6 databases, restore tested.
4. A rollback decision: each app keeps its standalone repo importable until the
   monorepo has served prod for 2 weeks clean.

## Staged plan (each stage independently revertible)

- **S1 — Scaffold (no app code moved).** New repo `signal-suite`, Turborepo +
  pnpm workspaces. `apps/` empty, `packages/` empty, shared `tsconfig`/`eslint`/
  `tailwind` presets only. CI green on an empty build. Zero prod impact.
- **S2 — One app, shadow-deployed.** Move *Analytics* in first (lowest traffic,
  read-only DB, smallest blast radius). It deploys from the monorepo to a
  *preview* alias only; prod still served by the standalone repo. Verify parity
  for 72h.
- **S3 — Promote Analytics; repeat per app.** Notes → Roadmap → Tasks, one at a
  time, each: monorepo preview → 72h parity → flip prod alias → 1 week soak →
  archive standalone repo. Never two apps mid-flight.
- **S4 — Shared packages.** Only after all 4 are in: extract the genuinely
  duplicated code (product-urls, suite-launcher, design tokens, entitlements
  reads) into `packages/*`. Until S4 each app keeps its own copy — divergence is
  acceptable cost vs. coupling risk during migration.
- **S5 — Studio umbrella last.** It carries HQ/atlas tooling; move only after the
  4 products are stable in the monorepo.

## Explicitly NOT in this plan (Phase 5)

Merging the per-product Turso databases. Keep them separate. The shared
`signal-entitlements` DB already proves the federated-read model; one DB is not
required and breaks isolation. Revisit only if a concrete product requirement
(not tidiness) forces it, with its own decision record.

## Abort conditions

Any of: a prod parity failure that isn't root-caused in 24h; auth/session
regression (the suite just recovered from a suite-wide auth outage — do not
re-risk it); DB integrity doubt; Vercel build-fanout making one app's failure
block all four. On abort, the standalone repos are still authoritative until S3
flip — revert is "stop, keep serving from standalone."

## Effort

S1: S. S2–S3: L (per app, ~0.5–1 day each with soak). S4: M. S5: M.
Total realistic: 1.5–2.5 focused weeks with soak windows. This is why it is
pilot-gated: it is not session-completable and its value is marginal over the
shipped Phase 2+3 state.
