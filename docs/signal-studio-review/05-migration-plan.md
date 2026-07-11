# Migration plan

Sizes are relative: XS, S, M, L, XL. No calendar estimates are asserted.

## Phase 0 — Measurement and safety

| Item | Problem / proposed change | Products | Dependencies | Risk / rollback | Validation | Size | Priority | Before launch |
|---|---|---|---|---|---|---|---|---|
| Production topology inventory | Provider configuration is unknown. Record Clerk apps/domains, Vercel projects/env names, Turso DBs/token scopes/regions/backups, cron owners, Sentry projects without secret values | All | Provider access | Read-only; no rollback | Signed inventory reviewed against source | S | P0 | Yes |
| Baseline performance | No valid Web Vitals, route JS, build, query, redirect, or cold-start baseline. Add measurement and capture p75/p95 | All | Production-like preview | Instrumentation overhead; feature flag/remove | Repeatable baseline report | M | P1 | Yes |
| Threat/authorization matrix | Access rules are implicit. Enumerate actor × route/action × tenant/object | All | Canonical role vocabulary | Documentation only | Matrix maps to automated tests | M | P0 | Yes |
| Backup/restore and rollback drill | Recovery claims unproven. Restore copies and roll back one deployment | All | Provider inventory | Use isolated restore target | RPO/RTO and rollback receipts | M | P0 | Yes |

## Phase 1 — Pre-launch blockers

| Item | Problem / proposed change | Products | Dependencies | Risk / rollback | Validation | Size | Priority | Before launch |
|---|---|---|---|---|---|---|---|---|
| Fix foreign activity injection | Record activity only after workspace-scoped update returns owned task; require workspace in helper | Tasks | Auth matrix | Local behavior change; revert patch | Cross-tenant regression test | S | P0 | Yes |
| Fix foreign parent link | Validate parent in active workspace; scope child query; add DB invariant | Tasks | Schema migration | Additive constraint may expose legacy rows; preflight and reversible migration | Cross-tenant + legacy-data tests | M | P0 | Yes |
| Public task DTO | Replace full internal Task on public routes with allowlist | Tasks | Public-output contract | Missing intended field; rollback DTO mapping | HTML/RSC snapshot and privacy test | S | P0 | Yes |
| Service identity hardening | Replace body-trusted IDs/shared bearer with audience-bound assertion and replay/audit | Studio, Notes, Tasks | Identity decision | Dual-accept during migration; rotate credentials after cutover | Forged/replayed/cross-audience tests | L | P0 | Yes |
| Signal identity join | Map immutable suite subject; remove email authorization join; validate membership on every path | Signal, Tasks | Clerk inventory, mapping table | Shadow compare old/new; rollback read path | Alias/duplicate/email-change/removed-member tests | L | P0 | Yes |
| Production mode assertion | Fail deploy if demo/review mode is active on production domains | Notes, Signal | CI/deploy config | Override only through audited emergency flag | Production smoke proves no real DB in demo | S | P0 | Yes |
| Suite lifecycle | Coordinate export, deletion, suspension, membership loss, and entitlement loss | All | Canonical subject inventory | Dry-run/report before deletion | Eight-journey suite test | L | P0 | Yes |
| CI and migration safety | Add required typecheck/test/build/security/contract gates; remove force-push schema from normal dev/prod | All | Provider/project access | Initially non-blocking, then required | Clean clone and migration rehearsal | M | P1 | Yes |

## Phase 2 — Shared platform foundation

| Item | Problem / proposed change | Products | Dependencies | Risk / rollback | Validation | Size | Priority | Before launch |
|---|---|---|---|---|---|---|---|---|
| Canonical IDs/contracts | Define suite user, workspace, membership, entitlement, object ref, versioned event/API shapes | All | Founder packaging decisions | Add adapters; no big-bang rename | Contract fixtures consumed by all apps | L | P1 | Core only |
| One auth seam | Configure one Clerk suite application/session or federated mapping; link existing identities explicitly | All | Clerk inventory | Dual sessions and migration ledger; revert routing | Four-domain sign-in/deep-link matrix | XL | P0 | Yes |
| Product registry | Replace five URL/name registries with one consumed package | All | Package distribution | Pin old registry; easy revert | Link snapshot + domain smoke | S | P1 | Yes |
| Design tokens | Publish/consume tokens and Tailwind mapping; migrate only common shell first | All | `ds-foundation` cleanup | Scoped CSS fallback | Visual regression and contrast tests | M | P1 | Yes |
| Shared shell primitives | Consume switcher, identity entry, headers, standard error/loading/access states; retain product slots | All | Registry/tokens/auth | Per-app feature flag | Visual, keyboard, responsive tests | M | P1 | Partial |
| Telemetry package | Shared scrubber, event names, trace/workspace correlation, cron/integration metrics | All | Privacy policy | Sampling/feature flag | Synthetic failure reaches correct alert | M | P1 | Yes |

## Phase 3 — Product integration

| Item | Problem / proposed change | Products | Dependencies | Risk / rollback | Validation | Size | Priority | Before launch |
|---|---|---|---|---|---|---|---|---|
| Context resolver | Switcher loses workspace/project/object context. Add typed envelope and per-product resolution | All | Canonical IDs/object refs | Fall back to generic `/app` | Deep-link return journey tests | L | P1 | Yes |
| Notes→Tasks contract | Explicit destination, signed assertion, idempotency, source link | Notes, Tasks | Service identity | Dual endpoint version | Retry/timeout/revocation tests | M | P0 | Yes |
| Timeline projection contract | Wrap direct Tasks DB access; validate least-privilege token; define milestone ownership/read model | Tasks, Timeline | IDs/events | Shadow read comparison | Contract + stale/replay tests | M | P1 | Controlled launch |
| Signal read contract | One authorization-enforcing workspace source; remove overlapping paths | Tasks, Signal | Identity mapping | Shadow briefing comparison | Membership/alias/removal tests | L | P0 | Yes |
| Outbox | Add atomic event outbox and idempotent worker for user-visible propagation | Tasks initially | Event contract, cron/worker | Keep current reads during shadow period | Fault injection/replay/lag dashboard | L | P1 | No for private preview |
| Entitlement package | Replace copied schemas/resolvers with one versioned package and lifecycle tests | All | Shared DB migration status | Pin previous version | Golden resolver and billing lifecycle tests | M | P1 | Yes |

## Phase 4 — Performance and reliability

| Item | Problem / proposed change | Products | Dependencies | Risk / rollback | Validation | Size | Priority | Before launch |
|---|---|---|---|---|---|---|---|---|
| Query budgets | Add query count/timing; index measured slow paths; eliminate N+1 | All | Baseline | Roll back individual indexes/queries | p75/p95 budget dashboard | M | P1 | Yes |
| Cross-product resilience | Standard 2s timeout, idempotent retry, circuit/error UX | Integrated apps | Telemetry | Per-call feature flag | Fault-injection journeys | M | P1 | Yes |
| CSP enforcement | Review reports and enforce consistently | Studio, Tasks, Timeline, Signal | Browser tests | Return to report-only per app | Auth/payment/embed/browser smoke | M | P1 | Yes |
| Job reliability | Idempotency, replay, dead-man alert, run ledger for all crons/webhooks | Notes, Tasks, Signal, Studio | Telemetry | Disable scheduler, manual replay | Repeated/late/failed event tests | M | P1 | Yes |
| Bundle/fonts | Measure route JS and fonts; split only budget violators | All | Baseline | Revert per route | Build analyzer + Web Vitals | M | P2 | No |

## Phase 5 — Post-launch structural improvements

| Item | Problem / proposed change | Products | Dependencies | Risk / rollback | Validation | Size | Priority | Before launch |
|---|---|---|---|---|---|---|---|---|
| Monorepo migration | Five repos make atomic cross-suite changes costly. Move history/config mechanically without runtime changes | All | Stable CI/contracts | Keep source repos read-only until parity; reversible cutover | Same commit builds/deploys every app; history preserved | XL | P2 | No |
| Affected-app CI/cache | Avoid rebuilding unchanged apps; coordinated contract release manifest | All | Monorepo | Fall back to full suite build | Change-impact matrix tests | M | P2 | No |
| Replace harmful direct DB reads | Move only coupling hotspots to owned APIs/read models | Timeline, Signal, Studio | Telemetry/outbox | Shadow compare and fallback | Consistency/latency/error budgets | L | P2 | No |
| Shared search/notifications | Build only if product evidence justifies it | All | Event/read model | Keep product-local | User research + load/privacy tests | XL | P3 | No |
| Re-evaluate one runtime | Consider only if independent boundaries create measured harm | All | Two years of evidence | Architecture decision only | ADR with measured trigger | XL | P3 | No |

## Deliberately not changed before launch

- Do not merge databases wholesale.
- Do not replace product-specific navigation or onboarding with one template.
- Do not introduce micro-frontends, Kafka, or a general service mesh.
- Do not migrate every legacy CSS value before common tokens are consumed.
- Do not make Notes collaborative or Timeline private merely to normalize the workspace model.
- Do not move repository history until security, identity, recovery, and journey gates are closed.
