# Independent review findings

## Review method

Three independent parallel passes were run after the workspace boundary was established: (1) product/brand/frontend, (2) identity/security/data, and (3) systems/performance/operations. The preferred architecture was selected only after those passes. A final red-team pass challenged the synthesis.

## Product and brand review

**Confirmed from** product documents and schemas: the four boundaries are real, not decorative. Notes captures private context; Tasks owns execution; Timeline communicates direction publicly; Signal derives attention. Each has a coherent refusal set.

**Finding:** use endorsed products under Signal Studio, not four standalone brands and not one feature-bucket application. Keep full names on first mention and short names in product chrome. Keep subdomains and the line “Four products, one system.”

**Risk:** the product named Signal can be confused with the company. Always retain Signal Studio context in global chrome. Tasks’ local “Timeline” view also risks confusion with Signal Timeline.

## Systems architecture review

**Confirmed from** five manifests and Git roots: there are five independent Next.js deployables. Cross-product coordination is a mix of direct database reads, synchronous HTTP, build-time sync, and copied code. There is no durable general event boundary.

**Finding:** Option B is the safe pre-launch bridge; Option C is the two-year target. Four runtime boundaries are useful. Five separately implemented platform layers are not.

## Identity and security review

### P0 confirmed findings

1. **Foreign activity injection.** `updateTaskAction` scopes its update to the active workspace but records activity even when no row matched (`tasks/src/server/actions/tasks.ts:297-335`). `recordActivity` resolves the supplied task globally and writes into its workspace (`tasks/src/server/db/activity.ts:23-45`). An authenticated user who knows a foreign task ID can inject activity into another tenant.
2. **Foreign parent/subtask relationship.** `addTaskAction` accepts `parentTaskId` without proving the parent belongs to the active workspace (`tasks/src/server/actions/tasks.ts:342-396`). Child reads by parent ID (`tasks/src/server/db/queries.ts:97-107`) can expose attacker-controlled child content beneath a victim task.

### P1 findings

- Tasks public publishing passes full internal `Task` objects (`tasks/src/server/db/queries.ts:115-145`, `tasks/src/app/p/[slug]/page.tsx:61-80`) containing contact, money, provenance, assignee, and description fields (`tasks/src/lib/data.ts:187-256`). Create a public allowlist DTO.
- Studio `/api/today` trusts body `{clerkId,email}` after one `SUITE_API_KEY` check (`studio/src/app/api/today/route.ts:10-77`). Notes→Tasks similarly trusts body `userId` after a global bearer (`tasks/src/app/api/notes-extract/route.ts:14-79`).
- Signal joins Tasks identity by email because Clerk IDs may differ (`analytics/src/lib/briefing/tasks-db-source.ts:11-18,68-90`). Email is mutable and cannot be an authorization key.
- Demo/review modes intentionally expose app routes in Signal and Notes; production must assert those modes cannot activate on production domains.

### Positive controls

Tasks validates the active-workspace cookie against membership; normal reads are workspace-scoped. Notes note mutations filter by both note ID and user ID. Notes Google OAuth state is nonce/HMAC protected. Signal/Notes proxies fail closed when production Clerk configuration is missing. Signal cron uses a timing-safe secret comparison. Timeline mutations verify signed-in ownership.

## Frontend and design-system review

**Confirmed from** identical file hashes and layouts: suite switching and shell patterns are copied. Product switches are full cross-origin navigations to generic `/app` destinations and lose object/workspace context. The documented `signal-ds` package is not consumed by product manifests/CSS.

**Finding:** share the product registry, switcher, identity entry point, tokens, standard states, telemetry, and context envelope. Keep Tasks’ dense navigation, Timeline’s public editor/viewer, Notes’ notebook, and Signal’s briefing product-specific.

## Performance and reliability review

**Measured:** five full build/cache artifacts exist; exact route JS, Core Web Vitals, cold starts, and database latency were not measured. Package versions drift. Separate cron schedules and optional rate-limit providers exist. Direct cross-product calls lack a consistent timeout/retry/idempotency policy.

**Finding:** measure before tuning. Introduce budgets and instrumentation, then remove waterfalls and duplicate initialization where evidence supports it. Cross-domain overhead is acceptable for focused product switches; preserve context and session to make it feel intentional.

## Developer experience and operations review

- No repository-local GitHub Actions workflows were found.
- Tests are uneven and local; file count is not coverage.
- Tasks normal development runs `drizzle-kit push --force && next dev`, which risks schema/data drift.
- Observability and CSP enforcement differ across apps.

**Finding:** common CI, migrations, preview contracts, environment inventory, error/cron alerts, and rollback drills are pre-launch operating requirements. A monorepo improves atomicity later but cannot substitute for these controls.

## Company/platform operating-model review

Recommend a **shared platform core plus clearly owned product domains**. The platform owns identity, workspaces/memberships, entitlements, billing projection, links, shell, telemetry, and delivery standards. Product domains own their objects and user value. Packaging can change later because entitlements are product-capable overlays on a canonical workspace/account model.

## Agreements and disagreements

| Question | Agreement | Tension / resolution |
|---|---|---|
| Preserve four products? | Unanimous yes | Do not confuse product separation with duplicated platform logic |
| One runtime before launch? | Unanimous no | Reconsider only with future evidence |
| Monorepo? | Product review says not needed pre-launch; ops review prefers as target | Use Option B now, Option C after gates |
| Shared Clerk? | Strongly preferred for UX/canonical subject | Provider configuration and migration must be verified first |
| Shared database? | No blanket consolidation | Shared identity/entitlement core; product-owned schemas and explicit read contracts |
| Events? | Durable integration needed | Use DB outbox/worker; no broker yet |

## Red-team review

The recommendation could fail if a shared Clerk application creates an unacceptable blast radius or enterprise isolation requirement, if monorepo tooling couples every release, or if canonical workspace semantics flatten intentional differences such as private Notes and public Timeline. Central packages can become a bottleneck and “shared platform” can become an aesthetic project.

The smaller intervention delivers most value: fix tenant defects; prove one identity; define typed IDs/context; centralize product registry/tokens/security helpers; add common CI. Leave repositories and deployments alone until this works. If shared identity cannot meet domain/cookie or future residency requirements, use federated Clerk applications plus an explicit suite-subject mapping service—not email.

## Updated recommendation

No pre-launch repository or runtime consolidation is required. Identity/tenancy/security and journey evidence are required. Once those are proven, migrate mechanically to a monorepo while preserving independent deployments.
