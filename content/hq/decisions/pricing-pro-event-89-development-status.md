---
id: pricing-pro-event-89-development-status
title: Public pricing uses Pro, €89 Event, and development status.
category: Pricing
date: 2026-07-08
status: Active
reviewDate: 2026-08-08
relatedObjects: [Pricing page, Pro, Event, Product status labels]
---

## Decision

The public pricing page names the paid ongoing plan Pro, prices Event at €89 one-time, and labels the four products In development until launch status is true.

## Reason

Pricing readers need the price immediately, and they need the page to match reality. "Workspace" is still an internal entitlement and the object people work inside. "Pro" is the customer-facing paid plan. "Live now" overclaims the current state.

## Risks

The Pro label can drift from the internal `workspace` checkout tier if future code treats the public name as the entitlement name. Event checkout must match the €89 public price before live conversion opens.

## Notes

Keep `tier=workspace` for checkout until the entitlement model is renamed. Use "workspace" for the object people work in; use "Pro" for the paid plan.
