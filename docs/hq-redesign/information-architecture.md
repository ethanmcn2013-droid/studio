# Signal HQ — Information Architecture

_Phase 3 of the redesign. Replaces the flat horizontal top-nav with a scalable, grouped, left-rail operating shell modeled on the reference (a calm three-column console: persistent rail · content canvas · contextual rail)._

## The problem

51 routes behind a 9-item horizontal bar. Adding a room means either lengthening the bar (it doesn't fit) or hiding the room in the palette (nobody finds it). The Today page compensates by dumping every hub, every audience path, and a ~90-row inbox onto one scroll — the "wall of rows" the brief calls out. There is no stable spatial model: the founder cannot build muscle memory for _where_ anything lives.

## The model: rooms grouped into a stable spine

A **persistent left rail** carries the whole system, grouped under quiet uppercase section labels (the reference's `MAIN / SETTINGS / INFRASTRUCTURE` pattern). Groups are ordered by daily cadence — what you touch every day is at the top; what you touch rarely is at the bottom but always one click away.

```
signal hq.                        ← wordmark + collapse
────────────────────────────
TODAY
  ▸ Today            /hq
  ▸ Action Center    /hq/action-center   (NEW)
WORKSPACES
  ▸ Sell             /hq/crm
  ▸ Make             /hq/design-rooms
  ▸ Money            /hq/reporting
  ▸ Company          /hq/org
KNOWLEDGE
  ▸ Library          /hq/assets
  ▸ Vault            /hq/vault
  ▸ Atlas            /hq/atlas
BOARD
  ▸ Founders Circle  /hq/founders-circle
  ▸ Data Room        /hq/data-room
SYSTEMS
  ▸ Access           /hq/entitlements
  ▸ Quality          /hq/experience-quality
  ▸ Readiness        /hq/platform-readiness
  ▸ Health           /hq/health
────────────────────────────
⌘K  Search everything             ← command palette
signalstudio.ie ↗ · Sign out      ← account chip (bottom)
```

Every one of the 51 routes belongs to exactly one group. The rail shows **section entry points** (14, comfortably); the long tail (design rooms, one-pagers, `[slug]` details, decks) is reached three ways, never buried:

1. **Workspace landing** — each WORKSPACES entry is a curated landing (health, priorities, key metrics, active work, important assets, related systems, archive), not a card dump. From Sell you reach marketing, market-entry, venue-kit; from Money you reach financial-model, cap-table, loan-pack; etc.
2. **Command palette (⌘K)** — upgraded to index every route + asset + decision with keywords/aliases, showing enough context to disambiguate, with actions (Open, Copy link, Go to workspace).
3. **Global breadcrumbs** — every page states `Workspace / Page`, so the rail always reflects where you are and the spine is legible from any depth.

**Three-interaction guarantee:** any known asset is reachable in ≤3 interactions — `⌘K → type → Enter`, or `rail group → workspace → asset`.

## Action Center — unifying "needs me"

Today's `/hq` mixes the ~90-item inbox, operator to-dos, due/stale CRM follow-ups, launch-readiness gates, and pending decisions into one scroll. The redesign extracts these into a dedicated **Action Center** (`/hq/action-center`) with a single normalized model:

```
Item = { priority, status, title, why-it-matters, owner, due/staleness, workspace, next-action, source }
```

- **Priority tiers:** Critical (unmissable, red rail + banner) → Due → Stale → Queued.
- **Grouping & filters:** by workspace, by type (decision / approval / follow-up / gate / blocker), by owner.
- **Progressive disclosure:** the top 3–5 items are expanded with full context; the rest collapse into a scannable, keyboard-navigable list. No 90-row wall.

Today shows only the **top of** the Action Center (the single most consequential item + a count), then routes in. Nothing is deleted — the same sources (`getInboxData`, `getOperatorTodos`, `getDueToday`, `getLaunchReadiness`) feed the new surface.

## Today / Mission Control — 10-second legibility

Reordered to answer "what's the state of the business?" fast, with progressive disclosure instead of a wall:

1. **Verdict line** — one sentence + the single next action.
2. **The one thing** — the most consequential Action Center item, expanded.
3. **Five company numbers** — the reporting metrics, as a calm metric row.
4. **Workspace health** — Sell / Make / Money / Company, one status line each, linking to the landing.
5. **Recent changes** — what moved (changelog / cycle).
6. Everything else lives in its room, one click away.

## Board vs operator boundary

Board mode (`/hq/founders-circle`, `/hq/data-room`, board view of reporting) keeps the calm, confidential register: story, five material numbers, reporting freshness, material progress/risk, the next ask, board pack. Operator implementation detail (CRM rows, cron health, remediation P0s, raw inbox) never renders in board surfaces. The rail collapses to the BOARD group when in board mode (preserving today's `boardMode` behavior, now grouped).

## Naming

Kept business terminology (Vault, Atlas, Founders Circle, Reporting, Access) — these are load-bearing house names. Standardized ambiguous ones for the rail: **Sell / Make / Money / Company** as workspace labels (from the existing sell/make/tell/run loops), **Action Center** (was "the inbox / needs me"), **Quality / Readiness / Health** under Systems. Full nouns, no lowercase-only affectation in the rail (the old `jump ⌘K`, `circle`, `tell` become legible titles).

## Why this is more intuitive

- A **stable spatial spine**: the same rail on every page → muscle memory.
- **Cadence-ordered**: daily work on top, rare work reachable not resident.
- **No dead ends**: every route grouped, every asset ≤3 interactions away.
- **Calm by default, loud on demand**: the Action Center concentrates urgency so the rest of the system can stay quiet — the reference's core discipline.
