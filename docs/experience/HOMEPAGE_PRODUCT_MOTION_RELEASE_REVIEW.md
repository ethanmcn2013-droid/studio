# Homepage product motion release review

Date: 2026-07-29
Dispatch: S·156
Surface: `https://signalstudio.ie/`

## Release decision

Approved for production.

The suite homepage now uses the real Notes, Tasks, Timeline, and Signal product
proofs already established on their canonical marketing pages. Each starts
once in its reading zone. Notes and Signal pause their CSS choreography,
Timeline pauses its rail from the current frame, and Tasks suspends its scene
clock without offscreen polling or state advancement.

Reduced-motion visitors receive complete static evidence. The accepted
product-page heroes, Product Handoff, copy hierarchy, and route sequence remain
unchanged.

## Panel

| Lens | Score | Decision |
| --- | ---: | --- |
| Product Taste & Design Integrity | 9.2/10 | approve |
| Creative, Motion & Experience | 9.2/10 | approve |
| Product Experience & UX | 9.5/10 | approve |
| Brand, Narrative & Positioning | 9.1/10 | approve |
| Engineering, Systems & Architecture | 9.3/10 | approve |
| **Mean** | **9.3/10** | **ship** |

No advisor veto remains. The panel's original release hold — Tasks continuing
inside a long scene after leaving view — was fixed before approval. Embedded
Signal actions were also removed from the keyboard order because they are
visual proof, not live controls.

## Evidence

- Production build: pass, 45 static pages generated.
- TypeScript: pass.
- Unit and contract suite: 306/306.
- Homepage motion browser gate: 3/3.
- Existing six-page marketing browser gate: 7/7.
- Accessibility: no serious or critical violations in the homepage relay.
- Design-system enforcement: clean.
- Desktop visual pass: Notes, Tasks, Timeline, and Signal inspected at early
  and live frames.
- Mobile visual pass: all four inspected at 390 × 844 with no document
  overflow.
- Pixel evidence: every proof changes between early and live capture.
- Lighthouse desktop: 99 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 0.8 s, CLS 0.
- Lighthouse mobile: 87 performance, 100 accessibility, 100 best practices,
  100 SEO; LCP 3.5 s, CLS 0.

The Lighthouse CLI completed its reports but returned the known Windows
temporary-directory cleanup error after capture. Both JSON reports were
written and parsed successfully.

## Held follow-ups

These are not release blockers:

- The inherited Notes row reveal animates grid geometry. A future product-hero
  refinement can reserve the row and move the reveal to an inner transform.
- The Tasks view-morph crossover is briefly dense at the narrowest width.
  Its settled board remains readable and horizontally contained.
- The Signal opening intentionally begins from near-white before the briefing
  rises. The interval is brief but can be tuned in a later hero pass.
- Existing homepage copy can more precisely distinguish an approved source
  line from the task phrasing derived from it.
