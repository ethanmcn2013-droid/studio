# January changed-experience coverage

This is a scripted browser receipt for PR176's seven changed Studio pages, plus the HQ navigation surface repaired while testing them. It is not founder acceptance, a design-council review, a usability study, a baseline approval, or a release certification.

Worktree: `fix-january-studio-experience-coverage`, branch `fix/january-studio-experience-coverage`. Started at `4186397c4e6bb7a4666fba2daa00d9b8b7a62f80`; fast-forwarded the lead's dependency patch `17c5140523fca75bff7b140a1c85bde8da7fc739` before building. No dependency edits were authored here. The receiving lead retains subsequent programme/Atlas policy documentation changes.

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

## Receipts and remaining boundaries

Completed on build `xO06fYj4Y7Z_f9rgAAOWM`, source digest `c9ba17fcc8a67b4c3ef867c3a229ea4898e010de7169b0dbc0c70442645cc21f`: **188/188 required cases passed**, with zero blocking axe findings, page overflow, console/page faults, HTTP errors or forbidden requests. All eight owned registry entries now have complete scripted fixture/screenshot/accessibility/test coverage. `experience:validate --product=studio` and schema validation pass; audit status, human review and baseline approval remain unchanged.

Validation: production build (including TypeScript), standalone typecheck, focused lint, 25 focused receipt/existing capture tests, and the disposable fixture test covering six data scenarios passed. The full 484-test suite was reported passing by the lead on dependency base `17c5140`; this branch does not claim a fresh full-suite run. Four additional Atlas captures are explicitly non-passing review receipts for the list finding below.

The raw manifest retains 5,047 canceled requests, all `net::ERR_ABORTED` for same-origin `_rsc` requests. These are consistent with Next canceling prefetches during scrolling, navigation and context cleanup; they are not hidden as successful requests. The scoped attestor rejects other failed requests, asset failures, remote requests and HTTP faults. A focused negative test covers this distinction. No browser extension context is used.

The built preview remains at `http://127.0.0.1:4396` (owned start session 57153, Next child PID 14704 at handoff). `start.log` records its output. Stop only this recorded owned process/session when it is no longer needed. The disposable data is restored to the populated scenario after captures; restricted contexts still reach the password gate.

`build-receipt.json` binds the built artifact to tracked source/content/contracts and dependency inputs. `capture-manifest.json` records every required state/viewport, scenario, assertion, runtime result, axe violations and incomplete checks, screenshot digest and source digest. `coverage.json` is the machine-only closure result. Screenshots are capture candidates, not approved visual baselines. Long pages have actual viewport captures at representative sections because full-page images misrepresent fixed backgrounds.

The patched Atlas Mermaid check uses the actual `brand-enforcement` entry and its checked-in diagram, at all four widths. The SVG rendered without a fallback, render error or console fault. The page has an existing unrelated `list` accessibility violation (`.atlas-ul:nth-child(7)`); the Atlas receipt remains a review result and is not an accessibility or design acceptance. No Atlas content or renderer repair is bundled here.

Visual inspection also found malformed UTF-8 characters in that diagram's labels. The existing renderer encodes UTF-8 bytes to Base64, while the hydrator feeds `atob()` directly to Mermaid without decoding those bytes as UTF-8. This remains an Atlas rendering limitation; successful SVG creation does not claim faithful label typography.

Pending beyond this scripted scope: human visual/usability acceptance, council/baseline approval, unexpected root-crash presentation, real operator password login, Access mutation success/failure and provider-backed/product-analytics reads. The existing four-state Financial model/Founders Circle requirements are render coverage, not exhaustive live-source failure certification. This task does not claim any of those boundaries complete.

The review-mode development notice overlaps Blueprint's bottom camera controls at 390px. The first pointer attempt was retained as a finding; the disabled-camera fixture uses the notice's real “Hide development notice” control before operating the camera. It does not remove elements via injected CSS or suppress a runtime fault. Default captures retain the notice. This known preview-layout limitation remains for the lead's visual acceptance; the receipt does not claim unobstructed camera use before dismissal.

Manual inspection of Access at 390px also shows the expiry number input extending beyond its form column (`screenshots/studio.page.hq-entitlements/long-content/mobile-section-0.png`). Document-level overflow is zero, so the scripted check does not establish correct internal field fit. This is an explicit remaining visual repair, outside the completed read/render matrix and without any claim about Access mutation usability.
