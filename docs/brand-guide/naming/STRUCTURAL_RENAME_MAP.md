# Structural Rename Map

Status: active migration map.

This file tracks the code, route, asset, config, and operator surfaces for the
Signal Studio naming pivot.

## Completed in source

| Old | New | Surface | Status |
| --- | --- | --- | --- |
| `Epic` | `Project` | Operating language | Complete |
| `Sprint` | `Cycle` | Operating language | Complete |
| `Ticket` | `Task` | Operating language | Complete |
| `Bug` | `Problem` | Operating language | Complete |
| `Backlog` | `Queue` | Operating language | Complete |
| `Director` | `Advisor` | Advisory system language | Complete, except legal/company-office usage |
| `/roadmap` in Tasks marketing | `/timeline` | Route | Complete, old route redirects |
| `/api/roadmap.ics` | `/api/timeline.ics` | API route | Complete, old route re-exports |
| `/hq/one-pagers/roadmap` | `/hq/one-pagers/timeline` | Studio HQ route | Complete, old route retained |
| `/hq/one-pagers/analytics` | `/hq/one-pagers/signal` | Studio HQ route | Complete, old route retained |
| `signal-roadmap.*` | `signal-timeline.*` | Brand logo assets | Complete |
| `signal-analytics.*` | `signal.*` | Brand logo assets | Complete |
| `roadmap-*` product wordmark assets | `timeline-*` | Brand kit assets | Complete |
| `analytics-*` product wordmark assets | `signal-*` | Brand kit assets | Complete |
| `src/components/roadmap` | `src/components/timeline` | Timeline app imports | Complete |
| `src/lib/roadmap` | `src/lib/timeline` | Timeline app imports | Complete |
| `tasks/src/server/roadmap` | `tasks/src/server/timeline` | Tasks GTM timeline internals | Complete |
| `actions/roadmap.ts` | `actions/timeline.ts` | Tasks server actions | Complete |
| `directors/` | `advisors/` | Advisor repo charters | Complete |
| `config/directors.yaml` | `config/advisors.yaml` | Advisor repo config | Complete |
| `director-inbox` | `advisor-inbox` | Advisor bot memory queue | Complete |
| `roadmap-product-excellence` | `timeline-product-excellence` | Advisor ID | Complete |
| `analytics-product-excellence` | `signal-product-excellence` | Advisor ID | Complete |

## Compatibility retained

| Compatibility surface | Why it remains |
| --- | --- |
| `roadmap_items`, `roadmapItems` | Database/API contract. Rename only with a schema migration and backfill. |
| `roadmap` repo folder | Local checkout, Git remote, Vercel project, and deployment history are operator-gated. |
| `analytics` repo folder | Local checkout, Git remote, Vercel project, and deployment history are operator-gated. |
| `signal-directors` repo folder | Local checkout and Git remote rename are operator-gated. Operating name is `signal-advisors`. |
| `DIRECTOR_AVATAR_BASE_URL` | Backward-compatible env fallback. New env is `ADVISOR_AVATAR_BASE_URL`. |
| Director footer parser aliases | Historical decision-log entries may still say Director. Parser accepts both Advisor and Director. |
| Legal `Director` references | Company-office role, not advisory brand language. |
| Vercel/Google/Web Analytics | Platform product names, not Signal product naming. |

## Rename order from here

1. Finish operator-gated domain/repo/env changes.
2. Add host-level redirects from old domains to new domains.
3. Migrate database/table identifiers only after a production backup.
4. Remove compatibility aliases after old links and env vars have aged out.
