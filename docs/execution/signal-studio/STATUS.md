# STATUS — Signal Studio Premium Programme

Updated: 2026-07-21 (session 1, Fable lead)

## Current phase
**Phase 0 — COMPLETE at this commit** (exit criteria met: plan files exist, baseline recorded, architecture + asset inventory exist, 3 task-detail explorations evaluated, decision records D-000…D-017 written, phase order + dependencies explicit, gates documented, artefacts committed).
**Next: Phase 1 — Platform foundations** (see MASTER_PLAN.md §Phase 1, SESSION_HANDOFF.md for exact first steps).

## Completed
- Repo/system audits (tasks architecture, studio assets, domains/infra, migration-programme intelligence) — full reports in `agent-reports/`.
- Validation baseline recorded (QA_MATRIX.md): typecheck source-clean, lint clean, full test chain green at tasks 70375f5.
- Live domain truth (all 7 hosts 200; roadmap.→timeline. redirect missing = Phase 8 work).
- Competitor research with verified Linear sources + flagged [kb] gaps (RESEARCH.md).
- Task-detail exploration evaluation → Hybrid C recommended (TASK_DETAIL_EXPLORATIONS.md, D-003).
- 18 decision records incl. brief-assumption corrections (DECISIONS.md).

## In progress
- Nothing mid-flight. No production feature code has been modified.

## Blockers
- None for Phase 1 start. Operator gates G-02/G-03 (Clerk providers, Vercel Blob) must be FILED as HQ operator-todos at their phase entries — not yet filed.

## Verification status
- See QA_MATRIX.md baseline table. Build + Playwright deferred to CI/phase-entry (env caveats recorded).

## Key standing constraints (read before any change)
1. D-000: build on tasks main; merge-forward compatible with `migration/unified-app` (founder-gated); never touch Stage-C redirect territory (P08-007/008).
2. Concurrent committer: the tasks/notes/roadmap working checkouts sit on ANOTHER process's `feat/*-hero-lab` branches — never modify or switch those checkouts; use own worktrees off origin/main.
3. Excluded: signal-motion repo and all video-production work.
4. Studio HQ rules apply (operator-todo ledger, room registry, HQ-source-files, dispatch entries).

## Next executable tasks (Phase 1)
1. Create worktree off tasks origin/main (e.g. `_wt-premium-p1`, branch `feat/premium-foundations`).
2. File operator-todo for Vercel Blob provisioning (G-03).
3. Opus design review: `resources` table schema + attachments migration + quota enforcement plan (D-006/D-007) before writing the migration.
4. Implement 1.1 activity-kind taxonomy + 1.2 roll-up semantics with tests.
5. Implement resources model + Blob storage behind the existing `uploadsRoot()` seam.
