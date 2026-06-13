# Signal Studio — Wordmark Gesture Specs (motion-graphics handoff)

**Compiled:** 2026-06-04 from live `globals.css` in each repo.
**Authority:** When this file disagrees with BRAND.md §4, the live CSS is canonical (per AGENTS.md). Aspirational targets in BRAND.md are noted inline.

These five gestures are the per-product identity moments — the only difference in the wordmark across products. Every other motion in the suite is utility (skeleton shimmer, loading dot, content arrive); the wordmark gesture is the one piece of branded motion.

Single accent color suite-wide: `--indigo: #4f46e5`.
Reduced-motion contract (all 5): `@media (prefers-reduced-motion: reduce) { animation: none; opacity: 1; transform: none; }` — static at full presence, never hidden.

---

## 1 · Studio (umbrella) — `signal studio.` broadcast

**Wordmark:** `signal studio.` — Geist Sans 600, letter-spacing `-0.035em`. The period is the indigo dot.

**Gesture:** Two-layer broadcast, ONE-SHOT on mount. The period emits, then a ring expands outward and dissolves. Then quiet — the house announces itself on arrival and is then silent.

**Period layer (`brand-signal-emit`)**
- Duration: `2.6s`
- Easing: `cubic-bezier(.16, 1, .3, 1)` (`--spring-glide`)
- Iterations: `1` (one-shot)
- Fill: `both`
- Keyframes:
  ```
  0%, 70%, 100% → transform: scale(1)
  80%           → transform: scale(1.25)
  90%           → transform: scale(1)
  ```

**Ring layer (`brand-signal-ring`)**
- Same duration / easing / 1-shot
- Geometry: `0.18em × 0.18em` border (1.2px solid `--indigo`), absolute, right/bottom-anchored to period.
- Keyframes:
  ```
  0%, 60% → opacity: 0;    transform: scale(1)
  65%     → opacity: 0.55; transform: scale(1)
  100%    → opacity: 0;    transform: scale(2.6)
  ```

**Trigger:** `.is-intro` (mount, SiteNav) or `.is-live` (re-trigger demonstrations, `/brand` MotionSpecimen). Must never loop.

---

## 2 · Tasks — `tasks·` pulse

**Wordmark:** `tasks·` — lowercase Geist semibold, tracking `-0.01em`. The middot dot is the indigo period.

**Gesture:** A breathing pulse, infinite. The dot at rest gently scales in and out; it quickens with load.

**Live values (tasks repo: `src/app/globals.css:411`)**
- Duration: `2.6s`
- Easing: `ease-in-out`
- Iterations: `infinite`
- Geometry: `0.32em × 0.32em` (px-clamped `max: 8px × 8px` to survive pre-hydration)
- Position: `transform: translateY(-0.38em)` baseline
- Keyframes (`tasks-dot-pulse`):
  ```
  0%, 30%, 100% → translateY(-0.38em) scale(1)
  10%           → translateY(-0.38em) scale(1.22)
  20%           → translateY(-0.38em) scale(1)
  40%           → translateY(-0.38em) scale(1.12)
  50%           → translateY(-0.38em) scale(1)
  ```
- Pattern: paired beats (1.22 then 1.12) within each cycle. **NOT** a heartbeat — that vocab was retired 2026-05-16.

**Studio-side variant (`src/app/globals.css:451`)** — same name, simpler shape, used in cross-product chrome:
- Easing: `--spring-glide` (`cubic-bezier(.16, 1, .3, 1)`)
- Keyframes: `0%, 60%, 100% → scale(1); 70% → scale(1.25); 80% → scale(1)`.

**Decision for motion-graphics:** Use the **Tasks-repo** values when rendering Tasks-product surfaces. Use the **Studio-repo** values when rendering umbrella surfaces that show all 4 product gestures together (the simpler shape reads cleaner at small sizes).

---

## 3 · Timeline — `roadmap·` ambient opacity pulse

**Wordmark:** `roadmap·` — same lowercase Geist semibold + middot dot.

**Gesture:** A low-key ambient opacity pulse (not the "slide" gesture aspirationally named in BRAND.md §4). The slide was deferred 2026-05-18 per `ELEVATION_C2_TICKET.md:24–36` to avoid competing with SuiteLoader during page load.

**Live values (timeline repo: `src/app/globals.css:912`)**
- Duration: `3s`
- Easing: `ease-in-out`
- Iterations: `infinite alternate`
- Keyframes (`roadmap-dot-ambient`):
  ```
  from → opacity: 0.85
  to   → opacity: 1.0
  ```

**Motion-graphics note:** If a "slide" gesture is desired for marketing-only assets (where SuiteLoader is absent), commission a separate keyframe. Do **not** modify the live product gesture without raising it as a brand-canon change in BRAND.md §4 first.

---

## 4 · Signal — `analytics·` tick (sampled)

**Wordmark:** `analytics·` — same lowercase Geist semibold + middot dot.

**Gesture:** The dot **jumps** between 4 discrete sample positions, never glides between them. `steps(1, end)` ensures the transition is instantaneous; the dot snaps to a new Y once per cycle, then holds. Read: discrete samples, not a continuous signal.

**Live values (signal repo: `src/app/globals.css:441`)**
- Duration: `3.6s`
- Easing: `steps(1, end)` (timing function snaps between samples)
- Iterations: `infinite`
- Geometry: `5px × 5px` (max `8px × 8px` pre-hydration clamp)
- Keyframes (`analytics-dot-tick`):
  ```
  0%   → translateY(-3px)
  25%  → translateY(-6px)
  50%  → translateY(-1px)
  75%  → translateY(-5px)
  100% → translateY(-3px)
  ```
- Read: every 900ms (3.6s / 4 samples) the dot jumps to a new height. The eye reads it as data being sampled.

**Open question (P3 from audit):** The 30s Remotion demo (`analytics-demo/`) currently renders a **static** dot at the closing wordmark, not the tick gesture. Decide before 7.3 grade pass: lock static (calmer for typography cut) or animate per spec above.

---

## 5 · Notes — `notes·` caret blink

**Wordmark:** `notes·` — same lowercase Geist semibold + middot dot. **Two variants** in this repo, deliberately different:

**5a · Marketing breadcrumb (`.notes-mark .dot`)** — **static**. No animation. Suite-wide breadcrumb consistency.

**5b · In-app notebook header (`.wordmark .dot`)** — caret blink. Lives at the top of the notebook view; signals "this is the live writing surface, ready for keystrokes."

**Live values for 5b (notes repo: `src/app/globals.css:399`)**
- Duration: `1.1s`
- Easing: `steps(1, end)` — sharp on/off, not faded
- Iterations: `infinite`
- Keyframes (`notes-dot-caret`):
  ```
  0%, 100% → opacity: 1
  50%      → opacity: 0
  ```

**Hard caret behavior, like a real text cursor.** Do not soften to a smooth fade — the sharpness is the gesture.

**Audit nit (P3 from notes audit):** add a comment at the keyframe block: `/* ~1.1s sharp on/off per BRAND.md §4 — caret gesture */` so animators reading CSS only have context.

---

## Summary table

| Product   | Duration | Easing                     | Pattern                | Iterations         |
|-----------|----------|----------------------------|------------------------|--------------------|
| Studio    | 2.6s     | `cubic-bezier(.16,1,.3,1)` | scale + ring expand    | 1 (one-shot)       |
| Tasks     | 2.6s     | `ease-in-out` (live) / spring-glide (umbrella) | paired-beat scale | infinite           |
| Timeline   | 3s       | `ease-in-out`              | opacity 0.85↔1.0       | infinite alternate |
| Signal | 3.6s     | `steps(1, end)`            | 4 discrete translateY  | infinite           |
| Notes     | 1.1s     | `steps(1, end)`            | opacity 1↔0 (sharp)    | infinite           |

## Reduced-motion contract (universal)

Every gesture has this companion block, byte-identical pattern:

```css
@media (prefers-reduced-motion: reduce) {
  .<dot-class> {
    animation: none;
    opacity: 1;
    /* transform reset to baseline */
  }
}
```

Result: brand presence is preserved (dot is visible at full opacity); motion is removed.

## Sources

- `studio/src/app/globals.css:1680–1719` — brand-signal-emit / brand-signal-ring
- `tasks/src/app/globals.css:397–419` — tasks-dot-pulse (live product)
- `studio/src/app/globals.css:441–469` — tasks-dot-pulse (umbrella variant)
- `roadmap/src/app/globals.css:905–928` — timeline-dot-ambient
- `analytics/src/app/globals.css:420–449` — signal-dot-tick
- `notes/src/app/globals.css:399–410` — notes-dot-caret (notebook header)

## Authority chain

When this doc, BRAND.md §4, and live CSS disagree:
1. Live CSS wins (per AGENTS.md in each repo).
2. This doc is the snapshot of live CSS at handoff.
3. BRAND.md §4 captures the brand intent; mismatches with live CSS are tracked as decisions (e.g., timeline-slide deferred per ELEVATION_C2_TICKET.md).
