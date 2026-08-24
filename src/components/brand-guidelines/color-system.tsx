"use client";

import { useRef, useState } from "react";
import tokens from "../../../public/brand/guidelines/signal-studio-tokens.json";

type Mode = "system" | "proportions";

const SWATCHES = [
  { name: "Paper", token: "--paper", value: tokens.color.paper, className: "is-paper" },
  { name: "Ink", token: "--ink", value: tokens.color.ink, className: "is-ink" },
  { name: "Indigo", token: "--accent", value: tokens.color.indigo, className: "is-indigo" },
  { name: "Paper soft", token: "--paper-soft", value: tokens.color.paperSoft, className: "is-paper-soft" },
  { name: "Paper deep", token: "--paper-deep", value: tokens.color.paperDeep, className: "is-paper-deep" },
  { name: "Ink soft", token: "--ink-soft", value: tokens.color.inkSoft, className: "is-ink-soft" },
  { name: "Ink faint", token: "--ink-faint", value: tokens.color.inkFaint, className: "is-ink-faint" },
  { name: "Ink ghost", token: "--ink-ghost", value: tokens.color.inkGhost, className: "is-ink-ghost" },
] as const;

export function ColorSystem() {
  const [mode, setMode] = useState<Mode>("system");
  const [status, setStatus] = useState("Choose a swatch to copy its token and value.");
  const systemRef = useRef<HTMLButtonElement>(null);
  const proportionsRef = useRef<HTMLButtonElement>(null);

  const choose = (next: Mode) => {
    setMode(next);
    if (next === "system") systemRef.current?.focus();
    else proportionsRef.current?.focus();
  };

  const copy = async (token: string, value: string) => {
    await navigator.clipboard.writeText(`${token}: ${value};`);
    setStatus(`Copied ${token}: ${value}.`);
  };

  return (
    <div className="guidelines-color-system" data-mode={mode}>
      <div
        className="guidelines-segmented"
        role="group"
        aria-label="Color specimen view"
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          choose(mode === "system" ? "proportions" : "system");
        }}
      >
        <button
          ref={systemRef}
          type="button"
          aria-pressed={mode === "system"}
          onClick={() => setMode("system")}
        >
          System
        </button>
        <button
          ref={proportionsRef}
          type="button"
          aria-pressed={mode === "proportions"}
          onClick={() => setMode("proportions")}
        >
          Proportions
        </button>
      </div>

      <div className="guidelines-color-stage">
        <div className="guidelines-color-mosaic" aria-hidden={mode !== "system"}>
          {SWATCHES.map((swatch) => (
            <button
              key={swatch.token}
              type="button"
              className={swatch.className}
              title="Copy token and value"
              onClick={() => copy(swatch.token, swatch.value)}
              tabIndex={mode === "system" ? 0 : -1}
            >
              <span>{swatch.name}</span>
              <span>{swatch.value}</span>
              <span>{swatch.token}</span>
            </button>
          ))}
        </div>

        <div
          className="guidelines-proportions"
          aria-hidden={mode !== "proportions"}
        >
          <div className="guidelines-proportion-field">
            <span className="is-paper">88% paper</span>
            <span className="is-ink">10% ink</span>
            <span className="is-indigo">at most 2% indigo</span>
          </div>
          <p>
            Indigo marks the one thing that needs attention. It does not decorate
            the room.
          </p>
        </div>
      </div>

      <p className="guidelines-sr-status" role="status" aria-live="polite">
        {status}
      </p>

      <div className="guidelines-functional-colors">
        <p>Functional UI only</p>
        <div>
          <span><i className="is-done" />Done</span>
          <span><i className="is-flight" />In progress</span>
          <span><i className="is-blocked" />Blocked</span>
          <span><i className="is-next" />Next</span>
        </div>
      </div>
    </div>
  );
}
