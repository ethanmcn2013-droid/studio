---
id: pricing-ladder-2026-06-30
title: Lock the public pricing ladder around Pro, Student, and Event Workspace.
category: Pricing
date: 2026-06-30
status: Active
reviewDate: 2026-08-01
relatedObjects: [Signal Studio, Pricing, Entitlements, Signal Tasks, Event Workspace, Student]
---

## Decision

Signal Studio's public pricing ladder is Free Workspace (€0 forever), Student (€8.99/year with student email), Pro (€12/month or €119/year for one paid workspace), and Event Workspace (€89.99 once for 18 months). Pro is the public name for the existing internal `workspace` entitlement. Event Workspace is one workspace for one wedding, launch, move, conference, or equivalent bounded event; it is not a multi-event bundle.

## Reason

The ladder should match how people buy, not how the backend names entitlements. Free gives a real way in without pretending to be the paid product. Student is a low-friction yearly price that stays paid and therefore valued. Pro is simple ongoing workspace pricing, with annual prepay worth taking but not so cheap that monthly feels punished. Event Workspace is priced as a bounded project purchase: enough time to plan, run, and close the event without becoming a cheap substitute for Pro.

## Alternatives considered

Keep Workspace as the public plan name; rejected because Pro is clearer to buyers while `workspace` can remain an internal tier. Price Pro at €11.99/month; rejected because €12 is calmer and more legible. Price annual Pro near €100/year; rejected because it devalues the monthly plan and leaves too much money on the table. Keep Event at 12 months; rejected because many weddings and major events need planning plus aftercare across more than a year.

## Risks

Stripe production prices must be updated before the public checkout can charge the corrected ladder. Event Workspace must stay one workspace and one event or it cannibalizes Pro. Student verification must stay controlled; "student" is a price, not a free entitlement promise.

## Notes

Tasks owns Stripe checkout and must keep `tier=workspace` for Pro until the shared entitlement vocabulary is deliberately migrated. The public page can say Pro without renaming the internal entitlement.
