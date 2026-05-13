# Venue Edition — sponsor-to-couple email template

**Status:** Locked 2026-05-13 (Cycle 8.4.5 Item 1).
**Use:** This is the email the venue contact (e.g. Sinéad at Lamb's Hill) sends to each couple in the first-batch CSV. It is the *actual* first touch with the Signal Studio brand — so the copy is owned by us, even though it ships from Sinéad's address.

---

## Operator rules

- **The venue contact sends from their own address.** Not from a system mailer. Not from a "Signal Studio <hello@>" alias. Plain personal email.
- **Plain text.** No HTML, no logo, no branded header. The email should look like Sinéad wrote it herself.
- **One code per couple.** Each row in the CSV has its own redemption code. Do not paste the same code into multiple emails.
- **Subject and body are templated below.** Swap `[first name]`, `[CODE]`, and the venue contact's sign-off; leave the rest as written.
- **Reply-to is the venue contact.** Couples reply to Sinéad with questions, not to us. Signal Studio is the gift, not the relationship.

---

## Subject

> A year of Signal Studio, on us

(Alternative if subject feels too crafted: *Your Lamb's Hill wedding workspace*. Lock with operator before first batch.)

---

## Body

```
Hi [first name],

A small gift from Lamb's Hill: a year of Signal Studio for your wedding
planning. Quiet, plain-English software for the work of getting married —
tasks, notes, a shared timeline, a daily briefing of what needs attention
next.

Your code below. Yours alone, activates once.

Code: [CODE]
Open: signalstudio.ie/redeem/[CODE]

Reply with any questions.

Sinéad
Lamb's Hill
```

---

## Why this shape

- **No exclamation marks.** BRAND.md §3.
- **One sentence of "what it is."** Minimum viable. The landing page does the rest of the work — this email exists to get the click, not to sell.
- **"Yours alone, activates once."** Preempts the per-couple confusion ("can I share this with my partner?" / "does my mum get one too?") in fewer words than a paragraph would.
- **Plain text.** A wedding-stressed couple has been over-charmed by twelve other vendors this month. The win isn't surprise-and-delight; it's reading like a real person wrote it.
- **Sinéad's sign-off.** The trust is hers, not ours. Borrowing it once is the whole point of the Venue Edition motion.

---

## What we are NOT doing in this email

- No feature list ("✓ unlimited tasks ✓ shared timeline ✓ daily briefing"). The landing page handles that.
- No "Welcome to Signal Studio!" greeting. The relationship is sponsor → couple, not Signal → couple.
- No urgency framing ("redeem before [date]"). The window is generous (12 months from activation); urgency would read like marketing.
- No HTML/logo header. See operator rules.

---

## Open question (review before first batch send)

> Is "the work of getting married" too crafted for a venue admin email?

Alternative one-line replacement for the second sentence:

> Quiet, plain-English software — tasks, notes, a shared timeline, a daily briefing. Clear and quiet.

Decide once with the operator; lock for the pilot batch.

---

## Future automation

For the Lamb's Hill pilot the template lives here as operator reference. If the program scales past one venue, the template moves to `studio/data/sponsor-email.md` with `{{first_name}}`, `{{code}}`, `{{venue_name}}` placeholders and a `pnpm send:venue-batch` script wraps Resend.

Not in scope for 8.5.
