---
id: verify-clerk-prod-env
title: Confirm Clerk production keys and closed access on the unified app
status: done
cleared: "2026-08-08 - production Clerk keys exist, demo/review mode is absent, and all canonical signed-out routes redirect to /sign-in"
priority: P0
blocking: false
phase: Phase 1
why: Missing Clerk keys or a production review/demo mode can weaken access across all four canonical product routes.
href: /hq/access
date: 2026-07-26
---

## Steps

1. In the Vercel project that owns `app.signalstudio.ie` (the unified
   application, historically named Tasks), confirm
   `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` are present in
   Production. Do not copy or record their values.
2. Confirm Production has no access-opening review or demo value, including
   `SIGNAL_ACCESS_MODE=demo`, `SIGNAL_ACCESS_MODE=review`,
   `NEXT_PUBLIC_DEMO_MODE=true`, or `DEMO_MODE=true`.
3. Signed out, open `/app/notes`, `/app/tasks`, `/app/timeline`, and
   `/app/signal` on `app.signalstudio.ie`. Each must enter the production Clerk
   sign-in journey rather than render private product content.
4. Treat the former Notes, Timeline, and Signal Vercel projects as retired
   application authorities. Their old key state does not certify the unified
   app and does not need to be kept alive for this gate.
5. Record only provider names, route outcomes, and timestamps. Never record a
   secret, token, private account value, or credential screenshot.

## Separate Google account gate

This task verifies the unified Clerk environment and signed-out boundary. The
independent Google sign-up, sign-in, link, unlink, and attempted
last-method-removal matrix remains separately tracked in
`premium-auth-providers.md`.
