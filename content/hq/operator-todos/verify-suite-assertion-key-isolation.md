---
id: verify-suite-assertion-key-isolation
title: Provision isolated assertion keys and replay storage for cross-product calls
status: open
priority: P0
blocking: true
phase: Phase 1
why: Signed assertions remove body impersonation, but one shared HMAC secret still leaves a fleet-wide blast radius and JTI replay is not persisted.
href: /hq/platform-readiness
date: 2026-07-11
---

## Steps

1. Inventory every caller of the Studio Today and Tasks Notes-extract endpoints.
2. Provision caller-specific credentials or an asymmetric signing arrangement with a key ID and rotation path.
3. Store and expire assertion JTIs or use a durable idempotency record at each mutation boundary.
4. Rotate the legacy shared secrets after all callers pass shadow verification.
5. Run wrong-audience, cross-caller, replay, expiry, and key-rotation tests.
6. Attach redacted provider and production receipts to `SS-P1-004`.
