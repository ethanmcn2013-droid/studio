# Account V1 — HQ live Venue access preview

Status: complete for this cycle.
Scope: HQ-authenticated live access projection + request persistence + access exports.
Still closed: sponsor auth, public customer route, live usage telemetry, entitlement mutation from Account.

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
   - Access “Request more access” persists in live mode
   - Never mutates allotment or codes
   - HQ Access Today shows open request count

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
- Account cannot grant or mint
- SAMPLE / LIVE ACCESS PREVIEW labels remain explicit
- No production sponsor route

## Explicit next cycles (not this one)

| Cycle | Work |
| --- | --- |
| Phase B | Sponsored-use instrumentation → real Usage coverage |
| Phase C | `sponsor_members` + Clerk → public Account route |
| Phase D | Frozen behavioural reports + real PDF print pipeline at runtime |
