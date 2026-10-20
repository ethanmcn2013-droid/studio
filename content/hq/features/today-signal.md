---
id: today-signal
title: Today Signal briefing
product: Signal
category: Integration
status: Built
priority: High
effort: Large
impact: High
owner: Ethan
principleAlignment: 96
relatedCampaign: Public Timeline Content Campaign
relatedMetric: Weekly active workspaces
---

## Notes

**Retired 2026-10-20.** The founder retired the daily briefing (Today's Signal) and the Full Briefing across Signal Studio. Home now opens with a countdown to the next project date, Done this week, a year of activity and four start cards. The app redirects `/app/home/briefing` and `/app/signal` to `/app/home`, and the daily briefing email cadence is retired. The status field stays `Built` because the HQ feature contract declares no retired status. The notes below are history.

### App source receiving, 10 October 2026

**11 October update.** App PR 266 passed all five required hosted gates on head `652c97` and merged to App main at `b9178f0f9923ce4136757e6c17a1c8c6041c1d8a`, tree `fb91114f61e755dad908b16a33792b31d302380c`. The received change includes the focused five-file dependency-name privacy repair from PR 207; exact comparison against this main exited 0. Reopened PR 207 head `9b87924ab5c8af7817aa907b72a69dcc9d802e0a` was closed as superseded at 06:56:50 UTC, with its branch preserved. This is source and hosted-check evidence, not current browser privacy acceptance. A fresh 196-case fixture run (`tasks-playwright-f09f492a0af3c19f63853e43`, fixture-source field `9f2ee2dbfd7241f3eb203d8c51c9aa7f6213d13a`) ran 06:00:26–06:12:43 UTC; the fixture receipt is bound to that source; the later metadata-only commit and exact received tree establish continuity to main. It does not establish browser-specific privacy DOM/scenario coverage or authenticated live acceptance. Private evidence PR 117 was received at `04543509f5f20727085e3146684c8abafa394d5c` (tree `a3c59981a98fd46213c04739ea49afe3a66b8198`) at 07:13:54 UTC. Independent fresh receiving review passed all 315 bodies: 86 LFS pointers and 229 ordinary Git blobs matched the received tree. This records bounded evidence custody, not overall programme acceptance.

One staging CREATE ran from 06:53:48 to 06:53:56 UTC and produced `dpl_BpsrNHLCTHHLmD43KXHAz3kxT1Hz` at `https://app-qo6f0grvp-ethanmcn2013-1730s-projects.vercel.app`. The exact-project/team metadata projection read at 07:00 UTC reported READY, production target, matching source SHA `b9178f0f9923ce4136757e6c17a1c8c6041c1d8a`, tree `fb91114f61e755dad908b16a33792b31d302380c`, and Node 24 configured; the binding is qualified, while runtime execution remains unproven. Preserve the earlier pre-READY `UNEXPECTED_VIRTUAL_ROOTS` read failure (zero bodies); after READY, bounded source readback passed at 07:01–07:05 UTC: path/mode/opaque UID agreement covered 4,128 uploaded source leaves and 62 selected exact body comparisons matched. This is bounded sampled-body evidence, not full-body equality or application acceptance. The post-READY project read at 07:01 UTC still showed canonical production and all three cron targets bound to `dpl_CPpsUFJ2mxtLQzg3B6CfkefvX5fB` and the old source `aaa7283d65c9a3e0549396c12ac15a5e65ca606b`. No promotion or live acceptance is claimed.


The release candidate preserves current Home and Overview while receiving reviewed backend truth repairs. For an explicitly complete and empty authorized task inventory, partial activity coverage no longer invents work that could not be checked. Raw activity evidence stays partial, and unknown, incomplete, mixed-scope or nonempty inventories keep their partial state. Observations of saved completions and overload based on canonical personal assignments are bounded source repairs, not a new blind quality result.

The historical local App checkpoint is `f09cb3461abdcd5e17e31be180737f4c6c7b35aa`, tree `e093a15b0c68c6e56120337c1d2af32de59dc277`, including the bounded row-menu focus guard after the received backend runtime and verification repairs. Current App typecheck, menu lint and experience selftests passed with native exit 0. Fresh local production-classified and demo builds passed, as did seven Settings/shell hydration cases, eight Timeline switcher cases and all 196 maintained experience cases; each completed with native exit 0. The full experience run completed from 03:01:23.768 to 03:14:23.916 UTC on 10 October. The production-classified budget passed unchanged ceilings at 1,110.5 KB gzip across 116 client chunks; lower target budgets remain unmet. These are local fixture results, not provider production or live-user acceptance.

Prior 614 module, lint, conversation, reliability and synthetic-contrast results keep their actual source identities and establish only unchanged-source continuity. Prior 5d route/Home/Overview, realtime/React and full196 passes, and the earlier d4 full receiving pass, remain historical. The initial 5d review-classified budget failed with native exit 2 on a different chunk population; that failure is preserved, and corrected classification passed at unchanged 5d source. No earlier native result is relabelled as an executed f09 check.

Earlier, App PR 263 had been received on main at `95717b7cb58393d1f99137741006860690beba02`, tree `bfebb8f43c4751b7617c632a5f82c41c65acc2b5`. Its exact PR head `c9019f0b07691a9738f1619b5ddddbae25e92bdf` passed all five hosted checks. The reviewed Windows sweep recorded 47/48 stages passing; a native process exit `3221225477` and a 600-second posttest timeout leave that sweep incomplete, so these results are not a blanket suite pass. The bounded capture repair has independent source review; no hosted live-user, provider, ASR or physical-device acceptance follows. The earlier f09 capture and its sixteen issued receipts remain immutable historical evidence. Companion private evidence PR 114 was received at `257d798` (tree `cb6857f`). The earlier staging CREATE produced deployment `dpl_8iZ3bYM6NPzMN16aqmK4iwmSoidR` at `https://app-ct0uaunv0-ethanmcn2013-1730s-projects.vercel.app`, now observed as READY. Bounded source readback for that deployment passed against App main `95717b7cb58393d1f99137741006860690beba02` (tree `bfebb8f43c4751b7617c632a5f82c41c65acc2b5`): path/mode/opaque UID agreement covered 4,111 source entries, and all 41 sampled exact bodies matched. This does not establish full-body equality or runtime behavior; remote authenticated acceptance remains pending. The canonical deployment and three cron hosts still point to `dpl_CPpsUFJ2mxtLQzg3B6CfkefvX5fB`, source `aaa7283d65c9a3e0549396c12ac15a5e65ca606b` (read back at 05:16:11 UTC). The separate 05:02 UTC production configuration readback records both access-enumeration classifications as production and all four Drive flags ABSENT; this does not establish activation. No promotion or live acceptance is claimed. The progressive Signal flags remain off by source default; actual production configuration still needs verification. Historical quality failures, sealed fresh labels, three-item briefing discipline and current design remain intact. No founder design selection follows from receiving the source.

### Backend truth checkpoint, 27 September 2026

The source-pinned investigation at App `6bb1013a` confirms that mounted Home still uses the legacy briefing path; explicit planning-period Full Briefing also retains it with V1 enabled. Original candidate `7ebb502b` repairs canonical lifecycle facts and complete-or-error source enumeration. Its forty-family development comparison records five lifecycle wins, 34 ties, no losses and one unscored outage. A separately completed diagnostic comparison corrects two further lifecycle families but exposes a new critical omission; the aborted blind protocol remains inconclusive and absolute quality fails.

Follow-up `87d8bef7` resolves completed prerequisites, uses explicit unavailability for unknown open dependencies and lets valid comment-creation evidence advance recency. Eighteen independent receiving checks pass; the completed sixty-family nonblind regression fails acceptance: 141 unsupported claims, six critical failures, one new critical omission versus baseline and four newly unavailable families. These repairs do not certify complete activity history or resolve protected priority/date/presentation contracts. No release or overall quality acceptance is claimed. The current interface remains unchanged.

See [App backend reliability and Signal reads](../../atlas/app-backend-reliability-and-signal-reads.md) for the exact source paths, evidence limits and private delivery links. The historical design record below is not evidence that these backend quality gates passed.

The ecosystem's daily state of work. The live Briefing remains Signal's default and keeps its hard three-item discipline. The separate `signal-progressive-depth` feature adds Overview, Trends, and Evidence beneath it behind a production-off flag; it does not replace this artifact.

### Tasks due-date source repair (App candidate, 23 September 2026)

The integration candidate converts raw Tasks `due_at` SQLite seconds to the
millisecond clock used by the briefing engine. Focused source tests cover
missing, zero, negative and invalid values. This corrects candidate reads; it
does not show that the production briefing cron has run or that this source
revision is deployed.

### The read shows its working (Tasks T·111, 30 July 2026)

The Briefing now publishes what it examined, not only what it surfaced. Every read carries four numbers that reconcile in front of the reader: items read, items that crossed a rule, items shown, and items cleared, with read equal to flagged plus cleared exactly. Work held back by the three-item cap is never counted as cleared, and synthetic cluster rows are never counted as source items, because they are readings of work already counted. The presentation contract enforces those invariants itself rather than trusting its callers, after two of them broke it.

Rows are grammatical. A task title is the reader's own words, so it is a headline and never a clause: the page used to compose an imperative title into "Approve the final seating plan is 2 days overdue". The title and the observation are now separate fields, and the same rule reaches upstream blocker names, which are counted rather than named when a question or a shout cannot sit inside a sentence.

Sections are Now and Next, and each row sits on the marketing hero's three columns with its action at the right edge, so the product and its hero read as the same object. Tone is present at rest rather than only under a pointer.

Method note worth keeping: two five-seat design panels raised the surface from 6.9 to 7.7 out of ten and found roughly seventy grounded defects, but the automated axe pass caught a WCAG failure all ten reviewers missed. The ordinal rail had been ported faithfully from the hero at 1.47:1 against paper, which is a stylistic choice on a marketing page and a hard failure on a product surface. Design review and measured evidence are not substitutes for each other.

Honest edge: the unmounted analytics shell is untouched and still awaits its wire-or-retire decision, and the flag-gated Evidence drawer was verified from source and an isolated harness rather than live.
