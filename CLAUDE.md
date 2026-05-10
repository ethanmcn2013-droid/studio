# Claude Code Instructions — Signal Studio

Start here, then read `AGENTS.md`.

Claude Code must follow the same operating contract as Codex in this repo.

## Mandatory Signal HQ Rule

Signal HQ is the internal source of truth for product, brand, GTM, marketing, outreach, launch readiness, decisions, risks, metrics, and next actions.

Whenever you make a meaningful change to:

- product scope
- roadmap
- feature status
- launch readiness
- positioning
- messaging
- campaigns
- content
- demos
- templates
- outreach
- pilots
- partnerships
- metrics
- decisions
- risks
- strategic learning

you must update Signal HQ before the task is complete.

In this repo that usually means updating:

- `src/lib/hq/data.ts`
- `src/lib/hq/signals.ts` if derived logic changes
- relevant files under `signal-growth/`
- `docs/ECOSYSTEM_INTEGRATION_PLAN.md` if the change affects cross-product flows, sharing, invitations, templates, guest access, public outputs, or source tracking
- `docs/SIGNAL_HQ.md` if the operating model changes
- `CHANGELOG.md` for meaningful user-visible or operator-visible changes

If you are working in another Signal product repo and the change affects Signal Studio's operating state, open or update a Studio PR that reflects it in Signal HQ.

Collaboration is the organic outreach loop: workspace created -> collaborators invited -> work becomes clearer -> shareable output created -> new creator discovered. Preserve that loop when making product or GTM choices.

## Dashboard Persistence Note

The `/hq` dashboard is local-first in v1. Browser edits persist in `localStorage`, while repo-backed defaults live in `src/lib/hq/data.ts`.

When updating repo-backed HQ data, update `seedHqData.updatedAt` so the dashboard can detect that newer repo data exists.

## Before Finishing

Run the available checks. At minimum:

- `pnpm typecheck`
- `pnpm build`

If `pnpm` is unavailable, use `corepack pnpm`.
