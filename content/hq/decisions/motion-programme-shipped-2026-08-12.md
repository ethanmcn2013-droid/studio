---
id: motion-programme-shipped-2026-08-12
title: Motion ships under one contract — the anchored-layer family, the Notes capture beats, the arrival settle, and one theme crossing
category: Product
date: 2026-08-12
status: Active
reviewDate: 2026-11-12
relatedObjects: [app design-wave 7, app CHANGELOG T·141, app docs/design/TASKS_DELIGHT_MOTION_CONTRACT.md, app docs/DELIGHT_CATALOG.md, motion-proof-first-canon]
---

## Decision

The motion park is lifted and motion ships, governed by the written contract
rather than by taste. Design-wave 7 spends it in five places and records a
verdict for every candidate site it touched or deliberately left alone.

What ships:

1. **One entrance for every anchored layer.** Nine menus, pickers and
   popovers previously appeared instantly. They now grow from the control
   that opened them — scale 0.98 to 1 with opacity, in at the fast token,
   out faster — with opacity only under reduced motion. Escape is a cut,
   because a keyboard command is an instruction and the contract forbids
   animating one. Two implementations, one set of numbers, held together by
   a single primitive module.
2. **Notes moves on its own verbs.** A saved note arrives in its final
   place, a decided review row leaves with the list closing behind it, a
   promotion resolves its chip where it happened, and the reading pane
   crossfades. Keep and Delete move identically: what happened is carried by
   the words and the state, never by the animation.
3. **A product arrives instead of cutting.** The surface settles once on
   opacity as it replaces its loader, applied after the swap has landed, so
   navigation stays immediate and the surface is usable from its first
   frame.
4. **The theme crosses as one material.** A change of theme lends the whole
   document one scoped colour transition for the length of the change and
   then takes it back. Four named properties, never a blanket transition,
   never on first paint, never under reduced motion.
5. **The Timeline artifact plays its entrance once a session.** Returning to
   a page is not a reason to watch it assemble again.

Roughly twenty-five hardcoded curves and durations became the system's own
tokens in the same wave, so the next author cannot drift from the contract by
accident.

## Reason

The delight catalog (2026-07-28) had 66 candidate sites and no verdicts, and
the standing rule was to catalog rather than animate until each entry had a
decision. Wave 6's panel then scored Notes motion 7.4, the lowest number on
any surface, because the capture product had no motion on any of its own
verbs. The contract already named the primitives; wave 7 spends them against
the catalog's families rather than site by site, which is what makes the
result one system instead of a collection of gestures.

## Risks

An eight-seat panel graded the wave and its adversarial pass confirmed four
faults the wave itself introduced, each since fixed and re-measured: an exit
animation that set `inert` blurred the control the reader had just pressed
and dropped keyboard focus to the top of the document; a motion target left
unguarded inverted reduced motion, producing more travel with the preference
on than off; a guard written as an inline script never ran on client
navigation, because React does not execute those on a client render; and two
nested loading boundaries could each announce the same arrival, settling the
surface twice. All four are the same class of risk: motion added at the edges
of the framework's lifecycle, where types and tests do not reach. Motion work
needs measured browser evidence, not a passing build.

Reduced motion remains absolute, and the app carries a blanket
reduced-motion rule that currently overrides per-component variants — the
rendered result is compliant, but authored intent and shipped behaviour
disagree, which is recorded as a follow-up.

## Notes

No surface reached the 9.5 gate in this wave: Tasks 8.84, Notes 8.95,
Timeline 8.91 as panel means, with 8.4 the lowest seat on each. Notes motion
moved 7.4 to 9.0. The operator-visible record is the app dispatch entry
T·141; the per-site verdicts live in the app's `docs/DELIGHT_CATALOG.md`.
