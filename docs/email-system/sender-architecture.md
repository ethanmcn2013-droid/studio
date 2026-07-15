# Sender and tracking architecture · proposal

Date: 2026-07-16. Status: **proposal, founder decision required**
(docs/email-system/decisions-required.md). Nothing here changes DNS or any
sending configuration. Today the suite sends only from
`hello@signalstudio.ie` via Resend, and DKIM is still pending
(docs/DKIM_SETUP.md); no new sending should begin before DKIM is live.

## Proposed sender map

| Category | Visible sender | Address | Reply-to | Why separate |
|---|---|---|---|---|
| Security and account | Signal Studio | account@signalstudio.ie | hello@ | Recipients can whitelist it; commercial mail never borrows its trust |
| Billing | Signal Studio | billing@signalstudio.ie | hello@ | Payment mail filters differently; disputes need a clean thread |
| Product and lifecycle | the product's full name (e.g. Signal Tasks) | hello@signalstudio.ie | hello@ | Continuity with the live briefing and invite senders |
| Founder outreach | Ethan McNamara | hello@signalstudio.ie | hello@ | A person writes it; a person answers it |
| Editorial (the Dispatch) | Signal Studio | dispatch@signalstudio.ie | hello@ | Subscribed mail carries list headers; separation protects the others' reputation |

Reply-to is always a monitored address. Never no-reply, anywhere: an email
address that cannot be answered contradicts the support footer's promise.

Operational separation is the point: if editorial mail ever damages sender
reputation, security, billing and product mail must not be dragged down
with it. Separate addresses now, separate subdomains (e.g.
`dispatch.signalstudio.ie`) only if volume ever justifies it.

## Tracking policy by category

| Category | Open tracking | Click tracking | Unsubscribe |
|---|---|---|---|
| Security, billing, data rights, deletion | Never | Never | Not applicable (transactional) |
| Product notifications and lifecycle | Never | First-party redirects only, if ever | Per-stream preference links, one-click stop |
| Founder outreach | Never | Never, links are bare | Manual suppression list; a "no" is honoured for good |
| Editorial | Never | Aggregate first-party counts at most | RFC 8058 one-click plus a visible footer link |

Resend's per-message open and click tracking stays off. The Signal brand
position is anti-surveillance; a tracking pixel in a briefing email would
be a brand contradiction discoverable by any technical recipient.

## Suppression, bounces, complaints

- One suppression store across all categories: a hard bounce or complaint
  anywhere stops editorial and lifecycle mail everywhere. Security mail to
  a bounced address is retried only for account recovery.
- Founder outreach suppression is manual and permanent: any reply asking
  to stop, however phrased, ends contact.
- Complaint handling (feedback loops) and bounce processing are Resend
  webhook consumers, to be built with the send pipeline, never skipped.

## Deliverability state and gates

- Live now: SPF, DMARC, MX. Pending: DKIM (operator action, Google
  Workspace admin). Outreach and editorial sending are gated on DKIM.
- The Dispatch requires List-Unsubscribe and List-Unsubscribe-Post headers
  (RFC 2369 and 8058); the analytics briefing already models this.
- Legal review still required before first send: unsubscribe wording and
  records under Irish/EU ePrivacy rules for editorial mail, and retention
  language in billing mail. This document is engineering guidance, not
  legal advice.

## References

- Resend delivery and unsubscribe-header docs (current primary source at
  resend.com/docs, verified against the analytics briefing implementation
  in `analytics/src/lib/email/dispatch.ts`).
- RFC 2369 and RFC 8058 for list headers.
- docs/DKIM_SETUP.md for the pending DNS work.
