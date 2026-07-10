/**
 * Geometry for the org chart's drawn layer.
 *
 * Pure functions from measured boxes (canvas-local px) to SVG path data.
 * Two artifacts:
 *
 *   - the founder tree: trunk → bus → division stubs. Bands of division
 *     headers are detected from their measured tops, so the same code draws
 *     one band of eight at full width, two bands of four on a laptop, and
 *     four bands of two on a tablet. Between bands the spine travels down a
 *     real column gutter, never across a card.
 *
 *   - coordination edge routes: orthogonal polylines with rounded corners,
 *     routed through the vertical gutters between columns and the horizontal
 *     channels between bands, so no line ever crosses a card face.
 */

export type Box = { x: number; y: number; w: number; h: number };

export type EdgeRoute = {
  /** Partner director id. */
  id: string;
  d: string;
  /** Entry point on the partner card, for the terminal dot. */
  end: [number, number];
};

type Pt = [number, number];

const CORNER = 12;
const BUS_GAP = 24; // bus line sits this far above a band's headers
const CHANNEL_GAP = 22; // horizontal channel sits this far below a band
const GUTTER_REACH = 18; // outer gutters extend this far past the outer columns

function r2(n: number): number {
  return Math.round(n * 2) / 2;
}

function cx(b: Box): number {
  return b.x + b.w / 2;
}

function cy(b: Box): number {
  return b.y + b.h / 2;
}

/** Rounded orthogonal polyline. Consecutive points must share an axis. */
export function elbowPath(pts: Pt[], corner = CORNER): string {
  const p = pts.filter(
    (pt, i) =>
      i === 0 ||
      Math.abs(pt[0] - pts[i - 1][0]) > 0.5 ||
      Math.abs(pt[1] - pts[i - 1][1]) > 0.5,
  );
  if (p.length < 2) return "";
  let d = `M ${r2(p[0][0])} ${r2(p[0][1])}`;
  for (let i = 1; i < p.length - 1; i++) {
    const [ax, ay] = p[i - 1];
    const [bx, by] = p[i];
    const [nx, ny] = p[i + 1];
    const inLen = Math.hypot(bx - ax, by - ay);
    const outLen = Math.hypot(nx - bx, ny - by);
    const r = Math.min(corner, inLen / 2, outLen / 2);
    const inX = (bx - ax) / (inLen || 1);
    const inY = (by - ay) / (inLen || 1);
    const outX = (nx - bx) / (outLen || 1);
    const outY = (ny - by) / (outLen || 1);
    d += ` L ${r2(bx - inX * r)} ${r2(by - inY * r)} Q ${r2(bx)} ${r2(by)} ${r2(bx + outX * r)} ${r2(by + outY * r)}`;
  }
  const last = p[p.length - 1];
  d += ` L ${r2(last[0])} ${r2(last[1])}`;
  return d;
}

type Band<T> = { top: number; bottom: number; items: T[] };

/** Group boxes into horizontal bands by their measured top edge. */
function bandsOf<T>(items: T[], boxOf: (t: T) => Box, tolerance = 20): Band<T>[] {
  const sorted = [...items].sort((a, b) => boxOf(a).y - boxOf(b).y);
  const bands: Band<T>[] = [];
  for (const item of sorted) {
    const b = boxOf(item);
    const band = bands.find((band) => Math.abs(band.top - b.y) <= tolerance);
    if (band) {
      band.items.push(item);
      band.top = Math.min(band.top, b.y);
      band.bottom = Math.max(band.bottom, b.y + b.h);
    } else {
      bands.push({ top: b.y, bottom: b.y + b.h, items: [item] });
    }
  }
  for (const band of bands) band.items.sort((a, b) => cx(boxOf(a)) - cx(boxOf(b)));
  return bands;
}

/** Vertical gutter x positions inside a band: between columns + both outer sides. */
function gutterXs(boxes: Box[]): number[] {
  const sorted = [...boxes].sort((a, b) => a.x - b.x);
  const xs: number[] = [sorted[0].x - GUTTER_REACH];
  for (let i = 0; i < sorted.length - 1; i++) {
    xs.push((sorted[i].x + sorted[i].w + sorted[i + 1].x) / 2);
  }
  const last = sorted[sorted.length - 1];
  xs.push(last.x + last.w + GUTTER_REACH);
  return xs;
}

/**
 * The founder tree. `heads` are the division header boxes in any order.
 * Returns path strings: trunk/spine feeds, then per-band bus + stubs.
 */
export function buildTree(founder: Box, heads: Box[]): string[] {
  if (!heads.length) return [];
  const bands = bandsOf(heads, (b) => b);
  const paths: string[] = [];

  let feedX = cx(founder);
  let feedY = founder.y + founder.h;

  for (const band of bands) {
    const busY = band.top - BUS_GAP;
    if (busY <= feedY) return paths; // degenerate layout; draw nothing further
    const centers = band.items.map((b) => cx(b));
    const first = centers[0];
    const last = centers[centers.length - 1];

    // Feed line from the founder (or the previous band's bus) down to this bus.
    paths.push(elbowPath([
      [feedX, feedY],
      [feedX, busY],
    ]));

    if (band.items.length === 1) {
      // Single column: elbow straight into its stub.
      paths.push(elbowPath([
        [feedX, busY],
        [first, busY],
        [first, band.top],
      ]));
    } else {
      // Bus with rounded outer ends turning down into the outermost stubs.
      paths.push(elbowPath([
        [first, band.top],
        [first, busY],
        [last, busY],
        [last, band.top],
      ]));
      for (let i = 1; i < centers.length - 1; i++) {
        paths.push(`M ${r2(centers[i])} ${r2(busY)} L ${r2(centers[i])} ${r2(band.top)}`);
      }
    }

    // Next band's feed drops from this bus through this band's gutter
    // closest to the founder axis, so the spine stays centred and clear.
    const inner = gutterXs(band.items).slice(1, -1);
    feedX = inner.length
      ? inner.reduce((best, g) => (Math.abs(g - cx(founder)) < Math.abs(best - cx(founder)) ? g : best))
      : centers[0];
    feedY = busY;
  }

  return paths;
}

/** Shared routing context built once per measure. */
type RouteGeo = {
  nodes: Record<string, Box>;
  bands: Band<{ id: string; box: Box }>[];
  bandGutters: number[][];
  locate: (colId: string | undefined) => { bi: number; ci: number } | null;
  colOf: (nodeId: string) => string | undefined;
};

export function buildRouteGeo(args: {
  nodes: Record<string, Box>;
  cols: { id: string; box: Box }[];
  colOf: (nodeId: string) => string | undefined;
}): RouteGeo {
  const bands = bandsOf(args.cols, (c) => c.box);
  return {
    nodes: args.nodes,
    bands,
    bandGutters: bands.map((b) => gutterXs(b.items.map((c) => c.box))),
    locate: (colId) => {
      if (!colId) return null;
      for (let bi = 0; bi < bands.length; bi++) {
        const ci = bands[bi].items.findIndex((c) => c.id === colId);
        if (ci >= 0) return { bi, ci };
      }
      return null;
    },
    colOf: args.colOf,
  };
}

/**
 * One orthogonal route between two nodes, through gutters and the channels
 * between bands only — no line ever crosses a card face. `lane` offsets the
 * route inside the gutter so parallel paths read as separate traces.
 */
function routePair(
  geo: RouteGeo,
  fromId: string,
  toId: string,
  lane: number,
): { d: string; end: Pt } | null {
  const from = geo.nodes[fromId];
  const to = geo.nodes[toId];
  const fromLoc = geo.locate(geo.colOf(fromId));
  const toLoc = geo.locate(geo.colOf(toId));
  if (!from || !to || !fromLoc || !toLoc) return null;

  const fy = cy(from);
  const py = cy(to);
  const exit = (side: "l" | "r"): Pt =>
    side === "l" ? [from.x, fy] : [from.x + from.w, fy];
  const enter = (side: "l" | "r"): Pt =>
    side === "l" ? [to.x, py] : [to.x + to.w, py];

  let pts: Pt[];
  let end: Pt;

  if (fromLoc.bi === toLoc.bi && fromLoc.ci === toLoc.ci) {
    // Same column: out the right edge, along the adjacent gutter.
    const g = geo.bandGutters[fromLoc.bi][fromLoc.ci + 1] + lane;
    end = enter("r");
    pts = [exit("r"), [g, fy], [g, py], end];
  } else if (fromLoc.bi === toLoc.bi && Math.abs(fromLoc.ci - toLoc.ci) === 1) {
    // Adjacent columns: straight through the shared gutter.
    const right = toLoc.ci > fromLoc.ci;
    const g = geo.bandGutters[fromLoc.bi][Math.max(fromLoc.ci, toLoc.ci)] + lane;
    end = enter(right ? "l" : "r");
    pts = [exit(right ? "r" : "l"), [g, fy], [g, py], end];
  } else {
    // Far columns or different bands: gutter → channel → gutter.
    const toRight = cx(to) >= cx(from);
    const g1 =
      geo.bandGutters[fromLoc.bi][toRight ? fromLoc.ci + 1 : fromLoc.ci] + lane;
    const g2 =
      geo.bandGutters[toLoc.bi][cx(from) >= cx(to) ? toLoc.ci + 1 : toLoc.ci] + lane;
    const upper = geo.bands[Math.min(fromLoc.bi, toLoc.bi)];
    // The channel has more room than a gutter: spread lanes wider there so
    // many parallel traces read as a backplane, not a smear.
    const channelY = upper.bottom + CHANNEL_GAP + lane * 2.2;
    end = enter(cx(from) >= cx(to) ? "r" : "l");
    pts =
      Math.abs(g1 - g2) < 3
        ? [exit(toRight ? "r" : "l"), [g1, fy], [g1, py], end]
        : [exit(toRight ? "r" : "l"), [g1, fy], [g1, channelY], [g2, channelY], [g2, py], end];
  }

  return { d: elbowPath(pts), end: [r2(end[0]), r2(end[1])] };
}

/** Route the focused node's coordination edges, fanned into gutter lanes. */
export function routeEdges(args: {
  focusedId: string;
  partnerIds: string[];
  nodes: Record<string, Box>;
  cols: { id: string; box: Box }[];
  colOf: (nodeId: string) => string | undefined;
}): EdgeRoute[] {
  const geo = buildRouteGeo(args);
  const n = args.partnerIds.length;
  const routes: EdgeRoute[] = [];
  args.partnerIds.forEach((pid, k) => {
    const lane = Math.max(-6, Math.min(6, (k - (n - 1) / 2) * 4));
    const r = routePair(geo, args.focusedId, pid, lane);
    if (r) routes.push({ id: pid, d: r.d, end: r.end });
  });
  return routes;
}

export type MeshRoute = { a: string; b: string; d: string };

/**
 * The resting coordination mesh: every documented pair, drawn once. Lanes
 * are spread by pair index so parallel traces share gutters legibly.
 */
export function routeMesh(
  pairs: readonly [string, string][],
  args: {
    nodes: Record<string, Box>;
    cols: { id: string; box: Box }[];
    colOf: (nodeId: string) => string | undefined;
  },
): MeshRoute[] {
  const geo = buildRouteGeo(args);
  const routes: MeshRoute[] = [];
  pairs.forEach(([a, b], i) => {
    const lane = ((i % 5) - 2) * 3.2;
    const r = routePair(geo, a, b, lane);
    if (r) routes.push({ a, b, d: r.d });
  });
  return routes;
}
