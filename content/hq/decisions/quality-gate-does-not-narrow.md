---
id: quality-gate-does-not-narrow
title: The 9.5 gate does not narrow — capacity and per-unit baseline approval are the scheduled work
category: Product
date: 2026-08-17
status: Active
reviewDate: 2027-02-17
relatedObjects: [app docs/wave/DECISIONS.md D-030, app docs/wave/DECISIONS.md D-031, rule-on-95-gate-scope, quality-council-ci-semantics, app experience/VISUAL_BASELINES.md, app PR #151]
---

## Decision

The certification gate keeps its full scope: 104 assessment units, 13 dimensions, three
independent reviewers per receipt, an approved visual baseline for every unit. None of
those numbers moves to fit available capacity.

Visual baselines are approved per unit at the moment that unit is first reviewed, never
in a batch.

The Wave 0 B0 external baseline is re-pinned in place rather than forked to a second
record, and it is never deleted — including on certification day, when it is re-pinned
against the certification release with a fresh review.

## Why

A bar you clear by lowering it certifies nothing. The instrument's only value is that it
is the true standard, and the first time it is adjusted to fit the schedule it stops
being evidence about the product and becomes evidence about our willingness to adjust it.

Two baselines where the validator consults only one is how a superseded record gets cited
as current. And deleting the B0 record on certification day would erase the only external
evidence of where the product started — a certification that also destroys the record of
the bar being missed is worth less than one that stands beside it.

## The cost, stated

Certification is not attainable at current review capacity, and this decision does not
pretend otherwise. What it buys is that when certification does arrive it will mean what
it says.

The open question is resourcing: three genuinely independent reviewers across 104 units.
That is named in `rule-on-95-gate-scope` and is not answered by this decision.
