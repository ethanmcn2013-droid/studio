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

Conversation export/erasure fixes are in the separate integration candidate;
they are not yet deployed or accepted as a complete remote lifecycle. Direct messages remain
deferred and off. No live privacy approval or completed export/erasure proof is
claimed here. Treat those as separate integration gates and require evidence
before enabling the affected data path.

App PR #181 replaces the raw database-artifact workflow with encrypted custody.
The old workflow remains disabled. Backup-only run `35802251897` at current main
uploaded only encrypted data and a sanitized receipt. Independent download,
decryption, and fresh local restore passed for 25 tables and 488 rows on
September 23. This does not establish independent recovery-key escrow or resolve
whether an earlier public raw artifact was accessed before its deletion. The
private delivery tracker retains those separate risks and their evidence.
