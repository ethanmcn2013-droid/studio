import { v } from "./style-vars";
import { GROUP_HUE, GROUP_NAME, NOTES, arrowPaths, avatarRect, handSpots, layoutWall, noteLabel, restOn, type Group, type Rect } from "./whiteboard-layout";

const POINTER = (
  <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true"><path d="M2 1.5v15l4.2-3.6 2.7 5.6 2.4-1.1-2.7-5.5H14z" /></svg>
);
const HANDS = ["Golden hour on the terrace at 19:10", "118 guests, 8 days to go", "Ask Mara before ordering"];
const px = (n: number) => `${Math.round(n * 10) / 10}px`;
const at = (id: string) => NOTES.findIndex((note) => note.id === id);

/**
 * Whiteboard: the planning wall, with four sample people working on it. The
 * still in the markup is laid out by the same function the runtime uses, at
 * the desktop width, so the wall does not move when the script arrives.
 *
 * The still is the finished wall: every note in its group, the last idea
 * typed, the florist's note carrying its one comment, and each person's name
 * resting clear of the initials, the group labels and the controls. That is
 * what a visitor without script sees and what reduced motion rests on. With
 * motion allowed the runtime rewinds it and plays the scene.
 */
export function HomeWhiteboard() {
  const L = layoutWall(1190);
  const hands = handSpots(L);
  const arrows = arrowPaths(L);
  const florist = L.S[at("n-florist")];
  /* The names are measured in the browser; here they are taken as the widest of the four. */
  const flag = { w: 62, h: 22, dx: 13, dy: 17 };
  const avoid: Rect[] = [
    ...L.shown.filter((i) => NOTES[i].who).map((i) => avatarRect(L, L.S[i])),
    [L.W / 2 - 120, L.H - 76, 240, 64],
  ];
  const rest = (id: string) => restOn(L, L.S[at(id)], flag, avoid);
  const aoife = rest("n-typed");
  const dara = rest("n-stray");
  const niamh = rest("n-florist");
  return (
    <section className="sec" id="whiteboard" aria-labelledby="h-wb">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="mono kicker lp-reveal">Whiteboard</p>
            <h2 id="h-wb" className="lp-reveal" style={v({ "--lp-i": 1 })}>Throw it all on the wall. Tidy it later.</h2>
          </div>
          <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>The whole wedding on one wall, with the team moving it about together. You see who is here and what they are touching. Press Tidy and the mess falls into columns.</p>
        </div>
        <div className="sec-body lp-reveal">
          <p className="wb-hint"><span><span className="h-fine">Try it. Drag a note, or click one and then click where it should go.</span><span className="h-coarse">Try it. Press and hold a note to drag it, or tap one and then tap where it should go.</span></span><span>Nothing here is saved. Aoife, Dara, Dev and Niamh are sample people.</span></p>
          <div className="wbx window">
            <div className="wb-head">
              <h3>Whiteboard</h3>
              <span className="wb-proj">Mara &amp; Finn&apos;s wedding <span>Wall</span></span>
              <span className="wb-count"><span className="all"><b>21</b> notes in <b>6</b> groups</span><span className="few"><b>12</b> notes in <b>3</b> groups</span></span>
              <div className="presence" role="group" aria-label="On this wall now: Aoife, Dara, Dev, Niamh and you">
                <span>4 here with you</span>
                <ul aria-hidden="true"><li style={v({ "--lp-who": "var(--lp-av-violet)" })}>AB</li><li style={v({ "--lp-who": "var(--lp-av-green)" })}>DH</li><li style={v({ "--lp-who": "var(--lp-av-teal)" })}>DP</li><li style={v({ "--lp-who": "var(--lp-av-blue)" })}>NW</li><li className="you">You</li></ul>
              </div>
            </div>
            <div className="wb" id="wb" role="application" aria-roledescription="whiteboard" aria-label="Whiteboard sample for Mara and Finn's wedding. Notes in groups, with four sample people." aria-describedby="wb-keys">
              {(Object.keys(GROUP_NAME) as Group[]).map((g) => {
                const r = L.fr[g] ?? [0, 0, L.fw, L.fh];
                return (
                  <div key={g} className={g === "ideas" ? "frame loose" : "frame"} data-g={g} style={v({ "--lp-c": GROUP_HUE[g], "--lp-fx": px(r[0]), "--lp-fy": px(r[1]), "--lp-fwd": px(r[2]), "--lp-fht": px(r[3]) })}>
                    <span>{GROUP_NAME[g]} <b>{L.count[g]}</b></span>
                  </div>
                );
              })}
              {HANDS.map((text, i) => (
                <p key={i} className="hand" data-h={i} aria-hidden="true" style={v({ "--lp-hx": px(hands[i]?.[0] ?? 0), "--lp-hy": px(hands[i]?.[1] ?? 0) })}>{text}</p>
              ))}
              {NOTES.map((note, i) => {
                const p = L.S[i];
                const typed = note.id === "n-typed";
                const commented = note.id === "n-florist";
                return (
                  <button
                    key={i}
                    type="button"
                    id={note.id}
                    className={note.done ? "note done" : "note"}
                    data-k={i}
                    data-g={note.g}
                    aria-label={commented ? `${noteLabel(note)}, 1 comment` : noteLabel(note)}
                    tabIndex={i === 0 ? 0 : -1}
                    style={v({ "--lp-c": note.c, "--lp-a": note.a ?? "transparent", "--lp-tilt": `${note.j[2]}deg`, "--lp-nx": px(p[0]), "--lp-ny": px(p[1]) })}
                  >
                    {typed ? <span><span className="tx" data-full={note.title}>{note.title}</span></span> : <span>{note.title}</span>}
                    <small>{note.late ? <em>{note.meta}</em> : note.meta}{commented ? <u className="cm">1</u> : null}{note.who ? <i aria-hidden="true">{note.who}</i> : null}</small>
                  </button>
                );
              })}
              <svg className="wb-arrows" aria-hidden="true" focusable="false"><g id="arr-a"><path className="ln" pathLength="1" d={arrows?.a.ln} /><path className="hd" d={arrows?.a.hd} /></g><g id="arr-b"><path className="ln" pathLength="1" d={arrows?.b.ln} /><path className="hd" d={arrows?.b.hd} /></g></svg>
              <span className="dep" id="dep-a" aria-hidden="true" hidden={!arrows?.a.dep} style={v({ left: px(arrows?.a.dep?.[0] ?? 0), top: px(arrows?.a.dep?.[1] ?? 0) })}>depends on</span>
              <span className="dep" id="dep-b" aria-hidden="true" style={v({ left: px(arrows?.b.dep[0] ?? 0), top: px(arrows?.b.dep[1] ?? 0) })}>depends on</span>
              <div className="bubble pending" id="bubble" aria-hidden="true" style={v({ "--lp-who": "var(--lp-av-blue)", left: px(florist[0] + 30), top: px(florist[1] + L.nh - 16) })}><b><i>NW</i>Niamh</b>Fern and Furrow rang back. The deposit lands Monday.</div>
              <div className="cursor" data-who="aoife" aria-hidden="true" style={v({ "--lp-who": "var(--lp-av-violet)", "--lp-x": px(aoife[0]), "--lp-y": px(aoife[1]) })}>{POINTER}<b>Aoife</b></div>
              <div className="cursor" data-who="dara" aria-hidden="true" style={v({ "--lp-who": "var(--lp-av-green)", "--lp-x": px(dara[0]), "--lp-y": px(dara[1]) })}>{POINTER}<b>Dara</b></div>
              <div className="cursor" data-who="dev" aria-hidden="true" style={v({ "--lp-who": "var(--lp-av-teal)", "--lp-x": px(L.slot("guests", 1)[0] + L.nw / 2 - 60), "--lp-y": px((L.slot("kitchen", 3)[1] + L.nh + L.slot("guests", 1)[1]) / 2 + 6) })}>{POINTER}<b>Dev</b></div>
              <div className="cursor" data-who="niamh" aria-hidden="true" style={v({ "--lp-who": "var(--lp-av-blue)", "--lp-x": px(niamh[0]), "--lp-y": px(niamh[1]) })}>{POINTER}<b>Niamh</b></div>
              <div className="wb-tools">
                <button className="wb-tool" type="button" id="wb-pause" aria-label="Pause sample people"><svg className="pause" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3.5" y="3" width="3" height="10" rx="1" /><rect x="9.5" y="3" width="3" height="10" rx="1" /></svg><svg className="play" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.4-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5z" /></svg><span>Pause</span></button>
                <button className="wb-tool tidy-btn" type="button" id="tidy"><svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 2.5h4v11h-4zM9.5 2.5h4v7h-4z" /></svg><span>Tidy</span></button>
              </div>
            </div>
          </div>
          <p className="wb-keys" id="wb-keys">With a keyboard: the arrow keys move between notes, and Home and End go to the first and last. Enter or Space picks a note up and puts it down. While it is up, the arrow keys move it and Escape puts it back.</p>
        </div>
      </div>
    </section>
  );
}
