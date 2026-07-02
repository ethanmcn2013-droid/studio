---
id: loading-canon-2026-07
title: Loading canon implemented suite-wide — 10px dot authority restored, handoff press ≤120ms, honest long-wait escalation, banned loader names purged
category: Brand
date: 2026-07-01
status: Active
reviewDate: 2026-08-01
relatedObjects: [studio/DESIGN.md §13, SuiteLoader.tsx × 5 repos, /hq/loading-review, signal-studio-loading-screen-pitches.md]
---

## Decision

The panel-gated loading system (ten moments, one system) is now implemented across all five repos, and the review room ships at /hq/loading-review with the artifact at /brand/loading-review-2026.html.

Four locks:

1. Boundary dot is 10px hard px everywhere. DESIGN.md §13.3 is the authority; D8's 12px remediation (2026-05-18) is superseded. `--load-dot-size` is 10px in all five globals.css files, SuiteLoader fallbacks match, and the SuiteLoader identity hash was resealed.
2. Cross-product handoff never delays navigation. `suiteJump`'s 380ms hold was cut to 120ms in every switcher and launcher (nine files plus studio product-pills, which was 320ms). The destination's loading boundary owns the arrival.
3. Long waits escalate honestly. A shared `LongWaitStatus` component (real 5s timer, `role="status"`, `aria-live="polite"`) now sits in all four product /app boot loaders with the canon lines: Opening the workspace / the timeline / the briefing / the notebook.
4. Visible loader names are notes, tasks, timeline, signal only. Timeline's boot loader spelled `roadmap` and Signal's root loader spelled `analytics` — both purged. Signal's root boundary is now the quiet Layer-0 dot; the wordmark moment lives at /app.

Also shipped: the Notes boot loader's dot became the canonical sharp caret (1.1s steps on/off), and Signal's /app/brief gained a briefing-assembly skeleton that reserves only the headings the surface actually renders (Needs attention, Quiet risks) — static, no shimmer.

## Reason

The 2026-07-01 loading review scored every loading moment against the system laws and found three canon violations live in production code: two banned visible names (`roadmap`, `analytics`), a 380ms artificial navigation delay on every cross-product switch, and a 10px/12px dot-size fork between DESIGN.md §13 and the D8 remediation. One system, one dot, one press rule closes the drift.

## Alternatives considered

Keep D8's 12px (rejected: §13's derivation ties 10px to the wordmark ceiling min(0.16em, 10px) — one authority beats a perceptibility tweak that forked the canon). Keep the 380ms dot-morph hold (rejected: law 8 — source press ≤120ms, never delays navigation; the overlay still animates through the browser's natural latency). Add root loading.tsx boundaries to tasks/roadmap/notes per §13's original contract (deferred: studio's SEV-0 record shows a stuck root Suspense fallback covering every page; not re-adding fixed root overlays without browser verification per repo).

## Risks

The SuiteLoader identity hash changed — any repo that skips the resealed check script will fail CI until it pulls the new copy. The review artifact loads Geist from a CDN; offline it falls back to system sans and its own gate checklist reports the miss honestly. Timeline's boot gesture changed from the opacity-blink sweep to slide-and-settle — matches BRAND.md §4 (`timeline.` dot slides and settles) but is a visible change on cold entry.

## Notes

Review room: /hq/loading-review (in the ⌘K palette). Escalation is boot-only — never local region fetches. Tasks route-level skeletons (pitch 8) were deliberately not added: board/list/detail resolve from layout-level context after boot, so a route skeleton would flash under 200ms — the restraint laws beat the checklist.
