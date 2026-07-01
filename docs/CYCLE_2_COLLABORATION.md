# Initiative 2 — Collaboration as the moat

**Status**: locked plan · execution begins after Initiative 1 closes
**Owner of plan**: Ethan (decisions) + Claude (execution)
**Drafted**: 2026-05-11

This sprint turns the brand position "collaboration is the moat" into specific gestures that earn the "wow this is intuitive" feeling. It also names what we deliberately don't build.

---

## The line we hold

Collaboration in Signal Studio means **the invited person feels nothing.** No setup. No tool tour. No "create an account first." No glossary. They click a link and they're in the conversation, in the same plain language the creator uses.

The "wow intuitive" feeling is the absence of every friction step they expected. *That's* the moat.

---

## What we are NOT

- Not Slack (no real-time chat)
- Not Notion comments (no threaded discussion)
- Not Asana permission matrices (no per-task role granularity)
- Not Loom (no async video)

What we ARE: a clear workspace someone else can open and immediately understand.

---

## Collaboration model per product

Not every product collaborates the same way. Treating it as uniform would break two locked product definitions.

| Product | Collab model | Why |
|---|---|---|
| Signal Tasks | Multi-user workspaces — Tasks is where shared work lives | Codex framing + suite-wide architecture |
| Signal Timeline | One-way shareable artefacts — public link, no comments | Locked refusal in roadmap/docs/PRODUCT.md |
| Signal Notes | Single-user. Locked. | notes/docs/PRODUCT.md §7: "Not collaborative." |
| Signal | Private — the briefing is for one person | Signal PRODUCT.md positioning |

**Implication:** Initiative 2 changes Tasks + Timeline. It does NOT change Notes or Signal.

---

## The five gestures that earn "wow this is intuitive"

These are the load-bearing user moments. Everything else in Initiative 2 hangs off them.

1. **One-click invite.** A single input in a Tasks workspace: email or copy-link. No "configure permissions first" modal. Default: read + comment.
2. **No-signup guest view.** The invited person clicks the link → sees the workspace immediately. Sign-up is offered when they try to *change* something, not when they try to *see* something.
3. **"You're invited by Ethan" context.** Top of the shared view names the inviter, when it was shared, and what the workspace is *for* — one sentence, the inviter's plain English.
4. **Plain-English activity.** Not "user_2k3 created entity 'task_abc' on workspace 'xyz'" — but "Ethan added two new venue notes 2 hours ago." Same discipline as Signal's prose library.
5. **One-tap reply.** A guest can leave a short reply (not a threaded chain). Defaults to "view the change," opt-in to "tell Ethan about it."

If these five ship well, collaboration feels intuitive. Everything else is decoration.

---

## Cycle breakdown (executed in this order)

| Cycle | What ships | Where it lives |
|---|---|---|
| **10.1** | Workspace member model + invite flow in Tasks | `tasks/src/server/db/schema.ts` (workspace_members table) + `tasks/src/app/app/[ws]/members` + single `InvitePanel` client component |
| **10.2** | Guest view on Timeline shareable artefacts — public link shows workspace name + creator + last-updated time | `roadmap/src/app/[workspaceSlug]/page.tsx` |
| **10.3** | "You're invited by X" context bar + one-tap reply on Timeline shared views | `roadmap/src/components/roadmap/invited-by-bar.tsx` + a small Resend webhook |
| **10.4** | Plain-English activity log in Tasks (last 10 events, human prose) | new tasks table + `formatActivity` mapper |
| **10.5** | Cross-product invite: one invite → guest sees Tasks workspace + Timeline shared update + (if exists) Signal weekly | studio orchestration |
| **10.6** | Branded workspaces — venue/planner logo + accent on shared Timeline view | timeline workspace settings |
| **10.7** | Source attribution wired to real numbers — read params, log to Turso, expose in HQ Metrics | shared `/api/track` |

10.2 and 10.3 can run in parallel after 10.1 lands.
10.5 holds until 10.1–10.4 are real so we don't generalise off a single example.

---

## Locked refusals (don't drift)

- **No threaded comment chains.** One reply per artefact. Conversation belongs in email/Slack.
- **No real-time presence dots.** Visually cute, brand-wrong (they ask for attention; we don't).
- **No "@mentions".** Same reason.
- **No notifications by default.** Opt-in only. Tasks/Timeline stay silent by default.
- **No per-task permission matrix.** Workspace-level only. Granular permissions = configuration tax (BRAND.md §2.2).
- **No public directory of workspaces.** Timeline PRODUCT.md locks this.

---

## What stays unchanged

- **Notes stays single-user.** Notes PRODUCT.md §7 holds. The "promote to task" edge is the only cross-product move from Notes.
- **Signal stays private.** The daily briefing is for one user. No "share my briefing" gesture in v1.
- **No real-time anything.** Optimistic UI + revalidate-on-action. Real-time can come later only if signal demands it.

---

## Success signal

When a venue coordinator forwards the shared Timeline link to a couple — and the couple opens it, understands what's happening, and replies — and the venue forwards three more couples that week — Initiative 2 has paid out.

The metric in HQ to watch: **active venue pilots** (target 3 within 30 days of collaboration shipping) and **guest views per invite** (a healthy number is one creator-invite producing 2-4 guest views, indicating the invite is being forwarded).

---

## Dependencies

- Initiative 1 must close first. Notes Cycle 9.4 (promote-to-tasks API endpoint) IS the first piece of cross-product collab plumbing — it sharpens what Initiative 2 needs.
- The shared Clerk app must remain stable across the four products. (Decided 2026-05-11, suite-wide.)
- The shared Turso architecture stays per-product DBs keyed by Clerk userId.

---

## Open questions to resolve in 10.1

1. **Invite verb**: "Invite" or "Share with"? Default: "Invite" (action-led, warmer).
2. **Default permission**: read + comment, or read-only? Default: read + comment so the gesture feels mutual.
3. **Invite expiry**: never, or 14 days? Default: never (link works forever); creator can revoke.
4. **Email transport**: Resend (matches Timeline) or Clerk-native invites? Default: Resend so the email is in the workspace creator's voice, not Clerk's.
