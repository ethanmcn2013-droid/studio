# Bounded independent Studio review

**Verdict: no actionable regression or evidence-waiver issue found in this diff.**
Reviewed immutable `e60d7b04e1d80a0f84f0bb56fcc36c230aee4f64` against
`2a191a3479aa4cb3ce551e6e3ae629e39132e64e`. This accepts the stated scripted
evidence scope, not a release, human usability, or complete accessibility gate.

The four runtime changes are confined to `src/app/globals.css`,
`src/app/hq/entitlements/GiveAccessForm.tsx`,
`src/components/atlas/atlas-mermaid.tsx`, and `src/lib/atlas/render.ts`.
The capture runner adds assertions for the three layout findings. Auth, product
data/content/contracts, state matrix, registry/overrides, approval fields and
gate thresholds are unchanged against the reviewed base.

## Validated controls

- **Source and capture binding:** independently recomputed the digest from all
  994 immutable tracked build-input files. It equals
  `2e56c88ec8951b9bbd190360b9547e9f974042452916b00f723c437942519565`.
  Both evidence sets name build `etkOKIYMHahiZKvqMPo-w`, also matching the retained
  `.next/BUILD_ID`. Build time precedes both completed captures. All **188 required
  cases plus 4 Atlas default cases**, exact viewports, page-source hashes and
  **276 image references** validate against the actual committed bytes. No
  registry materiality hash or human-approval field was refreshed by this diff.
- **Three layout corrections:** the mobile Blueprint camera remains above the
  visible preview notice; assertions check overlap and actual pointer reachability
  before clicking down to disabled 50% zoom. Access's native number input fits its
  grid column (136px at 390px viewport), with real keyboard value changes and no
  form submission. Atlas retains native diagram width in a labelled, focusable
  scroll region, waits for loaded fonts and preserves roughly 14.009px labels.
  Receipts include keyboard scrolling at all four sizes and native emulated touch
  scrolling on mobile. Current inspected PNGs agree with these limited claims.
- **Auth and source-state boundaries:** the production HQ guard remains in use.
  Synthetic authenticated contexts use a token derived from the explicit fixture
  password; restricted contexts omit it and render the password gate without HQ
  content. The capture runner blocks external and mutation requests. Disposable
  stores use the actual payment writer/proof predicate; failed-read fixtures break
  the real table seam, and the sampled partial-failure PNG visibly says **unread**.
  No runtime response/HTML substitution or new state waiver was found.
- **Accessibility evidence stays bounded:** all 192 recorded cases have zero axe
  violations, and the correction preserves an explicit focus outline and scroll
  instruction. The raw receipts retain 257 incomplete rule entries: 169 contrast,
  56 aria-prohibited-attr and 32 link-in-text-block checks. These still need manual
  review. Atlas has only four default-state cases; its registry was not promoted.

The 5,063 commercial and 107 Atlas failed requests are retained, same-origin
`net::ERR_ABORTED` requests with `_rsc` parameters. The negative test rejects
other origins, assets and error types; these records are not counted as successful
requests or generalized into an HTTP-error waiver.

## Independent execution and limits

**16 tests passed, 0 failed:** nine receipt negatives/controls, one fixture test
covering six synthetic states, and six Atlas regressions. Executed on Node
22.23.2 against a `git archive` snapshot with allowlisted synthetic environment
and explicit disposable stores. The original capture/build used Node 24.19.0.
I did not rerun the author's full 491-test suite, build, or 192 browser cases.

I inspected six committed PNGs: Atlas mobile/wide, Blueprint disabled mobile,
Access long-content mobile, HQ partial-failure mobile and HQ restricted mobile.
Hash/dimension checks cover every primary capture; additional section images
were hash checked. Evidence authenticity is supported by the source, runner,
receipts and sampled renders; hashes alone are not an independent recording of
every prior browser interaction.

No source repository, running preview, provider or real database was changed.
All execution writes were confined to this task's scratch/output directories.
Access mutations, real password login, provider-backed reads, unexpected root
crashes, unrendered Atlas states and human/council acceptance remain outside the
claimed scope. Any later runtime/content/contract/dependency changes require
their own build and capture binding.

Receipts: [test output](studio-e60d7b04-review/tests.txt),
[binding results](studio-e60d7b04-review/bindings.json),
[read-only binding checker](studio-e60d7b04-review/review.mjs),
[scratch test runner](studio-e60d7b04-review/run-tests.mjs).

Selected evidence: [Atlas mobile](studio-e60d7b04-review/atlas-mobile.png),
[Atlas wide](studio-e60d7b04-review/atlas-wide.png),
[Blueprint camera](studio-e60d7b04-review/blueprint-mobile.png),
[Access input](studio-e60d7b04-review/access-mobile.png),
[unread state](studio-e60d7b04-review/hq-unread-mobile.png),
[restricted state](studio-e60d7b04-review/hq-restricted-mobile.png).
