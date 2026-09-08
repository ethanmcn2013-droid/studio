# Dot Studio finish review

## 1. Disposition

**fix** — retain the visual direction and implementation. Apply the four bounded material findings below, then recapture the same viewport set for a verdict pass. No rebuild is warranted.

Reviewed 8 September 2026 against `docs/dot/BRIEF.md`, the approved local `outputs/Dot-Studio-plan.md`, and the Impeccable craft floor. This is a code-led expansion of Signal Studio; no approved raster comp was supplied or inferred.

## 2. Fidelity and brief assessment

The principal identity commitment is convincingly present. Every pictured main character is circular, including miniature and orbital states. `src/lib/dot/render.ts` uses a native body circle under a single uniform scale. The two-eye, no-mouth face, canonical indigo, paper stage, and restrained geometric secondary effects form one coherent character system. The film contact sheet demonstrates the planned large/small punctuation, bead, listening, orbital climax and return motifs. The manifest records the required 1,845 frames, 60 fps, 30.75-second silent outputs and transparent sequence.

The public composition is faithful to the direction contract: a strong name and direct film action, one dominant stage, a quiet static mood library, and a lower performance selection. Desktop and the actual 1280 viewport preserve clear hierarchy; mobile stacks the stage and two-column library as the final brief specifies. The inspector remains contextual and the source gates authoring to development. The original character need not be replaced to deliver this surface.

The approved plan's authoring coverage is incomplete: exact frame identification, safe-area inspection, neutral reset and local reference comparison are absent from the supplied inspector. Those are functional gaps in the requested home for inspection and recreation, not a request for a different visual world.

## 3. Craft and UX assessment

All four required screenshots were opened: `desktop.png`, `mobile.png`, `user-1280.png`, and `inspector.png` under `.impeccable/review/`. They show complete, loaded pages from the top, with no blank capture regions or apparent horizontal overflow. The narrow screenshots exclude the scrollbar gutter; that alone is not evidence of an incorrect capture. The development indicator is recognizable development chrome, not a shipped illustration defect.

Typography, spacing and restrained borders support the character. The static model sheet is especially useful evidence that the face remains readable when effects are absent. The small specimen scale makes several quiet moods subtle; the captions carry the precise mood names. A blinded expression-recognition result was not supplied, so this review does not certify that proposed gate.

Focus styles, accessible button names, static SVG fallbacks, selected states, storage feedback, export cancellation and actual file specifications have visible or source evidence. The empty detector result is consistent with the absence of obvious mechanical template tells. Small controls nevertheless fall below the explicit project touch-target requirement. The performance specimen for “Good company” also suppresses the very secondary content that explains its name.

## 4. Prioritized material findings

### F1 · P2 · Restore the approved 44 px control targets

**Evidence:** `src/components/dot/dot-studio.css:152` defines icon buttons at 36 × 36 px; line 261 defines play at 34 × 34; line 517 defines colour controls at 30 × 30. Tabs inherit a 34–38 px inner toolbar height, the search field is 34 px high (line 308), and text reaction/clear controls have a 32 px minimum (line 504). The range input itself is only 4 px high (line 273). These compact targets are visible in the mobile transport and inspector screenshots. The approved plan explicitly requires a 44 px minimum, including swatches.

**Impact:** the most frequently used playback actions and local inspection controls require more precise touch than the accepted design calls for.

**Fix:** give controls a minimum 44 × 44 px interactive area, including the range hit area and colour swatches, while retaining smaller drawn icons/track/swatch cores where useful. Include checkbox-label hit areas and small clear/reaction actions in the same pass. Preserve the mobile transport without horizontal overflow.

**Resolution evidence:** computed hit-area dimensions for the named controls plus the same mobile/desktop/1280/inspector captures. This is a project-target finding, not an accessibility certification claim.

### F2 · P2 · Complete the promised inspection affordances

**Evidence:** `src/components/dot/inspector.tsx:31` renders playback stepping, speed, seed, loop inputs, colour, one secondary-effects switch and reactions. It contains no current frame readout, safe-area overlay, neutral-reset action or reference-comparison entry. `src/components/dot/dot-studio.tsx:95` formats the only live readout as seconds; the existing `DotPlayer.reset()` in `src/lib/dot/player.ts` is not exposed. The inspector screenshot confirms these omissions. Approved plan section 8 explicitly includes time/frame inspection, layer toggles, safe area, neutral reset and reference comparison.

**Impact:** an author can advance frames but cannot directly identify the displayed frame, inspect containment visually, return to a known neutral baseline, or compare the recreated cadence to the local source within the requested authoring home.

**Fix:** expose an exact current-frame/total-frame readout; a safe-area inspection overlay that never enters exports; a neutral reset; and independent useful layer visibility controls (at least face and secondary effects). Add a local-only reference import/comparison workflow with shared frame seeking for the film. Keep the user's source media local and keep these controls behind the existing authoring boundary. A local file selector is sufficient; publishing the reference or adding an upload service is unnecessary.

**Resolution evidence:** inspector capture showing the controls and frame identity, plus focused behavior checks for reset, overlay exclusion from export, layer visibility, and local reference/frame synchronization. Do not infer frame synchronization from a static screenshot.

### F3 · P2 · Keep the loop form valid when the selected clip changes

**Evidence:** `src/components/dot/inspector.tsx:25` initializes the loop end from the first clip duration with `useState`; it never synchronizes the values after a different performance is selected. The inspector stays mounted during clip changes. `DotPlayer.select()` clears the actual loop region. Starting with Idle therefore leaves end frame 420 in the inspector after choosing the 144-frame wink; pressing the unchanged “Set loop” fails validation even though the displayed form initially looked ready to use. Conversely, switching to the film retains a stale short interval without indicating its source. This is a source-supported state defect, not a browser reproduction claimed by this review.

**Impact:** a routine clip selection leaves the authoring form out of agreement with the player and can make the default next action fail.

**Fix:** reset the loop form to the new clip's full frame extent on clip change, or restore an explicitly stored per-clip region. Clear stale loop status at the same time. Do not reset intentional edits on every playback/frame revision.

**Resolution evidence:** select Idle → wink → film with Inspect open, then set each default loop; endpoints and status must agree with the selected clip and every interval must be valid.

### F4 · P2 · Let the satellite performance specimen show its satellites

**Evidence:** `src/components/dot/dot-svg.tsx:28` enables specimen effects only for `orbit` and `notice`. The `satellites` clip is consequently rendered as a solitary miniature Dot despite its authored satellites at the poster time (`src/lib/dot/clips.ts:189`). In desktop, mobile and 1280 screenshots, “Good company” shows a small isolated circle beside “Small moment”; the supplied model sheet shows the intended satellite configuration.

**Impact:** two performance choices appear to offer essentially the same miniature result, and the “Good company” thumbnail does not describe its performance.

**Fix:** render the satellite layer for that static specimen and use a poster time/scale at which at least two companion beads are legible. Keep the thumbnail static. Confirm effects remain contained in the specimen frame.

**Resolution evidence:** the same captured performance shelf at desktop and mobile, showing clear visual differentiation from “Small moment”.

## 5. Scope, limits and verdict

This was an independent bounded review of source and the six supplied visual artifacts (four page captures, film contact sheet and model sheet). No browser was used and no implementation code was edited. The supplied report of 14 deterministic tests over 6,549 timeline frames, browser interaction checks, successful build/lint and empty runtime buffers is acknowledged as build-thread evidence; those checks were not independently rerun here.

Still images establish composition and sampled silhouettes. They cannot establish acting rhythm, velocity continuity, front/back crossing quality, interruption smoothness or 60 fps device performance. The Node benchmark correctly excludes browser work; no device performance acceptance is inferred. Source-reference fidelity beyond the supplied plan/contact sheet, the five-reviewer expression gate, and founder art-direction acceptance remain outside this review's verified scope. No production release or deployment is approved by this report.

**Verdict: fix.** The visual direction and circular character foundation should be retained. Resolve F1–F4 in one focused batch and return the same captures plus the named behavior evidence for a verdict scoring these four findings only.
