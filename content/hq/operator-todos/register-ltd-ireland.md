---
id: register-ltd-ireland
title: Register the Irish Ltd — the upstream gate for Stripe, VAT/OSS, and paid launch.
status: open
priority: P0
blocking: true
phase: Phase 4
why: Until the company is a registered Irish Ltd, there is no business Stripe account, no VAT/OSS registration, and no legal way to take a paid euro.
href: /hq
date: 2026-07-09
---

## Why

The whole paid side of Signal Studio is gated on being an actual registered company, not the code. Stripe requires a registered legal entity to pay out. EU VAT/OSS registration requires a VAT-registered entity. Invoices to venues need a company on them. None of it can go live while the operator trades as an unregistered individual.

Status (2026-07-09): incorporation documents are signed and filled; submitting tomorrow. Expected ~1 to 2 weeks to become an officially registered Irish Ltd. Nothing on the paid path can complete until this lands, so it is the critical-path item for a 1 September paid launch.

The FREE side of the access system (comps, batch grants, venue codes, the HQ Access console, the entitlements plumbing) does NOT depend on this and is being built in parallel now.

## Steps

1. Submit the incorporation documents (tomorrow).
2. Receive the Certificate of Incorporation + company number from the CRO (~1-2 weeks).
3. Set up the business bank account.
4. Then, in order, unblock: `register-vat-oss-ireland` (VAT + OSS), the business `Stripe account`, and Phase 4 (Stripe webhook wiring). Each of those has its own to-do.

## Done when

The company is a registered Irish Ltd with a company number and a business bank account, so Stripe and VAT registration can begin.
