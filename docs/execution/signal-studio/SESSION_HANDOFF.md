# SESSION HANDOFF — Signal Studio Premium Programme

Written 2026-07-21 at end of session 1 (Fable lead). Phases 0-2 complete; Phase 3 half done.

## FOUNDER DIRECTIVES (latest, session 1 close — these override earlier gate posture)
1. Proceed through ALL phases autonomously; do not stop to ask permission.
2. **STOP BEFORE DEPLOYING**: nothing merges to main / deploys to production. Everything lands on `feat/premium-foundations` (tasks PR #44) and studio main docs. Founder-review operator-todos stay filed but do NOT block building — build the production ports; the founder reviews via the PR + FINAL REPORT.
3. Close the programme with the Phase 9 FINAL_REPORT.md (per master brief §16.7) before any deploy request.
External/destructive gates STILL HOLD (no DNS changes, no real emails, no prod data deletion, no Stripe live config, no pushing to tasks main).

## State at handoff
- Branch `feat/premium-foundations` @ e92f67e (tasks repo, worktree `_wt-premium-p1`), PR #44 open, ALL GATES GREEN at every commit (typecheck / lint 1 pre-existing warning / pnpm test / db:contract).
- DONE: Phase 1 (activity taxonomy, hierarchy integrity fixes, setParentAction, resources 0017, Blob seam + quotas 50MB-capped D-007a) · Phase 2 (Nudge 0018, invite hardening 0019 + D-018 grant-on-accept wrapper, Security & Login settings) · Phase 3 first half (task-detail LAB at /lab/task-detail — lead-accepted, evidence in evidence/phase3-lab/ — and the unified context-action system, in-browser verified, evidence 6/7-context-menu.png).
- Read `STATUS.md` for detail; `DECISIONS.md` D-000..D-020 are binding; `agent-reports/` holds all audit + review evidence.

## Exact next actions (continue Phase 3, then 4→9 per MASTER_PLAN)
1. **Production port of the task-detail lab** (the big one): port `src/components/lab/task-detail/` composition into the production panel + new `/app/task/[id]` focus route per D-003. Port checklist: reuse real store/server actions; keep quick status-switcher in header; carry Contact + Amount fields into metadata rail; fix long-title clipping; deep link = route (param stays board fast-path); preserve board scroll; wire the lab's ••• via ContextActions; keyboard j/k/e/Esc; skeletons; permission/archived states; then update experience fixtures (`pnpm experience:fixtures:write` + attest) since /app surfaces change.
2. Context-actions follow-ups deferred with reasons (see e92f67e commit body): Assign submenu, due-date picker primitive, Make-subtask-of task picker, Archive exposure through HybridStoreProvider store shape.
3. Phase 4: Projects overview (workspaces-as-Projects, D-011), Settings gear + IA split, Stripe portal (SANDBOX only), themes token plumbing (dark stays unexposed, D-013).
4. Phase 5: personality/tips/celebrations engines (server-side exactly-once milestones).
5. Phase 6: Marketing Engine RFC then MVP in studio /hq (D-012); The Hundred metadata (real data only).
6. Phase 7: Tasks marketing hero rebuild (real hybrid components + demo fixtures; ticker decision D-017; experience-materiality recipe REQUIRED for homepage changes).
7. Phase 8: wedding seed command (guards per D-015); roadmap→timeline redirect PREPARED NOT DEPLOYED (G-05, never touch P08 Stage-C files); support@ prep docs only (DKIM gate); deck Atlas slide pair via live /hq/atlas-map capture, publish scripts staged but deck edits NOT pushed to studio main if they auto-publish via CI — verify the CI trigger path first (documents-decks-sync.yml publishes deck changes on main push! Deck edits must ride a BRANCH until the founder approves).
8. Phase 9: full validation matrix, Opus security review, Fable cross-product design review, **FINAL_REPORT.md**, then STOP and hand the founder: PR #44 + report + deploy runbook.

## Environment recipes (hard-won, reuse)
- Subagents cannot run Bash in restricted sessions (moot if new session runs with skip-permissions — then builders CAN verify themselves; still require reports + lead diff review).
- Migration runner splits SQL on `--> statement-breakpoint`; comment-only segments CRASH (SQLITE_OK error); ledger workflow = SQL + receipt(proofs) + ledger entry + journal + counts in scripts/db/migration-ledger.test.mjs; recompute canonical LF SHA-256 of SQL then receipt (helper pattern: /tmp/rehash*.mjs in session 1, or scripts/db/migration-ledger.mjs canonicalFileSha256).
- Visual pass: `SIGNAL_ACCESS_MODE=demo NEXT_PUBLIC_SIGNAL_ACCESS_MODE=demo pnpm dev -p 4399`; playwright script FROM REPO ROOT; `waitUntil: "load"` (SSE defeats networkidle); output paths `C:/tmp/...`; demo task ids `demo-t-01`…
- Concurrent committer owns the main checkouts (tasks on feat/tasks-hero-lab etc.) — work ONLY in `_wt-premium-p1`; never touch `_wt-migration` (founder-gated unified app; Stage-C redirect territory = P08-007/008).
- Commit style: cohesive commits on the branch, Co-Authored-By Claude Fable 5 trailer, push branch only.

## Open operator-todos filed by this programme (do not resolve; founder's)
premium-blob-storage (G-03) · premium-auth-providers (G-02) · premium-invite-access-policy (D-018 notice) · premium-task-detail-review (lab review; per new directive, build the port anyway — founder reviews via PR).
