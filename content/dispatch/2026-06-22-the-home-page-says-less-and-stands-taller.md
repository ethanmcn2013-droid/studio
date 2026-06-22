## 2026-06-22 · tightens · The home page says less and stands taller

**The front door dropped two off-brand sections and brought its
wordmark up to the size every product already uses — so the umbrella
reads as the parent of the suite, not a smaller sibling. A studio
review flagged the story block and the dispatch rail as not earning
their place on the home page, the umbrella wordmark as undersized
against the product heroes, and the sign-off as the wrong city.**

The "Built for everyone else" story section and the "recent dispatch"
rail are gone from the home page — the dispatch still lives at its own
`/dispatch` route, so nothing was lost, only the brochure weight on the
front door. The loading-showcase wordmark moves from clamp(46,12.6vw,152)
to the shared product-hero scale clamp(56,12vw,168) — the exact size
notes, tasks, timeline, and signal each render their mark — and the
closing address now reads Limerick, not Dublin. Dead `.reveal-shipped`
styles and both unused components were removed with the sections.
