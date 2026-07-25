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

Signed-in routes keep their established functional nouns:

- Notes: `app.signalstudio.ie/app/notes`
- Tasks: `app.signalstudio.ie/app/board`
- Timeline: `app.signalstudio.ie/app/plan`
- Signal: `app.signalstudio.ie/app/brief`

The app paths are intentionally not renamed to mirror the product IDs.
`/app/timeline` already names a Tasks view, and `/app/board`, `/app/plan`, and
`/app/brief` are established deep-link contracts. The product rail supplies
the product names; the route supplies the primary surface within that product.

Legacy hosts such as `notes.signalstudio.ie` are compatibility entry points,
not canonical marketing names and not separate products or apps.
