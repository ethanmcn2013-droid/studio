# Home page v3, One Friday · capture record

Review target: `src/app/page.tsx` (signed-out branch), `src/components/home/` (page, styles, runtime, waitlist form), `src/components/layout/site-nav.tsx` (hidden on `/`), `public/landing/` (product captures).
Decision: `content/hq/decisions/home-page-v3-2026-10-02.md`.
Source: remote-redesign, `work/2026-10-01-landing-v3-2026-10/master.html`, served at `http://localhost:4317/master.html` for the side-by-side.
Branch: `design/landing-v3` from `main` at e2b1dfa7; captures taken from the working tree that this branch's commits record.

## Preview

- Command: `pnpm build`, then `pnpm exec next start -H 127.0.0.1 -p 4391` with `NEXT_PUBLIC_SIGNAL_ACCESS_MODE=production`, from the worktree root. No database is configured locally, by design.
- URL: `http://127.0.0.1:4391/`.

## Captures (2026-10-02)

Playwright Chromium, device scale 1, en-GB. Each page was walked to the bottom so every section revealed, the whiteboard's sample people finished their script and the dot run settled, then captured as a full page from the top.

| File | Theme | Viewport |
|---|---|---|
| `home-1440-dark-viewport.png` · `home-1440-dark-full.png` | dark | 1440×900 |
| `home-1440-light-viewport.png` · `home-1440-light-full.png` | light | 1440×900 |
| `home-390-dark-viewport.png` · `home-390-dark-full.png` | dark | 390×844 |
| `home-390-light-viewport.png` · `home-390-light-full.png` | light | 390×844 |

Measured at capture, all four: horizontal overflow 0 px, no console or page errors.

## Against the source

Every element inside `main` was measured on both pages at 1440, 1024, 768, 390 and 320, dark and light, with reduced motion so both are settled. Position and size agree to within 1 px except where listed under drift. Product frames were compared pixel for pixel at 1440 (the stage, Projects, Files, Analytics, Timeline, the one-task strip) and at 390 at 3x (Projects): under 0.5% of channels differ by more than 24 of 255, which is the WebP encoding at text edges.

## Behaviour (71 scripted checks, production build)

- Hero: tick by pointer and by Space, counts 5/11/35 to 4/10/36, the toast and its Undo, Ctrl+Z, the nudge, approve a file, the reply line, the live region.
- Header: hairline on scroll, the marker under the current section, Pricing and About on wide screens.
- Tasks story: the stage holds under the header; List, Overview and Board tabs each land on their scene.
- Plates: Projects (Covers, Ledger, One project) and Analytics (Every project, Ask a question) swap view, caption and capture.
- Whiteboard: the cast plays; pointer drag moves a note by the drag; Tidy and back restores every position; Enter picks a note up, arrows move it 16 px, Escape puts it back, arrows rove between notes. On a phone: a swipe over a note scrolls the page and leaves the note alone, press and hold carries it and the page holds still, Tidy keeps every note inside the wall.
- Waitlist: every "Join the waitlist" lands on the form with the cursor in the field (not on touch); empty and malformed addresses are refused in place; the pending state shows; the server's answer is shown. Locally that answer is the calm failure, "That did not save. Try again in a moment, or write to hello@signalstudio.ie.", because there is no database, and the address stays in the field. One address was submitted, `local-check@example.invalid`. Nothing was stored. The success state was reached through the honeypot path, which answers "You are on the list." without touching any store: the form gives way to the confirmation, focus moves to it, the promise line stays and the rings refit around the words.
- Footer: the dot run plays, settles in the ring and plays again on a click; the locked footer and the company registration line are present.
- Theme: the toggle changes the page root only, the captures follow, nothing is stored. A light device opens the page light.
- Leaving for About by link and coming back: the site nav returns on About, the page restarts cleanly on return, one tick toggles once.
- Reduced motion: everything is revealed, nothing animates, the hero still works, the dot rests in the ring.
- No script: the content and every capture's `src` are in the HTML.
- `/about`, `/pricing`, `/waitlist`: site nav shown, light document, no console errors. Signed in (`x-signal-authed: 1`): the suite launcher renders, with no landing root and no site nav.

## Accessibility

axe, WCAG 2.0 A and AA and 2.1 AA, dark and light, 1440 and 390, settled and after a full walk with motion: 0 violations in all eight runs. The first pass found contrast between 4.04 and 4.48 to 1 in four places; they are fixed and listed under drift.

## Image transfer after a full scroll

| Viewport | Images | Files |
|---|---|---|
| 1440 at 1x, dark | 561 KB | 9 |
| 1440 at 2x, dark | 1,011 KB | 9 |
| 1440 at 1x, light | 586 KB | 9 |
| 390 at 3x, dark | 683 KB | 10 |
| 390 at 2x, dark | 557 KB | 10 |
| 390 at 3x, light | 745 KB | 10 |

No capture is drawn larger than its own pixels: the lowest density on screen is 1.00 image pixel per CSS pixel at 1x.

## Drift from the source

- The stamp reads "Wedding venues in private preview" and the venue card reads "In private preview with wedding venues.", the wording the site already published. The card's heading is one line shorter at 768 for it.
- The header carries Pricing and About, quietly, at 1280 and wider and in the phone menu. The source's stand-in footer links are gone; the locked site footer replaces them, with its own dot beside the dot run.
- Steps 02 and 03 of the Tasks story show new phone captures of the board and the list at 1023 and under, not crops of the desktop captures.
- Type is the site's Geist, not the lab's font file. Word widths differ by a pixel or two in the struck words, and one paragraph in Projects wraps a line shorter at 320.
- Four contrast fixes: an unselected tab in the light theme, a done note's title in both themes, "late" on a note in the dark theme, and the footer's faint ink on the light floor.
- The waitlist confirmation is the server's sentence, "You are on the list. We will write when the next access window opens."

## Follow-ups, same day (S·182)

`followup-pricing-proof-before-*.png` and `followup-pricing-proof-after-*.png`, at 390 and 1440, show the Pricing proof before and after it took the home page's sample day (Friday 25 September at The Orchard). `followup-pricing-full-*.png` are the whole Pricing page at the same widths. `followup-about-after-*.png` are About at the same widths, where only the footer line changed. `followup-home-*.png` show the home page in both themes at 390 and 1440 from the final build; the browser theme colour it sends is asserted in `tests/experience/home.spec.ts`, not visible in a capture.

## Site round 2, same day (S·183)

`round2-site-*.png` are from the site-wide fix round, taken from a production build served locally. `round2-site-share-card.png` is the link-preview card as committed. `round2-site-icons-contact-sheet.png` shows every icon at 16, 32, 48, 180 and 512 on a white and a dark tab strip. `round2-site-footer-before-*` and `round2-site-footer-after-*` show the footer on the home page and About at 1440 and 390: 742px to 372px at 1440, and 1,116px (home) and 979px (About) to 620px at 390. `round2-site-404-*`, `round2-site-skip-link-home-1440.png` and `round2-site-print-*` are the 404 page, the skip link with focus on the dark home page, and About and Pricing under print media.

## Not checked

Chromium only. No screen reader pass. No real device.

## Floating icons, 5 October (S·189)

`favicon-floating-contact-sheet.png` shows every icon the page head and the manifest name, fetched from production (before) and from this branch built and served with `next start` on `http://127.0.0.1:4397` (after), each on a white, a light grey (#f1f3f4) and a dark (#202124) tab strip at 16, 32, 48, 180, 192 and 512. Before: `/apple-icon`, `/icon1` and `/icon2` were the mark on a near-black tile, rgb(12, 12, 13); the tab icons were already clear. After: no icon has a dark pixel; `/icon1` and `/icon2` are clear, and `/apple-icon`, `/icon3` and `/icon4` are the mark on white. Made with `node scripts/brand/icon-contact-sheet.mjs <out.png> http://127.0.0.1:4397 https://signalstudio.ie`. Not checked on a real iPhone or Android home screen; the sheet draws the masks those apply.
