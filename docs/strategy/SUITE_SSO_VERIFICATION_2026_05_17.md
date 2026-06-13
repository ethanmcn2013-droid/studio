# Suite SSO + Instant-Jump — Prod Walkthrough (2026-05-17)

Goal: verify (not rebuild) that a human can sign in **once** and move
Tasks ⇄ Timeline ⇄ Signal ⇄ Notes with zero re-auth, instantly.
Method: real authenticated session driven through prod via Playwright.
Email-code factor read via the connected Gmail.

## Blunt answer

**YES — sign in once, jump freely with zero re-auth. Empirically proven
in prod across all four products with one continuous live session.**
Two real warts found (neither breaks SSO): a stale "(Dev)" label on the
Clerk app, and the Notes launcher opening a new tab instead of same-tab.

## The actual walkthrough (observed, not inferred)

One sign-up/sign-in performed on `tasks.signalstudio.ie` (email +
password; email code `630073` read from Gmail). Resulting Clerk session:
`sess_3Dpnq6nsrfCpIjPq5DFGBvsboRt` / user `user_3DpnqAZUM6yRWKgBmXhf66iVotd`.
Then, **without signing in again**:

| Hop | URL hit | Final URL | Re-auth? | Session id observed | Load / TTFB |
|---|---|---|---|---|---|
| baseline | tasks…/sign-up | tasks…/app/board | n/a (initial) | sess_3Dpnq6… | — |
| Tasks→Timeline | timeline…/app | timeline…/app | **NO** (pass) | sess_3Dpnq6… (identical) | 3127ms / 1877ms |
| Tasks→Signal | signal…/app | signal…/app | **NO** (pass) | sess_3Dpnq6… (identical) | 1113ms / 436ms |
| Tasks→Notes | notes…/app | notes…/app | **NO** (pass) | sess_3Dpnq6… (identical) | 2174ms / 414ms |
| Notes→Tasks (via SuiteLauncher click) | launcher → tasks | tasks…/ | **NO** (pass) | sess_3Dpnq6… (identical) | new tab |

Every hop kept the *same* Clerk session id and `signedIn:true` with no
redirect to `/sign-in`. Notes carried the session even through its
enforced CSP + Turnstile. The SuiteLauncher menu renders all four
products in the Notes app chrome and is reachable.

## Structural confirmation (from STEP 1–3)

- All 4 on `*.signalstudio.ie` (dig+curl, HTTP 200). One Clerk **prod**
  instance: identical `pk_live`, FAPI `clerk.signalstudio.ie`,
  `test_mode:false`. Session cookie `Domain=signalstudio.ie` (apex) →
  shared across subdomains. Google OAuth enabled (`social:['oauth_google']`).

## Real gaps found (none block SSO)

1. **Clerk application is still named "Tasks (Dev)" in prod.** The
   sign-in heading reads "Sign in to Tasks (Dev)" and the prod
   verification email subject is "630073 is your verification code" /
   body "Your **Tasks (Dev)** verification code" from
   `notifications@signalstudio.ie`. Functionally prod, but a real trust
   wart at the exact moment a user commits. Operator-only fix.
2. **Notes SuiteLauncher opens a NEW TAB and lands on `/`** (marketing
   home), not same-tab `/app`. This contradicts the SC·3 "same-tab"
   Phase-3 claim — at least Notes did not get that treatment. Because it
   opens a new tab, the dot-morph (a same-tab transition) does not play
   on this path. Engineering fix in `notes` repo `suite-launcher.tsx`.
3. **Signal marketing nav omits the SuiteLauncher** (Tasks shows it);
   `analytics/src/components/marketing/site-nav-conditional.tsx` gates it.
   The authenticated `/app` shell is correct. Discoverability only.
4. **CSP enforce-mode landmine.** tasks/timeline/signal CSP is
   Report-Only and omits `clerk.signalstudio.ie`/`*.clerk.com`. Harmless
   today; flipping to enforce without fixing the allowlist breaks Clerk
   there. Notes already enforces correctly.

## OPERATOR MUST DO

1. Rename the Clerk application from "Tasks (Dev)" → "Signal Studio" (or
   "Signal Tasks") in the Clerk dashboard. Removes "(Dev)" from every
   sign-in screen and transactional email across all four products.
2. Decide on the test account this verification created on the prod
   Clerk instance: **`ethanmcn2013@gmail.com`** (password
   `Sgnl-Verify-9x42-Kq7w`, user `user_3DpnqAZUM6yRWKgBmXhf66iVotd`).
   It is your own address — keep it as your real account (recommended;
   reset the password) or delete the user in the Clerk dashboard.

## Proposed phase line (confirm before saving to .claude/state/phase.md)

> SC·4 — Suite SSO PROD-WALKTHROUGH-VERIFIED 2026-05-17: one live Clerk
> session (sess_3Dpnq6…) carried Tasks→Timeline→Signal→Notes→Tasks
> with zero re-auth, observed per-hop. Google OAuth live. SuiteLauncher
> present in all 4 app shells. Owed: (a) operator rename Clerk app off
> "(Dev)"; (b) Notes launcher same-tab/dot-morph fix; (c) signal
> marketing-nav launcher; (d) CSP enforce-mode allowlist on
> tasks/timeline/signal.
