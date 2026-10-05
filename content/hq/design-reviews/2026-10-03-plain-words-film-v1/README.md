# Plain Words · flagship prototype v1 · 3 October 2026

Task branch: `feat/hq-plain-words-film-v1`. The founder marked this cut as the
flagship prototype v1, asked for a 4K 120 fps master, and asked for it to be
merged and deployed to Signal HQ. It lives in the film room, `/hq/demo-film`,
above the hero-film scaffold.

## What it is

A 73-second brand film for the no-jargon promise. Project management was
built by tech companies, for tech companies, and everyone else had to learn
its language; Signal Studio speaks yours. Dark, Geist, one indigo moment per
scene, synthesised score in D.

| Beat | Time | What happens |
|---|---|---|
| Built for them | 0:00 | A sprint board for a wedding venue, in the tool's own words |
| A whole new language | 0:10 | Ten words and where they came from, faster and faster |
| Not here | 0:29 | Every one of them meant something ordinary once; the list is struck |
| Your words | 0:39 | Orla's Home; the same screen for a school, a student and a crew |
| The plan | 0:52 | "Software calls it a roadmap." Mara and Finn's plan draws to today; the next step lights indigo |
| 4,500 years | 0:59 | The plan becomes the present, the history of method draws in behind it, the line folds |
| Four words | 1:04 | late. waiting. today. done. The full stop of done lands in the name |

## Files

| File | What |
|---|---|
| `public/brand/films/plain-words/v1/plain-words-v1.mp4` | Full film, 1920 × 1080, 60 fps, H.264, downscaled from the 4K master |
| `public/brand/films/plain-words/v1/plain-words-v1-30s.mp4` | 30-second cut |
| `public/brand/films/plain-words/v1/plain-words-v1-15s.mp4` | 15-second cut |
| `public/brand/films/plain-words/v1/plain-words-v1.html` | The interactive player, with chapters and live sound |
| `public/brand/films/plain-words/v1/plain-words-v1-poster.jpg` | Poster frame, the plan's wide shot |

The 4K 120 fps HEVC 10-bit master (388 MB) and its 4K cuts are too large for
this repository. They were rendered in the working session and are not held
here; where they are archived is a founder decision.

Everything under `public/` is reachable by URL and this repository is public,
the same as the brand collateral beside it. The film paths send
`X-Robots-Tag: noindex, nofollow, noarchive`, and the player page carries a
`noindex` meta tag.

## How it was made

A frame-pure DOM and SVG film: every element is a function of time, so any
frame renders on demand. Headless Chromium drew 8,734 frames natively at
3840 × 2160 (the stage zoomed 2×, not upscaled) across three workers, encoded
to a near-lossless intermediate, then to HEVC 10-bit. Sound is synthesised in
the page with Web Audio and rendered offline from the same cue list as live
playback.

The audio master is a fixed gain into a peak limiter (−16.3 LUFS, −1.6 dBFS
true peak, 6.0 LU range). The earlier single-pass normaliser had been working
as an automatic gain control and flattened the range to 4.8 LU.

## Review of v1

Scores from the last critical pass: narrative 8.7, design 8.6, motion 8.7,
UX 8.4, sound 7.4. Carried into v1.1:

1. The history wide shot greys out "An app for every method": the
   tracking-shot edge fade also fires on the static frame.
2. The wordmark fades in while the four words are still on screen.
3. The plan is squeezed into about 210 px in the history shot; the indigo
   mark shrinks to a 12 px dot.
4. The folded indigo point disappears, then a second indigo dot appears two
   seconds later. One dot should carry through to the full stop of "done."
5. Seven history milestones land in 1.4 s, too fast to read.
6. The history frame leaves its lower third empty; the axis breaks are too
   faint to read as not-to-scale.
7. While the product is centred, its title and window share no left edge.
8. The stop at 0:29 is not silent in the mix.
9. BRAND.md bans glow blooms; the indigo glow under the next step and on the
   drop needs a decision.

## Gates

- The historical claims (Giza c. 2500 BC onward) need founder sign-off
  before any publication. Every name, date and number is an example.
- Publication waits for the launch programme; until then this is internal
  review material.
- A real composer and recorded foley remain the gap to a finished film.
