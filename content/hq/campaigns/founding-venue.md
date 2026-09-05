---
id: founding-venue
title: Founding Venue Programme
segment: Wedding venues / hotels
status: Queued
startDate: 2027-01-21
endDate: ""
progress: 0
relatedLandingPage: /venues
relatedMetric: Pilot participants
assetsNeeded: [60 second demo render (script locked at docs/CYCLE_8_WEDDING_DEMO_SCRIPT.md)]
---

## Current programme · 2026-09-04

First outreach and user launch target 21 January 2027 under
`january-2027-launch`. Internal testing only until then; separate manual
go/no-go decisions remain open. The six acceptance states and evidence are
indexed in `docs/execution/january-2027/PROGRAMME.md`. Progress is reset to zero
for January acceptance; the previous campaign's 80% was preparation, not
launch approval or measured commercial success.

Use the retained €1,500 standard / €1,000 Founding 25 annual prices, both
VAT-inclusive, and the contract's max(548 days, wedding + 90 days) access rule.
No legal/tax approval is claimed. Reconcile final collateral and external
readiness evidence before requesting the manual decisions.

## Historical campaign record

The sections below retain the May–August record, including the old deadlines,
€1,500-only packet instructions and then-known provider/migration state. They
are superseded operating instructions, not authority to send, migrate or
deploy now. Original dates: 2026-05-13 through 2026-06-30; status: Ready for
Ethan; progress: 80. Current external state has not been verified here.

## Goal

Recruit venues that can create planning workspaces for couples.

## Offer

Venue Editions — sponsored wedding planning workspaces, 18 months for every couple at the venue, name-only eyebrow (no venue logo). Founding venue status. Mechanic: per-couple redemption codes minted via `pnpm issue:codes <slug> <n>`, claimed at signalstudio.ie/redeem/[code], auto-drop to Free at month 18 with one quiet prompt beforehand.

## Current blocker

Live audit on 2026-07-11 found 23 existing Venue Edition codes still carrying the superseded 365-day term: 20 unredeemed and three redeemed/exhausted, with two redeemed codes reaching a board. The old Lamb's Hill send packet is blocked and must not be sent. Before any venue outreach resumes, run the guarded migration in `content/hq/operator-todos/migrate-venue-access-18-months.md` with write credentials for the shared, Studio, and Tasks databases. The migration must finish with a clean no-op rerun, then the packet must be regenerated from the current €1,500 / 18-month source material. Existing launch gates remain: rotate the Clerk webhook secret and redeploy Tasks, walk one redemption end to end in incognito, finish DKIM, and test-send to the operator inbox.

## Next step

Operator: provide all three database write credentials, run `pnpm venue:migrate-access-18mo` first, inspect the plan, then run the explicitly pinned apply command in the migration runbook. Confirm a second dry run is a no-op. Regenerate a fresh Lamb's Hill packet rather than minting a duplicate batch, then complete the webhook, redemption, DKIM, and test-send gates. Send only the regenerated €1,500 / 18-month material. Log the day-14 Review in the existing retro document if useful; do not frame the paid proof window as a free pilot.

## Related content

Wedding Venue Outreach Kit (signal-growth/outbound/wedding-venue-outreach-kit.md); Venue Editions email template (docs/VENUE_EDITION_EMAIL_TEMPLATE.md)

## Landing page

Superseded 2026-08-12. This campaign was written against /weddings, which was cut in the public estate consolidation under decision D4 and now redirects to /venues. The record of what it originally pointed at stays here; the working link is /venues. The wedding-facing replacement surface is chartered as E12.01 and does not exist yet, so any asset built from this campaign must be re-read against /venues before it is sent.
