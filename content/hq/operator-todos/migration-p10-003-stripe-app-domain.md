---
id: migration-p10-003-stripe-app-domain
title: Add app.signalstudio.ie to Stripe checkout allowed URLs
status: open
priority: P2
blocking: false
phase: Consolidation Phase 10
why: When the app domain becomes app.signalstudio.ie, Stripe Checkout success/cancel redirects to that host must be allowed. The Stripe webhook itself stays on tasks.signalstudio.ie (kept alive as a working alias), so no webhook change is needed. This is low priority and only matters once someone starts a paid checkout from the new domain — billing is not live for real users yet.
href: /hq/decisions
date: 2026-07-22
---

## Steps
1. Stripe dashboard -> Settings -> Checkout and Payment Links (and any Customer Portal redirect config) -> ensure `https://app.signalstudio.ie` is an allowed return/redirect URL (alongside the existing tasks.signalstudio.ie).
2. No webhook change needed: the Stripe webhook endpoint stays `https://tasks.signalstudio.ie/api/webhooks/stripe`, which remains served (alias). If you later want to move it, add the app.signalstudio.ie endpoint in Stripe first, then remove the old one.
