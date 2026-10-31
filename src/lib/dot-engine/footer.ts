/* Dot as the full stop of the footer wordmark. Loaded only when the footer
   comes near (see landing-footer.tsx), so nothing here costs the page
   anything before then.

   The server already drew the full stop: a perfect indigo circle with the
   approved eyes, at period size, on the baseline. This module lays a
   transparent <svg> over the footer, mounts the engine's Dot exactly over
   that full stop, hides the still in the same task (so there is no flash and
   no layout shift) and from then on draws Dot itself.

   The clock. One requestAnimationFrame, running only while Dot has something
   to play out and the footer is on screen and the tab is visible. Once Dot
   is settled (or asleep and drawn), the loop stops and a single timer waits
   for the next thing Dot will do by itself: a blink, a face wearing off, an
   idle, getting sleepy. When the loop restarts, the Dot's clock catches up
   in whole steps, without drawing, so its time stays in step with the
   visitor's. */
import { Dot, HZ, el, mount } from "./engine";
import { Mind, type Idle } from "./mind";
import { fullStopWakes, huff, windDown, WAKE, type StopGeo } from "./acting";

/* Seconds without a pointer move, poke or focus before Dot winds down. */
const SLEEP_AFTER = 20;
/* Seconds before that, its lids get heavy. */
const TIRED_AFTER = 14;
/* Seconds of slow breaths and z's once asleep, before the loop lets it be. */
const ASLEEP_SHOWN = 6;
/* Marks are drawn at least this share of their own size, so a sweat drop
   stays legible on a Dot no bigger than a full stop. */
const MIN_MARK = 0.44;

export type FooterDotParts = {
  host: HTMLElement;          // the footer: Dot's stage, and where the pointer is followed
  stop: HTMLElement;          // the full stop's box in the wordmark
  button: HTMLButtonElement;  // Dot, as a real button
  live: HTMLElement;          // the polite live region
  ground: HTMLElement;        // its top edge is the hairline Dot can drop to
  studio: HTMLElement;        // the word "studio": Dot never rolls further left
  mark: HTMLElement;          // the wordmark row: the arrival plays once it is in view
};

type Phase = "dozing" | "awake" | "huff" | "asleep";
const SAY: Record<string, string> = {
  giggle: "Dot giggles.", boop: "Dot is surprised.", grumpy: "Dot is grumpy.", flinch: "Dot blinks.",
};

export function startFooterDot({ host, stop, button, live, ground, studio, mark }: FooterDotParts): () => void {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const svg = el("svg", { class: "lf-stage", "aria-hidden": "true", focusable: "false" }) as SVGSVGElement;
  host.append(svg);

  /* Where everything is, in the footer's own pixels. */
  const measure = (): StopGeo => {
    // The stage fills the footer's padding box (inside its top border), so that is the origin.
    const hb = host.getBoundingClientRect(), ox = hb.left + host.clientLeft, oy = hb.top + host.clientTop;
    const sb = stop.getBoundingClientRect(), gb = ground.getBoundingClientRect(), tb = studio.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${host.clientWidth} ${host.clientHeight}`);
    const r = sb.width / 2, x = sb.left - ox + r, y = sb.bottom - oy, maxX = host.clientWidth - 2;
    // Swell enough for the eyes to read, never past the footer's edge (it grows rightwards).
    const swell = Math.max(r, Math.min(Math.max(r * 1.5, 9), (maxX - (x - r)) / 2));
    return { home: { x, y, r }, ground: gb.top - oy, minX: tb.left - ox, maxX, swell, look: { x: x - 260, y: y - 520 } };
  };
  let geo = measure();

  const dot = new Dot({ x: geo.home.x, r: geo.home.r, floor: geo.home.y, seed: 823, reduced: motion.matches, breathe: 0, shove: false });
  const view = mount(svg, dot, { minMark: MIN_MARK, shadowInAirOnly: true });
  // The z that stays while Dot sleeps with the loop stopped.
  const z = el("path", { class: "dot-mark dot-mark-inkline lf-z", d: "M-5.4 -6H5.4L-5.4 6H5.4" }, svg);

  /* Quiet idles: a blink, a glance up at the page, reading its own name, a
     small settle, a fond look. Nothing that changes its size. */
  const idles: Idle[] = [
    { name: "blink", weight: 2, calm: true, run: (d) => { d.blink(d.rand() < 0.4); } },
    { name: "look-up", weight: 1.2, cooldown: 8, run: (d) => { d.lookAt(d.x - 120 - d.rand() * 260, d.y - 420, 1.3); } },
    { name: "read", weight: 1, cooldown: 12, run: (d) => { d.lookAt(geo.minX - 400, d.y - d.r * 3, 1.6); } },
    { name: "settle", weight: 1, calm: true, cooldown: 6, run: (d) => { d.stretch.vel -= 1.2; d.wob.vel += 0.25; } },
    { name: "fond", weight: 0.6, cooldown: 25, run: (d) => { d.express("fond", 1.1); } },
  ];
  const mind = new Mind(dot, { idles, gap: [4, 4], tiredAfter: TIRED_AFTER, canSleep: false, visits: false });

  let phase: Phase = "awake", played = false, winding = false, asleepAt = 0, rested = false;
  let pointer: { x: number; y: number } | null = null, visible = false, focusVisible = false;
  let raf = 0, last = 0, stoppedAt = performance.now(), wake: ReturnType<typeof setTimeout> | undefined;

  const reduced = () => dot.reduced;
  let lastSaid = "";
  const say = (text: string) => { if (text && text !== lastSaid) { lastSaid = text; live.textContent = text; } };

  // Before the visitor arrives, the full stop dozes: lids down, no z's.
  if (!reduced()) { phase = "dozing"; dot.express("asleep", Infinity); dot.top.set(1); }
  else dot.blinkAt = Infinity;

  host.setAttribute("data-dot", "live");
  view.draw(true);

  /* ── the clock ─────────────────────────────────────────────────── */

  const setLoop = (on: boolean) => host.setAttribute("data-dot-loop", on ? "on" : "off");
  function kick() {
    if (wake) { clearTimeout(wake); wake = undefined; }
    if (raf || !visible || document.hidden) return;
    // Catch the Dot's clock up with the time the loop was stopped, without drawing.
    const gap = Math.min(30, (performance.now() - stoppedAt) / 1000);
    if (gap > 1 / HZ) dot.stepTo(dot.tick + Math.round(gap * HZ));
    last = 0; raf = requestAnimationFrame(frame); setLoop(true);
  }
  function stopLoop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0; stoppedAt = performance.now(); setLoop(false);
  }
  function frame(ms: number) {
    raf = 0;
    const dt = last ? Math.min((ms - last) / 1000, 0.25) : 1 / 60; last = ms;
    dot.update(dt); think(dt); view.draw();
    if (!visible || document.hidden || canRest()) {
      stopLoop();
      if (phase === "asleep") setRested(true);
      dot.acc = 0; dot.alpha = 1; view.draw(true);
      schedule();
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  const still = () => dot.settled && dot.lx.still && dot.ly.still && dot.top.still && dot.bot.still && dot.tilt.still && dot.size.still
    && dot.spin.still && dot.blinkAge > 0.25 && Math.abs(dot.lean.v - dot.lean.t) < 0.05 && Math.abs(dot.lean.vel) < 0.05
    && Math.abs(dot.stretch.v - dot.stretch.t) < 0.002 && dot.hold == null;

  function canRest() {
    if (phase === "huff") return false;
    if (phase === "asleep") {
      // A few slow breaths and a z or two, then it sleeps without frames,
      // stopping as a breath passes through its resting shape.
      if (dot.t - asleepAt < ASLEEP_SHOWN) return false;
      dot.cancel("sleep");
      return !dot.emotes.length && Math.abs(Math.sin(dot.breath)) < 0.08;
    }
    return still();
  }

  /* While the loop is stopped, wait for the next thing Dot does by itself. */
  function schedule() {
    if (wake) clearTimeout(wake);
    wake = undefined;
    if (!visible || document.hidden || rested || phase === "dozing" || phase === "huff") return;
    const t = dot.t, at: number[] = [];
    if (dot.face && dot.faceUntil !== Infinity) at.push(dot.faceUntil);
    if (!reduced()) {
      at.push(dot.blinkAt);
      if (!pointer && dot.gaze && dot.gazeUntil > t) at.push(dot.gazeUntil);
      at.push(Math.max(mind.next, mind.quietSince + 2.5));
      if (mind.state !== "tired") at.push(mind.quietSince + TIRED_AFTER);
      at.push(mind.quietSince + SLEEP_AFTER);
    }
    const next = Math.min(...at.filter((x) => x > t - 0.5));
    if (!Number.isFinite(next)) return;
    wake = setTimeout(kick, (Math.max(0.05, next - t) + 0.02) * 1000);
  }

  /* ── what Dot decides ──────────────────────────────────────────── */

  function think(dt: number) {
    if (phase === "dozing" || phase === "huff" || reduced()) return;
    mind.update(dt);
    if (phase === "asleep" && !dot.sleeping) { phase = "awake"; setRested(false); }
    if (phase === "awake" && dot.sleeping) { phase = "asleep"; asleepAt = dot.t; winding = false; }
    if (phase === "awake" && !winding && !dot.sleeping && mind.state !== "busy" && dot.grounded && dot.t - mind.quietSince > SLEEP_AFTER) {
      winding = true; mind.busy(1.4); windDown(dot);
    }
  }

  function setRested(on: boolean) {
    if (rested === on) return;
    rested = on;
    host.setAttribute("data-dot", on ? "asleep" : "live");
    if (on) {
      const k = Math.max(dot.r / 50, MIN_MARK) * 1.1;
      z.setAttribute("transform", `translate(${(dot.x + dot.r * 0.9 + 6 * k).toFixed(1)} ${(dot.y - dot.r * 1.4 - 8 * k).toFixed(1)}) scale(${k.toFixed(3)})`);
    }
  }

  /* Someone is here: the quiet timer restarts and sleep ends. */
  function touched() {
    if (phase === "dozing" || reduced()) return;
    if (winding && !dot.sleeping) { dot.cancel("wind"); dot.hold = null; winding = false; }
    mind.touch();
    if (phase === "asleep") { phase = "awake"; setRested(false); }
  }

  function arrive() {
    if (played) return;
    played = true;
    if (reduced()) { phase = "awake"; return; }
    phase = "awake"; mind.touch(); mind.busy(WAKE.back + 0.6);
    fullStopWakes(dot, geo);
    kick();
  }

  function goHomeNow() {
    dot.cancel("wake"); dot.cancel("huff"); dot.cancel("hop"); dot.cancel("wind");
    dot.air = false; dot.rolling = false; dot.vx = dot.vy = 0; dot.crouch = 0; dot.hold = null; dot.faceLean = 0; winding = false;
    dot.spin.set(0); dot.walls = [-Infinity, Infinity];
    dot.r = geo.home.r; dot.x = geo.home.x; dot.floor = geo.home.y; dot.y = geo.home.y - geo.home.r;
    dot.remember();
  }

  function poke(px: number, py: number) {
    if (phase === "huff") return;
    if (phase === "dozing") { arrive(); say("Dot is awake."); return; }
    const wasAsleep = dot.sleeping;
    if (winding && !wasAsleep) { dot.cancel("wind"); dot.hold = null; winding = false; }
    if (rested) setRested(false);
    dot.poke(px, py);
    if (!reduced()) { mind.touch(); mind.busy(0.9); }
    if (wasAsleep) { phase = "awake"; say("Dot is awake."); }
    else if (dot.pokes >= 5 && reduced()) {
      // Reduced motion: the huff is a face, in place, and no frames wait on it.
      say("Dot rolls off in a huff."); dot.express("sulky", 2.2); dot.pokes = 0;
      setTimeout(() => { lastSaid = ""; say("Dot is back."); }, 2200);
    } else if (dot.pokes >= 5) {
      say("Dot rolls off in a huff.");
      if (dot.r !== geo.home.r) goHomeNow();
      phase = "huff";
      huff(dot, geo, {
        onBack: () => {
          phase = "awake"; dot.pokes = 0; lastSaid = "";
          if (!reduced()) { mind.touch(); mind.busy(0.6); }
          say("Dot is back.");
        },
      });
    } else say(SAY[dot.lastReaction] ?? "");
    kick();
  }

  /* ── the hand ──────────────────────────────────────────────────── */

  const toStage = (e: MouseEvent) => { const b = host.getBoundingClientRect(); return { x: e.clientX - b.left - host.clientLeft, y: e.clientY - b.top - host.clientTop }; };
  const onMove = (e: PointerEvent) => {
    if (phase === "dozing" || reduced()) return;
    pointer = toStage(e); mind.attend(pointer); touched(); kick();
  };
  const onLeave = () => { pointer = null; mind.attend(null); kick(); };
  // Keyboard (Enter or Space) clicks carry no position: poke the top of the head.
  const onClick = (e: MouseEvent) => {
    const p = e.detail === 0 ? { x: dot.x - dot.r * 0.3, y: dot.y - dot.r } : toStage(e);
    poke(p.x, p.y);
  };
  const onFocus = () => { focusVisible = button.matches(":focus-visible"); view.setFocused(focusVisible); touched(); kick(); };
  const onBlur = () => { focusVisible = false; view.setFocused(false); };
  host.addEventListener("pointermove", onMove, { passive: true });
  host.addEventListener("pointerleave", onLeave, { passive: true });
  button.addEventListener("click", onClick);
  button.addEventListener("focus", onFocus);
  button.addEventListener("blur", onBlur);

  /* ── the page around it ────────────────────────────────────────── */

  const seen = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) kick(); else { if (wake) clearTimeout(wake); wake = undefined; }
  });
  seen.observe(host);
  const inView = new IntersectionObserver(([e]) => { if (e.intersectionRatio >= 0.9) { arrive(); inView.disconnect(); } }, { threshold: [0.9] });
  inView.observe(mark);

  const onVisibility = () => { if (document.hidden) { stopLoop(); if (wake) clearTimeout(wake); wake = undefined; } else kick(); };
  document.addEventListener("visibilitychange", onVisibility);

  // The wordmark is fluid: on any resize (or the font arriving) Dot goes home to its new place.
  let sizeRaf = 0;
  const relayout = () => {
    sizeRaf = 0;
    const was = geo;
    geo = measure();
    const same = Math.abs(was.home.x - geo.home.x) < 0.5 && Math.abs(was.home.y - geo.home.y) < 0.5 && Math.abs(was.home.r - geo.home.r) < 0.25 && Math.abs(was.ground - geo.ground) < 0.5;
    if (same) return;
    if (phase === "huff") { phase = "awake"; dot.pokes = 0; }
    goHomeNow();
    if (rested) { rested = false; setRested(true); }
    view.draw(true);
    kick();
  };
  const sized = new ResizeObserver(() => { if (!sizeRaf) sizeRaf = requestAnimationFrame(relayout); });
  sized.observe(host); sized.observe(stop);
  document.fonts?.ready.then(() => { if (!sizeRaf) sizeRaf = requestAnimationFrame(relayout); });

  // Reduced motion is read live: change the setting and Dot follows at once.
  const onMotion = () => {
    dot.reduced = motion.matches;
    goHomeNow();
    if (dot.reduced) {
      if (phase === "dozing") played = true;
      if (dot.sleeping) dot.wake(false);
      phase = "awake"; winding = false; setRested(false); dot.express("rest", 0.01); dot.blinkAt = Infinity;
    } else { dot.blinkAt = dot.t + 1.5; mind.touch(); }
    view.draw(true); kick();
  };
  motion.addEventListener("change", onMotion);

  return () => {
    stopLoop(); if (wake) clearTimeout(wake); if (sizeRaf) cancelAnimationFrame(sizeRaf);
    seen.disconnect(); inView.disconnect(); sized.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    motion.removeEventListener("change", onMotion);
    host.removeEventListener("pointermove", onMove); host.removeEventListener("pointerleave", onLeave);
    button.removeEventListener("click", onClick); button.removeEventListener("focus", onFocus); button.removeEventListener("blur", onBlur);
    view.remove(); svg.remove(); host.removeAttribute("data-dot"); host.removeAttribute("data-dot-loop");
  };
}
