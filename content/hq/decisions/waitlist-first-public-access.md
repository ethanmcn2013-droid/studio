---
id: waitlist-first-public-access
title: Public access routes through the waitlist until staged access opens.
category: Access
date: 2026-07-08
status: Active
reviewDate: 2026-08-08
relatedObjects: [Waitlist page, Public CTAs, Public access, Signal HQ]
---

## Decision

Route public conversion through `/waitlist` until product access is deliberately opened. Public pages can show proof, pricing, positioning, and examples, but they should not ask a visitor to open a product or start using a product before access is ready.

## Reason

The site needs one honest access promise. Product claims can still explain what Signal Studio is building, but the action should match the operating state: staged access, not general availability.

## Scope

The rule applies to marketing pages, pricing, public product rows, comparison pages, templates, proof, press, navigation, footers, and recovery paths. Authenticated suite navigation and issued-code redemption can still point to product origins because those are already access-bearing contexts.

## Notes

Waitlist submissions write to the `waitlist_entries` ledger and are visible in Signal HQ at `/hq/waitlist`.
