# Signal Studio iOS — submission artifacts

This folder holds App Store submission artifacts drafted at the umbrella layer. The iOS app itself lives in `~/Projects/personal/signal-ios/`. These docs live in the studio repo because the umbrella owns suite-wide brand, voice, and privacy posture — and the App Store submission speaks for the suite, not just for one product.

## Files

| File                           | What it is                                                                                                |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `data-flow.md`                 | What data the app collects, where it goes, who sees it. Source for the App Privacy nutrition label.        |
| `privacy-labels.md`            | App Store Connect "App Privacy" disclosure matrix. Maps `data-flow.md` to Apple's 14 data-type taxonomy.   |
| `privacyinfo-xcprivacy.md`     | `PrivacyInfo.xcprivacy` manifest template — required for iOS 17+ submissions. Declares required-reason APIs and third-party SDK manifests. |
| `listing.md`                   | App Store listing copy — name, subtitle, keywords, description, "What's New" template. Passes through `signal-brand-voice` before submission. |
| `apple-signin-runbook.md`      | Operator-side runbook for enabling Sign in with Apple. Apple Developer Portal → Clerk Dashboard → verification. Pairs with `../../scripts/verify-clerk-apple.mjs`. |
| `auth-bridge.md`               | Native iOS auth-bridge specification — Clerk-iOS SDK wire-up plan, Bearer-token pattern, Vercel-side audit checklist. |

## Status

All six files in this folder are **drafts** at the umbrella-decision layer. They are not submission-ready until two upstream items ship in Bucket B:

- **Item 2 — account deletion (per-product `/api/account/delete` + Settings UI)** — required for App Store 5.1.1(v) compliance. `data-flow.md` and `listing.md` both reference deletion as a feature; both must agree with shipped reality before submission.
- **Item 3 — Sign in with Apple via Clerk** — required by App Review 4.8 if any social login is shown (Clerk's default config shows Google). `listing.md` § Sign in with Apple names this as a submission gate.

The files translate to App Store Connect form fields when the submission window opens (post-July, per the iOS suite-app atlas entry).

Operator owns:

- App Store Connect submission itself.
- Apple-ID-gated capabilities (signing certs, provisioning profiles, push certs).
- Final voice ratification on listing copy before submission.

Agent owns:

- Keeping these files in sync with what the app actually does (when wiring changes, reflect it here).
- Drafting voice-compliant initial copy.
- Surfacing privacy-label deltas when data flows change.

## When to update

| Change in...                                | Update...                                                                                  |
| ------------------------------------------- | ------------------------------------------------------------------------------------------ |
| The iOS app's data collection or send-paths | `data-flow.md` first, then propagate to `privacy-labels.md` and `privacyinfo-xcprivacy.md` |
| The app's feature scope                     | `listing.md` description + keywords                                                        |
| A new third-party SDK                       | `privacyinfo-xcprivacy.md` + `privacy-labels.md`                                           |
| A required-reason API added                 | `privacyinfo-xcprivacy.md` `NSPrivacyAccessedAPITypes` block                               |
| A brand voice rule update                   | Re-run `signal-brand-voice` over `listing.md`                                              |
