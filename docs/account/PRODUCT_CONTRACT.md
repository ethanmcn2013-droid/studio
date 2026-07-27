# Signal Studio Account — product contract

## Job

A commercial customer should answer five questions without a manual report and
without seeing private work:

1. Is our Signal Studio access in good standing?
2. How much access have we distributed?
3. Are recipients reaching meaningful use?
4. Is that use continuing?
5. What evidence can we take into a renewal, governance, or internal review?

## Product family

| Edition | Recipient noun | Default reporting period | Privacy posture |
| --- | --- | --- | --- |
| Venue Edition | Couples or clients | Access term | Aggregate sponsored use |
| Education Edition | Students | Academic year or programme term | Institution/programme aggregates only |
| Organisation Edition | People | Contract year | Organisation aggregates only |

Education must never introduce student drill-down or filters that could
reconstruct small cohorts.

## Navigation

Overview · Access · Usage · Reports · Account

## Snapshot contract

One typed `AccountSnapshot` drives the visual UI, accessibility text, PDF, and
CSV. Metric values are discriminated:

- `exact`
- `lower_bound`
- `withheld` (no hidden raw value)
- `unavailable` (no hidden raw value)

Coverage states:

- `complete`
- `partial`
- `suppressed`
- `unavailable`

Critical honesty rules:

- Incomplete reporting is never presented as zero.
- Access totals may remain exact when behavioural reporting is incomplete.
- Comparisons require complete coverage for both periods and compatible
  definition versions.
- Withheld values never appear in DOM attributes, tooltips, accessible labels,
  exports, or print output as numeric evidence.

## Brand language retained

- “The benefit, in use.”
- “Use, without surveillance.”
- “Aggregate use only. Private work is never included.”

## Boundary with Signal HQ Access

Signal HQ Access owns mutation and support. Signal Studio Account is
read-mostly proof of benefit. Account members may request more access; they
cannot grant it.

## Review-only scope

The authenticated HQ surface is a deterministic review prototype. Sample PDF
and CSV assets, when generated, must say:

`SAMPLE · DETERMINISTIC REVIEW DATA.`

They must be stored outside the public directory and served only through an
authenticated, allowlisted HQ download route.
