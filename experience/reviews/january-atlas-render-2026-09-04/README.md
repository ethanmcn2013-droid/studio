# Atlas Unicode, list and mobile readability repair

Current evidence is recorded in “Current token-repair capture — 5 September” below. It supersedes earlier source/build/server identities; four default renders pass, with the extended registry state matrix still assigned.

The Unicode/list repair was committed as `e53e57d6efe60b416a8ee49ab7ef5b7df533f0e7`. This follow-up merges the final lead candidate `2a191a3479aa4cb3ce551e6e3ae629e39132e64e`, including Event commercial changes and the package/CI test wiring, then fixes the demonstrated mobile readability limitation. Worktree: `C:/Users/ethan/signal-studio-workspace/worktrees/studio/fix-january-studio-experience-coverage`; branch `fix/january-studio-experience-coverage`. No Atlas content, Students source, commercial contracts, dependency files, workflows, programme documents or registry approval fields were authored in this follow-up.

## Repair and focused evidence

The server transports Mermaid source as UTF-8 bytes in Base64. The client previously passed the binary string returned by `atob()` directly to Mermaid, corrupting labels containing `—` and `§`. It now decodes the bytes with a fatal UTF-8 decoder. Malformed transport keeps the escaped source fallback and records a visible render-error state plus a console warning; corruption is not reported as a successful diagram.

The Atlas markdown renderer previously accumulated indented child items into a paragraph directly under a `ul`. It now keeps nested `ul`/`ol` elements inside their owning `li`, supports wrapped item prose, and closes a list before subsequent unindented prose. Existing HTML escaping and constrained link handling remain in use. This remains the existing constrained renderer, not a general CommonMark implementation.

The actual `/hq/atlas/brand-enforcement` route passed four fresh isolated Chromium cases: 390×844, 768×1024, 1280×900 and 1440×960. All six SVG node labels match the authored text exactly, including the em dash and section sign. The real nested list has no non-`li` direct children. Each case has zero axe violations, horizontal page overflow, console/page errors, HTTP errors and forbidden requests. Screenshots and raw receipts are retained here, separately from the earlier 188-case evidence. The earlier four Atlas receipts in `january-commercial-2026-09-04` retain the original list failures.

The diagram now uses its native SVG width inside a labelled, focusable horizontal scroll region, with a visible instruction. Mermaid measures the same loaded font used by the page. The actual mobile diagram's labels measure 14.009 CSS pixels instead of shrinking to fit a 308px region; its content width is 1,306px. Tab reaches the region with a visible outline, and ArrowRight scrolls at every required width. A native emulated touch sequence moves mobile scrollLeft from 40px to 205px without page overflow. The initial composite CDP gesture command did not move the region; explicit native touch-start/move/end input did. No JavaScript assignment to scrollLeft or CSS injection was used to pass the interaction check.

Each axe result retains an incomplete contrast check for manual review. No other Atlas route/state, physical-device test, forced renderer failure in a browser, human/council acceptance or approved visual baseline is claimed. These are four default-state receipts with focused interactions; Atlas registry coverage was not promoted to complete.

Six Atlas regressions now run in the lead's default test command: exact authored Unicode transport, accents/non-Latin/supplementary characters, malformed Base64/UTF-8 rejection, nested/wrapped list semantics, ordered/unordered transitions and following prose, and escaping/fence preservation. The combined 491-test suite, nine receipt tests, six-scenario fixture test, standalone typecheck, full lint and production build pass. The combined 188-case capture and its attestation are recorded in the sibling `january-commercial-2026-09-04` review.

Build: `etkOKIYMHahiZKvqMPo-w`; source digest: `2e56c88ec8951b9bbd190360b9547e9f974042452916b00f723c437942519565`; Node `v24.19.0`. This is the same combined artifact used for the 188 cases. Its build receipt/log are mirrored here; all four Atlas renders were freshly executed against it. Build-log trailing whitespace is normalized only for repository hygiene.

## Reproduce and preview

Use Node 24 and the existing pinned dependencies, without env files. From this worktree:

```text
node --import tsx --test src/lib/atlas/render.test.ts
node --import tsx scripts/experience/january/fixture.ts populated
node scripts/experience/january/serve.mjs build --atlas
node scripts/experience/january/serve.mjs start --atlas
```

In a second terminal:

```text
node scripts/experience/january/capture.mjs --atlas
```

The `--atlas` flag selects this separate evidence directory; it does not change the safe server environment. The server uses disposable SQLite, a public synthetic session fixture, no inherited secrets, and no production/provider data. Browser contexts block external and mutation requests. The raw receipts retain local canceled RSC prefetch requests.

The previous owned server was stopped before building. The combined preview remains at `http://127.0.0.1:4396/hq/atlas/brand-enforcement`, owned start session **80367**, Next child PID **26652** at handoff. The current log is in the sibling commercial review's `start.log` and mirrored here. Only this owned process should be stopped when no longer needed. A fresh browser without the synthetic fixture cookie correctly reaches the HQ password gate; the synthetic fixture password is declared in `environment.mjs`.

## Combined integration

The original 188-case capture was historical evidence for its recorded build. This follow-up merges the final build inputs and runs the combined matrix again. Any subsequent source/content/contract/package change requires another actual build and capture; changing receipt dates or hashes does not establish a render. Reproduce the combined check with:

```text
node --import tsx scripts/experience/january/fixture.ts populated
node scripts/experience/january/serve.mjs build
node scripts/experience/january/serve.mjs start
# Separate terminal; no concurrent fixture reset or other capture:
node scripts/experience/january/capture.mjs
node scripts/experience/january/attest.mjs
node scripts/experience/validate.mjs --product=studio
```

The source digest uses tracked source/content/contracts and package/lock/workspace/Next-config inputs; generated evidence is excluded. The existing hash helper normalizes CRLF and bare CR to LF. The attestor rejects stale source, omitted cases, changed screenshots and runtime/accessibility faults. The lead owns package test scripts and CI wiring.

The two other demonstrated gaps are repaired in this same bounded follow-up: notice-aware spacing keeps Blueprint's camera usable while the notice remains visible, and the Access expiry input fits its grid column. Their measured/pointer/keyboard checks are in the combined matrix. This does not claim Access mutation workflow acceptance.

## Current token-repair capture — 5 September

Runtime4102b5c524373f10ae74e3153eaa0da7bac914ed in feat-january-commercial-readiness supersedes the historical build/server identities above. Actual build9paioZEdhaSy30PZA67hv, digest1d0e83ecb60d8b751f399653710a9be2d14d4080393c661dd90965a4fa60cd09, passed four fresh Atlas default-state renders with existing Unicode, nested-list, keyboard, touch-scroll, contrast and runtime assertions. Build and ds-check pass; the matching188-case commercial matrix also passed. The scoped screenshot and manifest files here are from this exact artifact. Manual incomplete checks remain retained.

The shared semantic-colour repair changed this route's source, so default-only Atlas proof does not complete its registry state matrix. The separate14-page coverage extension owns full required-state proof; no registry approval/hash was manufactured. Initial1382 and1b7a Atlas contrast failures are retained in the execution evidence. Original server80367/PID26652 is stopped; use the declared safe startup rather than a historical process ID.
