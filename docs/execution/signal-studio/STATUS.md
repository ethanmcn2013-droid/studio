# STATUS — Signal Studio Premium Programme

Updated: 2026-07-21 (session 1, Fable lead — Phase 1 in progress)

## Current phase
**Phase 1 — Platform foundations, IN PROGRESS.**
- Worktree `_wt-premium-p1` (branch `feat/premium-foundations` off tasks main 831ecb0).
- Operator gate G-03 FILED: `content/hq/operator-todos/premium-blob-storage.md` (Vercel Blob provisioning; upload work ships dark until done).
- Opus architecture review COMPLETE — all items approve-with-amendments; binding amendments in `agent-reports/phase1-opus-architecture-review.md`. Found two pre-existing integrity bugs (parent-delete orphans children; roll-up counts archived children) and the no-runtime-FK-cascade fact — all folded into the plan.
- Step 1 LANDED (3 commits ..61d3cb0): activity taxonomy (8 new kinds, PII-free), parent-delete subtree fix, archive cascade, roll-up archived-children fix, setParentAction + 7-test integrity suite. Gates green (typecheck clean, lint 0 errors, 74/74).
- Step 2 LANDED (commits 00c9a07/1069df9/f7ab7c2): resources table 0017 under the ledger workflow (receipt + 6 proofs, db:contract 19/19), read-through union actions with provider detection, hand-wired cascades incl. account erasure, panel Resources section. LESSON: the migration runner splits on `--> statement-breakpoint`, NOT semicolons — a migration without markers runs only its first statement; ledger + receipt SHAs must be recomputed canonically (LF) after any SQL edit.
- Step 3 LANDED (1b092f4): storage seam + claim-then-verify quotas + storage-config + reconcile script + warn toasts. Fable fixes during verification: db.execute→db.get (libsql drizzle has no execute), dead attachments-section removed, stale 25MB toast copy, unused imports.
- **Phase 1 CODE-COMPLETE → PR #44** (https://github.com/ethanmcn2013-droid/tasks/pull/44), 8 commits, all gates green. Safe to merge anytime; Blob provisioning (operator todo premium-blob-storage) before merge gives uploads durability from day one. Parent-complete choice dialog folded into Phase 3 task-detail rebuild (recorded). HQ dispatch (CHANGELOG T·NN + log-cycle) happens AT MERGE, not before.
- Branch discipline: feat/premium-foundations is the programme's tasks-repo integration branch; Phase 2 continues on it; merge main in regularly (concurrent committer ships to main).
- Builder sessions cannot run Bash in this environment: builders edit, the Fable lead verifies (typecheck/lint/test/db:contract) and commits. Working division confirmed across Steps 1-2.

**Phase 2 — IN PROGRESS** (same branch, commits ..14d35dc):
- Nudge LANDED (44e3504): rate-limited person-to-person reminders, mute pref (migration 0018), inbox rendering, panel control.
- Invite hardening pack LANDED (14d35dc): migration 0019 (role + last_sent_at + workspace_events), D-018 grant-on-accept via requireAppAccessTasks() wrapper (shared four-repo files untouched), Clerk-verified email at accept, resend cooldown, existing-member no-op, preview email hidden pre-auth, share mode clamped to view (D-020), 8-test runtime invite-lifecycle suite. Fable fixes during verify: comment-only first statement in 0019 (breakpoint splitter), .mjs→.ts test conversion for freshMemoryDb interop + typing, role type threading.
- Security & Login settings section: builder IN FLIGHT (last Phase 2 item). Clerk provider enablement = operator todo premium-auth-providers.
- LESSON (repeat of Step 2): comment-only statement segments break the migration runner; keep header comments attached to the first real statement.

Phase 0 — COMPLETE (committed 0a7c9ce): all exit criteria met.

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
