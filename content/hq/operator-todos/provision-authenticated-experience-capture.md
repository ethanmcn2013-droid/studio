---
id: provision-authenticated-experience-capture
title: Provision authenticated experience capture access
status: open
priority: P0
blocking: true
phase: Experience Quality OS · Authenticated evidence
why: Critical and core signed-in routes cannot receive complete deterministic evidence without controlled target environments, fixture identities, and secrets that agents must not invent or commit.
href: /hq/experience-quality
date: 2026-07-15
action: "Provision dedicated capture identities and place their target URLs and least-privilege secrets in the approved CI or credential store."
product: "Tasks, Timeline, Signal, Notes, Studio and Signal HQ"
recommended: "Use isolated non-personal fixture accounts in production-equivalent environments, one documented reset path per product, least-privilege access, and secrets available only to the protected capture job."
alternatives: ["Use dedicated production fixture accounts where staging cannot reproduce behavior", "Approve a narrower authenticated critical-route pilot before expanding", "Keep authenticated capture blocked and prohibit complete-coverage claims"]
default: "Public/local pilot capture may continue, but authenticated critical/core coverage remains blocked and strict cross-product capture enforcement stays off."
consequence: "Without controlled access, HQ must report authenticated state coverage as blocked or incomplete rather than inferring it from source code or public demos."
trigger: "Before authenticated critical/core routes, restricted states, invitations, settings, billing, or private HQ evidence are required for release certification."
links: ["../../../experience/capture-plan.json", "../../../docs/experience/VISUAL_BASELINE_PROCESS.md", "../../../docs/experience/DESIGN_QUALITY_CI.md", "verify-clerk-prod-env.md", "closed-beta-allowlist-env.md"]
---

## Steps

1. Confirm the exact authenticated critical/core route and state inventory for Tasks, Timeline, Signal, Notes, Studio, and Signal HQ. Signal Review remains a local founder-operator instrument and must not receive customer credentials.
2. Choose controlled production-equivalent targets. Where only production can reproduce behavior, create clearly named fixture accounts with no personal or customer data and the minimum entitlements needed.
3. Store credentials in the approved CI/credential manager. Set product base URLs through the documented `EXPERIENCE_BASE_URL_<PRODUCT>` variables. Never paste a secret into Markdown, chat, screenshots, fixtures, logs, or committed environment files.
4. Document seed/reset behavior so every capture starts from a known identity, workspace, state, locale, and data shape.
5. Run a narrow authenticated capture first. Verify login/session setup, redirects, consent, data isolation, screenshot redaction, runtime output, and teardown before expanding coverage.
6. Attach the successful protected-job evidence and mark only the covered experiences unblocked. Keep any unavailable route/state explicitly blocked.
7. Turn on strict capture enforcement only after the standard is approved, baselines exist, retries/ownership are defined, and the protected job is stable.

## Done when

Every in-scope authenticated experience has a controlled target, dedicated fixture identity, protected secret, deterministic seed/reset path, successful evidence run, and no personal or customer data exposure.
