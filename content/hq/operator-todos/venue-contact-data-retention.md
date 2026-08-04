---
id: venue-contact-data-retention
title: Decide the lawful basis and retention position for venue contact data already in the repo
status: open
priority: P0
blocking: false
phase: Phase 2
why: named individuals' contact details are committed as application source and as an unencrypted production dump — an Irish company holding EU personal data with no recorded basis.
href: /hq/company
date: 2026-08-03
---

Found by the WP-02 venue-universe research on 2026-08-03 during a read-only sweep
of the workspace. Recorded as **R-032** in the VEF-2026 RAID register.

WP-02's own output is clean and held clean by a guard and its tests. This is
about material that already existed, and only the founder can decide a data
retention or lawful-basis position — which is why it is here and not in the
project's founder-review queue.

## What was found

| File | Data |
|---|---|
| `studio/src/lib/hq/data.ts` | Contact name, job title, business email, phone and postal address with Eircode, across ~50 venue rows plus a similar block of school and student rows. **Committed as application source.** |
| `db-archive/2026-07-31/signal-studio.sql` | The same fields as an unencrypted production dump of 148 prospect rows. |
| `studio/signal-growth/outbound/wedding-venue-list.md` | Personal names, emails and a third-party mobile number, harvested from testimonials and review sites rather than from the individuals. |
| `db-archive/.../signal-tasks*.sql` | User and sponsor email addresses. |

The last one also directly contradicts the house rule already written in
`studio/docs/strategy/VENUE_TARGET_LEDGER.md`: contact details stay blank until
independently verified from a current public source or a direct relationship.

## Steps

1. Decide the lawful basis for holding the existing rows, and the retention
   period. Legitimate interest for B2B business contacts is the likely answer,
   but it needs to be a recorded decision rather than an assumption.
2. Decide whether the harvested names in `wedding-venue-list.md` are kept at all.
   They were taken from review sites, not given.
3. Confirm the CRM is the single store, and that repo copies are removed rather
   than merely stopped being updated.
4. Say whether the `db-archive/` dumps should be retained, encrypted, or deleted.

Once decided, engineering strips the committed source file and the dumps. The
pattern to move to already exists: `private/venues.template.csv` deliberately has
no contact column, and `venue-export.mjs` refuses to write one — contacts live in
the CRM and join on `account_id`.

**Do not delete anything before step 1.** Deleting records that may need to be
produced later is its own problem.
