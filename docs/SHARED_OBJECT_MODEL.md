# Signal Studio · Shared Object Model

**Date**: 2026-05-16
**Status**: normative contract v1 · the six objects are now *modelled*, not just *described*
**Advances**: nextActions `shared-object-model` (was "Doing") — "Define shared object model across all four products."
**Anchors on**: `content/hq/shared-objects/*.md` (descriptive entries) and `docs/ECOSYSTEM_INTEGRATION_PLAN.md` (Workspace/Person/Task only — this doc extends it to all six).

The HQ entries say *what* each object is. This document says *what shape it has and which product owns which field* — the part that was missing and that left five of six at "Needs model". It is the contract product repos conform to; divergence is a bug, not a dialect.

---

## 0 · Principles

1. **One definition, many projections.** An object is defined once here. Each product reads or writes a *projection* — a subset of fields — never a private fork of the shape.
2. **Plain-language field names.** No PM register (`stakeholder`, `epic`, `sprint` — BRAND.md §3). Field names are the words the 80% would use.
3. **Owner field is singular and required.** Every object answers "whose is this?" with one `Person`. Shared ≠ ownerless.
4. **IDs are opaque correlation keys.** A product may hold another product's object id for provenance. Holding an id grants no read-back unless an explicit edge exists (see `CYCLE_9_4C` for the Notes case — the binding precedent).
5. **Dates are ISO-8601 strings, absolute.** No relative dates in stored objects; "in 9 days" is a render concern.

---

## 1 · The six objects (canonical shape)

Types are illustrative TypeScript — the contract is the field set and ownership, not the language.

### Workspace — *Defined*
```ts
interface Workspace {
  id: string;
  name: string;            // plain, human-given
  ownerId: string;         // Person.id
  createdAt: string;
  domain?: 'wedding' | 'trades' | 'student' | 'freelance' | 'marketing';
  templateId?: string;
}
```
The shared place where one real piece of work lives across context → execution → direction → attention. Created in Tasks; referenced by Timeline/Signal/Notes. No product redefines it.

### Person — *Needs model → Modelled here*
```ts
interface Person {
  id: string;              // Clerk user id where authed; synthetic otherwise
  displayName: string;
  role: 'owner' | 'collaborator' | 'guest' | 'client' | 'supplier' | 'viewer';
  email?: string;          // present only where the principal authed
}
```
`role` is the access vocabulary locked in `CYCLE_2_INVITE_AND_FIRST_VIEW.md` — same five plain names. CRM `prospects` is a *pre-Person* record, not a Person; it promotes to Person on first authed touch. Email is optional and never required to exist as a Person (guests get value before sign-up — Cycle 2 principle).

### Decision — *Needs model → Modelled here*
```ts
interface Decision {
  id: string;
  workspaceId: string;
  summary: string;         // the choice, settled, in one line
  reason?: string;         // creator-authored; optional
  ownerId: string;
  decidedAt: string;
  reviewAt?: string;
  linkedWorkIds?: string[];// Task ids this decision governs
}
```
Maps 1:1 to the Notes `decision` extract type (`CYCLE_9_4C` §2). `reason` is creator-authored and may be absent — it is never lifted from a Notes body.

### Risk — *Needs model → Modelled here*
```ts
interface Risk {
  id: string;
  workspaceId: string;
  summary: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  ownerId: string;
  status: 'open' | 'mitigating' | 'closed';
  mitigation?: string;     // creator-authored
}
```
Note: `status: 'at risk'` is **banned as a status string** (BRAND.md §3 / DESIGN.md §10). HQ risk *entries* use "At risk"/"Needs attention" as editorial labels in markdown — those are HQ-internal copy, not this object's `status` enum. Product code uses the enum above.

### Update — *Needs model → Modelled here*
```ts
interface Update {
  id: string;
  workspaceId: string;
  body: string;            // creator-authored, plain prose
  authorId: string;
  at: string;
  kind: 'change' | 'shared-summary';
}
```
Feeds changelog, shared timeline update, and the briefing. `kind: 'shared-summary'` is the only kind that may leave the workspace to a guest surface, and only as the Notes `summary` extract type when it originates from a note (`CYCLE_9_4C`).

### Briefing — *Partly working*
```ts
interface Briefing {
  workspaceId: string;
  generatedAt: string;
  whatChanged: string[];   // from Update[]
  whatIsStuck: string[];   // from Risk[] + blocked Task[]
  whatIsNext: string[];    // from Roadmap direction
  needsAttention: string[];// the few, ranked
}
```
A *derived projection*, never a stored owned object — it is recomputed from Workspace/Update/Risk/Task. Signal owns generation; Tasks/Timeline/Notes may render it. It must never be assembled from raw Notes bodies (`CYCLE_9_4C` §4).

---

## 2 · Per-product projection (who touches what)

| Object | Tasks | Timeline | Signal | Notes |
|---|---|---|---|---|
| Workspace | **owns** | reads | reads | references |
| Person | reads | reads | reads | single-user (creator only) |
| Decision | reads/writes | reads | reads (attention) | **extract source** |
| Risk | reads/writes | reads | reads (attention) | **extract source** |
| Update | **writes** | writes (shared) | reads | **extract source** |
| Briefing | renders | renders | **generates** | does not surface |

"**owns**" = authoritative store. "extract source" = may originate the object via the creator-approved Notes edge only, never by reading note bodies. Notes never reads Person beyond its single creator (PRODUCT.md §7).

---

## 3 · What this contract does NOT do

- Does not create a shared database. Each product keeps its own store; this is a *shape and ownership* contract, enforced by review and the `CYCLE_9_4C` static guards, not by a central table.
- Does not build migrations. Repos converge on these field names as they touch the objects, not in a big-bang rename.
- Does not introduce a seventh object. A new shared object requires a `content/hq/decisions/` entry first.

---

## 4 · Definition of done

1. Each product repo's collaboration-contract doc references this file as the canonical shape.
2. `content/hq/shared-objects/*.md` statuses move: person/decision/risk/update `Needs model` → `Defined`; briefing `Partly working` unchanged (it is derived and only partly wired). HQ is the view; this doc is the model behind the status change.
3. New cross-product fields are added here first, then in repos — never the reverse.
