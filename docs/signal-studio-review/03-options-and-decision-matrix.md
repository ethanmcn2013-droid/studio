# Architecture options and decision matrix

## Decision criteria

Scores are 1 (poor) to 5 (strong). Weights reflect a founder-led, pre-launch company: coherence and tenant security matter more than theoretical deployment independence; migration risk remains heavily weighted.

| Criterion | Weight |
|---|---:|
| Product/UX coherence | 18 |
| Security and tenancy | 18 |
| Founder operating simplicity | 17 |
| Development velocity | 15 |
| Migration safety | 14 |
| Runtime performance | 8 |
| Deployment/failure isolation | 6 |
| Two-year adaptability | 4 |
| **Total** | **100** |

## Weighted matrix

| Option | Coherence | Security | Ops | Velocity | Migration | Perf. | Isolation | Adapt. | Weighted result |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| A. Four independently implemented repos/apps | 2 | 2 | 1 | 1 | 5 | 2 | 5 | 3 | 246/500 (49.2%) |
| B. Separate apps with deliberate shared platform/contracts | 4 | 4 | 3 | 3 | 4 | 3 | 5 | 4 | 374/500 (74.8%) |
| C. Monorepo, independent apps, shared packages | 5 | 4 | 4 | 5 | 3 | 4 | 5 | 5 | **423/500 (84.6%)** |
| D. One modular deployable app | 5 | 4 | 5 | 5 | 1 | 5 | 2 | 4 | 382/500 (76.4%) |
| E. Shell/micro-frontends | 4 | 3 | 1 | 1 | 1 | 2 | 4 | 3 | 246/500 (49.2%) |

## Option assessments

### A — current separation without a platform layer

Preserves failure isolation and has no migration cost, but copied shell, packages, auth assumptions, tests, and vendor configuration already drift. Choose only if the products are intentionally sold and operated as unrelated businesses. They are not.

### B — pre-launch bridge

Keep repositories and deployments, but define canonical identity/tenancy/contracts and consume versioned shared packages. This captures roughly 80% of the benefit with the lowest launch risk. Its cost is temporary package version coordination and continued multi-repo changes.

### C — selected target

One monorepo containing `apps/studio`, `apps/notes`, `apps/tasks`, `apps/timeline`, and `apps/signal`, plus shared packages. Deployments and domains remain independent. Benefits are atomic contract changes, affected-app CI, consistent tooling, and copy-free shared primitives. Migrate only after P0 gates; the move must be mechanical and behavior-preserving.

### D — one modular runtime

Potentially simplest later, but currently couples releases and failure domains and requires identity, routes, schemas, and deployments to move together. The pre-launch migration risk overwhelms its elegance. Reconsider only if two years of evidence show independent releases/domains are artificial.

### E — micro-frontends

Reject. There is one founder, one stack, no independent teams requiring runtime composition, and no evidence that micro-frontend complexity solves a real constraint.

## Final selection

Adopt **B immediately**, then migrate to **C** after launch blockers and the canonical identity/tenant contract are proven. Preserve independent product runtimes. Do not begin D or E before launch.

## Red-team condition

If monorepo history/config migration is not mechanical, reversible, and runnable through affected-app builds, defer it. Shared identity semantics, contracts, CI, and shell packages deliver most of the value without moving repository history.
