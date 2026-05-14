---
id: settings-roll-our-own
title: Roll our own bespoke Settings surface in Tasks — Profile, What we send you, Your plan — instead of theming Cle…
category: Product
date: 2026-05-13
status: Active
reviewDate: 2026-06-13
relatedObjects: [Signal Tasks, Signal Roadmap, Signal Notes, Signal Analytics]
---

## Decision

Roll our own bespoke Settings surface in Tasks — Profile, What we send you, Your plan — instead of theming Clerk's `<UserProfile/>`.

## Reason

Settings is a high-frequency touchpoint where a borrowed UI undercuts the brand. Voice rules ('Account' → never, 'Subscription' → 'Your plan', no project-manager register) cannot be applied through Clerk theming alone. Tasks ships first; Roadmap, Notes, Analytics inherit the chassis as separate later cycles.

## Alternatives considered

Theme `<UserProfile/>` (hybrid: Clerk for Profile, ours for Notifications + Plan); use Clerk as-is.

## Risks

Auth UX is the highest-stakes UX in the app — email change, 2FA setup, and password change have edge cases (race conditions, expired codes) that Clerk's component handles natively. We mitigate by leaning on Clerk's frontend SDK in client modals (bespoke chrome, Clerk handles the verification primitives) but the surface area is still real. Opportunity cost: ~2-3 weeks of settings work is not Lamb's Hill outreach, Notes 9.3, or Sprint 2 10.7.

## Notes

Cycle 9.1a shipped 2026-05-13 — full chassis + Profile (name, avatar, email change, password, 2FA with QR + recovery codes, sessions, OAuth, danger zone as mailto) + Notifications (new user_preferences table + drizzle/0002 migration + autosave form) + Plan (Lamb's-Hill-aware comp prose + Stripe Customer Portal link for paid tiers). UserButton 'Manage account' now routes through /settings/profile. Operator actions before this is fully usable in prod: (1) apply drizzle/0002_user_preferences.sql to prod Turso Tasks DB, (2) verify Clerk dashboard has TOTP enabled if 2FA is meant to be a path users can take. The 'revisit hybrid' trigger from the plan doc: if a pilot user hits an email-change race condition or Plan 8.6/9 work starts feeling urgent while settings is still half-built, revisit. Pride costs less than two extra weeks.
