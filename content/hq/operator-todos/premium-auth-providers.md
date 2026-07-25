---
id: premium-auth-providers
title: Finish production social sign-in verification and brand alignment
status: open
priority: P1
blocking: false
phase: Premium Programme Phase 2
why: Google and the production domain configuration are in place; the independent-account safety matrix remains founder-only. GitHub and Apple intentionally stay separate and disabled.
href: /hq/decisions
date: 2026-07-25
---

## Evidence from 25 July 2026

No secret, provider credential, client secret, token, or private account value
was read or recorded.

| Provider | Release status | Production evidence | Remaining owner action |
| --- | --- | --- | --- |
| Google | enabled, configuration confirmed; independent flow pending | The production Clerk environment lists Google as authenticatable with the custom production callback host. Google appears on the app auth surfaces. | With an independent Google account, complete sign-up, sign-in, link, unlink, and attempted last-method removal. Confirm every successful return lands on `app.signalstudio.ie`. |
| GitHub | intentionally disabled | GitHub is absent from the production Clerk social-provider configuration and both auth surfaces. | None for this release. Keep separate until the founder deliberately starts a GitHub provider release. |
| Apple | intentionally disabled | Apple is absent from the production Clerk social-provider configuration and both auth surfaces. | None for this release. Keep separate until the founder deliberately starts an Apple provider release. |

Google's initiation passed. It is not marked enabled and verified because no
independent account was available to finish the provider round trip.

The production Clerk application now names the application **Signal Studio**.
The dashboard configuration was reviewed without recording provider
credentials, client secrets, tokens, or private account values:

- the primary `signalstudio.ie` production domain is verified and has SSL;
- allowed subdomains are enabled for `app.signalstudio.ie` and the temporary
  compatibility/service host `tasks.signalstudio.ie`;
- the application Home URL is `https://app.signalstudio.ie/app`;
- Clerk's hosted Account Portal remains the sign-in, sign-up, sign-out, and
  OAuth-consent surface;
- Google uses the configured custom production callback host.

This confirms the production domain and return configuration. It does not
replace the independent-account round-trip test.

## Product protection

The consolidated app release:

- offers only providers mirrored in
  `NEXT_PUBLIC_CLERK_SOCIAL_PROVIDERS` (Google by default);
- stops presenting disabled GitHub and Apple connect actions;
- blocks disconnecting the only sign-in method until another method exists;
- keeps provider errors inside account settings.

Linking, unlinking, and the last-method path remain production-unverified until
the owner completes an authenticated account smoke test.

## Owner steps

1. Finish the independent Google matrix: sign-up, sign-in, link, unlink, and
   attempt to remove the last method.
2. Keep GitHub and Apple disabled and separate for this release.
3. Mark Google fully verified only when the complete independent
   production round trip passes.
