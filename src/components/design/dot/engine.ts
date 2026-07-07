/**
 * DotEngine — the WAAPI runtime behind the Dot character.
 *
 * What makes it a character and not a gif:
 * - BRIDGE TWEENS: switching moods never hard-cuts. The engine reads the
 *   body's computed transform and tweens it home (260ms, 320ms when the
 *   transform-origin changes) before the next loop starts.
 * - ADDITIVE GESTURES: pokes play with `composite: "add"` on top of the
 *   running loop, so Dot flinches WHILE it keeps working.
 * - DERIVED SHADOW: shadow keyframes are computed from the body poses
 *   (frames.shDerive) and every interrupt animates body + shadow in the
 *   same frame. The shadow cannot desync.
 * - IDLE VARIATION: idle regenerates its pose table every loop within
 *   authored bounds.
 * - TEMPERAMENT: three pokes in one loop turns Dot nervous; poking
 *   nervous makes it numb for a loop; waking sleep twice leaves it
 *   impatient. Escalation decays after one clean loop.
 * - Cursor gaze only while idle; lingering nearby makes Dot curious.
 *   Dragging leans Dot (feet pinned), releasing wobbles it back; dragging
 *   too far is a fright.
 *
 * Reduced motion: every mood becomes its signature grounded pose; a poke
 * answers with a light opacity dip. Nothing travels.
 */

import {
  MOODS, ORDER, SEQ, FRAMES, DROP, GESTURES, EASE,
  buildBody, buildShadow, buildShadowAdd, buildGhost, buildIdlePoses,
  gazePoses, shDerive, toTransform,
  type MoodKey, type GestureKey, type Pose,
} from "./frames";

export interface DotParts {
  stage: HTMLElement;
  body: HTMLElement;
  shadow: HTMLElement | null;
  ghosts: HTMLElement[];
  drop: HTMLElement | null;
}

export interface DotCallbacks {
  onMood?: (key: MoodKey) => void;
  onNote?: (text: string) => void;
}

const IDLE_T = "translate(0px, 0px) rotate(0deg) skewX(0deg) scale(1, 1)";

export class DotEngine {
  private p: DotParts;
  private cb: DotCallbacks;
  private u: number;
  private mood: MoodKey = "idle";
  private origin = "50% 100%";
  private anims: Animation[] = [];
  private fx: Animation[] = [];
  private layers: Animation[] = [];
  private bridge: (Animation | null)[] = [];
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private seqIdx = 0;
  private iterPokes = 0;
  private wakes = 0;
  private numb = false;
  private holdLoops = 0;
  private pokeBusy = false;
  private dragging = false;
  private justDragged = false;
  private pd: { x: number; y: number; id: number } | null = null;
  private dx = 0;
  private dy = 0;
  private raf = 0;
  private gazeAt = 0;
  private gazeSide: 1 | -1 = 1;
  private linger: ReturnType<typeof setTimeout> | null = null;
  private mq: MediaQueryList | null = null;
  private mqH: (() => void) | null = null;
  private reduced = false;
  private autoplay = true;
  private running = false;
  private disposed = false;
  private unlisten: (() => void)[] = [];

  constructor(parts: DotParts, cb: DotCallbacks = {}, opts: { autoplay?: boolean; unit?: number } = {}) {
    this.p = parts;
    this.cb = cb;
    this.u = opts.unit ?? 102 / 54;
    this.autoplay = opts.autoplay !== false;

    this.mq = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    this.reduced = !!this.mq?.matches;
    if (this.mq) {
      this.mqH = () => this.syncReduced();
      this.mq.addEventListener("change", this.mqH);
    }
    this.wire();
  }

  /* ── lifecycle ── */

  start() {
    if (this.disposed || this.running) return;
    this.running = true;
    if (this.reduced) this.pose(this.mood);
    else this.play(this.mood, { bridge: false });
  }

  /** Stop the clocks but hold the current mood's grounded pose. */
  suspend() {
    if (!this.running) return;
    this.running = false;
    this.pose(this.mood);
  }

  dispose() {
    this.disposed = true;
    this.running = false;
    this.timers.forEach((t) => clearTimeout(t));
    this.timers.clear();
    this.cancelAll();
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.mq && this.mqH) this.mq.removeEventListener("change", this.mqH);
    this.unlisten.forEach((u) => u());
    this.unlisten = [];
  }

  /** Public: jump the reel to a mood (mood rail rows call this). */
  jump(key: MoodKey) {
    const i = SEQ.findIndex((s) => s.k === key);
    if (i >= 0) this.seqIdx = i;
    if (!this.running) {
      this.mood = key;
      this.cb.onMood?.(key);
      this.pose(key);
      return;
    }
    this.play(key);
  }

  get current(): MoodKey {
    return this.mood;
  }

  /* ── internals ── */

  private later(fn: () => void, ms: number) {
    const t = setTimeout(() => {
      this.timers.delete(t);
      fn();
    }, ms);
    this.timers.add(t);
    return t;
  }

  private cancelAll() {
    [...this.anims, ...this.fx, ...this.layers, ...this.bridge].forEach((a) => {
      try { a?.cancel(); } catch { /* already gone */ }
    });
    this.anims = [];
    this.fx = [];
    this.layers = [];
    this.bridge = [];
  }

  private framesFor(key: MoodKey) {
    const M = MOODS[key];
    const poses: Pose[] = key === "idle" ? buildIdlePoses() : FRAMES[key]!;
    const out: {
      body: Keyframe[]; shadow: Keyframe[]; dur: number;
      ghost?: Keyframe[]; drop?: Keyframe[];
    } = {
      body: buildBody(poses, this.u),
      shadow: buildShadow(poses, this.u),
      dur: M.dur * 1000,
    };
    if (key === "zoomies" && this.p.ghosts.length) out.ghost = buildGhost(poses, this.u);
    if (key === "excited" && this.p.drop) {
      out.drop = DROP.map((p) => ({
        offset: p.t / 100,
        transform: toTransform(this.u, p),
        opacity: p.o,
        easing: EASE[p.e || "io"],
      }));
    }
    return out;
  }

  private pose(key: MoodKey) {
    const M = MOODS[key];
    this.cancelAll();
    this.origin = "50% 100%";
    this.p.body.style.transformOrigin = "50% 100%";
    this.p.body.style.transform = toTransform(this.u, M.pose);
    if (this.p.shadow) {
      const d = shDerive(M.pose);
      this.p.shadow.style.transform =
        "translateX(" + (((M.pose as Pose).x || 0) * this.u) + "px) scaleX(" + d.s + ")";
      this.p.shadow.style.opacity = String(d.o);
    }
  }

  private play(key: MoodKey, opts: { bridge?: boolean } = {}) {
    const M = MOODS[key];
    if (!M) return;
    this.mood = key;
    this.holdLoops = 0;
    this.cb.onMood?.(key);
    this.p.body.setAttribute("aria-label", "Dot, " + M.name + ". Press to poke. Drag to lean.");
    this.p.body.title = M.title;
    if (this.reduced || !this.running) {
      this.pose(key);
      return;
    }
    const bt = getComputedStyle(this.p.body).transform;
    let st: string | null = null;
    let so = 0.15;
    if (this.p.shadow) {
      const cs = getComputedStyle(this.p.shadow);
      st = cs.transform;
      so = parseFloat(cs.opacity);
      if (isNaN(so)) so = 0.15;
    }
    this.cancelAll();
    this.p.body.style.transform = "";
    if (this.p.shadow) {
      this.p.shadow.style.transform = "";
      this.p.shadow.style.opacity = "";
    }
    const start = () => {
      this.origin = M.origin;
      this.p.body.style.transformOrigin = this.origin;
      this.loopStart();
    };
    if (opts.bridge !== false && bt && bt !== "none") {
      const swap = M.origin !== this.origin;
      const dur = swap ? 320 : 260;
      const bA = this.p.body.animate(
        [{ transform: bt, easing: EASE.out }, { transform: IDLE_T }],
        { duration: dur, fill: "forwards" },
      );
      let bS: Animation | null = null;
      if (this.p.shadow && st) {
        bS = this.p.shadow.animate(
          [
            { transform: st === "none" ? "translateX(0px) scaleX(1)" : st, opacity: so, easing: EASE.out },
            { transform: "translateX(0px) scaleX(1)", opacity: 0.15 },
          ],
          { duration: dur, fill: "forwards" },
        );
      }
      this.bridge = [bA, bS];
      bA.onfinish = () => {
        this.bridge = [];
        start();
        try { bA.cancel(); } catch { /* fine */ }
        if (bS) { try { bS.cancel(); } catch { /* fine */ } }
      };
    } else {
      start();
    }
  }

  private loopStart() {
    if (this.reduced || !this.running) {
      this.pose(this.mood);
      return;
    }
    const key = this.mood;
    this.anims.forEach((a) => { try { a.cancel(); } catch { /* fine */ } });
    this.fx.forEach((a) => { try { a.cancel(); } catch { /* fine */ } });
    this.anims = [];
    this.fx = [];
    const B = this.framesFor(key);
    const a = this.p.body.animate(B.body, { duration: B.dur, fill: "both" });
    this.anims.push(a);
    if (this.p.shadow) {
      this.anims.push(this.p.shadow.animate(B.shadow, { duration: B.dur, fill: "both" }));
    }
    if (B.ghost) {
      this.p.ghosts.forEach((g, i) => {
        this.fx.push(g.animate(B.ghost!, { duration: B.dur, delay: (i + 1) * 80, fill: "both" }));
      });
    }
    if (B.drop && this.p.drop) {
      this.fx.push(this.p.drop.animate(B.drop, { duration: B.dur, fill: "both" }));
    }
    a.onfinish = () => this.loopEnd();
  }

  private loopEnd() {
    // Escalation decays after one clean loop: no pokes → not numb, wakes forgotten.
    if (this.iterPokes === 0) {
      this.numb = false;
      this.wakes = 0;
      this.cb.onNote?.("");
    }
    this.iterPokes = 0;
    this.holdLoops++;
    if (this.autoplay && !this.reduced && this.running) {
      const step = SEQ[this.seqIdx];
      if (step && this.mood === step.k && this.holdLoops >= step.n) {
        this.seqIdx = (this.seqIdx + 1) % SEQ.length;
        this.play(SEQ[this.seqIdx].k);
        return;
      }
    }
    this.loopStart();
  }

  private gesture(key: GestureKey, opts: { amp?: number; force?: boolean; shadowOnly?: boolean } = {}) {
    if (this.reduced || !this.running) return;
    const G = GESTURES[key];
    if (!G || this.dragging) return;
    if (this.pokeBusy && !opts.force) return;
    this.pokeBusy = true;
    const dur = G.dur * 1000;
    const done = () => { this.pokeBusy = false; };
    if (!opts.shadowOnly) {
      const a = this.p.body.animate(buildBody(G.f, this.u, opts.amp), { duration: dur, composite: "add" });
      a.onfinish = done;
      a.oncancel = done;
      this.layers.push(a);
    }
    if (this.p.shadow) {
      const s = this.p.shadow.animate(buildShadowAdd(G.f, this.u, opts.amp), { duration: dur, composite: "add" });
      if (opts.shadowOnly) { s.onfinish = done; s.oncancel = done; }
      this.layers.push(s);
    } else if (opts.shadowOnly) {
      done();
    }
    this.layers = this.layers.filter((x) => x.playState === "running" || x.pending);
  }

  private poke() {
    if (this.dragging) return;
    if (this.reduced) {
      this.p.body.animate(
        [{ opacity: 1 }, { opacity: 0.45, offset: 0.4 }, { opacity: 1 }],
        { duration: 340, easing: "ease-in-out" },
      );
      return;
    }
    const key = this.mood;
    const M = MOODS[key];
    if (this.numb) {
      this.gesture("flinch", { shadowOnly: true, force: true });
      this.cb.onNote?.("Dot is not answering right now.");
      return;
    }
    this.iterPokes++;
    if (key === "sleep") {
      this.wakes++;
      this.gesture("wake");
      if (this.wakes >= 2) {
        this.wakes = 0;
        this.cb.onNote?.("Woken twice. Dot is up now, and waiting.");
        this.later(() => this.jump("impatient"), 1500);
      }
      return;
    }
    if (key === "nervous") {
      this.gesture("cower", { amp: 1.25, force: true });
      this.numb = true;
      this.cb.onNote?.("Dot needs a moment.");
      return;
    }
    if (key === "excited" || key === "zoomies") {
      this.gesture("joy");
      return;
    }
    this.gesture(M.poke);
    if (M.calm && this.iterPokes >= 3) {
      this.iterPokes = 0;
      this.cb.onNote?.("Three pokes in one loop. Dot is Nervous now.");
      this.later(() => this.jump("nervous"), 550);
    }
  }

  /* ── stage wiring: poke, gaze, linger, drag ── */

  private on<K extends keyof HTMLElementEventMap>(
    el: HTMLElement,
    ev: K,
    fn: (e: HTMLElementEventMap[K]) => void,
  ) {
    el.addEventListener(ev, fn as EventListener);
    this.unlisten.push(() => el.removeEventListener(ev, fn as EventListener));
  }

  private clearLinger() {
    if (this.linger) {
      clearTimeout(this.linger);
      this.timers.delete(this.linger);
      this.linger = null;
    }
  }

  private wire() {
    const { stage, body } = this.p;

    this.on(body, "click", () => {
      if (this.justDragged) {
        this.justDragged = false;
        return;
      }
      this.poke();
    });
    this.on(body, "keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        this.poke();
      }
    });

    // Cursor awareness: only while Idle, never while dragging.
    this.on(stage, "pointermove", (e) => {
      if (this.reduced || !this.running || this.dragging || this.pd) return;
      if (this.mood !== "idle") {
        this.clearLinger();
        return;
      }
      const r = stage.getBoundingClientRect();
      const side: 1 | -1 = e.clientX < r.left + r.width / 2 ? -1 : 1;
      const now = Date.now();
      if (now - this.gazeAt > 1700 || (side !== this.gazeSide && now - this.gazeAt > 900)) {
        this.gazeAt = now;
        this.gazeSide = side;
        const gp = gazePoses(side);
        this.layers.push(this.p.body.animate(buildBody(gp, this.u), { duration: 1300, composite: "add" }));
        if (this.p.shadow) {
          this.layers.push(this.p.shadow.animate(buildShadowAdd(gp, this.u), { duration: 1300, composite: "add" }));
        }
      }
      if (!this.linger) {
        this.linger = this.later(() => {
          this.linger = null;
          if (this.mood === "idle" && !this.dragging && !this.reduced && this.running) {
            this.jump("curious");
          }
        }, 2000);
      }
    });
    this.on(stage, "pointerleave", () => this.clearLinger());

    body.style.touchAction = "none";
    this.on(body, "pointerdown", (e) => {
      if (this.reduced || !this.running) return;
      this.pd = { x: e.clientX, y: e.clientY, id: e.pointerId };
      this.dx = 0;
      this.dy = 0;
      try { body.setPointerCapture(e.pointerId); } catch { /* fine */ }
    });
    this.on(body, "pointermove", (e) => {
      if (!this.pd) return;
      const dx = e.clientX - this.pd.x;
      const dy = e.clientY - this.pd.y;
      if (!this.dragging && Math.hypot(dx, dy) > 6) this.startDrag();
      if (this.dragging) {
        this.dx = dx;
        this.dy = dy;
      }
    });
    const up = () => this.endDrag();
    this.on(body, "pointerup", up);
    this.on(body, "pointercancel", up);
  }

  private startDrag() {
    this.dragging = true;
    this.justDragged = true;
    this.clearLinger();
    const t = getComputedStyle(this.p.body).transform;
    this.cancelAll();
    this.origin = "50% 100%";
    this.p.body.style.transformOrigin = "50% 100%";
    this.p.body.style.transform = t === "none" ? "" : t;
    this.p.body.style.cursor = "grabbing";
    const step = () => {
      if (!this.dragging) return;
      const dx = this.dx;
      const dy = this.dy;
      // Feet pinned: the drag is a lean (skew + stretch), not a move.
      const k = Math.max(-26, Math.min(26, dx * 0.2));
      const st = 1 + Math.min(0.32, Math.hypot(dx * 0.5, Math.max(0, -dy)) * 0.004);
      this.p.body.style.transform =
        "translate(" + dx * 0.06 + "px, 0px) rotate(0deg) skewX(" + -k + "deg) scale(" + 1 / st + ", " + st + ")";
      if (this.p.shadow) {
        this.p.shadow.style.transform =
          "translateX(" + dx * 0.09 + "px) scaleX(" + (1 + Math.abs(dx) * 0.0012) + ")";
        this.p.shadow.style.opacity = String(Math.max(0.09, 0.15 - Math.abs(dx) * 0.0002));
      }
      this.raf = requestAnimationFrame(step);
    };
    step();
  }

  private endDrag() {
    const wasDrag = this.dragging;
    const dx = this.dx;
    if (this.pd) {
      try { this.p.body.releasePointerCapture(this.pd.id); } catch { /* fine */ }
    }
    this.pd = null;
    if (!wasDrag) return;
    this.dragging = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.p.body.style.cursor = "";
    const far = Math.abs(dx) > 140;
    const cur = getComputedStyle(this.p.body).transform;
    this.p.body.style.transform = "";
    const shCur = this.p.shadow ? this.p.shadow.style.transform : "";
    const shO = this.p.shadow ? this.p.shadow.style.opacity : "";
    if (this.p.shadow) {
      this.p.shadow.style.transform = "";
      this.p.shadow.style.opacity = "";
    }
    const k = Math.max(-26, Math.min(26, dx * 0.2));
    const w1 = Math.abs(k) * 0.009;
    const fr: Keyframe[] = [
      { transform: cur === "none" ? toTransform(1, {}) : cur, easing: "cubic-bezier(.25,.7,.35,1)" }, // ds-allow, Dot character choreography, drag release

      { transform: toTransform(1, { t: 0, k: -k * 0.5, sx: 1 + w1, sy: 1 - w1 }), offset: 0.34, easing: "ease-in-out" },
      { transform: toTransform(1, { t: 0, k: k * 0.22 }), offset: 0.62, easing: "ease-in-out" },
      { transform: toTransform(1, { t: 0, k: -k * 0.07 }), offset: 0.84, easing: "ease-in-out" },
      { transform: toTransform(1, {}) },
    ];
    const a = this.p.body.animate(fr, { duration: 680, fill: "both" });
    let s: Animation | null = null;
    if (this.p.shadow && shCur) {
      s = this.p.shadow.animate(
        [
          { transform: shCur, opacity: parseFloat(shO) || 0.15, easing: "cubic-bezier(.25,.7,.35,1)" }, // ds-allow, Dot character choreography, drag release

          { transform: "translateX(0px) scaleX(1)", opacity: 0.15 },
        ],
        { duration: 680, fill: "both" },
      );
    }
    this.bridge = [a, s];
    a.onfinish = () => {
      this.bridge = [];
      try { a.cancel(); } catch { /* fine */ }
      if (s) { try { s.cancel(); } catch { /* fine */ } }
      if (far) {
        this.cb.onNote?.("Too far. Dot needs a moment.");
        this.jump("nervous");
      } else {
        this.play(this.mood, { bridge: false });
      }
    };
    this.later(() => { this.justDragged = false; }, 400);
  }

  private syncReduced() {
    const on = !!this.mq?.matches;
    if (on === this.reduced) return;
    this.reduced = on;
    if (!this.running) return;
    if (on) {
      this.pose(this.mood);
    } else {
      this.p.body.style.transform = "";
      if (this.p.shadow) {
        this.p.shadow.style.transform = "";
        this.p.shadow.style.opacity = "";
      }
      this.play(this.mood, { bridge: false });
    }
  }
}

export { MOODS, ORDER, type MoodKey };
