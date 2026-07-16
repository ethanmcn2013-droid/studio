# Elevation tracker · v2 craft pass

Date: 2026-07-16. The loop ran three rounds across the whole set: round
one implemented the charters, round two fixed what the round-one renders
showed, round three tightened the assets and ran the cross-set sweeps.
Every email × direction was re-rendered and re-screenshotted each round
(`renders/v2/`), and no cell passed until its four visual states and its
plain-text twin passed together. Scores are the Taste Arbiter's, also
shown live in the Lab beside each preview. Floor: 9.5.

States verified per cell: desktop 700 · mobile 390 · forced dark ·
images blocked · plain text. Fallback-font reality: every screenshot on
the audit machine renders without Geist installed, so the default
evidence IS the fallback; the three `--geist` samples show the ideal.

| Email | Hairline | Broadsheet | Letterhead |
|---|---|---|---|
| One-time sign-in code | 9.8 · 3 rounds | 9.6 · 3 | 9.5 · 3 |
| Access is ready · welcome | 9.5 · 3 | 9.7 · 3 | 9.6 · 3 |
| Payment failed | 9.8 · 3 | 9.6 · 3 | 9.5 · 3 |
| Account deletion scheduled | 9.7 · 3 | 9.7 · 3 | 9.8 · 3 |
| Venue outreach | 9.5 · 3 | 9.5 · 3 | 9.9 · 3 |
| School outreach (Blocked) | 9.5 · 3 | 9.5 · 3 | 9.8 · 3 |
| Student verification approved | 9.6 · 3 | 9.5 · 3 | 9.7 · 3 |
| Dispatch issue | 9.5 · 3 | 9.9 · 3 | 9.6 · 3 |

All 24 cells complete, all directors signed. The engineering floor held
for every cell: VML twin under every button, `role="presentation"` on
every layout table, `lang="en"`, designed dark palettes with the canvas
reaching the wrapper cell, alt text written and dressed as copy, tabular
numerals on every fact, crafted preheaders, no view-in-browser on
transactional mail, composed plain text at a 72-character measure.

The two highest cells are the two the system exists for: the Letterhead
venue letter (9.9) and the Broadsheet Dispatch (9.9). The 9.5 cells are
deliberate: they are each direction rendering a mode it exists to refuse
(Hairline doing editorial, Broadsheet doing founder mail), competent by
contract and unloved by design.

Ledger findings closed in this pass: CL-01, CL-02 (divergence codified),
CL-03, CL-04, CL-05, CL-08, CL-09, CL-10, CL-12, CL-13, CL-14, CL-15,
CL-16, CL-17, CL-18, CL-19, CL-20, CL-21, CL-22, CL-23. CL-06 accepted
as the safe default (break-all survives; display paths unchanged).
CL-07 closed by the per-direction stacks and tabular numerals; the
honest note stands that Broadsheet's display tracking is Geist-tuned.
CL-11 closed by the em-img frame treatment in adapt darks and the held
sheet in Letterhead. CL-24 was a record correction, no fix required.
