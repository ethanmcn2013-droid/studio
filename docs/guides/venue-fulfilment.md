# Prepare and recover a Venue code request

This candidate supports internal rehearsals. It does not establish that a deployed
service is enabled, a production migration ran, payment cleared or a packet was
sent. January launch and first outreach remain 21 January 2027, with the accepted
manual release and communication gates. No email is sent by this flow.

## Authority and prerequisites

Studio records the venue, verified payment or explicit pilot exception, the exact
code allocation and a recoverable delivery request. App owns code availability,
withdrawal and its existing atomic comp claim. A runtime readback must be recorded
as fulfilled before a private manual packet can be prepared. Shared code status
is a mirror; a new code lookup asks App for fresh state. Usage evidence is a
separate service and does not authorize issuance.

Use explicit isolated database URLs for Studio and shared entitlements during
rehearsal. The new operator command does not load environment files. Configure
`SIGNAL_HQ_OPERATORS`, `SIGNAL_OPERATOR_ID` and `SIGNAL_OPERATOR_NAME`; the operator
must be in a nonempty roster. App credentials are not needed in Studio.

The paired services require `VENUE_ISSUANCE_ENABLED=true`, explicit
`VENUE_ISSUANCE_ENVIRONMENT=internal_test` and a dedicated
`VENUE_ISSUANCE_SECRET` of at least 32 characters, plus
`VENUE_ISSUANCE_KEY_EPOCH`. Studio also needs `VENUE_ISSUANCE_APP_ORIGIN`.
Use a separately provisioned random secret, not an example from a fixture.
The usage key must differ. HTTPS is required outside explicit loopback testing.
Neither service defaults to enabled. Production configuration remains held.

Shared migration `0001_venue_fulfilment` is declared in the owning Drizzle
journal and `drizzle-entitlements/additive-ledger.json`. The frozen `0000` is not
rewritten. `scripts/migrate-venue-fulfilment.mjs` verifies the LF-normalized SQL
hash and applies it atomically with a `signal_additive_migrations` receipt.
It supports explicit local file databases only; existing sponsors, code and audit
tables are prerequisites. A repeat is a checked no-op; a failed transaction does
not record success. Existing Venue-term migrations remain prerequisites. Usage
owns the subsequent additive migration `0002`; App issuance uses existing
`meta` and `comp_codes`, with no App issuance migration.

## Internal rehearsal sequence

Run commands from Studio. Keep request and packet files in an access-controlled,
untracked operator directory. Commands print status and opaque IDs only. Packets
contain redemption credentials; do not commit them, paste them into support logs
or attach them to issue trackers. File mode 0600 is requested; Windows directory
ACLs must provide the equivalent private access.

1. Onboard the shared venue through the existing named-operator flow, with the
   intended plan and allotment. Plan selection alone is not payment evidence.
   Pair its existing local row by slug; historical local IDs are preserved:

   ```powershell
   pnpm exec tsx scripts/venue-fulfilment.ts pair synthetic-venue
   ```

2. For paid rehearsal cases, use the existing payment writer and an opaque
   reference to retained cleared-payment evidence. Standard is 150000 cents;
   Founding is 100000 cents, both VAT-inclusive annual prices. The exact current
   financial record must match the hash-verified payment event and local mirror.
   The command and mirror recovery are in [Venue payment](venue-payment.md).
   Synthetic references prove the local pipeline, not actual cash.

   An explicit pilot needs a current pilot term, a positive limited allotment
   and an opaque pilot exception reference. The exception is retained in the
   immutable manifest; it cannot be used to bypass a paid-plan receipt.

3. Save a request once, before allocating codes. Keep this same file on retry:

   ```powershell
   pnpm exec tsx scripts/venue-fulfilment.ts new docs/execution/venue-edition-and-films/private/request.json synthetic-venue 2
   # For an explicit pilot, append its retained exception reference.
   pnpm exec tsx scripts/venue-fulfilment.ts allocate docs/execution/venue-edition-and-films/private/request.json
   pnpm exec tsx scripts/venue-fulfilment.ts status docs/execution/venue-edition-and-films/private/request.json
   ```

   Allocation is one shared transaction: immutable sponsor mapping, manifest,
   exact cryptographically generated code set, allotment increment and audit.
   Requests hold at most 25 one-use wedding codes with the retained 548-day
   access floor. Unlimited venue issuance is not capped by the monitoring
   threshold. A later expired venue term blocks a new allocation but does not
   change a valid earlier allocation or a couple's existing grant.

4. Deliver that exact allocation and read it back:

   ```powershell
   pnpm exec tsx scripts/venue-fulfilment.ts deliver docs/execution/venue-edition-and-films/private/request.json
   pnpm exec tsx scripts/venue-fulfilment.ts packet docs/execution/venue-edition-and-films/private/request.json docs/execution/venue-edition-and-films/private/private-packet.json
   ```

   App atomically creates all codes and one immutable issuance receipt, or none.
   Studio requires the exact version, request, manifest hash and every code
   ID/fingerprint/state in a bounded HTTP 200 acknowledgement, then performs a
   separate read and commits fulfilled state before writing the packet. A
   successful HTTP status alone is insufficient. Packets include only currently
   available codes, their private IDs and direct App redemption links.
   The packet file is created exclusively; an existing file is never overwritten.

5. In the isolated App fixture, claim one code with the intended account/project,
   retry that same code/account and persist one deliberate Tasks action. Code
   issuance, redemption, starter-template work and useful activation are distinct
   observations. Neither a page view nor seeded tasks proves useful activation.

## Recovery and support packet

| Observation | Next action | What must remain true |
| --- | --- | --- |
| Payment recorded, local financial mirror incomplete | Retry the original payment reference, time, amount and plan | No invented new payment or shortened term |
| Allocation failed | Read the retained request status, then retry it | Failed transaction has no allocation or counter increment |
| Local code mirror or App issue failed | Retry `deliver` with the same request | Exact IDs/codes reused; no replacement set |
| Timeout, lost acknowledgement, malformed response or store outage | Keep pending; retry exact delivery/readback | App may already have committed; no packet is ready yet |
| Manifest, sponsor, code or grant disagreement | Retain conflict for reconciliation | No guessed legacy adoption, grant or template repair |
| Final Studio receipt write failed | Retry exact delivery/readback | Local/App success alone does not make a packet ready |
| Already claimed | Ask the holder to retry the same code and account in App | Preserve original grant, project and term; no second code |
| Unused code must be withdrawn | Use `withdraw <request.json> <license-code-id>`, then check readback | App transaction decides withdrawal versus `already_claimed` |
| All codes claimed or withdrawn | Retain status; no packet is generated | Zero available codes is not a delivery failure |

The manual support record contains the immutable request ID, named operator,
opaque receipt/pilot reference, sponsor mapping, environment, attempts, latest
pending/conflict reason and readback timestamp. `status` is explicitly a stored
snapshot, not a fresh App assertion. Keep the private packet separate. Do not
include raw bearer codes or fingerprints in logs, public UI or usage events.

Withdrawal first records a durable request. Its App transaction reads both code
and grant state. If a claim won the race, it reports `already_claimed` and leaves
the grant intact. An unused withdrawal writes epoch-zero expiry and its receipt;
issuance replay cannot reactivate it. A Studio revision fence prevents an older
delivery response from overwriting a newer withdrawal.

## Historical reconciliation and remaining evidence

An old short code or populated sponsor row is not issuance provenance. Before
adopting any historical batch, the operator must retain observed original issue
evidence and verify its exact Studio/shared/App sponsor, code, terms and any
existing claim. Hashing existing codes cannot invent that authority. This new
service refuses an existing App code without its exact immutable receipt.
Historical codes retain their old claim behavior; unknown attribution stays
unknown. The retired `issue:codes` command and the HQ mint form cannot create new
Venue codes. Shared redeem/reconcile cannot create a second grant for `vi-*`
issuance batches.

Agent-owned evidence includes the synthetic three-store fixture and failure
injection, claim replay and withdrawal race. The original issuance milestone left
Tasks action composition open. The subsequent
[paired rehearsal](../account/VENUE_USAGE_REHEARSAL.md) passes the actual issue,
claim, deliberate action, authenticated usage/HQ, account erasure and sibling
withdrawal path for standard, Founding and explicit pilot terms after the S5
coverage and acknowledgement fixes. Independent fix review remains separate. Actual
Clerk sign-in, real payment inputs, deployed service configuration, production
schema receipt, manual delivery and human comprehension remain unverified until
observed in their separately authorized rehearsal. Payment provider inputs are
not the reason to leave the local fulfilment pipeline missing. Usage service
transport, retention and population verification remain Plato's owned slice.

Test registration for the lead (package files are outside this lane):

- Studio: `src/lib/venue-fulfilment/canonical.test.ts`, `transport.test.ts`,
  `store.test.ts`; set `VENUE_APP_FIXTURE_ROOT` to the paired App checkout for
  three-store tests. Run `scripts/check-venue-term-parity.mjs` with `APP_REPO_PATH`.
- App: `src/server/venue-issuance/canonical.test.ts` and `store.test.ts`; use the
  existing `src/test/register-server-only.mjs` hook for the latter.
- App composition: `scripts/sponsored-use/run-venue-rehearsal.mjs --studio-root`
  with the explicit paired Studio checkout; this includes
  `src/server/venue-issuance/composition.test.cjs`. Keep the adjacent
  `src/server/venue-issuance/erasure.test.ts` suite registered.
- The child-process fixture uses owned local SQLite files and sanitized private
  IPC. It loads no secret environment file and calls no provider.
