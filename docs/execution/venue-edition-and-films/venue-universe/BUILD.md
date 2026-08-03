# Rebuilding the venue universe

One command per stage, in this order. Everything is cached, so a rerun is cheap
and the numbers under the analysis do not drift.

Run from `studio/docs/execution/venue-edition-and-films/`.

```bash
RESEARCH=<path to the discovery JSON directory>

node tools/venue-merge.mjs      merge     "$RESEARCH" /tmp/merged.json
node tools/venue-geo.mjs        geocode   /tmp/merged.json /tmp/geocoded.json
node tools/venue-geo.mjs        drivetime /tmp/geocoded.json /tmp/routed.json
node tools/venue-coord-audit.mjs          /tmp/routed.json /tmp/coord-audit.json
node tools/venue-rank.mjs       compare   /tmp/routed.json /tmp/compare.json
node tools/venue-rank.mjs       cohorts   /tmp/routed.json convert private/cohort-1.json
node tools/venue-export.mjs     csv       /tmp/routed.json private/venues.csv
node tools/venue-export.mjs     report    /tmp/routed.json venue-universe/counts-only.md
node --test tools/venue-universe.test.mjs
```

## What is durable and what is regenerable

**Durable — edit these, they survive every rebuild:**

| File | Holds |
|---|---|
| `venue-universe/account-ids.json` | The CRM join key per venue. Never reused, never recomputed. |
| `venue-universe/overrides.json` | Every decision a person made: confirmed merges, eligibility calls, corrected coordinates, group ownership. |

**Regenerable — never hand-edit, the next build overwrites them:**
`merged.json` · `geocoded.json` · `routed.json` · `private/venues.csv` ·
`venue-universe/counts-only.md` · the cohort files.

This split exists because it was learned the hard way. Three separate times a
rerun silently destroyed hand-set values: researched coordinates nulled by a
failed geocode, manual ring classifications wiped by the routing pass, and
account IDs reshuffled by re-sorting. If a judgement is not in `overrides.json`,
assume the next rebuild will lose it.

## Where things go

- **`private/`** — gitignored. The operational CSV and the cohort files, because
  they carry the full research per named venue.
- **`venue-universe/`** — committed. The analysis, the ID ledger, the overrides,
  and a counts-only report that never names a venue.
- **`.geo-cache/`** — gitignored. Delete to re-query the geocoder and both
  routing engines.

## Checks that must pass

```bash
node --test tools/venue-universe.test.mjs        # 25 tests
node tools/venue-export.mjs guard <any file>     # strict personal-data audit
node tools/venue-coord-audit.mjs <routed.json>   # coordinates are where research says
```

`venue-export.mjs` refuses to write anything containing an email address, a phone
number, a contact-shaped column, or a `buyer_role` outside the five permitted
roles. `venue-merge.mjs` refuses to write two accounts sharing an ID.

**Run the coordinate audit again before E13.17 renders anything.** It exists
because a geocoder matched a venue name to an industrial estate and put a venue
from an hour away into Cohort 1. A wrong coordinate there puts a real venue's
name on the wrong dot in a film that gets emailed to that venue.

## Environment traps

- Windows `curl` fails the TLS handshake to both routing hosts
  (Schannel `SEC_E_ILLEGAL_MESSAGE`). Node's `fetch` uses OpenSSL and works. Use
  the scripts, not curl.
- Nominatim allows one request a second and the scripts honour that, so a cold
  geocode of ~170 venues takes several minutes. The cache makes reruns instant.
- `weddingdates.ie`, `hitched.ie` and several regional press sites return HTTP
  403 to automated fetches. They load normally in a real browser.
- The web-search budget is **session-wide, not per agent**. A late researcher can
  inherit zero. Plan the order, or raise the cap first.
