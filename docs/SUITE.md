# Signal Studio · suite operating contract

Status: current

Effective: 2026-07-26

Scope: marketing, the unified web application, shared objects, product
boundaries, and release evidence

Signal Studio is one application with four products. This file is the
architecture-level primer for current work. It replaces the former model of
four adjacent product applications.

## Authority

When current sources disagree, use this order:

1. `AGENTS.md` for workflow.
2. `BRAND.md` for voice, positioning, and audience.
3. `docs/brand-guide/naming/NAMING_CONSTITUTION.md` for names and product order.
4. `docs/architecture/SUITE_URL_AND_NAMING_CONTRACT.md` for origins, routes,
   redirects, and service/public exceptions.
5. This file for product roles, module boundaries, and cross-product behavior.
6. `docs/shipped-state.md` for what may be described as deployed, verified, or
   available.
7. `docs/experience/SUITE_95_PRODUCT_RELEASE_GATE.md` for the current
   four-product quality and release gate.

Older cycle plans, handoffs, review reports, standalone-repository records, and
changelog entries are historical evidence. They do not override these current
sources.

## One app, four products

The fixed suite spine is:

`Notes -> Tasks -> Timeline -> Signal`

| Product | Job | Marketing | Canonical app entry |
|---|---|---|---|
| Signal Notes | Capture clarity. Hold private thinking and promote exact approved wording. | `signalstudio.ie/notes` | `app.signalstudio.ie/app/notes` |
| Signal Tasks | Execution clarity. Run the work. | `signalstudio.ie/tasks` | `app.signalstudio.ie/app/tasks` |
| Signal Timeline | Direction clarity. Author and publish the work's milestone story. | `signalstudio.ie/timeline` | `app.signalstudio.ie/app/timeline` |
| Signal | Attention clarity. State what needs attention and prove why. | `signalstudio.ie/signal` | `app.signalstudio.ie/app/signal` |

`signalstudio.ie` is the company and marketing origin.
`app.signalstudio.ie` is the only canonical signed-in application origin.
The product rail uses the short labels Notes, Tasks, Timeline, and Signal in
that order. It never presents four separate applications.

Tasks views sit below the Tasks product:

- Board: `/app/tasks`
- List: `/app/tasks/list`
- Schedule: `/app/tasks/timeline`
- Calendar: `/app/tasks/calendar`

`/app/timeline` is reserved for Signal Timeline. Retired paths such as
`/app/board`, `/app/plan`, and `/app/brief` are compatibility inputs only and
must not be emitted by current navigation.

## Deployment and source topology

The customer application is one deployable codebase, currently held in the
repository historically named `tasks`. Notes, Tasks, Timeline, and Signal are
modules inside that application. The Studio repository owns company marketing,
shared commercial pages, compatibility redirects, and private Signal HQ.

Former Notes, Timeline, and Signal application repositories remain provenance
and migration references. They are not current production authorities and must
not receive new product behavior that bypasses the unified app.

Consolidated user experience does not require one undifferentiated database.
Module data boundaries may remain separate where the current implementation
and privacy contracts require them. Authentication, membership, workspace
context, product navigation, and release evidence must still read as one
application.

## Shared application frame

The shared frame owns only suite-wide concerns:

- authentication and account identity;
- the Studio bar and product rail;
- the active product derived from the canonical pathname;
- authorized workspace, planning-period, and project context;
- cross-product search and navigation;
- shared focus, keyboard, loading, error, and mobile behavior.

Product-local data and controls belong inside the product module. A Tasks data
failure must not block Notes capture, a Timeline owner view, or a Signal
briefing. A URL hint may request context but never authorize it; the server
revalidates every workspace and project selection.

The frame stays visually stable while the canvas changes. Suite cohesion means
shared geometry, typography, focus treatment, interaction language, and one
indigo accent. It does not mean forcing four different jobs into one card grid.

## Accepted product archetypes

### Notes · private capture notebook

The accepted direction is the founder-selected Hybrid notebook:

- immediate capture is first;
- saved notes form a flat, newest-first stream;
- reading uses an editorial measure and a desktop stream/detail composition;
- mobile detail is a focused view, not a squeezed desktop split;
- local search is distinct from suite search;
- raw Notes remain private;
- only exact user-selected wording enters the approval flow;
- approved wording remains editable before an explicit send to Tasks;
- the source Note is not removed or silently changed;
- delivery is idempotent and failure stays inside the downstream extraction
  flow, never over private capture.

Automatic todo detection, automatic extraction, and raw-note propagation are
refused.

### Tasks · editorial execution workbench

The accepted direction is the current Hybrid execution workspace inside the
founder-approved Editorial Project Room:

- one server-backed project identity governs the sidebar, breadcrumb, brief,
  views, and mutations;
- Board is the default;
- List, Schedule, and Calendar are alternate views of the same work, not
  separate products;
- the project brief explains purpose, dates, progress, and milestones only
  when real source data exists;
- Board density, drag, selection, detail, keyboard movement, WIP, and
  optimistic recovery remain load-bearing;
- `waiting` is a first-class state where the current data contract supports it;
- absent dates, owners, estimates, milestones, and progress stay absent rather
  than being fabricated.

Production must not depend on a frozen design-lab clock or a local title that
contradicts the authorized project.

### Timeline · authored owner surface and frozen public artifact

The accepted recipient artifact is Option D:

- a horizontal, date-scaled milestone line;
- completion and days-remaining lenses derived from published facts;
- a precise Today marker;
- an explicit next milestone;
- keyboard, mobile, and reduced-motion behavior;
- an unguessable, revocable, non-indexed `/s/*` share link.

The owner surface is a separate mode around the same artifact. It must let the
owner switch authorized projects, view, edit milestones, preview the exact
recipient artifact, publish, copy, inspect freshness, and revoke without
confusing owner controls with public content.

The frozen allowlisted public DTO, publication lifecycle, qualified-view
privacy, and exact revocation behavior are protected contracts. Private Notes,
Tasks detail, comments, attachments, membership, source relations, and owner
controls never enter the public response.

`timeline.signalstudio.ie/s/*` and
`timeline.signalstudio.ie/the-wedding` remain branded public-artifact
exceptions. They are not a second signed-in application.

### Signal · quiet briefing ledger

The accepted default is the Quiet Briefing Ledger:

- a finite, prose-first read;
- zero to three genuinely useful items;
- workspace and observation window stated plainly;
- the first viewport answers what changed, why it matters, and what to do;
- one restrained receipt and exact authorized evidence path per claim;
- duplicate, stale, inaccessible, unsupported, or cross-tenant claims do not
  render;
- unavailable sources are named honestly;
- a quiet day may be quiet.

Overview, Trends, and Evidence may provide progressive depth beneath the
briefing. They do not turn the default into a dashboard, a configurable report
builder, or a fifth product. Query parameters, environment flags, and provider
availability must not silently swap the product's visual identity.

## Cross-product lineage

The suite should preserve one understandable chain:

1. Notes captures private context.
2. A person selects exact wording and approves it.
3. Tasks receives one idempotent item with source provenance.
4. Chosen, authorized Tasks milestones inform the Timeline owner surface.
5. A frozen Timeline publication produces the recipient artifact.
6. Signal surfaces a real change or risk with an authorized evidence receipt.

This lineage is directional, not an excuse to expose every object everywhere.
Each transfer has its own authorization, privacy, freshness, and failure
boundary. Review fixtures must use coherent opaque identities and a pinned
review clock that cannot reach production storage.

## Release truth

No product is described as 9.5, Studio grade, production-verified, or broadly
available because a branch exists, a build passes, or one screenshot looks
good. Promotion requires:

- current remote-main source;
- the dependency-ordered PR sequence in
  `docs/experience/SUITE_95_PRODUCT_RELEASE_GATE.md`;
- complete deterministic and rendered evidence for every required
  state-by-viewport cell;
- the fail-closed 50/52 council threshold for every cell;
- no product or suite hard veto;
- green type, lint, design-system, contract, security, migration, build, and
  browser checks for the changed scope;
- a READY production deployment;
- canonical alias and authenticated journey smoke evidence.

Missing or stale evidence is a failure, not a score of zero that can be
averaged away.

## Founder-only external gates

Engineering, local review, PRs, and deployable release work continue without
waiting on preferences. Tasks that require the founder's independent identity,
provider account, billing authority, legal approval, or secret entry remain in
`content/hq/operator-todos/`.

Current examples include:

- independent Google sign-up, sign-in, link, unlink, and last-method-removal
  verification;
- production Clerk environment and no-review-mode verification;
- provider, payment, legal, or baseline approval that cannot be established
  from repository or protected-job evidence.

These gates must never be buried in a release note, inferred as complete, or
used to fabricate provider evidence.
