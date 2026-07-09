---
id: stripe-tax-eu-vat
title: Set up EU VAT collection (Stripe Tax + OSS) before checkout goes live.
status: open
priority: P0
blocking: true
phase: Phase 6
why: Selling EUR-priced access to EU consumers and venues without VAT is a legal breach at the first sale.
href: /hq
date: 2026-07-09
---

## Why

Signal Studio sells EUR 12/mo, EUR 100/yr, EUR 9.99/yr and the EUR 89 Event to consumers across the EU, plus a B2B venue prepay (EUR 1,500-4,000/yr). EU digital-service VAT (place of supply is the customer's country, VAT-inclusive display, invoice retention, OSS registration over the EUR 10k cross-border threshold) is a hard obligation at launch, not a later cleanup. Venues will expect a proper VAT invoice with their VAT number. No part of the entitlements system can substitute for this; it lives in Stripe and in registration.

## Steps

1. Confirm the live Stripe account and enable **Stripe Tax**.
2. Register for **EU OSS / VAT-MOSS** (or confirm the current registration and threshold position).
3. Decide **VAT-inclusive display** for consumer prices, and confirm the shown price is the price paid.
4. Turn on **invoices/receipts**, and **credit notes on refund**.
5. Enable **B2B VAT invoices** (reverse-charge, capture the venue VAT number) for the venue annual prepay.
6. Confirm any **data-residency** requirement that affects where billing/tax data lives.

## Done when

Stripe Tax is on, EU VAT is collected and invoiced correctly for both consumer and venue sales, and checkout can go live on 1 September without a tax gap.
