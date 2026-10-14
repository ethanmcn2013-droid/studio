---
id: tasks-sign-in-options
title: Tasks sign-in options
product: tasks
status: Built
lastVerified: 2026-10-14
---

# Tasks sign-in options

When the sign-in form offers another method, its footer keeps that method available. The built App candidate removes the shared Clerk `footerAction` hiding rule while retaining the stage-owned header and footer styling.

## Source and evidence

The deployed source is App `b805c5501f8198218791491ae0a2f26efbae0657` (tree `07ea449b3f9f39724961875bd612f18f6ae34071`), on deployment `dpl_8vdnW7eRwiDzinzDQwFwrCzh1k38`. The source regression test covers the merged appearance. The release receipt records the candidate and reviewed three-host reconciliation of all six live aliases (receipt SHA-256 `9b7e46357c42a8c422cce5171c6785e300d18bdd42dadbeb76902945dfac2bd5`); its independent provider review passed. Existing-session authenticated read checks also passed, but they did not exercise a fresh Clerk sign-in or confirm that another provider is offered in a live sign-in form.

## Live receiving

**DEPLOYED; feature receiving remains unverified.** Deployment and alias reconciliation are confirmed, but fresh sign-in, live Clerk rendering, and provider availability were not tested. Do not treat deployment or the unrelated authenticated read checks as sign-in acceptance.
