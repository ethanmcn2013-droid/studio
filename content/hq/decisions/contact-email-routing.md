---
id: contact-email-routing
title: Six verified aliases route Signal Studio enquiries by intent.
category: Operations
date: 2026-07-29
status: Active
reviewDate: 2026-10-29
relatedObjects: [BRAND.md, signalstudio.ie/contact, email templates, legal pages]
---

## Decision

Signal Studio routes enquiries through six verified aliases:

- `hello@signalstudio.ie` for general company and press enquiries.
- `support@signalstudio.ie` for product, access, onboarding and accessibility help.
- `billing@signalstudio.ie` for payments, invoices, refunds and renewals.
- `privacy@signalstudio.ie` for data rights, deletion, cookies and consent.
- `security@signalstudio.ie` for vulnerabilities, incidents and suspected compromise.
- `partnerships@signalstudio.ie` for venues, schools, universities and commercial collaboration.

## Reason

One general inbox made product help, privacy rights, payment questions and
partnership work indistinguishable. The aliases now exist, so the public site
can give each request a clear operational destination without adding a form or
turning the footer into a directory.

## Boundaries

Company-level footers and press contact stay on `hello@`. Contextual pages use
the narrowest correct route. Provider sender configuration, DNS, SPF, DKIM and
DMARC do not change merely because receiving aliases are verified.

## Verification

The website uses a typed contact source, contextual mailto subjects, a compact
contact directory, and template reply-to metadata. Public legal and support
copy follows the same map.
