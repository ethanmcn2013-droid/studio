# Codex Instructions — Signal Studio

Read `AGENTS.md` first. It is the main operating contract for this repo.

This file exists so Codex sessions that look for a Codex-specific instruction file still inherit the Signal HQ rule.

## Signal HQ Is Mandatory

Any meaningful change to product, brand, GTM, marketing, roadmap, features, campaigns, workflows, templates, outreach, demos, reports, decisions, risks, metrics, or strategic learning must be reflected in Signal HQ before the task is complete.

Use these files as the source for HQ updates:

- `src/lib/hq/data.ts` for objects and seed dashboard state
- `src/lib/hq/signals.ts` for derived operating signals
- `signal-growth/` for growth memory and reusable learning
- `docs/ECOSYSTEM_INTEGRATION_PLAN.md` for cross-product flows, sharing, invitations, templates, guest access, public outputs, and source tracking
- `docs/CYCLE_2_INVITE_AND_FIRST_VIEW.md` for invite roles, guest access, first-view behaviour, and source tracking
- `docs/SIGNAL_HQ.md` for HQ operating rules
- `CHANGELOG.md` for meaningful changes

If the task happens in a sibling Signal product repo, update the Studio repo's Signal HQ data as part of the same work or explicitly leave a follow-up action in Signal HQ.

Collaboration is the organic outreach loop: workspace created -> collaborators invited -> work becomes clearer -> shareable output created -> new creator discovered.

## Local-First Caveat

HQ v1 persists browser edits in `localStorage`. When repo-backed HQ data changes, bump `seedHqData.updatedAt` so the dashboard can notice that the repo version is newer than the browser copy.
