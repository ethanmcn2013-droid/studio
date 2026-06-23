---
id: verify-clerk-prod-env
title: Confirm Clerk prod keys on all 4 apps; ensure no demo mode in prod
status: open
priority: P0
blocking: true
phase: Phase 1
why: Missing Clerk keys make the proxy pass through unauthenticated; SIGNAL_ACCESS_MODE=demo opens /app publicly.
href: /hq/access
date: 2026-06-23
---

## Steps

1. Vercel -> each project (notes, tasks, analytics, roadmap) -> Env Vars -> confirm `CLERK_SECRET_KEY` + `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` are present in Production.
2. Confirm there is NO `SIGNAL_ACCESS_MODE=demo` / `NEXT_PUBLIC_DEMO_MODE=true` / `DEMO_MODE=true` in any Production env.
3. Spot-check a production `/app` URL signed-out — it must redirect to `/sign-in`.
