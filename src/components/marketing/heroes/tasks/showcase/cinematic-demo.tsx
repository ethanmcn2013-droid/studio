"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, LayoutGroup, useReducedMotion } from "motion/react";
import { EASE_OUT_EXPO, MOTION_BASE, MOTION_MODERATE } from "@/components/marketing/heroes/tasks/lib/motion";
import { SEED_TASKS, type Task, type UserId } from "@/components/marketing/heroes/tasks/lib/data";
import { useHydrated } from "@/components/marketing/heroes/tasks/lib/use-hydrated";
import {
  DOMAINS,
  buildDomainSeed,
  shorten,
  type DomainId,
} from "@/components/marketing/heroes/tasks/lib/domains";
import { DemoSurface } from "./demo-surface";
import { CursorsLayer } from "./cursors-layer";
import { GhostCard } from "./ghost-card";
import { Celebration } from "./celebration";
import { Avatar } from "./avatar";
import type { DemoState, ViewMode } from "./types";

/**
 * GALLERY EDIT 2026-07-27 — hero tempo.
 *
 * The scene was authored for a dense board where several things could be read
 * at a glance. The hero board is now sparse and its type is smaller, so the
 * same cadence gave the eye no time to find what had changed before it changed
 * again. Every beat is scaled from this one constant rather than by retuning
 * thirty-odd literals, which keeps the internal rhythm of the scene exactly as
 * composed and makes the pacing a single number to tune.
 */
const TEMPO = 1.55;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const initialCursor = (x: number, y: number) => ({
  x,
  y,
  visible: false,
  grabbing: false,
  reading: false,
  justArrived: false,
});

function makeId() {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * GALLERY EDIT 2026-07-27 — hero board density.
 *
 * The demo seeded four and five cards per lane, which forced the surface to
 * 780px and still overflowed. A real Signal Tasks board is far sparser: the
 * operator's own workspace runs one to three cards a column. Five was the
 * demo's invention, not the product's, so the hero drops to three a lane.
 *
 * The board reads faster, the surface comes back to a hero-sized height, and
 * every lane stays whole with no scrolling. The four ids the scripted scene
 * drives (t-101 carried across lanes, t-201 and t-202 edited, t-303
 * completed) are all retained; only unreferenced filler is dropped.
 */
const HERO_OMITTED_TASKS = new Set(["t-104", "t-105", "t-204", "t-404"]);

function heroSeed(domain: DomainId) {
  return buildDomainSeed(domain, SEED_TASKS).filter(
    (task) => !HERO_OMITTED_TASKS.has(task.id),
  );
}

function initialDemoState(domain: DomainId): DemoState {
  const pack = DOMAINS[domain];
  return {
    view: "board",
    tasks: heroSeed(domain),
    // commentBodies[1] (not [0]) so the static teammate note differs
    // from the line the scripted scene types live (demoCommentText),
    // and falls back to [0] for any pack with a single body.
    staticComment: pack.commentBodies[1] ?? pack.commentBodies[0],
    cursors: {
      chloe: initialCursor(140, 60),
      david: initialCursor(360, 60),
      alex: initialCursor(620, 60),
      ada: initialCursor(0, 0),
      marcus: initialCursor(0, 0),
    },
    pickedTaskId: null,
    pickedBy: null,
    ghostX: 0,
    ghostY: 0,
    openCommentTaskId: null,
    typingFromUser: null,
    typingProgress: 0,
    postedComment: null,
    reactions: [],
    activity: [],
    nudgeOpen: false,
    nudgeTask: null,
    nudgeStage: "idle",
    burndown: [12, 11, 11, 10, 10, 9, 9, 8],
    dependencyHighlight: null,
    completedFlash: null,
    scene: "boot",
    filterByAssignee: null,
  };
}

type CinematicDemoProps = {
  domain?: DomainId;
  paused?: boolean;
  staticFrame?: boolean;
};

export function CinematicDemo({
  domain = "wedding",
  paused = false,
  staticFrame = false,
}: CinematicDemoProps = {}) {
  const [runKey, setRunKey] = useState(0);

  return (
    <CinematicDemoRun
      key={runKey}
      domain={domain}
      paused={paused}
      staticFrame={staticFrame}
      onReplay={() => setRunKey((value) => value + 1)}
    />
  );
}

function CinematicDemoRun({
  domain = "wedding",
  paused: externallyPaused = false,
  staticFrame = false,
  onReplay,
}: CinematicDemoProps & { onReplay: () => void }) {
  const pack = DOMAINS[domain];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());
  const mounted = useHydrated();
  const [manualPaused, setManualPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const reducedMode = mounted && Boolean(prefersReducedMotion);
  const isStatic = staticFrame || reducedMode;
  const demoPaused =
    externallyPaused || manualPaused || !inView || !pageVisible;
  const demoActive = mounted && !reducedMode && !staticFrame && !demoPaused;
  const pausedRef = useRef(demoPaused);
  const resumeWaitersRef = useRef(new Set<() => void>());
  const aliveRef = useRef(true);
  const currentStateRef = useRef<DemoState | null>(null);

  const [state, setState] = useState<DemoState>(() => initialDemoState(domain));

  const [celebration, setCelebration] = useState<{
    visible: boolean;
    origin: { x: number; y: number } | null;
  }>({ visible: false, origin: null });

  useEffect(() => {
    if (staticFrame) return;
    const node = containerRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [staticFrame]);

  useEffect(() => {
    if (staticFrame) return;
    const sync = () => setPageVisible(document.visibilityState === "visible");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [staticFrame]);

  const releaseResumeWaiters = useCallback(() => {
    const waiters = [...resumeWaitersRef.current];
    resumeWaitersRef.current.clear();
    waiters.forEach((release) => release());
  }, []);

  const replay = () => {
    onReplay();
  };

  const waitUntilResumed = useCallback(async () => {
    if (!pausedRef.current || !aliveRef.current) return;

    await new Promise<void>((resolve) => {
      const release = () => {
        resumeWaitersRef.current.delete(release);
        resolve();
      };
      resumeWaitersRef.current.add(release);

      // Close the narrow race between reading pausedRef and registering.
      if (!pausedRef.current || !aliveRef.current) release();
    });
  }, []);

  const waitFor = useCallback(async (ms: number) => {
    let remaining = Math.round(ms * TEMPO);
    const interval = 80;

    while (remaining > 0 && aliveRef.current) {
      await waitUntilResumed();
      if (!aliveRef.current) return;

      const step = Math.min(interval, remaining);
      await sleep(step);
      // A pause can arrive during the short sleep. Do not spend that slice
      // unless it remained live for the full beat.
      if (!pausedRef.current) remaining -= step;
    }
  }, [waitUntilResumed]);

  // --- Helpers operating on state ---

  const getRect = useCallback((taskId: string) => {
    const el = cardRefs.current.get(taskId);
    if (!el || !surfaceRef.current) return null;
    const r = el.getBoundingClientRect();
    const s = surfaceRef.current.getBoundingClientRect();
    return {
      left: r.left - s.left,
      top: r.top - s.top,
      width: r.width,
      height: r.height,
    };
  }, []);

  const moveCursor = useCallback(
    (
      user: UserId,
      x: number,
      y: number,
      opts?: Partial<DemoState["cursors"][UserId]>,
    ) => {
      setState((s) => ({
        ...s,
        cursors: {
          ...s.cursors,
          [user]: {
            ...s.cursors[user],
            x,
            y,
            visible: true,
            ...opts,
          },
        },
      }));
    },
    [],
  );

  const setCursorState = useCallback(
    (user: UserId, opts: Partial<DemoState["cursors"][UserId]>) => {
      setState((s) => ({
        ...s,
        cursors: {
          ...s.cursors,
          [user]: { ...s.cursors[user], ...opts },
        },
      }));
    },
    [],
  );

  const moveCursorToCard = useCallback(
    async (
      user: UserId,
      taskId: string,
      anchor: "center" | "right" = "center",
    ) => {
      const r = getRect(taskId);
      if (!r) return;
      const x =
        anchor === "right" ? r.left + r.width - 32 : r.left + r.width / 2 - 8;
      const y = r.top + r.height / 2 - 8;
      moveCursor(user, x, y, { visible: true });
      await waitFor(720);
    },
    [getRect, moveCursor, waitFor],
  );

  const pushActivity = useCallback(
    (user: UserId, verb: string, target: string) => {
      setState((s) => ({
        ...s,
        activity: [
          ...s.activity,
          { id: makeId(), user, verb, target },
        ].slice(-8),
      }));
    },
    [],
  );

  const pickUp = useCallback(
    (user: UserId, taskId: string) => {
      const r = getRect(taskId);
      setState((s) => ({
        ...s,
        pickedTaskId: taskId,
        pickedBy: user,
        ghostX: r?.left ?? 0,
        ghostY: r?.top ?? 0,
        cursors: {
          ...s.cursors,
          [user]: { ...s.cursors[user], grabbing: true },
        },
      }));
    },
    [getRect],
  );

  const moveGhostTo = useCallback(
    async (user: UserId, x: number, y: number) => {
      setState((s) => ({
        ...s,
        ghostX: x,
        ghostY: y,
        cursors: {
          ...s.cursors,
          [user]: { ...s.cursors[user], x: x + 110, y: y + 18 },
        },
      }));
      await waitFor(800);
    },
    [waitFor],
  );

  const drop = useCallback(
    (user: UserId, targetLane: Task["lane"]) => {
      setState((s) => {
        const taskId = s.pickedTaskId;
        if (!taskId) return s;
        const updatedTasks = s.tasks.map((t) =>
          t.id === taskId ? { ...t, lane: targetLane, idleDays: undefined } : t,
        );
        return {
          ...s,
          tasks: updatedTasks,
          pickedTaskId: null,
          pickedBy: null,
          cursors: {
            ...s.cursors,
            [user]: { ...s.cursors[user], grabbing: false },
          },
        };
      });
    },
    [],
  );

  const triggerCelebration = useCallback(
    (x: number, y: number) => {
      setCelebration({ visible: true, origin: { x, y } });
      void waitFor(1600).then(() => {
        if (aliveRef.current) {
          setCelebration({ visible: false, origin: null });
        }
      });
    },
    [waitFor],
  );

  // --- Scene runner ---

  useEffect(() => {
    // Under prefers-reduced-motion the demo renders a static representative
    // frame (all 4 lanes visible, tasks in place), no frozen mid-animation,
    // no timing loops. The scene runner only starts for users who have not
    // opted out of motion.
    if (!mounted || reducedMode || staticFrame) return;
    aliveRef.current = true;

    const run = async () => {
      // Initial settle, cursors arrive with their labels visible
      // (justArrived) for ~900ms so the eye reads who's here, then
      // the labels fade and we're at rest.
      await waitFor(700);
      setState((s) => ({
        ...s,
        cursors: {
          ...s.cursors,
          chloe: {
            ...s.cursors.chloe,
            visible: true,
            label: "Chloe",
            justArrived: true,
          },
          david: {
            ...s.cursors.david,
            visible: true,
            label: "David",
            justArrived: true,
          },
          alex: {
            ...s.cursors.alex,
            visible: true,
            label: "Alex",
            justArrived: true,
          },
        },
      }));
      await waitFor(900);
      setState((s) => ({
        ...s,
        cursors: {
          ...s.cursors,
          chloe: { ...s.cursors.chloe, justArrived: false },
          david: { ...s.cursors.david, justArrived: false },
          alex: { ...s.cursors.alex, justArrived: false },
        },
      }));

      while (aliveRef.current) {
        await waitUntilResumed();

        // ────── Scene A: Carry & celebrate ──────
        await sceneCarry();
        if (!aliveRef.current) return;
        await sceneSettle();
        if (!aliveRef.current) return;
        await waitUntilResumed();

        // ────── Scene B: Inline comment thread ──────
        await sceneComment();
        if (!aliveRef.current) return;
        await sceneSettle();
        if (!aliveRef.current) return;
        await waitUntilResumed();

        // ────── Scene C: View morph (board → list → timeline → board) ──────
        await sceneViewMorph();
        if (!aliveRef.current) return;
        await sceneSettle();
        if (!aliveRef.current) return;
        await waitUntilResumed();

        // ────── Scene D: stuck-work prompt ── CUT 2026-07-27 ──────
        // The nudge card it was built around has been removed, which left this
        // beat as roughly eight seconds of nothing: no overlay appeared, and
        // Chloe's cursor still crossed the board to press a button that was no
        // longer there. That is the single biggest reason the presence read as
        // uncoordinated. `sceneNudge` is left defined so it can be restored
        // with its overlay in one line.
        void sceneNudge;

        // ────── Scene E: Dependency reveal ──────
        await sceneDependency();
        if (!aliveRef.current) return;
        await sceneSettle(2000);
        if (!aliveRef.current) return;
        await waitUntilResumed();
      }
    };

    /** Settle without ambient cursor drift. Presence moves only when a
     * scripted action explains who is doing what. */
    const sceneSettle = async (durationMs = 1600) => {
      setState((s) => ({ ...s, scene: "settle" }));
      await waitFor(durationMs);
    };

    const sceneCarry = async () => {
      // Guard: carry mutates board state; if we ever schedule it
      // outside board mode, bail clean rather than tearing the morph.
      if (currentStateRef.current && currentStateRef.current.view !== "board")
        return;
      setState((s) => ({ ...s, scene: "carry" }));

      // Pick the first todo card and have David carry it to Doing
      const targetId = "t-101";
      const dest: Task["lane"] = "doing";

      // David moves to the card
      await moveCursorToCard("david", targetId);

      // Pick up
      pickUp("david", targetId);
      await waitFor(220);

      // Glide to the doing column area
      const doingCol = document.querySelector(
        `[data-lane="doing"]`,
      ) as HTMLElement | null;
      if (doingCol && surfaceRef.current) {
        const cr = doingCol.getBoundingClientRect();
        const sr = surfaceRef.current.getBoundingClientRect();
        const x = cr.left - sr.left + 18;
        const y = cr.top - sr.top + 56;
        await moveGhostTo("david", x, y);
      } else {
        await waitFor(700);
      }

      drop("david", dest);
      {
        const t = currentStateRef.current?.tasks.find((x) => x.id === "t-101");
        pushActivity("david", "moved to Moving", shorten(t?.title ?? "this task"));
      }
      await waitFor(900);

      // Move another (alex pushes a review item to done with celebration)
      const reviewToDone = "t-303";
      await moveCursorToCard("alex", reviewToDone);
      pickUp("alex", reviewToDone);
      await waitFor(200);

      const doneCol = document.querySelector(
        `[data-lane="done"]`,
      ) as HTMLElement | null;
      if (doneCol && surfaceRef.current) {
        const cr = doneCol.getBoundingClientRect();
        const sr = surfaceRef.current.getBoundingClientRect();
        const x = cr.left - sr.left + 18;
        const y = cr.top - sr.top + 56;
        await moveGhostTo("alex", x, y);
        drop("alex", "done");

        // Celebration burst at column header
        const headerEl = doneCol.querySelector("[data-lane-header]");
        if (headerEl) {
          const hr = headerEl.getBoundingClientRect();
          triggerCelebration(hr.left - sr.left + 60, hr.top - sr.top + 18);
        }
        {
          const t = currentStateRef.current?.tasks.find((x) => x.id === "t-303");
          pushActivity("alex", "completed", shorten(t?.title ?? "this task"));
        }
        // Tick burndown
        setState((s) => ({
          ...s,
          burndown: [...s.burndown.slice(1), s.burndown[s.burndown.length - 1] - 1],
        }));
      } else {
        drop("alex", "done");
      }

      await waitFor(1500);
    };

    const sceneComment = async () => {
      setState((s) => ({ ...s, scene: "comment", openCommentTaskId: null }));
      const taskId = "t-202";

      // Chloe glides to the card and opens the thread
      await moveCursorToCard("chloe", taskId);

      setState((s) => ({
        ...s,
        openCommentTaskId: taskId,
        cursors: {
          ...s.cursors,
          chloe: { ...s.cursors.chloe, reading: true },
        },
      }));
      await waitFor(900);

      // Show typing
      setState((s) => ({
        ...s,
        typingFromUser: "chloe",
        typingProgress: 0,
        postedComment: null,
      }));

      const text = pack.demoCommentText;
      for (let i = 1; i <= text.length; i += 2) {
        await waitFor(40);
        setState((s) => ({
          ...s,
          typingProgress: i / text.length,
        }));
      }
      await waitFor(160);

      setState((s) => ({
        ...s,
        typingFromUser: null,
        postedComment: { user: "chloe", text },
        cursors: {
          ...s.cursors,
          chloe: { ...s.cursors.chloe, reading: false },
        },
      }));
      {
        const t = currentStateRef.current?.tasks.find((x) => x.id === "t-202");
        pushActivity("chloe", "commented on", shorten(t?.title ?? "this task"));
      }
      await waitFor(1500);

      setState((s) => ({
        ...s,
        openCommentTaskId: null,
        postedComment: null,
      }));
      await waitFor(700);
    };

    const sceneViewMorph = async () => {
      // Defensive guard: never trigger a morph while a card is in-flight
      // (ghost-card lives outside the LayoutGroup and would desync).
      if (currentStateRef.current?.pickedTaskId) return;
      setState((s) => ({ ...s, scene: "morph" }));

      // Float Alex's cursor up to the view switcher tabs
      const switchEl = document.querySelector('[data-tab="list"]') as HTMLElement | null;
      if (switchEl && surfaceRef.current) {
        const sr = surfaceRef.current.getBoundingClientRect();
        const tr = switchEl.getBoundingClientRect();
        moveCursor("alex", tr.left - sr.left + 24, tr.top - sr.top + 12, {
          grabbing: false,
          reading: false,
        });
      }
      await waitFor(700);

      setState((s) => ({ ...s, view: "list" }));
      pushActivity("alex", "switched to", "List view");
      await waitFor(2200);

      const tlEl = document.querySelector('[data-tab="timeline"]') as HTMLElement | null;
      if (tlEl && surfaceRef.current) {
        const sr = surfaceRef.current.getBoundingClientRect();
        const tr = tlEl.getBoundingClientRect();
        moveCursor("alex", tr.left - sr.left + 24, tr.top - sr.top + 12);
      }
      await waitFor(700);
      setState((s) => ({ ...s, view: "timeline" }));
      pushActivity("alex", "switched to", "Timeline view");
      await waitFor(2400);

      const bdEl = document.querySelector('[data-tab="board"]') as HTMLElement | null;
      if (bdEl && surfaceRef.current) {
        const sr = surfaceRef.current.getBoundingClientRect();
        const tr = bdEl.getBoundingClientRect();
        moveCursor("alex", tr.left - sr.left + 24, tr.top - sr.top + 12);
      }
      await waitFor(700);
      setState((s) => ({ ...s, view: "board" }));
      await waitFor(800);
    };

    const sceneNudge = async () => {
      const t202 = currentStateRef.current?.tasks.find((x) => x.id === "t-202");
      setState((s) => ({
        ...s,
        scene: "nudge",
        nudgeOpen: true,
        nudgeTask: shorten(t202?.title ?? "this task", 28),
        nudgeStage: "open",
      }));
      await waitFor(2200);

      // Chloe clicks Send
      // Move chloe's cursor toward the nudge button area (center top of demo)
      if (surfaceRef.current) {
        const sr = surfaceRef.current.getBoundingClientRect();
        moveCursor(
          "chloe",
          sr.width / 2 - 30,
          sr.height * 0.18 + 56,
          { grabbing: false, reading: false },
        );
      }
      await waitFor(700);
      setCursorState("chloe", { grabbing: true });
      setState((s) => ({ ...s, nudgeStage: "sending" }));
      await waitFor(900);
      setState((s) => ({ ...s, nudgeStage: "sent" }));
      setCursorState("chloe", { grabbing: false });
      pushActivity(
        "chloe",
        "nudged",
        `David on ${shorten(t202?.title ?? "this task")}`,
      );
      await waitFor(1100);
      setState((s) => ({
        ...s,
        nudgeOpen: false,
        nudgeStage: "idle",
        nudgeTask: null,
      }));
      await waitFor(500);
    };

    const sceneDependency = async () => {
      setState((s) => ({
        ...s,
        scene: "dependency",
        dependencyHighlight: ["t-201", "t-202"],
      }));

      // Quick glide of david's cursor between the two cards
      await moveCursorToCard("david", "t-201", "right");
      await waitFor(450);
      await moveCursorToCard("david", "t-202", "right");
      await waitFor(900);

      setState((s) => ({ ...s, dependencyHighlight: null }));
      {
        const t201 = currentStateRef.current?.tasks.find((x) => x.id === "t-201");
        const t202 = currentStateRef.current?.tasks.find((x) => x.id === "t-202");
        pushActivity(
          "david",
          "linked dependency",
          `${shorten(t201?.title ?? "task", 14)} → ${shorten(t202?.title ?? "task", 14)}`,
        );
      }
      await waitFor(700);
    };

    run();

    return () => {
      aliveRef.current = false;
      releaseResumeWaiters();
    };
  }, [
    mounted,
    pack.demoCommentText,
    reducedMode,
    staticFrame,
    moveCursor,
    moveCursorToCard,
    pickUp,
    drop,
    moveGhostTo,
    pushActivity,
    setCursorState,
    triggerCelebration,
    waitFor,
    waitUntilResumed,
    releaseResumeWaiters,
  ]);

  useEffect(() => {
    pausedRef.current = demoPaused;
    if (!demoPaused) releaseResumeWaiters();
  }, [demoPaused, releaseResumeWaiters]);

  // Mirror state into a ref so scene functions (running outside React's
  // render path inside the run() async loop) can read fresh values
  // without becoming stale closures.
  useEffect(() => {
    currentStateRef.current = state;
  }, [state]);

  const pickedTask = useMemo(
    () =>
      state.pickedTaskId
        ? state.tasks.find((t) => t.id === state.pickedTaskId) ?? null
        : null,
    [state.pickedTaskId, state.tasks],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      data-cinematic-demo-playback={
        isStatic ? "static" : demoPaused ? "paused" : "playing"
      }
      data-cinematic-demo-snapshot={[
        state.scene,
        state.view,
        state.tasks.map((task) => `${task.id}:${task.lane}`).join(","),
        state.activity.length,
        state.openCommentTaskId ?? "",
        state.typingProgress.toFixed(3),
        state.pickedTaskId ?? "",
        state.dependencyHighlight?.join(",") ?? "",
      ].join("|")}
    >
      {/* Floating depth shadow removed (review 04): the board's own perspective
          elevation carries the lift; the extra bottom blob read as heavy. */}
      {/* GALLERY EDIT 2026-07-27 — the outer chrome is flattened.
          It carried a 120px drop shadow at 32% plus two more layers, and a
          live perspective tilt that followed the pointer. Together they framed
          the board as a floating screenshot of a product rather than the
          product. The shadow also fought the board's own paper lanes, which is
          what read as a murky edge around the Kanban. What is left is a
          hairline and a radius: the board sits on the page. */}
      <motion.div
        className="relative z-10 overflow-hidden rounded-[16px] border border-[var(--x-task-border)] bg-white"
        transition={{ type: "spring", stiffness: 80, damping: 18 }}
      >
        {/* Top chrome */}
        <div className="flex items-center justify-between border-b border-line-soft bg-bg-elevated px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {/* Window dots: the muted take on the mac trio, drawn from
                  the tokenised badge palette so nothing shouts. */}
              <span
                className="block h-2.5 w-2.5 rounded-full border border-line"
                style={{ background: "var(--roadmap-rose-bg)" }}
              />
              <span
                className="block h-2.5 w-2.5 rounded-full border border-line"
                style={{ background: "var(--roadmap-amber-bg)" }}
              />
              <span
                className="block h-2.5 w-2.5 rounded-full border border-line"
                style={{ background: "var(--roadmap-emerald-bg)" }}
              />
            </div>
            <div className="ml-3 flex items-center gap-1.5 rounded-md bg-bg-sunken px-2 py-0.5 text-[11px] text-ink-soft">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              {pack.workspaceUrl}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <PresenceStrip />
            <button type="button" aria-hidden="true" tabIndex={-1} className="rounded-md border border-line bg-white px-2 py-0.5 text-[11px] font-medium text-ink-soft hover:bg-bg-sunken">
              Share
            </button>
          </div>
        </div>

        {/* Sub header: title + view tabs */}
        <div className="flex items-end justify-between border-b border-line-soft px-5 pb-2 pt-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-ink-quiet">
              <span>Workspace</span>
              <span>›</span>
              <motion.span
                key={pack.workspaceCrumb}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: MOTION_BASE, ease: EASE_OUT_EXPO }}
              >
                {pack.workspaceCrumb}
              </motion.span>
            </div>
            <motion.h3
              key={pack.workspaceTitle}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: MOTION_MODERATE, ease: EASE_OUT_EXPO }}
              className="mt-1 text-[19px] font-semibold tracking-tight"
            >
              {pack.workspaceTitle}
            </motion.h3>
          </div>
          <ViewTabs view={state.view} />
        </div>

        {/* Surface */}
        {/* GALLERY EDIT 2026-07-27 — height follows density. The product's
            card anatomy is taller than the old marketing card, and the app
            answers that by scrolling each lane. A hero must not scroll, so
            the seed drops to three cards a lane (see HERO_OMITTED_TASKS) and
            the surface settles at 560px: every lane whole, nothing clipped,
            and a hero-sized frame rather than a wall of board. */}
        <div
          ref={surfaceRef}
          className="relative h-[560px] overflow-hidden bg-white"
        >
          <LayoutGroup>
            <DemoSurface state={state} cardRefs={cardRefs} />
          </LayoutGroup>

          {/* GALLERY EDIT 2026-07-27 — the "Open work" burn-down overlay is
              gone. It floated above the board on its own card, belonged to no
              part of the product, and pulled the eye to the top right at the
              exact moment the scripted collaboration happens on the cards. */}

          <CursorsLayer cursors={state.cursors} view={state.view} />

          <GhostCard
            task={pickedTask}
            user={state.pickedBy}
            x={state.ghostX}
            y={state.ghostY}
            visible={!!state.pickedTaskId}
          />

          {/* GALLERY EDIT 2026-07-27 — the Signal nudge is removed, not
              softened. It was a modal floating over the middle of the board
              asking a question nobody could answer, and it interrupted the
              one thing the hero exists to show. `state.nudge*` is still
              driven by the scene runner, so it can be restored in one line.
              Deleted with it: `ai-nudge.tsx`. */}

          <Celebration
            visible={celebration.visible}
            origin={celebration.origin}
          />

          {/* GALLERY EDIT 2026-07-27 — the activity feed is gone. Trimming it
              from four toasts to two made it quieter but not right: it still
              fired over the board during the scene, pulling the eye to the
              bottom right at the exact moments the collaboration is happening
              on the cards. The board already says who is doing what, in the
              place it is happening: live cursors, the holder's colour on the
              card border, the editing badge and the inline thread. A toast
              repeating that is a second narrator talking over the first.
              `state.activity` is still tracked, so restoring this is one line
              if it is ever wanted back. */}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between border-t border-line-soft bg-white px-4 py-1.5 text-[10.5px] text-ink-quiet">
          <span aria-live="polite" className="flex items-center gap-1.5">
            <span className="block h-1.5 w-1.5 rounded-full bg-brand" />
            {staticFrame
              ? "Sample board"
              : reducedMode
                ? "Motion reduced"
                : demoActive
                  ? "Demo playing"
                  : "Demo paused"}
          </span>
          <span className="flex items-center gap-1.5">
            {!staticFrame && !reducedMode ? (
              <>
                <button
                  type="button"
                  aria-pressed={manualPaused}
                  className="min-h-8 rounded-full border border-line px-3 text-[10px] font-medium text-ink-soft transition-[border-color,color,transform] duration-[120ms] ease-[var(--marketing-ease-out)] hover:border-ink-faint hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[.98] motion-reduce:transition-none"
                  onClick={() => setManualPaused((value) => !value)}
                >
                  {manualPaused ? "Resume" : "Pause"}
                </button>
                <button
                  type="button"
                  className="min-h-8 rounded-full border border-line px-3 text-[10px] font-medium text-ink-soft transition-[border-color,color,transform] duration-[120ms] ease-[var(--marketing-ease-out)] hover:border-ink-faint hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-[.98] motion-reduce:transition-none"
                  onClick={replay}
                >
                  Replay
                </button>
              </>
            ) : null}
            <span aria-hidden data-debug-scene={state.scene} />
          </span>
        </div>
      </motion.div>
    </div>
  );
}
function PresenceStrip() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-1.5">
        <Avatar user="chloe" size={20} ring />
        <Avatar user="david" size={20} ring />
        <Avatar user="alex" size={20} ring />
      </div>
      <span className="text-[10.5px] text-ink-quiet">Demo workspace</span>
    </div>
  );
}

function ViewTabs({ view }: { view: ViewMode }) {
  const items: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    {
      id: "board",
      label: "Board",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="18" rx="1" />
          <rect x="14" y="3" width="7" height="11" rx="1" />
        </svg>
      ),
    },
    {
      id: "list",
      label: "List",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      id: "timeline",
      // GALLERY EDIT 2026-07-27 — "Schedule", not "Timeline". Signal Timeline
      // is a product in its own right; a view inside Tasks carrying the same
      // name reads as that product embedded here, which it is not. The
      // internal ViewMode id stays `timeline` so the scripted scene, the morph
      // targets and the layout code are untouched. Matches the app, whose
      // tab row is Board · List · Schedule · Calendar.
      label: "Schedule",
      icon: (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="6" width="11" height="3" rx="1" />
          <rect x="7" y="11" width="13" height="3" rx="1" />
          <rect x="5" y="16" width="9" height="3" rx="1" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative inline-flex items-center rounded-lg bg-bg-sunken p-0.5">
      {items.map((item) => (
        <div
          key={item.id}
          data-tab={item.id}
          className={
            "relative inline-flex select-none items-center gap-1 rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors " +
            (view === item.id
              ? "text-ink"
              : "text-ink-soft hover:text-ink")
          }
        >
          {view === item.id ? (
            <motion.span
              layoutId="tab-pill"
              className="absolute inset-0 rounded-md bg-white shadow-sm"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          ) : null}
          <span className="relative z-10 inline-flex items-center gap-1">
            {item.icon}
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
