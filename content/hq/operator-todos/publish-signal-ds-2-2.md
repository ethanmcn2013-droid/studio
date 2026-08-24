---
id: publish-signal-ds-2-2
title: Publish signal-ds 2.2.0 (tokens-first contract) through GitHub Actions trusted publishing
status: open
priority: P2
effort: quick
blocking: false
phase: DS pivot 2026-08-22
why: The registry still advertises the component-library description; 2.2.0 carries the tokens-first contract metadata and changelog.
href: /hq
date: 2026-08-22
recommended: "On github.com/ethanmcn2013-droid/signal-design-system → Actions → 'Publish signal-ds' → Run workflow with version 2.2.0 (trusted publishing is already configured from the 2.1.0 release)."
alternatives: ["Merge pivot/tokens-first-contract first, then dispatch; the workflow verifies package.json version matches the input", "Keep 2.1.0 as latest — consumers are unaffected until a token change needs a release"]
trigger: "After ds-foundation pivot/tokens-first-contract merges to main."
links: ["../decisions/ds-tokens-first-pivot-2026-08-22.md", "publish-signal-ds-2-1.md"]

---

## Steps

1. Merge `pivot/tokens-first-contract` into main on `ethanmcn2013-droid/signal-design-system`.
2. Actions → **Publish signal-ds** → Run workflow → version input `2.2.0`.
3. Confirm the workflow's immutable-version guard passes and publish succeeds.

## Done when

- `npm view signal-ds dist-tags.latest` returns `2.2.0`.
- Registry description reads "tokens, the generated Tailwind theme, the drift gate, and the system docs…".
