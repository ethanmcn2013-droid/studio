---
id: silent-write-failure
title: A write can fail with a success-shaped response, and the operator finds out only when the work is gone.
category: Product
likelihood: Medium
impact: High
status: Monitoring
owner: Ethan
reviewDate: 2026-09-15
---

## Mitigation

Graded 2026-07-31, on discovery by the Tasks eight-lens design panel and fixed
the same day (Tasks dispatch T·126).

Six of Tasks' create affordances — the calendar's per-cell "+", "Create on this
date", both planning-rail adds, the command palette's create row, and the list's
empty-state add — passed the status key `"queued"`. That word is the design
lab's retired vocabulary; the production column model (T·121) says a status IS a
board column key, and no workspace has a column keyed `queued`. The store
accepted it as a custom-column claim, wrote the task with a claim no surface
resolves, and returned normally. The optimistic row appeared, the panel opened
on "Task not found", and a refresh left nothing. Every layer reported success.

Fixed by resolving any unknown key against the workspace's real column list and
landing at the top of the board rather than claiming a phantom column, plus
correcting the six call sites to canonical keys. Verified live: the same click
now produces a real task in the first column.

The transferable lesson, wider than one key: **an identifier accepted by a
permissive layer is an identifier that can be wrong forever.** The column model
was deliberately open — custom columns are free-form keys by design (T·121) —
and that openness is what let a typo-class value pass as a legitimate claim. Any
boundary that accepts a free-form key from a caller should resolve it against
the set that actually exists and fall back honestly, not persist it and hope.

Honest residual: one product, one key space, fixed at one boundary. The same
shape is available anywhere the suite writes a free-form identifier — Notes'
folder keys, Timeline's audience slugs, Signal's preference keys — none of which
resolve their inputs against a known set today. There is no gate that would have
caught this: the type is `string`, the write is valid, and the failure is only
visible by reading the task back through a surface that renders columns.

Likelihood Medium: it needs a caller holding a stale vocabulary, which the lab-to-
production port is exactly the condition for, and three more products carry
lab-derived code. Impact High rather than Medium: the failure mode is silent
loss of the operator's own work, which is the one thing a task tool cannot do.

## Notes

Not closed. Fixed in Tasks; the pattern is unaudited in Notes, Timeline and
Signal. The cheap next step is a read-back audit of every free-form key write
across the suite — does the writer resolve the key against a known set, and does
a failed resolve surface to the caller? Recurs wherever a permissive data model
meets a caller carrying vocabulary from an earlier version of itself.
