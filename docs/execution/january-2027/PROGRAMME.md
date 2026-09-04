# January 2027 programme

Updated: 2026-09-04. Decision: [january-2027-launch](../../../content/hq/decisions/january-2027-launch.md).
User launch and first outreach target: **2027-01-21**. Current phase: internal testing.
Integration base: `release/january-2027`. Commercial work: `feat/january-commercial-readiness`.

## Workstream status

The user accepted these six workstreams and delegated their bounded internal
implementation, including design review and the January instrument no-build
decision. Routine review checkpoints do not require renewed founder approval.

| ID | Workstream | Status | Current evidence / next step |
|---|---|---|---|
| S1 | Truth | in progress | Canonical milestone `4de29aa`; this index incorporates the accepted allocations and subsequent lead receipts. Reconcile final integrated references. |
| S2 | Commercial | partial | Studio onboarding/payment/proof changes pass local regression tests. Lead reports five App runtime billing tests passing; recurring Stripe lifecycle rehearsal remains open. |
| S3 | Drive | partial | Lead reports retained work, January-targeted PR #165, Linux lifecycle/recovery and local migration checks passing. Separate verify failure under investigation; production 0028/0029 held. |
| S4 | Suite | open | Accepted November allocation; final integrated journey evidence remains to be supplied. |
| S5 | Collaboration | open | Accepted October allocation; implementation and final journey evidence remain to be supplied. |
| S6 | Instruments | no-build decision recorded | Delegated, accepted January decision: Guests & Seating is no-build. Opportunity comparison and postlaunch review trigger are retained in `INSTRUMENT_OPPORTUNITIES.md`; no instrument build is required to finish January. |

Workstream progress is separate from the six acceptance states below. A
recorded decision or completed local change does not close programme acceptance.

## Accepted planning allocations

These allocations were **accepted by the user**. They are the programme's
planning schedule, not newly proposed checkpoints. Overlap is deliberate.

| Dates | Allocation |
|---|---|
| 2026-09-04 through 2026-09-11 | Baseline |
| 2026-09-14 through 2026-10-09 | Drive and commercial |
| 2026-10-05 through 2026-10-30 | Collaboration |
| 2026-10-16 | Instruments decision |
| 2026-11-02 through 2026-11-27 | Suite |
| 2026-11-30 through 2026-12-11 | Closure and feature freeze |
| 2026-12-14 through 2027-01-08 | Stabilisation |
| 2027-01-11 through 2027-01-20 | Final readiness |
| 2027-01-21 | Release and first outreach target, with manual gates |

## Acceptance states

These six evidence buckets organise acceptance. None is accepted by this
index, the target date, a successful build or a completed local milestone.

| ID | Acceptance state | Status | Evidence still required |
|---|---|---|---|
| A1 | Core app journeys work end to end | open | App-owner evidence for sign-in, invitations, access, Notes, Tasks, Timeline and Home, including recovery and role boundaries. |
| A2 | Experience is ready for first users | open | Rendered responsive, keyboard and accessibility checks on final integrated journeys and delegated design review under the user's accepted authority. |
| A3 | Security and release integrity are verified | open | Lead's final dependency, security, CI, build and release checks on the integrated revision. Existing dependency fixes are inputs, not programme closure. |
| A4 | Commercial terms and claims are truthful | open | Payment evidence and retry checks, public/checkout/contract parity, actual required legal/tax final-readiness evidence, and no unsupported claims. Routine commercial copy does not acquire a blanket legal-approval gate. |
| A5 | Operations and manual launch gates are ready | open | Operator-owned provider, email, recovery and production readiness evidence, then separate recorded launch and first-outreach decisions. |
| A6 | Measurement supports honest decisions | open | Attribution, eligible-population and useful-action evidence from the app; redemption remains separate; no synthetic data in actual-use counts. |

## Milestones

These deliverable milestones sit within the accepted allocations above.
They do not replace that schedule or introduce routine approval gates.

| Milestone | Checkpoint | State | Exit evidence |
|---|---|---|---|
| M1 Canonical programme and commercial source reconciliation | 2026-09-04 | recorded in this change | Decision, authority table, contradiction ledger, contract date and no-build comparison in Git. |
| M2 Commercial writers and proof reporting | next bounded Studio change | open | Local synthetic regression tests, typecheck/test/build results, retry runbook and app handoff. |
| M3 Integrated internal rehearsal | stabilisation, 2026-12-14 through 2027-01-08 | open | Lead collects final cross-repository journey and release evidence. |
| M4 Readiness review | final readiness, 2027-01-11 through 2027-01-20 | open | All six states assessed; unresolved items assigned, with no automatic acceptance. |
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

Integration evidence reported by the lead on 2026-09-04 (not independently
rerun in this Studio worktree): workspace `40f7755` integrated; doctor 0
failures / 15 warnings. App January `31c6646c` and Studio January `597509c`
pushed with Git deployments disabled. Drive local work retained in `1ea5dd8a`,
security dependency merge `24a59e72`, migration CI `7d4040cb`, and PR #165
retargeted to January. Linux typecheck/test/lint and Drive full
lifecycle/recovery passed in run `33909047957`. A separate verify failure is
under investigation. Production migrations 0028/0029 remain held. Local
typecheck, DB contract 62/62 and a disposable full migration rerun passed.
These receipts advance integration evidence; all six acceptance states stay
open until their remaining evidence is assessed.

The lead separately owns App checkout, billing/webhook and Event discrepancy
work. A root agent owns App template reproducibility and will supply counts;
those counts remain unverified here. Do not duplicate either workstream.

Further lead report, 2026-09-04: App commercial status is **partial**. Five
runtime billing tests passed, including mirror retry and shared-writer
concurrency; Event uses 12 calendar months. Client-callable grant/expire
helpers and development no-payment grants were removed. Recurring Stripe
subscription lifecycle still needs its dedicated rehearsal. These are reported
App results, not a Studio certification or closure of A4/A5.

Studio owns this commercial source/docs/tests slice. The lead owns workflows,
`vercel.json`, `scripts/january-*`, integration and release orchestration. App
changes are reported to the app owner. No app edits belong in this worktree.

The lead integrator is authorised to push and merge internal candidates.
This commercial agent's local assignment prohibits its own push or merge;
that is an agent boundary, not a programme prohibition. Production remains
held. Production database/provider changes, emails, deployment and outreach
are outside this local task. No secrets are copied.
Outstanding founder decisions live in
[the January operator gate](../../../content/hq/operator-todos/january-2027-go-no-go.md).
Actual required legal/tax final readiness and held migration/provider tasks
remain subject to their own evidence. Do not invent blanket legal approval
for ordinary commercial statements or re-gate delegated work. A prior task
marked done is not proof of a new production environment's readiness.
