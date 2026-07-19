# Signal HQ — Operating System Architecture

**Status:** Ratified 2026-07-12 · Living document — update when HQ structure changes.
**Programme:** Full HQ research → diagnosis → strategic models → panel review → target architecture → implementation.
**Baseline audited:** `origin/main` @ `2cdc05d`, 2026-07-12.

---

## 1. Executive diagnosis

Signal HQ grew from 5 rooms to 43 top-level routes in eight weeks (2026-05-11 → 2026-07-12). Each room is individually good; the *system* stopped being one. The failure is not "too many pages" — it is five specific root causes:

1. **Three hand-maintained partial registries.** The shell nav listed 8 rooms, the home hub board 12, the command palette 27 — against 43 real routes. All three drifted independently (the palette linked to `/hq/copy-review`, a route that does not exist). There was no canonical answer to "what rooms exist?"
2. **No lifecycle.** Every initiative became a permanent top-level room. Decided design rooms (poster, cards, café card, partner card) sat beside live consoles forever. Nothing ever left; entropy was structural, not behavioural.
3. **Nav verbs mapped to single rooms.** `sell` → `/hq/crm`, `run` → `/hq/vault`, `make` → `/hq/design-rooms`. The verb vocabulary (Sell/Make/Tell/Run) broke on contact with real rooms within weeks — `readiness`, `access`, `lab` had to be smuggled in beside the verbs. "Tell" was ambiguous (tell whom?); "Run" became a junk drawer.
4. **No shared page anatomy.** Three-plus CSS class families (`.hq-page-*`, `.vault-*`, `.hq-crm-*`, `.hq-dr-*`) plus heavy inline styles; six-plus status vocabularies with five pill implementations; five table patterns; hardcoded hex palettes beside token-compliant pages.
5. **Attention fragmentation.** Operator to-dos, derived inbox, proof gate, launch readiness, verdict, CRM due-today all competed on one nine-section home wall. When everything is surfaced, nothing is a signal.

What is genuinely **good** and preserved: the markdown-as-source content discipline (19 collections, CLAUDE.md-codified), the narrow DB (CRM/entitlements/waitlist/cron), the append-only entitlements audit ledger, the proof-gate commercial-truth mechanic, the operator-todo ledger rule, and the editorial artifact rooms (org console, decks, design rooms) that are the soul of HQ.

## 2. Current-state inventory (summary)

- **43 top-level route dirs** under `src/app/hq` (49 routes incl. nested; 42 pages, 4 route handlers, 1 redirect).
- **19 markdown collections** under `content/hq` (decisions 41, operator-todos 39, launch-readiness 15, features 10, risks 8, …) + `content/atlas` (11) + `content/vault` (27) + `content/dispatch` (52).
- **2 databases:** studio-local (prospects, waitlist, cronRuns, legacy mirrors) and cross-product signal-entitlements (canonical, hash-chained audit ledger).
- **13+ status vocabularies** across DB enums and frontmatter.
- **Auth:** password → SHA-256 cookie, per-page `requireHqAccess()`, no middleware backstop.
- **In-flight branches** touching HQ routes at audit time: `feat/access-system` (entitlements), org deck work, hero labs (design-rooms), remediation (platform-readiness). This is why URL stability is a hard constraint.

Accretion order and per-room detail live in the audit transcripts; the registry (§7) is now the living inventory.

## 3. Founder workflow map

| Cadence | Workflows | Surface |
|---|---|---|
| Daily | What needs me? · operator gates · CRM follow-ups due · verdict/commercial truth | **Today** (`/hq`) |
| Weekly | Reporting read · marketing engine choice · dispatch scan | Money / Sell |
| Event-driven | Decide a design direction · approve/park an experiment · log a decision · new operator gate from agent work · review agent output | Needs-me queue → room |
| Launch-specific | Remediation program · launch-readiness scorecard · data-room prep | Company / Money |
| Reference | Vault · atlas · cap table · incorporation · financial model · decks · org | Company / Money (shelf) |
| Agent-initiated | operator-todos writes · dispatch entries · atlas drift flags | Needs-me queue |

Admission rule for the daily queue (§10) is derived from this map: **only items where founder action unblocks something enter "Needs me."**

## 4. Strategic models considered

- **Model A — Today / Work / Library** (attention-lifecycle nav). Panel scores: 76/90 (ops), 73 (design), 67/80 (eng). Failure mode: rooms move as attention shifts → unstable addresses; "Work" becomes a junk drawer without secondary grouping.
- **Model B — Four loops as route groups** (Sell/Make/Tell/Run workspaces). Scores: 54, 67, 42. Failure mode: solves navigation, not entropy — "four foyers to the same mess"; route moves would break four in-flight branches and every inbound link.
- **Model C — Object console** (nav by record type; rooms dissolve into views). Scores: 50, 63, 47. Failure mode: over-abstraction against the grain — HQ's most valuable surfaces are composed editorial artifacts, not record sets; the faceted-console register is the exact "AI dashboard" cliché the brand bans.

**Panel resolution (three independent panels, unanimous on synthesis):** A's registry + lifecycle engine, B's stable group addresses, C's status-vocabulary unification only. Nav groups are stable; lifecycle is *metadata, not location*.

## 5. Selected target architecture

### 5.1 System map

```
Today (/hq)                     ← attention: verdict · needs-me · vitals · groups
├── Sell                        ← demand: pipeline, venues, campaigns, waitlist
├── Make                        ← product & design: rooms, assets, labs, film
├── Money                       ← numbers & capital: reporting, model, decks, data room
├── Company                     ← the company itself: vault, org, atlas, access, health
└── Board (/hq/founders-circle) ← presentable register, curated subset
        ⌘K palette + search     ← reaches everything; recents-first
        Room registry           ← single source: nav, landings, home, palette, search, CI
```

Conceptual vocabulary is reduced to four terms: **group** (the five above), **room** (a destination with one permanent URL), **record** (a markdown/DB object rendered inside rooms), **status** (§9). "Hub", "loop", "workspace", "area", "panel" are retired as concepts.

### 5.2 Top-level navigation

`today · sell · make · money · company · board` — six items, lowercase, plain words. Each label lands on a **group landing page**, never on a single room. Rule: *a nav label passes only if the founder can name three rooms behind it without looking.*

- **sell** — CRM, Wave 1 venues, venue kit, marketing engine, posting queue, market-entry deck, waitlist ledger
- **make** — design rooms (+ decided shelf), asset library, asset pipeline, one-pagers, demo film, hero room, loading review, experimentation room
- **money** — reporting, financial model, cap table, pitch deck, loan pack, data room
- **company** — vault, org, blueprint, atlas (+ map), incorporation, access console, cron health, platform remediation
- **board** — founders circle (board register: curated chrome + `boardVisible` rooms only)

### 5.3 Naming taxonomy

- **Groups:** plain lowercase words a stranger can gloss. Verbs allowed only where unambiguous (sell, make).
- **Rooms:** findable nouns; branded names allowed for rituals/artifacts (Atlas, Vault, Founders Circle) **only** with a plain-language alias registered in the palette and a one-line plain summary in the registry.
- **Renames (display only, URLs unchanged):** `platform-readiness` → **Platform remediation** (vs. **Launch readiness**, the scorecard — the collision is resolved by name, not merge: they are different instruments). `assets` → **Asset library**; `asset-command` → **Asset pipeline**; `atlas-map` → **Atlas · map** (subordinate to Atlas); `plan` → **Marketing plan (deck)**.
- **IDs:** keep the `S·NN` dispatch and kebab-case content-id conventions; registry slugs = route slugs.

### 5.4 Object model

**Deliberately NOT unified.** The 19 collections stay separate files with separate meanings (panel-ratified rejection of Model C). What unifies:

- A shared frontmatter **core** every collection already approximates: `id, title, status, date`.
- One **status vocabulary** (§9) with per-collection mappings, enforced by contract test.
- One **attention contract**: any record wanting founder attention expresses it through the existing channels (operator-todo file, or derivation rules in `inbox.ts`) — no new fields, no third channel.

### 5.5 Work lifecycle

Rooms (not records) carry lifecycle in the registry:

`active` → `decided` → `archived`

- **active** — full card on its group landing; normal palette rank.
- **decided** — the room reached its verdict (design rooms after the pick). Collapses into a "Decided" shelf row on its landing; demoted palette rank; page untouched.
- **archived** — retired. Leaves landings; palette reachable but bottom-ranked; page gets no banner machinery yet (nothing is archived at ratification).

Records keep their own lifecycles (decision status, todo open/done, etc.) — see §9 mappings.

### 5.6 Review and approval model

HQ's reviews are heterogeneous by design (design directions, copy, remediation gates, entitlement grants). The shared framework is **presentation + record**, not one generic form:

- Review rooms keep their specialist UIs (`_review/ReviewRoom` for design directions; remediation YAML for gates; entitlements console for access).
- Every review **outcome** must land in `content/hq/decisions/` (append-only; supersede, never edit) — this was already the convention; it is now the rule.
- The **queue** is unified at presentation only: anything awaiting the founder surfaces in Needs-me via operator-todos or inbox derivation.

### 5.7 Command centre (Today)

The home page contract, top to bottom:

1. **Verdict line** — one sentence (existing `deriveVerdict`), phase note, timestamp.
2. **Commercial truth strip** — proof-gate clock state + paid venues + cash + pipeline, one row, links to reporting. The proof spine survives as a *pulse, not a panel*.
3. **Needs me** — max 7 items, merged presentation of operator-todos (blocking/P0 first), high-tier inbox items, CRM due-today. Each row: what, why, one action. Overflow shows as a count, and a persistently long queue is itself flagged as the problem.
4. **The groups** — five cards (name, gloss, active-room count, lead room).
5. **Full read** — the deep spine (proof gate detail, inbox tiers, pulse, traction) behind a single progressive disclosure; the inert-state forcing function keeps its mechanics.
6. **Footer** — ⌘K hint · exit.

Admission test for Needs-me: *founder action unblocks someone or something.* Metrics, FYIs, reference material, and agent-completable work are structurally excluded.

### 5.8 Universal search and command layer

- Palette registry is **generated from the room registry** (never hand-listed again) + plain-word aliases.
- **Recents** (localStorage, last 5 room jumps) render first on empty query.
- **Content search:** build-time index (`scripts/build-hq-search-index.mjs`) over rooms + decisions + vault + atlas + operator-todos frontmatter, served behind the auth gate at `/hq/api/search-index` (~75 KB; the markdown-as-source workflow means every content change redeploys, so build-time = zero staleness). Palette searches it client-side with the existing scorer.

### 5.9 Status system

Three axes, never mixed (panel-ratified):

- **Status** (lifecycle pill, the only pill): `draft · review · ready · blocked · parked · done`. Indigo is reserved for `review` (= needs the founder); everything else stays in the grey/ink register.
- **Health** (gauge): `ok · watch · act` — always with text, never colour-only.
- **Stage** (ordered domain sequences, e.g. CRM pipeline): rendered as position-in-sequence, never as a status pill.

Mappings: venues `blocked/open/ready/held` → `blocked/draft/ready/parked`; experiments `SHIPPED/REVIEW/PARKED` → `done/review/parked`; design `DECIDED/APPROVED/SHORTLIST` → `done/ready/review`; vault/data-room `ready/pending` → `ready/draft` (`external` becomes a source tag, not a status); cron `green/amber/red` → health `ok/watch/act`. **Extension rule:** a domain may add a stage sequence or tags, never a seventh status; every domain state must declare its mapping onto the core six.

### 5.10 Activity and history

- **Dispatch (`CHANGELOG.md`)** remains the event stream; **decisions** remain the why-record; the **entitlements ledger** remains the compliance trail. No new activity system — three good ones exist.
- Today's verdict timestamp + "recently shipped" read from dispatch where useful; nothing demands reading.

### 5.11 Archive and hygiene

- Rooms archive via registry `lifecycle: "archived"` (see §5.5) — no deletion, URL stable.
- Quarterly hygiene sweep (see governance §11): stale `review` decisions, rooms untouched 90+ days, todos open 30+ days get an explicit keep/decide/archive pass.

## 6. UX and interaction system

- **Page anatomy** — every non-artifact room adopts `HqPageHeader`: back-to-group line → eyebrow (`GROUP · TYPE`, indigo dot) → one `h1` → one-sentence standfirst (≤120 chars) → meta row (status pill + updated). Artifact rooms (decks, org console, atlas map, review galleries) are registry-typed `artifact` and exempt from the standard header but not from tokens.
- **Status pills** — one `HqStatusPill` component (status axis) + health text-gauge; retire bespoke `Pill()`/`StatusPill()`/`badgeStyle()` as pages are touched.
- **Navigation behaviour** — shell nav = groups; group landing = secondary nav; one level of back-link, no breadcrumbs (HQ is intentionally shallow).
- **Keyboard** — ⌘K everywhere; palette ↑/↓/⏎/Esc; skip-link → single `main`/`h1`.
- **Empty/loading/error** — shared quiet empty-state pattern; force-dynamic pages stay honest (no fake skeletons for sub-100 ms fs reads).
- **Responsive** — Today's Needs-me block is the mobile contract: readable and actionable at 390 px. Landings collapse to single column.
- **Motion** — palette open, status change, and disclosure only; all inside `prefers-reduced-motion` guards; no spectacle.

## 7. The room registry (keystone)

`src/lib/hq/rooms.ts` — the single source of truth:

```ts
type HqRoom = {
  slug: string;            // = route segment, kebab-case
  route: `/hq/${string}`;  // permanent URL (never changes)
  name: string;            // display name (rename freely)
  group: "sell" | "make" | "money" | "company" | "board";
  kind: "console" | "room" | "artifact" | "library" | "deck";
  lifecycle: "active" | "decided" | "archived";
  summary: string;         // one plain sentence
  aliases?: string[];      // palette synonyms
  boardVisible?: boolean;  // appears in board register nav
  parent?: string;         // subordinate rooms (atlas-map → atlas)
};
```

Consumers: `HqShell` nav, group landing pages, Today's group cards, command palette, search index, board nav, and the CI contract test. **A room exists iff it has a registry entry.**

## 8. Technical architecture changes

- **No route moves, no URL changes.** Grouping is registry-logical. `next.config.ts` redirects reserved for true retirements.
- **CI anti-entropy:** `scripts/check-hq-registry-contract.mjs` (house `check-*-contract` pattern, wired into `pnpm test`): (a) route-dirs ⇔ registry set-equality with explicit allowlist (`access`, `logout`, `status`, `_review`, nested children); (b) every `page.tsx` calls `requireHqAccess(` (allowlisted exceptions); (c) kebab-case slugs; (d) frontmatter status values across `content/hq/**` within declared per-collection sets.
- **Security hardening:** middleware backstop on `/hq/:path*` (cookie check → redirect to `/hq/access`), keeping per-page guards as first line; token derivation salted with a server secret when `HQ_ACCESS_SALT` is set (backwards-compatible fallback).
- **Search index at build time**, served behind the guard — never from `public/`.
- Legacy `HQ_HUBS`/static palette arrays retired in favour of the registry.

## 9. Migration mapping

URLs: **all 43 routes unchanged.** Display/name/grouping changes only:

| Route | Old name/place | New name · group · lifecycle | Action |
|---|---|---|---|
| `/hq` | 9-section wall | **Today** | Rebuilt (§5.7) |
| `/hq/crm` | nav "sell" | CRM · sell · active | regrouped |
| `/hq/venues` | hub | Wave 1 venues · sell · active | regrouped |
| `/hq/venue-kit` | hub | Venue kit · sell · active | regrouped |
| `/hq/marketing` | hub | Marketing engine · sell · active | regrouped |
| `/hq/socials` | room | Posting queue · sell · active | regrouped |
| `/hq/market-entry` | room | Market entry deck · sell · active | regrouped |
| `/hq/waitlist` | room | Waitlist ledger · sell · active | regrouped |
| `/hq/design-rooms` | nav "make" | Design rooms · make · active | regrouped |
| `/hq/cards` | top-level | Founder cards · make · **decided** | shelved |
| `/hq/poster` | top-level | Campaign poster · make · **decided** | shelved |
| `/hq/cafe-card` | top-level | Café card · make · **decided** | shelved |
| `/hq/partner-card` | top-level | Partner card · make · **decided** | shelved |
| `/hq/loading-review` | room | Loading review · make · **decided** | shelved |
| `/hq/assets` | hub | Asset library · make · active | renamed |
| `/hq/asset-command` | hub | Asset pipeline · make · active | renamed |
| `/hq/one-pagers` | room | One-pagers · make · active | regrouped |
| `/hq/demo-film` | room | Demo film · make · active | regrouped |
| `/hq/product-hero-design-motion` | room | Hero room · make · active | renamed |
| `/hq/experimentation-room` | nav "lab" | Experimentation room · make · active | regrouped |
| `/hq/reporting` | nav "tell" | Reporting · money · active | regrouped |
| `/hq/financial-model` | room | Financial model · money · active | regrouped |
| `/hq/cap-table` | room | Cap table · money · active | regrouped |
| `/hq/deck` | room | Pitch deck · money · active | regrouped |
| `/hq/loan-pack` | room | Loan pack · money · active | regrouped |
| `/hq/data-room` | room | Data room · money · active | regrouped |
| `/hq/plan` | room | Marketing plan (deck) · money · **decided** | shelved (ratified plan) |
| `/hq/vault` | nav "run" | Vault · company · active | regrouped |
| `/hq/org` | room | Org · company · active | regrouped |
| `/hq/blueprint` | room | Blueprint · company · active | regrouped |
| `/hq/atlas` | room | Atlas · company · active | regrouped |
| `/hq/atlas-map` | room | Atlas · map · company · active | child of atlas |
| `/hq/incorporation` | room | Incorporation · company · active | regrouped |
| `/hq/entitlements` | nav "access" | Access console · company · active | regrouped |
| `/hq/health` | room | Cron health · company · active | regrouped |
| `/hq/platform-readiness` | nav "readiness" | Platform remediation · company · active | **renamed** (collision fix) |
| `/hq/founders-circle` | nav "board" | Founders Circle · board · active | board register |
| `/hq/partners` | redirect | → `/hq/entitlements?tab=venues` | kept |
| `/hq/access`, `/hq/logout`, `/hq/status` | system | system routes | allowlisted, not rooms |
| *(palette)* `/hq/copy-review` | dead entry | — | **removed** (route never existed) |

Data migrations: **none required** (no schema or content moves). Redirect status: no new redirects needed.

## 10. Implementation phases

1. **Registry + contract test** (keystone; test ships in the same commit — a registry without enforcement is registry #4).
2. **Palette v2** — generated from registry, recents, dead entry removed.
3. **Shell nav → six groups** + group landing pages.
4. **Today** — home rebuild per §5.7.
5. **Shared primitives** — `HqPageHeader`, `HqStatusPill`; migrate the worst-drifted console pages.
6. **Search index + guarded endpoint + palette content search.**
7. **Security backstop** — middleware + salted token.
8. **Docs + dispatch + CLAUDE.md rule update.**

Each phase ships independently; HQ stays usable throughout.

## 11. Anti-entropy governance (the rules)

1. **A room exists iff it is in `rooms.ts`.** CI fails otherwise. No exceptions.
2. **New room bar:** before adding room #44, answer in the PR/commit body — *which group, which kind, what founder question it answers, why no existing room covers it, and its retirement condition.* Default answer to a new room is "it's a section of an existing room."
3. **New top-level group** requires a decision record in `content/hq/decisions/`. (Expected frequency: ~never.)
4. **Naming:** rooms are findable nouns; branded names require a plain alias; slugs kebab-case; display renames free, URL renames forbidden (redirect + decision record if truly unavoidable).
5. **Statuses:** the six-value vocabulary is closed. Domains map onto it; the contract test enforces declared sets.
6. **Lifecycle duty:** when a review room reaches its verdict, the same change sets `lifecycle: "decided"`. Experiments graduate by moving lifecycle, not by cloning rooms.
7. **Attention duty:** anything blocking on the founder goes through the operator-todo ledger (existing CLAUDE.md rule) — never a new bespoke "pending" section on some page.
8. **Quarterly sweep:** review rooms untouched 90 days, decisions in `review` >30 days, todos open >30 days — keep / decide / archive each.
9. **Design system:** HQ pages use tokens; new pages use `HqPageHeader`/`HqStatusPill` unless registry-typed `artifact`; no new hex palettes, no dark mode (light-locked).
10. **The palette is generated.** Hand-editing a room list anywhere is a bug.

## 12. Verification results (2026-07-12, pre-ship)

- **Contract tests:** 5/5 pass (`rooms.test.ts`, wired into `pnpm test`) — route⇔registry equality across all 36 rooms + 5 system routes, kebab-case, status ratchet over 19 collections, proxy-gate integrity.
- **Full suite:** 89/89 tests pass. `pnpm typecheck` clean. `pnpm build` clean; new routes present (`/hq/[group]`, `/hq/decisions`, `/hq/decisions/[id]`, `/hq/api/search-index`).
- **Runtime walk (prod server, authed):** `/hq` 200 with truth strip + needs-me + five doors + full-read disclosure; `/hq/sell·make·money·company` 200 with correct room cards (7/7/6/9 active) and the Make shelf holding the five decided rooms; `/hq/decisions` lists real records, detail pages render with mapped status pills; `/hq/founders-circle` board register intact; unknown group → 404; unauthenticated hit on any HQ path (incl. the search index) → 307 to the access gate.
- **Lint:** all files touched by this programme are clean. 34 pre-existing errors on `main` in untouched files (org-chart, SuiteLoader, atlas components, …) remain — logged as a deferred item, not introduced here.
- **Deferred, with rationale:** (a) salting the access token derivation — it would invalidate the founder's current session for marginal gain; revisit with the next auth change; (b) archived-room banner machinery — nothing is `archived` yet; build it with the first real archive; (c) pruning the orphaned legacy header CSS families (`.hq-page-header`, `.vault-hero`, `.hq-crm-header`, …) — swept after the in-flight branches land, since they may still reference them.

### Header migration (completed 2026-07-13)

All 20 non-artifact, non-deck rooms now render `HqPageHeader` (sell: crm, venues, marketing, socials, waitlist · make: design-rooms, assets, asset-command, demo-film, experimentation-room · money: reporting, financial-model, cap-table, data-room · company: vault, atlas, incorporation, entitlements, health, platform-readiness — plus decisions, born on it). Artifact and deck rooms remain exempt by design (§6). Conventions set during the pass: sentence-style editorial titles keep their trailing period, name-style titles do not; short stat/status lines ride the header `meta` slot as `hq-page-head-note`; functional header-adjacent UI (tabs, banners, toggles, readiness cards) stays below the header untouched. Verified: typecheck, 89/89 tests, production build, and an authenticated runtime walk of all 20 pages (200 + shared header + correct group back-link).

## Remaining risks

- In-flight branches (`feat/access-system`, motion HQ, hero labs) predate the registry; on merge, any new route they add will fail the contract test until registered — that is the system working, but expect one small conflict-fix per merge.
- The needs-me queue depends on inbox derivation rules staying honest; if a new "pending" surface appears on some page instead of the ledger, governance rule 7 was broken — the quarterly sweep should check for this.
- The old `HQ_HUBS`/`HQ_AUDIENCE_PATHS` arrays in `operating-system.ts` are no longer rendered on Today (founders-circle still reads parts) — candidates for pruning once the board room is next touched.

## 13. Change log

- 2026-07-12 — Document created; architecture ratified after three-panel review; implementation begun on `feat/hq-operating-system`.
