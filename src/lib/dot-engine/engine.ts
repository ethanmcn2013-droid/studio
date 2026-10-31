/* Dot 4, the character engine. Ported from ethan-mcnamara.com
   src/js/dot/engine.mjs, which stays the source of truth for how Dot moves.

   One circle and two capsule eyes. At rest Dot is exactly the approved
   silhouette (R 50, eyes at -12.4,-14 and 12.4,-15). In motion the body
   squashes and stretches with its area kept, lands with weight, wobbles,
   leans and rolls; lids give the eyes a range of feeling; small marks
   (a sparkle, a sweat drop, a z) carry what a mouth would.

   Time. The simulation advances in whole steps of exactly 1/120 s, counted
   as an integer tick. A frame of any length runs however many whole steps
   fit and keeps the remainder for the next frame; the drawing interpolates
   between the last two steps. So the same script produces the same states
   at 60, 120 or 144 Hz.

   Every moving value is a spring, so any action can interrupt any other.
   Random choices come from a seeded source. Every tuning number lives in
   tuning.ts with its unit and reason.

   What the port leaves out, because the footer never uses it: picking Dot up
   and throwing it, the ceiling, Faces 2 (per-eye lids, heat, blush, melt,
   welling), the page-wide clock, the films, sections, sound and mood pad.
   What it adds, each an option that defaults to the canon: `breathe` scales
   the waking breath (the footer's full stop holds still), `shove` lets a
   poke nudge Dot along the floor, and `minMark` keeps marks legible when Dot
   is drawn as small as a full stop. */
import { TUNING as T } from "./tuning";

export const R = 50;
export const HZ = T.hz;
export const STEP = 1 / HZ;
const TAU = Math.PI * 2;
/* Points round the outline: a true circle to under a tenth of a pixel at the
   largest size drawn, in as short a path as the browser has to parse. */
const OUTLINE = 30;
export const EYES = [
  { x: -12.4, y: -14, w: 12.24, h: 26.4, inner: 1 },
  { x: 12.4, y: -15, w: 11.52, h: 25.2, inner: -1 },
] as const;
const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const f1 = (n: number) => Math.round(n * 10) / 10;
const ticks = (s: number) => Math.max(0, Math.round(s * HZ));
/* Axes are undirected: the shorter way round a half turn. */
const halfTurn = (d: number) => {
  d %= Math.PI;
  if (d > Math.PI / 2) d -= Math.PI;
  if (d < -Math.PI / 2) d += Math.PI;
  return d;
};

/* Stiffness and damping, per unit mass. The names are the vocabulary the
   portfolio uses to describe how Dot moves. */
type Preset = readonly [number, number];
export const PRESETS = {
  bouncy: [260, 12], snappy: [560, 34], floaty: [70, 10], heavy: [150, 26], jelly: [420, 6],
} as const satisfies Record<string, Preset>;

export class Spring {
  v: number; t: number; vel = 0; k: number; c: number;
  constructor(v = 0, [k, c]: Preset = PRESETS.snappy) { this.v = v; this.t = v; this.k = k; this.c = c; }
  step(dt: number, snap?: boolean) {
    if (snap) { this.v = this.t; this.vel = 0; return; }
    this.vel += (this.k * (this.t - this.v) - this.c * this.vel) * dt;
    this.v += this.vel * dt;
  }
  set(v: number) { this.v = this.t = v; this.vel = 0; return this; }
  /* Hold inside a range. Speed into a bound is spent, so a squash that hits
     its limit comes back instead of sticking there. */
  keep(lo: number, hi: number) {
    if (this.v < lo) { this.v = lo; if (this.vel < 0) this.vel = 0; }
    else if (this.v > hi) { this.v = hi; if (this.vel > 0) this.vel = 0; }
  }
  /* At rest on its target, to within a hair. */
  get still() { return Math.abs(this.vel) < 0.01 && Math.abs(this.t - this.v) < 0.002; }
}

export function rng(seed: number) {
  let a = seed >>> 0 || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Lid poses. top: how far the upper lid has come down (0–1). bot: how far
   the lower lid has come up, arched, which is what reads as a smile. tilt:
   positive drops the inner corners (cross), negative lifts them (worried).
   size: the whole eye. */
export type Face = { top?: number; bot?: number; tilt?: number; size?: number; cross?: number };
export const FACES: Record<string, Face> = {
  rest: {}, happy: { bot: 0.5, top: 0.04 }, joy: { bot: 1, size: 1.08 }, sleepy: { top: 0.58 }, asleep: { top: 1 },
  grumpy: { top: 0.4, tilt: 0.9 }, suspicious: { top: 0.46, bot: 0.22 }, surprised: { size: 1.3 },
  worried: { tilt: -0.9, top: 0.3 }, squeeze: { top: 0.55, bot: 0.5 }, sheepish: { top: 0.32, bot: 0.26 },
  focused: { top: 0.28, tilt: 0.25 }, dizzy: { cross: 1 }, smug: { top: 0.44, bot: 0.3, tilt: 0.2 },
  wide: { size: 1.18, top: 0 }, fond: { bot: 0.38, top: 0.18 }, sulky: { top: 0.5, tilt: 0.5, bot: 0.08 },
};

export type MarkType = keyof typeof MARKS;
export type Emote = {
  type: MarkType; color?: string; life: number; age: number; x: number; y: number; vx: number; vy: number;
  s: Spring; size: number; rot: number; spin: number; px: number; py: number; ps: number;
};
type Timer = { at: number; fn: () => void; owner: string; id: number };
type Tween = { from: number; n: number; fn: (k: number) => void; owner: string; done?: boolean };
type Listener = (type: string, data: Record<string, unknown>, dot: Dot) => void;

export type DotOptions = {
  x?: number; y?: number; r?: number; floor?: number; walls?: [number, number]; seed?: number;
  reduced?: boolean; gravity?: number; breathe?: number; shove?: boolean;
};

export type EyeFrame = { x: number; y: number; body: string; clip: string; closed: string; shut: number; width: number; open: number; h: number; w: number };
export type Frame = {
  pts: Float64Array; face: number[]; eyes: [EyeFrame, EyeFrame]; body: string;
  shadow: { cx: number; cy: number; rx: number; ry: number; o: number };
  emotes: Emote[]; k: number; alpha: number; tick: number; lift: number;
};

export class Dot {
  r: number; floor: number; walls: [number, number]; reduced: boolean; g: number; breathe: number; shove: boolean;
  hold: number | null = null; faceLean = 0;
  x: number; y: number; vx = 0; vy = 0; air = false; dazed = false; stick = false;
  rand: () => number; tick = 0; acc = 0; alpha = 1; dropped = 0;
  timers: Timer[] = []; tweens: Tween[] = []; timerId = 0; listeners = new Set<Listener>();
  stretch = new Spring(1, PRESETS.bouncy); axis = Math.PI / 2;
  wob = new Spring(0, PRESETS.jelly); wobPhase = 0;
  lean = new Spring(0, PRESETS.floaty); spin = new Spring(0, PRESETS.heavy); rolling = false;
  lx = new Spring(0, PRESETS.snappy); ly = new Spring(0, PRESETS.snappy);
  top = new Spring(0, PRESETS.snappy); bot = new Spring(0, PRESETS.snappy);
  tilt = new Spring(0, PRESETS.snappy); size = new Spring(1, PRESETS.bouncy);
  mood = { energy: 0.55, feeling: 0.3 }; face: Face | null = null; faceUntil = 0; cross = false;
  sleeping = false; breath = 0; blinkAt: number; blinkAge = 9;
  gaze: { x: number; y: number } | null = null; gazeUntil = 0; saccadeAt = 0; idleLook: [number, number] = [0, 0]; crouch = 0;
  emotes: Emote[] = []; pokes = 0; lastPoke = -9; lastReaction = "";
  prev: Record<string, number> = {};
  out: Frame;

  constructor({ x = 0, y, r = R, floor = 0, walls = [-Infinity, Infinity], seed = 7, reduced = false, gravity = T.gravity, breathe = 1, shove = true }: DotOptions = {}) {
    this.r = r; this.floor = floor; this.walls = walls; this.reduced = reduced; this.g = gravity; this.breathe = breathe; this.shove = shove;
    this.x = x; this.y = y ?? floor - r;
    this.rand = rng(seed);
    this.blinkAt = 1 + this.rand() * 3;
    this.remember();
    this.out = makeFrame();
  }

  /* Time in seconds, derived from the tick so it never drifts. */
  get t() { return this.tick * STEP; }

  on(fn: Listener) { this.listeners.add(fn); return () => this.listeners.delete(fn); }
  emit(type: string, data: Record<string, unknown> = {}) { for (const fn of this.listeners) fn(type, data, this); }

  /* Run fn after a delay. Timers fire on whole steps, in the order they were
     set when they fall on the same step. An owner tag lets an action cancel
     what another action had queued. */
  after(seconds: number, fn: () => void, owner = "") {
    const at = this.tick + Math.max(1, ticks(seconds)), timer = { at, fn, owner, id: ++this.timerId };
    let lo = 0, hi = this.timers.length;
    while (lo < hi) { const m = (lo + hi) >> 1; if (this.timers[m].at <= at) lo = m + 1; else hi = m; }
    this.timers.splice(lo, 0, timer);
    return timer.id;
  }
  cancel(ownerOrId: string | number) {
    this.timers = this.timers.filter((x) => x.owner !== ownerOrId && x.id !== ownerOrId);
    this.tweens = this.tweens.filter((x) => x.owner !== ownerOrId);
    return this;
  }
  /* Call fn(k) on every step for a duration, k running up to 1. */
  tween(seconds: number, fn: (k: number) => void, owner = "") { this.tweens.push({ from: this.tick, n: Math.max(1, ticks(seconds)), fn, owner }); return this; }

  get grounded() { return !this.air; }
  /* Nothing left to play out: on the ground, nothing queued, no marks in
     flight, springs at rest. Breathing does not count. */
  get settled() {
    return this.grounded && !this.crouch && !this.timers.length && !this.tweens.length && !this.emotes.length && Math.abs(this.vx) < 2
      && Math.abs(this.stretch.vel) < 0.08 && Math.abs(this.wob.v) < 0.004 && Math.abs(this.lean.vel) < 2;
  }

  /* ── what Dot does. Each returns the Dot, so actions chain. ────────── */

  express(name: string, seconds = 1.2) {
    this.face = FACES[name] || null; this.faceUntil = seconds === Infinity ? Infinity : this.t + seconds;
    if (name !== "rest") this.emit("face", { name });
    return this;
  }
  lookAt(x: number, y: number, seconds = 1.5) { this.gaze = { x, y }; this.gazeUntil = this.t + seconds; return this; }
  blink(double = false) { this.blinkAge = 0; if (double) this.after(0.24, () => { this.blinkAge = 0; }); return this; }

  /* A hop is a crouch, a launch and a landing. Height is in body radii. */
  /* depth (port option, canon 0.74): how low the crouch aims. The bouncy
     spring overshoots it, so a full stop crouches shallower, or its eyes
     would ride up out of its squashed body. */
  hop({ dx = 0, height = 1.4, crouch = 0.09, stick = false, depth = 0.74 } = {}) {
    if (this.air || this.crouch) return this;
    if (this.reduced) { this.express("happy", 0.8); this.emit("hop", { reduced: true }); return this; }
    this.crouch = 1; this.stretch.t = depth; this.stretch.k = PRESETS.snappy[0];
    this.after(crouch, () => {
      this.crouch = 0; this.stretch.k = PRESETS.bouncy[0];
      this.vy = -Math.sqrt(2 * this.g * height * this.r); this.vx = dx; this.air = true; this.dazed = false; this.stick = stick;
      this.stretch.vel += 6; this.emit("hop", { power: height });
    }, "hop");
    return this;
  }
  /* Leave the ground now with a given velocity: choreography that has worked
     out its own arc. A stick landing takes it all in the squash. */
  launch(vx: number, vy: number, { stick = false } = {}) {
    if (this.reduced) return this;
    this.unhop(); this.vx = vx; this.vy = vy; this.air = true; this.dazed = false; this.stick = stick;
    this.stretch.vel += 6; this.emit("hop", { power: Math.min(3, -vy / 600) });
    return this;
  }
  /* Drop anything a hop had queued: a poke mid-crouch wins. */
  unhop() { if (this.crouch) { this.cancel("hop"); this.crouch = 0; this.stretch.k = PRESETS.bouncy[0]; } return this; }

  /* A poke lands where it lands. On an eye: a blink-flinch. On the body: a
     squash at the contact point. The first poke giggles or boops (never the
     same twice running), two or three in quick succession make Dot grumpy,
     with a sweat drop; the page decides what five does. */
  poke(px = this.x, py = this.y - this.r) {
    const dx = this.x - px, dy = this.y - py, d = Math.hypot(dx, dy) || 1;
    this.pokes = this.t - this.lastPoke < T.pokeMemory ? this.pokes + 1 : 1; this.lastPoke = this.t;
    const k = this.r / R, ex = (px - this.x) / k, ey = (py - this.y) / k;
    const eye = !this.sleeping && EYES.some((e) => Math.abs(ex - e.x) < 11 && Math.abs(ey - e.y) < 17);
    this.emit("poke", { count: this.pokes, eye });
    if (this.sleeping) { this.wake(true); return this; }
    const grumpy = this.pokes > 1;
    const reaction = eye ? "flinch" : grumpy ? "grumpy" : this.lastReaction === "giggle" ? "boop" : "giggle";
    this.lastReaction = reaction;
    if (this.reduced) {
      this.express(eye ? "squeeze" : grumpy ? "grumpy" : reaction === "boop" ? "surprised" : "happy", grumpy ? 1.6 : 0.9);
      if (grumpy && this.pokes === 2) this.emote("sweat", { dx: dx / d > 0 ? 0.7 : -0.7 });
      return this;
    }
    this.unhop();
    const [base, per, cap] = T.pokeSquash;
    this.axis = Math.atan2(dy, dx);
    if (eye) {
      // Both eyes shut hard, the face ducks back, the body barely moves.
      this.blinkAge = 0; this.size.vel -= 4; this.express("squeeze", 0.5); this.lean.vel += (dx / d) * T.pokeLean * 0.5;
      return this;
    }
    this.stretch.vel -= Math.min(cap, base + this.pokes * per); this.wob.vel += T.pokeWobble;
    this.lean.vel += (dx / d) * T.pokeLean;
    if (this.shove && this.grounded && Math.abs(dy / d) < 0.6) this.vx += (dx / d) * T.pokeShove;
    if (reaction === "giggle") {
      this.express("happy", 0.8);
      for (const t of [0.12, 0.24, 0.36]) this.after(t, () => { this.wob.vel += 0.5; this.stretch.vel += 0.8; }, "giggle");
    } else if (reaction === "boop") {
      this.express("surprised", 0.5); this.emote("sparkle", { dx: (dx / d) * -0.6, size: 0.7 });
    } else {
      this.express("grumpy", 1.6);
      if (this.pokes === 2) this.emote("sweat", { dx: dx / d > 0 ? 0.7 : -0.7 });
      if (this.pokes === 3) this.emote("tick", { dx: -dx / d });
    }
    return this;
  }

  sleep() { if (this.sleeping) return this; this.sleeping = true; this.express("asleep", Infinity); this.emit("sleep"); this.zzz(); return this; }
  zzz(): void { if (!this.sleeping) return; this.emote("zed", { dx: 0.6 }); this.after(1.7, () => this.zzz(), "sleep"); }
  wake(startled = false) {
    if (!this.sleeping) return this;
    this.sleeping = false; this.cancel("sleep"); this.express(startled ? "surprised" : "sleepy", startled ? 0.6 : 1.2);
    if (startled && !this.reduced) { this.stretch.vel += 8; this.emote("bang"); }
    this.emit("wake", { startled });
    return this;
  }

  /* Roll along the floor, face and all, then rock back upright. */
  roll(dx: number) { if (this.reduced || this.air) return this; this.unhop(); this.rolling = true; this.vx = dx; this.emit("roll"); return this; }

  emote(type: MarkType, { dx = 0, dy = -1, x, y, size = 1, life = 1.4, spread = 0, color }: { dx?: number; dy?: number; x?: number; y?: number; size?: number; life?: number; spread?: number; color?: string } = {}) {
    const a = -Math.PI / 2 + Math.atan2(dx, -dy) * 0.6 + (this.rand() - 0.5) * spread;
    const speed = this.reduced ? 0 : (type === "zed" ? T.zedSpeed : type === "puff" ? T.puffSpeed : T.markSpeed) * (0.8 + this.rand() * 0.4);
    const ex = x ?? this.x + dx * this.r * 0.8, ey = y ?? this.y - this.r * (dy < 0 ? 1.05 : 0.2), s0 = this.reduced ? size : 0;
    const e: Emote = {
      type, color, life, age: 0, x: ex, y: ey,
      vx: Math.cos(a) * speed * (type === "puff" ? 3 * Math.sign(dx || 1) : 1), vy: Math.sin(a) * speed,
      s: new Spring(s0, PRESETS.bouncy), size, rot: (this.rand() - 0.5) * 0.6, spin: (this.rand() - 0.5) * 3,
      px: ex, py: ey, ps: s0,
    };
    e.s.t = size; this.emotes.push(e); this.emit("emote", { type });
    return e;
  }

  /* ── time ──────────────────────────────────────────────────────── */

  /* Advance by a frame of any length: whole steps only, the remainder kept
     for the next frame. Past maxSteps the clock stops catching up. */
  update(dt: number) {
    this.acc += dt; let n = 0;
    while (this.acc >= STEP - 1e-9 && n < T.maxSteps) { this.step(); this.acc -= STEP; n++; }
    if (this.acc >= STEP) { this.dropped += this.acc; this.acc = 0; }
    this.alpha = clamp(this.acc / STEP);
    return this;
  }
  /* Run to an exact tick and draw that state. */
  stepTo(tick: number) { while (this.tick < tick) this.step(); this.acc = 0; this.alpha = 1; return this; }

  remember() {
    const p = this.prev;
    p.x = this.x; p.y = this.y; p.r = this.r; p.sv = this.stretch.v; p.axis = this.axis; p.wob = this.wob.v; p.wobPhase = this.wobPhase;
    p.lean = this.lean.v; p.spin = this.spin.v; p.lx = this.lx.v; p.ly = this.ly.v; p.top = this.top.v; p.bot = this.bot.v;
    p.tilt = this.tilt.v; p.size = this.size.v; p.blinkAge = this.blinkAge;
    for (const e of this.emotes) { e.px = e.x; e.py = e.y; e.ps = e.s.v; }
  }

  /* One step of exactly 1/120 s. */
  step() {
    this.remember();
    const h = STEP;
    this.tick++;
    while (this.timers.length && this.timers[0].at <= this.tick) this.timers.shift()!.fn();
    if (this.tweens.length) {
      const live = this.tweens;
      for (let i = 0; i < live.length; i++) { const w = live[i], k = clamp((this.tick - w.from) / w.n); w.fn(k); if (k >= 1) w.done = true; }
      this.tweens = this.tweens.filter((w) => !w.done);
    }
    const snap = this.reduced, r = this.r, ground = this.floor - r;

    if (this.air) {
      this.vy += this.g * h; this.vx *= 1 - T.airDrag * h; this.x += this.vx * h; this.y += this.vy * h;
      if (this.y >= ground) this.land(ground);
    } else if (this.y < ground - 1 && !snap) {
      this.air = true;
    } else if (!snap) {
      this.vx *= Math.exp(-(this.rolling ? T.rollFriction : T.floorFriction) * h); this.x += this.vx * h;
      if (this.rolling) {
        this.spin.v += (this.vx / r) * h; this.spin.t = this.spin.v;
        if (Math.abs(this.vx) < T.rollSettle) { this.rolling = false; this.spin.t = Math.round(this.spin.v / TAU) * TAU; }
      }
    }
    const [wa, wb] = this.walls;
    if (this.x - r < wa || this.x + r > wb) {
      const side = this.x - r < wa ? 1 : -1; this.x = side > 0 ? wa + r : wb - r;
      const impact = Math.abs(this.vx);
      if (impact > T.wallBounceAbove) {
        this.vx = side * impact * T.wallKeep; this.axis = 0; this.stretch.vel -= impact * T.wallSquash; this.wob.vel += impact * T.wallWobble;
        this.emit("bump", { impact });
      } else this.vx = 0;
    }

    // The body: stretch along the direction of travel in the air, breathe on the ground.
    const speed = Math.hypot(this.vx, this.vy);
    if (this.air) {
      if (speed > 60) this.axis += halfTurn(Math.atan2(this.vy, this.vx) - this.axis) * clamp(h * 14);
      if (!this.crouch) this.stretch.t = 1 + Math.min(T.airStretchMax, speed * T.airStretch);
    } else {
      this.axis += halfTurn(Math.PI / 2 - this.axis) * clamp(h * 6);
      const [b0, b1] = T.breathRate;
      this.breath += h * TAU * (this.sleeping ? T.sleepBreath : b0 + this.mood.energy * b1);
      if (!this.crouch) this.stretch.t = snap ? 1 : 1 + Math.sin(this.breath) * (this.sleeping ? T.sleepBreathDepth : T.breathDepth * this.breathe);
    }
    if (this.hold != null && !snap) this.stretch.t = this.hold;
    this.stretch.step(h, snap); this.stretch.keep(...T.stretchRange);
    this.wob.step(h, snap); this.wobPhase += h * T.wobbleRate;
    const [lg, la] = T.leanMax;
    this.lean.t = this.grounded && !this.rolling ? clamp(this.vx * T.leanGround, -lg, lg) + this.faceLean : clamp(this.vx * T.leanAir, -la, la) + this.faceLean * 0.5;
    this.lean.step(h, snap); this.spin.step(h, snap);

    this.stepFace(h, snap);
    this.stepEmotes(h);
  }

  land(ground: number) {
    const impact = this.vy; this.y = ground;
    const soft = impact <= T.softLanding || this.reduced;
    if (!soft) {
      this.axis = Math.PI / 2; this.stretch.vel -= impact * T.squashPerSpeed; this.wob.vel += impact * T.wobblePerSpeed;
      this.emit("land", { impact });
      if (impact > T.puffsAbove) this.burstPuffs(impact);
      // A hard drop leaves Dot seeing stars: on the first contact, once per fall.
      if (impact > T.dizzyAbove && !this.dazed) { this.dazed = true; this.express("dizzy", 1.6); this.emit("dizzy"); }
    }
    // A planned landing (stick) takes the whole impact in the squash, no bounce.
    if (impact > T.bounceAbove && !this.stick) { this.vy = -impact * T.bounceKeep; this.vx *= T.bounceSlide; }
    else { this.air = false; this.vy = 0; this.vx *= this.stick ? 0 : T.stopSlide; this.stick = false; }
  }

  burstPuffs(impact: number) {
    const n = impact > T.morePuffsAbove ? 2 : 1;
    for (let i = 0; i < n; i++) for (const side of [-1, 1]) this.emote("puff", { dx: side, y: this.floor - 6, x: this.x + side * this.r * 0.8, life: 0.55, size: 0.7 + i * 0.35 });
  }

  stepFace(h: number, snap: boolean) {
    if (this.face && this.t > this.faceUntil) this.face = null;
    const { energy, feeling } = this.mood, f = this.face || {};
    this.top.t = f.top ?? (this.sleeping ? 1 : clamp((0.5 - energy) * 1.3, 0, 0.62));
    this.bot.t = f.bot ?? clamp((feeling - 0.42) * 1.05, 0, 0.55);
    this.tilt.t = f.tilt ?? (feeling < -0.15 ? (feeling + 0.15) * 1.1 : 0);
    this.size.t = f.size ?? 1 + clamp(energy - 0.78, 0, 1) * 0.8;
    this.cross = !!f.cross;
    this.top.step(h, snap); this.bot.step(h, snap); this.tilt.step(h, snap); this.size.step(h, snap);

    // Gaze: a target when there is one, otherwise small idle glances.
    let tx = 0, ty = 0;
    if (this.gaze && this.t < this.gazeUntil) {
      const dx = this.gaze.x - this.x, dy = this.gaze.y - (this.y - this.r * 0.2), d = Math.hypot(dx, dy) + this.r * 1.5;
      tx = clamp((dx / d) * 1.25, -1, 1); ty = clamp((dy / d) * 1.25, -1, 1);
    } else if (!this.sleeping) {
      if (this.t > this.saccadeAt) {
        const [g0, g1] = T.glanceEvery;
        this.saccadeAt = this.t + g0 + this.rand() * g1;
        if (this.rand() < T.glanceCentre) { this.idleLook[0] = 0; this.idleLook[1] = 0; }
        else { this.idleLook[0] = (this.rand() - 0.5) * 0.7; this.idleLook[1] = (this.rand() - 0.5) * 0.35; }
      }
      tx = this.idleLook[0]; ty = this.idleLook[1];
    }
    this.lx.t = tx; this.ly.t = ty; this.lx.step(h, snap); this.ly.step(h, snap);

    this.blinkAge += h;
    if (this.t > this.blinkAt && !this.sleeping) {
      const [b0, b1] = T.blinkEvery;
      this.blink(this.rand() < T.doubleBlink); this.blinkAt = this.t + b0 + this.rand() * b1;
    }
  }

  stepEmotes(h: number) {
    let keep = 0;
    for (let i = 0; i < this.emotes.length; i++) {
      const e = this.emotes[i];
      e.age += h; e.s.step(h, this.reduced);
      if (e.age > e.life - 0.25) e.s.t = 0;
      // Reduced motion: marks appear and fade where they are; nothing travels.
      if (!this.reduced) {
        if (e.type === "zed") { e.x += Math.sin(e.age * 3) * 18 * h; e.vy = -40; }
        else if (e.type === "puff") { e.vx *= Math.exp(-5 * h); e.vy = -20; }
        else { e.vy += T.markGravity * h * (e.type === "sweat" || e.type === "dot" ? T.heavyMarks : 1); e.vx *= Math.exp(-2 * h); }
        e.x += e.vx * h; e.y += e.vy * h; e.rot += e.spin * h;
        // Marks that fall land on Dot's floor, with a small skip, rather than
        // dropping through it.
        if (!DRIFTS.has(e.type) && e.y > this.floor - 3) {
          e.y = this.floor - 3; if (e.vy > 0) { e.vy *= -T.markBounce; e.vx *= 0.5; e.spin *= 0.5; }
        }
      }
      if (e.age < e.life) this.emotes[keep++] = e;
    }
    this.emotes.length = keep;
  }

  /* ── what Dot looks like right now ─────────────────────────────── */

  blinkAmount(a: number) {
    return a < 0.05 ? a / 0.05 : a < 0.09 ? 1 : a < 0.2 ? 1 - (a - 0.09) / 0.11 : 0;
  }

  /* The pose between the last two steps. The returned object is reused:
     read it before the next call. */
  frame(alpha = this.alpha): Frame {
    const p = this.prev, out = this.out, L = (key: string, now: number) => (alpha >= 1 ? now : mix(p[key], now, alpha));
    const r = L("r", this.r), k = r / R, y = L("y", this.y), x = L("x", this.x);
    const s = L("sv", this.stretch.v), wob = L("wob", this.wob.v), wobPhase = L("wobPhase", this.wobPhase);
    const ax = alpha >= 1 ? this.axis : p.axis + halfTurn(this.axis - p.axis) * alpha;
    const lean = (L("lean", this.lean.v) * Math.PI) / 180 + L("spin", this.spin.v);
    const lx = L("lx", this.lx.v), ly = L("ly", this.ly.v);
    const ca = Math.cos(ax), sa = Math.sin(ax), N = OUTLINE, pts = out.pts;
    let lift = this.floor - (y + r), cy = y;
    // On the floor, a squash stays planted: sink the centre by what the shape lost below.
    if (!this.air && lift < 1) { const half = r * Math.hypot(s * sa, ca / s); cy = y + (r - half); lift = 0; }
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU, rr = r * (1 + wob * Math.cos(3 * a + wobPhase));
      const u = Math.cos(a) * rr * s, v = (Math.sin(a) * rr) / s;
      let px = x + u * ca - v * sa, py = cy + u * sa + v * ca;
      if (py > this.floor && lift < 1) { px += ((px - x) * (py - this.floor)) / r * 0.5; py = this.floor; }
      pts[i * 2] = px; pts[i * 2 + 1] = py;
    }
    // The face rides the body's squash at a share of it, with its area kept.
    const fs = Math.pow(s, T.faceFollow), fi = 1 / fs;
    const m0 = fs * ca * ca + fi * sa * sa, m1 = (fs - fi) * ca * sa, m3 = fs * sa * sa + fi * ca * ca;
    const cl = Math.cos(lean), sl = Math.sin(lean);
    const fx = lx * r * 0.2, fy = ly * r * 0.15 + (s - 1) * r * 0.2, face = out.face;
    face[0] = (m0 * cl - m1 * sl) * k; face[1] = (m0 * sl + m1 * cl) * k; face[2] = (m1 * cl - m3 * sl) * k; face[3] = (m1 * sl + m3 * cl) * k;
    face[4] = x + fx * cl - fy * sl; face[5] = cy + fx * sl + fy * cl;
    const blink = this.blinkAmount(L("blinkAge", this.blinkAge)), size = L("size", this.size.v);
    const top0 = L("top", this.top.v), bot0 = L("bot", this.bot.v), tilt = L("tilt", this.tilt.v);
    const bot = bot0 + blink * 0.1;
    for (let i = 0; i < 2; i++) {
      const top = top0 + (1 - top0 - bot0) * blink;
      const e = EYES[i], far = i === 0 ? Math.max(0, lx) : Math.max(0, -lx);
      // The far eye narrows: the one the gaze turns away from.
      lid(out.eyes[i], e.x * (1 - 0.1 * Math.abs(lx)) + lx * 2, e.y + ly * 1.5, e.w * (1 - 0.24 * Math.min(1, far)) * size, e.h * (1 - 0.06 * Math.min(1, far)) * size, top, bot, tilt * e.inner, this.cross);
    }
    out.tick = this.tick;
    out.body = smooth(pts, N);
    shadow(out.shadow, x, this.floor, r, lift, s, this.air);
    out.emotes = this.emotes; out.k = k; out.alpha = alpha; out.lift = lift;
    return out;
  }
}

function makeFrame(): Frame {
  const eye = (): EyeFrame => ({ x: 0, y: 0, body: "", clip: "", closed: "", shut: 0, width: 0, open: 1, h: 0, w: 0 });
  return { pts: new Float64Array(OUTLINE * 2), face: [1, 0, 0, 1, 0, 0], eyes: [eye(), eye()], body: "", shadow: { cx: 0, cy: 0, rx: 0, ry: 0, o: 0 }, emotes: [], k: 1, alpha: 1, tick: 0, lift: 0 };
}

function shadow(o: Frame["shadow"], x: number, floor: number, r: number, lift: number, s: number, air: boolean) {
  const far = clamp(lift / (r * 4));
  o.cx = x; o.cy = floor; o.rx = r * (0.92 - far * 0.45) * (s > 1 && !air ? 1 : 1 + (1 - s) * 0.6); o.ry = r * 0.09 * (1 - far * 0.4); o.o = 0.22 * (1 - far * 0.7);
}

/* An eye with lids: the capsule, the region the lids leave open, and a
   closed-eye stroke that fades in as the opening disappears. */
function lid(o: EyeFrame, x: number, y: number, w: number, h: number, top: number, bot: number, tilt: number, cross: boolean) {
  const W = w * 0.9, hh = h / 2, open = clamp(1 - top - bot);
  const yt = -hh - 1 + (h + 2) * top, ybe = hh + 1 - (h + 2) * bot * 0.5, ybc = hh + 1 - (h + 2) * bot * 2.2;
  const t = tilt * h * 0.38, rw = w / 2, shut = cross ? 1 : clamp((0.2 - open) / 0.14), happy = bot > top;
  const cy = happy ? ybe - 1 : clamp(yt, -hh, hh * 0.6), bend = happy ? -h * 0.22 : h * 0.1;
  o.x = f1(x); o.y = f1(y); o.shut = shut; o.width = f1(w * 0.46); o.open = open; o.h = h; o.w = w;
  o.clip = `M${f1(-W)} ${f1(yt - t)}L${f1(W)} ${f1(yt + t)}L${f1(W)} ${f1(Math.max(ybe, yt + t))}Q0 ${f1(Math.max(ybc, yt))} ${f1(-W)} ${f1(Math.max(ybe, yt - t))}Z`;
  o.body = `M${f1(-rw)} ${f1(-hh + rw)}A${f1(rw)} ${f1(rw)} 0 0 1 ${f1(rw)} ${f1(-hh + rw)}V${f1(hh - rw)}A${f1(rw)} ${f1(rw)} 0 0 1 ${f1(-rw)} ${f1(hh - rw)}Z`;
  o.closed = cross
    ? `M${f1(-w * 0.7)} ${f1(-w * 0.7)}L${f1(w * 0.7)} ${f1(w * 0.7)}M${f1(w * 0.7)} ${f1(-w * 0.7)}L${f1(-w * 0.7)} ${f1(w * 0.7)}`
    : `M${f1(-w * 0.62)} ${f1(cy + t * 0.6)}Q0 ${f1(cy + bend)} ${f1(w * 0.62)} ${f1(cy - t * 0.6)}`;
  return o;
}

/* Closed Catmull-Rom through the outline points, as cubic Béziers. */
function smooth(p: Float64Array, n: number) {
  const X = (i: number) => p[((i + n) % n) * 2], Y = (i: number) => p[((i + n) % n) * 2 + 1];
  let d = `M${f1(p[0])} ${f1(p[1])}`;
  for (let i = 0; i < n; i++) {
    d += `C${f1(X(i) + (X(i + 1) - X(i - 1)) / 6)} ${f1(Y(i) + (Y(i + 1) - Y(i - 1)) / 6)} ${f1(X(i + 1) - (X(i + 2) - X(i)) / 6)} ${f1(Y(i + 1) - (Y(i + 2) - Y(i)) / 6)} ${f1(X(i + 1))} ${f1(Y(i + 1))}`;
  }
  return d + "Z";
}

/* ── marks ───────────────────────────────────────────────────────── */
/* Drawn at a 24-unit size around 0,0. Colour comes from a class, so the
   same mark works in both themes. */
export const MARKS = {
  sparkle: ["fill", "M0 -12C1.2 -3.6 3.6 -1.2 12 0C3.6 1.2 1.2 3.6 0 12C-1.2 3.6 -3.6 1.2 -12 0C-3.6 -1.2 -1.2 -3.6 0 -12Z"],
  star: ["fill", "M0 -10L2.6 -3.4L9.5 -3.1L4.1 1.3L5.9 8.1L0 4.3L-5.9 8.1L-4.1 1.3L-9.5 -3.1L-2.6 -3.4Z"],
  heart: ["fill", "M0 9C-6 4.8 -11 1 -11 -4A5.6 5.6 0 0 1 0 -6.6A5.6 5.6 0 0 1 11 -4C11 1 6 4.8 0 9Z"],
  sweat: ["fill", "M0 -11C3 -5 7 -1 7 3.4A7 7 0 0 1 -7 3.4C-7 -1 -3 -5 0 -11Z"],
  bang: ["ink", "M-2.6 -12H2.6L1.6 3.4H-1.6ZM0 6.4A2.9 2.9 0 1 1 0 12.2A2.9 2.9 0 1 1 0 6.4Z"],
  ask: ["inkline", "M-6 -5.5A6 6 0 1 1 1.6 0.4C0.3 1 0 2 0 3.6M0 9.4V9.6"],
  zed: ["inkline", "M-5.4 -6H5.4L-5.4 6H5.4"],
  puff: ["puff", "M0 -7A7 7 0 1 1 0 7A7 7 0 1 1 0 -7Z"],
  tick: ["inkline", "M-9 -9L-4.5 -4.5M0 -12V-6M9 -9L4.5 -4.5"],
  dot: ["body", "M0 -6A6 6 0 1 1 0 6A6 6 0 1 1 0 -6Z"],
  plus: ["inkline", "M-7 0H7M0 -7V7"],
  note: ["ink", "M3 -11V4.5A4 4 0 1 1 0.6 0.9V-11H10V-7H3Z"],
} as const;
/* Marks that drift up, never land. */
const DRIFTS = new Set<string>(["zed", "puff"]);

/* ── drawing ─────────────────────────────────────────────────────── */

export const NS = "http://www.w3.org/2000/svg";
let uid = 0;
export const el = (name: string, attrs: Record<string, string | number> = {}, parent?: Element) => {
  const n = document.createElementNS(NS, name);
  for (const key in attrs) n.setAttribute(key, String(attrs[key]));
  parent?.append(n);
  return n;
};
export const matrix = (m: number[]) => `matrix(${m[0].toFixed(4)} ${m[1].toFixed(4)} ${m[2].toFixed(4)} ${m[3].toFixed(4)} ${f1(m[4])} ${f1(m[5])})`;

type Cached = Element & { dotLast?: Record<string, string>; dotLastStyle?: Record<string, string> };
export type View = { g: SVGGElement; draw: (force?: boolean) => void; setFocused: (on: boolean) => void; remove: () => void };

/* Draw a Dot into an <svg> and keep drawing it. Each attribute is written
   only when its value changes, and a Dot that is only breathing is redrawn
   every fourth step. The <svg> is decoration: whatever names Dot to
   assistive technology lives outside it (here, a real button). */
export function mount(svg: SVGSVGElement, dot: Dot, { minMark = 0, shadowInAirOnly = false } = {}): View {
  const id = `dot${++uid}`;
  const g = el("g", { class: "dot" }, svg) as SVGGElement;
  const shadowEl = el("ellipse", { class: "dot-shadow" }, g);
  // The focus ring follows the body's outline: a gap in the page colour, then
  // the ring, so it reads against the page and against Dot's own indigo.
  const ring = el("path", { class: "dot-ring" }, g), gap = el("path", { class: "dot-ring-gap" }, g);
  const body = el("path", { class: "dot-body" }, g);
  const face = el("g", { class: "dot-face" }, g);
  const eyes = [0, 1].map((i) => {
    const eg = el("g", {}, face), cp = el("clipPath", { id: `${id}e${i}` }, eg), clip = el("path", {}, cp);
    const open = el("path", { class: "dot-eye", "clip-path": `url(#${id}e${i})` }, eg);
    const shut = el("path", { class: "dot-eye-shut", fill: "none", "stroke-linecap": "round" }, eg);
    return { eg, clip, open, shut };
  });
  const marks = el("g", { class: "dot-marks" }, svg);
  const pool = new Map<Emote, Element>(), seen = new Set<Emote>();
  // The last value written to each attribute and style, kept on the node.
  const put = (node: Cached, name: string, value: string | number) => {
    const c = (node.dotLast ??= {}), v = String(value);
    if (c[name] !== v) { c[name] = v; node.setAttribute(name, v); }
  };
  const css = (node: Cached, name: string, value: string) => {
    const c = (node.dotLastStyle ??= {});
    if (c[name] !== value) { c[name] = value; (node as unknown as HTMLElement).style.setProperty(name, value); }
  };
  let focused = false, drawnTick = -1, drawnAlpha = -1;
  function draw(force = false) {
    if (!force && dot.tick === drawnTick && dot.alpha === drawnAlpha) return;
    if (!force && dot.settled && !focused && dot.tick >= drawnTick && dot.tick - drawnTick < 4) return;
    drawnTick = dot.tick; drawnAlpha = dot.alpha;
    const f = dot.frame(), s = f.shadow;
    put(shadowEl, "cx", f1(s.cx)); put(shadowEl, "cy", f1(s.cy)); put(shadowEl, "rx", f1(s.rx)); put(shadowEl, "ry", f1(s.ry));
    // A full stop on its baseline casts no shadow; one in the air does.
    css(shadowEl, "opacity", (shadowInAirOnly ? s.o * clamp(f.lift / (f.k * R * 0.4)) : s.o).toFixed(3));
    put(body, "d", f.body);
    css(ring, "display", focused ? "inline" : "none"); css(gap, "display", focused ? "inline" : "none");
    if (focused) { put(ring, "d", f.body); put(gap, "d", f.body); }
    put(face, "transform", matrix(f.face));
    for (let i = 0; i < 2; i++) {
      const e = f.eyes[i], x = eyes[i];
      put(x.eg, "transform", `translate(${e.x} ${e.y})`);
      put(x.clip, "d", e.clip); put(x.open, "d", e.body); css(x.open, "opacity", (1 - e.shut).toFixed(2));
      put(x.shut, "d", e.closed); put(x.shut, "stroke-width", e.width); css(x.shut, "opacity", e.shut.toFixed(2));
    }
    seen.clear();
    const a = f.alpha;
    for (const e of f.emotes) {
      let n = pool.get(e);
      if (!n) {
        const [kind, d] = MARKS[e.type];
        n = el("path", { d, class: `dot-mark dot-mark-${kind}` }, marks);
        if (e.color) (n as unknown as HTMLElement).style.setProperty("--mark", e.color);
        pool.set(e, n);
      }
      seen.add(e);
      const ex = a >= 1 ? e.x : mix(e.px, e.x, a), ey = a >= 1 ? e.y : mix(e.py, e.y, a);
      const sv = dot.reduced ? e.s.t || e.size : a >= 1 ? e.s.v : mix(e.ps, e.s.v, a);
      const sc = Math.max(0, sv) * Math.max(f.k, minMark) * (e.type === "zed" ? 1.1 : 1);
      put(n, "transform", `translate(${f1(ex)} ${f1(ey)}) rotate(${f1(e.rot * 57.3)}) scale(${sc.toFixed(3)})`);
      if (e.type === "puff") css(n, "opacity", (1 - e.age / e.life).toFixed(2));
      else if (dot.reduced) css(n, "opacity", clamp(Math.min(e.age / 0.2, (e.life - e.age) / 0.3)).toFixed(2));
    }
    for (const [e, n] of pool) if (!seen.has(e)) { n.remove(); pool.delete(e); }
  }
  draw(true);
  return {
    g, draw,
    setFocused(on: boolean) { focused = on; draw(true); },
    remove() { g.remove(); marks.remove(); },
  };
}
