# Estate salvage archive

Salvaged 2026-08-12, during the public-estate consolidation that cut 62 public
destinations to 18 indexed pages on one domain. The plan is
`ESTATE_CONSOLIDATION_PLAN.md` in the workspace root; this archive is its §3a.

These files came from the `app` repo at `origin/main` (`2f86f83`), from
`src/components/marketing/`. Their routes were deleted in the same phase. They
are kept because their section structure and segment copy feed the Phase 2
`/students` rebuild (plan §4, item 1), not because anything here is ready to
ship.

## What is here

| File | Was | Why kept |
|---|---|---|
| `for-students.tsx.txt` | `app /for/students` | Section structure and segment copy for the `/students` depth band (Phase 2) |
| `for-trades.tsx.txt` | `app /for/trades` | Reference only |
| `for-freelancers.tsx.txt` | `app /for/freelancers` | Reference only |
| `for-small-business.tsx.txt` | `app /for/small-business` | Reference only |
| `for-community.tsx.txt` | `app /for/community` | Reference only |

Sibling archive: `../template-essays/` holds the 16 `src/lib/template-essays/*.ts`
files from the same cut. `final-paper-push`, `midterm-week` and
`job-application-push` feed `/students`; the `wedding-*` essays feed
venue-adjacent surfaces.

## The `.txt` suffix is load-bearing

`tsconfig.json` includes `**/*.ts` and `**/*.tsx` across the whole repo, so a
real `.tsx` file here would enter the TypeScript build and be typechecked
against a component tree it no longer belongs to. Every archived file carries a
`.txt` suffix and must keep it. Do not rename these back in place. Copy the
parts you want into a real component instead.

## Every commercial claim in here is STALE

Read nothing in these files as a live offer. They were written against
superseded terms and were deleted partly because of it. Re-source every number,
limit, tier name and eligibility rule from `contracts/commercial-terms.v2.json`
before it goes near a public surface. That file supersedes v1; v1 is not a
fallback.

Known conflicts, as examples rather than a complete list:

- `for-students.tsx.txt` sells the €9.99/yr student rate as "verified with any
  student email". The ratified term is
  `eligibility: verified_student_status_with_annual_reverification`, and the
  plan's `availability` is `only_when_eligibility_enforcement_is_live` with
  `status: policy_ratified_implementation_required`. The honour-system framing
  is not the offer.
- Free-tier workspace and editing-guest limits are quoted inline throughout.
  Check them against `plans` and `guestSemantics` in the v2 contract.
- Founder decision D3 (approved 2026-08-12) makes the studio "Student Edition"
  page the sole public student offer and strikes the €100/yr graduate price
  everywhere. Do not reintroduce it from this archive.

Voice rules still apply to anything lifted from here. Run `/brand-voice` on all
new copy.
