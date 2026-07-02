# Signal Studio · Known Limitations (marketing brief)

**Purpose.** A short, honest list of what is not yet working as intended in production. Marketing copy must not claim any of the flows below as fully live until the resolution line moves.

**Source.** Compiled from `audit/ISSUES.md` and the operator deferral list in `studio/docs/shipped-state.md`. Current as of 2026-06-05.

**Read first.** Anything not listed here is safe to claim as live per `studio/docs/shipped-state.md`. When in doubt, default to silence rather than fabrication.

---

## 1 · Timeline write paths are paused

**What.** Signal Timeline's production environment has no Upstash credentials, so the rate-limiter fails closed on every write request.

**Current behaviour.** Read paths (the public viewer, the three-view switcher, shared workspace URLs) work. Workspace creation, project edits, and any other write surface return a paused-write banner instead of writing.

**Resolves.** Operator-pending. Upstash provisioning on Vercel, then a redeploy. Marketing may describe Timeline as live for the public viewer only. Do not invite a reader to create or edit a timeline until this clears.

**Reference.** `audit/ISSUES.md` Timeline write-path row. `studio/docs/shipped-state.md` lines 23 and 47–51.

---

## 2 · Tasks `/app` walkthrough is not operator-verified end-to-end

**What.** Signal Tasks is live and the marketing surface is reliable. The signed-in `/app` walkthrough through Clerk and Turnstile has not been verified end-to-end against production by the operator.

**Current behaviour.** Sign-in works. The workspace renders. Edge cases in the live walkthrough (specifically the Turnstile and Clerk handshake under production envs) have not been ticked through by hand.

**Resolves.** Operator-pending. Ethan signs in to production Tasks, walks the full flow, and reports back. Until then, demos should default to the homepage cinematic demo at `tasks.signalstudio.ie` rather than improvising inside `/app` live.

**Reference.** `studio/docs/shipped-state.md` lines 43–45.

---

## 3 · DKIM is still pending on signalstudio.ie

**What.** DKIM signing for `hello@signalstudio.ie` is not yet completed in Google Workspace Admin.

**Current behaviour.** Outbound mail from `hello@signalstudio.ie` sends, but without DKIM the deliverability profile is weaker than it should be. Some receivers may quarantine or downgrade the message.

**Resolves.** Operator-pending. Complete DKIM in Google Workspace Admin and verify against a mail-tester run.

**Reference.** `audit/ISSUES.md` Deferred-to-operator list.

---

## 4 · Signal cron and email are not yet wired in production

**What.** Signal's daily and weekly briefings depend on two environment variables that are not set on Vercel: `CRON_SECRET` (protects the cron endpoint) and `RESEND_API_KEY` (sends the briefing email).

**Current behaviour.** The web `/app` briefing renders for a signed-in user reading the live read-model. The 06:00 UTC daily cron and the Monday weekly cron do not fire, and no briefing email is sent.

**Resolves.** Operator-pending. Set `CRON_SECRET` and `RESEND_API_KEY` in Vercel project settings, then redeploy. Marketing may describe Signal as live for the web briefing. Do not promise a daily email until this clears.

**Reference.** `audit/ISSUES.md` Deferred-to-operator list. `studio/docs/shipped-state.md` lines 60–66.

---

## 5 · Notes inbound capture is not yet wired

**What.** Signal Notes's email-to-capture endpoint depends on `NOTES_CAPTURE_INBOUND_SECRET`, which is not set, and the DNS for `capture@notes.signalstudio.ie` is not yet pointed at the inbound handler.

**Current behaviour.** The in-app notebook is live. Notes→Tasks promote is live. Sending an email to `capture@notes.signalstudio.ie` does not currently create a note.

**Resolves.** Operator-pending. Set the inbound secret on Vercel and configure DNS. Marketing may describe Notes as live for the in-app capture and the promote action. Do not claim email-to-capture as live until this clears.

**Reference.** `audit/ISSUES.md` Deferred-to-operator list. `studio/docs/shipped-state.md` line 58.

---

## 6 · Notes search UI and mobile share sheet are deferred

**What.** Full-text search across notes (FTS5 index exists at the database layer) does not have a UI yet. The iOS / Android share-sheet entry point is not built.

**Current behaviour.** Users can browse, write, and promote notes inside the web app. Search within the notebook surfaces no results control. Sharing into Notes from a phone share-sheet is not available.

**Resolves.** Product-pending. Scoped for post-handoff cycles.

**Reference.** `studio/docs/shipped-state.md` line 58.

---

## 7 · Pricing labels lag the shipped state

**What.** `signalstudio.ie/pricing` carries "in build" labels for Notes and Signal that are stale. Both products shipped in May.

**Current behaviour.** Source has been corrected to read "live" / "Shipping now" but the production deploy has not been verified to reflect the new labels.

**Resolves.** Verify on next prod deploy. If labels still read "in build" after deploy, raise it — saying "in build" about a shipped product is itself a reality violation.

**Reference.** `audit/ISSUES.md` row `studio-02`. `studio/docs/shipped-state.md` lines 28–32.

---

## What to do with this list

- Hand it to anyone writing copy that touches a production claim.
- Cross-check it against `studio/docs/shipped-state.md` — that file is the positive list (what is safe to say); this file is the negative list (what is not yet honest to say).
- When an item resolves, the operator updates `shipped-state.md` and the row here gets cut.
