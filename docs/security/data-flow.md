# Signal Studio data flow and trust boundaries

**Status:** Phase 1 model, 2026-07-16. This is a model of observed code paths, not a claim that the controls are complete.

```text
Public visitor
   | HTTPS / marketing and public projections
   v
Vercel edge + Next.js public routes ------------------------------+
   | Clerk session / sign-in                                   |
   v                                                           |
Clerk production instance                                       |
   | user identity / session                                   |
   v                                                           |
Product server actions and route handlers                       |
   | explicit authorization still required                     |
   +--> Turso/libSQL product DBs (Tasks, Timeline, Signal, Notes)
   +--> shared entitlement / Studio-HQ DB
   +--> Stripe (billing webhooks)
   +--> Resend (email and inbound events)
   +--> Google Calendar (OAuth tokens and calendar data)
   +--> Sentry (sanitised errors only)
   +--> cross-product read-only aggregation (Studio Today)

Vercel preview/development --must never share--> production DBs or credentials
GitHub source/Actions ------must never expose--> secrets or production data
Operator/support ----------separate principal--> customer content and audit trail
```

## Trust boundaries

| Boundary | Ingress | Asset at risk | Required control / current evidence |
|---|---|---|---|
| Browser to app | cookies, form bodies, URL identifiers, headers | tenant objects and actions | derive actor and workspace server-side; current product-local guards require verification |
| Clerk to app | session subject, organization/membership claims | identity and role decisions | authentication is not authorization; central policy required |
| Public share to app | slug/token/query parameters | deliberately projected content | high-entropy hashed revocable token and safe projection required; legacy/link posture unverified |
| App to Turso | SQL/query builders and service credentials | all durable tenant data | non-null workspace keys, composite FKs and scoped queries required; libSQL has no RLS |
| App to provider webhooks | Stripe/Resend/Clerk/Vercel requests | billing, email, account state | signature, timestamp, event-id and idempotency checks required |
| App to Google | OAuth callback, refresh token, calendar API | calendar content and long-lived credentials | strict state/redirect/scopes, encrypted token storage and revocation |
| Runtime to observability | exceptions, request metadata, breadcrumbs | customer content and secrets | scrub request bodies, tokens, cookies and sensitive headers before Sentry/logging |
| Preview/development to production | environment variables, DB URLs, deployments | production data and credentials | separate projects and secrets; proof absent |
| Operator to production | Vercel/GitHub/Clerk/Turso consoles | all data and configuration | separate privileged identity, MFA/passkeys, quarterly access review and break-glass log |

## Data classes

- **Public:** marketing pages and deliberate public projections only.
- **Customer content:** notes, tasks, timelines, briefings, templates, exports and calendar-derived content.
- **Identity/account:** Clerk subject, email, memberships, roles, recovery and entitlement records.
- **Secrets:** Turso tokens, Clerk secret key, Stripe/Resend signing credentials, OAuth refresh tokens, cron/API keys.
- **Security telemetry:** actor, action, workspace, resource type, outcome, request correlation and provider event id; never content or token values.

