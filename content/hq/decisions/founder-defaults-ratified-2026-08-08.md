# Founder defaults ratified — 2026-08-08

Ethan approved the recommended defaults from the consolidated founder-to-do
audit. Email sending remains disabled: this decision record authorises no test
email, invitation, notification, campaign, or proof-order message.

## Ratified decisions

- Keep Clerk and Turso; review Supabase only at a documented cost/limit cliff,
  a paying multi-seat/SSO requirement, or a Postgres-only data requirement.
- Keep the unified Clerk application invite-only.
- Use one least-cost EU Upstash store for the unified app.
- Use PostHog Cloud EU, cookieless and consent-gated, with session replay off.
- AI beta guardrails: EUR 25 monthly budget; alerts at 50%, 80%, and 100%;
  EUR 0.25 per user per day as the application hard-cap policy.
- Retain `Open project` and `Season` as the product vocabulary.
- Do not expose premium in-app themes; keep auth and checkout Delight phases
  closed.
- Keep private support repositories private and use procedural enforcement
  while Ethan remains the only committer.
- Use Ethan as the sole named HQ operator in the interim; mutations remain
  fail-closed without attribution.
- Revoke the Studio preview bypass.
- Treat 1 September as a readiness review. Public opening is an explicit
  environment change and deploy after a separate go/no-go decision.
- Ratify the commercial contract encoded in
  `contracts/commercial-terms.v2.json`: Pro EUR 120/year with unlimited
  workspaces; Student EUR 9.99/year, three workspaces, verified eligibility
  and annual re-verification; retire Committee; owner/admin-only invitations;
  authenticated guests can view/comment, link viewers are read-only; Event
  becomes read-only after 12 months and refunds revoke access; Schools stays a
  manual-quote pilot; no automatic launch; no open paid-feature trial.

## Execution boundary

Agents may implement and verify these choices, including provider and
deployment configuration. Any action that sends email remains manual and
disabled until Ethan explicitly changes that boundary.
