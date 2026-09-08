import {
  type DotPose,
  type MoodId,
  type ClipId,
  type GestureId,
  neutral,
  smooth,
  envelope,
  mix,
  random,
  clamp,
  blend,
  clipInfo,
  FILM_DURATION,
} from "./model";

function gaze(p: DotPose, x: number, y: number) {
  p.left.x += x;
  p.right.x += x;
  p.left.y += y;
  p.right.y += y;
}
function lids(p: DotPose, l: number, r = l) {
  p.left.height = Math.max(1.5, p.left.height * l);
  p.right.height = Math.max(1.5, p.right.height * r);
}
function blink(p: DotPose, t: number, at: number, duration = 0.2) {
  const x = (t - at) / duration;
  const closure = x < 0.3 ? smooth(x / 0.3) : 1 - smooth((x - 0.43) / 0.57);
  if (x >= 0 && x <= 1) lids(p, 1 - 0.92 * closure);
}
function happy(p: DotPose, amount: number) {
  p.left.curve = p.right.curve = amount;
  p.left.width = mix(p.left.width, 12, amount);
  p.right.width = mix(p.right.width, 12, amount);
}
function roundEyes(p: DotPose, amount: number) {
  p.left.width = mix(p.left.width, 16, amount);
  p.left.height = mix(p.left.height, 19, amount);
  p.right.width = mix(p.right.width, 19, amount);
  p.right.height = mix(p.right.height, 22, amount);
}
function hop(t: number, a: number, b: number, height: number) {
  const u = clamp((t - a) / (b - a));
  return -height * 4 * u * (1 - u);
}
function finish(p: DotPose): DotPose {
  p.scale = clamp(p.scale, 0.12, 1.15);
  for (const eye of [p.left, p.right]) {
    eye.width = clamp(eye.width, 1.5, 22);
    eye.height = clamp(eye.height, 1.5, 26);
    eye.x = clamp(eye.x, -36, 36);
    eye.y = clamp(eye.y, -34, 29);
  }
  p.faceOpacity = clamp(p.faceOpacity);
  return p;
}
export function evaluateMood(id: MoodId, time: number, seed = 7): DotPose {
  const p = neutral(),
    dur = clipInfo(id).duration,
    t = ((time % dur) + dur) % dur,
    u = t / dur;
  const act = envelope(u, 0.025, 0.15, 0.78, 0.97);
  switch (id) {
    case "idle": {
      const look = envelope(u, 0.16, 0.27, 0.39, 0.5),
        lookBack = envelope(u, 0.6, 0.68, 0.77, 0.9);
      const side = random(seed, 1) > 0.35 ? 1 : -1;
      gaze(p, 8 + side * (look * 6 - lookBack * 4), -5 - look * 2);
      p.y = -Math.pow(Math.sin(Math.PI * u), 2) * 0.7;
      blink(p, t, 0.48 + random(seed, 2) * 0.3);
      blink(p, t, 3.9 + random(seed, 3) * 0.4);
      break;
    }
    case "curious":
      gaze(p, 13 * act, -5 * act);
      p.x = 6 * envelope(u, 0.17, 0.29, 0.67, 0.88);
      p.y = hop(u, 0.35, 0.59, 4);
      p.left.height += 3 * act;
      p.right.height -= 6 * act;
      p.left.angle -= 10 * act;
      blink(p, t, 3.75);
      break;
    case "thinking":
      lids(p, 1 - 0.55 * act, 1 - 0.4 * act);
      gaze(p, -5 * act, -7 * act);
      p.left.angle = mix(-14, 5, act);
      p.right.angle = mix(-14, -5, act);
      p.y = hop(u, 0.62, 0.8, 3);
      blink(p, t, 2.6, 0.26);
      break;
    case "working":
      lids(p, 1 - 0.35 * act);
      gaze(p, Math.sin(u * Math.PI * 4) * 4 * act, 7 * act);
      p.left.angle = p.right.angle = 2 * act;
      p.y = -0.65 * Math.pow(Math.sin(u * Math.PI * 6), 2) * act;
      blink(p, t, 2.5, 0.15);
      break;
    case "excited":
      happy(p, act);
      p.y =
        hop(u, 0.15, 0.55, 17) + hop(u, 0.55, 0.76, 6) + hop(u, 0.76, 0.88, 2);
      p.scale = 1 + 0.025 * act;
      gaze(p, 3 * act, -2 * act);
      p.bead = envelope(u, 0.33, 0.42, 0.51, 0.72);
      break;
    case "nervous":
      roundEyes(p, act * 0.8);
      gaze(p, Math.sin(u * Math.PI * 6) * 3 * act, 2 * act);
      p.scale = 1 - 0.06 * act;
      p.x = Math.sin(u * Math.PI * 12) * 0.6 * act;
      blink(p, t, 1.8, 0.15);
      break;
    case "impatient":
      lids(p, 1 - 0.65 * act, 1 - 0.4 * act);
      gaze(p, 9 * envelope(u, 0.3, 0.4, 0.62, 0.75), 3 * act);
      p.y = hop(u, 0.05, 0.16, 3.8) + hop(u, 0.18, 0.28, 2.5);
      p.left.angle = mix(-14, 12, act);
      blink(p, t, 2.8, 0.28);
      break;
    case "setback":
      lids(p, 1 - 0.63 * act);
      gaze(p, -2 * act, 11 * act);
      p.left.angle = mix(-14, -24, act);
      p.right.angle = mix(-14, 24, act);
      p.y = 5 * act + hop(u, 0.72, 0.89, 3);
      p.scale = 1 - 0.035 * act;
      break;
    case "zoomies": {
      const energy = envelope(u, 0.12, 0.26, 0.65, 0.89),
        phase = (u - 0.2) * Math.PI * 5;
      p.x = Math.sin(phase) * 17 * energy;
      p.y = -8 * energy - Math.cos(phase) * 10 * energy;
      p.roll = 360 * smooth((u - 0.2) / 0.5);
      p.orbit = energy;
      p.orbitPhase = t * 4;
      p.orbitDensity = 3;
      happy(p, 0.55 * energy);
      break;
    }
    case "sleep":
      lids(p, 1 - 0.92 * act);
      p.left.curve = p.right.curve = -0.25 * act;
      gaze(p, -2 * act, 4 * act);
      p.y = 2 * act;
      p.scale = 1 + 0.005 * Math.sin(u * Math.PI * 6) * act;
      break;
  }
  p.shadow = 0.13;
  return finish(p);
}

export function evaluatePerformance(
  id: ClipId,
  time: number,
  seed = 7,
): DotPose {
  const p = neutral(),
    duration = clipInfo(id).duration,
    u = clamp(time / duration);
  const a = envelope(u, 0.04, 0.2, 0.64, 0.94);
  switch (id) {
    case "wink":
      gaze(p, 6 * a, -2 * a);
      lids(p, 1, 1 - 0.92 * a);
      p.right.angle = mix(-14, 4, a);
      p.left.angle = mix(-14, -8, a);
      blink(p, time, 0.08, 0.16);
      break;
    case "surprise":
      roundEyes(p, a);
      gaze(p, -4 * a, 1 * a);
      p.y = hop(u, 0.1, 0.36, 9);
      p.scale = 1 - 0.05 * a;
      break;
    case "notice":
      p.bead = a;
      roundEyes(p, envelope(u, 0.18, 0.31, 0.64, 0.9));
      gaze(p, 10 * a, -10 * a);
      p.y = hop(u, 0.27, 0.49, 3.5);
      blink(p, time, 0.15);
      break;
    case "tiny":
      p.scale = 1 - 0.83 * envelope(u, 0.05, 0.22, 0.62, 0.93);
      p.y = 7 * a;
      p.faceOpacity = smooth((p.scale - 0.18) / 0.16);
      gaze(p, 15 * a, -4);
      break;
    case "satellites":
      p.scale = 1 - 0.72 * envelope(u, 0.035, 0.19, 0.7, 0.94);
      p.satellites = envelope(u, 0.17, 0.28, 0.66, 0.82);
      p.satellitePhase = time * 3;
      p.faceOpacity = smooth((p.scale - 0.26) / 0.1);
      break;
    case "orbit":
      p.orbit = envelope(u, 0.1, 0.29, 0.68, 0.95);
      p.orbitPhase = time * 3.4;
      p.orbitDensity = 5;
      p.roll = 360 * smooth((u - 0.23) / 0.5);
      p.y = -5 * Math.sin(Math.PI * u) ** 2;
      happy(p, envelope(u, 0.69, 0.76, 0.88, 0.99) * 0.55);
      break;
    default:
      return evaluateMood(id as MoodId, time, seed);
  }
  return finish(p);
}

/** Film chapters mirror the reference's edit points. End frame is exclusive. */
export const CHAPTERS = [
  { frame: 0, name: "Hello there" },
  { frame: 65, name: "A little thought" },
  { frame: 203, name: "Between us" },
  { frame: 351, name: "Oh, hello" },
  { frame: 531, name: "A new arrival" },
  { frame: 759, name: "Small moment" },
  { frame: 917, name: "Paying attention" },
  { frame: 1056, name: "Around we go" },
  { frame: 1348, name: "Back to earth" },
  { frame: 1442, name: "Good company" },
  { frame: 1640, name: "One more time" },
  { frame: 1761, name: "Home again" },
] as const;
export function chapterAt(time: number) {
  return (
    [...CHAPTERS].reverse().find((c) => time * 60 >= c.frame) ?? CHAPTERS[0]
  );
}
export function evaluateFilm(time: number): DotPose {
  const f = clamp(time, 0, FILM_DURATION) * 60,
    p = neutral();
  gaze(p, 9, -6);
  p.left.angle = p.right.angle = -19;
  // Each cue has an eased envelope, so quiet sections remain genuinely quiet.
  if (f < 65) {
    const g = envelope(f, 11, 30, 61, 65);
    gaze(p, -12 * g, 20 * g);
    blink(p, f, 10, 14);
    blink(p, f, 32, 10);
  }
  const small = (
    a: number,
    b: number,
    c: number,
    d: number,
    amount: number,
  ) => {
    const k = envelope(f, a, b, c, d);
    p.scale *= 1 - amount * k;
    p.faceOpacity *= smooth((p.scale - 0.18) / 0.22);
    gaze(p, -20 * envelope(f, a, b, c, d), 5 * k);
    return k;
  };
  const ellipsis = small(65, 90, 133, 159, 0.8);
  if (f >= 65 && f < 159) {
    p.satellites = ellipsis;
    p.satellitePhase = -1;
  }
  const wink = envelope(f, 203, 219, 261, 270);
  lids(p, 1, 1 - 0.92 * wink);
  p.right.angle = mix(-19, 2, wink);
  blink(p, f, 203, 11);
  blink(p, f, 226, 8);
  const broad = envelope(f, 270, 291, 345, 351);
  p.left.height += broad * 13;
  p.right.height += broad * 13;
  p.left.width += broad * 5;
  p.right.width += broad * 5;
  gaze(p, -8 * broad, 33 * broad);
  const surprise = envelope(f, 351, 371, 452, 490);
  p.scale *= 1 - 0.28 * surprise;
  p.y += hop(f, 351, 382, 10);
  roundEyes(p, surprise);
  gaze(p, -10 * surprise, 6 * surprise);
  const badge = envelope(f, 531, 551, 590, 620);
  p.bead = badge;
  roundEyes(p, badge);
  gaze(p, -18 * badge, 19 * badge);
  blink(p, f, 531, 14);
  const surprise2 = envelope(f, 591, 617, 679, 723);
  p.scale *= 1 - 0.45 * surprise2;
  p.y += 6 * surprise2;
  roundEyes(p, surprise2);
  p.bead = Math.max(p.bead, surprise2 * 0.65);
  small(759, 784, 829, 871, 0.83);
  const listen = envelope(f, 917, 944, 976, 1002);
  gaze(p, 5 * listen, -8 * listen);
  p.y -= listen * 6;
  lids(p, 1, 1 - 0.3 * listen);
  blink(p, f, 917, 13);
  const focus = envelope(f, 986, 1009, 1045, 1064);
  lids(p, 1 - 0.55 * focus);
  gaze(p, -12 * focus, 9 * focus);
  p.x -= focus * 5;
  p.orbit = envelope(f, 1056, 1110, 1305, 1348);
  p.orbitDensity = 3 + 2 * envelope(f, 1160, 1190, 1260, 1310);
  p.orbitPhase = (Math.max(0, f - 1056) / 60) * 3.9;
  const roll = smooth((f - 1135) / 175);
  p.roll = roll * 720;
  p.y -= 6 * envelope(f, 1135, 1170, 1250, 1320);
  gaze(p, -9 * p.orbit, 6 * p.orbit);
  const dazed = envelope(f, 1305, 1348, 1367, 1382);
  p.left.angle += 47 * dazed;
  p.right.angle += 10 * dazed;
  blink(p, f, 1368, 14);
  const mini = small(1442, 1466, 1559, 1600, 0.84);
  if (f >= 1442 && f < 1600) {
    p.satellites = envelope(f, 1460, 1475, 1507, 1518);
    p.satellitePhase = ((f - 1442) / 60) * 5;
    p.y += mini * 2;
  }
  blink(p, f, 1590, 10);
  const coda = small(1640, 1663, 1760, 1784, 0.87);
  if (f >= 1640) {
    p.orbit = envelope(f, 1663, 1709, 1748, 1784);
    p.orbitDensity = 3;
    p.orbitPhase = ((f - 1663) / 60) * 3.5;
    p.y += coda * 4;
  }
  blink(p, f, 1784, 13);
  // Exact pose AND zero velocity at the loop endpoint, no duplicate last frame.
  p.roll = p.roll % 360;
  if (!p.orbit) {
    p.orbitPhase = 0;
    p.orbitDensity = 3;
  }
  return finish(p);
}
export function evaluateClip(
  id: ClipId,
  time: number,
  seed = 7,
  reduced = false,
): DotPose {
  let p: DotPose;
  if (id === "film") p = evaluateFilm(time);
  else if (id === "proof") {
    if (time < 1.6) p = evaluateMood("curious", (time / 1.6) * 5.6, seed);
    else if (time < 3.2)
      p = evaluatePerformance("wink", ((time - 1.6) / 1.6) * 2.4, seed);
    else p = evaluatePerformance("surprise", ((time - 3.2) / 1.8) * 2.4, seed);
  } else p = evaluatePerformance(id, time, seed);
  if (reduced) {
    p.x = p.y = p.roll = p.orbit = p.bead = p.satellites = p.shadow = 0;
    p.scale = 1;
    p.faceOpacity = 1;
  }
  return finish(p);
}
export function gesture(
  pose: DotPose,
  id: GestureId,
  elapsed: number,
): DotPose {
  const p = blend(pose, pose, 0),
    u = clamp(elapsed / (id === "greeting" || id === "wake" ? 0.9 : 0.65));
  const a = envelope(u, 0, 0.16, 0.34, 1);
  if (id === "joy" || id === "rally" || id === "greeting") {
    p.y += hop(u, 0.02, 0.62, id === "joy" ? 12 : 5);
    happy(p, a * 0.8);
  } else if (id === "wake" || id === "flinch") {
    p.y += hop(u, 0.02, 0.45, 6);
    roundEyes(p, a);
  } else if (id === "cower") {
    p.scale *= 1 - 0.06 * a;
    roundEyes(p, a * 0.8);
  } else if (id === "annoyed") {
    lids(p, 1 - 0.5 * a, 1 - 0.75 * a);
    p.x += Math.sin(u * Math.PI * 4) * 2 * a;
  } else {
    p.y += Math.sin(u * Math.PI * 2) * 2 * a;
    lids(p, 1 - 0.5 * a);
  }
  return finish(p);
}
