# Signal Studio

Signal Studio is the public web and operating repository for the Signal Studio suite.

## What lives here

- **signalstudio.ie** — the public marketing surface for Signal Studio.
- **Signal HQ** — the private founder/operator dashboard at `/hq`.
- Brand, product, launch, growth and operating source material consumed by HQ.
- Shared verification and release tooling for this repository.

The customer application is maintained separately in the `app` repository. This repository is not the authenticated customer app.

## Before changing anything

Read `AGENTS.md` first. It is the canonical repository contract and points to the workspace-level operating agreement.

Key source locations:

- `BRAND.md` — brand and voice.
- `content/hq/` — HQ source records.
- `content/atlas/` — documented systems.
- `src/` — website and HQ implementation.
- `docs/` — infrastructure, product and operating documentation.

## Development

Use the shared Signal Studio workspace rather than an ad-hoc clone when possible.

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

Local development is launched through the workspace configuration described in `AGENTS.md`.

## Repository boundary

HQ is access-controlled at runtime, but source committed to this repository follows the repository's GitHub visibility. Do not add credentials, private customer data, personal data, or material that is not approved for this repository boundary.

Strategic and operational records should be edited at their canonical source rather than copied into rendered HQ pages. Current delivery priority, assignee, workflow status and next proof live in the delivery tracker linked from HQ.

## Deployment

Production is deployed through Vercel. Treat repository renames, visibility changes, domain changes and deployment-binding changes as migrations: inventory consumers first, update them together, then verify the live site and HQ.

## Related repositories

The private `signal-studio-workspace` repository is the control plane for the local multi-repository workspace, recovery tooling, shared agent agreement and repository manifest. The authenticated customer application is in `app`. Supporting systems such as motion, design-system and review tooling remain separate where their release or access boundaries differ.
