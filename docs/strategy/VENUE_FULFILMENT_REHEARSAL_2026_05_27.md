# Venue Fulfilment Rehearsal - 2026-05-27

Status: rehearsed as a no-mutation operating path
Owner: operator
Boundary: no sponsor was created, no venue was marked paid, and no live codes were issued. This rehearsal validates sequence, commands, ownership, and stop conditions.

---

## Rehearsal Result

| Area | Result |
| --- | --- |
| Sponsor setup path | Script exists: `pnpm create:sponsor <slug> <name> <contact-email> [brand-meta-json]`. |
| Paid venue ledger path | Script exists: `pnpm venue:paid <sponsor-slug> founding 1500 --founding`. |
| Code issue path | Script exists: `pnpm issue:codes <sponsor-slug> <count> venue_edition wedding 365`. |
| Partner digest path | Script exists: `pnpm partner:digest <sponsor-slug>`. |
| Local digest smoke test | `pnpm partner:digest lambs-hill` ran without mutation. Studio audit returned 23 issued codes; local Tasks roll-up was unavailable because `PARTNER_STATS_SECRET` is not set locally. |
| Stop condition | Do not issue live codes before payment. |
| Outreach boundary | No outbound email or contact form submission happened. |

---

## Operating Sequence

| Step | Owner | Command or action | Pass condition |
| --- | --- | --- | --- |
| 1 | Founder | Confirm signer, annual price, start date, and venue display name. | Ledger has signer path, price, and venue eyebrow. |
| 2 | Founder | Invoice and wait for annual prepay. | Cash lands before any paid state is recorded. |
| 3 | Operator | `pnpm create:sponsor <slug> <name> <contact-email> [brand-meta-json]` | Sponsor exists with stable slug. |
| 4 | Operator | `pnpm venue:paid <sponsor-slug> founding 1500 --founding` | Sponsor ledger records paid state, annual amount, founding lock, and term. |
| 5 | Operator | `pnpm issue:codes <sponsor-slug> <count> venue_edition wedding 365` | Studio audit and Tasks runtime codes are both populated. |
| 6 | Operator | Redeem one internal code in incognito. | `/redeem/[CODE]` reaches wedding workspace with venue eyebrow and no self-serve price. |
| 7 | Operator | `pnpm partner:digest <sponsor-slug>` | Digest reflects issued/redeemed/reached-board state. |
| 8 | Founder | Send venue the plain-text couple handoff template and code list. | Venue, not Signal, owns the first couple touch. |
| 9 | Founder | Run one retro after the first redemption window. | Questions, activation, and repeated-admin signal are logged. |

---

## Kill Switches

| Stop if | Why |
| --- | --- |
| Payment has not landed. | A paid venue edition cannot become a free trial by accident. |
| The venue wants Signal to email couples first. | The trust belongs to the venue. |
| The venue asks for private workspace visibility by default. | Couple privacy is part of the product promise. |
| Redemption fails in incognito. | Do not give codes to a real venue before the path works. |
