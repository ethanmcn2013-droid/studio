# Dot Studio — focused fix verdict

## 1. Disposition

**ship — F1–F4 resolved at this focused review's scope.**

Reviewed 8 September 2026. This verdict scores only the four material findings in `finish-review.md`; it does not reopen the surface or certify that no other issues exist. No further correction batch is owed for this list.

## 2. Fidelity and brief assessment

The correction retains the approved code-led Signal Studio direction and circular character. The authoring additions stay below the stage and behind the development-only authoring boundary. Reference import uses a local browser object URL; the corresponding CSP allowance is development-only. No reference footage is introduced by the inspected diff.

## 3. Craft and UX assessment

Opened all four refreshed captures: `.impeccable/review/desktop.png`, `mobile.png`, `user-1280.png`, and `inspector.png`. They are valid complete captures from the top. The inspector is visibly open in its named capture, with the frame readout, neutral reset, layer controls, safe-area control and local reference entry present. The enlarged transport fits the narrow layout. The corrected satellite specimen remains static and contained in its tile.

## 4. Finding scores

| Finding | Score | Evidence and assessment |
| --- | --- | --- |
| F1 — 44 px targets | **Resolved** | The CSS correction gives the named play, icon and swatch controls 44 × 44 px areas, extends the named tabs/search/text controls and checkbox-label areas to 44 px high, and separates the 44 px range hit area from its 4 px drawn track. `fix-evidence.md` records computed measurements and a 390 px overflow check. The mobile capture supports transport fit. This closes the named controls in F1; it is not a new whole-page target audit. |
| F2 — inspection affordances | **Resolved** | The inspector capture and source show exact frame identification, neutral reset, safe-area guide, independent face/effects controls and local reference import. The guide is a CSS overlay outside exported SVG content. Face visibility is carried through SVG, PNG, sequence and preset paths. Source performs reference seeking while paused and updates the paired Dot pose. Build-thread evidence records frame 1 at 0.016666 s in the local reference, reset to Idle/F0000, layer removal and URL cleanup. The comparison is explicitly a paused/frame-step workflow, matching the requested inspection use. |
| F3 — stale loop form | **Resolved** | Inspector form state now carries the selected clip identity and resets its bounds and status when that identity changes. Ordinary frame revisions do not reset edited bounds. Build-thread evidence exercises Idle → wink → film with valid full extents 420 → 144 → 1845 and successful default Set loop actions, including return after edits. |
| F4 — satellite specimen | **Resolved** | `DotSpecimen` now permits effects for `satellites`. The refreshed desktop, 1280 and mobile shelves show companion beads beside “Good company”, distinguishing it from the solitary “Small moment”. Source and supplied SVG-count evidence establish the body plus three authored companions. The visible companions are subtle at mobile thumbnail scale but the originally missing content is restored and contained. |

No partial or unresolved material item remains in F1–F4.

## 5. Scope, limits and verdict

Read `docs/dot/fix-evidence.md` and the correction diff against `6121d4b`; independently opened the refreshed screenshots. No browser was used, implementation files were not changed, and no fresh broad defect hunt was performed. Behavior checks and computed target measurements are attributed to the build thread rather than claimed as reviewer execution.

The latest request reports passing tests/typecheck/lint and a standard build rerun underway after the development CSP change. This verdict does not certify that in-flight build result. The original limits on full-speed acting, device performance, blinded expression recognition and founder aesthetic acceptance still apply. No production deployment is authorized by this document.

**Final verdict: ship at the four-fix scope.** The reviewer scored all four listed fixes resolved.
