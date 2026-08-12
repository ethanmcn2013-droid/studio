---
id: queue-404-and-students-marker-fixes
title: Approve the next design pass — the shared 404 page and the /students today-marker
status: open
priority: P2
blocking: false
effort: quick
phase: Phase 2
why: Two confirmed visual defects from the closing review are recorded but unfixed; both are re-composition work, deliberately not rushed into the session close.
href: /students
date: 2026-08-12
---

## What is queued

1. **The shared app 404 page** (closing engineering seat): it brands itself
   "tasks" inside a three-product suite, calls a missing Timeline a task,
   renders pure white inside a dark app, and shows a pulsing "Everything
   else is still moving" pill that measures nothing.
2. **The /students today-marker collision** (closing UI seat): on the
   embedded sample timeline the Today label paints entirely behind the
   milestone row at 390 and 820, and the today tick draws straight through
   the milestone node. Needs collision handling — flip the label to the
   opposite side of the rail when within a label-width of a node, and drop
   the tick behind the node in paint order.

## Steps

1. Say go on a session covering both (they are independent; either can ship
   alone).
2. The 404 rewrite should land with the same first-contact and voice gates
   as any front-facing surface.
