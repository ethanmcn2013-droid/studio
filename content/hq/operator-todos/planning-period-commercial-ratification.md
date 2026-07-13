---
id: planning-period-commercial-ratification
title: Ratify the commercial terms before checkout or broad launch
status: open
priority: P0
blocking: true
phase: Planning Period release
why: Planning Period implementation is complete, but several commercial policies still require founder approval before checkout or broad launch.
href: /hq/access
date: 2026-07-13
---

## Context

The content-truth audit and current shipped state are the evidence baseline. Pro annual pricing is already ratified at EUR 120/year and public copy is aligned. Engineering has deliberately left the remaining policies unresolved rather than inventing commercial rules.

Already evidenced: Event Workspace EUR 89 once for 12 months, Student EUR 9.99/year as an advertised offer, Venue Edition EUR 1,500/year for the founding 15, and Pro EUR 120/year. These are not approval gaps except where a decision below calls for payment, verification, or checkout evidence.

## Decisions required

1. Provision and verify the EUR 120/year Pro Stripe Price. Annual checkout must fail clearly if the annual Price is absent; it must never fall through to monthly billing.
2. Choose the Student verification and payment model. The advertised EUR 9.99/year must either be charged with a real verification path or be withdrawn from current conversion surfaces.
3. Ratify or remove Committee Workspace (€49/year), including owner, renewal, and whether members are editors or viewers.
4. Define guest semantics separately for editing members, authenticated guests, and link-only viewers. Confirm whether Event content remains readable after access expires.
5. Choose one canonical couple-access promise: calendar-month “18 months” or the current fixed 548-day operational term.
6. Define the school pricing/seat model and the meaning of any pilot allowance before making school claims.
7. Decide what 1 September 2026 means, if anything: internal readiness target, staged opening, paid checkout target, iOS target, or broad launch. The UI must remain status-controlled rather than clock-controlled.

## Done when

The Pro Price is provisioned and tested; each remaining policy is recorded in a dated HQ decision; typed commercial configuration and checkout/content surfaces agree; stale claims are removed or labelled historical; and the launch review explicitly approves the resulting scope.
