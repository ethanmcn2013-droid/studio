# Signal Studio email inventory

**Date:** 2026-07-16
**Branch:** feat/email-design-system

This document is the comprehensive inventory of every email Signal Studio may need to send: what exists today, what is delegated to third parties, what is blocked by strategy decisions, and what is proposed. Each entry records the trigger, audience, sending policy and current implementation status, so the email design system can be built against a complete map rather than discovered piecemeal. Sender names, reply-to behaviour and tracking rules stated here are proposals consistent with `docs/email-system/sender-architecture.md`, which is being written separately.

Delivery context today: the provider is Resend, the single canonical address is `hello@signalstudio.ie`, and DKIM is pending. Reply-to is always a monitored address, never no-reply.

Eight emails have working prototypes built in `src/emails/`. They are marked with `Prototype: yes` in their entry: `auth.sign-in-code`, `access.ready`, `billing.payment-failed`, `account.deletion-scheduled`, `outreach.venue-first`, `outreach.school-first`, `student.verification-approved`, `editorial.dispatch-issue`.

Wave 2 (2026-07-16, after the Hairline decision) added nine more working prototypes: `auth.verify-email`, `access.waitlist-joined`, `welcome.first-workspace`, `workspace.invitation`, `billing.receipt`, `billing.renewal-upcoming`, `security.new-sign-in`, `data.export-ready`, `venue.codes-ready`. Seventeen inventory entries now have prototypes; selection rationale in `expansion-wave-2.md`.

Tracking policy, applied consistently:

- **Transactional and operational** (security, billing, data rights, deletion, product notifications): no open tracking, no click tracking, no marketing content. Unsubscribe not applicable, except notification digests, which carry preference links. Every product notification is individually disableable in settings.
- **Lifecycle:** no open tracking, first-party link redirects only, a one-click stop link in every message.
- **Commercial outreach** (founder mail): no open pixels, no link tracking, plain personal mail, a mandatory manual suppression list honoured before every send.
- **Editorial and the Dispatch:** subscribed-only, RFC 8058 one-click unsubscribe, aggregate click counts only if a first-party redirect is added later, no per-recipient open pixels.

Sender names: utility mail sends as "Signal Studio", product notifications send as the product full name (for example "Signal Tasks"), founder outreach sends as "Ethan McNamara", editorial sends as "Signal Studio".

---

## 1 · Identity and security

Auth emails are sent by Clerk today: both the analytics and tasks repos use `@clerk/nextjs`. Every template in this section is the code-owned replacement path for when sending moves in-house.

### `auth.verify-email`

| Field | Value |
| --- | --- |
| Purpose | Confirms the person owns the email address they signed up with. |
| Trigger | New account created, or unverified address on file. |
| Audience · Relationship | New sign-up · account holder |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Confirm your email address |
| Preview | One tap and your account is ready. |
| Primary action | Confirm email (button, single-use link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Auth system, Resend, DKIM |
| Status | Delegated to Clerk |
| Notes | Link expiry copy must match the actual token lifetime. |

### `auth.sign-in-code`

Prototype: yes

| Field | Value |
| --- | --- |
| Purpose | Delivers a one-time code so the person can sign in without a password. |
| Trigger | Sign-in attempt with code flow selected. |
| Audience · Relationship | Any account holder · account holder |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your sign-in code: {code} |
| Preview | It expires in 10 minutes. Nobody at Signal Studio will ask for it. |
| Primary action | None: the code is the content |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Auth system, Resend, DKIM |
| Status | Delegated to Clerk; prototype in src/emails/ |
| Notes | Code in subject is a deliberate speed choice; confirm it against security guidance before shipping. |

### `auth.magic-link`

| Field | Value |
| --- | --- |
| Purpose | Delivers a single-use sign-in link. |
| Trigger | Sign-in attempt with magic-link flow selected. |
| Audience · Relationship | Any account holder · account holder |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your sign-in link |
| Preview | Valid for 15 minutes, one use only. |
| Primary action | Sign in (button, single-use link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Auth system, Resend, DKIM |
| Status | Delegated to Clerk |
| Notes | Link must survive email-client link-preview fetches; use a confirmation step, not a bare GET. |

### `auth.password-reset`

| Field | Value |
| --- | --- |
| Purpose | Lets the person set a new password after losing the old one. |
| Trigger | Reset requested from the sign-in screen. |
| Audience · Relationship | Any account holder · account holder |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Reset your password |
| Preview | This link works once and expires in one hour. |
| Primary action | Choose a new password (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Auth system, Resend, DKIM |
| Status | Delegated to Clerk |
| Notes | Must state clearly what to do if the recipient did not request it. |

### `auth.password-changed`

| Field | Value |
| --- | --- |
| Purpose | Confirms the account password was changed, so an unauthorised change is caught fast. |
| Trigger | Password successfully changed. |
| Audience · Relationship | Any account holder · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your password was changed |
| Preview | If this was you, no action is needed. |
| Primary action | Secure my account (link, shown as the recovery path) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Auth system, Resend, DKIM |
| Status | Delegated to Clerk |
| Notes | Always sent to the address on file, even if notifications are otherwise off. |

### `auth.email-change-requested`

| Field | Value |
| --- | --- |
| Purpose | Confirms the person controls the new address before the account email changes. |
| Trigger | Email change initiated in account settings. |
| Audience · Relationship | Account holder, sent to the new address · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Confirm your new email address |
| Preview | Your account email changes only after you confirm. |
| Primary action | Confirm new address (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Auth system, Resend, DKIM |
| Status | Delegated to Clerk |
| Notes | Pairs with auth.email-changed to the old address. |

### `auth.email-changed`

| Field | Value |
| --- | --- |
| Purpose | Notifies the old address that the account email has changed, with a recovery path. |
| Trigger | Email change confirmed. |
| Audience · Relationship | Account holder, sent to the old address · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your account email was changed |
| Preview | If this was not you, act now. |
| Primary action | This was not me (link to recovery flow) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Auth system, Resend, DKIM |
| Status | Delegated to Clerk |
| Notes | The old address must retain a recovery window; the length is an open decision. |

### `auth.new-device`

| Field | Value |
| --- | --- |
| Purpose | Alerts the person that their account was signed in from a device we have not seen before. |
| Trigger | Successful sign-in from an unrecognised device or location. |
| Audience · Relationship | Any account holder · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | New sign-in to your account |
| Preview | {Device}, {approximate location}, {time}. Was this you? |
| Primary action | Review activity (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Auth system with device fingerprinting, Resend, DKIM |
| Status | Delegated to Clerk |
| Notes | Location shown at city level only. |

### `auth.suspicious-sign-in-blocked`

| Field | Value |
| --- | --- |
| Purpose | Tells the person a sign-in attempt was blocked and their account is safe. |
| Trigger | Sign-in attempt fails risk checks and is blocked. |
| Audience · Relationship | Any account holder · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | We blocked a sign-in attempt |
| Preview | Someone tried to sign in and could not. Your account is safe. |
| Primary action | Review and secure account (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Auth risk engine, Resend, DKIM |
| Status | Delegated to Clerk |
| Notes | Rate-limit this alert so an attack does not become an inbox flood. |

### `auth.account-locked`

| Field | Value |
| --- | --- |
| Purpose | Explains that the account is temporarily locked and how to unlock it. |
| Trigger | Too many failed attempts, or a manual security lock. |
| Audience · Relationship | Any account holder · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your account is temporarily locked |
| Preview | Here is why, and how to get back in. |
| Primary action | Unlock my account (link to verified flow) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Auth system, Resend, DKIM |
| Status | Delegated to Clerk |
| Notes | State the lock duration or unlock condition explicitly. |

### `auth.recovery-method-changed`

| Field | Value |
| --- | --- |
| Purpose | Confirms that a recovery method (phone, backup codes, secondary email) was changed. |
| Trigger | Recovery method added, removed or replaced. |
| Audience · Relationship | Any account holder · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your recovery method was changed |
| Preview | If this was not you, secure your account now. |
| Primary action | Review security settings (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Auth system, Resend, DKIM |
| Status | Delegated to Clerk |
| Notes | Sent to all addresses on file, not just the primary. |

---

## 2 · Access and onboarding

The front door. Waitlist entries persist to the database today but no confirmation email exists (`studio/src/lib/waitlist.ts`).

### `access.waitlist-joined`

| Field | Value |
| --- | --- |
| Purpose | Confirms the person is on the waitlist and sets the expectation of silence until access is ready. |
| Trigger | Waitlist form submitted on signalstudio.ie/waitlist. |
| Audience · Relationship | Prospective user · prospect who asked to hear from us |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | You are on the list |
| Preview | We will write once, when your access is ready. Nothing in between. |
| Primary action | None required; optional link to the suite overview |
| Unsubscribe | No, single confirmation with a stated promise of no further mail |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Low |
| Dependencies | Waitlist DB (drizzle/0004 migration is the remaining operator gate), Resend, DKIM |
| Status | Not built. Entries persist to DB, no confirmation email exists today (studio/src/lib/waitlist.ts). |
| Notes | The no-noise promise in this email is a brand statement; keep it. |

### `access.ready`

Prototype: yes

| Field | Value |
| --- | --- |
| Purpose | Tells a waitlisted person their access is open and invites them in. |
| Trigger | Founder or system grants access to a waitlist entry. |
| Audience · Relationship | Waitlisted prospect · prospect who asked to hear from us |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your access is ready |
| Preview | The wait is over. Come in and set up your Workspace. |
| Primary action | Create your account (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Low |
| Dependencies | Waitlist DB, access-grant mechanism, Resend, DKIM |
| Status | Not built; prototype in src/emails/. |
| Notes | The prototype doubles as the welcome for people who arrive via the waitlist; decide whether onboarding.welcome still sends separately for them. |

### `onboarding.welcome`

| Field | Value |
| --- | --- |
| Purpose | Welcomes a new account and points to the one next step that matters. |
| Trigger | Account created and email verified. |
| Audience · Relationship | New user · account holder |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Welcome to Signal Studio |
| Preview | Four tools, one quiet place to work. Start here. |
| Primary action | Open your Workspace (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Low |
| Dependencies | Auth events, Resend, DKIM |
| Status | Not built. |
| Notes | One email, one action. No feature tour, no drip sequence follows. |

### `onboarding.first-workspace-ready`

| Field | Value |
| --- | --- |
| Purpose | Confirms the person's first Workspace exists and hands them the door. |
| Trigger | First Workspace provisioned (including from a template or venue redemption). |
| Audience · Relationship | New user · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your Workspace is ready |
| Preview | {Workspace name} is set up and waiting. |
| Primary action | Open {Workspace name} (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Low |
| Dependencies | Workspace provisioning events, Resend, DKIM |
| Status | Not built. |
| Notes | Skip when Workspace creation happens in-session moments after sign-up; only send for async provisioning (templates, redemptions). |

### `onboarding.incomplete`

| Field | Value |
| --- | --- |
| Purpose | One nudge to a person who signed up but never reached their Workspace. |
| Trigger | Account 3 days old, no meaningful product action recorded. Sent once, ever. |
| Audience · Relationship | Stalled new user · account holder |
| Classification · Priority | Lifecycle · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Pick up where you left off |
| Preview | Your Workspace is still here. Two minutes gets you set up. |
| Primary action | Finish setup (button) |
| Unsubscribe | Yes: one-click stop link, lifecycle list |
| Tracking | No open tracking. First-party link redirects only. |
| Sensitivity | Low |
| Dependencies | Product-usage events, lifecycle scheduler, suppression on stop link |
| Status | Not built. |
| Notes | Exactly one send. No follow-up sequence, per volume discipline. |

### `onboarding.first-success`

| Field | Value |
| --- | --- |
| Purpose | Marks the person's first meaningful product-success moment and shows the natural next step. |
| Trigger | First milestone event: first timeline published, first plan shared, first briefing delivered. |
| Audience · Relationship | Activated new user · account holder |
| Classification · Priority | Lifecycle · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your first {milestone} is done |
| Preview | That is the hard part over. Here is what it unlocks. |
| Primary action | See it live (link to the artefact) |
| Unsubscribe | Yes: one-click stop link, lifecycle list |
| Tracking | No open tracking. First-party link redirects only. |
| Sensitivity | Low |
| Dependencies | Product milestone events, lifecycle scheduler |
| Status | Not built. |
| Notes | Which events count as "first success" per product is an unresolved decision. |

---

## 3 · Invitations and collaboration

The Tasks invite email is live today in `tasks/src/server/email.ts`. The rest of the invitation lifecycle is not built.

### `invite.workspace-invitation`

| Field | Value |
| --- | --- |
| Purpose | Invites a person to join a Workspace someone else set up. |
| Trigger | A member invites an email address to a Workspace. |
| Audience · Relationship | Invitee · no prior relationship, invited by a user |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Product full name, for example Signal Tasks · hello@signalstudio.ie, monitored |
| Subject | {Name} invited you to {Workspace name} |
| Preview | Join the Workspace and see what is planned. |
| Primary action | Accept invitation (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Invitation system, Resend, DKIM |
| Status | Live: Tasks invite sends from tasks/src/server/email.ts. Other products not built. |
| Notes | Recipient may have no account; the email must read well to a stranger and name the inviter prominently. |

### `invite.reminder`

| Field | Value |
| --- | --- |
| Purpose | Reminds an invitee once that their invitation is waiting. |
| Trigger | Invitation unaccepted after 4 days. Sent once per invitation. |
| Audience · Relationship | Invitee · no prior relationship, invited by a user |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Product full name · hello@signalstudio.ie, monitored |
| Subject | Reminder: {Name} is waiting for you in {Workspace name} |
| Preview | Your invitation expires on {date}. |
| Primary action | Accept invitation (button) |
| Unsubscribe | No, but one reminder maximum per invitation |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Invitation system with expiry, scheduler |
| Status | Not built. |
| Notes | One reminder only. A second nudge is the inviter's job, not ours. |

### `invite.expired`

| Field | Value |
| --- | --- |
| Purpose | Tells the invitee the invitation lapsed and how to get a fresh one. |
| Trigger | Invitation reaches its expiry date unaccepted. |
| Audience · Relationship | Invitee · no prior relationship, invited by a user |
| Classification · Priority | Transactional · P2 |
| Sender · Reply-to | Product full name · hello@signalstudio.ie, monitored |
| Subject | Your invitation to {Workspace name} has expired |
| Preview | Ask {Name} to send a new one if you still want in. |
| Primary action | None; informational |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Invitation system with expiry, scheduler |
| Status | Not built. |
| Notes | Consider notifying the inviter in-app instead of emailing the invitee; possibly redundant. Unresolved. |

### `invite.accepted`

| Field | Value |
| --- | --- |
| Purpose | Tells the inviter their invitation was accepted and the person is in. |
| Trigger | Invitee accepts and joins the Workspace. |
| Audience · Relationship | Inviter · account holder |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Product full name · hello@signalstudio.ie, monitored |
| Subject | {Name} joined {Workspace name} |
| Preview | Your invitation was accepted. |
| Primary action | Open the Workspace (link) |
| Unsubscribe | No list unsubscribe: per-notification toggle in settings |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Low |
| Dependencies | Invitation system, notification preferences |
| Status | Not built. |
| Notes | Candidate for folding into the daily digest rather than an individual send. |

### `collab.guest-joined`

| Field | Value |
| --- | --- |
| Purpose | Tells the Workspace owner a guest joined via a share link. |
| Trigger | Guest redeems a share link and enters the Workspace. |
| Audience · Relationship | Workspace owner · account holder |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Product full name · hello@signalstudio.ie, monitored |
| Subject | A guest joined {Workspace name} |
| Preview | {Name or email} joined using your share link. |
| Primary action | Review members (link) |
| Unsubscribe | No list unsubscribe: per-notification toggle in settings |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Share-link system, notification preferences |
| Status | Not built. Share-link delivery email exists (see tasks.share-link); the owner-side notification does not. |
| Notes | Security-relevant: owners should always be able to see who arrived by link. |

---

## 4 · Billing, subscriptions and entitlements

Stripe sends receipts and invoices today: the tasks repo owns checkout and webhooks. Templates here are the code-owned replacement path where marked. Event Workspace expiry depends on the entitlements engine, which is built on the unmerged `feat/access-system` branch.

### `billing.purchase-confirmed`

| Field | Value |
| --- | --- |
| Purpose | Confirms a one-time purchase went through and states exactly what was bought. |
| Trigger | Successful one-time payment (Event Workspace, venue licence, etc.). |
| Audience · Relationship | Buyer · paying customer |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Purchase confirmed: {item} |
| Preview | Paid {amount} on {date}. Your receipt is attached. |
| Primary action | Open what you bought (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe webhooks, Resend, DKIM |
| Status | Delegated to Stripe today; code-owned replacement path. |
| Notes | May merge with billing.receipt into one message; unresolved. |

### `billing.receipt`

| Field | Value |
| --- | --- |
| Purpose | Provides the payment receipt for records. |
| Trigger | Any successful charge. |
| Audience · Relationship | Buyer · paying customer |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your Signal Studio receipt |
| Preview | {Amount}, {date}, {last four digits}. |
| Primary action | Download receipt (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe webhooks, Resend, DKIM |
| Status | Delegated to Stripe today; code-owned replacement path. |
| Notes | Keep Stripe's version until the code-owned one is legally reviewed. |

### `billing.vat-invoice`

| Field | Value |
| --- | --- |
| Purpose | Delivers a VAT invoice for business customers. |
| Trigger | Charge completed for a customer with VAT details on file, or invoice requested. |
| Audience · Relationship | Business buyer · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your VAT invoice from Signal Studio |
| Preview | Invoice {number}, {amount} including VAT. |
| Primary action | Download invoice (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe invoicing, VAT configuration (currently gated), Resend |
| Status | Delegated to Stripe today; VAT setup itself is gated in the licensing design. |
| Notes | Blocked behind the Stripe and VAT founder gates from the licensing and access design. |

### `billing.subscription-started`

| Field | Value |
| --- | --- |
| Purpose | Confirms a subscription is active and states plan, price and renewal date. |
| Trigger | First successful subscription charge. |
| Audience · Relationship | New subscriber · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your subscription is active |
| Preview | {Plan}, {amount} per {interval}, renews {date}. |
| Primary action | Manage subscription (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe webhooks, Resend, DKIM |
| Status | Delegated to Stripe today; code-owned replacement path. |
| Notes | Must state the cancellation path in plain language. |

### `billing.renewal-upcoming`

| Field | Value |
| --- | --- |
| Purpose | Warns before a renewal charges, especially for annual plans. |
| Trigger | Renewal date minus 14 days (annual) or 3 days (monthly, if enabled). |
| Audience · Relationship | Subscriber · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your subscription renews on {date} |
| Preview | {Amount} will be charged to the card ending {digits}. |
| Primary action | Review or change plan (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe upcoming-invoice events, scheduler |
| Status | Not built. Stripe can send upcoming-invoice notices as an interim. |
| Notes | Legally expected for annual renewals in several markets; treat as required for annual plans. |

### `billing.renewal-completed`

| Field | Value |
| --- | --- |
| Purpose | Confirms a renewal charged successfully. |
| Trigger | Recurring charge succeeds. |
| Audience · Relationship | Subscriber · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your subscription renewed |
| Preview | {Amount} charged on {date}. Receipt inside. |
| Primary action | Download receipt (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe webhooks, Resend, DKIM |
| Status | Delegated to Stripe today; code-owned replacement path. |
| Notes | Can be the receipt itself rather than a separate message. |

### `billing.card-expiring`

| Field | Value |
| --- | --- |
| Purpose | Asks the person to update a card before it expires and a renewal fails. |
| Trigger | Card on file expires within 30 days and a renewal is coming. |
| Audience · Relationship | Subscriber · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your card ending {digits} is about to expire |
| Preview | Update it before {renewal date} to keep everything running. |
| Primary action | Update payment method (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe card data, scheduler |
| Status | Not built. |
| Notes | Skip if Stripe network card-updater already refreshed the card. |

### `billing.payment-failed`

Prototype: yes

| Field | Value |
| --- | --- |
| Purpose | Tells the person a charge failed and how to fix it before access is affected. |
| Trigger | Recurring or one-time charge fails. |
| Audience · Relationship | Subscriber · paying customer |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | A payment did not go through |
| Preview | We will retry on {date}. Updating your card fixes it now. |
| Primary action | Update payment method (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe webhooks, dunning schedule, Resend, DKIM |
| Status | Not built in product; prototype in src/emails/. Stripe dunning available as interim. |
| Notes | Calm tone, no threat language; state the retry schedule and the consequence plainly. |

### `billing.final-payment-attempt`

| Field | Value |
| --- | --- |
| Purpose | Final notice before the last retry, stating exactly what happens if it fails. |
| Trigger | Last scheduled dunning retry approaching. |
| Audience · Relationship | Subscriber · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Final payment attempt on {date} |
| Preview | If this attempt fails, your plan moves to Free and your work stays safe. |
| Primary action | Update payment method (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe dunning schedule, Resend |
| Status | Not built. |
| Notes | Must promise data safety explicitly: downgrade, never deletion. |

### `billing.payment-method-updated`

| Field | Value |
| --- | --- |
| Purpose | Confirms the payment method on file changed, so fraud is caught fast. |
| Trigger | Payment method added, removed or replaced. |
| Audience · Relationship | Subscriber · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your payment method was updated |
| Preview | Card ending {digits} is now on file. |
| Primary action | Review billing settings (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe webhooks, Resend |
| Status | Not built. |
| Notes | Security notification as much as billing; always sends. |

### `billing.subscription-cancelled`

| Field | Value |
| --- | --- |
| Purpose | Confirms cancellation and states exactly when access changes and what survives. |
| Trigger | Subscription cancelled by the user or by dunning exhaustion. |
| Audience · Relationship | Cancelling subscriber · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your subscription is cancelled |
| Preview | Paid features run until {date}. Your work stays. |
| Primary action | None required; link to reactivate |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe webhooks, entitlements engine, Resend |
| Status | Not built. |
| Notes | No guilt copy, no win-back offer in this message. It is a confirmation, nothing else. |

### `billing.refund-issued`

| Field | Value |
| --- | --- |
| Purpose | Confirms a refund was issued and when it will land. |
| Trigger | Full or partial refund processed. |
| Audience · Relationship | Refunded customer · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your refund is on its way |
| Preview | {Amount} back to the card ending {digits}, within 5 to 10 business days. |
| Primary action | None; informational |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Stripe webhooks, Resend |
| Status | Not built. Stripe can issue its own refund notice as interim. |
| Notes | State the bank-side delay so support tickets do not arrive on day two. |

### `billing.access-ending`

| Field | Value |
| --- | --- |
| Purpose | Warns that paid access ends soon, with the date and the consequence. |
| Trigger | Cancelled or lapsed plan reaches 7 days before entitlement expiry. |
| Audience · Relationship | Departing subscriber · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your paid access ends on {date} |
| Preview | After that your Workspace moves to Free. Nothing is deleted. |
| Primary action | Keep my plan (link to reactivate) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Entitlements engine (feat/access-system), scheduler |
| Status | Engine on branch, email not built. |
| Notes | One warning, not a countdown series. |

### `billing.moved-to-free`

| Field | Value |
| --- | --- |
| Purpose | Confirms the plan moved to Free and states exactly what changed. |
| Trigger | Entitlement expiry executes the downgrade. |
| Audience · Relationship | Former subscriber · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your plan moved to Free |
| Preview | Your work is intact. Here is what changed. |
| Primary action | See what Free includes (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Entitlements engine (feat/access-system), Resend |
| Status | Engine on branch, email not built. |
| Notes | List concretely what is read-only or capped; vagueness here creates support load. |

### `billing.event-workspace-expiring`

| Field | Value |
| --- | --- |
| Purpose | Warns the owner of an Event Workspace that its licensed period ends soon. |
| Trigger | Event Workspace entitlement reaches 14 days, then 3 days, before expiry. |
| Audience · Relationship | Event Workspace owner · paying customer or code redeemer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | {Workspace name} moves to read-only on {date} |
| Preview | Your event workspace stays viewable. Editing ends {date}. |
| Primary action | Review options (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Entitlements engine (feat/access-system), scheduler |
| Status | Engine on branch, email not built. |
| Notes | One template, two sends (14 days, 3 days). Whether post-event workspaces go read-only or archive is decided by the entitlements design; copy must match it. |

---

## 5 · Student verification

Student entitlements exist in the entitlements design. Code delivery for redeemed students is live in Tasks; the verification flow around it is not.

### `student.verification-requested`

| Field | Value |
| --- | --- |
| Purpose | Confirms we received the student verification request and states the wait. |
| Trigger | Student submits verification evidence. |
| Audience · Relationship | Student applicant · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | We received your student verification |
| Preview | We will confirm within {n} days. Nothing else to do. |
| Primary action | None; informational |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Student verification flow (manual review or provider, undecided), Resend |
| Status | Not built. |
| Notes | Verification method (manual founder review vs a provider like SheerID) is an unresolved decision. |

### `student.verification-approved`

Prototype: yes

| Field | Value |
| --- | --- |
| Purpose | Confirms student status and delivers access to the student plan. |
| Trigger | Verification approved. |
| Audience · Relationship | Verified student · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your student access is confirmed |
| Preview | Free access for the academic year, active now. |
| Primary action | Open your Workspace (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Student verification flow, entitlements engine, Resend |
| Status | Partially live: the student redemption code send exists in tasks/src/server/email.ts. The full approval template is the prototype in src/emails/. |
| Notes | Must state the verification expiry date so the renewal ask later is expected. |

### `student.verification-unsuccessful`

| Field | Value |
| --- | --- |
| Purpose | Tells the applicant verification did not go through and what evidence would work. |
| Trigger | Verification rejected or evidence insufficient. |
| Audience · Relationship | Student applicant · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | We could not verify your student status |
| Preview | Here is what to send instead. You can try again any time. |
| Primary action | Try again (link to verification flow) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Student verification flow, Resend |
| Status | Not built. |
| Notes | Never say "rejected" in user-facing copy; state what works instead. |

### `student.verification-expiring`

| Field | Value |
| --- | --- |
| Purpose | Asks the student to re-verify before their student plan lapses. |
| Trigger | Verification validity reaches 30 days before expiry. |
| Audience · Relationship | Verified student · account holder |
| Classification · Priority | Transactional · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your student verification expires on {date} |
| Preview | Re-verify in two minutes to keep your student plan. |
| Primary action | Re-verify now (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Student verification flow, entitlements engine, scheduler |
| Status | Not built. |
| Notes | One notice at 30 days; expiry then follows the billing.moved-to-free path. |

---

## 6 · Venue licences and activation codes

The entitlements engine behind venue licences and codes is built on the unmerged `feat/access-system` branch. Every email here carries the status: engine on branch, email not built.

### `venue.licence-confirmed`

| Field | Value |
| --- | --- |
| Purpose | Confirms the venue licence is active and states what it includes. |
| Trigger | Venue licence purchase or agreement activated. |
| Audience · Relationship | Venue buyer (coordinator, manager) · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your venue licence is active |
| Preview | {Venue name}: {n} activation codes, valid until {date}. |
| Primary action | See your codes (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Entitlements engine (feat/access-system), Stripe, Resend |
| Status | Engine on branch, email not built. |
| Notes | The venue edition email template doc (docs/VENUE_EDITION_EMAIL_TEMPLATE.md) predates this system; reconcile before building. |

### `venue.code-batch-ready`

| Field | Value |
| --- | --- |
| Purpose | Delivers or announces a batch of activation codes for the venue to hand to couples. |
| Trigger | Code batch generated under a venue licence. |
| Audience · Relationship | Venue contact · paying customer |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your activation codes are ready |
| Preview | {n} codes for {venue name}, each good for one event workspace. |
| Primary action | View and share codes (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Entitlements engine (feat/access-system), Resend |
| Status | Engine on branch, email not built. |
| Notes | Codes should live behind a signed-in page, not raw in the email body. Unresolved: whether small batches ship inline. |

### `venue.code-redeemed`

| Field | Value |
| --- | --- |
| Purpose | Tells the venue a couple redeemed one of their codes. |
| Trigger | Activation code redeemed and an event workspace created. |
| Audience · Relationship | Venue contact · paying customer |
| Classification · Priority | Operational · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | An activation code was redeemed |
| Preview | {n} of {total} codes used at {venue name}. |
| Primary action | See usage (link) |
| Unsubscribe | No list unsubscribe: per-notification toggle in settings |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Entitlements engine (feat/access-system), notification preferences |
| Status | Engine on branch, email not built. |
| Notes | Consider a weekly venue digest instead of per-redemption sends; per-send is noisy at scale. Unresolved. |

### `venue.code-replaced-or-expired`

| Field | Value |
| --- | --- |
| Purpose | Confirms a code was replaced, or notes a batch expired unused. |
| Trigger | Founder or venue replaces a code, or codes reach expiry unredeemed. |
| Audience · Relationship | Venue contact · paying customer |
| Classification · Priority | Operational · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | An activation code was replaced |
| Preview | The old code no longer works. The new one is ready. |
| Primary action | View current codes (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Entitlements engine (feat/access-system), Resend |
| Status | Engine on branch, email not built. |
| Notes | Expiry variant uses subject "Unused codes from your batch expired on {date}". |

---

## 7 · School pilots and school entitlements

The segment-sequencing decision (2026-05) forbids school outbound and pilots today. Every entry in this section carries the status: blocked by segment-sequencing decision, prototype only. These are documented so the design system covers them when the segment opens.

### `school.pilot-activated`

| Field | Value |
| --- | --- |
| Purpose | Confirms the school pilot is live and hands the coordinator the setup path. |
| Trigger | School pilot agreement activated. |
| Audience · Relationship | School coordinator (teacher, IT lead) · pilot partner |
| Classification · Priority | Transactional · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your school pilot is live |
| Preview | {School name}: {n} seats until {date}. Setup takes ten minutes. |
| Primary action | Set up your classes (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Entitlements engine, school pilot flow, Resend |
| Status | Blocked by segment-sequencing decision, prototype only. |
| Notes | Student-data handling for minors needs legal review before any school email ships. |

### `school.pilot-ending`

| Field | Value |
| --- | --- |
| Purpose | Warns the coordinator the pilot ends soon and states what happens to student work. |
| Trigger | Pilot reaches 14 days before its end date. |
| Audience · Relationship | School coordinator · pilot partner |
| Classification · Priority | Transactional · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your pilot ends on {date} |
| Preview | Student work stays accessible. Here are the options. |
| Primary action | Talk about next steps (link, books founder time) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Entitlements engine, scheduler |
| Status | Blocked by segment-sequencing decision, prototype only. |
| Notes | Data-retention promise for student work after pilot end is an unresolved decision. |

### `school.pilot-extended`

| Field | Value |
| --- | --- |
| Purpose | Confirms the pilot was extended and states the new end date. |
| Trigger | Founder extends a pilot. |
| Audience · Relationship | School coordinator · pilot partner |
| Classification · Priority | Transactional · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your pilot has been extended |
| Preview | {School name} now runs until {date}. Nothing changes for students. |
| Primary action | None; informational |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Entitlements engine, Resend |
| Status | Blocked by segment-sequencing decision, prototype only. |
| Notes | None. |

---

## 8 · Product notifications

Live sends today: the Signal briefing (analytics/src/lib/email/briefing-email.tsx, live cron) and the Tasks daily digest and share link (tasks/src/server/email.ts). Notes inbound email capture is documented but not wired; it is a receive path, not a send, and is out of scope for this inventory. Every notification in this section must be individually disableable in settings.

### `tasks.assigned`

| Field | Value |
| --- | --- |
| Purpose | Tells a person a task was assigned to them. |
| Trigger | Task assigned to a member who is not the assigner. |
| Audience · Relationship | Workspace member · account holder |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Signal Tasks · hello@signalstudio.ie, monitored |
| Subject | {Name} assigned you a task |
| Preview | {Task title}, due {date}. |
| Primary action | Open the task (button) |
| Unsubscribe | No list unsubscribe: per-notification toggle in settings |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Tasks events, notification preferences, Resend |
| Status | Not built as an individual send; assignment appears in the live daily digest. |
| Notes | Default to digest-only; individual sends opt-in. Unresolved default. |

### `notify.mention`

| Field | Value |
| --- | --- |
| Purpose | Tells a person they were mentioned somewhere they should look. |
| Trigger | @-mention in a task, note or comment. |
| Audience · Relationship | Workspace member · account holder |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Product full name of the mentioning product · hello@signalstudio.ie, monitored |
| Subject | {Name} mentioned you in {place} |
| Preview | "{surrounding text excerpt}" |
| Primary action | See the mention (button) |
| Unsubscribe | No list unsubscribe: per-notification toggle in settings |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Mention events across products, notification preferences |
| Status | Not built. |
| Notes | Excerpt in preview puts workspace content in email headers; needs a sensitivity review. |

### `tasks.deadline-reminder`

| Field | Value |
| --- | --- |
| Purpose | Reminds an assignee a task is due. |
| Trigger | Task due within the person's chosen reminder window. |
| Audience · Relationship | Assignee · account holder |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Signal Tasks · hello@signalstudio.ie, monitored |
| Subject | Due tomorrow: {task title} |
| Preview | In {workspace name}. |
| Primary action | Open the task (button) |
| Unsubscribe | No list unsubscribe: per-notification toggle in settings |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Tasks scheduler, notification preferences |
| Status | Not built as an individual send; due items appear in the live daily digest. |
| Notes | One reminder per task per window, never a repeat-nag series. |

### `tasks.daily-digest`

| Field | Value |
| --- | --- |
| Purpose | One summary of what changed and what is due across the person's Tasks workspaces. |
| Trigger | Scheduled send on the person's chosen cadence. |
| Audience · Relationship | Workspace member with digest on · account holder |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Signal Tasks · hello@signalstudio.ie, monitored |
| Subject | Today in {workspace name} |
| Preview | {n} due, {n} done, {n} new. |
| Primary action | Open Signal Tasks (button) |
| Unsubscribe | Preference link in footer (notification preferences) |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Tasks events, scheduler, notification preferences |
| Status | Live: tasks/src/server/email.ts. |
| Notes | Volume discipline says digests default weekly; check the live send's default cadence against that rule. |

### `tasks.share-link`

| Field | Value |
| --- | --- |
| Purpose | Delivers a share link so a recipient can view what was shared with them. |
| Trigger | Member shares an item to an email address. |
| Audience · Relationship | Share recipient · may have no prior relationship |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Tasks · hello@signalstudio.ie, monitored |
| Subject | {Name} shared {item} with you |
| Preview | View it in one click. No account needed. |
| Primary action | Open {item} (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Share-link system, Resend |
| Status | Live: tasks/src/server/email.ts. |
| Notes | Sender name and sharer identity must be unmistakable; this email lands cold. |

### `timeline.published`

| Field | Value |
| --- | --- |
| Purpose | Tells followers a timeline was published and is ready to view. |
| Trigger | Timeline published to a shared or public audience. |
| Audience · Relationship | Members and guests with access · account holders and guests |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Signal Timeline · hello@signalstudio.ie, monitored |
| Subject | {Name} published a timeline |
| Preview | {Timeline title} is live. |
| Primary action | View the timeline (button) |
| Unsubscribe | No list unsubscribe: per-notification toggle in settings |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Timeline publish events, notification preferences |
| Status | Not built. |
| Notes | None. |

### `timeline.updated`

| Field | Value |
| --- | --- |
| Purpose | Tells followers a published timeline they rely on has changed. |
| Trigger | Material change to an already-published timeline. |
| Audience · Relationship | Members and guests with access · account holders and guests |
| Classification · Priority | Operational · P2 |
| Sender · Reply-to | Signal Timeline · hello@signalstudio.ie, monitored |
| Subject | A timeline you follow was updated |
| Preview | {Timeline title}: {change summary}. |
| Primary action | See what changed (button) |
| Unsubscribe | No list unsubscribe: per-notification toggle in settings |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Timeline change detection, notification preferences |
| Status | Not built. |
| Notes | Define "material change" precisely or this becomes noise. Batch same-day changes into one send. |

### `signal.briefing`

| Field | Value |
| --- | --- |
| Purpose | Delivers the scheduled Signal analytics briefing. |
| Trigger | Cron on the person's chosen schedule. |
| Audience · Relationship | Signal user with briefings on · account holder |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Signal · hello@signalstudio.ie, monitored |
| Subject | Your Signal briefing |
| Preview | {Headline metric or insight}. |
| Primary action | Open Signal (button) |
| Unsubscribe | Preference link in footer (notification preferences) |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Analytics data, cron, Resend |
| Status | Live: analytics/src/lib/email/briefing-email.tsx, live cron. |
| Notes | Existing live send; bring it under the design system without breaking the cron. |

### `workspace.owner-changed`

| Field | Value |
| --- | --- |
| Purpose | Tells members the Workspace has a new owner. |
| Trigger | Ownership transferred. |
| Audience · Relationship | All members, plus old and new owner · account holders |
| Classification · Priority | Operational · P2 |
| Sender · Reply-to | Product full name · hello@signalstudio.ie, monitored |
| Subject | {Workspace name} has a new owner |
| Preview | {New owner} now owns this Workspace. |
| Primary action | Open the Workspace (link) |
| Unsubscribe | No: governance notices always send |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Workspace governance events, Resend |
| Status | Not built. |
| Notes | Old and new owner get a fuller variant than ordinary members. |

### `workspace.archived`

| Field | Value |
| --- | --- |
| Purpose | Tells members the Workspace was archived and is now read-only. |
| Trigger | Owner archives a Workspace. |
| Audience · Relationship | All members · account holders |
| Classification · Priority | Operational · P2 |
| Sender · Reply-to | Product full name · hello@signalstudio.ie, monitored |
| Subject | {Workspace name} was archived |
| Preview | Everything stays readable. Editing is paused. |
| Primary action | View the archive (link) |
| Unsubscribe | No: governance notices always send |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Workspace governance events, Resend |
| Status | Not built. |
| Notes | None. |

### `workspace.restored`

| Field | Value |
| --- | --- |
| Purpose | Tells members an archived Workspace is active again. |
| Trigger | Owner restores a Workspace from archive. |
| Audience · Relationship | All members · account holders |
| Classification · Priority | Operational · P2 |
| Sender · Reply-to | Product full name · hello@signalstudio.ie, monitored |
| Subject | {Workspace name} was restored |
| Preview | The Workspace is active again. |
| Primary action | Open the Workspace (link) |
| Unsubscribe | No: governance notices always send |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Workspace governance events, Resend |
| Status | Not built. |
| Notes | None. |

### `workspace.connection-changed`

| Field | Value |
| --- | --- |
| Purpose | Tells the owner a connection to an outside service was added or removed. |
| Trigger | Integration connected or disconnected on the Workspace. |
| Audience · Relationship | Workspace owner and admins · account holders |
| Classification · Priority | Operational · P2 |
| Sender · Reply-to | Product full name · hello@signalstudio.ie, monitored |
| Subject | Connection added: {service} |
| Preview | {Name} connected {service} to {workspace name}. |
| Primary action | Review connections (link) |
| Unsubscribe | No: security-relevant, always sends |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Integration events, Resend |
| Status | Not built. |
| Notes | User-facing copy says "connection added or removed", never "integration", per brand jargon rules. Removal variant subject: "Connection removed: {service}". |

### `workspace.permission-changed`

| Field | Value |
| --- | --- |
| Purpose | Tells a person their access to a Workspace materially changed. |
| Trigger | Role change, access reduction or removal affecting the recipient. |
| Audience · Relationship | Affected member or guest · account holder or guest |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Product full name · hello@signalstudio.ie, monitored |
| Subject | Your access to {workspace name} changed |
| Preview | You are now {role}. |
| Primary action | Open the Workspace (link), omitted when access was removed |
| Unsubscribe | No: security-relevant, always sends |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Permission events, Resend |
| Status | Not built. |
| Notes | Only material changes send email; minor tweaks stay in-app. The threshold is an unresolved decision. |

---

## 9 · Lifecycle and retention

Signal Studio does not run re-engagement drips. Lifecycle mail is limited to a small set of single, purposeful sends, each with a one-click stop link. The onboarding nudges (`onboarding.incomplete`, `onboarding.first-success`) are also lifecycle mail and live in section 2.

### `lifecycle.dormant-notice`

| Field | Value |
| --- | --- |
| Purpose | One notice that an account has been dormant long enough to enter the data-retention pipeline. |
| Trigger | No sign-in for 12 months; sent once, tied to the retention policy, not to marketing. |
| Audience · Relationship | Dormant account holder · account holder |
| Classification · Priority | Lifecycle · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your account has been quiet for a year |
| Preview | Sign in to keep it, or do nothing and we will archive it on {date}. |
| Primary action | Keep my account (sign-in link) |
| Unsubscribe | Yes: one-click stop link, lifecycle list, though stopping also accepts the archive path |
| Tracking | No open tracking. First-party link redirects only. |
| Sensitivity | Medium |
| Dependencies | Activity tracking, retention policy (not yet defined), scheduler |
| Status | Not built. Retention policy itself is an unresolved decision. |
| Notes | This is a data-stewardship notice, not a win-back. No product pitch in the body. |

### `lifecycle.limit-approaching`

| Field | Value |
| --- | --- |
| Purpose | Warns a Free-plan user they are near a plan limit before they hit it mid-task. |
| Trigger | Usage crosses 80 percent of a Free plan cap. Once per limit per month. |
| Audience · Relationship | Free-plan user · account holder |
| Classification · Priority | Lifecycle · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | You are close to a plan limit |
| Preview | {Usage} of {cap} used. Here is what happens at the cap. |
| Primary action | See plans (link) |
| Unsubscribe | Yes: one-click stop link, lifecycle list |
| Tracking | No open tracking. First-party link redirects only. |
| Sensitivity | Low |
| Dependencies | Usage metering, entitlements engine, scheduler |
| Status | Not built. |
| Notes | State the consequence factually; no urgency theatre. |

### `lifecycle.feedback-request`

| Field | Value |
| --- | --- |
| Purpose | One request for feedback from a person who has used the product long enough to have an opinion. |
| Trigger | 60 days of active use. Sent once per account, ever. |
| Audience · Relationship | Established user · account holder |
| Classification · Priority | Lifecycle · P2 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | One question |
| Preview | You have used Signal Studio for two months. What is missing? |
| Primary action | Reply to this email |
| Unsubscribe | Yes: one-click stop link, lifecycle list |
| Tracking | No open tracking. First-party link redirects only. |
| Sensitivity | Low |
| Dependencies | Activity tracking, scheduler, suppression list |
| Status | Not built. |
| Notes | Founder-signed but lifecycle-classified because it is automated. Flag the automation honestly if asked. |

---

## 10 · Data rights and privacy

All transactional. These always send, regardless of notification preferences.

### `data.export-requested`

| Field | Value |
| --- | --- |
| Purpose | Confirms the export request was received and states how long it takes. |
| Trigger | Data export requested from settings or via a privacy request. |
| Audience · Relationship | Requesting user · account holder |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | We are preparing your export |
| Preview | You will get a download link within {n} hours. |
| Primary action | None; informational |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Medium |
| Dependencies | Export pipeline, Resend |
| Status | Not built. Export pipeline does not exist yet. |
| Notes | Skip this message if exports complete in minutes; go straight to data.export-ready. |

### `data.export-ready`

| Field | Value |
| --- | --- |
| Purpose | Delivers the download link for a completed data export. |
| Trigger | Export job completes. |
| Audience · Relationship | Requesting user · account holder |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your export is ready |
| Preview | Download link inside. It expires on {date}. |
| Primary action | Download your data (button, authenticated link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Export pipeline, signed expiring URLs, Resend |
| Status | Not built. Export pipeline does not exist yet. |
| Notes | Link must require authentication, not a bare signed URL; the email may be forwarded. |

### `data.export-link-expiring`

| Field | Value |
| --- | --- |
| Purpose | Warns that an unclaimed export link is about to expire. |
| Trigger | Export ready, not downloaded, 48 hours before link expiry. |
| Audience · Relationship | Requesting user · account holder |
| Classification · Priority | Transactional · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your export link expires soon |
| Preview | Download by {date} or request a fresh export. |
| Primary action | Download now (button) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Export pipeline, download tracking, scheduler |
| Status | Not built. |
| Notes | One warning only. |

### `privacy.request-acknowledged`

| Field | Value |
| --- | --- |
| Purpose | Confirms receipt of a privacy request (access, rectification, erasure, objection) and states the legal clock. |
| Trigger | Privacy request received via any channel. |
| Audience · Relationship | Requester · account holder or data subject without an account |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | We received your request |
| Preview | We will respond within one month, as GDPR requires. |
| Primary action | None; informational |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Privacy request intake (can be manual at current scale), Resend |
| Status | Not built. Handled manually by the founder today. |
| Notes | Must work for people who are not account holders, for example a guest on a shared timeline. |

### `privacy.request-completed`

| Field | Value |
| --- | --- |
| Purpose | Confirms the privacy request was fulfilled and states what was done. |
| Trigger | Request fulfilled. |
| Audience · Relationship | Requester · account holder or data subject |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your request is complete |
| Preview | Here is what we did, in plain terms. |
| Primary action | None; informational, may link to an export |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Privacy request workflow, Resend |
| Status | Not built. Handled manually by the founder today. |
| Notes | Keep a copy in the compliance record. |

### `privacy.policy-update`

| Field | Value |
| --- | --- |
| Purpose | Notifies users of a material change to the privacy policy before it takes effect. |
| Trigger | Material privacy-policy change approved, sent ahead of the effective date. |
| Audience · Relationship | All account holders · account holders |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Our privacy policy is changing on {date} |
| Preview | What changed and why, in three sentences. |
| Primary action | Read the changes (link to a diff-style summary) |
| Unsubscribe | No: legally required notice |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Low |
| Dependencies | Legal review, full-list send capability, Resend |
| Status | Not built. |
| Notes | Only material changes send email; minor edits go in the Dispatch changelog. |

### `privacy.terms-update`

| Field | Value |
| --- | --- |
| Purpose | Notifies users of a material change to the terms of service before it takes effect. |
| Trigger | Material terms change approved, sent ahead of the effective date. |
| Audience · Relationship | All account holders · account holders |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Our terms are changing on {date} |
| Preview | The changes, summarised honestly. |
| Primary action | Read the changes (link) |
| Unsubscribe | No: legally required notice |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Low |
| Dependencies | Legal review, full-list send capability, Resend |
| Status | Not built. |
| Notes | Same template family as privacy.policy-update. |

---

## 11 · Account and Workspace deletion

The deletion sequence is a trust-critical path: every step confirms, every step states what is reversible and until when.

### `account.deletion-requested`

| Field | Value |
| --- | --- |
| Purpose | Confirms a deletion request was received and states the grace period. |
| Trigger | Account deletion requested in settings. |
| Audience · Relationship | Departing user · account holder |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | We received your deletion request |
| Preview | Your account is scheduled for deletion on {date}. You can cancel until then. |
| Primary action | Cancel deletion (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Deletion pipeline with grace period, Resend |
| Status | Not built. Deletion pipeline does not exist yet. |
| Notes | Grace period length (proposed 30 days) is an unresolved decision. |

### `account.deletion-scheduled`

Prototype: yes

| Field | Value |
| --- | --- |
| Purpose | States the exact deletion date and what will be removed. |
| Trigger | Deletion request confirmed, schedule locked. |
| Audience · Relationship | Departing user · account holder |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your account will be deleted on {date} |
| Preview | Everything goes. Export first if you want a copy. |
| Primary action | Export my data (link), with cancel-deletion as secondary |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Deletion pipeline, export pipeline, Resend |
| Status | Not built in product; prototype in src/emails/. |
| Notes | May merge with account.deletion-requested into one message if request and schedule are the same moment. |

### `account.deletion-cancelled`

| Field | Value |
| --- | --- |
| Purpose | Confirms the deletion was cancelled and the account is safe. |
| Trigger | User cancels within the grace period. |
| Audience · Relationship | Returning user · account holder |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your account deletion is cancelled |
| Preview | Everything is exactly as you left it. |
| Primary action | Open your Workspace (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Deletion pipeline, Resend |
| Status | Not built. |
| Notes | None. |

### `account.deleted`

| Field | Value |
| --- | --- |
| Purpose | Final confirmation that the account and its data are permanently deleted. |
| Trigger | Deletion job completes after the grace period. |
| Audience · Relationship | Former user · former account holder |
| Classification · Priority | Transactional · P0 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Your account has been deleted |
| Preview | Your data is gone from our systems. Thank you for trying Signal Studio. |
| Primary action | None; final message |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Deletion pipeline, retained-address exception for this single send |
| Status | Not built. |
| Notes | Sending after deletion requires briefly retaining the address for this purpose; document the legal basis. |

### `workspace.deletion-requested`

| Field | Value |
| --- | --- |
| Purpose | Confirms a Workspace deletion request and warns all members. |
| Trigger | Owner requests Workspace deletion. |
| Audience · Relationship | Owner, with a notice variant to members · account holders |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | {Workspace name} is scheduled for deletion |
| Preview | It will be permanently deleted on {date}. Members can export until then. |
| Primary action | Cancel deletion (owner) · Export my work (members) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Workspace deletion pipeline, Resend |
| Status | Not built. |
| Notes | Members must be warned, not just the owner; shared work is at stake. |

### `workspace.deleted`

| Field | Value |
| --- | --- |
| Purpose | Confirms the Workspace and its contents are permanently deleted. |
| Trigger | Workspace deletion job completes. |
| Audience · Relationship | Owner and former members · account holders |
| Classification · Priority | Transactional · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | {Workspace name} has been permanently deleted |
| Preview | The Workspace and everything in it is gone. |
| Primary action | None; final message |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Workspace deletion pipeline, Resend |
| Status | Not built. |
| Notes | None. |

---

## 12 · Service incidents

Operational mail sent rarely and only when users are materially affected. Never sent for incidents users would not notice.

### `incident.notice`

| Field | Value |
| --- | --- |
| Purpose | Tells affected users about a service disruption that materially affects their work. |
| Trigger | Founder declares a user-facing incident. |
| Audience · Relationship | Affected users only · account holders |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Service disruption: {product or area} |
| Preview | What is affected, what we are doing, where updates live. |
| Primary action | Follow updates (link to status location) |
| Unsubscribe | No: incident notices always send to affected users |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Low |
| Dependencies | Segmented send capability, a status location (a status page does not exist yet), Resend |
| Status | Not built. |
| Notes | Email only when the disruption is long or data-affecting; short outages go on a status page only. |

### `incident.resolved`

| Field | Value |
| --- | --- |
| Purpose | Closes the loop on an incident that was announced by email. |
| Trigger | Incident resolved after an incident.notice was sent. |
| Audience · Relationship | The same recipients as the notice · account holders |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | Resolved: {product or area} |
| Preview | What happened, what we fixed, what changes. |
| Primary action | Read the summary (link) |
| Unsubscribe | No |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | Low |
| Dependencies | Same as incident.notice |
| Status | Not built. |
| Notes | Only sent if a notice was sent. Every notice gets a resolution. |

### `incident.security-notice`

| Field | Value |
| --- | --- |
| Purpose | Notifies affected users of a security incident or data breach involving their data. |
| Trigger | Confirmed incident meeting the legal notification threshold. |
| Audience · Relationship | Affected users · account holders |
| Classification · Priority | Operational · P1 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | A security notice about your account |
| Preview | What happened, what was affected, what to do now. |
| Primary action | Steps to take (link and inline instructions) |
| Unsubscribe | No: legally required notice |
| Tracking | None. No open or click tracking, no marketing content. |
| Sensitivity | High |
| Dependencies | Incident response process, legal review, full or segmented send capability |
| Status | Not built. The template should exist before it is ever needed. |
| Notes | GDPR gives 72 hours for authority notification; the user-notice template cannot be written under that clock. Pre-write it. |

---

## 13 · Founder-led commercial outreach

Founder mail: plain personal email from Ethan McNamara, no pixels, no link tracking, manual suppression list honoured before every send. Venue outreach is the active wedge. School outreach is blocked by the segment-sequencing decision. Student outreach is queued behind the weddings wedge.

### `outreach.venue-first`

Prototype: yes

| Field | Value |
| --- | --- |
| Purpose | Opens a conversation with a wedding venue about offering Signal Studio event workspaces to couples. |
| Trigger | Founder sends manually to a researched venue contact. |
| Audience · Relationship | Venue coordinator or manager · cold prospect |
| Classification · Priority | Commercial · P1 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | Wedding timelines at {venue name} |
| Preview | A small tool your couples would thank you for. |
| Primary action | Reply, or a link to a two-minute example |
| Unsubscribe | Yes: manual suppression list, honoured before every send |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Venue research list, suppression list, founder time |
| Status | Not sent as a system email; prototype in src/emails/. Founder sends manually today. |
| Notes | Short, specific to the venue, one ask. Never templated-sounding even though it is templated. |

### `outreach.venue-final`

| Field | Value |
| --- | --- |
| Purpose | Closes the loop with a venue that has not replied, politely and finally. |
| Trigger | Founder sends manually after the first email gets no reply within two weeks. |
| Audience · Relationship | Venue contact · cold prospect |
| Classification · Priority | Commercial · P1 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | Closing the loop |
| Preview | Last note from me, with the door left open. |
| Primary action | Reply |
| Unsubscribe | Yes: manual suppression list; no reply means added to it |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Suppression list, founder time |
| Status | Not built. Founder sends manually today. |
| Notes | Two-email maximum for cold outreach: first and final. No sequence in between. |

### `outreach.venue-recap`

| Field | Value |
| --- | --- |
| Purpose | Recaps a call with a venue: what was discussed, what was agreed, what happens next. |
| Trigger | Founder sends manually after a venue call. |
| Audience · Relationship | Venue contact · engaged prospect |
| Classification · Priority | Commercial · P1 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | Notes from our call |
| Preview | What we agreed and what I will do next. |
| Primary action | Reply to confirm or correct |
| Unsubscribe | Yes: manual suppression list |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Founder time |
| Status | Not built. Founder sends manually today. |
| Notes | A structure template, not a copy template; every recap is bespoke. |

### `outreach.venue-founding-invitation`

| Field | Value |
| --- | --- |
| Purpose | Invites a warm venue to become a founding venue with founding terms. |
| Trigger | Founder sends manually to a venue that has shown real interest. |
| Audience · Relationship | Venue contact · engaged prospect |
| Classification · Priority | Commercial · P1 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | A founding-venue invitation |
| Preview | The terms, the ask, and what founding venues get. |
| Primary action | Reply to accept, or book a call (plain link) |
| Unsubscribe | Yes: manual suppression list |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Founding-venue commercial terms (src/lib/commercial-terms.ts), founder time |
| Status | Not built. Terms exist in code; the email does not. |
| Notes | Terms in the email must match src/lib/commercial-terms.ts exactly. |

### `outreach.venue-onboarding`

| Field | Value |
| --- | --- |
| Purpose | Walks a signed venue through setup: licence, codes, and how to hand codes to couples. |
| Trigger | Venue agreement signed. |
| Audience · Relationship | Venue contact · customer |
| Classification · Priority | Commercial · P1 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | Getting {venue name} set up |
| Preview | Three steps, ten minutes, and your first codes. |
| Primary action | Start setup (link) |
| Unsubscribe | Yes: manual suppression list |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Entitlements engine (feat/access-system), founder time |
| Status | Not built. Overlaps with venue.licence-confirmed; decide which sends when both exist. |
| Notes | Founder-voice onboarding beats system onboarding at current scale; revisit when volume grows. |

### `outreach.venue-review-request`

| Field | Value |
| --- | --- |
| Purpose | Asks an active venue how it is going and whether they would recommend it. |
| Trigger | Founder sends manually after the venue's first few redemptions. |
| Audience · Relationship | Venue contact · active customer |
| Classification · Priority | Commercial · P2 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | How is it going |
| Preview | One honest question, and one small ask if the answer is good. |
| Primary action | Reply |
| Unsubscribe | Yes: manual suppression list |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Redemption data, founder time |
| Status | Not built. |
| Notes | The ask (testimonial, referral, review) depends on the relationship; keep variants. |

### `outreach.school-first`

Prototype: yes

| Field | Value |
| --- | --- |
| Purpose | Opens a conversation with a school about project timelines and task tools for students. |
| Trigger | Founder sends manually, once the school segment opens. |
| Audience · Relationship | Teacher or coordinator · cold prospect |
| Classification · Priority | Commercial · P2 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | Project timelines for {school name} |
| Preview | A planning tool students actually keep using. |
| Primary action | Reply, or a link to a classroom example |
| Unsubscribe | Yes: manual suppression list |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Segment opening, school research list, suppression list |
| Status | Blocked by segment-sequencing decision, prototype only. Prototype in src/emails/. |
| Notes | Do not send in any form until the segment-sequencing decision is revisited. |

### `outreach.school-followup`

| Field | Value |
| --- | --- |
| Purpose | Single follow-up to a school that has not replied. |
| Trigger | Founder sends manually, two weeks after outreach.school-first. |
| Audience · Relationship | Teacher or coordinator · cold prospect |
| Classification · Priority | Commercial · P2 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | Following up |
| Preview | One more note, then I will leave you alone. |
| Primary action | Reply |
| Unsubscribe | Yes: manual suppression list; no reply means added to it |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Segment opening, suppression list |
| Status | Blocked by segment-sequencing decision, prototype only. |
| Notes | Same two-email maximum as venues. |

### `outreach.school-pilot-invitation`

| Field | Value |
| --- | --- |
| Purpose | Invites an interested school to run a structured pilot. |
| Trigger | Founder sends manually after a positive school conversation. |
| Audience · Relationship | Teacher or coordinator · engaged prospect |
| Classification · Priority | Commercial · P2 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | A pilot for {school name} |
| Preview | Free for a term, set up in a week, no obligation after. |
| Primary action | Reply to accept |
| Unsubscribe | Yes: manual suppression list |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Segment opening, pilot terms, entitlements engine |
| Status | Blocked by segment-sequencing decision, prototype only. |
| Notes | Pilot terms do not exist yet; this template waits on them. |

### `outreach.school-onboarding`

| Field | Value |
| --- | --- |
| Purpose | Walks a pilot school through setup: seats, classes, and the first student session. |
| Trigger | School pilot agreement confirmed. |
| Audience · Relationship | School coordinator · pilot partner |
| Classification · Priority | Commercial · P2 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | Getting {school name} started |
| Preview | Setup for you, then a five-minute start for students. |
| Primary action | Start setup (link) |
| Unsubscribe | Yes: manual suppression list |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Medium |
| Dependencies | Segment opening, school pilot flow |
| Status | Blocked by segment-sequencing decision, prototype only. |
| Notes | Overlaps with school.pilot-activated; decide which sends when both exist. |

### `outreach.teacher-forwardable`

| Field | Value |
| --- | --- |
| Purpose | A message written for a champion teacher to forward to colleagues or leadership. |
| Trigger | Founder sends to a champion teacher on request. |
| Audience · Relationship | Champion teacher, then their colleagues · engaged contact, then strangers |
| Classification · Priority | Commercial · P2 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | A tool your students can use free |
| Preview | Written to be forwarded. Everything a colleague needs in one screen. |
| Primary action | Try it with one class (link) |
| Unsubscribe | Yes: manual suppression list for the direct recipient |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Segment opening |
| Status | Blocked by segment-sequencing decision, prototype only. |
| Notes | Must stand alone with zero context; the forwarded audience never saw the thread. |

### `student.access-announcement`

| Field | Value |
| --- | --- |
| Purpose | Announces free student access to a student audience or channel. |
| Trigger | Student campaign launch, after the weddings wedge. |
| Audience · Relationship | Students · cold or channel-mediated prospects |
| Classification · Priority | Commercial · P2 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | Signal Tasks is free for students |
| Preview | Verify once, use it all year. |
| Primary action | Verify your student status (link) |
| Unsubscribe | Yes: manual suppression list, or list unsubscribe if sent to a subscribed list |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Student verification flow, campaign channel decision |
| Status | Queued behind weddings wedge. |
| Notes | Channel undecided: direct email needs a lawful basis; societies and student unions may be the better route. |

### `student.onboarding`

| Field | Value |
| --- | --- |
| Purpose | Gets a newly verified student from confirmation to first real use. |
| Trigger | Student verification approved and account active. |
| Audience · Relationship | Verified student · account holder |
| Classification · Priority | Commercial · P2 |
| Sender · Reply-to | Ethan McNamara · hello@signalstudio.ie, monitored |
| Subject | Getting started with your student access |
| Preview | One workspace, one deadline, five minutes. |
| Primary action | Set up your first project (link) |
| Unsubscribe | Yes: one-click stop link |
| Tracking | None. Plain personal mail, no pixels, no link tracking. |
| Sensitivity | Low |
| Dependencies | Student verification flow, entitlements engine |
| Status | Queued behind weddings wedge. |
| Notes | Overlaps with onboarding.welcome; students should not get both. Unresolved. |

---

## 14 · Editorial updates and the Dispatch

Subscribed-only. The Dispatch exists today as the suite changelog convention at signalstudio.ie/dispatch; an email edition does not exist.

### `editorial.release-announcement`

| Field | Value |
| --- | --- |
| Purpose | Announces a major product release to people who asked to hear about releases. |
| Trigger | Founder decides a release is announcement-worthy. Rare by design. |
| Audience · Relationship | Subscribers to product updates · subscribers |
| Classification · Priority | Editorial · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | New in {product}: {feature} |
| Preview | What it does and why it exists, in two sentences. |
| Primary action | See it in the product (link) |
| Unsubscribe | Yes: RFC 8058 one-click, updates list |
| Tracking | No per-recipient open pixels. Aggregate clicks only if a first-party redirect is added later. |
| Sensitivity | Low |
| Dependencies | Subscription capture and list management (neither exists yet), Resend |
| Status | Not built. No subscription list exists to send to. |
| Notes | Most releases go in the Dispatch changelog only; email is for the few that change how people work. |

### `editorial.dispatch-issue`

Prototype: yes

| Field | Value |
| --- | --- |
| Purpose | Delivers an email edition of the Dispatch: what shipped, what changed, what is next. |
| Trigger | Scheduled editorial send, proposed monthly. |
| Audience · Relationship | Dispatch subscribers · subscribers |
| Classification · Priority | Editorial · P2 |
| Sender · Reply-to | Signal Studio · hello@signalstudio.ie, monitored |
| Subject | The Dispatch · {month} {year} |
| Preview | What shipped, what changed, what is next. |
| Primary action | Read the full Dispatch (link to signalstudio.ie/dispatch) |
| Unsubscribe | Yes: RFC 8058 one-click, Dispatch list |
| Tracking | No per-recipient open pixels. Aggregate clicks only if a first-party redirect is added later. |
| Sensitivity | Low |
| Dependencies | Subscription capture, list management, editorial cadence, Resend |
| Status | Proposed, founder decision. The Dispatch is the suite changelog convention at signalstudio.ie/dispatch; an email edition does not exist. Prototype in src/emails/. |
| Notes | Whether an email edition should exist at all is the founder's call; the prototype is an argument, not a commitment. |

---

## Volume discipline

Signal Studio must not create the noise it claims to remove. These rules are hard limits, not guidelines:

- **One lifecycle email per user per week, maximum.** If two lifecycle triggers fire in the same week, the second one is dropped, not delayed into a queue.
- **Digests default weekly.** Daily is an explicit opt-in, never the default.
- **Every notification email is individually disableable.** One preference per notification type, in settings, honoured immediately.
- **No re-engagement drip sequences.** Ever. One nudge is a courtesy; a sequence is nagging. `onboarding.incomplete` sends once per account, `lifecycle.feedback-request` sends once per account, cold outreach is two emails maximum (first and final).
- **Transactional mail carries no marketing.** No cross-sell footers, no "while you are here" modules, no upgrade banners in receipts or security notices.
- **Cold outreach is founder-sent and suppression-checked.** No automation sends a cold email, and no address on the suppression list ever hears from us again.
- **Editorial is subscribed-only.** Nobody is added to the Dispatch or updates list as a side effect of signing up, buying, or joining a waitlist.
- **Governance and security notices always send.** They are the one category exempt from preferences, and they are held to the strictest content rules for exactly that reason.

## Priority rollout

**P0, cannot launch without.** The minimum honest email surface: people can get in, get their invitation, know when money fails, keep their receipts, and leave cleanly.

- `auth.verify-email`, `auth.sign-in-code`, `auth.magic-link`, `auth.password-reset` (delegated to Clerk today; owned templates are the replacement path)
- `access.waitlist-joined` (the known gap: entries persist, no email sends)
- `access.ready`
- `onboarding.welcome`
- `invite.workspace-invitation`
- `billing.payment-failed`
- `billing.purchase-confirmed`, `billing.receipt` (delegated to Stripe today; owned templates are the replacement path)
- The deletion sequence: `account.deletion-requested`, `account.deletion-scheduled`, `account.deletion-cancelled`, `account.deleted`
- `data.export-ready`

**P1, needed soon after.** Security notices (`auth.password-changed`, `auth.email-change-requested`, `auth.email-changed`, `auth.new-device`, `auth.suspicious-sign-in-blocked`, `auth.account-locked`, `auth.recovery-method-changed`), the rest of billing (`billing.vat-invoice`, `billing.subscription-started`, `billing.renewal-upcoming`, `billing.renewal-completed`, `billing.card-expiring`, `billing.final-payment-attempt`, `billing.payment-method-updated`, `billing.subscription-cancelled`, `billing.refund-issued`, `billing.access-ending`, `billing.moved-to-free`, `billing.event-workspace-expiring`), invitations (`invite.reminder`, `invite.accepted`, `collab.guest-joined`), onboarding (`onboarding.first-workspace-ready`, `onboarding.incomplete`), student verification (`student.verification-requested`, `student.verification-approved`, `student.verification-unsuccessful`), venue entitlements (`venue.licence-confirmed`, `venue.code-batch-ready`), product notifications (`tasks.assigned`, `notify.mention`, `tasks.deadline-reminder`, `timeline.published`, `workspace.permission-changed`, plus stewardship of the live `signal.briefing`, `tasks.daily-digest`, `tasks.share-link`), data rights (`data.export-requested`, `privacy.request-acknowledged`, `privacy.request-completed`, `privacy.policy-update`, `privacy.terms-update`), workspace deletion (`workspace.deletion-requested`, `workspace.deleted`), incidents (`incident.notice`, `incident.resolved`, `incident.security-notice`, pre-written), and the active founder venue mail (`outreach.venue-first`, `outreach.venue-final`, `outreach.venue-recap`, `outreach.venue-founding-invitation`, `outreach.venue-onboarding`).

**P2, later.** Everything gated or optional: all of section 7 and the school outreach set (blocked by the segment-sequencing decision), student outreach (`student.access-announcement`, `student.onboarding`, queued behind the weddings wedge), `student.verification-expiring`, the remaining venue notices (`venue.code-redeemed`, `venue.code-replaced-or-expired`), lifecycle mail (`onboarding.first-success`, `lifecycle.dormant-notice`, `lifecycle.limit-approaching`, `lifecycle.feedback-request`), the quieter workspace notices (`invite.expired`, `timeline.updated`, `workspace.owner-changed`, `workspace.archived`, `workspace.restored`, `workspace.connection-changed`), `data.export-link-expiring`, `outreach.venue-review-request`, and editorial (`editorial.release-announcement`, `editorial.dispatch-issue`, pending the founder decision on an email edition).
