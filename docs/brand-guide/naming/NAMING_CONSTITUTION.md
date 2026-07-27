# Signal Studio naming constitution

Status: ratified  
Effective: 2026-07-25  
Scope: public marketing, the unified app, product chrome, documentation, links, and redirects

This file is the naming authority for Signal Studio. The technical URL map is
in `docs/architecture/SUITE_URL_AND_NAMING_CONTRACT.md`.

## Company and application

- The company, umbrella brand, and application are **Signal Studio**.
- There is one web application. Refer to it as **Signal Studio** or **the
  Signal Studio app**, never as the Tasks app or as four separate apps.
- The canonical application origin is `https://app.signalstudio.ie`.
- `https://signalstudio.ie` is the canonical company and marketing origin.

## The four products

The fixed product order is:

`Signal Notes -> Signal Tasks -> Signal Timeline -> Signal`

| Product ID | Full marketing name | In-app label | Role |
|---|---|---|---|
| `notes` | Signal Notes | Notes | Capture clarity |
| `tasks` | Signal Tasks | Tasks | Execution clarity |
| `timeline` | Signal Timeline | Timeline | Direction clarity |
| `signal` | Signal | Signal | Attention clarity |

Rules:

- Use the full marketing name on product pages, comparison copy, press
  material, and the first reference in longer copy.
- Use the short in-app label in the product rail, breadcrumbs, commands, and
  product-local headings.
- Do not use **Plans**, **Roadmap**, **Analytics**, or **Morning Briefing** as
  product names. Those words may describe a feature or an historical artifact
  when that meaning is accurate.
- Do not call the products separate apps. They are four products in one app.
- Do not use **Signal** as shorthand for the company; it names the
  attention-clarity product.

## URL naming

Marketing paths use product IDs:

- `signalstudio.ie/notes`
- `signalstudio.ie/tasks`
- `signalstudio.ie/timeline`
- `signalstudio.ie/signal`

Signed-in routes use the same product IDs:

- Notes: `app.signalstudio.ie/app/notes`
- Tasks: `app.signalstudio.ie/app/tasks`
- Timeline: `app.signalstudio.ie/app/timeline`
- Signal: `app.signalstudio.ie/app/signal`

The product name is the stable top-level route. Views inside Tasks sit below
`/app/tasks`, for example `/app/tasks/list`, `/app/tasks/timeline`, and
`/app/tasks/calendar`. Retired functional nouns such as `/app/board`,
`/app/plan`, and `/app/brief` are compatibility inputs only. They redirect to
the product-named entries and must not be used in new links.

Legacy hosts such as `notes.signalstudio.ie` are compatibility entry points,
not canonical marketing names and not separate products or apps.
