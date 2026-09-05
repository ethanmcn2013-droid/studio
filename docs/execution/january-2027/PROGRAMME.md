# January 2027 programme

Updated 2026-09-05 by the principal integrator. Current phase: internal implementation, independent verification and integration. Commercial launch and first venue outreach target: **21 January 2027**. No earlier sends or commercial opening. The [January decision](../../../content/hq/decisions/january-2027-launch.md) records the user's authority and supersession.

Current programme estimate: **approximately 60% complete**, including verification, recovery, stabilisation and release preparation. This is a principal planning assessment against the accepted scope, not a measured percentage, a count of passing tests or release authorization. S6 is closed; S1–S5 remain partial. Implemented candidate work receives no final acceptance credit until its independent and receiving gates pass. Live-provider proof, sustained internal use and final release exercises remain open; customer demand and human comprehension are separate postlaunch outcomes. This estimate is deliberately unchanged by individual follow-up test successes.

## Accountable workstreams

| ID | State | Implemented evidence | Remaining acceptance / owner |
|---|---|---|---|
| S1 Truth | Partial; foundations established | Workspace40f7755, doctor0 failures/15 warnings; preserved Drive work; January policy and experiment clock; App receivingfe4 is Linux-green; current programme/acceptance and immutable paired gates. | Principal: final receiving reconciliation, capability/source-map completion and acceptance closure. |
| S2 Commercial readiness | Partial; internal flow implemented | Verified payment evidence, exact recoverable issuance/readback, atomic claim and support packet. Actual three-store standard/Founding/pilot rehearsal24 checkpoints plus14 independent failure probes pass; repeated on the combined candidate. | Principal: final commercial surfaces/support rehearsal and receiving gates. Operator: designated Stripe test account and connector reauthentication. Event/Student offer limitations remain explicit; demand is unverified. |
| S3 Drive | Partial; core implementation integrated | Backend, ownership/access UI and completed-upload recovery are in receivingfe4. Scoped UI security review and recovery81 authored plus39 independent cases pass. | Drive owner: final integrated experience and failure-state acceptance. Operator/provider: isolated OAuth/Clerk target and real two-account upload/revoke/reauth/handover/erasure lifecycle. Incomplete closed-tab bytes cannot resume. Production0028/0029 remain held. |
| S4 Suite coherence | Partial; follow-up repairs integrated | Canonical template/caller retry, invitation arrival, navigation/contrast and Home scope fixes. Notesf04 independently passes198 checks/scenarios; combined App1829 passes132 critical cases plus27 Notes browser scenarios. | Experience owner: final source-bound receipts/receiving gates, remaining design-lab findings, complete authenticated golden stories and human accessibility/comprehension. Studio14 coverage and narrow-layout repairs remain active. |
| S5 Collaboration | Partial; useful-action reporting implemented | Invitation B while A is active passes25 cases. Actual deliberate Tasks creation, atomic delivery intent, canonical attribution, closed-day report, suppression and account erasure are in the candidate; independent fix154 positive checks and actual three-store composition pass. | Collaboration owner: complete creator/recipient/role/revocation story and final receiving verification. Operator: actual provider/delivery configuration and maintained erasure processing. Capture defaults off; no real email or human first-minute success is claimed. |
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
- App receiving branch: release/january-2027 at77d22a6bdbe6764da53daf1159049eef58fc523d after verified [PR #169](https://github.com/ethanmcn2013-droid/app/pull/169) integration on5 September at01:21 UTC. Candidatee9f10184 passed independent evidence/config review plus CI33935140018, Verify33935140114 and Design33935140093. Receiving CI33935902852, Verify33935903012 and Design33935902871 are running; final receiving acceptance is pending. Previous receivingfe4a2b60 from [#168](https://github.com/ethanmcn2013-droid/app/pull/168) passed all three Linux workflows. GitHub also marked ancestor Drive [#165](https://github.com/ethanmcn2013-droid/app/pull/165) and billing [#167](https://github.com/ethanmcn2013-droid/app/pull/167) merged; original worktrees remain preserved.
- Studio receiving branch: release/january-2027 at 597509c before candidate integration. Draft [PR #176](https://github.com/ethanmcn2013-droid/studio/pull/176) contains January commercial/HQ/Atlas truth and paired gates.
- Verified dependency changes from App #164 (aa88c960) and Studio #173 (f01d436) are included in their release lineage. September 4 bounded patches ac9321a2 (App) and 17c5140 (Studio) reduce each candidate production audit to zero; full App Linux and Studio 484/typecheck/lint/build pass. Historical/default-branch alerts are not automatically candidate findings.
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

- Event offer versus access enforcement: delegated owner/funding policy recorded; App a10432dd refuses new Event sessions while existing settlement/refund recovery stays active. Full public/private access closure and historical designation remain assigned work.
- Sponsored-use readiness: corrected the earlier claim that migration was the sole remaining step. The formerfe4 receiving baseline had a no-op sink. PR169 now integrates durable delivery and the independently verified actual three-store reporting composition into receiving77d; its receiving checks are pending. Studio's paired consumer remains a candidate and capture defaults off. This is not a deployed capability.
- Template and redemption partial writes: 540933c0 request-bound application and b2e6f6fa atomic new comp fulfilment preserve retry identity and prevent partial starter/capacity writes. Historical partial grants require reconciliation.
- Recovery evidence: a full App populated restore exposed a stale ongoing backfill count. 3d8a36e1 retains every execution proof and immutable migration checksum while restricting continuous proofs to durable invariants.

## Decisions and operator facts

Routine engineering/design choices use delegated authority and are recorded as delegated, never as a specific founder selection. Mechanical checks precede fresh specialist challenge and principal synthesis. Blocking findings cannot be averaged away by a panel score. Seven-seat elevation is reserved for material design milestones.

Missing external facts now: Stripe connector returned oauth_token_invalid_grant; no test account was selected. Existing isolated Google OAuth/Clerk configuration has not been located in the preserved Drive worktree. The operator was asked for connection/project/configuration identity, not secret values. Independent implementation continues.

Launch and outreach remain separate actions in [the January operator gate](../../../content/hq/operator-todos/january-2027-go-no-go.md). Live providers, backup/restore, migration receipts, worker activation, support and customer journey smoke tests must precede commercial opening. A security, data-loss, payment or access-control blocker stops release regardless of the date.

## Maintenance and continuity

Active heartbeat january-maintenance-sync runs Mondays at 09:00 local time, quietly unless actionable. It reconciles verified maintenance into internal release branches only; no automatic deployment, production migration, email or outreach. It stops when canonical release completion is recorded. No duplicate dashboard or automatic launch job was created.

Retained handoffs: [commercial implementation](COMMERCIAL_HANDOFF.md), [populated HQ correction](HQ_TRUTH_REPAIR.md), [instrument decision](INSTRUMENT_OPPORTUNITIES.md), [earlier component reports](history/programme-component-reports-20260904.md), and App docs/projects/project-drive/.

## Current integration checkpoint — 4 September, late execution

The following supersedes earlier component counts where the source has changed. App ca95830e combines the caller repair fd481617 with exact-project sponsored welcome and first-view marking. Forty-nine composed claim/onboarding/helper tests, typecheck and focused lint pass. A new venue claim requires project-management authority; a task-only editor cannot replace shared setup. First-view marking is not useful activity. Legacy experimental new-project sponsorship/date adoption remains unverified and is explicitly excluded from this closure.

App e273e671 passed Linux CI 33924047821 and Verify Tasks 33924047847. Design run 33924047875 rejected stale materiality receipts after the redemption fixture contract changed; the final ca95830e built browser run and receipt regeneration are in progress. Earlier Windows full-test failures remain failed receipts; Linux success does not rewrite them. The receiving branch has not yet integrated this candidate.

Studio e60d7b04, integrated into the candidate at f9c3d1d, has 188/188 final combined state/breakpoint captures plus four Atlas renders. The source-bound attestation, 491 tests, typecheck, lint and build pass. The three mobile layout findings are repaired. Fresh independent review and receiving paired CI remain pending. These results do not establish a quality-council verdict or human comprehension.

Two internal gaps now have implementation owners and separate worktrees; neither is merely a credential blocker:

- Commercial: recoverable issuance from the verified Studio commercial record through the shared ledger to actual App comp codes, same-request retries, readback/withdrawal and a support packet. Current narrow App provenance contract a84f48c1 has four SQLite tests; the complete issuance pipeline is still being implemented.
- Collaboration: one deliberate Tasks mutation with atomic activity/queue intent, purpose-bound delivery, exact project-and-actor provenance, closed-day Tasks-only reporting, cohort suppression and erasure/retention. Existing no-op delivery is not credited as completed reporting.

Shared Studio schema/migration ownership is centralized with the commercial lane: additive issuance 0001, usage 0002. App usage reserves 0030; an issuance migration would use 0031 only if needed. These are internal branch allocations, not executed production migrations. Service keys and target bindings remain purpose-separated. No new source-of-truth dashboard or generic event platform is authorized by this implementation detail.

## Receiving integration — 4 September, 23:10 UTC

App PR168 merged exact verified head 9105c81a into release/january-2027 as fe4a2b60. CI33927170658, Verify33927170636 and Design33927170606 all passed. Independent review executed 47 existing-project welcome/action checks against unchanged ca95830e runtime source and demonstrated no residual scoped P2 defect. The 132-case final browser receipt remains valid for that runtime. Receiving checks are a new observation, not assumed from the PR result.

Studio candidate 69221eb has completed local 491-test/typecheck/lint/build verification, 188 state captures, four Atlas renders and independent 16-check source/capture review. Its paired Linux gates now use the integrated App release. Final Studio receiving integration remains pending.

Two separate Notes/photo security leads were boundedly validated against ca95830e with eight isolated checks. The Notes Photo action retained authentication, rate and model guards; no missing-authorization defect was demonstrated. Calendar erasure reproduced deletion of retry custody before failed provider revocation; no current live-token writer/population or credential disclosure was established, so security severity is withheld. Owner: App principal; next action is a bounded erasure-order repair retaining exact token custody until revocation succeeds, with failure/retry and owner-isolation tests. This does not reopen or certify Drive provider behavior.

Active follow-up implementation remains separately owned: Notes unsaved-writing/history and project navigation (experience lane), scoped aggregate Home links (principal), recoverable venue issuance (commercial lane), and Tasks-only sponsored-use delivery (collaboration lane). Their work is not covered by the baseline merge verdict.

## Follow-up checkpoint — 5 September, internal candidates

The App baseline above is integrated and receiving-green. Follow-up changes are isolated from it on feat/january-activation-integration and their owning branches. Author tests below are scoped observations, not independent or receiving acceptance.

| Candidate | Observed implementation / checks | Next owner and proof |
|---|---|---|
| Home 6d428ffa (a16b2651 predecessor) | Aggregate observations open the same authorized reading scope; Home/footer retain explicit context. Fifteen Home tests plus demo regression pass. Independent review of a16 found an alternate analytics-engine fallback to saved A; 6d repairs dispatch and authorization selection. | Fresh reviewer: verify HOME-01 repair. Principal: final integrated Home/Briefing and navigation evidence. |
| Notes 8963e919 | Writing retained before blur/history disposal; actor/project/note/version-bound recovery, pending-save race guards, authorized route context. Author observed 14 browser, 16 isolated server/page and 185 nearby checks. | Fresh reviewer: disprove recovery/privacy/context claims. Principal: integrated shell/remaining navigation consumers and full gates. |
| Calendar erasure f809cfa8 | Revoke before deleting retry custody; short transaction rechecks complete observed token rows, failure blocks account deletion. Author observed 42 focused/adjacent checks. | Fresh reviewer: failure/retry/race and actual route verification. Live population remains unknown; no calendar feature is claimed. |
| Venue issuance App 2dcd26ff + b96e61e7; Studio 1f77d0e | Recoverable canonical issuance/readback/withdrawal and operator support packet. Review found erased claims could block sibling-code withdrawal; b96 retains a non-identifying consumed-code erasure receipt. Author observed 87 repair/adjacent checks. | Fresh reviewer: verify S2-01 fix. Commercial owner: compose actual issuance, claim and committed task across isolated stores. |
| Tasks sponsored use App 7c571a61; Studio ef648efe | Actual task creation, durable intent, signed routes, verified provenance, closed-day report, privacy suppression, erasure and retention. Author observed 57 App,115 Studio,9 paired scenarios. Capture defaults off; coverage is Tasks creation only. | Fresh reviewer: security/privacy/recovery challenge. Principal: migration/test registration, integration, full builds/Linux and exact paired rehearsal. |

Studio's receiving integration exposed a real design-system gate failure at 9ee2bec: shared token overrides and an increased raw-colour count. The repair uses HQ-owned semantic colours and updates their actual consumers, without changing the grandfather ceiling. Final runtime4102b5c builds successfully; Atlas now passes all four rendered widths after two retained contrast failures identified additional global label consumers. The 188-case commercial recapture is running. Earlier e60 receipts remain history and do not certify these changed source inputs. Automated contrast checks do not close manual accessibility or human usability.

App0030 and Studio additive0001/0002 remain local candidate migrations, not production receipts. No provider credentials or target identity have been supplied, and no deployment, live provider mutation, real message or commercial opening has occurred.

Independent follow-up findings: S2-01 is verified fixed at App b96e61e7. The original 409 reproducer now receives200; two fresh actual account/project erasure sequences prove consumed-code custody, issue replay and unused-sibling withdrawal. Ten new,77 adjacent and5 reviewer controls pass; this is not combined S2/S5 acceptance. S5 review at App7c571a61/Studioef648efe validated S5-01: authenticated report DTO coverage.daysCovered reveals an activity-derived count withheld by the main metric for a one/two-workspace cohort. Owner: collaboration; repair the shared outgoing coverage envelope and re-test the entire returned object. A separate defensive transport improvement will require the exact bounded success acknowledgement before retiring event/erasure intents. No public exposure or authentication bypass was demonstrated, and the latter is hardening rather than a validated exploit.

At runtime4102b5c the full188commercial cases and four Atlas cases passed, with ds-check, full lint and build successful. The final registry validator then identified14 additional source-changed pages lacking required complete coverage (not an invalid build/capture). The mechanical token consumer repair touched these pages, so the earlier188-case matrix is insufficient for integration. A separate experience-owned extension now covers their actual applicable states and four widths; hashes and review approvals remain unchanged. Studio PR176 stays unmerged until this gap is closed. The failed validator is retained as an observed gate, not a prose waiver.

The current App follow-up is draft PR169 (feat/january-activation-integration), separate from receivingfe4. Home7479c7d4 passed fresh25-check independent verification, including four original comma/normalization repros refusing before policy, and is integrated atcbda6d4d. Calendarf809 is integrated with explicit Windows synthetic-fixture retention and export-error hygiene at768951fc:46serialchecks/type/module/focusedlint pass, fresh review assigned. Local/remote design validation truthfully rejects stale Home materiality until final rendered evidence is renewed; no hash-only refresh is accepted.

Tasks reporting fixes are now App6822c1f1/Studio c53c42ca. The shared outgoing snapshot omits observed days/modules under suppression; invalid acknowledgements keep both event and erasure custody. Author132focusedchecks pass. The separately composed standard/Founding/explicitpilot scenarios each pass eight actual milestones from issuance through claim, deliberate task, report and account erasure/unused-code withdrawal. Fresh independent S5 fix verification and final combined gates remain open.

Notes8963e919 remains unintegrated after fresh review validated three P2 recovery/context defects: sibling-project pending capture lost during retry, mixed grouped/loose catalog omission blocking exact capture, and a cold mobile subscriber recovering stale cached A after quota failure. Poincare owns these repairs. Chandra separately owns the Studio14 coverage extension from the paired Studio43bf371 candidate, with Confucius's source/state map. No unauthorized sharing was demonstrated; the Notes findings remain real correctness/data-recovery blockers.

Fresh production-only package audits on Appb6c3eba5 and Studio04433b73 returned zero advisory entries and zero reported severities. Default-branch GitHub notices are a different dependency state. These registry results do not replace code security review or provider lifecycle acceptance.

## Latest verification — 5 September

App follow-up b6c3eba5 passed Linux CI33932238817 and Verify33932238755. Design33932238799 failed on stale Home materiality evidence, as expected from the observed source change; the failure remains an open gate. Fresh independent review of unchanged account/export runtime768951fc passed46 authored plus14 independent checks, with no scoped residual blocker. This confirms diagnostic suppression and preservation of available actor-scoped exports and Windows test assertions; deployed/provider behavior remains outside that verdict.

Studio3efd649 passed Linux CI33932417722 and Verify33932417699. Design33932417663 failed on the14 additional pages requiring complete state/breakpoint evidence. Current runtime4102b5c has a successful single-invocation188-case capture and four Atlas renders, but those do not satisfy the additional coverage. PR176 remains a draft and unmerged.

The actual paired commercial/use rehearsal is committed at Appda62317b and Studio43bf371. All three scenarios (standard Venue Edition, Founding25, explicit pilot) passed24 checkpoints through actual local issuance, claim, deliberately created task, attributed reporting, account erasure and unused-code withdrawal. App93 and Studio219 focused checks, paired term parity and both typechecks passed. The first expanded Studio run ended in a Windows native-process failure after assertions; that failure is retained separately from the successful repeated219-check run. Confucius owns independent S5 fix verification; Plato owns fresh review of the three-store composition. No real settlement, email, provider lifecycle, production migration or rollout is claimed.

Those independent reviews are now complete: S5 acknowledgement/privacy154 positive checks and actual three-store composition24 checkpoints plus14 additional failure probes pass. Notesf04a766e independently passes198 checks/scenarios and88 source-input comparisons, closing the three P2 follow-up defects plus conflicting-destination retry. Principal App182935f7 integrates Home, account/calendar, venue issuance/reporting and Notes; the new default and browser gates preserve historical receipts and execute all five Notes fixture runners. Final132-case integrated browser verification is in progress.

Studio1fa638a passed Linux CI33933578789 and Verify33933578866 with the new mandatory fulfilment/usage suites and installed immutable App peer. Appac9f40a9 Linux CI exposed unannotated entitlement reads: the reviewed correction documents global exact-code uniqueness, stored-object ownership and caller-scoped erasure using the existing per-statement contract. No predicate or detector was relaxed;24 sensitivity/read checks and fresh caller review pass. Fresh combined Linux gates remain pending. A separate gate review found the old main fallback could select a peer without the required fixture; every trigger now requires a reviewed compatible immutable counterpart. Final release promotion must re-pin and verify both actual receiving runtimes.
