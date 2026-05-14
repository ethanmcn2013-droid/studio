# Signal Studio · DESIGN.md

**Agent-readable design system for the Signal Studio suite.**

This file is the consumable subset of [`BRAND.md`](./BRAND.md) for AI agents (Claude Code, Codex, Stitch, any DESIGN.md-aware tool). It contains tokens, primitives, and refusals — *not* positioning or voice strategy. For the strategic register, read BRAND.md first. When the two conflict, BRAND.md wins; fix this file to match.

Same family across all five repos: Studio (umbrella), Tasks, Roadmap, Analytics, Notes. Differentiation comes from one per-product gesture, not from colour or typography variation.

---

## 1 · Identity

- **Name:** Signal Studio. The wordmark is `signal studio.` (lowercase, with period). In running body copy use `Signal Studio` (title case). Never `Signal` alone — collides with Signal Messenger.
- **Headline (umbrella):** `Cut through the noise.`
- **Operating principle:** `Everything important. Nothing distracting.`
- **Suite tagline (locked):** `Clarity, not configuration.`
- **Reference register:** Apple, Linear, Arc, Notion Calendar, Raycast.
- **Anti-reference:** Jira, Monday, Tableau, PowerBI, Salesforce.

---

## 2 · Colour

One indigo. The same hex from a 16-pixel favicon to a billboard. Differentiation between products is *gesture*, not colour.

### Brand
| Token | Hex | Notes |
|---|---|---|
| `--accent` / `--brand` / `--indigo` | `#4f46e5` | indigo-600. The single suite accent. |
| `--accent-deep` | `#4338ca` | indigo-700. Hover / pressed. |
| `--accent-soft` | `#eef2ff` | indigo-50. Tints, selection backgrounds. |
| `--accent-glow` | `rgba(79, 70, 229, 0.32)` | Soft shadow / aura on key surfaces. |
| `--indigo-soft` | `rgba(79, 70, 229, 0.12)` | Inline emphasis tints. |

### Ink (neutrals)
Off-black, never pure black. Body text is `#111111`.

| Token | Hex |
|---|---|
| `--ink` | `#111111` |
| `--ink-soft` | `#3f3f46` |
| `--ink-faint` / `--ink-quiet` | `#71717a` |
| `--ink-ghost` | `#d4d4d8` |

Full ramp: `--ink-50` → `--ink-950` matches Zinc. Use the semantic alias (`--ink`, `--ink-soft`, etc.) in product code; only reach for the numeric ramp for charts and decoration.

### Paper (surfaces)
Paper is white as of the 2026-05-13 design-system v1 lock. The warm-cream era ended; hairlines do the work shadows would in a louder system.

| Token | Hex |
|---|---|
| `--paper` / `--bg` | `#ffffff` |
| `--paper-elev` | `#ffffff` |
| `--paper-soft` | `#fafafa` |
| `--paper-deep` | `#f4f4f5` |

### Hairlines
Stronger than the cream era because pure white needs definition.

| Token | Value |
|---|---|
| `--hairline` | `rgba(17, 17, 17, 0.10)` |
| `--hairline-2` | `rgba(17, 17, 17, 0.06)` |

### Status palette
Used only in functional UI (kanban lanes, status pills, roadmap states). Never in marketing surfaces.

| State | Hex |
|---|---|
| Shipped | `#10b981` |
| In progress / In flight | `#f59e0b` |
| Blocked | `#ef4444` |
| Next / Todo | `#6366f1` |

### Retired
- **Antique gold `#c9a96a`** — retired 2026-05-11. Do not reintroduce for new work; the wordmark period detail is the only remaining gold use.
- **Purple `#7c5cff` and `rgba(124, 92, 255, ...)`** — legacy Tasks accent, purged. Do not reintroduce.

---

## 3 · Typography

Geist Sans for everything except mono. Geist Mono for eyebrows, timestamps, status labels, version stamps, code.

```css
--font-sans-stack: var(--font-geist-sans), 'Geist', -apple-system, system-ui, sans-serif;
--font-mono-stack: var(--font-geist-mono), 'Geist Mono', ui-monospace, 'SF Mono', monospace;
```

### Scale (fluid clamp)
| Class | Size | Line-height | Letter-spacing | Weight |
|---|---|---|---|---|
| `.h-display` | `clamp(2.75rem, 1.8rem + 4.2vw, 5.5rem)` | `0.96` | `-0.045em` | 600 |
| `.h-title` | `clamp(1.875rem, 1.4rem + 2.2vw, 3.25rem)` | `1.04` | `-0.035em` | 600 |
| `.h-section` | `clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem)` | `1.08` | `-0.03em` | 600 |
| Body marketing | `17px` | `1.55` | — | 400, `var(--ink-soft)` |
| Body app | `15px` | `1.5` | — | 400, `var(--ink)` |
| Eyebrow | `11px` mono uppercase | — | `0.14em` | 600, `var(--ink-quiet)` |
| Mono label | `11px` tabular | — | `0.02em` | 400, `var(--ink-quiet)` |

### Feature settings
`font-feature-settings: "ss01", "cv11";` on body. Display class adds `"ss02"`.

### Banned font choices
Inter (alone), Roboto, Arial, default system-ui as the *display* face, Space Grotesk for new surfaces.

---

## 4 · Spacing & layout

8-pt base. Use Tailwind's default spacing scale (`gap-2`, `p-4`, etc.) — no custom spacing tokens. The discipline is in *restraint*, not invention.

### Container widths
| Use | Max width |
|---|---|
| Marketing hero | `72rem` |
| Marketing body | `64rem` |
| App content | `80rem` |
| Reading column (prose) | `42rem` |

### Section rhythm
Marketing sections separated by `py-24` to `py-32` desktop, `py-16` to `py-20` mobile. Adjacent sections with the same background colour separate via hairline, not whitespace.

### Radii
| Token | Use |
|---|---|
| `--r-1` `4px` | Hairline inputs |
| `--r-2` `6px` | Pills, chips, small buttons |
| `--r-3` `10px` | Cards (when used) |
| `--r-4` `14px` | Larger panels |
| `--r-5` `20px` | Hero panels, modal sheets |
| `--r-pill` `999px` | Status pills, CTA buttons |

### Shadows
Shadows are minimal. Hairlines do most of the elevation work.

```css
--shadow-1: 0 1px 2px rgba(24, 24, 27, .04), 0 1px 1px rgba(24, 24, 27, .03);
--shadow-2: 0 4px 12px rgba(24, 24, 27, .06), 0 1px 3px rgba(24, 24, 27, .04);
--shadow-3: 0 24px 60px -20px rgba(24, 24, 27, .18), 0 8px 24px -8px rgba(24, 24, 27, .08);
--shadow-accent: 0 12px 32px -12px rgba(79, 70, 229, .38);
```

---

## 5 · Motion

Sparingly.

- **Rise stagger** on hero entries: `0.6s`, 60ms stagger.
- **Subtle fade** between sections.
- **Springs:**
  - `--spring-snap: cubic-bezier(.2, .9, .2, 1.2)` — confirmations, taps
  - `--spring-soft: cubic-bezier(.32, .72, 0, 1)` — page transitions
  - `--spring-glide: cubic-bezier(.16, 1, .3, 1)` — sheet / drawer
  - `--ease-out: cubic-bezier(.22, .61, .36, 1)` — generic
- **Tasks's cinematic demo on its homepage is the brand-feature.** Everything else is restrained.
- `prefers-reduced-motion` is respected everywhere via `useReducedMotion()`. No exceptions.

### Per-product gestures (the differentiator)
| Product | Gesture | What it is |
|---|---|---|
| Studio | broadcast | Wordmark period sends concentric rings outward, once |
| Tasks | tick | Underline writes itself left-to-right on hover |
| Roadmap | advance | Indigo dot slides one column right on milestone change |
| Analytics | heartbeat | Single pulse on the briefing badge when new |
| Notes | settle | Capture animation collapses three lines into one |

These are the *only* product-level animations. Don't invent new gestures.

---

## 6 · Components

### Buttons

**Primary** — solid indigo, white text, pill radius:
```tsx
<button className="bg-indigo text-white px-5 py-2.5 rounded-pill text-sm font-medium hover:bg-accent-deep transition">
  Open the workspace
</button>
```

**Secondary** — hairline outline, ink text, pill radius. No `bg-`.

**CTA verbs (locked):** `Open the [product]`. Tasks: *Open the workspace*. Roadmap: *Open the roadmap*. Analytics: *Open the briefing*. Notes: *Open the notebook*. Never "Get started", "Try it", "Sign up free".

### Hero pattern (every product homepage)
```
EYEBROW (mono, uppercase, tracked): Signal [Product] · [Position] clarity
H1 (display): [product-specific punchline]
SUB (body marketing, 2 lines max): [product-specific value statement]
CTA primary: Open the [product]
CTA secondary: [product-specific deeper link]
```

### Cards
Use sparingly. Default to hairline-separated rows over card grids. When using a card: `bg-paper` (white), `border border-hairline`, `rounded-3` (10px), `p-6`. No drop-shadow by default.

### Footer (locked 2026-05-12)
Four-column desktop footer on product surfaces. Bottom strip with `© YYYY Signal [Product]. A Signal Studio product.` left-justified and `Clarity, not configuration.` right-justified. Umbrella footer (signalstudio.ie) is 2-column, no strip.

Required content in every product footer:
- Suite column lists **all four** Signal products
- Brand column includes `A Signal Studio product.`
- Contact link to `mailto:hello@signalstudio.ie`
- Dispatch link to `https://signalstudio.ie/dispatch`

### Selection
```css
::selection { background: var(--accent-soft); color: var(--ink-900); }
```

### Marker (inline emphasis)
A 78%-height indigo highlight at 82% baseline offset. Use for one or two words per page, never multiple times in the same paragraph.

```css
.marker {
  background: linear-gradient(120deg,
    transparent 0 6%,
    color-mix(in srgb, var(--accent) 28%, transparent) 6% 94%,
    transparent 94%);
  background-size: 100% 0.78em;
  background-position: 0 82%;
  background-repeat: no-repeat;
}
```

---

## 7 · Iconography

- **Library:** Lucide React. Never mix icon libraries on one surface.
- **Stroke width:** `1.5` for marketing, `1.75` for app UI.
- **Size:** `16px` inline, `20px` icon-buttons, `24px` feature row, `28px` hero.
- **Colour:** always inherit from text (`currentColor`). Never tint icons with accent or status colours except inside status pills.
- **No emoji.** Not in UI, not in marketing copy, not in dispatch entries.

---

## 8 · Imagery

- **No stock photography.** No generic-SaaS hero photos, no illustration sets, no 3-adjective feature grids.
- **No mascots, no characters, no illustrated peoplework scenes.**
- **No holographic gradients, robot iconography, glow blooms** (the AI-generic aesthetic).
- **Photography that ships:** real captured screenshots of the product, treated with hairline borders and `--shadow-3`. Real wedding/venue/freelance work-product when illustrating an audience.

---

## 9 · Accessibility (non-negotiable)

- **Contrast:** AA minimum for body text (`#111` on white = 19.07:1, passes AAA). All indigo-on-white text uses `--accent-deep` (`#4338ca`) for AA at 14px.
- **Focus:** visible 2px indigo outline at `outline-offset: 2px` on every interactive element. Never `outline: none` without an equivalent visible state.
- **Motion:** every animation respects `prefers-reduced-motion` via `useReducedMotion()`.
- **Forms:** every input has a visible label. Placeholder text is never the only label.
- **Semantic HTML first.** `<button>` for buttons, `<a>` for navigation, `<nav>`, `<main>`, `<article>`. No `div onClick=` on any interactive element.

---

## 10 · Refusals (the moat)

These are not "guidelines." They are refusals that compound across the suite.

### Banned visuals
- Purple gradients (`#7c5cff`, `rgba(124, 92, 255, ...)`)
- AI-generic aesthetics: holographic gradients, robot icons, glow blooms
- 3-adjective marketing video grid layouts ("feature × icon × verb" SaaS pattern)
- Generic SaaS hero photography, stock illustrations, mascots
- Drop-shadows over hairlines as default elevation
- Pure black `#000000` for text
- Pure white `#FFFFFF` for elevated surfaces *in any colour-aware context* (use `--paper`)
- More than one accent colour
- Category-coloured products (Tasks ≠ green, Roadmap ≠ orange, etc.)

### Banned typography
- Inter alone as the display face
- Roboto, Arial, Space Grotesk for new surfaces
- More than two type families on a page
- Centred body paragraphs longer than two lines
- All-caps body text (eyebrows and status labels excepted)

### Banned copy
- AI-marketing register: `AI`, `AI-powered`, `intelligent`, `smart`, `copilot`, `agent`, `assistant`, `moves itself`, `thinks`, `knows`, `decides`, `predicts`, `recommends`, `autonomous`
- Project-management register: `sprint`, `epic`, `kanban`, `stakeholder`, `OKR`, `burndown`, `velocity`, `at risk` (as a status)
- 3-adjective trios in any hero ("Modern, simple, beautiful")
- Exclamation marks. Anywhere.
- Engineering-team framing ("engineering teams", "for developers", "front-matter spec")

### Banned interaction patterns
- Modal-on-load (cookie banners, newsletter popups, "what's new" diaribbons)
- Confetti, celebration animations, gamification
- Infinite scroll on content that has an end
- Skeleton loaders longer than 200ms (if it's that slow, fix the data path)
- Loading spinners on actions that complete in under 300ms

---

## 11 · Per-product accents

The suite is one design system. Each product carries one structural accent the others don't, never colour or typography.

| Product | Domain | Structural accent | Voice register |
|---|---|---|---|
| Studio | signalstudio.ie | broadcast wordmark gesture; umbrella footer 2-col | umbrella, oriented to the suite as one thing |
| Tasks | tasks.signalstudio.ie | tick-underline gesture; cinematic demo on homepage | execution-first, present tense, "your week" |
| Roadmap | roadmap.signalstudio.ie | advance-dot gesture; public-viewer share surface | direction-first, plain prose for non-tech stakeholders |
| Analytics | analytics.signalstudio.ie | heartbeat-badge gesture; briefing-not-dashboard layout | observational, never prescriptive, "you might want to look at" |
| Notes | notes.signalstudio.ie | settle-collapse gesture; warm-paper notebook chrome | sotto voce, single-column reading, no chrome on focus |

Notes's green/mustard/Inter aesthetic is **intentional and locked** (see [`feedback_notes_aesthetic.md`](~/.claude/projects/-Users-ethanmcnamara/memory/feedback_notes_aesthetic.md)). Do not file it as a BRAND.md violation.

---

## 12 · How to use this file

**For agents (Claude Code, Codex, Stitch):**
1. Load this file before any UI work in any Signal Studio repo.
2. Resolve token references against the repo's `globals.css` (or `app/globals.css`) — this file documents the family; the CSS is the source of truth for the exact value.
3. If a request asks for something in the §10 banned lists, refuse and propose the suite-aligned alternative. Don't ship the banned pattern with a caveat.
4. New components: check §6 first. If the pattern doesn't exist here, propose it as an addition before building.

**For humans:**
- Strategic / positioning decisions → [`BRAND.md`](./BRAND.md)
- Token values that diverge from this doc → fix [`src/app/globals.css`](./src/app/globals.css), then update this file
- Per-product overrides → document in that product's repo, not here

---

## 13 · Provenance

- **Generated:** 2026-05-14 by direct extraction from `BRAND.md` §3–§6 and `src/app/globals.css`. Not an LLM hallucination of design tokens — every hex and value below was read from the live system.
- **Cadence:** review on each design-system-v* bump (currently v1, locked 2026-05-13).
- **Owner:** Ethan McNamara · `hello@signalstudio.ie`.
