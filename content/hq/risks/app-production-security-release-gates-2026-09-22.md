---
id: app-production-security-release-gates-2026-09-22
title: App security patch and database migrations are deployed; runtime gates remain.
category: Infrastructure
likelihood: Medium
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-09-24
---

## The risk

The production App was on Next.js 16.2.11, within the affected range of the
critical September 22 Next.js security update. App PR #179, candidate commit
`e27bc3e4`, upgrades `next` and `eslint-config-next` to 16.3.6 while retaining
React 19.2.4 and ESLint 9. The upstream advisory identifies critical issues
including a Node.js `ImageResponse` (`next/og`) issue. The five statically
inspected Node `ImageResponse` routes render local JSX; no attacker-controlled
SVG, style, or content input was demonstrated. The affected component was
present, but exploitability through these routes and any compromise have not
been demonstrated. The upgrade addresses the vulnerable version exposure; it
does not establish that the production system was exploited or compromised.

The narrow App patch was released at main `6ae877710c49c4b8a69c0de7e068442c3af4eb23`.
At the 23 September pre-release inventory checkpoint, it was included in main
`c65cb2d5d5616b50b4988fc3ba19f1f42bad9756` and production
`dpl_9nQWBjBFavmXeiA1YpErboU2gXit`. Those are historical revisions. Production
later resumed on main `c0573fdbcb6e8eb938f6754143c57d289eeb3ccd` as
configuration-only deployment `dpl_3r7x5j88kecBCATCUTGzr9biPPzR` (23
September, 20:55 UTC). On 24 September production moved to
`dpl_DpqiYicAAdmQtKJwe5jBX9fZ5tLY` at main
`06dace82eb2ef0c0006b603f6e6010d6cffc80ec` (00:09 UTC). Since 11:13 UTC it
serves `dpl_EqEq1iAP9tYYuzB9FspJfPDaESn6` at main
`64210b1e5aa200d952ba8c8010e324506e74587f`; see the current release section
below. The earlier `/app/home` and
`/icon` smoke checks do not certify authenticated workflows or the larger
production sprint. The security release changed no database or environment
configuration. Its recorded audit reported six lower-severity findings in that
release graph: three moderate `undici`, one moderate `@opentelemetry/core`, one
low `@babel/core`, and one low `@ai-sdk/provider-utils`. Do not treat that
historical count as the integrated candidate's audit or as a zero-findings
result.

The founder-only #22 candidate was
`b164100a19880cb8ab1b9461bc6c4031c9aede5b` in isolated Preview
`dpl_DaKstaURXDtbYBZUTi27mwFn8DZc`; its independent receiving review accepted
it for that candidate scope. At 19:43:45 UTC on 23 September, production
resumed at App main
`c0573fdbcb6e8eb938f6754143c57d289eeb3ccd`, deployment
`dpl_65msoCrXoErhwZRMr47cfn9ekTSb`. This deployment is historical; production
later moved to dpl51 and then to the current configuration-only dpl3r7
deployment described below. Main is tree-identical to the accepted candidate.
At that checkpoint, all six production aliases resolved to this deployment.
Notes migration `0001`, Timeline adoption `0001`, and
Tasks migrations `0028`–`0038` are applied and current; original rows were
preserved, integrity and foreign-key checks passed, and an actual second-run
no-op passed. The migration bytes match the reviewed candidate source. Tasks
workflow run `35909383620` and post-migration drift check `35909894779` passed.
The fresh 19:17 backup restored locally, and the encrypted artifact passed
private release download and decryption verification. This is a production
schema and backup checkpoint, not completion of all runtime gates.

The founder's existing production Tasks board (11 tasks) and Timeline (four
milestones) were read after resume. The same c057 main revision was promoted
again as configuration-only deployment `dpl_3r7x5j88kecBCATCUTGzr9biPPzR` at
20:55 UTC on 23 September. All six aliases resolve to it. The protection
inventory covers 25 hosts total (six aliases and 19 generated hosts) and 50
path observations with zero network errors. Three intended cron schedules are
enabled. Founder Drive consent, callback, connection, folder setup, exact
88-byte native fallback download, and exact 87-byte Drive download match were
verified on the prior dpl51 checkpoint. On dpl3r7, the controlled work account
became storage owner, uploaded and byte-verified a 96-byte Drive file, and the
provider showed the work account as owner and the founder as editor. Separately,
after the founder disconnected Drive, the work account reopened the original
founder-owned 87-byte file and it rendered. This is a current member-access
observation for that existing file; it does not change the earlier dpl51
receipt's source attribution. The founder has not downloaded the new 96-byte
file. Earlier dpl51 checks covered the initial Clerk signup restriction,
the private App gate for a registered but unlisted user, and refusal of a
wrong-account Project invitation; a limited one-day test invitation was
issued. On dpl3r7, the controlled founder and work account
exchanged messages in Task Discussion and a Project room. The founder opened
the exact new task comment from Inbox and sent a room reply. These are
controlled two-account production observations, not a human
study. Direct messages, external delivery, and four repair-only flags remain
off. Public launch is not claimed. On dpl3r7 the Drive resource UI showed the
uploader as “Someone” on both files. Release `06dace82` resolves this: Resources
now shows the authorized contributor's name on native and Drive files. A
display name is not identity or authorization evidence. The earlier `prod migrations current`
failure at Tasks `0027` is historical and superseded by the successful c057
migration and drift receipts above. A real next-day/24–48-hour elapsed-use
observation remains outstanding.

The saved production-only audit for the integrated candidate's dependency
snapshot reports zero critical, high, or moderate findings and one low runtime
finding:
`@ai-sdk/provider-utils@4.0.26`, GHSA-866g-f22w-33x8, through the AI SDK path.
The SDK path is used by server actions when configured; the advisory concerns
unbounded JSON response reads and memory consumption. No attacker-controlled
upstream response or exploit was demonstrated. The full candidate audit reports
six high, two moderate, and two low findings; nine are development-only through
`js-yaml`, `brace-expansion`, and `esbuild`, while the remaining low is the
runtime finding above. This bounded assessment is not a zero-vulnerability
claim. The saved JSON audit files identify their snapshot as `4cbe33aa`; the
dependency manifests and lockfile are unchanged at `b164`. The candidate audit
graph differs from the production `c65` graph; do not apply its counts to the
deployed revision before promotion. App PR #182 carries the exact `b164` source.

The App's largest-chunk performance ceiling has a narrow, temporary exception
for the security patch: the measured gzip chunk is 64,571 bytes (63.0576 KiB),
59 bytes above the previous 63 KiB ceiling. The ceiling is 63.1 KiB; the target
remains 63 KiB. No other budget changed. This was a delegated sprint decision
under the user's execution authority, not a numeric choice attributed to the
founder. Reassess the exception after the security release is integrated.

## Current production release (24 September)

At 00:09 UTC on 24 September, App main
`06dace82eb2ef0c0006b603f6e6010d6cffc80ec` was promoted as
`dpl_DpqiYicAAdmQtKJwe5jBX9fZ5tLY`. It is source-only, with no migration and
no direct data write, and combines two changes:
- App PR #191: the rolling digest reads "Due in the next 24 hours", and Inbox and Resources show contributor names.
- App PR #192: the Timeline "Open shared page" link keeps its Project context. It previously returned 404 for a Project that was not the owner's primary one.

Before promotion:
- The exact staged build passed runtime binding attestation: all five literal database URL fingerprints matched.
- The temporary attestation keys were removed.

Post-promotion readback:
- All six aliases resolve to the new deployment.
- Deployment protection and the three cron schedules are preserved.
- A bounded anonymous probe of six hosts saw no 5xx.

Founder receiving confirmed:
- Inbox shows the new label.
- Populated Resources show contributor names.
- The Timeline draft opens from the manager.

The earlier eec057 stage `dpl_5gmqycxmrDNKgRori6hAXaMxRrys` and a refused worktree-built stage `dpl_4ADBTGCyamFVxmz9hdF6dP55XUoo` were never promoted. The previous deployment `dpl_3r7x…` remains the safe fallback; pre-0035 writers remain unsafe.

On the synthetic canary Timeline, the owner published one milestone, read it anonymously and revoked it:
- The published page returned no-store and noindex headers and exposed only the chosen milestone, dated 24 September 2026 in America/New_York.
- After revocation the link returned a content-free page. It is a soft 404: the status is 200.

Two small follow-ups:
- App PR #193: arming a share confirm button no longer moves the adjacent destructive control.
- The revoked-link status code.

On 24 September the same guarded chain shipped two owner-UI follow-ups: `8820feb3` (App
PRs #193 and #194, `dpl_Dix2gCxoopMY7TepGv372vhkkJeE`, 09:44 UTC) and
`be61bc9e` (App PR #195, `dpl_HtZTpbstJrxbpasBwcm3TV7qrf7f`, 10:23 UTC). #195
stops the artifact studio from saying "Link live" after every link was
revoked. Each release:
- passed the same five-binding runtime attestation and temporary-key cleanup;
- kept all six aliases, protection and crons;
- changed no data path, migration or job.

Tracker packet P09 is accepted; P10 elapsed-use observation is in progress. The 09:00 digest job ran at 09:47 UTC on 24 September; the Hobby plan fires crons within the scheduled hour. The Studio heartbeat was received with a 200. The digest intentionally sends no email for an impersonal scheduled run. At 11:13 UTC `64210b1e` (App PR #196, `dpl_EqEq1iAP9tYYuzB9FspJfPDaESn6`) made the App's analytics-snapshots and Drive grant-repair jobs report the same fail-silent heartbeat. Studio PR #198 accepts those sources and monitors all three App jobs in HQ Today and Pulse. It also retires the stale "analytics daily cron" alarm, which tracked the standalone Signal briefing job. Unauthorised calls to the cron routes still return 401 and write no heartbeat.

Evidence: private workspace
`docs/execution/production-sprint-2026-09/timeline-context-release-06dace/` and
`timeline-audience-production-c057/`.

## Evidence and release gate

- App PR #179, candidate `e27bc3e4`; security receipt:
  `docs/security/nextjs-critical-update-2026-09-22.md` in the App repository.
- Official advisory: [Next.js Security Update, September 22, 2026](https://nextjs.org/blog/nextjs-security-update-september-22-2026).
- Five Node `ImageResponse` route inputs were statically reviewed; all render
  local JSX. This is a bounded source inspection, not a production exploit test.
- All candidate CI checks and the scoped rendered-production smoke checks passed.
  Preserve the six remaining audit findings
  in follow-up; do not describe the dependency audit as clean.

## Related integration risk

On 23 September, a controlled recipient exported and deleted its account in
Preview source `f7816d07621445016ae2f5f7fcf953df08df3325`. The exact owned
Note appeared in the recipient's export; after deletion, the identity and
recipient-owned footprint were absent or tombstoned, stale export was refused,
and selected creator-owned rows and Project B remained unchanged. This is one
source-labelled Preview lifecycle proof. It does not prove production erasure,
all account shapes, or deletion of populated recipient data in Timeline and
Signal, which were empty for that actor. Controlled Project deletion also
passed separately at Preview source `a19ab2918a25bf4c4dd9dae110917cf66b54ef1f`,
with 18 exact starter Tasks and the template receipt removed while Project B
remained unchanged.

The founder-only amendment of 23 September defers newcomer and conversation-
comprehension cohorts to a possible wider release. No participant session is
claimed; controlled accounts are not human-study evidence. The finite J13
attention packet was accepted at Preview source `96df1e1c`. On production
source c057, the controlled work account was added through a configuration-only
conversation allowlist update. Task Discussion and Project-room exchanges,
founder Inbox links, and the exact task-comment destination were observed on
dpl3r7. This is bounded controlled-account receiving evidence, not cohort
comprehension or broad release acceptance. Direct messages and external
delivery remain disabled.

Drive lifecycle issue #32 is Done at exact Preview source `b164100a`. The
candidate's ambiguous-ack receiving checks completed for both a 150-byte file
and a supported 50 MiB file; read-only provider verification checked each new
body SHA-256 and the unchanged four historical rows. Scoped Project deletion
then removed Project rows, grants and the exact native-Blob cleanup receipt
while retaining all six Drive files and their folders, owner-only ACLs, and the
two users' connection records. The historical 50 MiB body was compared with
its previously pinned provider MD5; the new SHA-256 is recorded as an
observation, not as an earlier claim. The exact source review and read-only
receipt are `work/final-acceptance-b164.md` and
`work/drive-project-after-delete-b164.json`.

The #32 acceptance is the bounded Drive lifecycle proof on isolated Preview;
it does not establish complete production Drive lifecycle readiness. Production
served App main `c0573fdbcb6e8eb938f6754143c57d289eeb3ccd` until 24 September
and now serves source-only successor `06dace82`, both with Notes `0001`,
Timeline adoption `0001`, and Tasks `0028`–`0038` applied. Founder Drive consent
and exact file checks were recorded on dpl51. A controlled member opened the
matched Drive file on dpl51; separately, on dpl3r7, the work storage owner
reopened the original founder-owned 87-byte Drive file after the founder
disconnected and it rendered. A different 96-byte file uploaded by the work
owner had exact bytes verified, with the provider showing work as owner and
founder as editor; the founder has not downloaded that file. These results
separate current member access to the historical file from owner-side upload
and download of the new file. Controlled production reconnect, restore, and
owner-handover checks passed. The work account was removed from the canary
Project at about 21:27 UTC on 23 September. The Project is now founder-only,
work grants were removed from both founder Drive generations, and there are
zero pending operations. The removed account was then denied the old Project,
Task, room and founder Drive file. The controlled
second actor is registered, verified Google, and has accepted a canary Project
invitation; production Task Discussion and Project-room receiving was observed
on dpl3r7. These controlled-account checks do not constitute a human study or
complete lifecycle proof. Current production receiving details are archived in
workspace evidence commit `de6f6fe5b85c5578f00dd5386be1f41fe0f2323c`. A real
next-day return and 24–48-hour elapsed-use observation remains pending. Email
delivery was unavailable in the earlier development invitation rehearsal; no
email was sent in that rehearsal.

App PR #181 replaces the raw database-artifact workflow with encrypted custody.
The old workflow remains disabled. Backup-only run `35802251897` at current main
uploaded only encrypted data and a sanitized receipt. Independent download,
decryption, and fresh local restore passed for 25 tables and 488 rows on
September 23. A later independent five-store hosted recovery drill passed at
workspace source `fd6d10e249bf06fd698541c47427a70efc6d1ee8` in run
`35838321983`: all five restored local copies matched their recorded row hashes
and DDL, passed SQLite integrity and foreign-key checks, and runner plaintext
cleanup passed. The recovery identity was available only to the private
workspace repository's `recovery-key-custody` GitHub Actions environment on
`main`; the public App repository's Actions workflows do not receive it. This
demonstrates recovery after loss of the Windows machine/account for the
historical backups. The shared GitHub repository/account remains a trust
boundary; the drill does not prove recovery after its loss, live-provider
restore, cross-store atomicity, or a fresh quiescent cutover backup. The
historical snapshot was nonquiescent, and whether an earlier public raw artifact
was accessed before deletion remains unresolved. The private delivery tracker
retains the separate evidence and limits.
