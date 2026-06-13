# Cycle 9.1 — Settings screen (roll-our-own, polished)

**Locked:** 2026-05-13 (end of session).
**Owner:** Tasks repo. Timeline / Notes / Signal inherit the chassis later as separate cycles.
**Estimate:** ~76 hours of focused work for v1, closer to 3 weeks with normal iteration.

---

## Decision: roll-our-own, end-to-end polished

Rejected the themed-Clerk and hybrid alternatives. Brand position carries through every screen; settings is a high-frequency touchpoint where a borrowed UI undercuts the value claim. The cost (auth-UX surface area, opportunity cost vs Lamb's Hill walk) is acknowledged and accepted.

Dissent named for the record:
- Auth UX is the highest-stakes UX in the app. Email change / 2FA / password flows have edge cases (race conditions, expired codes, retry limits) that Clerk handles and we'll re-invent.
- Two-to-three weeks of settings is two-to-three weeks of not shipping the venue pilot growth + Notes scaffolding + wedding template polish.
- Hybrid alternative (roll-our-own for Notifications + Plan, theme Clerk for Profile) was the recommended path and was explicitly rejected.

If this cycle drifts past four weeks of total work, the right move is to revisit the hybrid call — not push through.

---

## Defaults locked (override on resume if you want different)

These were three open questions at lock-time. Picked defaults per the Awwwards bar:

1. **2FA in v1 — YES.** Adds ~10 hours but a settings screen with no security affordance feels incomplete at the polished-bar.
2. **OAuth connections in v1 — YES.** Adds ~6 hours. Most users won't have any to manage, but the empty state itself is a brand-voice opportunity.
3. **Entry-point — intercept Clerk's UserButton "Manage account" item in `<UserButtonWithSuite/>` to point at `/settings/profile`.** Existing component, single override.

Confirm or override these three before kickoff.

---

## Tabs (three only)

| Tab | URL | What it does |
|---|---|---|
| Profile | `/settings/profile` | Name + avatar, change email, change password, 2FA, sessions, OAuth, danger zone (mailto) |
| What we send you | `/settings/notifications` | Daily Signal cadence (off/weekdays/daily), Weekly summary (off/Mondays), time zone, always-on plan-change notices |
| Your plan | `/settings/plan` | Entitlement view with Lamb's-Hill-aware prose; Stripe Customer Portal link for paid tiers |

Workspaces management, data export, real account-delete: deferred to later cycles.

---

## Front-end shape

**Layout chassis.** Suite breadcrumb `signal studio. / tasks / settings`. Sidebar nav on desktop (≥768px), top-tabs on mobile. Single shared chassis at `tasks/src/app/settings/layout.tsx`.

**Motion language (locked, suite-consistent):**
- Tab switch: 180ms fade + 4px y-translate, `[0.16, 1, 0.3, 1]` easing (same as redeem result card)
- Save success: 14px ink-soft "Saved" thin ribbon at top of section, 200ms in / 1.6s hold / 300ms out. No checkmark. No bottom-right toast (project-manager register).
- Loading: 8px pulse on the section being saved, not a full-screen spinner.
- Errors: inline below the failing field. No banners.

**Voice rules (BRAND.md §3 enforced):**
- "Account" → never. Use "Profile" or skip.
- "Notification settings" → never. Use "What we send you".
- "Subscription" → never. Use "Your plan".
- "Preferences" → never. The tab is "What we send you".
- No exclamation marks. No three-adjective trios. No project-manager voice.
- Voice pass owed on every label and every error string before ship.

**Profile flows (bespoke each):**

| Flow | Shape |
|---|---|
| Edit name + avatar | Inline edit on hover, click-outside-saves. Avatar: drag-drop upload + click-to-crop. |
| Change email | Two-step modal — enter new email, verification code sent, enter code, success state ("Email updated. We sent confirmation to both addresses.") |
| Change password | Modal — current password (revealable), new password, confirm. No strength meter (SaaS register). Specific server errors only. |
| 2FA setup | Step flow — "Scan this with your authenticator" + QR → enter code → "Save these recovery codes" with 10 codes + "I've saved them" checkbox to close |
| 2FA disable | Requires current 2FA code |
| Active sessions | Rows: device (UA parse), location (Clerk IP geo), last active. Revoke per row + Revoke all others (with confirm) |
| OAuth connections | Google/Apple chips, Connected/Connect state. Disconnect requires confirm if only auth method. |
| Danger zone | Two-step: "Delete account" → modal asking user to type their email → submit. v1 result = mailto. Cascade out of scope. |

**"What we send you" form:**

Autosave on change. Rows, no card chrome:
- Daily Signal email · Off / Weekdays / Every day (radio, three options)
- Weekly summary · Off / Mondays (radio)
- Time zone · native browser select, prefilled from `Intl.DateTimeFormat().resolvedOptions().timeZone`
- Plan changes & expiry notices · always-on row with copy: *"We'll let you know two weeks before a plan expires. There's no way to turn this off — it's the difference between a refund window and a surprise."*

**"Your plan" prose:**

Comp users (Lamb's Hill etc):
```
Wedding suite. Free for the year, on Lamb's Hill.
Expires May 14 2027.

When the year is up, the workspace stays. Tasks, notes,
and the timeline are yours — you'll just be moved to the
Free tier, which has everything most couples need after
the wedding's done.

Code redeemed · LAMBSHIL-MP93X · 13 May 2026
```

Paid Workspace tier:
```
Workspace · €12 per month.
Renews 14 June 2026.

[Manage billing →]   [Cancel]
```

"Manage billing" opens Stripe Customer Portal in a new tab (one auth-adjacent flow we don't reinvent — Stripe handles card storage / invoicing / dunning entirely).

---

## Back-end

**New schema (Tasks):**

```sql
CREATE TABLE user_preferences (
  user_id TEXT PRIMARY KEY,
  daily_signal_cadence TEXT NOT NULL DEFAULT 'off',  -- off | weekdays | daily
  weekly_summary TEXT NOT NULL DEFAULT 'off',         -- off | mondays
  time_zone TEXT,                                     -- IANA tz string
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);
```

Migration: `drizzle/0002_user_preferences.sql`. Apply on prod Turso before deploy.

**Cross-product preferences unification deferred.** Signal has its own `user_preferences` table. For v1 they stay separate; unify in a later cycle when Notes also needs preferences. Tasks reads its own table here; Signal's cron continues reading Signal's.

**Server actions:**

```
updateProfileAction({ name, avatarUrl })           — Clerk user.update + revalidatePath
requestEmailChangeAction({ email })                 — Clerk emailAddress.create + prepareVerification
confirmEmailChangeAction({ code })                  — Clerk attemptVerification + revalidatePath
changePasswordAction({ current, new })              — Clerk user.updatePassword
setupTotpAction()                                   — returns secret + QR URL
confirmTotpAction({ code })                         — activates + returns 10 recovery codes
disableTotpAction({ code })                         — requires current code
revokeSessionAction({ sessionId })
revokeOtherSessionsAction()
updateNotificationPrefsAction({ ... })              — upserts user_preferences
requestAccountDeleteAction()                        — v1 returns mailto info, defers actual delete
```

**File map:**

```
tasks/src/app/settings/
  layout.tsx                       — sidebar nav + chrome
  page.tsx                         — redirect to /settings/profile
  profile/page.tsx
  profile/edit-name-form.tsx
  profile/change-email-modal.tsx
  profile/change-password-modal.tsx
  profile/totp-setup-flow.tsx
  profile/sessions-list.tsx
  profile/oauth-connections.tsx
  profile/danger-zone.tsx
  notifications/page.tsx
  notifications/preferences-form.tsx
  plan/page.tsx
  plan/comp-plan-view.tsx
  plan/paid-plan-view.tsx

tasks/src/server/db/preferences.ts   — DAL
tasks/src/server/actions/profile.ts  — Clerk wrappers
tasks/src/server/actions/preferences.ts
tasks/src/server/actions/sessions.ts

tasks/drizzle/0002_user_preferences.sql
```

---

## LOE table (honest, no padding)

| Block | Hours |
|---|---|
| Chassis (layout, sidebar, routes, mobile fold) | 6 |
| Profile · name + avatar | 4 |
| Profile · change email (2-step) | 6 |
| Profile · change password | 4 |
| Profile · 2FA setup + disable + recovery codes | 10 |
| Profile · sessions list + revoke flows | 6 |
| Profile · OAuth connections | 6 |
| Profile · danger zone (mailto fallback) | 2 |
| "What we send you" · schema + form + action | 6 |
| "Your plan" · comp prose + paid prose + Stripe portal | 5 |
| Motion / states / save-ribbon pattern | 8 |
| A11y pass (keyboard, screen reader, focus) | 5 |
| Mobile pass | 5 |
| BRAND.md voice pass on every label / copy line | 3 |
| **Total** | **~76h** |

Two solid weeks for v1 assuming no rework. Three with normal iteration.

---

## What's NOT in this cycle (deliberate non-builds)

- **Cascade account-delete.** Mailto in danger zone. The real cascade gets built when there's ≥50 users and a real GDPR-driven request to handle. Today's mailto is brand-honest *and* ships the same week.
- **Workspaces management tab.** Tasks already lets users switch workspaces; full rename/transfer/delete is its own cycle.
- **Data export.** Same reasoning. Mailto for v1.
- **Email open-tracking stats.** Brand violation. The notifications page tells users what they'll receive going forward, not what they did in the past.
- **Cross-product preferences unification.** Tasks has its own table; Signal has its own. Unify when Notes needs preferences too.
- **Settings on Timeline / Notes / Signal.** Tasks first. The other products inherit the chassis as separate cycles once it's proven.

---

## Sequencing

Cycle 9.1 itself splits into two deploys:

- **9.1a — Chassis + Profile.** Layout, routes, mobile fold, motion language, all six Profile flows (name/avatar, email, password, 2FA, sessions, OAuth, danger zone-as-mailto). ~52h.
- **9.1b — Notifications + Plan.** New `user_preferences` schema + migration + action; form with autosave + save-ribbon pattern; comp prose + paid prose + Stripe portal link. ~24h.

Why this split: 9.1a is the harder, riskier half (auth flows). Ship it, walk it, fix the edge cases before bolting on 9.1b. Easier to roll back if something deep goes wrong.

Plan 8 work (Lamb's Hill provision + soft launch) is the explicit precondition. Cycle 9.1 only starts after:
- Clerk webhook secret rotated + Tasks redeployed
- One incognito redemption walked end-to-end
- First batch of 10 codes sent to Sinéad
- Drizzle 0001 (reached_board_at) ALTER applied to prod Turso

That gates 9.1 against ~5 days of Plan 8 closure. Reasonable.

---

## Open question for resume

The hybrid alternative (roll-our-own Notifications + Plan, theme Clerk for Profile) was explicitly rejected at lock-time but should re-surface if:
- Cycle 9.1a exceeds 70h (signal: auth-UX surface is biting)
- A pilot user hits an email-change race condition I missed
- Plan 8.6 / Plan 9 work starts feeling urgent and settings is still half-built

If any of those fire, revisit. Pride costs less than two extra weeks.
