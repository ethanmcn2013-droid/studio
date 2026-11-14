---
id: public-free-account-access-2026-11-14
title: Open self-service free account creation for Signal Studio.
category: Access
date: 2026-11-14
status: Active
relatedObjects: [Public access, Clerk, Waitlist, Free plan]
---

## Decision

Open public sign-up and sign-in for free Signal Studio accounts. A signed-in person who creates an account receives their own personal workspace through the existing Clerk user-created provisioning path. No invitation or email allowlist is required after the explicit launch flag is opened.

This decision does not open paid checkout or grant paid entitlements. Student and Pro remain waitlist-first while eligibility, limits and purchase terms are unresolved. Enterprise remains founder-led. No outreach, customer email or paid acquisition is authorized by this access change.

## Reason

The founder directed on 2026-11-14 that anyone should be able to log in and create an account, and asked for the change to go live as soon as safely possible.

## Release conditions

- The app keeps the existing production authentication boundary and tenant-scoped data access.
- The Clerk user-created webhook provisions a separate user, personal workspace and owner membership for each new account.
- The app's public launch flag, app access gate and Clerk sign-up mode must be opened together. If rollback is needed, close Clerk sign-up and restore the app flag to `pre`; retain the email allowlist configuration.
- The umbrella site offers account creation and sign-in. Student, Pro and programme waitlists remain available where their separate terms still apply.

## Limits

This is public free account creation, not a paid commercial launch, paid feature trial, claim that all launch-readiness gates have passed, or authorization for outbound promotion.
