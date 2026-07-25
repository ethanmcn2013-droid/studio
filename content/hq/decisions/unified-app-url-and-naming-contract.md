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

Signed-in work lives at `app.signalstudio.ie`. The established module entries
remain `/app/notes`, `/app/board`, `/app/plan`, and `/app/brief`.

The product rail uses the labels Notes, Tasks, Timeline, and Signal. It does not
present four separate apps.

## Why

The consolidation removed the reason for four app origins, while redirecting
every old marketing host to the umbrella root removed the product destination
entirely. Hash fragments were rejected because they are not independent,
crawlable marketing pages and cannot carry product metadata or a durable
information architecture.

The existing functional app paths remain because they are already deep-link
contracts and `/app/timeline` is a Tasks view. Renaming them for visual symmetry
would create a collision and unnecessary migration risk.

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
