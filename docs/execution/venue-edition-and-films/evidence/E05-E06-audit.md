# E05 and E06 audit — what exists, what does not

The audit D-015 Q2 required before any build over E04 to E12. Twenty-four tasks,
four parallel auditors, criteria derived from task titles first and tested
against code with file and line. 2026-08-03.

**Why it ran.** A previous session inferred from `BASELINE_REVIEW.md` §9 that E05
and E06 had no implementation and commissioned six design variants on that
premise. The inference was wrong. This audit is the correction and the thing that
should have happened first.

**Headline:** far more is built than assumed, and **two hard blockers mean no
invited spouse, planner or redeemed couple can reach the product in production
today.** Six ratified constraints are violated in shipped code.

---

## The two production blockers

**1. The `/app` gate bounces everyone who was invited or redeemed.**
`app/src/app/app/layout.tsx:16` calls `requireAppAccess()`, which is
allowlist-only: `app/src/server/require-app-access.ts:33` redirects to
`/waitlist` when `isEmailAllowed(email)` is false. The extension built precisely
to prevent this, `requireAppAccessTasks` at `app/src/server/app-access.ts:29`,
where a membership row satisfies the gate, is wired **inside** the layout at
`tasks-runtime-shell.tsx:66`. The outer gate fires first. Its own header comment
describes the failure it now permits: an invited non-allowlisted user accepts the
invite, burns the token, then bounces to `/waitlist` forever. Redemption is the
same: `redeem/[code]/page.tsx` grants an entitlement and touches no allowlist.
**Verified independently.** Size: small. Nothing else in E05 is demonstrable
until it lands.

**2. A couple can never get a Timeline workspace.**
`createWorkspaceAction` at `app/src/modules/timeline/server/actions/workspaces.ts:93`
has **zero callers** across `src`, `e2e`, `scripts` and `experience`. The only
other reference is a comment in `timeline-queries.ts:228` pointing back at it.
`getCurrentWorkspace` returns `workspaces[0] ?? null`, which in production is
null forever, so `/app/timeline` renders a permanent empty state advising
"Create a workspace in Tasks first" — advice that does nothing, because creating
a Tasks workspace does not create a Timeline one. **Verified independently.**
Timeline is the film's hero. Size: medium.

## Six ratified constraints violated in shipped code

| Constraint | Violation | Where |
|---|---|---|
| **"The couple never sees a price"** (D-001, PROJECT.md §5) | Three live surfaces. `TIER_RANK` puts wedding at 2 and workspace at 3, so `notesProEnabled` fails and Notes renders a free-tier upsell linking to pricing. Settings shows a four-column price grid with live Upgrade buttons. Timeline returns "Upgrade to Workspace at signalstudio.ie/pricing" | `notes-entitlements.ts:35`, `CaptureEmailRow.tsx:47`, `billing.tsx:255`, `timeline/.../workspaces.ts:144` |
| **Never "forever" or "for life"** (D-001 p16, R-008) | Four user-facing strings. The redeem card falls back to `"for life"`, rendering "You're on Wedding suite until for life." Three more in billing | `redeem-result-card.tsx:52`, `billing.tsx:66,71,94` |
| **No marketing on a wedding page** (D-011 rationale) | `PublishedFooter` is appended unconditionally to every theme including the wedding one: a wordmark, "Made with Tasks · this layout is free", and a "Pick this template" CTA. `/p/[slug]` is not in the robots disallow list | `published-workspace.tsx:20`, `published-footer.tsx:41-77` |
| **Nothing in the viewport reads as branding** (D-011 p2) | A `timeline` wordmark with an accent dot renders above the couple's names on the keepsake, and `critical-experiences.spec.ts:318` asserts its exact text, so a passing test locks in what the decision forbids | `timeline-artifact.tsx:277-281` |
| **Aggregate viewer counts only** (E06.07's own title) | "Timeline views 1 · Last viewed 3 Aug 2026" side by side de-anonymises a single viewer. No floor, no suppression anywhere in the module | `artifact-studio.tsx:59-67` |
| **R-017, Article 9 guest data** | "Collect final dietary notes" ships in the template and on a public marketing page. Nine touchpoints, and `suite-navigation-contract.test.mjs:428,459` asserts the exact string, so removing it fails the suite | `studio/.../tasks.ts:69` is canonical; `templates.generated.ts:108` is generated |

## What does not exist at all

- **Keepsake.** `grep -rni keepsake` across `app/src`, `app/drizzle`, `app/docs` returns zero matches. Not a route, not a column, not a comment. The term maths is correct and shipped; expiry simply has no destination. D-010 point 3 makes the export the thing that keeps the promise honest, and the only export is a GDPR JSON dump named after a user id.
- **Decisions.** No table, no object, no surface. A `"decision"` tag on three template tasks is all. Near-miss worth knowing: `tasks.sourceNoteExtractBody` already stores the creator-approved wording that produced a task, and task detail never shows it.
- **Roles.** Exactly two exist, `owner` and `member`, and `member` is full read-write on everything. A florist invited to see one task sees the honeymoon budget. Spouse, planner and family-member appear nowhere in code.
- **Photographs and stories in the public artifact.** `ITEM_KEYS` is `publicId, title, date, state`. `attachments` is on a hard denylist. This is why the Timeline reads as a rail, and it is not a typography problem.

## The Timeline question, answered

**Both layouts the lab was asked to invent already ship, and they coexist
properly.** The vertical mobile Timeline is `timeline-artifact.module.css:967-1145`,
landed deliberately as commit `20be8d7`, merged as PR #48 on 2026-07-22. It flips
the coordinate system: the rail becomes `width: 2px; height: auto`, milestones
position by `inset-block-start`, the Today marker rotates, collision-avoidance is
replaced by showing every label. The desktop editorial layout is `:375-400` plus
a third tier at `min-width: 980px`. Different objects across the breakpoint, not
one object rewrapped.

"The Mara and Finn concept" in E06.10's title is not a comp to design toward. It
is the shipped artifact rendered with a fixture that runs through the production
validator.

**The three variants attacked the wrong layer.** All were typographic and
choreographic, and every one presumed content the DTO cannot carry. **Recommendation:
kill them.** The welcome lab is unaffected and its A-versus-W question is live.

## The E05.12 knot

The bar for "world-class design-system review" is **defined twice and adopted
zero times.** `app/experience/quality-council-gate.json` is a full certification
contract: 13 dimensions, minimum 50 of 52, product score is the minimum never an
average, 120 assessment units each needing three independent human reviews, with
`automationMayAwardTasteScores: false`. Its own status reads `not-assessed`, its
evidence directories do not exist, and CI runs it `continue-on-error: true`. The
VEF product gate defines something different and much smaller: `ds:check` clean
plus baselines plus founder evidence.

`ds:check` passes clean in both repos, verified.

**Studio holds 40 approved baseline PNGs over 10 surfaces, and they are the wrong
10.** Two point at routes that no longer exist, including `/app/board`, which
`AGENTS.md` says must never be emitted. **Not one authenticated couple-journey
surface has a locked baseline.** The capture plan still targets the
pre-consolidation subdomains.

**And E05.12 is circularly dependent on E14.15:** E05.12's scope is "every
captured product surface" and the surface list is E14.15's output, while E14.15
depends on E05.12. That knot has to be cut by writing the list first, or capture
freeze has no defined input.

## Evidence integrity

All 128 passing Playwright tests run in **demo mode**. `browser-contract.json`
sets `accessMode: "demo"`, and `critical-fixtures.json`'s own `operatorBlocked`
array says authenticated states need a review tenant that does not exist. **No
pass is evidenced on the authenticated couple journey.**

99 of 191 declared state-slots are evidenced, 92 remain. Every capture forces
`reducedMotion: "reduce"` and screenshots with `animations: "disabled"`, so
**motion is never rendered in any evidence**, while the film shows motion.

Thirteen of the fifteen review receipts bind their evidence to a foreign fixture.
The `/welcome` receipt's decision text claims the surface passes on four
breakpoints with no axe violations; the evidence it cites is a sign-up run.

## The journey forks on an environment flag

`flags.ts:33` defaults contextual onboarding on outside production. Venue arrivals
are routed to a path that applies no wedding template and never shows the venue
welcome card. **Everything captured locally before 22 August exercises a
different couple journey than production does.**

Separately, `sign-up/page.tsx:72-73` sets `forceRedirectUrl` to `/welcome`
unconditionally, even after resolving a sponsor. Clerk ranks that above the
`redirect_url` param, and the redeem page's own comment asserts the opposite. If
the prop wins, the code never redeems. **Needs a live Clerk check; not provable
read-only.**

## What actually needs building, ranked

| # | Work | Size | Why here |
|---|---|---|---|
| 1 | Move the `/app` gate onto membership-or-entitlement, with a regression test | S | Nothing is demonstrable until it lands |
| 2 | Remove the three price surfaces | S | Live today, breaks the promise the whole offer rests on |
| 3 | Verify and fix the sign-up redirect | S + live check | If broken, no venue code activates |
| 4 | R-017 out of the template and its nine touchpoints, including the contract test | M | Article 9, critical, open |
| 5 | Provision a Timeline workspace for a couple | M | The film's hero is unreachable |
| 6 | Close the onboarding fork | M | Local capture does not show what a couple sees |
| 7 | Name the E05.12 bar and write the captured-surface list | S decision, gates L | UI freeze has no test without it |
| 8 | Rewrite the wedding template in the couple's voice with real `dueAt` dates | M | Currently a planner's checklist frozen at "Today" |
| 9 | Keepsake export as a real artifact | M | D-010 p3 makes it the honest half of the promise |
| 10 | Reconcile E06.08's code with D-011, and the wedding-page CTA | S | A Done task whose code contradicts its decision |
| 11 | Suppress the viewer count below a threshold | S + decision | The one thing E06.07's title forbids |
| 12 | Re-point and re-capture baselines on the couple journey | L | The deliverable of E05.12 |

**Blockers: 1, 2, 3, 4.** Items 5 and 6 block capture freeze specifically.

## Decisions only the founder can make

1. **The E05.12 bar.** Bar A, the 120-unit council with three human reviews each, is not achievable in 17 days. Bar B is. Pick one.
2. **Roles.** Do spouse, planner and family-member get real capability boundaries, or does one `member` role ship with a written refusal? Gates four to eight days.
3. **Keepsake.** Build, or formally defer past 1 September. Zero code exists.
4. **Photographs and stories in the public artifact.** Everything in E06 is behind it, and adding them removes the field-shape accident currently holding R-017 shut.
5. **The viewer-count threshold.** D-011's 3 and 5 are venue-cohort numbers and do not fit this surface.
