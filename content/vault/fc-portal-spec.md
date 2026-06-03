# Founder Portal — Specification
## founders.signalstudio.ie
*Version 1.0 — 2026-05-30*

---

## Purpose

A private, invitation-only web experience for the five Signal Studio Founder Circle members. The portal is where quarterly reports are read, documents are downloaded, and ownership details are reviewed.

This is not a dashboard. It is a personal private space — the digital equivalent of the physical package. It should feel as considered as the certificate and the handbook.

---

## Audience

Five people:
- The Founding Member (Mam) — 10%, SS-FC-M
- Four Founder Circle Members — 2.5% each, SS-FC-001 through SS-FC-004

Each person's experience is personalised by name, designation, and share percentage. The portal knows who has signed in and reflects their specific ownership.

---

## Content Architecture

```
founders.signalstudio.ie/
├── /                    ← Entry (magic link sign-in)
├── /home                ← Dashboard (post-auth landing)
├── /reports             ← All quarterly and annual reports
├── /reports/[id]        ← Individual report view
├── /documents           ← Certificate, letter, handbook downloads
└── /ownership           ← Shareholding details + distribution history
```

---

## Authentication

**Strategy: Clerk magic link, invitation-only**

No shared password. Each Founder Circle member is invited by email via Clerk. They click a link in their email to sign in — no password to remember or lose.

- Sign-in method: email magic link
- Account creation: invitation only (Ethan sends invitations manually)
- No public sign-up
- Session: persistent (30-day token)
- Middleware: protect all routes except `/` (entry)

**Why not shared password:** A shared password becomes a security problem as soon as one person loses or shares it. Magic link means each person's access is independent and revocable.

**Why not OAuth (Google/Apple):** Adds friction for older recipients who may not use Google/Apple sign-in. Email magic link is the lowest-friction option that is still properly secure.

---

## Technical Implementation

**Stack:** Next.js 15+ (App Router), Clerk for auth, Vercel hosting

**Content storage:**
- Quarterly reports: Markdown files in `/content/reports/YYYY-QN.md`
- Member data: hardcoded in a typed config (5 people — no database needed)
- Documents (PDFs): Vercel Blob storage or `/public/documents/` directory
- Distribution history: JSON file in `/content/distributions.json`

**Domain:** `founders.signalstudio.ie` — Vercel subdomain configuration on the main studio account

**Deployment:** Separate Next.js project in `~/Projects/personal/founder-circle/founder-portal/` OR a new route group in the studio repo at `(founders)/`. Standalone project is cleaner and keeps sensitive data isolated.

---

## Design Principles for the Portal

**1. It knows who you are.** The greeting uses the member's name. The ownership card shows their specific percentage and certificate number. Nothing is generic.

**2. Reports are read, not downloaded.** The primary experience of a quarterly report is reading it in the portal, in the same beautiful typography as the physical version. The PDF download is secondary.

**3. No dashboard metrics.** No charts, no trend lines, no sparklines. Numbers in clean DM Mono tables. The portal is a document experience, not an analytics product.

**4. Minimal navigation.** Four sections: Home, Reports, Documents, Ownership. Navigation is a top bar — simple, unobtrusive.

**5. Documents feel archival.** The Documents section feels like opening a private drawer — the certificate, the letter, the handbook. Downloadable as PDFs.

---

## Page Specifications

### Entry (/  — unauthenticated landing)

A full-screen minimal page. No navigation, no content. Just:
- Signal Studio wordmark (small, top-center)
- "Founder Circle" heading
- One-line description: "This is a private space for Signal Studio Founder Circle members."
- Email input + "Send sign-in link" button
- Below: "Access is by invitation only."

### Home (/home — post-auth)

Three cards below a personalised greeting:

1. **Your Shareholding** — designation, class, %, certificate number, issue date
2. **Distributions** — total received, last payment date, most recent amount
3. **Latest Report** — quarter, date, opening line, link to full report

Below cards: most recent report rendered in full (first 3 paragraphs + link to read more)

### Reports (/reports)

Chronological list, newest first. Each entry shows:
- Quarter + year (e.g. "Q1 2027")
- Date issued
- Whether a distribution was made (Y / N)
- Your distribution amount
- Link to full report

Annual reports are shown as Q4 entries with an "Annual" badge.

### Individual Report (/reports/[id])

Full report rendered in the portal's typography system. Identical visual to the HTML prototype (prototype-quarterly-report.html) but within the portal shell. PDF download button in the top-right corner.

### Documents (/documents)

Three items:
- **Share Certificate** — preview image + "Download PDF" button
- **Founder Letter** — "Download PDF" button
- **Founder Circle Handbook** — "Download PDF" button

Each shows the issue date and document title in the brand typography.

### Ownership (/ownership)

Full shareholding detail + complete distribution history table:

| Quarter | Distributable Profit | Your Share | Payment Date | Status |
|---------|----------------------|------------|--------------|--------|
| Q1 2027 | €2,930               | €293.00    | Apr 9, 2027  | Paid   |

Below: the dividend formula (simplified visual from FORMULA.md).

---

## Member Configuration (typed, hardcoded)

```typescript
// content/members.ts

export const MEMBERS = {
  'user_clerk_id_mam': {
    name: '[Mam's full name]',
    firstName: 'Mam',               // used in greeting
    designation: 'Founding Member',
    shareClass: 'Class B',
    percentage: 10.00,
    certificateNumber: 'SS-FC-M',
    issueDate: 'September 1, 2026',
  },
  'user_clerk_id_1': {
    name: '[Friend 1 full name]',
    firstName: '[First name]',
    designation: 'Founder Circle Member',
    shareClass: 'Class B',
    percentage: 2.50,
    certificateNumber: 'SS-FC-001',
    issueDate: 'September 1, 2026',
  },
  // ... friends 2-4
} as const;
```

---

## Content Files

**Report format:** `/content/reports/2027-Q1.md`

Frontmatter:
```yaml
---
quarter: Q1
year: 2027
period: "January 1 – March 31, 2027"
issued: "2027-04-09"
revenue: 18340
expenses: 10800
operatingProfit: 7540
tax: 943
reserveTopup: 1820
growthInvestment: 1847
distributableProfit: 2930
distributionMade: true
distributions:
  founding_member: 293.00
  fc_member: 73.25
paymentDate: "2027-04-09"
---
```

Body: the narrative sections (opening, what we worked on, harder than expected, looking ahead, annual review if Q4) in Markdown.

---

## September 1 Launch Checklist for Portal

- [ ] Clerk production instance configured for founders.signalstudio.ie
- [ ] Five members invited via Clerk invitation (email sent on launch day or just before)
- [ ] All documents uploaded to Vercel Blob: certificate PDFs (×5), letter PDFs (×5), handbook PDF
- [ ] Launch report placeholder or Q0 welcome note published
- [ ] Domain `founders.signalstudio.ie` pointed to Vercel project
- [ ] Portal verified working on mobile (recipients may open on phone)
- [ ] Magic link email copy reviewed — should match the portal's voice

---

*See prototype-entry.html and prototype-dashboard.html for visual prototypes.*
