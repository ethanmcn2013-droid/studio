# Email direction comparison and recommendation

Date: 2026-07-16. Three directions, one rubric, 100 points. All three
remain implemented and reviewable at `/hq/email-lab`; nothing is deleted
by this recommendation, and no conversion to the recommended direction has
been made. Evidence: the 24 renders and 28 screenshots in
`docs/email-system/renders/`, reviewed at both widths, both schemes, and
with images blocked.

## Scores

| Criterion (weight) | Hairline | Broadsheet | Letterhead |
|---|---|---|---|
| Brand distinctiveness (15) | 11 | 14 | 13 |
| Clarity and hierarchy (20) | 19 | 18 | 17 |
| Trust and credibility (15) | 15 | 12 | 13 |
| Flexibility across four modes (15) | 10 | 13 | 12 |
| Email-client robustness (10) | 10 | 9 | 8 |
| Accessibility (10) | 9 | 9 | 9 |
| Mobile quality (5) | 5 | 4 | 4 |
| Maintainability (5) | 5 | 4 | 4 |
| Implementation complexity (5) | 5 | 4 | 4 |
| **Total** | **89** | **87** | **84** |

## Hairline · minimal operational trust

- Evidence: `auth_sign-in-code--hairline--*`, `account_deletion-scheduled--hairline--dark`.
- Strengths: the strongest trust register in the set; nothing between the
  reader and the facts; smallest surface for client bugs; the mono
  key-value rows make dates and amounts unmissable; dark mode is clean.
- Weaknesses: the 20px h1 undersells editorial stories; brand presence
  rests almost entirely on the wordmark and mono register; founder mail
  renders correct but plain.
- Best for: security, billing, deletion, data rights, product notifications.
- Risk of generic: moderate. Its restraint is only ownable if the mono
  metadata register is applied with total consistency.
- Risk of noisy: near zero.
- Implementation tradeoffs: none of note; it is the cheapest to maintain.
- Refinements after selection: adopt Broadsheet's h1 scale (26 to 28px)
  for editorial mode only; keep everything else untouched.

## Broadsheet · editorial product precision

- Evidence: `editorial_dispatch-issue--broadsheet` render, `outreach_venue-first--broadsheet--*`.
- Strengths: the masthead rule pair is immediately ownable; the Dispatch
  looks like a publication, not a newsletter template; the ink CTA is
  distinctive and accessible; product stills as captioned photographs suit
  guided mail.
- Weaknesses: ceremonial on tiny security messages; institutional register
  works against founder outreach intimacy; two-rule masthead plus footer
  costs vertical space on mobile.
- Best for: the Dispatch, product announcements, guided onboarding.
- Risk of generic: low.
- Risk of noisy: the ink budget is fully spent; any addition tips it.
- Implementation tradeoffs: slightly more layout surface (double rules,
  captions) to keep consistent across clients.
- Refinements after selection: compress the masthead to a single rule for
  utility mode; keep the pair for guided and editorial.

## Letterhead · human founder-led warmth

- Evidence: `outreach_venue-first--letterhead--desktop` (the strongest
  single render in the review set), `--images-blocked` variant.
- Strengths: outreach reads as a written letter; the sheet gives
  destructive mail dignity; the postal line outside the sheet is a quiet,
  ownable move; the signature block earns the reply ask.
- Weaknesses: envelope ceremony is unearned on high-volume utility mail;
  sheet-on-canvas is a common receipt construction (distinctiveness is
  carried by register, not structure); rounded corners and the canvas tint
  degrade first in old Outlook.
- Best for: venue and school outreach, welcome, verification approved.
- Risk of generic: moderate at the structural level, low at the register
  level.
- Risk of noisy: low, provided the sheet never gains ornament.
- Implementation tradeoffs: the hold-the-sheet dark strategy needs a note
  in every future template review.
- Refinements after selection: drop the sheet for security mail (render
  utility mode on flat paper) to remove the unearned ceremony.

## Recommendation

**Hairline**, by two points and one asymmetry. The scores are close; the
asymmetry is not: email damage is one-sided. A slightly plain welcome
costs a little warmth, but a security or billing email that reads even
slightly like marketing costs trust that a premium product cannot buy
back. Hairline wins exactly where losing is unaffordable, it is the
cheapest system to keep at the bar, and its two real weaknesses are the
most fixable in the set: editorial scale can be borrowed from Broadsheet
as a mode-level refinement, and the founder-outreach warmth in this system
lives mostly in the copy, the salutation and the signature block, which
Hairline already renders.

Second position: Broadsheet, if the founder weighs the Dispatch and public
announcements above transactional trust. Letterhead remains the reference
register for founder outreach regardless of the system choice; if Hairline
is chosen, its letter salutation, enclosure caption and signature block
carry over unchanged because they are content, not tokens.

The choice is logged as an operator decision
(`content/hq/operator-todos/choose-email-direction.md`) and nothing is
converted until it is made.
