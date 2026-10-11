---
title: Sponsor programme reporting
slug: sponsor-programme-reporting
lens: Data Flows
owner: Ethan
lastVerified: 2026-10-11
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

## App source preparation, 10 October 2026

**11 October update.** App PR 266 passed all five required hosted gates on head `652c97` and merged to App main at `b9178f0f9923ce4136757e6c17a1c8c6041c1d8a`, tree `fb91114f61e755dad908b16a33792b31d302380c`. The received change includes the focused five-file dependency-name privacy repair from PR 207; exact comparison against this main exited 0. Reopened PR 207 head `9b87924ab5c8af7817aa907b72a69dcc9d802e0a` was closed as superseded at 06:56:50 UTC, with its branch preserved. This is source and hosted-check evidence, not current browser privacy acceptance. A fresh 196-case fixture run (`tasks-playwright-f09f492a0af3c19f63853e43`, fixture-source field `9f2ee2dbfd7241f3eb203d8c51c9aa7f6213d13a`) ran 06:00:26–06:12:43 UTC; the fixture receipt is bound to that source; the later metadata-only commit and exact received tree establish continuity to main. It does not establish browser-specific privacy DOM/scenario coverage or authenticated live acceptance. Private evidence PR 117 was received at `04543509f5f20727085e3146684c8abafa394d5c` (tree `a3c59981a98fd46213c04739ea49afe3a66b8198`) at 07:13:54 UTC. Independent fresh receiving review passed all 315 bodies: 86 LFS pointers and 229 ordinary Git blobs matched the received tree. This records bounded evidence custody, not overall programme acceptance.

One staging CREATE ran from 06:53:48 to 06:53:56 UTC and produced `dpl_BpsrNHLCTHHLmD43KXHAz3kxT1Hz` at `https://app-qo6f0grvp-ethanmcn2013-1730s-projects.vercel.app`. The exact-project/team metadata projection read at 07:00 UTC reported READY, production target, matching source SHA `b9178f0f9923ce4136757e6c17a1c8c6041c1d8a`, tree `fb91114f61e755dad908b16a33792b31d302380c`, and Node 24 configured; the binding is qualified, while runtime execution remains unproven. Preserve the earlier pre-READY `UNEXPECTED_VIRTUAL_ROOTS` read failure (zero bodies); after READY, bounded source readback passed at 07:01–07:05 UTC: path/mode/opaque UID agreement covered 4,128 uploaded source leaves and 62 selected exact body comparisons matched. This is bounded sampled-body evidence, not full-body equality or application acceptance. The post-READY project read at 07:01 UTC still showed canonical production and all three cron targets bound to `dpl_CPpsUFJ2mxtLQzg3B6CfkefvX5fB` and the old source `aaa7283d65c9a3e0549396c12ac15a5e65ca606b`. No promotion or live acceptance is claimed.


This documentation receives the system description from open draft [Studio PR 201](https://github.com/ethanmcn2013-droid/studio/pull/201), source `0a48c729c45d7473d872b2072b5bb7ee0da88efb`. The Studio runtime and its migrations are not received or deployed by this documentation change.

The historical local App checkpoint is `f09cb3461abdcd5e17e31be180737f4c6c7b35aa`, tree `e093a15b0c68c6e56120337c1d2af32de59dc277`, including the bounded row-menu focus guard after the received backend runtime and verification repairs. Current App typecheck, menu lint and experience selftests passed with native exit 0. Fresh local production-classified and demo builds passed, as did seven Settings/shell hydration cases, eight Timeline switcher cases and all 196 maintained experience cases; each completed with native exit 0. The full experience run completed from 03:01:23.768 to 03:14:23.916 UTC on 10 October. The production-classified budget passed unchanged ceilings at 1,110.5 KB gzip across 116 client chunks; lower target budgets remain unmet. These are local fixture results, not provider production or live-user acceptance.

Prior 614 module, lint, conversation, reliability and synthetic-contrast results keep their actual source identities and establish only unchanged-source continuity. Prior 5d route/Home/Overview, realtime/React and full196 passes, and the earlier d4 full receiving pass, remain historical. The initial 5d review-classified budget failed with native exit 2 on a different chunk population; that failure is preserved, and corrected classification passed at unchanged 5d source. No earlier native result is relabelled as an executed f09 check.

Earlier, App PR 263 had been received on main at `95717b7cb58393d1f99137741006860690beba02`, tree `bfebb8f43c4751b7617c632a5f82c41c65acc2b5`. Its exact PR head `c9019f0b07691a9738f1619b5ddddbae25e92bdf` passed all five hosted checks. The reviewed Windows sweep recorded 47/48 stages passing; a native process exit `3221225477` and a 600-second posttest timeout leave that sweep incomplete, so these results are not a blanket suite pass. The bounded capture repair has independent source review; no hosted live-user, provider, ASR or physical-device acceptance follows. The earlier f09 capture and its sixteen issued receipts remain immutable historical evidence. Companion private evidence PR 114 was received at `257d798` (tree `cb6857f`). The earlier staging CREATE produced deployment `dpl_8iZ3bYM6NPzMN16aqmK4iwmSoidR` at `https://app-ct0uaunv0-ethanmcn2013-1730s-projects.vercel.app`, now observed as READY. Bounded source readback for that deployment passed against App main `95717b7cb58393d1f99137741006860690beba02` (tree `bfebb8f43c4751b7617c632a5f82c41c65acc2b5`): path/mode/opaque UID agreement covered 4,111 source entries, and all 41 sampled exact bodies matched. This does not establish full-body equality or runtime behavior; remote authenticated acceptance remains pending. The canonical deployment and three cron hosts still point to `dpl_CPpsUFJ2mxtLQzg3B6CfkefvX5fB`, source `aaa7283d65c9a3e0549396c12ac15a5e65ca606b` (read back at 05:16:11 UTC). The separate 05:02 UTC production configuration readback records both access-enumeration classifications as production and all four Drive flags ABSENT; this does not establish activation. No promotion or live acceptance is claimed. Broader local builds and browser receiving do not establish sponsor activation or complete remote withdrawal.

App schema `0040_sponsored_measurement_choice` is required even with collection off because preferences and account-deletion hooks use it. Conversation index `0039` and sponsor `0040` were received through App PR 259 at main `9d1c719e`, tree `65b90cd`. Encrypted run 37999591761 attests two applied migrations and current status; independent review verified actual workflow/artifact custody without independently decrypting, restoring or querying the target. Fresh read-only run 38000438986 passed at 22:40:52 UTC on exact main `9d1c719e448a4a117a2e428abc3b5bdd1349956f`, with matching target, identity and ledger, last applied `0040`, current status and no pending migration. These applied migrations must not be replayed.

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
