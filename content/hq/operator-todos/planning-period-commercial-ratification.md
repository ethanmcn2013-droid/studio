---
id: planning-period-commercial-ratification
title: Ratify the commercial terms before checkout or broad launch
status: open
priority: P0
blocking: true
phase: Planning Period release
why: Current code and public collateral still contain unresolved prices, entitlement limits, and launch language that must not reach a paid or broad audience.
href: /hq/access
date: 2026-07-13
---

## Context

The content-truth audit records the safe current facts and the remaining founder decisions. Engineering has deliberately left these values unresolved rather than inventing commercial policy.

## Decisions required

1. Ratify the Pro annual price (€100 or €120) and provision the matching Stripe Price. Annual checkout must fail clearly if the annual Price is absent; it must never fall through to monthly billing.
2. Choose the Student verification and payment model. The advertised €9.99/year must either be charged with a real verification path or be withdrawn from current conversion surfaces.
3. Ratify or remove Committee Workspace (€49/year), including owner, renewal, and whether members are editors or viewers.
4. Define guest semantics separately for editing members, authenticated guests, and link-only viewers. Confirm whether Event content remains readable after access expires.
5. Choose one canonical couple-access promise: calendar-month “18 months” or the current fixed 548-day operational term.
6. Define the school pricing/seat model and the meaning of any pilot allowance before making school claims.
7. Decide what 1 September 2026 means, if anything: internal readiness target, staged opening, paid checkout target, iOS target, or broad launch. The UI must remain status-controlled rather than clock-controlled.

## Done when

Each decision is recorded in a dated HQ decision, typed commercial configuration and checkout/content surfaces agree, stale claims are removed or labelled historical, and the launch review explicitly approves the resulting scope.
