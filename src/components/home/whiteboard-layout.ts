/**
 * The whiteboard sample: its notes and where they sit at a given wall width.
 *
 * One function lays the wall out for the server (which draws the still at the
 * desktop width) and for the runtime (which lays it out again at the width it
 * finds), so the two cannot disagree. The wall's height is not decided here:
 * home.css sets it from the wall's own width, in the same three bands, so the
 * page has its final length before any script runs. WALL_HEIGHT repeats those
 * numbers for clamping and the home browser spec checks the two agree.
 */
export type Group = "day" | "suppliers" | "kitchen" | "guests" | "signage" | "ideas";
export type Mode = "d" | "t" | "m";
export type Point = [number, number];
export type Rect = [number, number, number, number];

export type NoteData = {
  /** A fixed id for the notes the sample people act on. */
  id?: string;
  g: Group;
  /** Slot in the group. */
  s: number;
  /** Loose-wall jitter: x, y and tilt. */
  j: [number, number, number];
  title: string;
  /** Spoken detail after the title and group: due date and owner. */
  detail: string;
  meta?: string;
  late?: boolean;
  done?: boolean;
  who?: string;
  /** Avatar colour. */
  a?: string;
  /** Note ground. */
  c: string;
};

export const GROUP_NAME: Record<Group, string> = {
  day: "The day",
  suppliers: "Suppliers",
  kitchen: "Kitchen and bar",
  guests: "Guests and seating",
  signage: "Signage",
  ideas: "Ideas",
};
export const GROUP_HUE: Record<Group, string> = {
  day: "var(--lp-n-indigo)",
  suppliers: "var(--lp-n-blue)",
  kitchen: "var(--lp-n-teal)",
  guests: "var(--lp-n-plum)",
  signage: "var(--lp-n-green)",
  ideas: "var(--lp-n-plum)",
};

const AOIFE = "var(--lp-av-violet)";
const DARA = "var(--lp-av-green)";
const DEV = "var(--lp-av-teal)";
const TOMAS = "var(--lp-av-blue)";
const ORLA = "var(--indigo-600)";

export const NOTES: readonly NoteData[] = [
  { g: "day", s: 0, j: [-3, 2, -1.2], title: "Brief the whole team on the day", detail: "due Fri 2 Oct, Aoife", meta: "Fri 2 Oct", who: "AB", a: AOIFE, c: GROUP_HUE.day },
  { g: "day", s: 1, j: [4, -2, 0.9], title: "Draft a wet-weather plan for the drinks reception", detail: "due Wed, Orla", meta: "Wed", who: "OB", a: ORLA, c: GROUP_HUE.day },
  { g: "day", s: 2, j: [2, 4, 1.4], title: "Test the festoon lights on the terrace", detail: "due Thu, Tomás", meta: "Thu", who: "TR", a: TOMAS, c: GROUP_HUE.day },
  { g: "day", s: 3, j: [-4, -1, -0.8], title: "Rehearsal timings with Mara and Finn", detail: "done, Aoife", meta: "Done", done: true, who: "AB", a: AOIFE, c: GROUP_HUE.day },
  { g: "suppliers", s: 0, j: [3, 3, 1.1], title: "Confirm marquee sides with Lawlor Hire", detail: "due Mon, Aoife", meta: "Mon", who: "AB", a: AOIFE, c: GROUP_HUE.suppliers },
  { id: "n-florist", g: "suppliers", s: 1, j: [-2, -3, -1.5], title: "Chase florist deposit", detail: "waiting 7 days, Aoife", meta: "Waiting · 7 days", who: "AB", a: AOIFE, c: GROUP_HUE.suppliers },
  { g: "suppliers", s: 2, j: [4, 1, 0.7], title: "Confirm the band's arrival time with The Lindens", detail: "due Tue, Dara", meta: "Tue", who: "DH", a: DARA, c: GROUP_HUE.suppliers },
  { g: "suppliers", s: 3, j: [-3, 4, -1.1], title: "Pay The Lindens' balance", detail: "due Tue 6 Oct, Orla", meta: "Tue 6 Oct", who: "OB", a: ORLA, c: GROUP_HUE.suppliers },
  { g: "kitchen", s: 0, j: [2, -2, 1.3], title: "Order tonic and the good olives", detail: "2 days late, Dev", meta: "2 days late", late: true, who: "DP", a: DEV, c: GROUP_HUE.kitchen },
  { g: "kitchen", s: 1, j: [-4, 3, -0.9], title: "Menu tasting at The Orchard", detail: "due today, Dev", meta: "Today", who: "DP", a: DEV, c: GROUP_HUE.kitchen },
  { id: "n-stray", g: "kitchen", s: 2, j: [0, 0, 4], title: "Order prosecco for the drinks reception", detail: "due Tue, Dev", meta: "Tue", who: "DP", a: DEV, c: GROUP_HUE.kitchen },
  { id: "n-final", g: "kitchen", s: 3, j: [3, -1, 1.2], title: "Final numbers to the kitchen", detail: "due Wed, Aoife", meta: "Wed", who: "AB", a: AOIFE, c: GROUP_HUE.kitchen },
  { g: "guests", s: 0, j: [-2, 2, 0.8], title: "Order place card stock", detail: "due tomorrow, Aoife", meta: "Tomorrow", who: "AB", a: AOIFE, c: GROUP_HUE.guests },
  { id: "n-approve", g: "guests", s: 1, j: [4, -3, -1.3], title: "Approve the seating plan", detail: "waiting on Mara, Aoife", meta: "Waiting on Mara", who: "AB", a: AOIFE, c: GROUP_HUE.guests },
  { g: "guests", s: 2, j: [-3, 1, 1], title: "Send Mara and Finn the thank-you card", detail: "due Wed 7 Oct, Aoife", meta: "Wed 7 Oct", who: "AB", a: AOIFE, c: GROUP_HUE.guests },
  { g: "signage", s: 0, j: [2, 3, -1.4], title: "Reprint the faded welcome sign", detail: "3 days late, Dara", meta: "3 days late", late: true, who: "DH", a: DARA, c: GROUP_HUE.signage },
  { g: "signage", s: 1, j: [-4, -2, 1.2], title: "Table plan easel by the barn door", detail: "no date, no owner", c: GROUP_HUE.signage },
  { g: "signage", s: 2, j: [3, 2, -0.7], title: "Arrows from the car park to the orchard", detail: "no date, Tomás", who: "TR", a: TOMAS, c: GROUP_HUE.signage },
  { g: "ideas", s: 0, j: [0, 0, -2], title: "Blankets on the benches if it turns cold", detail: "no date, no owner", c: GROUP_HUE.ideas },
  { g: "ideas", s: 1, j: [0, 0, 2.5], title: "Rings back from Tolland & Sons in time?", detail: "no date, no owner", c: "var(--lp-n-blue)" },
  { id: "n-typed", g: "ideas", s: 2, j: [0, 0, -1], title: "Sparkler exit at 23:00?", detail: "no date, Aoife", who: "AB", a: AOIFE, c: GROUP_HUE.ideas },
];

/** The stray note's index: it starts outside its group until Dara straightens it. */
export const STRAY = NOTES.findIndex((note) => note.id === "n-stray");

/** Frame order on the loose wall, by mode. A phone shows three groups. */
export const ORDER: Record<Mode, Group[]> = {
  d: ["day", "suppliers", "kitchen", "signage", "ideas", "guests"],
  t: ["day", "suppliers", "kitchen", "signage", "guests", "ideas"],
  m: ["day", "suppliers", "kitchen"],
};
const TIDY_ORDER: Group[] = ["day", "suppliers", "kitchen", "guests", "signage", "ideas"];

/** The wall's height in each band. home.css says the same, by container query. */
export const WALL_HEIGHT: Record<Mode, number> = { d: 688, t: 1100, m: 986 };
export const WALL_BREAKS = { t: 684, d: 1152 } as const;

export function wallMode(width: number): Mode {
  return width >= WALL_BREAKS.d ? "d" : width >= WALL_BREAKS.t ? "t" : "m";
}

export type WallLayout = {
  W: number;
  H: number;
  mode: Mode;
  nw: number;
  nh: number;
  fw: number;
  fh: number;
  order: Group[];
  /** Indexes into NOTES of the notes on this wall. */
  shown: number[];
  /** Loose and tidy position of each note, by index. */
  S: Record<number, Point>;
  T: Record<number, Point>;
  /** Loose and tidy frame of each group, and how many notes it holds. */
  fr: Partial<Record<Group, Rect>>;
  tfr: Partial<Record<Group, Rect>>;
  count: Partial<Record<Group, number>>;
  cell: Partial<Record<Group, Point>>;
  slot: (g: Group, k: number) => Point;
};

export function layoutWall(width: number, strayHome: boolean): WallLayout {
  const W = width;
  const mode = wallMode(W);
  const H = WALL_HEIGHT[mode];
  const fc = mode === "d" ? 3 : mode === "t" ? 2 : 1;
  const m = mode === "m" ? 0 : 24;
  const pad = mode === "m" ? 10 : 12;
  const gap = mode === "m" ? 8 : 10;
  const nw =
    mode === "d"
      ? 164
      : mode === "t"
        ? Math.min(164, Math.floor((W - 2 * m - 40 - 4 * pad - 2 * gap) / 4))
        : Math.min(220, Math.floor((W - 2 * pad - gap) / 2));
  const nh = mode === "d" ? 108 : mode === "t" ? 118 : 112;
  const top = 44;
  const rowGap = mode === "m" ? 50 : 58;
  const fw = 2 * nw + gap + 2 * pad;
  const fh = 2 * nh + gap + 2 * pad;
  const colGap = fc > 1 ? Math.max(8, Math.min(60, (W - 2 * m - fc * fw) / (fc - 1))) : 0;
  const x0 = (W - fc * fw - (fc - 1) * colGap) / 2;
  const order = ORDER[mode];
  const cell: Partial<Record<Group, Point>> = {};
  order.forEach((g, i) => {
    cell[g] = [x0 + (i % fc) * (fw + colGap), top + Math.floor(i / fc) * (fh + rowGap)];
  });
  const slot = (g: Group, k: number): Point => {
    const c = cell[g] as Point;
    return [c[0] + pad + (k % 2) * (nw + gap), c[1] + pad + Math.floor(k / 2) * (nh + gap)];
  };
  const clampX = (x: number) => Math.max(2, Math.min(x, W - nw - 2));
  const shown = NOTES.map((_, i) => i).filter((i) => order.includes(NOTES[i].g));
  const S: Record<number, Point> = {};
  const T: Record<number, Point> = {};
  shown.forEach((i) => {
    const note = NOTES[i];
    let p: Point;
    if (note.g === "ideas") {
      const c = cell.ideas as Point;
      p = ([[c[0] + 4, c[1] + 36], [c[0] + fw - nw - 6, c[1] + 56], [c[0] + (fw - nw) / 2 - 10, c[1] + 150]] as Point[])[note.s];
    } else p = slot(note.g, note.s);
    if (i === STRAY && !strayHome) p = mode === "m" ? [p[0] - 10, p[1] + 18] : [p[0] - 38, p[1] + 70];
    else if (note.g !== "ideas") p = [p[0] + (mode === "m" ? 0 : note.j[0]), p[1] + note.j[1]];
    S[i] = [clampX(p[0]), p[1]];
  });
  const fr: Partial<Record<Group, Rect>> = {};
  const tfr: Partial<Record<Group, Rect>> = {};
  const count: Partial<Record<Group, number>> = {};
  order.forEach((g) => {
    const c = cell[g] as Point;
    fr[g] = [c[0], c[1], fw, fh];
    count[g] = shown.filter((i) => NOTES[i].g === g).length;
  });
  if (mode === "m") {
    /* A phone's tidy wall is the same three groups, squared up: nothing changes height. */
    shown.forEach((i) => {
      T[i] = slot(NOTES[i].g, NOTES[i].s);
    });
    order.forEach((g) => {
      tfr[g] = fr[g];
    });
  } else {
    /* Tidy: one column a group. */
    const tc = mode === "d" ? 6 : 3;
    const tp = 10;
    const tw = nw + 2 * tp;
    const tg = Math.max(8, Math.min(40, (W - 48 - tc * tw) / (tc - 1)));
    const tx0 = (W - tc * tw - (tc - 1) * tg) / 2;
    const groups = TIDY_ORDER.filter((g) => order.includes(g));
    let y = 48;
    for (let r = 0; r * tc < groups.length; r++) {
      let rowMax = 0;
      groups.slice(r * tc, r * tc + tc).forEach((g, c) => {
        const ns = shown.filter((i) => NOTES[i].g === g).sort((a, b) => NOTES[a].s - NOTES[b].s);
        const gx = tx0 + c * (tw + tg);
        ns.forEach((i, k) => {
          T[i] = [gx + tp, y + tp + k * (nh + 8)];
        });
        const h = Math.max(1, ns.length) * (nh + 8) - 8 + 2 * tp;
        tfr[g] = [gx, y, tw, h];
        rowMax = Math.max(rowMax, h);
      });
      y += rowMax + 54;
    }
  }
  return { W, H, mode, nw, nh, fw, fh, order, shown, S, T, fr, tfr, count, cell, slot };
}

/** Where the handwritten lines sit on the loose wall. Null when the wall has no room for one. */
export function handSpots(L: WallLayout): (Point | null)[] {
  const c = L.cell;
  return [
    c.ideas ? [c.ideas[0] + 6, c.ideas[1] + 2] : null,
    c.day ? [c.day[0] + 8, c.day[1] + L.fh + 16] : null,
    c.suppliers && L.mode !== "m" ? [c.suppliers[0] + (L.mode === "d" ? 150 : 8), c.suppliers[1] + L.fh + 16] : null,
  ];
}

/** The two "depends on" arrows, as path data and label positions. Null on a phone. */
export function arrowPaths(L: WallLayout) {
  if (L.mode === "m") return null;
  const a1 = L.slot("day", 1);
  const a2 = L.slot("suppliers", 0);
  const x1 = a1[0] + L.nw + 6;
  const y1 = a1[1] + L.nh / 2;
  const x2 = a2[0] - 6;
  const b1 = L.slot("kitchen", 3);
  const b2 = L.slot("guests", 1);
  const bx = b1[0] + L.nw / 2;
  const by1 = b1[1] + L.nh + 6;
  const by2 = b2[1] - 7;
  return {
    a: { ln: `M${x1} ${y1} L${x2} ${y1}`, hd: `M${x2 - 7} ${y1 - 5} L${x2} ${y1} L${x2 - 7} ${y1 + 5}`, dep: [(x1 + x2) / 2, y1 + 20] as Point },
    b: { ln: `M${bx} ${by1} L${bx} ${by2}`, hd: `M${bx - 5} ${by2 - 7} L${bx} ${by2} L${bx + 5} ${by2 - 7}`, dep: [bx + 56, (by1 + by2) / 2] as Point },
  };
}

/** What a note is called aloud: its title, its group, then its date and owner. */
export function noteLabel(note: NoteData) {
  return `${note.title.replace("&", "and")}, in ${GROUP_NAME[note.g]}, ${note.detail}`;
}
