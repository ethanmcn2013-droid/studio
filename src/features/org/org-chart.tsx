"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CLUSTERS,
  DIRECTORS,
  ELT_SNAPSHOT,
  directorsByCluster,
  formatCadence,
  getDirector,
  type Director,
} from "@/lib/hq/elt";
import { roleTitle, directorClusters, orgStats } from "./org-utils";
import { coordinationPartners } from "./org-coordination";
import { OrgAvatar } from "./org-avatars";
import { OrgDetailPanel } from "./org-detail-panel";
import { OrgSearch } from "./org-search";

type Edge = { id: string; x1: number; y1: number; x2: number; y2: number };

export function OrgChart() {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [edges, setEdges] = useState<Edge[]>([]);

  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const clusters = useMemo(() => directorClusters(CLUSTERS), []);
  const stats = useMemo(() => orgStats(DIRECTORS, clusters.length), [clusters]);

  const focused = focusedId ? getDirector(focusedId) ?? null : null;
  const peerIds = useMemo(() => {
    if (!focused) return new Set<string>();
    return new Set(
      DIRECTORS.filter((d) => d.cluster === focused.cluster && d.id !== focused.id).map((d) => d.id),
    );
  }, [focused]);
  const coordIds = useMemo(
    () => (focusedId ? coordinationPartners(focusedId) : []),
    [focusedId],
  );
  const coordSet = useMemo(() => new Set(coordIds), [coordIds]);

  const clusterLabel = useCallback((id: string) => {
    return CLUSTERS.find((c) => c.id === id)?.label ?? "";
  }, []);

  // Measure the coordination edges (focused node → partners) in stage-local px.
  useLayoutEffect(() => {
    if (!focusedId) {
      setEdges([]);
      return;
    }
    function measure() {
      const stage = stageRef.current;
      const from = focusedId ? nodeRefs.current[focusedId] : null;
      if (!stage || !from) {
        setEdges([]);
        return;
      }
      const s = stage.getBoundingClientRect();
      const f = from.getBoundingClientRect();
      const fx = f.left - s.left + f.width / 2;
      const fy = f.top - s.top + f.height / 2;
      const next: Edge[] = coordIds
        .map((pid): Edge | null => {
          const el = nodeRefs.current[pid];
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            id: pid,
            x1: fx,
            y1: fy,
            x2: r.left - s.left + r.width / 2,
            y2: r.top - s.top + r.height / 2,
          };
        })
        .filter((e): e is Edge => e !== null);
      setEdges(next);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [focusedId, coordIds]);

  // Global keyboard: `/` opens search, Esc clears focus.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (searchOpen) return;
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "Escape" && focusedId) {
        e.preventDefault();
        setFocusedId(null);
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "/") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, focusedId]);

  function nodeStateClass(d: Director): string {
    if (!focused) return "";
    if (d.id === focused.id) return "is-active";
    if (peerIds.has(d.id) || coordSet.has(d.id)) return "is-peer";
    return "is-dim";
  }

  return (
    <div className="orgc">
      <div className="orgc-stats" aria-label="Org breakdown">
        {stats.map((s) => (
          <div key={s.label} className="orgc-stat">
            <div className="orgc-stat-value">{s.value}</div>
            <div className="orgc-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="orgc-legend-row">
        <div className="orgc-legend" aria-label="Legend">
          <span className="orgc-legend-item">
            <span className="orgc-legend-badge">L2</span> recommend
          </span>
          <span className="orgc-legend-item">
            <span className="orgc-legend-badge">L3</span> decide, then log
          </span>
          <span className="orgc-legend-item">
            <span className="orgc-legend-badge">veto</span> stop authority
          </span>
          <span className="orgc-legend-item">
            <span className="orgc-legend-swatch" aria-hidden="true" /> information sharing
          </span>
        </div>
        <button
          type="button"
          className="atlas-search-trigger"
          onClick={() => setSearchOpen(true)}
        >
          Search <span className="atlas-kbd">/</span>
        </button>
      </div>

      <div
        className="orgc-stage"
        ref={stageRef}
        onClick={(e) => {
          if (e.target === e.currentTarget && focusedId) setFocusedId(null);
        }}
      >
        {edges.length ? (
          <svg className="orgc-overlay" aria-hidden="true">
            {edges.map((e) => (
              <g key={e.id}>
                <line className="orgc-edge" x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
                <circle className="orgc-edge-dot" cx={e.x2} cy={e.y2} r="2.5" />
              </g>
            ))}
          </svg>
        ) : null}

        <div className="orgc-apex">
          <div className="orgc-apex-card">
            <div className="orgc-apex-eyebrow">apex</div>
            <div className="orgc-apex-name">{ELT_SNAPSHOT.founderName}</div>
            <div className="orgc-apex-role">{ELT_SNAPSHOT.founderRole}</div>
          </div>
          <div className="orgc-spine" aria-hidden="true" />
          <div className="orgc-rail" aria-hidden="true" />
        </div>

        <div className="orgc-columns">
          {clusters.map((cluster) => {
            const members = directorsByCluster(cluster.id);
            return (
              <div key={cluster.id} className="orgc-col">
                <div className="orgc-col-stub" aria-hidden="true" />
                <div className="orgc-col-head">
                  <div className="orgc-col-title">{cluster.label}</div>
                  <div className="orgc-col-count">
                    {members.length} director{members.length === 1 ? "" : "s"}
                  </div>
                </div>
                <ul className="orgc-col-list" role="list">
                  {members.map((d) => (
                    <li key={d.id}>
                      <OrgNode
                        director={d}
                        stateClass={nodeStateClass(d)}
                        onFocus={() => setFocusedId(d.id)}
                        registerRef={(el) => {
                          nodeRefs.current[d.id] = el;
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {focused ? (
          <OrgDetailPanel
            director={focused}
            clusterLabel={clusterLabel(focused.cluster)}
            peers={DIRECTORS.filter((d) => d.cluster === focused.cluster && d.id !== focused.id)}
            founderName={ELT_SNAPSHOT.founderName}
            onNavigate={setFocusedId}
            onClose={() => setFocusedId(null)}
          />
        ) : null}
      </div>

      {searchOpen ? (
        <OrgSearch
          directors={DIRECTORS}
          onPick={(id) => {
            setFocusedId(id);
            setSearchOpen(false);
          }}
          onClose={() => setSearchOpen(false)}
        />
      ) : null}
    </div>
  );
}

function OrgNode({
  director: d,
  stateClass,
  onFocus,
  registerRef,
}: {
  director: Director;
  stateClass: string;
  onFocus: () => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={registerRef}
      type="button"
      className={`orgc-node ${stateClass}`}
      aria-label={`${roleTitle(d.name)}, ${d.persona}, ${d.autonomyLayer === 3 ? "layer 3" : "layer 2"}`}
      aria-pressed={stateClass === "is-active"}
      onClick={onFocus}
    >
      <span className="orgc-avatar" aria-hidden="true">
        <OrgAvatar id={d.id} title={d.persona} />
      </span>
      <span className="orgc-body">
        <span className="orgc-role">{roleTitle(d.name)}</span>
        <span className="orgc-persona">
          {d.shortName} · {formatCadence(d.cadence)}
        </span>
        <span className="orgc-badges">
          <span className={`orgc-badge ${d.autonomyLayer === 3 ? "orgc-badge--l3" : ""}`}>
            {d.autonomyLayer === 3 ? "L3" : "L2"}
          </span>
          {d.veto?.length ? <span className="orgc-badge orgc-badge--veto">veto</span> : null}
          {d.product ? (
            <span className="orgc-badge orgc-badge--product">{d.product}</span>
          ) : null}
        </span>
      </span>
    </button>
  );
}
