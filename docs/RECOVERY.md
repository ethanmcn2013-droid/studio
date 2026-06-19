# Signal Studio — Backup & Recovery Runbook

**Owner:** Ethan (operator) · **Created:** 2026-06-19 · **Status:** living document
**Why this exists:** the production-readiness audit (2026-06-18) flagged the single
*Critical, irreversible* risk in the suite — **no verified database backups and no
rehearsed restore.** Every product's data lives in Turso (libSQL/SQLite). A bad
migration, an accidental `DROP`, or a `delete` without a `WHERE` is unrecoverable
unless backups exist and a restore has actually been practised. This runbook is the
plan; the **action items at the bottom are not done until checked off.**

---

## 1. What we depend on (and what happens when each is down)

| Provider | Holds | If it goes down | Our control |
|---|---|---|---|
| **Vercel** | hosting, functions, crons, env vars | whole suite offline | none — wait it out; status.vercel.com |
| **Turso** | every product's database | data unreachable / unwritable | backups + restore (this doc) |
| **Clerk** | identity, sessions | no one can sign in (public pages still render) | none — read-only/guest UX degrades gracefully |
| **Resend** | transactional + briefing email | email doesn't send | crons retry next run; no data loss |
| **Upstash** (when provisioned) | rate-limit + cache | limiter fails *open* (allows) by design | none needed — degradation is safe |

The only provider whose failure can cause **permanent loss** is Turso. Everything else
is availability, not durability. So Turso backups are the priority.

---

## 2. Database inventory

Each product is a separate Turso database (no shared primary). Confirm the exact DB
names in the Vercel env of each project; by purpose:

| Product / repo | Env var(s) | Database purpose |
|---|---|---|
| **tasks** | `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | tasks, workspaces, members, comments, attachments |
| **notes** | `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | notes, calendar connections, prefs |
| **roadmap (Timeline)** | `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` | workspaces, projects, tasks, subtasks, activity |
| **analytics (Signal)** | `TURSO_ANALYTICS_DATABASE_URL` / `_AUTH_TOKEN` (main) · `TURSO_DATABASE_URL` (prefs) | analytics users, phrasing rotations, briefing feedback, user prefs |
| **studio** | `TURSO_*` (main) · entitlements DB | sponsors, license codes, redemptions, cron runs, entitlements |
| **shared** | `TURSO_ENTITLEMENTS_DATABASE_URL` / `_AUTH_TOKEN` | cross-suite tier entitlements (read by several products) |

The **entitlements DB** is the one shared blast-radius — losing it affects tier
enforcement across products. Back it up with the same priority as the product DBs.

---

## 3. Backup strategy (the work to do)

Turso provides point-in-time recovery and scheduled backups on paid tiers; on the
free/starter tier, take logical dumps on a schedule.

**Recommended, in priority order:**

1. **Enable Turso point-in-time restore (PITR)** on every production DB above
   (Turso dashboard → database → Backups, or `turso db config` via CLI). This is the
   single highest-leverage step — it covers the "bad migration / accidental delete"
   case with a wind-back rather than a stale dump.

2. **Daily logical dump as a belt-and-braces** — a scheduled job (Vercel cron or a
   GitHub Action with the Turso token as a secret) running, per DB:
   ```bash
   turso db shell "$DB_NAME" ".dump" > "backup-$(date +%F).sql"
   ```
   …uploaded to durable storage (Vercel Blob, S3, or a private repo). Keep ≥ 14 days.

3. **Pre-migration snapshot** — before any destructive schema change (a `DROP`,
   a column-rename, a NOT-NULL tightening), take an on-demand dump first. See §5.

---

## 4. Restore procedure (and the rehearsal that makes it real)

**A backup you have never restored is not a backup.** Rehearse this once, now, into a
throwaway DB — then you know it works and how long it takes.

**PITR restore (preferred):**
```bash
# Restore a DB to a point in time into a NEW name, verify, then cut over.
turso db create <product>-restore --from-db <product> --timestamp <ISO-8601>
turso db shell <product>-restore "SELECT count(*) FROM <a-known-table>;"   # sanity
# Cut over by repointing the Vercel env var to the restored DB, or copy data back.
```

**Logical-dump restore:**
```bash
turso db create <product>-restore
turso db shell <product>-restore < backup-YYYY-MM-DD.sql
turso db shell <product>-restore "SELECT count(*) FROM <a-known-table>;"   # sanity
```

**Rehearsal checklist (do once before launch):** pick one product → restore yesterday's
state into `<product>-restore` → confirm row counts look sane → time how long it took →
delete the throwaway DB → record the elapsed time in the action items below.

---

## 5. Migration safety

Turso/SQLite migrations that recreate tables (the create-copy-drop-rename pattern, used
e.g. in `roadmap/drizzle/migrate-prod.sql`) are **destructive if interrupted**. Rules:

1. **Snapshot first** — on-demand dump of the target DB before running (see §3.3).
2. **Dry-run on a copy** — restore prod into `<product>-staging`, run the migration
   there, verify, *then* run on prod.
3. **One at a time, verified** — after each destructive step, check row counts against
   the pre-snapshot.

See `roadmap/drizzle/MIGRATIONS.md` for that repo's specific workflow (it deploys schema
via `drizzle-kit push`, not `migrate`, so its `.sql` files are reference/historical, not
an automatically-applied chain).

---

## 6. Action items (NOT done until checked)

- [ ] Enable Turso PITR on every production DB in §2 (incl. the shared entitlements DB).
- [ ] Stand up the daily logical-dump job + durable upload (≥ 14-day retention).
- [ ] **Rehearse one restore** into a throwaway DB and record the elapsed time here: `____`.
- [ ] Document, per product, which Turso DB name maps to which Vercel project (fill §2).
- [ ] Add the pre-migration snapshot step to the deploy ritual for any destructive change.

When the first three are checked, the suite's one Critical, irreversible risk is closed.
