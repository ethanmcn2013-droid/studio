---
id: notes-preview-sso-bypass
title: Add a Protection Bypass secret so Notes previews can be rendered by automation
status: open
priority: P1
blocking: false
phase: Phase 1
why: Notes previews build fine but Vercel SSO (deployment protection) walls the URL, so the review connector/agent can't render or screenshot them for verification.
href: /hq/health
date: 2026-07-01
---

## Context

Notes has `ssoProtection: all_except_custom_domains` and no protection-bypass
secret. Preview DBs are now wired (see [[staging-turso-db]]) so the build is
healthy — the only remaining block is the SSO wall on the preview URL. Not
changing the protection config via a guessed API call on a live project; this
is a small, safe dashboard action.

## Steps

1. Vercel -> **notes** project -> Settings -> **Deployment Protection**.
2. Under **Protection Bypass for Automation**, **Add Secret** (generates
   `VERCEL_AUTOMATION_BYPASS_SECRET`). Do not disable SSO wholesale — the bypass
   secret is the safer route.
3. Hand the secret to the reviewing agent. It fetches previews with header
   `x-vercel-protection-bypass: <secret>` (or query
   `?x-vercel-protection-bypass=<secret>&x-vercel-set-bypass-cookie=true`).

Same fix applies to any other product whose previews an agent must render
remotely; tasks/roadmap/analytics have the same SSO default.
