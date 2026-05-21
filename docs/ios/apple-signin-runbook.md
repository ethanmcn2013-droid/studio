# Sign in with Apple — operator runbook

App Review 4.8 mandates Sign in with Apple alongside any third-party social login. Clerk's default config in the four product apps already exposes Google, so this is a **submission gate** — not configuring it before iOS launch will reject the entire suite app.

This runbook is the operator path. The work is dashboard-only (Apple Developer Portal + per-product Clerk Dashboard); the agent side has nothing to do until the dashboards are configured. Once Apple is enabled in Clerk, the existing `<SignIn />` component in each product's sign-in page renders the Apple button automatically — no code change needed.

## Pre-flight

- Apple Developer Program membership active ($99/year — required, see iOS suite-app atlas).
- Operator has Clerk Dashboard access for all four product Clerk instances (Tasks, Roadmap, Analytics, Notes).
- Decision recorded in `auth-bridge.md` § Vercel-side audit: whether the four products share one Clerk application or each runs its own.
  - **If one shared instance:** the Apple config below is done once, applied to all four sign-in surfaces.
  - **If four separate instances:** Apple config is done four times, once per Clerk app. The runbook below repeats per product.

## Step 1 — Apple Developer Portal

Apple's identity provider has its own provisioning surface. Once per Clerk app (or once total if you have one shared Clerk app), do the following at <https://developer.apple.com/account/resources/identifiers/list/serviceId>:

1. **Identifiers → +** → Services IDs → Continue.
2. Description: `Signal Studio — Web Sign-in` (or per-product: `Signal Tasks — Web Sign-in`).
3. Identifier: `ie.signalstudio.web.signin` (or `ie.signalstudio.tasks.web.signin` etc — must be globally unique).
4. Enable **Sign In with Apple** → Configure:
   - Primary App ID: pick the existing umbrella App ID or create one (`ie.signalstudio.app`).
   - Web Domain: `signalstudio.ie` (and per-product subdomains if separate instances: `tasks.signalstudio.ie`, `roadmap.signalstudio.ie`, etc).
   - Return URLs: the exact callback URL Clerk provides — see Step 2 below. Copy from Clerk Dashboard.
5. Save → Continue → Register.

Then create the signing key:

6. **Keys → +** → Continue.
7. Key Name: `Signal Studio — Sign in with Apple`.
8. Enable **Sign In with Apple** → Configure → select the Primary App ID from step 4.
9. Continue → Register → **Download the .p8 file** (one-time; cannot re-download).
10. Note the Key ID (10 chars, shown next to the key name).
11. Note the Team ID (top-right of the Apple Developer portal, also 10 chars).

You now have three pieces of info needed for Clerk:

- **Apple Services ID** (the identifier from step 3, e.g. `ie.signalstudio.web.signin`)
- **Apple Team ID** (10-char alphanumeric)
- **Apple Key ID** (10-char alphanumeric)
- **The .p8 private key file** (contents — paste into Clerk)

## Step 2 — Clerk Dashboard (per product)

> **If your four products share one Clerk application** (see pre-flight), complete Steps 2.1–2.6 **once** — the Apple config propagates to all four sign-in surfaces automatically. Do not repeat per product, or you'll create duplicate Service IDs in the Apple Developer Portal. If you run four separate Clerk instances, repeat per instance.

At <https://dashboard.clerk.com/> (once on the shared instance, or once per instance if the four products run separate Clerk apps — Tasks, Roadmap, Analytics, Notes):

1. Select the Clerk application.
2. **User & Authentication → Social Connections**.
3. Find **Apple** → toggle on.
4. Use Custom Credentials → paste:
   - Services ID
   - Team ID
   - Key ID
   - Private Key (paste the .p8 file contents)
5. Save.
6. **Copy the Authorized Redirect URI** that Clerk shows after saving — paste it back into the Apple Developer Portal's Service ID → Return URLs (step 4 above). Apple and Clerk both need to know about the same URL.

Repeat for the next product. Use the same .p8 / Team ID / Key ID across all four if they share an Apple Services ID, or repeat the Apple-portal Service ID step if you want per-product Service IDs.

## Step 3 — Verify

Run the verification script from the studio repo:

```bash
cd ~/Projects/personal/studio
node scripts/verify-clerk-apple.mjs
```

Output is a per-product report of which OAuth providers are enabled. Pass = "apple" appears in each of the four product reports. Fail = remediate the missing instance.

The script reads each product's `CLERK_SECRET_KEY` from environment and hits Clerk's admin API (`GET /v1/oauth_applications` + provider config). It does not write — read-only.

## Step 4 — Confirm sign-in surfaces show Apple

After Apple is enabled in Clerk Dashboard, visit each product's sign-in page in a browser:

- `https://tasks.signalstudio.ie/sign-in`
- `https://roadmap.signalstudio.ie/sign-in`
- `https://analytics.signalstudio.ie/sign-in`
- `https://notes.signalstudio.ie/sign-in`

Each should render an "Continue with Apple" button alongside the existing "Continue with Google" button. The order is Clerk-controlled (alphabetical / by-priority); the styling honours Apple's HIG: **black background, white Apple logo, white text in light mode** (and white background / black logo / black text in dark mode).

If the button doesn't show, hard-refresh — Clerk caches provider config briefly. If it still doesn't show, re-check Clerk Dashboard → Social Connections → Apple is toggled on.

If the button renders **invisible** (white-on-white or black-on-black, a known Clerk CSS regression in some versions): check that no custom `elements.socialButtonsBlockButton` class in the per-product `layout.tsx` overrides Clerk's Apple-specific background. The shared override is `!min-h-[48px] !text-[15px]` (Tasks / Analytics / Notes) or the equivalent in `roadmap/src/lib/clerk-appearance.ts` — none of those touch `background-color`, so the Apple button should keep its branded surface. If a future cycle adds a `bg-*` class to that key, Apple's button will get overridden — flag and remove.

## Step 5 — App Store listing

Once Apple sign-in is rendering on all four web surfaces, update the App Store screenshot stack to show Apple alongside Google. Confirm `docs/ios/listing.md` § Sign in with Apple — gate, not option — reflects the now-shipped state by changing "AuthView in `SignalStudio/Auth/` (Bucket B follow-up) renders Apple alongside Google" from future tense to present, in the cycle that materialises Bucket B.

## Known gotchas

- **Paste the .p8 verbatim, including the BEGIN/END lines.** Open the .p8 in a text editor and copy everything — `-----BEGIN PRIVATE KEY-----`, the base64 body, and `-----END PRIVATE KEY-----`. Pasting only the base64 body causes Clerk to silently fail validation; the dashboard says "saved" but the Apple flow then errors at sign-in time with no useful hint.
- **Apple's .p8 download is one-time.** Lose it and you regenerate the entire key. Store in the operator's password manager before pasting into Clerk.
- **Service ID + Return URL must match exactly.** A trailing slash, an http-vs-https mismatch, or a missing subdomain causes Apple to reject the auth dance with no useful error message.
- **Apple Email Privacy.** Users can hide their real email; Apple relays through a `@privaterelay.appleid.com` address. Clerk handles the relay-to-real-email mapping internally — but downstream email flows (Analytics briefings, password resets) need to send to the relay address Clerk surfaces, not "infer" a real one. Verified handled by `@clerk/nextjs` today.
- **Sign in with Apple on Web vs iOS** uses different flows (web uses Services ID + Return URL; iOS native uses an App ID + bundle ID + capability). For iOS, the Clerk-iOS SDK handles both — but the dashboard's Apple toggle covers the web flow only. iOS native sign-in adds the `Sign In with Apple` capability in `project.yml` + `Info.plist`'s `com.apple.developer.applesignin` array. Tracked in `auth-bridge.md` for the Bucket B Clerk-iOS wire-up cycle.

## Reverification

| Date       | What changed                                                            | Updater                |
| ---------- | ----------------------------------------------------------------------- | ---------------------- |
| 2026-05-20 | Initial draft. Runbook + verification script approach for the operator. | Agentic iOS prep cycle |
