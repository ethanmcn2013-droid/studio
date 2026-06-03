# Signal Studio · Brand Guide Handoff (2026-05-11)

**Status**: committed direction · rolling out across products
**Source**: Claude Design canvas (D01 — Refined Indigo Dot)
**Locked direction noted at app.jsx:1**: *"Signal Studio · refined indigo dot — committed direction. The dot is the brand. Same shape from favicon to billboard. Per-product gestures read each product's relationship to time."*

This file is the operating summary of the brand guide. The full canvas + the three rejected directions (D02 quadrant, D03 mono wordmark, D04 serif monogram) live on Ethan's desktop and are not committed — they were explorations, not the final.

---

## What's locked

### 1 · The mark (one construction across the suite)

A single wordmark grammar — used for both the umbrella `signal studio` and each product `tasks`, `roadmap`, `analytics`, `notes`. Same shape from a 16px favicon to a billboard.

| Property | Value |
|---|---|
| Font | Geist, weight 500 |
| Letter-spacing | -0.025em |
| Alignment | inline-flex, baseline |
| Word line-height | 0.95 |
| Dot size | 0.16em (square circle, lower-right) |
| Dot color | `--indigo: #4f46e5` |
| Dot offset | `margin-left: 0.06em`, `align-self: flex-end`, `margin-bottom: 0.06em` |

The dot is the brand. The wordmark is "name + dot."

### 2 · Four temporalities · one per product

Each product's dot animates differently — encoding that product's relationship to time. **This is the brand framework.**

| Product | Gesture | Reading time as… | CSS keyframe |
|---|---|---|---|
| `tasks·` | **pulse** (continuous) | now — the queue is alive | `@keyframes dot-pulse` · 2.6s ease-in-out infinite |
| `roadmap·` | **slide** (forward) | timeline — from past to future | `@keyframes dot-slide` · 5.4s cubic-bezier infinite |
| `analytics·` | **tick** (sampled) | discrete reads — jumps between samples | `@keyframes dot-tick` · 3.6s steps(1, end) infinite |
| `notes·` | **caret** (input) | awaiting — a held cursor | `@keyframes dot-caret` · 1.1s steps(1, end) infinite |
| `signal studio.` | **pulse-slow** (ambient) | the umbrella, calmer | `@keyframes dot-pulse-slow` · 5.2s ease-in-out infinite |

**Changes from previous BRAND.md §4:**
- Notes: was "underline writes itself" → now **caret** (the dot blinks like a typewriter cursor; aligns with the notebook's actual capture-cursor language).
- Analytics: was "static dot" → now **tick** (discrete data ticks, mirrors the briefing-as-sampled-attention model).
- Studio umbrella: antique-gold period treatment is retired; the animated variant is **pulse-slow** in indigo.

### 3 · Color tokens (additions to current palette)

The core palette is white paper, off-black ink, and indigo `#4f46e5`. Antique gold `#c9a96a` is retired. **New tokens added** for layered surfaces and finer hairlines:

```
--paper:     #ffffff
--paper-2:   #f4f1ea  /* warm */
--paper-3:   #ebe7de  /* warmer */
--hairline:  rgba(17,17,17,0.10)
--ink-ghost: #c5c1b6  /* lighter than ink-faint */
```

These are additive — they don't replace existing tokens.

### 4 · The dot as universal vocabulary

The dot isn't only a logo mark — it's a UI primitive used across the surface:

- **Favicon (16px)** — same dot shape
- **Status indicators** — live, idle, syncing (pip with optional pulse)
- **Bullets** — list-item markers
- **Progress thumbs** — slider/progress knobs
- **Location pins** — map markers (with ring)
- **Active nav** — underdot under the active route
- **Cursors / carets** — the blinking input gesture (matches Notes's caret)
- **Bar-graph meters** — small indigo bars

Same indigo, same size scaling, same shape. The dot is the brand vocabulary.

### 5 · Typography

Unchanged from current BRAND.md:
- **Geist Sans** for body + headings
- **Geist Mono** for eyebrows, timestamps, status labels

Fraunces was explored as a serif "rule-breaker" direction (D04) — **not committed**. Geist remains canonical.

### 6 · What stays Notes-specific

Notes keeps its locked product-surface aesthetic (warm green/mustard/Inter) per the 2026-05-10 owner decision. The brand-guide rollout for Notes applies to:
- The **wordmark** (Geist + indigo dot + caret gesture) — brand-coherent
- Cross-product navigation chrome
NOT to the notebook product surface itself, which retains its own visual register.

---

## Per-product rollout sequence

| Cycle | Product | What changes |
|---|---|---|
| **11.1** | Notes wordmark | Underline-writes → caret (dot blink). Geist + dot grammar applied to suite-strip nav. Notebook surface unchanged. |
| **11.2** | Studio umbrella | Wordmark animated with pulse-slow (replacing the static gold period in some contexts) |
| **11.3** | Analytics wordmark | Static dot → tick gesture |
| **11.4** | Tasks + Roadmap wordmark | Verify pulse + slide match the locked timing curves; align where they don't |
| **11.5** | Universal dot vocabulary | Add the dot primitives (status pips, bullet, nav active-dot, progress thumb) as shared CSS utilities to studio's globals.css |
| **11.6** | Favicons | Re-issue all icons to the new 22%-radius dark-tile + dot pattern |

---

## Source files preserved

- `tokens.css` (in this folder) — the design system tokens from the handoff. Use as reference.
- The full HTML canvas + JSX components live in Ethan's local handoff folder, not committed.
