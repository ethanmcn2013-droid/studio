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

**Vocabulary updated 2026-05-16 (operator-ratified).** The new brand
guide (`Signal Studio Design System`, the source Ethan handed to the
HQ rebuild) renames the per-product gestures. This set is now
canonical and supersedes the broadcast/heartbeat/advance/tick/settle
set. The dot reads time: each gesture is the brand dot behaving
differently per product.

| Product | Gesture | What it is | Timing |
|---|---|---|---|
| Studio | broadcast | Wordmark period sends concentric rings outward, once | one-shot |
| Tasks | pulse | Dot breathes at rest, quickens with load | 2.6s ease-in-out |
| Roadmap | sweep | Dot tracks left→right along a timeline | 5.4s `cubic-bezier(.22,.7,.2,1)` |
| Analytics | tick | Dot jumps between samples, never between them | 3.6s `steps(1,end)` |
| Notes | caret | Dot blinks like a held cursor | 1.1s `steps(1,end)` |

These are the *only* product-level animations. Don't invent new
gestures. **Suite-wide migration complete (2026-05-16):** all five
repos now implement the canonical vocabulary in code/CSS — keyframes,
animation tokens, timings, easings, and component docstrings conformed
(Tasks `heartbeat`→`pulse` 2.6s ease-in-out, Roadmap `advance`→`sweep`
5.4s cubic-bezier(.22,.7,.2,1), Analytics continuous-pulse→`tick` 3.6s
steps(1,end), Notes `settle`→`caret` 1.1s steps(1,end), Studio
`broadcast` one-shot). The old vocabulary (Tasks `tick` — now
Analytics, Roadmap `advance`, Analytics `heartbeat`, Notes `settle`)
is fully retired from product code. **White-lock held, ratified again
2026-05-16:** the handed brand guide's warm Stone neutral ramp was
*not* adopted for product use — paper stays `#ffffff`/`#fafafa`, ink
`#111111`, one indigo `#4f46e5`. The guide's warm ramp is brand-book
chrome only, never product tokens.

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
| Tasks | tasks.signalstudio.ie | pulse-dot gesture; cinematic demo on homepage | execution-first, present tense, "your week" |
| Roadmap | roadmap.signalstudio.ie | sweep-dot gesture; public-viewer share surface | direction-first, plain prose for non-tech stakeholders |
| Analytics | analytics.signalstudio.ie | tick-dot gesture; briefing-not-dashboard layout | observational, never prescriptive, "you might want to look at" |
| Notes | notes.signalstudio.ie | caret-dot gesture; warm-paper notebook chrome | sotto voce, single-column reading, no chrome on focus |

Notes's green/mustard/Inter aesthetic is **intentional and locked** (see [`feedback_notes_aesthetic.md`](~/.claude/projects/-Users-ethanmcnamara/memory/feedback_notes_aesthetic.md)). Do not file it as a BRAND.md violation.

---

## 12 · How to use this file

---

## 13 · Loading boundary (canonical spec — all five repos)

**Authored 2026-05-17. This section is the contract that Notes, Tasks, Roadmap, and Analytics implement against — copy the spec exactly, do not diverge.**

### Problem
Zero `loading.tsx` files exist across the suite. Without a Suspense fallback the bare RSC shell paints during route-transition and hydration. The wordmark `.md` (middot dot) is `0.16em` — before Geist Sans resolves, the em unit inherits from the root element's unhydrated size, and the dot balloons to ~250px. This reads as a crash.

### Contract

Every App Router repo mounts a `loading.tsx` at the app root. The file:

1. **Visual** — renders the product's per-product brand gesture mark (the `.md` dot for verbs: Tasks/Roadmap/Analytics/Notes; the `.pd` period for nouns: Studio/Notes) as a static indigo circle, centered on the product's paper background.
2. **Background** — `var(--paper, #ffffff)`. Never bare white via `background: white` — always the CSS custom property so it inherits the product's paper token if it ever diverges.
3. **Size** — `10px × 10px` hard-coded in `px` (not `em`). This is the intended ceiling: `0.16em` at the wordmark's `xl` size (`clamp(2.25rem,…,4rem)`) = ~10.24px at max viewport. Hard-coding in px makes the loading dot immune to font-size inheritance before the web font resolves.
4. **Dot ceiling in CSS** — The `.brand-mark .md` rule in every product's `globals.css` (or equivalent) must also apply `width: min(0.16em, 10px); height: min(0.16em, 10px)` so the dot is clamped in *all* contexts (nav, footer, loading state), not only inside `loading.tsx`.
5. **No animation** in `loading.tsx` itself — the loading state is intentionally quiet. Gesture animation belongs to the settled, hydrated component.
6. **No client directive** — `loading.tsx` must be a Server Component (no `"use client"`). It should have zero JS overhead and paint with the RSC shell.
7. **Reduced motion** — no animation to suppress; the static dot satisfies `prefers-reduced-motion` without a media query.
8. **Accessibility** — the entire loading container is `aria-hidden`. It is a visual transition aid, not meaningful content.

### Implementation (copy-pasteable for each repo)

```tsx
// app/loading.tsx — replace PRODUCT_NAME with the product's name
export default function Loading() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--paper, #ffffff)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: "var(--indigo, #4f46e5)",
          flexShrink: 0,
        }}
      />
    </div>
  );
}
```

### CSS rule (add to every product's globals.css if not already present)

```css
/* Loading-boundary dot ceiling — DESIGN.md §13.
   Hard-clamp to 10px so the dot cannot balloon before fonts resolve.
   min() keeps em-relative sizing at smaller contexts. */
.brand-mark .md {
  width: min(0.16em, 10px);
  height: min(0.16em, 10px);
}
```

### Background token per product

| Product | Background token | Hex |
|---|---|---|
| Studio | `--paper` | `#ffffff` |
| Tasks | `--paper` | `#ffffff` |
| Roadmap | `--paper` | `#ffffff` |
| Analytics | `--paper` | `#ffffff` |
| Notes | `--paper` | `#ffffff` (Notes green/mustard is typography, not background) |

All five products share `--paper: #ffffff` as of design-system v1 (2026-05-13 lock). The white-lock ratified 2026-05-16 (warm Stone ramp rejected for product use).

### Shimmer skeleton — Roadmap-only (2026-05-22 clarification)

The §13 dot loader above is the canonical loading-boundary pattern for **all five** repos. Roadmap **also** carries a `.skeleton-shimmer` CSS rule and a paired `--paper-bone` (#ebebec, ~L*92) trough token in its own `globals.css`, used inside the curation surface for in-flow row skeletons. This is intentional and Roadmap-only — the other four repos do not (and as of 2026-05-22 should not) carry the shimmer rule or the `--paper-bone` token. If a future suite-wide skeleton pattern is reintroduced, the canonical pairing is trough `--paper-bone` at 0%/100% + peak `--paper-deep` (#f4f4f5, ~L*96) at 40-60% — a ~4 L* delta that reads as motion without flashing. Provenance: `roadmap/ELEVATION_C2_TICKET.md § SUITE-SKELETON-RECONCILE` (closed 2026-05-22 as not-applicable post-wordmark-loader pass).

---

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

## 14 · Suite shell and auth-aware switcher (canonical spec — all five repos)

**Authored 2026-05-18. This section is the contract that Tasks, Notes, Analytics, and Roadmap implement against. Copy the spec exactly; do not diverge. Studio is the reference implementation.**

> **AMENDMENT 2026-05-19 — the authed switcher is always-visible pills, not a popover.**
> The original §14 specified the cross-product switcher as a *dropdown behind
> the "signal studio." text trigger* (the `SuiteLauncher` popover). In authed
> app context this proved a discoverability failure: zero of the four products
> are visible until the operator finds and clicks a faint text label. The
> authed switcher is now an **always-visible 4-product pill row** —
> `SuiteSwitcher` in `src/components/layout/suite-switcher-pills.tsx`,
> copied **byte-identical** into all five repos (only the `current` prop
> differs; omit `current` and pass `showUmbrella={false}` on the umbrella
> launcher). It carries the umbrella anchor exactly once, the dot-morph
> transition, hover-prefetch, and origin preconnect. It is portable
> (inline styles + scoped `<style>`, no Tailwind/token dependency).
>
> The `SuiteLauncher` popover is **retained, not deleted** — it remains the
> correct affordance in two contexts where a pill row does not fit or does
> not belong: (1) the **unauthed marketing nav** (low chrome, one product in
> view), and (2) **narrow/public surfaces** — the Tasks app sidebar (252px
> vertical rail) and the Roadmap public workspace-header (a forwarded
> shared-plan view guests see; suite pills must not leak there).
>
> Restraint clause: an always-on bar is more chrome than "Nothing
> distracting" prefers, so the pills are deliberately quiet — text-only at
> rest, no boxes/borders, `ink-faint`; only the current product carries the
> indigo gesture dot + a faint wash. Deferred polish (named, not silently
> dropped): the retired `product-pills.tsx` had a gliding rest-state dot;
> porting it into the byte-identical canonical component is optional future
> refinement, held back here because it cannot be pixel-verified across five
> repos in one pass.

### Problem

When a user is signed in, every product currently renders its public marketing homepage. This is not a session bug — the shared Clerk PROD instance already keeps the user authenticated across `*.signalstudio.ie`. The failure is purely presentational: the marketing nav shows "Sign in / Start for free" while the Clerk avatar sits in the corner proving the user is logged in. The user reads this as "I am logged out of this product." Scope: routing and nav presentation only. Session infrastructure is correct and untouched.

### Route authority

Every redirect decision defers to the Layer 0 per-product route allowlist. The allowlist is the binding contract; this spec references it, not duplicates it. Implement the redirect in `src/middleware.ts` (Next.js 16 middleware location; not `src/proxy.ts` unless the repo already uses that name for Clerk middleware).

- **M routes** (marketing) — authed user → 307 to that product's app entry.
- **C routes** (content: published roadmaps, shared briefings, brand assets) — never redirected. Reachable by everyone, signed in or not. A miscategorised C route detonates the no-auth-for-viewers promise.
- **A routes** (app) — the authed destination; never redirected.
- **X routes** (infra) — `/api/*`, `/hq/*`, OG images, feeds, sitemaps, robots; never touched.

### Persistent top chrome

Every authed **app surface** mounts a byte-identical top chrome. The exact visual specification:

```
┌─────────────────────────────────────────────────────────────┐
│ [signal studio.] / [product]   ···   [switcher▾]  [avatar▾] │
└─────────────────────────────────────────────────────────────┘
```

- **Left slot — breadcrumb:** `signal studio.` (the umbrella wordmark, lowercase with period, indigo dot, links to `https://signalstudio.ie`) + a `/` separator in `var(--ink-ghost)` + the product mark in `var(--ink-soft)` (e.g. `tasks`, `roadmap`, `notes`, `analytics` — lowercase, no period/middot in this breadcrumb context).
- **Right slot — controls:** the cross-product switcher dropdown (label "Products" or the current product name — see below) + the account menu (Clerk `<UserButton />`).
- **Height:** `h-14` (56px). Sticky top-0, `z-40`. Backdrop blur: `backdrop-blur-md`. Background: `color-mix(in srgb, var(--bg) 85%, transparent)`. Hairline border bottom on scroll: `1px solid var(--border-soft)`, transparent at rest — same transition as studio's `SiteNav`.
- **Max width:** `80rem` (app content width per §4), `px-6` padding.
- **Positional identity:** the chrome is identical in pixel geometry across all five products. A cross-product jump swaps only the body; the chrome appears not to move. This is the "feels like one app" mechanism.
- **Honest ceiling (state in code comments):** this is *perceived* continuity. A hard document navigation still occurs between subdomains. True cross-product SPA is ruled out by the locked no-monorepo and no-DB-merge decisions. The correct implementation note is: "perceived continuity, not a true SPA."

### Auth-aware switcher

The switcher dropdown has two modes based on auth state.

**Authed mode** — the user is signed in:
- Trigger label: `Products` (or current product word if space-constrained at mobile).
- Each product entry deep-links to that product's **app entry**, not its marketing homepage:
  - Tasks → `https://tasks.signalstudio.ie/app`
  - Notes → `https://notes.signalstudio.ie/app`
  - Analytics → `https://analytics.signalstudio.ie/app`
  - Roadmap → `https://roadmap.signalstudio.ie/app`
- Each item shows an **app-context label** (not a marketing tagline):
  - Tasks: "Open the workspace"
  - Notes: "Open the notebook"
  - Analytics: "Open the briefing"
  - Roadmap: "Open the roadmap"
- The current product is indicated (bold or a subtle active state) but is still a tappable link (useful to reset to app home within the product).
- Studio entry: "Back to Signal Studio" → `https://signalstudio.ie` (the suite launcher if authed, the hero if unauthed — the redirect handles it).

**Unauthed mode** — current marketing behavior. Marketing taglines, links to product marketing homepages. No change from today.

### Kill the false "Sign in"

When the user is authenticated, the product nav **must not** render any variant of "Sign in", "Start for free", "Get started", or similar authentication CTAs. These strings make an authenticated user feel logged out — this is the single biggest perceived-logout offender.

The account menu (`<UserButton />` or equivalent) **replaces** the auth CTA in the nav when authed. The auth CTA is removed entirely; it is not toggled or hidden behind a class — it is not rendered.

**Implementation pattern (Server Component):**

```tsx
// In the nav/header server component
import { auth } from "@clerk/nextjs/server"; // or equivalent

const { userId } = await auth();
// When userId is present: render <UserButton /> + switcher, not <SignInButton />
// When userId is absent: render marketing CTAs as today
```

### Owner-only escape hatch

The operator must be able to demo public marketing pages while logged in (venue sales motion, prospect walkthroughs). The escape hatch mechanism:

**Flag:** a `sessionStorage` key `signal_preview_public` (string `"1"`, tab-scoped). The per-tab scoping is intentional — opening a new tab resets to the default authed experience.

**Activation:** an account menu item labelled "View public site" (visible only when authed). Clicking it sets `sessionStorage.setItem("signal_preview_public", "1")` and reloads the page. A `?preview=public` query param is also accepted as an alternative entry (useful for linking directly to a preview-mode URL in a screen recording or handoff note).

**Effect:** the redirect middleware reads the flag via a request cookie OR the `?preview=public` query param (since `sessionStorage` is client-only and the middleware is server-side, the client-side "View public site" button must set a short-lived cookie `signal_preview_public=1; path=/; max-age=86400; SameSite=Strict` alongside the sessionStorage entry). The middleware checks: `if (authed && previewCookie !== "1" && !searchParams.has("preview", "public")) { redirect to app }`.

**Exact middleware logic (copy-pasteable):**

```ts
// In src/middleware.ts (or src/proxy.ts if that file handles routing)
const isAuthed = Boolean(request.cookies.get("__session")?.value);
const isPreview =
  request.cookies.get("signal_preview_public")?.value === "1" ||
  request.nextUrl.searchParams.get("preview") === "public";

if (isAuthed && !isPreview && MARKETING_ROUTES.has(pathname)) {
  return NextResponse.redirect(new URL(APP_ENTRY, request.url), 307);
}
```

**Deactivation:** the cookie expires after 24 hours (`max-age=86400`). The "View public site" item in the account menu shows a dismiss affordance when the flag is active ("Exit preview") that clears the cookie and reloads.

**Security note:** this is an operator-only feature. It does not alter any auth state, expose any private data, or change Clerk session handling. It only suppresses the marketing→app redirect for the bearer of a same-site cookie. Non-operators who somehow set this cookie get the marketing page — which is public anyway.

### Studio suite launcher (signalstudio.ie authed variant)

Studio has no end-user product app. Its authed destination is the **suite launcher** — the existing cross-product switcher rendered as a full page.

- **Route:** `/` (authed variant). Same URL, different render. The middleware (or a server component auth check) determines which variant to return.
- **Content:** "Jump back in" header + a 2×2 grid of product cards (same four products, operator-directed order 2026-05-18: Notes → Tasks → Roadmap → Analytics). Each card: product wordmark + app-context label ("Open the notebook", "Open the workspace", etc.) + a right-arrow. Card links go to app entries (as in authed switcher above). Below the grid: the account menu inline or a "Sign out" text link via Clerk.
- **Chrome:** mounts the persistent top chrome from this spec (§14 above). Left slot shows `signal studio.` only (no `/ product` — the launcher IS studio). Right slot: switcher + account menu.
- **Unauthed `/`:** unchanged marketing hero. The middleware passes through; `page.tsx` renders `<RevealHero />` etc. as today.
- **Brand voice on new copy:** "Jump back in." is the only heading. No marketing copy on the launcher. No taglines. No "Get started." One verb per card. This is a utility surface, not a selling surface.

### Redirect middleware implementation (studio)

Studio's existing `src/proxy.ts` handles the `/hq` password gate only. The M→launcher redirect lives in a new `src/middleware.ts` (Next.js 16 picks up both via the config matcher — they compose):

```ts
// src/middleware.ts — Layer 2 studio M→suite-launcher redirect
import { NextResponse, type NextRequest } from "next/server";

const MARKETING_PATHS = new Set([
  "/", "/work", "/proof", "/about", "/pricing",
  "/contact", "/dispatch", "/method",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // C routes — always pass through
  if (pathname.startsWith("/brand")) return NextResponse.next();
  // X routes — always pass through
  if (pathname.startsWith("/hq") || pathname.startsWith("/api")) return NextResponse.next();

  const isMarketingRoute = MARKETING_PATHS.has(pathname);
  if (!isMarketingRoute) return NextResponse.next();

  const isAuthed = Boolean(request.cookies.get("__session")?.value);
  const isPreview =
    request.cookies.get("signal_preview_public")?.value === "1" ||
    request.nextUrl.searchParams.get("preview") === "public";

  if (isAuthed && !isPreview) {
    // Authed on a marketing route → render the suite launcher.
    // The launcher is the authed variant of `/` — rewrite, not redirect,
    // so the URL stays clean.
    const target = new URL("/", request.url);
    // Signal the page to render the launcher variant via a request header.
    const response = NextResponse.rewrite(target);
    response.headers.set("x-signal-authed", "1");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ttf|eot|ico|css|js)$).*)"],
};
```

**Note on the rewrite vs redirect approach for studio `/`:** Because the suite launcher lives at the same URL (`/`) as the marketing hero, a 307 redirect would loop. Instead, the middleware rewrites to `/` and sets an `x-signal-authed: 1` request header. The `page.tsx` server component reads this header via `headers()` to decide which variant to render. For all other M routes (`/work`, `/proof`, etc.), a 307 to `/` is correct (the launcher is at `/`).

**Revised middleware logic for non-root M routes:**

```ts
if (isAuthed && !isPreview) {
  if (pathname === "/") {
    // Rewrite in place; set header for variant selection in page.tsx
    const res = NextResponse.rewrite(request.nextUrl);
    res.headers.set("x-signal-authed", "1");
    return res;
  }
  // All other M routes → redirect to the suite launcher at /
  return NextResponse.redirect(new URL("/", request.url), 307);
}
```

### Per-product M route lists (implementing repos)

Each product repo defines its own `MARKETING_PATHS` set matching the Layer 0 allowlist for that product. The redirect target is always that product's own app entry (not studio). Tasks/Notes/Analytics redirect to `/app`. Roadmap redirects to `/app` (the owner's workspace). None of the products' middlewares should redirect to studio — they redirect within their own subdomain.

### Verification gates (all repos before merge)

1. Authed request to a **C** route returns the public view (HTTP 200), not a redirect. Test `roadmap.signalstudio.ie/the-wedding`, an analytics shared briefing, `signalstudio.ie/brand`. This is the single most critical test.
2. Authed request to an **M** route (e.g. `signalstudio.ie/`, `tasks.signalstudio.ie/`) renders the app surface, not marketing.
3. Unauthed request to an **M** route renders marketing — no redirect, no auth wall.
4. Product nav renders **no** "Sign in" or "Start for free" string when the user is authed.
5. "View public site" escape hatch suppresses the redirect for the tab session.
6. `signalstudio.ie/brand` returns HTTP 200 for both authed and unauthed requests (category C).
7. 390px and 1440px visual check on the suite launcher and persistent chrome.

---

## 15 · Provenance

- **Generated:** 2026-05-14 by direct extraction from `BRAND.md` §3–§6 and `src/app/globals.css`. Not an LLM hallucination of design tokens — every hex and value below was read from the live system.
- **Cadence:** review on each design-system-v* bump (currently v1, locked 2026-05-13).
- **Last updated:** 2026-05-18 — §14 Suite shell and auth-aware switcher spec added (seamless ecosystem).
- **Owner:** Ethan McNamara · `hello@signalstudio.ie`.
