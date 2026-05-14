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

Venue Editions — sponsored wedding planning workspaces, 12 months free for every couple at the venue, co-branded eyebrow-only (no venue logo). Founding venue status. Mechanic: per-couple redemption codes minted via `pnpm issue:codes <slug> <n>`, claimed at signalstudio.ie/redeem/[code], auto-drop to Free at month 12 with a day-330 prompt.

## Current blocker

Lamb's Hill: 10 pilot codes minted 2026-05-13 (LAMBSHIL-UPNA2/6UNHH/RDHBG/CXXQN/53UMW/MQWYV/B34QB/VCAXG/DFZ8G/43TY6) — dual-written to studio license_codes + tasks comp_codes. Three prior 8.2 test codes (MP93X/7U2DF/M52XX) retained as seeded-test stock. Sinéad pilot-send draft staged at signal-growth/outbound/lambs-hill-pilot-send.md. Soft launch (Cycle 8.5) gated on FOUR operator actions before the batch can go: (1) rotate CLERK_WEBHOOK_SIGNING_SECRET in Clerk dashboard + redeploy Tasks (~5 min) per docs/CYCLE_8_5_HANDOFF.md §Operator action #1; (2) walk one redemption end-to-end in incognito (~5 min) per §Operator action #2; (3) finalise DKIM generation in Google Workspace Admin Console (deliverability — pending per project_email memory); (4) test-send to operator inbox before Sinéad. Voice rewrite of the staged draft also owed (current draft sounds like agent, not Ethan). Parallel gates from 2026-05-12 still apply on the broader outreach side: 10-venue list by 2026-05-15, three conversations by 2026-06-02 — list scaffold at signal-growth/outbound/wedding-venue-list.md has zero real entries today.

## Next step

Operator: rotate Clerk webhook secret + walk one LAMBSHIL-XXXXX code end-to-end in incognito → confirm landing on /app/board?welcome=venue&v=lambs-hill with rose card + wedding template seeded. Once both pass: mint Lamb's Hill batch via `cd ~/Projects/personal/studio && pnpm issue:codes lambs-hill 10` (dual-writes studio license_codes + Tasks comp_codes, emits CSV) → send Sinéad email from docs/VENUE_EDITION_EMAIL_TEMPLATE.md + CSV attachment → 14-day soft window → day-14 retro to docs/CYCLE_8_5_LAMBS_HILL_RETRO.md. Parallel outreach: 10 named venues into signal-growth/outbound/wedding-venue-list.md by 2026-05-15; first batch sent by 2026-05-19; three venue conversations on calendar by 2026-06-02.

## Related content

Wedding Venue Outreach Kit (signal-growth/outbound/wedding-venue-outreach-kit.md); Venue Editions email template (docs/VENUE_EDITION_EMAIL_TEMPLATE.md)
