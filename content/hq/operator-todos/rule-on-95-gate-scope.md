---
id: rule-on-95-gate-scope
title: Rule on the 9.5 gate's scope — it has never certified anything
status: open
priority: P1
blocking: false
phase: Design · north star priority 2
why: The gate needs 1,560 evidenced taste scores for one pass, so it has never run; design quality is unproven rather than proven.
href: /hq/decisions/signal-design-quality-operating-system
date: 2026-08-01
action: "Decide how much surface one certification pass must cover before it may certify anything."
product: "Signal Studio (all four modules)"
recommended: "Narrow the first pass to one product at one viewport — Tasks at desktop, 10 states, 130 scores — and let the ratchet widen it."
alternatives: ["Keep the full 120-unit scope and accept that certification waits for reviewers who do not exist yet", "Reduce required states per product rather than viewports", "Certify deterministic dimensions continuously and batch only the six subjective ones"]
default: "The gate stays red indefinitely and the design pillar of the north star has no evidence behind it."
consequence: "Every claim that a surface meets the standard rests on judgement with no receipt, which is the situation the operating system was built to end."
trigger: "A first certification pass completes and a receipt exists in experience/council-reviews/."
links: ["https://github.com/ethanmcn2013-droid/app/blob/main/experience/QUALITY_COUNCIL_EVIDENCE.md", "../decisions/product-north-star.md", "../decisions/signal-design-quality-operating-system.md"]
---

## What was measured

The gate was run end to end for the first time on 2026-08-01. Every
deterministic layer is green — self-tests, 35/35 critical fixtures, 80
registered experiences, no design-system drift. The council gate returns nine
failures, all of one kind: no receipt has ever been authored.
`experience/council-evidence/` does not exist.

## Why it has never run

- 30 required states across four products, times 4 viewports = **120
  assessment units**
- times 13 dimensions = **1,560 individual taste scores**, each needing a
  written rationale and positive rendered evidence
- plus at least three independent council reviews bound to each receipt
- plus four continuous journey receipts, one per viewport

Automation is explicitly barred from awarding taste scores, and that rule is
right. The consequence is simply that one person cannot complete a pass, so
the gate never fails — it never runs.

## What is not in question

The 50/52 threshold, the fail-closed posture, the ban on automated taste
scores, and the rule that known debt may only shrink. Narrowing scope is not
lowering the bar; it is choosing a surface small enough that the bar can
actually be applied to it.

## Steps

1. Choose the scope of the first certifying pass. The recommendation is
   **Tasks at desktop only** — 10 states, 130 scores — because Tasks is the
   most mature module and desktop is its dominant surface.
2. Decide whether the remaining viewports and products enter by ratchet (each
   pass adds one) or wait for review capacity.
3. Decide whether the seven deterministic and mixed dimensions may certify
   continuously while the six subjective ones batch — this is the single
   biggest lever on cost and does not weaken any threshold.
4. Run the pass, author the receipt, and record the first real certification.
