---
id: product-handoff-review-lab
title: Product Handoff three-direction review lab
product: Signal Studio
category: Core
status: Shipping
priority: High
effort: Medium
impact: High
owner: Ethan
principleAlignment: 98
---

## Review status

Phase 1 is code-complete. The production Product Handoff remains unchanged and
the four product heroes are source-locked to the coordinated homepage-relay
baseline in commit `5edc460`. The next gate is Ethan's explicit selection of
Living Artifact, Provenance Rail, Editorial Cause, or a precisely described
hybrid.

The panel recommends **Option A — Living Artifact**. It is the only direction
where the motion itself explains the suite: one real piece of work changes
product grammar while its source, date, owner, and provenance remain legible.

## Review surface

- Route: `/__design-lab/product-handoff`
- Protected preview:
  `https://studio-v4wxn0txe-ethanmcn2013-1730s-projects.vercel.app/__design-lab/product-handoff?option=a&product=walk&progress=0.5&motion=auto&viewport=desktop`
- Vercel inspector:
  `https://vercel.com/ethanmcn2013-1730s-projects/studio/2EkyfgpEKJEfvYY21rYmSPvujs4U`
- Query contract: `option=a|b|c`, `product=notes|tasks|timeline|signal|walk`,
  `progress=0..1`, `motion=auto|reduce`, and
  `viewport=auto|mobile|tablet|desktop`
- Access: development or `SIGNAL_ACCESS_MODE=review`; canonical production
  hosts return 404; metadata is `noindex`
- Review controls: deterministic scrubber, pause/replay, quarter-speed
  playback, reduced motion, breakpoint switching, and the four-page Product
  Walk

## Directions

- **A — Living Artifact:** one work object lifts from its source, carries the
  exact relevant fact and provenance, then docks in the next product grammar.
- **B — Provenance Rail:** the same adjacent handoff is mapped onto a quiet,
  architectural suite route.
- **C — Editorial Cause:** declarative type states cause and effect while real
  product evidence resolves beneath it.

## Evidence

- 168 deterministic screenshots cover A/B/C, all four products, 0/50/100
  frames, four target viewports, and reduced motion at mobile and desktop.
- Four motion recordings cover Living Artifact on mobile and all three
  directions in Product Walk.
- Playwright passed 147 of 147 checks in Chromium, WebKit, and Firefox,
  including accessibility, product truth, keyboard visibility, containment,
  stable layout, reduced motion, and Product Walk sequencing.
- The 390×844, 4× CPU profile recorded a 16.8ms worst frame, no frame over
  34ms, no long task, no layout shift, and no animated layout.
- TypeScript, the full 306-test suite, design-system drift, the Handoff
  contract, the optimized build, and scoped lint all pass.
- The production smoke gate verified that canonical and forwarded canonical
  hosts return 404. Vercel production now fails closed independently of access
  mode, while protected preview review access remains available.
- Full-project lint remains blocked by five pre-existing violations in four
  locked or unrelated files; none is in the review lab.

## Release contract

Do not replace the production `ProductHandoff({ product })`, modify a hero, or
deploy the selected system to the live routes before Ethan selects a
direction. After selection, preserve the current production interface and
connect the chosen scene progress to scroll with Motion's reduced-motion path.
The 9.5 release score applies to the selected system; the alternative studies
remain review evidence, not production dependencies.

Saved: 2026-07-28 · Protected preview READY; founder selection pending.
