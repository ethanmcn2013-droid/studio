"use client";

import { useEffect } from "react";
import { startFloor } from "./floor-runtime";

/**
 * Direction A · Floor and sheet (founder pick, 2026-09-03).
 * The hero sheet with the relay stage, then the floor band. The runtime
 * starts here because this is the first floor component to mount.
 */
export function RevealHero() {
  useEffect(() => { startFloor(); }, []);
  return (
    <>
      <noscript><style>{".floor-page .rise{opacity:1;transform:none}.floor-page .pane{opacity:1;transform:none}"}</style></noscript>
      <section className="sheet hero" aria-labelledby="h1">
          <div className="inner">
            <div>
              <h1 id="h1" className="display">Project management for people <span className="hl-accent">not</span> in tech.</h1>
              <p className="lede">Notes, Tasks and Timeline. One calm system for people with work to manage, not software to manage.</p>
              <div className="actions">
                <a className="btn btn-ink" href="#system">See the system at work</a>
                <a className="btn btn-line" href="/waitlist?source=home_hero&amp;campaign=pre_access_waitlist&amp;artifact=hero_cta&amp;touch=site">Join the waitlist</a>
              </div>
              <p className="under"><span className="ui-dot" aria-hidden="true"></span> In private preview with wedding venues. Access opens in stages.</p>
            </div>
            <figure className="stage ui" id="hero-stage" aria-label="A note becomes a task, then a published moment on a timeline">
              <div className="pane" id="p-note">
                <header><span className="lhs"><span className="ui-wm">notes<i></i></span><span className="ui-kicker">Private to you</span></span><span className="ui-kicker">Mara & Finn</span></header>
                <p className="note-line"><span className="g v" aria-hidden="true"></span><span>Ceremony 2pm in the orchard, drinks on the terrace if it stays dry. <span className="approved">Confirm marquee sides with the hire company by Thursday.</span></span></p>
                <div className="note-foot"><span className="voice"><i aria-hidden="true"></i>Dictated at the gate · 35 minutes ago</span><span className="ui-pill tint">In Tasks</span></div>
              </div>
              <div className="carry" id="c1" aria-hidden="true"><span className="ui-dot"></span>Confirm marquee sides with the hire company</div>
              <div className="pane" id="p-task">
                <header><span className="lhs"><span className="ui-wm">tasks<i></i></span><span className="ui-kicker">The Orchard, events</span></span><span className="ui-kicker" id="h-state">To do</span></header>
                <div className="task"><span className="ui-check" aria-hidden="true"></span><h4>Confirm marquee sides with the hire company</h4><p className="desc">Mara & Finn, Saturday. Terrace plan if dry, marquee if not.</p><div className="meta"><u>Mara & Finn</u><span>High</span><span>◌ 1</span></div><span className="ui-pill soft when">Thu</span></div>
                <div className="task-state"><span className="ui-dot" aria-hidden="true"></span><span className="st" id="h-st">To do</span> · <span className="av" aria-hidden="true">OR</span>Orla</div>
              </div>
              <div className="carry" id="c2" aria-hidden="true"><span className="ui-dot"></span>Sat 1 Aug · Menu tasting</div>
              <div className="pane" id="p-time">
                <header><span className="lhs"><span className="ui-wm">timeline<i></i></span><span className="ui-kicker">Mara & Finn</span></span><span className="ui-kicker">One of three</span></header>
                <div className="time-row"><span className="time-big"><span id="hnum">0</span><small>days</small></span><span className="time-date"><b>Saturday 3 October 2026</b><small>Wedding day · today is 16 July</small></span></div>
                <div className="time-line" aria-hidden="true"><span className="ln"></span><i className="today"></i><i className="live"></i><i style={{ left: "46%" }}></i><i style={{ left: "71%" }}></i><i style={{ left: "100%" }}></i><b style={{ left: "0", transform: "none" }}>Today<small>16 Jul</small></b><b className="lbl">Menu tasting<small>1 Aug</small></b><b style={{ left: "46%" }}>Dress fitting<small>22 Aug</small></b><b style={{ left: "71%" }}>Guest numbers<small>5 Sep</small></b><b className="end">Wedding day<small>3 Oct</small></b></div>
                <div className="time-foot"><span>Reviewed by Orla before the link changed.</span><span className="live-tag"><i aria-hidden="true"></i>Live</span></div>
              </div>
              <button className="replay" type="button" data-scene="hero"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v5h5"/></svg>Play again</button>
            </figure>
          </div>
        </section>
      <div className="floor" id="system">
          <div className="band rise">
            <p className="big">Three rooms. One line moves between them, and only when a person says so.</p>
            <p className="small">A note stays private. The one sentence you approve becomes a task with an owner. The date the owner confirms is the only thing the public timeline shows.</p>
          </div>
        </div>
      
    </>
  );
}
