# Sender and tracking architecture

Date: 2026-07-29. Status: **reply routing ratified; sender changes remain
provider-gated**. Six receiving aliases are verified. Nothing here changes DNS
or any sending configuration. Current provider-level sender behaviour remains
unchanged until it is verified in Resend or the service that actually sends
the message. DKIM is still pending (docs/DKIM_SETUP.md); no new sending should
begin before DKIM is live.

## Proposed sender map

| Category | Visible sender | Address | Reply-to | Why separate |
|---|---|---|---|---|
| Security and account | Current provider sender | Unchanged | security@ or support@ | Security reports separate from ordinary account help |
| Billing | Current provider sender | Unchanged | billing@ | Payment disputes stay in one monitored thread |
| Product and lifecycle | Current provider sender | Unchanged | support@ | Product and access replies reach support |
| Privacy and data rights | Current provider sender | Unchanged | privacy@ | Deletion and export replies reach the privacy route |
| Founder outreach | Ethan McNamara | hello@signalstudio.ie | partnerships@ | A person writes it; partnership replies stay grouped |
| Editorial (the Dispatch) | Current provider sender | Unchanged | hello@ | General editorial replies remain company-level |

Reply-to is always a monitored address. Never no-reply, anywhere: an email
address that cannot be answered contradicts the support footer's promise.

Reply routing is the current change. Sender reputation remains shared until
provider-level sender separation is explicitly configured and verified.

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
