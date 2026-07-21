# Claude Code Instructions — Signal Studio

Start here, then read `AGENTS.md`.

Claude Code must follow the same operating contract as Codex in this repo.

## Mandatory Signal HQ Rule (rewritten HQ-6c.4, 2026-05-14)

Signal HQ is the internal source of truth for product, brand, GTM, marketing, outreach, launch readiness, decisions, risks, metrics, and next actions. **HQ reads from source files; it is not the source itself.** When you change strategic HQ content, you change the source — HQ picks it up on the next render.

The sources, by section:

| If you're changing…                                                | Source file                                          |
|--------------------------------------------------------------------|------------------------------------------------------|
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
| the active cycle / phase line                                      | `~/.claude/state/phase.md`                           |
| something shipped that users or leadership should know about       | `CHANGELOG.md` — dispatch shape per BRAND.md §6.5    |
| a founder/operator-gated task (API key, account, prod env var, legal doc, cost limit, policy) | `content/hq/operator-todos/<id>.md` |

**Live operator surfaces (browser-edited, localStorage-backed):** the four sections that have no markdown source — `prospects` (CRM), `feedback`, `weeklyRhythm`, `nextActions` — stay editable in the `/hq` dashboard at runtime. Don't migrate these to markdown unless there's a real reason.

## Mandatory Operator To-Do Rule (codified 2026-06-23)

Any founder/operator-gated task — work that **only the founder can do**: provision an account, get an API key, set a production env var, publish a legal/privacy doc, approve a cost limit, decide a policy — must be logged as a file in `content/hq/operator-todos/<id>.md`. It renders on the `/hq` main page via `HqOperatorTodos`. This applies to work surfaced in **any** Signal product repo, not just Studio.

Never leave an operator blocker in a chat message or a buried doc — the ledger is the single place the founder sees what they are blocking and the agent records what is gating the work. Mark `status: done` only when genuinely complete; nothing is optimistically green. File shape is documented in `content/hq/operator-todos/README.md`.

**What this rule replaces.** The old rule said "update `src/lib/hq/data.ts` before the task is complete". That contract created drift between the seed and the operator's localStorage edits, and it made every cycle re-write a 2,334-line file. The new contract is *no separate update step* — the markdown is the change. HQ is the view.

**Cross-repo consideration.** If you're working in another Signal product repo and a change affects Studio's operating state (a cron schedule, a cross-repo writer, an atlas-referenced file), update the relevant atlas entry's `lastVerified` or `references[]` in the Studio repo as part of the same cycle. The drift-trigger in `.githooks/pre-commit` flags it for you when source files change but the entry doesn't.

**Dispatch entries.** Cycle-grade work writes a `CHANGELOG.md` entry in the dispatch shape (BRAND.md §6.5): `## YYYY-MM-DD · X·NN · verb · headline`, then a bold impact-lead sentence, then prose. Verbs are `ships / tightens / cuts / holds / reads`. Silence is also brand — don't write a dispatch entry just to write one.

Collaboration is the organic outreach loop: workspace created → collaborators invited → work becomes clearer → shareable output created → new creator discovered. Preserve that loop when making product or GTM choices.

## Mandatory HQ Room Registry Rule (codified 2026-07-12)

**A room exists iff it is in `src/lib/hq/rooms.ts`.** The registry renders the HQ nav, the group landing pages (`/hq/sell·make·money·company`), the Today group cards, and the command palette — and `src/lib/hq/rooms.test.ts` fails `pnpm test` when a route directory and the registry disagree in either direction. Never hand-edit a room list anywhere else; there isn't one.

Before adding room #NN+1, answer in the commit body: which group, which kind, what founder question it answers, why no existing room covers it, and its retirement condition. The default answer to a new room is "it's a section of an existing room." When a review room reaches its verdict, the same change sets its registry `lifecycle: "decided"` so it shelves on its landing page. Display renames are free (`name` in the registry); URL renames are forbidden. New content-collection status values are added by extending `DECLARED_STATUSES` in the contract test — deliberately, never implicitly. The full architecture and governance rules live in `docs/HQ_ARCHITECTURE.md`.

## Dashboard Persistence Note

The `/hq` dashboard reads strategic content from `content/hq/<section>/*.md` (server-rendered, no localStorage). It still uses `localStorage` for the four operator-owned surfaces (`prospects`, `feedback`, `weeklyRhythm`, `nextActions`) — those have no other source of truth. The legacy `src/lib/hq/data.ts` seed survives as type-shape fallback for un-migrated arrays; it's marked dead substrate at the top of the file.

## Before Finishing

Run the available checks. At minimum:

- `pnpm typecheck`
- `pnpm build`

If `pnpm` is unavailable, use `corepack pnpm`.
