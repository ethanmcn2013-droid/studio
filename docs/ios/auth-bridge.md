# Native iOS auth bridge

The 2026-05-19 iOS research memo flagged a WKWebView Clerk cookie trap. That risk is **obsolete** for this build: the operator chose native SwiftUI (Cycles 0–5 shipped) and there is no WKWebView in the suite app. This file is the **specification** for the native auth bridge that will replace it — not a description of currently-shipped code.

As of 2026-05-20 the signal-ios target has no Clerk integration. `SignalStudio/App/SignalStudioApp.swift` opens directly to `RootView()` with no auth gate. This document is the design that the Bucket B follow-up cycle will implement.

## What changed since the memo

| The 2026-05-19 memo assumed       | Capacitor remote-URL WKWebView wrapping the Vercel apps.                                  |
| What actually shipped             | Native SwiftUI suite app. No WKWebView. No 3rd-party-cookie problem.                       |
| Replacement problem to solve      | Native sign-in flow that obtains a Clerk session JWT and propagates it via Bearer headers to per-product API calls. |
| Replacement work owner            | Bucket B follow-up cycle (Clerk-iOS SDK wire-up) — not yet started.                       |

## The constraint

The four product backends (Tasks, Roadmap, Analytics, Notes) use Clerk middleware on Next.js. Their authed surfaces today rely on Clerk's `HttpOnly` cookie. Native iOS can't read `HttpOnly` cookies — so the native app needs Bearer-token auth: present `Authorization: Bearer <Clerk JWT>` on every API call.

## The Clerk-iOS SDK

Clerk publishes a native iOS SDK at `github.com/clerk/clerk-ios` (Swift Package Manager). The package splits into two products:

| Product       | Purpose                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `ClerkKit`    | Core observable state. Singleton `Clerk.shared`. Session vending, token vending, sign-out.       |
| `ClerkKitUI`  | SwiftUI primitives — `AuthView` (sign-in + sign-up + verification + MFA), `UserButton`, `UserProfileView`. |

`AuthView` is the load-bearing primitive — render it as the gate before `RootView()` and it handles email + password, social providers (Apple, Google, Microsoft, GitHub), magic links, MFA. Replaces the Clerk-Hosted sign-in page used by the Vercel apps today.

> Note: API surface evolves. Verify the SDK version (`Package.resolved`) names this layout before relying on the snippets below.

## The planned wiring

1. **Add the package** in Xcode: File → Add Packages → `https://github.com/clerk/clerk-ios.git`. Pin a tagged version. Add `ClerkKit` and `ClerkKitUI` as target dependencies in `project.yml`.

2. **Configure** in `SignalStudioApp.swift`:

   ```swift
   import ClerkKit
   import ClerkKitUI

   @main
   struct SignalStudioApp: App {
       @State private var clerk = Clerk.shared

       init() {
           clerk.configure(publishableKey: "pk_live_…")
       }

       var body: some Scene {
           WindowGroup {
               Group {
                   if clerk.isSignedIn {
                       RootView()
                   } else {
                       AuthView()
                   }
               }
               .environmentObject(clerk)
           }
       }
   }
   ```

3. **API call pattern** — for every authed call from the native app:

   ```swift
   guard let token = try await Clerk.shared.session?.getToken() else {
       throw AuthError.notSignedIn
   }

   var request = URLRequest(url: url)
   request.setValue("Bearer \(token.jwt)", forHTTPHeaderField: "Authorization")
   ```

   Tokens have a ~60-second TTL and refresh automatically through the SDK.

## Vercel-side audit — must run before submission

Clerk's `auth()` helper from `@clerk/nextjs/server` checks both cookies and `Authorization: Bearer` headers transparently. So in principle no backend changes are needed. In practice, any route handler that reads the cookie directly (rather than going through `auth()`) will break for native callers.

Run this audit in each of the four product repos:

```bash
for repo in tasks roadmap analytics notes; do
  echo "=== $repo — direct cookie reads in API routes ==="
  grep -rn "cookies()" ~/Projects/personal/$repo/src/app/api/ 2>/dev/null
  echo "=== $repo — middleware short-circuits on missing cookie ==="
  grep -rn "__session\|__clerk_db_jwt" ~/Projects/personal/$repo/src/ 2>/dev/null
done
```

Every hit needs to refactor to `auth()` before iOS launch. Track the list per product in CHANGELOG.md.

Additional config to confirm in the Clerk Dashboard before iOS submission:

- **Sessions → Mobile** — enable mobile-app session support.
- **Social Connections → Apple** — enable for App Review 4.8 compliance (Item 3 of this prep cycle).
- **One Clerk application across the four products** — currently **assumption, not verified**. The suite-consolidation memory (2026-05-17) records that Clerk-unify is conditional-yes-not-built. If each product runs against its own Clerk instance today, the native app can only carry one session — operator must consolidate before native auth ships, or accept that the iOS app exposes only one of the four products in v1.

## What lives in the keychain

| Item                   | Stored where                | Lifetime               |
| ---------------------- | --------------------------- | ---------------------- |
| Clerk session ID       | iOS keychain (Clerk SDK)    | Until sign-out / delete |
| Clerk session JWT      | In-memory (1-minute TTL)    | Per-call refresh       |
| Refresh token          | iOS keychain (Clerk SDK)    | Until sign-out / delete |
| Device biometric flag  | UserDefaults                | Per-device             |

No user-content secrets are kept in the keychain. Notes and Tasks content lives in the per-product Turso DBs and is fetched fresh each session.

## Sign in with Apple (related Item 3)

Required by App Review 4.8 whenever any third-party social login is shown. Clerk-iOS supports Apple natively — enabling it is a Clerk Dashboard toggle (operator action) plus declaring `AuthenticationServices` capability in `project.yml`. Once enabled, `AuthView` renders Apple alongside Google.

The App Store listing's sign-in screenshot must show Apple. See `listing.md` § Sign in with Apple — gate, not option.

## Account deletion (related Item 2)

The planned native account-deletion flow:

1. Settings → Delete account → confirm dialog (type "DELETE" or your email).
2. Native app calls per-product `POST /api/account/delete` (defined in Item 2) with Bearer token.
3. Each product's backend purges all user-keyed Turso rows in a transaction.
4. Server calls Clerk admin `users.deleteUser(userId)`.
5. Native app receives 200, clears local `Clerk.shared` state, returns to `AuthView`.

Clerk's webhook `user.deleted` event fires server-side and can be used as a backup cleanup signal — but the primary purge happens synchronously in the flow above so App Review can verify deletion is in-app and immediate (5.1.1(v)).

## What we are NOT doing

- **No custom Clerk JWT issuance.** The Clerk-iOS SDK manages tokens; the backends decode them.
- **No third-party identity SDK** (no Firebase Auth, no Auth0, no SuperTokens). Clerk is the single identity provider per the iOS research memo refusal.
- **No biometric gating on app launch as v1.** Face ID / Touch ID can wrap sign-in later as an additional cycle; not in initial submission.
- **No offline sign-in.** Network required to validate session on cold launch.

## When this file changes

| Trigger                                                       | Update                                                                                  |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Clerk-iOS SDK API surface changes (SDK version bump)            | Code snippets in this file + actual Swift code in `signal-ios/Auth/`.                   |
| The Bucket B follow-up cycle wires Clerk in `SignalStudioApp.swift` | Change every "planned" / "will be" / "specification" tense to present-tense fact. Update `data-flow.md` and `listing.md` in the same cycle. |
| A backend route handler is added that reads cookies directly  | Add the route to the audit list above; refactor to use `auth()`.                       |
| A new social provider is enabled in Clerk dashboard           | App Store listing screenshot stack + this file's "Sign in with Apple" paragraph.        |
| Token TTL changes upstream from Clerk                          | The per-call `getToken()` snippet; consider whether to cache the JWT for short windows. |
| Clerk unify confirmed in Dashboard                            | Remove the "assumption, not verified" caveat in the Vercel-side audit section.          |

## Reverification

| Date       | What changed                                                                                  | Updater                |
| ---------- | --------------------------------------------------------------------------------------------- | ---------------------- |
| 2026-05-20 | Initial draft. Replaced obsolete WKWebView cookie-trap concern from the 2026-05-19 memo.       | Agentic iOS prep cycle |
| 2026-05-20 | Panel review: tense correction throughout (spec, not shipped) since no Clerk code exists in repo; named the package split (ClerkKit + ClerkKitUI) and `AuthView` (not `SignInView`); replaced "audit before submission" with the concrete grep; flagged the one-Clerk-app assumption as pending verification. | Agentic iOS prep cycle |
