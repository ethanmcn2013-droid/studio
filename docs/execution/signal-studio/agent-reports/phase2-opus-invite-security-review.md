# Phase 2 Opus invite/guest security review (claude-opus, 2026-07-21) — condensed verdicts

Full detail in the session transcript; this file preserves the binding findings. Evidence file:line refs are against _wt-premium-p1.

## Blockers
1. **Closed-beta accept trap**: `acceptInviteAction` (settings.ts:360) writes workspace_members + burns the token WITHOUT any requireAppAccess interaction; non-allowlisted invitee then bounces to /waitlist forever with the invite consumed. Worst-of-both. Resolution = D-018 (grant-on-accept; membership implies access) — implement via a Tasks-local wrapper because require-app-access.ts is a byte-identical four-repo copy; do not edit the shared file.
2. **Invites carry no role**: pending_invites has no role column; accept hardcodes 'member' (settings.ts:420) while the members UI ships a role popover. Add `role text NOT NULL DEFAULT 'member'` (additive), validate server-side (clamp to owner|member), write invite.role at accept.

## High
3. inviteSent/inviteAccepted activity kinds are typed + rendered but NEVER written; activities.taskId is NOT NULL so workspace-scoped invite events can't live there → D-019: new additive `workspace_events` table for workspace-scoped audit (invites, member changes, access grants); do NOT relax activities.taskId (hot-table rebuild).
4. **share_links.mode (view|comment|edit) is stored but never enforced** — resolveShareLink doesn't select it; share page is always read-only. Latent UI-hiding trap. Phase 2: clamp mode to 'view' semantics (validation + comment in schema), record guest-comment as future guarded work.
5. NotificationKind union lacks 'nudge' (data.ts:657) — build-breaker for the Nudge feature unless extended.

## Verdict: task-level guests = DEFER (flag off)
No per-object ACL exists; guests contradict the workspace-tenancy invariant the contract suites protect; enforcement surface = every task-scoped read/action. Exact future work recorded: `task_grants` table + single `requireTaskAccess(taskId, capability)` choke-point guard called by EVERY task-scoped entry + a dedicated contract test enumerating entry points. Until then: share_links (hardened, view-only) are the external-sharing story.

## Invite lifecycle facts (current state is stronger than assumed)
256-bit CSPRNG tokens; email-match binding at accept; expiry checked at preview+accept; revoke = expiresAt=now (conflates revoked/expired — optional revokedAt later); duplicate invite reuses live token (race-prone SELECT-then-INSERT, low impact); INSERT OR IGNORE makes re-accept idempotent; cap re-checked at accept.

## Medium fixes for the implementation pack
- G8: at accept, compare against Clerk VERIFIED primary email (currentUser()), not the lagging users.email mirror.
- G9: resend cooldown (1/hour) via lastSentAt or createdAt.
- G4: invite-to-existing-member returns friendly no-op, no email.
- N3: sendNudgeAction must re-check task via (id, workspaceId) owned-row guard + both parties' CURRENT membership.
- N4: rate key = (sender, task) 1/24h overall (stricter than per-assignee; kills fan-out spam).
- N5: server-side self-nudge / no-other-assignee rejection.
- N6/N7: mute checked BEFORE email send; nudges pref key is new (migration).

## Low
Preview leaks invited email pre-auth (hide until signed-in match); no unique index (workspace_id,email) where accepted_at IS NULL; revoked-vs-expired copy.

## Required tests
- security-regression additions: accept ordering (access decision before membership write), role written not hardcoded, recordActivity/workspace_events calls present, nudge owned-row guard + mute-before-send.
- share-revocation: assert share surface grants no write path.
- NEW invite-lifecycle-contract (runtime, in-memory DB): expired/accepted/wrong-email/revoked/cap-full/double-accept/non-allowlisted-accept semantics.
- NEW nudge-rate-limit-contract (runtime): 24h refusal, fan-out ceiling, self/no-assignee refusal.
