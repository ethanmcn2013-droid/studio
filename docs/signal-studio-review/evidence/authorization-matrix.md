# Suite authorization matrix · working contract

Legend: `allow` means the server must authorize the operation; `deny` means
the route must reject without revealing object existence; `derived` means a
product may read a contract-owned projection only after the source policy
allows it. This is the test target for the lifecycle and contract phases.

| Actor / surface | Public visitor | Guest member | Member | Admin | Owner | Background job/service |
|---|---:|---:|---:|---:|---:|---:|
| Notes private note read/write | deny | deny | allow (user-owned v1) | allow (explicitly granted only) | allow | deny unless signed subject + note scope |
| Notes→Tasks promotion | deny | allow only when invited and destination allowed | allow | allow | allow | allow only with audience, subject, note, workspace, expiry, idempotency |
| Tasks task read | deny | allow shared/public scope only | allow | allow | allow | derived only from scoped contract |
| Tasks task mutation | deny | deny unless capability granted | allow | allow | allow | deny without actor/capability context |
| Tasks workspace/member administration | deny | deny | deny | allow | allow | deny unless named operator/service scope |
| Tasks public workspace | allow allowlisted DTO only | allow allowlisted DTO only | allow | allow | allow | n/a |
| Timeline public viewer | allow public projection | allow | allow | allow | allow | derived from Tasks milestone contract |
| Timeline private editor | deny | deny unless explicit owner policy | allow if owner model permits | allow | allow | deny without signed source contract |
| Signal briefing read | deny | allow only for entitled scope | allow | allow | allow | derived only from membership-checked source |
| Signal briefing generation/email | deny | deny | allow | allow | allow | allow with signed cron secret, idempotency, and rate limit |
| Entitlement read | public marketing only | allow own effective state | allow own effective state | allow workspace state | allow workspace state | allow least-privilege reconciliation |
| Account export | deny | allow own account/data | allow own account/data | allow own account/data | allow own account/data | allow signed lifecycle coordinator |
| Account deletion | deny | allow own account | allow own account | allow own account | allow own account | allow signed lifecycle coordinator |

## Required negative tests

- A user cannot read, mutate, attach, or derive an object from another workspace.
- A guest cannot use owner/admin routes or background paths to escalate.
- An expired, replayed, wrong-audience, or wrong-subject assertion is denied.
- Email changes, duplicate emails, and provider-account drift cannot change the
  authorized suite subject.
- Membership revocation and entitlement expiry apply to APIs, jobs, projections,
  public links, exports, and deletion flows.
