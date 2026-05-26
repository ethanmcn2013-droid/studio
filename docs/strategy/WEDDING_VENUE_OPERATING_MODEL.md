# Wedding And Venue Operating Model

Status: active operating model - 2026-05-26
Owner: founder
Supersedes: scattered wedding/venue routing decisions across product pages, growth docs, and campaign notes.

---

## The sentence

Signal Studio is the planning layer premium venues give every couple after booking.

If a public page, sales note, demo, template, or product example does not support that sentence, it is either secondary or it is drift.

---

## The model

### Primary motion

The paid Venue Edition is the business spine.

- A venue pays once a year.
- Every couple the venue sends gets twelve months of Signal Studio.
- The venue name appears quietly on the workspace.
- The couple never sees a price.
- The venue does not run software. It hands over a code.

The venue is not buying seats. It is backing the couple's planning year.

### Roles

| Role | Who it is | What they need | What they should see |
| --- | --- | --- | --- |
| Buyer | Premium venue owner/operator | A clear commercial reason to pay | `/venues` |
| Operator | Venue coordinator or planner | Fewer repeated questions and a cleaner handoff | `/venues/demo` |
| User | Couple and/or planner | One calm place to plan | Tasks workspace after redemption |
| Viewer | Supplier, family, coordinator | One readable plan | Roadmap `/the-wedding` or a live shared plan |
| Self-serve buyer | Couple or independent planner who found Signal Studio directly | Event or Workspace pricing | `/weddings` and `/pricing` |

The buyer and the user are deliberately different in the venue motion. Pages must not flatten them into "venues, couples, planners, and suppliers" as one audience.

---

## Public routing contract

### `signalstudio.ie/venues`

The venue buyer page.

- Audience: premium venue owner/operator.
- Job: earn a venue conversation.
- Allowed CTA: talk to us about your venue.
- Allowed proof links: `/venues/demo`, `roadmap.signalstudio.ie/the-wedding`.
- Pricing: `EUR1,500-EUR4,000/year`, founding venues lock `EUR1,500`.
- Must not route a venue buyer into self-serve wedding pricing as the primary path.

### `signalstudio.ie/venues/demo`

The canonical product proof.

- Audience: venue owner/operator and coordinator.
- Job: show one wedding moving through Notes, Tasks, Roadmap, and Analytics.
- Shape: one wedding Tuesday, end to end.
- Allowed CTA: start a venue conversation.
- Must not introduce Event `EUR79` or Workspace `EUR12/mo` as the main path.

### `roadmap.signalstudio.ie/the-wedding`

The couple-facing artifact.

- Audience: couple and anyone they forward the plan to.
- Job: show what a venue-backed plan feels like.
- CTA: none.
- Pricing: none.
- Login pressure: none.

This page is a document, not a sales page.

### `signalstudio.ie/weddings`

The self-serve wedding page.

- Audience: independent couples and planners who found Signal Studio directly.
- Job: explain the wedding workspace and route to the template/pricing.
- Pricing: Event `EUR79` and Workspace `EUR12/mo` are allowed here.
- Required note: if a venue sent you a code, use that link instead.
- Must not be presented as the Venue Edition.

### `tasks.signalstudio.ie/for/weddings`

Legacy Tasks landing path.

- Canonical destination is now Studio `/weddings`.
- The Tasks product should host templates and application surfaces, not a competing wedding acquisition page.

---

## Product mechanics contract

The current venue mechanics are the right foundation:

1. Studio issues venue codes.
2. Couple opens a redeem link.
3. Unauthenticated users are sent through sign-up and returned to redemption.
4. The wedding entitlement is applied.
5. The wedding planning workspace template is applied.
6. The workspace is marked as wedding.
7. The sponsor welcome card appears.
8. The couple works inside the product without seeing venue pricing.

Do not redesign this unless a redemption test proves a real product issue.

---

## Copy rules

- Venue pages say: the venue pays, the couple never sees a price.
- Couple artifacts say: here is your plan.
- Self-serve pages say: plan a wedding yourself with Event or Workspace pricing.
- Product examples say: here is how one layer works.
- Never make the public story depend on understanding all four products first.
- Avoid "for venues, planners, couples, and suppliers" as a headline audience. It sounds complete but hides the buyer.

---

## The 9.8 gate

Before shipping any wedding or venue page:

- Can the intended audience be named in one word?
- Does the page have one primary job?
- Does every CTA belong to that job?
- Is venue pricing isolated to venue pages and pricing?
- Is self-serve pricing isolated to self-serve pages and pricing?
- Does the couple-facing artifact avoid sales pressure entirely?
- Does the page support the sentence: "Signal Studio is the planning layer premium venues give every couple after booking"?

If any answer is no, the page is not ready.
