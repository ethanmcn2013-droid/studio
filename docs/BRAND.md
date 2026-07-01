# Signal Studio · Brand Handbook

**Single source of truth for voice, naming, visual register, and audience tone across the Signal Studio suite.**

This document is the reference for every future change to any Signal Studio product. When in doubt, read this first. When this document is wrong, fix it here before fixing the code — drift starts when the handbook lags reality.

---

## 1 · The suite

Signal Studio is the umbrella. Four products live under it.

| Product | Position | Domain | Repo | Status |
|---|---|---|---|---|
| Signal Tasks | Execution clarity | tasks.signalstudio.ie | `~/Projects/personal/tasks` | Private preview |
| Signal Timeline | Direction clarity | timeline.signalstudio.ie | `~/Projects/personal/roadmap` | Private preview |
| Signal | Attention clarity | signal.signalstudio.ie | `~/Projects/personal/analytics` | Private preview · product committed |
| Signal Notes | Capture clarity | notes.signalstudio.ie | `~/Projects/personal/notes` | Private build · product definition locked · full v1 pending |

**Umbrella domain:** signalstudio.ie · **Defensive:** signalhq.ie (301 redirects to signalstudio.ie)

The system: every product is a different *kind* of clarity. Tasks runs the work. Timeline explains the work. Signal surfaces what matters in the work. Notes captures the work as it happens. Each product solves one slice; the suite is the system.

---

## 2 · Operating thesis

| | |
|---|---|
| **Headline** | Project Management for the 80% who don't work in tech. |
| **Operating principle** | Everything important. Nothing distracting. |
| **Audience** | The 80% who don't work in tech — wedding planners, freelance designers, tradespeople, students, small-business owners, teachers. People who need to get work done together without a special vocabulary. |
| **Anti-quotable** | "Modern, simple, beautiful." (or any 3-adjective trio) |
| **Quotable target** | "A briefing, not a dashboard." · "Project management without the project-manager energy." · "Show your work, not your Jira." |

### 2.1 The 80% — who they actually are

The "80% who don't work in tech" is a useful shorthand but a weak audience definition. The sharper picture: Signal Studio is built for the person *the work routes through* in a category that does not call itself an industry.

These are not "small teams" — many of them are one person. They are not "knowledge workers" — most would resent the phrase. They do not "use a tech stack" — they have a phone, a laptop, a notebook, and an inbox. They run real work that has real deadlines, real money attached, and real consequences for missing it. They are not underserved by accident; they are unserved by design, because the entire productivity-software market was built by tech companies for other tech companies and then sold downmarket with the vocabulary unchanged.

Concretely, the 80% includes:

- **Service operators with crews and clients** — wedding planners, event coordinators, trades operators, building contractors, agency owners with three to fifteen people. Their work is project-shaped (with a start, a middle, a deliverable, a settlement) but they have never used the word "project" in a software interface.
- **Solo professionals with concurrent commitments** — freelance designers, copywriters, photographers, consultants, therapists, tutors. Eight to twenty live engagements at once, each at a different stage. Their failure mode is not "low velocity" — it is *forgetting the right thing this week*.
- **Small-business operators with mixed-mode work** — restaurant owners, shop owners, clinic operators, studio owners. Their work is part operations, part people, part sales, all without a status meeting or a manager to surface what is slipping.
- **Public-facing professionals coordinating people who don't work for them** — teachers coordinating staff and parents, school administrators, club coaches, parish coordinators, community organisers. Their hardest job is *visibility into other people's commitments*.
- **Students running multi-stream work** — masters and PhD candidates with research, teaching, and writing in parallel; final-year undergraduates coordinating projects; postgraduate professionals (medicine, law, architecture) carrying study against work.

The unifying job-to-be-done across all of these: **"Tell me what matters today, in words I would use, without making me into a project manager."** Every productivity tool currently on the market answers a different question — usually "give me a place to put everything", which is not what these users asked for and is the reason they end up back in Notes, WhatsApp, and the back of a notebook.

### 2.2 What fails them — why every productivity tool slides off

The 80% have *tried* productivity tools. They have signed up for Notion, Trello, ClickUp, Monday, Asana, Todoist. They have churned. The standard product narrative ("they didn't onboard well", "feature gap", "wrong pricing") is wrong — or at best, surface-level. The actual failure modes:

1. **Vocabulary alienation.** "Sprint", "epic", "kanban", "stakeholder", "OKR", "burndown". The user is asked to learn a foreign language to operate the tool. The 80% will not. They will close the tab.
2. **Configuration tax.** The first session is "set up your workspace": create a project, define statuses, build a board, decide on tags, import templates. The 80% have not done the work yet — they are being asked to *describe* the work in a structured language before they can begin. The tool fails before its value can show.
3. **Surface bloat.** Three sidebars, four views, a settings panel with twelve sections. The 80% read this as "this is not for me; this is for someone whose job is using software." They are correct.
4. **Ambient project-manager voice.** "Velocity is down 14%". "Sprint health: at risk". The system speaks to a project manager. The 80% are not project managers and do not want to be addressed as one.
5. **Demo-vs-reality gap.** The demo shows a beautifully populated workspace. The user signs up to an empty one. The labour to get from empty to demo-shaped is the labour they were trying to avoid by buying the tool.

**The brand position against this:** Signal Studio's products start usable on first paint, in plain English, with no setup. The 80% do not need to learn Signal Studio — Signal Studio learned them.

### 2.3 The moat — discipline, not feature

A reasonable critique of the position above: any incumbent could ship a "Plain English Mode". Notion could remove jargon. Asana could simplify onboarding. None of this requires technology that does not exist.

That critique would be right if the moat were features. It isn't.

The moat is **disciplined refusal sustained across a suite of products over time.** Specifically:

- **Voice discipline.** Every page, every empty state, every error message, every email passes through one register (BRAND.md §3). Drift is treated as a problem. An incumbent cannot retrofit this without alienating their existing power-user audience, who are paying for the jargon.
- **Refusal discipline.** Each product publishes its locked refusals (`PRODUCT.md` §7). Notion cannot refuse to be a wiki; it *is* a wiki. Asana cannot refuse to surface metrics; metrics are its conversion bait. Signal Studio's refusals compound — every "no" deepens the brand and shrinks the surface area, the inverse of standard SaaS timeline dynamics.
- **Visual restraint.** One accent color across the suite. One per-product gesture. No category-colour fragmentation. No mascots. No 3-adjective hero grids. Boring on purpose. The rules are in BRAND.md §5 and they are easier to copy than to *sustain* against the gravitational pull of "let's just ship a chart".
- **Suite coherence as a single product surface.** Tasks, Timeline, Signal, Notes are four products that read as one. Cross-product chrome is consistent (BRAND.md §6). An incumbent attacking one of these has to attack all four, against a brand that has been speaking with one voice while they did so.
- **Audience-first scoping over feature-first scoping.** Every cycle asks "would a wedding planner / freelance designer / tradesperson use this?" first, and "would it look good in a comparison table" never. This sounds soft. It is the most load-bearing discipline of all because it is the one most easily abandoned under growth pressure.

**The honest dissent inside this position:** discipline moats are real but slower than feature moats. There will be cycles where Signal Studio looks "behind" because an incumbent shipped a feature that Signal Studio refused to ship. That is the moat working, not failing. The metric to watch is *unprompted user language* — when a user says back to us "this isn't a dashboard" or "this doesn't talk like Jira", the moat is paying out. When users start using the incumbents' vocabulary to describe Signal Studio, the moat has been breached.

---

## 3 · Voice — Stark+Jobs

### Cadence
- **Declarative.** Periods, not colons or em-dashes. Make claims. End them.
- **Plain English at ~7th-grade reading level.** Not childish — clean.
- **Verbs over nouns.** Active over passive.
- **Concrete over abstract.** "See your week" beats "Visualize temporal data."
- **No exclamation marks.** Anywhere. Confidence doesn't shout.
- **Universal examples.** A wedding planner, a freelancer, a tradesperson, a student. Not "engineering teams."

### Banned words and phrases

These never appear in body copy, headings, or marketing:

**AI-marketing register**
- AI · AI-powered · AI-aware · machine learning
- intelligent (when describing the system) · smart (when describing the system)
- copilot · agent · assistant
- moves itself · thinks · knows · decides · predicts · recommends · autonomous
- automatically (when implying decision-making — "auto-saves" is fine, "automatically prioritizes" is not)

**SaaS-marketing fluff**
- best-in-class · world-class · industry-leading · cutting-edge
- seamless · turnkey · robust · enterprise-grade
- transform · revolutionize · reimagine · unleash · supercharge
- pleasure · delight (when describing UX)
- synergy · leverage (as a verb)
- 3-adjective trios in any order

**PM jargon**
- epic · sprint · story · story point · burndown · burn rate · backlog grooming
- stakeholder · MVP (in body copy) · "blocker" in the agile sense (Timeline uses "blocker" in its plain-English public-timeline meaning — that's different and stays)
- Kanban · Scrum · Agile (capitalized as method names)

**Tech jargon on user-facing pages** (security/docs pages can carry technical terms)
- API · webhook · endpoint · schema · OAuth · JWT · SSO · SAML
- deploy · build · CI/CD · repo · branch · PR · merge · pull request · commit
- WebSocket (use "real-time" instead) · integration (use "connect" or "works with")

### Cadence words (use these)
- clarity · noise · signal · briefing · attention · plan · view · share · ship
- morning · cycle · cadence · view · live · plain English

### Emotional intelligence in copy
Not "Task overdue." but "This may need attention."
Not "Low productivity detected." but "Work has slowed down this week."
Not "AI nudges." but "Daily nudges" or "Cards that ask for attention."

---

## 4 · Naming conventions

### Product naming
- **Full form (in marketing copy, footer suite, cross-product nav):** `Signal Tasks`, `Signal Timeline`, `Signal`, `Signal Notes`.
- **Wordmark form (in each product's own header/logo):** lowercase `tasks.`, `timeline.`, `signal.`, `notes.` - each with its own indigo gesture inside one shared mark grammar:
  - `tasks.` - dot **pulses** (live signal). `.tasks-dot` in CSS. Continuous.
  - `timeline.` - dot **slides** (motion toward a destination, settles). `.roadmap-dot` in CSS until the asset/class migration lands.
  - `signal.` - dot **ticks** (sampled, ~3.6s steps). Inline-styled until the asset/class migration lands.
  - `notes.` - **caret** (input, ~1.1s sharp on/off). A held cursor: there, then gone, then there.
  - All five respect `prefers-reduced-motion`.
- **Conversational form (within the product itself):** drop "Signal" except for the Signal product, where the product name is already singular.
- **Never:** "the Tasks app" · "our task manager" · "the suite of products" (use "Signal Studio").

### Umbrella naming
- **Full form:** `Signal Studio` (capital S, capital S).
- **Wordmark form:** lowercase `signal studio.` with indigo period.
- **Cross-product nav prefix:** lowercase `signal studio.` (consistent across all four products).
- **Never:** use "Signal" as shorthand for the company. In body copy it means the product, not the umbrella.

### Email
Single canonical address: **`hello@signalstudio.ie`**. Not `contact@`, not `support@`, not `team@`.

### URLs
- Production: `*.signalstudio.ie` subdomain per product (apex is the umbrella).
- Vercel default URLs (`*.vercel.app`) are fallbacks only — never link to them in marketing.

---

## 5 · Visual register

### Reference register
- **Aspire to:** Apple, Linear, Arc, Notion Calendar, Raycast.
- **Avoid:** Jira, Monday, Tableau, PowerBI, Salesforce.

### Color
- **Brand indigo:** `#4f46e5` (`--brand` / `--accent` / `--indigo-600`). Used as the single accent across umbrella and products — the brand. Differentiation comes from gesture (§4), not colour.
- **Antique gold:** `#c9a96a` — **retired 2026-05-11.** Was previously reserved for the Signal Studio umbrella; do not reintroduce it for new work.
- **Background:** paper `#ffffff` (`--paper` / `--bg`) with `#fafafa` and `#f4f4f5` for recessed surfaces. Hairlines do the work shadows would.
- **Status palette:** shipped `#10b981` · in-progress / flight `#f59e0b` · blocked `#ef4444` · next / todo `#6366f1`.

### Banned visuals
- Purple gradients (specifically `rgba(124, 92, 255, ...)` and `#7c5cff`). The historical Tasks accent was purple-leaning; that's been purged. Don't reintroduce.
- AI-generic aesthetics: holographic gradients, robot iconography, glow blooms.
- 3-adjective marketing video grid layouts (the "feature × icon × verb" SaaS pattern).
- Generic SaaS hero photography or stock illustrations.

### Typography
- **Geist Sans** for everything except mono.
- **Geist Mono** for eyebrows, timestamps, status labels, version stamps, code.
- **Display headings:** `--fs-display`, letter-spacing `-0.045em`, line-height `0.96`, weight 600.
- **Title headings:** `--fs-title`, letter-spacing `-0.035em`, line-height `1.04`, weight 600.
- **Section headings:** `--fs-section`, letter-spacing `-0.03em`, line-height `1.08`, weight 600.
- **Eyebrows:** 11px, mono, uppercase, letter-spacing `0.14em`, weight 600, color `var(--ink-quiet)`.
- **Body marketing:** 17px, color `var(--ink-soft)`, line-height `1.55`.
- **Mono labels:** 11px tabular, letter-spacing `0.02em`, color `var(--ink-quiet)`.

### Motion
Sparingly. Rise stagger on hero entries (`0.6s`, 60ms stagger). Subtle fade between sections. Cinematic demo on Tasks's homepage is the brand-feature; everything else is restrained.

`prefers-reduced-motion` is respected everywhere via `useReducedMotion()`.

---

## 6 · Page-level conventions

### Hero pattern (every product homepage)
```
EYEBROW (mono, uppercase, tracked): Signal [Product] · [Position] clarity
H1 (display): Project Management for the 80% who don't work in tech.
SUB (body marketing, 2 lines max): [product-specific value statement]
CTA primary: Open the [product]
CTA secondary: [product-specific deeper link]
```

The H1 is the umbrella headline on every product. The eyebrow + sub do the differentiation work.

### CTA verbs
Standardize on `Open the [product]` for the primary hero CTA:
- Tasks: `Open the workspace`
- Timeline: `Open the timeline`
- Signal: `Open the briefing`
- Notes (planned): `Open the notebook`

### Footer columns
4-column on desktop, cascading down: Product · Company · Resources · Suite. Cross-product links live in the Suite column with `↗` external arrows.

### 6.6 - Locked operating vocabulary (updated 2026-06-29)

How Signal Studio talks about its own work. Plain English. No project-management theatre. The vocabulary is shared across HQ, agent briefs, planning docs, handoffs, and current operating records.

**The spine.** Initiative -> Project -> Cycle -> Task -> Step.

| word | what it names | replaces | example |
|---|---|---|---|
| **Initiative** | a named phase of build, deployment, or operating change | phase / program / workstream | "Initiative 02 - Visible Copy" |
| **Project** | a meaningful body of work with an outcome | epic / major ticket / work package | "the public Timeline project" |
| **Cycle** | a focused time-box or implementation pass inside a project | sprint / iteration | "Cycle 03 closes the invite path" |
| **Task** | one owned unit of work | ticket / story / chore | "add the operator to-do task" |
| **Step** | one ordered action inside a task | subtask / checklist item | "Step 2: update the CTA" |
| **Queue** | ordered work waiting for attention | backlog | "founder approval queue" |
| **Finding** | a review or audit observation | issue | "P1 finding" |
| **Problem** | something broken or harmful | bug | "checkout problem" |
| **Risk** | a known threat to outcome, trust, cost, or timing | blocker / concern | "legal naming risk" |
| **Decision** | a choice that changes direction or constraints | call / ruling | "rename Timeline and Signal" |
| **Record** | durable memory of a decision, finding, review, or release | log / artifact | "decision record" |
| **Release** | something made available | deployment / shipment | "June release" |
| **Review** | structured look-back or quality pass | retro / post-mortem | "launch review" |
| **Owner** | the person accountable for completion | assignee / stakeholder | "owner: Ethan" |
| **Status** | the current state of work | state / stage | "status: in progress" |

**Default replacements.** Epic -> Project. Sprint -> Cycle. Ticket -> Task. Bug -> Problem. Backlog -> Queue. Issue board -> Findings list. Roadmap -> Timeline. Analytics -> Signal.

**Use the old words only when one of these is true:**

- The word appears in a deliberate refusal list that names what Signal Studio does not speak.
- The word is part of a stable route, package name, database field, repo folder, generated asset name, or external integration.
- The word is in historical changelog text, old commits, or archived records.
- The word is the normal term in a security, legal, or standards context and replacing it would reduce clarity.

Current work uses the locked vocabulary. Historical entries are not rewritten just to make the past look tidy.

### "What this isn't" pattern
On every product's `/about` (or homepage anti-features section):
```
Not a [common-thing-people-confuse-it-with]. [Why that's wrong, plain English.]
Not [generic-marketing-claim]. [Why that's wrong.]
Not [enterprise-thing]. [Plain-English alternative.]
```

This pattern is load-bearing — it sets the brand against the comparable category in two sentences.

---

## 7 · Audience accents

Each Tasks audience landing page has its own color accent. Tokens:
- `--aud-marketing: #4f46e5` (indigo)
- `--aud-freelance: #16a34a` (green)
- `--aud-student: #eab308` (amber)
- `--aud-wedding: #be185d` (rose)
- `--aud-trades: #ea580c` (orange)

Soft-tone companion: `--aud-[name]-soft = color-mix(in srgb, var(--aud-[name]) 10%, transparent)`.

---

## 8 · Operating constraints

- **Show HN is no longer scope.** Removed 2026-05-08. No launch dates.
- **Build until it's right.** No fixed go-live. Each product, page, and feature ships when it's right — not when a calendar says.
- **Voice rules apply at every layer.** Body copy, alt text, OG cards, error messages, empty states, sign-in flows, email forwarders, terminal output that ships to users.

---

## 9 · How to use this document

1. **Before writing new marketing copy** — read sections 3 and 4.
2. **Before adding new visual elements** — read section 5.
3. **Before naming a new feature or product** — read section 4.
4. **Before adding cross-product navigation** — read section 6.
5. **When you find this document is wrong** — fix it here first, then fix the code.

When agents (or future-Ethan) ask "what's the Signal Studio voice?" — point them here.

---

## 10 · Living document — recent decisions

- **2026-05-09:** Suite hero alignment landed. All three live products (Tasks, Timeline, Signal) lead with the umbrella H1 "Cut through the noise." Product differentiation lives in eyebrow + sub.
- **2026-05-09:** Notes added as 4th product. Position: capture clarity. Not yet scaffolded.
- **2026-05-09:** signalstudio.ie domain connected via Vercel DNS delegation. signalhq.ie reserved as defensive registration; will 301 to signalstudio.ie post-cutover.
- **2026-05-09:** Tasks Cycle N+1 polish shipped 24 fixes including purple-gradient purge, AI-implication copy purge, PM-jargon purge across 12 files. Token discipline raised from C to B.
- **2026-05-09:** Plan 1 (Strategic Foundation) closed. Cycle 1.1 → `analytics/docs/PRODUCT.md` locked (briefing mechanism = rules + curated prose library, no LLM in v1). Cycle 1.2 → `notes/docs/PRODUCT.md` locked (one-way Notes→Tasks promotion only; never auto-detect todos). Cycle 1.3 → BRAND.md §2.1–§2.3 added (the 80%, what fails them, the moat = discipline-sustained-across-suite-over-time, not feature). The moat-watch metric: unprompted user language. Brief paying out when users describe Signal Studio in our register; breached when they describe it in incumbents'.
- **2026-05-09:** Plan 2 · Cycle 2.1 (Per-product wordmark gestures) shipped. Notes "underline-writes-itself" gesture designed in `studio/src/app/globals.css` as `.notes-mark` and applied in `studio/src/components/landing/products-grid.tsx` (NotesWordmark replaces prior static-dot variant). Tasks pulse / Timeline slide-on-mount / Signal static dot verified intact. `notes-mark` deliberately not applied in suite-strip nav at 11px (gesture too small to read; lives where Notes has visual weight). BRAND.md §4 gesture enumeration updated to source-of-truth. Carry-forward `/method` copy edits applied in signal: "patterns it recognises" → "patterns we built in"; added "Today the Engine reads from your Signal Tasks workspace; other sources will be added when they earn it."
- **2026-05-09:** Plan 2 · Cycle 2.2 (Chrome unification + favicon system) shipped. Six favicon files created (`icon.tsx` + `apple-icon.tsx` for timeline, signal, studio) modeled on Tasks's existing pattern. Suite-shared brand-soft tile `#eef2ff` for the family read; product-specific letter (r/a/s) + accent (indigo dot for products, gold period for Studio umbrella). Tasks and Timeline nav components converted to client components and brought to behavior parity with Signal: `usePathname` active-state on desktop nav, native `<details>/<summary>` mobile menu pattern. Cost: ~2KB JS bundle on Tasks/Timeline nav (was server-rendered). Benefit: brand-coherent active state and mobile menu across all three product navs. All four projects typecheck clean. Plan 2 closed.
- **2026-05-09:** Plan 3 · Cycle 3.1 (Workspace creation flow — Timeline polish) shipped. Found that Timeline already had a working CreateWorkspaceForm + server action — Plan 3.1 became a brand-coherence polish, not a build. Replaced "slug" terminology with "URL" throughout the form + server-action error messages (slug is banned tech jargon for the 80% per BRAND.md §3). Added live URL preview that shows `timeline.signalstudio.ie/<slug>` in mono as the user types, with placeholder italic state when empty. Reframed sub-copy from "Pick a slug — it's the URL where your timeline lives publicly" to "Your timeline gets a URL. Pick a name and an address you can share." Submit button "Create workspace" → "Create it". Added quiet footer hint "Next: add a project. You can change the name later." closing the loop on what comes after creation. Timeline typechecks clean.
- **2026-05-09:** Plan 3 · Cycle 3.2 (Timeline editor surface — polish) shipped. Six voice fixes across page.tsx + source-editor.tsx: page sub-heading "Markdown source" → "Write your timeline. Save. Share." (was redundant with breadcrumb + jargon-coded). Toolbar button "Insert example markdown" → "Show an example". Pending button "Parsing…" → "Saving…". Confirm dialog "your current source" → "what you have". Status copy "X items parsed" → "X items in your timeline"; "No items found. Check your markdown headings and bullet syntax." → "Nothing here yet. Use # for headings and - for items." Default placeholder copy from "Paste your timeline markdown" → "Write your timeline below". The technical reality is markdown — the editor still teaches the syntax via placeholder + example button — but every user-facing string moved from mechanism-first to outcome-first. Timeline typechecks clean.
- **2026-05-09:** Plan 3 · Cycle 3.3 (Public viewer polish) shipped. Tight pass — both public pages already well-shaped. Workspace page: demo banner copy "your team's timeline" → "your timeline" (universalised — the 80% audience includes solo operators); metadata description prefers `workspace.description`, falls back to "Where {name} is going. The public timeline." (was generic "Public timeline for X"). Workspace + project page: Pro-gated calendar CTA reframed from "Pro: subscribe in calendar" / title "Upgrade to Pro for iCal" → "Subscribe in calendar (Pro)" / title "Pro plan adds calendar subscriptions". Action leads, gate-marker is parenthetical; "iCal" jargon purged. 4 occurrences replaced across desktop + mobile rails. Timeline typechecks clean.
- **2026-05-09:** Plan 3 · Cycle 3.4 (Marketing surface depth) shipped. 5 string fixes across 3 of 5 marketing pages — tight surgical pass, not wholesale rewrites. About: anti-feature 03 "Not for your engineering team" → "Not for the people building it" + note "Your engineers already know what's happening" → "The people doing the work already know what's happening" (purged BRAND.md §3 explicit ban on "engineering teams" / "engineers" while preserving the audience-vs-makers distinction the section was making). Pricing: Free tier feature "Markdown source editor" → "Markdown editor" (jargon purge); migration FAQ "Timeline's source format is Markdown with a lightweight front-matter spec" → "Timeline reads plain markdown with a lightweight tag for dates" (front-matter spec is unhelpful jargon for the 80% audience asking the migration question). Templates: "Create a project with no prefill" → "Create a project with no template" (prefill is dev-jargon). Security page deliberately untouched — security/docs pages get jargon exemption per BRAND.md §3. Changelog deliberately untouched — craft artifact with strong distinctive voice; per saved feedback, changelog entries should read with personality, not procedural minutes. Timeline typecheck clean.
- **2026-05-09:** Plan 3 · Cycle 3.5 (Demo workspace seed data) shipped. Plan 3 CLOSED. Polished `scripts/seed-demo.ts`. Workspace name "studio. shipping log" → "Signal Timeline" (was outdated brand variant; aligns to BRAND.md). Description added "Timeline, eating its own cooking" hook. 5 of 7 demo items rewritten for plain English while preserving the "Timeline building Timeline" authenticity: item 4 purges banned word "Stakeholders" → "Anyone with an account"; item 5 title "Composite-PK multi-tenancy" → "Project names no longer collide across workspaces" (mechanism-first → outcome-first); item 6 brand reference "studio." → "Signal Studio"; items 2 + 3 had lighter jargon-trimming ("screenshot infra" → "way to capture the screenshot", "self-serve" → "open sign-ups"). The 80% audience can now read the demo and grasp structure + voice even though subject matter remains software. Source edited but seed NOT run against prod — live demo at /tasks won't reflect changes until `npm run seed:demo` runs against prod Turso. Timeline typecheck clean. Plan 3 fully closed.
- **2026-05-09:** Plan 4 · Cycle 4.1 (Suite-wide CSP + middleware) shipped. Security baseline added to all four product `next.config.ts` files. Two-tier shipping strategy: (a) standard headers in enforce mode — HSTS (`max-age=63072000; includeSubDomains; preload`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`; (b) Content-Security-Policy in **Report-Only** mode — logs violations to console without blocking, allowing a verification pass before promoting to enforce mode. Per-product CSP allowlists tailored: Tasks/Timeline = full allowlist (Clerk + Stripe + Sentry + Vercel Analytics + Turso); Signal = narrower (Clerk + Vercel Analytics only); Studio = most restrictive (Vercel Analytics only — no auth, no payments). Implementation via `next.config.ts` `headers()` (NOT proxy.ts middleware) — preserves static rendering / ISR / PPR per Next 16 docs. All 4 projects typecheck clean. Timeline correctly wraps in `withSentryConfig`. Promotion to enforce mode owed in a follow-up turn after browser verification.
- **2026-05-09:** Plan 4 · Cycle 4.2 (Sentry PII scrubbing) shipped. `beforeSend` scrubber + `sendDefaultPii: false` added to all 5 Sentry init points across Tasks (instrumentation.ts nodejs+edge, instrumentation-client.ts) + Timeline (sentry.server/client/edge.config.ts). What it strips: user reduced to `{id}` only (opaque Clerk userId); request.cookies + request.data + request.query_string deleted; sensitive headers filtered (cookie, authorization, x-clerk-*, stripe-signature, svix-*, x-forwarded-for, x-real-ip); breadcrumbs to clerk/stripe/api/webhooks endpoints dropped. Timeline factored shared scrubber to `src/lib/sentry-scrub.ts` (3 callsites); Tasks inlined the scrubber in each of 2 instrumentation files (consistency-with-product matters more than DRY-within-product). First-pass typed via custom interface — TypeScript caught the type mismatch with Sentry's actual `User.id: string | number` and `ErrorEvent` discriminator; refactored to use `import type { ErrorEvent } from "@sentry/nextjs"` directly. Both repos typecheck clean.
- **2026-05-09:** Plan 4 · Cycle 4.3 (Performance pass) shipped. Plan 4 CLOSED. Static-analysis pass (no browser/Lighthouse available this session). **Audit findings:** font loading already optimal across all 4 products (next/font/google for Geist + Geist_Mono — best practice). Image usage minimal: only Timeline uses `next/image` (proof-workspace.png, already optimized). **Real wins shipped — orphaned-asset purge:** Tasks/public lost `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` (default Next.js template SVGs, 0 references in app code) + `hero-loop.30s.mp4` (786KB, 0 references in TSX — was referenced only in changelog/docs as historical artifact). Studio/public lost the same 5 default SVGs. Total: ~790KB removed from Tasks production bundle, ~3KB from Studio. **Honest scope acknowledgement:** the deeper Lighthouse-driven work (Core Web Vitals, runtime perf, bundle analyzer) requires browser-based measurement that wasn't available this session. Owed: Ethan to run `npx @lhci/cli autorun` or similar against each deployed product, identify Largest Contentful Paint / Cumulative Layout Shift outliers, and surface specific regressions for fix. Plan 4 closed pragmatically — Cycle 4.3 shipped what was measurable without a browser. Both Tasks + Studio typecheck clean.
- **2026-05-09:** Plan 5 · Cycle 5.1 (Tasks first-touch onboarding fixes) shipped. Single high-leverage edit: reordered `DOMAIN_ORDER` in `tasks/src/lib/domains.ts` from `[marketing, student, freelance, wedding, trades]` → `[wedding, trades, student, freelance, marketing]`. Drives display sequence in 5 surfaces (welcome picker, empty-state overlay, settings, marketing about-manifesto, marketing domain-toggle). Order now reflects BRAND.md §2.1 audience priority — service operators with clients/crews first (wedding, trades), universal life-stage second (student), solo professionals third (freelance), tech-team-coded last (marketing). First-time visitor on /welcome now sees "Wedding planner" as the leading option instead of "Marketing" — actively delivers on the 80% audience promise. Tasks typecheck clean. **Honest scope decision:** the freelance pack content remains dev-coded ("Stripe webhook fix", "Auth rebuild") — broadening it to also fit designers/copywriters/photographers per BRAND.md §2.1 is a content rewrite, not a polish; flagged for separate cycle if/when warranted. Marketing pack content also still uses some banned words ("Sprint planning · Q3 themes") — same scope-call rationale.
- **2026-05-09:** Plan 5 · Cycle 5.2 (Audience landing pages deeper) shipped. Audited all 4 landing pages (`/for/freelancers`, `/for/students`, `/for/trades`, `/for/weddings`) — total ~1000 lines of brand-coherent content, already strong at depth (anti-feature callouts like "no sprint vocabulary", concrete pricing per audience, two-template patterns, "honest math" sections). One real miss surfaced: `for-trades.tsx` had "your wife who handles QuickBooks" — gendered without role-specific reason. Replaced with "the partner who handles QuickBooks". Other grep hits (sprint/epic) were all deliberate anti-feature callouts or plain-English usage ("Final paper sprint" = the running-sprint sense), correctly on-brand. Tasks typecheck clean. **Important strategic gap surfaced (NOT addressed in this polish cycle):** BRAND.md §2.1 names 5 audience archetypes; only 3 of 5 have dedicated landing pages. Missing: (a) **Small-business operators** (restaurant owners, shop owners, clinic operators, studio owners), (b) **Public-facing coordinators** (teachers, school admins, club coaches, parish coordinators, community organisers). Building these is ~500 lines of new brand-coherent writing per page and is a positioning + content decision worth Ethan's deliberate call before scaffolding.
- **2026-05-09:** Plan 5 · Cycle 5.3 (Cross-product copy consistency pass) shipped. Plan 5 CLOSED. Catch-net audit across all 4 products' user-facing TSX for BRAND.md §3 banned words: SaaS-fluff (seamless/robust/turnkey/transform/etc), AI-marketing (AI-powered/intelligent/copilot/autonomous/etc), PM-jargon (sprint/epic/stakeholder/burndown), tech-jargon (OAuth/JWT/SAML/WebSocket). The audit was remarkably clean — almost all grep hits were CSS `transform:` properties, third-party feature names ("Google Docs smart chip"), security/legal-page exempt usage, or *deliberate anti-feature callouts* (manifesto explicitly citing "AI-powered" as banned, for-trades saying "no sprint vocabulary"). **Single real miss across all 4 products:** `tasks/src/lib/domains.ts:28` code comment used "autonomous demo's typing scene" → fixed to "scripted demo's typing scene" (more accurate to the demo behavior anyway, and prevents the banned word from drifting into team vocabulary even in code comments). The thoroughness of Plans 1-4 + 5.1+5.2 means Cycle 5.3 caught very little — that's the correct outcome for a catch-net pass. Tasks typecheck clean. Plan 5 fully closed.
- **2026-05-10:** Plan 6 · Cycle 6.3 (First data-source integration) shipped. `tasksDbSource` implemented against the real Signal Tasks Turso DB (`ethanmcnamara-tasks`) with a read-only Turso token (`turso db tokens create ... --read-only` — verified writes blocked at token layer with "a":"ro" JWT flag). Architectural decision locked: **tag-as-project** mapping. Pushed back against adding a `projects` table to Tasks's schema — would have violated the anti-configuration positioning per §2.2 ("Configuration tax"), forced ~3 weeks of UI rebuild across every Tasks surface, and required existing users to migrate tags into a new abstraction. The product that flexes here is Signal, not Tasks. PRODUCT.md §6 extended with "How Tasks data maps to Signal's read model" sub-section documenting the rule: each unique tag in a workspace = one synthesized ProjectRead; `slug` = tag verbatim; `name` = title-cased; `members` = union of assignees on tasks bearing the tag; multi-tag tasks belong to multiple projects (`TaskRead.projectSlugs: string[]`); untagged tasks excluded from project-scoped triggers but still feed workspace-level signals. The `dataSource` const env-gates: prod with `TASKS_DATABASE_URL` uses real source; dev fallback uses mock so the marketing build still runs offline. **Data-state finding worth holding into 6.4:** Tasks DB currently has only the legacy seed workspace + zero clerk-linked users — `listForUser(clerkId)` returns `[]` until Ethan signs into Tasks via the shared Tasks (Dev) Clerk app to populate `users.clerk_id`. Lane vocabulary in real data includes `"todo"` (not in Signal's Status enum) — defensive `mapLaneToStatus` coerces to `"next"`; Cycle 6.4 to canonicalize.
- **2026-05-10:** Plan 6 · Cycle 6.2 (Auth + onboarding) shipped. First real BUILD cycle of Plan 6 (6.1 was scaffold). Clerk wired fully on Signal — `src/proxy.ts` modeled on timeline pattern (graceful dev bypass, public-route matcher), `ClerkProvider` conditional in root layout, real `<SignIn />`/`<SignUp />` catch-all routes with branded appearance. Signal now owns its OWN tiny Turso DB (`analytics_users` table) — separate from the Tasks DB it'll read from in 6.3. `dataSource` const at `src/lib/data/source.ts` is the swap point (currently `mockSource` with parameterized `listForUser()`; 6.3 swaps to `tasksDbSource` as a one-line change). Onboarding flow at `/app/onboarding` is auto-detect-with-override: 0 candidates → empty state pointing to Tasks; 1 → pre-selected confirm; >1 → radio picker. Browser TZ captured at onboarding via `Intl.DateTimeFormat().resolvedOptions().timeZone` — resolves PRODUCT.md §11 q1. Marketing routes moved into `(marketing)/` route group so `/app` has its own thin chrome (wordmark + UserButton). CSP allowlist extended for Turso (`https://*.turso.io` + `wss://*.turso.io`) + Clerk avatar host. Owed setup before /app works in prod: `CLERK_*` env vars + provision separate Turso DB + run `npm run db:push`.
- **2026-05-09:** Plan 6 · Cycle 6.1 (Architecture + data layer) shipped. First real BUILD scaffold of the cycle session. Created `analytics/src/lib/{data,triggers,prose,compression,briefing}/` directory tree with type contracts that 6.2–6.5 will implement against. Files: `data/types.ts` (WorkRead, TaskRead, ProjectRead, ActivityEvent — read-model mirror of Tasks's schema, no PII); `data/source.ts` (DataSource interface + mockSource placeholder until 6.3 wires Tasks DB); `triggers/types.ts` (Trigger contract + Insight type with rank weights — cascade × irreversibility × proximity per PRODUCT.md §5.3); `triggers/index.ts` (empty TRIGGERS registry — 6.4 populates with 10 detectors); `prose/types.ts` (Phrasing template + renderPhrasing slot-filler — `${var}` syntax, no LLM); `prose/index.ts` (empty PROSE_LIBRARIES registry — 6.4 populates with 4–8 phrasings per trigger); `compression/types.ts` (BriefingItem, BriefingBlock, BLOCK_CAP=3 hard cap, BLOCK_ORDER fixed, BLOCK_META with locked dot colors); `compression/compress.ts` (rank + cap + drop; Suggested Focus left as stub for 6.4); `briefing/types.ts` (Briefing artifact + WORD_CAP per cadence — 350/900/1200 hard caps from PRODUCT.md §4); `briefing/build.ts` (orchestrator pipeline data → triggers → insights → prose → compression → briefing; soft word-cap assertion logs warnings). Signal typecheck clean. **Locks delivered against PRODUCT.md sections:** §4 (4 blocks fixed order + word caps), §5.1 (10 trigger ids enumerated), §5.2 + §9 (no LLM in path; phrasing rotation), §5.3 (rank weights + hard cap + silent drop), §6 (read-model shape). Cycle 6.2–6.6 fill the implementation against these contracts.
