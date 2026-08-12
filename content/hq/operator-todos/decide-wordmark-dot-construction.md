---
id: decide-wordmark-dot-construction
title: Name one authority for the wordmark dot
status: open
priority: P2
blocking: false
phase: Phase 2
why: Five recorded constructions disagree, so no builder can conform the app chrome without picking a side; the wave-6 builder investigating correctly refused to guess.
href: /design
date: 2026-08-12
---

## The decision

The wave-6 brand seat flagged the app's wordmark dot as off-grammar; the
builder found five mutually inconsistent records and stopped. The records:
`BRAND_GUIDE_HANDOFF.md` (2026-05-11 — one construction for all marks,
baseline-seated 0.16em) · `BRAND.md` §4 (same) · the suite design system
shipped in studio `globals.css` (two constructions, noun period at the
baseline / verb middot raised 0.62em — this is what the marketing estate
actually renders) · app CHANGELOG T·132 ("the brand's indigo full stop") ·
app CSS as shipped (0.32em dot raised 0.38em).

Beyond baseline-versus-raised, the app's single `.studio-wordmark::after`
rule serves four different words, and under the only current-and-shipping
record (the DS split) they should not all take the same dot.

## Steps

1. Pick the construction — or ratify the noun/verb split as the one rule.
2. Record it in BRAND.md §4 and explicitly retire the conflicting records.
3. Open a session to conform the app chrome; `board-pass3-contract` pins the
   dot's colour, so the change updates that pin in the same pass.
