---
title: Three products and Home as one system
slug: five-products-as-a-system
lens: Products
owner: Ethan
lastVerified: 2026-09-04
links: [signal-studio-umbrella, five-products-as-a-system, pricing-and-entitlements]
tags: [January 2027, Notes, Tasks, Timeline, Home]
references: [content/hq/decisions/three-products-home.md, docs/execution/january-2027/PROGRAMME.md, contracts/commercial-terms.v2.json]
summary: Notes captures thinking, Tasks moves work, Timeline makes the plan visible; Home brings the current project back into view.
status: partial
pinned: false
execWhat: Notes captures thinking, Tasks moves work, Timeline makes the plan visible; Home brings the current project back into view.
execMatters: Current source and internal candidate evidence guide the January programme.
execRisk: Candidate code, synthetic evidence and intended policy must not be mistaken for production or customer proof.
---

## Product and route contract

The historical slug is retained so existing Atlas links survive. It is not the product count.

| Surface | Responsibility | Canonical App route |
|---|---|---|
| Home | Authenticated front door and Today’s Signal | /app/home |
| Full Briefing | Evidence and attention within Home | /app/home/briefing |
| Notes | Private thinking and deliberate promotion to work | /app/notes |
| Tasks | Actions, ownership and dates | /app/tasks |
| Timeline | Visible plan and deliberately published narrow artifact | /app/timeline |

Observed source: App docs/SUITE_URL_AND_NAMING_CONTRACT.md, active-project ADR 0001 and Studio three-products-home decision. Authorization uses the object’s stored canonical project; URL/cookie identity is a hint, never access authority.

## Integration and limits

Notes, briefing and Timeline run as modules in the unified App. New UI must emit canonical destinations; retired inputs may redirect. Project switching, invitation arrival, object actions and public/private boundaries require integrated tests.

App 9bb7e9df tests invitation to B while A is active, including Google dispatch failure after membership commit leaving a pending B grant. Candidate 50f16575 passed the 132-case critical browser attestation. These do not prove the entire collaborator activation loop or first-contact comprehension.

Project Drive is an optional project storage capability under Connections and task Resources, default off in the January candidate. Membership and Google permission state remain distinct. See content/hq/features/project-files-in-drive.md and the App work-package receipts.

The programme uses App and Studio release/january-2027 branches, one writer per worktree and principal ownership of shared boundaries. Technical artifacts and approved policy are reconciled explicitly; neither a route existing nor a passing fixture proves live customer value.

## Provenance

The previous entry is preserved in docs/execution/january-2027/history/five-products-as-a-system-before-20260904.md and Git 004f9c9. Its older topology, prices and readiness claims are superseded here. Status is partial because final integrated and provider acceptance remains open.
