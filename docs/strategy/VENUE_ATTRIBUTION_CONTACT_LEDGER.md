# Venue Attribution And Contact Ledger

Status: implemented - 2026-05-27
Owner: operator
Boundary: route and attribution hardening only. No outreach sent, no form submitted, and no personal contact data added.

---

## What Changed

| Area | Change | Result |
| --- | --- | --- |
| Tracking helper | `src/lib/tracking.ts` now has a canonical tracking key order, normalisation, and `formatTrackingRef()`. | Every venue ref can be read in the same order: source, campaign, audience, artifact, touch, venue. |
| Venue page CTA | `/venues` now routes "Talk to us about your venue" through `/contact?subject=founding-venue` instead of a bare `mailto:`. | Venue buyer clicks preserve attribution before the email client opens. |
| Demo contact CTA | `/venues/demo` now sends contact clicks as `artifact=contact&touch=venue_demo`. | Demo-origin enquiries can be separated from general venue-page enquiries. |
| Contact page | `/contact` now preserves canonical attribution in the visible page and in the generated email body. | A reply can be logged against venue, asset, and touch without a CRM. |

---

## Current Query Contract

| Field | Required for venue motion | Example |
| --- | --- | --- |
| `source` | yes | `founder_email` or `studio_site` |
| `campaign` | yes | `founding_venue_2026_q2` |
| `audience` | yes | `venue` |
| `artifact` | yes | `venue_page`, `venue_demo`, `contact`, `video_30s`, `sales_pack` |
| `touch` | yes | `email_1`, `site`, `venue_demo` |
| `venue` | yes for outreach | `tankardstown` |

---

## Contact Ref Format

```text
Ref: source=founder_email · campaign=founding_venue_2026_q2 · audience=venue · artifact=contact · touch=email_1 · venue=tankardstown
```

This is deliberately plain. It survives mail clients, forwarding, and manual logging.

---

## No-CRM Rule

| Rule | Reason |
| --- | --- |
| Do not add a public form just to make attribution easier. | The brand promise is a real human on the other end. |
| Do not store personal contact data before verification. | Keeps the venue ledger clean and current. |
| Do not send any tracked link until assets are approved. | Tracking readiness is not send readiness. |

