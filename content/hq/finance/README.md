# Finance data packs

Verified, machine-readable financial models for the 2026 business plan. Each pack is the single
source of numbers for its deck slide; slides must render these values verbatim, never recompute.

## Packs

- `cost-model-datapack-2026-07-20.json` — recurring infrastructure and engineering-tooling cost
  at six active-user milestones (0 / 100 / 1K / 10K / 100K / 1M). EUR ex VAT. Built from actual
  invoices (Anthropic, OpenAI), official vendor price lists accessed 2026-07-20, and the ECB
  reference rate 1.1435 USD/EUR (2026-07-17). Base case: launch-compliant €250/mo at 0 users;
  the deck's €500/mo baseline holds to roughly 15,000–20,000 active users.
- `revenue-model-datapack-2026-07-20.json` — gross ARR, net revenue, paying-customer mix and
  per-stream revenue at the same six milestones. Founder-approved prices only; School Edition is
  a HYPOTHESIS stream; the €27,000 / 18-venue lender floor is separate from operating ambition.
  Revenue to date is €0; every figure is a forward assumption.

## Consumers

- `public/brand/business-loan-pack-2026.html` — Appendix A5 (operating cost register) and
  Appendix A6 (revenue at scale), interactive + print-reference frames.
- Standalone review copies on the founder Desktop:
  `signal-studio-a5-operating-costs.html`, `signal-studio-revenue-slide.html`.

## Verification

All arithmetic was checked mechanically on 2026-07-20: per-milestone service/stream rows sum to
totals, fixed + variable = total, ARR ÷ 12 = MRR (half-up), annualised = 12 × monthly, and
customer splits reconcile with `commercialUnits`. Re-run the checks if a pack is edited; then
update both slide frames and the source register in Appendix A4.
