# Venue Fulfilment Runbook

Status: founder-review draft - 2026-05-26
Owner: founder
Companion docs: `ENTITLEMENTS_OPS.md`, `VENUE_EDITION_EMAIL_TEMPLATE.md`, `VENUE_SETUP_RITUAL.md`

---

## Purpose

This runbook defines what happens after a venue says yes.

The operating promise is the product promise:

The venue pays once a year, receives codes, gives each couple a code, and has nothing else to run.

---

## Fulfilment Stages

| Stage | Owner | Output |
| --- | --- | --- |
| 1. Qualified yes | Founder | Confirm signer, annual price, start date, venue name as it should appear. |
| 2. Payment | Founder | Invoice settled before any live couple codes are issued. |
| 3. Sponsor setup | Signal Studio | Venue sponsor record exists; slug confirmed. |
| 4. Code issue | Signal Studio | Wedding-tier, venue-edition codes issued for 365 days. |
| 5. Operator handoff | Founder | Venue receives plain-text couple email template and CSV/list of codes. |
| 6. Coordinator walkthrough | Founder | 25-minute setup ritual or 30-minute couple-view walkthrough. |
| 7. Soft redemption window | Venue + Signal Studio | Venue sends first small batch to couples; Signal watches redemption. |
| 8. Retro | Founder + venue | One short retro: what couples asked, what broke, what to improve. |
| 9. Renewal | Founder | Renewal conversation before annual expiry. |

---

## Pre-Sale Checks

Complete before a venue is allowed to buy.

| Check | Pass condition |
| --- | --- |
| Buyer | The person saying yes can sign or has direct access to signer. |
| Venue fit | Premium, wedding-led, real coordination volume, brand promise of care. |
| Price | Venue understands annual prepaid model. |
| Privacy | Venue understands it does not see private couple workspace by default. |
| Operation | Venue understands it does not manage seats/users. |
| Name | Venue name/eyebrow treatment confirmed. |

---

## Payment And Setup

| Step | Detail |
| --- | --- |
| Confirm plan | Boutique EUR1,500 / Mid-size EUR2,500 / Large or multi-site EUR4,000. Founding cohort locks EUR1,500/year. |
| Invoice | Send invoice for annual prepaid amount. |
| Wait | Do not issue live codes until paid. |
| Create sponsor | Use existing sponsor setup path. Slug should be short and stable, e.g. `tankardstown`, `rathsallagh`. |
| Confirm code quantity | Start with a small first batch unless the venue has a specific reason for more. |
| Issue codes | Use `pnpm issue:codes <sponsor-slug> <count> venue_edition wedding 365`. |
| Save audit | Store issued code list in the agreed private operator location. Do not paste codes into public docs. |

---

## Code Issue Command

Reference from `ENTITLEMENTS_OPS.md`:

```bash
cd ~/Projects/personal/studio
pnpm issue:codes <sponsor-slug> <count> venue_edition wedding 365
```

Example:

```bash
pnpm issue:codes lambs-hill 10 venue_edition wedding 365
```

This dual-writes to Studio sponsor audit and Tasks runtime comp codes.

---

## Venue-To-Couple Handoff

Use `docs/VENUE_EDITION_EMAIL_TEMPLATE.md` as the locked source for the actual couple email.

Rules:

| Rule | Why |
| --- | --- |
| Venue sends from its own address. | Trust belongs to the venue. |
| Plain text only. | It should feel like a real venue note, not software marketing. |
| One code per couple. | Codes are single-use. |
| Reply-to is the venue. | The venue owns the relationship. |
| Signal supports product issues. | The venue does not become support. |

---

## Couple Redemption Flow

Expected path:

1. Couple receives the venue note.
2. Couple opens `https://signalstudio.ie/redeem/[CODE]`.
3. Studio shows the co-branded landing.
4. CTA routes to `tasks.signalstudio.ie/redeem/[CODE]`.
5. Couple signs in or creates account.
6. Tasks redeems code.
7. Wedding workspace opens.
8. Venue sponsorship card/eyebrow is visible.
9. Couple starts planning without seeing price.

Acceptance: a fresh user can complete the flow in an incognito browser and reach the wedding workspace.

---

## Dry Run Before First Real Venue

Run this before any new venue batch is sent.

| Step | Test |
| --- | --- |
| 1 | Issue one internal test code for a test sponsor or safe existing sponsor. |
| 2 | Open `signalstudio.ie/redeem/[CODE]` in incognito. |
| 3 | Confirm venue eyebrow and claim copy. |
| 4 | Continue to Tasks redemption. |
| 5 | Sign up with a test user. |
| 6 | Confirm success state. |
| 7 | Confirm wedding workspace is created/applied. |
| 8 | Confirm partner stats reflect issued/redeemed state. |
| 9 | Confirm no self-serve price is shown during venue redemption. |

Do not send venue emails if this dry run fails.

---

## Coordinator Walkthrough

Default: use `VENUE_SETUP_RITUAL.md`.

If the venue is not ready to bring a real wedding, run the shorter couple-view walkthrough:

| Minute | Action |
| --- | --- |
| 0-3 | Re-state mechanic: venue pays once/year, couple gets code, no admin panel. |
| 3-8 | Show redeem page and couple workspace eyebrow. |
| 8-15 | Show one wedding Tuesday: Notes -> Tasks -> Roadmap -> Analytics. |
| 15-22 | Show what the venue sends couples. |
| 22-27 | Explain support and privacy boundaries. |
| 27-30 | Confirm first batch size and send date. |

---

## Support Boundaries

| Question | Owner |
| --- | --- |
| Code does not work | Signal Studio |
| Couple cannot sign in | Signal Studio |
| Couple asks what Signal Studio is | Venue can answer with the one-line template; Signal Studio supports product detail. |
| Couple wants planning advice | Venue/planner, not Signal Studio. |
| Couple wants venue-specific timing/rules | Venue. |
| Product bug | Signal Studio. |
| Billing/pricing | Venue + Signal Studio only; couple should not see venue price. |

---

## Retro

Run one retro after the first redemption window.

| Question | Why |
| --- | --- |
| How many couples received codes? | Base denominator. |
| How many redeemed? | Activation interest. |
| Where did couples get stuck? | Product issue or communication issue. |
| What did couples ask the venue after receiving it? | Copy/support clarity. |
| Did any repeated question reduce? | Core value signal. |
| Would the venue send this to the next batch? | Practical endorsement. |
| What would make this easier for the coordinator? | Product/ops improvement. |

---

## Renewal Mechanic

| Timing | Action |
| --- | --- |
| 90 days before annual end | Founder checks venue usage and open issues. |
| 60 days before | Send calm renewal note to venue contact. |
| 30 days before | Confirm renewal or close sponsorship for future couples. |
| End date | Existing couple workspaces keep their data; sponsorship behavior follows product policy. |

Renewal should never be triggered from the couple side.

---

## Do Not Do

| Do not | Reason |
| --- | --- |
| Issue live codes before payment. | It turns the founding position into a free trial. |
| Give the venue a complex dashboard in the first motion. | It contradicts "nothing to run." |
| Let the couple see venue pricing. | Breaks the buyer/user model. |
| Send couple emails from Signal Studio as the first touch. | Weakens the venue sponsorship. |
| Promise automation that does not exist. | Trust loss. |
| Use a sample wedding when a real setup ritual is available. | The live build is the proof. |

