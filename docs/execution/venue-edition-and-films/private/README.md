# private/

**Template and handling guidance only. This directory is not a data store.**

Everything here except this README and `venues.template.csv` is gitignored
(`studio/.gitignore`).

## Never commit

- Credentials, access tokens, API keys.
- Private personal contact data — names, direct emails, phone numbers, postal
  addresses of real people at real venues.
- Signed contracts.
- Private couple data.
- Private correspondence.
- Unredacted legal or financial records.

## The source of truth for venue contacts is not this folder

Signal HQ and the CRM own venue accounts and contacts. Project files reference a
**stable account ID**, never a duplicated contact record. Duplicating contact
data here creates a second, staler copy that nobody maintains and that leaks the
moment the repo is shared.

`studio/docs/strategy/VENUE_TARGET_LEDGER.md` already carries the house rule:
contact names and emails stay blank until independently verified from a current
public source or a direct relationship.

## The working file

`venues.csv` is the live operational file. It is gitignored. Use
`venues.template.csv` as its shape.

If a future secure-data policy makes a tracked venue file appropriate, that is a
founder decision recorded in `DECISIONS.md` before anything changes — not an
exception someone takes in the moment.

## What generated reports may contain

Counts only. `STATUS.md` reports how many venues are researched, invited,
signed, paid and onboarded. It never names one. `validate` fails if anything
resembling an email address reaches the commercial tracker, and a test asserts
no email or phone pattern appears in `STATUS.md`.

Venue names are published as participants only with recorded consent
(E10.14, E15.16).
