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
## Production result

PR #181 merged after all required checks passed on
`1b91ba88e5c490d867f362962fcda53f066a22d4`: verify, typecheck/test and design
quality (including the automated visual/accessibility harness). Vercel preview
also succeeded. The Git integration deployed squash commit
`6989acd0946219d7b125c111d9c277e43d0135e0` to production.

- Deployment: `dpl_ARMpx7Mg1QG4NgCpX4JjQ6sELQQQ`.
- Immutable URL: <https://studio-akl46adv9-ethanmcn2013-1730s-projects.vercel.app>.
- Live target: <https://signalstudio.ie/>; Vercel confirms the production alias
  points to this exact revision, READY at 19:20:44 UTC on 8 September 2026.
- HTTP smoke at 19:21:50 UTC: `/`, `/notes`, `/tasks`, `/timeline`, `/pricing`
  and `/about` return 200 HTML without framework-error markers. `/signal`
  redirects 308 to `/features/daily-briefing`, which returns 200.
- Live browser: same desktop/mobile widths, height transitions and matching
  light/dark surfaces as the local build. Every vertical date fits in Down.
  Footer remains 740px with five columns; Dot animates and pauses on demand.
  No browser console errors or warnings. See `live-verification.json` and
  the `live-*.png` captures, retained through Git LFS.

No favicon, data, migration, or environment change shipped. The original
production deployment above remains the rollback target; the documented
command is `vercel rollback dpl_r7CQ2GEQuupuaRGwUNWSt76NSWKc --scope ethanmcn2013-1730s-projects --yes`.
Rollback was not needed or executed.
