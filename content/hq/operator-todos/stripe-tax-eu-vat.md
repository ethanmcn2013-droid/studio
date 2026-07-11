---
id: stripe-tax-eu-vat
title: Register for EU VAT + OSS and turn on Stripe Tax (starts the moment the Ltd is registered).
status: open
priority: P0
blocking: true
phase: Phase 6
why: Selling EUR-priced access to EU consumers and venues without VAT is a legal breach at the first sale; it can only begin once the Ltd exists.
href: /hq
date: 2026-07-09
---

## Why

Signal Studio sells EUR 12/mo, EUR 100/yr, EUR 9.99/yr and the EUR 89 Event to consumers across the EU, plus a B2B venue prepay fixed at EUR 1,500 per venue/year. EU digital-service VAT (place of supply is the customer's country, VAT-inclusive display, invoice retention, OSS registration over the EUR 10k cross-border threshold) is a hard obligation at the first sale, not a later cleanup. Venues will expect a proper VAT invoice with their VAT number.

**Gated by `register-ltd-ireland`.** VAT and OSS registration require a registered VAT entity, so none of this can be filed until the Ltd is incorporated (docs submitting 2026-07-10, ~1-2 weeks out). Start the VAT/OSS registration the day the Certificate of Incorporation lands — it is the long pole to a 1 September paid launch, since Revenue sets the pace.

**Decided (no longer open):** consumer prices are **always displayed VAT-inclusive** — the shown price (EUR 12, EUR 89, etc.) is exactly what the customer pays, and VAT is remitted out of it. Confirmed by the founder 2026-07-09.

## Steps

1. **(After the Ltd is registered)** VAT-register the Ltd with Irish Revenue, then register for **EU OSS** (one quarterly return covering all EU countries).
2. Open the **business Stripe account** under the registered Ltd, and enable **Stripe Tax**.
3. Confirm **VAT-inclusive display** is wired so the shown price is the price paid (decided; verify in build).
4. Turn on **invoices/receipts** and **credit notes on refund**.
5. Enable **B2B VAT invoices** (reverse-charge, capture the venue VAT number) for the venue annual prepay.
6. Confirm any **data-residency** requirement that affects where billing/tax data lives (feeds the entitlements Turso region choice).

## Done when

The Ltd is VAT + OSS registered, the business Stripe account has Stripe Tax on, VAT is collected and invoiced correctly for both consumer and venue sales, and checkout can go live on 1 September without a tax gap.
