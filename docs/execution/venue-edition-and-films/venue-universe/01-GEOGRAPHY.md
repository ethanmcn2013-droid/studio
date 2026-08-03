# The Greater Limerick boundary — E10.01, and the method behind E10.06

**Status:** Founder Review · **Written:** 2026-08-03 · **Executor:** Claude Code
**Ratified input:** D-012 · **Serves:** E10.04, E10.06, E10.12–E10.14, E13.03, E13.17

D-012 ratified the boundary as *a 45-minute drive-time ring from Limerick city
centre*, publicly described as **"Limerick and the surrounding counties"**. This
document turns that sentence into an exact, reproducible geometry, and reports
what the geometry turned out to mean — which is materially tighter than the
working assumption everyone has been carrying.

The same geometry drives the film map in E13.03 and the personalised renders in
E13.17, so it is built once and built to be re-run.

---

## 1. The anchor

**O'Connell Monument, The Crescent, Limerick — 52.6589231, -8.6317822.**

Resolved from OpenStreetMap on 2026-08-03. A named, permanent civic landmark at
the head of the city's main thoroughfare.

Two alternatives were considered and rejected only because a single point had to
be chosen, not because they are wrong: the OSM administrative centroid
(52.66125, -8.63012) sits 0.3 km away, and the OSM city place node (52.65327,
-8.61149) sits 1.5 km away. Across the whole ring, that choice moves a venue's
drive time by well under a minute. The anchor is documented for reproducibility,
not because it is delicate.

Moving the anchor is a change to the ratified geography and therefore goes
through change control.

## 2. How drive time is measured

Zero budget (D-015 Q5), so no paid traffic-aware routing. Two keyless public
engines are used instead, and **two rather than one on purpose** — a single
engine gives a number with no way to judge it, two give a spread, and the spread
is the honest error bar.

| Engine | Role | Why |
|---|---|---|
| Valhalla (OSM demo) | **the number** | Models turn costs and junction delay |
| OSRM (public demo) | cross-check | Independent implementation, same OSM data |

Across sixteen reference towns Valhalla returns consistently longer times than
OSRM — median 1.12x, range 1.02x to 1.25x — and the largest gaps are on short,
urban-heavy routes, which is exactly where a junction-blind engine should be most
wrong. That is a coherent result rather than noise, so Valhalla is the number.

Where the two disagree by more than 25% on a single venue, that is flagged. In
practice it means a bad coordinate, not a routing dispute.

**What this does not do.** Both engines route at free-flow speed limits. Neither
knows about live traffic, time of day, or a Saturday afternoon in Adare in July.
Real drive times are longer, by a margin nobody here can quantify without paid
data.

### The one thing that was thrown away

An earlier draft multiplied every result by a hand-set 1.18 "real-world" factor
derived from remembered drive times. That was fabricated precision — PROJECT.md
principle 6 — dressed up as rigour, and it is gone. The residual error is handled
by **widening the band that a human checks**, not by inventing a correction:

> **Boundary band: 38–52 minutes.** Any venue in it is close enough to the line
> that the model's known error could flip it. These are reported for confirmation
> before anyone relies on the classification.

That converts an unquantifiable error into a short, tractable list.

## 3. What the ring actually contains

Measured, not assumed. Valhalla minutes from the anchor:

| Town | Minutes | Road km | Ring |
|---|---|---|---|
| Adare, Co. Limerick | 18.1 | 18.5 | 30 |
| Bunratty, Co. Clare | 22.1 | 17.2 | 30 |
| Shannon, Co. Clare | 26.1 | 21.5 | 30 |
| Killaloe, Co. Clare | 28.9 | 30.8 | 30 |
| Nenagh, Co. Tipperary | 35.3 | 43.9 | 45 |
| Charleville, Co. Cork | 36.7 | 39.7 | 45 |
| Newcastle West, Co. Limerick | 38.8 | 42.6 | 45 · **confirm** |
| Tipperary town | 40.0 | 42.0 | 45 · **confirm** |
| Kilmallock, Co. Limerick | 40.1 | 40.4 | 45 · **confirm** |
| Ennis, Co. Clare | 40.4 | 40.4 | 45 · **confirm** |
| Gort, Co. Galway | 50.9 | 65.4 | outside · **confirm** |
| Glen of Aherlow, Co. Tipperary | 55.9 | 54.4 | outside |
| Mallow, Co. Cork | 58.3 | 65.7 | outside |
| Cashel, Co. Tipperary | 61.1 | 61.7 | outside |
| Mitchelstown, Co. Cork | 72.9 | 60.7 | outside |
| Listowel, Co. Kerry | 72.9 | 70.5 | outside |

**The ring is smaller than the programme has been assuming.** In plain terms it
is:

- **County Limerick** — effectively all of it. Newcastle West at 38.8 minutes is
  the far western edge and it still clears.
- **South, east and mid Clare** — Bunratty, Shannon, Killaloe, Sixmilebridge,
  Newmarket-on-Fergus, Quin, and Ennis at the outer edge. West Clare and the
  Burren are outside.
- **North Tipperary and Tipperary town** — Nenagh, Newport, Birdhill, the Lough
  Derg shore, Tipperary town at the edge.
- **Charleville, Co. Cork, and nothing else in Cork.** Mallow, Mitchelstown and
  Kanturk are all comfortably outside.

And it excludes, against the working assumption in the original research brief:

- **All of north Kerry.** Listowel is 73 minutes. Tarbert is nearer but the N69
  is slow.
- **All of south Galway.** Gort is 50.9 minutes and Loughrea is further.
- **Cashel and the Glen of Aherlow.** 61 and 56 minutes.
- **North Cork beyond Charleville.** Mallow is 58 minutes.

This matters commercially, not just cartographically: it removes four search
areas that a 125-account universe was implicitly counting on. Section 5 of
`03-UNIVERSE.md` reports what that does to the count.

## 4. Rings and clusters

Three bands inside the boundary, one carried outside it.

| Ring | Meaning |
|---|---|
| `15` | Limerick city and its immediate edge |
| `30` | The inner ring — Adare, Bunratty, Shannon, Killaloe |
| `45` | The outer ring — Nenagh, Ennis, Tipperary town, Charleville |
| `borderline_45_60` | **Not in the market.** Carried so the boundary decision stays visible, and so a shortfall can be answered with a costed option rather than a shrug |
| `out` | Beyond 60 minutes. Recorded and excluded |

Clusters follow the road corridors out of the city rather than county lines,
because that is how a founder thinks about a run of venues and how the film map
groups its dots: `limerick_city` · `west_limerick` · `east_limerick` ·
`south_limerick` · `shannon_estuary` · `ennis_mid_clare` · `lough_derg` ·
`north_tipperary` · `tipperary_aherlow` · `north_cork` · `north_kerry` ·
`south_galway`. The last three exist to hold excluded accounts, not to be sold to.

## 5. The public term

**"Limerick and the surrounding counties"** — ratified in D-012, unchanged here.

It is accurate against this geometry: the ring genuinely spans four counties
(Limerick, Clare, Tipperary, and a corner of Cork). It does not overclaim, and it
avoids "Greater Limerick", which is not a term anyone in Limerick uses about
themselves.

One caution for the sales surfaces: **do not publish the 45-minute figure or the
map as a promise of eligibility.** It is an internal market definition. A venue at
46 minutes that wants in should be able to get in on a founder judgement, and a
published boundary makes that a refusal instead of a decision.

## 6. Reproducing this

```bash
node studio/docs/execution/venue-edition-and-films/tools/venue-geo.mjs compare
```

Results are cached under `.geo-cache/`, so reruns are free and the numbers under
the analysis do not drift. Delete the cache to re-query.

`geocode` and `drivetime` are the same machinery applied to the venue file. Both
take and return JSON with no personal data in it — business names, towns and
coordinates only.

**Known environment trap:** Windows `curl` fails the TLS handshake to both
routing hosts (Schannel `SEC_E_ILLEGAL_MESSAGE`). Node's `fetch` uses OpenSSL and
works. Use the script, not curl.

## 7. What is open

1. **The boundary band needs a human pass.** Four reference towns and an unknown
   number of venues sit at 38–52 minutes. They need a founder call, not a better
   algorithm. Recommended default: **treat 45 minutes as guidance and let the
   fit of the venue break the tie**, since D-020 already established that
   Signal Studio does not screen venues out mechanically.
2. **The ring is tighter than planned, and that is a real constraint on the
   125-account target.** Costed options are in `03-UNIVERSE.md` §5.
