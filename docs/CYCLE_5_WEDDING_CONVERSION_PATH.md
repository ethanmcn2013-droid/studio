# Cycle 5: Wedding Conversion Path

Cycle 5 connects the weddings/events proof artefact to a segment-specific Studio page.

The conversion route is:

`/weddings`

## Purpose

Turn the shared wedding update into a viewer-to-creator path.

A venue coordinator, planner, couple, or supplier should be able to move from:

1. shared planning update
2. Signal Studio weddings page
3. pilot conversation or demo request

without landing on a generic software homepage first.

## Current Implementation

Signal Studio now has a public `/weddings` route with:

- wedge-specific positioning
- the Harbour House shared update preview
- a plain-language explanation of the four-product loop
- Founding Venue Pilot CTA

Signal Roadmap now sends `segment=weddings` shared-update CTAs to `/weddings`.

## Next Iteration

- Add the full wedding planning workspace template.
- Add a venue-specific offer page or section.
- Write the 60 second wedding demo script.
- Add view-to-creator attribution for share links.
- Add a feedback form for pilot conversations.
