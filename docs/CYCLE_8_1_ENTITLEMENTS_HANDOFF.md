# Cycle 8.1 — Entitlements layer (handoff)

**Status:** code shipped + provisioned + migration applied + production env set 2026-05-13. Preview env deferred (see step 5 note).
**Plan reference:** `docs/VENUE_EDITIONS_PLAN.md` §6 Cycle 8.1.

The Drizzle schema, DB client, `getEntitlement()` read function, and seed script are committed. `pnpm typecheck` and `pnpm build` are clean. The only steps remaining are operator-side — provisioning the Turso DB, applying the migration, and wiring env vars on Vercel.

---

## 1 · Provision the Turso database

Run from anywhere — these touch Turso cloud, not the repo.

```bash
# Create the dedicated entitlements DB
turso db create ethanmcnamara-studio

# Get the libSQL URL — you'll need this for env vars
turso db show ethanmcnamara-studio --url

# Generate a full-access auth token (the studio repo needs writes — venue redemptions insert rows)
turso db tokens create ethanmcnamara-studio
```

Naming convention follows `ethanmcnamara-tasks` / `ethanmcnamara-analytics` precedent.

## 2 · Add env vars locally

Append to `~/Projects/personal/studio/.env.local` (create the file if it doesn't exist — `.gitignore` already excludes it):

```bash
TURSO_STUDIO_DATABASE_URL=libsql://ethanmcnamara-studio-<...>.turso.io
TURSO_STUDIO_AUTH_TOKEN=<token from step 1>
```

## 3 · Apply the migration

```bash
cd ~/Projects/personal/studio
pnpm db:push
# or, equivalently:
# turso db shell ethanmcnamara-studio < drizzle/0000_init_entitlements.sql
```

`pnpm db:push` is the cleaner path because Drizzle records the journal entry; the raw SQL shell route works but skips the journal write (fine if you only ever go through `db:push` afterwards).

## 4 · Seed a test row

Use a real Clerk user id from any of the four products so you can verify the read function from a logged-in surface:

```bash
# An indefinite-duration compliments entitlement (no expiry)
pnpm seed:entitlement user_abc123 studio compliments null

# A wedding-tier venue edition expiring 12 months from now
pnpm seed:entitlement user_abc123 wedding venue_edition $(node -e 'console.log(Date.now() + 365*24*60*60*1000)') lambs-hill-001
```

Verify by spinning up the dev server and calling `getEntitlement(clerkId)` from a debug route, or query directly:

```bash
turso db shell ethanmcnamara-studio "SELECT id, tier, source, expires_at FROM entitlements WHERE user_clerk_id = 'user_abc123';"
```

## 5 · Set env vars on Vercel

**Production — done 2026-05-13 (agent).** `TURSO_STUDIO_AUTH_TOKEN` set with `--sensitive`; `TURSO_STUDIO_DATABASE_URL` set unflagged. Both visible in `vercel env ls`.

**Preview — pending operator.** The Vercel CLI's `vercel env add … preview` (without a branch) requires explicit confirmation that the agent path gates against. Two options:

```bash
# Option A — add to all preview branches (operator-confirmed)
vercel env add TURSO_STUDIO_DATABASE_URL preview --value 'libsql://ethanmcnamara-studio-ethan387.aws-eu-west-1.turso.io' --yes
vercel env add TURSO_STUDIO_AUTH_TOKEN preview --value '<token from step 1>' --sensitive --yes

# Option B — add to a single preview branch (preferred for new feature branches per existing project pattern)
vercel env add TURSO_STUDIO_DATABASE_URL preview <branch-name>
vercel env add TURSO_STUDIO_AUTH_TOKEN preview <branch-name> --sensitive
```

**Deferral rationale:** no studio surface imports `@/lib/db` from a route yet, so preview deploys do not need the vars *to build*. Wire preview env when (a) studio starts reading entitlements from a route (Cycle 8.4+), or (b) you want to test entitlements behaviour on a preview branch.

**Note from Cycle 6.4 retro:** Vercel's "Sensitive" flag on env vars can block the agent path for some Turso operations. Auth token was flagged Sensitive intentionally; URL was left unflagged so future agent cycles can read it via `vercel env pull` if needed.

Then redeploy to pick up the new env:

```bash
vercel --prod
```

## 6 · Verify in production

**Skipped 2026-05-13** — no route reads the table yet, so a redeploy now would be a no-op build. Production verification rolls into Cycle 8.4 when `/hq/partners` becomes the first studio surface to query the entitlements DB.

**Local verification done 2026-05-13:** seed script inserted `user_test_seed_001 / wedding / venue_edition` row; `getEntitlement()` returns the row for that clerk id and Free defaults for an unknown id. Tier-rank logic confirmed via end-to-end script run.

---

## What this cycle did NOT ship (deferred to later cycles)

- **`sponsors` + `license_codes` tables** — Cycle 8.2. They'll be a second migration on the same DB.
- **`/redeem/[code]` route** — Cycle 8.2.
- **Cross-product consumption pattern** — how does Tasks read this entitlement when it lives on a different repo's DB? Cycle 8.3 decision. Likely approach: Tasks gets a read-only Turso token to `ethanmcnamara-studio` and imports a copy of `getEntitlement()` (per the Cycle 6.3 precedent where signal read tasks's DB).
- **Paywall rewiring across the four product repos** — also Cycle 8.3+.

## Acceptance checklist for Cycle 8.1

- [x] `entitlements` schema defined in `src/lib/db/schema.ts`
- [x] DB client in `src/lib/db/index.ts` with helpful env-missing error
- [x] `getEntitlement(clerkId)` read function returns highest-rank active entitlement (or Free default)
- [x] Drizzle migration generated at `drizzle/0000_init_entitlements.sql`
- [x] Seed script `scripts/seed-entitlement.ts` runnable via `pnpm seed:entitlement`
- [x] `pnpm typecheck` clean
- [x] `pnpm build` clean
- [x] **Operator:** `ethanmcnamara-studio` Turso DB provisioned (2026-05-13)
- [x] **Agent:** `.env.local` populated with `TURSO_STUDIO_DATABASE_URL` + `TURSO_STUDIO_AUTH_TOKEN` (2026-05-13)
- [x] **Agent:** migration applied via `turso db shell ethanmcnamara-studio < drizzle/0000_init_entitlements.sql` (2026-05-13); schema + 2 indexes verified in prod
- [x] **Agent:** seed script verified end-to-end against prod (test row `user_test_seed_001` + getEntitlement returns expected shape)
- [x] **Agent:** Vercel **production** env vars set (`TURSO_STUDIO_AUTH_TOKEN` sensitive, `TURSO_STUDIO_DATABASE_URL` standard)
- [ ] **Operator (deferred):** Vercel **preview** env vars — wire when studio starts reading entitlements from a route (Cycle 8.4+), or when a feature branch needs to test the layer
- [ ] **Operator (deferred):** redeploy — no production surface reads the table yet, so rolls into Cycle 8.4

**Cycle 8.1 is functionally closed.** The two deferred items are scoped into Cycle 8.4 by design. Cycle 8.2 (`sponsors` + `license_codes` + `/redeem/[code]`) can start.

## Test data left in prod

A single test row exists in `entitlements`:

```
id:           719c8e43-3ab5-44f9-b395-c9335324467c
user_clerk_id: user_test_seed_001
tier:         wedding
source:       venue_edition
source_ref:   lambs-hill-test-001
expires_at:   ~2027-05-13 (12 months from seed)
```

Leave it for now — useful as a known-good fixture during Cycle 8.2/8.3 development. Delete via `DELETE FROM entitlements WHERE user_clerk_id = 'user_test_seed_001';` when Cycle 8.3 ships its own test infrastructure.
