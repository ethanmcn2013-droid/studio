"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AtlasLens, AtlasObject, AtlasSnapshot } from "../types";
import { ATLAS_GRAPH, ATLAS_NODES } from "../data/atlas-graph";
import { resolveNode } from "../utils/view";
import { AtlasLensSwitcher } from "./atlas-lens-switcher";
import { AtlasMissionControl } from "./atlas-mission-control";
import { AtlasCanvas } from "./atlas-canvas";
import { AtlasDetailPanel } from "./atlas-detail-panel";
import { AtlasInvestorSnapshot } from "./atlas-investor-snapshot";
import { AtlasSearch } from "./atlas-search";
import { dotClass } from "../utils/view";
import { healthLabel } from "../utils/atlas-scoring";

const LEGEND: Array<Parameters<typeof dotClass>[0]> = [
  "healthy",
  "attention",
  "blocked",
  "unknown",
];

export function AtlasExperience({ snapshot }: { snapshot: AtlasSnapshot }) {
  const [lens, setLens] = useState<AtlasLens>("founder");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const lenses = ATLAS_GRAPH.lenses;
  const lensConfig = useMemo(
    () => lenses.find((l) => l.id === lens) ?? lenses[0],
    [lenses, lens],
  );
  const emphasis = useMemo(() => new Set(lensConfig.emphasis), [lensConfig]);

  // Merge the curated graph with the live snapshot once.
  const resolved = useMemo(() => {
    const list = ATLAS_NODES.map((n) => resolveNode(n, snapshot.domainSignals[n.id]));
    const byId: Record<string, AtlasObject> = Object.fromEntries(
      list.map((n) => [n.id, n]),
    );
    return { list, byId };
  }, [snapshot]);

  // Neighbours of a node id: the other endpoints and the touching edge ids.
  const neighbours = useCallback((id: string | null) => {
    const nodes = new Set<string>();
    const edges = new Set<string>();
    if (!id) return { nodes, edges };
    for (const c of ATLAS_GRAPH.connections) {
      if (c.from === id) {
        nodes.add(c.to);
        edges.add(c.id);
      } else if (c.to === id) {
        nodes.add(c.from);
        edges.add(c.id);
      }
    }
    return { nodes, edges };
  }, []);

  const connectedNodeIds = useMemo(
    () => neighbours(focusedId).nodes,
    [neighbours, focusedId],
  );
  // Edges light from the focused node, or (softly) from a hovered node.
  const litEdgeIds = useMemo(
    () => neighbours(focusedId ?? hoveredId).edges,
    [neighbours, focusedId, hoveredId],
  );

  const domainIds = useMemo(() => ATLAS_GRAPH.domains.map((d) => d.id), []);

  // Global keyboard: `/` search, digits switch lens, Esc clears, arrows move.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (searchOpen) return; // the search overlay owns keys while open
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (e.key === "Escape") {
        if (focusedId) {
          e.preventDefault();
          setFocusedId(null);
        }
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "/") {
        e.preventDefault();
        setSearchOpen(true);
        return;
      }
      const digit = Number(e.key);
      if (digit >= 1 && digit <= lenses.length) {
        e.preventDefault();
        setLens(lenses[digit - 1].id);
        return;
      }
      if (focusedId && ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        const current = domainIds.indexOf(focusedId);
        const start = current === -1 ? 0 : current;
        const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
        const next = (start + dir + domainIds.length) % domainIds.length;
        setFocusedId(domainIds[next]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, focusedId, lenses, domainIds]);

  const focusedNode = focusedId ? resolved.byId[focusedId] : null;

  return (
    <div className="atlas">
      <header>
        <div className="atlas-eyebrow">signal hq · atlas</div>
        <h1 className="atlas-title">Signal Studio Atlas</h1>
        <p className="atlas-tagline">
          A living map of how Signal Studio thinks, builds, ships, and operates.
          Every object has a purpose. Every connection has a reason.
        </p>
      </header>

      <AtlasLensSwitcher lenses={lenses} active={lens} onChange={setLens} />
      <p className="atlas-lens-tagline">{lensConfig.tagline}</p>

      <AtlasMissionControl stats={snapshot.stats} asOf={snapshot.asOf} />

      <div className="atlas-toolbar">
        <div className="atlas-legend" aria-hidden="true">
          {LEGEND.map((h) => (
            <span key={h} className="atlas-legend-item">
              <span className={dotClass(h)} />
              {healthLabel(h)}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="atlas-search-trigger"
          onClick={() => setSearchOpen(true)}
        >
          Search the map <span className="atlas-kbd">/</span>
        </button>
      </div>

      <div className="atlas-stage">
        <AtlasCanvas
          nodes={resolved.list}
          nodesById={resolved.byId}
          connections={ATLAS_GRAPH.connections}
          focusedId={focusedId}
          emphasis={emphasis}
          connectedNodeIds={connectedNodeIds}
          litEdgeIds={litEdgeIds}
          onFocus={setFocusedId}
          onHover={setHoveredId}
          onClearFocus={() => setFocusedId(null)}
        />
        {focusedNode ? (
          <AtlasDetailPanel
            node={focusedNode}
            lens={lens}
            nodesById={resolved.byId}
            onNavigate={setFocusedId}
            onClose={() => setFocusedId(null)}
          />
        ) : null}
      </div>

      <AtlasInvestorSnapshot
        investor={snapshot.investor}
        placeholders={snapshot.placeholders}
      />

      {searchOpen ? (
        <AtlasSearch
          nodes={resolved.list}
          lenses={lenses}
          onPickNode={(id) => {
            setFocusedId(id);
            setSearchOpen(false);
          }}
          onPickLens={(id) => {
            setLens(id);
            setSearchOpen(false);
          }}
          onClose={() => setSearchOpen(false)}
        />
      ) : null}
    </div>
  );
}
