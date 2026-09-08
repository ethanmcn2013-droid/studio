---
name: Dot Studio
description: One circle. A world of expression.
colors:
  dot-accent: "#4f46e5"
  primary-hover: "#4037c8"
  dot-text: "#202029"
  dot-muted: "#666670"
  dot-line: "#e7e7ed"
  paper: "#ffffff"
  ink: "#111111"
  stage-paper: "#f9f9fb"
  stage-night: "#1b1b28"
  night-text: "#f5f5fa"
  secondary-hover: "#f4f4f8"
  icon-hover: "#f0f0f5"
  play-surface: "#eeedff"
  mood-selected: "#f1f0ff"
  mood-selected-line: "#e3e0fc"
  mood-hover: "#f5f4fc"
  performance-hover-line: "#d5d1f5"
  input-line: "#d9d9e2"
  swatch-line: "#c8c8d4"
  placeholder: "#70707b"
  track: "#dedde8"
  selection: "#dedaff"
  selection-text: "#282066"
  guide: "#8a83c0"
  checker-paper: "#fafafa"
  checker-square: "#eee"
  duration-line: "#ffffff50"
  ground-paper: "#353146"
  ground-night: "#000000"
  thread-violet: "#8880ee"
  thread-teal: "#62c8c7"
  thread-lilac: "#be91dc"
  thread-indigo: "#6c63d9"
  thread-mint: "#93d3b4"
  thread-mauve: "#c498c9"
typography:
  display:
    fontFamily: "var(--font-geist-sans), Arial, sans-serif"
    fontSize: "clamp(40px, 4.5vw, 62px)"
    fontWeight: 560
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontSize: "23px"
    fontWeight: 550
    lineHeight: 1.25
    letterSpacing: "-0.04em"
  stage-title:
    fontSize: "17px"
    fontWeight: 550
    letterSpacing: "-0.035em"
  body:
    fontSize: "16px"
    letterSpacing: "-0.02em"
  button:
    fontSize: "13px"
    fontWeight: 550
  library-title:
    fontSize: "13px"
    fontWeight: 600
    letterSpacing: "-0.025em"
  mood-label:
    fontSize: "12px"
    fontWeight: 530
  mood-detail:
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.6
  frame-number:
    fontSize: "18px"
    fontWeight: 550
rounded:
  input: "5px"
  saved-take: "6px"
  button: "7px"
  performance: "8px"
  theatre: "12px"
  circle: "50%"
spacing:
  control-gap: "10px"
  mood-gap: "12px"
  performance-gap: "14px"
  heading-gap: "24px"
  inspector-gap: "28px"
  workspace-gap: "32px"
components:
  button-primary:
    backgroundColor: "{colors.dot-accent}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "12px 17px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.dot-text}"
    typography: "{typography.button}"
    rounded: "{rounded.button}"
    padding: "12px 17px"
  button-secondary-hover:
    backgroundColor: "{colors.secondary-hover}"
  play:
    backgroundColor: "{colors.play-surface}"
    textColor: "{colors.dot-accent}"
    rounded: "{rounded.circle}"
    width: "44px"
    height: "44px"
  mood-selected:
    backgroundColor: "{colors.mood-selected}"
    textColor: "{colors.dot-text}"
    rounded: "{rounded.button}"
    padding: "3px 9px"
  performance:
    backgroundColor: "{colors.stage-paper}"
    textColor: "{colors.dot-text}"
    rounded: "{rounded.performance}"
    padding: "12px 14px 16px"
  authoring-input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.dot-text}"
    rounded: "{rounded.input}"
    padding: "9px"
---

# Design System: Dot Studio

## Overview

**Confirmed direction: "One circle. A world of expression."**

Dot Studio extends the existing Signal Studio world: Geist, Signal indigo, calm paper surfaces and geometric motion. The large character is the first visual subject. One moving stage sits alongside a quiet library of static expressions; small controls and fine borders support the performance. This records the approved direction from [BRIEF.md](BRIEF.md), without introducing a separate identity or a new creative North Star.

This is a scoped, as-built scan dated 8 September 2026 for `/design/dot`. The two-eye, no-mouth face is an implemented **review candidate awaiting human art-direction acceptance**. Execution approval and the resolved F1–F4 review do not establish final face/personality acceptance. Root `DESIGN.md` remains historical; this record does not supersede `BRAND.md` or Signal Design System 2.0.

**Key Characteristics:**

- One circular body, two independently articulated eyes and no mouth.
- A generous stage with a compact, static mood library.
- Signal indigo as the principal character and action colour.
- Thin borders and tonal surfaces, with motion carrying the expression.
- Optional development authoring below the exhibit.

Tokens above are extracted from `src/components/dot/dot-studio.css`, `src/lib/dot/model.ts` and `src/lib/dot/render.ts`. Component tokens describe the base desktop styles; responsive overrides and minimum sizes are recorded below. The font variable is supplied by Geist in `src/app/layout.tsx`. The retained desktop and mobile captures in `.impeccable/review/` were visually inspected for this record; source and [IMPLEMENTATION.md](IMPLEMENTATION.md) establish behaviour. This documentation adds no fresh performance or accessibility certification.

## Colors

Signal indigo anchors a cool, nearly white stage and restrained charcoal typography. Frontmatter retains the source colour values; the names below describe their existing roles.

### Primary

`dot-accent` is the body colour, heading full stop, primary action, active tab underline, selected performance border, slider thumb, caret and focus outline. `primary-hover` deepens the main action. `play-surface`, `mood-selected`, `mood-hover` and the associated line colours provide quieter indigo states without adding a new UI accent.

### Neutral

`dot-text` and `dot-muted` distinguish headings and labels from descriptions and timing. `dot-line` separates the theatre, toolbar, transport and lower sections. `paper` supplies controls and the default eyes; `stage-paper` supplies the main stage and performance tiles. `stage-night` and `night-text` belong to the stage theme, rather than a whole-page dark mode. `ink` and `paper` are alternate character fills; a paper character receives indigo eyes.

`checker-paper` and `checker-square` form the transparent-preview checkerboard. The checkerboard is a viewing aid, not part of transparent artwork. `guide` belongs to the optional safe-area overlay. Selection, placeholder, track and input-line tokens are local control treatments.

### Character effects

The six `thread-*` colours are the renderer's ordered orbit-thread palette. Teal also colours the small arrival bead. They belong to authored character effects; they do not establish additional navigation or action colours.

## Typography

Geist Sans, resolved through `--font-geist-sans` with Arial and sans-serif fallbacks, carries the whole scoped surface. Dot does not introduce a separate display face or mono face. The frame and transport readouts use tabular numerals within the inherited sans-serif font.

The display heading uses a fluid size, moderate weight and tight tracking. The introductory sentence is 16 px. Section headings use 23 px, the stage name 17 px, and library and action labels 12–13 px. Supporting copy generally uses 11–12 px; the mood energy line is 9 px. These are observed role sizes, not an invented modular scale.

At 720 px and below, the heading becomes 45 px, introduction 14 px, section heading 21 px and stage title 16 px. Transport numerals and performance labels also compact. Preserve the visible hierarchy when adding content; reserve the large display treatment for the page name.

## Layout

The scoped container has a 1328 px maximum width, centred margins and base padding of 60 px 48 px 28 px. The main workspace uses `minmax(0, 1fr) 250px` with a 32 px gap. The stage is 490 px high; its square rendering area is at most 440 px wide. The toolbar is 64 px high after review corrections and the transport is 62 px high. Six performance tiles sit in one row below the workspace, separated by 14 px.

At 1440 px and above, top padding becomes 72 px, stage height 540 px and rendering width 480 px. At 1000 px and below, page padding becomes 40 px 28 px 24 px, the library narrows to 215 px, the workspace gap becomes 22 px and the stage height 460 px. The inspector changes from four columns to two.

At 720 px and below, page padding is 28 px 20 px 24 px. The film action spans the heading width. The stage stacks above the two-column mood library with a 28 px gap; stage height is 380 px, rendering width at most 340 px, toolbar 60 px and transport 58 px. Performance tiles form three columns. Saved-take controls wrap; the inspector retains two columns and reactions become a single column. The reference comparison retains two square columns with a smaller gap.

Only the stage animates. Mood and performance specimens are static, named entry points. The "Good company" specimen includes its circular companions; preserve them when adjusting thumbnail rendering. Inspector and saved takes are development-only; they appear beneath the stage and performance shelf.

## Elevation & Depth

The scoped interface uses tonal layering and single-pixel borders, with no CSS box-shadow vocabulary. Theatre corners clip the stage and its white toolbar/transport. The optional character ground shadow is a very low-opacity SVG ellipse: it changes with vertical movement and scale to suggest distance from the floor. Orbit threads are split into front and back segments around the circle, creating depth through occlusion. Neither effect changes the circular silhouette of the body.

## Shapes

The body is one native SVG circle with radius 50 in a `-95 -95 190 190` viewBox. Its rig supports translation and one uniform scale, clamped by the renderer to 0.12–1.15. It has no independent horizontal/vertical body scale or skew. Rotation articulates the face within the circle. Eyes use continuous rounded paths with independently controlled position, width, height, angle and curvature; there is no mouth element.

Secondary beads and companions are circles. Orbit threads may curve around them, but the body does not become an egg, square or triangle. The wider animation safe area is intentional and does not replace the original, tightly framed brand-kit logo assets.

UI shapes remain modest: 5 px inputs/icon corners, 6 px saved-take corners, 7 px primary buttons and mood rows, 8 px performance tiles, and a 12 px theatre. Play and colour controls are circles. These are observed local values; do not silently replace the company-wide token system with them.

## Components

**Stage and character.** The playground supports pointer attention, a poke and a bounded drag. Gaze eases toward the pointer and stays within the circular face. Drag is bounded to 22 horizontal and 18 vertical model units; release uses a damped 700 ms recovery. Clip selection blends the interrupted pose over 220 ms, using the shortest face rotation arc. Authored film playback is protected from pointer reactions. The silent film contains 1,845 frames at 60 fps (30.75 seconds).

**Transport.** Play and icon buttons are 44 × 44 px. The slider has a 44 px hit area, a 4 px drawn track and a 14 px circular thumb. Timing uses tabular numerals. Pause freezes the player; exact seeking pauses and clears transient input. The clock suspends offscreen and in hidden tabs. Reduced-motion mode displays the clip's signature still, removes body translation/spin and secondary effects, and disables continuous playback.

**Actions and navigation.** Primary and secondary actions have at least 44 px height. The primary action is indigo with white type; secondary actions use white fill and a fine border. Active stage tabs use a 2 px indigo underline and stronger type. Scoped buttons, links, inputs and selects receive a 3 px indigo focus outline with 4 px offset; file-import focus uses its own 3 px offset. Disabled buttons use 0.45 opacity, except the invisible stage interaction target, which remains fully transparent in appearance.

**Mood library and performances.** Ten mood rows pair a static 36 px specimen with a name and energy label. Selection has a pale indigo fill and border; its trailing play affordance appears on hover or selection. Rows have a corrected minimum height of 44 px, increasing to 48 px at wide desktop and 51 px on mobile. Six performance cards use a pale stage surface, fine border, static artwork, title and arrow. Their selected border becomes indigo. Search is a border-bottom field with a corrected 44 px minimum height.

**Authoring controls.** The development inspector exposes frame identity, stepping, neutral reset, speed, seed, loop bounds, face/effect visibility, safe-area guide, colour variants, a local reference comparison and exports. Swatches are 44 px circles with a selected outline. Checkbox label areas and selects have a 44 px minimum height. Saved takes use a named input and compact preview buttons. The safe-area overlay is outside exported SVG content; reference media stays local to the browser. These controls support review without becoming part of the public exhibit.

## Do's and Don'ts

- Do preserve the circular body at every frame and every exported size.
- Do express personality through eye shape, gaze, timing, uniform scale and circular companions.
- Do keep one live stage and static, named specimens elsewhere on the page.
- Do retain the Signal indigo/Geist relationship and the calm stage-first composition.
- Do preserve interruption continuity, pause, reduced-motion stills and the corrected control hit areas.
- Do distinguish the implemented face candidate from final human art-direction acceptance.
- Don't add a mouth, deform the body or substitute the reference film's noncircular morphs.
- Don't turn orbit colours into a competing UI palette or add decorative panel shadows.
- Don't export viewing guides or checkerboards into transparent character assets.
- Don't treat this scoped record, a passing build or the F1–F4 fix verdict as a production release or aesthetic approval.
