# Wedding Loop · Attribution Reading

**Cycle 8.3** · How to read view-to-creator attribution for the wedding wedge without writing custom analytics code.

The four wedding demo URLs + the `/weddings` landing page + the outreach kit emails all carry source-tracking params in this shape:

```
?source={outbound_email|studio_weddings|roadmap_share}
&campaign=founding_venue
&segment=weddings
&role={viewer|creator}
&artefact={notes_demo|template|shared_update|analytics_demo|landing}
&touch={1|2|3}        (only on outbound emails)
```

Vercel Analytics already reads referrer + URL parameters by default — no custom code required. The full attribution path is readable from the Vercel project dashboards.

---

## Where to read each signal

| Question | Where to look | Filter |
|---|---|---|
| Who's landing on /weddings? | `studio` project · Analytics · Top Pages | Path = `/weddings` |
| Where do /weddings visitors come from? | `studio` project · Analytics · Top Sources | Filter by referrer |
| Which outbound email touch is converting? | `studio` project · Analytics · URL params | Group by `touch=1\|2\|3` |
| Are demo clicks happening? | `notes` / `tasks` / `roadmap` / `analytics` projects · Analytics · Top Pages | Path = `/wedding-planning/...` |
| Are people walking all four demos? | Cross-reference visitors across the 4 projects · same day · same IP/region | Manual sweep, weekly |
| Is the outreach kit working? | `studio` project · Top Sources filtered by `source=outbound_email` | Reply rate is the harder primary signal — track manually |

---

## What to watch in the first 30 days

After Ethan starts the 2-venues/day cadence (see `wedding-venue-outreach-kit.md`), the early signals worth watching:

- **/weddings unique visitors** — should pick up as outbound lands. Target: 30+ in the first 2 weeks.
- **Demo click-through** — at least one of the four product demos clicked per /weddings visit. If under 30%, the page needs sharper CTAs.
- **Email reply rate** — manually tracked in HQ Outbound CRM. Target: 30% of 10 venues reply within 7 days.
- **Demo walk-through** — visitors who load 3+ of the 4 demo URLs in one session. Indicates real evaluation. Manually counted from Vercel Analytics by date.

If `/weddings` is getting traffic but no demo clicks, the page CTAs are weak. If demos are getting clicks but the email reply rate is below 10%, the email copy is wrong. If everything is quiet, the targeting is wrong.

---

## What this does NOT track yet

- **Workspace creation by venue-referred couples** — would need Tasks DB to log a `source` field on workspace creation. Not built. Cycle 9 candidate if outreach generates real interest.
- **Per-email-touch open rates** — would need an email-send tool like Resend with link tracking. Manual tracking only for now.
- **Cross-product session stitching** — a visitor walking from /weddings to notes/wedding-planning to tasks/templates registers as four separate sessions in Vercel Analytics today. Acceptable for the wedge validation phase.

---

## When to upgrade attribution

After the first 10 venue conversations + 30 days of outreach data, if any of the following are true, consider building a small attribution layer:
- /weddings is getting >100 visitors/week
- More than 3 venues have entered the pilot
- The wedge is being validated by reply data

The upgrade path would be: a `/api/track` route in studio that logs URL params + session identifier to a small Turso table; a Vercel Analytics custom event triggered from a client component on `/weddings`; or a third-party tool like Plausible or PostHog. None of this is urgent before there's traffic worth attributing.

---

## How to add this signal to HQ

Open `/hq` → Metrics tab. The Vercel Analytics numbers don't sync automatically — manually enter weekly numbers in HQ for:
- `wedding_loop_unique_views` (weekly count of /weddings visits)
- `wedding_demo_clickthrough` (weekly % of /weddings visits that load 1+ demo)
- `venue_outreach_reply_rate` (% of sent emails that get any reply)
- `venue_pilots_active` (count of venues in the active pilot)

If the weekly entry feels like overhead, drop to monthly. The pattern matters more than the precision early.
