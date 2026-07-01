# Templates Strategy — Signal Studio

Date locked: 2026-05-12
Status: strategy locked; first execution cycle pending sequencing

## Decisions locked (2026-05-12, brand-aligned)

The four originally-open questions are now resolved. Recorded here so later cycles don't relitigate:

1. **Source-of-truth mechanism — sync script (not a workspace package).** Less ceremony; matches "Nothing distracting." A `@signal/templates` package would impose monorepo plumbing across four independent repos — off-brand for the suite's small-careful-tools posture. Revisit only if template churn exceeds the coordination cost.
2. **Scope — all five anchors (not one-then-watch).** Shipping templates for only the wedding wedge would brand the suite as "the wedding tool" — the exact risk named in `wedge-weddings-events-confirmed`. Committing to all five (in HQ, in this doc, in the SEO surface) keeps the brand at umbrella level. Build pressure is bounded by sequencing — only one anchor ships per cycle.
3. **Fifth anchor — swap `local-business-monthly-rhythm` for `local-business-monthly-rhythm`.** "Marketing month" is project-manager voice (a category claim). "Monthly rhythm" with four lanes (invoices / orders / admin / marketing) is operator-real — closer to the actual job of a café owner, dental practice, or local florist. BRAND.md §2 voice prefers operator-real over category-claim every time.
4. **Apply mechanism — lazy expression (not eager seed).** Each product's gesture in the brand guide (tasks=pulse, timeline=slide, signal=tick, notes=caret) is itself a reveal. Lazy expression IS the suite's brand — each layer "wakes up" when the user arrives at it, narratively reinforcing the four-layer story with an empty-state line like "Seeded from your wedding template." Eager seeding is invisible — narratively flat.

## Premise

Templates in Signal Studio are not setup shortcuts. They are the front door to the suite.

The workspace creator persona — wedding planner, freelancer, tradesperson, lecturer, agency owner — searches for the artefact, not the tool ("wedding planning checklist", "kitchen install job sheet", "final paper plan"). The template landing page is what ranks; the apply action is what converts; the four-layer workspace is what retains.

This document locks the shape of the template system, the lineup, and the sequencing.

## The three failure modes templates create (and how this strategy avoids them)

1. **Galleries leak discipline.** Four products with four template galleries means four curation problems and four chances to drift from BRAND.md voice. → Tasks owns the gallery surface. The other three products consume template metadata; they do not have their own galleries.

2. **Templates paper over weak onboarding.** When users can't make sense of an empty workspace, the temptation is to seed 40 templates. → Curation discipline: five anchor templates, one per BRAND.md §2.1 audience archetype. The existing 13 Tasks-only specialty templates remain inside their domain packs.

3. **"Template builder" UI is a gravity sink.** Designers love builders. Users rarely want them; suite-discipline always loses to them. → Templates are author-written code. There is no in-product builder. The curation IS the moat.

## The canonical shape

A **workspace template** is a single authored artefact that seeds all four layers at once.

```ts
type WorkspaceTemplate = {
  // Identity
  id: string                    // e.g. "wedding-planning-workspace"
  name: string
  domain: Domain                // wedding | trades | student | freelance | marketing
  audience: AudienceArchetype   // from BRAND.md §2.1
  problem: string               // outcome-first, one sentence
  seoSummary: string            // long-form landing page copy

  // Layer seeds
  tasks:     TaskSeed[]         // existing shape in tasks/lib/templates.ts
  notes:     NoteSeed[]         // 0–3 prompted notes (e.g., "Venue site visit · capture decisions/questions/follow-up")
  roadmap:   TimelineSeed        // milestones + sections, plain-English voice
  analytics: AnalyticsHint      // signal detectors that apply (e.g. RSVP-deadline-approaching, vendor-contract-signed)
}
```

### Why this shape

- **Tasks's existing `Template` shape stays compatible.** `tasks: TaskSeed[]` is the same field tasks/lib/templates.ts already exports today.
- **Notes's PRODUCT.md §7 refusal holds.** A workspace template can seed one or two _named_ notes (decision-capture prompts), but there is no "today template" or date-based scaffolding. Single-user discipline preserved.
- **Timeline doesn't get its own gallery.** It gets a `TimelineSeed` that the workspace template expresses. Timeline's pricing page already says it doesn't pre-seed projects with templates — that stays true; it pre-seeds workspaces that came in via a Tasks template.
- **Signal consumes a hint, not a feature.** When the user applies the wedding template, Signal's signal detectors load wedding-specific rules. No template picker on Signal's surface.

## Source-of-truth location

Templates live in **`studio/src/lib/templates/`** in the studio repo as the canonical source.

```
studio/src/lib/templates/
  index.ts                          # exports WorkspaceTemplate[] + types
  types.ts                          # WorkspaceTemplate, TaskSeed, NoteSeed, TimelineSeed, AnalyticsHint
  wedding-planning-workspace/
    meta.ts
    tasks.ts
    notes.ts
    roadmap.ts
    analytics.ts
  trades-job-pipeline/
    ...
  final-paper-sprint/
    ...
  freelance-client-engagement/
    ...
  local-business-monthly-rhythm/
    ...
```

Each product imports only what it needs:
- Tasks pulls `tasks` + `meta` + `seoSummary` and continues to render `/templates` + `/templates/[slug]`
- Notes pulls `notes` lazily on first visit to a templated workspace
- Timeline pulls `roadmap` lazily on first visit to a templated workspace
- Signal pulls `analytics` at briefing-build time

**Sync mechanism (decided):** each consuming product runs `pnpm sync:templates` at build time, copying the slices it needs from the studio repo. No monorepo machinery; no live cross-repo imports; templates evolve in one place and ripple at build.

Trade-off accepted: a template change requires a coordinated deploy across four products. For five anchor templates that change rarely, this is the right cost. If template churn grows, revisit (likely into a published `@signal/templates` package).

## The lineup — five anchor templates, one per archetype

| # | Template ID | Audience archetype (BRAND.md §2.1) | Status | Justification |
|---|---|---|---|---|
| 1 | `wedding-planning-workspace` | Wedding planners / venues / couples | Lift to 4-layer | Wedge confirmed 2026-05-11. Already exists in Tasks; the Notes/Timeline/Signal demo pages are hand-built mocks that should be regenerated from the canonical template. |
| 2 | `trades-job-pipeline` | Tradespeople | Build | Ireland-validatable; existing Tasks domain pack has fragments. Quote → job → invoice → follow-up. |
| 3 | `final-paper-sprint` | Students | Lift from Tasks-only | Already exists as Tasks template. Lift to 4-layer (Notes for source-capture, Timeline for milestones, Signal for "deadline approaching"). |
| 4 | `freelance-client-engagement` | Freelancers | Build | Onboarding → milestone → delivery → invoice. The existing `new-client-onboarding` Tasks template is the seed. |
| 5 | `local-business-monthly-rhythm` | Small-business operators | Build | Four lanes: invoices, orders, admin, marketing. The actual monthly job of a café owner, dental practice, or local florist. Operator-real, not category-claim. No existing Tasks template seeds this — voice has to be authored from scratch against BRAND.md §2. |

### Tasks-only specialty templates (no change)

The current 13 Tasks templates stay as **Tasks-only specialty templates** inside their domain packs. They are micro-workspaces, not four-layer artefacts. They do not seed Notes/Timeline/Signal. They keep their existing `Template` shape.

This is intentional — the cost of lifting all 13 to four-layer is high and the audience benefit is low. The five anchors carry the cross-suite weight; the specialties stay where they earn (SEO depth, micro-use-case coverage).

### What's deliberately NOT a template

- **Timeline templates as a standalone gallery.** The 7 names in `studio/signal-growth/seo/template-strategy.md` (venue walkthrough checklist, 12-month wedding timeline, etc.) become _slices_ of the five anchor templates, not standalone artefacts. The SEO pages for those names should redirect to the relevant anchor template's `/templates/[slug]` page, possibly with deep-links to a specific timeline section.
- **Signal templates.** Signal's job is to detect, not to be picked. Templates carry an `AnalyticsHint` that adjusts detector rules; users never see a "pick a briefing template" surface.
- **Notes templates.** Single-user, single-surface. A workspace template may seed _one_ named note prompt; that's the limit.

## The apply mechanism

When a user applies a workspace template in Tasks, the workspace record gets a `templateId` field. The other three products **lazily express** the template on first visit:

- **First visit to Timeline for a templated workspace** → checks `workspace.templateId`, seeds the timeline from `roadmap.ts`, marks the workspace as `roadmapSeeded: true`.
- **First visit to Notes for a templated workspace** → checks `workspace.templateId`, seeds 0–3 prompted notes from `notes.ts`, marks as `notesSeeded: true`.
- **Briefing build for a templated workspace** → loads `analytics.ts` hint and merges into default detector rules.

**Why lazy expression beats eager cross-product writes:** no cross-product transaction at apply-time, no failure modes from one product being down, no "what if the user never visits Timeline" wasted seed. The cost is a UX seam — first-visit-to-X feels different from second-visit. That seam is fine; it's also where we can show empty-state copy that says "Seeded from your wedding planning template."

## What this strategy explicitly does NOT promise

- A template **marketplace** (third-party authors). Curation is the moat; opening it dilutes it.
- A template **builder** in any of the four products.
- Per-product template galleries beyond Tasks.
- Template **versioning** in v1. If a template changes after a user applied it, their workspace is not updated. (Reconsider once we have >10 templates and active feedback.)
- Cross-product **writes at apply-time**. Lazy expression only.

## Sequencing — proposed cycles

This is the implementation order. Each cycle should ship as a coordinated Studio + product PR set.

| Cycle | Scope | Owner repos |
|---|---|---|
| T-1 | Canonical type + sync script + Wedding lift (studio repo source-of-truth; Tasks reads from studio sync; existing Tasks behaviour preserved) — **closed 2026-05-12** | studio, tasks |
| T-2.0 | Workspace `templateId` field — schema column + populated on remix-template — **closed 2026-05-12** | tasks |
| T-2.1a | Timeline plumbing — `template_id` column + sync script + canonical `roadmap.ts` reshaped to projects+items (matches Timeline product model) — **closed 2026-05-12** | studio, timeline |
| T-2.1b | Timeline seeding logic — workspace create flow accepts `fromTemplate=<id>`, seeds projects + items from synced slice; new `/onboarding/from-template/[id]` route — **closed 2026-05-12** | timeline |
| T-2.1c | Cross-product CTA — Tasks's remix-template-success path surfaces a "Create a Timeline for this" link to `/onboarding/from-template/<id>` — **closed 2026-05-12** (toast primitive gained action-link support; TemplatedToast handles `?remixed`; canonical templates only) | tasks |
| T-2.2 | Notes lazy expression — sync script + first-visit seed from canonical wedding `notes.ts` (preserves PRODUCT.md §7 refusal: 0–3 named-note prompts only) | studio, notes |
| T-2.3 | Signal lazy expression — sync script + hint consumption at briefing-build time (dormant until signal briefing pipeline ships) | studio, signal |
| T-3 | Trades job pipeline anchor template (all four layers) | studio, tasks, notes, timeline, signal |
| T-4 | Final paper sprint anchor template (lift from Tasks-only) | studio, tasks, notes, timeline, signal |
| T-5 | Freelance client engagement anchor template | studio, tasks, notes, timeline, signal |
| T-6 | Local business monthly rhythm anchor template (highest copy-risk; needs BRAND voice pass) | studio, tasks, notes, timeline, signal |
| T-7 | Timeline-template SEO redirects (the 7 named pages → anchor templates) + source tracking ingest | studio |

### Sequencing rationale

- **T-1 first**, in isolation, because the type contract is what every later cycle depends on. Get the shape right, get the sync working, ship without changing user-facing behaviour.
- **T-2 split into four sub-cycles** (T-2.0 through T-2.3) after starting. The original T-2 framing tried to coordinate 5 repos; that's too much per cycle. T-2.0 establishes the workspace metadata; T-2.1/T-2.2/T-2.3 wire each consuming product independently (Timeline first — clearest workspace model and most-visible artefact).
- **T-3–T-6** in audience-priority order. Trades second because Ireland-validatable + builds outbound reach beyond weddings. Monthly-rhythm last because it's the highest copy-risk.
- **T-7 last** because it's pure SEO consolidation; nothing depends on it.

## Dependencies on other in-flight work

- **Initiative 2 (Collaboration)** is in flight. Templates and Initiative 2 share the workspace concept but don't conflict — apply-template + invite-collaborator are orthogonal entry points. Sequence: Initiative 2 first or in parallel; templates T-1 can ship now without blocking Initiative 2.
- **Cycle 11.x brand rollout** is in flight (Refined Indigo Dot). Templates inherit brand tokens from each product's chrome; no specific blocker.
- **Signal product code does not exist live.** Canonical state corrected this on 2026-05-11 — signal is marketing-only. T-2's Signal seed is dormant until the Signal briefing pipeline ships. Templates carry the `AnalyticsHint`; Signal will consume it when it exists.

## Open questions for Ethan

All four originally-open questions were resolved by Ethan's "proceed how you think is best for the brand" reply on 2026-05-12. See "Decisions locked" at the top of this doc.

## Source documents that should be reconciled after this lands

- `studio/signal-growth/seo/template-strategy.md` — the 7 named timeline templates should be reframed as anchor-template slices.
- `tasks/lib/templates.ts` — once T-1 lands, this becomes a sync target, not a source-of-truth.
- `roadmap/PRODUCT.md` — silent on templates today. Should explain why Timeline is not a template host (it's a consumer).
- `analytics/PRODUCT.md` — should explain that templates carry `AnalyticsHint`, not picker UI.
- `notes/PRODUCT.md` §7 — should be updated to clarify that the refusal stands ("no today template, no date scaffolding") but that workspace templates may seed 0–3 named notes.
