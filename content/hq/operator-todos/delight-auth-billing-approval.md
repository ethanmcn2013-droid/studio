---
id: delight-auth-billing-approval
title: Decide whether the Delight Layer may touch sign-in and checkout
status: open
priority: P2
blocking: false
phase: Delight Layer
why: Phases 4 and 5 are the only unbuilt parts of the Delight Layer, and both are held closed because they change authentication and payment.
href: /hq/action-center
date: 2026-07-27
---

The Delight Layer shipped Phases 1, 2, 3 and 6 across Tasks and Studio. Two
phases remain, and neither is unfinished by accident. The plan in
`component-lab/DELIGHT_LAYER_PLAN.md` records both as gated on founder
approval, because each changes a surface where a mistake costs trust or money.

- **Phase 4 — First Impressions and Access.** A one-time-code treatment for
  sign-in, two-factor, and guest codes. This changes the authentication path.
- **Phase 5 — Revenue.** A morphing checkout at the paywall. This changes the
  payment path.

Nothing is blocked while these stay closed. The suite behaves exactly as it
does today.

## Steps

1. Decide whether either phase should be opened at all. The honest default is
   no: both surfaces are load-bearing and the current versions work.
2. If Phase 4 opens, say which factors are in scope and whether guest codes are
   included, so the change does not quietly widen into an auth rewrite.
3. If Phase 5 opens, confirm it is presentation only and that no price, plan, or
   checkout amount moves with it.
4. Mark this done once both are either scheduled or deliberately retired.

Phases 7 and 8 were also deferred, but on brand and data-model grounds rather
than approval. They need no decision here.
