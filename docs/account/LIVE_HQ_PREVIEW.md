# Signal Studio Account V1 · HQ live Venue access preview (the surface E07 calls the Venue Portal)

Naming: the **Signal Studio Account IS the Venue Portal** (**D-015 Q4**). One
surface, two names.

Status: complete for this cycle. **Candidate evidence, not founder-approved
completion (D-015 Q2).**
Scope: HQ-authenticated live access projection + request persistence + access exports.
Still closed: sponsor auth, public customer route, live usage telemetry, entitlement mutation from Account.

**There is no venue-authenticated identity behind this preview.** It is gated by
a single shared HQ password and the role is client state chosen from a dropdown.
Every sentence below of the form "the venue does X" is today "one holder of one
shared password does X, on any venue". Recorded 2026-08-03 so the preview is not
read as a shipped capability.

## What shipped

1. **Live access projection** (`src/lib/account/live/`)
   - Reads sponsors + license codes from `signal-entitlements`
   - Emits `AccountSnapshot` with exact access totals
   - Behavioural metrics stay `unavailable` (never zero)
   - Codes are masked; plaintext never enters the snapshot

2. **HQ Account review controls**
   - Data: Deterministic fixture · Live access (HQ)
   - Venue picker from real sponsors
   - Same Account Brief UI panels

3. **`sponsor_requests`**
   - Schema + `scripts/migrate-account-requests.mjs`
   - ~~Access “Request more access” persists in live mode~~ `[SUPERSEDED D-020 ·
     2026-08-03. Under an unlimited entitlement there is nothing to request
     more of. The request path is retained for support and report requests.]`
   - Never mutates ~~allotment~~ entitlement `[SUPERSEDED D-020 · 2026-08-03]`
     or codes
   - HQ Access Today shows open request count
   - **Not scoped to the acting venue today.** The server action takes a
     caller-supplied sponsor id and writes against it after checking only the HQ
     session cookie. Every mutation added to this surface must resolve its
     sponsor server-side. Recorded 2026-08-03.

4. **Live exports**
   - `/hq/account-review/download?source=live&venue=<slug>&format=csv|html`
   - Fixture sample PDF/CSV path unchanged

## Operator steps

```bash
npm run account:migrate-requests
# open /hq/account-review → Fixtures, live & role → Data: Live access (HQ)
```

## Honesty rules preserved

- Incomplete usage ≠ zero
- **An absent stored entitlement figure ≠ zero either.** It renders
  `unavailable`, with no exhaustion message and no request prompt. `[Added
  2026-08-03, D-020 and R-016.]`
- An unlimited entitlement renders `Unlimited`, and CSV writes
  `value_state=unlimited` with a blank value cell
- Account cannot grant or mint
- SAMPLE / LIVE ACCESS PREVIEW labels remain explicit
- No production sponsor route
- **Live means live.** When the data source is live, every panel is live or says
  it is unavailable. A fixture fallback behind a live selection presents
  invented figures as a venue's own. So does a fixture list rendered beside live
  figures. Neither is permitted. `[Added 2026-08-03.]`
- **An error message is not a place to print a query.** A failed live read
  reports that the data is unavailable. It does not print the driver message,
  the SELECT statement or the column list, on screen or in an export body.
  `[Added 2026-08-03.]`
- **The venue picker names venues.** Venue names are not publishable:
  `consent_public_naming` is unknown for all 219 accounts. A picker that lists
  every founding venue by name shows a prospect on a screen share who else has
  signed. `[Added 2026-08-03, F-2.]`

## Explicit next cycles (not this one)

| Cycle | Work |
| --- | --- |
| Phase B | Sponsored-use instrumentation → real Usage coverage. See [PHASE_B_INSTRUMENTATION_PLAN.md](./PHASE_B_INSTRUMENTATION_PLAN.md) |
| Phase C | `sponsor_members` + Clerk → public Account route |
| Phase D | Frozen behavioural reports + real PDF print pipeline at runtime |
