import {
  blend,
  clipInfo,
  clamp,
  smooth,
  type ClipId,
  type DotPose,
  type GestureId,
} from "./model";
import { evaluateClip, gesture } from "./clips";
/** Small input state machine. A single clock owns all animation channels. */
export class DotPlayer {
  clip: ClipId = "idle";
  time = 0;
  seed = 7;
  speed = 1;
  playing = true;
  loop = true;
  reduced = false;
  visible = true;
  gaze = { x: 0, y: 0 };
  private gazeNow = { x: 0, y: 0 };
  drag = { x: 0, y: 0 };
  dragging = false;
  private bridge: { pose: DotPose; elapsed: number } | null = null;
  private reaction: { id: GestureId; elapsed: number } | null = null;
  private release: { x: number; y: number; elapsed: number } | null = null;
  private clock = 0;
  private lastPoke = -10;
  private pokeCount = 0;
  private region: { start: number; end: number } | null = null;
  get duration() {
    return clipInfo(this.clip).duration;
  }
  get needsFrame() {
    return this.visible && !this.reduced && this.playing;
  }
  pose(): DotPose {
    const t = this.reduced ? clipInfo(this.clip).poster : this.time;
    let p = evaluateClip(this.clip, t, this.seed, this.reduced);
    if (this.bridge)
      p = blend(this.bridge.pose, p, smooth(this.bridge.elapsed / 0.22));
    if (this.reaction && !this.reduced)
      p = gesture(p, this.reaction.id, this.reaction.elapsed);
    if (!this.reduced && this.clip !== "film") {
      p.left.x += this.gazeNow.x;
      p.right.x += this.gazeNow.x;
      p.left.y += this.gazeNow.y;
      p.right.y += this.gazeNow.y;
      for (const eye of [p.left, p.right]) {
        const limit =
          49.9999 -
          Math.hypot(eye.width / 2, eye.height / 2) -
          Math.abs(eye.curve * 5.5);
        const distance = Math.hypot(eye.x, eye.y);
        if (distance > limit) {
          eye.x *= limit / distance;
          eye.y *= limit / distance;
        }
      }
    }
    if (!this.reduced) {
      p.x += this.drag.x;
      p.y += this.drag.y;
    }
    return p;
  }
  select(clip: ClipId) {
    const current = this.pose();
    this.clip = clip;
    this.time = this.playing ? 0 : clipInfo(clip).poster;
    this.region = null;
    this.reaction = null;
    this.gaze = { x: 0, y: 0 };
    this.gazeNow = { x: 0, y: 0 };
    this.drag = { x: 0, y: 0 };
    this.dragging = false;
    this.release = null;
    this.bridge =
      this.reduced || !this.playing ? null : { pose: current, elapsed: 0 };
  }
  tick(delta: number) {
    if (!this.visible || this.reduced || !this.playing) return;
    const dt = clamp(delta, 0, 0.1);
    this.clock += dt;
    const follow = 1 - Math.exp(-12 * dt);
    this.gazeNow.x += (this.gaze.x - this.gazeNow.x) * follow;
    this.gazeNow.y += (this.gaze.y - this.gazeNow.y) * follow;
    if (this.playing && !this.dragging) {
      this.time += dt * this.speed;
      const end = this.region?.end ?? this.duration,
        start = this.region?.start ?? 0;
      if (this.time >= end) {
        if (this.loop) this.time = start + ((this.time - end) % (end - start));
        else {
          this.time = Math.max(0, end - 1 / 60);
          this.playing = false;
        }
      }
    }
    if (this.bridge) {
      this.bridge.elapsed += dt;
      if (this.bridge.elapsed >= 0.22) this.bridge = null;
    }
    if (this.reaction) {
      this.reaction.elapsed += dt;
      if (this.reaction.elapsed >= 0.9) this.reaction = null;
    }
    if (this.release) {
      this.release.elapsed += dt;
      const t = this.release.elapsed;
      const decay = Math.exp(-11 * t) * Math.cos(12 * t);
      this.drag = { x: this.release.x * decay, y: this.release.y * decay };
      if (t >= 0.7) {
        this.release = null;
        this.drag = { x: 0, y: 0 };
      }
    }
  }
  pause() {
    this.playing = false;
  }
  play() {
    this.playing = !this.reduced;
  }
  seek(time: number) {
    this.pause();
    this.bridge = null;
    this.reaction = null;
    this.release = null;
    this.dragging = false;
    this.drag = { x: 0, y: 0 };
    this.gaze = { x: 0, y: 0 };
    this.gazeNow = { x: 0, y: 0 };
    this.time = clamp(time, 0, Math.max(0, this.duration - 1 / 60));
  }
  setRegion(start: number, end: number) {
    if (
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      start < 0 ||
      end > this.duration ||
      end - start < 1 / 60
    )
      throw new Error(
        "Choose an end frame after the start frame, within this performance.",
      );
    this.region = { start, end };
    this.time = start;
  }
  clearRegion() {
    this.region = null;
  }
  poke(id?: GestureId) {
    if (this.reduced || !this.playing || this.dragging || this.clip === "film")
      return false;
    if (this.clock - this.lastPoke < 0.23) return false;
    this.pokeCount =
      this.clock - this.lastPoke > 2 ? 1 : Math.min(3, this.pokeCount + 1);
    this.lastPoke = this.clock;
    this.reaction = {
      id:
        id ??
        (this.pokeCount >= 3
          ? "greeting"
          : this.clip === "sleep"
            ? "wake"
            : "acknowledge"),
      elapsed: 0,
    };
    return true;
  }
  startDrag() {
    if (this.reduced || !this.playing || this.clip === "film") return;
    this.dragging = true;
    this.bridge = null;
    this.release = null;
    this.reaction = null;
  }
  moveDrag(x: number, y: number) {
    if (!this.dragging) return;
    this.drag = { x: 22 * Math.tanh(x / 22), y: 18 * Math.tanh(y / 18) };
  }
  endDrag() {
    if (!this.dragging) return;
    this.dragging = false;
    this.release = { ...this.drag, elapsed: 0 };
  }
  reset() {
    this.seek(0);
    this.clip = "idle";
    this.time = 0;
    this.region = null;
  }
  setReduced(on: boolean) {
    this.reduced = on;
    if (on) {
      this.seek(this.time);
      this.region = null;
    }
  }
}
