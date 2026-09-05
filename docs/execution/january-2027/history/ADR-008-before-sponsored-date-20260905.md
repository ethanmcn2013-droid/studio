# ADR-008 — Venue Edition entities, roles and workspace lifecycle

**Status:** proposed, awaiting founder approval
**Date:** 2026-08-03
**Programme:** VEF-2026 · epic E04 (all twelve tasks)
**Supersedes:** nothing. Extends ADR-007 (Venue Portal Phase A), which stands.
**Decisions this rests on:** D-001, D-010, D-011, D-015 Q2 and Q4, D-020, D-022

---

## Why this document exists

E04 asks for twelve definitions. They were scattered across five documents, two
schemas in two repositories, and a set of founder decisions, and in several
places the documents and the code disagreed. This is one place to look.

Per **D-015 Q2**, the first pass over E04 is an **audit, not a build**. So every
section below states what already exists before it states what is missing, and
nothing is described as shipped that is not. Where a ratified decision and the
code disagree, both are named and the conflict is recorded rather than quietly
reconciled.

**Status key.** **shipped** — code exists, has a live caller, behaves as
described. **partial** — code exists but is incomplete, disconnected from a
caller, or contradicts a ratified decision. **absent** — no code, no schema, no
route.

---

## 0. The central architectural claim

**There are two axes, not one, and they are orthogonal.**

| Axis | What it governs |
|---|---|
| **Access** | What the couple can do with their workspace |
| **Sponsorship** | The commercial link between a venue and that workspace |

**No sponsorship transition may ever change the access state.**

That is not a preference. It is D-020 point 2, which Signal Studio states
unprompted in the outreach email and the agreement to every founding venue:
*any workspace already redeemed keeps its full term plus Keepsake, whatever
happens to the licence. Only new issuance stops.* And it is D-020 point 3: when
a venue releases a workspace, the couple keeps their content and only the
branding comes off.

Collapsing the two axes into one enum is the mistake this document exists to
prevent, because the failure it produces — a couple losing their wedding
planning because a venue did not renew — is the worst outcome available to this
product.

The claim is enforced, not asserted. `accessAfterSponsorshipEvent` in
`studio/src/lib/venue-lifecycle.ts` returns the access state unchanged for every
sponsorship event, and `studio/src/lib/venue-lifecycle.test.ts` asserts that
across every state-and-event pair. A future change that breaks the promise fails
a test rather than reaching a venue.

---

## 1. E04.01 — Data entities

| # | Entity | Where it lives | Verdict |
|---|---|---|---|
| 1 | **Venue** | `studio/src/lib/entitlements-db/schema.ts` table `sponsors` — slug, name, contactEmail, brandMeta, venuePlan, annualAmountCents, foundingLocked, term dates, paidAt, codeAllotment, allotmentMode, annualWeddingCount, fairUseCeiling, codesIssued | **partial** |
| 2 | **Agreement** | Nowhere. No table, no signature date, no document reference, no contract version, in either repo. | **absent** |
| 3 | **Term (venue)** | `sponsors.termStartsAt` / `termEndsAt` / `paidAt`. Two flat nullable integers, no renewal object, no history. | **partial** |
| 3b | **Term (couple)** | `entitlements.expiresAt` + `entitlements.wedding_date`, computed by `app/src/server/db/sponsored-access-term.ts` through `app/src/lib/venue-edition-term.ts`. Implements D-022 exactly. | **shipped** |
| 4 | **Founding status** | `sponsors.foundingLocked`, a boolean, set in `studio/src/lib/entitlements-db/venues.ts`. | **partial** |
| 5 | **Member (couple)** | `app/src/server/db/schema.ts` `workspaceMembers` — workspaceId, userId, role `owner` or `member`. One-owner floor enforced in `app/src/server/actions/settings.ts`. | **shipped** |
| 5b | **Member (venue)** | `sponsor_members` is fully specified in `studio/docs/venue-portal/ROLES_AND_PERMISSIONS.md` and exists nowhere in code. | **absent** |
| 6 | **Invitation (couple)** | `app/src/server/db/schema.ts` `pendingInvites`, covered end to end by `app/src/server/invite-lifecycle-contract.test.ts`. | **shipped** |
| 6b | **Invitation (venue member)** | Prose only, inside the unbuilt `sponsor_members` projection. | **absent** |
| 7 | **Couple workspace** | `app/src/server/db/schema.ts` `workspaces` + `workspaceSponsorships`. The boundary object ADR-007 calls for. | **shipped** |
| 8 | **Public artifact** | `workspaces.publishedAt` → `app/src/app/p/[slug]`, and the Shared Timeline artifact at `app/src/modules/timeline/components/artifact/timeline-artifact.tsx`. | **partial** |

### Three absences worth naming

**There is no agreement entity.** `sponsors` carries commercial *terms* but no
discrete agreement record — no document id, no signed-copy reference, no
renewal history. D-016 commits to drafting the agreement; nothing models it.

**There is no founding-number field.** D-009 point 6 ratifies that *a venue
number is assigned on payment, not on signature*. The only place `01/25` exists
in the repository is marketing copy on `studio/src/app/venues/page.tsx`. Nothing
computes or stores which number a venue holds. **This is a commercial promise
with no data behind it**, and it is due before the first payment clears.

**`sponsor_members` is designed and not built**, exactly as its own document
says. Every venue-side role capability below therefore has nothing to
authenticate against.

### One finding not in the task scope, recorded because it is live

There are **three** venue-identity representations, not one: `sponsors` in the
shared entitlements DB, the transitional mirror in `studio/src/lib/db/schema.ts`,
and an untyped JSON blob in `comp_codes.notes` in Tasks with no foreign key to
either. The third is the one the couple's product actually reads.

---

## 2. E04.02 — Venue member roles and permissions

`studio/docs/venue-portal/ROLES_AND_PERMISSIONS.md` defines a fourteen-row
capability matrix across owner, manager, viewer and operator.
`studio/src/lib/account/roles.ts` ships six capabilities.

| Capability | Doc | Shipped | Gap |
|---|---|---|---|
| Read term and allotment totals | O/M/V | no named capability | not represented in either direction |
| Read aggregate usage and coverage | O/M/V | `view_usage` O/M/V | matches |
| Read reports | O/M/V | `view_reports` O/M/V | matches |
| **Export reports** | O/M/**V** | `download_reports` O/M, **viewer denied** | **direct contradiction** |
| Read unused code values | O/M, not V | no named capability | the viewer boundary the doc rests on is unrepresented |
| Download or share unused codes | O/M, not V | no named capability | same |
| Request more codes | O/M, not V | `request_access` O/M, not V | matches |
| Manage portal members | O only | `manage_members` O only | matches |
| Edit venue profile and notices | O only | nearest is `edit_reporting_preferences`, O **and M** | mismatch, and possibly not the same capability |
| Change allotment | operator only | correctly absent | no gap |
| Mint or revoke codes | operator only | correctly absent | no gap |
| View a person or couple | nobody | enforced by `decideSponsorCapability` default-deny in `sponsorship-policy.ts` | enforced in the policy library, not in `roles.ts` |
| Create workspace membership | nobody | no linking mechanism exists | enforced by absence, not by a check |
| Read private content | nobody | `SPONSOR_FORBIDDEN_FIELD_PREFIXES` in `sponsorship-policy.ts` | enforced in the policy library |

### The honest headline

**None of this is reachable by a venue.** The only page that consumes
`roles.ts` is `studio/src/app/hq/account-review`, behind `requireHqAccess()`,
where the role is an operator toggle rather than a real session. There is no
venue-facing route, because there is no `sponsor_members` table to authenticate
a venue person against. `studio/src/lib/account/roles.test.ts` proves the pure
function returns the right booleans; it does not prove any request is
authorised.

The six membership invariants, with verdicts: **(1)** a sponsor always retains
one active owner — not enforced, no table. **(2)** an invitation is
sponsor-scoped and single-use — not enforced, no flow. **(3)** accepting never
creates workspace membership — true, but by absence of a linking column rather
than by a check. **(4)** revocation invalidates sessions immediately — not
enforced, no session. **(5)** a member may belong to several venues — not
enforced. **(6)** operator view-as requires identity, reason, sponsor id, expiry
and an audit event — **partial**: `recordViewAs` in
`studio/src/lib/entitlements-db/writes.ts` writes an audited `view_as` event
with actor and reason, but it is keyed on the person, not the sponsor, and has
no expiry.

---

## 3. E04.03 — Invitation states

Two disjoint state machines exist today and neither matches the seven states in
the task title: the venue side has
`not_sent → sent → accepted → declined → expired → revoked`, and the couple side
has `pendingInvites` with no revoked state at all (revocation is simulated by
setting `expiresAt` to now).

**The definition**, in `studio/src/lib/venue-lifecycle.ts`:

```
created ──deliver──▶ sent ──open──▶ opened ──redeem──▶ redeemed  (terminal)
   │                   │              │
   └───────────────────┴──────────────┴──▶ expired | revoked | replaced
                                              │         │
                                              └─replace─┴──▶ replaced (terminal)
```

Rules that are not obvious and are therefore tested:

- **A redeemed code cannot be revoked, expired or replaced.** Revoking it would
  strand the entitlement it already produced, which the access axis forbids.
- **Re-sending and re-opening are legal and non-advancing.** A couple who loses
  the email and asks for it again has not done anything wrong.
- **A venue can reissue against an expired or revoked code.** That is what
  happens when a couple comes back late, and it is the only reason `replaced`
  exists.

### `opened`, and D-013

D-013 point 3 bans open pixels: *open tracking on a cold email to people you
want a trust relationship with is a bad trade*. That ban stands.

`opened` is therefore defined as **a first-party load of `/redeem/{code}`, and
nothing else**. A page the couple deliberately opened is a different fact from a
pixel fired without their knowledge, and only the first is recorded. This
resolves the conflict rather than dropping the state, but it touches D-013's
territory and is flagged for founder acknowledgement.

**Not built:** persisting `opened` needs a column and a write on a public page
load. `replaced` needs a `replaced_by_code_id`. Both are recorded, neither is
built.

---

## 4. E04.04 — Couple workspace ownership, co-owner access, collaborators, recovery

**Ownership — shipped, with a seam.** `workspaces.ownerUserId` is set at
creation and never reassigned by any code path. Day-to-day control runs through
`workspaceMembers.role`, which can hold more than one `owner`;
`app/src/server/actions/settings.ts` enforces a one-active-owner floor on both
removal and demotion. So co-owner *access* is real. The `ownerUserId` column is
a separate, unmoving fact that nothing reconciles with who currently holds the
owner role.

**Collaborators — shipped.** `pendingInvites` plus `workspaceEvents` implement
mint, seven-day expiry, one-hour resend cooldown, existing-member short-circuit
and an audit trail with no email in the payload.
`app/src/server/invite-lifecycle-contract.test.ts` exercises eight states. This
is among the best-built surfaces in the programme.

**Account recovery — absent.** A search of the whole workspace finds no
password-reset flow, no lost-access flow and no self-service ownership transfer.
The nearest thing is `clerkIdDead` in the entitlements schema, an operator
data-repair flag for a Clerk account-merge edge case. Authentication is Clerk's
hosted product; nothing in either repo builds recovery on top of it.

### The four scenarios

| Scenario | Current answer |
|---|---|
| A guest requests erasure | **No answer.** A share-link guest is a token, not an identity. `shareLinkVisits` stores a truncated user-agent and nothing else, so there is no path from "this guest" to "their rows". A guest cannot be individually erased because a guest is never individually identified. |
| A supplier objects to being named | **No answer.** Tasks carry free-text `externalContactName` and `externalContactEmail`. No code path redacts them on request and no process is documented. |
| A venue asks for a couple's data | **Answered.** `SPONSOR_DEFAULT_FIELDS` allows activation and entitlement metadata only; anything couple-owned needs an active, receipt-backed consent grant the couple can revoke. Unit-tested, and — per section 2 — not wired to a live route. |
| A couple separates and both want the workspace | **No answer, and worse.** See below. |

### R-023 — a co-owner's work is destroyed by the other partner's account deletion

**Verified in code.** `app/src/server/account-erasure.ts` selects every workspace
where `ownerUserId` matches the erasing user and hard-deletes the whole thing:
tasks, comments, attachments, share links, regardless of who created them. The
one-owner floor stops a co-owner being *demoted*; nothing stops the account
holding `ownerUserId` from calling account deletion and taking the shared
workspace with it.

The unit of this product is a couple. Two people, one wedding, one workspace.
This is a live, currently shippable failure mode, not a hypothetical, and it is
proposed for the RAID register.

---

## 5. E04.05 — Venue branding inheritance

**Two parallel sponsor-identity paths exist and are not reconciled.**

**Path A — `sponsors.brandMeta`** in the shared entitlements DB. A single
untyped text column, parsed by `studio/src/lib/redeem/lookup.ts` into
`Record<string, unknown> | null`. **It has no schema, no type naming a single
expected key, and no consumer anywhere in either repository.** Every current
caller passes `null`.

**Path B — the JSON blob in `comp_codes.notes`** in Tasks:
`{sponsor_slug, sponsor_name, source_type}`, written by studio's
`issue-codes.ts`, read by `app/src/server/db/venue-welcome.ts`. This is the path
the couple's product actually uses. It reaches two surfaces: the dismissible
welcome card, which renders `Compliments of {sponsorName}`, and the Settings
plan page.

### What actually inherits today

**The venue's name and slug. Nothing else.** There is no logo anywhere in the
product. There is no venue-authored welcome message — the welcome sentence is
hardcoded in `app/src/components/welcome/venue-welcome-card.tsx` with only the
name substituted in.

A venue is being sold a gift with its name on it. Two thirds of what E04.05
names — logo and welcome message — have nowhere to live.

**D-011 point 2** ratifies one line in the footer of a public keepsake, no logo,
no badge, no "powered by" in the viewport. The shipped artifact footer renders
`Updated {date}` and `A Signal Studio product`, and no attribution line at all.
The ratified restraint is trivially satisfied because the thing it restrains has
not been built.

---

## 6. E04.06 — Venue-workspace unlinking

The sponsorship axis, in `studio/src/lib/venue-lifecycle.ts`:

```
pending ──redeem──▶ active ──release──────▶ released
   │                  │  ──licence_lapses─▶ ended
   └──────────────────┴──revoke───────────▶ revoked  (terminal)
```

| Rule | Where |
|---|---|
| A lapsed licence stops **new issuance and nothing else** | `canIssueNewSponsorship` |
| Venue branding shows **only** while the link is active | `sponsorBrandingVisible` |
| Branding comes off within **24 hours** of release (D-020 point 3) | `brandingRemovalDeadlineMs` |
| **No sponsorship event moves the access state** (D-020 point 2) | `accessAfterSponsorshipEvent`, asserted across every pair |

**What exists structurally.** `workspaceSponsorships.status` already carries
`active | revoked | expired` with a CHECK constraint and a `revokedAt` column,
and `projectSponsorActivation` in `sponsorship-policy.ts` already gates every
consented field on the activation being active and unrevoked.

**What is not built, stated plainly.** `workspaceSponsorships` is insert-only in
the app today — nothing ever transitions it. There is no release action, no
24-hour branding-removal job, and no venue-facing control. This section defines
the mechanism and proves the invariant it must hold; **wiring it to a caller
needs the venue portal surface and belongs to E07.** That scoping decision is
Claude's and is flagged for the founder to accept or push back on.

---

## 7. E04.07 — The couple access lifecycle

```
invited ──redeem──▶ active ──term_ends──▶ keepsake
   │                  │                      │
   └──────────────────┴────erase─────────────┴──▶ deleted  (terminal)
```

**State is derived, never stored.** `deriveCoupleAccessState` computes it from
the redemption timestamp, the expiry and the erasure timestamp. A stored state
would be a second source of truth, and second sources of truth drift.

**There is deliberately no post-wedding state.** D-010 and D-022 fold the
wedding day into the term itself: a couple is `active` until
`max(redemption + 548 days, wedding + 90 days)` and `keepsake` after. A state
that changed on the wedding day would be a state that could fire on the wedding
day.

**The expiry boundary matches the access gate exactly.** The resolver's live
filter is `expiresAt > now`, so an expiry equal to now reads as ended in both
places. A snapshot and the gate disagreeing for one instant is the kind of
defect that only shows up in a screenshot a venue took.

**Keepsake never expires on a clock.** Per D-010 point 3 it is free, read-only
and indefinite *while the service exists*, with a one-click export the couple
owns. Never "forever", and no storage guarantee. The machine has no transition
out of Keepsake except erasure, because the service ending is not a transition
this machine gets to make on a couple's behalf.

**Not built:** Keepsake mode itself, the export, and the deletion flow. Those are
E06 and E03. This is the definition they build against.

---

## 8. E04.08 — The private, public and venue-aggregate boundary

No single document states this as three classes. The venue-aggregate boundary
lives in `studio/docs/venue-portal/PRIVACY_AND_RETENTION.md`; the public-artifact
boundary lives in `app/docs/TIMELINE_OWNER_ARTIFACT_CONTRACT.md` and
`studio/docs/privacy-permission-matrix.md`. Here they are together.

| Class | What is in it | Enforced by | Proved by |
|---|---|---|---|
| **1 · Private planning** | Note bodies, task titles, private Timeline items, comments, attachments, collaborators, workspace and user ids, owner email | The default-deny baseline. Named explicitly in two denylists so it cannot leak through either projection: `SPONSOR_FORBIDDEN_FIELD_PREFIXES` in `studio/src/lib/entitlements-db/sponsorship-policy.ts`, and `FORBIDDEN_KEYS` in `app/src/modules/timeline/lib/audience-timeline.ts` | `sponsorship-policy.test.ts` (mass-assignment and persisted-grant rejection), `audience-timeline.test.ts` (parametrised forbidden-field tests) |
| **2 · Public artifact** | The frozen `AudienceTimelineDto`: version, audience kind, publication id, label, optional owner display label, optional primary-date label, timestamps, and milestone `publicId`/`title`/`date`/`state` | `validateAudienceTimelineDto` — an allowlist **and** denylist runtime boundary, denylist checked first | `audience-timeline.test.ts`, and `timeline-artifact-contract.test.mjs` for the chrome |
| **3 · Venue-visible** | Sponsor activation metadata (`SPONSOR_DEFAULT_FIELDS`), four consent-gated fields (`SPONSOR_CONSENT_FIELDS`: `workspace.id`, `workspace.label`, `workspace.primary_date`, `wedding.ceremony`), and day-level aggregates | `assertSponsorProjectionFields` throws on anything not allowlisted — **unknown fields fail closed**. `projectSponsorActivation` never spreads a raw row and freezes its output. Suppression at 3 and 5 in `studio/src/lib/account/instrumentation/suppression.ts`, ratified in D-011 point 3 | `sponsorship-policy.test.ts` ("unknown fields fail closed"), `suppression.test.ts` ("the thresholds are the ones the privacy contract names") |

### The gap, and it is a large one

**Classes 1 and 2 are enforced by real code on real live routes.** Class 3's
consent layer is not wired to anything.

Verified by search: `projectSponsorActivation` appears only in its own test file
and a barrel re-export. `sponsorConsentGrants` has **no writer anywhere** — no
route, no action, no script inserts a row. `listSponsorActivationDTOs` in
`app/src/server/planning/queries.ts` has **no caller**. The live venue snapshot
builder, `studio/src/lib/account/live/project-venue-access.ts`, never reads a
consented field at all.

There is also a **second, parallel consent model** in the app:
`workspaceSponsorships.consentedMetadata` carries two fields and gates them on
the sponsorship being active with a non-empty consent receipt, rather than on a
per-field grant. It is also unwired.

**Net effect.** Nothing shows a wedding date to a venue today. That is not
because the boundary decided it should not — it is because nothing shows a venue
anything yet. The privacy machinery is correct, tested and idle. **A privacy
claim resting on an unwired module is R-007 exactly**, and it is recorded here
rather than described as protection.

---

## 9. E04.09 — Wedding-date metadata and portal visibility

**Where the date lives.** `workspaces.primary_date` in the app — a calendar
date, never an instant. The couple owns it and is never asked for it twice.

**What reads it today.** The D-022 access term, and only that:
`app/src/server/db/sponsored-access-term.ts` computes
`max(redemption + 548 days, wedding + 90 days)` from it, at redemption and again
on recompute. That is a shipped, tested, wired mechanism. It answers *when does
this couple's access end*, not *what may a venue see*.

**The projection.** `entitlements.wedding_date` in the shared entitlements store
is a projection of the couple-owned date, written at redemption and on
recompute, so the term can be evaluated without reaching into product content.
It is documented as a projection on the column itself, and it is deliberately
**not** in `SPONSOR_DEFAULT_FIELDS`.

**Date changes.** Recompute extends and never shortens (D-022 point 3). D-011
point 1 additionally rules that **date changes are never shown to a venue** — a
postponement is the couple's news to share, not a dashboard event. There is no
date-change UI in the product today, so the rule has nothing to govern yet.

### Three gates, and nobody has said which governs

| Reading | The test it applies | Where it comes from |
|---|---|---|
| **Redemption linkage** | The couple redeemed *this* venue's code | D-011 point 1's literal words |
| **Explicit per-field consent** | An active, revocable grant exists for `workspace.primary_date` | `SPONSOR_CONSENT_FIELDS` + `sponsorConsentGrants` in studio |
| **Implicit consent at creation** | The sponsorship is active with a consent receipt | `workspaceSponsorships.consentedMetadata` in the app |

D-011 says redemption. The studio schema says explicit consent. The app says
implicit consent. All three are unwired, so nothing is currently wrong — but the
first one to be built decides the answer by accident unless the founder decides
it on purpose.

**Recommendation: redemption is the trigger, the grant is automatic and
disclosed, and the couple can revoke it.** That satisfies D-011's literal text,
keeps the one piece of consent infrastructure that is already built and
fail-closed, and sits closest to D-010 point 1 — *couples are asked for nothing
by default*. A second consent form on top of an already-gifted product asks the
couple for something; a disclosed, revocable default does not.

This is a founder decision and not an engineering default, because it changes
what a venue is told about a couple without the couple acting. It is in the
packet.

---

## 10. E04.10 — The black rail and the rail-free rule

D-001 points 14 and 15 are founder direction living only in a decision file. The
implementation is better than the documentation, which is exactly the condition
under which a later session regresses it without noticing. The rule, written
down:

**The rail** is `StudioRail` in `app/src/components/studio-bar/studio-rail.tsx`,
the vertical stroke of the L-frame, on `--x-studio-chrome: #17171a`.

| Route family | Rail | Status |
|---|---|---|
| `/app/*` — Notes, Tasks, Timeline, Signal and their settings | **carries the rail**, via `app/src/app/app/layout.tsx`, inside `requireAppAccess()` | correct |
| `/s/{token}` — the Timeline bearer-link artifact | **rail-free** | correct, and enforced |
| `/p/{slug}`, `/embed/{slug}` — the published workspace, including the wedding theme | **rail-free** | correct on chrome, incomplete on metadata |
| `/settings/*` at the top level | rail-free, using `SettingsChrome` | **inconsistent — see below** |

### Rail-free means more than the rail

For `/s/{token}` it is enforced at three layers, and the exclusions are the
point: `manifest: null`, `alternates.canonical: null`,
`robots: noindex, nofollow, noarchive, nosnippet`, `openGraph.siteName` set to
`timeline` rather than Signal Studio, and social card images deliberately
emptied. At the routing layer `app/src/proxy.ts` adds `Cache-Control: private,
no-store`, `Referrer-Policy: no-referrer` and `X-Robots-Tag`, and the root layout
suppresses analytics and the `signalstudio.ie` preconnect for these responses.

The layout's own comment states the intent: it prevents the operating product's
manifest, canonical URL and social card from leaking into the artifact. That is
what "feel owned by the couple" means in code.

### What is enforced, and what is only convention

**Enforced.** One test:
`app/src/modules/timeline/components/artifact/timeline-artifact-contract.test.mjs`
asserts the artifact component never imports rail or dashboard chrome. It is the
only automated check of this rule in either repository.

**Convention only.**

- **Nothing asserts the positive.** No test proves `/app/*` actually renders the
  rail. A future route built outside the layout tree would lose it silently.
- **No registry enumerates the route families**, unlike the HQ room registry in
  studio, which fails the build when routes and registry disagree.
- **`/p/{slug}` does not get the `/s` treatment.** It is `revalidate = 60`,
  indexable by design, and does not null its manifest or canonical. Its content
  boundary is sound — `toPublicTask` allowlists the fields — but the
  metadata half of rail-free is absent. If D-001 point 15 is meant to cover the
  published wedding workspace and not only the Timeline link, that is a gap
  between direction and implementation.
- **`/settings/*` and `/app/settings` are two implementations of one concept**,
  with different chrome. The rail's own links point at `/app/settings`. Neither
  D-001 point 14 nor point 15 accounts for an authenticated, rail-free surface.

---

## 11. E04.11 — Lifecycle edge cases

Harvested from `studio/docs/LICENSING_ACCESS_DESIGN.md`,
`studio/docs/venue-portal/IMPLEMENTATION_AND_TEST_PLAN.md`,
`PRIVACY_AND_RETENTION.md`, `ROLES_AND_PERMISSIONS.md` and the RAID register.

| # | Case | Expected behaviour | State |
|---|---|---|---|
| 1 | A couple redeems the same code twice | The existing entitlement is returned, not a second one | covered by test (`codes.test.ts`, `comp.ts` idempotency) |
| 2 | Two people race for the last code of a capped venue | Exactly one wins; the conditional bump is the guard | covered by test |
| 3 | An unlimited venue mints past any number | Always succeeds; the counter still moves for drift reconciliation | covered by test |
| 4 | An unlimited venue crosses its fair-use ceiling | Alerts Signal HQ and keeps issuing (D-020 point 1) | covered by test |
| 5 | A venue with a null allotment mints | Refused, unchanged from before R-016 | covered by test |
| 6 | A long-lead booking redeems on signing | Access runs to wedding + 90 days (R-015) | covered by test, both repos |
| 7 | The couple postpones | Access extends automatically, without anyone asking | covered by test, both repos |
| 8 | The couple corrects the date backwards | Access does not move; the date is corrected | covered by test, both repos |
| 9 | The couple never supplies a date | The 548-day floor applies, unchanged from today | covered by test |
| 10 | The couple supplies an unparseable date | Ignored; the term is never shortened by bad input | covered by test |
| 11 | A code is minted for a known long-lead wedding, then no date is entered | The longer minted duration is honoured | covered by test |
| 12 | A code is redeemed but the shared entitlement is missing | The reconciler compensates on the same rule | covered by code, reconciler path |
| 13 | The venue's licence lapses mid-term | Existing workspaces untouched; only issuance stops | covered by rule and test |
| 14 | The venue releases a workspace | Content kept, branding off within 24 hours | covered by rule; **no writer** |
| 15 | A Clerk account merge strands an entitlement | `clerkIdDead` plus operator re-point | covered by code |
| 16 | The couple asks for erasure | Total hard delete across four modules | covered by code and test |
| 17 | One partner deletes their account | **The whole shared workspace is destroyed** | **uncovered — R-023** |
| 18 | A guest asks for erasure | No identity to erase against | **uncovered** |
| 19 | A supplier objects to being named | No redaction path | **uncovered** |
| 20 | A couple separates | No product answer | **uncovered — E03.10** |
| 21 | A couple loses access to the account | No recovery path | **uncovered** |
| 22 | Dietary and accessibility notes about guests | Article 9 data from people who agreed to nothing | **uncovered — R-017** |
| 23 | A venue describes the product in its own words | No contractual control today | **uncovered — R-020** |

Seven of twenty-three are uncovered. Six of those seven already have an owner in
the RAID register or a founder-decision task; the seventh, R-023, is new.

---

## 12. E04.12 — Deterministic fixtures

`LIFECYCLE_FIXTURES` in `studio/src/lib/venue-lifecycle.ts`: thirteen fixtures on
a **pinned clock** (`2027-06-01T12:00:00Z`), one per state across all three axes,
each carrying a `proves` line saying what a reviewer is looking at.

The clock is pinned because anything derived from `Date.now()` in a fixture is a
fixture that means something different tomorrow.

Three assertions in `venue-lifecycle.test.ts` do the work that matters:

1. **Coverage.** Every state on every axis has at least one fixture. This test
   caught a missing `revoked` invitation fixture during authoring.
2. **Self-consistency.** Each fixture's declared access state is *derived from
   its own dates* and must match, so a fixture cannot quietly describe a state
   it does not represent.
3. **R-015.** The long-lead fixture demonstrably outlasts its own wedding, and
   the flat 548-day term demonstrably would not have.

Fixtures exist for a lapsed licence with access unmoved, and for a released
sponsorship with access unmoved. Those two are the survival promise, loadable on
a screen.

**Not built:** rendering these into review screens (E09, E12) and seeding a
database from them, which needs the entities in section 1 first.

---

## Open questions for the founder

1. **The `opened` definition** (section 3) touches D-013's tracking position. It
   does not contradict it, but it should be acknowledged rather than assumed.
2. **Which venue-identity path is canonical** (section 5): `brandMeta` or the
   `comp_codes.notes` blob. Reconciling them is a real piece of work and the
   choice changes who owns it.
3. **R-023** (section 4): one partner's account deletion destroying the shared
   workspace. Triage now, or log and schedule.
4. **The founding number** (section 1): D-009 point 6 promises `01/25` on
   payment and no field exists. It is due before the first payment clears.
5. **E04.06's scope** (section 6): the mechanism and the invariant are delivered;
   the release writer and its control are left to E07. Accept or push back.
