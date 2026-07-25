---
id: premium-auth-providers
title: Finish production social sign-in verification and brand alignment
status: open
priority: P1
blocking: false
phase: Premium Programme Phase 2
why: Google is enabled, but the independent-account flow and dashboard allowlist still need owner access; GitHub and Apple are disabled.
href: /hq/decisions
date: 2026-07-25
---

## Evidence from 25 July 2026

No secret, provider credential, client secret, token, or private account value
was read or recorded.

| Provider | Release status | Production evidence | Remaining owner action |
| --- | --- | --- | --- |
| Google | enabled but failing the verification gate | The production Clerk environment lists Google as authenticatable. Google appears on `app.signalstudio.ie/sign-in` and `/sign-up`. Initiation reaches Google's identity screen through the custom Clerk callback host. | Use an independent Google account to complete sign-up and sign-in, then link and unlink Google on an existing password account. Confirm return to `app.signalstudio.ie`. |
| GitHub | disabled | GitHub is absent from the production Clerk social-provider configuration and both auth surfaces. | Enable identity-only GitHub in Clerk. Do not grant repository scopes. Add `oauth_github` to `NEXT_PUBLIC_CLERK_SOCIAL_PROVIDERS` in the consolidated app and redeploy so account linking matches Clerk. Run the same production flow. |
| Apple | disabled | Apple is absent from the production Clerk social-provider configuration and both auth surfaces. | Create or confirm the Apple Developer team and Services ID, then enable Apple in Clerk. Add `oauth_apple` to the consolidated app provider env and redeploy. Run the same production flow. |

Google's initiation passed. It is not marked enabled and verified because no
independent account was available to finish the provider round trip.

The production Clerk display configuration still names the application
"Tasks". The code and route contract now define one application, Signal
Studio, containing Signal Notes, Signal Tasks, Signal Timeline, and Signal.
Rename the Clerk application to **Signal Studio** and review the hosted Account
Portal labels so auth does not imply a separate Tasks app.

The connected browser session was not signed into the Clerk dashboard, so the
dashboard's exact origin/redirect allowlist could not be read. The live
`app.signalstudio.ie` components and Google initiation prove the app origin is
accepted for the start of the flow; they do not prove the final return or every
dashboard entry.

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

1. Clerk dashboard -> production instance. Rename application from Tasks to
   Signal Studio.
2. Confirm the exact allowed origin and redirect configuration includes the
   consolidated app and the custom Clerk domain. Do not paste credentials into
   chat.
3. Finish the independent Google matrix: sign-up, sign-in, link, unlink, and
   attempt to remove the last method.
4. Enable GitHub with identity-only scopes and complete the matrix.
5. Enable Apple only after the Apple Developer team and Services ID exist.
6. Update the consolidated app's public provider list when each provider is
   enabled, redeploy, and repeat the matrix.
7. Mark a provider enabled and verified only when the complete independent
   production round trip passes.
