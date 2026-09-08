# Dot Studio — delivery record

Status: implemented review candidate, 8 September 2026. Production is not deployed. The film and studio are ready for human art-direction review.

## Open and run

- Local studio: http://127.0.0.1:3135/design/dot
- Repository: https://github.com/ethanmcn2013-droid/studio
- Branch: `feat/dot-studio`
- Baseline: `517cabb874e52c0152b9ea490de02bfa5683e7e2`
- Worktree: `C:/Users/ethan/signal-studio-workspace/worktrees/studio/feat-dot-studio`
- Declared launch entry: **Dot Studio — local review (3135)** in `.vscode/launch.json`.
- Preview command: `corepack pnpm exec next dev --webpack --hostname 127.0.0.1 --port 3135`.
- Build-thread preview session: 47814 (ephemeral; restart with the launch entry if the session has ended).

The local development route exposes the full authoring studio. Production builds expose the character exhibit and keep this new route noindex. Authoring uses the browser's local files and storage; it does not require an account or upload backend.

## What is delivered

One native SVG body circle carries ten mood loops, eight reactions and six short performances. A shared deterministic evaluator drives interactive playback, exact seeking and frame export. The face uses two white eyes with continuous shape controls, without a mouth. Pointer attention, bounded drag and gentle recovery give the character a response to the viewer. Pause, hidden/offscreen suspension and reduced-motion signature stills are built into the player.

The silent film recreates the reference's broad timing through 1,845 frames at 60 fps. Circular contraction, gaze and orbital companions replace body morphs. It renders frames 0–1844; the unrendered endpoint 1845 matches the opening state. The supplied MP4 can play once using normal video controls or repeat in the studio.

Local delivery files include:

- 1458-square master and 1080-square delivery MP4s, both 30.75 seconds.
- A five-second acting proof and sixteen individual mood/performance MP4s.
- A transparent 1458-square RGBA PNG master with 1,845 frames, manifest and frame hashes.
- A 395-file character library, including expressive SVG/PNG assets at five sizes, ink/paper variants, reduced-motion stills, gesture poses and faceless marks.
- Model sheet, film contact sheet and a local-only reference comparison.
- Source overlay, documentation, verification evidence and an offline review page.

The tightly framed original brand-kit marks remain canonical logo assets. New faceless assets retain the animation's wider safe-area framing.

## Verification evidence

`pnpm dot:test` passes all 14 tests. They evaluate all 6,549 frames across 18 timelines and all 90 directed mood transitions at three interruption points, plus loop seams, circular/contained geometry, seeded output, gesture/drag recovery, pause/hidden/reduced-motion states and presets. The suite is included in the passing main `pnpm test` run. TypeScript checks, scoped ESLint and the standard Turbopack production build pass.

Browser review covered 1440 × 1000, 390 × 844 and the actual 1280 × 720 viewport, with captures under `.impeccable/review`. Checks exercised play/pause, selection, keyboard activation, drag, frame stepping, per-clip loop defaults, reset, face visibility, non-exported safe-area guides, local reference synchronization and PNG sequence export. Revised controls meet the specified 44 px minimum targets. No runtime exceptions were observed. Development hot refresh emitted CSS preload warnings.

Local reference video required `media-src 'self' blob:` in the development report-only CSP. The served development header was verified; production policy is unchanged. The repository's separate `csp:check` script could not run in this isolated worktree because it expects four sibling product repositories at a hard-coded relative path. This is recorded as an unavailable workspace-wide check, not a pass.

The package verifier uses FFprobe for all 19 videos and validates all 1,845 alpha frames for dimensions, RGBA format, transparent corners and recorded SHA256 hashes. The browser ZIP writer was independently read and CRC-checked with Python's ZIP implementation. `delivery-manifest.json` contains the media metadata and checksums.

`performance.json` measures Node evaluation plus SVG serialization and independently compressed core entries. It does not measure browser painting, real-device frame intervals or incremental production bundle size. It must not be cited as a device performance certification.

## Review and remaining acceptance

`finish-review.md` contains the independent finish review. `fix-evidence.md` records the build thread's correction evidence, and `fix-verdict.md` records the reviewer’s focused scoring of the four findings. The original direction was retained.

The implementation is a concrete, usable first edition. Final face/personality acceptance, a five-person blinded expression-recognition check, and the agreed desktop/phone p95 rendering and frame-interval targets remain human/device review gates. These are not claimed complete by code tests or automated review. The next release decision should use the supplied film, model sheet and interactive studio.

The source overlay requires the existing Studio repository at the recorded baseline; it is not a standalone Next application. Install its existing lockfile with `corepack pnpm install --frozen-lockfile`, use the declared preview command and follow `README.md` for export commands. FFmpeg must be available for MP4 creation.
