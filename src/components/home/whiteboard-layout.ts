/**
 * The whiteboard sample: its notes and where they sit at a given wall width.
 *
 * One function lays the wall out for the server (which draws the still at the
 * desktop width) and for the runtime (which lays it out again at the width it
 * finds), so the two cannot disagree. The wall's height is not decided here:
 * home.css sets it from the wall's own width, in the same three bands, so the
 * page has its final length before any script runs. WALL_HEIGHT repeats those
 * numbers for clamping and the home browser spec checks the two agree.
 *
 * Which group a note belongs to is not fixed (round 3): `Columns` holds each
 * group's notes in order, the runtime moves a note between them when the
 * visitor drops it somewhere else, and the layout, the counts on the group
 * labels and what each note is called aloud all read from it.
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

/** Each group's notes, in order. A note in no list is between groups. */
export type Columns = Record<Group, number[]>;

/** Every note in the group it was written for, in slot order: the finished wall. */
export function homeColumns(): Columns {
  const columns: Columns = { day: [], suppliers: [], kitchen: [], guests: [], signage: [], ideas: [] };
  NOTES.map((_, i) => i)
    .sort((a, b) => NOTES[a].s - NOTES[b].s)
    .forEach((i) => columns[NOTES[i].g].push(i));
  return columns;
}

/** The group a note is in, or "" when it is between groups. */
export function groupOf(columns: Columns, k: number): Group | "" {
  for (const g of Object.keys(columns) as Group[]) if (columns[g].includes(k)) return g;
  return "";
}

/** Frame order on the loose wall, by mode. A phone shows three groups. */
export const ORDER: Record<Mode, Group[]> = {
  d: ["day", "suppliers", "kitchen", "signage", "ideas", "guests"],
  t: ["day", "suppliers", "kitchen", "signage", "guests", "ideas"],
  m: ["day", "suppliers", "kitchen"],
};
const TIDY_ORDER: Group[] = ["day", "suppliers", "kitchen", "guests", "signage", "ideas"];

/** The wall's height in each band. home.css says the same, by container query. */
export const WALL_HEIGHT: Record<Mode, number> = { d: 688, t: 1100, m: 1004 };
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
  /** The tidy wall's own measures: a column's padding and the distance from one note to the next. */
  tp: number;
  pitch: number;
  /** Each group's notes on the tidy wall, in order: `columns`, with any note between groups back in its own. */
  tcols: Partial<Record<Group, number[]>>;
};

export function layoutWall(width: number, columns: Columns = homeColumns()): WallLayout {
  const W = width;
  const mode = wallMode(W);
  const H = WALL_HEIGHT[mode];
  const fc = mode === "d" ? 3 : mode === "t" ? 2 : 1;
  const m = mode === "m" ? 0 : 24;
  const pad = mode === "m" ? 10 : 12;
  const gap = mode === "m" ? 8 : 10;
  /* A phone's wall keeps a little room at each side, so its notes can sit askew. */
  const side = mode === "m" ? 5 : 0;
  const nw =
    mode === "d"
      ? 164
      : mode === "t"
        ? Math.min(164, Math.floor((W - 2 * m - 40 - 4 * pad - 2 * gap) / 4))
        : Math.min(220, Math.floor((W - 2 * side - 2 * pad - gap) / 2));
  const nh = mode === "d" ? 108 : mode === "t" ? 118 : 112;
  const top = 44;
  const rowGap = mode === "m" ? 40 : 58;
  /* A group's label sits on its frame's top edge; the notes start below it, even askew. */
  const lift = mode === "m" ? 16 : 6;
  const fw = 2 * nw + gap + 2 * pad;
  const fh = 2 * nh + gap + 2 * pad + lift;
  const colGap = fc > 1 ? Math.max(8, Math.min(60, (W - 2 * m - fc * fw) / (fc - 1))) : 0;
  const x0 = (W - fc * fw - (fc - 1) * colGap) / 2;
  const order = ORDER[mode];
  const cell: Partial<Record<Group, Point>> = {};
  order.forEach((g, i) => {
    cell[g] = [x0 + (i % fc) * (fw + colGap), top + Math.floor(i / fc) * (fh + rowGap)];
  });
  const slot = (g: Group, k: number): Point => {
    const c = cell[g] as Point;
    return [c[0] + pad + (k % 2) * (nw + gap), c[1] + pad + lift + Math.floor(k / 2) * (nh + gap)];
  };
  const clampX = (x: number) => Math.max(2, Math.min(x, W - nw - 2));
  const home = (i: number) => groupOf(columns, i);
  /* On the wall: every note whose group is, and a note between groups whose own group is. */
  const shown = NOTES.map((_, i) => i).filter((i) => order.includes(home(i) || NOTES[i].g));
  const S: Record<number, Point> = {};
  const T: Record<number, Point> = {};
  /* The loose wall. A note in its own group sits in its own slot, a little askew (more so
     on a phone, where there is no room to scatter sideways). A note that has moved in from
     another group takes a slot nobody is using, or leans on the last one. */
  const askew = (note: NoteData, p: Point): Point =>
    mode === "m" ? [p[0] + note.j[0] * 1.2, p[1] + note.j[1] * 1.6] : [p[0] + note.j[0], p[1] + note.j[1]];
  shown.forEach((i) => {
    const note = NOTES[i];
    const g = home(i);
    let p: Point;
    if (g === note.g || g === "") {
      if (note.g === "ideas") {
        const c = cell.ideas as Point;
        p = ([[c[0] + 4, c[1] + 36], [c[0] + fw - nw - 6, c[1] + 56], [c[0] + (fw - nw) / 2 - 10, c[1] + 150]] as Point[])[note.s];
      } else p = slot(note.g, note.s);
      if (i === STRAY && g === "") p = mode === "m" ? [p[0] - 10, p[1] + 18] : [p[0] - 38, p[1] + 70];
      else if (note.g !== "ideas") p = askew(note, p);
    } else {
      const taken = columns[g].filter((k) => NOTES[k].g === g).map((k) => NOTES[k].s);
      const free = [0, 1, 2, 3].filter((k) => !taken.includes(k));
      const nth = columns[g].filter((k) => NOTES[k].g !== g).indexOf(i);
      const lean = 10 * (nth - free.length + 1);
      const last = slot(g, 3);
      p = nth < free.length ? slot(g, free[nth]) : [last[0] + lean, last[1] + lean];
    }
    S[i] = [clampX(p[0]), p[1]];
  });
  const fr: Partial<Record<Group, Rect>> = {};
  const tfr: Partial<Record<Group, Rect>> = {};
  const count: Partial<Record<Group, number>> = {};
  const tcols: Partial<Record<Group, number[]>> = {};
  order.forEach((g) => {
    const c = cell[g] as Point;
    fr[g] = [c[0], c[1], fw, fh];
    count[g] = columns[g].filter((i) => shown.includes(i)).length;
    /* Tidy puts everything in a column: a note between groups goes back to its own. */
    tcols[g] = columns[g].concat(shown.filter((i) => home(i) === "" && NOTES[i].g === g));
  });
  const tp = 10;
  const pitch = mode === "m" ? nh + gap : nh + 8;
  if (mode === "m") {
    /* A phone's tidy wall is the same three groups, squared up: nothing changes height. */
    order.forEach((g) => {
      (tcols[g] as number[]).forEach((i, k) => {
        T[i] = slot(g, k);
      });
      tfr[g] = fr[g];
    });
  } else {
    /* Tidy: one column a group. */
    const tc = mode === "d" ? 6 : 3;
    const tw = nw + 2 * tp;
    const tg = Math.max(8, Math.min(40, (W - 48 - tc * tw) / (tc - 1)));
    const tx0 = (W - tc * tw - (tc - 1) * tg) / 2;
    const groups = TIDY_ORDER.filter((g) => order.includes(g));
    let y = 48;
    for (let r = 0; r * tc < groups.length; r++) {
      let rowMax = 0;
      groups.slice(r * tc, r * tc + tc).forEach((g, c) => {
        const ns = tcols[g] as number[];
        const gx = tx0 + c * (tw + tg);
        ns.forEach((i, k) => {
          T[i] = [gx + tp, y + tp + lift + k * pitch];
        });
        const h = Math.max(1, ns.length) * pitch - 8 + 2 * tp + lift;
        tfr[g] = [gx, y, tw, h];
        rowMax = Math.max(rowMax, h);
      });
      y += rowMax + 54;
    }
  }
  return { W, H, mode, nw, nh, fw, fh, order, shown, S, T, fr, tfr, count, cell, slot, tp, pitch, tcols };
}

/** The group whose loose frame holds a point, or "" between them. */
export function looseGroupAt(L: WallLayout, x: number, y: number): Group | "" {
  let found: Group | "" = "";
  L.order.forEach((g) => {
    const b = L.fr[g];
    if (b && x >= b[0] && x <= b[0] + b[2] && y >= b[1] && y <= b[1] + b[3]) found = g;
  });
  return found;
}

/** On the tidy wall: the column nearest a point, and the place in it. */
export function tidyPlaceAt(L: WallLayout, x: number, y: number): { g: Group; index: number } {
  let best = L.order[0];
  let nearest = Infinity;
  L.order.forEach((g) => {
    const b = L.tfr[g];
    if (!b) return;
    const dx = Math.max(b[0] - x, 0, x - b[0] - b[2]);
    const dy = Math.max(b[1] - y, 0, y - b[1] - b[3]);
    const d = Math.hypot(dx, dy);
    if (d < nearest) {
      nearest = d;
      best = g;
    }
  });
  const b = L.tfr[best] as Rect;
  if (L.mode === "m") {
    const column = x < b[0] + b[2] / 2 ? 0 : 1;
    const row = Math.max(0, Math.round((y - (b[1] + 26 + L.nh / 2)) / L.pitch));
    return { g: best, index: row * 2 + column };
  }
  return { g: best, index: Math.max(0, Math.round((y - (b[1] + L.tp + 6 + L.nh / 2)) / L.pitch)) };
}

/** Whether the tidy wall no longer holds every note: one runs off the foot, out of its frame on a phone, or under `avoid`. */
export function tidyOverflows(L: WallLayout, avoid?: Rect): boolean {
  return L.shown.some((i) => {
    const p = L.T[i];
    if (!p) return false;
    if (p[1] + L.nh > L.H - 6) return true;
    if (L.mode === "m") {
      const g = L.order.find((group) => (L.tcols[group] as number[]).includes(i)) as Group;
      const b = L.fr[g] as Rect;
      if (p[1] + L.nh > b[1] + b[3]) return true;
    }
    return Boolean(avoid && p[0] < avoid[0] + avoid[2] && p[0] + L.nw > avoid[0] && p[1] < avoid[1] + avoid[3] && p[1] + L.nh > avoid[1]);
  });
}

/** Where a note's owner's initials sit, as a rectangle on the wall. */
export function avatarRect(L: WallLayout, p: Point): Rect {
  return [p[0] + L.nw - 38, p[1] + L.nh - 36, 28, 28];
}

/**
 * Where a sample person's pointer rests on a note so that their name, which
 * hangs from the pointer, covers nobody's initials, no group's label and none
 * of the wall's controls. Tried in order: the name just under the note, the
 * name in the room beside a short title, the same on the left. `flag` is the
 * name's size and its offset from the pointer's tip.
 */
export function restOn(
  L: WallLayout,
  p: Point,
  flag: { w: number; h: number; dx: number; dy: number },
  avoid: readonly Rect[],
): Point {
  const tries: Point[] = [
    [p[0] + L.nw * 0.5, p[1] + L.nh + 3 - flag.dy],
    [p[0] + L.nw * 0.5, p[1] + L.nh * 0.22],
    [p[0] + L.nw * 0.16, p[1] + L.nh * 0.22],
  ];
  const clear = ([x, y]: Point) => {
    const r: Rect = [x + flag.dx, y + flag.dy, flag.w, flag.h];
    if (r[0] < 2 || r[0] + r[2] > L.W - 2 || r[1] < 2 || r[1] + r[3] > L.H - 2) return false;
    return !avoid.some((o) => r[0] < o[0] + o[2] && r[0] + r[2] > o[0] && r[1] < o[1] + o[3] && r[1] + r[3] > o[1]);
  };
  return tries.find(clear) ?? tries[0];
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

/** The "depends on" label's width, with a little air. */
const DEP_WIDTH = 96;

/**
 * The two "depends on" arrows, as path data and label positions. Null on a
 * phone. The first arrow carries its label only where the gap it crosses is
 * wide enough to hold one clear of the notes either side; the second arrow's
 * label says what both mean.
 */
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
  const room = a2[1] === a1[1] && x2 - x1 >= DEP_WIDTH;
  return {
    a: { ln: `M${x1} ${y1} L${x2} ${y1}`, hd: `M${x2 - 7} ${y1 - 5} L${x2} ${y1} L${x2 - 7} ${y1 + 5}`, dep: room ? ([(x1 + x2) / 2, y1 + 20] as Point) : null },
    b: { ln: `M${bx} ${by1} L${bx} ${by2}`, hd: `M${bx - 5} ${by2 - 7} L${bx} ${by2} L${bx + 5} ${by2 - 7}`, dep: [bx + 56, (by1 + by2) / 2] as Point },
  };
}

/** What a note is called aloud: its title, where it is, then its date and owner. */
export function noteLabel(note: NoteData, group: Group | "" = note.g) {
  return `${note.title.replace("&", "and")}, ${group ? `in ${GROUP_NAME[group]}` : "between groups"}, ${note.detail}`;
}
