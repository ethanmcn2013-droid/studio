---
id: provision-tasks-resend-production
title: Provision production email sending for Tasks
status: open
priority: P1
blocking: true
phase: Tasks · Transactional email
why: Tasks cannot reliably deliver invitations or other transactional messages until Resend accepts the Tasks sender with a production-capable key.
href: /hq
date: 2026-07-15
action: "Verify signalstudio.ie and production sending permissions in Resend, then issue a Tasks-compatible production API key."
product: "Tasks"
recommended: "In Resend, confirm signalstudio.ie is Verified and the API key can send to non-primary recipients; create or rotate a production-capable key if needed, add it to Tasks production as RESEND_API_KEY, and complete one fixture delivery test."
alternatives: ["Create a separate Resend application/key scoped to Tasks on the verified signalstudio.ie domain", "Keep transactional email disabled and treat invite delivery as unavailable"]
default: "Tasks continues to fail closed when email delivery is unavailable; no unverified credential is copied from another product."
consequence: "Workspace invitations and other Tasks transactional messages remain degraded until a successful provider receipt and inbox delivery are verified."
trigger: "Before relying on email invitations or transactional delivery in Tasks production."
links: ["../products/tasks.md"]
---

## Founder steps

1. Sign in to Resend and open the `signalstudio.ie` domain.
2. Confirm the domain status is **Verified**. DNS already exposes Resend SPF, DKIM, and DMARC records, so resolve any remaining dashboard verification state rather than changing DNS blindly.
3. Confirm the intended API key has production permission to send from `Signal Tasks <hello@signalstudio.ie>` to recipients beyond the account's primary/test address.
4. If it does not, create or rotate a production-capable key scoped as narrowly as Resend permits.
5. Add the key to the Tasks Vercel Production environment as `RESEND_API_KEY`. Do not paste it into source control, Markdown, chat, or a screenshot.
6. Redeploy Tasks and send one test to the isolated capture fixture address. Record the Resend receipt and confirm inbox delivery before closing this task.

## Done when

Tasks production holds a least-privilege Resend key, Resend accepts the real Tasks sender to a non-primary fixture recipient, a provider receipt exists, inbox delivery is confirmed, and no credential has been committed or exposed.

## Current evidence

- A no-output transfer test used Analytics' existing Sensitive credential only in process memory.
- Resend rejected a send from `Signal Tasks <hello@signalstudio.ie>` to the isolated plus-address fixture and issued no send receipt.
- Tasks production was intentionally left unchanged; the temporary bridge was removed.
- Public DNS already contains the Resend SPF MX/TXT, DKIM TXT, and DMARC records. The remaining boundary is Resend account, domain-verification, or key permission state.
