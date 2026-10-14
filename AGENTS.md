# AGENTS.md — Signal Studio

This is the self-contained Studio contract for Claude Code and Codex. The shared block below is maintained in the private Signal Operations repository; an isolated checkout needs no parent instruction file. HQ-specific rules live here; CLAUDE.md is a thin local adapter.

<!-- signal-shared-rules:begin -->
<!-- Source: docs/agent-rules.md; sha256: b87309ff14660a99c962bd2deca2147faaf782e9f04ccfce01d5bec15b2c2068 -->
## Shared working rules

Signal Studio builds one coherent product system. Use current source and accepted product facts; do not revive an archived architecture or infer scope from an old chat.

These product and programme rules apply to Signal work. Personal work follows its own purpose, checks, and acceptance target; it does not inherit Signal launch or programme constraints.

- Follow the user's scope. Research-only requests stay read-only. For authorized implementation, own relevant checks, review, integration, receiving verification, and closeout.
- Integrate routine in-scope work without a founder merge click once current checks and proportionate revision-bound review pass. Missing review, unresolved findings, changed source/target, and explicit release holds prevent eligibility. Production consequences must be authorized and verified separately.
  During this migration, apply that integration path only to explicitly admitted, individually reviewed pilots. Adopt it as the general operating default after the P6 qualification receipt; enabling a repository setting alone does not qualify the workflow.
- One task owns its branch and checkout; one session holds the writer claim. Concurrent writers use isolated worktrees. Transfer the claim before another provider edits. Preserve unrelated changes.
- Use the existing task authority and handoff anchor. Record intended outcome, owner, source revision, target, evidence, next proof, and paused-state restore location. A new chat is not a new source of truth.
- Run the owning checks against the final state. UI changes require a real rendered check. Never report a test, review, merge, deployment, or acceptance that was not observed.
- Keep code, customer/privacy boundaries, secrets, and production/test environments distinct. Access to a tool does not authorize every effect it can perform.
- Ask the founder for a material decision outside standing authority, such as changed product direction, pricing/legal commitments, purchases, external communication, or destructive action beyond the adopted housekeeping policy. Prepare concrete options first.
- Before pausing or retiring work, preserve useful commits and files and verify the restore route. Never delete by age alone, remove another owner's state, or treat a squashed commit as unpublished solely from ancestry.
- Finish with target proof, task-state readbacks, and cleanup of owned disposable resources. A draft PR or a successful merge alone is not completion.
- Prefer purpose-based names, concise entrypoints, and scoped procedures. Automate mechanical bookkeeping; spend review effort in proportion to impact.
<!-- signal-shared-rules:end -->

## What this is

Studio is **signalstudio.ie** — the marketing site for the three-product suite
(Signal Notes, Signal Tasks, Signal Timeline) and the daily-briefing capability
inside authenticated Home — plus **Signal HQ** at `/hq`, a private,
password-gated founder dashboard for product, launch, growth, campaigns,
decisions, risks, and next actions. Home is the app front door, not a fourth
product; Signal is the company and the outcome, not a product label. HQ is not
public, is not linked from navigation, and stays `noindex`.

## Commands

Use Node 22 and the packageManager version in package.json (currently pnpm 10.33.4); install with `corepack pnpm install --frozen-lockfile`. Run `pnpm typecheck`, `pnpm test`, and `pnpm build` before any PR. Owning CI also requires `pnpm ds:check`; lint is currently informational in ci.yml. Preserve `pnpm-workspace.yaml`'s packages line. Local dev uses the owning workspace launch configuration with an explicit task checkout and available port; an isolated checkout does not inherit its parent's fixed-port process. Do not run credentialed scripts against production as a setup shortcut.

Current priorities, admission, owner and next proof belong to the private Delivery issue linked from authenticated HQ. Record the task's existing authority before editing; local claims do not certify another writer stopped. Studio main has enabled Git deployment: integration can trigger a production deployment, so verify destination authority and applicable release holds before merging. Programme-only work remains internal, with isolated test data and no implied production or outreach authority. Completion includes receiving proof and task/Project reconciliation, then owned resource closeout.

## The Signal HQ rule (canonical, rewritten HQ-6c.4, 2026-05-14)

Signal HQ is the internal reading surface for product, brand, GTM, marketing, outreach, launch readiness, decisions, risks, metrics, and operating context. **HQ reads from source files; it is not the source itself.** When you change strategic HQ content, you change the source — HQ picks it up on the next render. Current delivery priority, assignee, workflow status, and next proof live in the delivery tracker linked from authenticated HQ.

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
| the source record and rationale for a historical founder/operator gate | `content/hq/operator-todos/<id>.md` |

Runtime storage is surface-specific. Inspect the direct implementation before changing a surface; HQ currently includes database-backed, file-backed, derived, and browser-local state. These surfaces preserve operating facts, but they do not own the current delivery priority, assignee, workflow status, or next proof.

## Operator source-ledger rule (cut over 2026-09-12)

`content/hq/operator-todos/` is the retained source ledger for founder/operator gates recorded before the delivery-tracker cutover. Keep the files and their recorded status intact unless direct evidence supports a correction. Current priority, assignee, workflow status, and next proof live in the delivery tracker linked from authenticated HQ. New delivery actions go there; source context stays in the relevant HQ file.

## Room registry rule (codified 2026-07-12)

**A room exists iff it is in `src/lib/hq/rooms.ts`.** The registry renders the HQ nav, the group landing pages, the Today group cards, and the command palette; `src/lib/hq/rooms.test.ts` fails `pnpm test` when a route directory and the registry disagree in either direction. Never hand-edit a room list anywhere else — there isn't one. New content-collection status values are added by extending `DECLARED_STATUSES` in the contract test — deliberately, never implicitly. Full architecture and governance: `docs/HQ_ARCHITECTURE.md`.

## Dispatch

Shipped, operator-visible work gets a `CHANGELOG.md` entry: `## YYYY-MM-DD · X·NN · verb · headline`, verbs `ships / tightens / cuts / holds / reads`. Full entry shape and voice rules live in `BRAND.md` §6.5 — don't duplicate the spec here.

## North star (set 2026-08 · operator re-derives ~every six months)

These priorities govern the products, authenticated Home and marketing, in order:

1. **Experience.** Considered end to end, deliberately delightful where appropriate. App candidate moments follow its `docs/DELIGHT_CATALOG.md`; do not improvise them ad hoc.
2. **Design.** The best-studio standard applies to spacing, type, motion, empty/loading/error states and microcopy. Nothing default; the register and 9.5 gate apply.
3. **Utility.** First-time users must understand the surface unaided, without project-management experience, jargon or technical lock-out. A surface needing explanation is unfinished.

That order resolves conflicts. Canonical record/review date: `content/hq/decisions/product-north-star.md`.

## Design register (amended 2026-07-31 · A1 + A1.1)

Confident, premium, expressive; edited without timidity. Use Geist and indigo `#4f46e5` as an anchor, with earned tints, gradients and supporting tones. Motion is first-class: generous when clarifying or delighting, removed when merely decorative. Explore boldly; restraint belongs to the final edit. No clutter, stock effects or noise.

**Permanent A1.1: creativity and emotion outrank restraint.** When a better idea conflicts with this register, review the rule through wildcard → amendment; do not pre-censor the idea. Design for feeling and function. Voice is the standing exception: plain English, active verbs, no exclamation marks, BRAND.md's banned words; these never bend.

## Pointers

Before marketing research or drafting, read `.agents/product-marketing.md` and the current commercial sources it links. The scoped guide flags historical product/access conflicts; research does not authorize publication, outreach or commercial changes.

Infrastructure → `docs/INFRASTRUCTURE.md`. Brand + voice → `BRAND.md`. Strategy → `docs/VISION.md`. Deprecated, do not follow: `DESIGN.md` and `docs/BRAND.md` are v1 history, superseded by `BRAND.md` (voice) and Signal Design System 2.0 (visual tokens).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
