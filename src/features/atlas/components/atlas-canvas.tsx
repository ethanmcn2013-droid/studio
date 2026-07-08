"use client";

import type { MouseEvent } from "react";
import type { AtlasConnection, AtlasObject } from "../types";
import { AtlasNode, type NodeState } from "./atlas-node";
import { AtlasConnectionLayer } from "./atlas-connection-layer";

export function AtlasCanvas({
  nodes,
  nodesById,
  connections,
  focusedId,
  emphasis,
  connectedNodeIds,
  litEdgeIds,
  onFocus,
  onHover,
  onClearFocus,
}: {
  nodes: AtlasObject[];
  nodesById: Record<string, AtlasObject>;
  connections: AtlasConnection[];
  focusedId: string | null;
  emphasis: Set<string>;
  connectedNodeIds: Set<string>;
  litEdgeIds: Set<string>;
  onFocus: (id: string) => void;
  onHover: (id: string | null) => void;
  onClearFocus: () => void;
}) {
  const focusMode = focusedId !== null;

  function nodeState(node: AtlasObject): NodeState {
    const isCenter = node.type === "company";
    if (focusMode) {
      if (node.id === focusedId) return "active";
      if (connectedNodeIds.has(node.id)) return "connected";
      return "dim";
    }
    if (emphasis.size > 0) {
      if (isCenter || emphasis.has(node.id)) return "emphasized";
      return "muted";
    }
    return "normal";
  }

  function handleBackgroundClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && focusMode) onClearFocus();
  }

  return (
    <div
      className="atlas-canvas atlas-canvas--wide"
      role="group"
      aria-label="Signal Studio operating map. Select a system to see detail."
      onClick={handleBackgroundClick}
    >
      <AtlasConnectionLayer
        connections={connections}
        nodesById={nodesById}
        dimUnlit={focusMode}
        litEdgeIds={litEdgeIds}
        emphasis={emphasis}
      />
      {nodes.map((node) => {
        const isCenter = node.type === "company";
        const pos = node.position ?? { x: 0.5, y: 0.5 };
        return (
          <AtlasNode
            key={node.id}
            node={node}
            state={nodeState(node)}
            isCenter={isCenter}
            onFocus={onFocus}
            onHover={onHover}
            style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}
          />
        );
      })}
    </div>
  );
}
