"use client";
import { useState } from "react";
import { DotPlayer } from "@/lib/dot/player";
import { FPS, GESTURES, type DotColor } from "@/lib/dot/model";
import { DotIcon } from "./dot-svg";
import { DotExportPanel } from "./export-panel";

export function DotInspector(p: {
  player: DotPlayer;
  revision: number;
  seek: (frame: number) => void;
  paint: () => void;
  wake: () => void;
  setPlaying: (v: boolean) => void;
  color: DotColor;
  setColor: (v: DotColor) => void;
  effects: boolean;
  setEffects: (v: boolean) => void;
  speed: number;
  setSpeed: (v: number) => void;
  seed: number;
  setSeed: (v: number) => void;
  downloadSvg: () => void;
}) {
  const [start, setStart] = useState(0),
    [end, setEnd] = useState(Math.round(p.player.duration * FPS));
  const [message, setMessage] = useState("");
  return (
    <section className="dot-inspector" aria-label="Motion inspector">
      <div className="dot-section-heading">
        <div>
          <h2>Inside the motion.</h2>
          <p>Frame by frame, down to the smallest glance.</p>
        </div>
        <span>Local authoring tools</span>
      </div>
      <div className="dot-inspector-grid">
        <fieldset>
          <legend>Playback</legend>
          <div className="dot-control-row">
            <button
              className="dot-secondary"
              aria-label="Previous frame"
              onClick={() => p.seek(Math.round(p.player.time * FPS) - 1)}
            >
              <DotIcon kind="back" />
            </button>
            <button
              className="dot-secondary"
              aria-label="Next frame"
              onClick={() => p.seek(Math.round(p.player.time * FPS) + 1)}
            >
              <DotIcon kind="next" />
            </button>
            <select
              aria-label="Playback speed"
              value={p.speed}
              onChange={(e) => p.setSpeed(Number(e.target.value))}
            >
              {[0.25, 0.5, 1].map((v) => (
                <option key={v} value={v}>
                  {v}× speed
                </option>
              ))}
            </select>
          </div>
          <label>
            Seed
            <input
              type="number"
              min="0"
              max="2147483647"
              value={p.seed}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isInteger(n) && n >= 0 && n <= 2147483647)
                  p.setSeed(n);
              }}
            />
          </label>
        </fieldset>
        <fieldset>
          <legend>Loop a passage</legend>
          <div className="dot-control-row">
            <label>
              First frame
              <input
                type="number"
                min="0"
                value={start}
                onChange={(e) => setStart(Number(e.target.value))}
              />
            </label>
            <label>
              End, exclusive
              <input
                type="number"
                min="1"
                value={end}
                onChange={(e) => setEnd(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="dot-control-row">
            <button
              className="dot-secondary"
              onClick={() => {
                try {
                  p.player.setRegion(start / FPS, end / FPS);
                  p.player.play();
                  p.setPlaying(p.player.playing);
                  p.paint();
                  p.wake();
                  setMessage(`Looping frames ${start}–${end - 1}.`);
                } catch (e) {
                  setMessage((e as Error).message);
                }
              }}
            >
              Set loop
            </button>
            <button
              className="dot-text-button"
              onClick={() => {
                p.player.clearRegion();
                setMessage("Full performance restored.");
              }}
            >
              Clear loop
            </button>
          </div>
        </fieldset>
        <fieldset>
          <legend>Character</legend>
          <div className="dot-color-options">
            {(["indigo", "ink", "paper"] as const).map((c) => (
              <button
                key={c}
                aria-label={`${c} Dot`}
                aria-pressed={c === p.color}
                data-color={c}
                onClick={() => p.setColor(c)}
              />
            ))}
          </div>
          <label className="dot-checkbox">
            <input
              type="checkbox"
              checked={p.effects}
              onChange={(e) => p.setEffects(e.target.checked)}
            />
            Secondary effects
          </label>
          <button className="dot-secondary" onClick={p.downloadSvg}>
            <DotIcon kind="download" size={16} />
            Export current SVG
          </button>
        </fieldset>
        <fieldset>
          <legend>Reactions</legend>
          <div className="dot-reactions">
            {GESTURES.map((g) => (
              <button
                className="dot-text-button"
                key={g}
                disabled={
                  p.player.reduced ||
                  !p.player.playing ||
                  p.player.clip === "film"
                }
                onClick={() => {
                  p.player.poke(g);
                  p.paint();
                  p.wake();
                }}
              >
                {g}
              </button>
            ))}
          </div>
        </fieldset>
      </div>
      <p className="dot-inspector-status" role="status">
        {message ||
          "SVG exports preserve a transparent background and the current pose."}
      </p>
      <DotExportPanel
        player={p.player}
        color={p.color}
        effects={p.effects}
        onPause={() => {
          p.player.pause();
          p.setPlaying(false);
          p.paint();
        }}
      />
    </section>
  );
}
