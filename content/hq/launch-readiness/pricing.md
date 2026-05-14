---
id: pricing
title: Pricing readiness
score: 78
weight: 5
status: Needs attention
blockers: ["Shared entitlements layer across Tasks + Roadmap not yet built — single Stripe price ID + shared Turso entitlements table needed so one umbrella checkout unlocks both apps. Until then, new Workspace-tier signups effectively pause (acceptable: private preview, no live conversion to disrupt)."]
nextAction: Architect the shared entitlements layer; design grandfather migration for existing Tasks subscribers (price-lock at current rate, no forced upgrade); wire one Stripe product/price that both Tasks + Roadmap entitlement gates check.
---

## Notes

Unified Signal Studio pricing shipped 2026-05-12: signalstudio.ie/pricing (Free / Workspace €12mo / Event €79 one-time / Student .edu-free). Per-product /pricing routes on Tasks + Roadmap + Analytics all retired and 308-redirect to umbrella; in-product Pricing links across all three repos repointed to umbrella URL. In-app Tasks upsell renamed Team → Workspace. The umbrella is now the single canonical pricing surface in the suite.
