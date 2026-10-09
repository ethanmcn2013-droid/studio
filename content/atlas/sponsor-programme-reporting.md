---
title: Sponsor programme reporting
slug: sponsor-programme-reporting
lens: Data Flows
owner: Ethan
lastVerified: 2026-10-09
links: [venue-fulfilment, account]
tags: [sponsor reporting, privacy, entitlement, cohort, measurement]
references: [src/lib/sponsor-programme/publisher.ts, src/lib/sponsor-programme/storage.ts, src/lib/sponsor-programme/compute.ts, src/lib/sponsor-programme/noise.ts, src/lib/sponsor-programme/integration.ts, docs/account/SPONSOR_PROGRAMME_V1.md, SPONSOR_REPORTS_ENABLED]
summary: Prepared internal venue gift reporting source, with App collection and reporting disabled by default and Studio receiving still separate.
status: complete
pinned: false
execWhat: Sponsors can inspect aggregate adoption and use without viewing recipients' private work.
execMatters: This separates evidence of funded access and planning from unsupported claims about business returns.
execRisk: Incorrect attribution or repeated report releases could expose private behavior or misrepresent missing data.
---

## App source preparation, 9 October 2026

This documentation receives the system description from open draft [Studio PR 201](https://github.com/ethanmcn2013-droid/studio/pull/201), source `0a48c729c45d7473d872b2072b5bb7ee0da88efb`. The Studio runtime and its migrations are not received or deployed by this documentation change. App final source, combined release gates, actual production flags and runtime deployment remain pending.

App schema `0040_sponsored_measurement_choice` is required before runtime deployment even with collection off, because preferences and account-deletion hooks use it. Conversation index `0039` and sponsor `0040` source were received through App PR 259 at main `9d1c719e`, tree `65b90cd`. The encrypted migration run 37999591761 attests two applied migrations and current status; independent review verified actual workflow/artifact custody, without independently decrypting, restoring or querying the target. Fresh read-only status run 38000438986 passed at 22:40:52 UTC on received main `9d1c719e448a4a117a2e428abc3b5bdd1349956f`, with matching target, identity and ledger, last applied `0040`, current status and no pending migration. This migration receipt does not establish runtime deployment or sponsor activation.

Actual registered-schema App receiving passed 39 action, provenance and proxy cases. Two paired local receiver modes each passed four clocks with nine checks per clock. The legacy receiver acknowledges subject erasure and refuses three Project controls, which App retains even after 800 days. The matching Studio 201 fixture acknowledges all four controls and invalidates aggregate material. These are local synthetic proofs. Collection being off must not stop historical erasure delivery; refused controls remain pending and do not establish completed Project-wide withdrawal.

No sponsor collection, report activation, Studio rollout, external reporting or commercial privacy acceptance follows from receiving disabled App source. Actual production flag posture still needs verification. Gift access survives measurement withdrawal, and cross-sponsor composition remains unresolved.

## WHAT

One reusable internal Sponsor Programme engine references existing sponsored access. Venue gifts are the first configuration. Student, teacher and individual configurations remain disabled until their own terms and scope exist. No pupil configuration is provided.

## WHO

Ethan owns operation and programme membership. App authenticates recipients and report readers and owns deliberate-action capture. Studio verifies entitlement provenance, persists the report release and checks current reporting capabilities. The frontend team owns subsequent presentation design.

## WHERE

Candidate Studio PR 201 source: `src/lib/sponsor-programme/`, `src/app/api/sponsor-programmes/`, additive entitlements migrations 0001 through 0004, and `docs/account/SPONSOR_PROGRAMME_V1.md`. These paths describe the proposed receiver, not received Studio main or production.

Prepared App source: `src/server/sponsored-use/`, `src/server/sponsor-report/`, the Clerk-authenticated report proxy, and measurement withdrawal API. Collection requires `SPONSOR_USAGE_EVENTS=1` and a valid App-only hash salt; absent configuration creates no positive event. Reporting requires `SPONSOR_USAGE_ENVIRONMENT=internal_test`, `SPONSOR_REPORTS_ENABLED=1` and a purpose-separated `SPONSOR_REPORT_ASSERTION_SECRET`. Source defaults do not attest actual production configuration.

## HOW

1. Existing canonical issuance and redemption establish a gift and its sponsored Project. Access is unchanged by reporting. A partner's authorized action contributes to the same gift.
2. Successful deliberate task creation emits the existing scoped, pseudonymous event. Verified signed delivery persists daily unit contributions in Studio's shared entitlement database.
3. The private publisher combines complete canonical claim enumeration with explicitly attested daily coverage. A quiet day needs observation evidence; no event is not sufficient.
4. One claim-month cohort is observed through the next activity month plus 35 days. A publication after the 100 elapsed-day retention deadline is unavailable.
5. A 32-cell joint histogram receives independent discrete geometric noise. All behavioral suppression, estimates and semantic inequalities derive from this single private vector. One writer transaction reserves both gift and scope and freezes the result.
6. The App signs a five-minute assertion for the authenticated reader. Studio separately checks report-read, export or invitation-administration capability. JSON, HTML and CSV expose the same validated frozen projection.
7. Withdrawal restricts the entire sponsor report family and clears report payloads and private measurement material. Reports are never recomputed after deletion. Redeemed access survives according to existing venue terms.

## WHEN — current state

Implemented on isolated task branches for internal receiving verification. This atlas describes the candidate system and the bounded App receiving evidence above, not a deployed sponsor service. In the matching Studio PR 201 checkout, `node scripts/sponsor-report-rehearsal.cjs --help` describes the isolated three-store rehearsal. It performs real synthetic redemptions, deliberate actions, signed ingest, publication, authorized receiving and refusal/withdrawal checks. Optional loopback preview serves the actual HTML handler. Source revisions and gate evidence belong in the private delivery receipt; no production data or shared Preview is required. Studio runtime/migration receiving and Project-wide remote withdrawal remain separate from disabled App source preparation.

## WHY

A generated code, invitation, evidenced delivery, claim and planning action are different facts. Operational invitation permissions must not become behavioral visibility. Monthly distinct gifts must not be sums of daily unique counts. A minimum group size and deterministic bands alone do not prevent inference from known peers; frozen randomized estimates constrain conditional behavioral inference while the disclosure ledger prevents repeated sampling and overlapping releases within a sponsor family. Sequential cross-sponsor privacy composition remains unresolved and blocks external enablement. The privacy contract explicitly limits its guarantee and remains internal; it does not establish anonymity or authorize external release.
