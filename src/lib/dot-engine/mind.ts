/* What Dot does when nobody is doing anything to it. Ported from
   ethan-mcnamara.com src/js/dot/mind.mjs.

   A small state machine: asleep → waking → idle ⇄ curious, with busy for
   anything scripted or interactive, and tired before asleep. Each stage
   gives it a list of idle behaviours; the mind picks among them by weight,
   never the same one twice running and never one still in its cooldown.

     idle      picks a behaviour every few seconds
     curious   something is near (a pointer): look at it, lean, maybe hop over
     busy      a script or a gesture has Dot; idles wait
     tired     long quiet: slower, sleepier choices
     asleep    after longer quiet; any touch wakes it

   Everything runs on the Dot's own clock, so a Mind is as deterministic as
   the Dot it drives. The port adds one option, `visits` (default true, the
   canon): whether a pointer held still nearby earns a hop towards it. The
   footer's full stop never leaves its place to visit. */
import type { Dot } from "./engine";

export type Idle = { name: string; weight?: number; cooldown?: number; calm?: boolean; when?: (d: Dot, m: Mind) => boolean; run: (d: Dot, m: Mind) => void };
export type MindState = "idle" | "curious" | "busy" | "tired" | "asleep";
type MindOptions = { idles?: Idle[]; gap?: [number, number]; tiredAfter?: number; sleepAfter?: number; canSleep?: boolean; visits?: boolean; onChange?: (state: MindState, was: MindState) => void };

export class Mind {
  dot: Dot; idles: Idle[]; gap: [number, number]; tiredAfter: number; sleepAfter: number; canSleep: boolean; visits: boolean;
  onChange?: (state: MindState, was: MindState) => void;
  state: MindState = "idle"; quietSince: number; next: number; busyUntil = 0;
  last: string | null = null; used = new Map<string, number>(); point: { x: number; y: number } | null = null; pointStill = 0;

  constructor(dot: Dot, { idles = [], gap = [3.5, 4.5], tiredAfter = 35, sleepAfter = 60, canSleep = true, visits = true, onChange }: MindOptions = {}) {
    this.dot = dot; this.idles = idles; this.gap = gap; this.tiredAfter = tiredAfter; this.sleepAfter = sleepAfter; this.canSleep = canSleep; this.visits = visits; this.onChange = onChange;
    this.quietSince = dot.t; this.next = dot.t + 2;
  }

  set(state: MindState) { if (state !== this.state) { const was = this.state; this.state = state; this.onChange?.(state, was); } }

  /* Someone did something to Dot: the quiet timer restarts, sleep ends. */
  touch() {
    this.quietSince = this.dot.t; this.next = Math.max(this.next, this.dot.t + 2.5);
    if (this.dot.sleeping) this.dot.wake(false);
    if (this.state === "asleep" || this.state === "tired") this.set("idle");
  }
  /* A script or gesture has Dot for a while; idles wait. */
  busy(seconds: number) { this.busyUntil = Math.max(this.busyUntil, this.dot.t + seconds); this.set("busy"); }
  /* Something to notice, in stage coordinates, or null. */
  attend(point: { x: number; y: number } | null) {
    if (point && this.point && Math.hypot(point.x - this.point.x, point.y - this.point.y) > 3) this.pointStill = 0;
    this.point = point;
  }

  /* Weighted choice among the idles that are allowed now. */
  choose() {
    const d = this.dot, tired = this.state === "tired";
    const ok = this.idles.filter((b) => b.name !== this.last && (this.used.get(b.name) ?? -Infinity) + (b.cooldown ?? 0) <= d.t && (!b.when || b.when(d, this)) && (!tired || b.calm));
    if (!ok.length) return null;
    let sum = 0; for (const b of ok) sum += b.weight ?? 1;
    let r = d.rand() * sum;
    for (const b of ok) { r -= b.weight ?? 1; if (r <= 0) return b; }
    return ok[ok.length - 1];
  }

  /* Call after each dot.update(). */
  update(dt: number, { resting = false } = {}) {
    const d = this.dot, quiet = d.t - this.quietSince;
    if (!d.grounded) { this.quietSince = Math.max(this.quietSince, d.t - 1); return; }
    if (this.state === "busy") { if (d.t < this.busyUntil) return; this.set("idle"); }
    if (d.sleeping) { this.set("asleep"); return; }
    if (this.state === "asleep") this.set("idle");
    if (this.canSleep && quiet > this.sleepAfter) { d.sleep(); this.set("asleep"); return; }
    if (quiet > this.tiredAfter && this.state !== "tired") { this.set("tired"); d.express("sleepy", 2.4); }

    // Curious: a pointer nearby gets looked at, and a still one gets a visit.
    if (this.point && !resting) {
      const p = this.point, dx = p.x - d.x, dy = p.y - d.y, dist = Math.hypot(dx, dy);
      if (this.state === "idle") this.set("curious");
      d.lookAt(p.x, p.y, 0.6);
      d.faceLean = dist < d.r * 2.4 ? Math.max(-10, Math.min(10, (-dx / d.r) * 5)) : 0;
      this.pointStill += dt;
      if (this.visits && this.pointStill > 1.6 && dist > d.r * 3 && dist < d.r * 8 && Math.abs(dy) < d.r * 4) { this.pointStill = 0; d.hop({ dx: Math.sign(dx) * 240, height: 0.6 }); }
      return;
    }
    if (this.state === "curious") { this.set("idle"); d.faceLean = 0; }
    if (resting || d.t < this.next || quiet < 2.5) return;
    const [g0, g1] = this.gap, slow = this.state === "tired" ? 1.6 : 1;
    this.next = d.t + (g0 + d.rand() * g1) * slow;
    const b = this.choose(); if (!b) return;
    this.last = b.name; this.used.set(b.name, d.t); b.run(d, this);
  }
}
