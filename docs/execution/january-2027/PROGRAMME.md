# January 2027 programme

Updated 2026-09-04 by the principal integrator. Current phase: internal implementation and baseline reconciliation. Commercial launch and first venue outreach target: **21 January 2027**. No earlier sends or commercial opening. The [January decision](../../../content/hq/decisions/january-2027-launch.md) records the user's authority and supersession.

## Accountable workstreams

| ID | State | Implemented evidence | Remaining acceptance / owner |
|---|---|---|---|
| S1 Truth | Partial; baseline substantially repaired | Workspace 40f7755, doctor 0 failures/15 warnings; preserved Drive work; release branches; January policy/clock; repaired active Atlas/HQ drift; paired contract gates. | Principal: receiving-branch verification, final source map and closure of the acceptance matrix. |
| S2 Commercial readiness | Partial | Studio payment writer f59709a and populated HQ 27016169; 484 tests and synthetic payment-receipt browser rehearsal. App checkout 3d5b8ee8, lifecycle fc40f4ef, scope 254cccc6 and recovery 07a9de41. | Principal: final integrated regression and offer/activation gaps. Operator: designated Stripe test account and connector reauthentication. Demand remains unverified. |
| S3 Drive | Partial | Preserved local candidate 1ea5dd8a; backend 7d4040cb; UI 5cb93f68/cd0df47e; copy 450dda44. Linux checkpoint 50f16575 and bounded independent UI security review pass. | Drive owner: safe closed-tab recovery and complete product finish. Operator/provider: isolated OAuth/Clerk target and full in-product two-account lifecycle. Production 0028/0029 remain held. |
| S4 Suite coherence | Partial | Template generation 39cf0ff4; hydration/runtime 4ce64077; invitation visual d480fabf; utility navigation 4e4a3562; local built critical journeys 132/132. | Experience owner: final composition, dark/recovery/zoom checks, unresolved design-lab findings and complete golden stories. Human first-contact success remains unverified. |
| S5 Collaboration | Partial | Invitation arrival 9bb7e9df preserves B through authentication while A is active; 25 behavior/intent cases, including failed Drive dispatch. | Collaboration owner: committed first useful action, privacy-safe activation reporting and full role/revocation/recipient journey. No real email sent. |
| S6 Instruments | Closed — no-build for January | Accepted delegated decision and [A–F opportunity comparison](INSTRUMENT_OPPORTUNITIES.md). Existing templates win the January scope decision. | Reopen only after the recorded postlaunch evidence trigger and a new scope decision. No guest schema, plus menu or speculative chooser added. |

These verdicts distinguish implementation progress from release acceptance. The authoritative scenario register is [ACCEPTANCE.md](ACCEPTANCE.md). Component reports remain historical receipts; they cannot override a later failure.

## Accepted allocations

| Window | Work / exit |
|---|---|
| 4–11 September | Truth, Drive takeover, workspace and internal verification environment. |
| 14 September–9 October | Drive lifecycle and commercial test-mode preparation in parallel. |
| 5–30 October | Project identity, collaboration, invitation arrival and reproducible templates. |
| By 16 October | Instrument decision; no-build is already recorded. |
| 2–27 November | Integrated suite design and experience acceptance. |
| 30 November–11 December | Commercial rehearsal, security, resilience and six verdicts; feature freeze on 11 December. |
| 14 December–8 January | Stabilisation, internal use, maintenance and recovery. |
| 11–20 January | Exact release revisions, migration/restore/rollback and operator rehearsal. |
| 21 January | Controlled release checks, then commercial opening and separately authorized first outreach. |

These are allocations, not evidence of completed future work. Reforecast from measured remaining effort. After freeze, new work must resolve an acceptance failure/material defect and state its schedule cost.

## Source and integration authority

Current code and machine contracts establish implemented behavior; approved decisions establish intended policy. Resolve contradictions explicitly. Observed results identify commit, command/environment and receipt. Inferences and missing evidence remain labeled. Historical records are preserved under history/ and Git.

- Root: ops/january-programme at 40f7755, also locally integrated into ops/design-capability-stack. User-owned Signal Studio.code-workspace remains untouched.
- App receiving branch: release/january-2027 at 31c6646c before candidate integration. Draft [PR #168](https://github.com/ethanmcn2013-droid/app/pull/168) assembles Drive, billing, invitation, template and navigation changes. Drive [#165](https://github.com/ethanmcn2013-droid/app/pull/165) and billing [#167](https://github.com/ethanmcn2013-droid/app/pull/167) remain lineage, not separate competing writers.
- Studio receiving branch: release/january-2027 at 597509c before candidate integration. Draft [PR #176](https://github.com/ethanmcn2013-droid/studio/pull/176) contains January commercial/HQ/Atlas truth and paired gates.
- Verified dependency changes from App #164 (aa88c960) and Studio #173 (f01d436) are included in their release lineage. Current dependency exposure still follows the maintenance gate; historical/default-branch alerts are not automatically candidate findings.
- Git deployments are disabled for these internal candidates. Database targets must be isolated before any rehearsal write. No production migration or customer data operation was performed.

One principal integrator owns shared project identity, membership, schema, navigation and cross-repository contracts. Separate worktrees isolate files, not semantics. Integrate exact verified commits, rerun receiving gates and record the resulting revisions. App must receive its updated contract/vector consumer before Studio's stricter paired gate can pass. See [paired contract receipt](PAIRED_CONTRACT_RECEIPT.md).

## Verification already observed

| Candidate / environment | Result | Practical limit |
|---|---|---|
| App 50f16575, Linux run 33916021010 | Lint/typecheck/full test, DB contract 62/62, disposable migration fresh/no-op, Drive stages 11/11 + 20/20 + 332/332, build and performance ceilings pass. | New commits need receiving gates. Shared runtime 246.2 KB passes 247 KB ceiling but misses 170 KB target. No RUM or provider proof. |
| App 50f16575, Linux 33916020920 and 33916020941 | CI and registry/browser/locale checks pass. | Fixture coverage does not certify all golden stories or human understanding. |
| Built App 50f16575 + copy committed 450dda44; local Drive flag enabled | 132/132 critical browser cases; scoped owner confirmation and pending-state desktop/mobile review. | Fictional state; no DB/Google mutation or byte-resume claim. |
| Scoped independent Drive UI review at 50f16575 | 38 UI tests plus 12 additional action-boundary tests; no new validated scoped security finding. | Not an exhaustive backend audit or live-provider acceptance. |
| Studio 27016169 | 484 tests, typecheck/lint/build; populated synthetic HQ legacy-only claims excluded and two receipts total €2,500. | Operator-attested receipt logic, not actual settlement or revenue. |
| App 0731ab91 / Studio 004f9c9 | 30 App access-term/vector tests, 792 differential cases and four consumer CLI regressions pass locally. | Correct arithmetic is separate from capturing/updating the couple's wedding date. |

## Consequential contradictions repaired

- September launch and May/August experiment clocks: January target plus inert prelaunch clock; only real authorized sends may start evaluation.
- Plan choice / paidAt / cash: plan selection no longer writes paidAt; populated HQ requires matching operator payment receipts. Payment, redemption and useful activity remain separate.
- Paid-plan scope and revocation: App now scopes shared/local grants before ranking and respects local purchase tombstones; independent grants remain usable.
- Drive not-started records: repaired to candidate implementation with incomplete product/provider acceptance. The existing 50 MB cap remains; neither limitless files nor zero storage cost is promised.
- Atlas four-product/separate-subdomain topology, obsolete prices and public-only Timeline: current entries now reflect Notes/Tasks/Timeline plus Home, unified App and deliberate narrow publication. Former entries are explicit history, and drift checks cover the repaired active surfaces.
- Free .edu automatic grants versus paid verified Student policy: new automatic grants and email-only issuance disabled in App fc40f4ef; historical grants remain. New verified Student checkout remains unavailable until its actual policy is enforced.

## Decisions and operator facts

Routine engineering/design choices use delegated authority and are recorded as delegated, never as a specific founder selection. Mechanical checks precede fresh specialist challenge and principal synthesis. Blocking findings cannot be averaged away by a panel score. Seven-seat elevation is reserved for material design milestones.

Missing external facts now: Stripe connector returned oauth_token_invalid_grant; no test account was selected. Existing isolated Google OAuth/Clerk configuration has not been located in the preserved Drive worktree. The operator was asked for connection/project/configuration identity, not secret values. Independent implementation continues.

Launch and outreach remain separate actions in [the January operator gate](../../../content/hq/operator-todos/january-2027-go-no-go.md). Live providers, backup/restore, migration receipts, worker activation, support and customer journey smoke tests must precede commercial opening. A security, data-loss, payment or access-control blocker stops release regardless of the date.

## Maintenance and continuity

Active heartbeat january-maintenance-sync runs Mondays at 09:00 local time, quietly unless actionable. It reconciles verified maintenance into internal release branches only; no automatic deployment, production migration, email or outreach. It stops when canonical release completion is recorded. No duplicate dashboard or automatic launch job was created.

Retained handoffs: [commercial implementation](COMMERCIAL_HANDOFF.md), [populated HQ correction](HQ_TRUTH_REPAIR.md), [instrument decision](INSTRUMENT_OPPORTUNITIES.md), [earlier component reports](history/programme-component-reports-20260904.md), and App docs/projects/project-drive/.
