# January changed-experience coverage

This is a scripted browser receipt for PR176's seven changed Studio pages, plus the HQ navigation surface repaired while testing them. It is not founder acceptance, a design-council review, a usability study, a baseline approval, or a release certification.

Worktree: `C:/Users/ethan/signal-studio-workspace/worktrees/studio/fix-january-studio-experience-coverage`, branch `fix/january-studio-experience-coverage`. The initial slice was committed as `3f741fcf332143283ebbd7f47e5a1c21f38c2473`, followed by the Atlas Unicode/list repair `e53e57d6efe60b416a8ee49ab7ef5b7df533f0e7`. This final combined capture merges lead candidate **`2a191a3479aa4cb3ce551e6e3ae629e39132e64e`**, including Event commercial content/contracts, the January receipt CI gate and the default Atlas regression test wiring. Four runtime files then repair the three delegated layout findings. No product data/content/contracts, package/lock files or workflows were authored in this follow-up.

## Why CI failed

CI run 33917505528, `design quality / Reject unregistered Studio surfaces and stale evidence`, rejected Today, Blueprint, Access, Financial model, Founders Circle, Reporting and Students. `scripts/experience/lib.mjs::validateRegistry` compares normalized source hashes. A changed source requires fixture, screenshot and accessibility coverage to be `complete`. Refreshing the hashes would have bypassed this check without proving a render. This repair retains those old materiality hashes and requires actual per-state receipts before changing coverage fields.

## State applicability

The previous registry did not assign eleven states to every HQ route: Today and Reporting had eleven, Blueprint ten, and Access, Financial model, Founders Circle and Students four each. The following corrections are implementation decisions delegated to the agent, supported by route code, not founder/council selections or waivers.

| Surface | Required states in this receipt | Source rationale |
| --- | --- | --- |
| Today, Reporting | empty, populated, partial-failure, error, restricted, dense, long-content, reduced-motion, keyboard-only | Both await their reads and render derived results. Neither page has a first-use/onboarding branch or persisted onboarding state. An empty live dataset is the first-use data presentation. No `loading.tsx` exists at HQ or an ancestor: an artificial loading screenshot would depict a state the routes do not implement. |
| Blueprint | default, empty, partial-failure, error, restricted, disabled, long-content, reduced-motion, keyboard-only | The server renders a read-only operating map. `blueprint-canvas.tsx` owns in-memory camera zoom and section navigation, not editable records or save actions. Remove saved/unsaved/success and nonexistent route loading; retain the real disabled 50% zoom limit. Add empty, unread and restricted variants for the real guarded data reads. |
| Access, Financial model, Founders Circle | default, long-content, reduced-motion, keyboard-only | Existing requirements retained. Access includes the real GET roster and long venue list. Operator mutation workflows are outside this read/render acceptance. |
| Students | default, long-content, reduced-motion, keyboard-only | All four existing requirements retained. Long content uses the real authored semester, pricing/terms and opened committee disclosure. Keyboard uses Tab, Enter and Space on that disclosure. No injected marketing claims. |
| HQ navigation | default, long-content, reduced-motion, keyboard-only | Existing four requirements retained. Added to this repair because the validated GET logout prefetch fault required changing its control. Mobile opens the real drawer; long/keyboard checks reach the final Access room. |

All four required viewports remain: mobile 390×844, tablet 768×1024, desktop 1280×900, wide 1440×960. No breakpoint was removed. The resulting required matrix is 188 cases including navigation (172 for the seven requested pages).

`error` here means the routes' own failed-data-read presentation, not an invented uncaught exception. `src/app/error.tsx` is a separate registered root error surface; this task does not claim to have rendered an unexpected crash. `empty` means empty live commercial/CRM sources, not deletion of the committed operating documents, founder to-dos, or map content.

## Safe reproducible fixtures

`scripts/experience/january/fixture.ts` adapts the earlier `work/studio-truth-fixture.mjs` approach documented in `docs/execution/january-2027/HQ_TRUTH_REPAIR.md`. Only disposable `file:` SQLite databases under `experience/output/playwright-results/january-commercial/` can be opened. Environment-provided DB URLs are not used by the fixture. Its tables derive from existing schema columns; this is not migration/constraint validation or a new application schema.

- Empty: no live commercial or CRM rows.
- Populated: two payments recorded by the existing writer into explicit disposable stores. The existing server proof predicate verifies the matching bindings and €2,500 current annual amount. A third legacy paid claim remains excluded.
- Dense: 36 synthetic venues/CRM records, including deliberately long venue names and recorded synthetic contact dates; no commercial clock activation is claimed.
- Partial failure: remove the disposable shared payment journal table while the Studio CRM remains readable.
- Error: also remove the disposable CRM table and shared entitlement table. The UI must keep missing evidence distinct from zero.
- Restricted: omit the synthetic session cookie and exercise the production access guard/redirect. This is not password-login acceptance.

The fixture server rejects env files and allowlists only operating-system runtime plumbing plus explicit synthetic settings. No inherited provider, payment, email, operator or remote DB credentials are passed. Product analytics databases remain unconfigured and their unavailable values remain visible. Committed HQ operating content remains authoritative; no operator/customer database is read. The isolated Chromium contexts block external requests and all mutation requests, and record any attempt. No production provider, publication, email, code issuance or real data write was exercised.

## Reproduce

Use Node 24 and the repository-pinned pnpm 10.33.4, then `pnpm install --frozen-lockfile`. No env file is needed or permitted. Run from the owning worktree:

```text
node --test scripts/experience/january/receipt.test.mjs
node --import tsx --test scripts/experience/january/fixture.test.ts
node --import tsx scripts/experience/january/fixture.ts populated
node scripts/experience/january/serve.mjs build
node scripts/experience/january/serve.mjs start
```

The declared production Next start command runs on `http://127.0.0.1:4396`. In a second terminal, with only one fixture/capture process running at a time:

```text
node scripts/experience/january/capture.mjs
node scripts/experience/january/capture.mjs --atlas
node scripts/experience/january/attest.mjs
node scripts/experience/validate.mjs --product=studio
```

`--experience=studio.page.students`, `--state=keyboard-only` and `--breakpoint=mobile` select bounded reruns. The runner preserves unrelated current-source receipts and refuses a mismatched built artifact. A `--pilot` run is only a preliminary mobile/desktop default sample; it never satisfies the required matrix. `attest.mjs --write` updates only the owned matrix/coverage fields after evaluating real receipts. It leaves materiality hashes, audit scores/status, review dates, approved baselines and human/council records untouched.

The focused runner reuses the existing breakpoint configuration, axe/Playwright packages, source hashing and `captureRunFailures`. It does not change `validate/lib.mjs`, schemas, global capture policy, workflows or CI thresholds. Negative tests reject omitted/duplicated cases, wrong widths/fixtures, stale source/screenshots, missing interaction evidence, runtime faults and an inactive reduced-motion preference.

## Validated repairs

The first clean built browser pilot found muted HQ copy at 4.39:1 on paper-deep; the scoped HQ muted token now clears that background. Blueprint's dark small labels/legend also needed contrast repair, and its fixed legend overlapped the outer HQ rail. The legend now clears the rail and has an opaque dark background. Description-list fields now own valid `dl/dt/dd` markup, and the live dot has an appropriate image role. The financial table is focusable and labelled; its negative values retain readable red contrast. Blueprint's section jump respects reduced motion.

The initial console 405 was `/hq/logout?_rsc=…`: a Next link prefetched a POST-only endpoint. The control is now a POST form. The repaired pilot recorded no console/page faults or blocking axe findings for all seven pages at mobile and desktop. No error was suppressed to obtain that result.

The full matrix then found Students' wide keyboard position could leave its scroll-driven closing fade partly progressed, lowering attribution contrast to 4.31:1. Only that page's closing-section fade was removed so the attribution stays opaque at intermediate keyboard scroll positions. The final build and capture matrix include this repair.

The final bounded repairs address three demonstrated causes. Blueprint's camera and the preview notice occupied the same fixed mobile bottom edge; camera spacing now responds to the visible notice without changing the notice or shared App contracts. The entire Blueprint matrix checks that the notice remains visible and every camera button is unobstructed; the disabled case uses real pointer clicks without first dismissing the notice. Access's number input retained an intrinsic minimum width; its grid labels and expiry input can now shrink to the available column. The measured 390px input and column are both 136px wide, and keyboard arrows edit the native number value without submitting the form.

Atlas previously shrank a wide SVG to a phone's width. It now retains native diagram dimensions inside a labelled, keyboard-focusable horizontal scroll region with an instruction, and measures labels using the page's loaded font. Four separate Atlas default-state receipts prove exact Unicode labels, valid lists, 14px rendered label size and keyboard scrolling; mobile also proves native emulated touch scrolling. They are indexed in `../january-atlas-render-2026-09-04/README.md`. No other Atlas state or human usability acceptance is inferred from those focused renders.

## Receipts and remaining boundaries

Completed on the final combined build **`etkOKIYMHahiZKvqMPo-w`**, source digest **`2e56c88ec8951b9bbd190360b9547e9f974042452916b00f723c437942519565`**: **188/188 required cases passed**, with zero blocking axe findings, page overflow, console/page faults, HTTP errors or forbidden requests. Capture finished at `2026-09-04T22:18:33.182Z`. The lead's exact `pnpm run experience:january:attest` command verified all eight covered entries against the current source and PNG bytes. This replaces the first slice's receipts with actual new browser observations; no old source hash or approval field was refreshed. Registry and overrides are unchanged in this follow-up. `experience:validate --product=studio` and schema validation also pass.

Validation against this combined candidate: **491 full-suite tests** (16 + 418 + 57, including all six Atlas regressions), the lead's `experience:january:test` command (nine receipt tests plus the fixture test covering six disposable data scenarios), full lint, standalone typecheck, production build and final receipt attestation all pass. Logs are retained in this directory. The changed capture script received a further focused lint check after correcting native touch input. Four additional Atlas default-state captures pass against this same build; they do not stand in for unrendered Atlas states.

The raw manifest retains 5,063 canceled requests, all `net::ERR_ABORTED` for same-origin `_rsc` requests. These are consistent with Next canceling prefetches during scrolling, navigation and context cleanup; they are not hidden as successful requests. The scoped attestor rejects other failed requests, asset failures, remote requests and HTTP faults. A focused negative test covers this distinction. No browser extension context is used.

The built preview remains at `http://127.0.0.1:4396` (owned start session **80367**, Next child PID **26652** at handoff). The previous owned server was stopped before building. `start.log` records current output. Stop only this recorded owned process/session when it is no longer needed. The disposable data is restored to the populated scenario after captures; restricted contexts still reach the password gate.

`build-receipt.json` binds the built artifact to tracked source/content/contracts and dependency inputs. `capture-manifest.json` records every required state/viewport, scenario, assertion, runtime result, axe violations and incomplete checks, screenshot digest and source digest. `coverage.json` is the machine-only closure result. Screenshots are capture candidates, not approved visual baselines. Long pages have actual viewport captures at representative sections because full-page images misrepresent fixed backgrounds.

The `atlas-manifest.json` retained in this directory is historical evidence of the original Unicode/list findings. Current Atlas proof is in the sibling `january-atlas-render-2026-09-04` directory, with the same combined build receipt. The actual authored diagram's Unicode labels and list semantics are repaired; mobile readability and native scrolling are now measured as described above. Atlas still has only four default-state receipts, so its registry coverage was not promoted. Incomplete axe contrast checks remain available for manual review.

Pending beyond this scripted scope: human visual/usability acceptance, council/baseline approval, unexpected root-crash presentation, real operator password login, Access mutation success/failure and provider-backed/product-analytics reads. The existing four-state Financial model/Founders Circle requirements are render coverage, not exhaustive live-source failure certification. This task does not claim any of those boundaries complete.

The three demonstrated layout issues are resolved within this scripted scope. Before-images/findings remain in Git history and the retained diagnostic files. Current screenshots show an unobstructed Blueprint camera and the contained Access field (`screenshots/studio.page.hq-entitlements/long-content/mobile-section-0.png`); the current assertions check internal geometry rather than treating zero page overflow as sufficient. They do not certify broader mutation workflows or human/council acceptance.

Any later change to tracked source/content/contracts or package/lock/workspace/Next-config inputs invalidates this receipt digest. Rebuild and recapture that candidate; do not change dates/hashes to make old evidence appear current. CRLF and bare CR normalize to LF, while generated evidence stays outside the source digest. Subsequent lead edits confined to execution documents do not change these build inputs.
