# Phase 1 Opus architecture review (claude-opus, 2026-07-21) — verdicts + binding amendments

All items APPROVE WITH AMENDMENTS. Load-bearing fact for everything: **FK ON DELETE cascade does NOT execute at runtime** (libSQL over Turso stateless HTTP — `src/server/account-erasure.ts:41-56` hand-rolls cascades for this reason). Never rely on cascade.

## 1.1 Activity taxonomy
Existing contract is a compile-checked discriminated union: 8 kinds in `src/lib/data.ts:586-604` (taskAdd, move, toggleComplete, update{field}, commentAdd/Remove, attach, detach) + exhaustive `formatActivityLine` in `conversation-feed.tsx:305-354` (never-guard forces render cases). ADD kinds: `parentChanged{from,to}`, `resourceAdd{resourceId,provider,title}`, `resourceRemove{resourceId,title}`, `nudgeSent{toUserId}`, `inviteSent{}` (**NO email — PII in shared feed; render "invited a new member"**), `inviteAccepted{userId}`, `archived{}`, `restored{}`. Do NOT add status_changed (move/toggleComplete cover it); reuse `update` for field changes. Keep attach/detach for historical rows; new resource path emits resourceAdd/Remove; backfill does not rewrite history. Wire the missing WRITERS: `setTaskArchivedAction` (tasks.ts:520-533) writes no activity today; reparent action doesn't exist yet.

## 1.2 Hierarchy roll-up
- Compute SERVER-side: board query excludes subtasks (`queries.ts:100` parent IS NULL, cap 2000); `subtaskCount`/`subtaskDoneCount` correlated subqueries already exist at `queries.ts:62-69` — USE THEM.
- **Existing bug**: both counts ignore `archived_at` — add `AND child.archived_at IS NULL` to both, else archived children drag the % forever (contradicts D-004).
- done = literal `lane = 'done'` only; "waiting" (raw text, not in LANE_ORDER) stays in the denominator as incomplete; never enumerate lanes to infer completeness.
- Reparent: `updateTaskAction` allowlist EXCLUDES parentTaskId (tasks.ts:282-321) — new `setParentAction` required: translate trigger RAISE(ABORT) to clean error (pattern tasks.ts:406-410), re-read target parent in-action (parent-missing → no-op) to close reparent-vs-delete race; no tasks.revision column exists, last-write-wins on position acceptable.
- **Parent archive**: cascade archive to children in the same write + per-child archived activity (option (a) adopted).
- **Existing bug (highest risk)**: `removeTaskAction` (tasks.ts:501-512) orphans children — parent_task_id is a plain text column, NO FK, and cascade wouldn't fire anyway. Must explicitly handle children on parent delete (delete subtree incl. their comments/activities/attachments rows, files best-effort).
- Every new mutating action MUST be registered in `tasks-security-regression.test.mjs:199-224` enumeration or contract fails.

## 1.3 Resources
- Additive migration `0017_resources.sql` confirmed collision-free: _wt-migration's drizzle/ + schema.ts + actions + detail-panel are byte-identical to main (verified by diff). Follow drizzle/MIGRATIONS.md ledger workflow (LF SHA-256, receipt, snapshot, postconditions: resources upload-count == attachments count; rollback: DROP TABLE resources).
- **Read-through union, NOT dual-write**: uploads keep writing `attachments`; one-time backfill into `resources` (deterministic ids derived from attachment ids for idempotency); read layer unions both until Phase 9 retirement; new external links write only resources.
- Hand-wire `resources` deletes into account-erasure.ts + removeTaskAction (no runtime cascade). Indexes: (task_id), (workspace_id). Insert must be synchronous with access_state='pending'; metadata fetch async; test panel renders with dead provider.

## 1.4 Storage/quotas
- Metering = live `SUM(size_bytes)` where counts_against_storage=1 (no stored counter; recalc job is reconciliation only).
- **Quota race**: claim-then-verify — insert metadata row first, SUM including it, delete row+reject if over; upload bytes to Blob only after claim succeeds. Bounded overshoot ≤1 file.
- **Multipart**: current path buffers whole file (attachments.ts:151 arrayBuffer) — OOM at 250MB; >~50MB use Vercel Blob client-upload token flow; small files stay in-action.
- Ship dark: no BLOB_READ_WRITE_TOKEN in Vercel ⇒ refuse WRITES with operator-facing error; downloads/deletes always work (mirror db fail-closed pattern, db/index.ts:33-42).
- Legacy prod bytes are already gone (local disk): backfill marks access_state='unavailable'; NEVER attempt copy; UI says file predates cloud storage.
- Orphan cleanup: recalc job enumerates workspace-prefixed Blob keys, deletes rowless objects.
- `storage-config.ts` single source (getQuota(tier)); numbers are labelled fallbacks; operator-todo for founder ratification before pricing pages cite them.

## Merge-forward
LOW risk. One guaranteed textual conflict: package.json `test` script (migration branch prepends boundary checks + appends module tests). Mitigation: append Phase-1 test files as ONE contiguous insertion in the tasks-core segment; never reorder. board.ts trivial divergence (demo name) — irrelevant to Phase 1. Keep new code in new files (resources action, set-parent action, storage-config).

## Ranked risks
1 parent-delete orphans (fix in 1.2) · 2 roll-up archived-children bug · 3 upload race · 4 security-regression registration · 5 erasure wiring for resources · 6 arrayBuffer OOM · 7 inviteSent email PII · 8 legacy bytes honesty.
