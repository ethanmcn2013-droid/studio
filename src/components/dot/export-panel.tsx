"use client";
import { useEffect, useRef, useState } from "react";
import { DotPlayer } from "@/lib/dot/player";
import { DOT_VERSION, type DotColor } from "@/lib/dot/model";
import { renderSvg } from "@/lib/dot/render";
import { DotIcon } from "./dot-svg";

export function DotExportPanel({
  player,
  color,
  effects,
  onPause,
}: {
  player: DotPlayer;
  color: DotColor;
  effects: boolean;
  onPause: () => void;
}) {
  const [size, setSize] = useState(1080),
    [busy, setBusy] = useState(false),
    [progress, setProgress] = useState({ done: 0, total: 0 });
  const [message, setMessage] = useState(""),
    [file, setFile] = useState<{
      url: string;
      name: string;
      spec: string;
    } | null>(null);
  const abort = useRef<AbortController | null>(null),
    url = useRef<string | null>(null);
  useEffect(
    () => () => {
      abort.current?.abort();
      if (url.current) URL.revokeObjectURL(url.current);
    },
    [],
  );
  const run = async (sequence: boolean) => {
    onPause();
    const controller = new AbortController();
    abort.current = controller;
    const clip = player.clip,
      seed = player.seed,
      pose = player.pose(),
      frame = Math.round(player.time * 60),
      duration = player.duration;
    setBusy(true);
    setMessage("");
    setProgress({ done: 0, total: Math.round(player.duration * 60) });
    try {
      const { exportSequence, svgPng } = await import(
        "@/lib/dot/export-browser"
      );
      controller.signal.throwIfAborted();
      const blob = sequence
        ? await exportSequence({
            clip,
            seed,
            size,
            color,
            effects,
            signal: controller.signal,
            progress: (done, total) => setProgress({ done, total }),
          })
        : await svgPng(
            renderSvg(pose, { size, color, effects, stage: "transparent" }),
            size,
          );
      controller.signal.throwIfAborted();
      if (url.current) URL.revokeObjectURL(url.current);
      url.current = URL.createObjectURL(blob);
      setFile({
        url: url.current,
        name: sequence
          ? `dot-${clip}-${size}-60fps.zip`
          : `dot-${clip}-f${frame}-${size}.png`,
        spec: `${size} × ${size} · transparent · ${sequence ? `60 fps · ${duration.toFixed(2)} s · ` : ""}v${DOT_VERSION}`,
      });
      setMessage("Your export is ready.");
    } catch (e) {
      if (controller.signal.aborted)
        setMessage("Export cancelled. Your take is still here.");
      else
        setMessage(
          e instanceof Error ? e.message : "Export failed. Try a smaller size.",
        );
    } finally {
      if (abort.current === controller) {
        abort.current = null;
        setBusy(false);
      }
    }
  };
  return (
    <div className="dot-export-panel">
      <div>
        <h3>Take Dot with you.</h3>
        <p>Transparent assets, rendered from the motion itself.</p>
      </div>
      <div className="dot-export-actions">
        <select
          aria-label="Export size"
          value={size}
          disabled={busy}
          onChange={(e) => setSize(Number(e.target.value))}
        >
          {[512, 1080, 1458].map((v) => (
            <option key={v} value={v}>
              {v} × {v}
            </option>
          ))}
        </select>
        <button
          className="dot-secondary"
          disabled={busy}
          onClick={() => run(false)}
        >
          Export current PNG
        </button>
        <button
          className="dot-primary"
          disabled={busy}
          onClick={() => run(true)}
        >
          <DotIcon kind="download" size={16} />
          Export PNG sequence
        </button>
        {busy && (
          <button
            className="dot-text-button"
            onClick={() => abort.current?.abort()}
          >
            Cancel export
          </button>
        )}
      </div>
      {busy && (
        <div className="dot-export-progress">
          <progress
            value={progress.done}
            max={progress.total || 1}
            aria-label="Frames rendered"
          />
          <span>
            {progress.done} / {progress.total} frames
          </span>
        </div>
      )}
      <p className="dot-inspector-status" role="status">
        {message}
      </p>
      {file && (
        <a className="dot-export-result" href={file.url} download={file.name}>
          <DotIcon kind="download" />
          <span>
            {file.name}
            <small>{file.spec}</small>
          </span>
        </a>
      )}
    </div>
  );
}
