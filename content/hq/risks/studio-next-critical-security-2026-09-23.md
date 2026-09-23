---
id: studio-next-critical-security-2026-09-23
title: Studio's critical Next.js fix is deployed; residual dependency risks remain
category: Product
severity: Moderate
likelihood: Possible
status: Needs attention
owner: Ethan
reviewDate: 2026-09-23
relatedObjects: [Studio PR 192, Studio production commit aaf87116, Next.js GHSA-vcvr-r3jv-pc5j]
---

## Current state

Studio PR #192 is released at main `aaf871162c5e9ab7579b8fb9969f93925c5202a6`, on Next.js 16.3.6. Production deployment `dpl_A3YgyNoAx94cBCiiXBE4u6ai5iXg` is READY and owns the canonical `signalstudio.ie` aliases. The live homepage rendered successfully after release. The previous production version, 16.2.5, was within the affected range of the September 22 critical Node-runtime ImageResponse advisory. The patch addresses that version exposure; this does not demonstrate prior exploitability or compromise.

The candidate branch `fix/studio-critical-next-2026-09-23` pins `next` and `eslint-config-next` to 16.3.6. Source inspection found five `ImageResponse` routes: four Node-runtime routes and one Edge-runtime route. Each currently renders local static JSX; the reviewed values are constants and no request-derived values were found. This review did not demonstrate an attacker-controlled path, exploitability, or compromise.

The candidate pins Browserslist to 4.28.8 and `ws` to 8.21.3, covering GHSA-c83g-rgw3-j3cx, GHSA-73wf-gq98-2v4g, and GHSA-96hv-2xvq-fx4p. Remove these two exact overrides when their consumers no longer resolve an affected version. The post-override `pnpm audit --prod` reports zero high and zero critical advisories; 11 moderate and 6 low advisories remain in `baseline-browser-mapping`, DOMPurify, Mermaid, and `@babel/core`. These residual findings were not broadened into this patch.

The candidate also fixes navigation in the private brand-guidelines review page. Deferred intrinsic chapter sizing allowed distant chapter geometry to change during a jump, and the pending initial-fragment scroll could supersede a user click. Chapter geometry is now stable and the pending initial scroll is canceled by explicit navigation. The regression test waits for the target chapter to remain within 4px of its 0px or 20px anchor position for 750ms, then checks the hash and active rail item across chapter clicks and browser Back/Forward.

At commit `12211099`, local typecheck, unit tests, build, and lint passed. At final candidate `849af8c7e07aca5a7b7b90d176fc7efe8afdd036`, typecheck, unit tests, build, targeted ESLint, the full Playwright suite (55/55), and six repeated chapter-navigation runs passed. Required final CI and independent rendered preview verification passed before merge. The budget check remains unverified because the required webVitals, authenticated, data, and accessibility inputs are absent from this checkout. The protected authenticated pilot job was skipped; no human acceptance or broader product readiness is claimed by this release.

## Candidate security exception

`pnpm-workspace.yaml` contains exact-version minimum-release-age exceptions for Next.js 16.3.6 and its required Next family packages. Remove each exception once that exact version has aged past the effective policy. No wildcard exception is present.

## Source

- [Next.js security update, 2026-09-22](https://nextjs.org/blog/nextjs-security-update-september-22-2026)
- [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j)
