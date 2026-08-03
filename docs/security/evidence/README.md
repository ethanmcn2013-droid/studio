# Security evidence index

This directory links implementation and verification receipts. A control is not considered implemented until the corresponding evidence is present and the control register is updated.

## Current receipts

- Signal Tasks deep scan manifest and canonical report: `C:\Users\ethan\AppData\Local\Temp\codex-security-scans\tasks\498128c_20260716-175546\scan-manifest.json`, `report.md`.
- Signal Tasks automated verification: `C:\Users\ethan\signal-studio-workspace\tasks\src\server\security-remediation.test.mjs`; `pnpm test` passed on 2026-07-16.
- Signal Tasks type/build verification: `tsc --noEmit --incremental false` and `next build` passed on 2026-07-16.
- Signal Tasks attachment/export remediation: commit `def8144`; fix report at `C:\Users\ethan\AppData\Local\Temp\codex-security-scans\tasks\498128c_20260716-175546\artifacts\fix_report.md`. Full tests, lint, typecheck and production build passed on 2026-07-16.
- Signal Tasks onboarding/digest authorization: commit `f4bd02d`; owner-gated workspace onboarding and fresh membership binding for daily/weekly digest selectors. Full tests, lint, typecheck and production build passed on 2026-07-16.
- Signal Tasks export/telemetry redaction: commit `0dc6da7`; two-tenant export test, bounded CSP reader tests and stable-error regression checks. Full tests, lint, typecheck and production build passed on 2026-07-16.
- Signal Tasks abuse controls: commit `d64d5d5`; production fail-closed limiter behavior, bounded allowlisted analytics and mailbox-only rate-limited student code delivery. Full tests, lint, typecheck and production build passed on 2026-07-16.

## Still required before procurement claims

Provider-console MFA/passkey and environment-separation evidence, restore/RPO/RTO receipt, production alert delivery, legal DPA/school review, security.txt/mailbox, tabletop exercise and independent authenticated penetration-test/retest remain open. Do not infer these controls from source code or a green local build.
