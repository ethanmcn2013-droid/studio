"use client";

import type { AtlasConnection, AtlasObject } from "../types";

/**
 * The connection layer. Static SVG geometry drawn beneath the nodes; only
 * className (colour/opacity) changes on interaction — no per-frame JS. Uses a
 * 0..100 viewBox with preserveAspectRatio="none" so coordinates match the
 * percentage-positioned nodes exactly; strokes stay crisp via non-scaling-stroke.
 */
export function AtlasConnectionLayer({
  connections,
  nodesById,
  dimUnlit,
  litEdgeIds,
  emphasis,
}: {
  connections: AtlasConnection[];
  nodesById: Record<string, AtlasObject>;
  /** When a node is click-focused, unlit edges dim. Hover only lights, no dim. */
  dimUnlit: boolean;
  litEdgeIds: Set<string>;
  /** Node ids emphasized by the current lens (empty = all). */
  emphasis: Set<string>;
}) {
  return (
    <svg
      className="atlas-edges"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {connections.map((c) => {
        const from = nodesById[c.from]?.position;
        const to = nodesById[c.to]?.position;
        if (!from || !to) return null;

        const strengthClass =
          c.strength === "strong"
            ? "atlas-edge--strong"
            : c.strength === "subtle"
              ? "atlas-edge--subtle"
              : "";

        let stateClass = "";
        if (litEdgeIds.has(c.id)) {
          stateClass = "is-lit";
        } else if (dimUnlit) {
          stateClass = "is-dim";
        } else if (emphasis.size > 0) {
          const bothEmphasized = emphasis.has(c.from) && emphasis.has(c.to);
          // Ownership edges to an emphasized domain stay visible from the center.
          const ownershipToEmphasis =
            c.type === "ownership" && emphasis.has(c.to);
          stateClass = bothEmphasized || ownershipToEmphasis ? "" : "is-dim";
        }

        return (
          <line
            key={c.id}
            className={`atlas-edge ${strengthClass} ${stateClass}`}
            x1={from.x * 100}
            y1={from.y * 100}
            x2={to.x * 100}
            y2={to.y * 100}
          />
        );
      })}
    </svg>
  );
}
