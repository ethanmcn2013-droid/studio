# Signal Studio Limited — Constitution & Share Structure
## Incorporation blueprint · v1.0 — 2026-06-01

> **Status: DRAFT for DIY incorporation.** Statutory references carry a January 2026 knowledge cutoff. **Verify every figure, form name, and fee against cro.ie and revenue.ie at the moment of filing** — Irish company-law thresholds and CRO forms change. This is a working blueprint, not regulated legal advice. The companion tax analysis is in `TAX-AND-VALUATION-MEMO.md`; the filing runbook is in `CRO-INCORPORATION-CHECKLIST.md`.

---

## 1. Company type

**Private Company Limited by Shares (LTD)** under Part 2 of the Companies Act 2014.

Why LTD (not DAC, not CLG):
- Single-document **constitution** (the CA2014 LTD replaced the old memorandum + articles split).
- **Can have a single director** — but then *must* appoint a separate company secretary (a sole director cannot also be the secretary). This is the one structural catch for a solo founder. *(Verify you have a willing secretary — can be a person or a corporate secretarial service.)*
- Unlimited capacity (no objects clause restricting what the company may do).
- At least one **EEA-resident director**, or a Section 137 non-resident bond (~€25,000) if no director is EEA-resident. Ethan is Ireland-resident → satisfied, no bond.

---

## 2. The share structure (defined at formation)

The single highest-leverage decision in this whole project: **create both share classes in the constitution at incorporation**, so the company is *born* with the right cap table. This avoids a later constitution amendment + special resolution + Form B5 refiling to introduce Class B.

### Authorised / issued

CA2014 LTDs are not required to state an authorised share capital cap. We will issue:

| Class | Holder | Shares | Nominal value | % |
|-------|--------|--------|---------------|---|
| A — ordinary, voting | Ethan McNamara | 900,000 | €0.001 = €900 | 90% |
| B — Founder Circle, non-voting | «Founding Member» (Mam) | 100,000 | €0.001 = €100 | 10% |
| **Total issued** | | **1,000,000** | **€1,000** | **100%** |

**Nominal value €0.001/share is a deliberate recommendation.** It keeps total issued capital at €1,000 and Mam's nominal liability at €100 — both trivial. Ethan funds the paid-up amount on Mam's 100,000 shares (€100) as part of the gift, so she owes the company nothing. *(No statutory minimum capital applies to an LTD — verify. If you prefer a rounder €0.01 nominal, Mam's nominal liability becomes €1,000, which Ethan would still pay up; €0.001 is cleaner.)*

**Keep 1,000,000 / 100,000.** Every downstream artifact — the certificate (SS-FC-M, "100,000 Class B shares"), the agreement, the handbook — is built on these numbers. Do not change the share count to "tidy" it; change only the nominal value.

### Class rights (must be written into the constitution)

The constitution's share-rights clause must reproduce, in company-law form, what `AGREEMENT.md` promises Mam:

- **Class A** — full voting rights; entitled to dividends and capital as declared.
- **Class B (Founder Circle)** — **non-voting** (save the mandatory statutory vote on any variation of Class B rights themselves); **rank pari passu** with Class A for dividends and on a return of capital / winding up, pro rata to nominal value; **no right to appoint a director**; rights variable only with the written consent of the Class B holder(s) (mirrors agreement clause 26.2).

> **Drafting note.** The shareholders' agreement (`AGREEMENT.md`) carries the rich commercial terms — anti-dilution top-up, buy-back, drag/tag, SSV pricing, dividend formula. The **constitution** carries only the bare class architecture (voting / non-voting / ranking / variation-of-rights). Keep the heavy machinery in the agreement; keep the constitution minimal and standard. Two reasons: (1) the constitution is a public document filed at the CRO — you don't want the SSV formula or family arrangements public; (2) a minimal constitution is far less likely to contain a self-inflicted error.

---

## 3. How the shares actually reach Mam — the mechanism

Two viable models. **Recommended: Model B.**

**Model A — Mam subscribes at incorporation.** Mam is named as an original subscriber for 100,000 B shares on the Form A1. Clean (no transfer, no stamp duty) but it weakens the "gift from your son" narrative the certificate and letter are built on, and it requires Mam's details on a public incorporation filing on day one.

**Model B — Ethan takes all 1,000,000, then gift-transfers 100,000 B to Mam (recommended).**
1. At incorporation Ethan subscribes for the full 1,000,000 (900,000 A + 100,000 B).
2. Immediately post-incorporation, Ethan executes a **stock transfer form** gifting 100,000 B shares to Mam for natural love and affection, no consideration.
3. The company updates its **register of members**, issues Mam's **share certificate** (the designed SS-FC-M cert), and the `AGREEMENT.md` is signed.

Model B matches every artifact you've already built, keeps the gift genuinely *from Ethan*, and the only cost is a near-zero stamp-duty question (covered in the tax memo — at a €100 nominal / nominal-value gift it is trivial or exempt). This is the model `AGREEMENT.md` clause 2.1 and 29.4 already describe.

---

## 4. What goes in the constitution (checklist)

- [ ] Company name: **Signal Studio Limited**
- [ ] Type: private company limited by shares (LTD, CA2014 Part 2)
- [ ] Two share classes defined: A (voting) and B (non-voting Founder Circle), with the §2 rights
- [ ] Nominal value €0.001 per share
- [ ] Standard LTD provisions (CA2014 supplies most by default — the "optional provisions" only need stating where you depart from the Act)
- [ ] Pre-emption on new issues **disapplied as between the classes to the extent needed** so the anti-dilution top-up to Mam and any future founder issuance work without procedural deadlock *(cross-check against agreement clause 18 — get this right or the anti-dilution mechanic can jam)*
- [ ] Registered office address (in the State)

---

## 5. Decisions — CONFIRMED 2026-06-01

| Decision | Confirmed value |
|----------|-----------------|
| Company name | **Signal Studio Limited** |
| Sole director | **Ethan McNamara** |
| Company secretary | **Sheauveen McCallig** (Ethan's mother — also the Founding Member) |
| Registered office | **320 Glantann, Castletroy, Limerick, Ireland, V94 RTP1** *(spelling/eircode to confirm — see note)* |
| Nominal value | **€0.001 per share** (issued capital €1,000; Mam's nominal €100, funded by the Founder) |
| Gift mechanism | **Model B** — Ethan subscribes for all 1,000,000, then gift-transfers 100,000 B to Mam |
| Execution | **As a deed** (solves the no-consideration enforceability point) |
| Agreement Date / Completion | Agreement Date = July signing date (TBC); Completion = incorporation |

### Note 1 — the secretary is also the beneficiary

Sheauveen McCallig is both the **Company Secretary** (a statutory officer) and the **Founding Member** (the Class B gift recipient). This is lawful and common in Irish micro-companies, but note three things:

- As secretary she becomes a **statutory officer** with compliance duties (maintaining registers, ensuring the annual return is filed) and **potential liability for filing defaults**. In practice Ethan performs the work; she is the named officer. Make sure she understands she is accepting an officer role, not just lending a name.
- Her **name and an address go on the public CRO register** as an officer. She may use the **registered office** (the Limerick address) as her officer service address to keep her Donegal home off the public record, if she prefers.
- Keep the secretary role **unpaid** — a secretary's fee would be employment/income, complicating her otherwise clean gift position.
- There is a mild tension with agreement clauses 4 and 24 ("you bear no responsibility for running the company"): being secretary *is* an administrative responsibility. It does not affect her non-voting / no-governance status, but it is worth naming. *If you would rather keep her entirely duty-free, a ~€100–300/yr corporate secretarial service is the alternative — not chosen.*

### Note 2 — address to confirm

The portal `config.js` records the founder address as **"320 Glantann … V94 RTP1"**; Ethan's latest message typed **"320 Glantan … V94RTP1"**. Confirm the exact townland spelling (one **n** or two) and eircode spacing before filing — a registered-office address must be exact.

---

*Companion files: `TAX-AND-VALUATION-MEMO.md` (CAT, stamp duty, valuation basis) · `CRO-INCORPORATION-CHECKLIST.md` (the filing runbook) · `AGREEMENT.md` (the shareholders' agreement) · `MOTION-FREELANCER-EQUITY-MEMO.md` (the separate sweat-equity question).*
