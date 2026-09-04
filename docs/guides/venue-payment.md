# Record a venue payment

Updated 2026-09-04. Operator procedure, not authority to run against production.
January work is internal testing. The launch and first-outreach target is
21 January 2027 with separate manual gates.

## Evidence before the command

Confirm the venue and agreement against a retained cleared-payment receipt.
A plan selection, signed agreement, invoice, promised transfer or redemption
does not establish payment. The received annual amount must be exactly
100000 cents for Founding 25 or 150000 cents for standard Venue Edition,
VAT-inclusive. This procedure does not establish tax or legal approval.

Use an opaque, stable reference to the evidence in its approved private store.
Never put bank details, card data, names or email addresses in the reference.
The ledger stores its SHA-256 digest, not the receipt itself. Record the actual
UTC clearing time, amount and named operator. Keep these inputs for a retry.
The command records an operator's attestation; it does not verify a provider.

Both shared and Studio sponsor records must already exist with the same slug.
Onboarding writes the shared sponsor only; if Studio lacks its counterpart,
reconcile provisioning in separately authorised work before this command.
Do not create a second venue or mint another batch just to repair a mirror.

## Command

The following is a **synthetic example**, only for disposable local databases.
Use the approved environment when production execution is separately authorised.

```powershell
pnpm venue:paid test-venue founding --reference synthetic-receipt-001 --paid-at 2026-08-01T12:00:00.000Z --amount-cents 100000 --actor-id test-operator --actor-name "Test Operator"
```

For standard agreements use `paid` and `150000`. The command validates the
amount against the retained plan; it cannot negotiate a price. A configured
`SIGNAL_HQ_OPERATORS` roster must include the actor. No secrets belong in the
command. The old positional amount and `--founding` syntax are retired.

## Expected result and recovery

| Result | Meaning | Next action |
|---|---|---|
| Exit 0, payment recorded, mirror complete | Shared sponsor and audit event committed; Studio matches | Retain the event ID with the private evidence. This does not assign a Founding number, issue codes or send email. |
| Exit 0, existing evidence replayed | The same receipt was already recorded; Studio agrees or was repaired | No new payment date, term or event was created. |
| Exit 1, shared payment recorded / mirror incomplete | Shared evidence is durable but Studio may be stale | Restore the missing connection/schema/row through authorised work, then repeat the identical command. Never invent a new reference or time. |
| Uncertain connection/commit outcome | Either commit may have succeeded despite a lost response | Repeat only the identical evidence. An error is not proof that nothing was written. |
| Missing sponsor or conflicting/superseded evidence | The writer cannot safely reconcile the records | Inspect both ledgers and retained receipts. Do not force a downgrade or rewrite paid history through onboarding. |

Payment and the append-only event commit in one shared transaction using the
existing `sponsors` and `entitlement_events` tables. The event action is
`venue_payment`. The Studio update is a separate, explicitly repairable mirror.
There is no distributed transaction and a partial failure remains a launch
reconciliation item until repaired. The new command writes shared first;
historical local-first failures need a separate evidence review.

The retained annual-window convention is 365 days from the supplied clearing
time. Early renewal/proration, refunds, reversals and legacy-row repair are not
implemented by this command; reconcile those cases before recording them.
A live Founding agreement cannot be switched to the standard price here.
Founding number assignment remains a separate existing writer after payment.

## Local checks

```powershell
pnpm exec tsx --import ./src/test/register-server-only.mjs --test src/lib/entitlements-db/venue-commercial.test.ts
pnpm exec tsx --test src/lib/hq/proofgate.test.ts
```

The first command creates disposable SQLite databases, including forced audit
and mirror failures and an actual CLI retry. The second checks that redemption
and seeded entitlement counts cannot appear as useful activation. Neither
checks production data, provider settlement, email delivery or legal readiness.
