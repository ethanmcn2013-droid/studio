# Competitor Review — Action & Build Plan

Status: execution-ready · 2026-05-16
Inputs: `COMPETITOR_REVIEW_2026_05.md` (24 panel-passed pitches) + read-only codebase recon. Spine: `BUSINESS_PARTNER_REVIEW_2026_05.md`.
Constraint honoured: studio is on `feat/hq-mission-control-2026-05-16` with a live parallel session (6 modified, 7 untracked). No git, no product code written this session by design — every code item below is taken to spec-ready against exact files, not shipped into a contested tree. Roadmap repo is on `main`, clean.

The discipline: 24 passes is too many to chase. They sequence behind the venue proof gate. Building all of them now would dilute the 30-day focus — the exact failure the spine doc warns against.

---

## What is already DONE (recon found it shipped — do not rebuild)

- **Apple-1 (one-tap send, no-account link):** substantially EXISTS. `roadmap/src/app/[workspaceSlug]/page.tsx` already serves a public, account-less, slug-based Roadmap. The "link" is the URL. The only gap is an owner-side one-tap "copy/send this" affordance — a ~1-file convenience, not a feature. Reclassify: **confirm + add the copy button, not a build.**
- **Superhuman-3 plumbing:** the seed mechanism EXISTS and is pluggable at one line — `tasks/src/server/actions/comp.ts:238`, currently hardcoded `applyTemplateToWorkspace("wedding-planning-workspace", ws)`. The wedding template already exists at `studio/src/lib/templates/wedding-planning-workspace/roadmap.ts`. The *content* is the work, and it is now written (`VENUE_EXAMPLE_ROADMAP.md`).

## What is DONE this session (fully completable, highest active-wedge value)

- **Superhuman-1 — `VENUE_SETUP_RITUAL.md`.** Production-ready. The founder uses it verbatim in the next pilot call. Serves §5 items 1 & 4 directly.
- **Superhuman-3 / §5 item 2 content — `VENUE_EXAMPLE_ROADMAP.md`.** The premium example Roadmap the 30-day plan owed, brand-voiced, doubling as the venue-written seed shape. This was the actual work; the wiring is one line.

## The single unlock for everything else (recon's headline finding)

**Sponsor identity is not persisted on the workspace surface.** Today the venue name lives only on the entitlements row + comp-code notes JSON. Every venue-facing pitch (HBAP-1 eyebrow, HBAP-2 couple briefing, Superhuman-3 per-venue seed, Apple-1 venue-named link) pays a multi-table lookup and fights for mutation windows without it.

**Prerequisite task (do this before any other code pitch):**
1. Add `venueSponsorId` (FK) — or minimally `venueName` text — to the Tasks `workspaces` table. Migration in the Tasks repo.
2. Dual-write at redemption: in `tasks/src/server/actions/comp.ts` around line 235–247 (the existing venue short-circuit), write the sponsor identity onto the workspace row in the same transaction that applies the template.
3. Index it so roadmap/board/briefing read it once and cache.

Everything below assumes this is done first. It is small, it is the keystone, and it is the correct next code action when code resumes on a clean branch.

---

## Build-specs (execution-ready, grounded in recon paths)

| Pitch | Scope | Exact insertion point | Risk |
|---|---|---|---|
| **HBAP-1** venue eyebrow | Small, after prerequisite | After workspace carries `venueName`: render one quiet eyebrow line on the workspace surfaces (Tasks board/list, the Roadmap public header in `roadmap/src/components/roadmap/workspace-header.tsx`). Attribution line, never a skin. | None if prerequisite done; refuse colour/logo even if a sales call asks |
| **Superhuman-3** per-venue seed | Tiny, after prerequisite | `comp.ts:238` — replace hardcoded template id with a sponsor-keyed lookup (`sponsors.seedTemplateId` or venue→template map). Seed content = `VENUE_EXAMPLE_ROADMAP.md` skeleton. | Seed must stay venue-written, never generated (panel condition) |
| **Apple-1** copy/send affordance | ~1 file | Owner-side button on the Roadmap viewer/owner surface that copies the existing public slug URL. The link already works account-less. | Keep it one verb, no permissions/expiry options |
| **Notion-1** public-render preview | Medium | `roadmap/[workspaceSlug]/page.tsx` already IS the public render and has searchParams view-branching (lines ~54–73). Add an owner-only "view as the couple sees it" that renders the same page with owner chrome suppressed. No new render path. | Don't fork the renderer — reuse it |
| **CraftBear-2** reading-width | Small CSS | Same route: header/body are `max-w-[1240px]` (app-width). Add a reading-width treatment to the shared/forwarded state only. | Verify it isn't already acceptable before touching |
| **HBAP-2** couple briefing | Largest | `analytics/src/lib/briefing/build.ts` is a pure data→prose function (no auth inside). Extend `BriefingSource` to accept a workspace-id filter; add a shared, account-less `/[workspaceSlug]/brief` route. Hard-cap three, silent when nothing. | Validate the 3-item compression on lumpy date-anchored wedding plans before shipping — named panel condition |

Sequence the table top-to-bottom: HBAP-1 and Superhuman-3 are trivial once the prerequisite lands and serve the active wedge; HBAP-2 is the heaviest and gated behind venue proof.

---

## Ready-to-paste: the named-refusal pitches (2-minute founder actions, zero build)

These passed unanimously and cost nothing but a decision to publish. Drafted gate-compliant; paste when on a clean branch (not into the live parallel session).

- **ClickUp-1** — `holds` dispatch line + one line on /method:
  > We will not put a robot in your team. The people in your workspace are the people doing the work. Nothing here reads your notes, joins your meetings, or decides what matters for you.
- **ReclaimMotion-1** — one locked line, /method + venue landing:
  > Signal Studio never moves your work for you. It shows you what is slipping, in plain words. You decide what to do.
- **Apple-3** — publish as a standing refusal (PRODUCT.md/§ refusals) and a review check:
  > No setup screen before the first useful thing. If a product asks you to configure it before it helps you, that is a bug, not an onboarding step.
- **Things-3 refusals** — add to Tasks PRODUCT.md §7: no natural-language date parsing in body text, no tag/label taxonomy, no sub-tasks beyond one level. The dateless "Someday" list is the only new surface and only ships if these are published.

These deepen the moat for the cost of a paragraph. Recommend the founder ship the refusal copy in the next clean-branch cycle ahead of any feature build — it is the highest value-to-effort ratio in the whole review.

---

## The rest of the 24 (deferred behind the gate, not dropped)

Notion-2, Linear-1, Todoist-1, Basecamp-2, Sunsama-1, Sunsama-2, ReclaimMotion-2, Productboard-1, Canny-3, Obsidian-1, Obsidian-2, CraftBear-1 all passed and are real. None serve the venue proof gate directly, so they wait. They are recorded in `COMPETITOR_REVIEW_2026_05.md` with their conditions. Revisit after the §8 venue kill/pivot trigger resolves — same discipline as the segment-sequencing decision. Do not let a 24-item backlog pull focus off the one thing the 30 days exist to prove.

---

## Status of the recommended next steps

| Step | State |
|---|---|
| Superhuman-1 (venue ritual) | **DONE** — `VENUE_SETUP_RITUAL.md`, usable now |
| Superhuman-3 content (example Roadmap) | **DONE** — `VENUE_EXAMPLE_ROADMAP.md`, also satisfies §5 item 2 |
| Apple-1 | **Mostly already shipped** — confirmed; residual = one copy button, spec'd |
| HBAP-1, HBAP-2, Superhuman-3 wiring | **Spec-ready, unblocked** — gated on the sponsor-identity prerequisite + a clean branch; deliberately not shipped into the live parallel-session tree |
| Named refusals (ClickUp-1, ReclaimMotion-1, Apple-3, Things-3) | **Copy written, ready to paste** on a clean branch |

The recommended next steps are complete to the furthest point that is safe without racing the parallel session. The two artifacts that serve the active 30-day proof gate are done and usable today; everything requiring code is execution-ready with exact paths and the one prerequisite named.
