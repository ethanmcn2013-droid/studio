# Signal Studio email principles

Date: 2026-07-16. The durable rules of the email system, independent of
which visual direction the founder chooses. These extend BRAND.md §3 into
the inbox; where they conflict with anything else, BRAND.md wins on voice.

## The contract with the recipient

Every message answers five questions without scrolling back: why you
received it, what happened, what to do, what happens next, where to get
help. Every message has one dominant job and at most one button.

## The four modes

1. **Utility** (security, billing, data rights, deletion): compact, exact,
   minimal branding, no promotion, no cross-selling. Dates, amounts and
   consequences appear as facts in key-value rows, not buried in prose.
2. **Guided product** (welcome, access ready, onboarding, verification
   approved): one clear next step, one relevant product image at most, no
   feature dumps.
3. **Founder outreach** (venues, schools, partners): a letter. Personal
   opening, short paragraphs, one film poster at most, one reply-or-meeting
   ask, a real signature, no navigation, no feature grid, no boilerplate.
4. **Editorial** (the Dispatch, real launches): strong typography, one
   principal story, real product imagery, restrained, no content treadmill.

## Voice absolutes in mail

- No em dashes, no exclamation marks, no banned-list words (BRAND.md §3).
- Plain English, short paragraphs, declarative sentences.
- No guilt language in deletion or cancellation mail. No "sad to see you
  go". No false urgency, no fake scarcity, no countdowns.
- Security mail is quiet by design; decorative urgency reads as phishing.
- Money and dates are exact: euro amounts with cents where charged, dates
  written out in the en-IE register, Dublin time named when hours matter.

## Technical floor

Every template, no exceptions:

- Single column, direction max width 520 to 600px, generous mobile padding.
- No JavaScript, no CSS variables, no external stylesheets, no background
  images carrying meaning, no embedded video.
- Real text everywhere meaning lives: codes, amounts, dates are never
  images. Images get accurate alt text and explicit dimensions.
- Hidden preheader on every message.
- A plain-text twin rendered from the same source in the same pass.
- One bulletproof primary action (padded anchor) plus a raw-link fallback.
- Dark mode as progressive enhancement; legible when the media query is
  ignored and when a client force-inverts.
- Geist first, with system fallbacks doing the real work.
- Film posters are static composed frames linking out; inbox playback is
  never assumed.

## Volume discipline

Signal Studio must not create the noise it claims to remove. Transactional
mail sends exactly when triggered. Lifecycle mail is capped at one message
per user per week. Digests default to weekly. Every notification stream is
individually disableable. No re-engagement drips, ever. The Dispatch
arrives when there is something worth saying, never on a schedule.

## Ownership boundaries

Content, message metadata, trigger data, visual direction and delivery
concerns stay separate: copy lives in templates, metadata in the registry,
presentation in direction tokens, fixtures in fixtures.ts, and sending (a
later phase) behind one entry point. Finished customer-facing copy never
moves into layout components.
