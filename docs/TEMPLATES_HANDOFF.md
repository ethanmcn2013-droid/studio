# Templates Session Handoff — 2026-05-12

Session-end report for the templates strategy work. Read alongside `TEMPLATES_STRATEGY.md` (the locked plan) and `CHANGELOG.md` (what shipped per repo).

## Where we are

**The wedge demo loop is four-layer walkable end-to-end.**

Live demo flow:

1. `tasks.signalstudio.ie/templates/wedding-planning-workspace` → click **Remix in a new workspace**
2. Tasks mints a fresh workspace, writes `templateId="wedding-planning-workspace"` and 18 seeded tasks, flips the active-workspace cookie, redirects to `/app/board?remixed=wedding-planning-workspace`
3. Toast appears: title `Wedding planning workspace applied`, body `Fresh workspace seeded with 18 tasks. Yours to edit.`, with a brand-arrow link **Create a Timeline for this →** opening in a new tab
4. Link target: `timeline.signalstudio.ie/onboarding/from-template/wedding-planning-workspace`
5. Timeline form: eyebrow `From template · Wedding planning workspace`, headline `Start from the wedding planning workspace.`, copy `1 project, 8 starter items. Edit them once the workspace is live.`, pre-filled name field, slug auto-derives
6. Click **Create workspace** → Timeline inserts the workspace with the matching templateId, runs `seedWorkspaceFromTemplate` to insert one Planning Timeline project + 8 items, redirects to `/<slug>` (public workspace surface)

**Health checks (curl, 2026-05-13):**

- `tasks.signalstudio.ie/templates/wedding-planning-workspace` → HTTP 200
- `timeline.signalstudio.ie/onboarding/from-template/wedding-planning-workspace` → HTTP 307 → `/sign-in` (auth gate working)
- `timeline.signalstudio.ie/wedding-planning/update` → HTTP 200 (hand-built demo still rendering)

## Cycles closed this session

| Cycle | Repos | What shipped |
|---|---|---|
| T-1 | studio, tasks | Canonical `WorkspaceTemplate` type at `studio/src/lib/templates/types.ts`; wedding-planning-workspace authored as five-file artefact at `studio/src/lib/templates/wedding-planning-workspace/`; Tasks `pnpm sync:templates` script reads sibling studio repo and writes `tasks/src/lib/templates.generated.ts`; Tasks's inline wedding template replaced by spliced sync output at the wedding-section start so gallery order is preserved |
| T-2.0 | tasks | `workspaces.template_id` nullable column added (prod Turso ALTER applied via authed CLI); `remixTemplateAction` writes the value; specialty Tasks-only templates intentionally leave it null |
| T-2.1a | studio, timeline | Canonical `TimelineSeed` reshaped from sections+milestones to projects+items (matches Timeline's product model); wedding `roadmap.ts` re-authored with eight items grouped under one Planning Timeline project using Timeline's status enum (shipped/in-flight/next/blocked/refused); Timeline `workspaces.template_id` column added (prod Turso ALTER applied); Timeline `pnpm sync:templates` script + generated file shipped; `demoWorkspace` and `weddingDemoWorkspace` get explicit templateId fields |
| T-2.1b | timeline | `createWorkspaceAction` accepts a `fromTemplate` form field; `seedWorkspaceFromTemplate` helper inserts projects + items in one pass; new public route `/onboarding/from-template/[id]/page.tsx` + `create-from-template-form.tsx` client component; success redirect goes to `/[slug]` instead of `/app`; `onboarding` added to reserved slugs |
| T-2.1c | tasks | Toast primitive gained optional `action: { href, label, external? }`; `TemplatedToast` now handles `?remixed=<id>` in addition to `?templated=<id>`; for canonical workspace templates (`SYNCED_TEMPLATE_IDS`), the remix-success toast carries a `Create a Timeline for this →` link; specialty templates skip the action |

## What's left to ship

### T-2.2 — Notes lazy expression (deserves its own thinking session)

**Why it's not a copy-paste of Timeline:** Notes is single-user with no workspaces table (PRODUCT.md §7: "No 'today' template. No date-based scaffolding."). The "first visit to a templated workspace" hook from T-2.1b doesn't transfer — Notes doesn't have workspaces or a workspace-create flow.

**Three possible shapes worth deliberating before code:**

1. **Explicit "seed this note" CTA in Tasks.** After remix in Tasks, surface a third toast action (alongside the existing Timeline link): `Add 'Venue site visit' note to your Notes →` opening a Notes route that injects the seeded note from the canonical `notes.ts` slice.
2. **Notes-side `/onboarding/from-template/[id]` route mirroring Timeline.** User lands there, sees the seeded notes preview, clicks Add → notes appear in their stream tagged with template id for later attribution.
3. **Defer Notes templates entirely.** Notes's brand is "private capture, no scaffolding." Any template-driven note injection — even one — might violate that ethos. Worth explicit confirmation from owner before building.

**Recommendation:** start with (3) — confirm Notes templates align with PRODUCT.md §7 before shipping plumbing. The canonical `notes.ts` slice already exists in studio (one prompt: "Venue site visit · capture decisions, questions, follow-up") so reactivating later is cheap.

### T-2.3 — Signal lazy expression (dormant)

Signal is marketing-only as of 2026-05-11 canonical state. The `/app`, `/method`, and `/api/cron/daily` routes 404 in production. T-2.3 work would land but nothing would consume it. **Defer until the Signal briefing pipeline actually ships.** Then: sync script for Signal + hint consumption at briefing-build time.

### T-3 through T-6 — Other anchor templates

The remaining four anchor templates from `TEMPLATES_STRATEGY.md`:

- **T-3** Trades job pipeline workspace (Ireland-validatable; second wedge candidate)
- **T-4** Final paper sprint (lift from existing Tasks-only template)
- **T-5** Freelance client engagement (seed from `new-client-onboarding`)
- **T-6** Local business monthly rhythm (highest copy-risk; needs BRAND voice pass)

Each anchor template = one studio canonical directory + Tasks sync output + Timeline sync output (now they all need the Timeline slice too) + optional Notes slice. The pattern is established by wedding-planning-workspace — these are mechanical follow-ons once authored.

### T-7 — SEO redirects

Timeline-template SEO names in `studio/signal-growth/seo/template-strategy.md` redirect to anchor-template `/templates/[slug]` pages. Pure SEO consolidation; nothing depends on it.

### T-2.1d (optional polish, not in original plan)

After live verification: would the Timeline form `/onboarding/from-template/[id]` benefit from showing a **preview of the items that will land** (collapsed list) before commit? Currently it shows just the count. Worth a UX call after walking the live flow.

## Patterns established this session

These are the templates that future cycles should follow:

### Pattern: prod Turso schema changes

Tasks has NO automated migration on Vercel build. Every schema column change needs a manual `ALTER TABLE` on the relevant prod Turso DB **before** code that writes the new column ships. Two-step:

1. Code: define the column in `src/server/db/schema.ts`, but DON'T reference it in any `INSERT` yet
2. Run: `turso db shell ethanmcnamara-<product> "ALTER TABLE <table> ADD COLUMN <col> <type>;"`
3. Verify: `turso db shell ethanmcnamara-<product> "PRAGMA table_info(<table>);"`
4. Code: enable the column reference; commit; push

T-2.0 originally tried to skip step 1's gating discipline and shipped broken code that needed a hotfix. Don't repeat that.

### Pattern: sibling-repo sync

The studio canonical templates live at `studio/src/lib/templates/` and each consuming product has a `scripts/sync-templates.ts` that:
- Reads the sibling studio repo via `pathToFileURL`
- Dynamic-imports `WORKSPACE_TEMPLATES` from `studio/src/lib/templates/index.ts`
- Picks out only the slice that product cares about
- Writes a committed `src/lib/templates.generated.ts` with `import type { ... }` cycle-safe pattern

Vercel doesn't see the studio repo. The generated file IS what Vercel builds. Re-run sync any time the canonical changes.

### Pattern: lazy expression

Tasks owns the gallery surface. Other products consume `templateId` metadata via "first action with template context" — for Timeline, that's workspace creation with `?fromTemplate=<id>`. The user opts in by clicking the cross-product CTA; nothing is auto-written cross-product.

Each consuming product gets its own `/onboarding/from-template/[id]` route owned by that product. Tasks doesn't write to Timeline's DB; the user creates the Timeline workspace explicitly.

## Commits pushed this session

- **studio**: `a559f30 → fdb0a20` (6 commits — strategy lock, T-1, T-2.0 reconciliation, T-2.1a, T-2.1b reconciliation, T-2.1c reconciliation)
- **tasks**: `5b3cb35 → c17a8a5` (5 commits — T-1, T-2.0, hotfix, T-2.0 ungate, T-2.1c)
- **timeline**: `01cf0e8 → 58b7f05` (2 commits — T-2.1a, T-2.1b)

Three Vercel auto-deploys triggered. All health checks pass.

## Manual verification still owed by owner

Curl-level health is green. The flows that need a human are:

1. **Sign into Tasks** and walk the remix → toast → timeline onboarding loop end-to-end. Confirm the toast shows the action link, the cross-domain new-tab opens, the Timeline form pre-fills, and the resulting workspace has one project + eight items.
2. **Sign into Timeline** and navigate directly to `/onboarding/from-template/wedding-planning-workspace` (skip the Tasks side). Confirm the form renders, accepts a slug, creates the workspace, and the public `/<slug>` page shows the planning project with eight items.
3. **Verify Signal HQ** at `signalstudio.ie/hq` shows the updated templates list (wedding-workspace notes line + the three new "Idea" anchor templates) and the new `templates-cross-suite-canonical` decision.

If any of those break, file the breakage against the cycle that introduced it (toast: T-2.1c · onboarding form: T-2.1b · seed logic: T-2.1b · workspace insert with templateId: T-2.0).

## One thing that wasn't in the plan

Mid-session, Codex/Timeline shipped cycles 11.3–11.5 (cinematic demo rebuilds on Timeline, Signal, Notes homepages). That work is orthogonal to templates — no merge conflicts in either direction. Worth noting because the Timeline CHANGELOG now interleaves Cycle 11.3 and the T-2.1a/b template entries on the same date.
