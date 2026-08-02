---
id: timeline-unfurl-card-2026-07-31
title: A shared Timeline link unfurls as a data-free card
category: Product
date: 2026-07-31
status: Active
reviewDate: 2026-08-31
relatedObjects: [Signal Timeline, Timeline shareable artifact, timeline-option-d-selected-2026-07-22, timeline-view-receipt-integrity, Collaboration Loop]
---

## Decision

A `/s/*` share link unfurls as a designed card that carries no plan data.
The 1200x630 image is the Timeline wordmark, the rail motif drawn in the
artifact's own grammar, and one solid indigo mark on paper. It contains
no couple names, no dates, no milestone titles, and no progress figure,
and it is identical for every publication. Beside it, the unfurl carries
the publication's own label and a per-kind description in viewer
vocabulary: "A shared wedding timeline.", never the storage enum used as
an adjective. Title and description are set on the Twitter tags at page
level as well as OpenGraph, so both families of consumer show the same
card.

The image must live in the page's own route segment. A card declared in a
parent segment is dropped once the page defines its own `openGraph`
object, which is how the previous state went unnoticed.

## Reason

Nothing in HQ documented unfurl behaviour, and the review found what that
gap produced. The served HTML for a demo share carried an OpenGraph
title and a description reading "A shared couple timeline.", grammar
lifted from a database column, while the Twitter tags fell through to the
layout's generic containment card and lost the timeline's name entirely.
There was no image anywhere.

The absent image was a deliberate privacy posture and it was half right.
The shared route zeroes the operating product's manifest and social card
so the app's own branding cannot leak, and the publication boundary is a
frozen allowlisted projection served noindex, no-store and no-referrer.
None of that argues for a grey text stub. What a guest actually sees
first is the preview in a chat app, and that preview is the product's own
advertisement under the loop `docs/COLLABORATION_LOOP.md` ratifies:
shareable output created, new creator discovered.

A data-free card resolves both. It puts the product's typography in front
of every guest while leaking nothing a bearer URL does not already say,
because it says nothing about the plan at all. It cannot age, cannot be
wrong, and cannot put private plan detail into a third party's unfurl
cache, which is a store nobody in this company controls or can purge.

## Alternatives considered

**A rendered card showing the real timeline.** The most attractive
option and the one that leaks. Milestone titles and dates would enter
caches at WhatsApp, Slack, X and every other consumer, outliving link
rotation and revocation, which is precisely what the publication boundary
exists to prevent.

**Keeping no image at all.** Safe and already shipped. Rejected because
the link is the artifact's first impression and it was rendering as a
grey stub of someone else's fallback copy.

**Generating the card once per publication with names only.** Rejected.
It reintroduces a per-publication cached asset with customer data in it
for a gain the wordmark already delivers.

## Risks

Metadata fetches must never count as views. Unfurl requests are excluded
from qualified views, and that exclusion is covered by the receipt work
recorded in `timeline-view-receipt-integrity`. Adding an image route to
the shared tree adds another unauthenticated fetch path on that tree, so
the same exclusion has to survive future changes there.

The page-level metadata had drifted once already because the contract
test pinned only the layout. The test now pins the page metadata, the
Twitter parity, and the card, so a future edit to the shared route cannot
quietly restore the enum grammar or drop the image.

## Notes

Shipped 2026-07-31 in Tasks dispatch T·126, from item P0-3 of the design
review at `docs/TIMELINE_DESIGN_REVIEW.md`. The card renders at
`/s/[token]/opengraph-image` with the design system values flattened to
literals, since the image renderer cannot read CSS custom properties. The
per-kind descriptions cover couple, class and project, and the default
register for an unchosen kind is "A shared project timeline.", not the
campus vocabulary it used to print.
