---
id: quality-gate-cannot-certify
title: The 9.5 quality gate cannot certify, and once could not even report
category: Product
severity: High
likelihood: Certain
status: Needs attention
owner: Ethan
date: 2026-08-17
relatedObjects: [app docs/wave/DECISIONS.md D-024, app docs/wave/DECISIONS.md D-029, app docs/wave/DECISIONS.md D-032, quality-council-ci-semantics, quality-gate-does-not-narrow, rule-on-95-gate-scope]
---

## Status, precisely

`Needs attention` is the nearest declared value and it understates half the picture.
The **reporting** failure is fixed and verified. The **certification** failure is
untouched and cannot be fixed by engineering. Read the status as "one half resolved,
one half open", not as a single dial.

## The risk

The 9.5 council gate is the instrument the north star's design priority is measured by.
It had two separate failures, and the first hid the second.

**Reporting.** `pnpm experience:council` exited 1 continuously from before the current
programme began, and the workflow marked the step `continue-on-error`, inside a required
check. So the required check reported green while the council failed inside it. Nobody
was lied to deliberately; the mask existed because the validator could not distinguish a
broken instrument from an honest failing verdict. The effect was the same either way — a
gate nobody could read, on the axis the company says it competes on.

**Certification.** Even repaired, the gate cannot pass. It needs 104 assessment units,
1,352 evidenced dimension scores and three independent reviewers per receipt, none of
which exist at current capacity.

## What changed on 17 August

The reporting half is fixed. The validator now separates a broken instrument (red) from
an honest NO-PASS or an aged-out baseline (green, with the verdict published in full),
and the mask is removed. The external baseline was re-reviewed rather than rebased by
hand — ten independent director lenses across seven surfaces, on current source, with
sixteen renders and sixteen accessibility runs behind it.

The result is on the record: **NO PASS, suite floor 6.8 against a 9.5 gate, zero vetoes.**
Nothing found was disqualifying on its own; the product is simply not at the bar yet,
everywhere. Pricing (7.34) and the Tasks views (7.55) are the weakest; landing (8.07) and
about (8.03) the strongest.

## What is still open

Certification, and it is a resourcing question rather than an engineering one. The gate
was explicitly not narrowed to fit available capacity — see
`quality-gate-does-not-narrow` — so the honest answer stays "not certified" until three
independent reviewers can cover 104 units.

**The standing rule:** no 9.5 claim may be made by anyone on the basis of the green CI
check. The gate's own not-certified output says so in its last line, because that is the
misreading this risk now exists to prevent.
