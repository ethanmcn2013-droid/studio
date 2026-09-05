# Record a venue payment

Updated 2026-09-05. Operator procedure, not authority to run against production.
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

For a customer who has paid but cannot open their workspace, use the
[claimant recovery and support tabletop](venue-fulfilment.md#claimant-recovery).
A successful payment command is not a fulfilment receipt.

```powershell
pnpm exec tsx --import ./src/test/register-server-only.mjs --test src/lib/entitlements-db/venue-commercial.test.ts
pnpm exec tsx --test src/lib/hq/proofgate.test.ts
```

The first command creates disposable SQLite databases, including forced audit
and mirror failures and an actual CLI retry. The second checks that redemption
and seeded entitlement counts cannot appear as useful activation. Neither
checks production data, provider settlement, email delivery or legal readiness.

## Cancellation, failed payment and refund support

This is an intake and reconciliation procedure, not a new refund promise or
permission to operate a provider. Before 21 January 2027, use fictional cases
and isolated evidence only. Actual customer/provider work needs its separately
authorised operator and target. Signal Studio support uses
`hello@signalstudio.ie`; a venue's couple does not need the venue's invoice.

### Intake and decision

1. Open a case in the existing private support record. Record case reference,
   named operator, received time, account/project or venue reference, request
   (cancel renewal, refund, failed payment, or missing access), requested
   effective date and an opaque reference to the privately retained receipt.
   Do not copy card data, raw access codes or identity documents into the case.
2. Verify the requester and the exact agreement or provider customer,
   subscription/payment and affected entitlement references. A matching email,
   a plan label or an unverified `paidAt` is not sufficient. Missing historical
   customer binding goes to the principal with the receipt; do not create a
   second customer or grant as a workaround.
3. Separate policy eligibility from implemented access behavior. Apply only a
   recorded applicable policy. Where notice, grace, refund eligibility,
   proration or effective date is unresolved, record **policy pending** and
   ask the founder for that specific decision. The open questions are in
   [the existing commercial-policy todo](../../content/hq/operator-todos/planning-period-commercial-ratification.md).
   Do not infer consent, a refund entitlement or a grace period from code.

| Case | Settled boundary | Required disposition |
|---|---|---|
| Standard/Founding venue cancellation or failed renewal | €1,500/€1,000 annually, prepaid and VAT-inclusive. Founding rate depends on continuous renewal without lapse. Existing redeemed couple access survives the venue licence ending. | Verify the agreement and term; resolve notice, failed-payment/grace and refund questions before an operator action. Stopping future sponsorship is separate from changing an existing couple grant. |
| Consumer subscription | Manage billing requires the provider customer bound by verified payment. Current exact paid invoice and subscription state govern access. An unpaid period must not extend it. | Record whether cancellation is requested for now or the term end; confirm what the provider actually schedules and the resulting access. A portal visit is not cancellation evidence. |
| Existing one-time purchase | New Event sales remain held. The current one-time refund handler revokes the affected access when any amount is refunded. Intended Event archive behavior is not established by this handler. | Confirm the exact payment/refund and access outcome. This implementation fact does not set refund eligibility and must not be generalized to subscription refunds. |
| Unused code withdrawal | The existing withdrawal/readback procedure may withdraw an unused code. An already-claimed result preserves that grant. | Use the original request and code ID; never describe this as refunding payment or cancelling a claimed workspace. |

### Execute, reconcile and close

4. After a recorded policy disposition and separately authorised operator
   action, retain the actual provider/agreement response: reference, amount,
   status, effective time and affected term. On a timeout or unknown outcome,
   keep **provider outcome unknown**. Check that same operation before retrying;
   never submit another charge/refund or use a new reference to make it look
   successful. No general refund/reversal CLI exists in this payment guide.
5. Read the exact local access state and shared mirror through the existing
   owning operational path. App billing commits local truth before its shared
   mirror; Studio venue payment records shared truth before its Studio mirror.
   These are different flows. Record each read time and pending/conflict reason.
   A failed second phase does not mean the first phase was rolled back.
6. For an ordinary venue-payment mirror failure, repair the cause through
   authorised work and replay the identical recorded payment command above.
   For App lifecycle delivery, retain the failed delivery/reference and ask the
   principal to reconcile/replay that same event on the approved target. Do not
   improvise SQL, mint codes, extend terms or remove revocation markers.
7. Escalate unknown ownership, ambiguous historical references, mismatched
   amounts, unresolved policy or repeated reconciliation failure to the
   principal/founder with the private case reference, expected versus observed
   outcome, attempts and next owner. Keep the case pending; set the next review
   time with that owner, without promising an unapproved response deadline.
8. Close only after policy disposition, confirmed provider/agreement outcome
   and the required access/mirror readbacks agree. Record the customer's reply
   draft, operator, time and evidence references. An acknowledged support
   request alone does not establish cancellation, refund or restored access.

### Customer reply drafts

Use only the relevant verified facts; square brackets are unresolved fields.
These are internal drafts, not messages sent by this procedure.

| State | Draft |
|---|---|
| Intake | “I've received your [cancellation/refund] request for [agreement or plan]. I'm checking the payment record and the terms that apply. I haven't confirmed a cancellation or refund yet.” |
| Policy pending | “I'm checking which terms apply to your request. I'll confirm the outcome once that review is complete.” |
| Paid, access pending | “Your payment is recorded, but your access is not ready yet. We're checking the original request. Please keep your receipt and original invitation; there's no need to buy again to resolve this.” |
| Provider confirmed, access/mirror pending | “The payment service has confirmed [verified outcome]. We're still checking that your access shows the correct result. I'll confirm when that check is complete.” |
| Complete | “Your [cancellation/refund] is confirmed: [verified amount and effective date, if applicable]. Your access [verified result and term]. Reference: [private case reference].” |

Use the [support tabletop](venue-fulfilment.md#support-tabletop) before treating
these instructions as rehearsed. Provider settlement, portal behavior and
real customer comprehension remain separate evidence.
