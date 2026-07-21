# RESEARCH — competitor interaction patterns

Researched 2026-07-21. Sources marked **[verified]** were fetched from official docs on that date; entries marked **[kb]** come from model knowledge (cutoff ~Jan 2026) and MUST be verified before being load-bearing for a design decision (open follow-up, Phase 3/4 entry). Do not treat [kb] specifics as ground truth.

## Verified sources (2026-07-21)
- Linear peek: https://linear.app/docs/peek — Space opens a Quicklook-style preview; hold-vs-tap semantics; ↑/↓ moves preview across adjacent issues.
- Linear selection/menus: https://linear.app/docs/select-issues — x to select, shift-ranges, Cmd/Ctrl-A after filtering; right-click on selection opens contextual menu; Cmd/Ctrl-K acts on the selection as a searchable action surface; bottom bulk-action toolbar.
- Linear conceptual model: https://linear.app/docs/conceptual-model — issues → projects (milestones inside) → initiatives; views are lenses, not data.
- Linear project overview: https://linear.app/docs/project-overview — summary + document-like description; resources (labelled links + docs); milestones list; progress graph with scope/velocity/prediction; properties sidebar via Cmd/Ctrl-I.
- ClickUp task view 3.0 (help.clickup.com) returned 403; Notion peek help pages 404ed under both hostnames tried. Recorded as fetch failures, not absence of the features.

## Track A — contextual actions
| Dimension | Linear [verified] | ClickUp [kb] | Notion [kb] | Figma [kb] | Raycast [kb] |
|---|---|---|---|---|---|
| Right-click | Contextual menu on selection anywhere in list/board | Row/card menus; right-click present but ••• is primary | Block handle menu + right-click on rows | Canvas right-click is core, layer-aware | n/a (keyboard product) |
| Visible parity | ••• menus mirror right-click | ••• everywhere | ••• / drag-handle | Toolbar + menus mirror most actions | Actions panel (Cmd-K) IS the menu |
| Command-menu on selection | Cmd/Ctrl-K acts on selected issues, searchable | Cmd/Ctrl-K nav-centric | Cmd/Ctrl-P nav; slash for insert | Quick actions (Cmd-/) | The product model |
| Multi-select | x / shift-range / Cmd-A; bottom bulk bar | Checkbox multi-select + bulk toolbar | Row multi-select, limited bulk | Shift/marquee selection | List multi via holding modifiers |
| Destructive separation | Delete grouped low with confirm | Delete behind confirm/trash | Trash with restore | Delete undoable | Destructive actions styled red, bottom |
| Shortcut hints inline | Yes, throughout | Partial | Partial | Yes | Yes, and searchable |
| Editable-text right-click | Native browser menu preserved in editors | Mostly native | Custom in editor (own selection model) | Custom (canvas) | n/a |

## Track B — task/issue detail
- Linear [verified peek + kb full view]: peek (Space) for glance; full issue view = main column (title, description, sub-issues, activity+comments) + right properties sidebar; breadcrumb to team/project; j/k moves between issues; stable short URLs (TEAM-123). System events collapse/filter in the activity feed.
- ClickUp [kb]: task modal over list with expand-to-full-page; two-pane (content | metadata); subtasks inline with own statuses; attachments grid; activity tab with filters; deep links per task.
- Notion [kb]: database items open side peek / center peek / full page (user- and context-selectable, per-database default); properties on top of page body; comments inline + page-level; every item is a page (deep link).
- Figma [kb]: comments as canvas pins with a thread rail; deep links to comment/frame.
- Pattern worth keeping: peek-for-glance + full-for-work, one composition, stable URL, properties visually subordinate to title/description, filtered activity.

## Track C — projects
- Linear [verified]: overview = summary + rich description treated as a document; explicit Resources; milestones with target dates; auto progress graph + prediction; properties (lead, dates, status) in sidebar; health/updates exist as status posts [kb detail].
- ClickUp [kb]: folders/lists with dashboards; manual rollups; noisier density.
- Notion [kb]: projects are templated databases; progress via formula/rollup; flexible, no opinionated health.
- Takeaway: Linear's declared-status (lead-authored update + health colour) vs computed-progress (issue counts) separation is exactly the distinction the brief mandates (project status ≠ task progress).

## Principles adopted for Signal Studio (with evidence)
1. Selection is a first-class object; every context surface (right-click, •••, Cmd-K, bulk bar) reads from ONE action registry (Linear).
2. Peek and full view are shells over one composition, never two implementations (Linear peek/full, Notion peeks).
3. Stable, human-readable deep link for every unit of work (Linear identifiers).
4. Properties sidebar is subordinate: title + brief own the eye, metadata scans in a quiet rail (Linear).
5. Activity feed separates human comments from system events with a filter, and collapses low-value events (Linear).
6. Project overview reads like a document with live data embedded, not a form (Linear overview).
7. Declared health/status and computed progress are visually distinct (Linear).
8. Keyboard: j/k adjacency, x selection grammar, menu key opens context actions on focus (Linear).
9. Destructive actions grouped last, separated, never adjacent to frequent actions (all).
10. Shortcut hints ride the menus — the menu teaches the shortcut (Linear/Raycast).
11. Editable text keeps the native browser menu (Linear).
12. Bulk actions surface in a persistent bar when selection >1, not only in hidden menus (Linear).

## Anti-patterns to avoid
1. Right-click as the only route (violates discoverability; brief §10.4).
2. ClickUp-style feature-dense metadata walls in the detail view.
3. Notion-style infinite flexibility where opinionated defaults serve better (our users get a designed hierarchy, not a database builder).
4. Fake-cursor collaboration theatre in marketing motion.
5. A second activity system or duplicated task management inside Marketing (brief §13.3).

## Open verification follow-ups
- [ ] ClickUp task view 3.0 current layout (fetch blocked 403) — before Phase 3 IA freeze.
- [ ] Notion peek modes current behaviour (404s) — before Phase 3.
- [ ] Linear project health/updates current mechanics — before Phase 4 Projects build.
- [ ] Raycast action-panel grouping/search details — before Phase 3 menu build.
