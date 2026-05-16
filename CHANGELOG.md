# signal studio. — the dispatch

The umbrella dispatch. The four products keep their own; this one
carries what coalesced across the suite. Convention: BRAND.md §6.5.

## 2026-05-16 · S·54 · ships · the marketing plan becomes an operating tool

**Signal HQ has a new section — /hq/marketing — that turns the
six-month plan from a deck into the surface the work runs on: one
hundred approaches, each cleared by the three-director panel, every
one now holding state through the founder's weekly rhythm.** It shipped
in two passes the same day — first the hundred, bucketed by strategic
role and ranked by leverage on the negative-CAC engine; then the
rebuild from a read-only library into a tool. Five modes: ideas,
filterable, each approach carrying a status; this week, the Monday
queue that refuses to exceed seven; timeline, the M1–M6 sequence as a
board; engine, the live Venue Edition funnel read from the same source
the partners page uses, with the seventy-five-percent single-buyer line
drawn as a guardrail rather than a footnote; and a ledger that keeps
what shipped or died, and why. The relational join that would need a
database is not faked — the funnel is read, the outcome is logged by
hand. The surface names its own concentration risk on the page, because
a tool that flatters the operator is worse than no tool.

## 2026-05-16 · S·52 · ships · the suite prints itself

**Signal HQ can now export six documents as PDF — one for each product,
one for the brand, and the six-month marketing plan — every one its own
file, every one built to hold up on paper.** White page, one indigo
period, and each product's gesture rendered as a typographic mark, never
an icon: a still dot for Tasks, a short rule for Roadmap, three arrested
dots for Analytics, a cursor bar for Notes, faint rings for the umbrella.
The marketing plan stays single-sourced from the live deck, so the
exported file can never drift from what's presented. Export runs through
the browser's own print path — vector text, embedded type, true flat
indigo — with no second rendering engine to disagree with the first. It
opens from a new one-pagers hub in the HQ nav. What's left off each page
is the point: no screenshots, no feature grids, no calls to action. The
restraint is the brand.

## 2026-05-16 · S·50 · ships · signal hq answers before it reports

**Signal HQ now opens with one mechanically-derived sentence and the
single next action — not a wall of equal-weight lists — and the 2,513
lines of legacy dashboard the code itself called fiction are gone.**

The masthead led with a phase headline and four equal-weight numbers:
"needs you" sat at the same visual weight as "atlas entries drifted",
and the one question that decides the next six months — are we winning
— was a static integer. It now leads with a verdict: a single sentence
resolved by pure function from inbox + pulse + traction, with the one
action beneath it and the exact inputs one click away. It is derived,
never authored — the moment it reads like prose instead of a computed
judgment it has become the fiction it replaced. With nothing sold and
no venue signed, it says exactly that, and the action it surfaces is
contact venues. The dashboard cannot move that number; it can refuse to
hide it.

Traction gained the one temporal element it was missing: a hairline
burndown against the ratified six-month clock — actual fill, a tick at
the pace you'd need to be on today, the M3 gate marked. Type and
hairline, no chrome; honest at zero. Inbox and Pulse stopped saying the
same thing twice — Inbox is now human-decision only, Pulse is
system-decay only, and no source appears in both. The System
disclosure — a 1,906-line dashboard with synthetic readiness
scorecards behind a fold — was deleted, not folded deeper; the genuine
reference surfaces already live at their own routes. Net for the cycle:
2,443 fewer lines. Restraint was the brief.

## 2026-05-16 · S·44 · ships · the tasks digest is no longer a blind spot

**HQ used to carry a permanent hardcoded warning that the Tasks daily
digest was unmonitored — true, but a nag, not a signal. It is now real
cross-repo monitoring.** The Tasks 09:00 UTC digest pings Studio when
it finishes, exactly the way the analytics cron already does — same
hardened, allowlisted, fail-silent caller, written as a deliberate
line-for-line mirror so the two stay honest. Studio's cron ledger now
accepts `tasks_digest` alongside `analytics_daily`, and the inbox,
pulse, and Today surfaces derive its health from real run data instead
of a constant. The hardcoded "tasks digest unmonitored" pulse line is
gone; in its place is a true health signal that reads honestly as
`never` until the Tasks side's ping env is set, then self-heals to
green on the first run after. The cross-repo-writer atlas entry was
re-verified and now documents this third instance and the consistency
discipline it tightens. No behaviour change to the digest itself —
this is observability, and observability never breaks the thing it
watches.

## 2026-05-16 · S·43 · tightens · the brand page now tells the truth about its own system

**A brand page that documents retired gestures and breaks its own
"one indigo" rule is not world-class — /brand did both.** It still
described the analytics gesture as a "2.4s scope-style squash" and
tasks as "paired beats, tap-tap" — the exact pre-canon vocabulary
retired suite-wide in S·39/S·41 — while the live specimens (correctly)
animated the new canon. The spec labels said "tick · 2.4s" over a dot
doing the 3.6s discrete-jump. Fixed: the M·01–M·05 catalogue is now
DESIGN.md §5 canon (broadcast = *once*, pulse breathes 2.6s, sweep
5.4s, tick snaps 3.6s, caret 1.1s). The signal wordmark's `is-live`
looped the broadcast `infinite` — broadcast is a one-shot; it now runs
once like `is-intro` (the hero + MotionSpecimen were perpetually
broadcasting). And the page that preaches "one indigo, no second
colour, boring on purpose" was using a rust refusal-list palette
(`#b34e2f`/`#fbe7df`) and a generic-SaaS green status dot
(`#4ade80`) — both now monochrome / indigo, which *is* the restraint
the page argues for. Plus precision: the indigo contrast claim was
wrong (`5.7`→`6.3` actual), living-document date bumped to the
motion-vocab ratification. The page no longer contradicts the system
it documents.

## 2026-05-16 · S·41 · tightens · the analytics tick is now canon on *every* studio surface, not most

**S·39 fixed two analytics-gesture surfaces and claimed the showcase
told the truth — it still lied on two more.** Live-verifying the prod
CSS (not grepping a keyframe name) caught it: `signalstudio.ie` was
still serving the 2.4s glide because the homepage *settled product
rows* (`.reveal-product-row[data-key="analytics"]`) and the entire
`/pricing` gesture demo (`pricing-tick`) each carried their own copy
of the old `2.4s var(--reveal-ease-glide)` scaleY squash. The Studio
repo had **four** analytics-tick surfaces; S·39 only conformed one
(plus the wordmark). All four now run `3.6s steps(1,end)` discrete
sample-jumps, matching the live Analytics product and DESIGN.md §5;
the `scaleY(1.45)` squash fingerprint is gone from the repo entirely;
the canonical Wordmark docstring corrected (2.4s→3.6s). Lesson, twice
over: a name-presence grep is not conformance — verify the rendered
declaration on every surface, and "I fixed it" is not "it is fixed"
until the live bytes say so.

## 2026-05-16 · S·40 · ships · the marketing plan is now torn out of the brand book

**The private /hq/plan deck was a competent scrolling document; it is now
the Brand Book §11 pitch system, running for real.** Every slide is a
true 16:9 frame on the book's faint gridded page, carrying the same four
corners on every slide — kicker top-left, ref top-right, the wordmark
with its indigo dot bottom-left, slide number bottom-right. That chrome
is the binding. Three palettes only, cycled and never mixed: paper is
the default, ink is the divider and nothing else, indigo is the closing
slide and nothing else. The eight documented templates are honoured —
title anchored low, ink chapter dividers with the giant indigo numeral,
the big-statement slide with its indigo-pip kicker, the three-figure
metrics row with hairline rules, the closing on its inverted paper
period — and extended, faithfully, with a content frame (ledger, defs,
figures) that stays inside the same chrome, mono labels, hairlines, one
indigo, so a living strategy document loses nothing the eight templates
can't carry. Type is held at the projection floor and the densest
slides (a six-row sequence, five-row channel ranking) were tuned until
they clear the chrome with air to spare — verified slide by slide in a
headless pass at 1440. Slides cut; they never fade, push, or build
(§11.01.6) — the lone motion is the cover dot settling once, removed
under reduced-motion. Presenter affordances survive intact: keyboard
nav, contents, the full plan as one document in read mode, fullscreen.
Tokens are pinned locally to the book's exact values so the deck reads
as torn out of it regardless of theme, and sit inside the white/zinc
lock. Source of truth unchanged: docs/MARKETING_PLAN_6MO.md.

## 2026-05-16 · S·39 · tightens · the brand showcase now tells the truth about the analytics gesture

**On the suite's most-seen brand surfaces — the homepage reveal, /brand,
and /pricing — the analytics dot was doing the wrong gesture entirely.**
Canon (DESIGN.md §5) defines analytics as `tick`: the dot *jumps* between
discrete sample heights, `3.6s steps(1,end)`, never gliding between them —
the gesture means "discrete samples, not a continuous signal". The live
Analytics product implements exactly that. Studio's showcase did not: both
`reveal-analytics-tick` and `brand-analytics-tick` ran a `2.4s` scaleY
squash-stretch on an ease-glide — a blink, not a tick. The flagship was
misrepresenting one of the five gestures it exists to demonstrate. Both now
mirror the live product: `3.6s steps(1,end)`, discrete translateY jumps.
Also retired the dead `.studio-mark` / `studio-dot-pulse-slow` "settle/breath"
block — pre-v1 vocab, zero DOM references, superseded by the conformant
`.brand-mark` (the live wordmark's signal variant is correctly the one-shot
M·01 broadcast). Reveal rows are independent infinite loops, so the timing
change does not desync the choreographed entrance. Suite re-swept: all five
products' own-mark gestures conform; retired vocab at zero.

## 2026-05-16 · S·38 · ships · the venue pipeline starts with fifty real names

**Signal HQ's prospect CRM now opens on fifty verified Irish hotels
instead of a single placeholder row — the Founding Venue Programme finally
has a pipeline to work, not a shape to fill.** Three parallel research
passes (luxury, Dublin, regional) were compiled, deduplicated, and
verified against official hotel sites, then prioritised by the inbox that
actually buys: events@ / weddings@ / sales@ over generic info@. Seven
generic-only inboxes are flagged in-row for phone-first warm-up. The list
lands two ways — a mail-merge-ready CSV at
`signal-growth/outbound/ireland-top-50-hotels.csv`, and the HQ seed
itself, so the prospects surface renders the fifty on first load. Existing
operator sessions get the standing "Load repo version" prompt (seed
timestamp bumped); browser-edited CRM state is never overwritten silently.
No outreach has been sent — this is the list, ready.

## 2026-05-16 · S·25 · ships · one gesture per product, the same word everywhere

**The per-product motion vocabulary now reads identically in code, CSS,
and prose across all five repos — and it's live on every production
domain.** The brand guide Ethan handed over was reviewed closely: most of
it was already canon, so this was a conformance pass, not a rebuild. The
one genuine fork — the guide's warm Stone neutral ramp — was held back,
white-locked, because that decision had been ratified three times
including the same day. Everything else landed. Tasks' dot stopped saying
"heartbeat" and started breathing (pulse · 2.6s · ease-in-out). Roadmap
stopped "settling" and started tracking time left to right (sweep · 5.4s).
Analytics kept the name "tick" but finally moved like one — discrete
steps, never a glide. Notes' dot became a held cursor (caret · 1.1s).
Studio's broadcast was already right. Old vocabulary — advance, settle,
heartbeat, the Tasks-era tick — is fully retired from product code, with
the homograph traps (tickets, caret-color, the HQ pulse feed, settled
state) left untouched by design. Verified on all five live domains:
new keyframes present, old vocabulary at zero, neutrals still white.

## 2026-05-16 · S·37 · ships · the venue pays now, and the whole site says so

**The Venue Edition reversed from a gift to a price, and until today the
site still described the gift. The pricing page now carries the venue
tier as patronage — paid once a year, founding venues holding fifteen
hundred for as long as they stay — and the workspace tier can be paid by
the year. The venue page no longer says "free" anywhere; it states what
a venue pays, with a straight back. Behind the copy, the dashboard
finally counts the thing that decides the next six months: cash a paid
venue actually put in the door, not couples mistaken for revenue. Zero
is still zero, shown plainly — but when it moves, it will be the true
number.**

A venue closes on a conversation, not a checkout. There is deliberately
no public button to buy a four-thousand-euro plan — a storefront priced
like that would be the exact register this brand refuses. The operator
records a paid venue when the money lands, and only then does it count
as money.

One quieter correction rode along: the pricing page claimed two of the
four products were still in build. They have been live for days. Saying
a shipped thing is unbuilt is its own kind of untruth, so the page now
tells the truth, and a single reference file was written so the
marketing work to come can be checked against what is actually live
before it ever reaches a reader.

Owed to the operator: the dashboard's new venue fields need applying to
the live database, and the yearly workspace option needs its checkout
path finished on the product side.

## 2026-05-16 · S·24 · tightens · the marketing deck to the brand it argues for

**The ratified six-month plan lived in a private HQ deck that was
restrained but generic. It now wears the brand it is asking the
company to hold. Every heading is lowercase Geist at the lighter
weight; every titled statement lands on its full-stop and that
full-stop is indigo, because the dot is the mark. The cover rings
send outward once and rest, the way the umbrella gesture is supposed
to. Active states are a dot that arrives, not a colour that
brightens. The neutral stays white — the new guide's warm paper was
considered and declined for working surfaces. Nothing in the plan's
words changed; the deck simply stopped contradicting them.**

Verified by reading the rendered styles back rather than a
screenshot — this page class defeats the capture tool, an old ops
truth — so the proof is the computed values: the title is the right
typeface at the right weight, the period is the right indigo, the
gesture is wired, the page is white. Shipped to production behind the
HQ gate.

## 2026-05-16 · S·23 · ships · the mission control a sole founder actually opens

**Signal HQ was a beautifully-built wiki with three competing
"what matters" surfaces and a six-tab browse layout fighting its own
job. It is now one scrolling page that answers four questions in the
order a sole operator asks them: what needs me (Inbox), is anything
on fire or rotting (Pulse), are we winning (Traction), what is the
state of things (System, collapsed). Pulse derives entirely from
sources HQ already read — repo silence thresholds, cron health, a
high-impact-risk filter, atlas-drift age — and names its own blind
spots instead of rendering a false green. Traction reads Studio's
own Turso DB (the same one `cron_runs` uses, zero new wiring) and
shows, for the first time, the only number that decides the next six
months: paid conversions against the €250k target. Zero is shown as
zero.**

The fiction is gone from the operator's view — the synthetic
readiness scorecards and the editable fake-metrics surface no longer
render. The whole spine converges on the atlas register and adopts
the new brand guide white-locked: sharper radius, flat
hairline-anchored shadows, fixed type ladder, one indigo, function
red used exactly once on a genuinely-critical signal. The guide's
gesture vocabulary was ratified suite-wide (pulse/sweep/tick/caret)
and its warm Stone ramp was rejected for product use — both recorded
in DESIGN.md. Build and typecheck clean; verified at 390 and 1440.

## 2026-05-16 · S·U4 · ships · the page a venue reads before it says yes

**The Founding Venue Programme had a campaign, codes, and a couple-
facing wedge — but no page that told a venue what it was being asked
to do. `/venues` is that page. It states the offer in the venue's
own terms: every couple gets a clear planning workspace for a year,
on the venue, co-branded as an eyebrow and not a logo wall, with
nothing for the venue team to install or run. It names the three
small asks — one conversation, a line of feedback, permission to
point to the work if it is good — and the rhythm: start, a soft
two-week window, one short retro. No deck, no demo gate.**

Built to the shipped `/weddings` grammar exactly — same hairline
sections, same ink CTA, same restraint — so a venue moving between
the couple page and the offer page never feels two hands. No
fabricated product shot: a hairline "what's included" panel does the
work a fake hero mock would, the way the suite is supposed to.

Behind it, quieter work that earns no dispatch line of its own but
holds the position: the wedding demo script re-aligned to design-
system v1 (the warm-stone-and-gold draft predated the paper-white
lock); the Notes extract-permission contract written so decisions,
risks, and summaries can leave a note the way actions already do —
without the raw note body ever crossing; the six shared objects
moved from described to modelled; and a cross-repo symbol guard so
"this looks dead, delete it" has to prove itself across all five
repos first. The thing that nearly dropped a live writer in May now
exits non-zero before it can happen again.

## 2026-05-15 · S·U3 · cuts · the retired tagline off the page that explains the company

**The third home of "cut through the noise." — and the one that
stings. S·U2's dispatch said the sweep "closes the known retired-
line instances." It did not. The sweep grepped case-sensitively for
"Cut through the noise" and never saw the two lowercase ones on
/about: the page's own SEO description and the body sentence that
declares the suite's purpose — "Four products. One register. One
job: cut through the noise." The /about page, the place a wedding
planner goes to find out what this company is, stated the company's
one job as a tagline the brand had retired. Found by actually
reading /about at phone width — not by trusting last turn's
"exhaustively clean."**

Both now read "One job: show you what matters." — which is what the
next sentence of that same paragraph already says the products do,
so the page is now coherent with itself and with the current thesis
(operating principle "Everything important. Nothing distracting.";
positioning "Project management for the 80% not in tech."). A
case-insensitive sweep across all five repos confirms these were the
last two; tasks/roadmap/analytics/notes are genuinely clean (every
remaining hit is a sanctioned strikethrough or "no agent, no
copilot" refusal). typecheck + build clean; verifying live.

The honest lesson, logged so it stops recurring: a case-sensitive
grep is not an exhaustive sweep, and "I verified" stated without the
exact command run is how the same line survived three cycles
(S·U1 title → S·U2 pricing → S·U3 /about). The catch-net only works
if the net has the right mesh. Same-session pixel-walk also
re-confirmed /weddings, /principles, /work world-class on phone — no
manufactured fixes; those surfaces were sound.

**S·U1 fixed "Cut through the noise." in the homepage title — but
the same retired line (BRAND §6 killed it on the 15th) was still
the closing headline of the pricing page. The last thing a wedding
planner or a tradesperson read before deciding whether to pay was a
tagline the brand had already disowned. It was the only surviving
user-facing instance in the repo, and it was on the highest-intent
surface there is.**

The pricing page now closes on the operating principle —
"Everything important. Nothing distracting." (BRAND §2) — sanctioned
canonical language, declarative, and a stronger close than a retired
slogan or a lazy echo of the H1. Found by pixel-walking the live
public surfaces at true phone width, the discipline T·58 forced:
the line was legible even in a 90px-wide full-page thumbnail, which
is exactly why "voice-verified" never substitutes for looking at
the rendered page. typecheck + build clean; verified live on
signalstudio.ie/pricing at 390 and desktop. Honest scope: this
closes the *known* retired-line instances; the broader phone-width
pixel audit of every public surface (proof / weddings / audience
pages) is real remaining work, named not buried — gross breaks
ruled out (zero horizontal overflow, single-column structure sound)
but a section-by-section readable-zoom pass is its own cycle.

**Two discipline gaps on signalstudio.ie, both on the surface every
visitor sees first. The browser tab, the Google result, the shared
link still read "Cut through the noise." — a line BRAND.md §6 retired
on the 15th in favour of "Project management for the 80% not in
tech." The most-shared string about the brand was contradicting the
ratified positioning. And the homepage itself only ever asserted: a
manifesto about "less", then four wordmarks. The single strongest
piece of evidence — the concrete, dated wedding scene — was one nav
click away, and most visitors never took it. The front door asked
for belief without ever showing the work.**

The title and social card now carry the ratified line. And a new
beat sits between the manifesto and the four-product stack: one real
Tuesday, told in the same restraint as the rest of the page — no
mockup, no chrome, just a mono time-stamp and a plain sentence. The
venue call. That evening. Midnight. 6 am. It is the same scene as
/proof — Sarah and James, the 26th of September, the florist quiet
eight days — so the site holds one story, not a teaser that drifts
from the page it teases. The manifesto says "less"; this shows what
less looks like in a real life, then hands to the tools that did it.

The honest counter-argument, on record: the umbrella's job could be
purely voice-setting, with each product demonstrating itself and
/proof as the dedicated scene — and a deliberately spare reveal can
be diluted by adding a demonstrative beat. The mitigation is the
register: it stays type-only, declarative, reduced-motion and no-JS
safe, the same gesture grammar as the manifesto it follows. If it
ever reads as "a SaaS landing page with a mockup", it has failed and
should come out. Typecheck and build clean. Full-page browser capture
is unreliable against the page's perpetual wordmark gestures; the
scene is verified server-rendered, desktop and mobile rules mirror
the manifesto's — an operator eyeball on the live deploy is the
honest last check, consistent with the suite's walk-it pattern.

**The same discipline failure R·U3 just closed in Roadmap was live in
Tasks, in a higher-traffic surface. The homepage demo toggle and the
/about grid offered a tech-company marketing board — pricing-funnel
audits, engineering headcount, all-hands — as a target audience,
sitting next to the wedding planner and the tradesperson. Toggle to
it and a non-tech visitor read the exact vocabulary alienation the
suite exists to refuse. It is gone.**

Tasks now presents only its four real audiences — BRAND.md §3's
canonical example set verbatim. The tech board survives only as the
invisible seed-structure skeleton every real domain overlays; no user
path reaches it. Emoji came out of the hero demo, the empty states,
and the comment thread seeded onto a fresh user's very first tasks
(which had led with "Hero animation looks great" and "Bumped this to
P1"). This is the §2.3 moat-watch working twice in one day: the same
drift, found in two products, closed the same week. The pattern to
internalise — the demo-vs-reality gap is the suite's recurring failure
mode, and it hides in the surface everyone sees first. Verified on
production, desktop and phone.

## 2026-05-15 · R·U3 · ships · Signal Roadmap's demo finally speaks to the 80%

**The moat is discipline sustained, and the demo had been breaking it:
Signal Roadmap was showing a wedding planner a software roadmap. The
public demo is now a real wedding plan — planner-voiced, dated, with
the milestone it's all building toward visibly getting closer. The
product says "this is for you" on first paint instead of asking the
80% to read a vocabulary that was never theirs.**

The front door changed with it. The hero shows the real product, not a
mock; `/demo` opens the wedding instantly; the landing carries one
honest narrative instead of duplicate marketing triads. This is the
moat-watch metric (§2.3) working in our favour: a planner can now
describe Roadmap back to us in their own words, because we finally
showed them their own work. Verified world-class on desktop and on a
phone. Suite chrome unchanged and consistent — same nav grammar, same
wordmark, same one indigo.

## 2026-05-15 · R·U2 · ships · Signal Roadmap stops being two products and starts being a map

**Signal Roadmap shipped its unification end to end. It was two
products wearing one nav — a fictional marketing landing bolted onto
the real viewer it shared nothing with. That is gone. A known-live
production blocker that denied 100% of writes (no Upstash) is closed.
And the two views that mattered most stopped being lists.**

For the 80%, a list is a spreadsheet; a map is a plan. Roadmap is now
a plain-English status flow a wedding planner reads at a glance.
Milestones is now a path — stations toward the day that matters, each
filling as the work ships. The delight is real progress made visible,
not decoration. Two P0s the first deploy left live (a banned "Timeline"
label, a stale-brand proof image) are closed. Held for the next cycle,
on purpose: the real viewer as the landing hero, and the landing's own
de-slop. The product is honest now; next it gets beautiful.

## 2026-05-15 · S·36 · ships · The umbrella hero leads with "Project management for the 80% not in tech."

**The signalstudio.ie hero H1 is now "Project management for the 80%
not in tech." (`80%` carries the indigo highlight), and the entrance
choreography resolves in ~2.4s instead of ~5.3s.** Operator-ratified
copy, confirmed twice — it reverses the 2026-05-14 line that retired
this exact string, and BRAND.md §2 is updated to match.

The motion pass applied speed-first animation principles. The headline
is server-rendered visible, so the old timeline left the page
motionless for 2.2s and the scroll cue didn't exist until 4.8s — it
read as frozen. Subhead fade moved 2.2s → 0.35s, typewriter 55ms →
28ms/char starting at 0.7s, stack rows 2.55s → 0.6s with the bounce
eased from `back.out(1.4)` to `back.out(1.1)`, brand gestures 2.85s →
1.0s, scroll cue 4.8s → 1.7s. Product stack spacing un-cramped
(line-height 0.95 → 1, row padding 4 → 7px). Reduced-motion path
unchanged. Dissent recorded: this narrows a four-product suite toward
Tasks' category; shipped per explicit operator instruction.

## 2026-05-15 · S·35 · cuts · The HQ seed steps back from 19 retired sections

**The fan-out claim in `HQ-6c.3` was that 18 sections had migrated to
markdown but the seed kept their type-shape "as a fallback". This
cycle removes the fallback — `HqData` no longer declares the 18
retired arrays, `seedHqData` no longer carries empty placeholders,
and `messaging` joins them by being read from `content/hq/messaging.md`
via a new adapter. The dashboard reads markdown directly with no seed
shadow.**

Retirement scope on `src/lib/hq/data.ts`: products, ecosystemFlows,
collaborationLoop, sharedObjects, accessRoles, collaboratorFirstView,
shareableArtifacts, features, launchReadiness, segments, campaigns,
contentItems, demos, templates, pilots, decisions, risks,
growthWorkflow — all gone from `HqData`. `messaging` gone too, now
wired through `getHqDashboardMarkdown()` via the new
`readMessagingAsDashboard()` parser (single-file shape, H2 sections +
H3 sub-pitches). `OperatingFocus` trims to four fields
(stage/weekOf/theme/focus); the priorities/risks/nextActions arrays
were stale duplicates of hq-today's active risks, the operator's
nextActions tab, and the inbox tier flags. `ScoreCard` (defined-never-
used) deleted.

`OverviewTab` gains a phase headline panel between the stage badge
and the operator-set theme — phase.md derives into the dashboard, not
just the Today block above it. `readPhase` exported + `cache()`-
wrapped in `today.ts` so dashboard + Today share one disk read per
request. `HqDashboardMarkdown` extended with `messaging?:
MessagingBank` and `phaseHeadline?: string`. RhythmTab Messaging Bank
panel reads from markdown with an empty-state pointer
("Edit at `content/hq/messaging.md`.") when the file is absent.

`hq-dashboard.tsx` cleanup follows: every `markdown?.X?.length ?
markdown.X : data.X` fallback collapses to `markdown?.X ?? []`; the
`SelectInput` editors for migrated sections (decisions, content,
demos, templates, collab-loop step, growth-workflow) replaced with
read-only status spans; `MIGRATED_KEYS` no-op list dropped (the
sections it warned about don't exist on `HqData` anymore); `MIGRATED`
warning console.warn dropped; `workStatuses` / `growthStatuses` /
`GrowthStatus` imports purged. `HqArrayKey` narrows to five operator
keys: prospects, metrics, feedback, weeklyRhythm, nextActions.
`signals.ts` `deriveHqState` reads markdown-only for the 9 retired
sections it consumed (operator surfaces still come from `data`).

Six one-shot migration scripts at `scripts/migrate-hq-*.ts` deleted
— they produced the 117 markdown files in `content/hq/*/`, git
preserves the pattern, the file system doesn't need them.

Net diff across the repo: **+492 / −1096 = −604 lines.** `data.ts`
926 → 833. `hq-dashboard.tsx` 2104 → 1917. `npx tsc --noEmit` clean,
`npx tsx --test` 18/18 pass, `npx next build` green (24/24 static
pages, all `/hq/*` routes resolve). ESLint blocked by an upstream
`eslint-plugin-react@7.37.5 × eslint@10.3.0` compat error that
predates this work.

Decisions kept out of scope: `metrics` defers (13 seed values stay
display-only, header comment documents the deferral); CLAUDE.md
Mandatory Signal HQ Rule stays as written (the four-operator-surfaces
list is still the correct mental model — focus + metrics are
seed-bound but the rule's intent is unambiguous and rewriting for
elegance was refused); localStorage key stays `v1` (old browser
exports with retired fields will silently drop them on import,
acceptable). OverviewTab as a structural question — it now
visibly duplicates hq-today which sits above it — punts to the next
audit.

Per the S·32 rule, this is internal-plumbing work — no dispatch entry.

## 2026-05-14 · S·34 · ships · The atlas drift-trigger actually fires from siblings

**The fan-out claim in `S·25b` was overstated — sibling repos held a
verbatim copy of the studio script that resolved atlas content
against their own `REPO_ROOT`, so the entries list came back empty
and the hook silently no-opped on every commit. This cycle rewrites
the script around a fixed `STUDIO_ROOT` path, so all five repos read
one atlas and write one sidecar.**

Architecture decision locked in `docs/ATLAS_DRIFT_TRIGGER.md`: shared
write to studio's `content/atlas/_drift.json`, not per-repo sidecars.
The atlas itself is centralized in studio; drift is a property of
the atlas, not of the writing repo, so the sidecar belongs next to
the entries. `git add` is gated on `REPO_ROOT === STUDIO_ROOT` so
sibling commits never try to stage foreign files. End-to-end verified
in all four siblings: staging `briefing/triggers.ts` in `analytics/`
flags `analytics-daily-cron`; staging `actions/notes.ts` in `notes/`
flags `log-cycle-cross-repo-writer` and `turso-databases-and-reads`.

## 2026-05-14 · S·31 · tightens · A small polish pass closes the HQ cycle

**Four touches finish the HQ v2 cleanup: the Vercel deploy-failure
source lands in the inbox aggregator with a graceful no-env
fallback; a five-step type ladder lands as named classes in
`globals.css` for future use; the drift-sidecar git policy is
decided (in-git, auto-staged); and `content/hq/README.md` catches
up with the actual shipped state.**

`readVercelDeployItems` in `src/lib/hq/inbox.ts` short-circuits on
missing `VERCEL_API_TOKEN` so the source is safe to ship before the
env is set. Per-project polling reads the Vercel deployments API
for failures in the last 24h, classifies each as high tier (deploy
failure is a real signal), 5s `AbortSignal.timeout` so a slow
Vercel doesn't slow the inbox. When the env eventually lands, the
items appear automatically.

The type ladder (`.hq-text-xs / .hq-text-sm / .hq-text-base /
.hq-text-md / .hq-text-lg`) ships as named classes but doesn't
migrate any existing call sites. Mixed `text-[XXpx]` inside
`hq-dashboard.tsx` stays — touching it now is polish-over-functioning
code. New code adopts the ladder; old code stays until something
else takes it.

The drift-sidecar policy went in-git: the studio-side script
auto-stages `content/atlas/_drift.json` so drift travels with the
PR/commit that caused it. Cross-repo runs (Tasks/Roadmap/Analytics/
Notes) write to the studio working tree but skip auto-stage — the
studio operator picks it up next time. Decision documented in
`docs/ATLAS_DRIFT_TRIGGER.md`.

`content/hq/README.md` got the freshness update — the staged
migration sequence (HQ-6a/-6b/-6c.1/-6c.2/-6c.3/-6c.4 → S·24) is
now a single coherent narrative instead of "deferred to next
cycle" leftovers, and the tests sub-section explains how to run
them.

Closing carry-forward: the page-weight optimisation (lazy-load
markdown per active tab) is **dropped** after honest weighing —
trading 160KB on first paint for 50–200ms per tab switch is
backwards for an internal mission control where tab-switching
dominates. The 193KB total is fine. The deferral on the previous
plan stays a permanent decision.

---

## 2026-05-14 · S·32 · tightens · The dispatch separates from the engineering log

**Two artifacts now, two audiences. The per-repo `CHANGELOG.md` files are
the engineering log — kept jargon-fluent for future-Ethan. The new
`content/dispatch/*.md` collection is the dispatch — operator-voice, four-
line cap, banned-words extended to file paths, function names, type names,
library names, hex codes, and anything inside backticks. Same shipped work,
two registers. What gets sent, not what accumulates — now structurally.**

`BRAND.md` §6.5 codifies the split with two new paragraphs: "Engineering
log vs dispatch (clarified 2026-05-14)" establishes the two-artifact
discipline; "Banned in the dispatch (extended)" enumerates the exact
identifiers that never appear on the public surface. The public reader at
`src/lib/changelog.ts:readDispatchEntries()` now walks `content/dispatch/*.md`
(one entry per file) instead of parsing the umbrella `CHANGELOG.md`. The
legacy parser branches that handled pre-2026-05-14 entry shapes are gone
— the dispatch directory only carries new-convention entries, so the
simpler shape wins. The `DispatchEntry` type tightens to `{date, verb,
headline, boldLead, body}` — `cycleCode` and `isLegacy` are no longer
needed on the dispatch surface (cycle codes belong in the engineering log
header only, where they remain the grep target).

Four worked dispatch entries seed the surface: status badges drop the
stoplight (`S·21`), the dispatch learns its name (`S·15`), paper turns
white (2026-05-13), and real checkout opens across the suite (the
entitlements sprint). Each one stays inside four body lines under the
bold lead — the discipline that keeps the two artifacts honest. Internal-
plumbing beats (`S·22-S·25`, the markdown migration, the seed empty, the
drift-trigger fan-out) intentionally stop at the engineering log; the
cadence rule says silence is also brand.

`/changelog.rss` now mirrors the dispatch — same content, same operator
voice, no double-source. The feed's channel title is "Signal Studio — The
dispatch" pointing at `signalstudio.ie/dispatch`. Per-product footers
(Tasks, Roadmap, Analytics) and per-product `/changelog` redirects (Tasks,
Roadmap) updated to point at `/dispatch` directly — skipping the double-
hop through `/changelog` that lingered from `S·15`. Label "Changelog"
becomes "Dispatch" in the Resources column across three product repos.

**What's not done.** Same-day dispatch entries sort alphabetically by
filename, not by ship-order — when many entries land in one day the order
won't reflect chronology. Low priority. Notes has no marketing footer
yet, so the Dispatch link is missing there; lands when Notes grows one.
The dead-code purge in `changelog.ts` also retired `readChangelogSections`,
`Entry`, `Section`, and `parseChangelog`. No other readers existed.

Typecheck clean across all four repos. The dispatch surface (`/dispatch`
+ `/changelog.rss`) verified in browser against the four seeded entries —
three-element header (date · verb in indigo), bold lead in larger weight,
body prose below.

---

## 2026-05-14 · S·29 · reads · The HQ rules catch up to the empty seed

**The Tasks repo's `AGENTS.md` rule that says "update `src/lib/hq/data.ts`
before the task is complete" was lying — the seed has been empty since
`S·24`. The rule is rewritten as a routing table pointing at the right
`content/hq/<section>/*.md` file per change type.**

`content/hq/README.md` gains a new paragraph naming the four
localStorage-forever surfaces (prospects, feedback, weeklyRhythm,
nextActions) so future maintainers know which arrays not to migrate.
The `/method` audit was scoped — the route doesn't exist in the studio
repo (memory references were stale). Type-ladder consolidation was
deferred as polish-over-functioning-code.

---

## 2026-05-14 · S·28 · tightens · The HQ inbox grows two more sources, and a way to quiet it

**`/hq` now flags session response failures (rows with `ok: false` in
`~/.claude/state/log.jsonl`) as inbox items — high tier when 5+ in
seven days, mid otherwise. Every inbox row also gains a hover-revealed
dismiss button that hides it for 24 hours via localStorage TTL.**

Dismissals are honest about scope: the entry vanishes from the list
but stays counted in the tier-count summary line. A new client island
`HqInboxDismissable` reads + writes the dismissal map, drops stale
TTL entries on read, and renders nothing when the row's id is still
fresh-dismissed.

Deferred to next cycle: lazy-load markdown per active tab (real
surgery — needs `HqDashboard` broken into per-tab server components),
and the Vercel deploy-failure inbox source (needs a Vercel API token
env you haven't set yet).

---

## 2026-05-14 · S·27 · tightens · The HQ infrastructure earns tests

**The HQ markdown loader's parser and the inbox aggregator's finalize
step both get test coverage. 18 tests, all passing. `pnpm test` runs
them via Node's built-in test runner + tsx — no new dependency added.**

`src/lib/hq/markdown-parser.ts` was extracted out of `markdown.ts` to
lift the pure parsing functions clear of the `import "server-only"`
guard so they're testable. Same trick for inbox: `inbox-pure.ts`
carries the tier rank + finalize step.

Coverage focuses on what would actually break and stay broken: JSON
arrays surviving comma-in-string values, H2 section split,
date-descending sort with title tiebreak, tier rank ordering, date
ordering within tier, tier count totals.

---

## 2026-05-14 · S·25b · ships · Drift-trigger reaches all four product repos

**Roadmap, Analytics, and Notes each get a copy of
`scripts/atlas-drift-check.ts` + `.githooks/pre-commit`, joining Tasks
(`S·22`). All four product repos now flag drift on the studio atlas
when their staged files match a referenced path. Activation per repo
is one git-config command.**

Same cross-repo shape as the Tasks fan-out: `ATLAS_REPO_ROOT` env
override, auto-stage gated on `REPO_ROOT === ATLAS_REPO_ROOT` so
cross-repo runs leave the studio sidecar uncommitted for the studio
operator. Smoke-tested all three with empty staged files — silent
exit, ready to fire on the first real commit.

---

## 2026-05-14 · S·25a · reads · /hq finishes its visual register cleanup

**The remaining BRAND.md §5 offenders in the HQ dashboard fall.
`ScoreBar` drops the rounded stoplight progress bars for a tight mono
number + 1px hairline meter (indigo only when score < 30). `Panel`
sheds its `rounded-[8px] border bg-bg-elev shadow-1` className inline;
`.hq-panel` carries the visible style cleanly. The red blocker
callouts switch to the indigo-bar register.**

`updateItem` now refuses to write localStorage edits for the 13
migrated sections — silent writes that the next render would ignore
aren't a bug worth tolerating. A console warn surfaces the no-op so a
curious operator sees why the click didn't persist.

The dashboard now passes every BRAND.md §5 visual rule that's
applicable to an internal surface.

---

## 2026-05-14 · S·26 · tightens · The umbrella reads on a phone

**Every route on signalstudio.ie now fits the phone it's read on. The
site-wide horizontal scroll is gone, the nav collapses to three items
under 640px, the venue-redeem CTA is a full-width pill, the H1 leading
no longer collides with its own descenders, and the 404 on /dispatch
is fixed. Twenty-three findings from a 32-row mobile audit, shipped in
one cycle.**

A walk of the live site at 390px and 375px surfaced thirty-two
findings — five P0 (broken-on-mobile), seven P1 (conversion-critical
tap targets), and twenty quality issues. They bundle into one mobile
pass because most of them are the same disciplines (typography,
breakpoint hygiene, hit-area arithmetic) applied across surfaces.

The load-bearing fix: `html, body { overflow-x: clip }` plus the nav
collapsing to `wordmark · Products · Pricing · Contact` below the
`sm:` breakpoint. The nav was 415px wide inside a 390px viewport,
which had been forcing every route on the umbrella to scroll
horizontally. The four hidden links (Work, Proof, About, Brand) all
remain in the footer.

The Products switcher repositions to viewport-edges on mobile (`fixed
left-4 right-4 top-[64px]`) rather than anchoring to its button — the
old `absolute right-0` rendered the popover 98px off the left edge at
375px. On desktop the original anchoring is preserved via `sm:`
overrides.

The H1 leading on `/pricing`, `/brand`, and `/weddings` was clipping
descenders into the next line: `line-height: 0.96` works at 132px
display, breaks at 45px mobile. A `@media (max-width: 640px)` block
loosens `.h-display`, `.h-title`, `.h-section`, and `h1` to ratios in
the 1.04–1.18 range. Display-tight desktop register preserved above
640px.

`/redeem/[code]` — the venue-pilot conversion surface — got the
biggest single jump. The "Claim your seat" CTA went from a 157×47
centered link to a full-width 342×54 pill at 17px. The code itself
(`LAMBSHIL-UPNA2`) jumped from 11px gray to 14px tabular-nums on its
own line, with `Code` as a separate eyebrow above. Two changes, one
flow that's no longer easy to miss when read off a printed card.

Tap targets got swept across the suite. Footer socials went from
14×14 (untappable) to 44×44 hit areas with the visual icon centered
inside. Footer legal links went from 17px tall at 11px font to 32px
tall at 12px font with `inline-flex` padding. The /brand asset
download/open pills went from 25px to 40px. The /about product rows
went from 34px to 56px minimum height. The /pricing tier CTAs got the
biggest treatment: a new `.pricing-tier-cta` class that renders as a
solid full-width pill (48px tall, indigo for recommended, ink for
others) on mobile and reverts to the restrained inline-link with
underline-on-hover on desktop. Same anchor text, two different
registers.

`/pricing` also gained mobile-specific shape changes: the comparison
table is `hidden md:block` — it was 760px wide in a 340px scroll
parent with no sticky first column, and the tier cards above already
carry the primary info. Workspace ("Most chosen") is promoted via
`order-first md:order-none` so it stacks above Free and Student on
mobile.

`/dispatch` was returning a 404 in production despite the page file
existing. The cause was `readDispatchEntries()` calling
`fs.readFile(process.cwd() + "/CHANGELOG.md")` from a Vercel
serverless function, where `CHANGELOG.md` wasn't bundled. The fix is
one block in `next.config.ts`: `outputFileTracingIncludes` pinning
CHANGELOG.md into the `/dispatch` and `/changelog.rss` function
bundles.

`/contact` gained an `<h1>` (it had only a metadata title before).
`/brand` got `loading="lazy" decoding="async"` on all 18 inline asset
images, and the wordmark + motion grids now step `grid-cols-2
sm:grid-cols-3 md:grid-cols-5` instead of the 1→5 jump that left
mobile as a tall single column.

A11y polish: `viewport-fit=cover` added so iOS notches get
`env(safe-area-inset-bottom)` honoured (footer now pads against it).
The CSP `upgrade-insecure-requests` directive — which is ignored in
report-only and was spamming the console — got removed.

What didn't ship in this cycle: the /changelog (now /dispatch)
collapse-with-TL;DR pattern (#16 from the audit). That page is 58,615
pixels tall on mobile because the entries are dense narrative — the
brand voice, not bloat. Tightening it deserves its own design call,
not lumping into a hygiene pass.

Tier-by-tier findings table is in the audit transcript. Typecheck
clean. Build clean. Verified at 390px and 375px via Playwright before
commit.

---

## 2026-05-14 · S·25 · tightens · The grouped HQ tabs read as one section, not three stacked sub-pages

**Pipeline, Proof, and Operations each carry one parent header now —
"Everything in flight, in one place.", "What the work is producing.",
"The operating system underneath." — and the sub-sections collapse to
a mono eyebrow above each block. The structural-only pass from HQ-5
(11 tabs → 6) is done.**

Each of the eight sub-tabs (`FeaturesTab`, `LaunchTab`, `CrmTab`,
`ContentTab`, `GrowthTab`, `MetricsTab`, `DecisionsTab`, `RhythmTab`)
gained an optional `embedded?: boolean`. When `embedded`, the
sub-tab swaps its full `SectionHeader` (eyebrow + 24px title + body
paragraph) for a single mono `SubEyebrow` label. The parent tab
renders one full `SectionHeader` once, and the children sit under it
in a `gap-10` grid. Visually the dashboard now reads top-to-bottom
as one register per parent tab — not three sub-pages stacked.

Voice for the three new parent headers follows BRAND.md §3 — plain
English, declarative, present-tense. The sub-block discriminators
("Feature tracker", "Launch readiness · NN% ready", "Outbound CRM",
etc.) stay visible as eyebrows so the operator can still orient.

Pure UI / register work. No data layer changes; the markdown loaders
and seed fallbacks untouched. Typecheck clean.

---

## 2026-05-14 · S·24 · cuts · The HQ data seed loses 99KB of dead prose

**`src/lib/hq/data.ts` drops from 2,361 lines to 926. The 18 migrated
sections — products, ecosystem flows, collaboration loop, shared
objects, access roles, collaborator first view, shareable artifacts,
features, launch readiness, segments, campaigns, content items,
demos, templates, pilots, decisions, risks, growth workflow — are
now `[]`. The markdown at `content/hq/<section>/*.md` is the only
source of truth. The localStorage-edited operator surfaces survive
intact.**

A small tsx script at `scripts/empty-migrated-seed-arrays.ts` does
the surgery — bracket-depth-tracked replacement of each array
literal with `[]`, run end-to-end against the seed. The four
operator-owned surfaces (`prospects`, `feedback`, `weeklyRhythm`,
`nextActions`) keep their seed data; they have no markdown source.
The `metrics` array stays (deferred — would need a real DB).
`messaging` is an object, not an array, and stays as-is.

The header comment at the top of the file now reads literally true
instead of aspirationally — *DEAD SUBSTRATE* sections are no longer
just labelled as dead; they ARE dead.

---

## 2026-05-14 · S·23 · tightens · signals.ts reads from markdown

**The HQ derived state (productReadiness, launchReadiness,
gtmReadiness, integrationReadiness, collaborationReadiness, the
balance scorecard, and the eight active-signals checks) all stop
depending on the seed. They read from the same markdown the
dashboard reads.**

`deriveHqState(data, markdown?)` now accepts an optional override
shaped like `HqDerivedMarkdownOverride` — a structural subset of
`HqDashboardMarkdown` covering products, launch readiness,
ecosystem flows, collaboration loop, features, content items,
demos, templates, and growth workflow. When a section's markdown is
present, the override wins; otherwise the seed survives as
fallback. Same pattern the dashboard tabs use via
`dashboard-data.ts`.

The OverviewTab's nine-dimension balance still reads honestly. The
active-signals checks (`distribution-lag`, `ecosystem-loop-early`,
`collaboration-loop-gap`, `too-much-wip`, `followups-overdue`,
`demo-gap`, `feedback-theme`, `review-queue`) fire from the same
data the dashboard renders. The seed can now be emptied without the
overview breaking — exactly what S·24 needed.

---

## 2026-05-14 · S·22 · ships · Drift-trigger fans out to the Tasks repo

**Edits inside `~/Projects/personal/tasks/` to any file an atlas
entry references will now flag the entry in the studio sidecar at
`content/hq/atlas/_drift.json`. The studio-side hook proved the
pattern; this is the first cross-repo writer.**

`scripts/atlas-drift-check.ts` + `.githooks/pre-commit` copied from
studio. Two cross-repo adjustments: `ATLAS_REPO_ROOT` env override
(defaults to `~/Projects/personal/studio`) so the script reads atlas
entries from the right place, and the auto-stage step is gated on
`REPO_ROOT === ATLAS_REPO_ROOT` — cross-repo runs leave the sidecar
uncommitted in studio's working tree for the studio operator to
pick up.

Activation is opt-in, same as studio: `cd ~/Projects/personal/tasks
&& git config core.hooksPath .githooks`. Smoke-tested live: a
staged edit to `tasks/docs/STRIPE_SETUP.md` correctly flagged
`pricing-and-entitlements` in the studio sidecar with the
tasks-repo path.

Three more product repos remain: Roadmap, Analytics, Notes. Each
follows the same shape — copy the two files, no script changes
needed (the env override is generic). Operator activates per repo
when ready.

---

## 2026-05-14 · S·21 · reads · Status badges drop the stoplight

**The HQ dashboard's coloured pill badges become restrained mono with
a single dot. Green, red, and amber stoplight colours leave the
surface. BRAND.md §5 wins.**

`StatusBadge` was the worst register offender in `hq-dashboard.tsx` —
a rounded `border` pill in `#047857` / `#b91c1c` / `#b45309` that
read as a Jira ticket-status indicator. Replaced with `.hq-status` — a
restrained inline grouping of one dot plus a lowercase mono label.
Four tiers map by meaning, not by colour: `alert` (indigo dot with a
soft halo, reserved for At risk / Blocked), `active` (ink-soft dot,
for things in flight), `done` (open ring on the dot, for Shipped /
Published / Done / Approved / Working / Clear), and `quiet` (default).

The visual moment that earns its keep is the indigo halo on the
`alert` tier — a single accent in a register that otherwise refuses
to colour-code. Everything else holds the line.

---

## 2026-05-14 · S·20 · cuts · The HQ data seed steps back into legacy

**`src/lib/hq/data.ts` becomes a transitional file. Eighteen sections
have markdown twins; the seed is now read-only fallback. The CLAUDE.md
Mandatory Signal HQ Rule rewrites to point at source files instead.**

Every strategic section in the dashboard now reads from
`content/hq/<section>/*.md` via the adapter at
`src/lib/hq/dashboard-data.ts`. The seed survives as type-shape
fallback for backwards compatibility, but the markdown wins when both
exist. A header comment at the top of `data.ts` names every section
as dead substrate or live operator surface or derived elsewhere — so
future readers know which lines to leave alone.

`CLAUDE.md`'s Mandatory Signal HQ Rule no longer instructs operators
to update `src/lib/hq/data.ts` after every change. It instead lists
the right source file per section (`content/hq/decisions/`,
`content/hq/risks/`, `content/atlas/`, `BRAND.md`, `phase.md`,
`CHANGELOG.md`). The contract finally matches the code. The dashboard
is the view, not the source.

The four operator-owned surfaces — `prospects`, `feedback`,
`weeklyRhythm`, `nextActions` — stay localStorage-backed. They have
no other source of truth; the browser is canonical for those.

---

## 2026-05-14 · S·19 · ships · /hq grows an inbox

**A new inbox sits above the Today block on `/hq` — a severity-tiered
queue of things that owe an answer right now. Atlas drift, cron
trouble, risks at-risk, decision reviews past due, stale atlas
entries, overdue prospect follow-ups. Clear is a valid state.**

`src/lib/hq/inbox.ts` is the server-side aggregator that walks six
real sources and classifies each into `high` / `mid` / `low`. High
tier is reserved for things actually broken — atlas drift, cron
red/never, risks marked At risk or Blocked. Mid is decisions and
risks needing attention. Low is stubs, stale entries, decisions due
for review. Strategy's HQ v2 audit named the inbox as the
load-bearing missing surface; this is the surface.

`src/components/hq/hq-inbox.tsx` renders the queue with the atlas
register — paper white, ink #111, indigo only on the high-tier dot,
hairlines between rows, no card chrome. A high-tier item carries a
soft indigo halo on its dot — the one motion-equivalent accent on
the surface. Rows linked to a destination get a quiet hover lift.
The clear state writes one line: *"Nothing owes you an answer right
now. Quiet is a valid state."*

Live on first load: four atlas-drift entries (the recent edits to
BRAND.md and the atlas itself), the analytics daily cron (never run
in dev), and risks at high likelihood × high impact. The dashboard
sits beneath, unchanged. The inbox is the first thing you read.

---

## 2026-05-14 · S·18 · ships · The dispatch gets its public surface

**`signalstudio.ie/dispatch` is the umbrella read for shipped work
across the suite. New entries render with the cycle code in indigo
mono, the verb tag in lowercase ink, and the bold impact-lead sentence
at the top of each body.**

The half-day slot strategy ranked third behind venue calls and HQ-5
(now both clear). A new route at `src/app/dispatch/page.tsx` reads
the same `CHANGELOG.md` the engineers ship to, and a new parser at
`src/lib/changelog.ts` understands both the new dispatch shape and
the older pre-convention shape so nothing gets dropped during the
transition. Legacy entries (anything before 2026-05-14) render with
a lighter chrome — date and headline, no cycle code, no verb tag —
visually deferring to the new shape without rewriting the past.

`signalstudio.ie/changelog` now 308-redirects to `/dispatch`. The
RSS feed stays at `/changelog.rss` for backwards compatibility with
any subscriber that's already set up — renaming the RSS endpoint
would orphan readers for zero brand gain.

**What's not done.** The parser is forgiving but not bullet-proof:
malformed headers (missing middle dots, lowercase product letters)
fall through to the legacy path rather than erroring. That's the
right default for a hand-authored log — better to render imperfectly
than refuse to render at all. The footer link across the four
product sites is still pointed at `/changelog`; those 308-redirect
correctly, but the next time those footers get touched, the URL
should update to `/dispatch` directly.

Browser verification not done in this session — typecheck clean.

## 2026-05-14 · S·17 · ships · /hq reads its strategic content from markdown

**The dashboard stops pretending to edit data that has a real source
of truth. Every Products, Features, Launch, Loop, Proof, and
Operations panel now reads from `content/hq/<section>/*.md` and shows
a "file-backed" indicator. Inline status dropdowns disappear in those
panels — updates happen by editing the markdown, not by clicking the
select.**

The bridge sits at `src/lib/hq/dashboard-data.ts` — eighteen adapter
functions that read markdown sections and convert them into the
typed shapes the dashboard already consumes. `/hq/page.tsx` reads
them server-side and passes the whole bundle through as a single
`markdown` prop on `<HqDashboard>`.

Inside each refactored tab the pattern is the same three-line check:
`markdown?.<section>?.length ? markdown.<section> : data.<section>`.
When present, render the `<FileBackedNotice>` and swap inline edits
for plain mono labels. When absent, fall back to the existing
localStorage behaviour. Additive, reversible, per-tab.

Page weight at `/hq` rose from 107KB to 175KB — sixty-eight kilobytes
of strategic prose now ship to the client through the prop. That's
the visible cost. The invisible cost was higher: a dashboard that
pretended to be source-of-truth while the source of truth lived
elsewhere.

What's still owed: HQ-6c.3 deletes the migrated sections from
`seedHqData` and removes the localStorage editor path entirely; then
HQ-6c.4 rewrites the `CLAUDE.md` Mandatory Signal HQ Rule so it
points at the source files. The rule lands last — the contract has
to match the code, not lead it.

---

## 2026-05-14 · S·16 · ships · /hq drops from eleven tabs to six

**The HQ dashboard's tab strip collapses from eleven tabs to six.
The five workstreams that lived alone — Features, Launch, Outbound,
Content, Growth, Metrics, Decisions, Rhythm — fold into three named
groups: Pipeline, Proof, Operations.**

The consolidation is mechanical, not magical. The eight retired tabs
each rendered as a self-contained panel component; those panels now
stack under their consolidated parent with `grid gap-8` between them.
No data migration, no component rewrite. The merge logic is
"they're already shaped right; just stop pretending they're separate
workstreams."

The map:

- **Pipeline** = Features + Launch + Outbound. Work in flight — to
  ship, to release, to prospects.
- **Proof** = Content + Growth. The evidence motion.
- **Operations** = Metrics + Decisions + Rhythm. The running-the-thing
  layer.

Today, Products, and The loop stay as-is. The `activeTab` state is
React-only, not persisted to localStorage — a fresh load defaults to
Today every time, so no migration risk for users with a retired tab
id stuck somewhere.

**What's not done.** This is the structural pass — HQ-5 closes here.
HQ-5.1, actually merging the data inside each consolidated tab into
a single organizing view (Pipeline-as-one-list-with-status-column,
Operations-as-single-table), is the follow-up. The current shape
gets the operator-velocity win without the rewrite cost; the deeper
merge can wait until the daily use surfaces what the right shape
should be.

Browser verification not done in this session — typecheck is clean
and the panel components themselves are unchanged. The risk surface
is purely the routing change, which is mechanical.

## 2026-05-14 · S·15 · reads · The changelog learns its name, and five verbs

**The suite's changelog gets a new name — the dispatch — and a
five-verb taxonomy that replaces Added/Changed/Fixed/Removed.
Pilot venues who land on `signalstudio.ie/dispatch` will read shipped
work in Signal's own register, not in library-maintainer scaffolding
borrowed from npm.**

**The name.** `signalstudio.ie/changelog` becomes
`signalstudio.ie/dispatch`. What gets sent, not what accumulates.
The file path stays `CHANGELOG.md` for tooling and muscle memory;
the document inside calls itself the dispatch. Per-product URLs
308-redirect to the umbrella.

**The five verbs.** `ships · tightens · cuts · holds · reads`. The
fourth one is the Signal-specific bet — a category for what the brand
chose *not* to build, and why. Every other product changelog buries
refusals inside a "Changed" entry or never writes them at all. The
brand brags about refusals on `/about` and `/method`; the dispatch
brags about them in the same register.

**The header line.** `## YYYY-MM-DD · X·NN · verb · headline`. Single
header line, middle-dot separated. Cycle code is grep target and
`phase.md` anchor — `T·09`, `N·05`, `S·15`. Headline grammar locked:
declarative present-tense, subject + active verb, no gerunds. "Paper
turns white" passes; "Improvements to performance" never will.

**The bold impact lead.** The body's first sentence is bold, written
for a pilot venue operator with ten seconds — not for future-Ethan
who has all night. If the bold lead can't be written in one breath,
the entry probably needs splitting into two.

**What the dispatch refuses.** Emoji and badge chips. Keep-a-Changelog's
Added/Changed/Fixed/Removed/Deprecated/Security. Semver. Audience-impact
pills. In-product "what's new" toasts. Cross-product interleaved view.
All refused on the same principle that runs through the rest of the
suite — scaffolding decays, voice doesn't.

**Strategy's dissent, preserved inside the rule.** The risk in adding a
verb tag and a bold lead is that the new scaffolding flattens the prose
voice already doing the brand's work. Mitigation: the verb is one
lowercase word at the end of a header line, invisible unless scanned
for. If after two cycles the tagging feels like overhead, drop the
verb and keep the name, the headline grammar, and the `holds` concept.
That's the floor.

**No backfill.** Entries before today keep their original shape.
Rewriting the past is the worse drift. The new shape starts here.

Convention locked at BRAND.md §6.5. The umbrella read-surface
(`signalstudio.ie/dispatch`) ships as a half-day slot after the next
cycle — not before venue calls, which beat changelog work on every
ROI axis.

---

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

## 2026-05-14 · Signal HQ v2 · dashboard starts reading from markdown (HQ-6c.2)

### Pattern proven. Three tabs flip. Eight to go.

HQ-6c.2 wires the dashboard to the markdown files HQ-6a/-6b/-6c.1
migrated. Products + Features + Risks now read from
`content/hq/<section>/*.md` when present, with a clear "file-backed"
indicator and operator-edit affordances hidden in those sections.

**Server-to-client bridge** at `src/lib/hq/dashboard-data.ts` —
adapter functions that convert generic `HqMarkdownEntry[]` shapes
into the typed shapes the dashboard already consumes
(`ProductStatus[]`, `EcosystemFlow[]`, `FeatureItem[]`,
`RiskItem[]`). `/hq/page.tsx` reads them server-side via
`getHqDashboardMarkdown()` and passes them as a prop to the
existing `<HqDashboard markdown={...} />` client component.

**Per-tab pattern, locked.** Each migrated tab does the same
three-line check at the top:

```tsx
const products = markdown?.products?.length
  ? markdown.products
  : data.products;
const isFileBacked = Boolean(markdown?.products?.length);
```

When file-backed: render the `<FileBackedNotice>` indicator with a
small indigo dot, hide inline edit affordances (the status dropdown
in Features becomes a plain mono label), point operators at the
markdown source. When not file-backed: fall back to the existing
localStorage behavior. Additive. Reversible. Per-tab.

**Loader parser fixed.** Migrated `majorFeatures` / `blockers` /
`nextActions` arrays contain commas inside string values
("(POST /api/notes-extract, Cycle 43, 2026-05-12)"). The frontmatter
parser used to comma-split blindly, which would have shredded those
strings into three fragments. It now tries `JSON.parse` first when
the value looks like a JSON array, falls back to comma-split for the
lighter syntax. Migration scripts emit JSON-form when any value
contains a comma. Arrays survive the round-trip cleanly.

**Page weight** went from 75KB to 107KB at `/hq` — the markdown is
shipping to the client via the prop. That's the cost; the value is
that the dashboard no longer pretends to edit data that has a real
source of truth.

**What's still owed.** Eight more tabs (Today's the Overview, plus
Loop / Launch / Growth / Outbound / Content / Metrics / Rhythm).
Each one follows the pattern above. After all 11 are flipped,
HQ-6c.3 deletes the seed entries for migrated sections and removes
the localStorage editor path. Only then HQ-6c.4 rewrites the
CLAUDE.md "Mandatory Signal HQ Rule" — the rule has to match the
code, so it lands last.

---

## 2026-05-14 · Signal HQ v2 · the remaining 14 narrative sections migrate (HQ-6c.1)

### Every strategic section in the seed now has a markdown twin.

HQ-6c.1 finishes the migration coverage. 74 more files written across
14 sections — products, ecosystem flows, the collaboration loop,
shared objects, access roles, the collaborator first view, shareable
artifacts, launch readiness scorecard, segments, content items,
demos, templates, pilots, and growth workflow.

**117 markdown files total now back strategic HQ content.** 22
decisions + 9 features + 7 risks + 4 campaigns + 1 messaging + 74
narrative entries = a complete file-backed mirror of every section
of `seedHqData` that has a real source-of-truth shape. The four
operator-owned sections (prospects / feedback / weeklyRhythm /
nextActions) stay localStorage. The `metrics` section is deferred.

**One parametric migration script** at
`scripts/migrate-hq-remaining.ts` handles all 14 sections via a
per-section config (titleField + bodyFields). The single script
beats 14 small scripts: less surface area, easier to extend with
the next section that pops up.

**Two more Today surfaces.** A four-product strip sits right under
the phase headline — each product carries its name (Signal Tasks /
Signal Roadmap / Signal Analytics / Signal Notes), its layer
(execution / direction / attention / context) in indigo mono, and
its current status + maturity %. A "live pilots" block sits beneath
campaigns showing the two active pilots (Founding Venue Programme,
Couples Private Beta) with status and a truncated next step. Both
read entirely from `content/hq/products/` and `content/hq/pilots/`.

**What HQ-6c.1 deliberately did NOT do.** No dashboard refactor
(the 11 tabs still read from seedHqData via localStorage). No
seed deletion. No CLAUDE.md rule rewrite. Those are HQ-6c.2,
HQ-6c.3, HQ-6c.4 — each gated on the prior. The rule rewrite is
the last move and must match the code, not lead it.

**The status now:** the seed and markdown are both valid sources.
Today reads markdown for products / risks / features / campaigns /
decisions / pilots. The dashboard tabs read the seed (with
localStorage edits on top). The two systems coexist until HQ-6c.2
flips the dashboard, and then HQ-6c.3 deletes the seed.

---

## 2026-05-14 · Signal HQ v2 · risks, features, campaigns, messaging migrate (HQ-6b)

### Today block starts answering "what should I worry about" in real time.

HQ-6b extends the markdown migration to the four most operationally-
useful strategic sections. 21 more files written. Today block grew
three new surfaces — risks at the top tier, features and campaigns
side-by-side beneath.

**Migrations shipped.** `scripts/migrate-hq-{features,risks,
campaigns,messaging}.ts`. 9 features + 7 risks + 4 campaigns + 1
messaging file at `content/hq/{features,risks,campaigns}/*.md` and
`content/hq/messaging.md`. Same pattern as the decisions pilot —
idempotent, seed-preserving, scriptable. Re-running overwrites.

**Active risks surfaced in Today.** A tier-coded dot (high/mid/low
from likelihood × impact) sits left of each risk title. Top 5
sorted by combined likelihood + impact float to the top. The first
thing visible above the fold once an operator scans past the phase
line: their five sharpest current risks, with area + status +
review date. This is the single biggest founder-value-add of the
HQ-6 sequence so far.

**Features in flight + campaigns in motion** sit side-by-side
beneath the risks. Features show the count of in-flight items
(In Progress / Built / Testing / Planned) plus a status histogram
and the top 3 high-impact-but-still-Idea entries. Campaigns show
the active ones with progress percentage. Both surfaces collapse
gracefully when empty.

**Messaging document model.** Unlike the array sections, messaging
became a single `messaging.md` with H2 sections (Positioning /
Ecosystem line / Founder story / Hooks / Pitches / Objections /
CTAs). The loader's `splitH2Sections` returns the named-section
map either way — the same `HqMarkdownEntry` shape carries one-file
sections cleanly.

**What's still owed (HQ-6c).** The remaining 14 narrative sections
(products, collaboration loop, shared objects, access roles,
ecosystem flows, launch readiness, segments, content items, demos,
templates, pilots, growth workflow, collaborator first view,
shareable artifacts) still live in the seed. HQ-6c migrates them,
refactors the corresponding dashboard tabs to read from markdown,
deletes the localStorage editor path, and rewrites the CLAUDE.md
"Mandatory Signal HQ Rule" so it points at source files. Then HQ-7
(inbox shape) becomes the final move.

---

## 2026-05-14 · Signal HQ v2 · decisions migrate to markdown (HQ-6a pilot)

### Strategic thinking moves from a 2,334-line seed to one .md per decision.

The HQ audit's load-bearing recommendation was to migrate the
localStorage-edited seed to file-backed markdown. HQ-6a is the pilot:
build the loader infrastructure, migrate the Decisions section
end-to-end, prove the pattern.

**Loader at `src/lib/hq/markdown.ts`** mirrors the atlas loader.
Reads `content/hq/<section>/*.md`, parses frontmatter (`id`, `title`,
`category`, `date`, `status`, `reviewDate`, `relatedObjects`), splits
H2 sections into a named map (`Decision`, `Reason`, `Alternatives
considered`, `Risks`, `Notes`), sorts by date descending. Server-only,
no dependency added.

**22 decisions migrated** via `scripts/migrate-hq-decisions.ts` —
idempotent one-shot. Each decision becomes a markdown file at
`content/hq/decisions/<id>.md`. The seed in `data.ts` stays in place
(safe until the dashboard reads from markdown for ALL migrated
sections — that's HQ-6c).

**Today block surfaces top 4 recent decisions** with date, title,
category, status. The first thing Ethan sees on `/hq` now is the
active phase line followed by the four most recent strategic
decisions. The atlas pattern is the bar; decisions are the second
file-backed surface to hit it.

**Maintainer notes** at `content/hq/README.md`. Documents the
migration manifest (which sections move to markdown, which stay
localStorage-backed, which derive, which get deferred). The four
fields that stay localStorage-edited — `prospects`, `feedback`,
`weeklyRhythm`, `nextActions` — are operator-owned write-optimized
surfaces with no other source of truth. Migrating those would force
opening an editor and committing for every Tuesday-morning plan
update, which is exactly the friction localStorage editing is good
at avoiding.

**Why this is staged.** Strategy's audit named the risk: the seed
contains real strategic thinking, and a bad migration loses company
knowledge. HQ-6a proves the pattern on one section. HQ-6b migrates
features/risks/campaigns/messaging. HQ-6c finishes the narrative
sections and rewrites the CLAUDE.md "Mandatory HQ Rule" so it points
at source files, not at the dashboard. The rule rewrite waits until
the migration is real; otherwise the contract drifts from the code.

**Strongest counter-argument to the migration.** Markdown is
verbose. Editing 22 .md files instead of one TS array is more
clicks. The mitigation: the dashboard's localStorage editing path
stays live for sections that haven't been migrated, and the
operator-owned sections stay localStorage forever. The migration is
for strategic content, not for capture surfaces.

---

## 2026-05-14 · Signal HQ v2 · derived state, register reset, voice fixes

### HQ stops being a wiki and starts being a mission control.

Ran a full UI / UX / strategy / communications audit on Signal HQ with
four parallel reviewers (strategy, ux-director, creative-director,
tech-writer). They converged on the same picture: HQ is a beautifully-
designed wiki masquerading as mission control. The 11-tab dashboard is
bureaucracy-shaped. Nothing about it changes when a session impacts
the suite — the operator has to remember to update it. The visual
register doesn't match the atlas bar set yesterday.

This pass ships the highest-leverage cuts.

**Today block lives above the dashboard.** A new server-rendered
section at the top of `/hq` reads from real sources: the active phase
line from `~/.claude/state/phase.md`, the last commit across all five
product repos sorted by recency, the atlas drift state from
`content/atlas/_drift.json`, the analytics daily cron health from
Studio's `cron_runs` Turso table, and the session pulse (Stop-hook
responses logged today + last 7 days + total). No localStorage. No
seed prose. Sessions impact HQ because sessions impact the source
files HQ reads. This is what "every session impacts HQ" means as a
build, not a wish.

**Register reset.** The rounded `Panel` card chrome (`rounded-[8px]
border bg-bg-elev shadow-1`) collapses to a hairline section
(`border-t border-border-soft`). The 11-rectangle tab nav becomes a
typographic list — left-edge 2px indigo on active, no fill, no
radius, no box. Score numbers drop from 34px to 22px — the prose
description carries the importance now. HQ stops looking like a
WordPress admin panel.

**Voice fixes per BRAND.md.** "Command" → "Today". "Ecosystem" →
"Products". "Collab Loop" → "The loop". "Growth Studio" → "Growth"
(the "studio" was self-narration; you're already inside HQ).
"command centre" killed from the header description. The Growth tab's
"A founder growth operating system with review gates" — nine words of
self-narration — collapses to "Growth work, reviewed before it
ships." `GrowthStatus.Backlog` retired across `data.ts` and replaced
with `Queued`. That's the single most obvious banned-word violation
gone.

**What's still owed.** Three follow-up cycles, sequenced:

- *HQ-5* — collapse 11 tabs to 6 (Pipeline = Features + Launch; Proof
  = Content + Growth; Operations = Metrics + Decisions + Rhythm).
- *HQ-6* — migrate the 2,334-line seed in `src/lib/hq/data.ts` to
  markdown files at `content/hq/*.md`. Delete the localStorage
  editor path. Rewrite the CLAUDE.md "Mandatory Signal HQ Rule" so
  it points at source files, not at the HQ dashboard.
- *HQ-7* — inbox shape. One screen, severity-tiered queue of
  unresolved items (overdue follow-ups, atlas drift, cron red,
  ready-for-Ethan, decisions owed). "Clear" is a valid state.

**The honest counter-argument.** Strategy named it: the current HQ
contains real strategic thinking. A queue-shaped HQ loses that. The
mitigation is that the thinking belongs in BRAND.md, atlas entries,
and decision-named markdown files — git-versioned, diffable,
searchable. HQ is the wrong tool for the strategic thinking; it was
just the only tool the operator had.

---

## 2026-05-14 · hq/atlas · 9 of 9, live diagrams, exec layer, drift-trigger active

### The atlas grew up.

By the end of the day the atlas turned from a placeholder scaffold
into something a senior leader could open and grasp in a minute.

**Every entry now has two voices.** A "for leadership · 30-second
read" block sits between the summary and the body — three lines:
*What it is*, *Why it matters*, *Risk if it breaks*. Plain English,
no acronyms, no file paths. The founder-dense body sits below for
anyone who needs the detail. Same document, two registers. No second
maintainer flow.

**Diagrams render live.** Mermaid fences are no longer labeled code
blocks — they're SVG flows, themed to the suite (paper white,
ink #111, monospace edge labels, indigo only where the diagram has
emphasis). The hydrator is lazy-loaded, so the index page pays no
cost; only entry pages with diagrams pull mermaid into the browser.
Render errors fall back to the source. The biggest visible upgrade
of the day.

**All 9 entries are complete.** The remaining three stubs
(`signal-studio-umbrella`, `five-products-as-a-system`,
`memory-and-hooks`) got the same depth as the data-flow entries —
full WHO/WHERE/HOW/WHEN/WHY plus mermaid plus exec brief. The atlas
is no longer "1 entry of substance and 8 placeholders"; it's a
nine-entry book that holds together as a system.

**Drift-trigger is live in studio.** `git config core.hooksPath
.githooks` is set. The next commit that touches a file listed in
any entry's `references[]` will flag the entry in
`content/atlas/_drift.json`. Staging the entry's own .md (or
bumping `lastVerified`) clears the flag. The hook never blocks —
drift is a signal, not a gate.

**Polish landed.** Row hover slides a thin indigo bar in from the
left margin and the mono index column shifts to accent — signature
motion moment, gesture-system consistent. The pinned entry's
"start here" label carries a single indigo dot that pulses with the
broadcast gesture (the same motion the umbrella wordmark uses).
Reduced-motion silences both.

**HQ password is now `signal-atlas-2026`** — memorable, scope-
appropriate. Local dev + HQ cookie gate only.

What's still owed: drift-trigger fan-out across the other four
product repos (mechanical copy of the studio-side script and hook).
That's its own cycle when the operator wants the full drift signal
across the suite.

---

## 2026-05-14 · hq/atlas · drift-trigger live in studio, 6 of 9 entries complete

### The system that flags itself when the system changes.

The drift-trigger went from spec to working pre-commit hook this
afternoon. The atlas is now a private notebook that can tell when
its own pages are out of date.

**`scripts/atlas-drift-check.ts`** runs on every commit when
activated. Reads atlas entries, compares `git diff --cached
--name-only` against each entry's `references[]`, writes drift into
`content/atlas/_drift.json`, and auto-stages the sidecar so it
travels with the commit that caused the drift. Edit BRAND.md, the
script flags every entry that depends on it. Bump an entry's
`lastVerified` (or stage the entry's own .md), the script clears the
slug. The hook never blocks — drift is a signal, not a gate.

**Opt-in activation.** No deps added. The hook lives at
`.githooks/pre-commit` and runs `npx tsx scripts/atlas-drift-check.ts`
— tsx was already a devDependency. To activate in any clone:

```sh
git config core.hooksPath .githooks
```

That's it. No husky, no simple-git-hooks, no `prepare` script churn.

**End-to-end verified.** Staged a real edit to `BRAND.md`, watched
both `brand-enforcement` and `signal-studio-umbrella` flag (both
reference it). Staged each entry's own .md, watched both clear.
Sidecar wrote, sidecar auto-staged, sidecar deleted itself when
empty. The clear-on-restage path means a single coordinated commit
that updates a system AND its atlas entry leaves no residual drift.

**Two more entries promoted to complete.** `pricing-and-entitlements`
documents the unified pricing surface, the shared signal-entitlements
DB, the dual-write Stripe webhook in Tasks, the operator admin
surfaces in Studio, and the five-tier vocabulary (`free / event /
wedding / workspace / studio`). `brand-enforcement` documents
BRAND.md as the catch-net — the Stark+Jobs voice, the banned-word
list as a blunt instrument, the refusal list as the strategic
anchor.

**6 of 9 entries complete now.** Remaining: signal-studio-umbrella,
five-products-as-a-system, memory-and-hooks. The remaining three
are meta-entries (less file-path-dense, more conceptual) and don't
benefit from the drift-trigger as immediately — they wait for an
actual "how does this work?" trigger to earn promotion.

**Fan-out to the other four repos is the next cycle.** Tasks,
Roadmap, Analytics, Notes each need their own copy of the script.
The script's `REPO_ROOT` already generalizes. Sidecar still lives in
studio. See `docs/ATLAS_DRIFT_TRIGGER.md` §Sequencing for the spec
that walks each remaining step.

---

## 2026-05-14 · hq/atlas · drift-trigger staged, 4 of 9 entries complete

### The atlas earns its keep when the source files start talking back.

Followed the audit-driven v1 with a real content pass and the v2
scaffold. Two cycles in one day, neither one optional.

**Three data-flow entries promoted stub → complete.** `turso-databases-
and-reads` (five Turso DBs, scoped read-only tokens, tag-as-project,
Notes-promote-by-HTTP), `analytics-daily-cron` (the 06:00 UTC briefing
engine with real env vars, real route paths, real ping-Studio loop),
and `log-cycle-cross-repo-writer` (the canonical cross-repo pattern
with both shipped instances documented — analytics→studio cron-ping
and notes→tasks promote). All three carry accurate `references[]`
pointing at real paths in each of the five product repos — the v2
drift-trigger has something to watch when it ships.

**Drift-trigger staged.** The loader now reads an optional sidecar at
`content/atlas/_drift.json`. When the v2 cycle wires per-repo pre-
commit hooks across all five product repos, each one writes drift into
that file from its own working tree. The atlas surfaces `isDrifted`
separately from `isStale` — calendar age is the soft signal, truth age
is the hard one. Drifted entries sort to the top of their lens, render
a banner above Related listing exactly which references mutated, and
show `— drifted` in the index state note. Full spec at
`docs/ATLAS_DRIFT_TRIGGER.md` — including the sequencing (studio
script first, then fan-out), the open questions (sidecar in git vs
gitignored), and the sign-off criterion.

**Why drift matters more than stale.** Strategy's audit named the
load-bearing risk: without a write-trigger, the atlas competes with
auto-memory and loses within eight weeks. Auto-memory updates every
cycle for free; the atlas requires a deliberate write. The drift-
trigger inverts that — when a file the atlas points at changes, the
atlas knows before any human does. Stale is documentation; drift is
a signal.

**HQ password set.** `SIGNAL_HQ_PASSWORD` is in `studio/.env.local`
with a generated value. Phase.md notes operator action #4: replace
with a value you'll remember before the session ends.

---

## 2026-05-14 · hq/atlas v1 · the system, written down

### A private notebook with a route, before it becomes anything more.

Signal HQ grew a new room. `/hq/atlas` is repo-backed system
documentation — one entry per system, one markdown file per entry,
read at request time. No branding, no product noun. Inside HQ it's
just *atlas* — lowercase, internal, unmarketed.

**The forcing function is the stale flag.** Each entry carries a
`lastVerified` date. Past 60 days, the flag fires inline after the
title. Fix the entry, then the code — reverses the usual rot
direction. The flag is the whole point; without it, the atlas is
documentation that can lie quietly.

**Nine anchor entries to start, one fully written.** The pinned
`plan-cycle` entry is the only one with body filled — the loop that
makes five products from one operator possible. Eight more carry
frontmatter plus tags, references, and a one-line WHAT. The index
reads honestly about what's written and what isn't (`partial` and
`stub` states render inline after the title, not as decorative pills).

**Numbered typographic list, not cards.** First pass had a card grid;
it read as Notion. Replaced with a divide-y list — monospace index
left, title plus summary middle, age right. No hover backgrounds. The
data is the surface. The "start here" pin sits above the list as a
single full-width anchor pointing at `plan-cycle`.

**A minimal markdown renderer** (`src/lib/atlas/render.ts`) handles
H2/H3, lists, links, inline code, fenced code, bold, italic. Mermaid
fences render as labeled source blocks for now; a v2 cycle adds
client-side diagram rendering if v1 gets real use. No dep added — the
shape of entries is constrained enough that 150 lines of code beats a
markdown library.

**Schema fields earning their space.** `tags[]` for strings future-Ethan
would actually type when lost (`phase.md`, `log.jsonl`, `Stop hook`).
`references[]` for paths and env vars the entry points at — staging
ground for the v2 drift-trigger that flags `isDrifted` when a referenced
file changes in git. The data shape lands now; the trigger lands next
cycle. Without the trigger, the atlas is honour-system documentation;
with it, drift becomes a system signal.

**HQ chip is lowercase mono** between Reset and Entitlements —
`atlas`, no arrow. Consistent with the HQ register. The audience is
one operator at 11pm; the chip should look like a shortcut, not a
product launch.

**Audit-driven from day one.** Strategy, creative-director, and
ux-director pushed back on the v1 draft within hours of scaffold.
Card grid replaced. Dual-persona framing dropped — exec briefings
are a different artifact. Lens taxonomy kept, sort flipped to
recency-first. Related links lifted above the body so navigation is
visible before reading.

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
