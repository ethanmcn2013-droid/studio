# Studio 14: bounded review and delegated repairs

The principal assigned these fourteen surfaces to one writer in `feat/january-studio14-coverage`, starting from `43bf371029d712d3f41f2870703ab47103ff35a4`. Poincare's original extension work and pilot remain untouched; `inherited-pilot/` preserves the transferred evidence. This directory records internal synthetic review, not production verification or a founder design lock.

## Observed failures and delegated decisions

Our own baseline build `8ImlnWhzrlAts7mT0fzVe` produced `pilot-2026-09-05T00-30-02-549Z/manifest.json`: 20 passing and eight failing cases. All failures and screenshots are retained. The principal delegated minimal semantic accessibility repairs, then explicitly delegated the Experimentation layout repair after its mobile content clipping was shown.

| Observed selector | Before evidence | Bounded source repair |
| --- | --- | --- |
| Atlas inactive lens buttons, group headings and `.atlas-row-{index,state,summary,age}` | Muted `#71717a` on `#f4f4f5`, 4.39:1 | Use the existing HQ `--hqx-muted-ink` semantic color at these consumers. Search placeholder uses the same semantic color. |
| Marketing `.mkt-stat-label`, inactive `.mkt-view-tab`, `.mkt-tab`, `.mkt-tab-count`, `.mkt-filter-{label,count}`, `.mkt-note-add`, `.mkt-tag`, `.mkt-attr` | Same 4.39:1 failure | Use existing HQ muted ink at the observed consumer rules; the shared quick-action rule follows its note-action peer. |
| Hero `.hero-room-direction > span:nth-child(2)` | Candidate/archive badges, 4.39:1 | Existing HQ muted ink for these badge labels. |
| Experimentation description's repository-coordinate span | Opacity 0.8 reduced effective ink to `#7f7f86`, 3.61:1 | Remove the opacity reduction; retain the existing semantic ink. |
| Venues footer back link | Link distinguished only by color, 1.72:1 against surrounding text | Add underline and underline offset to the existing link. |
| Experimentation row's third span | Fixed three-column grid put current descriptions outside the narrow section's clipped bounds | Name the existing row/description classes; use a section container query at 600px to put the description on its own full-width row. Keep the desktop three-column allocation, allow text wrapping and give row links an inset focus outline. |

No design-system token definition, drift ceiling, action, data, external destination or navigation contract changes. These are delegated engineering decisions under the accepted January programme, not founder-specific selections.

Fresh build `OuL3rYNB4ulOv0N4ug56z` and `pilot-2026-09-05T00-52-59-995Z/manifest.json` produced 28/28 passing default cases. The first focused Experimentation run, `capture-2026-09-05T00-55-36-450Z/manifest.json`, passed 16/16 at the four declared widths, including all-current-description bounding rectangles, a labelled browser-only long-description stress fixture, 200% CSS zoom, actual Tab focus and reduced motion. These are intermediate receipts, not the final combined source attestation; subsequent tooling refinements require the new full capture.

The 82-case mobile diagnostic (`capture-2026-09-05T00-56-50-085Z`) passed 80 cases and exposed two further contrast failures: `.mkt-queue-caption` at 4.39:1 and the longer Engineering profile's `.ml-3.opacity-70` autonomy label at 3.23:1. The bounded repair reuses HQ muted ink for the caption and removes opacity from the two peer profile suffixes.

At mobile 390px plus 200% CSS zoom, the effective width is only about 195 CSS pixels: a harsher synthetic case, not proof of native mobile pinch zoom. The principal requested ordinary 320/390 and desktop reflow-equivalent checks before classifying inherited chrome clipping. `chrome-2026-09-05T01-00-40-140Z` then observed actual clipping without zoom: Lab's current breadcrumb received only 4.67px at 320, Product heroes 11.77px at 320 and 73.34px at 390, and the actual staged-access text was truncated at both widths. Under the principal's explicit conditional authorization, the repair allows mobile breadcrumb wrapping, retains the existing controls at their own size, and lets the header grow from its previous minimum height. The notice text wraps with a readable line height and a fixed-size close control. Navigation structure, actions and information architecture are unchanged. The reflow equivalent of a 1280 desktop at 200% is tested at 640 CSS pixels. Native browser zoom and human comprehension remain unverified; the 195px CSS-zoom stress case alone does not create a broader acceptance requirement.

## Source applicability

`scripts/experience/january-extension/matrix.mjs` declares 328 page-success cases at 390×844, 768×1024, 1280×900 and 1440×960. The common states are default, authored long content, reduced motion and keyboard only. Extra states and variants follow actual source:

| Surface | Material states beyond the common presentation states |
| --- | --- |
| Access | Actual query-driven error; separate unconfigured server. Configured form is rendered and keyboard edited, never submitted. |
| Atlas | Query zero-match; keyboard search, clear and all lenses. Actual local article Mermaid labels and scrolling. |
| Cards / Socials | Twelve real images per page must decode; local download links must return 200. No publishing actions. |
| Entitlement lookup | Same-person grant, redemption and history reads; missing person; unread store; read-only view; revoked-only controls; restriction; confirmation armed and cancelled without submitting. Historical synthetic display rows confer no issuance authority. |
| Experimentation | Actual authored links and descriptions, narrow reflow, long-description stress and CSS zoom. External links are not followed. |
| Health | Green, amber, stale red, failed red, empty and failed-read Never run. The helper swallows read failure; this does not demonstrate a page ErrorPanel. No cron is executed. |
| Marketing | Ideas, empty queue, timeline, local engine, empty ledger, seeded queue and ledger, engine read error; actual localStorage note editing. `PARTNER_STATS_SECRET` stays unset; fallback zeros do not prove usage. |
| Org | Read-only Director profile, longer Engineering profile and access restriction. There is no editor, save, success or loading implementation. |
| Platform readiness | Actual tracked remediation ledger, never fabricated status changes. |
| Hero / Venues | Actual long authored documents and keyboard links. No external preview or outreach proof. |
| Waitlist | Single awaited read: empty, populated, error and restriction, plus dense/long and accessibility states. No phantom form, first-use lifecycle, loading or partial-read branch. |

Missing Atlas and Org slugs use a separate expected-404 browser contract at all four widths (`boundaries.mjs`); it does not waive the unchanged page-success capture gate. Applicability updates never change review scores, approval hashes, design ownership or baseline approval.

## Isolation and final integration

The fixture uses only disposable SQLite in this checkout. It constructs baseline read-table columns, then applies the owning `0001_venue_fulfilment` and `0002_usage_delivery` ledger runners for their actual runtime tables and fences. It verifies those ledger receipts and the immutable trigger. Baseline-column creation is not proof of a complete historic migration lifecycle. Usage/service/provider credentials are absent; no positive grant, provider or email pipeline runs.

The extension retains source digest, supplemental collateral/ledger input digest, full extension tooling digest, actual Next artifact ID and the build ID served in each HTTP document. Every case binds its actual fixture, viewport, route, branch interactions and screenshot bytes. Failed runs are never overwritten or promoted. Scripted completeness does not imply manual, council or comprehension acceptance.

The principal owns package registration and the final combined 188+4 recapture. No existing 188 or Atlas4 receipt is regenerated here. A receiving commit with different source or asset inputs requires a fresh build and extension recapture; an old receipt cannot be relabelled. The two local servers are owned by this checkout on 4416 and 4417; Poincare's previews remain untouched.
