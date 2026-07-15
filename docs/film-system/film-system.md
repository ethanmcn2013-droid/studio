# Signal Studio Film System

Status: locked 2026-07-16 · Owner: film-system creative director
Governs: FILM-VEN (venues) · FILM-STU (students) · FILM-SCH (schools)

This document is the common system for every Signal Studio audience film. The
three audience briefs (`venues.md`, `students.md`, `schools.md`) inherit
everything here and add only what is specific to their audience. Where an
audience brief and this system disagree, this system wins, unless a locked
entry in that film's review ledger says otherwise for a specific scene.

Existing canon this system builds on and does not override:

- `studio/docs/strategy/VENUE_FILM_REVIEW_LEDGER.md` (locked 2026-07-11):
  the venue film's proposition, primary line, motion concept, shared semantic
  object, product path, continuity geometry, and the V05 approved decisions.
- `studio/docs/strategy/VENUE_EDITION_VIDEO_BRIEF.md` (2026-05-16): historical
  context. Its cut strategy, silence direction, and no-VO discipline are
  adopted here. Its script does not override the locked ledger.
- `signal-motion/docs/video-production/` (ARCHITECTURE, MOTION-SYSTEM,
  ASSET-STANDARDS, RENDER-AND-HANDOFF, DECISIONS): the production pipeline,
  the 95-point gate, format floors, and manifest contract.
- `content/hq/decisions/motion-production-control-plane.md` and
  `motion-proof-first-canon.md`: HQ owns intent and approvals, signal-motion
  renders, Resolve finishes, proof before payoff.
- `BRAND.md` §3 to §6: voice, naming, visual register, banned words.

---

## 1 · Strategic role of the films

Each film does exactly three jobs:

1. **Founder outreach attachment.** The film travels with a 1:1 founder email
   as a poster frame plus a text link. It earns a conversation; it does not
   replace one.
2. **Landing-page proof.** The film sits on a first-party page and shows the
   product doing the audience's job at human speed. It is evidence, not
   decoration.
3. **Waitlist conversion.** For waitlist-gated audiences the film moves a
   visitor from "I recognise this problem" to joining the waitlist.

Films never replace the product demo. A film shows the shape of the product
doing one job once. A demo is the founder walking a specific buyer through
their own situation. The film's success condition is that the demo gets asked
for, or the waitlist gets joined. Nothing in a film should try to close.

Status: **Locked**

## 2 · Film, outreach email, and landing page

One relationship, fixed:

- **The email carries a static poster frame, a one-sentence caption, and a
  plain text link.** Never embedded playback, never an attached video file,
  never an animated GIF. Email clients block or degrade all three; the poster
  frame plus link degrades to alt text plus link, which still works.
- **The landing page hosts the film.** One first-party route per film:
  `/films/venues`, `/films/students`, `/films/schools`. The page owns
  playback, the transcript, and the single call to action.
- **Poster, email, and page share one headline register.** The primary line of
  the film is the headline on the poster, the sentence in the email caption,
  and the H1 register on the landing page. A reader who sees all three sees
  one thought three times, not three thoughts.

The email is the personal layer, the page is the proof layer, the film is the
evidence inside the proof layer. The film is never the subject of the email;
it is the strongest supporting sentence in it.

Status: **Locked**

## 3 · Audience attention assumptions

Assume the worst context and design for it:

- **Muted autoplay or muted first play.** LinkedIn, embedded players, and
  most browsers start muted. Sound is a bonus, never a dependency.
- **The first 3 seconds carry the tension in text.** Every film opens on a
  text card that states the audience's tension in one or two short lines. A
  wide shot with no text in the first 3 seconds is a rejected opening.
- **Sound-off complete.** Every fact, claim, and beat must land with the
  audio removed. The voiceover deepens; it never carries alone.
- **Interrupted viewing.** Assume the viewer stops at any second. Front-load
  the tension and the product path; the payoff card rewards completion but
  the argument does not depend on it.

Status: **Locked**

## 4 · Core narrative structure

Five movements, in order:

1. **Audience tension.** Their words, their problem, stated in text within
   the first 3 seconds. No product on screen yet.
2. **Clear product behaviour.** One semantic object travels the product path
   at deterministic human speed. The viewer watches work move, not features
   being listed.
3. **Practical outcome.** The state of the world after the product behaviour:
   what the other person sees, what stops happening, what the quiet morning
   looks like.
4. **Trust or privacy boundary.** Shown as product behaviour, not asserted as
   policy: a private note staying put, an approved extract moving, a chosen
   publication. See §26.
5. **One next action.** The closing card plus the hosting surface name
   exactly one action. Never two.

One refinement over a plain five-act reading, adopted deliberately: movements
2, 3, and 4 share one continuous demonstration rather than three separate
segments. The shared semantic object carries the product behaviour, its
arrival is the practical outcome, and what does *not* travel with it is the
privacy boundary. This is stronger because the boundary is proven by the same
footage that proves the value, so trust is never a bolted-on disclaimer. The
five movements remain the review checklist; the demonstration delivers three
of them in one motion.

Status: **Locked**

## 5 · Durations

- **90 seconds: the master.** The full story, the edit source. Every scene is
  produced for the 90s master; shorter cuts are edits of it, never separate
  shoots. This preserves the historical brief's derivation rule (60s and 30s
  are cut from the 90s) and keeps the review ledger to one scene series.
- **60 seconds: the primary.** The distribution unit for landing pages and
  intentional plays. Reasoning: the 90s earns its length only with an
  audience that has already decided to listen; the 30s can state the promise
  but cannot show the product path with genuine still holds. The 60s is the
  shortest cut that fits all five movements plus three deliberate silences at
  the locked pacing. Audience briefs write their beat-by-beat against the 60s.
- **30 seconds: the cutdown.** The attention unit for feeds and email-adjacent
  contexts. Product path as text cards, one product window, the promise, the
  poster grammar. Story is earned by the longer cuts.

Status: **Locked**

## 6 · Cutdown strategy

- The 60s is derived from the 90s by removing the long opening card, the
  extended context beats, and any price or terms card, and by tightening
  still holds to their 0.4 second floor.
- The 30s retains only: opening tension card, one product window shot (the
  film's poster scene), the product-path text cards, the trust boundary card,
  and the closing card. No voiceover in the 30s; text cards carry everything.
- Cutdowns never introduce new footage, new claims, or new copy that the 90s
  master did not carry. A cutdown is an edit, not a variant message.
- Each cutdown is reviewed against the same ledger as the master, as its own
  entry, because pacing changes can break continuity holds.

Status: **Locked**

## 7 · Aspect-ratio strategy

- **Master: 16:9 at 1920×1080 logical coordinates.** This matches the locked
  venue ledger's continuity geometry; all scene geometry, product-window
  placement, and rail positions are recorded in this system.
- **Cutdown crops: 1:1 at 1080×1080 and 9:16 at 1080×1920.** These are crops
  and re-compositions of approved 16:9 scenes, not separate productions.
  signal-motion already declares format floors and safe insets for exactly
  these three formats (MOTION-SYSTEM.md): 1920×1080 inset 144×100, 1080×1920
  inset 80×140, 1080×1080 inset 80×100. Follow them.
- Product windows re-frame per format; they are never letterboxed or scaled
  below text legibility. If a scene cannot survive the 9:16 crop it is
  re-composed for that format at review, recorded in the ledger.

Status: **Locked**

## 8 · Sound-on and sound-off behaviour

- **No music.** In any cut, in any format. Silence is the signal; a music bed
  under a film about calm contradicts the product. This carries forward the
  historical brief's direction unchanged.
- **Three deliberate silences per film:** the opening tension card, the trust
  boundary beat, and the closing card. Each silence is chosen, held, and
  reviewed; none may be filled in finishing.
- **Ambient sound only where footage exists.** For product-UI films (v1 of
  all three), the soundtrack is voiceover and silence. Deterministic UI sound
  effects are banned; the product makes no sound and neither does its film.
- **Everything legible muted.** The sound-off pass is a review gate: play the
  cut muted, confirm every movement lands. A cut that needs audio fails.

Status: **Locked**

## 9 · Caption standards

- **Open captions.** Burned in, always on, in every published cut. No
  reliance on platform caption tracks, which viewers must enable.
- **Typeface: Geist Sans, weight 500.** Never Geist Mono for captions; mono
  is for labels and timestamps.
- **Size floor: 40px at 1920×1080**, scaled proportionally per format, never
  below the signal-motion label floor for that format.
- **Position: bottom-centred inside the safe inset**, on the paper field.
  Captions never sit over product-window text. If a scene's composition
  leaves no clear caption zone, the scene is re-composed, not the caption.
- Captions carry the voiceover verbatim. On-screen copy cards are not
  double-captioned; the card is the text.
- A sidecar caption file (SRT or equivalent) and a plain transcript ship with
  every cut for the landing page and the Resolve handoff.

Status: **Locked**

## 10 · Voiceover style

- **Founder voice.** One person who has thought about this for a while,
  explaining it to someone they respect. Not a narrator, not a presenter. If
  it sounds like radio, re-record.
- **Ceiling: 140 words per minute.** A 60s cut carries at most 140 words;
  with three silences the practical target is 100 to 125. Every audience
  brief states its word count and shows it fits.
- **The no-VO variant must survive.** Every cut works with the voiceover
  removed, using the same footage and cards with extended holds. This is a
  review gate, not an aspiration.
- Voiceover copy obeys BRAND.md §3 in full: declarative, plain English, no
  banned words, no exclamation marks, no em dashes.

Status: **Locked**

## 11 · On-screen copy rules

- BRAND.md §3 voice applies to every card, lower-third, and label.
- **One thought per card.** A card that needs "and" is usually two cards.
- **Line lengths: maximum 8 words per line, maximum 2 lines per card.**
  Lower-thirds are one line, maximum 6 words.
- Cards are set in Geist Sans, ink `#111111` on paper `#ffffff`. Weight 500
  or 600, per the signal-motion headline and support floors.
- Punctuation is full sentences with full stops. Middot `·` for separators.
  No em dashes, no exclamation marks, no ellipses for suspense.
- Every card's exact words are written in the audience brief before
  production and reviewed against the ledger. No copy improvisation in edit.

Status: **Locked**

## 12 · Product-screen treatment

- **Real shipped UI only.** Product windows show the current shipping
  interface with realistic, fictional, versioned fixture data (per
  ASSET-STANDARDS.md). No mockups presented as product, no future features.
- **Deterministic human speed.** Typing, cursor travel, and state changes
  play at believable human cadence, scripted and reproducible. Never
  accelerated, never eased for drama. This is a V05 approved decision.
- **Fixed camera, product-window composition.** The product window sits in
  the 1920×1080 frame at recorded coordinates; the camera does not move
  within a scene. This is a V05 approved decision.
- **One exception: the Signal briefing card stays slightly impressionistic.**
  A designed prop in the product's grammar, not a persuasive screen
  recording of a shipped surface, per the standing motion-venue-edition
  guidance. It must read as "this is what the briefing is like", never as
  false pixel-parity proof. The other three products show real UI.
- Product windows are labelled production projections in the manifest; they
  demonstrate state and causality without claiming pixel parity where
  fixtures differ from live data.

Status: **Locked**

## 13 · Cursor and interaction treatment

- Cursor travel ends before the click; the click precedes state creation;
  completion precedes any dependent change (MOTION-SYSTEM.md causality
  rules). Motion exists to prove causality, never to perform.
- One cursor, standard system appearance, no size boost, no click ripples,
  no highlight halos.
- Typing appears with a deterministic human cadence including natural
  micro-variance in the script, identical on every render.
- Interactions shown are only ones a real user performs: type, click, send,
  check off, publish. No keyboard-shortcut theatre.

Status: **Locked**

## 14 · Zoom and crop behaviour

- **No zooms, pans, or crops mid-scene. Cuts only.** If a detail needs
  attention, cut to a closer composition as its own scene with its own
  ledger entry. This preserves the fixed-camera decision and keeps
  continuity geometry checkable frame to frame.
- Scene-to-scene reframing is allowed and recorded: the outgoing state of
  one scene and the incoming state of the next are pixel-matched or
  explicitly cut, never blended by a move.

Status: **Locked**

## 15 · Motion principles

- **Governing concept: "Care becomes clarity."** Careful human input becomes
  legible shared state. Every animated moment must be an instance of this,
  or it is cut.
- **Separate arrival and travel curves.** DS easing: arrival
  `(0.23, 1, 0.32, 1)`, travel `(0.77, 0, 0.175, 1)`, per MOTION-SYSTEM.md.
  A V05 approved decision preserves separate curves for inserted and
  displaced rows.
- **Genuine still holds of at least 0.4 seconds** on every meaningful end
  state. A hold is a real held frame, not a slowed drift. The final state of
  a scene holds unchanged before the cut.
- Proof before payoff: the useful artifact appears and does its work before
  any wordmark or brand gesture, per motion-proof-first-canon.
- No ambient loops, no random numbers, no wall-clock time in compositions.

Status: **Locked**

## 16 · Transition principles

- **Cuts only between scenes.**
- **Fade in and out only for text cards**, including the opening and closing
  cards. Slow, settling fades at DS easing; no slides, no wipes, no pushes.
- No dissolves between product scenes, no match-move transitions, no speed
  ramps, no split screens.

Status: **Locked**

## 17 · Typography

- **Geist Sans and Geist Mono only**, the hash-pinned local files in
  signal-motion (`public/fonts/`, PROVENANCE.md). Weights 400, 500, 600.
- Text cards in Geist Sans. Mono only for timestamps, small labels, and
  in-product text that is mono in the shipping UI.
- **No kinetic typography.** Text fades in, holds, fades out. No
  letter-by-letter reveals, no counters, no tracking animations.
- Respect the signal-motion format floors for headline, support, and label
  sizes in every format.

Status: **Locked**

## 18 · Colour

- **Paper `#ffffff`. Ink `#111111`. One indigo `#4f46e5`.** Nothing else.
  Light surfaces only; Signal Studio is light-locked and no film ships a
  dark frame. Status colours never appear in marketing film.
- **The 2px indigo provenance rail is the cross-film continuity
  identifier.** It marks the shared semantic object as it travels between
  products: rail colour `#4f46e5`, width 2px, full height of the active row.
  V05 preserved it as the candidate identifier; the venue ledger states the
  first approved scene establishes the exact treatment and every later scene
  preserves it. The lock here is the rule: one restrained indigo identifier,
  rail-shaped, confirmed in exact treatment by the first approved scene of
  FILM-VEN, then inherited verbatim by FILM-STU and FILM-SCH.
- Indigo is rationed: the rail, the poster play ring, and at most one earned
  accent moment per film. Nothing decorative.

Status: **Locked**

## 19 · Use of real footage

- **None required for v1 of any film.** Product UI plus text cards carry all
  three films completely. This removes shoots, actors, locations, and
  releases from the critical path.
- Live-action footage (venue spaces, desks, campuses) is optional later and
  gated on rights evidence per ASSET-STANDARDS.md: no public render proceeds
  with unknown rights, expired permission, or an unapproved channel. Adding
  footage later is a new revision through the full review gate.
- Stock footage, stock photography, and wedding-influencer B-roll are banned
  in all films.

Status: **Locked**

## 20 · Use of product UI

- Product path order is the demonstration spine. The venue film's locked
  path is Signal Notes → Signal Tasks → Signal Timeline → Signal; the other
  films follow the same four-product order unless their brief records a
  justified deviation in the ledger.
- Fixture data is fictional, plausible, specific, and versioned. Real
  customer or pupil data never appears. Names, venues, modules, and classes
  are invented and recorded in the fixture.
- Product windows carry the real interaction labels of the shipping UI. If
  the UI changes before render, the scene updates to the shipping truth; the
  film never preserves a stale interface.
- All four products are shipped; public access is waitlist-gated. Films may
  therefore show all four surfaces, and closing actions for public audiences
  route to the waitlist, not to sign-up.

Status: **Locked**

## 21 · Poster-frame system

One template for all films. The poster is a composed static 16:9 still, not
a screengrab of a random frame.

- **Field:** paper `#ffffff`, full bleed.
- **Product window:** one still from the film's demonstration, placed on the
  upper two thirds, at the film's recorded product-window geometry scaled to
  leave the text zone clear. The still must contain the film's shared
  semantic object, legible at email width (600px).
- **Primary line:** the film's primary line, Geist Sans 600, ink, lower
  left, maximum 2 lines, inside a safe margin of 6% of frame width on all
  sides.
- **Wordmark:** small lowercase `signal studio.` with the indigo dot, Geist
  500, below or beside the primary line at label scale.
- **Play ring:** one thin indigo circle with a small ink triangle, centred
  on the product window, stroke 2px at 1920 wide. The only indigo on the
  poster besides the wordmark dot.
- **Safe margins:** nothing within 6% of any edge. The poster must survive
  email-client cropping to 4:3 with the primary line intact.
- **Images-blocked behaviour:** the email's alt text carries the primary
  line and the film's subject in one sentence, and the caption line under
  the image repeats the offer to watch, so a blocked image still reads as a
  complete message. Each brief writes the exact alt text.

Status: **Locked**

## 22 · Opening-card system

- Every film opens on a text card on paper: the audience tension, one or two
  lines, maximum 8 words per line, fading in from paper.
- The card holds at least 2.5 seconds in the 60s and 30s, at least 3.5 in
  the 90s, in silence.
- The opening card contains no product, no wordmark, no indigo. Tension
  first, brand last.
- The first product frame appears only after the tension card completes its
  hold.

Status: **Locked**

## 23 · Closing-card and CTA system

- The closing sequence is two cards: the **primary line card** (the film's
  primary line, ink on paper, long hold, silence), then the **wordmark
  card** (`signal studio.` small, centred, with one quiet action line
  beneath it in support-size Geist).
- **One action per film, never two:**
  - FILM-VEN: reply or a short meeting. Quiet line register: a conversation,
    not a checkout.
  - FILM-STU and FILM-SCH (waitlist-gated audiences): join the waitlist.
    The action line and the landing page use the waitlist register: access
    opens in small batches.
- The action is never spoken in voiceover. The card and the hosting surface
  carry it. This preserves the historical anti-brief: no "book your demo
  today" energy anywhere.
- The closing silence holds to the last frame. Nothing fades in under it.

Status: **Locked**

## 24 · Accessibility

- Open captions per §9, plus a full transcript on every landing page.
- Contrast: ink on paper everywhere; no text over imagery without a paper
  field. All text meets contrast at the published sizes.
- **Reduced-motion fallback: the poster frame.** Wherever a page respects
  `prefers-reduced-motion`, the film presents as its poster with a play
  control; nothing autoplays. The poster is a complete state, per the
  proof-first canon's reduced-motion rule.
- No information by colour alone: the provenance rail always accompanies a
  legible text object; the play ring always contains the triangle glyph.
- Muted autoplay, where used, is loop-safe and caption-complete.

Status: **Locked**

## 25 · Claims governance

- **Only shipped behaviour appears on screen.** Anything in flight is
  either absent or explicitly impressionistic per §12 (Signal briefing card
  only). A fake claim is a hard fail at review regardless of score.
- **Pricing is said only where fixed:**
  - Venue Edition €1,500 per venue per year is a fixed, decided price
    (`venue-edition-fixed-price-2026-07-11`) and may be spoken in the
    venue 90s master's outreach context. The venues brief records the
    recommendation on whether it appears at all.
  - Student Edition €9.99 a year is spoken or shown in film only if the
    student verification decision lands. Until then it appears nowhere in
    FILM-STU.
  - FILM-SCH makes no commercial claims of any kind: no price, no tier, no
    offer.
- No user counts, no venue counts, no testimonials without named consent
  and rights evidence, no "hundreds of" anything.
- Every claim in every brief is classified as verified, provisional, or
  must-not-make, and the review gate checks the film against that ledger.

Status: **Locked**

## 26 · Privacy demonstrations

Privacy is shown as product behaviour, never asserted as a policy card
alone:

- **A private note staying put.** The camera sees a note in Notes that does
  not travel. Notes are private by design; only creator-approved extracts
  leave Notes. The film shows the approval moment, not a lock icon.
- **An approved extract moving.** The shared semantic object leaves Notes
  because its creator sends it, and the provenance rail marks what moved.
  What did not move visibly remains behind.
- **Chosen publication.** Where a film shows a shared surface (Timeline, a
  class page), it shows the author choosing what appears there.

Each audience brief names its exact boundary demonstration. A privacy claim
without a corresponding on-screen behaviour is cut at review.

Status: **Locked**

## 27 · Asset naming and versioning

- **Film IDs:** `FILM-VEN`, `FILM-STU`, `FILM-SCH`.
- **Scene IDs:** the venue film keeps its established `V##` series (V05 is
  already in the ledger). FILM-STU uses `SU##`, FILM-SCH uses `SC##`. Scene
  numbers are stable; revisions are versions of a scene, never new numbers.
- **File naming follows the signal-motion manifest convention:**
  `project__fixture__composition__profile__rNNN.ext`, deterministic and
  validated. Project slugs: `film-ven`, `film-stu`, `film-sch`.
- Render profiles per RENDER-AND-HANDOFF.md: `review-{format}-v1` for
  review, `master-{format}-v1` for the Resolve mezzanine, `alpha-prores-v1`
  for overlays. No generic social profile; a destination profile is added
  only when the channel is real.
- Every render manifest records composition, fixture or HQ snapshot link,
  project revision, hashes, DS version, asset licences, and output hash.
  Renderer input is an immutable `signal-motion-input/v1` snapshot; snapshot
  creation fails when an asset version lacks current rights evidence.

Status: **Locked**

## 28 · Review gates

- **The 95-point HQ review with zero hard fails** is the only approval gate
  (motion-production-control-plane, MOTION-SYSTEM.md §gate). Rubric: truth
  and narrative 20, product causality 20, brand craft 20, format and
  readability 15, technical and provenance 15, restraint and accessibility
  10. Hard fails: fake claim, unapproved asset, overflow, missing manifest
  or hash, broken causality, secret leak.
- **One scene-by-scene ledger per film**, modelled exactly on
  `VENUE_FILM_REVIEW_LEDGER.md`: scene ID, version, date, verdict, approved
  decisions, unresolved issues, outgoing continuity state with exact
  geometry, next required action. FILM-STU and FILM-SCH each get their own
  ledger file before their first scene is reviewed.
- Brief and scene changes create a new revision and stale prior reviews.
  Reviews name the revision, stage, gate, rubric, score, and hard-fail
  codes. No verdict without inspecting the actual artifact.

Status: **Locked**

## 29 · Required production handoff assets

For each film, the handoff to finishing (DaVinci Resolve) and publication
requires:

1. Approved scene masters at `master-{format}-v1`, with handles where the
   ledger requires them.
2. The exact timing CSV or EDL for each cut (90, 60, 30).
3. Burned-caption review renders plus the sidecar caption file and plain
   transcript per cut.
4. Voiceover recording, final take, plus the no-VO cut proof.
5. The poster frame at full resolution plus its email-width export, alt
   text, and caption line.
6. Rights manifest and checksums for every asset version.
7. The film's review ledger, complete to the approved revision.
8. The immutable input snapshot ID for every rendered scene.
9. Landing-page copy block and email copy block, matched to the brief.
10. HQ finish and publication receipt on completion.

Status: **Locked**

## 30 · Analytics and measurement

- **No per-viewer tracking.** No tracking pixels in email, no view-through
  identifiers, no third-party video analytics.
- **Aggregate page analytics only**, via the existing cookieless Vercel
  analytics already running on Signal Studio surfaces.
- **One first-party route per film** (`/films/venues`, `/films/students`,
  `/films/schools`) so aggregate page views attribute cleanly. The poster
  link in every email and post points at the film's route, never at a raw
  video host URL.
- **The progression measured is email → page → action:** emails sent (the
  founder's own count), film-page views (aggregate), then replies and
  meetings (venues) or waitlist joins attributable to the page's CTA click
  count (students, and schools if unblocked). Trend over cohorts, not
  individuals.
- Play-through rates are not measured in v1; the poster and page design
  assume interrupted viewing (§3) rather than optimising a retention curve.

Status: **Locked**
