# Signal Studio Ecosystem Integration Plan

Signal Studio is one work-clarity ecosystem, not four adjacent products.

The integration goal is simple:

Anyone should be able to open a shared Signal workspace and understand the state of the work in under 60 seconds.

## Product Roles

| Product | Layer | Core question |
| --- | --- | --- |
| Signal Notes | Context | What was captured, decided, or learned? |
| Signal Tasks | Execution | What needs doing, by whom, and by when? |
| Signal Roadmap | Direction | Where is this going, what changed, and what is next? |
| Signal Analytics | Attention | What needs attention before it becomes a problem? |

## Integration Thesis

The four products should share one workspace language and one operating loop:

Context -> Execution -> Direction -> Attention -> Context

Operationally:

Capture the work. Do the work. Explain the work. Improve the work.

Growth-wise:

Workspace created -> collaborators invited -> work becomes clearer -> shareable output created -> new creator discovered.

## Shared Objects

These objects should be defined once and reused across all product repos.

| Object | Purpose |
| --- | --- |
| Workspace | The shared place where one real piece of work lives. |
| Person | Owner, collaborator, stakeholder, guest, supplier, client, or partner. |
| Task | Owned action with state, date, blocker, and context. |
| Note | Captured context that can produce actions, decisions, risks, and references. |
| Decision | A dated choice with reason, owner, linked work, and review point. |
| Risk | Something that may affect delivery, direction, attention, or trust. |
| Update | A meaningful change that can feed activity, changelog, briefing, and analytics. |
| Signal | A derived plain-language observation about what needs attention. |
| Shareable output | Roadmap, update, checklist, decision summary, template, or briefing. |

## Build Sequence

### Cycle 1: Collaboration foundation

Status: in progress from May 11, 2026.

Purpose:

Make the collaboration growth loop explicit across all four product repos before deeper implementation starts.

Deliverables:

- product-specific collaboration loop docs in Tasks, Roadmap, Analytics, and Notes
- shared object language aligned across repos
- HQ Collab Loop data kept current
- first implementation targets named for invites, guest value, shareable outputs, and source tracking

Acceptance criteria:

- every product repo names its role in the loop
- every product repo lists the shared objects it must respect
- every product repo names its Cycle 1 acceptance test
- Studio HQ tracks collaboration readiness and active next actions

### Cycle 2: Invite and collaborator first view

Status: active from May 11, 2026.

Detailed spec: `docs/CYCLE_2_INVITE_AND_FIRST_VIEW.md`.

Purpose:

Define the minimum safe way to invite people into a shared Signal workspace and make the first screen useful before they configure anything.

Deliverables:

- role model for creator, collaborator, guest, client/supplier, and viewer
- collaborator first-view model
- first three wedding/events shareable artefacts
- V1 source tracking fields
- product-specific Cycle 2 notes in Tasks, Roadmap, Analytics, and Notes

Acceptance criteria:

- an invited person can understand what matters without choosing a product view
- private notes and internal work do not leak into shareable outputs
- every shareable artefact has owner-controlled visibility
- invite and share links can carry campaign/source context
- the first demo path can show "venue invites couple"

### Phase 1: Shared language and links

- Align product copy around workspace, owner, date, status, blocker, decision, risk, update, and briefing.
- Add cross-product deep links where they are useful before adding heavy sync.
- Keep Roadmap public-sharing strength visible as the first shareable artefact.

### Phase 2: Shared event model

- Define common events: task created, owner changed, date moved, blocker added, note created, decision logged, roadmap item changed, signal detected, briefing generated.
- Keep the first implementation pragmatic. A shared event shape matters more than a perfect event bus.
- Use events to power activity, briefings, changelogs, and later analytics.

### Phase 3: Collaboration and guest value

- Add the lightest safe invite flow.
- Design the collaborator first view: what matters, what changed, what they own, and what is next.
- Avoid per-seat friction during validation.
- Track source: invited user, shared output, template, founder outreach, partner.

### Phase 4: Shareable outputs

- Roadmap: public plan, change log, and stakeholder update.
- Notes: decision summary and action summary.
- Tasks: checklist and status update.
- Analytics: Today Signal / workspace briefing.
- Templates: duplicable wedge workspaces.

### Phase 5: Creator loop and attribution

- Add tasteful "Created with Signal Studio" on public outputs.
- Add duplicate/use-template CTAs where natural.
- Track new workspace creators who arrive through a shared workspace or output.
- Build workspace creator dashboard only after invite and activation behaviour exists.

## First Wedge: Weddings And Events

The first proof path should show a venue or planner creating a workspace, inviting a couple or supplier, and sharing a planning update.

The demo should include:

- a venue meeting note
- approved actions
- supplier follow-ups
- a 12-month or final-week roadmap
- a decision summary
- a Today Signal briefing
- a shareable update with a clear next step

## Product-Led Growth Rule

Do not treat collaboration as a private feature.

Collaboration is the organic outreach loop. The product should create clear artefacts that travel: plans, checklists, notes, decisions, updates, templates, and briefings.

Every major integration should answer:

- What does the creator understand faster?
- What does the invited person understand faster?
- What can be safely shared?
- What could make a viewer become a workspace creator?
- What metric proves the loop is working?
