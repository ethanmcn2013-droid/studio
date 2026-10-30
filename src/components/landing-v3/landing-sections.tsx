"use client";

/**
 * Who it's for · In practice. Two landing sections rebranded one-to-one from a reference clip and
 * taken through the elevation lab (signal-studio-workspace docs/design/labs/landing-sections-2026-10,
 * master.html is the source of truth for geometry, copy and motion).
 *
 * The markup renders complete on the server. One effect then takes the sections over imperatively:
 * the diagonal wave on first sight of the grid, the accordion, the working sample's story (one
 * timeline, started on the first animation frame) and the lit satin behind the card. React never
 * re-renders these nodes, so the imperative updates and the DOM stay in agreement.
 */
import React, { useEffect, useRef } from "react";
import "./landing-sections.css";

type Pill = readonly [kind: "solid" | "muted" | "line", label: string];
type Story = {
  label: string; title: string; body: string; points: readonly string[];
  card: string; meta: readonly [string, string];
  rows: readonly (readonly [task: string, before: Pill, after: Pill | null])[];
  note: readonly [string, string]; act: readonly [string, string];
};

const ICON: Record<string, string> = {
  venue: '<path d="M4 20V10l8-6 8 6v10"/><path d="M9 20v-5a3 3 0 0 1 6 0v5"/>',
  planner: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
  trades: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  crew: '<path d="M4 17h16M6 17v-3a6 6 0 0 1 12 0v3M10 8V6h4v2"/><path d="M4 17v2h16v-2"/>',
  design: '<path d="M12 3l6 7-6 11-6-11z"/><circle cx="12" cy="11" r="1.5"/>',
  photo: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  teach: '<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>',
  study: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c2 2 10 2 12 0v-5"/>',
  food: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2 6 0 8v10"/>',
  clinic: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>',
  shop: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  club: '<path d="M6 21V4M6 4h11l-2 4 2 4H6"/>',
};

const PEOPLE: readonly (readonly [icon: string, name: string, sub: string])[] = [
  ["venue", "Wedding venues", "Every couple’s plan"], ["planner", "Event planners", "The run-sheet"],
  ["trades", "Trades", "Jobs and deposits"], ["crew", "Building crews", "Who is on site"],
  ["design", "Designers", "Every client, one view"], ["photo", "Photographers", "Shoots and deliveries"],
  ["teach", "Teachers", "Staff and parents"], ["study", "Students", "Thesis and deadlines"],
  ["food", "Restaurants", "The week’s prep"], ["clinic", "Clinics", "Rotas and follow-ups"],
  ["shop", "Shops", "Orders and suppliers"], ["club", "Club coaches", "Fixtures and kit"],
];

/* Each story: the button is the cause; the changed pill, the meta and the note are the effect. */
const STORIES: readonly Story[] = [
  { label: "Venues and planners", title: "See what is waiting, and who has it.",
    body: "Every wedding in one place. See who has replied, what is late and which supplier has gone quiet.",
    points: ["A private plan for every couple", "Every waiting task shows who you are waiting on", "Dates go straight to their calendar"],
    card: "Mara & Finn", meta: ["Fri 24 Sep", "Fri 24 Sep"],
    rows: [["Approve the seating plan", ["solid", "Done"], null],
           ["Confirm the band’s arrival time", ["muted", "Today"], null],
           ["Chase florist deposit", ["line", "Waiting 7 days"], ["muted", "Nudged today"]]],
    note: ["Fern and Furrow have had the deposit request for 7 days. A nudge is ready.", "Nudge sent to Fern and Furrow. It stays on the board until they reply."],
    act: ["Send the nudge", "Nudged today"] },
  { label: "Trades and crews", title: "Every job, every deposit.",
    body: "See which jobs start this week, who is on site and which deposits have not landed.",
    points: ["This week’s jobs on one page", "Who is on site, and when", "Deposits that have not landed"],
    card: "This week", meta: ["3 of 8 done", "4 of 8 done"],
    rows: [["Reprint the faded welcome sign", ["solid", "Done"], null],
           ["Order the heating manifold", ["line", "2 days late"], ["solid", "Done"]],
           ["Garden path lighting", ["muted", "In 7 days"], null]],
    note: ["The heating manifold came in this morning, 2 days late. Mark it done.", "Done. That is 4 of 8 for the week."],
    act: ["Mark as done", "Marked done"] },
  { label: "Studios and freelancers", title: "Will you make the date?",
    body: "Signal Studio compares the work done with the time gone, for every project with a date. You get the answer first.",
    points: ["Every client on one page", "The answer first, then the detail", "Share a timeline with one link"],
    card: "Projects", meta: ["Fri 24 Sep", "Fri 24 Sep"],
    rows: [["Website refresh", ["solid", "On pace"], null],
           ["Barn roof", ["muted", "Close"], null],
           ["Winter launch", ["line", "Behind"], null]],
    note: ["Winter launch is half done, with nearly two thirds of the time gone.", "Link copied: signalstudio.ie/t/k7Qm2v. Anyone with it sees the dates, nothing else."],
    act: ["Share this timeline", "Link copied"] },
  { label: "Schools and teachers", title: "See who has replied.",
    body: "Coordinate staff and parents without chasing each one. Everyone sees only the part that is theirs.",
    points: ["Each person sees their own part", "Replies counted as they come in", "Dates on one shared page"],
    card: "Spring open day", meta: ["Fri 24 Sep", "Fri 24 Sep"],
    rows: [["Book the hall", ["solid", "Done"], null],
           ["Staff rota", ["line", "14 of 18 replied"], ["muted", "Nudged today"]],
           ["Parent volunteers", ["muted", "9 of 20 replied"], null]],
    note: ["Four staff have not replied to the rota. A nudge is ready.", "Nudge sent to the four. They stay on the rota until they reply."],
    act: ["Send the nudge", "Nudged today"] },
];

const TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const TICK_DRAW = '<svg viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const SAMPLE_BEFORE = "A working sample. Nothing here is sent.";
const SAMPLE_AFTER = "Nothing here was sent.";

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="lsx-chip"><span className="ring" aria-hidden="true"><i /></span>{children}</span>
);

export function WhoItsFor() {
  const grid = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = grid.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tiles = Array.from(el.children) as HTMLElement[];
    const smooth = (x: number) => x * x * (3 - 2 * x);
    /* The source's wave, to its measured timing: +0.17s per column, row two one column behind,
       each flip 0.6s (0.15 up, 0.15 held, 0.3 down). It runs once, on first sight. */
    const wave = (t: number) => {
      const n = getComputedStyle(el).gridTemplateColumns.split(" ").length;
      let live = false;
      tiles.forEach((tile, i) => {
        const p = t - 0.17 * ((i % n) + Math.floor(i / n));
        let lit = 0;
        if (p > 0 && p < 0.15) lit = smooth(p / 0.15);
        else if (p >= 0.15 && p < 0.3) lit = 1;
        else if (p >= 0.3 && p < 0.6) lit = 1 - smooth((p - 0.3) / 0.3);
        if (p < 0.6) live = true;
        if (lit > 0) tile.style.setProperty("--lit", lit.toFixed(3)); else tile.style.removeProperty("--lit");
      });
      return live;
    };
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let at: number | null = null;
      el.classList.add("waving");
      const step = (now: number) => {
        if (at === null) at = now;
        if (wave((now - at) / 1000 - 0.3) || now - at < 600) raf = requestAnimationFrame(step);
        else { el.classList.remove("waving"); raf = 0; }
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="sec lsx" id="who" aria-labelledby="lsx-who-title">
      <div className="wrap"><div className="lsx-c">
        <div className="lsx-head lsx-s1">
          <Chip>Who it’s for</Chip>
          <h2 className="lsx-title" id="lsx-who-title">Built for the work, <span>not the job title.</span></h2>
          <div className="lsx-lede-col">
            <p className="lsx-lede">Signal Studio is for the people the work runs through. Venues, crews, schools and studios. It{" "}opens ready to use, in plain English, with nothing to set up.</p>
            <a className="lsx-btn" href="#waitlist">Join the waitlist
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
          </div>
        </div>
        <ul className="lsx-grid" ref={grid}>
          {PEOPLE.map(([icon, name, sub]) => (
            <li className="lsx-tile" key={name}>
              <span className="lsx-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICON[icon] }} /></span>
              <span><b>{name}</b><small>{sub}</small></span>
            </li>
          ))}
        </ul>
      </div></div>
    </section>
  );
}

const FLUID_VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
/* Domain-warped noise lit as satin: broad folds, a neutral sheen mixed over deep indigo (never
   added, so it cannot turn lavender), a soft luminance shoulder so nothing clips. */
const FLUID_FS = `precision highp float;uniform vec2 R;uniform float T;uniform vec2 C;uniform vec2 OFF;
vec2 h2(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.+2.*fract(sin(p)*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
  return mix(mix(dot(h2(i),f),dot(h2(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(h2(i+vec2(0,1)),f-vec2(0,1)),dot(h2(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.55;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<3;i++){v+=a*n(p);p=m*p;a*=.38;}return v;}
float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
float H(vec2 p,vec2 c){vec2 q=vec2(fbm(p+c),fbm(p+vec2(5.2,1.3)+vec2(-c.y,c.x)*.8));return fbm(p+2.2*q+c*.5);}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;
  vec2 p=uv*.4+OFF;
  float e=.004;
  float h=H(p,C),hx=H(p+vec2(e,0.),C),hy=H(p+vec2(0.,e),C);
  vec3 nr=normalize(vec3((h-hx)/e*.75,(h-hy)/e*.75,1.));
  vec3 Ld=normalize(vec3(-.55,.6,.6));
  float dif=max(dot(nr,Ld),0.);
  float spec=pow(max(dot(reflect(-Ld,nr),vec3(0.,0.,1.)),0.),6.);
  float k=smoothstep(-.8,.2,h);
  vec3 base=mix(vec3(.004,.004,.016),vec3(.27,.24,.8),k);
  vec3 col=mix(base*(.22+1.9*dif*dif),vec3(.86,.87,.92),smoothstep(.3,.95,spec)*.75*k);
  float lum=dot(col,vec3(.2126,.7152,.0722));col*=1./(1.+max(lum-.8,0.)*1.5);col=pow(col,vec3(1.15));
  col+=(hash(gl_FragCoord.xy+fract(T))-.5)/170.;
  gl_FragColor=vec4(col,1.);
}`;
/* Where the field sits in noise space: chosen in the lab so a lit fold passes behind the card. */
const FLUID_OFFSET = [-0.25, 1.0] as const;
/* Noise units per second, matched to the source's measured drift. */
const FLUID_SPEED = 0.4;
const FLUID_PERIOD = 24;

export function InPractice() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const q = <T extends Element>(sel: string) => host.querySelector(sel) as T;
    const rows = q<HTMLUListElement>(".lsx-rows"), note = q<HTMLSpanElement>(".lsx-note-t"), act = q<HTMLButtonElement>(".lsx-act"),
      actT = q<HTMLSpanElement>(".lsx-act-t"), meta = q<HTMLElement>(".lsx-card-h small"), title = q<HTMLElement>(".lsx-card-h b"),
      reset = q<HTMLButtonElement>(".lsx-sample button"), sampleT = q<HTMLSpanElement>(".lsx-sample span"),
      live = q<HTMLParagraphElement>(".lsx-sr"), card = q<HTMLDivElement>(".lsx-card"), stage = q<HTMLDivElement>(".lsx-stage");
    const buttons = Array.from(host.querySelectorAll<HTMLButtonElement>(".lsx-acc-btn"));
    const panels = Array.from(host.querySelectorAll<HTMLDivElement>(".lsx-acc-panel"));
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smooth = (x: number) => x * x * (3 - 2 * x);
    const easeOut = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);
    let active = 0, done = false, raf = 0, timer = 0;

    const pillHTML = ([k, label]: Pill) => `<span class="lsx-pill" data-k="${k}">${label}</span>`;
    const changedIdx = () => STORIES[active].rows.map((r, i) => (r[2] ? i : -1)).filter((i) => i >= 0);
    function paint(after: boolean) {
      const s = STORIES[active];
      title.textContent = s.card;
      meta.textContent = s.meta[after ? 1 : 0];
      rows.innerHTML = s.rows.map(([name, before, changed]) =>
        `<li class="lsx-row"><span>${name}</span>${pillHTML(after && changed ? changed : before)}</li>`).join("");
      note.textContent = s.note[after ? 1 : 0];
      actT.innerHTML = after ? `${TICK_DRAW}${s.act[1]}` : s.act[0];
      [note, actT, meta].forEach((el) => { el.style.opacity = ""; el.style.transform = ""; });
      act.style.transform = "";
      if (!after) { act.style.background = ""; act.style.color = ""; }
      act.setAttribute("aria-disabled", after ? "true" : "false");
      reset.hidden = !after;
      /* After a press the footer says the truth about that press, on one line. */
      sampleT.textContent = after ? SAMPLE_AFTER : SAMPLE_BEFORE;
      done = after;
    }
    const effects = () => [...changedIdx().map((i) => rows.children[i].querySelector(".lsx-pill") as HTMLElement), note, actT,
      ...(STORIES[active].meta[0] !== STORIES[active].meta[1] ? [meta] : [])];

    /* One timeline, lt seconds since the press: press 0 to 0.12 and release to 0.36 give the button
       weight; the effect swaps at 0.34 (out up, in from below with a settle); the tick draws from 0.42. */
    function storyFrame(lt: number) {
      const pr = lt < 0.12 ? easeOut(lt / 0.12) : 1 - easeOut((lt - 0.12) / 0.24);
      act.style.transform = `scale(${(1 - 0.03 * pr).toFixed(4)})`;
      const k = Math.min(1, Math.max(0, (lt - 0.14) / 0.4)), after = k >= 0.5;
      if (after !== done) paint(after);
      effects().forEach((el) => {
        let o, y, sc = 1;
        if (!after) { const j = smooth(Math.min(1, k * 2)); o = 1 - j; y = -3 * j; }
        else { const e = easeOut((k - 0.5) * 2); o = e; y = 4 * (1 - e); sc = 0.96 + 0.04 * e; }
        el.style.opacity = o.toFixed(3); el.style.transform = `translateY(${y.toFixed(2)}px) scale(${sc.toFixed(4)})`;
      });
      /* The button's fill travels from light to glass with the swap, so nothing snaps. */
      const m = smooth(k);
      act.style.background = `color-mix(in oklab, var(--x-cta) ${((1 - m) * 100).toFixed(1)}%, var(--x-glass-well))`;
      act.style.color = `color-mix(in oklab, var(--x-cta-ink) ${((1 - m) * 100).toFixed(1)}%, var(--x-glass-ink))`;
      const tick = actT.querySelector("path");
      if (tick) tick.style.strokeDashoffset = (1 - easeOut((lt - 0.42) / 0.32)).toFixed(3);
      return lt < 0.9;
    }
    /* The clock starts on the first animation frame, never on the event: a frame timestamp can
       precede the click, which in the lab once stopped the story while still announcing it. */
    function press() {
      if (done || raf) return;
      if (reduce) { paint(true); live.textContent = STORIES[active].note[1]; return; }
      let at: number | null = null;
      const step = (now: number) => {
        if (at === null) at = now;
        if (storyFrame(Math.max(0, (now - at) / 1000))) raf = requestAnimationFrame(step);
        else { raf = 0; act.style.transform = ""; live.textContent = STORIES[active].note[1]; }
      };
      raf = requestAnimationFrame(step);
    }
    const stopStory = () => { cancelAnimationFrame(raf); raf = 0; };
    const onReset = () => { stopStory(); paint(false); live.textContent = ""; act.focus(); };
    /* Opening a row never presses for the reader: the one autoplay is the card's first arrival. */
    function open(i: number) {
      stopStory(); window.clearTimeout(timer); active = i;
      buttons.forEach((b, j) => b.setAttribute("aria-expanded", String(j === i)));
      panels.forEach((p, j) => { p.hidden = j !== i; });
      paint(false); live.textContent = "";
    }
    const onAcc = (e: Event) => {
      const b = (e.target as HTMLElement).closest(".lsx-acc-btn");
      if (!b) return;
      const i = buttons.indexOf(b as HTMLButtonElement);
      if (i !== active) open(i);
    };
    act.addEventListener("click", press);
    reset.addEventListener("click", onReset);
    host.addEventListener("click", onAcc);

    /* ── The satin ───────────────────────────────────────────── */
    const canvas = q<HTMLCanvasElement>(".lsx-stage canvas");
    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
    let draw: (t: number) => void = () => {};
    if (gl) {
      const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
      const pr = gl.createProgram()!;
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, FLUID_VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FLUID_FS)); gl.linkProgram(pr);
      if (gl.getProgramParameter(pr, gl.LINK_STATUS)) {
        gl.useProgram(pr);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        const uR = gl.getUniformLocation(pr, "R"), uT = gl.getUniformLocation(pr, "T"), uC = gl.getUniformLocation(pr, "C"), uO = gl.getUniformLocation(pr, "OFF");
        gl.uniform2f(uO, FLUID_OFFSET[0], FLUID_OFFSET[1]);
        draw = (t: number) => {
          const d = Math.min(devicePixelRatio || 1, 2), w = Math.round(canvas.clientWidth * d), h = Math.round(canvas.clientHeight * d);
          if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
          gl.viewport(0, 0, w, h);
          /* A closed circular path through noise space, so the drift never jumps. */
          const a = (2 * Math.PI * (t % FLUID_PERIOD)) / FLUID_PERIOD, r = (FLUID_SPEED * FLUID_PERIOD) / (2 * Math.PI);
          gl.uniform2f(uR, w, h); gl.uniform1f(uT, (t % FLUID_PERIOD) + 40);
          gl.uniform2f(uC, Math.cos(a) * r, Math.sin(a) * r); gl.drawArrays(gl.TRIANGLES, 0, 3);
        };
        (host.querySelector(".lsx-fallback") as HTMLElement).hidden = true;
      }
    }
    draw(3);

    const ios: IntersectionObserver[] = [];
    let fluidRaf = 0;
    if (!reduce && typeof IntersectionObserver !== "undefined") {
      /* The satin only moves while it is on screen. */
      const t0 = performance.now();
      const loop = (now: number) => { draw((now - t0) / 1000 + 3); fluidRaf = requestAnimationFrame(loop); };
      ios.push(new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !fluidRaf) fluidRaf = requestAnimationFrame(loop);
        if (!e.isIntersecting && fluidRaf) { cancelAnimationFrame(fluidRaf); fluidRaf = 0; }
      }));
      ios[0].observe(stage);
      const once = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        once.disconnect();
        timer = window.setTimeout(press, 1600);
      }, { threshold: 0.6 });
      ios.push(once);
      once.observe(card);
    }
    const onResize = () => { if (!fluidRaf) draw(3); };
    window.addEventListener("resize", onResize);

    return () => {
      stopStory(); window.clearTimeout(timer); cancelAnimationFrame(fluidRaf);
      ios.forEach((io) => io.disconnect());
      act.removeEventListener("click", press); reset.removeEventListener("click", onReset);
      host.removeEventListener("click", onAcc); window.removeEventListener("resize", onResize);
    };
  }, []);

  const first = STORIES[0];
  return (
    <section className="sec lsx" id="in-practice" aria-labelledby="lsx-practice-title" ref={root}>
      <div className="wrap"><div className="lsx-c">
        <div className="lsx-head lsx-s2">
          <Chip>In practice</Chip>
          <h2 className="lsx-title" id="lsx-practice-title">One place, <span>every kind of work.</span></h2>
          <div className="lsx-lede-col">
            <p className="lsx-lede">Tasks, dates, files and chat sit together. Everyone sees what is theirs to do, in words they already use.</p>
          </div>
        </div>
        <div className="lsx-practice">
          <div className="lsx-acc">
            {STORIES.map((s, i) => (
              <div className="lsx-acc-item" key={s.label}>
                <h3><button className="lsx-acc-btn" id={`lsx-acc-b${i}`} type="button" aria-expanded={i === 0} aria-controls={`lsx-acc-p${i}`}>
                  <span className="n" aria-hidden="true">0{i + 1}</span><span>{s.label}</span><span className="dot" aria-hidden="true" />
                </button></h3>
                <div className="lsx-acc-panel" id={`lsx-acc-p${i}`} role="region" aria-labelledby={`lsx-acc-b${i}`} hidden={i !== 0}>
                  <h3>{s.title}</h3><p>{s.body}</p>
                  <ul>{s.points.map((p) => <li key={p}><span aria-hidden="true" dangerouslySetInnerHTML={{ __html: TICK }} style={{ display: "contents" }} />{p}</li>)}</ul>
                </div>
              </div>
            ))}
          </div>
          <div className="lsx-stage">
            <div className="lsx-fallback" aria-hidden="true" />
            <canvas aria-hidden="true" />
            <div className="lsx-card" role="group" aria-label="Working sample">
              <div className="lsx-card-h"><span className="lsx-app" aria-hidden="true"><i /></span><b>{first.card}</b><small>{first.meta[0]}</small></div>
              <ul className="lsx-rows">
                {first.rows.map(([name, [k, label]]) => <li className="lsx-row" key={name}><span>{name}</span><span className="lsx-pill" data-k={k}>{label}</span></li>)}
              </ul>
              <p className="lsx-note"><span className="lsx-note-t">{first.note[0]}</span></p>
              <button className="lsx-act" type="button" aria-disabled="false"><span className="lsx-act-t">{first.act[0]}</span></button>
              <p className="lsx-sample"><span>{SAMPLE_BEFORE}</span><button type="button" hidden>Start again</button></p>
            </div>
            <p className="lsx-sr" aria-live="polite" />
          </div>
        </div>
      </div></div>
    </section>
  );
}
