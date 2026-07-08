# Signal Studio Atlas — Information Architecture

_Phase 0 deliverable. Defines the Atlas as a connected system of typed objects
and maps each object to the **real** source of truth in `content/hq/**`._

---

## 1. The model in one sentence

The Atlas is a small **curated graph** (a company node + 8 domain nodes + typed
connections, with stable positions and per-lens copy) that is **enriched at
render time** with a live `AtlasSnapshot` computed from the repo's existing
markdown source of truth. Structure is authored; numbers are read.

Two layers, deliberately separated:

- **Curated layer** (`src/features/atlas/data/atlas-graph.ts`) — identity,
  purpose, why-it-exists, positions, connections, lens config, and _links_ to
  where the real data lives. No fabricated metrics.
- **Live layer** (`src/features/atlas/server/load-snapshot.ts`) — reads
  `content/hq/**` via existing loaders and computes real per-domain figures and
  the Mission-Control / Investor summary.

## 2. Object types

Aligned to the spec, trimmed to what v1 renders and what the source can back:

| # | Type | v1 role | Backed by |
|---|---|---|---|
| 1 | `company` | The center: Signal Studio itself | `content/atlas/signal-studio-umbrella.md`, BRAND.md |
| 2 | `domain` | The 8 systems in orbit | curated + live rollups |
| 3 | `product` | Tasks, Timeline, Signal, Notes | `content/hq/products/*.md` |
| 4 | `feature` | notable features | `content/hq/features/*.md` |
| 5 | `workflow` / `ecosystem-flow` | cross-product hand-offs | `content/hq/ecosystem-flows/*.md` |
| 6 | `design_principle` | design tenets | BRAND.md, DESIGN.md, `/design` |
| 7 | `engineering_system` | registered systems | `content/atlas/*.md` (`/hq/atlas`) |
| 8 | `ai_director` / `ai_workflow` | the standing AI org | signal-directors repo, `/hq/org` |
| 9 | `integration` | external + cross-repo seams | ecosystem flows, atlas registry |
| 10 | `metric` | the numbers that matter | `/hq/reporting`, launch-readiness |
| 11 | `risk` | operational/product risks | `content/hq/risks/*.md` |
| 12 | `decision` | strategic decisions | `content/hq/decisions/*.md` |
| 13 | `milestone` | launch + roadmap beats | `content/hq/launch-readiness/*`, launch date |
| 14 | `document` | proof artifacts | vault, atlas registry, docs |

v1 renders types 1–2 as **nodes on the canvas**; types 3–14 appear **inside
detail panels** as real lists and links (the drill-down / artifact layer). This
is the spec's Zoom 0–1 as nodes, Zoom 2–4 as panel content and out-links.

## 3. Object contract (TypeScript)

Every Atlas node conforms to `AtlasObject` (see `src/features/atlas/types.ts`).
Fields, and how each is populated in v1:

| Field | Source in v1 |
|---|---|
| `id`, `type`, `name` | curated |
| `description`, `purpose`, `why` | curated (on-voice prose) |
| `owner` | curated placeholder ("Ethan" / "Needs review") |
| `health` | derived from live signals (see §5) |
| `maturity` (0–100) | live where real (products, composite); else `null` + qualitative note |
| `launchReadiness` (0–100) | live where real; else `null` |
| `documentation` | curated honest assessment (none/partial/good/complete) |
| `confidence` | curated (low/medium/high) |
| `dependencies`, `related` | curated (ids into the graph) |
| `risks` | live list from `content/hq/risks` filtered to the domain |
| `metrics` | live figures with `{label,value,note}` |
| `nextActions` | live (from products/launch-readiness/operator-todos) + curated |
| `evidence` | curated links to real rooms/files (proof points) |
| `lastReviewed` | live (max source date touching the domain) |
| `links` | curated out-links to HQ rooms / registry / product sites |
| `lensPriority` | curated per-lens emphasis weight |

## 4. Connections

`AtlasConnection { id, from, to, label?, type, strength }`. **Every connection is
typed** — untyped edges are disallowed (a principle from `research.md`).

Types: `ownership` (company → domain), `dependency`, `input`, `output`,
`influence`, `evidence`. Strength (`subtle | normal | strong`) maps to hairline
opacity/width. Ownership edges are always `subtle` (they are structural, not the
story). Cross-domain edges carry the meaning.

Curated cross-domain edges for v1 (each with a reason):

- Product → Design (`influence`) — the product is the design system applied.
- Product ↔ Engineering (`dependency`) — features ride the engineering systems.
- Engineering ↔ AI (`dependency`) — AI runs on the same infra + guardrails.
- AI → Product (`input`) — AI directs attention (Signal) and drafts.
- Launch ← Product, Design, Engineering, Metrics (`dependency`) — readiness rolls
  up from these.
- Operations ↔ Business (`influence`) — how the company runs ↔ how it earns.
- Metrics → Business (`evidence`) — the numbers substantiate the business.
- Design ↔ Engineering (`dependency`) — tokens are vendored into the app.

## 5. Health derivation (honest, from live signals)

`health ∈ { healthy | attention | blocked | unknown }`, derived per domain:

- **blocked** if the domain owns a `P0 blocking` operator to-do or a `High`-impact
  risk with status `Blocked`.
- **attention** if it owns a risk `Needs attention`, or a launch-readiness gate
  `At risk`, or maturity/readiness below threshold.
- **healthy** if it has real, current signals and none of the above.
- **unknown** if no numeric signal exists yet (shown honestly, never green-washed).

This means the map tells the truth: domains with weak real data (e.g. Metrics
tracking = 20, at risk) show `attention`, not a fake green.

## 6. Mapping the 8 domains to real sources

| Domain | Real binding (computed at render) |
|---|---|
| **Product System** | avg maturity + avg launch-readiness across the 4 products; product list with scores; product risks. |
| **Design System** | qualitative (DESIGN.md, BRAND.md, `/design`, SDS 2.0). Maturity `null` → "documented, not scored" (open question Q1). |
| **Engineering System** | count of registered systems in `content/atlas`; CI gates; hardening evidence. Links into `/hq/atlas`. |
| **AI System** | AI governance evidence (spend-cap operator to-do, human-in-loop), the standing directors org (`/hq/org`). |
| **Launch System** | weighted launch-readiness composite across 14 gates; launch date `2026-09-01` + days remaining; weakest gates. |
| **Operations System** | operator to-do board (open/blocking counts); active decisions + soonest review date. |
| **Metrics System** | tracking readiness (real, currently weak); the numbers that matter → `/hq/reporting`. |
| **Business System** | pricing readiness, CRM readiness, segments, campaigns. |

## 7. Seed / data-editing model

- **Curated graph** is a single, well-commented TypeScript module
  (`data/atlas-graph.ts`) — easy to edit, fully typed, no fabricated numbers.
- **Live figures** require no editing here — they update automatically when the
  founder edits `content/hq/**` (the same edit that updates the rest of HQ).
- Unknowns are explicit constants (`UNKNOWN`, `NEEDS_REVIEW`) so the UI can style
  placeholders consistently and we never ship a fake number.

## 8. Placeholder discipline

Per the spec: no invented business facts. Where the source has no value, the
Atlas renders `Needs review` / `Not scored` / `TODO`, styled as a calm muted
chip — beautiful even when incomplete. The list of current placeholders is
surfaced in the Phase 1 summary so the founder can fill them in at the source.
