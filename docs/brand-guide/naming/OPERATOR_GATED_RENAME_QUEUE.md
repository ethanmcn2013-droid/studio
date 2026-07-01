# Operator-Gated Rename Queue

These tasks need account access, DNS/Vercel/GitHub authority, production data
backup, or legal clearance. They were intentionally left to the end.

## Initiative 2A - Domains and Vercel

| Task | Owner action |
| --- | --- |
| Add `timeline.signalstudio.ie` to the Timeline Vercel project | Configure domain and DNS. |
| Add `signal.signalstudio.ie` to the Signal Vercel project | Configure domain and DNS. |
| Keep `roadmap.signalstudio.ie` live temporarily | Add host-level redirect to `timeline.signalstudio.ie` after the new domain is verified. |
| Keep `analytics.signalstudio.ie` live temporarily | Add host-level redirect to `signal.signalstudio.ie` after the new domain is verified. |
| Set `NEXT_PUBLIC_TIMELINE_URL` | Use `https://timeline.signalstudio.ie` in every deployed app. |
| Set `NEXT_PUBLIC_SIGNAL_URL` | Use `https://signal.signalstudio.ie` in every deployed app. |

## Initiative 2B - GitHub and Local Paths

| Task | Owner action |
| --- | --- |
| Rename GitHub repo `signal-directors` | Target: `signal-advisors`; then update local remote URLs. |
| Rename local checkout `signal-directors` | Do after GitHub remote rename and automation path updates. |
| Rename repo/project `roadmap` | Target: `timeline`; coordinate Vercel project, Git remote, local path, and docs. |
| Rename repo/project `analytics` | Target: `signal`; coordinate Vercel project, Git remote, local path, and docs. |
| Rename live demo/resource slug `signal-roadmap` | Target: `signal-timeline`; update any external resource, saved demo URL, or provisioned service name that currently depends on the old slug. |

## Initiative 2C - Production Contracts

| Task | Owner action |
| --- | --- |
| Rename `roadmap_items` table/columns | Requires backup, migration plan, deploy order, and rollback plan. |
| Rename `roadmapItems` Drizzle symbols | Do after DB migration or keep as compatibility aliases. |
| Rename old `roadmap` and `analytics` env vars | Add new env vars first; remove old ones only after deploy verification. |
| Remove `/api/roadmap.ics` compatibility route | Only after known calendar subscribers have moved to `/api/timeline.ics`. |

## Initiative 2D - Legal

| Task | Owner action |
| --- | --- |
| Clear `Signal` as a public product mark | Search/clearance before major public launch spend. |
| Decide fallback if `Signal` is risky | Locked fallback candidates: `Briefing`, `Daily Signal`, or `Signal Briefing`. |
