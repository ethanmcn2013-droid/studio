# Phase 0 agent report — validation baseline (test-runner + lead session, 2026-07-21)

Repo: tasks @ feat/tasks-hero-lab 70375f56 (= origin/main 831ecb0 minus 2 commits: #42 demo-fixture restore, #43 task-panel abort fix — both are the fixes for the previously-known experience-fixture reds).

## Executed results (lead session, local machine)
| Command | Result |
|---|---|
| `pnpm install --frozen-lockfile` | ✅ already up to date (493ms) |
| `pnpm typecheck` | ⚠ exit 2 — **all 14 errors inside `.next/dev/types/validator.ts`** (generated dev artifact from another process's dev server; parse errors at L621). **0 errors outside `.next/`** → source is type-clean. Env artifact, not code failure. |
| `pnpm lint` | ✅ 0 errors, 1 warning (`LABEL_TONES` unused-var in a hybrid component) |
| `pnpm test` | ✅ entire chain green: suite-switcher/chrome/waitlist/loading/suiteloader contract scripts + all node --test / tsx --test suites (final segment 66 pass / 0 fail) |
| `pnpm build` | ⏸ not run locally — Turbopack rejects junctioned node_modules on this machine (known env constraint); CI (verify.yml: install→db:contract→lint→typecheck→test→build) is authoritative |
| `pnpm experience:test` (Playwright) | ⏸ needs built server on port 4342; not run at baseline |

## Static findings (test-runner agent, Bash-denied session)
- CI order: `.github/workflows/verify.yml` = install → db:contract → lint → typecheck → test → build.
- `pnpm test` composition and the experience gates (`experience:quality` chain) are SEPARATE — experience gates are not in verify.yml.
- Chrome-contract static walk: all content checks pass on this branch; suite-header SHA seal not statically computable.
- On this branch (hero-lab), `experience/registry.json` hash for `tasks.page.root` (d2d0cc13074d8d4c) is stale vs `src/app/page.tsx` (TasksHeroTicker import) → `experience:fixtures`/`validate` would fail HERE; **fixed on main by #42/#43**. Baseline classification: not a main defect.
- Historic known-reds (chrome About + stale fixture hashes) recorded in _migration-control STATUS are likewise addressed on current main.

## Pre-existing vs newly-introduced
Nothing newly introduced by this programme (no code touched). Pre-existing environment artifacts: stale `.next/dev` types; Turbopack junction constraint. Working tree left untouched (foreign process owns the checkout).
