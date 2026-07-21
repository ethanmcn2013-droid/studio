# QA MATRIX — Signal Studio Premium Programme

Evidence-first: a cell is only ✅ with a recorded command/screenshot/receipt. Update at every phase close.

## Baseline (2026-07-21, tasks repo @ 70375f5 = main~2, local machine)
| Check | Command | Result | Evidence |
|---|---|---|---|
| Install | `pnpm install --frozen-lockfile` | ✅ up to date | /tmp/baseline-install.log (session) |
| Typecheck | `pnpm typecheck` | ✅ source-clean — all 14 errors in stale generated `.next/dev/types/validator.ts` (another process's dev server artifact); 0 errors outside .next/ | /tmp/baseline-typecheck.log |
| Lint | `pnpm lint` | ✅ 0 errors, 1 warning (LABEL_TONES unused-var) | /tmp/baseline-lint.log |
| Unit + contract suite | `pnpm test` | ✅ full chain green (contract scripts + node --test suites; final segment 66/66) | /tmp/baseline-test.log |
| Build | `pnpm build` | ⏸ not run locally (Turbopack junction env caveat); CI authoritative — main is green per repo CI history | — |
| Playwright experience | `pnpm experience:test` | ⏸ not run (needs built server); pre-existing known-reds on record: chrome-contract About (main c2c2767 era) + stale critical-fixture hashes — BOTH FIXED on main by PRs #42/#43 (aea0cbe, 831ecb0) | _migration-control STATUS known-reds note |
| Visual baseline | screenshots | ◐ interim: `_migration-control/phase9-evidence/visual/` (44 shots + VISUAL_MATRIX.md, ~2026-07-20) covers board/views/settings; fresh captures owed at Phase 3 entry | see path |
| Domains | curl -sI all 7 hosts | ✅ all 200; roadmap. serves without redirect (finding, Phase 8) | session log 2026-07-21 |

## Per-phase matrix (rows filled as phases close)
| Phase | Functional | Visual (side-by-side parity) | Responsive (lg/laptop/tablet/mobile) | A11y (auto 0 serious + manual keyboard) | Security (Opus review) | Performance | Data/migration | Browsers (Chrome/Safari/FF) |
|---|---|---|---|---|---|---|---|---|
| 1 | ✅ 24 new tests (integrity+storage), suite green; claim-rollback + union-metering covered | n/a (panel section mirrors existing grammar; full visual pass at Phase 3) | ◐ section reuses responsive panel | ◐ no new automated run; resources section keyboard-reachable (inline input + buttons); full audit at Phase 3 | ✅ Opus design review pre-implementation; actions in security-regression contract; erasure wired | ◐ no profile run; no new heavy paths (async metadata never blocks task load) | ✅ additive 0017 w/ receipt proofs, db:contract 19/19, rollback = DROP TABLE | ⏸ CI on PR #44 |
| 2 | — | — | — | — | — | — | — | — |
| 3 | — | — | — | — | — | — | — | — |
| 4 | — | — | — | — | — | — | — | — |
| 5 | — | — | — | — | — | — | — | — |
| 6 | — | — | — | — | — | — | — | — |
| 7 | — | — | — | — | — | — | — | — |
| 8 | — | — | — | — | — | — | — | — |
| 9 | — | — | — | — | — | — | — | — |

## Release-blocking analytics events (implement with phases; payloads content-free)
task_detail_opened · subtask_created · task_reparented · task_resource_added/opened · nudge_sent · invite_sent/accepted · context_menu_opened · context_action_used · educational_tip_shown/dismissed · celebration_seen · theme_changed · storage_warning_seen/limit_reached · billing_portal_opened · marketing_campaign_created · marketing_hero_interaction_started/completed
