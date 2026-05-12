# signal studio. — changelog

Process notes for the umbrella. The four products keep their own logs;
this one tracks what coalesced across the suite.

---

## 2026-05-12

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
