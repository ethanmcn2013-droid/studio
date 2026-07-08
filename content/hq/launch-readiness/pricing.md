---
id: pricing
title: Pricing readiness
score: 78
weight: 5
status: Needs attention
blockers: ["Shared entitlements layer across Tasks + Timeline not yet built — single Stripe price ID + shared Turso entitlements table needed so one umbrella checkout unlocks both apps. Until then, new Pro-tier signups effectively pause (acceptable: private preview, no live conversion to disrupt)."]
nextAction: Architect the shared entitlements layer; design grandfather migration for existing Tasks subscribers (price-lock at current rate, no forced upgrade); wire one Stripe product/price that both Tasks + Timeline entitlement gates check.
---

## Notes

Unified Signal Studio pricing shipped 2026-05-12: signalstudio.ie/pricing (Free / Pro €12mo / Event €89 one-time / Student €9.99/year). Per-product /pricing routes on Tasks + Timeline + Signal all retired and 308-redirect to umbrella; in-product Pricing links across all three repos repointed to the umbrella URL. Public Pro still maps to the internal `workspace` entitlement while the shared billing layer is in development.
