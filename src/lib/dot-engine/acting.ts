/* Dot's acting library, as far as the footer needs it. The first five acts
   are ported unchanged from ethan-mcnamara.com src/js/dot/acting.mjs; the
   last two are the footer's own, built from the same springs and faces and
   modelled on the canon's arrival (the full stop in the title wakes up) and
   on its poke rule (five pokes: Dot rolls off in a huff and comes back).

   Nothing here touches the DOM, so every act can run in node. Personality
   brief: curious, earnest, easily delighted, a little clumsy, over-commits
   to tiny tasks, never in the way. */
import { TUNING as T } from "./tuning";
import type { Dot } from "./engine";

type Point = { x: number; y: number };

/* Look, look away, look back: the double-take. */
export function doubleTake(d: Dot, at: Point) {
  d.lookAt(at.x, at.y, 0.16);
  d.after(0.16, () => d.lookAt(d.x - (at.x - d.x), d.y - 40, 0.2));
  d.after(0.36, () => { d.lookAt(at.x, at.y, 0.9); d.express("wide", 0.5); d.size.vel += 3; d.stretch.vel += 3; });
  return d;
}
/* Glance left, glance right, then at you, a little sheepish. */
export function nobodySawThat(d: Dot) {
  d.lookAt(d.x - 400, d.y - 20, 0.22);
  d.after(0.22, () => d.lookAt(d.x + 400, d.y - 20, 0.22));
  d.after(0.44, () => { d.lookAt(d.x, d.y + d.r * 0.6, 0.7); d.express("sheepish", 1); });
  return d;
}
/* Recoil from something: squash away from it, eyes shut. */
export function flinch(d: Dot, from: Point = { x: d.x - 100, y: d.y }) {
  d.axis = Math.atan2(d.y - from.y, d.x - from.x); d.stretch.vel -= 4; d.lean.vel += Math.sign(d.x - from.x) * 140;
  d.express("squeeze", 0.45); d.blink(); return d;
}
/* A giggle: small quick wobbles, happy lids. */
export function giggle(d: Dot) {
  d.express("happy", 1);
  for (let i = 0; i < 4; i++) d.after(0.1 + i * 0.12, () => { d.wob.vel += 0.5; d.stretch.vel += 0.9; }, "giggle");
  return d;
}
/* A yawn and a slump into sleep. */
export function windDown(d: Dot) {
  d.express("sleepy", 2); d.hold = 1.18;
  d.after(0.7, () => { d.hold = 0.9; d.blink(); }, "wind");
  d.after(1.3, () => { d.hold = null; d.sleep(); }, "wind");
  return d;
}

/* ── the footer's acts ─────────────────────────────────────────────── */

/* Where the full stop lives. home: its centre x, its baseline y and its
   radius. ground: the hairline under the wordmark, the floor Dot can drop
   to. minX: the leftmost x Dot may reach (the start of "studio", so a roll
   never runs into the descender of the g). look: the page above. */
export type StopGeo = { home: { x: number; y: number; r: number }; ground: number; minX: number; maxX: number; swell: number; look: Point };

/* The time a launch from (x0, y0) with vertical speed vy takes to come down
   to y1, and the horizontal speed that lands it on x1 despite air drag. */
function arc(d: Dot, x0: number, y0: number, x1: number, y1: number, vy: number) {
  const t = (-vy + Math.sqrt(vy * vy + 2 * d.g * (y1 - y0))) / d.g;
  const drag = T.airDrag, reach = drag ? (1 - Math.exp(-drag * t)) / (drag * t) : 1;
  return { t, vx: (x1 - x0) / t / reach };
}

/* The full stop wakes up, once per visit:

     0.30 s  it blinks awake and swells, growing from its left edge so it
             never sweeps back over the o, just enough for its eyes to read
     0.70    a double-take at the page above
     1.40    a small hop on the spot that lands with weight: squash, no
             bounce, never dizzy
     2.00    pleased with itself
     2.15    it shrinks back into the full stop, exactly; at rest by about 3 s */
export const WAKE = { wake: 0.3, take: 0.7, hop: 1.4, pleased: 2, shrink: 2.15, back: 2.6 } as const;
export function fullStopWakes(d: Dot, geo: StopGeo) {
  const { home, swell, look } = geo, r0 = home.r, left = home.x - r0;
  const place = () => { d.x = left + d.r; d.y = d.floor - d.r; };
  d.express("asleep", WAKE.wake);
  d.after(WAKE.wake, () => {
    d.blink(); d.express("wide", 0.35); d.stretch.vel += 4;
    d.tween(0.22, (k) => { d.r = r0 + (swell - r0) * (1 - Math.pow(1 - k, 3)) + Math.sin(k * Math.PI) * r0 * 0.12; place(); }, "wake");
  }, "wake");
  d.after(WAKE.take, () => doubleTake(d, look), "wake");
  // A planned hop, not a fall: it lands with weight but never dizzy.
  d.after(WAKE.hop, () => { d.hop({ height: 1.1, crouch: 0.12, stick: true, depth: 0.86 }); }, "wake");
  d.after(WAKE.pleased, () => d.express("fond", 0.8), "wake");
  d.after(WAKE.shrink, () => {
    const from = d.r;
    d.tween(WAKE.back - WAKE.shrink, (k) => {
      d.r = from + (r0 - from) * k * k * (3 - 2 * k); place();
      if (k >= 1) { d.r = r0; d.x = home.x; d.y = d.floor - r0; }
    }, "wake");
  }, "wake");
  return d;
}

/* Five pokes in a run: Dot huffs, drops off the baseline onto the hairline,
   rolls away along it, sulks, looks back, rolls sheepishly back under its
   place (never across a letter) and hops straight up onto its baseline,
   landing exactly where the full stop goes. Then, nobody saw that.
   Under reduced motion the huff happens in place. */
export function huff(d: Dot, geo: StopGeo, { onBack }: { onBack?: () => void } = {}) {
  const { home, ground, minX, maxX } = geo;
  d.unhop();
  if (d.reduced) {
    d.express("sulky", 2.2); d.emote("puff", { dx: 1, size: 0.8, life: 0.8 });
    d.after(2.2, () => { d.express("sheepish", 1); onBack?.(); }, "huff");
    return d;
  }
  d.express("sulky", 1.4); d.faceLean = 14;
  d.emote("puff", { dx: -1, life: 0.7, size: 0.9 }); d.emote("puff", { dx: 1, life: 0.7, size: 0.7 });
  d.after(0.45, () => {
    // Off the baseline, down onto the hairline, landing a little to the left.
    d.walls = [minX, maxX]; d.floor = ground; d.faceLean = 0;
    const vy = -Math.sqrt(2 * d.g * d.r * 0.8), xLand = Math.max(minX + d.r, home.x - d.r * 2.2);
    const a = arc(d, d.x, d.y, xLand, ground - d.r, vy);
    d.launch(a.vx, vy, { stick: true }); d.dazed = true;
    // Then away along the hairline. A roll slows as e^(−friction·t) and stops
    // below rollSettle, so its speed sets how far it goes.
    const room = Math.max(0, xLand - (minX + d.r)), dist = Math.min(room, d.r * 7);
    const v0 = dist * T.rollFriction + T.rollSettle, rolling = Math.log(Math.max(1.01, v0 / T.rollSettle)) / T.rollFriction;
    d.after(a.t + 0.1, () => { d.express("sulky", rolling + 1.6); d.roll(-v0); }, "huff");
    // Sulk, upright again, facing away; then a look back at the gap it left.
    d.after(a.t + 0.1 + rolling + 0.5, () => { d.faceLean = -8; d.express("sulky", 0.9); }, "huff");
    d.after(a.t + 0.1 + rolling + 1.2, () => { d.faceLean = 0; d.lookAt(home.x, home.y - home.r, 0.9); d.express("sheepish", 0.9); }, "huff");
    // Back along the hairline to just under its place: the same roll rule, sized to stop there.
    let back = 0;
    d.after(a.t + 0.1 + rolling + 1.7, () => {
      const v1 = Math.max(0, home.x - d.x) * T.rollFriction + T.rollSettle;
      back = Math.log(Math.max(1.01, v1 / T.rollSettle)) / T.rollFriction;
      d.roll(v1); d.express("sheepish", back + 0.6);
      d.after(back + 0.35, hopHome, "huff");
    }, "huff");
    const hopHome = () => {
      // Home: a short hop that clears the baseline and lands exactly on it. The
      // floor moves back up only at the top of the arc, once Dot is above it.
      const rest = home.y - d.r, vy2 = -Math.sqrt(2 * d.g * (d.y - rest + d.r * 1.2));
      const b = arc(d, d.x, d.y, home.x, rest, vy2);
      d.launch(b.vx, vy2, { stick: true }); d.dazed = true;
      d.after(-vy2 / d.g, () => { d.floor = home.y; }, "huff");
      d.after(b.t + 0.05, () => {
        const x0 = d.x;
        d.tween(0.12, (k) => { d.x = x0 + (home.x - x0) * k; if (k >= 1) { d.x = home.x; d.y = home.y - d.r; } }, "huff");
        d.walls = [-Infinity, Infinity];
      }, "huff");
      d.after(b.t + 0.35, () => { nobodySawThat(d); }, "huff");
      d.after(b.t + 1.3, () => onBack?.(), "huff");
    };
  }, "huff");
  return d;
}
