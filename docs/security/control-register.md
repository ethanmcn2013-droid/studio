# Signal Studio security control register and prioritized remediation plan

**Status date:** 2026-07-16. Controls are not marked implemented until code, deployment and verification evidence are attached.

| Priority | Control / outcome | Owner | Evidence required | State |
|---|---|---|---|---|
| P0 | Inventory and isolate all production/preview environments and secrets | Operator + engineering | Vercel/GitHub/Clerk/Turso exports; CI assertion | Open |
| P0 | Shared deny-by-default authorization package | Engineering | package, route adoption ledger, review diff | In progress — owner boundary covers workspace rename/reseed/clear/seed, onboarding/segment changes and invite listing; digest jobs bind fresh user/workspace membership; full route adoption open |
| P0 | Non-null workspace keys, composite FKs and scoped query contract | Engineering | migrations, rollback, schema tests, cross-tenant negatives | Planned |
| P0 | Privileged MFA/passkeys, separate operator identities and reauth | Operator | Clerk plan/config, login test, access-review record | Open |
| P0 | Webhook signatures, timestamps, event IDs, idempotency and replay tests | Engineering | Stripe/Resend/Clerk route tests and production receipt | Planned |
| P0 | Enforced nonce CSP and security-header regression suite | Engineering | headers, browser smoke, report-only candidate comparison | Planned |
| P0 | Safe public projections and revocable hashed links; retire slug links | Engineering | migration/rollback, preview capture, token-event tests | In progress — invite and attachment responses use safe projections, calendar and raw workspace share-card routes are private/disabled; public-link migration remains open |
| P0 | Security-event stream and alerts without customer content | Engineering + operator | event schema, redaction tests, alert delivery receipt | In progress — Tasks CSP/comp telemetry is bounded and bearer-safe; structured stream and production alert delivery remain open |
| P1 | Request/upload/URL limits, CSRF/origin and edge/application rate limits | Engineering | route matrix and negative tests | In progress — production Stripe and limiter failures fail closed; AI, analytics and student issuance are bounded/rate-limited; attachment/export/CSP limits are enforced; full route and edge matrix remains open |
| P1 | CI gates: type/tests, tenant isolation, Gitleaks, OSV, ZAP, migration, headers, SBOM | Engineering | protected workflow on full SHA pins and isolated preview | Planned |
| P1 | Backups, isolated restore, measured RPO/RTO and off-provider encrypted copy | Operator + engineering | restore log, row/schema/tenancy/entitlement checks | Open |
| P1 | Incident response, security.txt, security@ mailbox and tabletop | Operator | runbook, RFC 9116 file, exercise record | Open |
| P1 | Data classification, retention, controller/processor roles, DPA and subprocessors | Operator + legal | reviewed DPA/TOMs/register | Open |
| P1 | School controls: staff-only, sharing off by default, export/delete/audit | Product + legal | product configuration and legal review | Planned |
| P2 | Authenticated multi-tenant penetration test and remediation | Independent tester | report, retest, public executive summary | Open |
| P2 | Trust centre generated only from current evidence register | Operator | evidence links, verification dates and limitations | Open |

## Exit gates

No public procurement/security claim is approved until every P0 is `implemented` with a passing verification receipt, P1 operational/legal gates are reviewed, and the independent test has no open critical/high findings.
