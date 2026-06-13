# Signal Studio · Press Kit

**Audience.** Marketing partners, 2D animators, motion-graphics designers, journalists. People who need to render the Signal Studio mark, write about the suite, or animate the wordmark without further questions.

**Authority.** When this doc and the live CSS disagree, the live CSS wins (per AGENTS.md). This is a snapshot.

For motion gestures (durations, easing, keyframes), read `animation-specs.md` in this directory. This file covers the static identity.

---

## 1 · The suite at a glance

Signal Studio is the umbrella. Four products live under it.

| Product | Position | Domain |
|---|---|---|
| Signal Tasks | Execution clarity | tasks.signalstudio.ie |
| Signal Timeline | Direction clarity | timeline.signalstudio.ie |
| Signal | Operational clarity | signal.signalstudio.ie |
| Signal Notes | Capture clarity | notes.signalstudio.ie |

Umbrella domain: signalstudio.ie. Defensive: signalhq.ie (301 redirects).

---

## 2 · Wordmark

### Asset paths

All masters live under `studio/public/brand/kit/`. Two parallel trees: `svg/` (vector masters, text outlined to paths so no font is required to render them) and `png/` (raster fallbacks for surfaces that can't take SVG).

**Umbrella wordmark.**

| Variant | File |
|---|---|
| Indigo on cream | `studio/public/brand/kit/svg/wordmark/signal-studio-indigo.svg` |
| Ink on cream (light backgrounds) | `studio/public/brand/kit/svg/wordmark/signal-studio-ink.svg` |
| Paper on dark (dark backgrounds) | `studio/public/brand/kit/svg/wordmark/signal-studio-paper.svg` |
| Mark only (the dot) | `studio/public/brand/kit/svg/mark/dot-indigo.svg` |

**Per-product wordmarks** (`tasks·`, `roadmap·`, `analytics·`, `notes·`):

- `studio/public/brand/kit/svg/product-wordmarks/tasks.svg`
- `studio/public/brand/kit/svg/product-wordmarks/roadmap.svg`
- `studio/public/brand/kit/svg/product-wordmarks/analytics.svg`
- `studio/public/brand/kit/svg/product-wordmarks/notes.svg`

**Lockups** (wordmark on background, 16:9 share-card aspect):

- `studio/public/brand/kit/svg/lockup/on-cream.svg`
- `studio/public/brand/kit/svg/lockup/on-ink.svg`
- `studio/public/brand/kit/svg/lockup/on-indigo.svg`

**App icons** (squircle tiles for launcher / favicon at large sizes):

- `studio/public/brand/kit/svg/app-icon/cream.svg`
- `studio/public/brand/kit/svg/app-icon/ink.svg`
- `studio/public/brand/kit/svg/app-icon/indigo.svg`
- `studio/public/brand/kit/svg/app-icon/paper.svg`

PNG renders sit in parallel paths under `studio/public/brand/kit/png/` at standard sizes (16 / 32 / 64 / 128 / 256 / 512 / 1024 for marks and icons; 128 / 256 / 512 height for wordmarks; 800 and 1600 wide for lockups).

A full zipped kit lives at `studio/public/brand/signal-studio-brand-kit.zip` — drop straight into Google Drive.

### Construction

- The umbrella wordmark is `signal studio.` — lowercase, one space, indigo period.
- Per-product wordmarks are `tasks·`, `roadmap·`, `analytics·`, `notes·` — lowercase, indigo middot.
- The dot is the brand. Same shape from a 16px favicon to a billboard. Differentiation across products comes from gesture (`animation-specs.md`), not colour or letterform.
- Construction is locked: dot diameter 0.16 × cap-height, 0.06em gap from the wordmark, baseline lower-right.

### Don'ts

- Never uppercase. Never italic. Never tracked-out.
- Never recolour the dot. One indigo only.
- Never add a tagline lockup inside the wordmark — taglines live in chrome, not in the mark.
- Never substitute a serif. Never substitute purple (`#7c5cff` was retired 2026-05-09).

---

## 3 · Colour

### Primary

| Token | Hex | Use |
|---|---|---|
| Brand indigo | `#4f46e5` | The single suite accent. The dot, the H1 highlight, CTAs. |
| Background warm-stone | `#fafaf7` | Page background. Never pure white. |
| Ink (body text dark) | derived `var(--ink)` | Body copy, headings on light backgrounds. |

### Status

| Token | Hex | Use |
|---|---|---|
| Shipped | `#10b981` | Items that have shipped. |
| In flight | `#f59e0b` | Items in progress. |
| Blocked | `#ef4444` | Items blocked. |
| Next / todo | `#6366f1` | Items queued. |

### Audience accents (Tasks `/for/*` landing pages only — never on the umbrella)

| Token | Hex | Audience |
|---|---|---|
| `--aud-marketing` | `#4f46e5` | Marketing-side professionals. |
| `--aud-freelance` | `#16a34a` | Freelance designers, writers, photographers. |
| `--aud-student` | `#eab308` | Students with multi-stream work. |
| `--aud-wedding` | `#be185d` | Wedding planners and venue operators. |
| `--aud-trades` | `#ea580c` | Trades operators and crews. |
| `--aud-small-business` | `#0e7490` | Restaurant, shop, clinic, studio owners. |
| `--aud-community` | `#7c3aed` | Teachers, coaches, parish coordinators, community organisers. |

Soft companions follow `color-mix(in srgb, var(--aud-[name]) 10%, transparent)`.

### Retired

- Antique gold `#c9a96a` — retired 2026-05-11.
- Tasks purple `#7c5cff` — retired 2026-05-09.

Do not reintroduce.

---

## 4 · Typography

### Families

- **Geist Sans** — all body, headings, wordmarks, navigation.
- **Geist Mono** — eyebrows, timestamps, status labels, code.

No other typefaces. Geist is loaded via `next/font/google` in every product.

### Headings (live token values)

| Class | Letter-spacing | Line-height | Weight |
|---|---|---|---|
| `.h-display` | `-0.045em` | `0.96` | 600 |
| `.h-title` | `-0.035em` | `1.04` | 600 |
| `.h-section` | `-0.03em` | `1.08` | 600 |

### Eyebrows

11px, Geist Mono, uppercase, letter-spacing `0.14em`, weight 600, colour `var(--ink-quiet)`.

### Body marketing

17px, colour `var(--ink-soft)`, line-height `1.55`.

### Wordmark — per-product letter-spacing

Two reference specs exist; the locked-spec for export is below. The live in-product CSS uses slightly different values (per `animation-specs.md`) because the dot gesture geometry differs by product.

| Wordmark | Weight | Letter-spacing | Dot |
|---|---|---|---|
| `signal studio.` | Geist Sans 600 | `-0.035em` | indigo period, 0.16 × cap-height |
| `tasks·` | Geist Sans 600 | `-0.01em` (live `.tasks-mark`) | indigo middot |
| `roadmap·` | Geist Sans 600 | `-0.025em` | indigo middot |
| `analytics·` | Geist Sans 600 | `-0.025em` | indigo middot |
| `notes·` | Geist Sans 600 | `-0.025em` | indigo middot |

For motion (the dot gesture per product), read `animation-specs.md`.

---

## 5 · Voice primer

Six rules. The full canon is BRAND.md §3.

1. **Declarative.** Periods end claims. No exclamation marks. Anywhere.
2. **Plain English at a seventh-grade reading level.** Clean, not childish. Verbs over nouns. Concrete over abstract.
3. **Universal examples.** A wedding planner, a freelance designer, a tradesperson, a student. Never "engineering teams", "developers", "stakeholders", "product managers".
4. **No AI register.** Never `AI`, `AI-powered`, `intelligent`, `smart`, `copilot`, `agent`, `autonomous`, `predicts`, `recommends`, or `automatically` when it implies decision-making.
5. **No SaaS fluff.** Never `seamless`, `world-class`, `cutting-edge`, `transform`, `revolutionize`, `unleash`, `supercharge`, `delight`, `pleasure` (as a UX qualifier), `leverage` (as a verb), or three-adjective trios in any order.
6. **No PM jargon.** Never `sprint`, `epic`, `story point`, `burndown`, `stakeholder`, `Kanban`, `Scrum`, or `Agile` (capitalised as method names).

For venue and wedding-vertical marketing copy, read `venue-copy-brief.md` in this directory — it carries the venue-specific banned-phrase list.

---

## 6 · What this isn't

Signal Studio is project management for the eighty percent not in tech. Wedding planners, freelance designers, tradespeople, students, small-business operators. Not knowledge workers. Not engineers. Not teams running stand-ups.

When writing about the suite, lead with the work the audience does, not the software category. "A briefing, not a dashboard." "Show your work, not your Jira." Those are the registers.

---

## 7 · Contact

Single canonical address: `hello@signalstudio.ie`. Not `contact@`, not `support@`, not `team@`.

For motion-graphics and animation handoff, the gesture spec lives at `animation-specs.md` in this directory. For known caveats marketing should avoid claiming, read `KNOWN_LIMITATIONS.md`. For the live pitch flow, read `DEMO_SCRIPT.md`.
