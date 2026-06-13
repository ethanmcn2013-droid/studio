---
id: cross-repo-migration-discipline
title: A future 'dead code' audit drops a table or column that has cross-repo writers the in-repo grep misses.
category: Infrastructure
likelihood: Low
impact: High
status: Monitoring
owner: Ethan
reviewDate: 2026-07-01
---

## Mitigation

Re-graded 2026-05-16. The discipline is codified and now reinforced by structure, not just memory. The rule (feedback_cross_repo_grep.md, 2026-05-12): any "is this code unused" check touching Timeline/Signal/Notes/shared Turso schemas must grep across ~/Projects/personal/, not one repo; before any destructive prod migration, snapshot affected tables and verify row counts against the in-repo writer audit. Reinforced 2026-05-16: the atlas references[] system makes cross-repo writers explicit and the pre-commit drift trigger flags any touch to a referenced file — S·44 added the Tasks→Studio writer to the cross-repo-writer atlas entry, so the third cross-repo writer is now documented where an auditor will see it.

Honest residual: this is a standing risk, not an eliminated one — a careless dead-code audit can still drop a column with an out-of-repo writer. Likelihood Medium→Low (rule codified, practiced, and now structurally surfaced). Impact stays High — a wrong drop is still data loss. Long review cadence: standing discipline, checked infrequently.

## Notes

Not closed. Mitigated by codified-and-surfaced discipline; recurs at every dead-code audit.
