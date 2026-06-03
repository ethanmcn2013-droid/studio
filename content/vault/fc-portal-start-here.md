# Send this to Mam tomorrow morning — in 3 steps

Everything she needs lives in one self-contained folder: **`founder-portal/site/`**.
You deploy that folder, send her the link, and tell her the password separately.

---

## Step 1 — Edit one file

Open **`founder-portal/site/config.js`** and set four values:

```js
window.FC_CONFIG = {
  recipientFirst: "Mam",                 // what you call her (greetings + letter)
  recipientLegal: "Her Full Legal Name", // appears on the certificate, contract & cap table
  password:       "a-private-phrase",    // change this — tell her separately
  effectiveDate:  "1 June 2026"
};
```

That single file feeds the hub, the certificate, the letter and the contract. Nothing else needs editing.

> **Pick a password she'll remember.** A short lowercase phrase she'll recognise (a family word, a place). It is not case-sensitive.

---

## Step 2 — Put it online (pick one)

**Easiest — Netlify Drop (no account math, ~60 seconds):**
1. Go to `app.netlify.com/drop`.
2. Drag the **`founder-portal/site`** folder onto the page.
3. Copy the link it gives you. Done.

**Vercel (you already use it):**
```bash
cd founder-circle/founder-portal/site
npx vercel --prod
```
Follow the prompts; it returns a live URL. (Want it on `founders.signalstudio.ie`? Add that domain to the project in the Vercel dashboard afterward.)

**Just to preview it yourself first:**
```bash
cd founder-circle/founder-portal/site
python3 -m http.server 8990
# then open http://localhost:8990
```

---

## Step 3 — Send it

Two messages, sent separately:

1. The link.
2. The password — *"open it with the word ______."*

That's the whole "link + password" she's expecting.

---

## What she sees

1. **A gate** — "A private space, prepared for you." She types the password.
2. **The reveal** — her name, then *"you own 10% of Signal Studio."*
3. **Her hub** — Home, Ownership, Dividends, Valuation, Documents, Reports, About.
   - **Documents** opens the full **Agreement**, the **Certificate**, your **Letter**, and the **Handbook** — each printable to PDF from the browser.

---

## Two honest notes before you send

- **The password is a privacy gate, not a vault.** It's checked in the browser, which is right for a personal gift — but a technical person could view the page source. Don't put anything in `config.js` you'd mind being seen. (If you ever want true security, the same hub can be moved behind the Clerk magic-link setup described in `founder-portal/SPEC.md`.)
- **The contract is real, but not yet executed.** It's written to be the genuine article and to read as one. Before it's signed and the shares are entered on a register, have an Irish solicitor review **`legal-framework/AGREEMENT.md`** and align it with Signal Studio's constitution on incorporation (clause 29.4). The gift to her is sincere today; the paperwork becomes binding when it's signed.

---

## The numbers, locked

| Thing | Value |
|---|---|
| Her stake | 10.00% — **100,000** of 1,000,000 shares, Class B |
| Designation | Founding Member (the only one) · SS-FC-M |
| Effective date | 1 June 2026 |
| First report & distribution date | **15 January 2027**, then 15 Apr / 15 Jul / 15 Oct, quarterly |
| First company valuation | struck 31 Dec 2026, reported 15 Jan 2027 |
| Anti-dilution | her 10% cannot be diluted |
| On a sale | she receives 10% of net proceeds |

---

## Optional — if she's married

If you want belt-and-braces, a one-page **spousal consent** can be added so her shares are unambiguously hers alone. It's not required and may feel unnecessary for a parent — ask if you'd like it drafted.
