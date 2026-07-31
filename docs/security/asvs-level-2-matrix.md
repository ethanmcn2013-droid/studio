# OWASP ASVS 5.0 Level 2 gap matrix (Phase 1)

This is a gap matrix, not an assurance statement. `Partial` means local code evidence exists but suite-wide verification is incomplete. `Open` means no defensible evidence is recorded yet.

| ASVS area | Procurement-relevant requirement | Status | Evidence / next proof |
|---|---|---|---|
| V1 Architecture | Trust boundaries, tenancy and threat model are documented | Partial | `security/data-flow.md`, `security/threat-model.md`; validate against every repo and deployment |
| V2 Authentication | Strong MFA/passkeys for privileged identities | Open | Clerk production plan/config and privileged-login test required |
| V3 Session management | Secure cookies, expiry, revocation and reauthentication | Partial | Clerk middleware exists in product repos; cookie/config regression evidence required |
| V4 Access control | Deny-by-default, workspace-scoped action/resource authorization | Open | Product-local helpers and tests exist, but no shared layer or complete route ledger proven |
| V5 Validation/sanitization | Request, upload, URL and size limits | Open | Route inventory and negative tests required |
| V6 Stored cryptography | Secrets/tokens encrypted and rotated | Open | Turso/Google/provider secret storage and rotation evidence required |
| V7 Error handling/logging | No content, credentials, bodies or sensitive headers in telemetry | Partial | Sentry scrubbers exist in products; security-event stream and production redaction proof absent |
| V8 Data protection | Classification, retention, deletion and export | Partial | Account export/erasure modules exist; suite retention register and measured deletion proof absent |
| V9 Communication | TLS, origin, redirect and cache controls | Open | Enforced headers/origin/caching tests and deployment evidence required |
| V10 Malicious code | Dependency, action pinning and SBOM controls | Open | CI workflow inventory, SHA pinning, Gitleaks/OSV/ZAP/SBOM gates required |
| V11 Business logic | Billing, sharing, export/deletion abuse controls | Open | Webhook/idempotency, fresh-auth, rate-limit and mass-action tests required |
| V12 Files/resources | Uploads, exports and user URLs cannot cause file impact/SSRF | Open | Route-specific source/control/sink review required |
| V13 API/web services | Authz, CSRF/origin, request limits and webhook verification | Partial | Route families and webhook bypasses visible; complete negative test matrix absent |
| V14 Configuration | Preview cannot access production; secure defaults | Open | Vercel environment export and CI assertions required |
| V15 Dependency | Vulnerability monitoring and response | Open | OSV/GitHub Dependabot/SBOM ownership and SLA evidence required |
| V16 Authorization protocols | Clerk/org roles, provider callbacks and OAuth state | Open | Central policy and callback-specific tests required |
| V17 Business/operational | Incident, recovery, access review and restore evidence | Open | Runbooks, tabletop, measured restore and quarterly review required |

