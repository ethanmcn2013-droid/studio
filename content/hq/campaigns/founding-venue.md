---
id: founding-venue
title: Founding Venue Programme
segment: Wedding venues / hotels
status: Ready for Ethan
startDate: 2026-05-13
endDate: 2026-06-30
progress: 80
relatedLandingPage: /weddings
relatedMetric: Pilot participants
assetsNeeded: [60 second demo render (script locked at docs/CYCLE_8_WEDDING_DEMO_SCRIPT.md)]
---

## Goal

Recruit venues that can create planning workspaces for couples.

## Offer

Venue Editions — sponsored wedding planning workspaces, 18 months for every couple at the venue, co-branded eyebrow-only (no venue logo). Founding venue status. Mechanic: per-couple redemption codes minted via `pnpm issue:codes <slug> <n>`, claimed at signalstudio.ie/redeem/[code], auto-drop to Free at month 18 with one quiet prompt beforehand.

## Current blocker

Live audit on 2026-07-11 found 23 existing Venue Edition codes still carrying the superseded 365-day term: 20 unredeemed and three redeemed/exhausted, with two redeemed codes reaching a board. The old Lamb's Hill send packet is blocked and must not be sent. Before any venue outreach resumes, run the guarded migration in `content/hq/operator-todos/migrate-venue-access-18-months.md` with write credentials for the shared, Studio, and Tasks databases. The migration must finish with a clean no-op rerun, then the packet must be regenerated from the current €1,500 / 18-month source material. Existing launch gates remain: rotate the Clerk webhook secret and redeploy Tasks, walk one redemption end to end in incognito, finish DKIM, and test-send to the operator inbox.

## Next step

Operator: provide all three database write credentials, run `pnpm venue:migrate-access-18mo` first, inspect the plan, then run the explicitly pinned apply command in the migration runbook. Confirm a second dry run is a no-op. Regenerate a fresh Lamb's Hill packet rather than minting a duplicate batch, then complete the webhook, redemption, DKIM, and test-send gates. Send only the regenerated €1,500 / 18-month material. Log the day-14 Review in the existing retro document if useful; do not frame the paid proof window as a free pilot.

## Related content

Wedding Venue Outreach Kit (signal-growth/outbound/wedding-venue-outreach-kit.md); Venue Editions email template (docs/VENUE_EDITION_EMAIL_TEMPLATE.md)
