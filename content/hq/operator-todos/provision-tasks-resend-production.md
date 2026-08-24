---
id: provision-tasks-resend-production
title: Confirm the Signal Studio sender is verified in Resend
status: open
priority: P1
effort: quick
blocking: true
phase: Transactional email
why: A least-privilege production send key exists on the unified app, but its restricted scope prevents a read-only domain-status check.
href: /hq
date: 2026-08-08
---

## Founder-only check

1. Open Resend and confirm `signalstudio.ie` is **Verified**.
2. Confirm the production key may send from `Signal Studio
   <hello@signalstudio.ie>` and delete legacy analytics-era keys.
3. Do not paste the key into chat or source; the existing Vercel value is
   already present and restricted to sending.

No email was sent during the 2026-08-08 audit. A delivery test remains
deliberately excluded until Ethan asks for one.
