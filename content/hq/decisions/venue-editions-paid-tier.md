---
id: venue-editions-paid-tier
title: Venue Editions becomes a paid annual tier (€1.5–4k/yr) — reverses "with our compliments"
category: Pricing
date: 2026-05-16
status: Active
reviewDate: 2026-08-16
relatedObjects: [Founding Venue Programme, Venue Editions, docs/MARKETING_PLAN_6MO.md, venue-editions-mechanic, unified-pricing, Lamb's Hill]
---

## Decision

The Venue Edition is a **paid annual tier: €1,500–€4,000/year, prepaid**, tiered by venue size / multi-site, with a founding-cohort price-lock (first ~15 venues lock €1,500 for life). Workspace gains a **€120/yr annual prepay** option. Event €79 one-time is unchanged. Framed as patronage — "the venue stands behind the couple's planning" — not enterprise SaaS: no seats, no per-user, no MSA jargon, no discount banners. Ratified by the founder 2026-05-16.

This **amends, does not kill, [[venue-editions-mechanic]]**: the mechanic (per-couple redemption codes, co-branded eyebrow only, 12-month duration, auto-drop to Free at month 12, sponsor-aware welcome) stands. What changes is the money: the venue now pays Signal Studio for the sponsorship instead of receiving it "with our compliments." Lamb's Hill, already in flight as a free pilot, is honoured at the founding €1,500 lock if it converts.

## Reason

The €/$500k-in-6-months goal was pressure-tested by parallel strategy + research + pm workstreams. At €12/mo and €79 one-time, a solo zero-ad motion produces ≤€125k optimistically; the venue wedge as "with our compliments" produced €0 — distribution, not revenue. A paid venue is negative-CAC: it pays Signal Studio to seed 50–150 high-intent couples, recurring annually, and the restraint register *is* the pitch to a taste-driven venue buyer. Without this, the honest 6-month number is sub-€75k. The goal was also reframed and accepted: **€250k in 6 months, €500k by month 12, brand integrity as the gating metric** (the literal 6-month €500k would require ~120 closed contracts in 26 weeks and pressures brand-violating tactics).

## Alternatives considered

Keep free/compliments (rejected — caps 6-month revenue under €75k, no engine to €500k ever under the constraints); raise consumer SKUs / add enterprise tier (rejected — consumer base too small for any price to close the gap; enterprise jargon violates BRAND.md §3); chase literal €500k/6mo (rejected by founder — unachievable without abandoning the moat). Counting bookings instead of cash rejected as the headline metric (lets one late multi-year deal manufacture a fake number).

## Risks

Plan is ~75% one motion through one buyer type (wedding venues) with no fast fallback if venues underperform months 1–3 — the M4 construction/freelance SEO pivot is the deliberate second leg. Annual-prepay-on-signature is the assumption that makes 6-month cash work; if venues pay in arrears, cash collapses even with the same bookings. Selling B2B at this velocity pressures the founder toward urgency/discount tactics the brand forbids — "zero brand-integrity exceptions logged" is an explicit success indicator, not a soft hope.

## Notes

Full plan + math + scenarios + the AI agent-factory operating model at docs/MARKETING_PLAN_6MO.md.

**Drift cleared 2026-05-16 (same day).** The pricing/venue surfaces have been brought onto this decision: `signalstudio.ie/pricing` now carries a Venue Edition patronage section + Workspace €120/yr annual prepay; `signalstudio.ie/venues` rebuilt free→paid (every "free / with our compliments / the gift / no card" string removed); `docs/VENUE_EDITIONS_PLAN.md` carries an AMENDED-2026-05-16 banner pointing here as canonical. Architecture also shipped: the `sponsors` ledger gained paid/term/founding-lock/allotment fields (Drizzle migration `0003_venue_paid_tier`), HQ Traction now reports cash-collected from paid venue records (not couple entitlements) against the €250k goal, `scripts/mark-venue-paid.ts` is the operator path (deliberately not a self-serve checkout — a public "buy €4,000" button is the SaaS register BRAND.md §3 forbids), and `docs/shipped-state.md` (the factory's Reality-Anchor source) was written. **Owed (operator):** apply migration `0003` to prod Turso; the Workspace `?interval=annual` param needs wiring in Tasks `/api/checkout`. Success is judged on five leading indicators (≥10 paid venues by M3, ≥25% close rate, ≥1 referral inbound by M4, ≥40% sponsored-couple activation, zero brand-integrity exceptions), not a vanity €500k.
