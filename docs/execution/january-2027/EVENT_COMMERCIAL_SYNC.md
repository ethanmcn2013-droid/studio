# Event commercial source sync

2026-09-04. Isolated Studio branch `fix/january-event-commercial-sync`, from
`06cabd4d5421765afc628e114aba9b5f60d1894b`. App implementation reference:
`a10432ddabc73d968e0ecea833760a0f40b28dd1`. The principal accepted that bounded
new-session hold; this Studio change records it without claiming deployed sales
are off. Programme, acceptance matrix and experience registry remain lead-owned.

## Source and copy

The commercial JSON now qualifies Event as
`policy_ratified_implementation_required`, with
`availability: unavailable_until_project_access_closure`,
`newSalesAvailable: false`, and `termsStatus: intended_not_enforced`.
Its decision and historical reconciliation fields point to the actual HQ files.
The price (€89 once), twelve-calendar-month window, intended `read_only` post-window
and `revoked` refund rule are unchanged. No other plan's commercial values change.

The pricing adapter preserves the approved amount but emits “New Event purchases
are currently unavailable.” It exposes the explicit availability boolean instead
of deriving readiness from a price, date or post-window string. The public ladder
already excludes Event and remains Free, Student, Pro and Enterprise. No Event CTA
is introduced and no paid-archive claim is advertised by this adapter.

HQ's existing owner-funding decision has an appended implementation record. The
pricing readiness entry, current shipped-state Event row and active pricing Atlas
entry now distinguish intended terms from enforcement. Historical decisions and
earlier receipts remain history. S2 is partial; no score, acceptance state, legal
approval or deployed state is invented.

The open operator item `event-historical-purchase-reconciliation` requires the
correct provider environment and verified reference/purchaser/project evidence,
ownership at checkout and settlement, natural expiry versus epoch-zero revocation,
independent covering grants, already-created sessions and public artifacts. Unknown
designation must not retrospectively lock a project or become an archive promise.
The item concerns unavailable historical facts and account identity; it is not a
new routine approval gate for the delegated engineering work.

## Canonical serialization and exact App mirror handoff

In this base, `contracts/commercial-terms.v2.json` is the authored canonical source.
There is no separate commercial source generator in the repository. The ordinary
consumer convention is a complete JSON copy; `scripts/check-suite-contract-consumers.mjs`
parses and compares it. Studio's pricing presentation is generated at runtime from
the canonical JSON through `src/lib/commercial-terms.ts`.

The source was serialized with `JSON.stringify(JSON.parse(source), null, 2)` plus
a final newline. No parallel generator, package script or second committed source
was introduced. Formatting changes to arrays do not change their values.

The receiving lead must copy this commit's entire
`contracts/commercial-terms.v2.json` into the selected App candidate's
`src/lib/commercial-terms.v2.json`. That is the only App mirror file required by
this Studio commit. Do not copy v1, edit another checkout, or manually re-enter
individual fields. Retain App a10432dd's server-enforced hold: JSON availability
alone is not enforcement and is not a provider toggle.

After the copy, run Studio `pnpm contracts:check` with `APP_REPO_PATH` set to the
absolute receiving App checkout, and the App's corresponding contract checks.
Before the copy, a commercial-v2 mismatch is expected; it must not be waived or
misreported as paired acceptance. This task does not write App files.

## Remaining closure

The governing policy requires current primary ownership at checkout and settlement,
an immutable verified reference/purchaser/project designation, and coherent
authorization across private reads, actual-object writes, public artifacts and
caches, bound Timeline and UI. Natural expiry is distinct from refunds. An
independent qualifying completed designated term can preserve an archive when
another purchase is refunded; epoch zero cannot. Current-owner account coverage or
explicit project coverage can preserve editing; another member's personal grant
cannot. Membership, owner export/deletion/security recovery and standalone Notes
retain their own authority.

No production/provider inventory or migration, email, deployment or outreach was
performed. Previously deployed revisions, payment links and existing sessions are
unverified. Full access closure and live provider rehearsal remain open. January 21
user release and first outreach retain their separate manual gates.

## Validation and receiving gates

- Pinned `pnpm install --frozen-lockfile`, full `pnpm typecheck`, focused ESLint
  and `pnpm build` passed. No package/lockfile change or copied environment file.
- The full `pnpm test` command passed the first 16 and 412-test groups, including
  the new Event presentation regression, then exited nonzero when the unchanged
  codes test process crashed with Windows `0xC0000005`. The complete final database
  group reran with `--test-concurrency=1`: 57/57 passed. This records 485 passing
  individual tests across those runs, not a clean first full-command result.
- Four executable consumer-checker regressions passed. The actual HQ loader also
  resolved the open P0/involved historical item and its detailed instructions.
- A semantic comparison against 06cabd4 verified that only Event readiness metadata
  changed. All other contract values and all retained Event price/term fields match.
- The real paired check against the lead's App core checkout failed exactly on
  `commercial-terms.v2.json`, as expected before the authorized lead-owned copy.
  Paired acceptance remains pending that mirror update.
- Built local HQ decision inspected at 1440×1000 and 390×844. Accepted-hold copy
  wraps without horizontal overflow; captured console has no warnings/errors.
  Built `/pricing` still exposes only Free/Student/Pro/Enterprise. No waitlist,
  checkout or outbound action was submitted.

Logs, screenshots and the detailed render receipt are in
`evidence/event-commercial-sync/`. No registry, programme or acceptance file was
changed, and no council/human comprehension or provider acceptance is claimed.

For mirror verification, SHA-256 of `JSON.stringify(JSON.parse(contract))` is
`ba054cc1e7e1b65f9753184372bf112f63343ea329d52f8fcf3ec3c9b83e2c94`.
