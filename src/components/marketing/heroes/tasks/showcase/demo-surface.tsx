"use client";

import { motion, AnimatePresence } from "motion/react";
import { useMemo } from "react";
import {
  LANES,
  LANE_ORDER,
  PRIORITY_LABEL,
  USERS,
  type LaneId,
  type Task,
} from "@/components/marketing/heroes/tasks/lib/data";
import { Avatar, AvatarStack } from "./avatar";
import { useMorphTransition } from "./use-reduced-motion";
import type { DemoState, ViewMode } from "./types";
// GALLERY EDIT 2026-07-27 — the board view now wears the product's own board
// stylesheets instead of a marketing lookalike. `room` and `shared` are the
// app's real CSS modules, vendored byte for byte from
// tasks/src/components/app/room/. `hero` holds the handful of documented
// deviations a hero needs. List and timeline views are untouched.
// `a` is the board the product actually ships today (hybrid option A): lanes
// divided by rules rather than tinted panels, a 38px sticky header carrying a
// status pip and a WIP budget, and 6px cards. `shared` supplies the card
// grammar (complete box, schedule, muted-wash avatars). `hero` holds the
// documented deviations, including the operator's column colours.
import a from "./board-a.module.css";
import shared from "./board-shared.module.css";
import hero from "./board-hero.module.css";

const TIMELINE_DAYS = 14;
const TIMELINE_DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S", "M", "T", "W", "T", "F", "S", "S"];
/** Today sits on Wednesday of week one, matching the board's "Today" chips. */
const TODAY_INDEX = 2;
/** The tray shows what has no dates yet — the state the Schedule view exists to clear. */
const UNSCHEDULED = ["Pack the welcome bags", "Approve the DJ playlist"];
/** Mirrors the shipped table's column set: Task carries the weight, the five
 *  attribute columns are even. Used by the head, the rows and the group rows
 *  from one constant so they cannot drift apart. */
const LIST_GRID_COLS = "minmax(0, 2.4fr) 0.9fr 0.9fr 1fr 0.9fr 0.75fr";

/**
 * The unified showcase surface. One set of cards (one per task) is
 * mounted at all times with a stable layoutId. Switching `view` changes
 * how the parent layouts its children; motion FLIPs each card from its
 * previous geometry to its new geometry over MORPH_DURATION_S.
 *
 * Wrapper chrome (column backgrounds, list table header, timeline grid)
 * lives in `<ViewWrappers/>`, which cross-fades on the trail of the
 * card geometry tween.
 */
export function DemoSurface({
  state,
  cardRefs,
}: {
  state: DemoState;
  cardRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
}) {
  const transitions = useMorphTransition();
  const view = state.view;

  // Sort once for timeline view, keeps stable card-row index per task
  const orderedTasks = useMemo(() => {
    if (view !== "timeline") return state.tasks;
    return [...state.tasks].sort(
      (a, b) => (a.startDay ?? 0) - (b.startDay ?? 0),
    );
  }, [state.tasks, view]);

  // Live per-lane counts for the board chrome's count chips.
  const laneCounts = useMemo(() => {
    const counts = { todo: 0, doing: 0, review: 0, done: 0 } as Record<
      LaneId,
      number
    >;
    for (const t of state.tasks) counts[t.lane]++;
    return counts;
  }, [state.tasks]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <ViewWrappers view={view} transitions={transitions} laneCounts={laneCounts} />
      <CardLayer
        view={view}
        tasks={orderedTasks}
        state={state}
        cardRefs={cardRefs}
        transitions={transitions}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Chrome, fades on the trailing 280ms tail of the geometry tween
   ───────────────────────────────────────────────────────────────────── */

function ViewWrappers({
  view,
  transitions,
  laneCounts,
}: {
  view: ViewMode;
  transitions: ReturnType<typeof useMorphTransition>;
  laneCounts: Record<LaneId, number>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0">
      <AnimatePresence>
        {view === "board" ? (
          <motion.div
            key="board-chrome"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: transitions.bodyOut }}
            transition={transitions.chrome}
            className="absolute inset-0"
          >
            <BoardChrome laneCounts={laneCounts} />
          </motion.div>
        ) : null}
        {view === "list" ? (
          <motion.div
            key="list-chrome"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: transitions.bodyOut }}
            transition={transitions.chrome}
            className="absolute inset-0"
          >
            <ListChrome />
          </motion.div>
        ) : null}
        {view === "timeline" ? (
          <motion.div
            key="timeline-chrome"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: transitions.bodyOut }}
            transition={transitions.chrome}
            className="absolute inset-0"
          >
            <TimelineChrome transitions={transitions} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function BoardChrome({ laneCounts }: { laneCounts: Record<LaneId, number> }) {
  // NOTE: no `data-lane` here, those attributes live on the card-layer
  // columns (single source of truth so cursor / drop math doesn't see
  // duplicates from `document.querySelector`).
  // The lanes wear the product's own soft palette (--lane-* tokens, the
  // board's chrome since cycle 2): desaturated washes that let the white
  // cards, priority marks, and presence colours do the talking. Each
  // header carries its lane dot, its name in the lane ink, and a live
  // count that ticks over as cards land.
  return (
    <div className={`${a.boardScroll} ${hero.scroll}`}>
      {LANE_ORDER.map((laneId) => (
        <div
          key={laneId}
          className={`${a.boardLane} ${hero.lane}`}
          // GALLERY EDIT 2026-07-27 — `data-lane-tone`, NOT `data-lane`.
          // `data-lane` belongs to the card-layer columns alone: the scene
          // runner locates drop targets with document.querySelector, and a
          // second element carrying the same attribute wins on DOM order and
          // hands back the chrome lane instead. That returns a rect including
          // the 38px header, so every carried card was aimed at the wrong
          // place. The colour hooks use their own attribute so the two
          // concerns can never collide again.
          data-lane-tone={laneId}
          data-done={laneId === "done" || undefined}
        >
          <header className={`${a.laneHeader} ${hero.laneHeader}`}>
            <div>
              <span
                className={`${a.statusPip} ${hero.pip}`}
                aria-hidden="true"
              />
              <h2>{LANES[laneId].name}</h2>
              <LaneCount value={laneCounts[laneId]} />
            </div>
            <span className={a.wipCount}>
              WIP {laneCounts[laneId]}/{WIP_CAP[laneId]}
            </span>
          </header>

          {/* Cards are painted by the floating layer above, so the lane body
              is only the space they land in. */}
          <div className={hero.laneBody} aria-hidden="true" />

          <span className={a.laneAdd}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add task
          </span>
        </div>
      ))}
    </div>
  );
}

/** One colour per lane, shared by the board pip, the board wash and the list
 *  status dot, so a lane means the same colour wherever it appears. */
const LANE_TONE: Record<LaneId, string> = {
  todo: "var(--status-blocked)",
  doing: "var(--accent)",
  review: "var(--status-flight)",
  done: "var(--status-done)",
};

/** The board shows a work-in-progress budget per lane, as the product does. */
const WIP_CAP: Record<LaneId, number> = {
  todo: 6,
  doing: 5,
  review: 4,
  done: 12,
};

/** The lane's live count: the digit flips over when a card lands. */
function LaneCount({ value }: { value: number }) {
  return (
    <span className={`${a.laneCount} ${hero.laneCount}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 7, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -7, opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * GALLERY EDIT 2026-07-27 — list view rebuilt against the shipped list.
 *
 * The product renders a real <table>: a 34px sticky head in 8px uppercase,
 * per-column rules, 36px rows at 9px, and Task · Status · Owner · Dates ·
 * Priority · Estimate. The demo had a rounded white panel with five mono
 * headings and no column rules, which read like a marketing table.
 *
 * It stays divs rather than becoming a real table because every row here is a
 * card that morphs in from the board on a shared layoutId, and a <tr> cannot
 * be that element. The grid reproduces the table's geometry exactly instead.
 */
const LIST_COLUMNS = ["Task", "Status", "Owner", "Dates", "Priority", "Estimate"];

function ColumnGlyph() {
  return (
    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="9" y1="4" x2="9" y2="20" />
    </svg>
  );
}

function ListChrome() {
  return (
    <div className={hero.listHead} style={{ gridTemplateColumns: LIST_GRID_COLS }}>
      {LIST_COLUMNS.map((label) => (
        <span key={label}>
          <ColumnGlyph />
          {label}
        </span>
      ))}
    </div>
  );
}

/**
 * The Schedule view chrome.
 *
 * REBUILT 2026-07-28 against the shipped Schedule (hybrid option A). The
 * previous version was a 14-column bar chart in a rounded white card, which
 * matched nothing in the product: no toolbar, no unscheduled tray, no date
 * header, no today line in the app's own idiom. Every class below is the
 * product's own, vendored in `board-a.module.css`.
 *
 * The app's own Schedule opens empty ("No scheduled work") on a fresh
 * workspace. A hero has to show the populated state, so this renders the same
 * chrome with real ranges on the grid — the screen you get once work has
 * dates, not the one you get before.
 */
function TimelineChrome({
  transitions,
}: {
  transitions: ReturnType<typeof useMorphTransition>;
}) {
  return (
    <div className={`${a.timelineSurface} ${hero.scheduleSurface}`}>
      <div className={a.timelineToolbar}>
        <span className={a.rangeNavigation}>
          <span>‹</span>
          <span>Fit</span>
          <span>›</span>
        </span>
        <strong>1 Jun 2026 · 14 Jun 2026</strong>
        <span className={a.zoomControl}>
          <span>Day</span>
          <span aria-pressed="true">Week</span>
          <span>Month</span>
        </span>
      </div>

      <div className={a.unscheduledTray}>
        <header>
          <div>
            <strong>Unscheduled</strong>
            <span>2</span>
          </div>
          <small>Drag a task onto any date, or focus it for date controls.</small>
        </header>
        <div className={a.unscheduledItems}>
          {UNSCHEDULED.map((title) => (
            <div className={a.unscheduledItem} key={title}>
              <input checked={false} readOnly tabIndex={-1} type="checkbox" />
              <i />
              <button tabIndex={-1} type="button">{title}</button>
              <button tabIndex={-1} type="button">Schedule</button>
            </div>
          ))}
        </div>
      </div>

      <div className={`${a.timelineScroller} ${hero.scheduleScroller}`}>
        <div className={`${a.timelineCanvas} ${hero.scheduleCanvas}`}>
          <div className={a.timelineHeaderRow}>
            <div className={a.timelinePaneHeader}>
              <span>Task</span>
              <span>12</span>
            </div>
            <div
              className={a.timelineDateHeader}
              style={{ gridTemplateColumns: `repeat(${TIMELINE_DAYS}, 1fr)` }}
            >
              {TIMELINE_DAY_LABELS.map((d, i) => (
                <div
                  className={a.timelineDate}
                  data-today={i === TODAY_INDEX ? "true" : undefined}
                  key={i}
                >
                  {d}
                  <b>{i + 1}</b>
                </div>
              ))}
            </div>
          </div>
          <motion.div
            className={hero.scheduleBody}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: transitions.bodyIn }}
          />
        </div>
      </div>
    </div>
  );
}

function CardLayer({
  view,
  tasks,
  state,
  cardRefs,
  transitions,
}: {
  view: ViewMode;
  tasks: Task[];
  state: DemoState;
  cardRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  transitions: ReturnType<typeof useMorphTransition>;
}) {
  if (view === "board") {
    // Mirrors BoardChrome's grid exactly (gap, padding, panel inset) so
    // the cards sit inside the lane panels painted behind them. Both sides
    // now use the same two classes, so the two grids cannot drift apart.
    return (
      <div className={`relative ${a.boardScroll} ${hero.scroll}`}>
        {LANE_ORDER.map((laneId) => (
          <BoardLaneCardColumn
            key={laneId}
            laneId={laneId}
            tasks={tasks.filter((t) => t.lane === laneId)}
            state={state}
            cardRefs={cardRefs}
            transitions={transitions}
          />
        ))}
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className={hero.listBody}>
        <div>
          {/* Spacer matching the sticky list head rendered by the chrome. */}
          <div className="h-[34px]" aria-hidden />
          {LANE_ORDER.map((laneId) => {
            const laneTasks = tasks.filter((t) => t.lane === laneId);
            if (laneTasks.length === 0) return null;
            const done = laneTasks.filter((t) => t.lane === "done").length;
            return (
              <div key={laneId} data-lane={laneId}>
                {/* Group row, matching the product's: name, task count and a
                    complete receipt on the left, Add task on the right. */}
                <div className={hero.listGroup} data-lane-tone={laneId}>
                  <span
                    className={hero.listDot}
                    style={{ background: LANE_TONE[laneId] }}
                    aria-hidden
                  />
                  <strong>{LANES[laneId].name}</strong>
                  <span>
                    {laneTasks.length} {laneTasks.length === 1 ? "task" : "tasks"}
                  </span>
                  <span>
                    {done}/{laneTasks.length} complete
                  </span>
                  <em>Add task</em>
                </div>
                <div>
                  {laneTasks.map((task) => (
                    <MorphCard
                      key={task.id}
                      task={task}
                      view="list"
                      state={state}
                      cardRefs={cardRefs}
                      transitions={transitions}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Schedule: one product row per task — a sticky task pane on the left and
  // a geometry track on the right that the morphing bar positions into.
  return (
    <div className={`${a.timelineScroller} ${hero.scheduleScroller}`}>
      <div className={`${a.timelineCanvas} ${hero.scheduleCanvas}`}>
        {/* Clears the sticky header painted by the chrome beneath. */}
        <div className={hero.scheduleHeadSpacer} aria-hidden />
        {tasks.map((task) => (
          <div className={a.timelineRow} key={task.id}>
            <div className={a.timelineTaskPane}>
              <input
                checked={task.lane === "done"}
                readOnly
                tabIndex={-1}
                type="checkbox"
              />
              <i />
              <span className={a.timelineTaskCopy}>
                <button tabIndex={-1} type="button">{task.title}</button>
              </span>
              <AvatarStack users={task.assignees} size={18} />
            </div>
            <div className={a.timelineGeometry} data-timeline-track>
              <div
                className={a.timelineGrid}
                style={{ gridTemplateColumns: `repeat(${TIMELINE_DAYS}, 1fr)` }}
              >
                {TIMELINE_DAY_LABELS.map((d, i) => (
                  <span data-weekend={d === "S" ? "true" : undefined} key={i} />
                ))}
              </div>
              <span
                className={a.todayLine}
                style={{ left: `${((TODAY_INDEX + 1) / TIMELINE_DAYS) * 100}%` }}
              />
              <MorphCard
                task={task}
                view="timeline"
                state={state}
                cardRefs={cardRefs}
                transitions={transitions}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoardLaneCardColumn({
  laneId,
  tasks,
  state,
  cardRefs,
  transitions,
}: {
  laneId: LaneId;
  tasks: Task[];
  state: DemoState;
  cardRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  transitions: ReturnType<typeof useMorphTransition>;
}) {
  return (
    <div data-lane={laneId} className={hero.cardColumn}>
      {/* Invisible coordinate anchor, the carry scene's celebration
          burst measures `[data-lane-header]` to position particles. We
          want the same y as the chrome's lane header, which the column's
          top padding clears. */}
      {/* Absolute, not relative: as a flex child it earned a 9px column gap
          of its own and pushed every first card down off the lane header. */}
      <span
        data-lane-header
        aria-hidden
        className="pointer-events-none block h-0 w-full"
        style={{ position: "absolute", top: 20, left: 0, right: 0 }}
      />
      {tasks.map((task) => (
        <MorphCard
          key={task.id}
          task={task}
          view="board"
          state={state}
          cardRefs={cardRefs}
          transitions={transitions}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   The morphing card, single mount, body cross-fades on a hole
   ───────────────────────────────────────────────────────────────────── */

function MorphCard({
  task,
  view,
  state,
  cardRefs,
  transitions,
}: {
  task: Task;
  view: ViewMode;
  state: DemoState;
  cardRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  transitions: ReturnType<typeof useMorphTransition>;
}) {
  const isPicked = state.pickedTaskId === task.id;
  // The moving card carries its carrier's presence colour (--user-*
  // tokens): the ring answers "who has this", which is the information.
  const pickedColor =
    isPicked && state.pickedBy ? USERS[state.pickedBy].color : null;
  const isDep =
    !!state.dependencyHighlight &&
    (state.dependencyHighlight[0] === task.id ||
      state.dependencyHighlight[1] === task.id);
  const showThread = state.openCommentTaskId === task.id;

  // For timeline, we use a row container approach instead of absolute
  // positioning so that the FLIP can interpolate cleanly. Each card sits
  // in a 44px-tall row and uses padding-left to push to its startDay.

  const transitionConfig = {
    layout: transitions.layout,
  };

  return (
    <motion.div
      ref={(el) => {
        if (el) cardRefs.current.set(task.id, el);
        else cardRefs.current.delete(task.id);
      }}
      data-task-id={task.id}
      layoutId={`task-${task.id}`}
      layout
      transition={transitionConfig}
      whileHover={view === "board" ? { y: -1.5 } : undefined}
      className={[
        "relative cursor-grab select-none border bg-white text-ink",
        // Board cards are the product's own: border-based elevation, 8px
        // radius, 10px padding. The old marketing card leaned on layered
        // shadows and a 10px radius, which read softer than the real board.
        view === "board" && `${a.boardCard} ${hero.card}`,
        view === "list" && `grid items-center ${hero.listRow}`,
        view === "timeline" && `${a.timelineRange} ${hero.scheduleRange}`,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...(view === "list" ? { gridTemplateColumns: LIST_GRID_COLS } : {}),
        ...(view === "timeline" ? timelineRowStyle(task) : {}),
        borderColor: isDep
          ? "var(--brand)"
          : pickedColor
            ? pickedColor
            : view === "list"
              ? undefined
              : view === "board"
                ? "var(--x-task-border)"
                : undefined,
        boxShadow: pickedColor
          ? `0 0 0 1.5px ${pickedColor}, 0 1px 2px rgba(20,21,26,0.05)`
          : undefined,
        // Schedule bars are styled entirely by the product's own
        // .timelineRange; only the board and list need per-view surfaces.
        background: view === "timeline" ? undefined : "var(--paper)",
        color: view === "timeline" ? undefined : "var(--ink)",
        opacity: isPicked ? 0 : 1,
      }}
    >
      <CardBody
        task={task}
        view={view}
        showThread={showThread}
        staticComment={state.staticComment}
        typingUser={showThread ? state.typingFromUser : null}
        postedComment={showThread ? state.postedComment : null}
        pickedColor={pickedColor}
        transitions={transitions}
      />
    </motion.div>
  );
}

function timelineRowStyle(task: Task): React.CSSProperties {
  const start = task.startDay ?? 0;
  const dur = task.durationDays ?? 1;
  const leftPct = (start / TIMELINE_DAYS) * 100;
  const widthPct = (dur / TIMELINE_DAYS) * 100;
  // The bar lives inside a `data-timeline-track` parent that already
  // excludes the 200px gutter. Pure percentages compose cleanly.
  return {
    position: "absolute",
    top: 6,
    left: `calc(${leftPct}% + 3px)`,
    width: `calc(${widthPct}% - 6px)`,
    height: 27,
  };
}

/* ─────────────────────────────────────────────────────────────────────
   Card body, variant-specific, with cross-fade hole
   ───────────────────────────────────────────────────────────────────── */

function CardBody({
  task,
  view,
  showThread,
  staticComment,
  typingUser,
  postedComment,
  pickedColor,
  transitions,
}: {
  task: Task;
  view: ViewMode;
  showThread: boolean;
  staticComment: string;
  typingUser: string | null;
  postedComment: { user: string; text: string } | null;
  pickedColor: string | null;
  transitions: ReturnType<typeof useMorphTransition>;
}) {
  // The "soul", title + lead avatar, is always rendered, and its
  // opacity stays at 1 across the morph. Variant-specific chrome is
  // wrapped in AnimatePresence with the cross-fade hole.
  return (
    <>
      {/* SOUL: title + lead avatar, always visible */}
      <SoulRow task={task} view={view} />

      {/* VARIANT BODY, overlapping fade with a 120ms hole.
          Default mode (no `wait`/`popLayout`) lets exit + enter overlap;
          enter has a 280ms delay so the visible result is:
          0–160ms outgoing fade out · 120ms hole · 280–520ms incoming
          fade in · then geometry settles alone for the last 200ms.
          Timeline rides on the soul-only render (no body branch). */}
      <AnimatePresence>
        {view === "board" ? (
          <motion.div
            key="b"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: transitions.bodyIn }}
            exit={{ opacity: 0, transition: transitions.bodyOut }}
            className="contents"
          >
            <BoardBody task={task} />
          </motion.div>
        ) : null}
        {view === "list" ? (
          <motion.div
            key="l"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: transitions.bodyIn }}
            exit={{ opacity: 0, transition: transitions.bodyOut }}
            className="contents"
          >
            <ListCells task={task} />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Inline comment thread, board only */}
      {view === "board" && showThread ? (
        <CommentThread
          staticComment={staticComment}
          typingUser={typingUser}
          postedComment={postedComment}
        />
      ) : null}

      {pickedColor ? (
        <span
          className="absolute -right-1 -top-1.5 rounded-full px-1.5 py-px text-[9px] font-semibold uppercase tracking-wider text-white shadow-md"
          style={{ background: pickedColor }}
        >
          editing
        </span>
      ) : null}
    </>
  );
}

function SoulRow({ task, view }: { task: Task; view: ViewMode }) {
  if (view === "timeline") {
    const days = task.durationDays ?? 1;
    return (
      <span className={a.timelineRangeButton}>
        <span>{task.title}</span>
        <small>{days}d</small>
      </span>
    );
  }

  if (view === "list") {
    return null; // list lays out title in ListCells via grid
  }

  // Board card opens on the product's topline: complete box, spacer, then the
  // subtask marker. The title sits under it, not beside it. That vertical
  // order is the clearest tell that this is the real board.
  return (
    <>
      <div className={a.cardTopline}>
        <input
          aria-label={`Complete ${task.title}`}
          checked={task.lane === "done"}
          className={shared.selectionBox}
          readOnly
          tabIndex={-1}
          type="checkbox"
        />
        <span className={a.cardSpacer} />
        <span className={hero.cardGlyph} aria-hidden="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1.6" />
            <rect x="14" y="3" width="7" height="7" rx="1.6" />
            <rect x="3" y="14" width="7" height="7" rx="1.6" />
            <rect x="14" y="14" width="7" height="7" rx="1.6" />
          </svg>
        </span>
      </div>
      <span className={a.boardTitle}>{task.title}</span>
    </>
  );
}

/**
 * Board card body, in the app's order: labels → schedule row → footer.
 *
 * The old version collapsed all of it into one meta strip. The real card
 * separates them, and the rule above the schedule row is a large part of why
 * the product's board reads as denser and more organised than the hero's did.
 */
function BoardBody({ task }: { task: Task }) {
  const dueSoon = task.due === "Today" || task.due === "Tomorrow";
  const tags = (task.tags ?? []).slice(0, 2);
  const showPriority = task.priority === "p0" || task.priority === "p1";

  return (
    <>
      {tags.length > 0 || showPriority ? (
        <div className={`${a.cardLabels} ${hero.labels}`}>
          {tags.length > 0 ? (
            <span className={shared.labels}>
              {tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </span>
          ) : null}
          {showPriority ? (
            <span
              className={shared.priority}
              data-priority={task.priority === "p0" ? "urgent" : "high"}
              title={`${PRIORITY_LABEL[task.priority].label} priority`}
            >
              <span className={shared.priorityDot} />
              {task.priority.toUpperCase()}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className={a.cardSchedule}>
        <span
          className={shared.schedule}
          data-overdue={dueSoon || undefined}
          data-unscheduled={!task.due || undefined}
          title={task.due ?? "No date"}
        >
          {task.due ?? "No date"}
        </span>
        {/* 24px is the product's own avatar size. At 20 the initials fell to
            8px, which is where two capitals stop being readable. */}
        <AvatarStack users={task.assignees} size={24} />
      </div>

      {task.comments || task.idleDays ? (
        <footer>
          <span className={shared.signals}>
            {task.comments ? (
              <span title={`${task.comments} comments`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                {task.comments}
              </span>
            ) : null}
            {task.idleDays ? (
              <span title={`Idle ${task.idleDays} days`}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" strokeLinecap="round" />
                </svg>
                {task.idleDays}d
              </span>
            ) : null}
          </span>
        </footer>
      ) : null}
    </>
  );
}

/**
 * Row cells in the shipped list's order and register: Task · Status · Owner ·
 * Dates · Priority · Estimate. Attribute cells are quiet 9px text with a
 * chevron on Status, matching the product, rather than the coloured chips the
 * demo used. Colour in a list belongs to the status dot alone.
 */
function ListCells({ task }: { task: Task }) {
  const status = LANE_TONE[task.lane];
  const prio = PRIORITY_LABEL[task.priority];
  const hot = task.priority === "p0" || task.priority === "p1";
  return (
    <>
      <div className={hero.listTitleCell}>
        <input
          aria-label={`Complete ${task.title}`}
          checked={task.lane === "done"}
          className={shared.selectionBox}
          readOnly
          tabIndex={-1}
          type="checkbox"
        />
        <span className={hero.listDot} style={{ background: status }} aria-hidden />
        <span className={hero.listTitle}>{task.title}</span>
      </div>

      <span className={hero.listCell}>
        {LANES[task.lane].name}
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>

      <span className={hero.listCell}>
        {task.assignees.length > 0 ? (
          <AvatarStack users={task.assignees} size={18} />
        ) : (
          <span className={hero.listMuted}>Unassigned</span>
        )}
      </span>

      <span className={hero.listCell}>
        {task.due ?? <span className={hero.listMuted}>Unscheduled</span>}
      </span>

      <span className={hero.listCell}>
        <span
          className={hero.listDot}
          style={{ background: hot ? prio.color : "var(--x-task-border-strong)" }}
          aria-hidden
        />
        {prio.label}
      </span>

      <span className={hero.listCell}>
        {task.estimate ? `${task.estimate}h` : <span className={hero.listMuted}>Not set</span>}
      </span>
    </>
  );
}

function CommentThread({
  staticComment,
  typingUser,
  postedComment,
}: {
  staticComment: string;
  typingUser: string | null;
  postedComment: { user: string; text: string } | null;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mt-3 space-y-2 overflow-hidden border-t border-line-soft pt-2.5"
    >
      <div className="flex items-start gap-2">
        <Avatar user="alex" size={20} />
        <div className="text-[11.5px] leading-relaxed text-ink-soft">
          <span className="font-medium text-ink">Alex</span> · 2h ago
          <p>{staticComment}</p>
        </div>
      </div>

      {postedComment ? (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2"
        >
          <Avatar user={postedComment.user as keyof typeof USERS} size={20} />
          <div className="text-[11.5px] leading-relaxed text-ink-soft">
            <span className="font-medium text-ink">
              {USERS[postedComment.user as keyof typeof USERS].name}
            </span>{" "}
            · just now
            <p>{postedComment.text}</p>
          </div>
        </motion.div>
      ) : null}

      {typingUser ? (
        <div className="flex items-start gap-2">
          <Avatar user={typingUser as keyof typeof USERS} size={20} />
          <div className="flex-1 text-[11.5px] leading-relaxed text-ink-soft">
            <span className="font-medium text-ink">
              {USERS[typingUser as keyof typeof USERS].name}
            </span>
            <span className="ml-1 text-ink-quiet">is typing…</span>
            <div className="mt-1 inline-flex gap-1">
              <span className="block h-1 w-1 animate-pulse rounded-full bg-ink-quiet [animation-delay:0ms]" />
              <span className="block h-1 w-1 animate-pulse rounded-full bg-ink-quiet [animation-delay:160ms]" />
              <span className="block h-1 w-1 animate-pulse rounded-full bg-ink-quiet [animation-delay:320ms]" />
            </div>
          </div>
        </div>
      ) : null}
    </motion.div>
  );
}
