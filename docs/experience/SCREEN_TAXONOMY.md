# Screen Taxonomy

The taxonomy makes the suite countable without pretending every experience is a page or every governed codebase is a customer product. Registry identity is the combination of source system, experience class, route or trigger, surface type, role, required state, and breakpoint.

Machine-readable sources: [`taxonomy.json`](../../experience/taxonomy.json), [`surfaces.json`](../../experience/surfaces.json), [`config.json`](../../experience/config.json), and [`types.ts`](../../src/lib/experience-quality/types.ts).

## Stable identity

Every experience has a kebab-and-dot stable ID such as `studio.page.design` or `signal-review.surface.issue-panel`. IDs survive copy changes and visual redesigns. Rename an ID only when the underlying product/surface identity changes, and migrate every audit, finding, review, baseline, and golden-set reference in the same change.

Each entry must declare:

- source system (`product` in the current schema), experience class, and surface type;
- exactly one route or trigger;
- source path and parent journey;
- archetype, primary job, and primary action;
- roles, required states, and all required breakpoints;
- review tier and accountable design/engineering owners;
- implementation/audit status, coverage, findings, baseline, exceptions, and materiality hash.

## Experience classes

| Canonical ID | Scope | Intended audience |
|---|---|---|
| `customer-product` | Tasks, Timeline, Signal, and Notes | Customers, members, guests, and viewers |
| `company-public` | Studio routes outside `/hq*` | Public company and brand audiences |
| `founder-operator` | Studio `/hq*`, explicit HQ surfaces, and all Signal Review surfaces | Founder/operator and internal reviewer roles |

The class is deterministic in discovery and validated against these rules. `product` remains the source-system ID needed for repository ownership and capture routing; it is not a claim that Studio, HQ, or Signal Review is a customer product. `roles` provides the audience detail inside a class.

## Twelve screen archetypes

| Canonical ID | Use when the experience primarily… |
|---|---|
| `application-shell-and-navigation` | establishes place, orientation, or movement through the suite |
| `dashboard-or-command-centre` | summarizes priority work and routes the next action |
| `list-and-data-table` | scans, filters, compares, or acts across records |
| `detail-or-record-view` | understands and acts on one record in context |
| `create-and-edit-form` | creates or changes structured data |
| `editor-or-canvas` | directly shapes a richer work object or spatial surface |
| `review-and-approval-workspace` | evaluates evidence and records a disposition |
| `search-and-command-interface` | finds a destination, record, or command quickly |
| `settings-and-administration` | configures access, policy, billing, or system behavior |
| `onboarding-and-authentication` | establishes identity, access, setup, or first success |
| `feedback-interruption-and-exception` | explains progress, absence, success, restriction, or failure |
| `public-information-and-proof` | explains the product, builds trust, or demonstrates proof publicly |

Choose the archetype by the user's primary job, not the component shape. A drawer can be a record view; a page can be an exception surface.

## Surface types

The exact surface vocabulary is:

- **Route-level:** `page`, `onboarding`, `authentication`, `invitation`, `shared-link`.
- **In-product:** `nested-view`, `embedded-workspace`, `dialog`, `drawer`, `popover`, `menu`, `command-palette`.
- **State and feedback:** `loading`, `empty`, `error`, `success`, `restricted`, `notification`.
- **Output:** `report`, `export`, `email`.
- **External overlay:** `extension-overlay`.

Register a non-route surface in [`surfaces.json`](../../experience/surfaces.json) when it has its own job, trigger, state contract, or approval risk. Do not register every component.

## Required states

The exact state vocabulary is:

`default`, `first-use`, `empty`, `populated`, `loading`, `slow-loading`, `partial-failure`, `error`, `success`, `restricted`, `disabled`, `read-only`, `dense`, `long-content`, `saved`, `unsaved`, `reduced-motion`, `keyboard-only`.

Required states describe evidence obligations, not every possible state in the implementation. Defaults derive from archetype and surface type; override them only with a recorded reason. A state may be omitted only when it is genuinely impossible, not merely inconvenient to fixture.

## Breakpoints

Every registered experience currently requires all four canonical viewports:

| ID | Viewport |
|---|---:|
| `mobile` | 390 × 844 |
| `tablet` | 768 × 1024 |
| `desktop` | 1280 × 900 |
| `wide` | 1440 × 960 |

A breakpoint capture is not a responsive review by itself. Reviewers still judge reflow, order, density, touch/keyboard reachability, and whether the composition is intentional at each size.

## Review tiers

| Tier | Meaning | Required treatment |
|---|---|---|
| `critical` | Entry, authentication, legal, shared, revenue, or core operating path | Full state/breakpoint evidence before release; no deferred high-risk review |
| `core` | Frequent product work or creation flow | Full gate before calling the product Studio grade |
| `supporting` | Lower-frequency detail, proof, or utility surface | Same quality standard; may follow critical/core sequencing |

Tier changes order, not the definition of quality.

## Inventory workflow

1. Inspect discovery with `pnpm run experience:discover`.
2. Add explicit non-route surfaces or safe overrides where discovery cannot infer intent.
3. Rewrite the registry only with `pnpm run experience:discover -- --write`.
4. Run `pnpm run experience:validate` and inspect the diff.
5. Add fixtures and evidence before changing audit status.

Validation rejects unregistered discoveries, obsolete records, broken sources, missing canonical breakpoints, unknown findings/exceptions, expired exceptions, and changed material surfaces without complete fixture, screenshot, and accessibility coverage.
