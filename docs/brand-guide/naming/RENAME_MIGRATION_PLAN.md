# Rename Migration Plan

Specific proposed renames for Signal Studio.

Status: proposal only. No source files have been renamed.

## Migration Principles

1. Define canonical language before renaming files.
2. Rename visible product language before code and integrations.
3. Keep standard engineering terms where they are exact.
4. Keep old aliases until redirects, imports, CI, domains, and deployments are mapped.
5. Record every major rename in `decisions/`.
6. Pause public mark changes until legal clearance is complete.

## Legal And Commercial Naming Note

This is not legal advice. It is a clearance-risk note for counsel.

Live-source verification found:

- Keysight actively uses `Signal Studio Software` and `PathWave Signal Generation` pages for signal creation software: https://www.keysight.com/us/en/products/software/pathwave-test-software/signal-studio-software.html
- Keysight also has current `Latest Versions Signal Studio Software` pages: https://www.keysight.com/us/en/lib/resources/technical-specifications/latest-versions-signal-studio-software-2806906.html
- Signal Technology Foundation states that `Signal`, related names, designs, and slogans are registered trademarks: https://signal.org/brand/trademarks/
- USPTO guidance says a mark may be refused where there is likelihood of confusion with a registered mark or earlier-filed pending application if it registers: https://www.uspto.gov/trademarks/additional-guidance-and-resources/possible-grounds-refusal-mark

Recommendation:

- Treat `Signal Studio`, `Signal`, and `SignalHQ` as legal-clearance risks before further public expansion.
- Keep the naming system internally coherent, but do not assume public trademark safety.
- Ask trademark counsel to evaluate `Signal Studio`, `Signal`, `SignalHQ`, domains, logos, product marks, and disclaimers.

## Migration Tiers

| Tier | Scope | Risk | Examples |
|---|---|---|---|
| Tier 1 | Product/UI language | Low to medium | `Roadmap` -> `Timeline`, `Analytics` -> `Signal` in visible copy. |
| Tier 2 | Docs and audit files | Medium | `FINDINGS.md` -> `FINDINGS.md`, `CURRENT_STATE.md` -> `CURRENT_STATE.md`. |
| Tier 3 | Folder/repo/package names | High | `roadmap` -> `timeline`, `analytics` -> `signal`. |
| Tier 4 | Routes, domains, env, external integrations | Highest | Vercel roots, Clerk, Stripe, Slack channels, webhooks, DNS. |

## Specific Rename Table

| Current name | Proposed name | Category | Confidence | Reason | Risk | Rename now or later |
|---|---|---|---:|---|---|---|
| `Roadmap` product name | `Timeline` | Product name | High | Timeline is clearer, less PM-coded, already appears in current product docs. | Old repo/routes/docs use `roadmap`. | Now for UI/docs; code later. |
| `roadmap` repo/folder | `timeline` | Product folder | Medium | Aligns repo with canonical product. | Git remotes, Vercel root, imports, package name, env vars. | Later. |
| `roadmap·` wordmark | `timeline·` | Product mark | High | Product is Timeline. | Motion specs and assets. | After brand/legal review. |
| `Analytics` product name | `Signal` | Product name | Medium | Signal better matches briefing/attention product than dashboard analytics. | Legal clearance, Signal Messenger confusion, technical analytics ambiguity. | Now only if counsel approves public mark; otherwise use `Briefing`/`Insights` as fallback. |
| `analytics` repo/folder | `signal` | Product folder | Medium-low | Aligns repo with product if cleared. | Search ambiguity, package names, technical analytics terms, legal risk. | Later after counsel and import plan. |
| `analytics-demo` | `signal-demo` or `assets/video/signal-demo` | Demo/asset folder | Medium | Aligns demo with product language. | Render scripts and references. | Later. |
| `Signal Directors` | `Signal Studio Advisors` or `Advisors` | Internal agent system | High | Removes false hierarchy and org-chart theatre. | Existing config IDs and Slack channels. | Docs now; machine IDs later. |
| `directors/` | `advisors/` or `roles/` | Agent folder | Medium | Role-based, less theatrical. | Scripts and config references. | Later. |
| `Executive Directors` | `core advisors` | Internal roles | High | Recommends rather than implies authority. | Existing docs. | Now in prose. |
| `Associate Directors` | `specialist advisors` | Internal roles | High | Clearer, less corporate. | Existing docs. | Now in prose. |
| `Taste Council` | `review panel` or `review session` | Internal review ritual | High | Less performative. | User requested Taste Council for this audit; can remain as temporary exercise. | Now for durable docs. |
| Persona short names (`Jobs`, `Cook`, etc.) | Role names (`Product Restraint Review`, etc.) | Agent display/roles | High | Avoids celebrity/persona architecture. | Existing `directors.yaml`. | Display docs now; config IDs later. |
| `AI leadership operating system` | `advisor system` or `review system` | Internal product description | High | Less inflated. | README rewrite. | Now in docs. |
| `governance model` | `decision rules` or `decision rights` | Internal docs | High | More direct. | Existing filenames and links. | Prose now; filename later. |
| `memory/` | `records/` or scoped `company-memory/` | Internal context | Medium | More operational. | AI tooling may expect `memory`. | Later. |
| `decision-log.md` | `decision-records.md` or `decisions/` | Internal records | Medium | Clearer artifact. | Scripts may write to file. | Later. |
| `event-log.md` | `event-records.md` | Internal records | Medium | More precise. | Scripts may append. | Later. |
| `active-initiatives.md` | keep | Internal operations | High | Clear enough. | None. | Do not rename now. |
| `FINDINGS.md` | `FINDINGS.md` | Audit doc | High | Avoids GitHub/Jira flavor. | Links in audit docs. | Good first rename after approval. |
| `CURRENT_STATE.md` | `CURRENT_STATE.md` | Audit doc | High | Removes Scrum language. | Links in docs. | Good first rename after approval. |
| `issue board` | `findings list` | Audit phrase | High | Describes audit artifact. | None. | Now in prose. |
| `tickets` | `findings`, `requests`, `work items`, or `risks` | Operating phrase | High | Meaning-specific and less Jira-coded. | Depends on context. | Now in prose. |
| `sprint` | `cycle`, `week`, or `pass` | Operating term | High | Less Scrum-coded. | Historical docs. | Now in active docs. |
| `epic` | `project`, `initiative`, or `goal` | Operating term | High | Less Agile-coded. | Historical references. | Now in active docs. |
| `backlog` | `queue`, `later`, or `candidate work` | Operating term | Medium | Clearer for non-PM users. | Engineering teams may expect backlog. | Restrict; do not global replace. |
| `ticket` | `request`, `task`, `finding`, `work item` | Operating term | High | More human. | Support imports. | Replace in active docs. |
| `board` | `workspace`, `task list`, or `view` | Product UI | Medium | Avoid Kanban association where not needed. | Tasks app has board-shaped UI and routes. | Restrict; do not break `/app/board` yet. |
| `kanban` | `task view` or omit | Product UI | High | Method language. | Comparison docs. | Replace in product copy. |
| `velocity` | `pace`, `work has slowed` | Product/brand copy | High | Wrong audience. | Historical critique docs. | Replace unless naming refused PM terms. |
| `SignalHQ` | `operations` or `company operations` | Internal surface/brand | Medium | `HQ` is crowded and vague. | Domain/route already exists. Legal risk. | Later; stop expanding public use now. |
| `operations/hq` | `operations/company` or `operations/process` | Structure | High | Avoid `hq` junk drawer. | Existing route names. | In proposal only. |
| `studio` folder | `studio-app` | App folder | Medium | Clarifies executable umbrella app. | Git/deploy identity. | Later. |
| `ds-foundation` | `foundation/design-system` | Shared code/docs | High | Clearer and less abbreviation-heavy. | Package/import paths. | Later. |
| `marketing-deck` | `brand/decks` | Brand docs | Medium | Clear home. | Research and deck material may need splitting. | Later. |
| `demo-film` | `assets/video/demo-film` | Video asset project | Medium | More durable asset location. | Build scripts. | Later. |
| `signal-review` | `reviews/signal-review` | Review tooling | Medium | Clearer home if review tool. | May be product/tool with extension scope. | Later after scope review. |
| `agent-skills` | `agents/skills` | Agent tooling | Medium | Fits agent structure. | Imported package references. | Later. |
| `banana-claude` | `agents/imported/banana-claude` | Imported tooling | High | Preserves provenance. | Upstream path assumptions. | Later. |
| `bencium-claude-code-design-skill` | `agents/imported/bencium-claude-code-design-skill` | Imported tooling | High | Preserves provenance. | Upstream path assumptions. | Later. |
| `ui-ux-pro-max-skill` | `agents/imported/ui-ux-pro-max-skill` | Imported tooling | High | Preserves provenance. | Upstream path assumptions. | Later. |

## Product Rename Details

### Roadmap -> Timeline

Rename now:

- Marketing copy.
- Product nav.
- Footer suite links.
- Brand docs.
- Product documentation titles.
- New screenshots/decks.

Do not rename yet:

- Repo folder.
- Package name.
- Routes.
- Database fields.
- API names.
- Env vars.
- Historical changelogs.

Allowed exceptions:

- `roadmap` can remain where it means strategic planning.
- Historical documents can preserve old terms with a note.

### Analytics -> Signal

Rename now only where the legal/commercial decision allows:

- Product copy that describes the briefing product.
- Footer suite links.
- Product docs.
- Demo narrative.

Do not rename blindly:

- Telemetry analytics.
- Metrics analytics.
- Vendor analytics.
- Technical `analytics` folders where the meaning is measurement.

Fallback options if `Signal` is not cleared:

| Candidate | Strength | Weakness |
|---|---|---|
| `Briefing` | Very clear. | Less brand-ownable. |
| `Insights` | Understandable. | SaaS-common. |
| `Attention` | Matches purpose. | Abstract as a product name. |
| `Daily Briefing` | Human and direct. | Narrower than product roadmap. |

## Agent System Rename Details

Current language has too much hierarchy:

- `Signal Directors`
- `Executive Directors`
- `Associate Directors`
- `Temporary Specialists`
- `governance model`
- `decision escalation flow`
- Persona names as durable role labels.

Proposed durable model:

```text
agents/
  advisors/
  reviewers/
  prompts/
  skills/
  evaluations/
  imported/
```

Stable object names:

- `agent_role`
- `advisor`
- `reviewer`
- `review_panel`
- `review_session`
- `review_output`
- `decision_record`
- `context_record`
- `workflow_definition`
- `workflow_run`

Migration rule:

- Human display labels can be friendly.
- Machine IDs must be functional and stable.
- Authority must be explicit.

## First 10 Recommended Renames

1. In active brand docs, replace `Roadmap` as product name with `Timeline`.
2. In active brand docs, replace `Analytics` as product name with `Signal` or hold pending legal decision.
3. Replace `CURRENT_STATE.md` with `CURRENT_STATE.md`.
4. Replace `FINDINGS.md` with `FINDINGS.md`.
5. Replace `issue board` with `findings list`.
6. Replace `tickets` in active audit prose with `findings`.
7. Rewrite `signal-directors/README.md` from `AI leadership operating system` to `internal advisor and review system`.
8. Replace `Executive Directors` with `core advisors` in durable docs.
9. Replace persona names in durable docs with functional review names.
10. Add `DO_NOT_RENAME.md` to prevent over-correction.

## Decision Records Required Before Action

Create decision records before:

- Any public house-mark change.
- Any `Signal` product-name expansion.
- Any repo/folder move.
- Any package-name change.
- Any route/domain change.
- Any Slack channel rename.
- Any agent config ID rename.

## Rollback Plan

For every rename:

1. Keep the old name searchable for one release cycle.
2. Add redirects or aliases where routes are affected.
3. Add a migration note in the affected README.
4. Update docs links in the same change.
5. Run tests/builds for affected repos.
6. Keep a reverse migration patch for high-risk Tier 3 and Tier 4 changes.

## What To Postpone

Postpone:

- Moving repos into `products/`.
- Renaming package names.
- Renaming Vercel projects.
- Renaming domains.
- Renaming environment variables.
- Renaming database tables/columns.
- Renaming agent config IDs.
- Renaming Slack channels.

Do these only after the lexicon is accepted, legal review is complete, and dependency maps exist.
