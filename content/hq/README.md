# Signal HQ — content/hq/ maintainer notes

This directory holds file-backed HQ content. Per the HQ v2 audit
(2026-05-14), the 2,334-line `src/lib/hq/data.ts` seed is migrating to
markdown one section at a time. Each section becomes a sub-directory
here with one `.md` file per entry.

The migration is staged across HQ-6a / -6b / -6c. **HQ-6a (shipped
2026-05-14):** decisions.

## Migration manifest

The seed has 26 top-level fields. Classification:

| Field | Destination | Status |
|---|---|---|
| `focus` | derived (read from `phase.md`, `log.jsonl`) | shipped — Today |
| `products` | markdown — `content/hq/products/` | **✓ HQ-6c.1** |
| `ecosystemFlows` | markdown | **✓ HQ-6c.1** |
| `collaborationLoop` | markdown | **✓ HQ-6c.1** |
| `sharedObjects` | markdown | **✓ HQ-6c.1** |
| `accessRoles` | markdown | **✓ HQ-6c.1** |
| `collaboratorFirstView` | markdown | **✓ HQ-6c.1** |
| `shareableArtifacts` | markdown | **✓ HQ-6c.1** |
| `features` | markdown — `content/hq/features/` | **✓ HQ-6b** |
| `launchReadiness` | markdown | **✓ HQ-6c.1** |
| `segments` | markdown — `content/hq/segments/` | **✓ HQ-6c.1** |
| `campaigns` | markdown — `content/hq/campaigns/` | **✓ HQ-6b** |
| `prospects` | **keep localStorage** (CRM operator data) | n/a |
| `contentItems` | markdown OR derive from changelogs | **✓ HQ-6c.1** |
| `demos` | markdown | **✓ HQ-6c.1** |
| `templates` | markdown — `content/hq/templates/` | **✓ HQ-6c.1** |
| `pilots` | markdown | **✓ HQ-6c.1** |
| `metrics` | **defer** (would need real DB) | n/a |
| `decisions` | markdown — `content/hq/decisions/` | **✓ HQ-6a** |
| `feedback` | **keep localStorage** (operator capture) | n/a |
| `risks` | markdown — `content/hq/risks/` | **✓ HQ-6b** |
| `weeklyRhythm` | **keep localStorage** (operator's cadence) | n/a |
| `messaging` | markdown — `content/hq/messaging.md` (single file) | **✓ HQ-6b** |
| `nextActions` | **keep localStorage** (operator's todo) | n/a |
| `growthWorkflow` | markdown | **✓ HQ-6c.1** |

## File shape (canonical)

```yaml
---
id: stable-kebab-slug                    # matches filename without .md
title: Short human title                  # ~120 chars, appears in indexes
category: Brand | Product | Pricing | ... # section-specific taxonomy
date: 2026-05-14                          # YYYY-MM-DD
status: Active | Closed | Superseded      # section-specific
reviewDate: 2026-08-14                    # optional
relatedObjects: [Signal Tasks, Signal Roadmap]   # inline array
---

## Decision
The decision in one paragraph.

## Reason
The reasoning, one or more paragraphs.

## Alternatives considered
What was rejected, briefly.

## Risks
What could go wrong.

## Notes
Implementation notes, operator follow-ups, dates.
```

The `## H2` sections are extracted by the loader into a
`{sectionName: bodyText}` map (`HqMarkdownEntry.sections`). Callers
can render the H2s in any order, or display only the ones they care
about. The H2 names are conventionally **Decision / Reason /
Alternatives considered / Risks / Notes** for the decisions section.
Other sections will define their own H2 conventions.

## Read path

```ts
import { readHqSection, readHqEntry } from "@/lib/hq/markdown";

const decisions = await readHqSection("decisions");
const one = await readHqEntry("decisions", "unified-pricing");
```

The loader lives at `src/lib/hq/markdown.ts`. Entries sort by `date`
descending; ties break by `title`. The parser accepts both inline-
array syntax (`[a, b, c]`) and JSON-array syntax (`["a", "b, comma"]`)
in frontmatter. Migration scripts use the JSON form when values
contain commas, so arrays survive the round trip.

## Dashboard read path (HQ-6c.2)

For sections wired to the live dashboard, an adapter layer at
`src/lib/hq/dashboard-data.ts` converts `HqMarkdownEntry[]` into
the typed shapes the dashboard expects (`ProductStatus[]`,
`EcosystemFlow[]`, `FeatureItem[]`, `RiskItem[]`). The `/hq` server
page reads these via `getHqDashboardMarkdown()` and passes them to
`<HqDashboard markdown={...} />` as a prop.

Inside each refactored tab, the pattern is:

```tsx
const products = markdown?.products && markdown.products.length > 0
  ? markdown.products
  : data.products;
const isFileBacked = Boolean(markdown?.products?.length);
```

When `isFileBacked` is true:

- Render the `<FileBackedNotice section="products" />` indicator
- Skip inline edit affordances (status selects, etc.) — show a
  plain mono label of the value instead
- Operator updates happen by editing `content/hq/products/*.md`

When `isFileBacked` is false (section not migrated yet):

- Render existing localStorage-edit affordances unchanged
- Operator updates persist to browser state via `updateItem`

This is intentionally additive — migration is per-tab and reversible
until HQ-6c.3 deletes the seed.

### Tabs refactored to read from markdown (HQ-6c.2)

- **Products tab** — products + ecosystem flows
- **Features tab** — features (status select replaced with mono label)
- **Decisions tab** — risks panel (markdown read; rest of tab still seed)

## Migration scripts

One-shot migration scripts live at `scripts/migrate-hq-<section>.ts`.
They import the seed, iterate the relevant array, and write markdown.
Idempotent — re-running overwrites. The seed in `data.ts` is **not**
deleted by the script; that happens in HQ-6b/c once the dashboard
reads from markdown for all migrated sections.

To run:

```sh
npx tsx scripts/migrate-hq-decisions.ts
```

## Why this is staged across passes

Strategy's HQ v2 audit named the risk: the seed contains real
strategic thinking. Migrating it without preserving every load-bearing
entry would lose company knowledge. The staged approach is:

1. **HQ-6a (shipped):** Build the loader. Migrate decisions. Wire
   into Today. Prove the pattern.
2. **HQ-6b:** Migrate features, risks, campaigns, segments,
   messaging. Refactor each tab in `hq-dashboard.tsx` to read from
   markdown. localStorage editing for these sections gets disabled.
3. **HQ-6c:** Migrate the remaining narrative sections
   (products, collaborationLoop, sharedObjects, etc.). Delete the
   localStorage editor entirely. Rewrite the CLAUDE.md "Mandatory
   Signal HQ Rule" to point at source files, not at HQ.

After HQ-6c, `data.ts` carries only the localStorage-kept sections
(prospects, feedback, weeklyRhythm, nextActions) — operator-owned
write-optimized data with no other source of truth.

## Anti-patterns

- **Don't migrate fields that change every cycle.** Use derived
  state instead (see how `focus` was replaced by reading
  `phase.md` in the Today layer).
- **Don't migrate operator-capture-shaped data.** Prospects,
  feedback, weeklyRhythm, nextActions stay localStorage-backed.
  Markdown would force the operator to open an editor and commit
  every time they update their week's plan — exactly the friction
  the localStorage edit pattern was good for.
- **Don't delete the seed before the destination is wired.**
  Migration scripts write markdown; dashboard reads markdown; only
  then is the seed safe to remove for that section.
