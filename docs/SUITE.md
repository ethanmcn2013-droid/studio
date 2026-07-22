# Signal Studio · Suite primer

This is the architecture-level primer for the four Signal Studio products. `BRAND.md` owns voice and visual rules. `VISION.md` owns strategic intent. `AGENTS.md` owns workflow. This file owns how the products fit together now.

**Architecture verified:** 2026-07-22. **Option D Timeline release:** implementation and production evidence in progress.

## 1 · Four products, one authenticated app

Signal Studio still has four product identities. Consolidation changed the runtime, not the product promise.

| Product | Role | Canonical authenticated route | Current claim |
| --- | --- | --- | --- |
| Signal Notes | Context | `app.signalstudio.ie/app/notes` | Private capture and the exact Notes-to-Tasks handoff are deployed. |
| Signal Tasks | Execution | `app.signalstudio.ie/app/work` | The execution workspace is deployed in private preview. |
| Signal Timeline | Direction | `app.signalstudio.ie/app/plan` | The owner module is deployed. The selected Option D link-only artifact is in its production release pass and is not yet a safe deployed claim. |
| Signal | Attention | `app.signalstudio.ie/app/brief` | The briefing module is deployed in private preview. Planning Period depth remains gated by its own release evidence. |

`signalstudio.ie` remains the public umbrella and the home of marketing, pricing, the waitlist, brand, and private Signal HQ. `app.signalstudio.ie` is the canonical authenticated product origin. `tasks.signalstudio.ie` remains a working alias. The former Notes, Timeline, and Signal product app routes redirect into the corresponding unified modules, while product marketing routes return to the umbrella.

The unified app lives in the Tasks repository and contains bounded `notes`, `timeline`, and `signal` modules. The retired product repositories remain canonical evidence and, where explicitly recorded, migration ledgers or rollback references. They are not parallel product front ends.

## 2 · Shell and artifact boundaries

The authenticated app uses one shared operating shell, one identity session, and one product rail. That shell is correct for work: switching modules, managing a Workspace, editing, publishing, and checking settings.

A shareable artifact is different. It is an experience page, not an operating page.

- The owner manages Signal Timeline inside `/app/plan` and its audience routes.
- A recipient opens `/s/<unguessable token>` outside the app shell.
- The recipient does not see the black product rail, account controls, owner tools, or a dashboard.
- The owner phone preview renders the same artifact component at phone width but never records a view.
- The shared route is not listed, indexed, added to a sitemap, or discoverable through a public directory.
- The compatibility edge for `timeline.signalstudio.ie/s/<token>` belongs to the Option D release and must not be described as working until its deployment receipt exists.

Lowercase wordmarks remain motion-typographic marks. Body copy uses Signal Tasks, Signal Timeline, Signal, Signal Notes, and Signal Studio. The suite still uses Geist, white paper, one indigo accent, and reduced-motion equivalents.

## 3 · Data shape after consolidation

Application consolidation did not merge all product data into one schema.

- Tasks remains the runtime authority for Workspace and Membership.
- Notes, Timeline, Signal, and entitlement data keep their recorded stores and permission boundaries.
- The unified app opens those stores through module-scoped configuration. Credentials never cross into the browser.
- Canonical migrations remain in the ledger named by the product contract. A mirrored runtime schema must change in the same release and pass contract checks.
- Cross-module publication still uses server-side allowlists. Hiding a private field in a component is not a privacy boundary.

For the selected Timeline artifact, the canonical publication ledger remains under the Timeline repository's `drizzle/` history while the serving runtime lives in the Timeline module inside Tasks. The Option D release adds qualified-view state through an additive migration only after backup, isolated-copy dry run, integrity checks, production apply, and post-check receipts.

The view metric stores a publication aggregate and a short-lived hashed receipt. It does not store the raw bearer token, IP address, referrer, or user-agent. Owner previews, metadata fetches, prefetches, hidden tabs, reload storms, and duplicate sessions do not count as separate people.

## 4 · Product handoffs

The products stay narrow even though they now share a shell.

1. **Notes → Tasks.** A person selects an exact note extract and sends it into Tasks. Notes keeps the source. The handoff is explicit and one-way.
2. **Tasks → Timeline.** The owner chooses the milestone projection that becomes the published direction artifact. Private Tasks do not cross automatically.
3. **Tasks → Signal.** Signal reads bounded work state and explains why an item needs attention. Signal does not become a second editor.
4. **Signal → Studio HQ.** Operational receipts can inform the founder view without making HQ a product surface.

The operating loop remains:

`Notes → Tasks → Timeline → Signal`

Capture the context. Do the work. Show the direction. See what needs attention.

The collaboration loop remains:

`Workspace created → collaborators invited → work becomes clearer → shareable output created → new creator discovered`

Signal Timeline is the strongest travelling object in that loop. The selected artifact is one horizontal, date-scaled line with completed distance, milestone points, a precise Today dash, **Our next milestone**, and completion or days-remaining lenses.

## 5 · Current release boundaries

### Deployed

- The unified authenticated app at `app.signalstudio.ie`.
- Tasks, Notes, Timeline owner, and Signal modules inside that app.
- The exact Notes-to-Tasks handoff.
- Legacy product app redirects and the umbrella marketing home.

### In production release work

- Option D Timeline owner studio and standalone link-only artifact.
- Publication-level qualified view aggregate and privacy-minimised deduplication receipts.
- The Timeline-domain compatibility redirect for share links.
- Owner phone preview, link rotation, revocation, and final accessibility/privacy/browser evidence.

### Staged or later

- Planning Period and Audience Timeline broad availability remain gated by their production programme.
- Milestone photo memories are a later story layer. They require explicit publication, consent, storage, retention, export, and deletion rules.
- Viewer-to-creator attribution is later than qualified viewing and must never leak the bearer link into general analytics.

## 6 · Locked boundaries

- No fifth product. The suite is Signal Notes, Signal Tasks, Signal Timeline, and Signal.
- No public directory of Timeline publications.
- No public-by-default private work. Sharing is an explicit owner action through an unguessable, rotatable, revocable link.
- No comment-thread system on Timeline.
- No raw private Note or Task body crossing into a publication by implication.
- No request count presented as people. Qualified viewing has an explicit definition and a privacy-minimised receipt.
- No app rail on the recipient artifact.
- No automatic task extraction from Notes. Promotion is user-selected.
- No Signal dashboard builder. Briefing stays first and bounded.
- No model marketing, generic category visuals, extra accent colours, or jargon that assumes a technical team.
- No demo-versus-reality gap. Planned and local work stays labelled as planned or local until production proof exists.

## 7 · Truth and release rule

GitHub `main`, the production deployment, provider-backed journeys, and retained receipts together form the release truth. None is sufficient alone.

For a shareable Timeline release, verification must cover the owner route, cross-tenant denial, strict public projection, token rotation, immediate revocation, qualified-view deduplication, owner-preview exclusion, response privacy controls, absence of third-party token leakage, keyboard access, reduced motion, phone layout, and the compatibility link. Until that evidence exists, describe Option D as selected and in production release work, not deployed.

The Studio repository remains the umbrella and Signal HQ. Product behavior belongs in the unified app. Studio may record decisions, risks, architecture, compatibility redirects, and release truth; it does not recreate the product.
