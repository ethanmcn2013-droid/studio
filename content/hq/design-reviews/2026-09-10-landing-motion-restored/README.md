# Landing motion restored · 10 September 2026

Task branch: `claude/signs-landing-animation-revert-qqmtnq`, based on Studio
`6b0e41e2`. Scope: the three product artefacts on the marketing front door at
`/`. Dot's footer film is explicitly out of scope and untouched.

## The regression

S·172 (8 September) locked the timeline frame to one width so it would "hold
its width as the dates turn". That removed the frame's own motion. From then
on the timeline artefact sat still at a fixed full-bleed width while the Notes
and Tasks artefacts kept springing wide, drawing in and shifting sideways as
their scenes ran. The three demos stopped reading as one system: two moved
with their content, one did not, and the timeline no longer even lifted in on
entry because the lock also pinned its transform.

The founder's read on 10 September: the artefacts are "static and slightly
different moments", and the previous behaviour, where the containers
intelligently expand and move, is the one to restore.

## What changed

`src/components/reveal/floor-and-sheet.css`

- The timeline frame goes back to its own width states: the container width at
  rest, `min(100vw - 56px, 1560px)` for the dates across, `min(100%, 820px)`
  for the same dates down the page, on the 950ms soft spring that Notes and
  Tasks already use for width and horizontal position.
- The morph shadow returns while a width change is in flight.
- The pinned `transform:none` is gone, so the frame lifts in on the shared
  `.app.rise` entrance like the other two.
- Below 1024px both width states resolve to 100%, so the frame is still one
  full-width panel on phones and small tablets. The vertical layer goes back
  to filling the stack box.
- The stricter reduced-motion rule added in S·172 stays: under
  `prefers-reduced-motion` nothing inside the frame animates or transitions.

`src/components/reveal/floor-runtime.ts`

- The timeline scene shapes its frame again: wide at the start, tall at 5.2s
  when the dates turn down the page, wide again at 10.4s on the way back.
- The finished state settles wide, which is also what the "View activity"
  button resolves to.

Kept exactly as shipped: Dot's footer film and its pause control (S·172 to
S·174), the muted indigo word strikes (S·175), and the activity preview with
its viewer list (S·176).

## Evidence

Captured from the production build (`pnpm build` then `pnpm start`) at
<http://127.0.0.1:3100/> on 10 September 2026, against the final commit.
Frame geometry sampled every 500ms through each scene at desktop 1440 x 900
and mobile 390 x 844: [frame-geometry.json](frame-geometry.json).

Desktop, timeline frame: width moves across 820, 889, 1097, 1120, 1371, 1377
and 1384px, and its left edge across 28, 160, 275 and 310px, through the
`stage-wide` and `stage-tall` states, with the morph state observed. Before
this change the same sample returned a single width of 1392px, a single left
edge of 24px, and no stage states at all.

Notes and Tasks are unchanged and still measure their own motion in the same
run: Notes 601 to 739px, Tasks 980 to 1384px.

Mobile: all three frames hold one width, 330px for Notes and Tasks and 346px
for the timeline, and only their height changes. That matches the mobile
behaviour before S·172.

Reduced motion: all three artefacts resolve straight to their finished state
with computed `transition-property: none`, the timeline settling wide with the
activity preview shown.

No page errors and no console errors in any run. The footer Dot reports
`data-running=true` at both widths, with its pause control intact.

## Gates

`pnpm typecheck`, `pnpm ds:check`, `pnpm test`, `pnpm build`, `pnpm lint`,
`pnpm remediation:check`, `pnpm recovery:drill`, `pnpm experience:validate`
(studio), `pnpm experience:self-test`, `pnpm experience:audit --enforce`,
`pnpm ux:assure --enforce`, and the Playwright harness, 57 passed. All green
against the final commit.

## Next decision

Whether the timeline's top band goes back to the grey inset that S·172
removed. The founder asked for motion, not for the inset, so the continuous
paper surface stays for now. Worth a look once the morph is live.
