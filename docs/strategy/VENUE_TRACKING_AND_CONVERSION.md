# Venue Tracking And Conversion

Status: founder-review draft - 2026-05-26
Owner: founder
Boundary: tracking spec only. No outreach is live.

---

## Purpose

The venue campaign needs enough measurement to learn without turning the motion into a CRM science project.

The tracking job is simple:

1. Separate venue buyer intent from self-serve couple traffic.
2. Identify which venue/account a private outreach link belonged to.
3. Know which proof asset created the next action.
4. Keep the first sales sprint measurable against the five venue metrics.

---

## Current Tracking Shape

`src/lib/tracking.ts` already supports:

| Field | Meaning |
| --- | --- |
| source | Where the click originated. |
| campaign | Campaign or motion. |
| audience | Intended audience. |
| artifact | Asset or destination being clicked. |
| touch | Touch/channel/stage. |
| venue | Optional venue/account slug. |

Existing venue default:

```ts
{
  source: "studio_site",
  campaign: "founding_venue",
  audience: "venue",
  touch: "site",
  venue: "unknown"
}
```

Keep this. Do not introduce a second attribution model.

---

## Public Route Contract

| Route | Audience | Job | Primary success event |
| --- | --- | --- | --- |
| `/venues` | Venue buyer | Earn a venue conversation. | `venue_contact_click` |
| `/venues/demo` | Venue buyer/operator | Prove one wedding end to end. | `venue_demo_contact_click` |
| `/weddings` | Self-serve couple/planner | Route to wedding workspace/template/pricing. | `wedding_template_click` |
| `tasks.signalstudio.ie/for/weddings` | Legacy | Redirect to Studio self-serve route. | Redirect only. |
| `roadmap.signalstudio.ie/the-wedding` | Couple artifact/viewer | Show the plan. | No CTA pressure. |

---

## UTM/Query Contract

Use existing query fields, not standard-only UTM names, because `withTracking()` already serializes these fields across internal and external links.

| Field | Required | Example | Notes |
| --- | --- | --- | --- |
| source | Yes | `founder_email` | The channel. |
| campaign | Yes | `founding_venue_2026_q2` | Time-box the first sprint. |
| audience | Yes | `venue` | Do not use for couples in venue outreach. |
| artifact | Yes | `sales_pack`, `venue_demo`, `video_30s`, `contact` | The asset/destination. |
| touch | Yes | `email_1`, `followup_1`, `followup_2`, `linkedin`, `site` | The outreach touch. |
| venue | Yes for outreach | `tankardstown`, `markree`, `rathsallagh` | Slug, no spaces, no personal names. |

### Example Links

```text
https://signalstudio.ie/venues?source=founder_email&campaign=founding_venue_2026_q2&audience=venue&artifact=venue_page&touch=email_1&venue=tankardstown

https://signalstudio.ie/venues/demo?source=founder_email&campaign=founding_venue_2026_q2&audience=venue&artifact=venue_demo&touch=email_1&venue=tankardstown

https://signalstudio.ie/contact?subject=founding-venue&source=founder_email&campaign=founding_venue_2026_q2&audience=venue&artifact=contact&touch=email_1&venue=tankardstown
```

---

## Event Names

If/when client analytics are wired, use these event names. Until then, query strings plus contact source logging are enough.

| Event | Trigger | Required properties |
| --- | --- | --- |
| `venue_page_view` | `/venues` page load with venue campaign query. | source, campaign, touch, venue |
| `venue_demo_view` | `/venues/demo` page load with venue campaign query. | source, campaign, touch, venue |
| `venue_video_play` | 30s/60s/90s proof video starts. | source, campaign, touch, venue, video_length |
| `venue_video_complete` | Proof video reaches 90%. | source, campaign, touch, venue, video_length |
| `venue_sales_pack_click` | PDF clicked/opened. | source, campaign, touch, venue |
| `venue_contact_click` | Venue CTA clicked. | source, campaign, touch, venue, route |
| `venue_couple_plan_click` | Roadmap proof link clicked. | source, campaign, touch, venue |
| `venue_product_proof_click` | Notes/Tasks/Roadmap/Analytics proof link clicked from demo. | source, campaign, touch, venue, product |
| `wedding_template_click` | Self-serve `/weddings` clicks Tasks template. | source, campaign, audience, artifact |
| `venue_code_redeemed` | Sponsor code redeemed. | sponsor_slug, source_type, tier |
| `venue_workspace_reached` | Redeemed couple reaches wedding workspace. | sponsor_slug, code, workspace_id |

---

## Conversion Ledger

Keep the first sprint in a simple table before adding tooling.

| Field | Example |
| --- | --- |
| venue_slug | `tankardstown` |
| venue_name | Tankardstown House |
| wave | 1 |
| batch | A |
| contact_name | Leave blank until verified. |
| contact_role | Owner / GM / wedding director / events lead |
| email_1_sent_at | Do not fill until actually sent. |
| followup_1_sent_at | Do not fill until actually sent. |
| followup_2_sent_at | Do not fill until actually sent. |
| reply_state | none / no / warm / meeting / paid / later |
| call_date | Date if booked. |
| signer_present | yes / no / unknown |
| price_discussed | yes / no |
| next_action | One sentence. |
| notes | Plain facts only. |

---

## Five Metrics

These are the only numbers that matter for the venue motion.

| Metric | Definition | Good early signal |
| --- | --- | --- |
| Qualified reply | Right person replies with substance. | 2+ from first 20 sends. |
| Booked call | A real conversation is scheduled. | 1+ from first 20 sends. |
| Paid venue | Annual fee paid before codes issued. | 1 by first proof cycle. |
| Couples activated | Redeemed couple reaches workspace and uses it beyond day one. | 30% of issued codes redeemed; 50% of redeemed active past day one. |
| Shared artifacts | Roadmap or plan forwarded outside the workspace. | At least 1 per active workspace. |

---

## Implementation Notes

| Area | Current state | Next action |
| --- | --- | --- |
| Link query tracking | Exists through `withTracking()`. | Use it for every venue link. |
| Page view analytics | Not confirmed in this doc. | Add only when analytics destination is decided. |
| CTA click analytics | Query strings exist, but client events may not. | Implement after destination is chosen. |
| Sponsor redemption | Existing code/coupon flow and partner stats exist. | Verify dry run before outreach. |
| Contact form/source capture | `/contact?subject=founding-venue` is referenced. | Confirm contact route captures query source before sending. |

Do not block the first outreach draft on a full analytics stack. Do block actual sending on the ability to identify which venue clicked/contacted.

