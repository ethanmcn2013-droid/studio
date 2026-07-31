# AGENTS.md — Signal Studio

Read this before any change. Canonical contract for every agent in this repo. Workspace contract: `../AGENTS.md` — read that first for the company map; this file is now the canonical home of the HQ rules — `CLAUDE.md` no longer duplicates them.

## What this is

Studio is **signalstudio.ie** — the marketing site for the suite (Signal Notes, Signal Tasks, Signal Timeline, Signal) — plus **Signal HQ** at `/hq`, a private, password-gated founder dashboard for product, launch, growth, campaigns, decisions, risks, and next actions. Not public, not linked from nav, stays `noindex`.

## Commands

`pnpm typecheck` · `pnpm build` · `pnpm test` — run all three before any PR. Local dev launches via the workspace `launch.json`, not an ad hoc `pnpm dev`. `pnpm-workspace.yaml`'s `packages` line is required — don't remove it.

## The Signal HQ rule (canonical, rewritten HQ-6c.4, 2026-05-14)

Signal HQ is the internal source of truth for product, brand, GTM, marketing, outreach, launch readiness, decisions, risks, metrics, and next actions. **HQ reads from source files; it is not the source itself.** When you change strategic HQ content, you change the source — HQ picks it up on the next render.

The sources, by section:

| If you're changing…                                                | Source file                                          |
|----------------------------------------------------------------------|--------------------------------------------------------|
| a decision, its review date, or its status                         | `content/hq/decisions/<id>.md`                       |
| a risk, mitigation, likelihood, or impact                          | `content/hq/risks/<id>.md`                           |
| a feature scope or status                                          | `content/hq/features/<id>.md`                        |
| a finance data pack (cost/revenue model JSON)                      | `content/hq/finance/<pack>.json`                     |
| a campaign goal, blocker, or progress                              | `content/hq/campaigns/<id>.md`                       |
| messaging, positioning, hooks, pitches                             | `content/hq/messaging.md`                            |
| a product's role, maturity, status                                 | `content/hq/products/<id>.md`                        |
| a cross-product flow                                               | `content/hq/ecosystem-flows/<id>.md`                 |
| collaboration loop, shared objects, access roles, first view, shareable artifacts | `content/hq/<section>/<id>.md`        |
| launch readiness scorecard                                         | `content/hq/launch-readiness/<id>.md`                |
| segments, content, demos, templates, pilots, growth workflow       | `content/hq/<section>/<id>.md`                       |
| a documented system (cron, DB, hook, cross-repo writer, etc.)      | `content/atlas/<slug>.md` — and bump `lastVerified`  |
| voice, naming, banned words, visual register                       | `BRAND.md`                                           |
| the active cycle / phase line                                      | `CHANGELOG.md` — the newest dispatch is the cycle    |
| something shipped that users or leadership should know about       | `CHANGELOG.md` — dispatch shape per BRAND.md §6.5    |
| a founder/operator-gated task (API key, account, prod env var, legal doc, cost limit, policy) | `content/hq/operator-todos/<id>.md` |

**Live operator surfaces** (browser-edited, localStorage-backed, no markdown source): `prospects` (CRM), `feedback`, `weeklyRhythm`, `nextActions` stay editable at runtime — don't migrate them without cause.

## Operator to-do rule (codified 2026-06-23)

Any founder/operator-gated task — provision an account, get an API key, set a production env var, publish a legal/privacy doc, approve a cost limit, decide a policy — must be logged as a file in `content/hq/operator-todos/<id>.md` (file shape in that folder's `README.md`), never left in a chat message or a buried doc. It renders on `/hq` via `HqOperatorTodos`. Mark `status: done` only when genuinely complete — never optimistically. Applies to work surfaced in **any** Signal product repo, not just Studio.

## Room registry rule (codified 2026-07-12)

**A room exists iff it is in `src/lib/hq/rooms.ts`.** The registry renders the HQ nav, the group landing pages, the Today group cards, and the command palette; `src/lib/hq/rooms.test.ts` fails `pnpm test` when a route directory and the registry disagree in either direction. Never hand-edit a room list anywhere else — there isn't one. New content-collection status values are added by extending `DECLARED_STATUSES` in the contract test — deliberately, never implicitly. Full architecture and governance: `docs/HQ_ARCHITECTURE.md`.

## Dispatch

Shipped, operator-visible work gets a `CHANGELOG.md` entry: `## YYYY-MM-DD · X·NN · verb · headline`, verbs `ships / tightens / cuts / holds / reads`. Full entry shape and voice rules live in `BRAND.md` §6.5 — don't duplicate the spec here.

## Design register (amended 2026-07-31)

Confident, premium, expressive — edited, not timid. Geist; indigo `#4f46e5`
is the anchor, not a cage — its tints, gradients, and supporting tones are
welcome when the moment earns them. Motion is a first-class material: use it
generously where it clarifies or delights, cut it where it merely decorates.
Reach further than feels safe in exploration; restraint is the edit at the
end, never the brief at the start. Never cheap: no clutter, no stock
effects, no noise. Voice rules are unchanged — plain English, active verbs,
no exclamation marks, banned-words list in BRAND.md.

## Pointers

Infrastructure → `docs/INFRASTRUCTURE.md`. Brand + voice → `BRAND.md`. Strategy → `docs/VISION.md`. Deprecated, do not follow: `DESIGN.md` and `docs/BRAND.md` are v1 history, superseded by `BRAND.md` (voice) and Signal Design System 2.0 (visual tokens).
