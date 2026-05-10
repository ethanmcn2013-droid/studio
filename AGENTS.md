# AGENTS.md — Signal Studio

Read this before making any change. It is the contract every agent (Codex, Claude Code, Cursor, anyone else) operates under in this repo.

**Required reading on first session, in order:**
1. **This file** — locked rules + workflow.
2. **`docs/VISION.md`** — what Signal Studio is, what it's becoming, what it's explicitly NOT building.
3. **`docs/BRAND.md`** — full voice/brand handbook (audience archetypes, banned words, visual register, page conventions). Source of truth for the suite.
4. **`CHANGELOG.md`** — narrative log; read for tonal reference.

If any conflict between these, BRAND.md wins on voice/visual rules; VISION.md wins on strategic intent and refusals; AGENTS.md wins on workflow.

---

## What this is

This is the **umbrella site for Signal Studio** — a four-product suite (Signal Tasks, Signal Roadmap, Signal Analytics, Signal Notes). The umbrella lives at `signalstudio.ie`. The site is a single-page choreographed entrance ("The Reveal v3") that introduces the suite. No auth, no DB, no CMS. Static-ish Next.js 16 with one client orchestrator for motion.

The repo's job is to be the most restrained, premium, brand-coherent surface in the suite. Every other product takes its visual cues from here.

---

## Locked rules (do not break, ever)

These are not suggestions. Breaking any of them is a regression that will be reverted on review.

### Naming
- Brand is **Signal Studio** in body copy. Never just "Signal" in a sentence — collides with Signal Messenger and is unownable. "Signal" alone is permissible only as a wordmark device or visual mark.
- Products are **Signal Tasks**, **Signal Roadmap**, **Signal Analytics**, **Signal Notes**. Never abbreviate to "Tasks" alone in marketing/footer/nav unless inside a product surface.
- Wordmark stylization: lowercase wordmarks (`tasks.`, `roadmap.`, `analytics.`, `notes.`) appear only as motion-typographic elements. Body copy is title case.

### Voice (full version in `~/Projects/personal/BRAND.md` §3)
- Declarative. Periods, not exclamation marks. Anywhere.
- Plain English, ~7th-grade reading level. Not childish — clean.
- Verbs over nouns. Active over passive. Concrete over abstract.
- Universal examples. A wedding planner, a freelancer, a tradesperson, a student. **Never** "engineering teams", "developers", "product managers", "stakeholders".

### Banned words (non-exhaustive — full list in BRAND.md §3)
- AI-marketing: `AI`, `AI-powered`, `intelligent`, `smart`, `copilot`, `agent`, `autonomous`, `predicts`, `recommends`
- SaaS fluff: `seamless`, `world-class`, `cutting-edge`, `transform`, `revolutionize`, `unleash`, `supercharge`, `delight`, `pleasure` (as UX qualifier), `leverage` (as verb)
- PM jargon: `sprint`, `epic`, `story point`, `burndown`, `stakeholder`, `MVP` (in body copy), `Kanban`, `Scrum`, `Agile` (capitalized)
- Tech jargon on user-facing pages: `API`, `webhook`, `endpoint`, `OAuth`, `deploy`, `build`, `repo`, `PR`, `merge`, `commit`, `integration` (use "connect" or "works with")
- Three-adjective trios ("modern, simple, beautiful") — anywhere, any order.

### Category framing
- The category is **operational clarity**. Not productivity. Not project management. Not analytics-as-dashboard. Never describe Signal Studio as a "productivity platform" or "all-in-one".
- AI is ambient, never marketed. No "AI-powered" copy. No AI feature names.

### Visual
- Accent color: `#c9a96a` (warm antique gold). Single accent across the suite — do not introduce per-product accents in this repo.
- Type: Geist (sans + mono). No other typefaces.
- Visual register: calm, premium, neutral with one warm accent. Reference points: Apple, Linear, Arc, Notion Calendar, Raycast. **Never** Jira, Monday, Tableau, or any 3-adjective hero grid.

---

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind v4
- Geist font family
- Motion stack: GSAP 3.13 + ScrollTrigger + Lenis 1.1.20 (dynamically imported in `RevealEngine` to keep the initial server bundle clean)
- Package manager: `pnpm`

`pnpm-workspace.yaml` requires both `packages: - "."` and `allowBuilds` declared — without the `packages` line, `pnpm add` errors with "packages field missing or empty". Don't remove either.

---

## Page structure (current — v3 The Reveal)

```
src/app/page.tsx
  ├─ <RevealHero>        — gold hairline → masked headline word-by-word → product wordmark stack with per-product gestures
  ├─ <RevealManifesto>   — operating principle eyebrow → display H2 → two-paragraph thesis
  ├─ <RevealProducts>    — four typographic-poster product rows, subdomain links via @/lib/product-urls
  ├─ <RevealClosing>     — gold hairline + "Built for everyone else." sign-off + mono `hello@signalstudio.ie · Dublin, 2026`
  └─ <RevealEngine>      — single client orchestrator (GSAP timeline + Lenis + ScrollTrigger)
```

`RevealEngine` is the *only* client component. Everything else is RSC. Honor `prefers-reduced-motion` — the engine already does, do not undo that.

---

## Workflow

1. **Branch.** Never push directly to `main`. Use a descriptive branch name (`fix/closing-block-typo`, `feat/notes-row-hover-state`).
2. **Commit style.** Match the existing log: `studio · <scope> — <change in plain English>`. Look at `git log --oneline` for the cadence.
3. **PR, don't merge.** Open a PR against `main`. Vercel will post a preview URL on the PR — review the preview, not just the diff. Brand drift is invisible in diffs.
4. **Local dev.** `pnpm dev` (Turbopack). The motion stack only fires on production builds in some cases; if a motion change looks broken, also test `pnpm build && pnpm start`.
5. **No new dependencies** without naming why in the PR description. The dependency surface here is deliberately small.

---

## What to push back on

You are not a yes-man. If a request would break a locked rule above, **say so before doing it**. Surface the conflict, name the rule it violates, propose an alternative that respects the rule. Examples:

- Asked to add "AI-powered briefings" to copy → refuse, propose plain-English alternative, cite §3.
- Asked to add a fifth product row before that product is real → refuse, point at the Notes row (which is dimmed/inert by design until Notes ships).
- Asked to introduce a second accent color → refuse, cite §5.
- Asked to add a 3-adjective hero ("Calm. Clear. Confident.") → refuse, cite the anti-quotable rule in §2.

If the request is ambiguous, ask one tight question. Don't ask three.

---

## Reference

- **`docs/BRAND.md`** — full voice/brand handbook (mirrors `~/Projects/personal/BRAND.md` so it's accessible to repo-scoped agents). Read first. When in doubt about voice or audience tone, this is the source.
- **`docs/VISION.md`** — strategic intent: where the suite is, where it's going, locked refusals.
- **`CHANGELOG.md`** — narrative log of suite-level launches. Add an entry for any user-visible change. Voice is playful and narrative, not procedural.

---

## Anti-patterns

- Adding features. This repo is a brand surface, not a product. If you find yourself building a form, an interactive widget, a dashboard preview — stop and ask first.
- Marketing copy in the AI register. Even "ambient AI" or "AI-light" — no.
- Adding a CMS, analytics tag, or third-party script without explicit ask.
- "Cleaning up" the motion choreography because the timing looks "off" — the choreography is intentional and Ethan-tuned. Don't touch timing without an explicit ask.
- Generic AI-aesthetic UI (gradient backgrounds, glassmorphism, generic grid hero). The visual register is specific. Read it. Match it.
