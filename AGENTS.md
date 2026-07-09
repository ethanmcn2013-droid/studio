# AGENTS.md — Signal Studio

Read this before making any change. It is the contract every agent (Codex, Claude Code, Cursor, anyone else) operates under in this repo.

**Required reading on first session, in order:**
1. **This file** — locked rules + workflow.
2. **`docs/VISION.md`** — what Signal Studio is, what it's becoming, what it's explicitly NOT building.
3. **`docs/BRAND.md`** — full voice/brand handbook (audience archetypes, banned words, visual register, page conventions). Source of truth for the suite.
4. **`docs/brand-guide/naming/LOCKED_OPERATING_VOCABULARY.md`** — exact operating words: Initiative, Project, Cycle, Task, Problem, Queue, Finding.
5. **`docs/brand-guide/naming/NAMING_CONSTITUTION.md`** — product names, rename rules, and do-not-rename boundaries.
6. **`docs/SUITE.md`** — how the four products fit together at the architecture level. Read for cross-product context.
7. **`docs/SIGNAL_HQ.md`** — private operating dashboard rules. Read before product, brand, GTM, campaign, or timeline work.
8. **`docs/ECOSYSTEM_INTEGRATION_PLAN.md`** — shared object model and collaboration growth loop. Read before cross-product, sharing, invite, template, or collaboration work.
9. **`docs/CYCLE_2_INVITE_AND_FIRST_VIEW.md`** — invite roles, guest access, first-view model, source tracking. Read before Cycle 2 implementation.
10. **`CLAUDE.md` or `CODEX.md`** — thin shims for tool-specific instruction loading. They point back here and repeat the Signal HQ rule.
11. **`CHANGELOG.md`** — narrative log; read for tonal reference.
12. **`docs/LICENSING_ACCESS_DESIGN.md`** — buildable spec for the licensing/entitlements/subscription backend + HQ "Access" console (ratified 2026-07-09). Read before any entitlements, licensing, venue/allotment, code/redemption, subscription/Stripe, or grant/revoke work. Decisions in `content/hq/decisions/licensing-access-architecture.md` + `gdpr-data-lifecycle-policy.md`.

If any conflict between these, BRAND.md wins on voice/visual rules; VISION.md wins on strategic intent and refusals; SUITE.md wins on cross-product architecture; AGENTS.md wins on workflow.

---

## What this is

This is the **umbrella site for Signal Studio** — a four-product suite (Signal Tasks, Signal Timeline, Signal, Signal Notes). The umbrella lives at `signalstudio.ie`. The public site is a single-page choreographed entrance ("The Reveal v3") that introduces the suite. Static-ish Next.js 16 with one client orchestrator for motion.

The repo also contains **Signal HQ** at `/hq`: a private, password-gated internal operating dashboard for product, launch, growth, campaigns, decisions, risks, and next actions. It is not public marketing, is not linked from public navigation, and must stay `noindex`.

The repo's job is to be the most restrained, premium, brand-coherent surface in the suite. Every other product takes its visual cues from here.

---

## Locked rules (do not break, ever)

These are not suggestions. Breaking any of them is a regression that will be reverted on review.

### Naming
- Brand is **Signal Studio** in body copy. Do not shorten the company to "Signal".
- Products are **Signal Tasks**, **Signal Timeline**, **Signal**, **Signal Notes**. "Signal" alone is reserved for the briefing/attention product or the visual mark; never use it as a casual company shorthand.
- Wordmark stylization: lowercase wordmarks (`tasks.`, `timeline.`, `signal.`, `notes.`) appear only as motion-typographic elements. Body copy is title case.
- Operating spine is **Initiative -> Project -> Cycle -> Task -> Step**. Use **Problem** instead of bug, **Queue** instead of backlog, **Finding** instead of issue, and **Review** instead of retro/post-mortem.

### Voice (full version in `~/Projects/personal/BRAND.md` §3)
- Declarative. Periods, not exclamation marks. Anywhere.
- Plain English, ~7th-grade reading level. Not childish — clean.
- Verbs over nouns. Active over passive. Concrete over abstract.
- Universal examples. A wedding planner, a freelancer, a tradesperson, a student. **Never** "engineering teams", "developers", "product managers", "stakeholders".

### Banned words (non-exhaustive — full list in BRAND.md §3)
- AI-marketing: `AI`, `AI-powered`, `intelligent`, `smart`, `copilot`, `agent`, `autonomous`, `predicts`, `recommends`
- SaaS fluff: `seamless`, `world-class`, `cutting-edge`, `transform`, `revolutionize`, `unleash`, `supercharge`, `delight`, `pleasure` (as UX qualifier), `leverage` (as verb)
- PM jargon: `sprint`, `epic`, `ticket`, `backlog`, `bug`, `story point`, `burndown`, `stakeholder`, `MVP` (in body copy), `Kanban`, `Scrum`, `Agile` (capitalized)
- Tech jargon on user-facing pages: `API`, `webhook`, `endpoint`, `OAuth`, `deploy`, `build`, `repo`, `PR`, `merge`, `commit`, `integration` (use "connect" or "works with")
- Three-adjective trios ("modern, simple, beautiful") — anywhere, any order.

### Category framing
- The operating category is **operational clarity**. The current homepage headline deliberately tests "Project Management for the 80% who don't work in tech" as market-facing shorthand. Do not let that pull body copy into project-management theatre, PM jargon, productivity-platform framing, or "all-in-one" language.
- AI is ambient, never marketed. No "AI-powered" copy. No AI feature names.

### Visual
- Accent color: `#4f46e5` (brand indigo). Single accent across the suite — do not introduce per-product accents in this repo. Antique gold `#c9a96a` is retired.
- Type: Geist (sans + mono). No other typefaces.
- Visual register: calm, premium, neutral with one indigo accent. Reference points: Apple, Linear, Arc, Notion Calendar, Raycast. **Never** Jira, Monday, Tableau, or any 3-adjective hero grid.

---

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind v4
- Geist font family
- Motion stack: GSAP 3.13 + ScrollTrigger + Lenis 1.1.20 (dynamically imported in `RevealEngine` to keep the initial server bundle clean)
- Private HQ gate: `SIGNAL_HQ_PASSWORD` + HTTP-only cookie scoped to `/hq`
- Signal HQ data: typed seed data + localStorage persistence + JSON export/import in v1
- Package manager: `pnpm`

`pnpm-workspace.yaml` requires `packages: - "."` plus explicit build-script approval settings — without the `packages` line, `pnpm add` errors with "packages field missing or empty". Don't remove either.

---

## Page structure (current — v3 The Reveal)

```
src/app/page.tsx
  ├─ <RevealHero>        — indigo hairline → masked headline word-by-word → product wordmark stack with per-product gestures
  ├─ <RevealManifesto>   — operating principle eyebrow → display H2 → two-paragraph thesis
  ├─ <RevealProducts>    — four typographic-poster product rows, subdomain links via @/lib/product-urls
  ├─ <RevealClosing>     — indigo hairline + "Built for everyone else." sign-off + mono `hello@signalstudio.ie · Dublin, 2026`
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
6. **Signal HQ stays current.** Any meaningful product, brand, GTM, marketing, timeline, feature, campaign, workflow, template, outreach, demo, report, or strategic learning change must be reflected in Signal HQ before the task is complete. In practice, update the canonical source file for the change: `content/hq/decisions/<id>.md`, `content/hq/risks/<id>.md`, `content/hq/features/<id>.md`, `content/hq/campaigns/<id>.md`, `content/hq/products/<id>.md`, `content/hq/operator-todos/<id>.md`, `content/atlas/<slug>.md`, `signal-growth/**`, or `CHANGELOG.md`. `src/lib/hq/data.ts` is a seed fallback and type substrate; touch it only when the live code path still reads from it.
7. **Collaboration is the growth loop.** Cross-product work should strengthen the loop: workspace created -> collaborators invited -> work becomes clearer -> shareable output created -> new creator discovered. If a feature touches invites, sharing, templates, guest access, public outputs, or source tracking, update `docs/ECOSYSTEM_INTEGRATION_PLAN.md` and the HQ Collab Loop data.
8. **Operator-gated work goes on the HQ operator to-do ledger.** Whenever any cycle — in this repo or any Signal product repo — surfaces a task that **only the founder/operator can do** (provision an account, get an API key, set a production env var, publish a legal doc, approve a cost limit, decide a policy), add it as a file in `content/hq/operator-todos/<id>.md` so it renders on the `/hq` main page. Never bury an operator blocker in a chat message or a doc. This keeps the founder accountable and gives both sides full visibility on what is being blocked. Mark a task `status: done` only when it is genuinely complete — never optimistically. See `content/hq/operator-todos/README.md` for the file shape.

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
- **`docs/SUITE.md`** — architecture-level primer on how the four products fit together. Read before any work that could ripple across products.
- **`CHANGELOG.md`** — narrative log of suite-level launches. Add an entry for any user-visible change. Voice is playful and narrative, not procedural.

---

## Anti-patterns

- Adding public features. This repo is primarily a brand surface, not a public product. If you find yourself building a form, an interactive widget, or a dashboard outside the private `/hq` operating system — stop and ask first.
- Marketing copy in the AI register. Even "ambient AI" or "AI-light" — no.
- Adding a CMS, analytics tag, or third-party script without explicit ask.
- "Cleaning up" the motion choreography because the timing looks "off" — the choreography is intentional and Ethan-tuned. Don't touch timing without an explicit ask.
- Generic AI-aesthetic UI (gradient backgrounds, glassmorphism, generic grid hero). The visual register is specific. Read it. Match it.
