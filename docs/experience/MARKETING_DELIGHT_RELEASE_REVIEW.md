# Marketing delight release review

Date: 2026-07-29
Scope: Notes, Tasks, Timeline, Signal, Pricing, About
Verdict: **APPROVE**

## Decision

The release is ready to promote. Its motion is purposeful, restrained,
interruptible, and subordinate to the pages' content. The four accepted
product heroes remain the dominant expressive moments and their source is
unchanged. The reviewed Product Handoff timing is also unchanged.

The source ledger contains 144 explicit interaction decisions. Those decisions
include immediate feedback, standard or subtle motion, repairs to existing
motion, and explicit `HOLD_STILL` outcomes. Rejected candidates remain in the
ledger so future passes do not reintroduce motion without a product reason.

## Animation review

| Gate | Result | Evidence |
| --- | --- | --- |
| Should it animate? | Pass | motion is limited to state, continuity, response, explanation, or a rare authored moment |
| Timing | Pass | interactive motion stays within the 120–220ms contract; 360ms is reserved for one-shot editorial settlement |
| Easing | Pass | strong ease-out for entry/response, ease-in-out for movement, no new ease-in |
| Physicality | Pass | press feedback uses 0.98–0.985; no scale-from-zero |
| Interruption | Pass | shared menus retarget or exit from rendered state; rapid open/close is covered |
| Performance | Pass | new spatial motion uses transform/opacity; no new broad `transition: all` |
| Accessibility | Pass | hover is pointer-gated, focus has parity, reduced motion removes authored travel |
| Cohesion | Pass | product heroes lead; Pricing and About receive one rare signature moment each |

## Verification evidence

| Check | Result |
| --- | --- |
| Product switcher, Products panel, Pricing, About, reduced motion, mobile containment, accessibility | 7/7 browser tests pass |
| Product Handoff centre-completion contract | 4/4 focused production tests pass |
| Unit and contract suite | 306/306 pass |
| Experience framework self-test | 40/40 pass |
| TypeScript | pass |
| Design-system enforcement | clean |
| Targeted lint for every changed TS/TSX/test file | pass |
| Next.js production build | pass; all 45 static pages generated |
| Motion surface scan | 0 broad transition-all risks; 139 reduced-motion signals |
| Git whitespace check | pass |

## Baseline debt, not introduced by this release

The repository-wide lint command still reports the existing
`react-hooks/set-state-in-effect` violation in
`src/app/hq/account-review/account-review.tsx:86`. That file is byte-unchanged
by this branch. All changed TypeScript and test files lint clean.

The workspace-wide experience registry validation still reports 93 historical
failures across the multi-repository suite, including obsolete source
references and missing old capture records. Its schema, gate, capture,
conformance, and adapter self-tests pass. The six-page release carries its own
rendered interaction, mobile, reduced-motion, and accessibility evidence.

## Production smoke contract

After promotion, verify HTTP success and the rendered page identity at:

- `https://signalstudio.ie/notes`
- `https://signalstudio.ie/tasks`
- `https://signalstudio.ie/timeline`
- `https://signalstudio.ie/signal`
- `https://signalstudio.ie/pricing`
- `https://signalstudio.ie/about`

The release is complete only after the production deployment is `READY` and
all six canonical URLs pass this smoke.
