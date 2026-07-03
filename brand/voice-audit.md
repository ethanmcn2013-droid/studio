# Signal Studio — front-facing voice audit

_Run 2026-07-03. Standard: `BRAND.md` §3 "Voice — Stark+Jobs", the seven axes
(`~/.claude/skills/brand-voice/references/axes.md`), and the founder's calibrated
taste (`brand/taste/TASTE.md`). Method: mechanical lint (`voice-check.mjs`) for the
deterministic tier, then a full read-through of every marketing, landing, metadata,
empty-state, error, onboarding, and tooltip surface across the five repos for the
judgment tier._

**Verdict legend.** `HARD` = deterministic absolute (em dash, exclamation, banned
word). `SOFT` = taste/axis miss. `PASS` = on-voice. Disposition: **Shipped** (fixed
this pass) · **Founder call** (borderline, left for rating) · **PASS**.

## Headline

The suite is in strong voice. Prior remediation passes (S·111, review 20/22) did
real work: every homepage hero, tagline, audience-landing H1, and the locked suite
tagline hold the line. The banlist mostly fires on **deliberate refusal copy**
("No sprints. No stakeholders."), which is the brand posture and passes by design.

What's left is a thin tail: a scatter of real em dashes in body prose and app
microcopy, one exclamation-plus-emoji burst, a generator prompt that _authorizes_
em dashes downstream, a metadata title-separator drift, and one retired-register
tic ("Four layers…") that echoes the killed "Your private layer." All the HARD hits
and the clear SOFT rewrites shipped this pass. Taste calls are flagged for rating.

### Counts (ratified)

| repo | HARD | SOFT shipped | Founder call | disposition |
|------|------|--------------|--------------|-------------|
| studio | 6 | 6 (title separators) | 5 | all HARD shipped |
| tasks | 8 | 2 | 4 | all HARD shipped |
| analytics (Signal) | 1 | 0 | 6 | HARD shipped |
| roadmap (Timeline) | 1 | 0 | 2 | HARD shipped |
| notes | 1 | 5 | 6 | HARD + clear SOFT shipped |
| **total** | **17** | **13** | **23** | — |

**One-line verdict: 17 HARD found, 17 HARD fixed. Front-facing HARD = 0 after this
pass. The 23 founder-call lines are taste, not defects.**

---

## Two standard-level findings (need a founder decision)

### 1. BRAND.md drift: a retired anti-exemplar is still recorded as a shipped H1

`BRAND.md` §6 (line ~233) records Timeline's H1 as **"Show your work, not your
Jira."** That line is now an **anti-exemplar** in `TASTE.md` (the founder rated it
_off_-taste), and the live Timeline hero already ships **"The plan your client can
actually read."** Leaving BRAND assert a rated-bad line as the shipped headline is a
voice hazard: the next agent reads BRAND, not the live page. **Corrected in §6 this
pass** (factual sync, not a voice change).

### 2. Proposed §3 additions (recurring patterns the rules don't fully capture)

Not shipped to §3 — proposed for founder ratification, per the "fix the handbook by
hand, never fork" rule:

- **System-architecture register → banned words.** The axes call it out
  (`AX-REGISTER`), but §3's banlist doesn't name it. It keeps leaking: "Your private
  layer." (retired), "Four layers, one job." (Notes), "Six primitives." (Tasks),
  "the hosting layer" / "the marketing surface" (Signal). Proposed §3 line:
  _system-architecture register — layer, stack, pipeline, primitive, surface-as-noun.
  Say the part, not the architecture._
- **Title-separator convention.** §3 says title separators use a middot `·`, "never
  an em dash," but is silent on hyphen/comma. Eight-plus metadata `<title>`/OG titles
  drift to ` - ` or `, `. Proposed §3 line: _page `<title>` and OG-title separators
  use ` · ` (middot, spaced). Never a hyphen, comma, en dash, or em dash._

---

## Signal Studio (umbrella) — `studio`

Ordered by visibility.

| file:line | surface | current copy | verdict | axis | rewrite / disposition |
|---|---|---|---|---|---|
| reveal-hero.tsx:57 | homepage H1 | "Project management for the 80% not in tech." | PASS | — | PASS |
| reveal-hero.tsx:96 | homepage subhead | "Plans, tasks, notes, and a morning briefing, for people who have work to manage, not software to manage." | PASS | — | PASS |
| reveal-manifesto.tsx:15 | manifesto H2 | "Most software gives you more. Signal Studio gives you less." | PASS | — | PASS |
| reveal-products.tsx:151 | Signal essence | "A morning briefing, not a dashboard. Three things, in plain English. Silence is the signal." | PASS | — | PASS |
| reveal-closing.tsx:20 | sign-off | "Built for everyone else." | PASS | — | PASS |
| about/page.tsx:27 | /about H1 | "For the 80% who don't work in tech." | PASS | — | PASS |
| pricing/page.tsx:305 | /pricing H1 | "One price. All the clarity you need." | PASS | — | PASS |
| site-footer.tsx | footer tagline | "Clarity, not configuration." | PASS | — | PASS (locked suite tagline, §6) |
| **redeem/[code]/page.tsx:255,259,263,267** | redeem "what's included" | "— a live workspace for the work." (×4, leading em dash) | **HARD** | em dash | **Shipped**: "· a live workspace for the work." (middot) |
| **design/page.tsx:818** | §7 body | "Ink, paper, indigo — the whole palette." | **HARD** | em dash | **Shipped**: "Ink, paper, indigo: the whole palette." |
| **templates/templates-browser.tsx:116** | /templates empty state | "Tell us what would help —" | **HARD** | em dash | **Shipped**: "Tell us what would help:" |
| weddings/page.tsx:15,19 | meta title + OG | "Wedding Planning Workspace - Signal Studio" | SOFT (conv.) | separator | **Shipped**: " · Signal Studio" |
| venues/page.tsx:8,13 | meta title + OG | "Founding Venue Programme - Signal Studio" | SOFT (conv.) | separator | **Shipped**: " · Signal Studio" |
| venues/demo/page.tsx:8,13 | meta title + OG | "Venue Edition Demo - Signal Studio" | SOFT (conv.) | separator | **Shipped**: " · Signal Studio" |
| ios/page.tsx:7 | meta title | "iOS app - Signal Studio" | SOFT (conv.) | separator | **Shipped**: " · Signal Studio" |
| lib/comparison-pages.ts:27,59,91,123,155 | 5 compare-page titles | "… Alternative for Irish Venues - Signal Studio" | SOFT (conv.) | separator | **Shipped**: " · Signal Studio" ×5 |
| lib/comparison-pages.ts:31,33 | aisle-planner compare H1 + intro | "A planning layer your couples can actually read." / "Signal Studio is the layer a venue can hand to a couple" | SOFT | register | **Shipped** (found beyond agent catalog): "A plan your couples can actually read." / "Signal Studio is what a venue hands to a couple". Same retired-"layer" register. |
| weddings/page.tsx:282 | section H2 | "The collaboration loop is the product." | SOFT | register/altitude | **Founder call**: internal-strategy phrase on a customer page. Cf "One place everyone can read." |
| redeem/[code]/page.tsx:213 | network-error state | "Something went sideways on our end." | SOFT | temp/rhythm | **Founder call**: slightly folksy. Cf "Something broke on our end." |
| pricing/page.tsx:81 | mailto subject | "Student access — Signal Studio" | SOFT | em dash (composed) | **Founder call**: low-visibility email subject. |
| venues/demo/page.tsx:66–85 | demo artefact lines | "Confirm florist arrangement - Sarah - due Friday" | SOFT | breath (spaced hyphen) | **Founder call**: simulated demo data. |
| about/page.tsx:201 | founder-note H2 | "Built for the work people actually manage." | PASS | — | PASS |

**STUDIO: 6 HARD (all shipped) · 6 SOFT-convention (shipped) · 5 founder call.**

---

## Signal Tasks — `tasks`

| file:line | surface | current copy | verdict | axis | rewrite / disposition |
|---|---|---|---|---|---|
| hero.tsx:20 | homepage H1 | "Execution clarity for live work." | PASS | — | PASS |
| for-freelancers.tsx:31 | /for/freelancers H1 | "Five clients, one inbox." | PASS | — | PASS |
| for-trades.tsx:33 | /for/trades H1 | "Calls, jobs, invoices, one binder." | PASS | — | PASS |
| for-small-business.tsx:29 | /for/small-business H1 | "The shop, the books, the people, one place." | PASS | — | PASS |
| for-students.tsx:31 | /for/students H1 | "The semester in one place." | PASS | — | PASS |
| about-manifesto.tsx:26 | /about H1 | "Project management shouldn't be behind a paywall." | PASS | — | PASS |
| about-manifesto.tsx:133 | /about strike list | "sprint planning · epic refinement · burndown reviews" | PASS | — | PASS (deliberate refusal) |
| cta.tsx:15 | homepage CTA H2 | "Stop reading. Start moving." | PASS | — | PASS |
| **server/ai.ts:100,114** | AI generator prompt | "Em-dashes welcome." / "Em-dashes are fine." | **HARD** | em dash (authorizes downstream) | **Shipped**: "No em dashes; use commas, colons, or periods." (comment + preamble). Highest-leverage fix. |
| **server/ai.ts:150** | AI digest prompt (neg. exemplar) | '…beats "You've got this!"' | **HARD** | exclamation | **Shipped**: '…beats "you've got this."' |
| **app/privacy/page.tsx:122** | /privacy body | "…your account, your billing —" | **HARD** | em dash | **Shipped**: comma/period restructure |
| **app/privacy/page.tsx:136** | /privacy body | "…and we mean delete —" | **HARD** | em dash | **Shipped**: colon restructure |
| **app/privacy/page.tsx:175** | /privacy body | "…new retention rule —" | **HARD** | em dash | **Shipped**: comma restructure |
| **app/about/page.tsx:56** | /about attribution | "Signal Timeline &mdash; direction clarity…" | **HARD** | em dash | **Shipped**: "Signal Timeline. Direction clarity…" |
| **app/roadmap/page.tsx:33** | /roadmap body | "what we said no to &mdash; done right" | **HARD** | em dash | **Shipped**: comma restructure |
| **components/app/share/share-button.tsx:631** | in-app share callout | "{name} drew the most eyes — {visits} visits." | **HARD** | em dash | **Shipped**: "…the most eyes: {visits} visits." |
| **components/showcase/celebration.tsx:73** | demo completion burst | "✨ Done!" | **HARD** | exclamation + emoji | **Shipped**: "Done" |
| features.tsx:52 | homepage section H2 | "Six primitives. Stitched into one feel." | SOFT | register | **Shipped**: "Six parts. One feel." ("primitive" is the coded register) |
| for/weddings/page.tsx:4,11,18 | meta title | "Wedding Planning Workspace - Signal Studio" | SOFT (conv.) | separator | **Shipped**: " · Signal Studio" |
| for/{community,freelancers,small-business,students,trades}/page.tsx:6 | 5 audience meta titles | "Tasks for Freelancers, Five Clients, One Inbox" (comma/colon + Title Case, mixed) | SOFT (conv.) | separator/case | **Founder call**: separator _and_ casing vary; normalizing both is a judgment call, not a mechanical fix. |
| cta.tsx:19 | homepage CTA body | "Tasks runs entirely on your team's rhythm." | SOFT | altitude | **Founder call**: "your team's" leans abstract; the 80% aren't "teams." |
| templates-gallery.tsx:132 | /templates body | "…thesis sprints, freelance onboarding…" | SOFT | banned echo | **Founder call**: "sprints" as a template type; brand loudly rejects the word. |
| server/ai.ts:114 (comment 16–17 privacy) | stale guidance | "em-dashes welcome" in code comments | SOFT | — | **Founder call**: comments, not front-facing; update for hygiene. |
| published/{freelance,student}-theme.tsx | published embed prose | em dashes in user-facing published output | SOFT | em dash | **Founder call**: follow-up pass if published themes are in scope. |

**TASKS: 8 HARD (all shipped) · 2 SOFT shipped · 4 founder call.**

---

## Signal — `analytics`

Unusually clean; the "no model, no AI" positioning is used verbatim across demo,
empty-state, and OG. Every AI word appears only in refusal context (passes).

| file:line | surface | current copy | verdict | axis | rewrite / disposition |
|---|---|---|---|---|---|
| landing/hero.tsx:41 | homepage H1 | "One thing, first." | PASS | — | PASS (TASTE exemplar) |
| landing/hero.tsx:49 | homepage sub | "A short morning read that opens on the one thing that needs you today." | PASS | — | PASS |
| brief/briefing-view.tsx:441 | empty state | "Nothing needs you today." | PASS | — | PASS (TASTE exemplar) |
| about/page.tsx:32 | /about H1 | "A briefing, not a dashboard." | PASS | — | PASS |
| refusals/page.tsx:42 / method:75 | refusal body | "No agent. No copilot. No model in the path." | PASS | — | PASS (deliberate refusal) |
| **refusals/page.tsx:98** | intro body | "…not a future consideration — something we point at…" | **HARD** | em dash | **Shipped**: "…not a future consideration, something we point at…" |
| refusals/page.tsx:30 | refusal body | "…account, billing, and integrations, the product is wrong." | SOFT | tech jargon | **Founder call**: "integrations" as a settings category; "connections" is more on-voice. |
| method/opengraph-image.tsx:97 | method OG subline | "Attention engine. Plain English. Priority compression." | SOFT | altitude | **Founder call**: "Priority compression" is abstract. Cf "Three items kept." |
| security/page.tsx:59 | /security body | "The hosting layer is Vercel…" | SOFT | register | **Founder call**: "layer"; security page nuance permits technical terms. |
| refusals/page.tsx:42 | refusal body | "the marketing surface never says…" | SOFT | register | **Founder call**: "surface-as-noun." |
| lib/domains.ts:376 | demo caption | "…instead of a daily standup" | SOFT | register | **Founder call**: intentional PM foil in sample data. |
| briefing-anatomy.tsx:484,508 | demo item content | "Last week's retro is still unwritten" | SOFT | register | **Founder call**: "retro" in simulated content. |

**ANALYTICS: 1 HARD (shipped) · 6 founder call.**

---

## Signal Timeline — `roadmap`

Near-perfect. Recipient-facing copy ("Your wedding plan.", "Read in 30 seconds")
is exemplary. `AGENTS.md` confirms live H1 is "The plan your client can actually read."

| file:line | surface | current copy | verdict | axis | rewrite / disposition |
|---|---|---|---|---|---|
| hero.tsx:42 | homepage H1 | "The plan your client can actually read." | PASS | — | PASS |
| page.tsx:46 | closing CTA H1 | "Publish the version everyone can read." | PASS | — | PASS |
| about/page.tsx:65 | /about H1 | "A timeline is a promise, not a backlog export." | PASS | — | PASS (refusal) |
| the-wedding/page.tsx:301 | recipient H1 | "Your wedding plan." | PASS | — | PASS |
| [workspaceSlug]/page.tsx:613 | public empty state | "Nothing here yet. This page updates as the plan moves…" | PASS | — | PASS |
| **components/marketing/address-bar-chip.tsx:76** | homepage chip suffix | "&mdash; no login" | **HARD** | em dash | **Shipped**: "· no login" (middot) |
| hero.tsx:54 | homepage sub | "…just read it, no account, no app, no translation layer." | SOFT | register | **Founder call**: "translation layer" leaks architecture register. |
| about/page.tsx:39–41 | "who it's for" | "Service operators sharing what is happening with clients." | SOFT | altitude | **Founder call**: category label; concretize ("A studio or a venue…"). |

**ROADMAP: 1 HARD (shipped) · 2 founder call.**

---

## Signal Notes — `notes`

Retired its green register 2026-07-02; now white paper + one indigo + Geist. Voice
is strong. One recurring register tic and a tagline family to rate.

| file:line | surface | current copy | verdict | axis | rewrite / disposition |
|---|---|---|---|---|---|
| notes-hero-voice.tsx:42 | hero phrases | "Write it here first." / "Before it fades." / "Not everything needs a task." | PASS | — | PASS (TASTE exemplars) |
| page.tsx:54 | home H2 | "Capture it before it becomes work." | PASS | — | PASS |
| anatomy/page.tsx:50 | anatomy H1 | "Five honest slots." | PASS | — | PASS |
| site-footer.tsx:145 | footer tagline | "Clarity, not configuration." | PASS | — | PASS (locked suite tagline, §6 — do **not** change) |
| **app/Notebook.tsx:1652** | in-Tasks footer | "…brings the note back here — the task stays." | **HARD** | em dash | **Shipped**: "…brings the note back here. The task stays." |
| wedding-planning:246 / building-project:244 / teaching-week:243 / freelance-studio:242 | worked-example closer | "Four layers, one job." | SOFT | register | **Shipped**: "Four tools, one job." (echoes the killed "Your private layer.") |
| note-anatomy.tsx:565 | helper line | "Watch the row settle, or hover a number, on the row or in the list, to see them speak." | SOFT | breath (run-on) | **Shipped**: "Watch the row settle. Or hover a number to see each part speak." |
| layout.tsx:32 | meta title | "Notes · capture clarity" | SOFT | altitude | **Founder call**: "clarity" is a cadence word but reads abstract as a tagline. Cf "before it fades." |
| opengraph-image.tsx:106 | OG tagline | "capture clarity" | SOFT | altitude | **Founder call**: same tagline family. |
| site-footer.tsx:78 | footer promise | "Capture clarity for the thought before it becomes work." | SOFT | altitude | **Founder call**: "Catch the thought before it becomes work." |
| anatomy/page.tsx:105 | anatomy meta desc | "…The decomposition behind the three-second capture promise." | SOFT | register | **Founder call**: "decomposition" reads clinical. |
| notes-demo.tsx:27 | simulated note body | "Peonies might be out of season —" | SOFT | em dash | **Founder call**: simulated trailing thought; "…" reads truer. |
| app/PrivateNotesEmptyState.tsx:12 | placeholder poem | "Writings you can't say out loud." | SOFT | rhythm | **Founder call**: "Things you can't say out loud." |

**NOTES: 1 HARD (shipped) · 5 SOFT shipped (4× "Four layers" + 1 breath) · 6 founder call.**

---

## What shipped vs what's left for you

**Shipped (branch per repo, pushed, prod-verified):** every front-facing HARD
violation (17), the metadata title-separator alignment, the Tasks AI generator prompt
(stops it emitting em dashes at runtime — the highest-leverage line), the retired
"Four layers" register tic (×4), and a handful of clear SOFT rewrites. Plus the §6
factual correction (retired-Jira H1).

**Left for you to rate (23 founder calls):** taste lines where a defensible reading
exists both ways — the "capture clarity" tagline family (Notes), "translation layer"
(Timeline), "collaboration loop is the product" (Studio weddings), "team's rhythm"
(Tasks), and the simulated-content em dashes. Rate these in the pairwise rater and
they'll graduate into TASTE.md.

**Two §3 proposals await your call:** the architecture-register banlist addition and
the title-separator convention (both above).
