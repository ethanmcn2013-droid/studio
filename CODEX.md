# Codex Instructions - Signal Studio

Read `../CODEX.md` first, then `AGENTS.md`.

This file is a repo-local shim. The workspace-level operating contract lives one
directory up and should stay the source for Codex behavior across the suite.

## Signal HQ Rule

Any meaningful change to product, brand, GTM, marketing, pricing, roadmap,
features, campaigns, workflows, templates, outreach, demos, reports, decisions,
risks, metrics, or strategic learning must be reflected in Signal HQ before the
task is complete.

Use the canonical HQ sources:

- `content/hq/decisions/<id>.md`
- `content/hq/risks/<id>.md`
- `content/hq/features/<id>.md`
- `content/hq/campaigns/<id>.md`
- `content/hq/products/<id>.md`
- `content/hq/operator-todos/<id>.md`
- `content/atlas/<slug>.md`
- `signal-growth/**`
- `CHANGELOG.md`

`src/lib/hq/data.ts` is no longer the default strategic source. It is a seed
fallback and type substrate. Touch it only when the live code path still reads
from it.

Collaboration is the organic outreach loop: workspace created -> collaborators
invited -> work becomes clearer -> shareable output created -> new creator
discovered.

## Before Finishing

Run the available checks. At minimum:

- `pnpm typecheck`
- `pnpm build`

If `pnpm` is unavailable, use `corepack pnpm`.
