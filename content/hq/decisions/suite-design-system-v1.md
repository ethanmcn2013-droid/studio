---
id: suite-design-system-v1
title: Ship the suite design-system v1 across all five Signal Studio repos in one paired sweep: one indigo, paper whi…
category: Brand
date: 2026-05-13
status: Active
reviewDate: 2026-06-13
relatedObjects: [Signal Studio, Signal Tasks, Signal Timeline, Signal, Signal Notes, /brand asset hub]
---

## Decision

Ship the suite design-system v1 across all five Signal Studio repos in one paired sweep: one indigo, paper white on Studio/Tasks/Timeline/Signal, off-black ink at #111111, five wordmark gestures (broadcast / heartbeat / advance / tick / settle).

## Reason

The umbrella + four products were running drift-prone token sets — warm-cream paper on every surface, ink at #18181b, per-product wordmark gestures that had diverged from one another over time (Timeline one-shot slide, Signal static, Notes caret blink). The design canvas locked a single spec: one indigo across the house, white paper on suite-register products, off-black at #111111, and five canonical motions (broadcast 2.6s, heartbeat 1.6s, advance 2.6s, tick 2.4s, settle 3.2s). Five paired commits ensure no in-between state where the wordmarks talk past each other.

## Alternatives considered

Roll out per-product over five weeks (drift between repos); apply tokens only and defer motion (visual seam between umbrella and products); freeze the warm cream on Tasks (breaks the suite-paper rule).

## Risks

Page-level shadow/cream surfaces may read off-register against the new white paper until each page gets walked through. Notes diverges intentionally (warm-cream notebook locked 2026-05-10) — the wordmark is the seam. Older per-surface mark CSS (.studio-mark, .reveal-stack per-product gestures) still coexists with the new .brand-mark — page-by-page replacement is owed.

## Notes

Shipped 2026-05-13. Five commits: Studio de1c02c (tokens + .brand-mark + /brand asset hub with 18 SVG downloads + email-sig text), Tasks 699b587 (tokens + heartbeat 1.6s), Timeline dadb825 (tokens + advance 2.6s), Signal dd1019d (tokens + new .signal-dot tick 2.4s), Notes ddb4da1 (wordmark settle 3.2s — notebook surface untouched per locked aesthetic). Post-deploy audit caught /pricing rendering prior-cycle wordmark motions; fixed in 19d3166 (pricing-mark animations aligned + Brand nav prefetch=false to silence 18 preload warnings). /brand is live at signalstudio.ie/brand with downloadable SVGs (18 logos) and email signatures. Owed follow-up: page-by-page .studio-mark deprecation as surfaces get retouched.
