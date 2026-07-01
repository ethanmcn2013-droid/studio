# Signal Studio · Suite primer

What this is: a Codex-facing primer on the **Signal Studio suite as a system**. BRAND.md handles voice and visual rules. VISION.md handles strategic intent. AGENTS.md handles workflow. SUITE.md handles **how the four products fit together** — architecture-level, not brand-level.

Read this when you need cross-product context. When working on the Studio (umbrella) repo specifically, this tells you what the umbrella is *referring to* whenever it links out, and what the suite-shared rules are.

---

## 1 · The four products

Each product lives in its own repo, deploying to its own Vercel project, on its own subdomain. They are not a monorepo. They share no code packages today. They share **brand**, **chrome conventions**, and **a single accent color**.

| Product | Subdomain | Repo (local) | Status | What it does |
|---|---|---|---|---|
| Signal Studio (umbrella) | `signalstudio.ie` | `~/Projects/personal/studio` | Live private preview | Choreographed entrance introducing the suite. Also hosts private `/hq` for internal operations. No public auth or CMS. |
| Signal Tasks | `tasks.signalstudio.ie` | `~/Projects/personal/tasks` | Private preview | Task workspace with auth, persistence, audience pages, and cinematic demo in active refinement. |
| Signal Timeline | `timeline.signalstudio.ie` | `~/Projects/personal/roadmap` | Private preview | Timeline workspace, editor, and public viewer in active refinement. Launch claims must be verified against the repo and preview. |
| Signal | `signal.signalstudio.ie` | `~/Projects/personal/analytics` | Private preview · product committed | Attention-clarity product. The briefing engine claim must be reconciled with the current repo before marketing says it is live. |
| Signal Notes | `notes.signalstudio.ie` | `~/Projects/personal/notes` | Private build | Capture clarity. First live surface exists; PRODUCT.md drafted (`notes/docs/PRODUCT.md`). One-way Notes → Tasks promotion only. Full v1 still pending. |

**Launch-claim rule:** GitHub `main` plus the deployed preview is the current source of truth. Do not describe a capability as shipped unless the repo contains it and the preview proves it. Local-only agent work must be pushed, reviewed, and reconciled before it becomes marketing copy.

The Studio repo (this one) is the **smallest and most restrained** of the five. It is a brand surface, not a product. Anything that would turn it into a product (forms, dashboards, interactive widgets) is a refusal candidate — propose, don't build.

---

## 2 · Cross-product chrome (suite-shared conventions)

These rules apply identically across all four products' marketing surfaces.

### Suite-strip nav
A small lowercase strip near the header of every product's marketing pages: `tasks.   roadmap.   analytics.   notes.` — each a link to its product's subdomain. The current product's wordmark renders in the brand indigo + its per-product gesture (see below); the others render dimmed.

### Footer
4-column on desktop, cascading down: **Product · Company · Resources · Suite.** Cross-product links live in the Suite column with `↗` external arrows. Attribution always reads "Made by Signal Studio".

### Per-product wordmark gestures (suite-shared mark grammar)
- `tasks·` — dot **pulses** continuously (live signal). CSS class `.tasks-dot`.
- `roadmap·` — dot **slides on mount** then settles (motion toward a destination). CSS class `.roadmap-dot`. Plays once per page load.
- `analytics·` — dot is **static** (ambient presence). Inline-styled, no class. The quietest of the four.
- `notes·` — **underline writes itself** under the word, stops just before the dot, persists. CSS class `.notes-mark`. Lives in `studio/globals.css` until Notes carries the gesture natively. Plays once on first paint.

All four respect `prefers-reduced-motion`.

### Suite-shared favicon system
Brand-soft tile `#eef2ff` (one family). Per-product letter (t/r/a/s) + accent. Studio and products now use the same indigo dot/period treatment. Favicon generated via `icon.tsx` + `apple-icon.tsx` (Next.js convention).

### Single accent across the suite
`#4f46e5` brand indigo is the single suite accent. Antique gold `#c9a96a` is retired and must not be reintroduced for new work. There is no per-product color identity beyond the shared indigo. Do not introduce one.

### Audience accents (Tasks-specific)
Tasks's audience landing pages each have their own color accent (`/for/freelancers` green, `/for/students` amber, `/for/weddings` rose, `/for/trades` orange, `/for/marketing` indigo). These accents are **scoped to landing pages only** — they do not propagate to suite-shared chrome. If you find yourself reaching for a wedding-rose color in Studio code, stop.

---

## 3 · Suite-shared stack

All four products run the same baseline:

- **Next.js 16** (App Router, Turbopack, RSC-first)
- **React 19**
- **Tailwind v4**
- **Geist** font family (sans + mono)
- **pnpm** (workspaces declared per repo as `packages: - "."`)
- **Vercel** hosting, with subdomain routing under `signalstudio.ie`
- **TypeScript** everywhere, strict mode

Variations by product:
- **Tasks + Timeline + Signal:** Clerk for auth.
- **Tasks + Timeline + Signal:** each owns its **own Turso (libSQL)** database. Signal's DB stores user prefs only — the actual task data it reads comes from Tasks's DB via a read-only token.
- **Timeline:** Stripe for Pro tier; Sentry for error monitoring (with PII scrubbing — see §5).
- **Signal:** Resend for email dispatch.
- **Studio:** public site stays static-ish with one client component (`RevealEngine`) for the motion stack. Private `/hq` uses `SIGNAL_HQ_PASSWORD`, an HTTP-only cookie, localStorage persistence, and JSON export/import.

---

## 4 · How data flows across the suite

The intended cross-product data flow is **Tasks → Signal**. Treat it as a launch claim only after the current Signal repo contains the engine files and the preview proves the briefing path. The contract is:

1. Tasks's Turso DB is the source of truth for task data, project data (mapped from tags — see below), and user-Clerk linkage.
2. Signal has a **read-only Turso token** (`turso db tokens create ... --read-only`, JWT flag `"a":"ro"`). Writes are blocked at the token layer.
3. Signal's `tasksDbSource` (`analytics/src/lib/data/tasks-db-source.ts`) implements the `DataSource` interface against this read-only connection.
4. The briefing pipeline runs: `data → triggers → insights → prose → compression → briefing` and renders to web (`/app`) or email (via Resend).

**Architectural decision worth knowing about:** Tasks does **not** have a `projects` table. Tags-as-projects is the locked mapping. Each unique tag in a workspace = one synthesized `ProjectRead` (slug = tag verbatim, name = title-cased, members = union of assignees on tasks bearing that tag). This was deliberate — adding a `projects` table to Tasks would have violated the anti-configuration positioning per BRAND.md §2.2 ("Configuration tax"). Signal flexes here, not Tasks.

---

## 5 · What's shipped (suite-wide milestones)

Plans are the suite's unit of work. Plans 1–6 are closed. Plan 7 is in flight.

- **Plan 1 — Strategic Foundation.** Locked Signal PRODUCT.md (rules + curated prose, no LLM in v1). Locked Notes PRODUCT.md (one-way Notes→Tasks promotion; never auto-detect todos). Added BRAND.md §2.1–§2.3 (audience archetypes, what fails them, the moat = discipline-sustained-across-suite-over-time).
- **Plan 2 — Visual Ecosystem Coherence.** Notes underline-writes-itself gesture designed. Suite-shared favicon system. Tasks + Timeline navs upgraded to client components with `usePathname` active-state + `<details>/<summary>` mobile menu (parity with Signal).
- **Plan 3 — Timeline Parity Buildout.** Workspace creation form (slug→URL purge, live preview). Editor surface (mechanism-first → outcome-first copy). Public viewer (universalised demo banner, Pro CTA reframed, "iCal" jargon purged). Marketing surface depth (purged "engineering team", "engineers", "front-matter spec", "prefill"). Demo seed data ("Signal Timeline" workspace, "Stakeholders"→"Anyone with an account").
- **Plan 4 — Security + Performance.** Suite-wide HSTS + X-Frame + Permissions-Policy in enforce mode + CSP in **Report-Only** mode (promotion to enforce owed). Sentry PII scrubbing (`beforeSend` + `sendDefaultPii: false`) on all 5 init points across Tasks + Timeline. Orphan-asset purge (~790KB removed from Tasks bundle).
- **Plan 5 — 80% Audience Refinement.** Tasks `DOMAIN_ORDER` reordered (wedding → trades → student → freelance → marketing — service-operators-with-clients lead). Audience landing pages audited (~1000 lines, already strong). Cross-product banned-word catch-net (single real fix: "autonomous demo" → "scripted demo").
- **Plan 6 — Signal MVP.** Architecture + data layer + auth + Tasks DB read + 10 triggers + curated prose with rotation/self/focus variants + compression + web render + email render + Resend dispatch + Vercel daily cron + marketing alignment to shipped reality. Engine end-to-end production-ready.
- **Plan 7 (in flight) — Demo.** 7.1 30s narrative + storyboard locked. 7.2 Remotion scaffold (`~/Projects/personal/analytics-demo/`) + first typography cut rendered (~2.4MB MP4) and embedded at signal-phi-ten.vercel.app/demo.

---

## 6 · What's planned (next on the horizon)

- **Direction C — Daily Signal as page.** Alternative for the Studio umbrella landing: the umbrella IS a Daily Signal briefing. Branch off main, do NOT replace production.
- ~~**Notes scaffolding.**~~ Closed 2026-06-06. Signal Notes is standing at N·21 with: marketing site + animated hero, full notebook (capture / search / long-press tray / promote-to-Tasks / archive), capture-by-email API, account + danger-zone, Clerk-backed sign-in/up, four drizzle migrations (FTS5 search, user prefs, note-extract columns, archived_at), and the canonical SuiteSwitcher pills shipped (N·18) so the chrome reads as suite-coherent. PRODUCT.md remains locked. The brand-locked refusal stands: one-way Notes→Tasks promotion only, never auto-detect todos.
- **Cross-product chrome — top-bar product switcher, shared auth seam.** All four products carry the SuiteSwitcher pills (T·18-equivalent, N·18, R·… , A·…). Remaining: a shared auth seam so Tasks/Timeline/Notes/Signal share session, not four parallel Clerk sessions. That's the real chrome work — name it precisely instead of "deferred until Notes."
- ~~**Audience archetype completion.**~~ Closed 2026-06-06. All 5 of 5 BRAND.md §2.1 archetypes now have dedicated landing pages on Tasks: `/for/freelancers`, `/for/trades`, `/for/students`, `/for/small-business` (operators), `/for/community` (public-facing coordinators). Sitemap and footer Resources column carry all five. Surface complete.
- **Performance pass.** Plan 4 closed pragmatically without browser access. Owed: Lighthouse / Core Web Vitals run against each deployed product, identify Largest Contentful Paint + Cumulative Layout Shift outliers, fix.
- **CSP enforce-mode promotion.** Currently Report-Only across all four products. Promote after browser verification confirms no false-positive blocks.

---

## 7 · What's owed (operator-pending — won't be done by an agent)

These are setup-ish tasks that need a human in the loop because they touch secrets, billing, or third-party admin consoles.

- **`CRON_SECRET` + `RESEND_API_KEY` on Vercel (Signal project).** Sensitive-flagged. Without these, the daily cron handler will return 401 / fail to dispatch email.
- **DKIM completion in Google Workspace Admin Console** for `hello@signalstudio.ie`. Domain verified, alias added; DKIM still pending generation. Once generated, agent can add the DNS record via Vercel API.
- **Live demo seed for Timeline.** `roadmap/scripts/seed-demo.ts` was edited in Plan 3.5 but `npm run seed:demo` against prod Turso has not run — `/tasks` demo workspace on Timeline won't reflect the rewrites until the seed runs.

---

## 8 · Suite-wide locked refusals (cross-cutting)

These apply to *any* product in the suite, not just Studio:

- **No "AI-powered" anything in marketing.** Ambient AI is fine inside engines (Signal's trigger detection is rules-based today; if it ever uses an LLM, it stays unmarketed). Never named in copy. Never themed.
- **No team tier on Timeline.** v1 lock. Solo + Pro only.
- **No private workspaces on Timeline.** Public-by-default is the position.
- **No comment threading on Timeline.** Refused.
- **No public directory of Timeline workspaces.** Refused in v1.
- **No projects table in Tasks.** Tags-as-projects is the locked mapping (per §4 above). Any feature that would require a projects table is a refusal candidate — flex Signal's read model instead.
- **No auto-detect-todos in Notes.** One-way Notes → Tasks promotion only, user-initiated.
- **No demo-vs-reality gap.** Marketing reflects what's shipped. Planned features marked planned.
- **No category-fragmentation visuals** (mascots, robot iconography, 3-adjective hero grids, holographic gradients, glow blooms, generic SaaS hero stock).

---

## 9 · How to think about cross-product work

If you're working on the Studio repo and a request would imply a change in another product's repo, **stop and surface it before doing anything.** Studio is the umbrella — its job is to refer outward. Other products are responsible for their own surfaces.

Examples of work that should escalate, not silently happen:
- Adding a new product to the suite-strip nav (touches all four products).
- Changing a per-product wordmark gesture (touches that product's CSS + Studio's reveal sequence).
- Renaming a product (touches BRAND.md, every product's nav, every footer, DNS, Vercel project name).
- Changing the umbrella domain or any subdomain (DNS + every product's `NEXT_PUBLIC_*_URL` + favicon system).

What's safe to do inside Studio without escalating:
- Copy edits inside Studio that respect AGENTS.md + BRAND.md.
- Visual/motion polish on the Reveal sequence that respects the choreographed timing.
- Adding entries to `CHANGELOG.md`.
- Refactors that don't change observable behavior.

---

## 10 · Tonal note for any output that touches users

When you write copy that ships — even a button label, even an alt text — the question to ask is: **"would a wedding planner, a tradesperson, a freelance designer, or a tutor read this and feel addressed?"** If the answer is no, the line is wrong. The audience definition in BRAND.md §2.1 isn't decoration — it's the test. Every cycle of the suite has been measured against it. Don't drift here.
