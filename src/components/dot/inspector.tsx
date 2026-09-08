"use client";
import { useState, useEffect } from "react";
import { DotPlayer } from "@/lib/dot/player";
import { FPS, GESTURES, type DotColor } from "@/lib/dot/model";
import { DotIcon } from "./dot-svg";
import { DotExportPanel } from "./export-panel";
import { renderContents } from "@/lib/dot/render";

export function DotInspector({
  player,
  guides,
  face,
  setFace,
  setGuides,
  onReset,
  onReference,
  attachFrame,
  attachReference,
  attachComparison,
  seek,
  paint,
  wake,
  setPlaying,
  color,
  setColor,
  effects,
  setEffects,
  speed,
  setSpeed,
  seed,
  setSeed,
  downloadSvg,
}: {
  player: DotPlayer;
  guides: boolean;
  face: boolean;
  setFace: (value: boolean) => void;
  setGuides: (value: boolean) => void;
  onReset: () => void;
  onReference: () => void;
  attachFrame: (node: HTMLOutputElement | null) => void;
  attachReference: (node: HTMLVideoElement | null) => void;
  attachComparison: (node: SVGSVGElement | null) => void;
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
  const [range, setRange] = useState({
    clip: player.clip,
    start: 0,
    end: Math.round(player.duration * FPS),
  });
  const start = range.clip === player.clip ? range.start : 0;
  const end =
    range.clip === player.clip ? range.end : Math.round(player.duration * FPS);
  const [message, setMessage] = useState("");
  if (range.clip !== player.clip) {
    setRange({
      clip: player.clip,
      start: 0,
      end: Math.round(player.duration * FPS),
    });
    setMessage("");
  }
  const [reference, setReference] = useState<{
    url: string;
    name: string;
  } | null>(null);
  useEffect(
    () => () => {
      if (reference) URL.revokeObjectURL(reference.url);
    },
    [reference],
  );
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
          <output
            className="dot-frame-number"
            ref={attachFrame}
            aria-label="Current frame"
            aria-live="off"
          >
            F{String(Math.round(player.time * FPS)).padStart(4, "0")} /{" "}
            {Math.round(player.duration * FPS)}
          </output>
          <div className="dot-control-row">
            <button
              className="dot-secondary"
              aria-label="Previous frame"
              onClick={() => seek(Math.round(player.time * FPS) - 1)}
            >
              <DotIcon kind="back" />
            </button>
            <button
              className="dot-secondary"
              aria-label="Next frame"
              onClick={() => seek(Math.round(player.time * FPS) + 1)}
            >
              <DotIcon kind="next" />
            </button>
            <select
              aria-label="Playback speed"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
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
              value={seed}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (Number.isInteger(n) && n >= 0 && n <= 2147483647)
                  setSeed(n);
              }}
            />
          </label>
          <button className="dot-text-button" onClick={onReset}>
            Reset to neutral
          </button>
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
                onChange={(e) =>
                  setRange({
                    clip: player.clip,
                    start: Number(e.target.value),
                    end,
                  })
                }
              />
            </label>
            <label>
              End, exclusive
              <input
                type="number"
                min="1"
                value={end}
                onChange={(e) =>
                  setRange({
                    clip: player.clip,
                    start,
                    end: Number(e.target.value),
                  })
                }
              />
            </label>
          </div>
          <div className="dot-control-row">
            <button
              className="dot-secondary"
              onClick={() => {
                try {
                  if (!Number.isInteger(start) || !Number.isInteger(end))
                    throw new Error("Use whole frame numbers for the loo");
                  player.setRegion(start / FPS, end / FPS);
                  player.play();
                  setPlaying(player.playing);
                  paint();
                  wake();
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
                player.clearRegion();
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
                aria-pressed={c === color}
                data-color={c}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <label className="dot-checkbox">
            <input
              type="checkbox"
              checked={effects}
              onChange={(e) => setEffects(e.target.checked)}
            />
            Secondary effects
          </label>
          <label className="dot-checkbox">
            <input
              type="checkbox"
              checked={guides}
              onChange={(e) => setGuides(e.target.checked)}
            />
            Safe-area guide
          </label>
          <label className="dot-checkbox">
            <input
              type="checkbox"
              checked={face}
              onChange={(e) => setFace(e.target.checked)}
            />
            Face layer
          </label>
          <button className="dot-secondary" onClick={downloadSvg}>
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
                  player.reduced || !player.playing || player.clip === "film"
                }
                onClick={() => {
                  player.poke(g);
                  paint();
                  wake();
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
      <div className="dot-reference-panel">
        <div className="dot-section-heading">
          <div>
            <h3>Compare the same moment.</h3>
            <p>Open a local reference, then pause or step through the film.</p>
          </div>
          <label className="dot-import">
            {reference ? "Change reference" : "Open reference video"}
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 250 * 1024 * 1024) {
                  setMessage("Choose a reference video smaller than 250 MB.");
                  return;
                }
                setReference({
                  url: URL.createObjectURL(file),
                  name: file.name,
                });
                onReference();
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {reference && (
          <>
            <p className="dot-reference-name">
              {reference.name} ·{" "}
              {player.playing
                ? "Pause the film to compare still frames."
                : "Both views follow the performance frame."}
            </p>
            <div className="dot-reference-pair">
              <figure>
                <video
                  ref={attachReference}
                  src={reference.url}
                  muted
                  playsInline
                  preload="auto"
                  onLoadedMetadata={paint}
                  onError={() =>
                    setMessage(
                      "This browser could not open that video. Choose an MP4 or WebM reference.",
                    )
                  }
                />
                <figcaption>Reference</figcaption>
              </figure>
              <figure>
                <svg
                  ref={attachComparison}
                  viewBox="-95 -95 190 190"
                  aria-label="Dot at the comparison frame"
                  role="img"
                  dangerouslySetInnerHTML={{
                    __html: renderContents(player.pose(), {
                      color: color,
                      stage: "paper",
                      effects: effects,
                      face: face,
                    }),
                  }}
                />
                <figcaption>Dot</figcaption>
              </figure>
            </div>
          </>
        )}
      </div>
      <DotExportPanel
        player={player}
        color={color}
        effects={effects}
        face={face}
        onPause={() => {
          player.pause();
          setPlaying(false);
          paint();
        }}
      />
    </section>
  );
}
