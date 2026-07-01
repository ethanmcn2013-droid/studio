# Do Not Rename

Terms that should stay plain, standard, or technically conventional.

Status: proposed canon

## Principle

Not every borrowed word is noise.

Some words are shared infrastructure. They let engineers, operators, vendors, tools, and future agents understand the system without translation.

Signal Studio should remove jargon where it reaches the user or distorts the brand. It should not rename standard engineering language for style.

## Engineering Terms To Keep

| Term | Keep because | Boundary |
|---|---|---|
| `src` | Standard source folder. | Code repos. |
| `app` | Standard Next.js app folder. | Code repos. |
| `api` | Standard technical interface name. | Code and technical docs. |
| `db` | Standard database abbreviation. | Code. |
| `schema` | Precise technical term. | Code and architecture. |
| `types` | Standard TypeScript term. | Code. |
| `config` | Standard configuration term. | Code and tools. |
| `scripts` | Standard automation folder. | Code repos. |
| `tests` | Standard testing folder. | Code repos. |
| `fixtures` | Standard test-data term. | Tests. |
| `migrations` | Standard database term. | Database changes. |
| `public` | Standard web app folder. | Web apps. |
| `components` | Standard frontend folder. | Frontend code. |
| `lib` | Standard helper/library folder. | Code. |
| `server` | Standard server-side folder. | Code. |
| `assets` | Standard media/static asset folder. | Product and brand assets. |
| `docs` | Standard documentation folder. | Repo-level docs. |

## Engineering Process Terms To Keep

| Term | Keep because | User-facing replacement if needed |
|---|---|---|
| `bug` | Universally understood by engineers. | `problem` |
| `release` | Clear delivery term. | `release` can stay in public if user understands it. |
| `deploy` | Precise technical operation. | `publish` or `release` |
| `build` | Precise technical operation. | Omit or use `release` |
| `test` | Clear and standard. | `check` only if user-facing. |
| `QA` | Standard internal quality term. | `quality review` |
| `changelog` | Standard artifact. | `What changed` for user-facing summaries. |
| `status` | Plain and useful. | Keep. |
| `commit` | Git term. | Omit from user copy. |
| `branch` | Git term. | Omit from user copy. |
| `pull request` | GitHub/Git term. | `review` if user-facing. |
| `issue` | GitHub artifact. | `problem`, `finding`, or `risk` outside GitHub. |
| `CI` | Standard engineering automation. | Omit from user copy. |
| `lint` | Standard engineering check. | Omit from user copy. |
| `typecheck` | Standard engineering check. | Omit from user copy. |

## Product Terms To Keep

| Term | Keep because | Boundary |
|---|---|---|
| `Notes` | Canonical product name. | Product name. |
| `Tasks` | Canonical product name. | Product name. |
| `Timeline` | Canonical product name. | Product name. |
| `Signal` | Canonical product candidate, pending legal clearance. | Product only, not generic concept. |
| `Note` | Core Notes object. | Notes. |
| `Task` | Core Tasks object. | Tasks. |
| `Timeline` | Core Timeline object. | Timeline product. |
| `Briefing` | Core Signal object. | Signal product. |
| `Workspace` | Shared working area. | Tasks and collaboration. |
| `Decision` | Plain operating and product concept. | Product and operations. |
| `Review` | Plain evaluation concept. | Product, code, legal, operations. |
| `Risk` | Plain consequence concept. | Reviews and Signal. |
| `Update` | Plain change concept. | Timeline and activity. |

## Terms To Preserve With Boundaries

| Term | Keep where | Avoid where |
|---|---|---|
| `analytics` | Telemetry, metrics, event analysis, vendor analytics, technical measurement. | Product name if the product is the briefing product. |
| `roadmap` | Strategic planning, company direction, historical references, external expectations. | Product name for Timeline. |
| `board` | Existing route names or literal board-shaped UI until migrated. | Marketing/product promise unless board is the visible object. |
| `blocked` | Technical status, Tasks internals, Signal triggers. | User copy where `waiting on...` is clearer. |
| `project` | Bounded work, user projects if they use that word. | Everywhere as a default PM container. |
| `workflow` | Technical workflow definitions with steps and outputs. | Vague product/marketing copy. |
| `agent` | Technical AI/automation docs. | Customer-facing AI claims unless explicit. |
| `memory` | AI system memory when typed/scoped. | General company records where `records` is clearer. |
| `integration` | Technical docs and vendor setup. | Marketing copy where `connect` is clearer. |

## File Names To Keep

| File | Keep because |
|---|---|
| `README.md` | Standard entry point. |
| `CHANGELOG.md` | Standard change history. |
| `package.json` | Required package metadata. |
| `tsconfig.json` | Standard TypeScript config. |
| `next.config.ts` | Standard Next.js config. |
| `eslint.config.*` | Standard lint config. |
| `drizzle.config.ts` | Standard Drizzle config. |
| `vercel.json` | Standard Vercel config. |
| `.env.example` | Standard environment template. |
| `.gitignore` | Standard Git file. |
| `AGENTS.md` | Standard agent instruction entry in many repos. |
| `CODEX.md` | Existing Codex instruction file, if repo uses it. |
| `CLAUDE.md` | Existing Claude instruction file, if repo uses it. |

## Do Not Globally Replace

Do not run global replacements for:

- `signal`
- `analytics`
- `roadmap`
- `task`
- `note`
- `issue`
- `board`
- `status`
- `release`
- `deploy`
- `bug`
- `memory`
- `workflow`

Each has legitimate uses in at least one context.

## Reasons Not To Rename

Do not rename a term when:

1. It is required by a framework.
2. It is required by a vendor.
3. It is required by a package.
4. It is part of a public route without a redirect plan.
5. It is part of a database schema without a migration plan.
6. It appears in environment variables.
7. It appears in OAuth, webhook, DNS, or billing configuration.
8. It is historical and not active product language.
9. It is a standard engineering term.
10. The replacement is more branded but less clear.

## Examples

Keep:

```text
src/app/api
src/server/db/schema.ts
scripts/deploy-preview.mjs
CHANGELOG.md
bug
release
deploy
test
schema
API
```

Replace or restrict:

```text
Sprint State -> Current State
Issue Board -> Findings List
Roadmap product -> Timeline
Analytics product -> Signal or legally cleared alternative
Signal Directors -> Advisors / Reviewers
Executive Directors -> Core advisors
```

## Final Rule

If the old word is conventional and exact, keep it.

If the old word is borrowed culture that changes how Signal Studio feels, replace it.

If the replacement is beautiful but foggy, reject it.
