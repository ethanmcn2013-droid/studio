import {
  COLORS,
  type DotPose,
  type DotColor,
  type StageColor,
  type Eye,
  clamp,
} from "./model";
import palette from "./palette.json";
export type RenderOptions = {
  size?: number;
  color?: DotColor;
  stage?: StageColor;
  effects?: boolean;
  grounded?: boolean;
  face?: boolean;
};
const n = (v: number) => (Number.isFinite(v) ? v : 0).toFixed(3);
const THREADS = palette.threads;
/** Continuous eye geometry. Curvature can smile or soften a sleeping lid. */
export function eyePath(e: Eye) {
  const w = e.width,
    h = e.curve > 0 ? e.height * (1 - 0.88 * e.curve) : e.height;
  const r = Math.min(w, h) / 2,
    x = -w / 2,
    y = -h / 2;
  const lift = -e.curve * 5.5;
  return `M${n(x + r)} ${n(y)} Q0 ${n(y + lift)} ${n(-x - r)} ${n(y)} Q${n(-x)} ${n(y)} ${n(-x)} ${n(y + r)} L${n(-x)} ${n(-y - r)} Q${n(-x)} ${n(-y)} ${n(-x - r)} ${n(-y)} Q0 ${n(-y + lift)} ${n(x + r)} ${n(-y)} Q${n(x)} ${n(-y)} ${n(x)} ${n(-y - r)} L${n(x)} ${n(y + r)} Q${n(x)} ${n(y)} ${n(x + r)} ${n(y)} Z`;
}
type Line = { d: string; stroke: string; opacity: number; width: number };
export function orbitLines(p: DotPose): { back: Line[]; front: Line[] } {
  const back: Line[] = [],
    front: Line[] = [];
  if (p.orbit < 0.001) return { back, front };
  const count = Math.min(6, Math.ceil(p.orbitDensity)),
    steps = 80;
  for (let j = 0; j < count; j++) {
    const alpha = clamp(p.orbitDensity - j),
      tilt = j * 1.09 + 0.24,
      ct = Math.cos(tilt),
      st = Math.sin(tilt);
    const span = 1.25 + p.orbit * 3.6,
      begin = p.orbitPhase * (1 + j * 0.047) + j * 0.86;
    let last: { x: number; y: number } | null = null,
      side = false,
      d = "";
    const push = () => {
      if (d)
        (side ? front : back).push({
          d,
          stroke: THREADS[j],
          opacity: p.orbit * alpha * (side ? 0.95 : 0.64),
          width: 0.8 + 0.45 * p.orbit,
        });
    };
    for (let i = 0; i <= steps; i++) {
      const angle = begin - span + (span * i) / steps;
      const x0 = Math.cos(angle) * (66 + j * 1.2),
        y0 = Math.sin(angle) * (18 + j * 1.7);
      const x = x0 * ct - y0 * st,
        y = x0 * st + y0 * ct;
      const nextSide = Math.sin(angle) >= 0;
      if (i === 0 || side !== nextSide) {
        push();
        side = nextSide;
        d = last
          ? `M${n(last.x)} ${n(last.y)}L${n(x)} ${n(y)}`
          : `M${n(x)} ${n(y)}`;
      } else d += `L${n(x)} ${n(y)}`;
      last = { x, y };
    }
    push();
  }
  return { back, front };
}
function lineMarkup(lines: Line[]) {
  return lines
    .map(
      (l) =>
        `<path d="${l.d}" fill="none" stroke="${l.stroke}" stroke-width="${n(l.width)}" stroke-opacity="${n(l.opacity)}" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    .join("");
}
/** Markup is built only from finite numbers and closed palette enums, never user text. */
export function renderContents(p: DotPose, options: RenderOptions = {}) {
  const body = COLORS[options.color ?? "indigo"] ?? COLORS.indigo,
    dark = options.stage === "night";
  const face = body === COLORS.paper ? COLORS.indigo : COLORS.paper;
  const effects = options.effects !== false,
    orbit = effects ? orbitLines(p) : { back: [], front: [] };
  const scale = clamp(p.scale, 0.12, 1.15);
  const bg =
    options.stage === "transparent"
      ? ""
      : `<rect x="-95" y="-95" width="190" height="190" fill="${dark ? palette.stage.night : palette.stage.paper}"/>`;
  const ground = options.grounded
    ? `<ellipse data-part="shadow" cx="${n(p.x)}" cy="52" rx="${n((20 - clamp(-p.y / 30) * 9) * scale)}" ry="1.8" fill="${dark ? palette.shadow.night : palette.shadow.paper}" opacity="${n(0.085 * (1 - clamp(-p.y / 45)))}"/>`
    : "";
  const eyes =
    options.face === false
      ? ""
      : `<g data-part="face" opacity="${n(p.faceOpacity)}" transform="rotate(${n(p.roll)})" fill="${face}">${[p.left, p.right].map((e, i) => `<path data-part="eye-${i}" d="${eyePath(e)}" transform="translate(${n(e.x)} ${n(e.y)}) rotate(${n(e.angle)})"/>`).join("")}</g>`;
  let beads = "";
  if (effects && p.satellites > 0.001) {
    for (let i = 0; i < 3; i++) {
      const row = p.satellitePhase === -1,
        a = p.satellitePhase + (i * Math.PI * 2) / 3;
      if (row && i === 2) continue;
      const x = row ? (i ? 1 : -1) * 74 : Math.cos(a) * 76;
      const y = row ? 0 : Math.sin(a) * 32;
      beads += `<circle cx="${n(x)}" cy="${n(y)}" r="${n((row ? 15 : 10 - i * 2) * p.satellites)}" fill="${body}" opacity="${n((0.7 - i * 0.18) * p.satellites)}"/>`;
    }
  }
  const bead =
    effects && p.bead > 0.001
      ? `<circle cx="40" cy="-37" r="${n(6 * p.bead)}" fill="${palette.bead}" stroke="${dark ? palette.stage.night : palette.stage.paper}" stroke-width="2"/>`
      : "";
  return `${bg}${ground}<g data-part="rig" transform="translate(${n(p.x)} ${n(p.y)}) scale(${n(scale)})">${beads}${lineMarkup(orbit.back)}<circle data-part="body" cx="0" cy="0" r="50" fill="${body}"/>${eyes}${lineMarkup(orbit.front)}${bead}</g>`;
}
export function renderSvg(p: DotPose, options: RenderOptions = {}) {
  const size = Math.round(clamp(options.size ?? 1024, 16, 4096));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="-95 -95 190 190">${renderContents(p, options)}</svg>`;
}
