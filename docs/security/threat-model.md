# Signal Studio Phase 1 threat model

**Scope:** suite-level model; detailed code validation begins with the Tasks repository and is then repeated for each product repository.  
**Date:** 2026-07-16  
**Rule:** statements below are threats and required proofs, not implemented-control claims.

## Principals

1. Public visitor.
2. Authenticated customer member.
3. Workspace sponsor/owner.
4. Workspace administrator.
5. School/venue administrator.
6. Provider webhook caller.
7. Support/operator account.
8. CI/preview runtime.
9. Compromised dependency or browser extension.

## Assets and impact

Customer content, membership/role state, billing entitlements, public-link projections, OAuth refresh tokens, production database credentials, operator configuration, exports/deletions, security telemetry, and legal/privacy records. Impact includes cross-tenant disclosure or mutation, account takeover, financial loss, persistent content execution, service disruption, regulatory exposure and loss of procurement trust.

## Abuse-case register

| ID | Abuse case | Required proof / initial priority |
|---|---|---|
| TM-01 | Workspace A supplies a valid Workspace B resource id (IDOR/BOLA). | Every route/action must resolve actor + active workspace server-side and deny B; highest priority. |
| TM-02 | Stale/revoked membership continues to read or mutate content. | Membership revocation tests, cache invalidation and audit events. |
| TM-03 | Sponsor/member/admin roles are conflated. | Central action/resource matrix and negative role tests. |
| TM-04 | Public-link slug/token enumeration or Referer/log leakage exposes content. | Disable legacy slugs; hash high-entropy revocable tokens; safe projection and redaction tests. |
| TM-05 | Self-service or invite input escalates role/ownership. | Persisted-object authorization checks and immutable-field tests. |
| TM-06 | Operator account takeover reaches customer data. | Separate daily/privileged identities, phishing-resistant MFA/passkeys, reauth and access review. |
| TM-07 | Preview receives production Turso/Clerk/Stripe/Google credentials. | Provider environment matrix and automated secret/host assertions. |
| TM-08 | Forged, replayed or reordered Stripe/Resend/Clerk/Vercel webhook changes state. | Signature + timestamp + event id + idempotency and replay tests. |
| TM-09 | Mass export/deletion or account-erasure endpoint is abused. | Rate limits, fresh auth, confirmation, job audit and restore rehearsal. |
| TM-10 | Stored/reflected user content reaches HTML, Markdown, URL or DOM sink. | Context-specific escaping/sanitization and XSS regression tests. |
| TM-11 | User URL causes SSRF or cloud metadata access. | Egress allowlist, scheme/host/IP validation and network-level deny proof. |
| TM-12 | Background job processes every tenant without an explicit tenant scope. | Job principal, per-workspace query contract and cross-tenant fixtures. |
| TM-13 | Recovery email/OAuth compromise changes identity or retains tokens after deletion. | Recovery events, session revocation, token encryption and deletion proof. |
| TM-14 | Logs/Sentry/analytics capture content, request bodies, cookies or tokens. | Scrubber unit tests, redaction contract and production sample review. |
| TM-15 | Database migration breaks tenancy or cannot be rolled back. | Forward/rollback rehearsal on isolated production-equivalent data. |

## Attacker paths

- Anonymous HTTP -> public/share/webhook/status route -> object lookup or state mutation.
- Authenticated member -> browser-supplied workspace/resource identifier -> unscoped query/action.
- Compromised member -> role/invite/settings update -> sponsor/admin capability.
- Compromised operator -> Vercel/GitHub/provider console -> secret/data plane.
- Preview build -> inherited environment variable -> production database/provider.
- External provider -> forged/replayed webhook -> entitlement, email or account state.
- User content/URL -> renderer/fetcher -> XSS, SSRF or sensitive response.

## Residual uncertainty

The model cannot establish production defaults, provider plan capabilities, network egress, database backups, operator identities, or legal role allocation from this working tree. Those remain explicit gates in the control register.

