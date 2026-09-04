# January acceptance register

Observed evidence is pinned to the named revision/environment. Open rows are assigned work, not exceptions. S6 closes by the accepted no-build decision; all six release acceptance states below remain open. Update this register after receiving checks; do not add another scoreboard.

## Release acceptance states

| ID | State | Owner | Closure evidence |
|---|---|---|---|
| A1 | Open — core creator/collaborator journeys | Principal / collaboration | Final integrated stories: capture, committed task, date, narrow publication, invited useful action, return through Home; project/role isolation and failure recovery. |
| A2 | Open — experience | Principal / experience | Final rendered desktop/mobile/state evidence, keyboard/focus/zoom/contrast/reduced-motion, material design synthesis. Human comprehension remains a separate postlaunch unknown. |
| A3 | Open — security and integrity | Principal / security | Exact-candidate threat findings disposition, negative authorization, secret custody, dependency gate and receiving CI. No plausible unresolved high/critical finding. |
| A4 | Open — commercial readiness | Principal / commercial | Actual isolated payment/fulfilment/redemption/use rehearsal, contract/copy parity and support recovery. No demand or revenue claim from fixtures. |
| A5 | Open — operations and release | Principal / operator | Target-bound migration, restore, rollback, provider configuration, worker disable/recovery and January production smoke receipts. |
| A6 | Open — honest measurement | Principal / collaboration/commercial | Useful committed action distinct from payment/redemption, scoped idempotent events, privacy suppression and actual authorized-send clock. |

## Scenario evidence and next proof

Commands below run in the owning App/Studio checkout with isolated data and declared environment. Existing tests are inputs; each owner's next proof closes the remaining gap.

| Scenario | Expected result | Owner / command or interaction | Evidence and state |
|---|---|---|---|
| Invite B while A active | After safe acceptance, both active identities and first view name B; A remains private. | App collaboration; pnpm test:invite-arrival; authenticated fixture journey | 9bb7e9df: 25 tests pass. Full real authenticated first action still open. |
| Invite scanners/replay/wrong account | GET never consumes token; wrong verified identity/expired/replayed claims refuse without leak. | App collaboration; same suite plus acceptance through login | Local tests observed; provider email/scanner behavior unverified. |
| Project switching and object actions | Project-owned object authorizes independently of cookie; direct links, history and unsaved Notes stay truthful. | App principal; project/suite gates plus golden-story browser | 50f16575 critical attestation passes, not full story closure. |
| Event bought in A, project B | A alone gets scoped paid resources; B/stranger remains Free unless independently entitled. | App security; pnpm test:billing | 254cccc6 scoped DB tests pass; receiving writer/reader composition being checked. |
| Shared store stale after revocation | Local tombstone defeats matching stale mirror; independent valid grant remains usable. | App security; actual local/shared SQLite reader and writer tests | 254cccc6 and 07a9de41 component tests; independent final composition review open. |
| Repeated or declined payment | Unpaid does not grant; same verified paid reference does not duplicate or extend one-time term. | App commercial; test:billing and Stripe test-mode webhook replay | Synthetic tests pass; live test-mode target unavailable. |
| Renewal/customer/cancellation/refund | Current exact paid invoice/customer/subscription governs positive access; every verified legacy reference revokes before mirror retry; customerless refund cannot create authority. | App commercial/security; stripe-lifecycle.test.ts, test-mode portal/webhooks | 07a9de41: 26 billing checks pass. Final combined/provider rehearsal open. |
| Erasure plus delayed billing | Account fence prevents checkout/portal and delayed grants before/after failed identity deletion. | App security; real deletion-orchestrator synthetic test | 07a9de41 exercises existing core erasure/fence. No live identity deletion. |
| Event term ends | Contract read-only behavior across supported operations, honest owner/member UI, independent grant policy. | App entitlement owner; policy and object-mutation matrix | Open; agent validating canonical policy before bounded repair. No inference from expiry arithmetic. |
| Sponsored wedding date changes | Stored wedding date drives promised grace extension without shortening or reviving revoked grants. | App commercial/activation; settings/redemption/date lifecycle | Arithmetic/vector tests pass; capture/update path incomplete and project/date authority needs verification. |
| Venue payment/fulfilment retry | Verified evidence assigns one founding number, exact financial terms and visible recoverable partial failure. | Studio commercial; venue-commercial and founding-number tests | f59709a/27016169 local tests; no production payment or ledger migration. |
| Legacy paidAt claim in HQ | Excluded from paid proof unless current record matches retained operator receipt. | Studio; pnpm test and populated HQ browser | 27016169: 484 tests and €0 then €2,500 synthetic transition pass. |
| Code expired/used/wrong actor | No duplicate entitlement/project; safe retry and failure language. | App/Studio commercial; comp/redeem tests plus full fixture rehearsal | Existing tests and code sampled; full combined payment-to-artifact rehearsal open. |
| Drive scope and grants | Only drive.file; stored project folder only; named users; no root or bearer-guest permissions. | App Drive; pnpm test:project-drive | 50f16575 Linux 11+20+332 checks pass; two-account in-product provider matrix open. |
| Drive secret custody | Ephemeral access token; authenticated encrypted refresh/session custody; no export/log/UI leaks. | App security; crypto/custody/Sentry and full Drive suite | 50f16575 checks pass; production key rotation/restore receipt open. |
| Live access and failed revoke | UI distinguishes current permission read, saved membership and pending revocation; no false success. | Drive owner; two-account remove/retry/outage interaction | Scoped UI security tests pass. Provider propagation/retry proof open. |
| Upload interruption and duplicate finalize | Same claim/session/object identity; expected marker and parent verified; ambiguous result never silently native-falls-back. | Drive owner; upload machine/backend tests, 50 MB fixture | Local/CI tests pass; real 50 MB/quota/session lifecycle open. |
| Closed-tab upload | Rediscover same claim, safely adopt confirmed completion; incomplete result stays recoverable without guessing bytes or duplicating. | Drive owner; non-minting probe/adoption work and browser | Discovery/intake protection implemented. Adoption and byte recovery remain open. |
| Owner change/leave/erasure | Explicit future ownership; old files preserved; pending operations block unsafe departure and use same journal. | Drive/security; handover/deletion matrix | Backend + UI local tests pass; real handover/outage/disconnect/erasure open. |
| Feature disabled with data | Native fallback and metadata remain usable; no claim that UI flag revokes backend permission. | Operations/Drive; UI/worker disable and recovery rehearsal | Default flags observed; complete staged disable/recovery open. |
| Private/public Timeline | Only intended artifact visible; revoked link and caches cannot expose private Notes/controls/files. | Collaboration/security; tenant/Timeline negative tests + browser | 50f16575 relevant gates pass; final composed privacy journey open. |
| First useful action and reporting | Recipient commits useful permitted work; creator sees honest contribution; no private detail to venue or analytics. | Collaboration; deterministic invited identity fixture and meaningful-action events | Open beyond safe acceptance. Scripted timing is not human comprehension. |
| Template repeated/interrupted | Reproducible fixture generation; application should avoid accidental partial/duplicate onboarding work. | Templates/principal; template DB/application tests | 39cf0ff4 generation idempotent. Existing explicit apply appends; safe request semantics and atomicity still need repair. |
| Experience/accessibility | No unexpected overlays/errors; desktop/mobile identity and controls; keyboard, zoom, contrast, reduced-motion and slow failures. | Experience; critical Playwright, locale cases and manual state review | 132 critical cases pass at built checkpoint. Utility/dark follow-up and final material states open. |
| Migration/rollback/restore | Additive receipts; no-op rerun; verified backup/restore; explicit target identity; metadata preserved on disable. | Operations; db:contract and scripts/db/verify-january-rehearsal.mjs | 50f16575 disposable pass. Production 0028/0029 unapplied, no production execution authorized. |
| Paired contracts | Exact matching App consumer and Studio canonical policy; explicit missing peer fails. | Principal; Studio contracts:check, term parity and CI release peer checkouts | Local 0731ab91/004f9c9 pass. Receiving paired CI awaits App integration. |

## External inputs and limits

The operator input request remains: reconnect Stripe and identify its test-mode account; locate the existing isolated Google OAuth/Clerk configuration by path/project/account name. Do not paste secrets. Historical Google sharing spike remains valid evidence for its narrow claim. No personal production Drive is implied.

No production changes or outbound communication are performed to make a checklist green. Internal verification continues independently. Prior dated reports and current errors are retained; no gate is lowered and no reviewer score establishes demand.
