# January dependency maintenance — 4 September 2026

Observed candidate production-install audit before and after targeted remediation. These counts do not describe main or production, and a clear package audit is not a complete security certification.

- mermaid 11.15.0 → exactly 11.16.1, the smallest published patch target for the identified Mermaid findings. Atlas dynamically imports it on pages containing diagrams.
- dompurify 3.4.3 → 3.4.13 inside Mermaid. The current Atlas input is checked-in Markdown, so advisory presence does not itself demonstrate an untrusted-input exploit.
- @babel/core 7.29.0 → 7.29.6 through the Next/styled-jsx graph; primarily compilation exposure.

Bounded overrides cover only affected major/ranges. Remove each when a verified owner update resolves patched packages without it. This avoids unrelated Sentry/Blob/framework upgrades. Lockfile changes are limited to these edges, their necessary compatible transitive dependencies and peer snapshots. No registry or lifecycle policy changes were made. Mermaid's caret initially selected a later minor during local resolution; the final direct version is pinned to 11.16.1.

## Audit receipt

Before: {"info":0,"low":6,"moderate":10,"high":0,"critical":0}.
After: {"info":0,"low":0,"moderate":0,"high":0,"critical":0}.

Commands: owning pnpm install --lockfile-only; pnpm install --frozen-lockfile; pnpm audit --prod --json. Final install and audit exited 0. See the exact JSON receipts beside this document. Deprecation notices remain; they are not suppressed. Studio retains its existing ignored esbuild lifecycle scripts.

| Advisory | Package | Audit severity |
| --- | --- | --- |
| [GHSA-hpcv-96wg-7vj8](https://github.com/advisories/GHSA-hpcv-96wg-7vj8) | dompurify | moderate |
| [GHSA-r47g-fvhr-h676](https://github.com/advisories/GHSA-r47g-fvhr-h676) | dompurify | moderate |
| [GHSA-rp9w-3fw7-7cwq](https://github.com/advisories/GHSA-rp9w-3fw7-7cwq) | dompurify | moderate |
| [GHSA-4x5r-pxfx-6jf8](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8) | @babel/core | low |
| [GHSA-c2j3-45gr-mqc4](https://github.com/advisories/GHSA-c2j3-45gr-mqc4) | dompurify | low |
| [GHSA-cmwh-pvxp-8882](https://github.com/advisories/GHSA-cmwh-pvxp-8882) | dompurify | moderate |
| [GHSA-vxr8-fq34-vvx9](https://github.com/advisories/GHSA-vxr8-fq34-vvx9) | dompurify | low |
| [GHSA-gvmj-g25r-r7wr](https://github.com/advisories/GHSA-gvmj-g25r-r7wr) | dompurify | low |
| [GHSA-x4vx-rjvf-j5p4](https://github.com/advisories/GHSA-x4vx-rjvf-j5p4) | dompurify | low |
| [GHSA-76mc-f452-cxcm](https://github.com/advisories/GHSA-76mc-f452-cxcm) | dompurify | moderate |
| [GHSA-c4c3-pg64-4m4v](https://github.com/advisories/GHSA-c4c3-pg64-4m4v) | mermaid | low |
| [GHSA-6x64-9x62-f2gx](https://github.com/advisories/GHSA-6x64-9x62-f2gx) | mermaid | moderate |
| [GHSA-3rrr-jr9j-h3q3](https://github.com/advisories/GHSA-3rrr-jr9j-h3q3) | mermaid | moderate |
| [GHSA-2v8p-3f2j-5mp7](https://github.com/advisories/GHSA-2v8p-3f2j-5mp7) | mermaid | moderate |
| [GHSA-rhh3-jpg6-66xh](https://github.com/advisories/GHSA-rhh3-jpg6-66xh) | mermaid | moderate |
| [GHSA-55q2-fjhq-7xh7](https://github.com/advisories/GHSA-55q2-fjhq-7xh7) | dompurify | moderate |

The initial Babel advisory responses disagreed about the minimum patched version; 7.29.6 satisfies both. The DOMPurify advisory API initially returned an inconsistent patched range for GHSA-x4vx-rjvf-j5p4; the final 3.4.13 audit is observed clear, without interpreting that earlier field as a waiver.

## Acceptance and rollback

Behavioral gates, build, browser rendering and receiving-branch evidence are owned by the combined candidate. Consult the final integration receipt for their exact candidate and outcomes; this audit alone does not claim them. Roll back through a reviewed revert of the dependency milestone and a frozen install, never by manually editing installed packages. Such a rollback restores the recorded advisory exposure and cannot silently qualify a release.
