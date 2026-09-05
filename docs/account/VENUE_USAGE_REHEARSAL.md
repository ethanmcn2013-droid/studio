# Venue issuance and Tasks usage composition

This is disposable local pipeline evidence. Payment references, operators, users,
keys and stores are synthetic. No payment provider, Clerk session, external
transport, production migration, deployed flag or manual send is established by
this rehearsal.

## Candidates and acceptance

The dedicated `feat/january-venue-usage-rehearsal` worktrees combine App base
`fe4a2b60d1dfb0ca3631cdcd877e966589bdeb68` with issuer/canonical commits
`a84f48c10fa62db5cddc1f20980998bc800a745d`,
`2dcd26ff26753ff65dccda539a293b31eb9f0f04`, erased-consumption fix
`b96e61e7ad4fbe379443a11e98e505280ec4e1d7`, and frozen S5
`7c571a617a2b4f4e9b3ddddea4e4072580bd2edf`.

Studio base `4102b5c524373f10ae74e3153eaa0da7bac914ed` receives issuer commits
`f0b3fa95bb19504ea8aeb57b1d4fa60e10bc2d7f` and
`1f77d0e0c73c1acf6bf5daff253518eb1913dd85`, then S5
`c4fb8e358e418f166a6c972d646faba40b72a7f6` and retention fix
`ef648efe3d2a3135503ca6bdf550551d466b5c1d`.

The final local composition passes three scenarios, with eight checkpoints per
scenario, after adding App acknowledgement fix
`6822c1f13a3ac91e674220775959ffa065b5742b` and Studio suppression fix
`c53c42ca948a67d7f61c3a23be2a05eb00f1b674`. The receiving equivalents are
App `802dc426` and Studio `3518c82`. This is local functional acceptance of the
composed pipeline, with independent fix review and deployed proof separate.

The frozen sequence first passed its functional checks. Stricter full-HQ-DTO
assertions then reproduced S5-01 on all three paths, and false-success response
injection separately failed event custody on all three. Those failures were
retained, not relabelled as passes. With both owner fixes, observed day/module
counts are absent for the suppressed cohort; malformed event and erasure
acknowledgements retain custody until the real Studio handler acknowledges.

## Reproduce locally

Install each checkout's pinned dependencies with `pnpm install --frozen-lockfile`.
From the paired App checkout:

```powershell
node scripts/sponsored-use/run-venue-rehearsal.mjs --studio-root C:/absolute/path/to/paired-studio
```

The launcher accepts the Studio path explicitly and starts a child with only OS
paths, test mode and the two repository paths. It inherits no provider, database,
HQ or Clerk credentials and reads no environment file. Its Request/Response
bridges execute the actual signed handlers in process; unexpected network use
fails. It does not bind a preview port.

The Studio fixture creates separate Studio-local and shared SQLite files. Shared
`0001_venue_fulfilment` and `0002_usage_delivery` run through their owning
additive hash-ledger runners after explicit baseline prerequisites. App's S5
fixture creates its separate SQLite file from the supported baseline and forward
SQL, including `0030_sponsored_use_intents`; the App migration-ledger suite is a
separate gate. No SQL or migration authority is changed by this composition.

## Eight observed boundaries per commercial term

1. Empty grant/intent stores and shared migration receipts are proved before use.
2. Standard EUR 1500 and Founding EUR 1000 VAT-inclusive payment records use the
   actual payment writer. Selecting a plan alone cannot allocate codes. The pilot
   requires its explicit exception and current limited term. Existing differing
   local/shared sponsor IDs are paired, then the actual allocator fixes two codes.
3. A usage-key signature cannot issue codes. Lost issue acknowledgement leaves
   the shared request pending despite committed App/local code rows. No packet
   is ready from that ambiguous result.
4. The current manager guard denies a new ordinary-member claim. The actual
   owner's atomic claim creates the existing 18-task wedding template. Same-code
   replay against another project preserves the original project, grant and term.
   Fingerprints do not redeem. Template creation produces no useful-use intent.
5. Failure inserting the usage intent rolls back the actual task and activity.
   One deliberate task subsequently commits in the explicit project even when
   the ambient project differs. Retrying the same task ID cannot create a second
   event. The immediate first-minute action exercises the exact private grant
   instant versus rounded seven-field wire time. Unfulfilled issuance cannot
   receive attributed usage yet.
6. Actual readback and the shared fulfilled receipt precede the ready manual
   packet. Only the unused code appears. Signed delivery and actual provenance
   produce one attributed shared event. Lost acknowledgements retry exactly;
   changed-scope replay conflicts. False success responses must retain custody.
7. The actual closed-day cron persists one action and one eligible workspace;
   The masks are 2 for Tasks and 15 for the four expected reporting modules. HQ authentication, full DTO
   suppression and CSV export are checked. Notes remains unavailable. Small
   cohorts must not disclose observed-day counts through coverage metadata.
8. Claimed withdrawal preserves the live grant. The actual account deletion
   fence, usage-erasure queue and account eraser remove personal access while
   retaining only S2's identity-free consumed-code proof. With capture off,
   authenticated erasure removes shared raw/lifecycle data; anonymous daily
   aggregates remain. False acknowledgements retain erasure custody. The unused
   sibling can then be withdrawn, another owner survives, and neither consumed
   nor withdrawn code can be reclaimed.

The packet is inspected in memory, including its private redemption link; it is
not written or sent. The [operator guide](../guides/venue-fulfilment.md) remains
the manual support procedure. Never attach raw packets or fingerprints to logs.

## Fixture boundaries and remaining scope

App auth actor, ambient project, task-list response, board configuration,
framework invalidation and unused attachment/milestone modules are explicit
test boundaries. The task action, project authorization, transaction, comp
claim, canonical readers, issuer, delivery, ingestion, rollup, HQ projection and
actual account eraser are production source. No grant or template is repaired or
seeded for these scenarios. A compatibility-only erasure fixture claims while
its user is primary owner, then transfers ownership before erasing the now-member;
it does not weaken the newer guard against new member-only claims.

The launcher is the lead-owned paired test-registration entry point. Register
it with explicit immutable App/Studio checkouts after both owner suites. No
package, lock, workflow, global experience gate, programme or acceptance registry
is edited here. Full builds, browser comprehension, live authentication, real
payment evidence, deployment configuration, scheduled delivery and provider
rehearsal remain separate, unverified evidence.
