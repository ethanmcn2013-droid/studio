# Marketing delight phase · interaction ledger

Date: 2026-07-29
Scope: `/notes`, `/tasks`, `/timeline`, `/signal`, `/pricing`, `/about`
Release intent: production
Method: `delight-phase` full phase, informed by Emil Kowalski's interaction principles

## Direction

These pages do not need more animation everywhere. They need a clearer hierarchy
of motion:

1. Functional motion explains state and continuity.
2. Feedback is immediate and interruptible.
3. Each journey gets at most one expressive moment.
4. Existing product heroes remain the dominant product-page moments.
5. Pricing motion directs attention once; it does not loop for decoration.
6. About stays editorial. Its motion shows reading position and authorship.
7. Reduced motion preserves state, opacity and colour while removing travel,
   scale, ambient loops and staged delays.

`HOLD_STILL` is an implemented decision. It means the surface was considered and
was deliberately kept quiet.

## Implementation shortlist

The exhaustive catalog below resolves into seven implementation families:

| Wave | Family | Role | Pages |
| --- | --- | --- | --- |
| 1 | Navigation continuity | State, orientation | all six |
| 2 | Product switcher truthfulness | Feedback, orientation | four product pages |
| 3 | Action feedback | Feedback, responsiveness | all six |
| 4 | Existing product proof | Explanation, continuity | four product pages |
| 5 | Pricing attention hierarchy | Orientation, explanation | Pricing |
| 6 | About reading lineage | Orientation, delight | About |
| 7 | Motion safety contract | Accessibility, responsiveness | all six |

No eighth expressive system is introduced. The accepted heroes and the Living
Artifact handoff already carry the product-story motion.

## Decision vocabulary

| Decision | Meaning |
| --- | --- |
| `HOLD_STILL` | keep the seam static or preserve the accepted implementation |
| `IMMEDIATE` | state changes with no authored travel or staging |
| `FIX_EXISTING` | repair latency, continuity, focus, repetition or motion safety |
| `SUBTLE` | quiet feedback, normally 120–220ms |
| `STANDARD` | state transition that needs visible continuity |
| `PROTOTYPE` | expressive candidate requiring isolated review before shipping |

There are no `PROTOTYPE` decisions in this production wave. Every expressive
moment already has a product or editorial purpose.

## Shared shell catalog

| ID | Seam / trigger | Current evidence | Decision | Release treatment |
| --- | --- | --- | --- | --- |
| SH-01 | Skip link receives keyboard focus | global focus contract | `HOLD_STILL` | preserve native jump and visible focus |
| SH-02 | House wordmark arrives on first document paint | one-shot broadcast; reduced-motion gated | `HOLD_STILL` | keep as the shell's single identity acknowledgement |
| SH-03 | House wordmark hover | looping shine while hovered | `HOLD_STILL` | no additional movement in this wave |
| SH-04 | Products trigger hover/focus | colour only | `SUBTLE` | retain colour; add tactile press without delayed state |
| SH-05 | Products trigger click | boolean open/closed | `STANDARD` | panel enters and exits with shared origin continuity |
| SH-06 | Products chevron | rotates 180 degrees | `STANDARD` | preserve state cue; use the shared ease and reduced-motion flattening |
| SH-07 | Products panel entrance | 8px rise, 220ms | `FIX_EXISTING` | move to interruptible mount/unmount choreography |
| SH-08 | Products panel dismissal | instantaneous unmount | `FIX_EXISTING` | add a short opacity/4px exit so closure has continuity |
| SH-09 | Product cards enter | 55ms staged CSS delays | `FIX_EXISTING` | retain a tighter one-shot stagger owned by the open transition |
| SH-10 | Product card hover | background and border | `SUBTLE` | pointer-fine only; no lift or shadow |
| SH-11 | Product card focus | outline, background and border | `HOLD_STILL` | preserve full keyboard parity |
| SH-12 | Product card press | absent | `SUBTLE` | add restrained 0.985 compression; no navigation delay |
| SH-13 | Product-card miniature gestures | currently static unless panel CSS is active | `SUBTLE` | play once when the panel opens; never ambient-loop |
| SH-14 | Panel Escape dismissal | restores trigger focus | `HOLD_STILL` | preserve |
| SH-15 | Panel outside click | closes panel | `IMMEDIATE` | preserve immediate close; exit animation may finish visually |
| SH-16 | Trigger ArrowDown | no menu-oriented affordance | `FIX_EXISTING` | open and place focus on the first product card |
| SH-17 | Mobile menu trigger | immediate glyph swap | `STANDARD` | crossfade/short travel between closed and open states |
| SH-18 | Mobile menu panel | display toggle, no continuity | `FIX_EXISTING` | animate opacity and 6px travel on mount/unmount |
| SH-19 | Mobile menu link selection | closes and navigates | `IMMEDIATE` | retain; never wait for motion |
| SH-20 | Desktop nav links | colour on hover | `SUBTLE` | add focus parity and press response; no underline theatre |
| SH-21 | Footer text links | colour on hover | `SUBTLE` | preserve quiet colour feedback; add active response only |
| SH-22 | Footer social links | colour on hover | `SUBTLE` | add 0.985 press response; no icon spin or lift |
| SH-23 | External-link arrow | static | `SUBTLE` | 3px directional drift on pointer-fine hover/focus |
| SH-24 | Route change | browser/Next navigation | `IMMEDIATE` | no global page transition and no artificial loading pause |
| SH-25 | Page restoration/back-forward | native scroll/focus restoration | `HOLD_STILL` | do not replay theatrical page motion |

## Product-page shared catalog

| ID | Seam / trigger | Current evidence | Decision | Release treatment |
| --- | --- | --- | --- | --- |
| PP-01 | Current product indicator on load | dot is visible at the bar's left edge before measurement | `FIX_EXISTING` | measure the current pill on layout and place the dot truthfully |
| PP-02 | Product pill pointer hover | dot glides to target | `SUBTLE` | preserve; replace overshoot with a strong ease-out |
| PP-03 | Product pill keyboard focus | same dot travel | `SUBTLE` | preserve parity |
| PP-04 | Pointer/focus leaves switcher | dot returns to current product | `STANDARD` | preserve orientation |
| PP-05 | Product pill press | click is intercepted for 120ms | `FIX_EXISTING` | remove interception and navigate immediately |
| PP-06 | Switcher resize | indicator can become stale | `FIX_EXISTING` | remeasure on resize |
| PP-07 | Current product pill activation | links to current canonical URL | `IMMEDIATE` | leave browser semantics intact |
| PP-08 | Product hero first paint | accepted product-specific choreography | `HOLD_STILL` | protected; no shared reveal layered on top |
| PP-09 | Product hero in-page controls | product-specific state and feedback | `HOLD_STILL` | protected; source remains the interaction contract |
| PP-10 | Product hero reduced motion | each hero owns its settled state | `HOLD_STILL` | preserve per-hero implementation |
| PP-11 | Living Artifact enters viewport | scroll-coupled handoff | `HOLD_STILL` | protected selected direction |
| PP-12 | Living Artifact reaches viewport centre | source-to-destination state resolves | `HOLD_STILL` | preserve the `start 78%` to `start 50%` contract |
| PP-13 | Living Artifact in reduced motion | final source/destination state | `HOLD_STILL` | preserve settled, legible receipt |
| PP-14 | Next-product link hover/focus | underline colour and 3px arrow travel | `SUBTLE` | preserve; add press response and reduced-motion flattening |
| PP-15 | Next-product navigation | native link | `IMMEDIATE` | no exit delay |
| PP-16 | Boundary close copy | static trust statement | `HOLD_STILL` | reading content remains still |
| PP-17 | Boundary waitlist hover/focus | opacity only | `FIX_EXISTING` | pointer-gate hover; add clear press feedback |
| PP-18 | Boundary waitlist activation | native link | `IMMEDIATE` | no completion animation before navigation |
| PP-19 | Page-level reduced-motion backstop | suppresses every transition to 0.01ms | `FIX_EXISTING` | stop erasing useful colour/opacity state; remove travel and staged animation only |

## Notes catalog

The Notes hero is already the page's expressive moment. Its 22 detected CSS
animation tracks form one narrative and remain protected.

| ID | Moment | Decision | Reason |
| --- | --- | --- | --- |
| NO-01 | kicker arrives | `HOLD_STILL` | establishes product context |
| NO-02 | title and title caret arrive | `HOLD_STILL` | authored capture metaphor |
| NO-03 | lede arrives | `HOLD_STILL` | completes hierarchy |
| NO-04 | capture placeholder and caret sequence | `HOLD_STILL` | explains capture without interaction debt |
| NO-05 | three incoming lines type | `HOLD_STILL` | one bounded demonstration |
| NO-06 | archive row resolves | `HOLD_STILL` | communicates retained history |
| NO-07 | private row settles | `HOLD_STILL` | communicates privacy |
| NO-08 | source row accent and state settle | `HOLD_STILL` | communicates provenance |
| NO-09 | approval mark appears and clears | `HOLD_STILL` | state feedback inside the story |
| NO-10 | fragment crosses to Tasks | `HOLD_STILL` | continuity into the suite |
| NO-11 | Tasks panel and task row settle | `HOLD_STILL` | narrative resolution |
| NO-12 | hero CTA hover/press/focus | `HOLD_STILL` | already restrained and complete |
| NO-13 | hero reduced-motion settlement | `HOLD_STILL` | preserves the explanatory final state |

## Tasks catalog

The Tasks hero is an accepted cinematic board. Its Motion layout changes,
cursor work, status movement and completion celebration remain one protected
system.

| ID | Moment | Decision | Reason |
| --- | --- | --- | --- |
| TA-01 | hero board settles on load | `HOLD_STILL` | establishes the work surface |
| TA-02 | view chrome changes | `HOLD_STILL` | communicates state and spatial continuity |
| TA-03 | task card moves between lanes | `HOLD_STILL` | direct manipulation metaphor |
| TA-04 | layout reflows after card movement | `HOLD_STILL` | preserves object continuity |
| TA-05 | collaborator cursors cross the board | `HOLD_STILL` | bounded explanatory collaboration |
| TA-06 | drag ghost appears and resolves | `HOLD_STILL` | supports direct manipulation |
| TA-07 | inspector opens/closes | `HOLD_STILL` | state continuity |
| TA-08 | context menu/palette opens | `HOLD_STILL` | local command continuity |
| TA-09 | comment/typing state | `HOLD_STILL` | perceived activity inside the demonstration |
| TA-10 | completion state and celebration | `HOLD_STILL` | rare earned delight already scoped to success |
| TA-11 | Share button feedback | `HOLD_STILL` | preserve accepted hero contract |
| TA-12 | hero interruption/restart behavior | `HOLD_STILL` | accepted deterministic sequence |
| TA-13 | hero reduced-motion settlement | `HOLD_STILL` | final board remains complete and legible |

## Timeline catalog

The Timeline hero is an interactive artifact. Its rail, metric and milestone
state changes already carry the page's explanatory motion.

| ID | Moment | Decision | Reason |
| --- | --- | --- | --- |
| TL-01 | artifact settles on load | `HOLD_STILL` | accepted hero composition |
| TL-02 | base rail draws once | `HOLD_STILL` | explains direction |
| TL-03 | metric lens toggles completion/countdown | `HOLD_STILL` | functional state change |
| TL-04 | metric face crossfades | `HOLD_STILL` | value continuity |
| TL-05 | alternate metric reveals on hover/focus | `HOLD_STILL` | pointer and keyboard parity |
| TL-06 | milestone focus moves with arrow keys | `HOLD_STILL` | accessible spatial navigation |
| TL-07 | active point changes | `HOLD_STILL` | orientation on the rail |
| TL-08 | milestone detail expands | `HOLD_STILL` | local disclosure |
| TL-09 | previous detail collapses | `HOLD_STILL` | one-current-state rule |
| TL-10 | milestone hover/focus strengthens point and label | `HOLD_STILL` | useful targeting feedback |
| TL-11 | planning-decision disclosure opens/closes | `HOLD_STILL` | native disclosure semantics |
| TL-12 | skip-to-timeline link appears on focus | `HOLD_STILL` | accessibility |
| TL-13 | share/product metadata controls | `HOLD_STILL` | accepted feedback |
| TL-14 | initial centring vs later focus movement | `HOLD_STILL` | preserves orientation |
| TL-15 | reduced-motion final artifact | `HOLD_STILL` | rail and points remain readable |

## Signal catalog

The Signal hero is an editorial read. Its bounded distillation sequence remains
the page's expressive moment.

| ID | Moment | Decision | Reason |
| --- | --- | --- | --- |
| SI-01 | dateline arrives | `HOLD_STILL` | editorial context |
| SI-02 | primary headline arrives | `HOLD_STILL` | reading hierarchy |
| SI-03 | distillation band arrives | `HOLD_STILL` | explains compression |
| SI-04 | source bars resolve | `HOLD_STILL` | explanatory evidence |
| SI-05 | two attention items settle | `HOLD_STILL` | bounded result |
| SI-06 | evidence rule draws | `HOLD_STILL` | establishes receipt |
| SI-07 | attention broadcast mark emits | `HOLD_STILL` | existing rare identity moment |
| SI-08 | Open task hover/focus | `HOLD_STILL` | accepted non-destructive feedback |
| SI-09 | Open timeline hover/focus | `HOLD_STILL` | accepted non-destructive feedback |
| SI-10 | action activation | `IMMEDIATE` | no artificial delay |
| SI-11 | read closes | `HOLD_STILL` | editorial resolution |
| SI-12 | reduced-motion final read | `HOLD_STILL` | content and evidence remain present |

## Pricing catalog

Pricing is a decision surface. Motion may guide sequence and confirm actions,
but it must never make comparison harder.

| ID | Seam / trigger | Decision | Release treatment |
| --- | --- | --- | --- |
| PR-01 | pricing eyebrow/title/lede | `HOLD_STILL` | commercial proposition is readable immediately |
| PR-02 | checkout-offline status appears from query state | `IMMEDIATE` | urgent truth is not staged |
| PR-03 | status email link hover/focus | `SUBTLE` | colour/underline only |
| PR-04 | Plans heading | `HOLD_STILL` | no generic section reveal |
| PR-05 | tier grid first meaningful view | `SUBTLE` | cards settle once in reading order with 35ms cadence |
| PR-06 | tier card hover | `HOLD_STILL` | cards are not clickable; do not fake affordance |
| PR-07 | recommended-tier outline | `HOLD_STILL` | persistent commercial state |
| PR-08 | “For ongoing work” anchor mark | `FIX_EXISTING` | replace infinite 5.2s breathing with one earned acknowledgement |
| PR-09 | annual-price link | `SUBTLE` | underline/colour feedback only |
| PR-10 | tier CTA hover/focus | `FIX_EXISTING` | pointer gate hover, add focus parity and arrow direction |
| PR-11 | tier CTA press | `SUBTLE` | 0.98 compression on pill form; 1px settle on inline form |
| PR-12 | tier CTA activation | `IMMEDIATE` | no navigation delay |
| PR-13 | comparison table scroll | `IMMEDIATE` | native horizontal scroll; no scroll hijack |
| PR-14 | comparison row hover | `HOLD_STILL` | rows are reading material, not controls |
| PR-15 | recommended comparison column | `HOLD_STILL` | persistent tint; no pulsing |
| PR-16 | mobile comparison blocks | `HOLD_STILL` | stable reading order |
| PR-17 | suite section enters view | `STANDARD` | four product marks play once in suite order |
| PR-18 | Notes mark gesture | `FIX_EXISTING` | one bounded caret acknowledgement, not an infinite loop |
| PR-19 | Tasks mark gesture | `FIX_EXISTING` | one bounded pulse, not an infinite loop |
| PR-20 | Timeline mark gesture | `FIX_EXISTING` | one bounded sweep, not an infinite loop |
| PR-21 | Signal mark gesture | `FIX_EXISTING` | one bounded discrete tick, not an infinite loop |
| PR-22 | product status pips | `HOLD_STILL` | truthful status; no false liveliness |
| PR-23 | Development-state note | `HOLD_STILL` | trust copy remains still |
| PR-24 | Event-lane primary link hover/focus | `SUBTLE` | directional arrow feedback |
| PR-25 | Event-lane secondary link hover/focus | `SUBTLE` | colour/underline only |
| PR-26 | Event-lane activation | `IMMEDIATE` | native route change |
| PR-27 | refusals grid | `HOLD_STILL` | a statement, not an interaction |
| PR-28 | FAQ answers | `HOLD_STILL` | keep expanded as authored; do not invent an accordion |
| PR-29 | closing email hover/focus | `SUBTLE` | border colour and text colour only |
| PR-30 | footer interactions | `SUBTLE` | shared shell contract |
| PR-31 | reduced motion | `STANDARD` | all states remain visible; plan and mark staging becomes immediate |

## About catalog

About is an editorial page. Its signature moment belongs to authorship, not to
the opening headline.

| ID | Seam / trigger | Decision | Release treatment |
| --- | --- | --- | --- |
| AB-01 | reading-progress hairline | `HOLD_STILL` | direct scroll position; no easing or lag |
| AB-02 | reading progress on mobile | `HOLD_STILL` | remains absent below 768px |
| AB-03 | About eyebrow/title | `HOLD_STILL` | editorial opening is immediately readable |
| AB-04 | manifesto paragraphs | `HOLD_STILL` | no paragraph-by-paragraph reveal |
| AB-05 | product row hover/focus | `FIX_EXISTING` | rule and arrow carry direction; pointer/focus parity |
| AB-06 | product row press | `SUBTLE` | 1px/0.99 tactile acknowledgement |
| AB-07 | product row activation | `IMMEDIATE` | no delayed waitlist route |
| AB-08 | quiet closing note | `HOLD_STILL` | editorial cadence |
| AB-09 | founder panel enters view | `HOLD_STILL` | panel itself does not float or fade |
| AB-10 | founder note paragraphs | `HOLD_STILL` | preserve long-form reading |
| AB-11 | signature rule enters view | `STANDARD` | draw once from the authored origin |
| AB-12 | founder dot acknowledges rule completion | `SUBTLE` | one 240ms settle; no ambient pulse |
| AB-13 | founder identity follows | `SUBTLE` | short opacity settlement after the rule |
| AB-14 | footer interactions | `SUBTLE` | shared shell contract |
| AB-15 | back/forward restoration | `HOLD_STILL` | progress reflects position without replay |
| AB-16 | reduced motion | `STANDARD` | signature rule and identity render immediately |

## Rejected candidates

Rejected candidates remain in the record so they are not rediscovered as
“missing polish” later.

| Candidate | Rejection |
| --- | --- |
| Global route-transition curtain | hides real navigation latency and competes with product heroes |
| Parallax product heroes | adds spectacle without state meaning and risks motion sickness |
| Generic reveal on every section | makes long pages feel templated and slows reading |
| Hover lift on pricing cards | implies the whole card is clickable |
| Animated comparison-table highlight following the pointer | distracts from cross-column reading |
| Pricing-number count-up | turns stable commercial truth into theatre |
| Collapsible Pricing FAQ | invents interaction debt where all answers currently scan well |
| Ambient status-pip pulse | would imply live operational state that is not present |
| About headline typewriter | repeats the Notes metaphor and cheapens the editorial opening |
| Founder panel float/tilt | turns authorship into a card trick |
| Footer entrance choreography | delays utility at the end of a journey |
| Confetti on waitlist activation | celebrates before the user has completed the actual waitlist flow |
| New motion layered on any accepted product hero | creates two dominant moments in one viewport |
| Re-timing the Living Artifact | breaks the reviewed centre-completion contract |

## Verification matrix

The release is incomplete until all of the following have evidence:

- six routes at 1440×960 and 390×844;
- keyboard-only navigation through shell and page actions;
- Products panel open, close, Escape, outside click and ArrowDown entry;
- product switcher pointer, focus, resize and immediate navigation;
- Pricing one-shot motion, no ambient loops after settlement;
- About progress and founder signature;
- `prefers-reduced-motion: reduce` settled states;
- rapid open/close interruption without stale panels or trapped focus;
- no layout overflow or cumulative layout shift introduced by motion;
- product handoff settled at viewport centre on all four routes;
- typecheck, tests, design-system checks, lint, production build and the
  repository experience suite;
- production smoke of all six canonical URLs after deployment.
