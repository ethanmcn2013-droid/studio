---
id: quality-council-ci-semantics
title: The quality gate publishes in every state, and goes red only when the instrument is wrong
category: Product
date: 2026-08-17
status: Active
reviewDate: 2027-02-17
relatedObjects: [app docs/wave/DECISIONS.md D-029, app docs/wave/DECISIONS.md D-032, app docs/wave/COUNCIL_REPAIR_SPEC.md, app experience/QUALITY_COUNCIL_EVIDENCE.md, rule-on-95-gate-scope, quality-gate-does-not-narrow, app PR #151]
---

## Decision

`continue-on-error: true` is removed from the council step. The validator now
distinguishes three states itself, and only one of them is red.

| State | CI | Why |
|---|---|---|
| Certified | green | The instrument ran and the product cleared the bar. |
| Honest NO-PASS on the external baseline | green, verdict printed in full | True, expected, and not a defect. |
| Not yet certified, or baseline aged out of the current tree | green, every reason listed | Both happen by design. |
| Anything else | **red** | Validator cannot run, contract hash rotated, receipt or baseline tampered. |

## The problem it closes

The mask sat on a required check and collapsed a broken validator, an honest NO-PASS and
a stale baseline into one green tick. A gate that always fails is indistinguishable from
one that is never consulted — and a gate whose failure is hidden is worse than no gate,
because it looks like assurance.

The mask existed for a real reason: the validator could not tell those states apart, and
removing the flag before certification would have frozen main. Now it can tell them
apart, so the flag goes.

## The judgement inside it

**A stale baseline is deliberately not red.** An external review describes the tree it
read; every source merge moves the tree. Red there would mean no code could land without
first commissioning a ten-director review — the gate would stop the product in order to
protect the freshness of its own audit. It publishes loudly instead, naming both hashes.

## The line that matters most

The not-certified output ends by saying that no 9.5 claim may be made on its basis,
**including by citing the green check itself.** That sentence is the whole point: the
failure mode this decision guards against is somebody reading a green tick as a cleared
bar.

## Verification

Mutation-tested in both directions before it landed. Removing a director from the baseline
exits 1 with the structural errors named and the expected notes suppressed; restoring the
director exits 0.
