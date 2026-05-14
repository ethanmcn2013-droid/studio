# Entitlements · operator runbook

How to do common things to the shared `signal-entitlements` Turso DB
without dropping into raw SQL. Companion to
`tasks/docs/STRIPE_SETUP.md` (for billing wiring) and
`notes/docs/INBOUND_EMAIL_SETUP.md` (for N-1).

## Env vars you'll need (all on the **studio** Vercel project)

```
TURSO_ENTITLEMENTS_DATABASE_URL    # already set (E-1 2026-05-14)
TURSO_ENTITLEMENTS_AUTH_TOKEN      # already set
STUDIO_OPS_SECRET                  # NOT YET SET — needed for grant/expire endpoints
                                   #   suggested: openssl rand -hex 32
CRON_SECRET                        # used by reconcile endpoint
```

## Grant a tier manually

Use when a real user's Stripe grant didn't propagate, or to put a
pilot user on a tier without making them pay.

```bash
curl -X POST https://signalstudio.ie/api/internal/entitlements/grant \
     -H "Authorization: Bearer $STUDIO_OPS_SECRET" \
     -H "Content-Type: application/json" \
     -d '{
       "userClerkId": "user_3DOp...",
       "tier": "workspace",
       "source": "compliments",
       "sourceRef": "ops-2026-05-14-jane",
       "durationDays": 365
     }'
```

Valid `tier` values: `free, event, wedding, workspace, studio`.
Valid `source` values: `workspace_subscription, event_pass,
student_edu, venue_edition, compliments, review_access`.

Returns `{ ok: true, id: "e-…", created: true|false }`. `created:
false` means a row with the same `(userClerkId, source, sourceRef)`
already existed — the call is idempotent.

To make a perpetual grant, omit `durationDays` or pass `null`.

## Expire a grant

```bash
curl -X POST https://signalstudio.ie/api/internal/entitlements/expire \
     -H "Authorization: Bearer $STUDIO_OPS_SECRET" \
     -H "Content-Type: application/json" \
     -d '{"sourceRef":"ops-2026-05-14-jane"}'
```

Or match by Stripe subscription id:

```bash
... -d '{"stripeSubscriptionId":"sub_..."}'
```

Sets `expires_at = now` and `status = 'expired'`. Row stays — audit
trail is preserved.

## Run the reconcile sweep on demand

Daily sweep already runs from the Tasks digest cron at 09:00 UTC.
To trigger it sooner:

```bash
curl -X POST https://tasks.signalstudio.ie/api/internal/reconcile-entitlements \
     -H "Authorization: Bearer $CRON_SECRET"
```

Returns `{ ok: true, scanned, reconciled, skipped, failed }`. `reconciled`
is the number of Tasks-local rows that were missing from shared (the rare
crash-between-writes case). `skipped` is the common case — already in
sync.

## Inspect the shared DB directly

```bash
turso db shell signal-entitlements
```

Useful queries:

```sql
-- All active entitlements for a user
SELECT tier, source, source_ref, granted_at, expires_at
FROM entitlements
WHERE user_clerk_id = 'user_3DOp...'
  AND status = 'active'
ORDER BY granted_at DESC;

-- Most recently granted entitlements across the suite
SELECT user_clerk_id, tier, source, source_ref, created_at
FROM entitlements
ORDER BY created_at DESC
LIMIT 20;

-- Per-sponsor redemption funnel
SELECT s.name AS sponsor,
       count(lc.id) AS issued,
       sum(CASE WHEN lc.status = 'redeemed' THEN 1 ELSE 0 END) AS redeemed
FROM sponsors s
LEFT JOIN license_codes lc ON lc.sponsor_id = s.id
GROUP BY s.id;

-- Stripe events processed (shared dedup mirror)
SELECT source, event_id, processed_at
FROM processed_webhooks
ORDER BY processed_at DESC
LIMIT 10;
```

## Issue new comp codes for a sponsor

`scripts/issue-codes.ts` in the studio repo. Dual-writes to Studio
local + shared signal-entitlements + Tasks comp_codes.

```bash
cd ~/Projects/personal/studio
pnpm issue:codes lambs-hill 10 venue_edition wedding 365
```

`pnpm issue:codes <sponsor-slug> <count> [source-type] [tier] [duration-days]`.

## Troubleshooting

**A user paid but Roadmap/Analytics/Notes still show free.**
→ Check Tasks's local row first:
```sql
turso db shell ethanmcnamara-tasks
SELECT * FROM entitlements WHERE user_id = '<clerk-id>';
```
If the row is there, the mirror didn't propagate. Run the reconcile
endpoint (above). If the row isn't in Tasks either, the Stripe webhook
didn't fire — check Stripe's dashboard for delivery failure.

**`/api/checkout` redirects to `/pricing?status=checkout-offline`.**
→ Stripe env vars aren't set on Tasks Vercel. See
`tasks/docs/STRIPE_SETUP.md`.

**Manual grant returns 401 / studio-ops-secret-not-configured.**
→ Set `STUDIO_OPS_SECRET` on the Studio Vercel project. Use a long
random value — `openssl rand -hex 32`.

**The capture-email address doesn't receive mail.**
→ Resend Inbound + DNS isn't wired yet. See
`notes/docs/INBOUND_EMAIL_SETUP.md`.

## Audit grants

Anything granted off-Stripe via the operator endpoint carries
`metadata.origin = 'studio-ops'`. Audit periodically:

```sql
SELECT user_clerk_id, tier, source, source_ref,
       json_extract(metadata, '$.grantedAt') AS granted_iso
FROM entitlements
WHERE json_extract(metadata, '$.origin') = 'studio-ops'
ORDER BY created_at DESC;
```
