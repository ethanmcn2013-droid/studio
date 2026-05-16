# P6 · JS bundle — findings & verdict (2026-05-16)

## What P6 asked
"From P1: three largest client modules → Server Components or
next/dynamic. Remove duplicates + unused exports. Target homepage JS
≤150 KB gzipped."

## What's actually there

Measured the *real* initial JS (live prod homepage, `<script src>` +
`modulepreload`, prefetch excluded — 0 prefetch chunks, so the P1
192 KB was real initial, not prefetch inflation as first hypothesised).

Per-chunk content fingerprint of the 12 initial chunks:

| Chunk            | gzip   | Identity (by content)                |
|------------------|--------|--------------------------------------|
| 0fuvf5~zp8e-c    | 69.9KB | React 19 + react-dom (`createRoot`)  |
| 03~yq9q893hmn    | 38.8KB | Next 16 App Router runtime           |
| 025~3v5s7ezvq    | 30.5KB | Next 16 App Router runtime           |
| 0twmr1f_bih~-    | 12.6KB | Next/router shared                   |
| 11aihu~s~po_q    |  9.8KB | shared                               |
| 0csc2jk-2vsvi    |  9.1KB | shared                               |
| 03gtjjm~y~ssu    |  7.4KB | react-dom (cont.)                    |
| 0v95e_jia~hfg    |  5.4KB | shared                               |
| turbopack-169_   |  4.2KB | Turbopack runtime                    |
| **0apjxcvd6z01t**|  1.7KB | **gsap/ScrollTrigger reference only**|
| 02ue-p6f56i2c    |  1.4KB | shared                               |
| 0z_i~ud8_a8c_    |  0.8KB | shared                               |
| **Total**        |**~192KB**|                                    |

Homepage's own app-specific client chunk (`b607dc4daafe934d.js`):
**47 KB raw / ~13 KB gzip**. Tiny.

## The three "heavy" libs are already optimised

- **Homepage (`src/app/page.tsx`) is a Server Component** — no
  `"use client"`. Renders 5 server sections + one thin client engine.
- **gsap + ScrollTrigger**: dynamically imported inside `useEffect`
  in `reveal-engine.tsx` (`// Dynamic imports keep GSAP/Lenis out of
  the initial server bundle`). Confirmed: the only gsap-tagged initial
  chunk is **1.7 KB** (the import *call site*, not the ~50 KB library
  — that loads on mount, off the critical path).
- **lenis**: `await import("lenis")` — same pattern. Not in initial.
- **mermaid** (`^11`, very large): dynamic `await import("mermaid")`,
  and only on `/hq/atlas/[slug]` (password-gated). Not on the homepage
  at all. (P1's "mermaid on critical path" suspicion was wrong.)

There are **no application client modules to move to Server
Components or next/dynamic** — the prior engineer already did exactly
the work P6 describes. No duplicate/unused client deps found.

## Verdict — the 150 KB target is unreachable here, and not the bottleneck

~90% of the 192 KB is **React 19 + Next 16 App Router framework
runtime**. That floor is ~150–170 KB gzip for *any* hydrated page on
this stack. Getting under 150 KB would require abandoning the
framework for the marketing route (static HTML export, zero
hydration) — an architecture change explicitly outside this goal's
scope, and unwarranted because:

- Homepage **TBT = 70 ms** (target ≤200) — JS is not blocking the
  main thread.
- Homepage **Perf = 94**, no regression.
- Homepage LCP 2.5 s is a **render/CSS** concern (the Reveal's
  entrance + font swap), **not** JS execution.

Spending effort to shave framework runtime that the CWV data shows
isn't the bottleneck would be optimisation theatre. **Recommendation:
accept the homepage JS target as not-met-by-framework-floor (documented
here), and treat LCP — the actual homepage weakness — as the real
perf lever (it is render-path, addressed by P7/P8, not P6).**

## What P6 did ship

- `@next/bundle-analyzer` installed + wired in `next.config.ts`,
  gated behind `ANALYZE=true` (never touches normal/prod builds).
  Note: the webpack analyzer is inert under Turbopack; the working
  analyzer is `next experimental-analyze` (output in
  `.next/diagnostics/analyze/`). Both are available for future use.
- This findings doc. No code "optimisation" — there was nothing
  honest to optimise; saying so is the deliverable.
- No dispatch entry (dev-tooling + a measurement conclusion is not
  user/leadership-facing — silence is brand).
