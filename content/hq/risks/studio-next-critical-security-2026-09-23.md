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

The candidate has passed local typecheck, tests, production build, and lint. The final-lock `pnpm audit --prod` still reports 3 high, 12 moderate, and 6 low advisories: high advisories in Browserslist (2) and `ws` (1); moderate advisories in `baseline-browser-mapping`, DOMPurify, Mermaid, and `ws`; low advisories in `@babel/core`, DOMPurify, and Mermaid. These findings are not cleared by this framework update. The budget check also remains unverified because the required webVitals, authenticated, data, and accessibility inputs are absent from this checkout. Production release remains pending final CI and rendered verification.

## Candidate security exception

`pnpm-workspace.yaml` contains exact-version minimum-release-age exceptions for Next.js 16.3.6 and its required Next family packages. Remove each exception once that exact version has aged past the effective policy. No wildcard exception is present.

## Source

- [Next.js security update, 2026-09-22](https://nextjs.org/blog/nextjs-security-update-september-22-2026)
- [GHSA-vcvr-r3jv-pc5j](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j)
