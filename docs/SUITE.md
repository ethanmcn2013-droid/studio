# Signal Studio · Suite primer

What this is: a Codex-facing primer on the **Signal Studio suite as a system**. BRAND.md handles voice and visual rules. VISION.md handles strategic intent. AGENTS.md handles workflow. SUITE.md handles **how the four products fit together** — architecture-level, not brand-level.

Read this when you need cross-product context. When working on the Studio (umbrella) repo specifically, this tells you what the umbrella is *referring to* whenever it links out, and what the suite-shared rules are.

---

## 1 · The four products

Each product is a separate Next.js 16 application in its own repo, deploying to its own Vercel project, on its own subdomain. They are not a monorepo. They share no code packages today. They share **brand**, **chrome conventions**, and **a single accent color**.

| Product | Subdomain | Repo (local) | Status | What it does |
|---|---|---|---|---|
| Signal Studio (umbrella) | `signalstudio.ie` | `~/Projects/personal/studio` | Live private preview | Choreographed entrance introducing the suite. No auth, no DB, no CMS. |
| Signal Tasks | `tasks.signalstudio.ie` | `~/Projects/personal/tasks` | Private preview | Task workspace with auth, persistence, audience pages, and cinematic demo in active refinement. |
| Signal Roadmap | `roadmap.signalstudio.ie` | `~/Projects/personal/roadmap` | Private preview | Roadmap workspace, editor, and public viewer in active refinement. Launch claims must be verified against the repo and preview. |
| Signal Analytics | `analytics.signalstudio.ie` | `~/Projects/personal/analytics` | Private preview · product committed | Attention-clarity product. The briefing engine claim must be reconciled with the current repo before marketing says it is live. |
| Signal Notes | `notes.signalstudio.ie` | `~/Projects/personal/notes` | Planned | Capture clarity. PRODUCT.md drafted (`notes/docs/PRODUCT.md`). One-way Notes → Tasks promotion only. Brand-tier added; not yet scaffolded. |

**Launch-claim rule:** GitHub `main` plus the deployed preview is the current source of truth. Do not describe a capability as shipped unless the repo contains it and the preview proves it. Local-only agent work must be pushed, reviewed, and reconciled before it becomes marketing copy.

The Studio repo (this one) is the **smallest and most restrained** of the five. It is a brand surface, not a product. Anything that would turn it into a product (forms, dashboards, interactive widgets) is a refusal candidate — propose, don't build.

---

## 2 · Cross-product chrome (suite-shared conventions)

These rules apply identically across all four products' marketing surfaces.

### Suite-strip nav
A small lowercase strip near the header of every product's marketing pages: `tasks.   roadmap.   analytics.   notes.` — each a link to its product's subdomain. The current product's wordmark renders in the brand indigo + its per-product gesture (see below); the others render dimmed. Notes renders dimmed always until Notes ships.

### Footer
4-column on desktop, cascading down: **Product · Company · Resources · Suite.** Cross-product links live in the Suite column with `↗` external arrows. Attribution always reads "Made by Signal Studio".

### Per-product wordmark gestures (suite-shared mark grammar)
- `tasks·` — dot **pulses** continuously (live signal). CSS class `.tasks-dot`.
- `roadmap·` — dot **slides on mount** then settles (motion toward a destination). CSS class `.roadmap-dot`. Plays once per page load.
- `analytics·` — dot is **static** (ambient presence). Inline-styled, no class. The quietest of the four.
- `notes·` — **underline writes itself** under the word, stops just before the dot, persists. CSS class `.notes-mark`. Lives in `studio/globals.css` since Notes is not yet scaffolded. Plays once on first paint.

All four respect `prefers-reduced-motion`.

### Suite-shared favicon system
Brand-soft tile `#eef2ff` (one family). Per-product letter (t/r/a/s) + accent. Studio's tile uses the antique-gold period; the three live products use indigo dot. Favicon generated via `icon.tsx` + `apple-icon.tsx` (Next.js convention).

### Single accent across the suite
`#c9a96a` warm antique gold — **reserved exclusively for Signal Studio umbrella.** Never on individual products. Each product's accent is `#4f46e5` brand indigo, used sparingly. There is no per-product color identity beyond that. Do not introduce one.

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
- **Tasks + Roadmap + Analytics:** Clerk for auth.
- **Tasks + Roadmap + Analytics:** each owns its **own Turso (libSQL)** database. Analytics's DB stores user prefs only — the actual task data it reads comes from Tasks's DB via a read-only token.
- **Roadmap:** Stripe for Pro tier; Sentry for error monitoring (with PII scrubbing — see §5).
- **Analytics:** Resend for email dispatch.
- **Studio:** none of the above. Static-ish marketing site; one client component (`RevealEngine`) for the motion stack.

---

## 4 · How data flows across the suite

The intended cross-product data flow is **Tasks → Analytics**. Treat it as a launch claim only after the current Analytics repo contains the engine files and the preview proves the briefing path. The contract is:

1. Tasks's Turso DB is the source of truth for task data, project data (mapped from tags — see below), and user-Clerk linkage.
2. Analytics has a **read-only Turso token** (`turso db tokens create ... --read-only`, JWT flag `"a":"ro"`). Writes are blocked at the token layer.
3. Analytics's `tasksDbSource` (`analytics/src/lib/data/tasks-db-source.ts`) implements the `DataSource` interface against this read-only connection.
4. The briefing pipeline runs: `data → triggers → insights → prose → compression → briefing` and renders to web (`/app`) or email (via Resend).

**Architectural decision worth knowing about:** Tasks does **not** have a `projects` table. Tags-as-projects is the locked mapping. Each unique tag in a workspace = one synthesized `ProjectRead` (slug = tag verbatim, name = title-cased, members = union of assignees on tasks bearing that tag). This was deliberate — adding a `projects` table to Tasks would have violated the anti-configuration positioning per BRAND.md §2.2 ("Configuration tax"). Analytics flexes here, not Tasks.

---

## 5 · What's shipped (suite-wide milestones)

Plans are the suite's unit of work. Plans 1–6 are closed. Plan 7 is in flight.

- **Plan 1 — Strategic Foundation.** Locked Analytics PRODUCT.md (rules + curated prose, no LLM in v1). Locked Notes PRODUCT.md (one-way Notes→Tasks promotion; never auto-detect todos). Added BRAND.md §2.1–§2.3 (audience archetypes, what fails them, the moat = discipline-sustained-across-suite-over-time).
- **Plan 2 — Visual Ecosystem Coherence.** Notes underline-writes-itself gesture designed. Suite-shared favicon system. Tasks + Roadmap navs upgraded to client components with `usePathname` active-state + `<details>/<summary>` mobile menu (parity with Analytics).
- **Plan 3 — Roadmap Parity Buildout.** Workspace creation form (slug→URL purge, live preview). Editor surface (mechanism-first → outcome-first copy). Public viewer (universalised demo banner, Pro CTA reframed, "iCal" jargon purged). Marketing surface depth (purged "engineering team", "engineers", "front-matter spec", "prefill"). Demo seed data ("Signal Roadmap" workspace, "Stakeholders"→"Anyone with an account").
- **Plan 4 — Security + Performance.** Suite-wide HSTS + X-Frame + Permissions-Policy in enforce mode + CSP in **Report-Only** mode (promotion to enforce owed). Sentry PII scrubbing (`beforeSend` + `sendDefaultPii: false`) on all 5 init points across Tasks + Roadmap. Orphan-asset purge (~790KB removed from Tasks bundle).
- **Plan 5 — 80% Audience Refinement.** Tasks `DOMAIN_ORDER` reordered (wedding → trades → student → freelance → marketing — service-operators-with-clients lead). Audience landing pages audited (~1000 lines, already strong). Cross-product banned-word catch-net (single real fix: "autonomous demo" → "scripted demo").
- **Plan 6 — Analytics MVP.** Architecture + data layer + auth + Tasks DB read + 10 triggers + curated prose with rotation/self/focus variants + compression + web render + email render + Resend dispatch + Vercel daily cron + marketing alignment to shipped reality. Engine end-to-end production-ready.
- **Plan 7 (in flight) — Demo.** 7.1 30s narrative + storyboard locked. 7.2 Remotion scaffold (`~/Projects/personal/analytics-demo/`) + first typography cut rendered (~2.4MB MP4) and embedded at analytics-phi-ten.vercel.app/demo.

---

## 6 · What's planned (next on the horizon)

- **Direction C — Daily Signal as page.** Alternative for the Studio umbrella landing: the umbrella IS a Daily Signal briefing. Branch off main, do NOT replace production.
- **Notes scaffolding.** Stand the fourth product up. PRODUCT.md is drafted at `~/Projects/personal/notes/docs/PRODUCT.md`. Lock 1 · Cycle 1.2 already closed (one-way Notes→Tasks promotion only; never auto-detect todos).
- **Cross-product chrome — top-bar product switcher, shared auth seam.** Deferred until Notes ships. Studio is currently ahead; chrome work waits for parity.
- **Audience archetype completion.** BRAND.md §2.1 names 5 archetypes; only 3 of 5 have dedicated landing pages on Tasks. Missing: small-business operators (restaurants, shops, clinics, studios) and public-facing coordinators (teachers, school admins, club coaches, community organisers). ~500 lines of brand-coherent writing per page.
- **Performance pass.** Plan 4 closed pragmatically without browser access. Owed: Lighthouse / Core Web Vitals run against each deployed product, identify Largest Contentful Paint + Cumulative Layout Shift outliers, fix.
- **CSP enforce-mode promotion.** Currently Report-Only across all four products. Promote after browser verification confirms no false-positive blocks.

---

## 7 · What's owed (operator-pending — won't be done by an agent)

These are setup-ish tasks that need a human in the loop because they touch secrets, billing, or third-party admin consoles.

- **`CRON_SECRET` + `RESEND_API_KEY` on Vercel (Analytics project).** Sensitive-flagged. Without these, the daily cron handler will return 401 / fail to dispatch email.
- **DKIM completion in Google Workspace Admin Console** for `hello@signalstudio.ie`. Domain verified, alias added; DKIM still pending generation. Once generated, agent can add the DNS record via Vercel API.
- **Live demo seed for Roadmap.** `roadmap/scripts/seed-demo.ts` was edited in Plan 3.5 but `npm run seed:demo` against prod Turso has not run — `/tasks` demo workspace on Roadmap won't reflect the rewrites until the seed runs.

---

## 8 · Suite-wide locked refusals (cross-cutting)

These apply to *any* product in the suite, not just Studio:

- **No "AI-powered" anything in marketing.** Ambient AI is fine inside engines (Analytics's trigger detection is rules-based today; if it ever uses an LLM, it stays unmarketed). Never named in copy. Never themed.
- **No team tier on Roadmap.** v1 lock. Solo + Pro only.
- **No private workspaces on Roadmap.** Public-by-default is the position.
- **No comment threading on Roadmap.** Refused.
- **No public directory of Roadmap workspaces.** Refused in v1.
- **No projects table in Tasks.** Tags-as-projects is the locked mapping (per §4 above). Any feature that would require a projects table is a refusal candidate — flex Analytics's read model instead.
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
