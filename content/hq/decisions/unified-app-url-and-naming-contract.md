---
id: unified-app-url-and-naming-contract
title: One app, four products, two canonical origins
status: Active
date: 2026-07-25
owner: founder
area: product architecture
---

## Decision

Signal Studio is one application with four products in this order:

`Signal Notes -> Signal Tasks -> Signal Timeline -> Signal`

Marketing lives at `signalstudio.ie`. Each product has a real canonical page:
`/notes`, `/tasks`, `/timeline`, and `/signal`.

Signed-in work lives at `app.signalstudio.ie`. The canonical product entries
are `/app/notes`, `/app/tasks`, `/app/timeline`, and `/app/signal`.

Tasks' internal views are nested under its product entry:
`/app/tasks`, `/app/tasks/list`, `/app/tasks/timeline`, and
`/app/tasks/calendar`.

The product rail uses the labels Notes, Tasks, Timeline, and Signal. It does not
present four separate apps.

## Why

The consolidation removed the reason for four app origins, while redirecting
every old marketing host to the umbrella root removed the product destination
entirely. Hash fragments were rejected because they are not independent,
crawlable marketing pages and cannot carry product metadata or a durable
information architecture.

The route names must describe the product the customer opened. The prior
implementation mixed product names (`notes`) with view names (`board`), retired
product names (`plan`), and content types (`brief`). That ambiguity made one app
feel like four partially consolidated applications. Nesting Tasks views under
`/app/tasks` resolves the only real collision and preserves both concepts:
`/app/tasks/timeline` is a Tasks view; `/app/timeline` is the Timeline product.

## Compatibility

- Retired product marketing hosts redirect to their matching product page.
- Retired `/app/*` links redirect to the matching unified module.
- Tasks template, invite, webhook, embed, and API origins remain classified
  service URLs.
- Timeline bearer artifacts keep `timeline.signalstudio.ie/s/*` as their
  branded entry and are served by the unified app.
- The venue example remains `timeline.signalstudio.ie/the-wedding`.

## Sources

- `docs/brand-guide/naming/NAMING_CONSTITUTION.md`
- `docs/architecture/SUITE_URL_AND_NAMING_CONTRACT.md`
- `contracts/suite-contracts.v1.json`
