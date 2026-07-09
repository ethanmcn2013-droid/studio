"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  DIRECTORS,
  ELT_SNAPSHOT,
  formatCadence,
  getDirector,
  type Director,
} from "@/lib/hq/elt";
import { roleTitle } from "./org-utils";
import {
  COORDINATION_EDGE_COUNT,
  coordinationPartners,
} from "./org-coordination";
import {
  AUTONOMY_LADDER,
  CHART_COLUMNS,
  COUNCILS,
  DECISIONS,
  FOUNDER_GATES,
  MCP_LIFECYCLE,
  MCP_SERVERS,
  ORG_COUNTS,
  PERMISSION_TIERS,
  PRINCIPLES,
  TOOLS,
  TOOLS_COUNT,
  WORKFLOWS,
  columnPeers,
  deckStats,
  directorName,
  getDiscovery,
  isDiscovery,
  type Council,
  type DiscoveryRole,
} from "./org-intel";
import { CADENCES, ROADMAP, OPERATING_TIMEZONE, roadmapDotClass } from "./org-cadence";
import { OrgAvatar } from "./org-avatars";
import { OrgDetailPanel } from "./org-detail-panel";
import { OrgSearch } from "./org-search";

type Edge = { id: string; x1: number; y1: number; x2: number; y2: number };
type ColumnFilter = "all" | string;
type Mode = "chart" | "councils" | "evidence" | "investor" | "tools";

const MODES: { id: Mode; label: string }[] = [
  { id: "chart", label: "Chart" },
  { id: "councils", label: "Councils" },
  { id: "tools", label: "Tools" },
  { id: "evidence", label: "Evidence" },
  { id: "investor", label: "Investor" },
];

function columnOf(id: string): string | undefined {
  return CHART_COLUMNS.find((c) => c.members.includes(id))?.id;
}

function columnLabelOf(id: string): string {
  return CHART_COLUMNS.find((c) => c.members.includes(id))?.label ?? "";
}

export function OrgChart() {
  const [mode, setMode] = useState<Mode>("chart");
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [investorLens, setInvestorLens] = useState(true);
  const [selectedColumn, setSelectedColumn] = useState<ColumnFilter>("all");

  const stageRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const visibleColumns = useMemo(
    () =>
      selectedColumn === "all"
        ? CHART_COLUMNS
        : CHART_COLUMNS.filter((c) => c.id === selectedColumn),
    [selectedColumn],
  );
  const stats = useMemo(() => deckStats(), []);

  const focused = focusedId ? getDirector(focusedId) ?? null : null;
  const peerIds = useMemo(
    () => new Set(focused ? columnPeers(focused.id) : []),
    [focused],
  );
  const coordIds = useMemo(
    () => (focusedId ? coordinationPartners(focusedId) : []),
    [focusedId],
  );
  const coordSet = useMemo(() => new Set(coordIds), [coordIds]);

  const selectedColumnLabel =
    selectedColumn === "all"
      ? "all divisions"
      : CHART_COLUMNS.find((c) => c.id === selectedColumn)?.label ?? "division";

  const visibleDirectorCount = visibleColumns.reduce(
    (sum, c) => sum + c.members.filter((m) => !isDiscovery(m)).length,
    0,
  );

  // Measure the coordination edges (focused node -> partners) in stage-local px.
  useLayoutEffect(() => {
    if (!focusedId || mode !== "chart") {
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
          if (!el || el.offsetParent === null) return null;
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
  }, [focusedId, coordIds, selectedColumn, mode]);

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
        const back = returnFocusRef.current;
        if (back) requestAnimationFrame(() => back.focus());
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
    if (selectedColumn !== "all" && columnOf(d.id) !== selectedColumn) classes.push("is-filtered");
    if (focused) {
      if (d.id === focused.id) classes.push("is-active");
      else if (peerIds.has(d.id) || coordSet.has(d.id)) classes.push("is-peer");
      else classes.push("is-dim");
    }
    return classes.join(" ");
  }

  function chooseColumn(next: ColumnFilter) {
    setSelectedColumn(next);
    if (next !== "all" && focused && columnOf(focused.id) !== next) {
      setFocusedId(null);
    }
  }

  function tracePath() {
    if (focusedId) {
      setFocusedId(null);
      return;
    }
    setMode("chart");
    setSelectedColumn("all");
    setFocusedId("engineering-systems-architecture");
  }

  function openDirector(id: string) {
    returnFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    setFocusedId(id);
  }

  function closeDrawer() {
    setFocusedId(null);
    const back = returnFocusRef.current;
    if (back) requestAnimationFrame(() => back.focus());
  }

  return (
    <div className="orgc" data-investor={investorLens ? "true" : "false"}>
      <div className="orgc-commandbar" aria-label="Deck controls">
        <div className="orgc-modes" role="group" aria-label="View mode">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className="orgc-mode-btn"
              aria-pressed={mode === m.id}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="orgc-search-command"
          onClick={() => setSearchOpen(true)}
        >
          Search directors, councils, tools <span className="atlas-kbd">/</span>
        </button>

        <div className="orgc-command-actions">
          {mode === "chart" ? (
            <button
              type="button"
              className="orgc-mode-toggle"
              aria-pressed={investorLens}
              onClick={() => setInvestorLens((v) => !v)}
            >
              <span className="orgc-switch-dot" aria-hidden="true" />
              Investor lens
            </button>
          ) : null}
          <button type="button" className="orgc-command-btn" onClick={tracePath}>
            {focusedId ? "Clear focus" : "Trace a path"}
          </button>
          <a className="orgc-command-btn" href="/hq/atlas-map">
            Atlas map
          </a>
        </div>
      </div>

      <div className="orgc-stats" aria-label="Operating readout">
        {stats.map((s) => (
          <div key={s.label} className={`orgc-stat${s.accent ? " orgc-stat--accent" : ""}`}>
            <div className="orgc-stat-value">{s.value}</div>
            <div className="orgc-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {mode === "chart" ? (
        <>
          <div className="orgc-toolrail" aria-label="Platform and tooling foundation">
            <span className="orgc-toolrail-label">runs on</span>
            {["GitHub", "Vercel", "Next.js", "TypeScript", "Slack", "Linear", "Sentry", "Claude Code"].map(
              (label) => (
                <span key={label} className="orgc-tool-chip">
                  {label}
                </span>
              ),
            )}
            <span className="orgc-tool-chip" data-live="true">
              Google Calendar · MCP
            </span>
            <button
              type="button"
              className="orgc-tool-more"
              onClick={() => setMode("tools")}
            >
              all {TOOLS_COUNT} tools →
            </button>
          </div>

          <div className="orgc-filterbar" role="group" aria-label="Division filter">
            <button
              type="button"
              onClick={() => chooseColumn("all")}
              aria-pressed={selectedColumn === "all"}
            >
              All divisions
            </button>
            {CHART_COLUMNS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => chooseColumn(c.id)}
                aria-pressed={selectedColumn === c.id}
              >
                {c.label}
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
                <span className="orgc-legend-dot--discovery" aria-hidden="true" /> in discovery
              </span>
              <span className="orgc-legend-item">
                <span className="orgc-legend-swatch" aria-hidden="true" /> coordination path
              </span>
            </div>
            <div className="orgc-live-note">
              {visibleDirectorCount} of {DIRECTORS.length} directors · {selectedColumnLabel}
            </div>
          </div>
        </>
      ) : null}

      <div className="orgc-stage" data-mode={mode} ref={stageRef}>
        {mode === "chart" && edges.length ? (
          <svg className="orgc-overlay" aria-hidden="true">
            {edges.map((e) => (
              <g key={e.id}>
                <line className="orgc-edge" x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} />
                <circle className="orgc-edge-dot" cx={e.x2} cy={e.y2} r="2.6" />
              </g>
            ))}
          </svg>
        ) : null}

        {mode === "chart" ? (
          <>
            <aside className="orgc-sidecar" aria-label="Map controls">
              <div className="orgc-minimap">
                <div className="orgc-side-title">map overview</div>
                <MiniMap selectedColumn={selectedColumn} />
              </div>
              <div className="orgc-layers">
                <div className="orgc-side-title">layers</div>
                <LayerRow label="L1" value="Founder" active />
                <LayerRow label="L2" value="Divisions" active />
                <LayerRow label="L3" value="Directors" active />
                <LayerRow label="L4" value="Tools + evidence" active={investorLens} />
              </div>
            </aside>

            <div
              className="orgc-canvas"
              onClick={(e) => {
                if (e.target === e.currentTarget && focusedId) setFocusedId(null);
              }}
            >
              <div className="orgc-apex">
                <div className="orgc-apex-card">
                  <div className="orgc-apex-eyebrow">founder and final call</div>
                  <div className="orgc-apex-name">{ELT_SNAPSHOT.founderName}</div>
                  <div className="orgc-apex-role">{ELT_SNAPSHOT.founderRole}</div>
                  <div className="orgc-apex-meta">vision · strategy · allocation</div>
                </div>
                <div className="orgc-spine" aria-hidden="true" />
                <div className="orgc-band-label">
                  {ORG_COUNTS.divisions} divisions · {ORG_COUNTS.directors} directors
                </div>
                <div className="orgc-rail" aria-hidden="true" />
              </div>

              <div className="orgc-columns">
                {visibleColumns.map((col) => {
                  const realCount = col.members.filter((m) => !isDiscovery(m)).length;
                  return (
                    <div key={col.id} className="orgc-col">
                      <div className="orgc-col-stub" aria-hidden="true" />
                      <div className="orgc-col-head">
                        <div>
                          <div className="orgc-col-title">{col.label}</div>
                          <div className="orgc-col-subtitle">{col.subtitle}</div>
                        </div>
                        <div className="orgc-col-count">{realCount}</div>
                      </div>
                      <ul className="orgc-col-list" role="list">
                        {col.members.map((mid) => {
                          if (isDiscovery(mid)) {
                            const role = getDiscovery(mid);
                            return role ? (
                              <li key={mid}>
                                <DiscoveryNode role={role} />
                              </li>
                            ) : null;
                          }
                          const d = getDirector(mid);
                          if (!d) return null;
                          return (
                            <li key={mid}>
                              <OrgNode
                                director={d}
                                index={DIRECTORS.findIndex((item) => item.id === mid) + 1}
                                investorLens={investorLens}
                                stateClass={nodeStateClass(d)}
                                onFocus={() => openDirector(d.id)}
                                registerRef={(el) => {
                                  if (el) nodeRefs.current[d.id] = el;
                                  else delete nodeRefs.current[d.id];
                                }}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <div className="orgc-investor-read">
                <div>
                  <div className="orgc-investor-kicker">the read</div>
                  <p>
                    Ownership is explicit, authority is bounded, and the company
                    runs a standing system for quality, cadence, and escalation.
                    One founder keeps every final call.
                  </p>
                </div>
                <div className="orgc-investor-metrics" aria-label="Operating proof">
                  <MiniMetric value="1" label="final call" />
                  <MiniMetric value={String(DIRECTORS.length)} label="directors" />
                  <MiniMetric value={String(COORDINATION_EDGE_COUNT)} label="paths" />
                </div>
              </div>
            </div>
          </>
        ) : null}

        {mode === "councils" ? <CouncilsMode onOpen={openDirector} /> : null}
        {mode === "tools" ? <ToolsMode /> : null}
        {mode === "evidence" ? <EvidenceMode /> : null}
        {mode === "investor" ? <InvestorMode /> : null}
      </div>

      {focused ? (
        <OrgDetailPanel
          director={focused}
          clusterLabel={columnLabelOf(focused.id)}
          peers={columnPeers(focused.id)
            .map((id) => getDirector(id))
            .filter((d): d is Director => Boolean(d))}
          founderName={ELT_SNAPSHOT.founderName}
          onNavigate={setFocusedId}
          onClose={closeDrawer}
        />
      ) : null}

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

// ── Chart-mode nodes ──────────────────────────────────────────────────────────

function OrgNode({
  director: d,
  index,
  investorLens,
  stateClass,
  onFocus,
  registerRef,
}: {
  director: Director;
  index: number;
  investorLens: boolean;
  stateClass: string;
  onFocus: () => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <button
      ref={registerRef}
      type="button"
      className={`orgc-node ${stateClass}`}
      aria-label={`${roleTitle(d.name)}, ${d.persona}, ${d.autonomyLayer === 3 ? "layer 3" : "layer 2"}${d.veto?.length ? ", holds veto" : ""}`}
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
          {investorLens ? d.oneLine : `${d.shortName} · ${formatCadence(d.cadence)}`}
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

function DiscoveryNode({ role }: { role: DiscoveryRole }) {
  return (
    <div
      className="orgc-node orgc-node--discovery"
      aria-label={`${roleTitle(role.name)}, role in discovery`}
    >
      <span className="orgc-node-index" aria-hidden="true">
        +
      </span>
      <span className="orgc-avatar orgc-avatar--ghost" aria-hidden="true" />
      <span className="orgc-body">
        <span className="orgc-role">{roleTitle(role.name)}</span>
        <span className="orgc-persona">{role.oneLine}</span>
        <span className="orgc-badges">
          <span className="orgc-badge orgc-badge--discovery">in discovery</span>
        </span>
      </span>
    </div>
  );
}

// ── Councils mode ─────────────────────────────────────────────────────────────

function CouncilsMode({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="orgc-panel-card">
      <div className="orgc-section-eyebrow">standing councils</div>
      <p className="orgc-section-lede">
        The chart shows who owns what. The councils show how the company decides
        together. Five standing panels, each with a chair, a membership, and a
        rhythm. Every panel maps to a real Slack channel.
      </p>

      <div className="orgc-councils-grid">
        {COUNCILS.map((c) => (
          <CouncilCard key={c.id} council={c} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

function CouncilCard({ council, onOpen }: { council: Council; onOpen: (id: string) => void }) {
  const chair = getDirector(council.chairId);
  const memberDirectors =
    council.members === "all"
      ? []
      : council.members
          .filter((id) => id !== council.chairId)
          .map((id) => getDirector(id))
          .filter((d): d is Director => Boolean(d));

  return (
    <div className="orgc-council-card">
      <div className="orgc-council-top">
        <div>
          <div className="orgc-council-name">{council.label}</div>
          <div className="orgc-council-channel">{council.channel}</div>
        </div>
        <span className="orgc-council-cadence">{council.cadence}</span>
      </div>

      <p className="orgc-council-purpose">{council.purpose}</p>
      {council.writeNote ? (
        <p className="orgc-council-purpose" style={{ color: "var(--ink-quiet)", fontSize: "12px" }}>
          {council.writeNote}
        </p>
      ) : null}

      <div className="orgc-council-meta">
        <span className="orgc-council-meta-label">chair</span>
        {chair ? (
          <button
            type="button"
            className="orgc-council-chip"
            data-chair="true"
            onClick={() => onOpen(chair.id)}
          >
            <span className="orgc-chip-glyph" aria-hidden="true">
              <OrgAvatar id={chair.id} title={chair.persona} />
            </span>
            {chair.shortName}
          </button>
        ) : null}
      </div>

      <div className="orgc-council-meta">
        <span className="orgc-council-meta-label">members</span>
        {council.members === "all" ? (
          <span className="orgc-council-all">All {DIRECTORS.length} directors</span>
        ) : (
          <div className="orgc-council-members">
            {memberDirectors.map((d) => (
              <button
                key={d.id}
                type="button"
                className="orgc-council-chip"
                onClick={() => onOpen(d.id)}
              >
                <span className="orgc-chip-glyph" aria-hidden="true">
                  <OrgAvatar id={d.id} title={d.persona} />
                </span>
                {d.shortName}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tools mode ────────────────────────────────────────────────────────────────

function ToolsMode() {
  return (
    <div className="orgc-panel-card">
      <div className="orgc-section-eyebrow">the toolchain</div>
      <p className="orgc-section-lede">
        Every platform, service, and grant the company runs on. {TOOLS_COUNT}{" "}
        tools across {TOOLS.length} groups, with one live MCP grant on a trial.
        Access is scoped per Director through the permission tiers.
      </p>

      <div className="orgc-tools-groups">
        {TOOLS.map((g) => (
          <section key={g.category} className="orgc-tools-group">
            <div className="orgc-tools-cat">{g.category}</div>
            <div className="orgc-tools-grid">
              {g.items.map((it) => (
                <div key={it.name} className="orgc-tool-card" data-tag={it.tag ?? ""}>
                  <div className="orgc-tool-name">
                    {it.name}
                    {it.tag ? <span className="orgc-tool-tag">{it.tag}</span> : null}
                  </div>
                  <div className="orgc-tool-note">{it.note}</div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

// ── Evidence mode ─────────────────────────────────────────────────────────────

function EvidenceMode() {
  const live = MCP_SERVERS.find((s) => s.status === "live");
  return (
    <div className="orgc-panel-card">
      <div className="orgc-section-eyebrow">evidence layer</div>
      <p className="orgc-section-lede">
        None of this is a diagram of intentions. It is the operating record:
        decisions with reasons, tools on trials, permission tiers, and the
        cadences that keep the company moving. Everything here mirrors the source
        repo,{" "}
        <a
          className="orgc-link-hint"
          style={{ color: "var(--accent)" }}
          href="https://github.com/ethanmcn2013-droid/signal-directors"
          target="_blank"
          rel="noreferrer"
        >
          signal-directors
        </a>
        .
      </p>

      <div className="orgc-evidence-grid">
        {/* Decision log */}
        <div className="orgc-ev-card">
          <div className="orgc-ev-head">
            <div className="orgc-ev-title">Decision log</div>
            <div className="orgc-ev-tag">append-only</div>
          </div>
          {DECISIONS.map((d) => (
            <div key={d.id} className="orgc-decision">
              <div className="orgc-decision-id">{d.id}</div>
              <div className="orgc-decision-title">{d.title}</div>
              <div className="orgc-decision-why">{d.why}</div>
              <div className="orgc-decision-foot">
                {d.klass} · surfaced by {directorName(d.surfacedBy)} · {d.date}
              </div>
            </div>
          ))}
        </div>

        {/* MCP + tool layer */}
        {live ? (
          <div className="orgc-ev-card">
            <div className="orgc-ev-head">
              <div className="orgc-ev-title">Tool + MCP layer</div>
              <div className="orgc-ev-tag">{ORG_COUNTS.mcpLive} live</div>
            </div>
            <p className="orgc-mcp-scope">
              <strong style={{ color: "var(--ink)" }}>{live.label}.</strong> {live.scope}
            </p>
            <dl className="orgc-mcp-meta">
              <div>
                <dt>transport</dt>
                <dd>{live.transport}</dd>
              </div>
              <div>
                <dt>granted to</dt>
                <dd>{live.grantedTo.map(directorName).join(", ")}</dd>
              </div>
              <div>
                <dt>provisioned</dt>
                <dd>{live.provisioned}</dd>
              </div>
              <div>
                <dt>trial review</dt>
                <dd>{live.trialUntil}</dd>
              </div>
            </dl>
            <div className="orgc-lifecycle">
              {MCP_LIFECYCLE.map((s) => (
                <div key={s.step} className="orgc-lifecycle-step">
                  <b>{s.step}</b>
                  <span>{s.detail}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Permission tiers */}
        <div className="orgc-ev-card">
          <div className="orgc-ev-head">
            <div className="orgc-ev-title">Permission tiers</div>
            <div className="orgc-ev-tag">{ORG_COUNTS.permissionTiers} tiers</div>
          </div>
          {PERMISSION_TIERS.map((t) => (
            <div key={t.tier} className="orgc-tier">
              <div className="orgc-tier-n">{t.tier}</div>
              <div>
                <div className="orgc-tier-label">{t.label}</div>
                <div className="orgc-tier-scope">{t.scope}</div>
                <div className="orgc-tier-detail">{t.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Founder gates */}
        <div className="orgc-ev-card">
          <div className="orgc-ev-head">
            <div className="orgc-ev-title">Founder gates</div>
            <div className="orgc-ev-tag">{ORG_COUNTS.founderGates} actions</div>
          </div>
          <p className="orgc-mcp-scope" style={{ marginBottom: "12px" }}>
            Eight actions no Director takes alone, at any autonomy layer.
          </p>
          <ul className="orgc-gates">
            {FOUNDER_GATES.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>

        {/* Workflows */}
        <div className="orgc-ev-card">
          <div className="orgc-ev-head">
            <div className="orgc-ev-title">Workflows</div>
            <div className="orgc-ev-tag">{ORG_COUNTS.workflows} defined</div>
          </div>
          <ul className="orgc-list-rows">
            {WORKFLOWS.map((w) => (
              <li key={w.label}>
                <b>{w.label}</b>
                <span>
                  {w.detail} · {directorName(w.ownerId)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Principles */}
        <div className="orgc-ev-card">
          <div className="orgc-ev-head">
            <div className="orgc-ev-title">Operating principles</div>
            <div className="orgc-ev-tag">{ORG_COUNTS.principles} held</div>
          </div>
          <ol className="orgc-principles">
            {PRINCIPLES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Cadences */}
      <div className="orgc-section-title">Operating rhythm</div>
      <p className="orgc-section-lede" style={{ marginTop: 0 }}>
        Cadences run in {OPERATING_TIMEZONE.replace("/", ", ")} time. Silence is a
        signal; two skipped cycles trigger a review.
      </p>
      <div className="orgc-cadence-grid">
        {CADENCES.map((c) => {
          const owner = getDirector(c.ownerId);
          return (
            <div key={c.id} className="orgc-cadence">
              <div className="orgc-cad-when">{c.when}</div>
              <div className="orgc-cad-label">{c.label}</div>
              <div className="orgc-cad-artefact">{c.artefact}</div>
              <div className="orgc-cad-owner">
                Owner · {owner?.shortName ?? c.ownerId}
                {c.nextDue ? <> · next {c.nextDue}</> : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Build roadmap */}
      <div className="orgc-section-title">Build roadmap</div>
      <ol className="orgc-roadmap">
        {ROADMAP.map((p) => (
          <li key={p.n} className="orgc-phase">
            <span className={roadmapDotClass(p.status)} aria-hidden="true" />
            <span className="orgc-phase-n">{p.n}</span>
            <span className="orgc-phase-body">
              <span className="orgc-phase-label">{p.label}</span>
              <span className="orgc-phase-detail">{p.detail}</span>
            </span>
            <span className="orgc-phase-status">{p.status.replace("-", " ")}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Investor mode ─────────────────────────────────────────────────────────────

function InvestorMode() {
  const wall: { num: string; lab: string }[] = [
    { num: String(ORG_COUNTS.directors), lab: "directors, one final call" },
    { num: String(ORG_COUNTS.coordinationPaths), lab: "documented coordination paths" },
    { num: String(ORG_COUNTS.councils), lab: "standing councils" },
    { num: String(ORG_COUNTS.tools), lab: "tools and platforms" },
    { num: String(ORG_COUNTS.founderGates), lab: "founder-gated actions" },
    { num: String(ORG_COUNTS.autonomyLayers), lab: "autonomy layers" },
    { num: String(ORG_COUNTS.mcpLive), lab: "live MCP grant, on a trial" },
    { num: String(ORG_COUNTS.principles), lab: "principles held company-wide" },
  ];

  const counts = CHART_COLUMNS.map((c) => ({
    label: c.label,
    n: c.members.filter((m) => !isDiscovery(m)).length,
  }));
  const maxN = Math.max(...counts.map((c) => c.n));

  return (
    <div className="orgc-panel-card">
      <div className="orgc-invest-hero">
        <div>
          <div className="orgc-section-eyebrow">the investor read</div>
          <p className="orgc-invest-statement">
            One founder keeps every final call. <b>Seventeen Directors</b> hold
            named scope, bounded authority, and a standing cadence. The result is
            one person operating with the <b>coordination of a company</b>.
          </p>
          <p className="orgc-invest-sub">
            The structure is deliberately shallow: Founder, {ORG_COUNTS.divisions}{" "}
            divisions, {ORG_COUNTS.directors} Directors. Depth comes from the
            operating system beneath it, not from layers of management.
          </p>
        </div>

        <div className="orgc-metric-wall" aria-label="Operating metrics">
          {wall.map((m) => (
            <div key={m.lab} className="orgc-metric-cell">
              <div className="num">{m.num}</div>
              <div className="lab">{m.lab}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="orgc-section-title">Authority ladder</div>
      <p className="orgc-section-lede" style={{ marginTop: 0 }}>
        Every Director sits on a five-rung ladder. Most operate at Recommend;
        Engineering and Operations run at Execute. Nothing above the line moves
        without the founder.
      </p>
      <div className="orgc-ladder">
        {AUTONOMY_LADDER.map((r) => (
          <div
            key={r.n}
            className="orgc-rung"
            style={{ "--fill": String(r.n * 16) } as React.CSSProperties}
          >
            <div className="orgc-rung-name">
              <span className="orgc-rung-n">L{r.n}</span>
              <b>{r.name}</b>
            </div>
            <div className="orgc-rung-auth">{r.authority}</div>
            <div className="orgc-rung-gate">{r.gate}</div>
          </div>
        ))}
      </div>

      <div className="orgc-section-title">Directors by division</div>
      <div className="orgc-bars">
        {counts.map((c) => (
          <div key={c.label} className="orgc-bar-row">
            <div className="orgc-bar-label">{c.label}</div>
            <div className="orgc-bar-track">
              <div className="orgc-bar-fill" style={{ width: `${(c.n / maxN) * 100}%` }} />
            </div>
            <div className="orgc-bar-num">{c.n}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Chart-mode sidecar bits ───────────────────────────────────────────────────

function MiniMap({ selectedColumn }: { selectedColumn: ColumnFilter }) {
  const allMembers = CHART_COLUMNS.flatMap((c) =>
    c.members.map((m) => ({ id: m, col: c.id })),
  );
  return (
    <div className="orgc-minimap-box" aria-hidden="true">
      <div className="orgc-mini-apex" />
      <div className="orgc-mini-councils">
        {CHART_COLUMNS.map((c) => (
          <span
            key={c.id}
            data-active={selectedColumn === "all" || selectedColumn === c.id}
          />
        ))}
      </div>
      <div className="orgc-mini-nodes">
        {allMembers.map((m) => (
          <span
            key={m.id}
            data-active={selectedColumn === "all" || selectedColumn === m.col}
            data-discovery={isDiscovery(m.id) ? "true" : undefined}
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
