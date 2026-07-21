# STATUS — Signal Studio Premium Programme

Updated: 2026-07-21 (session 2, Fable lead — Phase 3 production port landed)

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
- Security & Login settings section LANDED (75af14b): sign-in methods, active sessions with ownership-checked revocation, security activity from workspace_events; degrades gracefully on Clerk failure/dev-fallback. **Phase 2 CODE-COMPLETE** — same branch/PR #44; Clerk provider enablement = operator todo premium-auth-providers; live-Clerk session QA deferred to provider enablement (QA_MATRIX row 2).
**Phase 3 — IN PROGRESS**:
- Research gates closed (Notion peeks + ClickUp task view verified 2026-07-21 — both support Hybrid C).
- Task-detail LAB built + LANDED (f82524e): /lab/task-detail, one TaskDetail composition through panel/focus/mobile shells, demo fixtures, no server actions. Lead visual acceptance DONE via live capture (evidence/phase3-lab/ — lab vs current form-like prod panel; prod panel also has a long-title clipping bug). **FOUNDER GATE OPEN: operator-todo premium-task-detail-review** — production port waits for acceptance. Port checklist: keep quick status-switcher in header, carry Contact/Amount fields into metadata rail, fix title clipping, wire real actions + deep-link route /app/task/[id].
- Context-action system LANDED (e92f67e): ContextActions (right-click, single-element asChild) + ActionsDropdown (••• inside the card topline), one buildTaskActions registry, hand-rolled menu machinery removed, in-browser verified (evidence 6/7-context-menu.png). Fable fixes during verify: asChild-on-Fragment crash, trigger placement outside card, duplicate complete-toggle. Deferred w/ reasons: Assign submenu, due-date picker, Make-subtask-of picker, Archive store exposure.
- **Production port LANDED (session 2, 7317624)**: one TaskDetail composition in two shells — resizable panel (drag 420-720px, width persisted) + new `/app/task/[id]` focus route (D-003 stable deep link, workspace-scoped `getTaskDetail`, demo fallback, archived/not-found states). Header per lab grammar: breadcrumb, j/k, expand (e), ••• ActionsDropdown on the Phase 3.3 registry, quick status-switcher popover, auto-grow title (long-title clipping FIXED). MetadataRail absorbs FieldRows + Contact + Amount + chain-duplicate + milestone link. PanelFooter retired into the ••• registry. Fable fixes during verify: focus-view fallback logic inversion, junk pushState on collapse, DTO exported from a route file (breaks next build), demo-mode DB miss in getTaskDetail, Escape-through-menu double-dismiss (capture-phase hasOpenLayer() in both shells). Visual acceptance by live capture: evidence/phase3-port/ (9 shots incl. focus route, status popover, j/k, mobile).
- Experience governance closed in the same commit: registered app-task-by-id page+loading AND the previously unregistered lab-task-detail page; attested playwright run 46/46 (evidence-run 7ff743ea…); materiality receipt for tasks.page.app-settings (Phase 2 Security & Login drift, found + closed). experience:fixtures AND experience:validate now clean — these two contracts are NOT in the four-gate chain; run them at every /app surface change.
- **NEW FOUNDER DIRECTIVE (session close): proceed through ALL phases without permission stops; NOTHING deploys/merges to main; finish with FINAL_REPORT.md.** See SESSION_HANDOFF.md for the full continuation plan (next: context-action follow-ups, then Phase 4).
- Visual-capture recipe for this machine: dev server with SIGNAL_ACCESS_MODE=demo on a spare port; playwright script from repo root (module resolution); waitUntil "load" NOT networkidle (SSE holds the connection); screenshot paths are Windows-resolved (C:/tmp not /tmp).
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
