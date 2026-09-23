---
id: app-production-security-release-gates-2026-09-22
title: App security fixes are deployed; dependency and lifecycle risks remain.
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
It remains included in current main `c65cb2d5d5616b50b4988fc3ba19f1f42bad9756`,
Vercel production `dpl_9nQWBjBFavmXeiA1YpErboU2gXit`, READY with the canonical
App aliases. All security candidate CI gates passed. Live `/app/home` returns the rendered
Clerk sign-in form; the patched `/icon` route returns a PNG successfully.
Those smoke checks do not certify authenticated task workflows or the larger
production sprint. The security release changed no database or environment configuration. The post-upgrade production
dependency audit reports six remaining findings: three moderate `undici`, one
moderate `@opentelemetry/core`, one low `@babel/core`, and one low
`@ai-sdk/provider-utils`. This is not a zero-findings result.

As of 23 September, the separate production-sprint receiving Preview is App
`07ffb173b5f7904d762b051eebf52f4ef953185b`; canonical production remains at
`c65cb2d5`. The Preview is not promoted. This is a dated source and environment
readback, not a general claim that every sprint workflow is accepted.

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
comprehension cohorts to a possible wider release. Participant sessions remain
zero and controlled accounts are not human-study evidence. J13 attention is
still in progress under private workspace issue #31, and the required Drive
lifecycle is still in progress under issue #32. Neither feature is included in
the accepted `07ff` Preview, and neither is deployed to production. Direct
messages remain disabled. Refresh this source pin and these statuses only when
the final integrated candidate has exact-source receiving evidence; do not
infer completion or deployment from an implementation branch.

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
