---
id: hero-direction-pick
title: Pick the studio landing hero treatment (rebalance the two competing heroes)
status: open
priority: P1
blocking: true
phase: P1 punch-list
why: the umbrella landing has two stacked hero moments competing for attention; the rebalance can't ship until you pick a direction.
href: /
date: 2026-07-06
---

## Context

P0 ground-truth (live screenshots in `audit/p0-shots/`, verdict in
`audit/P0_GROUND_TRUTH_2026_07_06.md`) settled the contested item #3: the plan's
recon was stale. Live `main` has **two stacked hero moments** — the giant
`signal studio.` wordmark lockup (`RevealLoadingShowcase`) up top, then a large
vertical gap, then the value-prop block (pill + "Project management for the 80%
not in tech." + product wordmarks in `RevealHero`). They compete for primary
attention; the gap is worst at laptop width (906). Your instinct #3 was correct,
not already-shipped.

The pill motion (issue #4) already shipped — a soft indigo aura now sweeps the
"Arriving" pill (S-dispatch pending). This to-do is only the hero **hierarchy**
pick, which you flagged as thinking-out-loud, so it stays gated on you.

## The three candidates

- **A — Value-prop hero (boldest).** Demote the giant wordmark to a quiet brand
  mark (or fold it into the nav lockup) and promote "Project management for the
  80% not in tech." to the single hero. Closest to your "headline-only, no card"
  instinct. Biggest change; strongest single message; loses the wordmark drama.
- **B — Unified lockup (recommended).** Keep the wordmark but tighten the
  `clamp(520px,62dvh,720px)` + `16px 32px 76px` levers so wordmark + pill +
  headline read as ONE above-the-fold unit and the mid-gap disappears. Keeps
  brand equity, fixes the actual crowding. Lowest risk.
- **C — Coupled.** Wordmark stays the hero; the value-prop line binds
  immediately beneath it (no rule, no gap) as the supporting deck.

## Steps

1. Look at `audit/p0-shots/studio-hero-906-fold.png` (the crowding) and the
   candidate mockups in `audit/hero-candidates/` (if built).
2. Pick A, B, or C (or ask for a combined treatment).
3. Eng implements the pick, council-checks, ships to `main` and curl/screenshot-verifies.
