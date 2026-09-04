# Atlas Unicode and list repair

Bounded follow-up to `3f741fcf332143283ebbd7f47e5a1c21f38c2473`, delegated by the lead after accepting the 188-case coverage slice. Worktree: `C:/Users/ethan/signal-studio-workspace/worktrees/studio/fix-january-studio-experience-coverage`; branch `fix/january-studio-experience-coverage`. No Atlas content, Students source, commercial contracts, dependency files, workflows, programme documents or registry approval fields changed in this follow-up.

## Repair and focused evidence

The server transports Mermaid source as UTF-8 bytes in Base64. The client previously passed the binary string returned by `atob()` directly to Mermaid, corrupting labels containing `—` and `§`. It now decodes the bytes with a fatal UTF-8 decoder. Malformed transport keeps the escaped source fallback and records a visible render-error state plus a console warning; corruption is not reported as a successful diagram.

The Atlas markdown renderer previously accumulated indented child items into a paragraph directly under a `ul`. It now keeps nested `ul`/`ol` elements inside their owning `li`, supports wrapped item prose, and closes a list before subsequent unindented prose. Existing HTML escaping and constrained link handling remain in use. This remains the existing constrained renderer, not a general CommonMark implementation.

The actual `/hq/atlas/brand-enforcement` route passed four fresh isolated Chromium cases: 390×844, 768×1024, 1280×900 and 1440×960. All six SVG node labels match the authored text exactly, including the em dash and section sign. The real nested list has no non-`li` direct children. Each case has zero axe violations, horizontal page overflow, console/page errors, HTTP errors and forbidden requests. Screenshots and raw receipts are retained here, separately from the earlier 188-case evidence. The earlier four Atlas receipts in `january-commercial-2026-09-04` retain the original list failures.

Each axe result retains an incomplete contrast check for manual review. The existing diagram scales down substantially on mobile; correct DOM labels and a clean scripted result do not establish unaided visual readability or human usability. No other Atlas route/state, forced renderer failure in a browser, human/council acceptance or approved visual baseline is claimed. Atlas registry coverage was not promoted.

Six focused tests pass: exact authored Unicode transport, accents/non-Latin/supplementary characters, malformed Base64/UTF-8 rejection, nested/wrapped list semantics, ordered/unordered transitions and following prose, and escaping/fence preservation. The nine receipt tests also pass. Focused lint and the production build including TypeScript pass. No fresh full-suite or 188-case run was performed after this follow-up, per lead coordination.

Build: `kg0QhEjLun3Iy7TGiAVwt`; source digest: `8ef26a2cb823b588eb26171b289847b46ad9e195a13fbf8b1a8bd8ef49fec414`; Node `v24.19.0`. `build-receipt.json`, `build.log`, `atlas-manifest.json` and PNG hashes bind the focused proof to this source. Build-log trailing whitespace is normalized only for repository hygiene.

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

The preview was restarted after the first commit. It remains at `http://127.0.0.1:4396/hq/atlas/brand-enforcement`, owned start session **17060**, Next child PID **23584** at handoff, with output in `start.log`. Only this owned process should be stopped when no longer needed. A fresh browser without the synthetic fixture cookie correctly reaches the HQ password gate; the synthetic fixture password is declared in `environment.mjs`.

## Combined integration remains with the lead

The original 188-case capture is historical evidence for its recorded build. Event commercial content/contracts and the lead's package/CI wiring change the combined source digest. Do not refresh a date/hash or rely on complete flags to reuse it. After merging the complete candidate, the lead must rebuild, recapture and attest the actual combined source once:

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

Unchanged independent gaps from the first slice: the Blueprint review notice covers the mobile camera until dismissed, and the Access expiry field extends beyond its form column at 390px. Neither is silently certified as repaired here.
