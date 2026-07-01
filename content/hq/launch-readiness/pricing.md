---
id: pricing
title: Pricing readiness
score: 84
weight: 5
status: Needs attention
blockers: ["Stripe live prices must be provisioned for Pro annual (€119/year) and Event Workspace (€89.99 one-time) before production checkout can charge the corrected ladder."]
nextAction: Create or update the Stripe Price objects, set `STRIPE_PRICE_WORKSPACE_ANNUAL` and `STRIPE_PRICE_EVENT_ONETIME` in Tasks production, then run one test checkout for Pro annual and Event Workspace.
---

## Notes

Unified Signal Studio pricing shipped 2026-05-12 and was corrected 2026-06-30 around four public access shapes: Free Workspace (€0 forever), Student (€8.99/year with student email), Pro (€12/month or €119/year for one paid workspace, internal `workspace` entitlement), and Event Workspace (€89.99 once for 18 months, one event workspace). Per-product /pricing routes on Tasks + Timeline + Signal remain retired and 308-redirect to the umbrella. The umbrella is the single canonical pricing surface in the suite; Tasks owns checkout and Stripe webhooks.
