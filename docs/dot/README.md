# Dot Studio

Dot Studio adds a circular, expressive character runtime and authoring surface at `/design/dot`. It extends the existing Signal identity with two eyes and no mouth. The original faceless character remains in its existing design-page section, with a link to the new studio.

## Use locally

Use the **Dot Studio — local review (3135)** launch entry in `.vscode/launch.json`. It runs `corepack pnpm exec next dev --webpack --hostname 127.0.0.1 --port 3135` in this worktree. Open `http://127.0.0.1:3135/design/dot`.

The public exhibit has one live stage, ten static mood previews, six short performances, film playback, pause, frame scrubbing, pointer attention, bounded drag and reactions. The page follows reduced-motion preference and suspends its clock offscreen or in a hidden tab.

Development mode additionally exposes the inspector and saved takes. The inspector provides frame number/count, previous/next frame, preview speed, deterministic seed, per-clip loop bounds, neutral reset, face/effect visibility, a safe-area guide, colour variants, local reference comparison, SVG/PNG stills and a cancellable PNG-sequence ZIP export. Reference files remain browser-local object URLs; no upload service or network transfer is used. Pause or scrub the film to compare matching reference timestamps. Closing the inspector releases the reference file. The guide never enters exports.

Saved takes live in localStorage, with at most twelve named entries, and can be downloaded/reopened as validated JSON. Presets record version, clip, seed, colour, stage, speed, effects and face visibility. Earlier v2 presets without the face field default to visible. Preview speed changes review playback; exports retain the authored 60 fps timing. PNG/SVG and sequence exports use a transparent background. Browser PNG antialiasing may vary by browser; the pinned Sharp/FFmpeg path below produces the delivery masters.

Authoring is development-only in this version; production builds render the exhibit. The route is noindex pending a release decision. No production deployment is implied by this branch or its review record.

## Render assets

Install the lockfile dependencies with `corepack pnpm install --frozen-lockfile`. FFmpeg must be on PATH for MP4 encoding. Sharp is resolved through the pinned Next dependency; no new production package is introduced.

```powershell
corepack pnpm dot:export --clip film --size 1458 --out output/dot
corepack pnpm dot:export --clip film --size 1080 --out output/dot-delivery
corepack pnpm dot:export --clip film --size 1458 --alpha --out output/dot-alpha
corepack pnpm dot:export --clip proof --size 1080 --out output/dot-proof
corepack pnpm dot:export --library --out output/dot-library
```

Any mood/performance ID is accepted as `--clip`. Opaque clips generate zero-based PNG frames, a 60 fps H.264 MP4, frame checksums and a manifest. Alpha mode preserves a transparent PNG sequence. The renderer includes frame 0 through 1844 for the 30.75-second film and does not append frame 1845. The evaluated endpoint matches frame 0. There is no audio track. Library output includes 32/64/102/256/512 px expressive assets, ink/paper mood variants, reduced-motion stills, eight gesture poses and three faceless marks. Faceless exports retain the animation safe-area framing; the original brand-kit marks remain the canonical tightly framed logo assets.

## Source map

| File | Responsibility |
|---|---|
| `src/lib/dot/model.ts` | Closed rig schema, palette, clip registry, seed and preset validation |
| `src/lib/dot/clips.ts` | Deterministic mood, gesture, performance and reference-derived film poses |
| `src/lib/dot/player.ts` | One clock, interruption bridges, input priority, pause/visibility/reduced motion |
| `src/lib/dot/render.ts` | Native body circle, continuous eye paths, layered orbit threads and SVG output |
| `src/lib/dot/export-browser.ts` | Local PNG rasterization and stored ZIP writer |
| `src/components/dot/` | Responsive exhibit, static specimens, lazy inspector and export UI |
| `scripts/dot/export.ts` | Offline vector-to-PNG-to-film pipeline |
| `scripts/dot/verify.ts` | Scoped evaluator benchmark and ZIP interoperability fixture |

The body exposes one radius and one uniform scale; there are no body scaleX/scaleY or skew controls. The face can rotate independently. Transitions blend from the current pose over 220 ms with the shortest rotation arc. Pointer gaze eases towards its target and is contained within the circular face. Drag is bounded to 22/18 model units and settles over a damped 700 ms release. Reduced motion chooses each mood's signature still with body translation, spin and secondary effects removed.

## Verify and review

```powershell
corepack pnpm dot:test
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm exec eslint src/components/dot src/lib/dot scripts/dot src/app/design/dot
corepack pnpm exec tsx scripts/dot/verify.ts output/dot-verification
```

`dot:test` covers every frame in all 18 timelines (6,549 frames), all 90 mood transitions at three interruption points, circular/contained geometry, loop seams, shortest spin recovery, eight gestures, pause, hidden/reduced motion, pointer containment, bounded drag, seeded output and preset validation. The suite is included in `pnpm test`.

`BRIEF.md` records the direction; `finish-review.md` records the independent review; `delivery-manifest.json` records rendered media metadata/hashes; `performance.json` is explicitly a Node evaluator/SVG benchmark, not a browser frame-time or deployed bundle measurement. Screenshots in `.impeccable/review/` are Git LFS assets. Human expression recognition, device-profiled p95 scripting/painting and founder final art-direction acceptance are not claimed by automated checks.

See `IMPLEMENTATION.md` for the current worktree, preview session, verification status and remaining review decision.
