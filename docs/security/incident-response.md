# Incident response runbook

## Severity

- **SEV-0:** active cross-tenant exposure, credential compromise, destructive production action or material regulated-data breach.
- **SEV-1:** confirmed high-impact vulnerability or provider compromise with plausible customer impact.
- **SEV-2:** contained security defect, repeated denied abuse or failed control with no evidence of exposure.
- **SEV-3:** policy/documentation gap or low-impact anomaly.

## First hour

1. Create an incident record and preserve timestamps, request IDs, provider event IDs and affected workspace IDs; never copy customer content or secrets into the record.
2. Declare severity and incident lead. Stop unsafe jobs/sharing/webhooks only when the containment action is reversible and logged.
3. Revoke/rotate affected credentials, sessions, webhook secrets and OAuth tokens. Preserve evidence before deletion.
4. Identify affected tenants and time window from security events, provider logs and database audit data.
5. Notify the operator and legal lead for any personal-data, school or regulated impact.

## Recovery and communications

Restore from a verified isolated backup, validate tenancy and entitlements, then reopen traffic gradually. Customer/regulator notification timing is a legal decision; do not promise a timeline until legal review. Close with root cause, control change, retest, lessons and evidence links.

**Required setup:** `security@signalstudio.ie`, RFC 9116 `/.well-known/security.txt`, contact escalation tree, credential-rotation checklist and tabletop record.

