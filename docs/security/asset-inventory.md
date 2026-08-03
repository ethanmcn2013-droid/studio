# Signal Studio security asset inventory

**Snapshot:** 2026-07-16  
**Scope:** Signal Studio suite root `C:\Users\ethan\signal-studio-workspace` and its independently versioned repositories.  
**Evidence rule:** `confirmed` means observed in the working tree or Git metadata; `inferred` means a code or documentation indication that still needs deployment/operator proof; `unknown` is an explicit evidence gap.

## Repositories and deployables

| Asset | Repository / revision | Current branch | Working-tree state | Deployment role | Evidence / status |
|---|---|---|---:|---|---|
| Signal Studio umbrella | `studio` / `3001b58` | `feat/experience-quality-os` | 1 dirty entry | `signalstudio.ie` public site and HQ | confirmed repo and domain; Vercel project link not present locally |
| Signal Tasks | `tasks` / `498128c` | `feat/tasks-hero-lab` | 5 dirty entries | `tasks.signalstudio.ie` | confirmed domain in `studio/BRAND.md`; app has Clerk, Turso, Stripe, Resend, cron and webhook surfaces |
| Signal Timeline | `roadmap` / `ec408c3` | `feat/timeline-hero-lab` | 1 dirty entry | `timeline.signalstudio.ie` | confirmed domain in product map; Clerk and Turso code present |
| Signal | `analytics` / `52d0c7d` | `main` | 2 dirty entries | `signal.signalstudio.ie` | confirmed product repo; two Turso databases and Clerk code present |
| Signal Notes | `notes` / `8dc3f77` | `feat/notes-hero-lab` | 5 dirty entries | `notes.signalstudio.ie` | confirmed domain in product map; Clerk, Turso, calendar and Resend/cron paths present |
| Access / suite integration build | `access-build` / `156261f` | `feat/access-system` | clean | shared HQ, entitlements and cross-product Today reads | confirmed code; uses dedicated read-only Turso token names and an HQ shared-password gate |
| Signal Design System | `ds-foundation` / `b9dc110` | `fix/package-name-canon` | 39 dirty entries | shared package, not a customer runtime | confirmed repository; package distribution and provenance require separate review |
| Signal Review | `signal-review` / `edb5012` | `main` | clean | Chrome extension / review tooling | confirmed repository; browser-extension permissions and update path require review |
| Signal Directors | `signal-directors` / `380b987` | `chore/codex-operating-contract` | clean | operating/configuration repository | confirmed repository; not a customer data plane |
| Analytics demo, collateral | `analytics-demo` / `cb21cfc`; `collateral` / `ca7fd4c` | `main` | clean | demo and marketing build inputs | confirmed repositories; production-data and secret boundaries require proof |

`_wt-*` directories are worktrees/scratch surfaces and are excluded from the production asset count. Several are dirty; they must not be cleaned or merged as part of this programme.

## Public domains and identity

Confirmed in `studio/BRAND.md`: `signalstudio.ie`, `tasks.signalstudio.ie`, `timeline.signalstudio.ie`, `signal.signalstudio.ie`, `notes.signalstudio.ie`, and defensive `signalhq.ie`. The same file records `hello@signalstudio.ie` as the canonical contact. DNS, Vercel project ownership, production/preview aliases, and registrar access are **not proven by the local tree**.

## Data stores and service boundaries

| Service / asset | Local evidence | Security significance | Evidence still required |
|---|---|---|---|
| Turso/libSQL | `src/env.ts`, `src/server/db/**`, `drizzle.config.ts` in product repos | durable customer, entitlement, preference and operational data; libSQL has no row-level security | production database inventory, owner, region, backups, retention, restore proof |
| Clerk | product `src/proxy.ts`, `src/server/auth.ts`, `@clerk/nextjs` dependencies | authentication and session source; authentication must not be treated as authorization | production instance, plan/MFA/passkey capability, org/role model, recovery controls |
| Stripe | `tasks/src/server/stripe.ts`, webhook route references | billing and entitlement authority; forged/replayed webhooks are high impact | webhook endpoint list, signing-secret rotation, event idempotency/replay evidence |
| Resend / email | Notes and Tasks email/cron surfaces | account recovery, invites and personal-data transmission | sending domains, DKIM/DMARC, retention, subprocessors, abuse/rate limits |
| Google Calendar | `notes/src/server/calendar/**`, cron references | OAuth refresh tokens and calendar content | OAuth client inventory, scopes, token storage/encryption, revocation and deletion proof |
| Sentry | product instrumentation and scrubber modules | error/analytics boundary; customer content and sensitive headers must not be emitted | project/environment inventory, retention, PII settings, scrubber tests and alert routing |
| Vercel | `vercel.json` in deployed products and Vercel deployment conventions | runtime, preview/prod boundary, Cron and edge controls | project/team inventory, environment-variable matrix, preview isolation, branch protection, logs |
| GitHub | repository remotes and CI conventions | source, Actions, release and secret boundary | org/repo inventory, branch protection, Actions SHA pinning, secret scanning and SBOM evidence |

## Secrets and environments

The tree contains `.env.example` files and one local `.env.local` filename under `studio`; values were not read. Code names include Turso URLs/tokens, Clerk keys, Sentry DSNs, `CRON_SECRET`, Stripe and email credentials, and suite read-only tokens. Production/preview/development separation, secret rotation, and absence of production credentials from previews are **unknown until provider-console evidence exists**.

## Jobs, webhooks and privileged paths

Observed path families include Tasks Stripe/Clerk webhooks and cron routes, Notes calendar cron and inbound email/webhook paths, account export/erasure actions across products, public sharing routes, and Studio cross-product Today aggregation. Each must receive an explicit principal, authorization, replay/rate-limit, logging and tenancy row in the control register.

## Inventory gaps that block procurement claims

1. No provider export proves Vercel projects, environments, domains, Turso databases, Clerk instances, Sentry projects, Resend domains, Stripe webhooks, Google OAuth clients, GitHub Actions or subprocessors.
2. No measured backup/restore, RPO/RTO, incident exercise, penetration test, DPA/legal review or quarterly access review evidence is present in this snapshot.
3. No single shared authorization package currently exists; product-local auth, tenancy and entitlement helpers are visible instead.

