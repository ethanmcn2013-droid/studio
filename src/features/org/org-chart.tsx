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
  type Cluster,
  type Director,
} from "@/lib/hq/elt";
import { roleTitle, directorClusters, orgStats } from "./org-utils";
import {
  COORDINATION_EDGE_COUNT,
  UNIVERSAL_TOOLS,
  coordinationPartners,
} from "./org-coordination";
import { OrgAvatar } from "./org-avatars";
import { OrgDetailPanel } from "./org-detail-panel";
import { OrgSearch } from "./org-search";

type Edge = { id: string; x1: number; y1: number; x2: number; y2: number };
type CouncilFilter = "all" | Cluster;

const FOUNDATION_TOOLS = [
  "Director charters",
  "Decision logs",
  "Slack channels",
  "GitHub",
  "Vercel",
  "Linear",
  "Atlas map",
  ...UNIVERSAL_TOOLS,
];

export function OrgChart() {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [investorMode, setInvestorMode] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState<CouncilFilter>("all");

  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const clusters = useMemo(() => directorClusters(CLUSTERS), []);
  const visibleClusters = useMemo(
    () =>
      selectedCluster === "all"
        ? clusters
        : clusters.filter((cluster) => cluster.id === selectedCluster),
    [clusters, selectedCluster],
  );
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

  const selectedClusterLabel =
    selectedCluster === "all"
      ? "All councils"
      : CLUSTERS.find((c) => c.id === selectedCluster)?.label ?? "Council";

  const visibleDirectorCount = visibleClusters.reduce(
    (sum, cluster) => sum + directorsByCluster(cluster.id).length,
    0,
  );

  const clusterLabel = useCallback((id: string) => {
    return CLUSTERS.find((c) => c.id === id)?.label ?? "";
  }, []);

  // Measure the coordination edges (focused node -> partners) in stage-local px.
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
  }, [focusedId, coordIds, selectedCluster]);

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
    const classes: string[] = [];
    if (selectedCluster !== "all" && d.cluster !== selectedCluster) classes.push("is-filtered");
    if (focused) {
      if (d.id === focused.id) classes.push("is-active");
      else if (peerIds.has(d.id) || coordSet.has(d.id)) classes.push("is-peer");
      else classes.push("is-dim");
    }
    return classes.join(" ");
  }

  function chooseCluster(next: CouncilFilter) {
    setSelectedCluster(next);
    if (next !== "all" && focused && focused.cluster !== next) {
      setFocusedId(null);
    }
  }

  function focusTuringPath() {
    if (focusedId) {
      setFocusedId(null);
      return;
    }
    setSelectedCluster("all");
    setFocusedId("engineering-systems-architecture");
  }

  return (
    <div className="orgc" data-investor={investorMode ? "true" : "false"}>
      <div className="orgc-commandbar" aria-label="Org controls">
        <button
          type="button"
          className="orgc-search-command"
          onClick={() => setSearchOpen(true)}
        >
          Search directors, councils, portfolios <span className="atlas-kbd">/</span>
        </button>

        <div className="orgc-command-actions">
          <button
            type="button"
            className="orgc-mode-toggle"
            aria-pressed={investorMode}
            onClick={() => setInvestorMode((v) => !v)}
          >
            <span className="orgc-switch-dot" aria-hidden="true" />
            Investor mode
          </button>
          <button type="button" className="orgc-command-btn" onClick={focusTuringPath}>
            {focusedId ? "Clear focus" : "Focus Turing path"}
          </button>
          <a className="orgc-command-btn" href="/hq/atlas-map">
            Atlas map
          </a>
        </div>
      </div>

      <div className="orgc-stats" aria-label="Org breakdown">
        {stats.map((s) => (
          <div key={s.label} className="orgc-stat">
            <div className="orgc-stat-value">{s.value}</div>
            <div className="orgc-stat-label">{s.label}</div>
          </div>
        ))}
        <div className="orgc-stat orgc-stat--accent">
          <div className="orgc-stat-value">{COORDINATION_EDGE_COUNT}</div>
          <div className="orgc-stat-label">coordination paths</div>
        </div>
      </div>

      <div className="orgc-filterbar" role="group" aria-label="Council filter">
        <button
          type="button"
          onClick={() => chooseCluster("all")}
          aria-pressed={selectedCluster === "all"}
        >
          All councils
        </button>
        {clusters.map((cluster) => (
          <button
            key={cluster.id}
            type="button"
            onClick={() => chooseCluster(cluster.id)}
            aria-pressed={selectedCluster === cluster.id}
          >
            {cluster.label}
          </button>
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
        <div className="orgc-live-note">
          Showing {visibleDirectorCount} of {DIRECTORS.length} Directors in {selectedClusterLabel}
        </div>
      </div>

      <div className="orgc-stage" ref={stageRef}>
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

        <aside className="orgc-sidecar" aria-label="Map controls">
          <div className="orgc-minimap">
            <div className="orgc-side-title">map overview</div>
            <MiniMap clusters={clusters} selectedCluster={selectedCluster} />
          </div>
          <div className="orgc-layers">
            <div className="orgc-side-title">layers</div>
            <LayerRow label="L1" value="Founder" active />
            <LayerRow label="L2" value="Councils" active />
            <LayerRow label="L3" value="Directors" active />
            <LayerRow label="L4" value="Tools + evidence" active={investorMode} />
          </div>
        </aside>

        <div className="orgc-canvas" onClick={(e) => {
          if (e.target === e.currentTarget && focusedId) setFocusedId(null);
        }}>
          <div className="orgc-apex">
            <div className="orgc-apex-card">
              <div className="orgc-apex-eyebrow">founder and final call</div>
              <div className="orgc-apex-name">{ELT_SNAPSHOT.founderName}</div>
              <div className="orgc-apex-role">{ELT_SNAPSHOT.founderRole}</div>
              <div className="orgc-apex-meta">vision / strategy / allocation</div>
            </div>
            <div className="orgc-spine" aria-hidden="true" />
            <div className="orgc-band-label">4 council bands</div>
            <div className="orgc-rail" aria-hidden="true" />
          </div>

          <div className="orgc-columns">
            {visibleClusters.map((cluster) => {
              const members = directorsByCluster(cluster.id);
              return (
                <div key={cluster.id} className="orgc-col">
                  <div className="orgc-col-stub" aria-hidden="true" />
                  <div className="orgc-col-head">
                    <div>
                      <div className="orgc-col-title">{cluster.label}</div>
                      <div className="orgc-col-subtitle">{cluster.subtitle}</div>
                    </div>
                    <div className="orgc-col-count">
                      {members.length} director{members.length === 1 ? "" : "s"}
                    </div>
                  </div>
                  <ul className="orgc-col-list" role="list">
                    {members.map((d) => (
                      <li key={d.id}>
                        <OrgNode
                          director={d}
                          index={DIRECTORS.findIndex((item) => item.id === d.id) + 1}
                          investorMode={investorMode}
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

          <div className="orgc-foundation" aria-label="Tools and evidence foundation">
            <div className="orgc-foundation-label">platform, data, and tooling foundation</div>
            <div className="orgc-tool-strip">
              {FOUNDATION_TOOLS.map((tool) => (
                <span key={tool}>{tool}</span>
              ))}
            </div>
          </div>

          <div className="orgc-investor-read">
            <div>
              <div className="orgc-investor-kicker">investor read</div>
              <p>
                Ownership is explicit, authority is bounded, and the company has
                a standing system for quality, cadence, and escalation.
              </p>
            </div>
            <div className="orgc-investor-metrics" aria-label="Operating proof">
              <MiniMetric value="1" label="final call" />
              <MiniMetric value={String(DIRECTORS.length)} label="directors" />
              <MiniMetric value={String(COORDINATION_EDGE_COUNT)} label="paths" />
            </div>
          </div>
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
  index,
  investorMode,
  stateClass,
  onFocus,
  registerRef,
}: {
  director: Director;
  index: number;
  investorMode: boolean;
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
      aria-pressed={stateClass.includes("is-active")}
      onClick={onFocus}
    >
      <span className="orgc-node-index">{String(index).padStart(2, "0")}</span>
      <span className="orgc-avatar" aria-hidden="true">
        <OrgAvatar id={d.id} title={d.persona} />
      </span>
      <span className="orgc-body">
        <span className="orgc-role">{roleTitle(d.name)}</span>
        <span className="orgc-persona">
          {investorMode ? d.oneLine : `${d.shortName} / ${formatCadence(d.cadence)}`}
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
      <span className="orgc-node-signals" aria-hidden="true">
        <span data-tone="green" />
        <span data-tone={d.autonomyLayer === 3 ? "blue" : "green"} />
        <span data-tone={d.veto?.length ? "amber" : "quiet"} />
      </span>
    </button>
  );
}

function MiniMap({
  clusters,
  selectedCluster,
}: {
  clusters: ReturnType<typeof directorClusters>;
  selectedCluster: CouncilFilter;
}) {
  return (
    <div className="orgc-minimap-box" aria-hidden="true">
      <div className="orgc-mini-apex" />
      <div className="orgc-mini-councils">
        {clusters.map((cluster) => (
          <span
            key={cluster.id}
            data-active={selectedCluster === "all" || selectedCluster === cluster.id}
          />
        ))}
      </div>
      <div className="orgc-mini-nodes">
        {DIRECTORS.map((d) => (
          <span
            key={d.id}
            data-active={selectedCluster === "all" || selectedCluster === d.cluster}
          />
        ))}
      </div>
    </div>
  );
}

function LayerRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="orgc-layer-row" data-active={active ? "true" : "false"}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function MiniMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="orgc-mini-metric">
      <span>{value}</span>
      <em>{label}</em>
    </div>
  );
}
