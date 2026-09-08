# Timeline activity, closing percentage and favicon · 8 September 2026

Request: add the appeal of “37 people viewed your timeline” and who viewed
it to the landing artefact, correct the favicon, and enlarge/recolour the
closing 80%. This continues the authorized landing refinement and deployment.

Baseline: `eec24eda2a7c431f6d442c2b9d0c0dbda8df66ef`, production deployment
`dpl_9TXaSLWp75MPvmULpPshn8w6Lds9` at <https://signalstudio.ie/>.

## Changes and product truth

The existing countdown and across/down timeline choreography remain. The
last beat now turns the countdown into a large indigo 37 with “people” and
“Viewed your timeline.” An avatar group opens four example viewers in an
inline panel. “View activity” can jump to this ending. Replay resets the
panel; Escape closes it and returns focus to its toggle. Hidden content is
inert and excluded from the accessibility tree. The frame keeps its width;
grid rows animate the content height and fade, without a grey inset.

This is explicitly labelled “Activity preview” with “Example viewers” and
an illustrative-data note. Current App code records qualified viewing
sessions, not identified people: `app/src/modules/timeline/lib/qualified-view.ts`,
`viewer-count.ts`, and `server/db/timeline-schema.ts`. The named-person
interaction is a proposed experience in the landing demo, not real visitor
identification or a newly implemented App analytics capability. Its count
is fixed, with no fake live arrivals or endlessly rising metric.

The closing percentage is now a separate indigo line, responsive from
100px on mobile to 152px maximum; at 1440px it is 144px versus the original
52px headline size. The words remain “Built for the 80%.” The existing copy
contract now strips markup before checking that phrase so emphasis spans
do not invalidate it.

The favicon repair replaces the reverted triangle ICO and opaque browser
PNG with the canonical indigo dot and ring on transparency. Explicit,
versioned metadata excludes the opaque PWA image from browser candidates.
Apple and maskable install tiles retain their intended treatment. The
generator, static brand mirrors and five raster/metadata regression tests
are documented in `docs/FAVICONS.md`. App PR #173 is not included.

## Verification

All 469 tests passed, including five favicon tests. Typecheck passed. The
first test run caught the old literal-source “the 80%” assertion; the copy
is unchanged and its test now allows markup. Design-system drift check
passed. Final production build passed, including the reduced-motion fix.

Independent review caught and resolved immediate hiding during a fold
collapse, the activity button's mobile/night styling, a clipped focus-ring
risk, and an autoplay race after manual activity selection. Development
browser checks verified the open/close interaction, Escape focus return,
mobile width, transparent icon metadata and enlarged indigo percentage.

Production-build review captured 181 samples across the full 14.5-second
animation window. Every sample retains width 1392px and x 16.5px at a
1440px viewport. Height changes from approximately 900px to 1095px in the
vertical scene, then to 942px for the activity ending. Opening viewers
increases it to 1208px without changing width. At 390px the frame remains
331px with no horizontal page overflow. Desktop and mobile screenshots
show the 144px / 100px indigo closing percentage and the inline viewer list.
Escape closes the viewer panel and returns focus to its button.

Review also caught an early-return bug: the manual-activity button's
autoplay guard was initialized after the reduced-motion branch. It is now
initialized at startup for every motion preference. Final tests and build
were repeated after that source change.
The final built bundle was rechecked: reduced motion immediately resolves
to the activity ending, View activity opens without error, and the viewer
button still expands the list. A fresh browser tab completed the normal
animation and viewer interaction with zero console errors or warnings.

## Narrow static-artifact registry refresh

The favicon link changes three legacy HTML artifacts. Independent review
compared each with origin/main after removing only that link and normalizing
line endings; all three document bodies are unchanged. Their materiality
hashes were refreshed to record this reviewed metadata-only change:

| Surface suffix | Previous hash | Current hash |
| --- | --- | --- |
| brand-business-loan-pack-2026 | b47292d6bb2e8f11 | eca820148870aa43 |
| brand-loading-review-2026 | f87c4e568a220acc | b679041ad4f2a954 |
| brand-market-entry-deck-2026 | 7b08dd4cbd86a7f4 | 5f6abafb5c39ff4e |

All fixture, screenshot, accessibility and automated-test coverage values
remain `none`; this does not certify those legacy documents. The five
favicon tests cover the shared raster assets, transparency, regeneration
and all three static links. `experience:validate -- --product=studio`
passes after the three-hash-only registry update.

Before/after and live evidence use the `activity-` prefix and the directory's
existing Git LFS rules. Required CI and live-production verification remain pending.
