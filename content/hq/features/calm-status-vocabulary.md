---
id: calm-status-vocabulary
title: Calm status vocabulary
product: Signal Studio (suite-wide)
category: Foundation
status: Shipping
priority: High
effort: Medium
impact: High
owner: Ethan
principleAlignment: 98
relatedCampaign: Founder LinkedIn Build-in-Public
relatedMetric: First-five-seconds legibility for non-technical owners
---

## Notes

A suite-wide Tier 1 move from the calm-coordination brief: every product
defaults to a small, human status vocabulary — `To do · Moving · Waiting ·
Needs Attention · Done` — replacing PM-flavoured words like "In progress",
"In review", "Backlog", and "Blocked". The goal is that a venue owner can
open any Signal Studio product and know what each column means without
reading docs.

**Shipped (2026-06-06):**
- Signal Tasks default board lanes — `doing` renders as "Moving", `review`
  renders as "Waiting" (T·81). LaneId enum and per-workspace column
  renames untouched.
- Signal Tasks personal landing — `/app/my-tasks` is now "My week", a
  five-section editorial briefing (Today · Needs attention · Waiting
  on you · This week · Done this week) instead of a lane-grouped table
  (T·82). Restated the brief's claim that the personal view should
  feel like an editorial briefing, not a dashboard.
- Signal Roadmap — status pill, public workspace BigStats (both header
  treatments), project drill-down BigStat, project card stat strip,
  and the activity feed all render the `blocked` status as "Waiting"
  (R·19). The cinematic showcase demo's `held` label was aligned to
  "Waiting" to match — the demo contract requires its vocabulary
  mirror the product. DB enum `blocked` and CSS tokens
  (`--status-blocked`, `--status-blocked-bg`) untouched, so the
  semantic colour (amber, calm) and per-workspace column overrides
  carry through. The §1.6 public-view comment was updated to explain
  why "Waiting" reads calmer than "Blocked in red" to a recipient
  who doesn't speak the internal language.
- Signal Roadmap — Tier 3 calm-attention layer lands (R·20). A pure
  `needs-attention.ts` selector flags tasks as `overdue` (target date
  past, status not settled) or `idle` (active state, 14+ days
  untouched — same cadence as the existing blocker dwell badge).
  Overdue wins precedence over idle. The count surfaces as one quiet
  "Needs attention" BigStat on the workspace overview, gated by
  `isOwner` — public stakeholders never see a number that would
  alarm without giving them agency. 14 unit tests cover the boundary
  cases. The `blocker` KIND pill renamed "Blocked" → "Blocker"
  (R·20) — KIND and STATUS no longer share a word; "Waiting" is
  the only place blocked-semantics surface as a label.
- Signal Roadmap — per-row attention indicator lands (R·21). ItemRow
  now renders a calm "Idle" or "Overdue" pill when the owner is
  reading; visitors receive `null` and the pill never renders.
  `isOwner` is threaded as a required prop through `OverviewView`
  and `ItemListByProject` so type-checking prevents a future
  regression from silently leaking the indicator. The project
  drill-down also gained the same owner-only Needs attention BigStat,
  so the count is present at both workspace and project scopes.
- Signal Roadmap — drift now surfaces at edit time too (R·22). The
  curation/plan editor's NodeCard wears the same calm Idle/Overdue
  pill as ItemRow, so the owner sees the attention signal while
  authoring, not only while reading the public view. The curation
  surface is owner-only by route, so no `isOwner` gate is required.
  `EffectiveNode` gained a required `updatedAt: Date` field — synced
  nodes use the underlying Tasks row's timestamp, manual nodes use
  the overlay row's timestamp — so the pure `attentionReason(task,
  now)` selector has the data it needs, type-checked end to end.
- Signal Roadmap — DB rename closes the thread end-to-end (R·23). The
  `Status` enum value `blocked` is now `waiting` at the persistence
  layer (`drizzle/0006_rename_status_blocked_to_waiting.sql` UPDATEs
  every `tasks` and `node_overlays.manual_status` row). The visual
  also disentangles: `--status-waiting` is calm sky (`#1d6fa3` on
  `#eff6fc`) and the old alarm red moves to its own `--alarm`
  token, reserved for surfaces that genuinely alarm (GTM blocker
  card, form validation, error text). A "Waiting" pill can never
  again look like an emergency because status and alarm no longer
  share a paint. Studio template sources rewritten + regenerated.
- Signal Analytics — three briefing engine sites where "blocked"
  was leading the phrasing as a status label now lead with "waiting"
  (A·2): the no-blocker fallback in `BLOCKED_TOO_LONG[0]`, two
  `blocked.ts` phrasings, and the why-this reason string in
  `triggers.ts`. The relational `"blocked by ${blocker}"` phrasings
  stay because they name the data, not the status. BLOCK_META
  taxonomy already spoke the calm vocabulary natively, so the
  block-titles themselves needed no change.
- Signal Notes — audited and confirmed clean. Notes has no status
  vocabulary surface (it's plain markdown editing, no checklist or
  lane primitive). PRODUCT.md §8 explicitly: "No status concept" is
  the load-bearing differentiator from Tasks. Silence is also brand:
  no no-op dispatch shipped.

**Next:**
- Signal Tasks — consider whether the same `needsAttention` derived
  signal should surface as a per-row indicator on the board (parity
  with Roadmap), or whether the My Week "Needs attention" section
  already covers the same need.

**Refusal:** "Needs Attention" stays a *derived* state on the analytics
layer, not a fifth manual lane. Adding a 5th lane would touch board drag,
templates, exports, and CSV across four repos for a state every product
can compute from idle days, missing owners, and overdue children. The
spec's own restraint principle — "choose the simpler, calmer option" —
favours derived over manual here.
