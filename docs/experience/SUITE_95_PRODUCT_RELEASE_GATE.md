# Signal Studio 9.5 product release gate

Status: active, founder-directed

Effective: 2026-07-26

Scope: Notes, Tasks, Timeline, and Signal inside the unified application

Canonical origin: `https://app.signalstudio.ie`

This is the stricter promotion gate for the current four-product quality
programme. It sits above the general 3.5 Studio-grade baseline. Where the two
thresholds differ for this programme, this file wins.

It is a release contract, not evidence that any product currently passes.

## Required outcome

Every required product experience, in every required state, at every required
viewport, must earn at least **50 of 52** points across the canonical
13-dimension rubric.

The calculation is discrete:

`sum of 13 integer scores ÷ 52 × 10`

`49/52` is `9.42` and fails. `50/52` is `9.62` and is the first integer score
that clears a 9.5/10 gate.

The gate is fail-closed:

- every dimension is present and scored from 0 through 4;
- no dimension is below 3;
- the cell total is at least 50;
- rendered and deterministic evidence is current;
- no hard veto or unresolved release-blocking finding remains;
- no unreviewed visual change or expired exception remains.

Scores are never averaged across states, viewports, products, reviewers, or
disciplines. The product score is its weakest required state-by-viewport cell.
The suite score is its weakest product. Missing evidence fails the cell; it
does not enter an average.

## Canonical dimensions

The dimension names and anchors remain those in `AUDIT_RUBRIC.md`:

1. `purpose-and-task-clarity`
2. `information-architecture`
3. `visual-hierarchy`
4. `typography-and-content`
5. `layout-and-composition`
6. `interaction-quality`
7. `state-completeness`
8. `accessibility`
9. `responsive-behavior`
10. `performance-and-perceived-speed`
11. `design-system-coherence`
12. `brand-distinction-and-craft`
13. `implementation-fidelity`

A 4 needs positive evidence. A clean automated run does not award a subjective
4. Specialist reviews must cite the rendered artifact and relevant
deterministic receipts.

## Required viewports and modes

Every critical and core product experience is reviewed at:

- mobile;
- tablet;
- desktop;
- wide desktop.

The complete product journey also proves:

- keyboard-only operation;
- reduced motion;
- forced colours or equivalent high-contrast mode;
- 200% zoom and text-spacing overrides;
- touch target and mobile safe-area behavior.

A mode may reuse a base screenshot only when the differing behavior has its own
deterministic and human evidence. Copying a score is not review.

## Required states

Each product registry declares the exact required states. At minimum, the
programme covers the states below wherever the product job can reach them:

- first use;
- populated;
- sparse;
- dense or long content;
- loading;
- empty;
- saved;
- partial source failure;
- recoverable error;
- restricted or unauthorized;
- offline;
- conflict or stale write;
- reduced motion;
- keyboard only.

Product-specific states are additive:

- Notes: pending save, recovery, exact extraction, downstream Tasks
  unavailable, idempotent retry.
- Tasks: unscheduled work, waiting lane, overdue work, empty project, missing
  planning dates, optimistic rollback.
- Timeline: no project, no milestones, undated, unpublished, published, stale,
  source unavailable, revoked.
- Signal: quiet day, one item, three items, stale source suppressed, evidence
  unavailable, inaccessible source, duplicate input.

No state may use production data in a review fixture. No fixture clock, identity,
or review-only branch may reach production storage.

## Council

Six lenses review the same current evidence:

1. product and information architecture;
2. visual design and brand taste;
3. interaction and motion;
4. accessibility and inclusive usability;
5. systems, data truth, privacy, and reliability;
6. operator usefulness and first-use comprehension.

The council records findings before scores. Any lens may veto a cell for a
hard product contract, privacy, authorization, accessibility, or evidence
failure. A score below the gate returns the product to implementation and a
fresh complete review. No council may score its own unrendered intent.

## Product archetypes and hard vetoes

The detailed archetypes live in `../SUITE.md`.

### Notes

Preserve the Hybrid private capture notebook and exact approved extraction.
Release is vetoed by raw-note leakage, automatic todo extraction, source-note
mutation or removal, lost text, unsafe conflict handling, duplicate delivery,
or downstream Tasks failure that blocks or overwhelms capture.

### Tasks

Preserve the Hybrid execution workbench and one canonical project truth across
Board, List, Schedule, and Calendar. Release is vetoed by retired route
emission, `/app/timeline` collision, project contradiction, fixture-clock use,
fabricated dates/progress/owners, or a view change that changes underlying
work.

### Timeline

Preserve the selected Option D artifact and frozen public DTO. Release is
vetoed when owner and recipient modes are ambiguous, preview differs from the
recipient artifact, revoked or unpublished links remain accessible, or private
source fields enter a public response.

### Signal

Preserve the Quiet Briefing Ledger as the default. Release is vetoed by a
dashboard-first surface, unsupported or stale claims, duplicate items,
cross-tenant evidence, inaccessible evidence, visual identity selected by
query/environment, or any claim without a source and observation time.

### Suite

Release is vetoed when one module failure blocks another product, context
silently changes or authorizes from a URL hint, review data can reach
production, or a critical mobile, keyboard, focus, forced-colour, zoom, or
reduced-motion journey fails.

## Dependency-ordered PR sequence

The sequence may use one implementation branch or a small dependency chain,
but review and merge must preserve these boundaries.

### PR 0 · route and operational truth

- Typed Tasks view routes.
- No generic `/app/${view}` emission.
- Current documentation and executable route checks.
- Production preflight for required module services without printing secret
  values.

### PR 1 · shared application frame and context

- Shared auth, Studio bar, rail, suite context, and failure isolation only.
- Tasks runtime moved beneath Tasks routes.
- Active product derived from pathname.
- Authorized context continuity and accessible mobile switching.

### PR 2 · review lineage and calendar truth

- One deterministic Mara and Finn cross-product fixture.
- One server-generated calendar frame.
- No production import of design-lab clocks.
- No-fabrication, time-zone, midnight, DST, and date-only tests.

### PR 3 · Tasks

- One server-backed project identity.
- Board, List, Schedule, and Calendar truth.
- Real planning dates and `waiting` state.
- Intentional scroll ownership, density, card facts, keyboard and mobile paths.

### PR 4 · Notes

- Hybrid as canonical renderer with a safe rollback window.
- Capture-first hierarchy, local search clarity, intentional stream/detail
  composition, and complete state coverage.
- Exact selection, approval, idempotent Tasks delivery, and recovery contracts.

### PR 5 · Timeline

- Selected artifact unchanged.
- Clear View, Edit milestones, Preview, Published, and revoked states.
- Authorized project switching, source-sync truth, pixel-identical preview,
  and frozen publication proof.

### PR 6 · Signal

- Quiet Briefing Ledger restored as the canonical renderer.
- One briefing DTO over current sources.
- Zero-to-three finite items with freshness, authorization, evidence, and
  deduplication proof.
- Progressive depth remains subordinate.

### PR 7 · cohesion, council, and release

- Shared interaction, responsive, focus, error, saved, and motion grammar.
- Fresh fixture, materiality, browser, accessibility, and council evidence.
- Full Notes -> Tasks -> Timeline -> Signal journey.
- Repeat implementation and review until every required cell reaches 50/52.
- Dependency-order merge, READY production deployment, and canonical smoke
  evidence.

## Evidence packet

Each PR records:

- source commit and changed scope;
- tests and exact commands;
- migration or no-migration statement;
- current materiality hashes;
- fixtures and reset procedure;
- browser captures for changed state-by-viewport cells;
- keyboard, focus, touch, reduced-motion, high-contrast, zoom, and text-spacing
  results where relevant;
- Axe, overflow, page-error, console, and performance results;
- specialist scores and findings;
- resolved finding evidence;
- deployment status and canonical smoke results when released.

Evidence must name what was not run. A branch, local server, HTTP 200, green
build, or prior screenshot does not imply a current pass.

## Promotion sequence

1. Rebase or branch from current remote main.
2. Implement the smallest dependency-safe tranche.
3. Run touched-scope static, unit, contract, security, and browser checks.
4. Refresh registry/materiality evidence after source stabilizes.
5. Open the PR with receipts and no invented quality claim.
6. Review rendered preview evidence.
7. Merge only green dependency predecessors.
8. Deploy the merged source.
9. Require deployment state `READY`.
10. Smoke canonical aliases and authenticated journeys.
11. Run the complete council matrix against released code.
12. Return any sub-50 cell to implementation; repeat until the gate passes.

## Founder-only external boundary

The following stay in the HQ operator ledger:

- independent Google sign-up, sign-in, link, unlink, and attempted
  last-method removal;
- production provider, billing, legal, or secret-entry actions that require the
  founder's account;
- founder approval of a new golden reference, visual baseline, or exception
  where the existing Experience Standard reserves approval.

These actions do not block safe engineering, local evidence, PR creation, or a
deployable release. They do block any claim that depends on the missing
external evidence.

## Current enforcement gap

Studio's existing machine audit validates the general Studio-grade threshold
of every dimension at least 3 and mean at least 3.5. It does not yet enforce
this programme's 50/52 total. Until the executable gate is updated and verified,
the release process must treat a machine green as necessary but insufficient
and require a complete signed 50/52 council ledger.

This limitation is explicit so documentation cannot manufacture enforcement.
