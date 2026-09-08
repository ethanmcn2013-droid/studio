# Landing refinement release · 8 September 2026

Scope: the full-width timeline, continuous light/dark timeline surface, and
animated footer Dot. The user explicitly authorized deployment and then
excluded favicon work. Studio favicon changes were reverted in `33a9a188`;
App PR #173 is not included. No data, migration, environment, or pricing change.

Production baseline and rollback target: Studio `e1589703`, deployment
`dpl_r7CQ2GEQuupuaRGwUNWSt76NSWKc`. Remote main matches that revision.
Provider: Vercel project `studio`, `prj_DtQGpGQpnXNoKY7tDv6xIu2MG9cA`,
team `team_veMY72ml10cAawsR0CjN9k5y`. Target: <https://signalstudio.ie/>.

The package test script passed all 460 tests (16 migrations, 406 main tests,
38 entitlements), with zero failures. The separate venue-term-parity source
script skipped because no App repo is adjacent to this isolated worktree.
`test-release.log` retains the complete run using the serial method documented
in `verification.md`. Typecheck and production build passed again after the
footer correction below. The design-system drift
gate and Studio experience registry validation passed without exemptions.

The production browser comparison caught a footer regression that the dev
preview had masked: concatenating a conditional class immediately after
`lg:col-span-1` prevented Tailwind from generating that utility. The brand
column spanned two columns and displaced Suite onto another row. Both class
branches now contain complete literal utility names. Final production
captures verify the original five-column desktop arrangement.

Earlier checks in `verification.md` describe the prior source, including
now-excluded icon work. Current evidence is prefixed `refinement-` or suffixed
`-release`. The footer screenshots show the corrected production render.

## Rendered checks

Compared matching before/after captures at 1440 × 1300. The grey surround
changed from `rgb(244,244,245)` in light and `rgb(39,39,42)` in dark to the
same white / `rgb(9,9,11)` used by the timeline content. The dark frame now
reads as one surface. No spacing, typography, control or milestone shift.

Desktop frame: width 1392px, x 16.5px in start, Across, Down and settled states.
Height moves 900.23 → 1095.23 → 900.23px. Mobile at 390 × 844: width 331px,
x 22px, height 1099.36 → 1432.36px. No horizontal document overflow at either
size. See `refinement-metrics.json` and the `refinement-after-*` screenshots.

Corrected footer: original 740px desktop height and five aligned columns.
Dot visibly animates in the left gap; pause/resume works. Reduced motion
sets animation to none, disables the control and stops playback. Mobile Dot
fits above the link columns with no overflow. The reduced-motion timeline
finishes at 79 with no ring animation. Browser console: no errors or warnings
observed during the normal-motion final build checks. Scoped ESLint passed.

Final local production preview: PID 28472, <http://127.0.0.1:3100/>.
Deployment is pending required CI for the final commit and production checks.
