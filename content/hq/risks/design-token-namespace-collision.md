---
id: design-token-namespace-collision
title: A vendored token remap silently changes what standard utility class names mean, and class-name-grep gates cannot see it.
category: Infrastructure
likelihood: High
impact: Medium
status: Monitoring
owner: Ethan
reviewDate: 2026-08-30
---

## Mitigation

Graded 2026-07-30, on discovery. The design system maps its semantic step scale
onto Tailwind's numeric spacing namespace for indices 1 through 12, so `min-h-11`
is 80px rather than the 44px that idiom means everywhere else, while 13 and up
fall through to stock Tailwind. Both scales run at once: `p-10` and `p-16` both
mean 64px, and `min-h-11` renders larger than `min-h-16`.

The dangerous part is not the remap, it is that it defeated every gate watching
it. `tasks/scripts/check-chrome-contract.mjs` asserts `h-10` with the message
"slim 40px bar" while the bar measures 64px, and it passes, because it greps for
a class name and never a computed value. Two Tasks accessibility contract tests
asserted index-11 tokens under messages promising 44px, and passed the same way.
The design system's own generator comment calls the output "the base-4 scale",
which is what the values are not. Four artifacts stated a pixel intent, none
delivered it, all were green.

Partial mitigation in place (Tasks, T·112): the 46 index-11 sizing utilities that
were tap targets now carry explicit `[44px]`, which is scale-proof.
`scripts/check-tap-target-scale.mjs` runs in `pnpm test` and fails on any new
index-11 sizing utility, with a shrink-only ledger. The three retargeted contract
assertions now name literal pixels rather than tokens.

Honest residual: this is mitigated in one product, for one index, by one gate.
Indices 7 through 10 and 12 stay remapped, covering roughly 501 uses across 108
files in Tasks, and Notes, Timeline and Signal vendor the same tokens with no
equivalent gate. The Signal briefing ledger still renders four controls at 80px.
The root fix is to stop emitting `--spacing-*` from the design system generator,
which is a per-product visual pass rather than a patch, tracked in decision
`spacing-scale-namespace-collision-2026-07-30`.

Likelihood High: the remap is still live, and `min-h-11` remains the class name a
developer reaches for when they want 44px. Impact Medium rather than High: the
failure mode is wrong geometry and silently false contract gates, not data loss
or a security boundary.

The transferable lesson, wider than spacing: **a gate that asserts a class name
cannot verify a pixel claim.** Any contract that states a measurement in prose
should assert the computed value. Applies to the chrome contract, the
accessibility contracts, and anything the quality council scores on geometry.

## Notes

Not closed. Reduced from silent to gated in Tasks for index 11 only. Recurs
wherever a vendored token layer redefines a name that already carries a
cross-ecosystem meaning, and wherever a gate greps source text to assert a
rendered value.
