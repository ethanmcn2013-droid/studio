# January 2027 programme

Updated: 2026-09-04. Decision: [january-2027-launch](../../../content/hq/decisions/january-2027-launch.md).
User launch and first outreach target: **2027-01-21**. Current phase: internal testing.
Integration base: `release/january-2027`. Commercial work: `feat/january-commercial-readiness`.

## Acceptance states

These six evidence buckets organise acceptance. None is accepted by this
index, the target date, a successful build or a completed local milestone.

| ID | Acceptance state | Status | Evidence still required |
|---|---|---|---|
| A1 | Core app journeys work end to end | open | App-owner evidence for sign-in, invitations, access, Notes, Tasks, Timeline and Home, including recovery and role boundaries. |
| A2 | Experience is ready for first users | open | Rendered responsive, keyboard and accessibility checks on final integrated journeys; required design review and founder acceptance. |
| A3 | Security and release integrity are verified | open | Lead's final dependency, security, CI, build and release checks on the integrated revision. Existing dependency fixes are inputs, not programme closure. |
| A4 | Commercial terms and claims are truthful | open | Payment evidence and retry checks, public/checkout/contract parity, independent legal/tax evidence where required, and no unsupported claims. |
| A5 | Operations and manual launch gates are ready | open | Operator-owned provider, email, recovery and production readiness evidence, then separate recorded launch and first-outreach decisions. |
| A6 | Measurement supports honest decisions | open | Attribution, eligible-population and useful-action evidence from the app; redemption remains separate; no synthetic data in actual-use counts. |

## Milestones

Only 21 January is the founder-approved external target. Earlier dates below
are proposed internal checkpoints, not promises or additional approvals.

| Milestone | Checkpoint | State | Exit evidence |
|---|---|---|---|
| M1 Canonical programme and commercial source reconciliation | 2026-09-04 | recorded in this change | Decision, authority table, contradiction ledger, contract date and no-build comparison in Git. |
| M2 Commercial writers and proof reporting | next bounded Studio change | open | Local synthetic regression tests, typecheck/test/build results, retry runbook and app handoff. |
| M3 Integrated internal rehearsal | proposed 2027-01-07 | open | Lead collects final cross-repository journey and release evidence. |
| M4 Readiness review | proposed 2027-01-14 | open | All six states assessed; unresolved items assigned, with no automatic acceptance. |
| M5 User launch and first outreach | 2027-01-21 | open | Founder records both manual decisions against the integrated revision and evidence. |
| M6 Postlaunch learning review | after sufficient real evidence | open | Review useful actions, retention, payment and support evidence before new scope. |

## Source authority and contradictions

| Concern | Current authority | Secondary evidence / limit |
|---|---|---|
| Runtime behaviour | Current code and checked machine contracts | Code defects must be repaired to match approved policy; they do not ratify a different offer. |
| January date, scope and manual gates | January decision and `contracts/commercial-terms.v2.json` | This index tracks acceptance; it cannot approve deployment or outreach. |
| Price, term, Founding number | v2 contract and 2026-08-03 Founding 25 decision | €1,500 / €1,000 VAT-inclusive; legal/tax approval remains external evidence. |
| Product names and voice | Workspace/studio AGENTS, BRAND.md, URL/naming contract | Notes, Tasks, Timeline and authenticated Home. Older four-product descriptions are historical. |
| Positioning and venue wedge | Business Partner Review and Venue Edition Strategy, as amended | May execution dates and price-range hypotheses have been superseded. |
| HQ status | `content/hq` sources and actual ledgers | HQ renders sources; seeded/local CRM and old audit reports do not establish current external state. |
| Actual use | Attributed, committed useful-action instrumentation | Entitlements, redemptions, page loads, seeded work and test events are not useful activation. |

| Conflict | Resolution in this programme | Remaining verification |
|---|---|---|
| May first-send dates and August expiry versus January first outreach | Explicit supersession in active strategy/campaign sources; dated bodies retained. Proof clock must use January eligibility. | No historical or current external sends verified. |
| Null launch date / September review / no fixed dates | January 21 target in v2; retain waitlist-first and manual policy. | No release or outreach approval recorded. |
| Retired €1,500 founding material and €1,500–€4,000 hypothesis | Current offer is €1,500 standard / €1,000 Founding, both VAT-inclusive. Old packets are history, not send material. | Legal/tax and final collateral parity remain open. |
| Plan choice sets `paidAt` in onboarding | M2 must stop creating payment evidence and preserve prior legitimate `paidAt`. | Legacy paid rows need a separately authorised evidence audit; no data repair here. |
| Redemption/entitlement count labelled activation | M2 must separate redemption from useful work and show unavailable use as unverified. | App emission, attribution and production coverage remain unverified. |
| Local payment write succeeds while shared mirror fails silently | M2 must record evidence durably, report partial failure and support repeat-safe repair. | No production mirror health verified. |
| New instrument temptation versus January delivery | [Opportunity comparison](INSTRUMENT_OPPORTUNITIES.md); Guests & Seating no-build. | Postlaunch trigger is a review proposal, never automatic build approval. |

## Ownership and gates

Studio owns this commercial source/docs/tests slice. The lead owns workflows,
`vercel.json`, `scripts/january-*`, integration and release orchestration. App
changes are reported to the app owner. No app edits belong in this worktree.

Production database/provider changes, emails, deployment and outreach are
outside this task. No secrets are copied. No push or merge is authorised here.
Outstanding founder decisions live in
[the January operator gate](../../../content/hq/operator-todos/january-2027-go-no-go.md).
Existing legal, tax, migration and provider tasks remain open unless their own
evidence establishes completion. A prior task marked done is not proof of a
new production environment's readiness.
