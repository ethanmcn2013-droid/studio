# Signal Studio Atlas — Design Direction

_Phase 0 deliverable. Expressed entirely in the existing Signal Studio design
system — no new colors, no new type, no new motion vocabulary._

---

## 1. Feeling

Calm, premium, sparse, serious, elegant. Technical without being nerdy. Simple
without being simplistic. Impressive without being loud. **Clear before clever.**

The map should feel like a well-kept instrument panel in an Apple product, not a
consulting deck. The default state — Founder lens, nothing selected — is already
presentable to an investor.

## 2. Tokens (reuse only)

All values already exist in `src/ds/tokens.css`. The Atlas introduces **none**.

- **Accent:** `--accent` (#4f46e5 indigo) — exactly one. Used for: the active
  lens, focus rings, connection highlight, the center node's mark, key figures.
  Never two accents. Never a second hue for "AI" or "risk" decoration.
- **Ink:** `--ink` (#111) body, `--ink-soft` secondary, `--ink-quiet` faint,
  `--ink-ghost` hairline-adjacent. Off-black, never pure black.
- **Paper:** `--paper` (#fff) canvas, `--paper-soft` (#fafafa) panels,
  `--paper-deep` (#f4f4f5) recessed. HQ already tints internal surfaces soft.
- **Hairlines:** `--hairline` / `border-border-soft` do the structural work.
  Borders over shadows.
- **Elevation:** only `--shadow-float` (detail panel / search overlay). Nowhere
  else. The map is flat by intent.
- **Radii:** `--radius-md` (6px) chips/buttons, `--radius-lg` (10px) cards/panel.
- **Type:** Geist Sans for prose, Geist Mono for machine facts (ids, dates,
  scores, eyebrows). `.h-section` for the title; body at 15px; eyebrow 11px mono
  uppercase, `letter-spacing: var(--tracking-eyebrow)`, color `--ink-quiet`.
- **Motion:** `--motion-fast` (140ms) hovers, `--motion-base` (220ms) panel/lens,
  `--ease-out`. Opacity/transform only.

## 3. Status system (functional color, tightly bounded)

Four health states, each a small dot **plus a text label** (never color-only):

| State | Dot | Meaning |
|---|---|---|
| healthy | emerald `#10b981` | real, current, nothing flagged |
| attention | amber `#f59e0b` | a live risk / at-risk gate / low score |
| blocked | red `#ef4444` | a P0 blocking to-do or blocked high risk |
| unknown | `--ink-ghost` grey | no numeric signal yet (honest, not green) |

These functional colors appear **only** as small status dots and readiness bars —
never as fills, backgrounds, or decoration. The palette on the page stays
ink-on-paper with one indigo.

## 4. Layout

- **Canvas:** a center Signal Studio node; eight domain nodes in a fixed
  octagonal orbit; hairline connection lines beneath the nodes. Generous
  whitespace; the orbit breathes. Container maxes around the existing
  `--container` rhythm; the canvas sits in an aspect-ratio box that scales.
- **Node:** a compact card — type eyebrow (mono), name (`.h`-ish, 15–17px, 600),
  a health dot with label, and a hairline readiness/maturity micro-bar when a
  real number exists. Hover: hairline darkens, subtle 1px lift via transform (no
  shadow). Focus: indigo ring. Selected: indigo hairline + connected edges light.
- **Mission Control strip:** a calm row of labelled figures above the canvas in
  Founder/Investor lenses. Mono numbers, quiet labels, an "as-of" date. Reads
  like an instrument cluster, not an analytics dashboard.
- **Detail panel:** right-side drawer (`--shadow-float`, `--paper`), ~380–420px,
  hairline separators between sections, mono for facts, prose for purpose/why.
  Scrolls independently; never fully hides the map on desktop; full-width sheet
  on mobile.
- **Investor Snapshot:** a distinct, generous section below the canvas — thesis
  line, a small evidence grid, and the discipline proof. Print-friendly.
- **Search overlay:** centered, `--paper`, `--shadow-float`, hairline rows, mono
  hints — mirrors the existing HQ command palette register.

## 5. Motion choreography (understated)

- **Lens change:** emphasized nodes go to full opacity, de-emphasized to ~0.4,
  over `--motion-base`. Copy cross-fades. Layout is still.
- **Focus:** unrelated nodes dim to ~0.28; connected nodes and their edges raise
  to full; the detail panel slides/fades in over `--motion-base`.
- **Hover:** 140ms hairline + 1px transform.
- **Reduced motion:** every one of the above becomes an instant state change.
  Nothing loops. Nothing parallaxes.

## 6. Copy (BRAND voice)

Clear, calm, precise, confident, premium. Not hypey, not startup-bro. Per the
`brand-voice` skill: plain English, concrete, no em dashes, no exclamation marks,
no SaaS-fluff / PM-jargon.

- Title: **Signal Studio Atlas**
- Positioning: _"A living map of how Signal Studio thinks, builds, ships, and
  operates."_
- Thesis: _"Simple by design. Serious underneath."_
- Framing lines used sparingly: _"Every object has a purpose. Every connection
  has a reason."_

Banned here as everywhere: "AI-powered", "supercharge", "next-gen",
"game-changing", "unlock your productivity".

## 7. What this must never look like

A Miro board, a busy agency org chart, a crypto dashboard, a generic admin
template, a PowerPoint slide, a neon "AI" product. If a reviewer's first instinct
is "busy" or "generic," it has failed — iterate toward calm and specific.

## 8. The bar (checked before done)

- Would this impress an investor at a glance _and_ on inspection?
- Does it help the founder decide what to do next?
- Could a developer extend it; would a designer respect the restraint?
- Is every color justified (one indigo + four functional status dots)?
- Is every animation meaningful and reduced-motion-safe?
- Is every number real and sourced?
- Does it feel like Signal Studio — calm, clear, useful?
