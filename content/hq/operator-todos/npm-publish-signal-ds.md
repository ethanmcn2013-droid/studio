---
id: npm-publish-signal-ds
title: Create/auth an npm account so @signal/ds can publish as a public package
status: done
priority: P1
blocking: false
phase: SDS 2.0 rollout · Wave 0
why: Until npm auth exists, the five repos consume the design system via vendored token files — drift-gated but still copies; the package swap is one dependency line once publish works.
href: /hq
date: 2026-07-02
---

## Done — 2026-07-02

**`signal-ds@2.0.1` is live on the public registry** (https://www.npmjs.com/package/signal-ds). The founder created the npm account (`signalstudio`), enabled 2FA, and approved the publish; the package ships the tokens, the generated Tailwind theme, the sixteen primitives, the nine system docs, and the drift gate as a runnable bin (`npx signal-ds-check`).

Remaining agent work (not founder-gated): swap each of the five repos from the vendored `src/ds/` copies to the `signal-ds` dependency. Deliberately deferred from the publish night — each swap triggers a production deploy for zero visual change, and deploy quota was scarce (Notes was rate-limited). The swap happens per repo on its next natural touch: add the dependency, repoint the two `@import`s, delete `src/ds/` + `scripts/ds/`.

## Update — 2026-08-22 · swap executed

The deferred swap landed via the founder-approved **ds-tokens-first pivot**
(see `../decisions/ds-tokens-first-pivot-2026-08-22.md`): app and studio now
import `signal-ds/tokens.css` + `signal-ds/tailwind.css` from the npm package
(`^2.1.0`) with their vendored copies deleted; signal-motion advances its pin
2.0.1 → 2.1.0. The package itself pivoted to a tokens-first contract — the
primitives are frozen reference (nobody consumed them). Follow-up founder
gate: `publish-signal-ds-2-2.md`.
