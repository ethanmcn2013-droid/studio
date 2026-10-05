/**
 * Brand film, "Plain Words", the rendered flagship prototype.
 *
 * Unlike the hero-film scaffold in ./demo-film.ts, this one is cut, scored and
 * rendered. The interactive source is a frame-pure DOM and SVG film (every
 * element is a function of time), so any frame can be re-rendered; the files
 * under /brand/films/plain-words/v1/ are web encodes of the 4K 120 fps master.
 *
 * Honesty contract: every name, date and number in the film is an example, the
 * historical claims still need founder sign-off before anything is published,
 * and the open review items below are real defects, not polish notes.
 * Pure + client-safe (no server-only import).
 */

const BASE = "/brand/films/plain-words/v1";

export const BRAND_FILM = {
  title: "Plain Words",
  version: "Flagship prototype v1",
  frozenOn: "2026-10-03",
  logline:
    "Project management was built by tech companies, for tech companies, and everyone else had to learn its language. Signal Studio speaks yours.",
  why:
    "The brand film for the launch: the no-jargon promise felt rather than explained, from the jargon board through ten words and where they came from, to Orla's Home, Mara and Finn's plan, 4,500 years of method and four plain words.",
  player: {
    src: `${BASE}/plain-words-v1.mp4`,
    poster: `${BASE}/plain-words-v1-poster.jpg`,
    interactive: `${BASE}/plain-words-v1.html`,
  },
  cuts: [
    { label: "Full film", length: "1:13", src: `${BASE}/plain-words-v1.mp4` },
    { label: "30 second cut", length: "0:30", src: `${BASE}/plain-words-v1-30s.mp4` },
    { label: "15 second cut", length: "0:15", src: `${BASE}/plain-words-v1-15s.mp4` },
  ],
  spec: {
    duration: "72.8 s · 1:13",
    master: "3840 × 2160 · 120 fps · HEVC 10-bit",
    web: "1920 × 1080 · 60 fps · H.264, from the 4K master",
    sound: "Synthesised score and effects in D · −16 LUFS, linear master",
    type: "Geist + Geist Mono · dark · one indigo moment per scene",
    source: "Frame-pure DOM + SVG, rendered headless",
  },
  beats: [
    { t: "0:00", beat: "Built for them", note: "A sprint board for a wedding venue, in the tool's own words." },
    { t: "0:10", beat: "A whole new language", note: "Ten words and what they meant first, faster and faster, ending on certified practitioner." },
    { t: "0:29", beat: "Not here", note: "Every one of them meant something ordinary once; the list is struck through." },
    { t: "0:39", beat: "Your words", note: "Orla types a task the way she would say it; the same Home for a school, a student and a crew." },
    { t: "0:52", beat: "The plan", note: "Software calls it a roadmap. Mara and Finn's plan draws to today and the next step lights indigo." },
    { t: "0:59", beat: "4,500 years", note: "The plan becomes the present and the history of method draws in behind it, then folds shut." },
    { t: "1:04", beat: "Four words", note: "late. waiting. today. done. The full stop of done becomes the dot in the name." },
  ],
  // The critical review of v1 (2026-10-03). These are carried into v1.1.
  openItems: [
    "The history wide shot greys out “An app for every method”: the tracking-shot edge fade also fires on the static frame.",
    "The wordmark fades in while the four words are still on screen, a half-second double exposure.",
    "In the history shot the whole plan is squeezed into about 210 px; the indigo mark shrinks to a 12 px dot.",
    "The indigo point the line folds into disappears, then a second indigo dot appears two seconds later. One dot should carry through.",
    "Seven history milestones land in 1.4 s, too fast to read; hold longer or drop two.",
    "The history frame leaves its lower third empty, and the axis breaks are too faint to read as not-to-scale.",
    "While the product is centred, its title and window share no left edge.",
    "The stop at 0:29 is not silent in the mix; the bridge chord starts within 0.2 s.",
    "The register bans glow blooms; the indigo glow under the next step and on the drop needs a decision.",
  ],
  gates: [
    "Founder sign-off on the historical claims (Giza c. 2500 BC onward) before any publication.",
    "Publication waits for the launch programme; until then the film is internal review material.",
    "A real composer and recorded foley remain the gap between this and a finished film.",
  ],
} as const;
