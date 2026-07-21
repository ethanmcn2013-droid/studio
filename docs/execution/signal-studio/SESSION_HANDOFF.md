# SESSION HANDOFF — Signal Studio Premium Programme

Written 2026-07-21 at Phase 0 close. The next session continues at Phase 1.

## Read first, in order
1. `STATUS.md` (constraints + next tasks)
2. `MASTER_PLAN.md` §Ground truth + §Phase 1
3. `DECISIONS.md` D-000, D-002, D-004, D-006, D-007
4. `RISKS_AND_GATES.md` (G-01/G-03, R-01/R-03)
5. `agent-reports/phase0-tasks-architecture.md` (schema + seams)

## Session-start checks
```
git -C C:/Users/ethan/signal-studio-workspace/tasks status -sb   # expect a feat/* branch owned by ANOTHER process — do not touch
git -C C:/Users/ethan/signal-studio-workspace/tasks log origin/main -3 --oneline
git -C C:/Users/ethan/signal-studio-workspace/studio status -sb  # expect main, clean
```
Then the smallest baseline: in your OWN tasks worktree, `pnpm typecheck && pnpm lint` (ignore `.next/dev/**` typecheck noise — stale dev artifact; source must be clean).

## Exact next actions (Phase 1)
1. `git -C tasks fetch && git -C tasks worktree add ../_wt-premium-p1 -b feat/premium-foundations origin/main` — all programme work in tasks happens in own worktrees; NEVER in the main checkout (foreign process) and NEVER in `_wt-migration`.
2. File `studio/content/hq/operator-todos/premium-blob-storage.md` (G-03: provision Vercel Blob on the tasks project; include env var names; status open, P1, blocking Phase-1 upload work; follow the README file shape).
3. Spawn Opus review (risk-reviewer agent) with the D-006 resources schema + attachments migration + quota enforcement plan BEFORE writing the migration. Input: agent-reports/phase0-tasks-architecture.md §2, §5; brief §8.3–8.5.
4. Implement in this order: activity-kind taxonomy (1.1) → roll-up semantics + parent-complete dialog (1.2) → `resources` table + attachments migration (1.3) → Blob seam + quota config/enforcement (1.4). Tests ride each step; `pnpm test` green before commit; commit cohesively per step.
5. Update STATUS.md + QA_MATRIX.md Phase-1 row; write DECISIONS entries for anything material; keep this file pointing at the true next action.

## What NOT to do
- No Stage-C redirects, no `/app/account` redirect work, no edits in `_wt-migration` (founder-gated programme).
- No video-production work (signal-motion excluded).
- No dark theme exposure (D-013 gate), no real email sends (DKIM pending), no production data deletion (G-07).
- Don't re-run discovery — it's in `agent-reports/`; verify only what a change depends on.

## Deferred items on the ledger
- tasks/CLAUDE.md pointer to this system → include in the first Phase-1 PR.
- Fresh screenshot baseline (board/detail/settings/heroes) → Phase 3 entry, visual-qa agent.
- RESEARCH.md [kb] verification (ClickUp/Notion/Raycast) → before Phase 3 IA freeze.
- Hero-lab branch inventory (R-01: another process builds `feat/*-hero-lab` on tasks/notes/roadmap) → Phase 7 entry, integrate don't duplicate.
