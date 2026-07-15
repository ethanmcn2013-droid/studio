# Visual Baseline Process

A visual baseline is an approved comparison artifact, not the latest screenshot. A golden set is a deliberately small set of exemplary experiences used to calibrate judgment. Neither is approved by capture automation.

Reserved founder actions are tracked in [Approve the first Signal visual baselines](../../content/hq/operator-todos/approve-experience-visual-baselines.md). Authenticated evidence that needs controlled identities or secrets is tracked separately in [Provision authenticated experience capture access](../../content/hq/operator-todos/provision-authenticated-experience-capture.md).

## Artifact vocabulary

| Artifact | Meaning |
|---|---|
| Candidate | Screenshot produced by the current capture run |
| Baseline | Human-approved screenshot used for future comparison |
| Diff | Pixel-level difference between candidate and baseline |
| Review | Evidence record explaining and disposing of a change |
| Golden set | Founder-approved reference experiences representing the desired bar |
| Baseline debt list | Known open high-risk finding IDs allowed temporarily; may only shrink |

A candidate with a stable hash is not automatically a baseline. A missing baseline is not a visual pass. An unchanged screenshot does not prove product quality; it proves only that the rendered pixels match the approved comparison.

## Deterministic capture contract

The current canonical environment in [`capture-plan.json`](../../experience/capture-plan.json) is:

| Setting | Value |
|---|---|
| Locale | `en-GB` |
| Time zone | `Europe/London` |
| Colour scheme | `light` |
| Reduced motion | `reduce` |
| Animation policy | disabled |
| Settle time | 1200 ms |
| Browser | Playwright Chromium |
| Viewports | 390×844, 768×1024, 1280×900, 1440×960 |

The capture runner also blocks service workers, disables CSS animation/transition duration and caret colour, waits for DOM content, captures a fixed viewport rather than full page, and records a SHA-256 candidate hash. Determinism also requires stable fixtures, identity, data, fonts/assets, network target, and credentials; the script cannot infer those are stable.

Product base URLs may be redirected to controlled environments with `EXPERIENCE_BASE_URL_<PRODUCT>` variables, using uppercase product IDs with hyphens replaced by underscores.

## Candidate capture

1. Confirm the registry and capture plan reference the same intended experience/state.
2. Make fixtures reproducible and remove personal/production data from the evidence path.
3. Run `pnpm run experience:validate`.
4. Capture the full pilot set with `pnpm run experience:capture`, or narrow diagnosis with `--experience=<id>` and `--breakpoint=<id>`.
5. Inspect the manifest, candidate, baseline, diff, Axe details, overflow, navigation, page errors, console errors, and timing together.
6. Record findings and a review; do not approve directly from a diff ratio.

Candidates are written under `experience/output/screenshots/`; diffs under `experience/output/diffs/`; approved baselines under `experience/baselines/`. The manifest is `experience/output/capture-manifest.json`.

## Approval

Baseline approval is a founder action executed only after deterministic and subjective review:

```powershell
$env:SIGNAL_EXPERIENCE_BASELINE_APPROVED_BY = "<founder identity>"
pnpm run experience:capture -- --approve --experience=<id>
```

Approval copies the candidate into the baseline path and records `approvedBy` in the manifest. Before approving, verify all four breakpoints; a filtered single-breakpoint approval is appropriate only when the other approved breakpoints remain current and unchanged.

The review record must link:

- experience, state, breakpoint, baseline, candidate, and diff;
- before/after scores and finding IDs;
- annotations and severity;
- approval history and approver note;
- design-system, code, and change references; and
- resolution evidence when closed.

## Golden-set approval

[`golden-set.json`](../../experience/golden-set.json) is currently provisional and names the founder task [`approve-experience-golden-set`](../../content/hq/operator-todos/approve-experience-golden-set.md). A golden set becomes approved only when:

1. every listed ID exists and is the intended reference archetype;
2. the capture plan covers the same reference experience and required state;
3. every required breakpoint has fresh deterministic evidence;
4. all 13 dimensions pass and the reference earns—not merely reaches—the bar;
5. no unresolved/unexcepted hard blocker exists;
6. the founder approves the set as a coherent suite, not five unrelated attractive screens; and
7. the approval task, review records, baseline references, and golden-set status tell the same story.

Do not use a provisional golden item to justify a 4 or approve a new baseline by resemblance.

## Ratchet and no regression

For each approved baseline, a candidate may be:

- **unchanged:** deterministic comparison is clear; subjective review is needed only when non-visual behavior/materiality changed;
- **changed and intended:** attach an approved/resolved review, then approve the new baseline;
- **changed and unintended:** create findings, remediate, and recapture; or
- **not comparable:** repair determinism before judging the design.

The known-debt list in [`baseline.json`](../../experience/baseline.json) may only shrink. A resolved finding is removed from the list. A new high or release-blocking finding must fail enforcement unless it has an explicit, approved, time-boxed exception. Never update a baseline merely to make a diff disappear.

## Time-boxed exceptions

An intentional exception requires:

- stable ID;
- rationale and exact scope;
- accountable owner;
- founder approval source;
- ISO expiry date; and
- concrete remediation plan.

Expired exceptions fail the gate. Renewals require a new decision and evidence; editing the date without review is not renewal. An accepted exception remains visible in findings and does not raise the affected score.

## Baseline refresh triggers

Recapture and review when any of these change materially:

- source materiality hash, layout, content hierarchy, state behavior, tokens, typography, or motion;
- browser/runtime version or rendering platform;
- viewport, locale, time zone, colour scheme, reduced-motion policy, or settle time;
- fonts, assets, fixtures, seeded identity/data, or target environment; or
- audit standard, golden set, or breakpoint/state taxonomy.

Keep old evidence only as review history. The active baseline reference must point to evidence produced under the current contract.
