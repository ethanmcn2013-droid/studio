"use client";

import type { CSSProperties } from "react";
import type { AtlasObject } from "../types";
import { healthLabel } from "../utils/atlas-scoring";
import { dotClass, typeLabel, barValue } from "../utils/view";

export type NodeState = "active" | "connected" | "dim" | "emphasized" | "muted" | "normal";

const STATE_CLASS: Record<NodeState, string> = {
  active: "is-active",
  connected: "",
  dim: "is-dim",
  emphasized: "",
  muted: "is-muted",
  normal: "",
};

export function AtlasNode({
  node,
  state,
  isCenter,
  onFocus,
  onHover,
  style,
}: {
  node: AtlasObject;
  state: NodeState;
  isCenter: boolean;
  onFocus: (id: string) => void;
  onHover: (id: string | null) => void;
  style?: CSSProperties;
}) {
  const bar = barValue(node);
  const label = `${node.name}. ${healthLabel(node.health)}${
    bar !== null ? `, at ${bar} of 100` : ""
  }`;

  return (
    <button
      type="button"
      className={`atlas-node ${isCenter ? "atlas-node--center" : ""} ${STATE_CLASS[state]}`}
      style={style}
      aria-label={label}
      aria-pressed={state === "active"}
      onClick={() => onFocus(node.id)}
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(node.id)}
      onBlur={() => onHover(null)}
    >
      <span className="atlas-node-type">
        {isCenter ? <span className="atlas-node-mark" aria-hidden="true">●</span> : null}
        {typeLabel(node.type)}
      </span>
      <span className="atlas-node-name">{node.name}</span>

      {isCenter ? (
        <span className="atlas-node-sub">{node.purpose}</span>
      ) : (
        <>
          <span className="atlas-node-health">
            <span className={dotClass(node.health)} aria-hidden="true" />
            {healthLabel(node.health)}
          </span>
          {bar !== null ? (
            <span className="atlas-bar" aria-hidden="true">
              <span className="atlas-bar-fill" style={{ width: `${bar}%` }} />
            </span>
          ) : null}
        </>
      )}
    </button>
  );
}
