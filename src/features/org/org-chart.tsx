"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { OrgAvatar } from "./org-avatars";
import { OrgDetailPanel } from "./org-detail-panel";

export function OrgChart() {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const clusters = useMemo(() => directorClusters(CLUSTERS), []);
  const stats = useMemo(() => orgStats(DIRECTORS, clusters.length), [clusters]);

  const focused = focusedId ? getDirector(focusedId) ?? null : null;
  const peerIds = useMemo(() => {
    if (!focused) return new Set<string>();
    return new Set(
      DIRECTORS.filter((d) => d.cluster === focused.cluster && d.id !== focused.id).map((d) => d.id),
    );
  }, [focused]);

  const clusterLabel = useCallback((id: string) => {
    return CLUSTERS.find((c) => c.id === id)?.label ?? "";
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && focusedId) {
        e.preventDefault();
        setFocusedId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focusedId]);

  function nodeStateClass(d: Director): string {
    if (!focused) return "";
    if (d.id === focused.id) return "is-active";
    if (peerIds.has(d.id)) return "is-peer";
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
          <span className="orgc-legend-badge">tasks</span> product lead
        </span>
        <span className="orgc-legend-item">personified after its craft</span>
      </div>

      <div
        className="orgc-stage"
        onClick={(e) => {
          if (e.target === e.currentTarget && focusedId) setFocusedId(null);
        }}
      >
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
    </div>
  );
}

function OrgNode({
  director: d,
  stateClass,
  onFocus,
}: {
  director: Director;
  stateClass: string;
  onFocus: () => void;
}) {
  return (
    <button
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
