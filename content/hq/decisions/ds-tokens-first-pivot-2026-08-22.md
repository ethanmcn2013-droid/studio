---
id: ds-tokens-first-pivot-2026-08-22
title: signal-ds pivots to a tokens-first contract; primitives freeze as reference
category: Product
date: 2026-08-22
status: Active
reviewDate: 2027-02-22
relatedObjects: [Signal Design System, signal-ds, Signal Tasks, Signal Notes, Signal Timeline, Signal, ds-foundation elevation 2026-08-22]
---

## Decision

`signal-ds` is a **tokens-and-governance package**, not a component library.
The supported surface is `tokens/tokens.css`, `tokens/tailwind.css`, the
`ds-check` drift gate, and the nine system docs. The sixteen React primitives
and `foundation.css` are frozen reference: deprecated for new adoption,
behavioural fixes only, promotion back onto the release surface requires a
second genuine React consumer (the prove-it-twice rule in governance doc 08).

Executed as four founder-approved changes on 2026-08-22:

1. ds-foundation `pivot/tokens-first-contract` — README/governance/changelog realigned, exports marked deprecated, 2.2.0 prepared.
2. app `pivot/ds-token-swap` — tokens imported from `signal-ds@^2.1.0`; vendored `src/ds/tokens.css|tailwind.css` deleted; `theme-overrides.css` stays app-owned.
3. studio `pivot/ds-token-swap` — same swap for the marketing site.
4. signal-motion — pin advances 2.0.1 → 2.1.0; MOT-009 barrel workaround retires.

## Why

The ds-foundation elevation found what the system actually does, not what it
says: three repos consume the tokens (app and studio via vendored copies,
signal-motion via npm) and zero repos, files, or classes consume any primitive.
The July plan — publish to npm, then swap each repo's vendored copies for the
dependency — had been satisfied on the publish half since 2026-07-02/16 with no
swap ever landing. ADOPT cost 3–5 agent-weeks plus permanent release overhead
for zero visible payoff pre-launch; FOLD destroyed working multi-repo sharing.
PIVOT finishes the July plan and aligns the published contract with observed
reality at ~1–2 days total.

## Consequences

- Token changes now flow one way: PR here → version → repointed imports light up in every repo at once. No more hand-synced copies.
- The npm package must publish 2.2.0 for the registry metadata to match the contract (operator-todo `publish-signal-ds-2-2`); until then consumers correctly pin `^2.1.0`, whose token values are identical.
- If marketing or any second React surface genuinely needs shared components post-launch, promote them into signal-ds incrementally under prove-it-twice — the frozen reference implementations are the starting point.
- App-side duplication the package never prevented (SuiteLoader ×2, friendlyError ×3, Notes bypassing primitives/toast) remains app-repo work per the app elevation findings; it does not reopen this decision.
