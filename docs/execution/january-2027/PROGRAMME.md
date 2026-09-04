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
| S1 | Truth | in progress | Canonical `4de29aa`, accepted schedule/authority `0993913`, A–F comparison `9b6e4c6`; subsequent lead receipts indexed here. Reconcile receiving-candidate references. |
| S2 | Commercial | partial | Studio implementation `f59709a` and wording `003a863`; 476 tests passed. App `3d5b8ee8` / PR #167 Linux verify passed; security review and recurring renewal/cancellation/refund rehearsal remain open. |
| S3 | Drive | partial | Lead reports retained work, January-targeted PR #165, Linux lifecycle/recovery and local migration checks passing. Separate verify failure under investigation; production 0028/0029 held. |
| S4 | Suite | in progress | Template reproducibility `39cf0ff4` reviewed by the lead; pinned source `ed02bc8`, counts below. Application still appends. Final integrated journey evidence remains open. |
| S5 | Collaboration | partial | Invitation + Drive reconciliation `9bb7e9df`, 25 behavioral tests plus typecheck/contracts passed per lead. Receiving integration and remaining handover/recovery evidence remain open. |
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
| M2 Commercial writers and proof reporting | baseline / commercial allocation | implemented locally; integration open | `f59709a` + `003a863`, local synthetic regression and browser evidence; see `COMMERCIAL_HANDOFF.md`. |
| M3 Integrated internal rehearsal | stabilisation, 2026-12-14 through 2027-01-08 | open | Lead collects final cross-repository journey and release evidence. |
| M4 Readiness review | final readiness, 2027-01-11 through 2027-01-20 | open | All six states assessed; unresolved items assigned, with no automatic acceptance. |
| M5 User launch and first outreach | 2027-01-21 | open | Founder records both manual decisions against the integrated revision and evidence. |
| M6 Postlaunch learning review | after sufficient real evidence | open | Review useful actions, retention, payment and support evidence before new scope. |

## Source authority and contradictions

| Concern | Current authority | Secondary evidence / limit |
|---|---|---|
| Runtime behaviour | Current code and checked machine contracts | Code defects must be repaired to match approved policy; they do not ratify a different offer. |
| January date, scope and manual gates | January decision and `contracts/commercial-terms.v2.json` | This index tracks acceptance; it cannot approve deployment or outreach. |
| Price, term, Founding number | v2 contract and 2026-08-03 Founding 25 decision | €1,500 / €1,000 VAT-inclusive; actual required legal/tax final readiness remains unverified here. |
| Product names and voice | Workspace/studio AGENTS, BRAND.md, URL/naming contract | Notes, Tasks, Timeline and authenticated Home. Older four-product descriptions are historical. |
| Positioning and venue wedge | Business Partner Review and Venue Edition Strategy, as amended | May execution dates and price-range hypotheses have been superseded. |
| HQ status | `content/hq` sources and actual ledgers | HQ renders sources; seeded/local CRM and old audit reports do not establish current external state. |
| Actual use | Attributed, committed useful-action instrumentation | Entitlements, redemptions, page loads, seeded work and test events are not useful activation. |

| Conflict | Resolution in this programme | Remaining verification |
|---|---|---|
| May first-send dates and August expiry versus January first outreach | Shared January clock remains prelaunch/inert. Date, cash and CRM contact metadata cannot establish an authorised first send or start a deadline. | No authorised first-send receipt reader is connected; no historical or current external sends verified. |
| Null launch date / September review / no fixed dates | January 21 target in v2; retain waitlist-first and manual policy. | No release or outreach approval recorded. |
| Retired €1,500 founding material and €1,500–€4,000 hypothesis | Current offer is €1,500 standard / €1,000 Founding, both VAT-inclusive. Old packets are history, not send material. | Legal/tax and final collateral parity remain open. |
| App Clerk webhook grants a free workspace tier to any `.edu` address via `EDU_PRO_DAYS`; billing “Got a code” copy mentions `.edu` | Lead-reported contradiction with v2 Student policy: €9.99/year, verified eligibility, unavailable until enforcement. App candidate `3d5b8ee8` does not change Student business logic. | Owner: App backlog. Reconcile webhook and billing claims; no App edit or Stripe upgrade/course change in this Studio task. |
| Plan choice sets `paidAt` in onboarding | M2 implementation `f59709a` leaves new `paidAt` null and preserves prior payment evidence. | Legacy paid rows need a separately authorised evidence audit; no data repair here. |
| HQ still counted legacy `paidAt` as cash and passed paid proof after the writer repair | [Populated-source correction](HQ_TRUTH_REPAIR.md): shared `venue_payment` receipt must match the current financial record. Studio-only, unaudited and mismatched claims are counted separately and excluded. Today, proof, verdict, reporting and model projections use that truth. | Operator receipts attest to retained evidence; provider settlement and legacy reconciliation remain unverified. |
| Live May cash slope and “Contact venues” verdict survived the January panels | Removed the May clock and automatic pace comparison; historical €250,000/model assumptions are explicitly not a new January ratification. No payment implies launch authority or a self-funding business. | January evaluation stays inert until actual authorised outreach evidence is connected. |
| Consumer checks could select the wrong checkout from a Studio worktree | `APP_REPO_PATH` now validates an explicit absolute unified App checkout for all suite, commercial, read and meaningful-action consumers. Missing paths and drift fail. | Lead owns matching release checkout/pin in CI. The separate default venue-term parity script still skips an absent sibling. |
| Redemption/entitlement count labelled activation | M2 implementation separates redemption from useful work and shows unavailable use as unverified. | App emission, attribution and production coverage remain unverified. |
| Local payment write succeeds while shared mirror fails silently | M2 implementation records shared payment/audit evidence atomically, reports Studio mirror failure and supports same-evidence repair. | No production mirror health verified. |
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
work. The root agent owns App template reproducibility; its reviewed counts
are now recorded below as lead-reported evidence. Do not duplicate either
workstream.

Further lead report, 2026-09-04: App commercial status is **partial**. Five
runtime billing tests passed, including mirror retry and shared-writer
concurrency; Event uses 12 calendar months. Client-callable grant/expire
helpers and development no-payment grants were removed. Recurring Stripe
subscription lifecycle still needs its dedicated rehearsal. These are reported
App results, not a Studio certification or closure of A4/A5.
No test-mode Stripe account has been provisioned, per the lead; renewal and
cancellation still require observed test-mode evidence. The lead's App build
finished with exit 0 and its built checkout preview is on localhost:4345.
App billing commit `3d5b8ee8` is pushed with draft PR #167 targeting January.
Invitation originals `dee86e21` and `0dfb2f8d` are integrated with Drive on
`fix/january-invite-integration`; the lead reports conflicts reconciled while
preserving the journal, token claim and cookies. An actual SQLite integration
test confirms that provider failure after membership commit leaves a pending
Drive intent. The subsequent reconciliation commit is `9bb7e9df`: 25 behavioral
tests include failed Google dispatch preserving the exact pending B grant;
typecheck and contracts pass. These results remain lead-reported and do not
close S3/S5 or their acceptance states here.

Latest lead integration receipt, 2026-09-04:

- Drive UI `5cb93f68` provides default-off A Custodian; 27 UI tests and 101
  contracts pass. Pending handover and reload-recovery work stays with the
  same UI agent. No live Google, council or full-build claim is made.
- Template `39cf0ff4` was reviewed: original Studio source `ed02bc8` is pinned
  and reproducibility restored. Wedding Tasks: 18, including two done; six
  Tasks milestones at -270, -42, -21, -14, -7 and +14 days. The separate legacy
  Timeline seed has eight items in one project. Generation creates no
  duplicates; application still appends. These are fixture counts, never
  actual-use counts.
- Billing PR #167 Linux verify passes for `3d5b8ee8`. Security review continues;
  recurring renewal, cancellation and refund remain unverified. No test-mode
  Stripe account provisioning is claimed.
- The lead is aggregating `feat/january-core-integration` for receiving checks
  before the release branch. No integrated acceptance or production release
  is inferred from these component receipts.

## Maintenance cadence

Lead-reported active and verified heartbeat: `january-maintenance-sync`,
Mondays at 09:00 in local app time. It maintains internal App/Studio release
branches only, remains quiet when state is unchanged, and must not deploy,
migrate production, send email or conduct outreach. This programme record is
the index; no duplicate automation or dashboard is created by this task.

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
