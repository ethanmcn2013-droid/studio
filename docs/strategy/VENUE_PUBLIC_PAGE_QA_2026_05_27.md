# Venue Public Page QA - 2026-05-27

Status: local production build passed
Owner: operator
Boundary: public route QA only. No outreach sent and no contact form submitted.

---

## Build And Route Checks

| Check | Result |
| --- | --- |
| `pnpm typecheck` | passed |
| `pnpm build` | passed |
| Local production server | started on `http://localhost:3106` |
| `/hq/venues` unauthenticated | redirects to `/hq/access?from=%2Fhq%2Fvenues` |
| `/hq/venues` authenticated | renders conversion ledger, fulfilment rehearsal, held drafts, and objections |

---

## Public Routes

| Route | HTTP | Title | Notes |
| --- | --- | --- | --- |
| `/venues` | 200 | Founding Venue Programme - Signal Studio | Contact CTA now routes through `/contact?subject=founding-venue` with tracking. |
| `/venues/demo` | 200 | Venue Edition Demo - Signal Studio | Demo seed now uses Sarah and Tom, Founding Venue Preview, and proof-pack wording. |
| `/weddings` | 200 | Wedding Planning Workspace - Signal Studio | Self-serve wedding route still separates couples/planners from venue buyer path. |
| `/pricing` | 200 | Pricing — Signal Studio | Venue section still routes buyers to Founding Venue Programme. |
| `/contact?subject=founding-venue&source=founder_email&campaign=founding_venue_2026_q2&audience=venue&artifact=contact&touch=email_1&venue=tankardstown` | 200 | Contact — Signal Studio | Visible ref and mailto body preserve full attribution. |

---

## Copy/Mechanic QA

| Surface | Pass |
| --- | --- |
| Venue page | Buyer/user split remains clear: venue pays, couple uses, team has nothing to run. |
| Demo page | The four product moments now match the creative production pack: Notes, Tasks, Roadmap, Analytics. |
| Contact page | A venue reply can be logged by source, campaign, audience, artifact, touch, and venue without adding a form. |
| HQ venues | Empty conversion ledger exists before any send, so the first real action has a place to land. |

---

## Remaining Before Outreach

| Item | Reason |
| --- | --- |
| Product capture frames | Needed for PDF and video. |
| 30 second proof video | Needed before any email draft becomes credible. |
| One-page PDF | Needed as the quiet leave-behind. |
| Official contact paths | Must be rechecked on the actual send day. |

