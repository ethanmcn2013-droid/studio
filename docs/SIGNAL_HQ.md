# Signal HQ

Signal HQ is the private operating dashboard for building and launching Signal Studio.

It is not a public product surface. It lives at `/hq`, is protected by `SIGNAL_HQ_PASSWORD`, carries `noindex` metadata, and is intentionally absent from public navigation and the sitemap.

## Purpose

Signal HQ is the internal source of truth for:

- product readiness
- launch readiness
- growth and campaign work
- content and demo production
- outbound CRM
- pilots and partnerships
- templates
- metrics
- decisions
- feedback
- risks
- next actions
- collaboration loop readiness
- shared object model

The goal is simple: Ethan should be able to open HQ and understand the state of Signal Studio in under 60 seconds.

## 2026-05-31 Structure

Signal HQ is now organized as a founder operating system with five primary rooms:

- CRM: venue pipeline, follow-ups, replies, demos, and pilots.
- Marketing: the six-month engine and its ranked approaches.
- Assets: brand kit, one-pagers, decks, venue sales material, and proof assets.
- Reporting: the smallest useful set of company metrics with their source.
- Founders Circle: a shareholder-safe board room for story, numbers, and update packs.

The hub map is defined in `src/lib/hq/operating-system.ts`. It deliberately bridges static source material, DB-backed CRM, and live traction reads without adding a heavy backend before the workflow requires one.

## Operating Model

Signal HQ uses an Objects -> Events -> Signals model.

- Objects are products, features, campaigns, content items, prospects, decisions, metrics, risks, and actions.
- Events are meaningful changes to those objects.
- Signals are plain-language observations derived from the operating data.

Static strategy and knowledge live in `content/hq` and `docs`. Mutable truth lives in the narrow backend that already exists: CRM prospects, sponsor ledger, entitlements, license codes, redemptions, partner activation, cron health, and HQ access. `src/lib/hq/data.ts` remains a seed fallback and transitional type contract, not the primary dashboard backend.

The Collab Loop tab tracks the product-led growth system:

Workspace created -> collaborators invited -> work becomes clearer -> shareable output created -> new creator discovered.

Cycle 2 adds the invite/access model, collaborator first view, and first shareable artefacts to that tab.

Cycle 3 tracks Timeline's first built shared output: `/[workspace]/update`, with source fields and a "Created with Signal Studio" discovery surface.

The deeper product architecture lives in `docs/ECOSYSTEM_INTEGRATION_PLAN.md`.

This should move to proper server storage only after the workflow proves useful.

## Agent Sync

Claude Code and Codex both have root instruction shims:

- `CLAUDE.md`
- `CODEX.md`

Those files point back to `AGENTS.md` and repeat the mandatory Signal HQ update rule.

When an agent updates repo-backed HQ data, it must also bump `seedHqData.updatedAt` in `src/lib/hq/data.ts`.

Because HQ v1 is local-first, existing browser data may be newer or different from repo seed data. Do not silently destroy browser edits. Export before replacing local data.

## Required Agent Rule

Whenever a meaningful product, brand, GTM, marketing, timeline, feature, campaign, workflow, template, outreach, demo, report, or strategic learning change is made, update Signal HQ before the task is considered complete.

If the change affects growth strategy or messaging, also update the relevant file under `signal-growth/`.

## Security

Set `SIGNAL_HQ_PASSWORD` in the deployment environment before using `/hq`.

Without that variable, the route remains locked. The access session is stored in an HTTP-only cookie scoped to `/hq`.

Do not store sensitive CRM data in HQ unless the deployed route protection is configured and verified.
