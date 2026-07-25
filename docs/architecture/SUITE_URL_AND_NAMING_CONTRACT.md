# Signal Studio URL and naming contract

Status: accepted  
Decision date: 2026-07-25  
Owners: Signal Studio marketing and unified-app maintainers

## Decision

Signal Studio uses two canonical user-facing origins:

1. `https://signalstudio.ie` for the company, shared commercial pages, and the
   four canonical product marketing pages.
2. `https://app.signalstudio.ie` for the single signed-in application.

The product model is **one app with four products**, not four apps and not four
independent marketing sites.

## Canonical map

| Product | Marketing | App module | Stable public/service origin |
|---|---|---|---|
| Signal Notes | `https://signalstudio.ie/notes` | `https://app.signalstudio.ie/app/notes` | None; `notes.signalstudio.ie` is redirect-only |
| Signal Tasks | `https://signalstudio.ie/tasks` | `https://app.signalstudio.ie/app/board` | `https://tasks.signalstudio.ie` for templates, embeds, invites, webhooks, and operational API compatibility |
| Signal Timeline | `https://signalstudio.ie/timeline` | `https://app.signalstudio.ie/app/plan` | `https://timeline.signalstudio.ie` for `/s/*` bearer artifacts and `/the-wedding` |
| Signal | `https://signalstudio.ie/signal` | `https://app.signalstudio.ie/app/brief` | None; `signal.signalstudio.ie` is redirect-only |

## Link classification

Every cross-product URL must be classified before it is changed:

- **Marketing:** a product explanation or exploration link. Use the matching
  `signalstudio.ie/<product>` page and keep navigation in the same tab.
- **App:** an authenticated launcher, product rail item, account-menu jump, or
  "open" action. Use the matching `app.signalstudio.ie/app/*` module route.
- **Public artifact:** a recipient-facing Timeline or share link. Preserve the
  branded public origin and opaque path.
- **Service:** templates, embeds, webhooks, invites, redeem flows, or internal
  APIs. Use the documented service origin; do not derive it from a marketing
  constant.
- **Legacy:** an old hostname or pre-rename bookmark. Redirect permanently to
  the matching canonical destination while preserving safe query context.

Ambiguous exports such as a single `TASKS_URL` must not be introduced in new
code. Use explicit marketing, app, public, or service names.

## Redirect and proxy policy

- Retired marketing roots redirect to their matching product page, never to
  the umbrella root.
- Retired `/app/*` entries redirect to their matching module in the unified
  app.
- `timeline.signalstudio.ie/s/*` remains a stable branded entry and is proxied
  to the unified app so bearer tokens do not appear in a new public hostname.
- `timeline.signalstudio.ie/the-wedding` remains the canonical venue example.
- Tasks service URLs are not mechanically redirected because some clients,
  including webhook senders, may not follow redirects safely.

## Deployment ownership

Current Vercel ownership:

- Studio project: `signalstudio.ie`, `www`, and the retired Notes, Timeline,
  Signal, Roadmap, and Analytics hosts.
- Tasks project: `app.signalstudio.ie` and `tasks.signalstudio.ie`.
- Notes, Timeline, and Signal product applications are consolidated into the
  Tasks codebase. Their former projects are not production authorities.

## Source files

- Human contract: this file and
  `docs/brand-guide/naming/NAMING_CONSTITUTION.md`
- Machine-readable contract: `contracts/suite-contracts.v1.json`
- Studio link helpers: `src/lib/product-urls.ts`
- Unified-app link helpers: `tasks/src/lib/product-urls.ts`
- Legacy host rules: `next.config.ts`

When a domain or route changes, update these sources in the same release.
