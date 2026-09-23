---
id: app-production-security-release-gates-2026-09-22
title: App security patch and database migrations are deployed; runtime gates remain.
category: Infrastructure
likelihood: Medium
impact: High
status: Needs attention
owner: Ethan
reviewDate: 2026-09-23
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
At that earlier checkpoint it was included in main
`c65cb2d5d5616b50b4988fc3ba19f1f42bad9756` and production
`dpl_9nQWBjBFavmXeiA1YpErboU2gXit`. That deployment is historical: production
has since resumed on main `c0573fdbcb6e8eb938f6754143c57d289eeb3ccd` and
deployment `dpl_51aShrWTDHpVxNxBkGza1VSHWeC5`. The earlier `/app/home` and
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
it for that candidate scope. Production has since resumed at App main
`c0573fdbcb6e8eb938f6754143c57d289eeb3ccd`, deployment
`dpl_65msoCrXoErhwZRMr47cfn9ekTSb`, at 19:43:45 UTC on 23 September. Main is
tree-identical to the accepted candidate. All six production aliases resolve
to this deployment. Notes migration `0001`, Timeline adoption `0001`, and
Tasks migrations `0028`–`0038` are applied and current; original rows were
preserved, integrity and foreign-key checks passed, and an actual second-run
no-op passed. The migration bytes match the reviewed candidate source. Tasks
workflow run `35909383620` and post-migration drift check `35909894779` passed.
The fresh 19:17 backup restored locally, and the encrypted artifact passed
private release download and decryption verification. This is a production
schema and backup checkpoint, not completion of all runtime gates.

The founder's existing production Tasks board (11 tasks) and Timeline (four
milestones) were read after resume. Three intended cron schedules were
restored and read back. The same c057 main revision is now promoted to
deployment `dpl_51aShrWTDHpVxNxBkGza1VSHWeC5`; all six aliases resolve to it and
Standard Protection covers 24 generated hosts and 48 scoped path checks; the
three intended cron schedules are enabled. Founder-only
messaging and Drive are activated. Drive receiving includes the limited
`drive.file` consent, canonical callback, connected-account UI, Project-folder
setup, exact 88-byte native fallback download, and exact 87-byte Drive UI and
download match. The download-event wait timed out and was reconciled without
resubmission. Unlisted signup and wrong-account invitation were refused; a
limited one-day test invitation was issued. These are not positive second-user
Drive access or lifecycle proof. Messaging was exercised by the founder in
separate controlled Task Discussion and Project-room journeys, not by two
independent production actors. A second controlled actor is now registered,
Google-verified, and has accepted a canary Project invitation with read-only
Tasks access observed; the conversation allowlist configuration is still
underway and has not been deployed. Direct messages, external delivery, and
four repair-only flags remain off. Public launch is not claimed. The Drive
resource UI showed the uploader as “Someone” on both files; this is a minor
unresolved display label, not identity or authorization evidence. The earlier
`prod migrations current` failure at Tasks `0027` is historical and superseded
by the successful c057 migration and drift receipts above. A real
next-day/24–48-hour elapsed-use observation remains outstanding.

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
attention packet was accepted at Preview source `96df1e1c`. Production
messaging is currently founder-only; direct messages and external delivery are
disabled. The controlled second actor's conversation allowlist update has not
yet been deployed, so no independent two-actor production conversation proof
is claimed.

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

The #32 acceptance remains the bounded Drive lifecycle proof on isolated
Preview; it does not establish complete production Drive lifecycle readiness.
Production now serves App main `c0573fdbcb6e8eb938f6754143c57d289eeb3ccd`
with Notes `0001`, Timeline adoption `0001`, and Tasks `0028`–`0038` applied.
Founder-only Drive is activated with the limited consent and file-receiving
checks above. Positive member access/removal, reconnect, and lifecycle proof
remain outstanding. A controlled second actor has registered, verified Google,
and accepted a canary Project invitation; this does not replace Drive member
authorization checks. Current production receiving details are archived in
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
