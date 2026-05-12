# signal studio. — changelog

Process notes for the umbrella. The four products keep their own logs;
this one tracks what coalesced across the suite.

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
