# Launch readiness

## Current verdict

**No-go for broad external launch.** The suite may continue controlled private preview only with known-user monitoring. Two confirmed cross-tenant integrity defects are launch blockers.

## P0 launch blockers

| Gate | Evidence / risk | Required proof |
|---|---|---|
| Fix foreign activity injection | `tasks/src/server/actions/tasks.ts:297-335` records activity after an update that may match zero rows; `tasks/src/server/db/activity.ts:23-45` resolves task globally | Regression test proves foreign task ID cannot create activity; update uses `RETURNING` or guarded ownership read |
| Fix foreign parent/subtask link | `tasks/src/server/actions/tasks.ts:342-396` accepts unverified `parentTaskId`; child reads are parent-ID based | Same-workspace parent validation, schema/trigger invariant, authorization test |
| Prove one suite identity | Shared auth seam is still owed (`docs/SUITE.md:107-108`); Signal bridges identities by email | Provider-console inventory plus production four-domain SSO/deep-link matrix; stable suite subject ID |
| Harden service identity | Notes→Tasks and Studio aggregation trust body-supplied user IDs after shared bearer checks | Audience-bound signed assertions, derived subject, replay protection, access audit |
| Canonical tenant contract | Tasks, Timeline, Notes, and Signal model workspace/user context differently | Ratified ID/membership/role contract and server-side enforcement tests |
| Public-output minimization | Tasks public loader passes full internal task objects | Dedicated allowlisted `PublicTask` DTO plus HTML/RSC disclosure snapshot test |
| Production topology and recovery | Provider-side databases, backups, tokens, alerts, and rollback are unverified | Signed inventory, restore drill, deployment rollback drill, RPO/RTO result |
| Authenticated journey suite | No single automated test proves the requested end-to-end loop | Passing journey set below in production-like preview |

## P1 production-readiness gaps

- Standard CI gates across every repo/app; no `.github/workflows` were found locally.
- Common Sentry/error, cron, and integration dashboards with alert owners.
- Durable idempotency/outbox for user-visible cross-product writes.
- Contract tests for Notes→Tasks and every Tasks DB read model.
- Suite-wide account export/deletion orchestration and retention evidence.
- CSP promotion after violation review; four live hosts were report-only on 2026-07-11.
- Eliminate `drizzle-kit push --force` from normal Tasks development and production paths.

## Security gates

- Authorization matrix for owner/member/guest/public across every server action and API.
- Production build assertion forbids demo/review mode on production domains.
- Every webhook verifies signature on raw payload and is replay/idempotency safe.
- Every cron/internal route has timing-safe authentication, narrow audience, rate limits, and audit logging.
- Turso tokens verified provider-side as least privilege; rotate shared service secrets.
- Public DTOs contain only intentional fields; uploads and redirects are allowlisted.
- Account deletion removes or legally retains data across all product stores and derived copies.

## Performance and reliability gates

Targets, not current measurements:

| Area | Gate |
|---|---|
| Web Vitals | Public p75 LCP ≤2.5s, INP ≤200ms, CLS ≤0.10 |
| Auth route | Server response p75 ≤800ms, p95 ≤1.5s |
| JavaScript | ≤170KB gzip public; ≤250KB authenticated; review any route >300KB |
| Database | ≤8 queries on normal page load; p95 individual query ≤100ms same-region |
| Cross-product call | ≤2s timeout; retries only for idempotent calls; mutation idempotency key required |
| Build | Each app p95 ≤5 min; full cached suite ≤10 min |
| Recovery | Rollback ≤10 min; initial RPO ≤24h and RTO ≤4h, proven by drill |
| Jobs | ≥99.9% success/delivery with replay; alert on repeated failure |

## Cross-product journey tests

1. Create one account, create/join one workspace, and open all entitled products without a second sign-in.
2. Explicitly promote a Note into the selected Tasks workspace; retry without duplication.
3. Mark a Task as a milestone and observe the owned Timeline projection.
4. Generate Signal from only workspaces the user may access.
5. Switch products while preserving workspace/project/return context.
6. Open a protected deep link after authentication and return to the intended object.
7. Remove membership or entitlement and prove immediate denial across products and background work.
8. Export and delete an account; reconcile every database, derived record, public output, cache, and audit retention rule.

## Go/no-go checklist

- [ ] Both Tasks tenant-integrity defects fixed and independently regression-tested.
- [ ] One Clerk/suite identity model verified in provider configuration and production-like preview.
- [ ] Canonical user/workspace/membership/role/entitlement contract ratified.
- [ ] No email-based authorization joins or body-trusted user impersonation remain.
- [ ] Public DTO disclosure tests pass.
- [ ] All eight cross-product journeys pass.
- [ ] Backups restore within RTO/RPO; rollback drill passes.
- [ ] Crons, webhooks, internal APIs, and alerts pass fault tests.
- [ ] Performance budgets measured; exceptions explicitly accepted.
- [ ] Founder decisions in `07-founder-decisions.md` are closed or have safe defaults.

Go only when every P0 item is closed with evidence. P1 items may be accepted for a narrow private launch only with an owner, monitoring, and rollback.
