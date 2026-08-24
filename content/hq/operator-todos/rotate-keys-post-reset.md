---
id: rotate-keys-post-reset
title: Complete the post-reset credential rotation
status: open
priority: P0
effort: involved
blocking: false
phase: Stack reset
why: Provider credentials that predate the reset or appeared in local audit material must be revoked or rotated from their owner dashboards.
href: /hq
date: 2026-08-08
---

## Founder dashboard actions

1. Delete the retired Slack bot apps and revoke their Anthropic keys if they
   still exist.
2. Rotate the HQ password, Clerk secret and webhook signing secrets, Stripe
   secret and webhook secret, Resend key, and the Vercel token used by Actions.
3. Revoke the Turso platform tokens used for the July rename/reset and the
   specifically logged `signal-tasks` database token.
4. Delete leftover Clerk applications, provider keys, or webhooks from the
   four-app era after confirming they receive no traffic.

Do not paste credentials into Markdown, chat, screenshots, or source. With
Ethan signed into each dashboard, the agent can update Vercel/GitHub values and
verify non-email paths as each rotation completes.
