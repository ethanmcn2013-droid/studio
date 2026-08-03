/**
 * RETIRED 2026-08-03 by E08.10. This script no longer measures anything and
 * now refuses to run rather than reporting a green.
 *
 * What it used to do. It walked five sibling repositories — studio, notes,
 * tasks, roadmap, analytics — gzipped every chunk under each one's
 * `.next/static/chunks`, and printed the totals.
 *
 * Why it is retired. Four of those five repositories were merged into `app`
 * during the 2026-07-31 consolidation. The sibling directories are gone, so
 * `fs.existsSync` returned false for every one of them and the script printed
 * `"built": false, "gzipBytes": 0` four times and exited 0. "Nothing was
 * measured" and "everything is within budget" produced the same result, and
 * the gate criterion on E08.10 still names `pnpm performance:measure` as one
 * of the two commands that "produce recorded numbers against stated budgets".
 * It has produced none since 31 July.
 *
 * What replaces it. `pnpm perf:budgets`
 * (`scripts/check-performance-budgets.mjs`), which measures this repository's
 * own production build, carries a population count with every number so an
 * empty set can never read as a pass, runs in CI after `pnpm build`, and
 * fails the build when a ceiling is exceeded. It also states, in
 * `contracts/venue-surface-performance-budgets.v1.json`, exactly which
 * budgets it does NOT measure and why.
 *
 * The historical numbers this script produced on 2026-07-11 are kept at
 * `docs/signal-studio-review/evidence/performance-baseline-2026-07-11.md`.
 * They describe a repository layout that no longer exists.
 */

console.error(
  [
    "performance:measure is retired.",
    "",
    "It measured five sibling repositories. Four of them were merged into `app`",
    "on 2026-07-31, so since that date it has reported zero bytes for each and",
    "exited 0 — a green that measured nothing.",
    "",
    "Use `pnpm perf:budgets` instead. Run `pnpm build` first; the check reads",
    "that build and fails when a ceiling in",
    "contracts/venue-surface-performance-budgets.v1.json is exceeded.",
  ].join("\n"),
);
process.exit(3);
