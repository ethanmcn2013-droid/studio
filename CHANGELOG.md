# signal studio. — changelog

Process notes for the umbrella. The four products keep their own logs;
this one tracks what coalesced across the suite.

## 2026-05-14 · Entitlements sprint · One DB, every product, real checkout

The suite stops pretending. Until today the pricing page promised
features only Tasks actually enforced — Roadmap, Analytics, and Notes
were paid-tier-blind, and Studio's `getEntitlement` lived as dead
code. That whole gap closed.

**Shared DB.** A new `signal-entitlements` Turso DB became the
canonical store, with sponsors / license_codes / entitlements /
redemptions / processed_webhooks tables. All five product repos
read from it via a copy-pasted `entitlements-shared` module (no
monorepo); Tasks's Stripe webhook + comp redemption mirror-write to
it; the `issue-codes.ts` pipeline now dual-writes audit rows.
Studio's HQ `/hq/partners` page was repointed to read from shared
so any future writer propagates.

**Cross-product checkout.** Umbrella `/pricing` CTAs deep-link to
`tasks.signalstudio.ie/api/checkout?tier=workspace|event`. Tasks
owns the Stripe wiring; the resulting entitlement appears in the
shared DB on webhook success and every product sees it on the next
`resolveEntitlement` call. A `?status=checkout-offline` banner
renders on `/pricing` if Stripe envs aren't yet set in production,
so the umbrella never silently grants free upgrades during the
configuration window.

**Operator surfaces.** Two new endpoints on Studio for support /
pilot ops: `POST /api/internal/entitlements/grant` and `/expire`
(Bearer `STUDIO_OPS_SECRET`). A new HQ admin page at
`/hq/entitlements` provides the same surface as a UI inside the
cookie-gated dashboard — list active grants, grant a new one,
expire by source-ref. Off-Stripe grants carry `origin: studio-ops`
or `origin: studio-hq` in metadata for audit grep.

**Hardening.** A daily reconcile sweep piggybacks on Tasks's
existing digest cron — walks all local entitlements and asks the
shared writer to mirror anything missing, idempotently.
`writeSharedEntitlement` retries transient errors with backoff.
The Stripe webhook now mirrors its dedup row into shared
`processed_webhooks` so any future writer can short-circuit on the
same event id.

**Operator docs.** Three runbooks committed: `tasks/docs/STRIPE_SETUP.md`
(price IDs + webhook + envs), `notes/docs/INBOUND_EMAIL_SETUP.md`
(Resend Inbound + DNS + secret), `studio/docs/ENTITLEMENTS_OPS.md`
(grant, expire, reconcile, audit, troubleshooting).


---

## 2026-05-14 (Signal Atlas v1 · the system map that flags itself when it lies)

### A founder's tool for asking "wait — how does this work again?"

Signal HQ grew a new room. `/hq/atlas` is repo-backed system documentation
that reads from `content/atlas/*.md` at request time. Three lenses
(Products / Processes / Data Flows), search-light filter across titles
and summaries, and a stale-flag that triggers when an entry hasn't been
re-verified in 60 days. The flag is the entire point: documentation that
can't lie quietly. Fix the entry, then the code — reverses the usual rot
direction.

**Nine anchor entries to start.** One fully written (the plan cycle —
the most important "how does this work" surface, the loop that makes
five products from one operator possible). Eight more stubbed with
frontmatter and a one-line WHAT placeholder so the index reads honestly
about what's written and what isn't. The whole atlas refuses to be
complete by default — completeness for its own sake is how wikis die.

**A minimal markdown renderer** (`src/lib/atlas/render.ts`) handles H2/H3,
lists, links, inline code, fenced code, bold, italic. Mermaid fences are
labeled as `diagram source · mermaid` and rendered as monospace; client-
side diagram rendering is a v2 if v1 gets real use. No dep added — the
shape of entries is constrained enough that 150 lines of code beats a
markdown library.

**Atlas prose styling** lives in `globals.css` under `.atlas-prose` —
engineering-notebook register, restrained heading scale, hairline
section dividers, code blocks that read like inline code instead of
chrome. Matches the paper-white + ink-#111 + indigo register the suite
locked yesterday.

**Maintainer notes** at `content/atlas/README.md`. The "when to add a
new entry" line is the load-bearing one: not by default, only when you
needed it and it wasn't there. The atlas is a forcing function, not a
completeness exercise.

---

## 2026-05-13 (Suite design-system v1 · paper turns white, the dot gets a household)

### One umbrella, one indigo, five wordmarks.

The suite design system landed. The warm-cream era ended on the umbrella —
`--bg` is pure white now, ink moved from `#18181b` to the spec's `#111111`,
and the indigo dot got promoted from a per-product motif to the central
gesture of the whole house. Hairlines do the work shadows would in a louder
system; `--paper`, `--paper-soft`, `--paper-deep`, `--ink`, `--ink-soft`,
`--ink-faint`, `--ink-ghost`, `--hairline`, `--hairline-2`, `--indigo-soft`
all landed as semantic tokens in `globals.css`. The older ramp tokens
(`--ink-900` etc.) stay aliased so the suite doesn't shatter while pages
get retouched.

**`<Wordmark variant>` — five marks, five motions.** The component grew from
"signal studio." to the full five: `signal` (broadcast — emit ring on a
period, 2.6s), `tasks` (heartbeat — paired beats on a middot, 1.6s),
`roadmap` (advance — drift right 4px then reset, 2.6s), `analytics` (tick —
scope-style vertical pulse, 2.4s), `notes` (settle — slow breath, 3.2s).
Period = umbrella + nouns; middot = verbs. Reduced-motion silences all of
them. Default still renders the umbrella, animate=false — so the nav and
footer call sites keep working.

**`/brand` — the public asset hub.** A new public route at
`signalstudio.ie/brand` houses the full brand index: wordmark anatomy,
motion catalogue, refusal list, the palette, the type scale, voice rules,
and **eighteen downloadable SVGs** — house wordmark + variants, four product
wordmarks + lockups + square marks. Email signatures (full + mini) ship
as plain-text downloads too. The page sells nothing; it just makes the
brand available. Added to nav + sitemap.

**What I didn't touch.** Existing surfaces still render — the Reveal
landing, the pricing per-product marks, the press page, Signal HQ. Those
get retouched per-page as the rollout reaches Tasks, Roadmap, Analytics,
Notes. The `.studio-mark` and `.notes-mark` CSS classes stay (used by
existing components); the new canonical surface is `.brand-mark`
(via `<Wordmark>`).

**Carries forward.** Phase 2 is Tasks — same token set, same wordmark
refactor (heartbeat, 1.6s), primitives walked through. Then Roadmap,
Analytics, Notes. Each one pauses for spot-check.

---

## 2026-05-13 (Suite review pass · cross-tenant leaks closed, partners moved to HTTP, demo brought back in line)

### Quiet day with a long diff.

Audited all five repos end-to-end with five parallel reviewers, then
worked the punch list. Most of what landed was small, but a few were
the kind of thing that doesn't show up in a screenshot.

**Cross-tenant leaks (Tasks).** `/api/calendar/[workspaceId]` was
reachable by any signed-in user with any workspace id — pulled task
titles across tenants. `removeCommentAction` deleted any comment by
id regardless of author or workspace. Both closed: calendar route now
joins through `workspace_members`; comment delete scopes on
`(active workspace, author === caller)`. Honest docstring on the
calendar route too — Apple Calendar can't carry a Clerk session, so
the "subscribe to your workspace from your calendar app" gesture
needs the token-shaped URL we keep saying we'll build.

**Partners stats over HTTP (Studio + Tasks).** Studio's `/hq/partners`
used to read Tasks's `comp_codes` and `entitlements` tables directly
over a Turso client. One rename in Tasks would silently break the
operator page. Now a real endpoint:
`tasks.signalstudio.ie/api/internal/partner-stats?sponsor=<slug>`,
bearer-authed via `PARTNER_STATS_SECRET`. Studio fetches it with a
5s timeout and a fail-safe to zero counts. Schema changes on Tasks
are now a versioned contract, not folklore.

**Hot-column indexes on Tasks (applied to prod).** Sixteen indexes
that should have been in `0000_flat_blur.sql`: `tasks.workspace_id`,
`comments.task_id`, `activities(task_id, created_at DESC)`,
`activities(workspace_id, created_at DESC)`,
`notifications(user_id, created_at DESC)`,
`entitlements(user_id, workspace_id)`, the `workspace_members`
lookup, share-link visit history, and a few neighbours. Every read
was a full table scan before this. Applied to `ethanmcnamara-tasks`
Turso via the CLI; idempotent file at
`drizzle/0003_hot_indexes.sql` lives in the repo for fresh envs.

**Suite-wide security headers (Tasks + Analytics).** The Plan 4.1
header set (HSTS, X-Frame, Referrer-Policy, Permissions-Policy, CSP
Report-Only) was supposed to cover all four products. Tasks and
Analytics were on the missing-list. Both fixed today, with the
Clerk-flavoured CSP that Roadmap already ships. The memory entry
that claimed coverage on day one was corrected too — three drift
points named honestly.

**Tasks Sentry, finally doing something.** `beforeSend` in
`src/instrumentation.ts` was a no-op that returned the event
unchanged, with a comment about anti-noise that lied. Replaced with
a real scrubber in `src/lib/sentry-scrub.ts`: reduces `user` to id
only, drops `cookies`/`data`/`query_string`, redacts auth-shaped
headers, filters clerk/stripe/svix breadcrumbs. `sendDefaultPii:
false` everywhere — defaults were sending IP, cookies, and Clerk
session tokens to Sentry.

**Roadmap rate-limit, finally working.** `getClientIp` called
`require("next/headers")` synchronously and `headers()` synchronously
— against Next 16's async API. Every call threw and dropped to a
single shared `"unknown"` bucket. Workspace-create and source-save
were unprotected. Now async, awaited properly. Side fixes: missing
workspace columns got a committed migration (prod was already at
parity via earlier `db:push`); `upsertParsedItems` +
`seedWorkspaceFromTemplate` wrapped in transactions; activity feed
flipped from oldest-20 to newest-20; rawMarkdown capped at 200KB;
workspace name capped at 80 chars.

**Analytics cron idempotency + concurrency + GET-safe unsubscribe.**
`lastSentAt` is now read as a filter on the cron — a double-fire
won't double-send. Loop replaced with `Promise.all` in chunks of 6
so the fanout doesn't fall off a cliff past ~80 users. `/u/[token]`
no longer mutates on GET — Slack link unfurls and AV scanners
silently unsubscribed users before. Now a confirmation step,
server-action POST to actually flip cadence. RFC 8058
`/api/unsubscribe/[token]` POST stays auto-confirming for the mail
clients that need it. `tasksDbSource` got try/catches around both
queries so one user's broken Tasks read doesn't kill the whole cron.
Voice helpers (`greeting` / `summaryLine` / `graceNote`) hoisted to
`@/lib/briefing/voice` — they were duplicated verbatim across web,
HTML email, and plain-text email.

**Reality check on Analytics claims.** Memory + `/method` copy
claimed "10 triggers, ~55 phrasings" — code has six and eighteen.
The trigger file's own comment said "Four, intentionally" which
isn't right either. Marketing copy and code comments now say
"eighteen phrasings"; memory amended to point at the real numbers
without pretending the older claim shipped.

**Notes demo brought back in line with PRODUCT.md.** The marketing
demo did a Tags-view morph and a long-press → "Promote to Tasks"
menu — two specific contract violations (§4 no views, §7 no
taxonomy, §11 deliberate two-step extraction). Ripped out four
showcase components (`view-toggle`, `tags-view`, `promote-menu`,
`tasks-edge`); demo is now capture × 3 → search → reset. The
extract-to-Tasks beat will return when designed deliberately
against the shipped Notebook UX. Same pass: tags stripped from
`CaptureEntry` type; `startup` audience pack (investor moat, SOC 2
auditor, fintech founder Y — exactly the tech-bro register §2 says
Notes isn't for) retired and replaced with `freelance` for a
freelance designer.

**Studio homepage gained a landmark.** `/accessibility` claimed
"Skip links land users at main content" — the homepage had neither
a skip-link nor a `<main>` element. Both added. Three unused
landing-component files (`hero`, `manifesto`, `products-grid` —
488 LOC of an earlier aesthetic) deleted.

**Suite hygiene.** Duplicate `package-lock.json` files removed from
Tasks/Roadmap/Notes (pnpm-only going forward). Stale
`better-sqlite3` references stripped from Tasks (dependency removed
from `package.json`, dead `serverExternalPackages` and
`outputFileTracingIncludes` removed from `next.config.ts`, seed
rewritten against libSQL drizzle).

The two things this pass didn't touch and the operator still owns:
verify the daily-briefing cron is actually firing in Vercel logs,
and set `PARTNER_STATS_SECRET` on Studio + Tasks Vercel projects
(same value both sides — Studio's `/hq/partners` shows zeros until
it lands).

---

## 2026-05-13 (Pricing surface · side-by-side compare + tier reorder)

### Two €0 tiers first. A shape-not-features comparison underneath.

Two changes to `/pricing`, shipped together.

**Reorder.** Free and Student now sit on the left, Workspace and Event
on the right. The two zero-cost lanes are adjacent and lead the grid;
the paid lanes follow. Names unchanged — "Workspace" stays "Workspace"
(renaming it "Studio" would collide with the umbrella brand), "Event"
stays "Event" (renaming it "Wedding" would foreclose the launch / move /
conference lanes the €79 tier already covers). "Most chosen" stays on
Workspace; moving the badge to a free tier would soft-recommend against
the revenue lane.

**Side-by-side table.** A new section between the tier grid and "What's
in Signal Studio." Seven rows of *shape*, not features: who it's for,
workspaces, all four products, editing guests, price, window, after the
window. The "all four products" row reads Yes / Yes / Yes / Yes by
design — the whole point of the pricing model is that the tiers don't
differ on what's inside. Recommended column carries the same accent wash
and "Most chosen" pip as the grid above so the eye finds the anchor
twice. Mobile uses horizontal scroll inside a bordered container
(min-width 760).

A quiet line under the table — "All tiers include every product as it
ships. No feature is gated behind tier." — restates the thesis the table
is built around. The page now pitches in the grid, audits in the table,
and substantiates in the suite cards, in that order.

---

## 2026-05-13 (Plan 8 · Cycle 8.4.9 — cron staleness signal across studio + analytics)

### The daily briefing cron now reports it ran. /hq/health makes the silence audible.

Until today, if the Analytics daily Vercel cron silently stopped firing —
Hobby-tier limit, rotated CRON_SECRET, expired Resend key — no one would
know until a venue prospect said "I signed up but never got an email." A
five-agent admin-console review surfaced this as the single biggest
operational blind spot the suite carries right now.

The fix is two moving pieces.

**Studio** owns the dashboard. New `cron_runs` Turso table
(`drizzle/0002`), a POST `/api/internal/cron-ping` endpoint that records
runs (Bearer-authed via `CRON_PING_SECRET`), a `getCronHealth(source)`
helper with green / amber / red / never thresholds (green &lt; 12h, amber
12–26h, red &gt; 26h or on failure), and a new `/hq/health` route showing
the latest run per source with status pill, hours-since, sent/failed
counts. Same chrome pattern as `/hq/partners`.

**Analytics** owns the ping. New `src/lib/ops/ping-studio.ts` helper with
a 2s `AbortController` timeout and total error swallowing — observability
must never break dispatch. The cron handler awaits it once at the end
before returning the JSON response, with the full counts payload.

The system is gracefully no-op until four operator actions activate the
signal — apply `drizzle/0002` to `ethanmcnamara-studio` Turso, generate
`CRON_PING_SECRET` on studio Vercel, set `STUDIO_CRON_PING_URL` +
`STUDIO_CRON_PING_SECRET` on analytics Vercel, redeploy both. Documented
in `docs/CYCLE_8_4_9_CRON_STALENESS_HANDOFF.md`.

Conscious non-builds: no alerting (dashboard-poll only), no multi-source
view yet (`analytics_daily` is the only configured source), no historical
sparkline, no pill on the main `/hq` dashboard overview. Each earns its
place when there's a forcing function.

---

## 2026-05-13 (Plan 8 · Cycle 8.4.8 — admin-console scope re-grounded; pilot blockers visible in HQ)

### A five-agent panel asked "what should the admin console look like?" The honest answer: most of it already shipped today.

Spawned strategy, pm, architect, ux-director, and creative-director on
the question of an admin console for Signal Studio. The agents (operating
in a vacuum) recommended building entitlements, extending `/hq`,
deferring a cmd-k palette, and adopting a hybrid visual register.

Reading the actual studio repo state afterward surfaced the gap in the
agents' premise: `/hq` is already a 1,767-line dashboard, `/hq/partners`
already cross-DB reads from Tasks, entitlements + redeem flow + comp
codes + `partner-digest` CLI all already shipped earlier in this
session. The proposed "build an admin console" frame was operating on
stale state.

The genuine delta versus current state: cron-staleness dead-man's switch
(deferred — landed as Cycle 8.4.9), cmd-k palette for cross-product
person lookup (deferred — load-bearing dependency on cross-product
identity join that's unbuilt), and a "pilot shelf" surfacing the 4
operator actions blocking Cycle 8.5 send. The pilot shelf was the
smallest valuable add.

Four entries appended to `src/lib/hq/data.ts` `nextActions` array, all
Operations / High / due 2026-05-14: Clerk webhook signing secret rotate
on Tasks Vercel, one incognito redemption walk against the corrected
post-Clerk flow, DKIM generation in Google Workspace Admin Console, and
test-send the Sinéad email template to the operator inbox before any
real send. They render in the existing Next Actions panel on the main
dashboard with the standard `To do → Doing → Done` status toggle.

No new render code. No new schema. No new route. Pure data layer
addition using the existing `NextActionItem` type.

---

## 2026-05-13 (Plan 8 · operator-backlog clearance — `reached_board_at` migration applied + HQ catches up)

### Two small completions before Cycle 8.5 launches.

The `drizzle/0001_add_reached_board_at.sql` migration from Cycle
8.4.7 is now applied to Tasks's prod Turso — the column is live and
`/hq/partners` will populate the "Reached board" column as
redemptions happen. No code change, just the operator step closing.

Signal HQ also caught up: the Founding Venue Programme campaign and
pilot entries in `src/lib/hq/data.ts` now reflect Venue Editions as
the shipped mechanic (per-couple codes, 12-month duration, eyebrow-
only co-brand) rather than the pre-Plan-8 framing. A new
`venue-editions-mechanic` decision logs the Cycle 8.0 lock (naming,
co-brand register, auto-drop, per-couple CLI codes) into HQ
decisions so future-Ethan and future-Claude can read the *why* of
the mechanic without spelunking through `docs/VENUE_EDITIONS_PLAN.md`.

Cycle 8.5 still gated on the two operator actions in
`docs/CYCLE_8_5_HANDOFF.md` — Clerk webhook secret rotation + the
in-browser walk. The CSV send waits.

---

## 2026-05-13 (Plan 8 · Cycle 8.4.7 — the "did the next person finish?" column)

### One boolean. One column. The minimum monitoring earns its place.

After Cycle 8.4.6 made the existing /hq/partners honest, 8.4.7 added
the single column that actually answers an operator question: *of the
couples who redeemed, how many reached their workspace?*

Tasks's `entitlements` table gained a nullable `reached_board_at`
timestamp; it's stamped idempotently on the first
`/app/board?welcome=venue` render. Studio's `getPartnerStats` reads
the new column via a try/fallback SELECT so /hq/partners stays
loadable through the migration window. The column shows `<count>
(<%>)` where the percent is reached/redeemed — funnel only
meaningfully starts at redemption, not at issuance.

Partner-digest CLI gained one sentence: when reached &lt; redeemed,
it narrates the gap explicitly. "*Two couples haven't reached the
workspace yet — the redemption succeeded but the board hasn't loaded
for them.*" That's the line you actually want when Sinéad asks how
it's going.

Conscious non-build, restated: no per-event funnel table, no email
open tracking, no engagement column. At N=10 the right monitoring is
asking Sinéad to ask the couples; we earn event infrastructure at
venue #3, not before. The brand position is restraint and the
back-office data ethic mirrors the user-facing one.

Operator action: apply Tasks's `drizzle/0001_add_reached_board_at.sql`
ALTER to prod Turso before the next /hq/partners visit. Studio falls
back gracefully (reachedBoard: 0) until it lands; no broken pages.

Tasks repo: commit 3f0aa56.

---

## 2026-05-13 (Plan 8 · Cycle 8.4.6 — monitoring honesty pass)

### Two small admissions, before the pilot ships.

Cycle 8.4.6 is a thirty-minute cycle that earned its slot in front of
the CSV send. Two corrections:

**`active_30d` was a lie.** The /hq/partners column read like
engagement; it actually counted "redemptions started in the last 30
days." For a 12-month gift, that becomes useless after week 5 — and
worse, it reads as if couples are *using* the workspace when all the
column measures is *new claims*. Renamed across the helper, the page,
and the digest CLI to `redeemed_30d` (column header "Redeemed 30d").
The page descriptor now says explicitly: this counts redemptions, not
engagement. A couple who claimed two weeks ago is in the count
whether they've opened the workspace once or live in it daily.

**The silent paths got eyes.** The 2026-05-13 archaeology session
(the orphaned-redemption one) cost hours because the Clerk webhook
returned 500 in silence. Tasks-side Sentry capture is now wired on
both the webhook (missing-secret in production + handler dispatch,
tagged by event type + svix id) and on `redeemCompCodeAction`
(tagged by action + truncated code). Expected `ok: false` reasons
are NOT captured — those are flow outcomes, not errors. No-op when
`SENTRY_DSN` is unset.

What we deliberately did NOT build, despite the temptation:
per-redemption funnel events, a `tasks_created_after_redemption`
usage column, a studio→Tasks webhook to populate the empty
`redemptions` audit table. At pilot scale (N=10) the right monitoring
is asking Sinéad to ask her couples at day 7 and day 14. We earn the
event tables when we have ≥3 partners — not for one.

Tasks repo: commit 8721a95.

---

## 2026-05-13 (Plan 8 · Cycle 8.4.5 — redemption polish, pre-launch)

### Four small corrections to the venue-edition flow, before the CSV goes out.

A four-agent panel — creative-director, ux-director, ux-tester,
strategy — walked the venue-edition flow end-to-end the morning after
8.4 shipped and converged on four things worth doing before Lamb's
Hill gets a code batch. Two hours of work. One deploy. The Tasks
changelog narrates the code side; the suite-side residue is:

The sponsor-to-couple email template now lives at
`docs/VENUE_EDITION_EMAIL_TEMPLATE.md`. Plain text, sent from Sinéad's
own address, written in BRAND.md §3 voice — no exclamation marks, one
sentence of what-it-is, "yours alone, activates once" to preempt the
per-couple confusion. The template was the missing first-touch
surface — without it, our first-impression copy was uncontrolled the
moment a venue contact wrote their own. It exists before the CSV
does.

Strategy heuristic locked into the cycle doc:

> *Would a tired adult thank us for this, or skip past it?*

Position B (restraint over warmth) was chosen against Positions A and
C. A wedding-stressed couple has been over-charmed by twelve other
vendors this month; the win isn't surprise-and-delight, it's reading
like a real person.

Deferred to a "Cycle 8.5.5 — polish v2" post-retro: IncludedStack box
→ ruled list, "sponsoring" → softer phrasing on the studio landing,
"Claim your seat" CTA tone, the "every view is the same items" jargon
in VenueWelcomeCard, sponsor-named tasks in the seeded wedding
template, and `already_used` self-vs-other routing.

Cycle 8.4.5 closes the runway for 8.5. Two operator actions still
gate the cycle start: Clerk webhook signing-secret rotation +
redeploy, and one incognito walk to validate the corrected post-Clerk
half.

---

## 2026-05-13 (Plan 8 · Cycle 8.4 — operator surface)

### One quiet line on /pricing. One private view at /hq/partners. One paragraph from the CLI.

Cycle 8.4 closed in a single session because the surface is, by
design, small. The audience is one person.

`/pricing` gained a single line of copy below the Event lane —
"Planning a wedding? Ask your venue." 15px, `var(--ink-quiet)`,
no CTA, no link, no glass shimmer, no entry animation. The
couples this is for don't arrive via /pricing; the line exists
for the small minority who looked here first and need a quiet
nudge toward the right door.

`/hq/partners` is a read-only operator view, gated behind the
existing Signal HQ password. Each sponsor appears as a row with
four metrics — codes issued, codes redeemed (with percentage),
active in the last 30 days, most recent redemption — and a
totals footer. Studio's `license_codes` table answers "issued";
Tasks's `comp_codes` + `entitlements` answer "redeemed" and
"active" via a cross-DB read at request time, joined on the
sponsor slug embedded in `comp_codes.notes` JSON. The
`TASKS_DATABASE_URL` + `TASKS_AUTH_TOKEN` env vars that
`scripts/issue-codes.ts` already needed locally are now also
set on studio's Vercel production.

`scripts/partner-digest.ts <sponsor-slug>` is the one Sinéad-
shaped output: a single paragraph, plain English, suitable for
pasting into a reply to a venue contact. Today, for Lamb's Hill,
it reads:

> Lamb's Hill update — 13 May 2026. 3 codes have been issued;
> no couples have redeemed yet. Codes are live and ready —
> every couple lands directly in a populated wedding workspace
> with Lamb's Hill's name on the welcome card. Reply if you'd
> like another batch of codes.

When couples redeem, the prose adjusts — percentages, last-30d
counts, most-recent timestamps. Same paragraph shape, evolving
truth.

Two architecture calls held the line: studio's `entitlements`
table stays in place but unused (dropping it would have to be
reversed if Cycle 9+ cross-product identity wants it back, and
empty tables cost nothing); studio's `redemptions` audit stays
empty (populating it via a Tasks → studio webhook is real work
for a number Tasks already has, and /hq/partners reads Tasks
directly anyway). Both decisions written into the plan doc with
the reasoning attached, so the next Cycle 9 deliberation starts
from "here's why we paused" rather than "wait, why didn't we?"

---

## 2026-05-13 (Plan 8 · Venue Editions · live end-to-end)

### A real couple, a real code, a real wedding workspace.

Plan 8 has a working bridge today. `signalstudio.ie/redeem/LAMBSHIL-MP93X`
serves the co-branded landing — Lamb's Hill in an 11px mono eyebrow,
no logo, four products listed under "What's included," one "Claim
your seat" CTA. Click it and the couple lands on
`tasks.signalstudio.ie/redeem/LAMBSHIL-MP93X`, which now properly
gates on Clerk sign-up first (it didn't earlier in the day — the
first live walk found a 500, the fix shipped within the hour, the
honest entry lives in `tasks/CHANGELOG.md`). After sign-up Clerk
returns the user to the same `/redeem/` URL, the comp_code is
redeemed against their fresh user row, the entitlement is written,
and `/welcome` short-circuits straight to `/app/board` with a quiet
"Compliments of Lamb's Hill" card. No picker. No tutorial. The
workspace is already populated with a wedding template.

Three Turso tables stood up on studio for sponsor audit
(`sponsors` / `license_codes` / `redemptions`), with the runtime
redemption deliberately routed through Tasks's pre-existing
`comp_codes` + `entitlements` system to avoid building parallel
infrastructure. `scripts/issue-codes.ts` dual-writes to both DBs —
studio for who-issued-what-to-whom, Tasks for runtime redemption.
Three test codes are seeded against Lamb's Hill in prod. The
operator surface (`/hq/partners`, quiet `/pricing` line, monthly
digest script) is the next cycle.

A reconciliation doc at `docs/CYCLE_8_3_RECONCILIATION.md` carries
the full architecture call, the rollback of the original signed-
handoff approach, and the lesson learned about grepping the Tasks
repo before declaring redemption infrastructure missing. Saved
feedback `feedback_cross_repo_grep` was specifically created to
prevent this and was specifically violated. Now logged twice.

---

## 2026-05-12 (suite chrome · second-route cycle)

### Avatar dropdown gained the siblings; mobile-Tasks got a top bar; Analytics got its first /app shell.

Three pieces shipped together this turn, all sequenced as deferred
work in the launcher cycle's "what we did NOT ship" list:

1. **Clerk avatar dropdown** now carries "Open <sibling>" rows in
   all four products (Tasks/Roadmap/Notes/Analytics). Implemented as
   thin per-repo `<UserButtonWithSuite/>` wrappers around Clerk's
   official `<UserButton.MenuItems>` + `<UserButton.Link>` API — so
   the dropdown remains Clerk-native (same hover, same shadow, same
   kbd focus). Each link opens the sibling product in a new tab so
   the user keeps the workspace they were standing in. The current
   product is filtered out (no "Open Tasks" inside Tasks).

   This is a second route to the same destinations the launcher
   popover already covers. Two routes because the discovery profile
   differs: launcher = "what users find when they look at the
   breadcrumb"; avatar dropdown = "what they find when they reach
   for settings." Both should work; neither is the only way.

2. **Mobile-Tasks top header.** Until this turn, Tasks's mobile
   chrome was bottom-tabs only — the desktop sidebar's `signal
   studio. /` breadcrumb didn't exist on phones. New
   `<MobileSuiteBar/>` is a fixed h-9 bar (md:hidden), carrying the
   launcher trigger + `tasks·` wordmark. Tasks's `/app` layout
   gained `pt-9 md:pt-0` to push content below it. The bottom-tab
   bar is unchanged. Mobile users now have parity with desktop on
   cross-product jump.

3. **Analytics `/app` shell.** Analytics has been shipping
   end-to-end (engine + email + cron) but the authenticated routes
   `/app/brief`, `/app/preview-email`, `/app/settings/notifications`
   had no in-app layout — they rendered under the root marketing
   layout with zero chrome. New `analytics/src/app/app/layout.tsx`
   lays the same chrome contract the other three products carry:
   `signal studio. /` launcher + `analytics·` wordmark + Clerk
   UserButton with suite jumps. Header recipe matches the marketing
   site-nav (sticky, blurred bg, sat 160%) so the in-app chrome
   reads as the same family.

After this turn, all four products carry the same suite affordance
in two places (breadcrumb launcher + avatar dropdown) on every
viewport. The "marketed as separate, jumpable in one click" brief
holds.

What this turn explicitly did NOT ship: the studio-side reciprocal
"Continue in [Product]" affordance for signed-in visitors on
signalstudio.ie (would require Clerk on the umbrella site, which is
currently unauthenticated marketing — and the existing /work
product cards already let users into each product, so the marginal
value of an auth-aware label is small).

---

## 2026-05-12 (suite chrome · launcher cycle)

### The breadcrumb learned to open. Four products, one click.

Two cycles ago the marketing nav got the `signal studio. /`
breadcrumb prefix. One cycle ago that prefix walked into the
authenticated workspaces of Tasks and Roadmap (Notes already had
it). This cycle, the prefix learned a new gesture — click it, a
small popover blooms below with all four products listed, each
with a one-word tagline:

```
Signal Studio
Four products, one studio.

tasks·       Execution clarity
roadmap·     Direction clarity        [HERE if current]
notes·       Capture clarity
analytics·   Attention clarity

Visit signalstudio.ie →
```

The current product is de-emphasised with a small uppercase HERE
tag; the other three open in a new tab so the user keeps the
workspace they were standing in. The footer row routes to
signalstudio.ie. No caret, no tab grid, no extra visual weight on
the trigger — the same 12px ink-quiet `signal studio.` text that
was already there. Discovery is cursor + click. Escape and
click-outside both close.

Wired into seven surfaces this turn:
- Tasks desktop sidebar header
- Roadmap in-app top bar
- Notes `/app` notebook chrome
- Notes homepage suitebar
- Notes `/wedding-planning` worked example
- (and via the existing breadcrumb structure on each)

Tasks's command palette also gained a "Jump to" section in the
empty state — open ⌘P with nothing typed and roadmap, notes,
analytics surface as quick jumps; type `ro` and only Roadmap
matches; type something that matches no task and no product and
the palette stays clean. Roadmap and Notes don't have palettes
yet, so this is a Tasks-only second gesture; the launcher popover
is the universal fallback in the meantime.

Notes also gained `src/lib/product-urls.ts` (it was the only
product without one — URLs had been hard-coded in the homepage
breadcrumb).

The dissent inside the decision: visible suite chrome inside an
authenticated product is exactly the move that risks turning four
sovereign products into a single suite (Confluence/Jira swirl,
Notion sidebar workspaces, Atlassian app launcher). All three
patterns make the underlying products feel like tabs, not
products. The smallest possible intervention here — a popover
hidden behind a single 12px text trigger that already existed —
is the move that solves the friction Ethan named ("hard to jump
between products fast") without buying into the suite-as-product
mental model. The trigger looks identical to before; the only
difference is what happens on click.

What this turn explicitly did NOT ship: mobile-Tasks header (the
bottom-tab surface has no top chrome; adding one is its own
design call); Clerk UserButton custom dropdown items (Clerk's
typed `userProfileProps` API needs spelunking — own cycle);
studio-side reciprocal "Continue in [Product]" affordance for
signed-in visitors (needs Clerk on the studio site, currently
unauthenticated marketing); Analytics in-app shell (own cycle —
the launcher will land there when the shell exists).

---

## 2026-05-12 (suite chrome · in-app pass)

### The breadcrumb crossed from the marketing nav into the workspace.

Yesterday's "Suite chrome consolidated" cycle landed the
`signal studio. /` prefix on the marketing site-nav of all four
products. The in-app shells were untouched — Tasks sidebar said
`tasks·`, Roadmap top bar said `roadmap·`, and only Notes (which
was already wearing the breadcrumb) gave a logged-in user any way
to walk back to signalstudio.ie without typing the URL. Three
different chrome patterns, one breadcrumb, no parity.

Today the breadcrumb walked into the workspace. Tasks's desktop
sidebar header now reads `signal studio. / tasks·` at h-12.
Roadmap's in-app top bar now reads `signal studio. / roadmap·`,
with the wordmark bumped sm→md to match the marketing nav and read
proportionally next to the 12px prefix. Notes was already correct
— no change there. Analytics has no in-app shell yet, so this work
queues for whatever cycle stands one up.

The dissent that nearly killed this: a visible suite affordance
inside the workspace dilutes the "four separate products"
position. Counter — the breadcrumb is hierarchical ("this product,
which is a thing under the studio"), not lateral ("tab 1 of 4"),
and it's the smallest chrome that solves the friction Ethan named:
a logged-in user with no way back to the umbrella except the URL
bar. Picking the smallest possible move means the next cycle
(launcher popover, palette "Jump to," Clerk dropdown
standardisation, mobile-Tasks breadcrumb) builds on a stable
anchor instead of relitigating it.

Implementation: two file edits.
`tasks/src/components/app/sidebar.tsx` and
`roadmap/src/app/app/layout.tsx` each import `STUDIO_URL` from
their `product-urls` module and render the same 12px prefix +
indigo-dot + 12px slash that the marketing nav has been wearing
since yesterday. Studio link is a hard `<a>` (not Next `<Link>`)
to signalstudio.ie — same-window navigation, because clicking the
breadcrumb means "leave this workspace for the umbrella."

What this turn explicitly did NOT ship: the launcher popover, the
palette "Jump to," the Clerk UserButton standardisation, the
studio-side reciprocal "Continue in [Product]" affordance, the
Analytics in-app shell, and the mobile-Tasks breadcrumb. All
sequenced for the next cycle once the desktop breadcrumb anchor is
verified live across both deploys.

---

## 2026-05-12 (suite review · pass 2)

### The umbrella grew the pages it was missing.

A site review across all five surfaces surfaced concrete gaps —
broken links on a live deploy, legal pages that footers pointed at
but didn't exist, audience landing pages for two of the five
archetypes BRAND.md §2.1 has been naming for months without
landings to back them up, and a proof page the wedge pitch has been
gesturing at without ever showing as one continuous read.

Shipped, in order:

The broken links got fixed. Analytics's nav had been pointing at
`/method` for cycles without the route existing — built it. The
new page explains the engine in four steps: read, detect, compress,
write. Four things the engine refuses to do, named on the same page.
No LLM in the path. Roadmap's hero copy promised a calendar-
subscribe surface that doesn't ship — line rewritten to what the
product actually does. Roadmap's demo banner used "your team's
roadmap" — universalised. Tasks's demo data carried "Sprint
planning · Q3 themes" — replaced with plain-English equivalent.
Studio's `/weddings` eyebrow used Tasks's wedding audience accent
(rose) — switched to brand indigo because the umbrella is the
umbrella, not a Tasks audience page.

The umbrella legal stack landed: `/privacy`, `/terms`, `/security`,
`/accessibility`. Plain language where the law allows, careful
language where it doesn't. Every product footer now carries the
four legal links as a small mono row beneath the existing bottom
strip — discoverable everywhere, one canonical source. Analytics's
footer was the most exposed before this — Privacy and Terms links
pointed at `/privacy` and `/terms` routes that didn't exist on its
domain. Fixed.

The two missing audience landing pages shipped. `/for/small-business`
for restaurant owners, shop owners, clinic operators, studio owners —
operational teal accent (#0e7490), two templates around the weekly
and monthly cadences. `/for/community` for teachers, school
administrators, club coaches, parish coordinators, community
organisers — community violet (#7c3aed), two templates around term
planning and season setup. BRAND.md §7 was extended with both
accent tokens.

`/proof` is the umbrella's new GTM page. One scene — a wedding
planner sits in a venue call — walked layer by layer across all
four products. Notes captures. Tasks promotes three captures into
a workspace. Roadmap publishes one link the couple can read at
midnight. Analytics writes the morning briefing. Each section
shows a text artefact: the planner's notebook, the workspace, the
public roadmap, the morning briefing. Each section names what came
out: 12 captures, 5 tasks, one link, two minutes. The four-layer
loop has been the proof for cycles; this is the page that shows
it as one read.

`/principles` joined the umbrella, parallel to Tasks's eight-
refusals page. Five refusals the suite sustains across products:
one voice, every product publishes its refusals, one accent
colour, suite coherence as one product surface, audience first
before any feature. The honest-dissent section names the watch
metric — when readers describe Signal Studio in our register
without prompting, the moat is paying out; when they describe it
in Notion's or Asana's register, it has been breached.

Press migrated to the umbrella. Tasks's `/press` was a strong page
on the wrong surface — press writes about Signal Studio, not
Signal Tasks. Suite-scoped boilerplates at three lengths, founder
bio, brand asset links, suite-level "four products" section.
Tasks's `/press` 308s to umbrella now, matching the changelog and
pricing pattern.

The Studio nav grew one item — `/proof` — between Work and About.
It's the highest-leverage page for the venue-pilot pitch and
deserves the nav real estate over /principles + /press (which live
in the footer).

BRAND.md got the doc-stale updates the audit surfaced. §6 hero
pattern was holding "Cut through the noise." as the locked H1 for
every product homepage; every product had evolved past it to its
own punchline, and the doc lagged reality. Doc updated to
acknowledge that each product owns its H1 and the umbrella line
stays on Studio surfaces only. §7 added the two new audience
accents. §1 acknowledged Analytics's settled position word
(operational, not attention) — Analytics product surface decided
this and the doc caught up.

## 2026-05-12 (suite chrome · footer pass)

### Four footers learned to read as one.

A cross-suite audit found five surfaces running four different footer
architectures. Studio at 2-col. Tasks at 4-col. Roadmap at 3-col.
Analytics at 4-col but inline-styled instead of Tailwind. Notes inlined
to a single line. The Suite column on Analytics was missing Signal Notes
entirely. Roadmap and Analytics had no contact link at all — two of
four product surfaces silently dead-ending visitors who wanted to reach
out.

Pulled into one shape. Every product surface now runs the 4-column
desktop pattern: Brand · Product · Resources · Suite. Every Suite
column lists all four products. Every product surface has a Contact
link. Analytics was ported off inline styles back onto Tailwind so the
chrome lives in the same system as its siblings. The umbrella footer
stayed at 2-col on purpose — the umbrella is the umbrella, not a fifth
product.

The bottom strip got a single suite tagline, locked across all three
product surfaces: *Clarity, not configuration.* Tasks's "Designed in
motion." and Roadmap's "Built for direction clarity." were three
different registers doing the same job. One line, said once, across
the suite.

BRAND.md §6 now carries the pattern as a locked spec so the next
footer doesn't have to be reasoned out again.

### The contact page learned to be a bouncer.

The old `/contact` was a mailto link with a 48-hour SLA. Brand-faithful
but transactional — it processed, it didn't invite. Replaced with a
one-screen page that names both what the address is for and what it
isn't: product questions, private-preview access, thoughtful critique,
partnership conversations — yes. Press, sales, recruiting, CRM
sequences — politely, no. Naming the dissenters is the same discipline
as naming the refusals in PRODUCT.md. The address goes further when
the inbox stays clean.

The page now also names the human reading it. Designed and operated by
Ethan McNamara, Dublin. The moat is *discipline-sustained-by-a-person*
(BRAND.md §2.3); the contact page is where that person should be
visible.

### One changelog for the suite.

Per-product `/changelog` routes are retired. Tasks's and Roadmap's
changelog pages now 308-redirect to `signalstudio.ie/changelog`,
which renders this file. Each product's repo still carries its own
engineering log in `CHANGELOG.md` — that's where shipping notes get
written, where they're closest to the diff. But the *reading surface*
is one page now, with one register, written for people not
build pipelines.

The argument against consolidation: someone visiting Tasks may only
want to read Tasks's shipping log, and routing them to a multi-product
page dilutes the signal. Counter named inside the choice: the umbrella
story is *the suite shipped this week*, not *Tasks shipped these
things*. If a per-product anchor (`?tag=tasks`) earns its keep later,
it can be added without resurrecting four separate routes.

The cost is a 15-minute weekly editorial pass — picking what's worth
saying, writing it in plain language, putting it where readers can
find it. That cost is the entire point. The umbrella story only
exists if someone tells it.

---

## 2026-05-12 (later still)

### Suite chrome consolidated — one bar, not two.

Every product surface across signalstudio.ie / tasks / roadmap /
analytics / notes was running two stacked horizontal navs — a thin
cross-product strip on top, then the product's own nav below. It
read as CMS-template chrome, not a design decision. The strip wasn't
even consistent: Notes split it left/right, the other three
left-clustered it, the umbrella listed itself, and active state was
inconsistent across the four products.

Removed across the suite. Each product now runs a single bar with a
small `signal studio. /` breadcrumb prefix before the product
wordmark. The umbrella drops the strip entirely — the page is the
umbrella, so a self-listing bar was redundant. Cross-product
discovery falls back to the footer, where it already lived.

Dissent named inside the decision: the strip's job was passive
suite-awareness for visitors who land deep. The breadcrumb preserves
the back-to-suite affordance but loses the "look, four products" at-
a-glance read. Footer + brand-mark + breadcrumb are doing that work
now. If the discovery loss shows up in pilot feedback, a small "the
suite" menu can attach to the breadcrumb without resurrecting the
two-bar stack.

---

## 2026-05-12 (later)

### Venue-pilot forcing function set.

Three hard dates committed to HQ data: 10-venue list by 2026-05-15,
first outreach batch by 2026-05-19, three venue conversations on
calendar by 2026-06-02. The 2026-05-15 input gate is the load-bearing
one — if 10 named Irish venues can't be assembled in three working
days, the wedge has a research problem disguised as a polish problem,
and shipping more product won't fix it. Counter-argument named inside
the decision: one week would test pitch sharpness more honestly than
three. Three weeks was picked because the campaign window is already
six weeks long and tightening to five days inside a six-week plan is
theatre. If 2026-06-02 is hit cleanly with no learning, the next
cycle's deadline tightens.

### T0–T3.b suite-review polish verified live.

Three live surfaces walked end-to-end against the kickoff:
/weddings hero shows "28 days to event" in amber (rgb 245,158,11);
Tasks /welcome leading card "Open the [template name]" is wired to
workspace.template_id with brand-soft styling above the picker;
Roadmap homepage cinematic demo plays cursor-lingers → view-morph
timeline with zero comment/thread strings anywhere in the DOM. Sprint
1 polish is closed from this side; pilot pull starts now.

---

## 2026-05-12

### Cycle 11.3–11.5 shipped — every product demo now holds the Tasks bar.

Three products got rebuilt cinematic demos in one arc. The redirect
that kicked it off: lighter demos around a Tasks flagship read as
flagship-plus-sidekicks, which inverts the moat. One quality bar
across the suite is the moat — and now every homepage carries it.

Roadmap (cycle 11.3, four-phase rebuild): hero restructured to the
Tasks pattern. Four audience packs (wedding / construction / launch /
startup). 18-scene loop with three anonymous reader cursors that
traverse the page on DOM-measured paths, follow items when their
status changes, press a real Share button before the "Link copied"
toast fires, open an inline comment thread with character-by-character
typed reply, then morph the whole surface into Timeline view across a
6-month axis before returning.

Analytics (cycle 11.4, two-phase rebuild): same hero pattern, sender
chrome on the briefing card. 19-scene loop with a single anonymous
cursor that inspects an item, opens a "Why this?" rule chain that
types its final line character-by-character, then moves to a focus
item, presses "Mark done", sees the strike-through + "Marked done"
toast, then morphs to Yesterday's briefing to prove the engine's
freshness before returning.

Notes (cycle 11.5, two-phase rebuild): tag chips stagger-land beneath
each note 120ms apart after capture. View-toggle morphs Stream → Tags
and back. Search hits highlight the matched substring inline. The
locked Notes → Tasks promote gesture lands as a long-press ring →
context menu → press flash → flying card silhouette arriving at a
TasksEdge indicator on the right margin. The one-way discipline is
now legible in motion.

Cross-cutting: each demo lives on motion/react, uses DOM-measured
positioning where it matters, respects useReducedMotion, and ships
its own AudienceToggle on the same four-pack axis. Same hero
typography, same status-pip pattern, same depth bar.

Still owed: visual verification on the live URLs (dev server stalled
the whole session — Vercel previews are the only proof). Signal HQ
product-status fields will follow once the live deploys validate.

### T-2.1c shipped — Tasks remix toast now invites a Roadmap.

The cross-product CTA gap that left T-2.1b technically working but
undiscoverable is now closed. Tasks's toast primitive gained an
optional `action` link (rendered below the body with a brand arrow).
`TemplatedToast` now also handles `?remixed=<id>` — for canonical
workspace templates (currently just wedding-planning-workspace), the
remix-success toast carries a "Create a Roadmap for this" link to
`roadmap.signalstudio.ie/onboarding/from-template/<id>`, opening in a
new tab. Specialty Tasks-only templates skip the action.

The wedge demo loop is now four-layer discoverable: someone remixes
the wedding template in Tasks → toast suggests Roadmap → seeded
roadmap workspace appears with one planning project and eight items.

T-2.2 (Notes plumbing) is the next templates cycle.

### T-2.1b shipped — Roadmap workspaces seed from canonical templates.

The Roadmap product's `createWorkspaceAction` now accepts a
`fromTemplate` form field. When present, the action looks up the
canonical template via the synced slice, creates the workspace with
the matching `templateId`, then seeds projects and items from the
template's roadmap slice in one transactional flow.

A new public route `/onboarding/from-template/[id]` renders a
template-aware variant of the create-workspace form: the workspace
name is pre-filled from the template, an item-count line explains
what will land, and a hidden `fromTemplate` input wires the seed.
After creation the user is redirected to `/[slug]` (the public
workspace surface) rather than `/app`.

`onboarding` joined the reserved-slug list so users can't grab it.

T-2.1c (Tasks-side CTA after remix-template-success) is the next
templates cycle. Without it, the from-template route is technically
working but undiscoverable from inside Tasks.

### T-2.1a shipped — Roadmap plumbing in place.

The Roadmap product is wired to consume canonical workspace templates.
Its `workspaces` table gained a `template_id` column (prod Turso ALTER
applied via CLI). A new `pnpm sync:templates` script pulls the
sibling studio canonical and writes `src/lib/templates.generated.ts`
with the roadmap slice from each template.

The canonical wedding `roadmap.ts` was reshaped from the earlier
placeholder (sections + milestones) to match Roadmap's actual data
model (projects + items with Roadmap's own status vocabulary). This is
the right reshape moment — nothing consumed the old shape yet.

T-2.1b (workspace-create flow accepting `fromTemplate` and seeding
projects + items from the synced slice) is the next templates cycle.

### T-2.0 shipped — workspaces now carry their templateId.

Tasks's `workspaces` schema gains a nullable `template_id` column,
populated by `remixTemplateAction` when a user remixes a canonical
workspace template. This is the bookkeeping prerequisite for T-2.1
(Roadmap lazy expression), T-2.2 (Notes), and T-2.3 (Analytics) — each
consuming product reads `templateId` on first visit and seeds its
slice from the canonical template files in the studio repo.

T-2 was split from one cycle into four sub-cycles after starting —
original framing tried to coordinate five repos in one cycle and
that's too much per cycle.

### T-1 shipped — wedding template lifted to canonical four-layer source.

The first cycle of the templates strategy is live. `wedding-planning-workspace`
moved from `tasks/src/lib/templates.ts` to `studio/src/lib/templates/wedding-planning-workspace/`
as a five-file artefact (meta, tasks, notes, roadmap, analytics). Tasks now
consumes it via a build-time sync script (`pnpm sync:templates`) that writes
`tasks/src/lib/templates.generated.ts`. The live `/templates/wedding-planning-workspace`
page is byte-equivalent to before; the canonical contract for the four-layer
template shape is now established.

T-2 (Notes/Roadmap/Analytics lazy expression) is the next available cycle.

### Templates locked as a cross-suite primitive.

Signal Studio now treats templates as the front door to the suite, not a
setup shortcut. Tasks remains the only product with a template gallery;
Notes, Roadmap, and Analytics consume template metadata via lazy
expression on first visit. No per-product template galleries beyond
Tasks, no in-product template builder, no template marketplace.

Five anchor templates locked, one per BRAND.md §2.1 archetype:
wedding-planning-workspace (lift), trades-job-pipeline,
final-paper-sprint (lift), freelance-client-engagement, and
local-business-monthly-rhythm. The existing 13 Tasks-only specialty
templates remain inside their domain packs. The seven named SEO pages
will redirect to anchor-template slices in the final cycle.

Strategy doc at `docs/TEMPLATES_STRATEGY.md`. Sequenced as Cycles T-1
through T-7. T-1 (canonical type + sync script + wedding lift) is the
prerequisite for all other template work.

### Notes became private by design on the live branch.

Signal Notes now treats the empty capture field as a protected writing
space. The live notebook shows one quiet private-writing line with a
restrained caret, hides it when the user starts typing, and keeps the
decorative copy out of screen-reader announcements.

The product boundary is now explicit in HQ and the Notes repo: raw notes
stay private by default. Collaboration should happen through
creator-approved extracts, summaries, tasks, decisions, and shared
updates, not by exposing private context.

## 2026-05-11

### Cycle 6 made the wedding workspace repeatable.

The weddings/events proof path now has a real creator action behind it:
Signal Tasks ships `wedding-planning-workspace`, and Studio's
`/weddings` route links to it with campaign/source context. The shared
Roadmap update can now lead to a wedge page, and the wedge page can
lead to a starter workspace instead of a blank shell.

This makes the collaboration loop more concrete: shared update ->
segment page -> template -> workspace. The next cycle should connect
Notes and Analytics to the same wedding scene so the template can
become a full four-product demo.

### Cycle 3 produced the first shared artefact.

Signal HQ now tracks the first built shareable artefact in the
collaboration growth loop: Roadmap's shared update page at
`/[workspace]/update`. The update is source-tracked, points back to
Signal Studio tastefully, and gives future demo work a real output to
show rather than a strategy slide to describe.

The Roadmap preview path has also been hardened with bundled proof data
so the demo link can render even when preview database rows are missing.

The next step is to turn that generic Roadmap update into the
weddings/events proof path.

That proof path has now started: `/wedding-planning/update` carries
bundled wedding planning data so the first venue/couple/supplier demo
has a concrete artefact to show.

Cycle 5 now adds the conversion path: `/weddings` gives the
weddings/events proof artefact a relevant Studio page, and Roadmap's
wedding shared-update CTA routes viewers there instead of the generic
homepage.

### The homepage got sharper.

The hero line changed from "Cut through the noise." to "Project
Management for the 80% who don't work in tech." This is a deliberate
positioning test: clearer category recognition at the top of the page,
while the product still refuses project-management theatre underneath.
Signal HQ now records the test so future agents treat it as intent, not
drift.

### Cycle 2 became an access model.

The next phase is now written down and visible in HQ: invite roles,
guest access, the collaborator first view, first shareable artefacts,
and source tracking. The proof scene is deliberately concrete: a venue
invites a couple into a wedding planning workspace, and the couple sees
what matters before touching a setting.

### Collaboration became the growth loop.

Signal HQ now has a Collab Loop tab. It tracks the product-led path the
suite has to prove: workspace created, collaborators invited, work made
clearer, shareable output created, new creator discovered. The dashboard
also now carries the shared object model that will keep Tasks, Roadmap,
Analytics, and Notes from drifting into four separate tools.

The plan is written down too. `docs/ECOSYSTEM_INTEGRATION_PLAN.md` holds
the cross-product build sequence, and Signal Growth Studio now has a
collaboration growth loop memory file. Collaboration is no longer a
nice-to-have feature. It is the organic outreach campaign.

### Cycle 1 started across the product repos.

Tasks, Roadmap, Analytics, and Notes now each carry their own
collaboration-loop contract. Each product knows its role: execution,
direction, attention, and context. The next work is no longer abstract
"integrate the products"; it is narrower and better: define the invite
path, the guest's first view, the first shareable artefacts, and the
source tracking that proves collaboration can become distribution.

## 2026-05-10

### Signal HQ became the private operating room.

The umbrella now has a private `/hq` route: password-gated, noindex,
absent from public navigation, and built to show the state of Signal
Studio in under a minute. Product readiness, launch readiness, growth
work, outbound, content, demos, templates, pilots, metrics, decisions,
feedback, risks, and next actions now have one internal home.

Signal Growth Studio also entered the repo as memory, not theatre:
campaign notes, brand rules, hooks, objections, demo planning, template
strategy, review gates, and weekly operating rhythm. The public site
stays quiet. The internal system gets serious.

### Claude and Codex got the same operating rule.

Root instruction files now exist for Claude Code and Codex. Both point
back to the repo contract and repeat the rule that meaningful product,
brand, GTM, roadmap, campaign, template, outreach, demo, decision, risk,
or metric changes must update Signal HQ before the work is complete.
The dashboard also notices when repo-backed HQ data is newer than the
browser copy, so local-first does not become local-stale.

### The umbrella stopped being an old portfolio.

The `/work` page now names only the four Signal Studio products. No
client artifacts. No inherited side quests. The page says what the
company is: Signal Tasks, Signal Roadmap, Signal Analytics, Signal
Notes. The contact page now points at `hello@signalstudio.ie`, and the
handbook no longer treats Analytics as a placeholder.

### The umbrella is live.

signalstudio.ie opened today. DNS resolved to Vercel. The apex serves.
What's visible: a choreographed entrance — gold hairline, headline
rising word by word, four product rows entering from both sides on
scroll. The silence between tasks., roadmap., analytics. and the held
beat where notes. would fire — that silence is intentional. The gesture
is the story.

### Notes held in placeholder.

The Notes row dims. Its brand gesture stays quiet in the entrance
sequence. The row is present enough to show the suite is four products;
inert enough to never imply a live product. Opacity carries the honest
weight that copy would oversell.

---

## 2026-05-09

### The brand handbook became a real artifact.

BRAND.md grew §2 today — audience deep-dive and moat. The moat line
settled: *discipline sustained across the suite*. Not a feature, not
a category. A posture maintained across four products and every piece of
copy that touches them. §2.1–§2.3 locked the three reader archetypes
and the thing that makes the suite defensible: that it stays consistent
when most solo products drift.

### A gesture for Notes entered the visual register.

The notes-mark acquired an underline-writes-itself animation — the
period underlines itself on enter, then disappears, matching how capture
works: you write, then it's gone. That gesture is now in the products-grid
and named in BRAND.md §4 as the canonical visual register source-of-truth
for all four marks. Consistency is a decision made once, held everywhere.

### Favicons travel as a system.

Three products — roadmap, analytics, studio — now share a favicon
architecture derived from the same design logic. The marks read at 32px.
They read at 180px on a home screen. They're the same decision at every
size.

### Security headers closed across all four products.

HSTS, X-Frame enforcement, and CSP report-only landed on every
next.config in the suite simultaneously. The suite operates as a
coherent security boundary, not four independent decisions. Nothing
visible changed. That's the point.

### hello@signalstudio.ie

Domain verified. Google Workspace connected. The address is real.
DKIM generation still owed — the key needs to be created in the Admin
Console before the suite has a fully authenticated sending identity.

---

*Everything important. Nothing distracting.*
