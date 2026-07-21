# Task-detail design explorations — Phase 0 evaluation

Three credible models evaluated against the shipped architecture (soft-nav `?task=` panel, `task-detail-panel.tsx`, hybrid board grammar). Coded lab variants are the first Phase 3 work item; this document records the paper evaluation that Phase 0 requires and the hypothesis Phase 3 must confirm or overturn by side-by-side comparison (lab-parity standard: the build is the spec).

## A — Context-preserving side sheet (enhanced current panel)
Fixed-width premium sheet over the board, `?task=` param, escape/scrim close.
- Board context: excellent. Deep link: works today (param), but a param is a weaker "place" than a route for sharing/SEO-free app links.
- Large descriptions/comments: cramped; a wedding-brief-length description forces internal scrolling next to a live board — divided attention.
- Small laptops: panel + 5-column board compete; panel wins only by overlaying, which defeats context retention.
- Keyboard: j/k adjacent-task nav natural. Perceived speed: instant (no route transition). Implementation risk: lowest — it exists.
- Verdict: right for triage, insufficient as the *authoritative centre of a unit of work* the mission demands.

## B — Immersive full-page task view
Route `/app/task/[id]`, board left behind.
- Long-form work: excellent hierarchy, breathing room, activity + comments get real estate.
- Board context: lost; closing must restore board scroll/selection — a soft-nav return is rebuildable but every open/close is a navigation. Rapid triage (open 8 cards in a minute) feels heavy.
- Deep link: first-class. Mobile: naturally correct. Implementation risk: medium (new route, layout, return-state restoration).
- Verdict: right for substantial tasks, wrong as the only mode.

## C — Hybrid: resizable panel + explicit expand-to-focus (RECOMMENDED, D-003)
Panel (resizable, min ~420px, remembered width) for board work; an explicit expand control and keyboard shortcut promote to `/app/task/[id]` focus mode; the route renders standalone on direct load; mobile = full-screen sheet.
- Covers both jobs; matches Linear's peek→full pattern and Notion's side-peek→full-page pattern (RESEARCH.md) without imitating either's chrome.
- One `TaskDetail` composition renders in both shells → no duplicated IA, cheap reversal.
- Deep link: the route is canonical; the param remains the board's fast path. Copy-link always copies the route.
- Risks: two shells must not drift (single composition + visual regression fixtures); resizable panel needs layout-stability care (no CLS on the board); focus restoration on close from either shell.
- Perceived speed: panel instant; focus mode is a soft-nav within the app layout.

## Evaluation matrix (5 = strong)
| Criterion | A sheet | B page | C hybrid |
|---|---|---|---|
| Board context retention | 5 | 1 | 5 |
| Deep-link quality | 3 | 5 | 5 |
| Long descriptions/brief | 2 | 5 | 5 |
| Subtasks + resources + activity density | 3 | 5 | 4 |
| Small-laptop behaviour | 2 | 4 | 4 |
| Mobile | 3 | 5 | 5 |
| Keyboard workflows | 4 | 3 | 5 |
| Perceived speed (triage) | 5 | 2 | 5 |
| Implementation risk | 5 | 3 | 3 |
| Total | 32 | 33 | **41** |

## Phase 3 entry checklist
1. Build the C shells as a lab route with demo fixtures; side-by-side against the shipped board before porting (founder's parity standard).
2. Confirm resizable-panel performance on the 5-column board at 1280px.
3. Decide expand affordance placement in the panel header (with close + ••• per brief §10.1).
4. Return-state test: open from board → focus → back restores scroll + selection.
