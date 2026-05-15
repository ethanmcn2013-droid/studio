# Cycle 9.4c · Notes Extract-Level Permission Contract

**Date**: 2026-05-16
**Status**: contract locked · schema + tests deferred to a build cycle (see §6)
**Supersedes nothing. Extends**: `CYCLE_9_4B_NOTES_PRIVATE_LAYER.md` (its named "Next: Define extract-level permissions for actions, decisions, risks, and summaries").
**Grounded in shipped code**: `notes/docs/PRODUCT.md` §"Notes writes" / §"Notes privacy boundary" — the live `extract_body` → `POST /api/notes-extract` edge (Cycle 9.4b, 2026-05-12).

This document defines *what is allowed to leave Signal Notes, in what shape, by whose action, and what is provably forbidden from leaving*. It is a privacy boundary specification, not a feature plan. If a future surface needs note-derived data, it conforms to this contract or it does not get the data.

---

## 1 · The invariant (non-negotiable)

> **Raw note bodies never leave Signal Notes. Only a creator-authored, creator-approved extract crosses any boundary — and only the extract, never the note it came from.**

This is already true for actions (the only extract type shipped). This contract generalises it to four extract types without weakening it. Every clause below exists to keep this one sentence true.

The invariant is a refusal in the §10 sense (DESIGN.md): it compounds. The moment one shared surface can join back to a raw note body, the privacy position is gone suite-wide, not just in Notes.

---

## 2 · The four extract types

A note can produce, by deliberate creator approval, exactly four kinds of extract. No fifth type without a decision entry. Each maps to an existing shared object (`content/hq/shared-objects/`), so the suite vocabulary does not fork.

| Extract type | Maps to shared object | What it is | Destination edge | What it must never carry |
|---|---|---|---|---|
| **Action** | `task` | A creator-authored, owned next step. Shipped today as `extract_body`. | `POST /api/notes-extract` → Tasks | The note body. Any text the creator did not type into the extract field. |
| **Decision** | `decision` | A choice the creator has settled and is willing to make legible. | Deferred edge → Roadmap shared update / Tasks decision log | Reasoning the creator kept in the note. Rejected alternatives unless re-typed into the extract. |
| **Risk** | `risk` | A named exposure the creator chooses to surface. | Deferred edge → Roadmap / Analytics attention | Mitigation detail or blame framing left in the note. |
| **Summary** | `update` | A creator-authored synopsis for a shared update or briefing. | Deferred edge → Roadmap update / Analytics briefing | Verbatim note prose. A summary is *re-authored*, never a substring lift. |

**Authorship rule (the load-bearing one).** Every extract is *typed by the creator into a dedicated extract field*, exactly as `extract_body` works today. The system never derives an extract by summarising, parsing, or excerpting the note body. This is what makes the privacy boundary mechanical rather than aspirational — there is no code path from note body to shared surface to audit, because none is ever written. It also keeps Notes inside its banned-word position: no "AI summary", no auto-detect (PRODUCT.md §"Not AI-marketed", DESIGN.md §10).

---

## 3 · Permission model

| Question | Answer |
|---|---|
| Who can create an extract? | The note's creator only. Notes is single-user (PRODUCT.md §7) — there is no other principal. |
| Who can approve it crossing the boundary? | The creator, per extract, by an explicit action (the draft-action button pattern, PRODUCT.md §"Bottom-right corner"). No bulk approve. No "approve all future". |
| Is it revocable? | Yes. Revoking an extract deletes the extract row and nulls the destination link (`promoted_task_id` and its successors). Revocation does not delete the destination object — a task already worked on is not silently destroyed; it is detached and the creator is told. |
| Is it auditable? | Each extract row is its own audit record: `{noteId, type, body, approvedAt, destinationRef, revokedAt?}`. The note body is never part of the audit trail. |
| Does an extract re-sync if the note changes? | No. An extract is a point-in-time creator statement, not a live mirror. Editing the note after extraction does not propagate. This is deliberate: a live mirror would be a covert channel for raw note content. |

---

## 4 · The forbidden joins (negative space)

These are the queries that must be impossible, not merely discouraged. Stated as forbidden joins so a reviewer can grep for them:

- No shared workspace, roadmap update, analytics briefing, guest view, or public surface may `SELECT` from the Notes `notes.body` column. Ever. For any reason.
- No cross-repo edge may transit `notes.body`. The only payload the Notes→Tasks edge carries remains `{ clerkUserId, noteId, extract_body }` (PRODUCT.md). New extract types extend the *type* enum and the *body* field; they never add the raw body.
- No analytics aggregate, count, or signal may be computed over raw note bodies — not even a word count, not even "notes written this week" if that figure is derived by reading bodies. Counts come from extract rows or note metadata (`created_at`), never body content.
- `noteId` may cross as an opaque correlation key only. No surface may use a `noteId` to fetch the body. The Tasks-side handler stores the id for provenance; it has no read-back grant to Notes.

If a future feature appears to need one of these joins, that is the signal to add an extract type in §2 — not to pierce the boundary.

---

## 5 · Interaction with existing decisions and the loop

- Consistent with `content/hq/decisions/notes-private-by-design.md` and CYCLE_9_4B's product rule. This contract is the mechanism behind that decision, not a new position.
- The collaboration loop (workspace → invited → clearer → shareable output → new creator) is preserved: shareable outputs are *built from approved extracts*, never from private raw notes (CYCLE_9_4B §Next, third bullet). A guest seeing a clear shared update is seeing creator-approved summary/decision extracts — by construction they cannot be seeing note bodies.
- Voice: extract types are named in plain language (action, decision, risk, summary), not PM register. No "stakeholder", no "epic" (BRAND.md §3 / DESIGN.md §10).

---

## 6 · Test contract (the thing 9.4b deferred "until the model exists")

The model now exists (this document). The tests below are specified now and **built in the same cycle that builds the extended schema** — not before, because asserting against unbuilt tables is theatre. Specifying them here makes the build cycle's definition-of-done unambiguous.

When the multi-type extract schema is built, these tests must exist and pass:

1. **Boundary-isolation test.** For each of the four extract types, assert the cross-repo payload contains exactly `{clerkUserId, noteId, <type>, body}` and that `body` is byte-identical to the creator-typed extract field — never a substring of, superset of, or transform of `notes.body`. Property test with adversarial note bodies (note body ⊄ payload, payload ⊄ note body unless creator literally retyped it).
2. **No-read-back test.** Assert the Tasks-side / Roadmap-side / Analytics-side handlers have no credential or code path that can `GET` a Notes body by `noteId`. Static assertion: grep the destination repos for any Notes body fetch and fail CI if found.
3. **Forbidden-join test.** Static check (extends the §4 list): fail CI if any non-Notes repo references `notes.body` / `note_body` / a `notes` table body column.
4. **Revocation test.** Revoke each extract type; assert the extract row is gone, the destination link is nulled, the destination object survives detached, and no body leaked into the destination during its lifetime.
5. **Edit-no-propagate test.** Mutate a note after extraction; assert no destination surface observes the change.

Test 3 is the cheapest and highest-leverage — it is a static grep guard and should ship even before the schema, as a standing CI invariant. (See the cross-repo dead-code guard shipped this same cycle — same enforcement shape, different target.)

---

## 7 · What this contract does NOT do

- Does not build the multi-type extract schema. Today only `extract_body` (action) exists. Decision/risk/summary edges are *contracted* here and built when there is a surface that needs them — not speculatively.
- Does not add a Notes→Analytics edge. Still deferred to v2+ (PRODUCT.md). When it lands it conforms to §4.
- Does not make Notes collaborative, exportable, or AI-marketed. Those refusals (PRODUCT.md §7) are untouched.
- Does not change the shipped action edge. It is the reference implementation; the other three types copy its shape exactly.

---

## 8 · Definition of done for the eventual build cycle

1. `notes` schema gains a typed extract relation (`extract { id, note_id, type: 'action'|'decision'|'risk'|'summary', body, approved_at, destination_ref, revoked_at }`) — replacing the single `extract_body`/`promoted_task_id` pair, migrating existing rows to `type:'action'`.
2. The draft-action affordance generalises to a four-option approve control, creator-only, per extract, revocable.
3. All five §6 tests exist and pass; test 3 (static forbidden-join grep) runs in CI for every Signal repo.
4. `content/hq/decisions/notes-private-by-design.md` gains a reference to this contract; `launch-readiness/cross-product-integration.md` notes the boundary is contractually enforced.
5. Dispatch entry per BRAND.md §6.5 only if a user-visible surface changes — the schema alone is silent work.
