# AGENTS.md — Signal Studio

Read this before any change. Canonical contract for every agent in this repo. Workspace contract: `../AGENTS.md` — read that first for the company map; this file is now the canonical home of the HQ rules — `CLAUDE.md` no longer duplicates them.

## What this is

Studio is **signalstudio.ie** — the marketing site for the three-product suite
(Signal Notes, Signal Tasks, Signal Timeline) and the daily-briefing capability
inside authenticated Home — plus **Signal HQ** at `/hq`, a private,
password-gated founder dashboard for product, launch, growth, campaigns,
decisions, risks, and next actions. Home is the app front door, not a fourth
product; Signal is the company and the outcome, not a product label. HQ is not
public, is not linked from navigation, and stays `noindex`.

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
| design audits, evidence dossiers, and retained review captures     | `content/hq/design-reviews/<id>/`                    |
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

## North star (set 2026-08 · operator re-derives ~every six months)

Three priorities govern everything front-facing — the three products,
authenticated Home, and this marketing surface alike — in this order:

1. **Experience.** Using the product should feel considered end to end,
   and in the right moments delightful. Delight is deliberate: in the
   app, candidate moments run through `app/docs/DELIGHT_CATALOG.md` —
   never sprinkled ad hoc.
2. **Design.** Every front-facing surface ships at the standard of the
   best studios working today — spacing, type, motion, empty, loading,
   and error states, microcopy, all deliberate, nothing default. The
   register below and the 9.5 gate hold the bar.
3. **Utility.** Someone who has never used a project-management tool
   must be able to pick it up and understand it unaided — the
   first-contact test. No jargon, no technical lock-out; a surface that
   needs explaining is not done.

When the three pull against each other, that order decides. Canonical
record and review date: `content/hq/decisions/product-north-star.md`.

## Design register (amended 2026-07-31 · A1 + A1.1)

Confident, premium, expressive — edited, not timid. Geist; indigo `#4f46e5`
is the anchor, not a cage — its tints, gradients, and supporting tones are
welcome when the moment earns them. Motion is a first-class material: use it
generously where it clarifies or delights, cut it where it merely decorates.
Reach further than feels safe in exploration; restraint is the edit at the
end, never the brief at the start. Never cheap: no clutter, no stock
effects, no noise.

**Priority order, permanent (A1.1): creativity and emotion outrank
restraint.** No rule in this register may be used to flatten a genuinely
better idea — when they conflict, the rule goes under review (wildcard →
amendment), never the idea pre-censored. Design for feeling as much as
function: the work should move the person using it. Voice rules are the one
standing exception — plain English, active verbs, no exclamation marks,
banned-words list in BRAND.md — they never bend.

## Pointers

Infrastructure → `docs/INFRASTRUCTURE.md`. Brand + voice → `BRAND.md`. Strategy → `docs/VISION.md`. Deprecated, do not follow: `DESIGN.md` and `docs/BRAND.md` are v1 history, superseded by `BRAND.md` (voice) and Signal Design System 2.0 (visual tokens).
