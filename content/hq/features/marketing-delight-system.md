---
id: marketing-delight-system
title: Public-page interaction system
product: Signal Studio
category: Core
status: Shipped
priority: High
effort: Medium
impact: High
owner: Ethan
principleAlignment: 99
---

## Current state

The canonical suite homepage and the six public product and company pages —
Notes, Tasks, Timeline, Signal, Pricing, and About — share one production
interaction contract.

Navigation state is immediate and interruptible. The product switcher measures
its active route rather than guessing, and route changes are no longer held
behind exit animation. Keyboard users can open the Products panel with
ArrowDown and enter its first destination directly. Press, hover, and focus
feedback use the same restrained grammar across shared actions.

The four product heroes remain the dominant expressive moments on their pages.
Their source was deliberately left untouched. The Product Handoff also retains
its reviewed centre-completion window and reduced-motion contract.

The homepage now brings those same four product proofs into the suite story.
Notes, Tasks, Timeline, and Signal each begin once their chapter reaches the
reading zone. A chapter pauses when it leaves the viewport; reduced-motion
visitors receive its complete settled evidence. This makes the first visit
show the product work without creating a second, competing animation system.

Pricing's previous perpetual gestures are bounded acknowledgements that play
once when relevant. About reserves its only authored reveal for the founder
signature. Neither page uses generic section reveals, card lifts, count-ups,
parallax, or ambient status motion.

## Governance

The source record is
[`docs/experience/MARKETING_DELIGHT_LEDGER.md`](../../../docs/experience/MARKETING_DELIGHT_LEDGER.md).
It catalogs 144 interaction seams, including explicit stillness
decisions and rejected candidates. The shared timing, easing, accessibility,
interruption, and hierarchy rules live in
[`docs/experience/MARKETING_MOTION_CONTRACT.md`](../../../docs/experience/MARKETING_MOTION_CONTRACT.md).

The governing principle is simple: motion earns its place by communicating
state, continuity, responsiveness, or explanation. Expressive motion remains
rare enough to carry meaning.

The homepage extension and its panel decision are recorded in
[`docs/experience/HOMEPAGE_PRODUCT_MOTION_RELEASE_REVIEW.md`](../../../docs/experience/HOMEPAGE_PRODUCT_MOTION_RELEASE_REVIEW.md).

## Release evidence

- Six canonical routes reviewed at desktop and mobile widths.
- The suite homepage's four real product proofs verified at desktop and mobile
  widths, including offscreen pause and reduced-motion settlement.
- Keyboard entry, Escape closure, outside-click closure, rapid interruption,
  active-route measurement, and immediate navigation covered in browser tests.
- Pricing and About one-shot gestures verified as finite.
- Reduced motion verified on all final states.
- Accessibility checks cover every changed surface.
- Existing Product Handoff centre-completion coverage remains green.
- Typecheck, unit tests, design-system enforcement, targeted lint, and the
  production build pass before release.

Dispatch: S·156 · 2026-07-29.
