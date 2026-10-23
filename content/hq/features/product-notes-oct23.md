---
id: product-notes-oct23
title: October product notes — bounded implementation
product: tasks
status: In Progress
lastVerified: 2026-10-23
---

# October product notes — bounded implementation

The 15–19 October brief contains **42 product-note items** across the signed-in app. It is separate from the original 58-section Ping programme. Preparing this work does not change that programme's completion figures or pass its gates.

**None of the new product-note changes is deployed or accepted in production in this record.** Existing functionality found during the audit remains distinct from new candidate code. Built source, independent source review, cloud checks, rendered receiving and production acceptance are separate evidence stages.

## Scope and authority

The supplied brief requires verification before rebuilding, small changes by area, and preservation of existing designs and data. Current execution state, ownership and next proof remain in the [Delivery coordination record](https://github.com/ethanmcn2013-droid/signal-studio-workspace/issues/111#issuecomment-6371451245). This feature record describes product scope and evidence limits; it is not another delivery queue.

The brief's retained source digest is `e491f0e102a5736764ab74caae1e2a200fd47870ec27581dfbfc28202f212be1`. The audit began from App `891eee1c646397c4b5ddd29266717cc5bf9922da`.

## What the candidate changes

| Area | Prepared scope and retained boundary |
|---|---|
| Shell and Home — A1–A4, B1, B3, C2 | Header cleanup, invitation inside a popover, bottom-right toast placement, project-to-board navigation, and Inbox as a Home tab. Existing floating Settings remains. Invitation only applies to a verified, explicit single Project; private and aggregate surfaces do not gain sharing controls. |
| Project menus — B2, D5 | Extend the actual sidebar menu with shared Project colour, narrow rename, invitations, recoverable archive and confirmed primary-owner deletion. Reuse canonical lifecycle services and retention rules. Archive Undo and durable Restore remain distinct from permanent deletion. No production deletion is authorized by this record. |
| Projects — D1–D4 | Keep one done/open progress bar per Project, retain the visible owner, remove “Needs a look”, and replace absent declared status with factual task progress or an unavailable state. “See timeline” previews authorized dated milestone Tasks with explicit limits; it does not publish a guest timeline. |
| Tasks — D6, E1–E5 | Refine light-mode surfaces, preserve existing assignee avatars, collapse and reorder board columns, show Project progress, and switch Board/Calendar/List in the client. A finished-Project moment offers archive after an observed completion transition; it does not archive automatically and respects reduced motion. |
| Chat — G5, G7, G8 | Saved-notes image paste, personal conversation hide/restore, and removal of an always-visible counter are bounded candidate changes. Project/DM attachments are a separate admitted schema, custody, privacy and client slice; saved-notes paste does not prove those attachments work. |
| Analytics — H1 | Centre the existing search and simplify the count-explanation area. Detail cards and custom report building remain outside this small cleanup. |

## Designs and existing capability remain intact

The approved October Home remains the design baseline. Concept stubs do not prove that an earlier ten-option Home round was completed. New Home directions remain choices for Ethan.

The newer approved Files Sources-and-shelf presentation supersedes the brief's older missing folder screenshot. Keep that design and its graphic panel; do not rebuild an obsolete reference without a demonstrated gap.

The released Chat/Ping redesign remains the baseline. Floating chat, Saved notes and the existing Markdown export are not new work from this brief. Personal hide/restore only changes the viewer's list. It does not archive or delete a shared channel, remove collaborators' access, or erase their history.

Existing Timeline overview, guest-facing content and phone preview are preserved. Project milestone previews add no Timeline publication or guest access. Existing app/tool icons and browser dictation are not evidence of newly completed design sprints or qualified voice Ping.

## Evidence snapshot — 23 October, 18:28 UTC

The implementation tracker was recorded at 18:23 UTC; the release matrix was recorded at 18:28 UTC. The matrix says all five cloud captures were in progress, no new product-note changes were merged or deployed, and no new materiality attestation was accepted. The table names those candidate heads rather than implying later results.

| App candidate | Recorded head | Source-review state in the matrix | Cloud and receiving boundary |
|---|---|---|---|
| [Analytics PR 318](https://github.com/ethanmcn2013-droid/app/pull/318) | `7c75fdeddc58c5f6d5ba8b536d97e077a81a3b03` | Revision-bound source review recorded | Hosted verification, design and capture runs started; acceptance pending. |
| [Projects PR 319](https://github.com/ethanmcn2013-droid/app/pull/319) | `08245f257561f18de230c83077bc884b2f1cda76` | Revision-bound source review recorded | Fresh capture and viewport/focus followup must be received at their final revision. |
| [Chat PR 320](https://github.com/ethanmcn2013-droid/app/pull/320) | `9f8236d2089d0c181c2ed53a617ba35508d52bcc` | Revision-bound source review recorded | Combined browser acceptance and current cloud gates remain separate. |
| [Tasks PR 321](https://github.com/ethanmcn2013-droid/app/pull/321) | `050f4fb71d24a12f765e554fa19c753b58a2e58e` | Final review rebind requested | Fresh capture, final gates and live receiving pending. |
| [Shell PR 322](https://github.com/ethanmcn2013-droid/app/pull/322) | `b6971ef3a7f4bb4e8385cc722956c7098cc07193` | Final review rebind requested | Stable toast selector and collaborator-state corrections require combined receiving. |

Focused source tests and synthetic component fixtures support the candidate implementations. They do not establish authenticated Next routing, production data behavior, complete cloud CI, or live acceptance. Prior materiality receipts remain bound to their older complete fixture manifest; they cannot be relabelled as proof of these new candidates. Later Project-menu and Project/DM-attachment slices require their own final revision, review and receiving evidence.

## Decisions and production actions still held

Design directions remain for Ethan to choose: Home, the wider toast sprint, scrollbar behavior, right-click coverage beyond the admitted Project menu, custom reports, and the separate Automations and Whiteboards sprints. Chat autocomplete is exploration only. An automation preview is not an active runner; a Whiteboard placeholder is not a finished tool.

Notes retirement is preparation only. Production Notes data must be archived rather than deleted, and the brief explicitly requires Ethan's confirmation before that production action. Saved notes in Chat is unaffected. This record does not grant that confirmation.

Clerk remains the native sign-in system. Provider research and prepared copy do not mean Google, Facebook or phone sign-in has been enabled in the production Clerk instance. Phone eligibility, plan and SMS requirements remain configuration work. OpenAI sign-in has not been enabled or replaced with a custom provider.

This work does not broaden Ping access, enable guest access, activate a separate assistant, qualify native voice recognition, alter a provider budget, or publish a Timeline. Existing assistant access and production allow-list receiving remain separately controlled. No production credentials, purchases, outreach or public launch are authorized here.

## Acceptance update required

Replace the dated evidence snapshot only after final revision-bound source review, required cloud checks and independently received captures. Record production deployment and exact live behavior separately when authorized. The coordinator then reconciles the Delivery outcome and native Project state; neither a merged PR nor this HQ draft is a completion receipt.
