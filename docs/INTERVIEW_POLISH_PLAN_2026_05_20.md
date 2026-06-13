# Interview-Grade Presentation Polish — 2026-05-20

**Trigger.** Operator is sending the suite URL to an interviewer. The link must read as the work of someone with taste, restraint, and motion sense — not just a competent ship.

**Scope (5 surfaces).** Studio root (signalstudio.ie) · Notes (notes.signalstudio.ie) · Tasks (tasks public landing — reference, but reviewed) · Signal (signal.signalstudio.ie) · Timeline (timeline.signalstudio.ie).

**Gate.** Each cycle scores against a 3-director panel: creative-director, ux-director, senior-engineer. **All three ≥9.5** AND **average ≥9.65** before prod push. Single 9.4 holds the cycle.

---

## Pushback held inside the plan

Cloning Tasks' anatomy three times would impress once. Per-product tempo + metaphor reads as a *system that knows when to vary* — higher-grade than uniformity. Each anatomy shares the bones (state-machine choreography + numbered slot annotations + hover-spotlight + reduced-motion fallback) and earns a register:

- **Tasks** — energetic, live-presence (shipped)
- **Notes** — quiet, solitary, no live ticking
- **Signal** — data-pulse, quantified
- **Timeline** — narrative one-shot, no infinite loops

---

## P·1 — Studio root: wordmark cadence + vertical rhythm

**Files.**
- `src/components/reveal/reveal-engine.tsx:205–215` (wordmark entrance)
- `src/components/reveal/reveal-engine.tsx:222–225` (gesture fires)
- `src/app/globals.css` lines 705, 978, 1024, 1103, 1332 (desktop padding) and 1388, 1408, 1411, 1425, 1451 (mobile)

**Changes.**

Wordmark `.stack-row` entrance:
- `duration: 0.55 → 0.95` (95% longer ride)
- `stagger: 0.09 → 0.18` (twice the gap between rows)
- delay-in `0.6 → 0.55` (start a touch earlier so total time only grows ~1.2s, not ~2s)
- easing held at `back.out(1.1)` — the overshoot character is right, only the speed is wrong

Gesture fire times (each rides slightly behind its row landing):
- notes `1.0 → 1.55`
- tasks `1.16 → 1.85`
- timeline `1.28 → 2.15`
- signal `1.4 → 2.45`

Scroll-cue lands at ~2.95s (was ~2.4s).

Vertical spacing — desktop rewrite to a 144-unit base with one tight pre-products beat:
- hero `64/120 → 64/144`
- manifesto `160/120 → 144/144`
- proof `40/120 → 48/144`
- products `0/64 → 0/96`
- closing `72/88 → 96/120`

Mobile rebalanced to a 96-unit base:
- hero `32/80 → 40/96`
- manifesto `96/64 → 96/96`
- proof `24/80 → 32/96`
- products `0/80 → 0/64`
- closing `88/72 → 80/96`

**Panel rubric (P·1).**
- CD: does the entrance feel composed, not languid? Does the rhythm read as designed, not arbitrary?
- UXD: does the wordmark slow-down actually give a visitor time to *recognise* the four products, or does it just stall them?
- SE: GSAP timeline still resolves in <3s. No CLS. Mobile padding chain still adds up to a navigable scroll.

---

## P·2 — Notes: build "Anatomy of a note" (greenfield)

**File.** New `src/components/marketing/note-anatomy.tsx` in notes repo. Insert in `src/app/page.tsx` between hero demo and anti-feature register.

**Slot inventory (6).**
1. Title (or first-line auto-title)
2. Body
3. Tag (one — Notes is one-tag-per-note by design)
4. Source pip (typed, voice-captured, share-sheet)
5. Age (relative when fresh, date when stale)
6. Promote-to-task affordance (the one-way Notes→Tasks edge that already exists)

**Choreography (quiet register).**
- T+0: base state (caret blink, blank capture)
- T+1.2s: title types in
- T+2.6s: body types in (letter-by-letter, slower than Tasks caption)
- T+4.0s: tag self-links (pill draws from left, then settles)
- T+5.0s: source pip fades up
- T+6.0s: age counter ticks once (fresh → 2m)
- T+9.0s: promote affordance gently lifts (no actual nav)
- T+12s: reset

**Reduced-motion.** Static layout. Numbered annotations 1–6 still legible.

**Panel rubric (P·2).**
- CD: does the tempo feel *Notes-like* (quieter than Tasks)? Is the indigo restraint held?
- UXD: do the six slots earn their place, or is one of them decoration?
- SE: no Framer Motion in the wrong place; choreography pauses when off-screen; SSR layout stable.

---

## P·3 — Signal: upgrade existing briefing-anatomy.tsx to motion-grade

**File.** `src/components/marketing/briefing-anatomy.tsx` in signal repo.

**Status.** Structure already shipped (left card + right annotations 1-6). It's mostly static. Add the choreography while preserving the six annotations.

**Choreography (data-pulse register).**
- T+0: base brief
- T+1.4s: first item reads (line-by-line, indigo cursor)
- T+3.0s: cap bar fills to "3 / 3"
- T+4.2s: "Why this?" expands inline
- T+5.6s: phrasing variant swaps once
- T+7.2s: focus pip drops on the third item
- T+10s: reset

**Panel rubric (P·3).**
- CD: motion serves the *quantified* metaphor without crossing into chart-junk?
- UXD: do the six annotations still map cleanly to the choreography beats?
- SE: cursor animation doesn't break SSR; no hydration mismatch; demo loop pauses off-screen.

---

## P·4 — Timeline: upgrade existing anatomy.tsx to motion-grade

**File.** `src/components/marketing/anatomy.tsx` in timeline repo.

**Status.** Currently four annotations (Status, Decision, Reason, Refusal). Fully static.

**Choreography (narrative one-shot — NO infinite loop).**
- Triggers once on intersection (not loop)
- T+0: card visible in `Drafting` state
- T+0.6s: status pill drifts `Drafting → Live` (AnimatePresence swap)
- T+1.2s: decision text fades in
- T+1.8s: indigo underline draws under decision (pathLength)
- T+2.4s: reason fades in
- T+3.0s: refusal strike-through plays
- T+3.6s: public-link icon rises
- Hold final state — don't reset

**Why one-shot here:** Timeline's metaphor is *publishing* — a one-way action. A looping anatomy would lie about the gesture. This is the cycle where restraint earns the score.

**Panel rubric (P·4).**
- CD: one-shot reads as composed, not abandoned? Final hold state is the right final state?
- UXD: does the sequence teach what a Timeline item *is* without requiring the visitor to scroll?
- SE: intersection observer fires once and exactly once; re-enters don't replay; reduced-motion lands in final state immediately.

---

## P·5 — Cross-surface first-touch walk (ux-tester)

After P·1–4 ship, hand the live URLs to ux-tester cold. Walk all four pages as the interviewer would. Report friction, not bugs.

**Out-of-scope checks (still required, run by senior-engineer).**
- Lighthouse on each surface ≥95 perf / ≥100 a11y where reachable
- 390px / 768px / 1440px width screenshots
- Reduced-motion verified (real OS toggle, not just code-read)
- View-source SSR check (no-JS still renders the anatomy as numbered list)

---

## Sequencing

P·1 first — cheapest, most visible, validates the panel mechanism.
P·2 second — greenfield, longest cycle, write while the panel rubric is fresh.
P·3 + P·4 in parallel if P·1/P·2 went smoothly — both are upgrades to existing structure.
P·5 last — has to wait for all four to be live.

## Anti-patterns to watch

- Copy-pasting Tasks' choreography. Tempting; wrong.
- Adding ornament that doesn't *teach* the product. The anatomy section is a comprehension tool — motion must serve that, not steal from it.
- Looping on Timeline. Don't.
- Forgetting reduced-motion. Every cycle's SE score is gated on a real reduced-motion check.
