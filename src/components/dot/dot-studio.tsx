"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { DotPlayer } from "@/lib/dot/player";
import { chapterAt, evaluateClip } from "@/lib/dot/clips";
import {
  clipInfo,
  MOODS,
  PERFORMANCES,
  FPS,
  type ClipId,
  type DotColor,
  type StageColor,
  type DotPreset,
  DOT_VERSION,
  parsePreset,
} from "@/lib/dot/model";
import {
  renderContents,
  renderSvg,
  type RenderOptions,
} from "@/lib/dot/render";
import { DotIcon, DotSpecimen } from "./dot-svg";
const DotInspector = dynamic(
  () => import("./inspector").then((m) => m.DotInspector),
  { ssr: false },
);

const INITIAL = renderContents(evaluateClip("idle", 0), {
  grounded: true,
  stage: "paper",
});
const STORAGE = "signal.dot-studio.takes.v2";

export function DotStudio({ authoring = false }: { authoring?: boolean }) {
  const [clip, setClip] = useState<ClipId>("idle"),
    [playing, setPlaying] = useState(true),
    [reduced, setReduced] = useState(false);
  const [color, setColor] = useState<DotColor>("indigo"),
    [stage, setStage] = useState<StageColor>("paper"),
    [effects, setEffects] = useState(true);
  const [inspect, setInspect] = useState(false),
    [filter, setFilter] = useState(""),
    [note, setNote] = useState("");
  const [takes, setTakes] = useState<DotPreset[]>([]),
    [takeName, setTakeName] = useState("My Dot"),
    [speed, setSpeed] = useState(1),
    [seed, setSeed] = useState(7);
  const [revision, setRevision] = useState(0);
  const [inspectionPlayer, setInspectionPlayer] = useState<DotPlayer | null>(
    null,
  );
  const svgRef = useRef<SVGSVGElement>(null),
    stageRef = useRef<HTMLDivElement>(null),
    targetRef = useRef<HTMLButtonElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null),
    timeRef = useRef<HTMLOutputElement>(null),
    chapterRef = useRef<HTMLSpanElement>(null);
  const playerRef = useRef<DotPlayer | null>(null),
    frameRef = useRef(0),
    mounted = useRef(false);
  const renderRef = useRef<RenderOptions>({
    color: "indigo",
    stage: "paper",
    grounded: true,
    effects: true,
  });
  const pointer = useRef<{
    id: number;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  const lastPaint = useRef("");
  const player = () => {
    if (!playerRef.current) playerRef.current = new DotPlayer();
    return playerRef.current;
  };
  const paint = useCallback(() => {
    const p = playerRef.current;
    if (!p || !svgRef.current) return;
    const pose = p.pose(),
      markup = renderContents(pose, {
        ...renderRef.current,
        grounded: p.clip !== "film",
      });
    if (markup !== lastPaint.current) {
      svgRef.current.innerHTML = markup;
      lastPaint.current = markup;
    }
    if (rangeRef.current)
      rangeRef.current.value = String(Math.round(p.time * FPS));
    if (timeRef.current)
      timeRef.current.value = `${p.time.toFixed(2)} / ${p.duration.toFixed(2)}`;
    if (chapterRef.current)
      chapterRef.current.textContent =
        p.clip === "film" ? chapterAt(p.time).name : clipInfo(p.clip).name;
    if (targetRef.current) {
      targetRef.current.style.transform = `translate(-50%, -50%) translate(${(pose.x / 190) * 100}cqh, ${(pose.y / 190) * 100}cqh) scale(${pose.scale})`;
    }
  }, []);
  const wake = useCallback(() => {
    if (frameRef.current || !mounted.current) return;
    const p = playerRef.current;
    if (!p) return;
    paint();
    if (!p.needsFrame) return;
    let before = performance.now();
    const tick = (now: number) => {
      frameRef.current = 0;
      if (!mounted.current || !p.needsFrame) return;
      p.tick((now - before) / 1000);
      before = now;
      paint();
      if (p.needsFrame) frameRef.current = requestAnimationFrame(tick);
      else setPlaying(p.playing);
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [paint]);
  useEffect(() => {
    mounted.current = true;
    const p = player();
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    let intersecting = true;
    const motion = () => {
      p.setReduced(mq.matches);
      setReduced(mq.matches);
      setPlaying(p.playing);
      setClip(p.clip);
      paint();
      wake();
    };
    const visible = () => {
      p.visible = intersecting && !document.hidden;
      if (!p.visible && frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = 0;
      }
      wake();
    };
    const io = new IntersectionObserver(
      (entries) => {
        intersecting = entries[0]?.isIntersecting ?? false;
        visible();
      },
      { threshold: 0.1 },
    );
    if (stageRef.current) io.observe(stageRef.current);
    mq.addEventListener("change", motion);
    document.addEventListener("visibilitychange", visible);
    motion();
    queueMicrotask(() => {
      if (!mounted.current) return;
      try {
        const saved: unknown = JSON.parse(
          localStorage.getItem(STORAGE) || "[]",
        );
        if (Array.isArray(saved))
          setTakes(
            saved.slice(0, 12).flatMap((v) => {
              try {
                return [parsePreset(v)];
              } catch {
                return [];
              }
            }),
          );
      } catch {
        /* Private browsing may have no storage. */
      }
    });
    wake();
    return () => {
      mounted.current = false;
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
      io.disconnect();
      mq.removeEventListener("change", motion);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [paint, wake]);
  useEffect(() => {
    renderRef.current = { color, stage, effects };
    paint();
  }, [color, stage, effects, paint]);

  const select = (id: ClipId) => {
    const p = player();
    p.select(id);
    setClip(id);
    setNote("");
    setRevision((r) => r + 1);
    paint();
    wake();
  };
  const toggle = () => {
    const p = player();
    if (p.reduced) return;
    if (p.playing) p.pause();
    else p.playing = true;
    setPlaying(p.playing);
    paint();
    wake();
  };
  const seek = (frame: number) => {
    const p = player();
    p.seek(frame / FPS);
    setPlaying(false);
    paint();
    setRevision((r) => r + 1);
  };
  const replay = () => {
    const p = player();
    p.seek(0);
    p.playing = !p.reduced;
    setPlaying(p.playing);
    setRevision((r) => r + 1);
    paint();
    wake();
  };
  const watch = () => {
    const p = player();
    p.playing = !p.reduced;
    setPlaying(p.playing);
    select("film");
  };
  const info = clipInfo(clip),
    film = clip === "film";
  const preset = (): DotPreset => ({
    version: DOT_VERSION,
    name: takeName,
    clip,
    seed,
    color,
    stage,
    speed,
    effects,
  });
  const download = (text: string, type: string, filename: string) => {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const loadTake = (value: unknown) => {
    try {
      const take = parsePreset(value),
        p = player();
      p.seed = take.seed;
      p.speed = take.speed;
      setSeed(take.seed);
      setSpeed(take.speed);
      setColor(take.color);
      setStage(take.stage);
      setEffects(take.effects);
      setTakeName(take.name);
      select(take.clip);
      setNote(`Loaded ${take.name}.`);
    } catch (e) {
      setNote(
        e instanceof Error ? e.message : "That preset could not be opened.",
      );
    }
  };
  const saveTake = () => {
    try {
      const take = parsePreset(preset());
      const next = [take, ...takes.filter((t) => t.name !== take.name)].slice(
        0,
        12,
      );
      localStorage.setItem(STORAGE, JSON.stringify(next));
      setTakes(next);
      setNote(`Saved ${take.name} on this device.`);
    } catch (e) {
      setNote(
        e instanceof Error
          ? e.message
          : "This browser could not save the take. Download the preset instead.",
      );
    }
  };
  const clearPointer = () => {
    const current = pointer.current;
    if (current && targetRef.current?.hasPointerCapture(current.id))
      targetRef.current.releasePointerCapture(current.id);
    pointer.current = null;
    player().endDrag();
    wake();
  };
  const moods = MOODS.filter((m) =>
    `${m.name} ${m.energy}`.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <main id="main" className="dot-studio">
      <div className="dot-heading">
        <div>
          <Link className="dot-back" href="/design">
            The design of Signal Studio <DotIcon kind="arrow" size={15} />
          </Link>
          <h1>
            Dot Studio<span aria-hidden="true">.</span>
          </h1>
          <p>One circle. A world of expression.</p>
        </div>
        <button className="dot-primary" onClick={watch} disabled={reduced}>
          <DotIcon kind="play" />
          Watch Dot’s film<span className="dot-duration">0:31</span>
        </button>
      </div>
      <div className="dot-workspace">
        <section className="dot-theatre" aria-label="Dot stage">
          <div className="dot-stage-toolbar">
            <div className="dot-tabs" aria-label="Stage view">
              <button aria-pressed={!film} onClick={() => select("idle")}>
                Playground
              </button>
              <button aria-pressed={film} onClick={watch}>
                The film
              </button>
            </div>
            <button
              className="dot-icon-button"
              aria-label={
                stage === "night" ? "Use light stage" : "Use dark stage"
              }
              onClick={() => setStage(stage === "night" ? "paper" : "night")}
            >
              <DotIcon kind={stage === "night" ? "sun" : "moon"} />
            </button>
          </div>
          <div
            ref={stageRef}
            className="dot-stage"
            data-theme={stage}
            onPointerMove={(e) => {
              const p = player();
              if (!p.playing || p.reduced || pointer.current || film) return;
              const bounds = e.currentTarget.getBoundingClientRect();
              p.gaze = {
                x: Math.max(
                  -6,
                  Math.min(
                    6,
                    (e.clientX - bounds.left - bounds.width / 2) / 45,
                  ),
                ),
                y: Math.max(
                  -4,
                  Math.min(
                    4,
                    (e.clientY - bounds.top - bounds.height / 2) / 50,
                  ),
                ),
              };
              wake();
            }}
            onPointerLeave={() => {
              player().gaze = { x: 0, y: 0 };
              wake();
            }}
          >
            <div className="dot-stage-inner">
              <svg
                ref={svgRef}
                className="dot-live"
                viewBox="-95 -95 190 190"
                aria-hidden="true"
                focusable="false"
                dangerouslySetInnerHTML={{ __html: INITIAL }}
              />
              <button
                ref={targetRef}
                className="dot-touch"
                aria-label={`Say hello to Dot. Current mood: ${info.name}.`}
                disabled={film || reduced || !playing}
                onClick={(e) => {
                  if (e.detail === 0) {
                    player().poke();
                    paint();
                    wake();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    clearPointer();
                    player().gaze = { x: 0, y: 0 };
                  }
                }}
                onPointerDown={(e) => {
                  if (!e.isPrimary || pointer.current || e.button !== 0) return;
                  pointer.current = {
                    id: e.pointerId,
                    x: e.clientX,
                    y: e.clientY,
                    moved: false,
                  };
                  e.currentTarget.setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  const current = pointer.current;
                  if (!current || current.id !== e.pointerId) return;
                  const dx = e.clientX - current.x,
                    dy = e.clientY - current.y;
                  if (!current.moved && Math.hypot(dx, dy) > 6) {
                    current.moved = true;
                    player().startDrag();
                  }
                  if (current.moved) {
                    const d =
                      svgRef.current?.getBoundingClientRect().width ?? 500;
                    player().moveDrag((dx / d) * 190, (dy / d) * 190);
                    paint();
                  }
                }}
                onPointerUp={(e) => {
                  const current = pointer.current;
                  if (!current || current.id !== e.pointerId) return;
                  if (!current.moved) player().poke();
                  clearPointer();
                  paint();
                }}
                onPointerCancel={clearPointer}
                onLostPointerCapture={() => {
                  if (pointer.current) clearPointer();
                }}
              />
            </div>
            <div className="dot-stage-caption">
              <span ref={chapterRef}>{info.name}</span>
              <p>{film ? "A day with Dot" : info.caption}</p>
            </div>
            <span className="dot-stage-hint">
              {reduced
                ? "A quieter Dot, with reduced motion."
                : film
                  ? "Always a circle."
                  : playing
                    ? "Poke Dot. Drag a little. Say hello."
                    : "A moment, held still."}
            </span>
          </div>
          <div className="dot-transport">
            <button
              className="dot-play"
              onClick={toggle}
              disabled={reduced}
              aria-label={playing ? "Pause Dot" : "Play Dot"}
            >
              <DotIcon kind={playing ? "pause" : "play"} />
            </button>
            <button
              className="dot-icon-button"
              onClick={replay}
              aria-label="Replay performance"
            >
              <DotIcon kind="replay" />
            </button>
            <input
              ref={rangeRef}
              type="range"
              aria-label="Performance frame"
              min="0"
              max={Math.round(info.duration * FPS) - 1}
              defaultValue="0"
              onChange={(e) => seek(Number(e.target.value))}
            />
            <output ref={timeRef} aria-label="Playback time" aria-live="off">
              0.00 / {info.duration.toFixed(2)}
            </output>
            {authoring && (
              <button
                className="dot-icon-button"
                aria-label={inspect ? "Close inspector" : "Open inspector"}
                aria-expanded={inspect}
                onClick={() => {
                  setInspectionPlayer(player());
                  setInspect(!inspect);
                }}
              >
                <DotIcon kind="inspect" />
              </button>
            )}
          </div>
        </section>
        <aside className="dot-library" aria-label="Dot’s moods">
          <div className="dot-library-heading">
            <h2>A mood for the moment</h2>
            <span>10 moods</span>
          </div>
          <label className="dot-search-label">
            <span className="dot-sr-only">Find a mood</span>
            <input
              type="search"
              placeholder="Find a mood…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </label>
          <div className="dot-mood-list">
            {moods.map((m) => (
              <button
                className="dot-mood"
                key={m.id}
                aria-pressed={clip === m.id}
                onClick={() => {
                  if (clip === m.id) toggle();
                  else select(m.id);
                }}
              >
                <DotSpecimen clip={m.id} />
                <span>
                  {m.name}
                  <small>{m.energy}</small>
                </span>
                <span className="dot-mood-play">
                  <DotIcon
                    kind={clip === m.id && playing ? "pause" : "play"}
                    size={14}
                  />
                </span>
              </button>
            ))}
            {!moods.length && (
              <div className="dot-empty">
                <p>No mood by that name.</p>
                <button onClick={() => setFilter("")}>Show all moods</button>
              </div>
            )}
          </div>
          <p className="dot-library-note">
            A little focus. A little mischief.
            <br />
            All unmistakably Dot.
          </p>
        </aside>
      </div>
      {inspect && authoring && inspectionPlayer && (
        <DotInspector
          player={inspectionPlayer}
          revision={revision}
          seek={seek}
          paint={paint}
          wake={wake}
          setPlaying={setPlaying}
          color={color}
          setColor={(v) => {
            setColor(v);
            if (v === "paper") setStage("night");
            if (v === "ink") setStage("paper");
          }}
          effects={effects}
          setEffects={setEffects}
          speed={speed}
          setSpeed={(v) => {
            player().speed = v;
            setSpeed(v);
          }}
          seed={seed}
          setSeed={(v) => {
            player().seed = v;
            setSeed(v);
            paint();
          }}
          downloadSvg={() => {
            download(
              renderSvg(player().pose(), {
                color,
                stage: "transparent",
                effects,
                size: 1024,
              }),
              "image/svg+xml",
              `dot-${clip}-f${Math.round(player().time * 60)}.svg`,
            );
            setNote("SVG saved with a transparent background.");
          }}
        />
      )}
      <section className="dot-performances">
        <div className="dot-section-heading">
          <div>
            <h2>Little moments, big personality.</h2>
            <p>A few things Dot has been working on.</p>
          </div>
          <span>Pick one to play</span>
        </div>
        <div className="dot-performance-list">
          {PERFORMANCES.map((m) => (
            <button
              key={m.id}
              aria-pressed={clip === m.id}
              onClick={() => {
                if (!reduced) {
                  player().playing = true;
                  setPlaying(true);
                }
                select(m.id);
                stageRef.current?.scrollIntoView({
                  block: "center",
                  behavior: "instant",
                });
              }}
            >
              <DotSpecimen clip={m.id} />
              <span>{m.name}</span>
              <DotIcon kind="arrow" size={16} />
            </button>
          ))}
        </div>
      </section>
      {authoring && (
        <section className="dot-takes">
          <div className="dot-section-heading">
            <div>
              <h2>Keep a favourite.</h2>
              <p>Save a take on this device, or bring it with you.</p>
            </div>
          </div>
          <div className="dot-take-controls">
            <label>
              Name your take
              <input
                value={takeName}
                maxLength={60}
                onChange={(e) => setTakeName(e.target.value)}
              />
            </label>
            <button className="dot-primary" onClick={saveTake}>
              <DotIcon kind="plus" />
              Save take
            </button>
            <button
              className="dot-secondary"
              onClick={() => {
                try {
                  const p = parsePreset(preset());
                  download(
                    JSON.stringify(p, null, 2),
                    "application/json",
                    "dot-preset.json",
                  );
                  setNote("Preset downloaded.");
                } catch (e) {
                  setNote((e as Error).message);
                }
              }}
            >
              <DotIcon kind="download" />
              Download preset
            </button>
            <label className="dot-import">
              Open preset
              <input
                type="file"
                accept=".json,application/json"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 10000) {
                    setNote("Choose a Dot preset smaller than 10 KB.");
                    return;
                  }
                  try {
                    loadTake(JSON.parse(await file.text()));
                  } catch {
                    setNote(
                      "That file is not valid JSON. Choose a Dot preset.",
                    );
                  }
                  e.target.value = "";
                }}
              />
            </label>
          </div>
          <div className="dot-saved-takes">
            {takes.map((t, i) => (
              <button key={`${t.name}-${i}`} onClick={() => loadTake(t)}>
                <DotSpecimen clip={t.clip} color={t.color} />
                <span>{t.name}</span>
                <DotIcon kind="arrow" size={14} />
              </button>
            ))}
          </div>
        </section>
      )}
      <p className="dot-status" role="status">
        {note}
      </p>
      <footer className="dot-footer">
        <p>Made of very little. Full of life.</p>
        <Link href="/design">
          Back to the design of Signal Studio <DotIcon kind="arrow" size={16} />
        </Link>
      </footer>
    </main>
  );
}
