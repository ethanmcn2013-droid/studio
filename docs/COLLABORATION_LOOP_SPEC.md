# Signal Studio · Collaboration Loop — Product Spec

**Date**: 2026-05-16
**Status**: consolidation + gap-fill · closes nextActions `collaboration-loop-spec`
**This is not a new plan.** It is the single entry point that names the canonical sources and fills the two parts that were never specified: **source tracking** and **public/private controls**. Read the sources for depth; read §3–§4 here for the parts that did not exist.

## Canonical sources (do not duplicate — extend these)

| Concern | Source of truth |
|---|---|
| The loop's intent, what we are / are not, per-product collab model | `docs/CYCLE_2_COLLABORATION.md` |
| Roles, invite path, what each role sees first | `docs/CYCLE_2_INVITE_AND_FIRST_VIEW.md` |
| Collaborator first-view (the five questions, per surface) | `content/hq/collaborator-first-view/*.md` |
| Object shapes crossing the boundary | `docs/SHARED_OBJECT_MODEL.md` |
| Notes-origin extracts | `docs/CYCLE_9_4C_NOTES_EXTRACT_PERMISSION_CONTRACT.md` |
| Ecosystem flow | `docs/ECOSYSTEM_INTEGRATION_PLAN.md` |

## 1 · The loop (one line)

Workspace created → collaborators invited → work becomes clearer → shareable output created → new creator discovered. The moat is that the invited person feels nothing: no setup, no tour, no account-first (SPRINT_2). Everything below protects that feeling.

## 2 · Invite path & guest value (pointer)

Per CYCLE_2: creator controls visibility; guests receive value *before* sign-up; collaborators update only work involving them; viewers cannot browse private context. No new claims here — that doc is authoritative.

## 3 · Source tracking (GAP — specified here)

The loop's last step ("new creator discovered") requires knowing which shared artefact produced a new creator, **without exposing private user data** (CYCLE_2 principle, never specified).

Contract:
- Every invite and share link carries a query suffix of the existing shape already used on `/weddings`: `source=<surface>&segment=<segment>&role=<role>&campaign=<campaign>&artefact=<artefact>`. This is the same vocabulary in production — do not invent a parallel scheme.
- Tracking params identify **the artefact and the channel, never the person.** No email, no Person.id, no workspace name in a shareable URL. A `noteId`/`workspaceId` may appear only as an opaque key with no read-back grant (SHARED_OBJECT_MODEL §0.4).
- Attribution is recorded against the *artefact*, not a fingerprinted visitor. "This shared update produced 3 new workspaces" is allowed; "this person opened it" is not.
- Links are revocable (CYCLE_2). A revoked link 404s; it does not leak who held it.
- No third-party signal script on shared/guest surfaces. First-party artefact counters only — consistent with the suite's no-modal, no-tracker register (DESIGN.md §10).

## 4 · Public / private controls (GAP — specified here)

Three visibility states, creator-controlled, per workspace and per shareable output:

| State | Who can open | What they see | Default |
|---|---|---|---|
| **Private** | Creator + explicitly invited Persons | Full workspace per their role | Workspace default |
| **Shared link** | Anyone with the link | One shareable output (Update `kind:'shared-summary'`, approved Decision/Risk extracts) — never the workspace, never raw Notes | Output default when shared |
| **Public** | Anyone | A read-only artefact intended for discovery (e.g. a public timeline page) | Off — opt-in per output |

Rules:
- Visibility is **per output, not just per workspace.** Making one update public never makes the workspace public.
- Raising visibility is always an explicit creator action with a plain-language confirmation ("Anyone with this link will see this update. Your workspace stays private."). Lowering it is one click and immediate.
- Private Notes bodies are categorically excluded from every state above by `CYCLE_9_4C` — no control can expose them, including "Public".
- A guest/public surface renders only approved extracts and `shared-summary` updates. There is no "view workspace" affordance from a shared artefact (Cycle 2: viewers cannot browse private context).
- Per-product ceiling (SPRINT_2, do not exceed): Tasks = multi-user private workspaces; Timeline = one-way public artefacts, no comments; Notes = single-user, no sharing; Signal = private to one person. This spec never grants a product more collaboration than its locked definition allows.

## 5 · Definition of done

1. Share/invite link builders across products emit the §3 suffix and carry no PII.
2. The three §4 states exist as a creator control on outputs, defaulting closed.
3. `launch-readiness/collaboration-loop.md` references this spec; the "tracking" and "public/private" unknowns are no longer unspecified.
4. Builds of the visibility UI wait for the post-2026-05-18 design system (standing decision — avoid token churn). The contract is what unblocks; the UI is scheduled, not blocked.
