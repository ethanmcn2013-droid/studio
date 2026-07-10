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
  DIRECTORS,
  ELT_SNAPSHOT,
  getDirector,
  type Director,
} from "@/lib/hq/elt";
import { roleTitle } from "./org-utils";
import {
  COORDINATION_PAIRS,
  coordinationPartners,
  mcpGrants,
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
  ROUTINES,
  TOOLS,
  TOOLS_COUNT,
  WORKFLOWS,
  columnPeers,
  directorName,
  getDiscovery,
  isDiscovery,
  type Council,
  type DiscoveryRole,
} from "./org-intel";
import { CADENCES, ROADMAP, OPERATING_TIMEZONE, roadmapDotClass } from "./org-cadence";
import {
  buildTree,
  routeEdges,
  routeMesh,
  type Box,
  type EdgeRoute,
  type MeshRoute,
} from "./org-geometry";
import { OrgAvatar } from "./org-avatars";
import { OrgDetailPanel } from "./org-detail-panel";
import { OrgSearch, type SearchEntry } from "./org-search";
import { OrgPrintBrief } from "./org-print";
import { TOOL_MARK_PATHS } from "./org-tool-marks";

export type Mode = "chart" | "councils" | "tools" | "routines" | "evidence" | "investor";

const MODES: { id: Mode; label: string }[] = [
  { id: "chart", label: "Chart" },
  { id: "councils", label: "Councils" },
  { id: "tools", label: "Tools" },
  { id: "routines", label: "Routines" },
  { id: "evidence", label: "Evidence" },
  { id: "investor", label: "Investor" },
];

/** The chart's visible layers. Every toggle changes real rendering. */
type Layers = {
  mesh: boolean;
  discovery: boolean;
  veto: boolean;
  mcp: boolean;
};

const LAYER_CHIPS: { key: keyof Layers; label: string }[] = [
  { key: "mesh", label: "mesh" },
  { key: "discovery", label: "discovery" },
  { key: "veto", label: "veto" },
  { key: "mcp", label: "mcp" },
];

/** The chart-rail tool strip; the full inventory lives in Tools mode. */
const RUNS_ON: { name: string; slug?: string }[] = [
  { name: "GitHub", slug: "github" },
  { name: "Vercel", slug: "vercel" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Slack", slug: "slack" },
  { name: "Linear", slug: "linear" },
  { name: "Sentry", slug: "sentry" },
  { name: "Claude Code", slug: "claude" },
];

const RUNNER_MS = 2400;
const RUNNER_REST_MS = 700;

function columnOf(id: string): string | undefined {
  return CHART_COLUMNS.find((c) => c.members.includes(id))?.id;
}

function columnLabelOf(id: string): string {
  return CHART_COLUMNS.find((c) => c.members.includes(id))?.label ?? "";
}

function toolAnchor(name: string): string {
  return `orgc-tool-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return reduced;
}

export function OrgChart({
  hero,
  initialMode = "chart",
  initialDirectorId = null,
  syncedLabel,
}: {
  /** Server-rendered headline block, composed into the console header. */
  hero: React.ReactNode;
  initialMode?: Mode;
  initialDirectorId?: string | null;
  syncedLabel: string;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [focusedId, setFocusedId] = useState<string | null>(initialDirectorId);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hit, setHit] = useState<{ anchor: string } | null>(null);
  const [tree, setTree] = useState<string[]>([]);
  const [mesh, setMesh] = useState<MeshRoute[]>([]);
  const [edges, setEdges] = useState<EdgeRoute[]>([]);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [runnerIdx, setRunnerIdx] = useState(0);
  const [layers, setLayers] = useState<Layers>({
    mesh: false,
    discovery: true,
    veto: false,
    mcp: false,
  });
  const reducedMotion = usePrefersReducedMotion();

  const canvasRef = useRef<HTMLDivElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);
  const headRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const colRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const nodeRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const nodeBoxesRef = useRef<Record<string, Box>>({});
  const panelRef = useRef<HTMLElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const arrivedRef = useRef(false);
  const arriveState = arrivedRef.current ? "done" : "run";

  const isChart = mode === "chart";
  const focused = focusedId ? (getDirector(focusedId) ?? null) : null;
  const coordIds = useMemo(
    () => (focusedId ? coordinationPartners(focusedId) : []),
    [focusedId],
  );
  const peerIds = useMemo(
    () => new Set(focused ? columnPeers(focused.id) : []),
    [focused],
  );
  const coordSet = useMemo(() => new Set(coordIds), [coordIds]);

  // ── URL state: /hq/org?mode=&d= stays shareable, without navigations ──────
  useEffect(() => {
    const params = new URLSearchParams();
    if (mode !== "chart") params.set("mode", mode);
    if (focusedId) params.set("d", focusedId);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/hq/org?${qs}` : "/hq/org");
  }, [mode, focusedId]);

  // ── Measure the canvas; rebuild the tree, the mesh, and the routes ────────
  const measure = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cRect = canvas.getBoundingClientRect();
    if (!cRect.width) return;
    const rel = (r: DOMRect): Box => ({
      x: r.left - cRect.left,
      y: r.top - cRect.top,
      w: r.width,
      h: r.height,
    });

    const founderEl = founderRef.current;
    const heads = CHART_COLUMNS.map((c) => headRefs.current[c.id])
      .filter((el): el is HTMLDivElement => Boolean(el))
      .map((el) => rel(el.getBoundingClientRect()));
    if (founderEl && heads.length === CHART_COLUMNS.length) {
      setTree(buildTree(rel(founderEl.getBoundingClientRect()), heads));
    } else {
      setTree([]);
    }

    const nodes: Record<string, Box> = {};
    for (const [id, el] of Object.entries(nodeRefs.current)) {
      if (el) nodes[id] = rel(el.getBoundingClientRect());
    }
    nodeBoxesRef.current = nodes;

    const cols = CHART_COLUMNS.map((c) => ({
      id: c.id,
      el: colRefs.current[c.id],
    }))
      .filter((c): c is { id: string; el: HTMLDivElement } => Boolean(c.el))
      .map((c) => ({ id: c.id, box: rel(c.el.getBoundingClientRect()) }));

    setMesh(routeMesh(COORDINATION_PAIRS, { nodes, cols, colOf: columnOf }));

    if (focusedId && coordIds.length) {
      setEdges(
        routeEdges({
          focusedId,
          partnerIds: coordIds,
          nodes,
          cols,
          colOf: columnOf,
        }),
      );
    } else {
      setEdges([]);
    }
  }, [focusedId, coordIds]);

  useLayoutEffect(() => {
    if (!isChart) return;
    measure();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(canvas);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [isChart, measure, layers.discovery]);

  useEffect(() => {
    if (isChart) arrivedRef.current = true;
  }, [isChart]);

  // ── The runner: one dot travels the focused paths, one leg at a time ──────
  useEffect(() => {
    setRunnerIdx(0);
  }, [focusedId]);

  useEffect(() => {
    if (reducedMotion || edges.length < 2) return;
    const t = window.setTimeout(
      () => setRunnerIdx((i) => (i + 1) % edges.length),
      RUNNER_MS + RUNNER_REST_MS,
    );
    return () => window.clearTimeout(t);
  }, [edges, runnerIdx, reducedMotion]);

  // ── Keyboard: `/` search, Esc closes focus, arrows walk the chart ─────────
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (searchOpen) return;
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "Escape" && focusedId) {
        e.preventDefault();
        closeFocus();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOpen, focusedId]);

  function onCanvasKeyDown(e: React.KeyboardEvent) {
    const dirs: Record<string, [number, number]> = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };
    const dir = dirs[e.key];
    if (!dir) return;
    const target = e.target as HTMLElement;
    const id = target.getAttribute("data-node-id");
    if (!id) return;
    e.preventDefault();
    const next = nearestNode(id, dir, nodeBoxesRef.current);
    if (next) nodeRefs.current[next]?.focus();
  }

  function openDirector(id: string) {
    returnFocusRef.current = (document.activeElement as HTMLElement) ?? null;
    setMode("chart");
    setFocusedId(id);
  }

  function closeFocus() {
    setFocusedId(null);
    // Synchronous, so a `/` pressed right after Esc still lands in search.
    returnFocusRef.current?.focus();
  }

  // Dock the panel into view on narrow screens, where it sits below the chart.
  useEffect(() => {
    if (!focusedId || !isChart) return;
    if (window.innerWidth >= 1180) return;
    const t = window.setTimeout(() => {
      panelRef.current?.scrollIntoView({
        block: "nearest",
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }, 60);
    return () => window.clearTimeout(t);
  }, [focusedId, isChart, reducedMotion]);

  // ── Search: directors, councils, and tools, jumping to the right mode ─────
  const searchEntries = useMemo<SearchEntry[]>(() => {
    const entries: SearchEntry[] = DIRECTORS.map((d) => ({
      kind: "director",
      id: d.id,
      label: roleTitle(d.name),
      sub: d.shortName,
      hay: `${d.name} ${d.persona} ${d.shortName} ${d.owns.join(" ")}`,
    }));
    for (const c of COUNCILS) {
      entries.push({
        kind: "council",
        id: c.id,
        label: c.label,
        sub: `council · ${c.cadence.toLowerCase()}`,
        hay: `${c.label} ${c.channel} ${c.purpose}`,
      });
    }
    for (const g of TOOLS) {
      for (const it of g.items) {
        entries.push({
          kind: "tool",
          id: it.name,
          label: it.name,
          sub: `tool · ${g.category.toLowerCase()}`,
          hay: `${it.name} ${it.note} ${g.category}`,
        });
      }
    }
    return entries;
  }, []);

  function onSearchPick(entry: SearchEntry) {
    setSearchOpen(false);
    if (entry.kind === "director") {
      openDirector(entry.id);
      return;
    }
    const anchor =
      entry.kind === "council" ? `orgc-council-${entry.id}` : toolAnchor(entry.id);
    setMode(entry.kind === "council" ? "councils" : "tools");
    setHit({ anchor });
  }

  useEffect(() => {
    if (!hit) return;
    const raf = requestAnimationFrame(() => {
      document.getElementById(hit.anchor)?.scrollIntoView({
        block: "center",
        behavior: reducedMotion ? "auto" : "smooth",
      });
    });
    const t = window.setTimeout(() => setHit(null), 2000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [hit, reducedMotion]);

  function nodeStateClass(d: Director): string {
    if (focused) {
      if (d.id === focused.id) return "is-active";
      if (peerIds.has(d.id) || coordSet.has(d.id)) return "is-peer";
      return "is-dim";
    }
    const marks: string[] = [];
    if (layers.veto && d.veto?.length) marks.push("is-veto-mark");
    if (layers.mcp && mcpGrants(d.id).length) marks.push("is-mcp-mark");
    return marks.join(" ");
  }

  return (
    <div className="orgc">
      {/* ── Console header: headline left, the operating readout right ────── */}
      <div className="orgc-console">
        <div className="orgc-console-copy">{hero}</div>
        <div className="orgc-console-rail">
          <div className="orgc-metrics" aria-label="Operating readout">
            <Metric
              label="operating model"
              value={`1 + ${ORG_COUNTS.directors}`}
              sub="founder + directors"
              accent
            />
            <Metric
              label="divisions"
              value={String(ORG_COUNTS.divisions)}
              sub="every seat named"
            />
            <Metric
              label="councils"
              value={String(ORG_COUNTS.councils)}
              sub="standing, chaired"
            />
            <Metric
              label="coordination"
              value={String(ORG_COUNTS.coordinationPaths)}
              sub="documented paths"
            />
            <Metric
              label="toolchain"
              value={String(ORG_COUNTS.tools)}
              sub="tools + platforms"
            />
            <Metric
              label="founder gates"
              value={String(ORG_COUNTS.founderGates)}
              sub="nothing moves alone"
            />
          </div>
        </div>
      </div>

      <div className="orgc-tabs" role="group" aria-label="View mode">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className="orgc-tab"
            aria-pressed={mode === m.id}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="orgc-legendrow">
        <div className="orgc-legend" aria-label="Card marks">
          <span className="orgc-legend-t">marks</span>
          <span className="orgc-legend-item">
            <i className="orgc-swatch orgc-swatch--l3" aria-hidden="true" />
            L3 executes
          </span>
          <span className="orgc-legend-item">
            <i className="orgc-swatch orgc-swatch--l2" aria-hidden="true" />
            L2 recommends
          </span>
          <span className="orgc-legend-item">
            <i className="orgc-swatch orgc-swatch--ghost" aria-hidden="true" />
            in discovery
          </span>
        </div>
        <div className="orgc-legend-actions">
          {isChart
            ? LAYER_CHIPS.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  className="orgc-layer-chip"
                  aria-pressed={layers[chip.key]}
                  onClick={() =>
                    setLayers((l) => ({ ...l, [chip.key]: !l[chip.key] }))
                  }
                >
                  {chip.label}
                </button>
              ))
            : null}
          <button
            type="button"
            className="orgc-layer-chip"
            onClick={() => setSearchOpen(true)}
          >
            search /
          </button>
          <span className="orgc-updated">
            mirrors{" "}
            <a
              href="https://github.com/ethanmcn2013-droid/signal-directors"
              target="_blank"
              rel="noreferrer"
            >
              signal-directors
            </a>{" "}
            · {syncedLabel}
          </span>
        </div>
      </div>

      <div
        className="orgc-workbench"
        data-focused={focused && isChart ? "true" : "false"}
      >
        <div className="orgc-stage" data-mode={mode}>
          {isChart ? (
            <div
              className="orgc-canvas"
              data-arrive={arriveState}
              ref={canvasRef}
              onKeyDown={onCanvasKeyDown}
              onClick={(e) => {
                if (e.target === e.currentTarget && focusedId) closeFocus();
              }}
            >
              <span className="orgc-mark orgc-mark--tl" aria-hidden="true" />
              <span className="orgc-mark orgc-mark--tr" aria-hidden="true" />
              <span className="orgc-mark orgc-mark--bl" aria-hidden="true" />
              <span className="orgc-mark orgc-mark--br" aria-hidden="true" />
              <div className="orgc-fig" aria-hidden="true">
                fig. 01 · the operating org · every line is a documented path
              </div>
              <svg className="orgc-overlay" aria-hidden="true">
                {layers.mesh ? (
                  <g className="orgc-mesh" data-quiet={focused ? "true" : "false"}>
                    {mesh.map((m) => (
                      <path
                        key={`${m.a}-${m.b}`}
                        d={m.d}
                        pathLength={1}
                        className={
                          !focused && hoverId && (m.a === hoverId || m.b === hoverId)
                            ? "is-hot"
                            : undefined
                        }
                      />
                    ))}
                  </g>
                ) : null}
                <g className="orgc-tree">
                  {tree.map((d, i) => (
                    <path key={i} d={d} pathLength={1} />
                  ))}
                </g>
                {edges.map((e) => (
                  <g key={e.id} className="orgc-route">
                    <path className="orgc-edge" d={e.d} pathLength={1} />
                    <circle className="orgc-edge-dot" cx={e.end[0]} cy={e.end[1]} r="2.6" />
                  </g>
                ))}
                {!reducedMotion && edges[runnerIdx] ? (
                  <circle
                    key={`${focusedId}-${runnerIdx}-${edges.length}`}
                    className="orgc-runner"
                    r="3.5"
                  >
                    <animateMotion
                      dur={`${RUNNER_MS}ms`}
                      fill="freeze"
                      path={edges[runnerIdx].d}
                      calcMode="spline"
                      keyTimes="0;1"
                      keySplines="0.23 1 0.32 1"
                    />
                  </circle>
                ) : null}
              </svg>

              <div className="orgc-apex">
                <div className="orgc-apex-card" ref={founderRef}>
                  <div className="orgc-apex-eyebrow">founder · the final call</div>
                  <div className="orgc-apex-name">
                    {ELT_SNAPSHOT.founderName}
                    <span className="orgc-apex-period" aria-hidden="true" />
                  </div>
                  <div className="orgc-apex-role">
                    vision · strategy · allocation · final call
                  </div>
                </div>
              </div>

              <div className="orgc-columns">
                {CHART_COLUMNS.map((col) => {
                  const realCount = col.members.filter((m) => !isDiscovery(m)).length;
                  return (
                    <div
                      key={col.id}
                      className="orgc-col"
                      data-col={col.id}
                      ref={(el) => {
                        colRefs.current[col.id] = el;
                      }}
                    >
                      <div
                        className="orgc-col-head"
                        id={`orgc-div-${col.id}`}
                        data-hit={hit?.anchor === `orgc-div-${col.id}` ? "true" : undefined}
                        ref={(el) => {
                          headRefs.current[col.id] = el;
                        }}
                      >
                        <div className="orgc-col-titles">
                          <div className="orgc-col-title">{col.label}</div>
                          <div className="orgc-col-subtitle">{col.subtitle}</div>
                        </div>
                        <div className="orgc-col-count">{realCount}</div>
                      </div>
                      <ul className="orgc-col-list" role="list">
                        {col.members.map((mid) => {
                          if (isDiscovery(mid)) {
                            if (!layers.discovery) return null;
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
                                stateClass={nodeStateClass(d)}
                                onFocus={() => openDirector(d.id)}
                                onHover={setHoverId}
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
            </div>
          ) : null}

          {mode === "councils" ? <CouncilsMode onOpen={openDirector} hit={hit} /> : null}
          {mode === "tools" ? <ToolsMode hit={hit} /> : null}
          {mode === "routines" ? <RoutinesMode onOpen={openDirector} /> : null}
          {mode === "evidence" ? (
            <EvidenceMode onOpen={openDirector} syncedLabel={syncedLabel} />
          ) : null}
          {mode === "investor" ? <InvestorMode syncedLabel={syncedLabel} /> : null}
        </div>

        {isChart && focused ? (
          <OrgDetailPanel
            ref={panelRef}
            director={focused}
            clusterLabel={columnLabelOf(focused.id)}
            peers={columnPeers(focused.id)
              .map((id) => getDirector(id))
              .filter((d): d is Director => Boolean(d))}
            founderName={ELT_SNAPSHOT.founderName}
            onNavigate={openDirector}
            onClose={closeFocus}
          />
        ) : null}
      </div>

      {isChart ? (
        <>
          <div className="orgc-toolrail" aria-label="Platform foundation">
            <span className="orgc-rail-h orgc-toolrail-label">
              common tools
              <br />+ platforms
            </span>
            {RUNS_ON.map((t) => (
              <span key={t.name} className="orgc-tool-chip">
                <ToolMark name={t.name} slug={t.slug} small />
                {t.name}
              </span>
            ))}
            <span className="orgc-tool-chip" data-live="true">
              <ToolMark name="Google Calendar" slug="googlecalendar" small />
              Google Calendar · MCP
            </span>
            <button
              type="button"
              className="orgc-tool-more"
              onClick={() => setMode("tools")}
            >
              + {TOOLS_COUNT - RUNS_ON.length - 1} more →
            </button>
          </div>

          <div className="orgc-ledger">
            <section className="orgc-ledger-panel">
              <div className="orgc-rail-h">evidence at a glance</div>
              <ul className="orgc-glance">
                <li>
                  <span>directors seated</span>
                  <b>{ORG_COUNTS.directors}</b>
                </li>
                <li>
                  <span>coordination paths</span>
                  <b>{ORG_COUNTS.coordinationPaths}</b>
                </li>
                <li>
                  <span>decisions logged</span>
                  <b>{DECISIONS.length}</b>
                </li>
                <li>
                  <span>written workflows</span>
                  <b>{ORG_COUNTS.workflows}</b>
                </li>
                <li>
                  <span>principles held</span>
                  <b>{ORG_COUNTS.principles}</b>
                </li>
                <li>
                  <span>live MCP grants</span>
                  <b>{ORG_COUNTS.mcpLive}</b>
                </li>
              </ul>
              <button
                type="button"
                className="orgc-ledger-more"
                onClick={() => setMode("evidence")}
              >
                the evidence layer →
              </button>
            </section>

            <section className="orgc-ledger-panel">
              <div className="orgc-rail-h">
                the build · {ROADMAP.filter((p) => p.status === "shipped").length} of{" "}
                {ROADMAP.length} shipped
              </div>
              <ol className="orgc-focus">
                {ROADMAP.map((p) => (
                  <li key={p.n}>
                    <span className="orgc-focus-n">
                      {String(p.n).padStart(2, "0")}
                    </span>
                    <span className="orgc-focus-label">{p.label}</span>
                    <span className="orgc-focus-status" data-status={p.status}>
                      {p.status.replace("-", " ")}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            <section className="orgc-ledger-panel">
              <div className="orgc-rail-h">operating rhythm</div>
              <ul className="orgc-ledger-rows">
                {CADENCES.map((c) => (
                  <li key={c.id}>
                    <b>{c.when}</b>
                    <span>{c.label}</span>
                  </li>
                ))}
              </ul>
              <div className="orgc-ledger-note">
                {OPERATING_TIMEZONE.replace("/", ", ")} time · silence is a signal
              </div>
            </section>

            <section className="orgc-ledger-panel orgc-ledger-panel--cta">
              <span className="orgc-cta-mark orgc-cta-mark--tl" aria-hidden="true">
                +
              </span>
              <span className="orgc-cta-mark orgc-cta-mark--br" aria-hidden="true">
                +
              </span>
              <p className="orgc-cta-head">
                Zoom in. See ownership. Verify everything.
              </p>
              <p className="orgc-cta-sub">
                Nothing on this page is invented. Every path, gate, and grant
                mirrors the source repo.
              </p>
              <div className="orgc-ledger-links">
                <button type="button" onClick={() => setMode("evidence")}>
                  evidence layer →
                </button>
                <a href="/hq/atlas-map">atlas map →</a>
                <a
                  href="https://github.com/ethanmcn2013-droid/signal-directors"
                  target="_blank"
                  rel="noreferrer"
                >
                  signal-directors →
                </a>
              </div>
            </section>
          </div>
        </>
      ) : null}

      {searchOpen ? (
        <OrgSearch
          entries={searchEntries}
          onPick={onSearchPick}
          onClose={() => setSearchOpen(false)}
        />
      ) : null}

      <OrgPrintBrief syncedLabel={syncedLabel} />
    </div>
  );
}

function Metric({
  value,
  label,
  sub,
  accent = false,
}: {
  value: string;
  label: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className={`orgc-metric${accent ? " orgc-metric--accent" : ""}`}>
      <div className="orgc-metric-l">{label}</div>
      <div className="orgc-metric-v">{value}</div>
      <div className="orgc-metric-s">{sub}</div>
    </div>
  );
}

/** Spatial keyboard step: the nearest node in the pressed direction. */
function nearestNode(
  fromId: string,
  [dx, dy]: [number, number],
  boxes: Record<string, Box>,
): string | null {
  const from = boxes[fromId];
  if (!from) return null;
  const fx = from.x + from.w / 2;
  const fy = from.y + from.h / 2;
  let best: string | null = null;
  let bestScore = Infinity;
  for (const [id, b] of Object.entries(boxes)) {
    if (id === fromId) continue;
    const ex = b.x + b.w / 2 - fx;
    const ey = b.y + b.h / 2 - fy;
    const along = ex * dx + ey * dy;
    if (along < 4) continue;
    const across = Math.abs(ex * dy) + Math.abs(ey * dx);
    const score = along + across * 2.5;
    if (score < bestScore) {
      bestScore = score;
      best = id;
    }
  }
  return best;
}

// ── Chart-mode nodes ──────────────────────────────────────────────────────────

function OrgNode({
  director: d,
  index,
  stateClass,
  onFocus,
  onHover,
  registerRef,
}: {
  director: Director;
  index: number;
  stateClass: string;
  onFocus: () => void;
  onHover: (id: string | null) => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  const hasMcp = mcpGrants(d.id).length > 0;
  return (
    <button
      ref={registerRef}
      type="button"
      data-node-id={d.id}
      className={`orgc-node ${stateClass}`}
      title={d.oneLine}
      aria-label={`${roleTitle(d.name)}, ${d.persona}, ${d.autonomyLayer === 3 ? "layer 3" : "layer 2"}${d.veto?.length ? ", holds veto" : ""}${hasMcp ? ", holds a live MCP grant" : ""}`}
      aria-pressed={stateClass.includes("is-active")}
      onClick={onFocus}
      onMouseEnter={() => onHover(d.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(d.id)}
      onBlur={() => onHover(null)}
    >
      <span className="orgc-node-index">{String(index).padStart(2, "0")}</span>
      <span className="orgc-avatar" aria-hidden="true">
        <OrgAvatar id={d.id} title={d.persona} />
      </span>
      <span className="orgc-body">
        <span className="orgc-role">{roleTitle(d.name)}</span>
        <span className="orgc-badges">
          <span className={`orgc-badge ${d.autonomyLayer === 3 ? "orgc-badge--l3" : ""}`}>
            {d.autonomyLayer === 3 ? "L3" : "L2"}
          </span>
          {d.veto?.length ? <span className="orgc-badge orgc-badge--veto">veto</span> : null}
          {hasMcp ? <span className="orgc-badge orgc-badge--mcp">mcp</span> : null}
          {d.product ? (
            <span className="orgc-badge orgc-badge--product">{d.product}</span>
          ) : null}
        </span>
      </span>
    </button>
  );
}

function DiscoveryNode({ role }: { role: DiscoveryRole }) {
  return (
    <div
      className="orgc-node orgc-node--discovery"
      title={role.oneLine}
      aria-label={`${roleTitle(role.name)}, role in discovery`}
    >
      <span className="orgc-node-index" aria-hidden="true">
        +
      </span>
      <span className="orgc-avatar orgc-avatar--ghost" aria-hidden="true" />
      <span className="orgc-body">
        <span className="orgc-role">{roleTitle(role.name)}</span>
        <span className="orgc-badges">
          <span className="orgc-badge orgc-badge--discovery">in discovery</span>
        </span>
      </span>
    </div>
  );
}

// ── Councils mode ─────────────────────────────────────────────────────────────

function CouncilsMode({
  onOpen,
  hit,
}: {
  onOpen: (id: string) => void;
  hit: { anchor: string } | null;
}) {
  const [lead, ...rest] = COUNCILS;
  return (
    <div className="orgc-panel-card">
      <div className="orgc-section-eyebrow">standing councils</div>
      <p className="orgc-section-lede">
        The chart shows who owns what. The councils show how the company decides
        together. Each panel has a chair, a membership, a rhythm, and a real
        Slack channel behind it.
      </p>

      <div className="orgc-councils-grid">
        <CouncilCard council={lead} onOpen={onOpen} lead hit={hit} />
        {rest.map((c) => (
          <CouncilCard key={c.id} council={c} onOpen={onOpen} hit={hit} />
        ))}
      </div>
    </div>
  );
}

function CouncilCard({
  council,
  onOpen,
  lead = false,
  hit,
}: {
  council: Council;
  onOpen: (id: string) => void;
  lead?: boolean;
  hit: { anchor: string } | null;
}) {
  const chair = getDirector(council.chairId);
  const anchor = `orgc-council-${council.id}`;
  const memberDirectors =
    council.members === "all"
      ? []
      : council.members
          .filter((id) => id !== council.chairId)
          .map((id) => getDirector(id))
          .filter((d): d is Director => Boolean(d));

  return (
    <div
      id={anchor}
      className={`orgc-council-card${lead ? " orgc-council-card--lead" : ""}`}
      data-hit={hit?.anchor === anchor ? "true" : undefined}
    >
      <div className="orgc-council-top">
        <div>
          <div className="orgc-council-name">{council.label}</div>
          <div className="orgc-council-channel">{council.channel}</div>
        </div>
        <span className="orgc-council-cadence">{council.cadence}</span>
      </div>

      <p className="orgc-council-purpose">{council.purpose}</p>
      {council.writeNote ? (
        <p className="orgc-council-note">{council.writeNote}</p>
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
          <span className="orgc-council-all">Every director</span>
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

function ToolMark({
  name,
  slug,
  small = false,
}: {
  name: string;
  slug?: string;
  small?: boolean;
}) {
  const path = slug ? TOOL_MARK_PATHS[slug] : undefined;
  const size = small ? 13 : 18;
  if (path) {
    return (
      <span className={`orgc-tool-logo${small ? " orgc-tool-logo--sm" : ""}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path d={path} fill="currentColor" />
        </svg>
      </span>
    );
  }
  const mono =
    name
      .replace(/[^A-Za-z0-9 ]/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "?";
  return (
    <span
      className={`orgc-tool-logo orgc-tool-logo--mono${small ? " orgc-tool-logo--sm" : ""}`}
      aria-hidden="true"
    >
      {mono}
    </span>
  );
}

function ToolsMode({ hit }: { hit: { anchor: string } | null }) {
  return (
    <div className="orgc-panel-card">
      <div className="orgc-section-eyebrow">the toolchain</div>
      <p className="orgc-section-lede">
        Every platform, service, and grant the company runs on. {TOOLS_COUNT}{" "}
        tools, from the build stack to our own in-house tools and the video
        stack for ads. One live MCP grant today.
      </p>

      <div className="orgc-tools-groups">
        {TOOLS.map((g) => (
          <section key={g.category} className="orgc-tools-group">
            <div className="orgc-tools-cat">{g.category}</div>
            <div className="orgc-tools-grid">
              {g.items.map((it) => (
                <div
                  key={it.name}
                  id={toolAnchor(it.name)}
                  className="orgc-tool-card"
                  data-tag={it.tag ?? ""}
                  data-hit={hit?.anchor === toolAnchor(it.name) ? "true" : undefined}
                >
                  <div className="orgc-tool-head">
                    <ToolMark name={it.name} slug={it.slug} />
                    <div className="orgc-tool-name">
                      {it.name}
                      {it.tag ? (
                        <span className="orgc-tool-tag" data-tag={it.tag}>
                          {it.tag}
                        </span>
                      ) : null}
                    </div>
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

// ── Routines mode (planned, not yet built) ────────────────────────────────────

function RoutinesMode({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="orgc-panel-card">
      <div className="orgc-section-eyebrow">routines · planned</div>
      <p className="orgc-section-lede">
        The autonomous runs that will operate the company once it is fully live.
        None of these are wired yet. They are the shape of the day when the
        Directors run on their own cadence. {ROUTINES.length} planned.
      </p>

      <div className="orgc-routines">
        {ROUTINES.map((r) => (
          <div key={r.name} className="orgc-routine">
            <div className="orgc-routine-top">
              <div className="orgc-routine-name">{r.name}</div>
              <span className="orgc-routine-status">planned</span>
            </div>
            <div className="orgc-routine-cadence">{r.cadence}</div>
            <div className="orgc-routine-detail">{r.detail}</div>
            <button
              type="button"
              className="orgc-name-link"
              onClick={() => onOpen(r.ownerId)}
            >
              {directorName(r.ownerId)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Evidence mode ─────────────────────────────────────────────────────────────

function EvidenceMode({
  onOpen,
  syncedLabel,
}: {
  onOpen: (id: string) => void;
  syncedLabel: string;
}) {
  const live = MCP_SERVERS.find((s) => s.status === "live");
  return (
    <div className="orgc-panel-card">
      <div className="orgc-section-eyebrow">evidence layer</div>
      <p className="orgc-section-lede">
        None of this is a diagram of intentions. It is the operating record:
        decisions with reasons, tools on trials, permission tiers, and the
        cadences that keep the company moving. Everything here mirrors the
        source repo,{" "}
        <a
          className="orgc-source-link"
          href="https://github.com/ethanmcn2013-droid/signal-directors"
          target="_blank"
          rel="noreferrer"
        >
          signal-directors
        </a>
        , {syncedLabel}.
      </p>

      <div className="orgc-evidence-grid">
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
                {d.klass} · surfaced by{" "}
                <button type="button" className="orgc-name-link" onClick={() => onOpen(d.surfacedBy)}>
                  {directorName(d.surfacedBy)}
                </button>{" "}
                · {d.date}
              </div>
            </div>
          ))}
        </div>

        {live ? (
          <div className="orgc-ev-card">
            <div className="orgc-ev-head">
              <div className="orgc-ev-title">Tool + MCP layer</div>
              <div className="orgc-ev-tag">{ORG_COUNTS.mcpLive} live</div>
            </div>
            <p className="orgc-mcp-scope">
              <strong>{live.label}.</strong> {live.scope}
            </p>
            <dl className="orgc-mcp-meta">
              <div>
                <dt>transport</dt>
                <dd>{live.transport}</dd>
              </div>
              <div>
                <dt>granted to</dt>
                <dd>
                  {live.grantedTo.map((id, i) => (
                    <span key={id}>
                      {i > 0 ? ", " : ""}
                      <button type="button" className="orgc-name-link" onClick={() => onOpen(id)}>
                        {directorName(id)}
                      </button>
                    </span>
                  ))}
                </dd>
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

        <div className="orgc-ev-card">
          <div className="orgc-ev-head">
            <div className="orgc-ev-title">Founder gates</div>
            <div className="orgc-ev-tag">{ORG_COUNTS.founderGates} actions</div>
          </div>
          <p className="orgc-mcp-scope orgc-mcp-scope--spaced">
            The actions no Director takes alone, at any autonomy layer.
          </p>
          <ul className="orgc-gates">
            {FOUNDER_GATES.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>

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
                  {w.detail} ·{" "}
                  <button type="button" className="orgc-name-link" onClick={() => onOpen(w.ownerId)}>
                    {directorName(w.ownerId)}
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>

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

      <div className="orgc-section-title">Operating rhythm</div>
      <p className="orgc-section-lede orgc-section-lede--tight">
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
                Owner ·{" "}
                <button type="button" className="orgc-name-link" onClick={() => onOpen(c.ownerId)}>
                  {owner?.shortName ?? c.ownerId}
                </button>
                {c.nextDue ? <> · next {c.nextDue}</> : null}
              </div>
            </div>
          );
        })}
      </div>

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

function InvestorMode({ syncedLabel }: { syncedLabel: string }) {
  const wall: { num: string; lab: string }[] = [
    { num: "1", lab: "final call, held by the founder" },
    { num: String(ORG_COUNTS.founderGates), lab: "founder-gated actions" },
    { num: String(ORG_COUNTS.autonomyLayers), lab: "autonomy layers" },
    { num: String(ORG_COUNTS.permissionTiers), lab: "permission tiers" },
    { num: String(ORG_COUNTS.tools), lab: "tools and platforms" },
    { num: String(ORG_COUNTS.mcpLive), lab: "live MCP grant, on a trial" },
    { num: String(ORG_COUNTS.workflows), lab: "written workflows" },
    { num: String(ORG_COUNTS.principles), lab: "principles held company-wide" },
  ];

  const counts = CHART_COLUMNS.map((c) => ({
    label: c.label,
    n: c.members.filter((m) => !isDiscovery(m)).length,
  }));

  return (
    <div className="orgc-panel-card">
      <div className="orgc-invest-hero">
        <div>
          <div className="orgc-section-eyebrow">the investor read</div>
          <p className="orgc-invest-statement">
            One founder keeps every final call. <b>Seventeen directors</b> hold
            named scope, bounded authority, and a standing cadence. The result is
            one person operating with the <b>coordination of a company</b>.
          </p>
          <p className="orgc-invest-sub">
            The structure is deliberately shallow: a founder, the divisions, the
            directors. Depth comes from the operating system beneath it, not
            from layers of management. Everything on this page mirrors the
            source repo, {syncedLabel}.
          </p>
          <button
            type="button"
            className="orgc-command-btn orgc-print-btn"
            onClick={() => window.print()}
          >
            Print the one-page brief
          </button>
        </div>

        <div className="orgc-metric-wall" aria-label="Operating metrics">
          {wall.map((m) => (
            <div key={m.lab} className="orgc-metric-cell">
              <div className="orgc-metric-num">{m.num}</div>
              <div className="orgc-metric-lab">{m.lab}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="orgc-section-title">Authority ladder</div>
      <p className="orgc-section-lede orgc-section-lede--tight">
        Every Director sits on a five-rung ladder. Most operate at Recommend;
        Engineering and Operations run at Execute. Nothing above the line moves
        without the founder.
      </p>
      <div className="orgc-ladder">
        {AUTONOMY_LADDER.map((r) => (
          <div key={r.n} className="orgc-rung" data-rung={r.n}>
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
            <div className="orgc-bar-dots" aria-hidden="true">
              {Array.from({ length: c.n }, (_, i) => (
                <span key={i} />
              ))}
            </div>
            <div className="orgc-bar-num">{c.n}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
