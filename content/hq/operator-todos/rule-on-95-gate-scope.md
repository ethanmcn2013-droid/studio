---
id: rule-on-95-gate-scope
title: Rule on the 9.5 gate's scope — 104 assessment units against solo review capacity
status: done
priority: P0
effort: deep
blocking: true
phase: Quality
why: Three documents cite this decision file and it did not exist. The 9.5 certification gate demands 104 assessment units across 13 dimensions — 1,352 evidenced dimension scores with three independent reviewers each — which exceeds the review capacity that actually exists. Until it was ruled on, the gate could be quietly narrowed to fit, which would have destroyed its only value.
href: /hq/quality
date: 2026-08-17
cleared: 2026-08-17 — Founder ruled the gate does not narrow. Capacity and per-unit visual-baseline approval become scheduled work; the measure is untouched. Recorded as app D-030 and studio decision quality-gate-does-not-narrow.
---

## The question, as three documents asked it

`COUNCIL_REPAIR_SPEC.md` (F3), `QUALITY_COUNCIL_EVIDENCE.md` and `VISUAL_BASELINES.md`
each cite this file. None of them could, because it was never written — the decision had
been referenced into existence without being taken.

State B of the quality council needs, none of which exist today:

- 104 assessment units (notes 28, tasks 40, timeline 36), each at 50/52 or better
- 1,352 dimension scores, each with a rationale of 20 characters or more **and** positive
  evidence
- three genuinely independent reviewers per receipt, each owning at least one dimension
- twelve artifacts per unit, four of them PNGs, each against an **approved** visual
  baseline — and zero approved visual baselines exist

`VISUAL_BASELINES.md` argued that the scope question and the baseline-approval question
are one question and should be asked once. They were.

## The ruling

**The gate does not narrow.** Not by unit count, not by dimension count, not by sampling,
not by nominating "representative" units. R-H08 already makes narrowing inside a
programme an automatic veto; the reason is worth stating in plain words rather than as a
rule number: *a bar you clear by lowering it certifies nothing.* The instrument's entire
value is that it is the true standard. The first time it is adjusted to fit the capacity
available, it stops being evidence and becomes decoration — and everyone downstream who
reads "certified" is then reading a number about our schedule rather than about the
product.

What changes is the plan, not the measure. Certification is scheduled work carrying a
named capacity requirement — three independent reviewers across 104 units — and until
that capacity exists the honest answer is the one the gate already gives: not certified.

**Visual baselines are approved per unit, at the moment that unit is first reviewed.
Never in a batch.** A bulk approval of baselines nobody has looked at one by one is the
same falsification as a mechanical hash bump, performed on images instead of hashes. The
existing mechanic already enforces this and is left exactly as it is: a unit whose
`baselineStatus` is not `approved` cannot certify.

## What this unblocked

With the scope question settled, the council's other repair could proceed: the gate was
re-reviewed to State A on the same day (studio decision `quality-council-ci-semantics`,
app D-029 and D-032) and now publishes an honest NO-PASS instead of failing silently
behind a mask.

## What is still open

Review capacity itself. Nothing in this ruling creates the three independent reviewers per
receipt that State B requires. That is the next question, and it is a resourcing question
rather than a design one.
