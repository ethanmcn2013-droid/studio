---
id: cross-repo-migration-discipline
title: A future 'dead code' audit drops a table or column that has cross-repo writers the in-repo grep misses.
category: Infrastructure
likelihood: Medium
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-05-26
---

## Mitigation

Memory entry feedback_cross_repo_grep.md added 2026-05-12. Rule: any 'is this code unused' check that touches Roadmap, Analytics, Notes, or shared Turso schemas must grep across ~/Projects/personal/ not just one repo. Before any destructive prod migration, snapshot affected tables and verify row counts match the in-repo writer audit — if prod has rows but in-repo greps show zero writers, find the cross-repo writer before dropping. Caught 2026-05-12 only because activity table had 30 unexpected rows in prod (written by tasks/scripts/log-cycle.ts).
