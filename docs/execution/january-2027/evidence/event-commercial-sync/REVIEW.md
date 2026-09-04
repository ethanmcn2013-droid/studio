# Scoped Event source review

Observed 2026-09-04, 21:47–21:51 UTC. Internal local build only.

Source: Studio `fix/january-event-commercial-sync`, base
`06cabd4d5421765afc628e114aba9b5f60d1894b`, with this Event source change uncommitted
at capture. Final source/copy matches the captured build. Only validation receipts
were completed afterward.

Built with the declared `pnpm build`; exit 0. Started that build with the declared
`pnpm start --hostname 127.0.0.1 --port 4353` from the isolated worktree. This is a
built preview, not an ad hoc development server. A synthetic local HQ password was
set only in the child process; no environment file, provider key or production
credential was copied. Startup reported the four expected missing Studio/shared
database variables. No database or provider service was configured.

Initial URL used 127.0.0.1. The existing login handler redirected to localhost,
so authentication was repeated on the resulting localhost origin using the same
synthetic password. No cookie was injected and no auth guard was changed.

## Actual rendered surfaces

- `http://localhost:4353/hq/decisions/event-project-funding-2026-09-04`
  displayed the delegated primary-owner policy and appended accepted hold.
  At 1440×1000 and 390×844 the new paragraphs wrap; mobile document scroll width
  was 375px inside the 390px viewport (scrollbar present), with no horizontal
  overflow. Screenshots: `hq-event-desktop.png`, `hq-event-mobile.png`.
- The record says the retained terms are intended policy, integration/deployed
  state is separate, and historical designation needs reconciliation. It does
  not say deployed checkout or provider sales are disabled.
- `http://localhost:4353/pricing` showed only Free, Student, Pro and Enterprise
  in the actual plan selector. No Event offer or archive promise was present.
  The new Event adapter output was separately exercised by the commercial
  presentation test; Event remains outside this public ladder.
- Console warning/error capture was empty for both pages. No framework overlay
  appeared. No waitlist submission, real login, checkout, provider or outreach
  action was performed. See `browser-checks.json` for captured DOM pricing text.
- The actual `getOperatorTodos()` loader resolved the new item as open, P0,
  involved, blocking, linked to the existing Event decision, with the full
  instructions. This is source-loader verification, not a screenshot of the
  entire HQ operator board.

The global HQ chrome's unrelated health summary was not validated; no production
health, payment, traffic or customer-use evidence is inferred from it. No registry
or baseline was updated. This is scoped copy/render evidence, not council or
human comprehension acceptance.

The temporary browser viewport override was reset. Preview session 79853 was
stopped at handoff. No deployment or push was performed.

## Gate evidence

- `build.log`: successful full production build.
- `tests-initial.log`: full test invocation; first groups 16/16 and 412/412,
  followed by a Windows native codes-test process crash (`3221225477`,
  `0xC0000005`). It must not be called a clean full-command pass.
- `db-serial-retry.log`: complete final database group, 57/57 passed when rerun
  serially against disposable stores. No writer or dependency change was used.
- Full typecheck and focused ESLint passed. Consumer-checker behavioral tests
  passed 4/4. Exact App consumer parity awaits the lead-owned v2 copy.

Canonical source, contract fields, App mirror instructions and remaining closure
are in `../../EVENT_COMMERCIAL_SYNC.md`.
