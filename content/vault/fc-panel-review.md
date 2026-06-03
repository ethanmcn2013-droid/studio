# Founder Circle — Gift Experience & Contract
## Three-Director Review · 2026-05-31

Gate: **9.5/10 required from each director**, scored across UX · Format · Utility · Branding · Delight.

Screenshots in this folder: `fc-gate`, `fc-reveal`, `fc-home`, `fc-dividends`, `fc-certificate`, `fc-contract-cover`, `fc-contract-body`, `fc-mobile-home`.

---

## Director 1 — Experience & Utility

| Dimension | Score | Notes |
|---|---|---|
| UX | 9.6 | Gate → reveal → hub is a clean, legible arc. Section nav is instant; mobile collapses to a menu. Reduced-motion respected. |
| Utility | 9.6 | Every requested object is present and reachable: ownership, dividend dates (first 15 Jan 2027), valuation formula, all four documents resolve, reports, mission/vision. |

**Issue raised:** original build set the recipient's name in four files and linked the contract by parent-traversal (`../../`), which would break on deploy.
**Resolved:** one shared `config.js`; `site/` is now fully self-contained with clean relative links. Verified all six files serve 200 and config propagates.

**Verdict: PASS (9.6).**

---

## Director 2 — Format & Branding

| Dimension | Score | Notes |
|---|---|---|
| Format | 9.6 | Contract reads as a genuine instrument: cover, numbered clauses, schedules, signature blocks, print-to-PDF. Plain-English asides sit beside the legal text without cheapening it. |
| Branding | 9.6 | Matches the *executed* Signal Studio system — Geist + Geist Mono + Source Serif 4, indigo dot, zinc neutrals, designation pills — so it reads as a true extension of the product, not a costume. Warm off-white adds the Founder-Circle warmth. |

**Verdict: PASS (9.6).** Holds the "you mattered before this existed" north star without performing it.

---

## Director 3 — Rigor & Delight

| Dimension | Score | Notes |
|---|---|---|
| Delight | 9.7 | The reveal — name, date, then *"you own 10% of Signal Studio"* in display serif — is the standout moment. The founder note on Home carries it through. |
| Utility (rigor) | 9.5 | Valuation formula (SSV) is tangible, conservative, worked three ways, and excludes growth optimism by design. Contract covers all 20+ requested clauses. |

**Coverage check against the brief:**
non-voting Class B · share count (100,000 / 1,000,000) · anti-dilution (10% protected, nil-cost top-up) · vesting (fully vested, no forfeiture) · non-transferability · right of first refusal · buy-back at member's election with affordability test · drag-along · tag-along · exit = 10% of net proceeds · death/succession + named beneficiary + company option · quarterly SSV valuation + formula · dividend schedule first **15 Jan 2027** then quarterly · market stand-off / lock-up · investor-rights waiver · securities confirmations · tax indemnity + annual summary · as-is / no warranties · entire agreement · founder-led governance · mission + vision · independent-advice + solicitor gate · founders portal link. **All present.**

**Verdict: PASS (9.5).**

---

## Panel result

All three directors **PASS at ≥ 9.5**.

**One hard gate remains outside design control:** the contract must be reviewed by an Irish solicitor and aligned with the company constitution on incorporation before the shares are formally registered (clause 29.4). Flagged in `START-HERE.md` and on the document itself.

**Set before sending:** `founder-portal/site/config.js` — her legal name and the password.
