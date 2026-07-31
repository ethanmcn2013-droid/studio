# Signal Studio operator checklist

These are the remaining actions that require Ethan or an external provider/legal/tester. They are intentionally written without technical assumptions.

1. In Clerk, open the production Signal Studio application, confirm the paid plan, turn on MFA/passkeys for administrators and operators, and send a screenshot/export showing the policy is enforced.
2. In Vercel, confirm production and preview use different databases and credentials. Remove any production credential from preview/development variables. Record the environment names and date checked.
3. In Vercel, set the production security-header configuration to the enforced nonce CSP and run the authenticated smoke check. If a browser feature breaks, fix the app before publishing the policy.
4. In Turso, confirm backup frequency/retention, perform a restore into a separate empty database, and record how long the restore took plus row counts, workspace counts and entitlement checks.
5. In Sentry, Resend, Stripe and analytics, enable body/header scrubbing and verify with a harmless test event that customer text, tokens and credentials do not appear.
6. In Stripe, confirm webhook signing is enabled and that duplicate event delivery is harmless. Save the event IDs and the resulting idempotency receipt.
7. Send the DPA, technical/organisational measures schedule, school posture and subprocessor/transfer register to legal counsel. Do not publish procurement claims until legal review is recorded.
8. Create `security@signalstudio.ie`, publish RFC 9116 `security.txt`, and send a test message from an outside account.
9. Run the incident tabletop using the runbook. Record attendees, decisions, response times and follow-up tasks.
10. Commission an authenticated multi-tenant penetration test covering Notes, Tasks, Timeline, Signal and the public/account/security/privacy/status surfaces. Remediate and retest every critical/high finding.

Until these receipts exist, the control register and trust centre must show the relevant items as open or in progress.
