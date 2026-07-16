---
id: security-programme-tasks-2026-07-16
title: Signal Tasks security programme enters evidence-backed remediation
status: active
date: 2026-07-16
owner: ethan
---

Signal Tasks completed a ten-round repository security scan at revision `498128cfa35ef479e0cf0b0792a0d87a2f7fe26d`. The canonical report contains 33 reportable findings and six deferred or conditional clusters; it is not a procurement-readiness claim.

The first remediation tranche now has code and verification evidence: destructive workspace mutations use a server-side owner boundary, pending invite listing is owner-only and omits bearer tokens, production checkout fails closed when Stripe is unavailable, authenticated calendar responses are private/no-store, the operator roadmap feed requires the operator principal, and raw workspace share-card enumeration is disabled. `pnpm test`, TypeScript checking and `next build` passed on 2026-07-16.

The second tranche at Tasks commit `def8144` root-contains attachment storage paths while preserving custom task IDs, removes internal storage and tenant identifiers from attachment responses, escapes iCalendar identifiers, and neutralizes spreadsheet formulas in CSV exports. The full Tasks test suite, lint, typecheck and production build passed; the baseline scan remains unchanged and the separate fix report records the closure evidence.

The third tranche at Tasks commit `f4bd02d` requires the workspace owner for onboarding and segment-wide mutations and binds daily/weekly digest user and workspace selectors to a current membership before compilation or delivery. The full verification gates passed again. Provider configuration and production scheduler execution remain open evidence gates.

The fourth tranche at Tasks commit `0dc6da7` prevents co-tenant notification/entitlement export, strips invite/share bearers from portability output, bounds and redacts CSP telemetry, removes comp codes from Sentry tags, and replaces raw internal error messages with stable public codes. Two-tenant and telemetry tests plus the complete test/lint/type/build gates passed. A structured security-event stream and production alert evidence remain open.

Open gates remain provider MFA/passkeys and environment separation, complete shared authorization adoption, public-link migration, security-event alerts, backup/restore measurements, legal DPA and school review, incident tabletop, security mailbox/security.txt, and independent authenticated penetration testing. Public trust claims must map to the control register and current evidence receipts.
