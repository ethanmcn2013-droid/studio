---
id: studio-next-critical-security-2026-09-23
title: Studio's deployed Next.js version is in the affected range for a critical ImageResponse issue
category: Product
severity: Critical
likelihood: Possible
status: Needs attention
owner: Ethan
reviewDate: 2026-09-23
relatedObjects: [Studio production deployment bd878b7f, Next.js GHSA-vcvr-r3jv-pc5j, fix/studio-critical-next-2026-09-23]
---

## Current state

Studio production is sourced from `main` at `bd878b7f` and uses Next.js 16.2.5. The 2026-09-22 Next.js security update identifies versions `>=16.2.0 <16.3.6` as affected when Node-runtime `ImageResponse` processes attacker-controlled SVG content, attributes, or styles. Next.js 16.3.6 contains the fix. The affected dependency version is present in production; this does not by itself demonstrate that Studio exposes attacker-controlled input to the vulnerable path.

The candidate branch `fix/studio-critical-next-2026-09-23` pins `next` and `eslint-config-next` to 16.3.6. Source inspection found five `ImageResponse` routes: four Node-runtime routes and one Edge-runtime route. Each currently renders local static JSX; the reviewed values are constants and no request-derived values were found. This review did not demonstrate an attacker-controlled path, exploitability, or compromise.

The candidate pins Browserslist to 4.28.8 and `ws` to 8.21.3, covering GHSA-c83g-rgw3-j3cx, GHSA-73wf-gq98-2v4g, and GHSA-96hv-2xvq-fx4p. Remove these two exact overrides when their consumers no longer resolve an affected version. The post-override `pnpm audit --prod` reports zero high and zero critical advisories; 11 moderate and 6 low advisories remain in `baseline-browser-mapping`, DOMPurify, Mermaid, and `@babel/core`. These residual findings were not broadened into this patch.

The candidate also fixes navigation in the private brand-guidelines review page. Deferred intrinsic chapter sizing allowed distant chapter geometry to change during a jump, and the pending initial-fragment scroll could supersede a user click. Chapter geometry is now stable and the pending initial scroll is canceled by explicit navigation. The regression test waits for the target chapter to remain within 4px of its 0px or 20px anchor position for 750ms, then checks the hash and active rail item across chapter clicks and browser Back/Forward.

At commit `12211099`, local typecheck, unit tests, build, and lint passed. At the current candidate, typecheck, unit tests, build, targeted ESLint, the full Playwright suite (55/55), and six repeated chapter-navigation runs passed. The budget check remains unverified because the required webVitals, authenticated, data, and accessibility inputs are absent from this checkout. Production release remains pending final CI and rendered verification.

## Candidate security exception

`pnpm-workspace.yaml` contains exact-version minimum-release-age exceptions for Next.js 16.3.6 and its required Next family packages. Remove each exception once that exact version has aged past the effective policy. No wildcard exception is present.

## Source

- [Next.js security update, 2026-09-22](https://nextjs.org/blog/nextjs-security-update-september-22-2026)
- [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j)
