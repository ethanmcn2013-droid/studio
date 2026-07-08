"use client";

import { useRef } from "react";
import type { AtlasLens, AtlasLensConfig } from "../types";

/**
 * Lens switcher — a proper radiogroup. Roving tabindex + arrow keys move
 * within the group; number keys 1–7 are handled globally by the experience.
 */
export function AtlasLensSwitcher({
  lenses,
  active,
  onChange,
}: {
  lenses: AtlasLensConfig[];
  active: AtlasLens;
  onChange: (lens: AtlasLens) => void;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % lenses.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
      next = (index - 1 + lenses.length) % lenses.length;
    else return;
    e.preventDefault();
    onChange(lenses[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div className="atlas-lenses" role="radiogroup" aria-label="Atlas lens">
      {lenses.map((lens, i) => {
        const checked = lens.id === active;
        return (
          <button
            key={lens.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            className="atlas-lens"
            onClick={() => onChange(lens.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {lens.label}
          </button>
        );
      })}
    </div>
  );
}
