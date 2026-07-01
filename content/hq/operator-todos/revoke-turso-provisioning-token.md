---
id: revoke-turso-provisioning-token
title: Revoke the Turso Platform API token used for preview-DB provisioning
status: open
priority: P1
blocking: false
phase: Phase 1
why: A full-org-control Turso Platform token was pasted into a chat transcript to provision preview DBs. It is still live (verified HTTP 200, 2026-07-01) and grants create/delete + token-minting across the whole Turso org.
href: /hq/health
date: 2026-07-01
---

## Context

Provisioning the six isolated preview Turso databases ([[staging-turso-db]])
required a Turso **Platform API token** (org-wide create/delete + auth-token
minting). It was pasted into a session transcript to do the work. **Nothing
depends on it now** — each preview DB's own auth token lives in Vercel — so the
platform token should be revoked as clean-up. Confirmed still valid on
2026-07-01.

## Steps

1. Turso dashboard -> Account -> **API Tokens**.
2. Revoke the provisioning token (created 2026-07-01, e.g. named
   `signal-preview-provisioning`).
3. Sanity-check: trigger a preview deploy afterwards and confirm it still
   builds — previews read the per-DB tokens from Vercel, not this platform
   token, so nothing should break.
