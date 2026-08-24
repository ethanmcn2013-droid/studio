# Privileged access review

**Current state:** not completed. This record defines the review required before procurement claims.

Review separately: Clerk production admins, Vercel team members, GitHub owners/maintainers, Turso org/database users, Sentry/Resend/Stripe/Google Workspace admins, support operators, CI service accounts and break-glass identities.

For each identity record: person/service, daily vs privileged identity, role, provider, MFA/passkey status, last-used date, purpose, approved-by, expiry/review date, and revocation receipt. Remove shared accounts and unused tokens. Run quarterly and on role change. Break-glass access requires two-person notification, time-bound credentials, post-use rotation and a security event.

**Open evidence:** provider exports, MFA/passkey screenshots or API receipts, GitHub/Vercel branch-protection export, and the signed quarterly review.

