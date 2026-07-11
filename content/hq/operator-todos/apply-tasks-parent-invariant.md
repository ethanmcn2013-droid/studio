---
id: apply-tasks-parent-invariant
title: Apply the Tasks parent-workspace invariant after backup and dry run
status: open
priority: P0
blocking: true
phase: Phase 1
why: Runtime guards now protect the boundary, but production needs a database invariant after legacy rows are audited.
href: /hq/platform-readiness
date: 2026-07-11
---

## Steps

1. Take and verify a current Tasks Turso backup.
2. Run the legacy-row audit from `tasks/drizzle/0010_parent_workspace_invariant.sql` against a read-only or restored copy.
3. Repair or explicitly account for every invalid parent row.
4. Apply the migration with the repository-supported production migration process.
5. Verify trigger rejection and same-workspace success on the restored copy and production health surface.
6. Attach the backup, audit, migration, and post-check receipts to `SS-P1-002` before marking it complete.
