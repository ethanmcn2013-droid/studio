---
title: Sponsor programme reporting
slug: sponsor-programme-reporting
lens: Data Flows
owner: Ethan
lastVerified: 2026-10-01
links: [venue-fulfilment, account]
tags: [sponsor reporting, privacy, entitlement, cohort, measurement]
references: [src/lib/sponsor-programme/publisher.ts, src/lib/sponsor-programme/storage.ts, src/lib/sponsor-programme/compute.ts, src/lib/sponsor-programme/noise.ts, src/lib/sponsor-programme/integration.ts, docs/account/SPONSOR_PROGRAMME_V1.md, SPONSOR_REPORTS_ENABLED]
summary: Internal venue gift reporting from verified claims and scoped planning actions to frozen aggregate reports.
status: complete
pinned: false
execWhat: Sponsors can inspect aggregate adoption and use without viewing recipients' private work.
execMatters: This separates evidence of funded access and planning from unsupported claims about business returns.
execRisk: Incorrect attribution or repeated report releases could expose private behavior or misrepresent missing data.
---

## WHAT

One reusable internal Sponsor Programme engine references existing sponsored access. Venue gifts are the first configuration. Student, teacher and individual configurations remain disabled until their own terms and scope exist. No pupil configuration is provided.

## WHO

Ethan owns operation and programme membership. App authenticates recipients and report readers and owns deliberate-action capture. Studio verifies entitlement provenance, persists the report release and checks current reporting capabilities. The frontend team owns subsequent presentation design.

## WHERE

Studio: `src/lib/sponsor-programme/`, `src/app/api/sponsor-programmes/`, additive entitlements migrations 0001 through 0004, and `docs/account/SPONSOR_PROGRAMME_V1.md`.

App: `src/server/sponsored-use/`, `src/server/sponsor-report/`, the Clerk-authenticated report proxy, and measurement withdrawal API. Both remain gated to `SPONSOR_USAGE_ENVIRONMENT=internal_test`. Reporting also requires `SPONSOR_REPORTS_ENABLED=1` and a purpose-separated `SPONSOR_REPORT_ASSERTION_SECRET`.

## HOW

1. Existing canonical issuance and redemption establish a gift and its sponsored Project. Access is unchanged by reporting. A partner's authorized action contributes to the same gift.
2. Successful deliberate task creation emits the existing scoped, pseudonymous event. Verified signed delivery persists daily unit contributions in Studio's shared entitlement database.
3. The private publisher combines complete canonical claim enumeration with explicitly attested daily coverage. A quiet day needs observation evidence; no event is not sufficient.
4. One claim-month cohort is observed through the next activity month plus 35 days. A publication after the 100 elapsed-day retention deadline is unavailable.
5. A 32-cell joint histogram receives independent discrete geometric noise. All behavioral suppression, estimates and semantic inequalities derive from this single private vector. One writer transaction reserves both gift and scope and freezes the result.
6. The App signs a five-minute assertion for the authenticated reader. Studio separately checks report-read, export or invitation-administration capability. JSON, HTML and CSV expose the same validated frozen projection.
7. Withdrawal restricts the entire sponsor report family and clears report payloads and private measurement material. Reports are never recomputed after deletion. Redeemed access survives according to existing venue terms.

## WHEN — current state

Implemented on isolated task branches for internal receiving verification. This atlas describes source behavior, not deployed status. Run `node scripts/sponsor-report-rehearsal.cjs --help` for the isolated three-store rehearsal. It performs real synthetic redemptions, deliberate actions, signed ingest, publication, authorized receiving and refusal/withdrawal checks. Optional loopback preview serves the actual HTML handler. Source revisions and gate evidence belong in the private delivery receipt; no production data or shared Preview is required.

## WHY

A generated code, invitation, evidenced delivery, claim and planning action are different facts. Operational invitation permissions must not become behavioral visibility. Monthly distinct gifts must not be sums of daily unique counts. A minimum group size and deterministic bands alone do not prevent inference from known peers; frozen randomized estimates constrain conditional behavioral inference while the disclosure ledger prevents repeated sampling and overlapping releases within a sponsor family. Sequential cross-sponsor privacy composition remains unresolved and blocks external enablement. The privacy contract explicitly limits its guarantee and remains internal; it does not establish anonymity or authorize external release.
