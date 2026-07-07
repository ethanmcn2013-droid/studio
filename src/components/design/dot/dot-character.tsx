"use client";

import { useEffect, useRef, useState } from "react";
import { DotEngine, MOODS, ORDER, type MoodKey } from "./engine";

/**
 * The Dot character exhibit on /design: one stage, one Dot, ten moods.
 *
 * The reel runs the working day on its own (idle → curious → excited →
 * zoomies → working → thinking → impatient → nervous → setback → sleep);
 * the rail jumps it; the Dot itself can be poked and dragged. All motion
 * runs on the WAAPI engine (bridge tweens between moods, additive pokes,
 * derived shadow), starts only when the stage is on screen, and stops
 * when it leaves.
 *
 * SSR renders the settled idle dot: no JS, no motion preference, no
 * problem — the exhibit is a still specimen until the engine wakes.
 */
export function DotCharacter() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const engineRef = useRef<DotEngine | null>(null);
  const [mood, setMood] = useState<MoodKey>("idle");
  const [note, setNote] = useState("");

  useEffect(() => {
    const stage = stageRef.current;
    const body = bodyRef.current;
    if (!stage || !body) return;
    const engine = new DotEngine(
      {
        stage,
        body,
        shadow: shadowRef.current,
        ghosts: ghostRefs.current.filter(Boolean) as HTMLElement[],
        drop: dropRef.current,
      },
      { onMood: setMood, onNote: setNote },
    );
    engineRef.current = engine;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) engine.start();
        else engine.suspend();
      },
      { threshold: 0.25 },
    );
    io.observe(stage);
    return () => {
      io.disconnect();
      engine.dispose();
      engineRef.current = null;
    };
  }, []);

  const M = MOODS[mood];

  return (
    <div className="dsn-dot-lab mt-10">
      {/* The reel: index, caption, and the ten-mood rail */}
      <div className="dsn-dot-side">
        <div className="dsn-dot-label" aria-live="polite" key={mood}>
          <div className="dsn-dot-toprow">
            <span className="dsn-dot-idx">{M.num}</span>
            <span className="dsn-dot-name">{M.name}</span>
          </div>
          <p className="dsn-dot-cap">{M.cap}</p>
        </div>
        <p className="dsn-dot-note" style={{ opacity: note ? 1 : 0 }}>
          {note || " "}
        </p>
        <div className="dsn-dot-rail" role="list">
          {ORDER.map((k) => {
            const m = MOODS[k];
            const on = k === mood;
            return (
              <button
                key={k}
                type="button"
                role="listitem"
                className="dsn-dot-row"
                aria-current={on || undefined}
                aria-label={`Play ${m.name}.`}
                onClick={() => engineRef.current?.jump(k)}
              >
                <span className="dsn-dot-tick" style={{ opacity: on ? 1 : 0 }} aria-hidden />
                <span className="dsn-dot-rownum" data-on={on || undefined}>{m.num}</span>
                <span className="dsn-dot-rowname" data-on={on || undefined}>{m.name}</span>
                <span className="dsn-dot-rowdur">{m.dur.toFixed(1)}s</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The stage */}
      <div className="dsn-dot-stagewrap">
        <div ref={stageRef} className="dsn-dot-stage">
          <i className="dsn-dot-corner dsn-dot-corner--tl" aria-hidden />
          <i className="dsn-dot-corner dsn-dot-corner--tr" aria-hidden />
          <i className="dsn-dot-corner dsn-dot-corner--bl" aria-hidden />
          <i className="dsn-dot-corner dsn-dot-corner--br" aria-hidden />
          <span className="dsn-dot-meta dsn-dot-meta--tl" aria-hidden>Stage · 102px</span>
          <span className="dsn-dot-meta dsn-dot-meta--tr" aria-hidden>
            Loop {M.dur.toFixed(1)}s · {M.bars} {M.bars === 1 ? "bar" : "bars"}
          </span>
          <span className="dsn-dot-meta dsn-dot-meta--bl" aria-hidden>
            poke it · drag it · or let the reel run
          </span>

          <div className="dsn-dot-floor" aria-hidden />

          <div className="dsn-dot-rig">
            <div ref={shadowRef} className="dsn-dot-shadow" aria-hidden />
            {[0.4, 0.22, 0.1].map((o, i) => (
              <div key={i} className="dsn-dot-ghostwrap" style={{ opacity: o }} aria-hidden>
                <div
                  ref={(el) => {
                    ghostRefs.current[i] = el;
                  }}
                  className="dsn-dot-ghost"
                />
              </div>
            ))}
            <div ref={dropRef} className="dsn-dot-drop" aria-hidden />
            <div
              ref={bodyRef}
              className="dsn-dot-body"
              role="button"
              tabIndex={0}
              aria-label="Dot, Idle. Press to poke. Drag to lean."
              title="poke Dot"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
