---
id: wedding-guest-list
title: Wedding guest list
product: tasks
status: Built
lastVerified: 2026-10-14
---

# Wedding guest list

A Wedding project has a guest list organized around invitation households. People can be added as adults or children, plus-ones can be named later, and replies can be set for a household or changed for one person. Meal choices and dietary needs sit with each guest. Search and filters help manage the list; import previews group matching email addresses into households; the caterer export includes attending guests and only the selected columns. Seating and Budget remain coming soon.

## Source and evidence

The source candidate is App `b805c5501f8198218791491ae0a2f26efbae0657` (tree `07ea449b3f9f39724961875bd612f18f6ae34071`), with migration `0042_wedding_guests` already applied; this release does not replay it.

The Windows isolated SQLite attempt (`attempt03`) invoked the real guest actions against disposable databases with synthetic actor fixtures. Its receipt records 18 of 18 assertion groups passing and zero assertion failures, covering authorized create/edit/import/export, refusal boundaries, limits, SQL rollback, project cleanup, account export, and account erasure. The actor fixture is not a Clerk/JWT session. This Windows attempt remains **FAILED** because its child process exited abnormally (`3221225477`); its separate after-exit cleanup receipt records the fixture databases absent.

A separate [GitHub `Guest action qualification` run](https://github.com/ethanmcn2013-droid/app/actions/runs/38635390584) qualifies the isolated actions against the exact built runtime source: its receipt pins all 71 expected runtime inputs to App commit `b805c5501f8198218791491ae0a2f26efbae0657` (tree `07ea449b3f9f39724961875bd612f18f6ae34071`), bundles 38 real runtime inputs, and records 18 of 18 assertion groups passing, native exit code 0, no network attempts, and all 18 disposable databases removed. The qualification workflow/test commit is `1fd228312f2a3df9f92f7d51c99bf2f6e14a723f` on its own branch; its runtime source matches b805. The receipt qualifies guest actions, authorization boundaries, SQL/transactions, export/privacy, and scoped lifecycle functions under a trusted actor fixture. It does not establish Clerk/JWT/browser authentication, production data or provider effects, or full HTTP account deletion. The Windows failure and an earlier Linux manifest failure remain preserved.

The local demo route was exercised with 10 browser-flow/layout assertions and its original sample restored after reload (receipt SHA-256 `1AE86DF9F48E13657ACCEEC7CF039740380B4AB242B11C0336FDF4A6E39561D9`). That route uses sample data and local UI state; its interactions do not prove authenticated guest persistence. The attempt-04 files labelled light were actually dark and remain disqualified for light-theme coverage. Attempt 06 supplies separate theme-verified, top-of-page screenshots; it did not rerun the behavior suite. In production, the bounded existing-session receiving checked Projects and Tasks board/list, plus task detail, Files, Timeline and Home; it did not create, edit or reload Wedding guests.

## Live receiving

**DEPLOYED; guest persistence receiving remains unverified.** App `b805c5501f8198218791491ae0a2f26efbae0657` (tree `07ea449b3f9f39724961875bd612f18f6ae34071`) is served by deployment `dpl_8vdnW7eRwiDzinzDQwFwrCzh1k38`; the release receipt records reviewed reconciliation of all six live aliases (SHA-256 `9b7e46357c42a8c422cce5171c6785e300d18bdd42dadbeb76902945dfac2bd5`), with a passing independent provider review. The existing-session live read journeys did not include the Wedding guest route or any guest create/edit/reload. The sample route, synthetic-actor SQL qualification, and deployment receipt do not establish authenticated production guest persistence or feature acceptance.
