---
id: apply-venue-edition-terms-migration
title: Apply the Venue Edition terms migration to the production entitlements DB.
status: open
priority: P0
blocking: true
phase: Phase 2
why: REOPENED. Verified by direct query 2026-08-03 — the first pass is live, the second is not. founding_number and founding_number_assigned_at are absent from entitlements-prod, so a founding place has nowhere to be written.
href: /hq
date: 2026-08-03
---

## REOPENED 2026-08-03 — the second pass did not land

**This file said done. The database says otherwise.** Verified by reading the live
schema of `entitlements-prod` directly, not by inference:

| Column | State |
|---|---|
| `entitlements.wedding_date` | **present** — first pass. D-022 is live. |
| `sponsors.allotment_mode` | **present** — first pass. D-020 is live. |
| `sponsors.annual_wedding_count` | **present** |
| `sponsors.fair_use_ceiling` | **present** |
| `sponsors.founding_number` | **ABSENT** |
| `sponsors.founding_number_assigned_at` | **ABSENT** |
| unique index on `founding_number` | **ABSENT** — `sponsors` carries only `sqlite_autoindex_sponsors_1` and `sponsors_slug_unique` |

**The good news, and it is real.** R-015 and R-016 are live in production. The couple
access term and the unlimited entitlement both work today. Anything saying otherwise,
including section 1.3 of the Wave 2 packet, is out of date and is corrected here.

**What was actually broken.** `src/lib/account/live/load-venue-access.ts` selected
`founding_number`, so one absent column took the whole live venue list dark with
"Live venues could not be reached". That select is now defensive: the founding number
is attempted and degrades to null on failure, because a founding number is a label
and the venue list is the surface. So the Account no longer depends on this migration.

**But E02.13's `assignFoundingNumber` still has nowhere to write**, and D-009 point 6
promises every founding venue a number on cleared payment.

**What to run — the same guided command.** It skips everything already applied and
adds only the two columns and the index. You are looking for `VERIFIED` naming six
columns rather than four. No existing row is changed, and if two venues somehow held
the same number it refuses to create the unique index and names the clash rather than
half-applying.

```
pnpm venue:migrate-terms:setup
```

**Worth pausing on.** A todo marked done for work that did not land is worse than one
left open: it takes the item off the list and out of everyone's attention. Whatever
happened on the second pass, it did not reach the database and nothing checked. The
fix for the class of problem is a schema assertion in `pnpm test` that fails when the
deployed schema is behind `schema.ts`, so the next gap is caught by a gate rather than
by someone querying by hand.

---

## Superseded — the earlier claim that both passes had applied

The text below was written on 2026-08-03 and is left in place because nothing here is
rewritten silently. Its first-pass account is correct. Its second-pass account is not.

Ethan ran the second pass and confirmed it. All six columns and both indexes are
on the production entitlements database:

- `entitlements.wedding_date` — the ratified couple access term (R-015, D-022)
- `sponsors.allotment_mode`, `annual_wedding_count`, `fair_use_ceiling` — the
  unlimited entitlement (R-016, D-020)
- `sponsors.founding_number`, `founding_number_assigned_at` plus a unique index
  — the Founding Venue place (E02.13, D-009 point 6)

No existing venue was changed by either pass. No venue is on unlimited, and no
number is assigned — both are deliberate per-venue actions taken at onboarding
and on cleared payment respectively.

**One thing still missing, recorded so it is not mistaken for done:** nothing
detects a cleared payment automatically, so the first founding numbers need an
operator action that does not exist until E08. The field is ready; the trigger
is not.

---

## The second pass — what it added

**The first pass is done.** Ethan ran it and reported `VERIFIED` with
`sponsors on unlimited: 0`. The four access-term and entitlement columns are on
the production database and no existing venue was changed. R-015 and R-016 are
live.

**Then E02.13 landed and the migration grew.** It now also adds:

- `sponsors.founding_number` — the Founding Venue place, 01/25 to 25/25
- `sponsors.founding_number_assigned_at`
- a **unique index** so two venues can never hold the same number

D-009 point 6 promises every founding venue a number assigned on cleared
payment, and until this runs there is still nowhere to store one.

**Same command, same three prompts.** It skips everything already applied and
adds only the two new columns and the index:

```
pnpm venue:migrate-terms:setup
```

Your credentials are already saved, so it goes straight to the practice run.
You are looking for `VERIFIED` again — the line now names six columns rather
than four.

One extra safety: if the database somehow already held two venues on the same
number, the migration **refuses to create the unique index** and tells you
which numbers clash, rather than half-applying.

---

## The first pass — 2026-08-03

**What is live now.** A couple's access can carry a wedding date and run to three
months past the wedding day, and a venue can hold the unlimited entitlement.
**What is not yet true:** no venue has been switched to unlimited. That is a
per-venue action taken at onboarding, and the HQ form now defaults to it.

---

## What this was, in plain English

Two things you have already decided cannot actually happen in the live database
yet.

A couple's access should last until three months past their wedding day. A
founding venue's entitlement should be every couple they book. The database has
no place to put a wedding date, and no way to say "unlimited", so today it does
neither. The code that does both is written and tested. This adds the four empty
columns it needs to write into.

**It cannot break anything.** It only adds new empty columns. It changes no
existing row, switches no venue to unlimited, and is safe to run twice.

Takes about five minutes, most of which is finding the password.

---

## Before you start: get two values from Turso

1. Go to **https://turso.tech** and sign in.
2. Find the database called **entitlements-prod** and open it.
3. You need two things from that page. Keep the tab open, you will paste them in
   a moment.
   - the **database URL** — it starts with `libsql://`
   - a **token** — a long string of letters and numbers

If there is no obvious token on the page, look for a button along the lines of
"Create token" or "Generate token" and make one. A read-only token will not
work; this needs to be able to write.

---

## Step 1 — Open a terminal in the right folder

1. Press the **Windows key**, type `powershell`, press **Enter**. A blue window
   opens.
2. Copy the line below, paste it into that window, press **Enter**:

```
cd C:\Users\ethan\signal-studio-workspace\studio
```

Nothing visible happens. That is correct — it just moved to the right folder.

---

## Step 2 — Run the one command

Copy, paste, **Enter**:

```
pnpm venue:migrate-terms:setup
```

---

## Step 3 — Answer the questions

The command walks you through it. There are three moments where it stops:

**It asks for the Database URL.** Paste it from the Turso tab, press Enter.
In PowerShell you paste with a **right-click**, not Ctrl+V.

**It asks for the Token.** Paste, press Enter. Nothing appears as you paste —
that is normal, it is not showing the secret back to you.

**It shows you the database name and asks you to confirm.** This is the only
part that needs your attention. Read the name it prints and check it is the
production database, not a preview one. Then type `yes` and press Enter.

If anything looks wrong at that point, just press **Enter** on its own. It stops
and changes nothing.

---

## Step 4 — Check it worked

You are looking for these two lines near the end:

```
[signal-entitlements] sponsors on unlimited: 0
[signal-entitlements] VERIFIED — wedding_date, allotment_mode, annual_wedding_count, fair_use_ceiling present.
```

`VERIFIED` means the four columns landed.

`sponsors on unlimited: 0` means no existing venue was changed. That is correct
and deliberate — switching a venue to unlimited is a separate thing you do per
venue when you onboard it.

Then tell Claude it is applied. Nothing to deploy, no restart.

---

## If something goes wrong

Whatever the message, **nothing partial happens**. It either does the whole job
or it does none of it, and it can be re-run safely once fixed.

| What you see | What it means |
|---|---|
| `That does not look like a database URL` | The paste picked up the wrong thing. Copy the URL again, the one starting `libsql://`. |
| `That token has a space in it` | The paste got cut short or grabbed extra text. Copy the token again. |
| `STOPPED — no database credentials found` | Nothing was saved. Just run the command again. |
| `The practice run did not succeed` | Send Claude the lines it printed. |
| `STILL MISSING` instead of `VERIFIED` | Send Claude the lines it printed. |
| `pnpm: command not found` | Wrong folder. Repeat Step 1, then Step 2. |

Your existing `.env.local` is copied to a timestamped backup before anything is
added to it, and existing lines are never rewritten.

---

## If you would rather not do this yourself

Send Claude the two values and it will run the whole thing and show you the
output. It did not do that during WP-01 because writing to the production
database is not something it does without you saying so.

---

## Backup

Turso keeps point-in-time restore, so a manual dump is not needed for a change
that only adds empty columns. The last full dump is at
`db-archive/2026-07-31/signal-entitlements.sql` if you want one anyway.

---

## Target

Before UI-freeze, 2026-08-20 (D-008), and before any venue is contacted.

## Verification already done

Five tests against a real database engine, wired into `pnpm test`:

- adds every column and index, and does nothing on a second run
- **no existing venue silently becomes unlimited**, including venues whose
  allotment is already blank
- existing rows survive untouched
- the practice run applies nothing
- it refuses to run at all if the base tables are missing

The guided command itself was tested three ways: a bad URL is refused without
writing anything, pressing Enter at the confirmation applies nothing, and the
full run lands all four columns.

`studio/scripts/migrate-venue-edition-terms.test.mjs` ·
`studio/scripts/venue-terms-setup.mjs`
