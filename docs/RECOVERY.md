# Signal Studio — backup, restore and disaster recovery

**Owner:** Ethan (operator) · **Created:** 2026-06-19 · **Rewritten:** 2026-08-03 (E08.09)
**Status:** living document. Nothing in section 6 is done until it is checked.

**Read this first.** The 2026-06-19 version of this file described a plan
against infrastructure that has since changed and against a provider tier that
does not offer the feature it recommended. It has been rewritten to say what is
true on 2026-08-03, four weeks before the Venue Edition release. Where a thing
is not built, it says so in those words.

---

## 1. The honest position, in five lines

1. **No provider-side backup runs.** The Turso account is on the Free tier.
   Point-in-time recovery is a paid-tier feature, so it is not enabled, and
   the budget is zero (D-015 Q5).
2. **No scheduled dump runs.** Nothing anywhere takes a backup on a timer.
3. **One backup of production exists:** `db-archive/2026-07-31/` at the
   workspace root. It is a manual dump taken during the data-layer reset, it
   covers the **previous** generation of databases, it is a single copy on one
   laptop, and it had never been restored.
4. **A restore has now been rehearsed**, on 2026-08-03, against a real
   database with a real result. See section 4.
5. **The gap that remains is durability, not capability.** The tools to take
   and verify a backup exist and are tested. What does not exist is a schedule
   and an off-machine copy, and the second of those needs a founder decision.

---

## 2. What we depend on, and what failure means

| Provider | Holds | If it fails | Our control |
|---|---|---|---|
| **Vercel** | hosting, functions, crons, env vars | whole suite offline | none; wait it out |
| **Turso** | every database | data unreachable, or lost | logical dumps only (this document) |
| **Clerk** | identity, sessions | nobody can sign in; public pages still render | none |
| **Resend** | transactional email | email does not send | crons retry; no data loss |
| **Upstash** | rate limiting | limiter fails open by design | none needed |

Turso is the only provider whose failure can cause **permanent loss**.
Everything else is availability. Turso is therefore the whole of this
document.

## 3. Database inventory

Eleven databases, one per module per environment, each an independent
top-level Turso database in account `ethan387`, group `default`, **Free tier**.
Canonical map: `docs/INFRASTRUCTURE.md`.

| Database | Written by | Holds |
|---|---|---|
| `tasks-prod` / `tasks-preview` | app | workspaces, tasks, members, comments, attachments, share links |
| `notes-prod` / `notes-preview` | app · Notes | notes, calendar connections, preferences |
| `timeline-prod` / `timeline-preview` | app · Timeline | projects, milestones, activity |
| `signal-prod` / `signal-preview` | app · Signal | briefings, phrasing, feedback |
| `entitlements-prod` / `entitlements-preview` | app webhook + studio scripts | sponsors, founding numbers, license codes, redemptions, the audit ledger |
| `studio-prod` (no preview, by design) | studio | HQ content and operator state |

Credentials follow the one convention: `<MODULE>_DATABASE_URL` and
`<MODULE>_AUTH_TOKEN`.

**Two have the widest blast radius.** `tasks-prod` holds the couple's planning
content, which is the thing a couple would not forgive losing.
`entitlements-prod` holds the commercial record — who paid, which founding
place they hold, which couple redeemed which code — and losing it means
neither the venue's position nor the couple's access can be reconstructed.

---

## 4. Taking a backup, and verifying it

**A backup you have never restored is not a backup.** Every command below is
in the app repository.

```bash
# One module, on demand.
pnpm db:backup --module=tasks

# Every module you hold credentials for, each one restored and verified.
# Writes to db-archive/<date>/ at the workspace root, outside every repo.
pnpm db:backup:all

# Verify a backup that already exists.
pnpm db:restore-verify --backup=db-archive/2026-08-03/tasks.jsonl
```

`db:backup:all` **exits non-zero when it did not cover every module**. A
partial backup that exits green is how a database is discovered to be
uncovered on the day it is needed.

The verification is not a checksum of the file. It restores into a throwaway
local database, re-reads that database, and recomputes per-table row counts
and order-independent content hashes from what actually landed. It then checks
that every index and trigger came back. That last part matters more than it
sounds: a restore that replays every row and drops the triggers looks
completely correct and has silently lost an enforced invariant.

### The rehearsal, executed

**2026-08-03.** `tasks` database, 25 tables, 462 rows.

| Step | Result |
|---|---|
| Backup taken | 25 tables, 462 rows, 2 triggers, sha256 `2822995a1969…` |
| Restored into a throwaway database | complete |
| Row counts and content hashes recomputed from the restored copy | all 25 tables match |
| Indexes and triggers present after restore | no missing objects |
| **Elapsed** | **6.5 seconds** |
| Data integrity of the source, 16 invariants | 16 pass, 0 fail, 0 warn |

**What this rehearsal does and does not establish.** It establishes that the
dump format, the restore path and the verification are correct, on a database
with the production schema. It does **not** establish a recovery time for
`tasks-prod`, because it ran against a local file rather than over the network
against a remote database, and it did not include the step of repointing a
Vercel environment variable at a restored database. Those two steps are what
turn 6.5 seconds into the real number, and they have not been timed.

### The studio-side drill

```bash
pnpm recovery:drill      # in the studio repo
```

Builds the entitlements schema from the checked-in baseline, installs the
append-only audit triggers, writes representative commercial rows, dumps,
restores, re-verifies from the restored copy, and then **attempts an UPDATE
and a DELETE against the restored audit ledger and requires both to be
refused**. Last run 2026-08-03: 15 tables, 43 indexes, 2 triggers, passed in
1.9 seconds.

This replaced a script of the same name that created a two-row table called
`recovery_probe`, copied it to itself, compared the copy to the original and
exited zero. It could not fail. It has been deleted.

---

## 5. Restoring for real

There is no PITR to wind back to, so every restore is from a logical dump.

```bash
# 1. Verify the dump BEFORE touching anything live.
pnpm db:restore-verify --backup=db-archive/<date>/<module>.jsonl

# 2. Create a new database and restore into it. Never restore over the
#    original: the original is evidence until the restore is proven.
turso db create <module>-restore
# …then replay, and verify the restored database the same way.

# 3. Check integrity before cutting over.
pnpm db:integrity --url=<restored url> --token=<token>          # app side
pnpm entitlements:integrity --url=<restored url>                # studio side

# 4. Cut over by repointing <MODULE>_DATABASE_URL in Vercel, and redeploy.

# 5. If the restored database is the entitlements database, reinstall the
#    append-only audit triggers, which no schema tool will recreate:
pnpm audit:triggers && pnpm audit:triggers:verify
```

**Step 5 is not optional and is easy to forget.** drizzle cannot express a
trigger, so a database rebuilt from the checked-in baseline has an audit
ledger with no append-only enforcement. The hash chain still detects an edit
afterwards; nothing prevents one.

### Data loss window

With no scheduled backup, the window is **the time since someone last ran a
dump by hand**. On 2026-08-03 that is four days, against a set of databases
that has since been replaced. State this number, do not round it, and do not
describe recovery as a capability the product has until section 6 is checked.

---

## 6. What is not done (this is the whole point of the document)

- [ ] **A backup runs on a schedule.** Nothing does today. The obvious
      mechanism is a scheduled GitHub Action, and it is deliberately not
      built here: it would put couple planning data into GitHub Actions
      artifact storage, which is a data-handling and residency decision for
      the founder, not for a script. **Open founder decision.**
- [ ] **A backup exists somewhere other than one laptop.** Same decision,
      same reason.
- [ ] **A retention rule.** Nothing expires anything today.
- [ ] **A timed restore of a remote production database**, including the
      Vercel cutover, so the recovery time is a measured number rather than a
      local-file approximation.
- [ ] **Turso PITR**, if the tier ever changes. Not available on Free, and the
      budget is zero.
- [ ] **A pre-migration snapshot as a standing step.** The app's receipt-backed
      migration runner already dumps before it runs; the studio's hand-run
      migration scripts do not.

Until the first two are checked, the correct sentence about this product is
"backups are taken by hand and have been proven to restore", not "the data is
backed up".

---

## 7. Data-integrity verification

Distinct from backup, and it runs against live data.

```bash
pnpm db:integrity                  # app: 16 invariants over the tasks database
pnpm entitlements:integrity        # studio: 17 invariants over the commercial record
```

Both are SELECT-only by contract and refuse to run a check that is not a
SELECT. Both report a check they could not run as **skipped** rather than
passing it, because a check that quietly disappears when a migration has not
run is worse than no check.

The app's 16 cover orphaned tasks, share links with no workspace, attachments
and comments whose denormalised tenant key disagrees with their parent,
workspaces with no owner membership row, and a workspace claimed by two
venues at once. The studio's 17 cover two venues holding the same founding
place, a founding number assigned before payment cleared, a founding venue
recorded at the standard price, money received with no price agreement on
file, a code redeemed by two people, and an audit line with no chain hash.

Neither has been run against a production database. Both are proven against
databases built from the real migration SQL, with a test per check that plants
one violation and requires that check — and only that check — to report it.
