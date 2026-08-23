# About page redesign · verdict gate record

Review target: `src/app/about/` (page.tsx · about.module.css · translation.tsx · opengraph-image.tsx).
Bar: 9.5/10 per seat, unanimous to pass, five fresh blind seats per verdict round (Engineering Elevation ritual).
Build gate: `tsc --noEmit` + `next build` green at every round close.

## Round history

| Round | UX & info | Visual & type | Copy & voice | Interaction | Measured | Outcome |
|---|---|---|---|---|---|---|
| 4 (verdict) | 9.3 | 9.3 | 9.2 | 8.6 | 9.6 | FAIL — remediated |
| 5 (verdict) | 9.0 | 9.0 | 9.2 | 9.3 | 9.5 | FAIL — remediated |
| 6 (verdict) | 9.4 | 9.4 | 9.6 | 9.2 | 9.7 | FAIL — remediated |
| 7 | 9.4 | 9.5 | 9.6 | n/a¹ | 9.2¹ | voided — provider outage + post-seat fixes |
| 8 | 9.4 | 9.5 | n/a¹ | n/a¹ | n/a¹ | voided — provider outage + post-seat fixes |

¹ seat lost to provider `network_error`, not a scored verdict.

## Remediations applied across rounds

- R4→R5: OG image route added (house card, static); Founded year unlinked; Products fact split into three per-product links; credential line cut; dead `.tTable[data-lang="english"]` selector removed; eyebrow ring realigned; signoff band tightened; `.tEnglish` added to reduced-motion `animation: none`; touch-target padding on factLink/signoffLink/tBtn + `:active` states; `role="status"` added to translation toggle.
- R5→R6: hover rules gated in `@media (hover: hover)`; `.canvasLight button:focus-visible` added; `.sysRow:active` press cue; status region gated on first interaction (no load announcement); caption + refusal-why rewritten; `RECORD PUBLIC` chip → `SHIPPED 3 PRODUCTS`; "Read the dispatch" → "Read the record"; OG alt aligned to image.
- R6→R7: split `.tEnglish` blocks merged; pullquote given its own 54px rung; endlink hit-area padded; ≤359px toggle padding; auto-translate announces via status region.
- R7→R8: `.tIndustry`/`.tEnglish` continuation blocks commented; toggle labels made parallel.
- R8→R9: toggle labels shortened to `Industry` / `Plain English` (kills 1440 thumb-collision risk); hero GPS chip → `LIMERICK IRELAND`; caption → "Real phrases from real tools. Toggle between the two."; `focusin` fallback translates on keyboard/anchor jumps past the observer window.

## Round 9 (final verdict round — waves of two, provider-outage protocol)

Build under review: typecheck + `next build` green, captured to `%TEMP%\opencode\about-r4-shots\` (full 390/768/1024/1440 + six section shots) and `%TEMP%\opencode\about-r4-vp\` (true-viewport evidence).

- Seat 1 · UX and information design — **9.6 PASS**. Its one substantive finding (toggle second label "Your version" ambiguous) was its own prescribed fix, applied immediately after the verdict: the pair is now "Industry" / "Plain English". Label-only change; rebuild green; captures refreshed before the remaining four seats convened.
- Seat 2 · Visual composition and typography — **9.6 PASS, no findings** (final build). Interim verdicts en route: 9.2 (unequal toggle thumb — fixed with the 1fr/1fr grid), 9.4 (pullquote rung collapse + undocumented ladder — fixed: 35px floor, ladder and text rungs declared), 9.3 (endlink off-rung + under-declared scale — fixed: 15.5px, full scale declared).
- Seat 3 · Copy and voice — **9.5 PASS**. Advisory dust recorded, not gate-blocking: translation-column tense mix (rows 2–4), "Five more run the whole suite." antecedent.
- Seat 4 · Interaction and states — **9.6 PASS** (final build). Interim verdicts en route: 9.0 (pressed-toggle hover repaint — fixed `:not([aria-pressed="true"])`), 9.4 ×2 (sysExit reduce leak + noscript scaleX restores; sysRow focus-within twins, heroDot reduce halo, tBtn:active pressed repaint — all fixed), plus its passing round's prescribed one-liner (sysExit nudge degrades to colour under reduce — applied).
- Seat 5 · Measured evidence — **9.5 PASS, no findings** (final build). Interim 9.25 flagged the undeclared 25px mobile step-down for `.sysName` — declared in the stylesheet header.

## Final verdict — Round 9

| Seat | Score | Verdict |
|---|---|---|
| UX and information design | 9.6 | PASS |
| Visual composition and typography | 9.6 | PASS |
| Copy and voice | 9.5 | PASS |
| Interaction and states | 9.6 | PASS |
| Measured evidence | 9.5 | PASS |

**Unanimous at or above the 9.5 bar on the final build. Gate closed 2026-08-23.**
Build evidence at close: `tsc --noEmit` clean; `next build` green (`/about` ƒ, `/about/opengraph-image` ○); captures in `%TEMP%\opencode\about-r4-shots\` (full 390/768/1024/1440 + m1/m2/m4/m5/m6/m7) and `%TEMP%\opencode\about-r4-vp\` (true-viewport). Dispatched as S·165.

## Follow-ups

- BRAND.md §1 still carries the stale four-product table (trails the 2026-08-04 Signal → Home consolidation); every live surface says three products + Home. Correct the handbook separately.
- Copy seat's advisory dust, held deliberately: translation-column rows mix progressive and simple present; "Five more run the whole suite." asks the reader to supply the noun.
- The hero H1 keeps its passive construction ("were built for the people who build them") as a deliberate register exception — operator-blessed territory.
- `/about` server-renders on demand (site-wide edge-runtime config disables static generation); making it statically eligible is a site-level follow-up, not an about-page defect.
