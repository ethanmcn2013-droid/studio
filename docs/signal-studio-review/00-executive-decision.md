# Signal Studio pre-launch decision

**Review date:** 2026-07-11  
**Launch verdict:** No-go for broad external launch; suitable for controlled private preview after the P0 gates in `06-launch-readiness.md` are closed.

## Founder summary

Signal Studio should remain four focused, endorsed products—Signal Notes, Signal Tasks, Signal Timeline, and Signal—on their existing subdomains and independent deployments. The correct pre-launch move is not a rewrite into one application. It is to make the invisible platform layer real: one suite identity, one canonical workspace/membership/entitlement model, one consumed design-token and shell layer, stable cross-product links, common security controls, and common release evidence. Use the current separate repositories as a low-risk bridge, then move mechanically to a monorepo with independently deployable apps after launch gates are closed. This preserves product clarity and failure isolation while reducing copied code, identity fragmentation, and founder operating cost.

## Recommended target architecture

- **Brand:** four endorsed products under Signal Studio. Product names remain distinct; the company name is always Signal Studio.
- **URLs:** retain `signalstudio.ie`, `notes.`, `tasks.`, `timeline.`, and `signal.signalstudio.ie`.
- **Runtime:** retain four independent product deployments plus the umbrella/HQ deployment.
- **Repository:** Option B now (separate apps plus deliberately shared contracts); Option C next (one monorepo, five deployables, shared packages).
- **Identity:** one Clerk application/custom domain/session for the suite, subject to provider-console verification and a staged account-linking migration.
- **Tenancy:** one canonical suite user ID and workspace/membership service; product databases retain owned domain data.
- **Integration:** synchronous APIs for user-requested commands; owned read APIs/read models for queries; a database outbox and idempotent worker for durable cross-product propagation. No message broker or micro-frontends.

## What remains four products

- Notes owns private capture and explicit promotion.
- Tasks owns execution, assignments, collaboration, and workspace administration.
- Timeline owns public direction, milestones, plans, and shared updates.
- Signal owns derived attention, briefing preferences, and surfaced-item history.
- Each keeps product-specific navigation, onboarding content, schemas, deployments, and rollback.

## What becomes one shared platform

- Suite identity, account lifecycle, workspace/membership IDs, roles, invitations, and product entitlements.
- Product registry, deep-link/context contract, suite switcher, account entry point, design tokens, standard states, telemetry, security helpers, CI policy, and test fixtures.
- Billing authority: Stripe events handled once; shared entitlements database remains the runtime access projection.

## Five most important pre-launch actions

1. Fix the two confirmed Tasks cross-tenant integrity defects in task-update activity and parent/subtask creation.
2. Prove one-account sign-in, sign-out, invitation, deep-link, entitlement loss, export, and deletion across all four product domains.
3. Replace body-trusted user identities and fleet-wide bearer trust on Notes→Tasks and Studio aggregation with audience-bound, short-lived user assertions; remove email as an authorization join.
4. Inventory production Clerk, Vercel, Turso, cron, backup, restore, and alert configuration; authenticate every internal/cron endpoint and run a restore/rollback drill.
5. Add common CI authorization/contract/journey gates and introduce the canonical suite ID/context contracts before extracting broader shared UI.

## Major risks

- Confirmed Tasks tenant-integrity vulnerabilities can inject foreign activity or relationships.
- Cross-product identity is not proven canonical; Signal currently uses email to bridge Clerk identities.
- Direct database reads and synchronous service calls lack a consistent durable retry/audit boundary.
- Public Tasks output passes an over-broad internal task object, creating a disclosure hazard.
- Written strategy, shipped-state, and actual deployment configuration drift from one another.
- A premature monorepo or single-runtime migration could consume launch capacity without solving identity or tenancy.

## Confidence and unavailable information

**Confidence: high (0.84)** on product/runtime/repository direction; **medium (0.68)** on the precise identity migration because Clerk dashboard configuration was not available. Source, schemas, routes, manifests, live HTTP responses, and independent review passes were inspected. Secret values were not read. Provider-side Clerk application IDs/cookie domains, Turso token capabilities/backups, Vercel project settings/build times, production Web Vitals, alert routing, and authenticated live journeys remain unverified.

The live hosts returned HTTP 200 on 2026-07-11. Four of five returned CSP in report-only mode; Notes returned an enforced CSP. A 200 response is not proof of authenticated journey correctness.
