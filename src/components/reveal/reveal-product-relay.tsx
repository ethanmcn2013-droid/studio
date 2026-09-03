"use client";

import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";
import { REVIEW_SUITE_PRESENTATION } from "@/lib/review-suite-presentation";

const COUNTS = REVIEW_SUITE_PRESENTATION.taskCounts;

/**
 * Direction A · the three product scenes and the words section.
 * Notes (capture card that unfolds), Tasks (board, drag, list), Timeline
 * (across, then down at night). Content mirrors the versioned review story.
 */
export function RevealProductRelay() {
  return (
    <>
      <div className="sheet">
          
          <section className="product split" aria-labelledby="notes-h">
            <div className="inner">
              <div className="copy rise">
                <span className="kicker">Notes · Catch the source</span>
                <h2 id="notes-h" className="section">Write the thought before it disappears.</h2>
                <p className="lede">Type it, say it, or point the camera at it. A note is private until you swipe it right. Only the exact line you approve crosses into work.</p>
                <a className="more" href={PRODUCT_MARKETING_URLS.notes}>Explore Notes <span aria-hidden="true">↗</span></a>
              </div>
              <figure className="app ui rise" id="notes-app" aria-label="Notes. Two thoughts are written down, and one line is sent on to Tasks.">
                <div className="rail" aria-hidden="true">
                  <span className="dotmark"></span><span className="sep"></span>
                  <span className="it on"><svg viewBox="0 0 24 24"><path d="M6 4h9l4 4v12H6z"/><path d="M9 12h6M9 16h6"/></svg>Notes</span>
                  <span className="it"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>Tasks</span>
                  <span className="it"><svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/><circle cx="5" cy="7" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="5" cy="17" r="1.5"/></svg>Timeline</span>
                  <span className="grow"></span><span className="av">OR</span>
                </div>
                <div className="scr">
                  <div className="top"><span className="ui-wm">notes<i></i></span><span>All your notes</span><b>Mara & Finn</b><span>Saturday 3 October, in 79 days</span><span className="ui-pill ink" id="gothrough">Go through 8 notes</span><span className="r"><span>Private to you</span><span>···</span></span></div>
                  <div className="notes-body">
                    <div className="comp" id="comp">
                      <div className="edit">
                        <span className="ph">Write the thought before it disappears…</span>
                        <div className="txt"><span className="w"></span><span className="caret"></span></div>
                        <div className="foot"><span>Yours until you send it on</span><span className="cnt">0 / 10,000</span><span className="save">Save it <span className="k">Ctrl Enter</span></span></div>
                      </div>
                      <div className="side">
                        <span className="ui-kicker">Filing under</span>
                        <span className="file">Mara & Finn ⌄</span>
                        <span className="ui-kicker">Other ways in</span>
                        <div className="ways"><span className="dictate"><i className="mic"></i>Dictate</span><span>Read a photo</span></div>
                      </div>
                    </div>
                    <div className="nlist">
                      <div className="hd"><span className="ui-kicker">Your notes</span><span className="mono" style={{ fontSize: "11px" }}>14 notes</span><span className="seg"><span className="on">What it is about</span><span>When</span></span></div>
                      <div className="grp"><b>Mara & Finn<span>Saturday 3 October, in 79 days</span></b><span className="td"><span className="tdn">1</span> still to decide</span></div>
                      <div className="nrows" id="nrows">
                        <div className="nrow"><span className="g"></span><span><b>Saturday wedding, Mara & Finn.</b> Ceremony 2pm in the orchard, drinks on the terrace if it stays dry. Confirm marquee sides with the hire company by Thursday.</span><span className="ui-pill soft">In Tasks</span><span className="t">35 minutes ago</span></div>
                        <div className="nrow"><span className="g"></span><span>Mara & Finn’s menu tasting at The Orchard is booked for 1 August. Confirm the final dietary list before the venue team locks the service notes.</span><span className="ui-pill soft">In Tasks</span><span className="t">2 hours ago</span></div>
                        <div className="nrow"><span className="g"></span><span>Deposit came through for Mara & Finn. Send the receipt and the parking note for guests with the confirmation.</span><span className="ui-pill soft">Kept</span><span className="t">Yesterday</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="fbar" aria-hidden="true"><span>Search everything you wrote</span><span className="k">Ctrl K</span><span className="av">OR</span></div>
                  <div className="ghost" id="ghost" aria-hidden="true"><h5></h5><div className="m">Owner: Orla · Mara & Finn · To do</div></div>
                  <div className="cursor" id="ncur" aria-hidden="true"></div>
                </div>
                <button className="replay" type="button" data-scene="notes"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v5h5"/></svg>Play again</button>
              </figure>
            </div>
          </section>
      
          
          <section className="product wide" aria-labelledby="tasks-h">
            <div className="inner">
              <div className="head rise">
                <div className="copy">
                  <span className="kicker">Tasks · Make the commitment</span>
                  <h2 id="tasks-h" className="section">One line becomes a job with an owner.</h2>
                </div>
                <div className="copy">
                  <p className="lede">The line arrives as a card with an owner and a day. Drag it when it moves. Read it as a list when you want the count.</p>
                  <a className="more" href={PRODUCT_MARKETING_URLS.tasks}>Explore Tasks <span aria-hidden="true">↗</span></a>
                </div>
              </div>
              <figure className="app ui rise" id="tasks-app" aria-label="Tasks. The board for The Orchard. A new card arrives, is dragged from To do to In progress, then the same work is shown as a list.">
                <div className="rail" aria-hidden="true">
                  <span className="dotmark"></span><span className="sep"></span>
                  <span className="it"><svg viewBox="0 0 24 24"><path d="M6 4h9l4 4v12H6z"/><path d="M9 12h6M9 16h6"/></svg>Notes</span>
                  <span className="it on"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>Tasks</span>
                  <span className="it"><svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/><circle cx="5" cy="7" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="5" cy="17" r="1.5"/></svg>Timeline</span>
                  <span className="grow"></span><span className="av">OR</span>
                </div>
                <div className="scr">
                  <div className="top"><span className="ui-wm">tasks<i></i></span><span className="ttl">{REVIEW_SUITE_PRESENTATION.workspace.name} ⌄</span><span>Thu 16 Jul</span><span className="done"><b>{COUNTS.done}</b> of {COUNTS.total} done</span><span className="ui-pill" id="ttoday">1 today</span><span className="ui-pill ink">1 overdue</span><span className="prog" aria-hidden="true"><i id="tprog"></i></span><span className="pct" id="tpct">0%</span><span className="r"><span>Share</span><span>Planning</span><span>···</span></span></div>
                  <div className="tasks-body">
                    <div className="views">
                      <span className="seg2" id="tseg"><span className="ind"></span><span className="on"><svg viewBox="0 0 24 24"><rect x="4" y="5" width="6" height="14" rx="1"/><rect x="14" y="5" width="6" height="9" rx="1"/></svg>Board</span><span><svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/></svg>List</span><span>Schedule</span><span>Calendar</span></span>
                      <span className="r"><span>Filter</span><span>Sort</span><span>Display</span></span>
                    </div>
                    <div className="stack">
                      <div className="board-view" id="board">
                        <div className="col c1"><h5><span className="ui-dot next"></span>To do<em className="cnt">3</em></h5><div className="hint">Agreed and ready to start.</div>
                          <div className="cards">
                            <div className="card"><span className="ui-check"></span><div><h4>Confirm marquee sides with the hire company</h4><p>Mara & Finn, Saturday. Terrace plan if dry, marquee if not, they need…</p></div><div className="meta"><u>Mara & Finn</u><span>High</span></div></div>
                            <div className="card"><span className="ui-check"></span><div><h4>Reprint the faded welcome sign before the open day</h4></div><div className="meta"><span className="kk">Venue</span></div></div>
                            <div className="card"><span className="ui-check"></span><div><h4>Send midweek rate to the June 2027 walk-in couple</h4><p>About 80 guests, budget-conscious. Follow up Friday if no reply.</p></div><div className="meta"><span className="kk">Enquiry</span></div></div>
                          </div><div className="add">+ Add here</div></div>
                        <div className="col c2"><h5><span className="ui-dot flight"></span>In progress<em className="cnt">3</em></h5><div className="hint">In motion right now.</div>
                          <div className="cards">
                            <div className="card hot"><span className="ui-check"></span><div><h4>Menu tasting at The Orchard</h4><p>Mara & Finn confirmed the tasting. The venue team needs the final…</p></div><div className="meta"><u>Mara & Finn</u><span>High</span><span>◌ 2</span></div><span className="ui-pill tint when">1 Aug</span></div>
                            <div className="card"><span className="ui-check"></span><div><h4>Build the Saturday run-sheet</h4><p>Ceremony 2pm orchard, drinks terrace, dinner 5.30pm. Share…</p></div><div className="meta"><u>Mara & Finn</u><span>High</span><span>◌ 2</span></div><span className="ui-pill when">Today</span></div>
                            <div className="card"><span className="ui-check"></span><div><h4>Order tonic and the good olives</h4><p>Two extra cases of tonic; last olive delivery was short.</p></div><div className="meta"><span className="kk">Bar</span></div><span className="ui-pill ink when">14 Jul</span></div>
                          </div><div className="add">+ Add here</div></div>
                        <div className="col c3"><h5><span className="ui-dot review"></span>Review<em className="cnt">2</em></h5><div className="hint">Being checked before it goes out.</div>
                          <div className="cards">
                            <div className="card"><span className="ui-check"></span><div><h4>Approve the final seating plan</h4><p>Top table moved away from the speakers, check sightlines to…</p></div><div className="meta"><u>Mara & Finn</u><span>High</span><span>◌ 1</span></div></div>
                            <div className="card"><span className="ui-check"></span><div><h4>Sign off the recommended-suppliers list</h4><p>Add Northlight (photography) and County Marquee. Drop the lapsed…</p></div><div className="meta"><span className="kk">Venue</span></div></div>
                          </div><div className="add">+ Add here</div></div>
                        <div className="col c4"><h5><span className="ui-dot" style={{ background: "var(--status-flight)" }}></span>Waiting<em className="cnt">0</em></h5><div className="hint">Held by a reply, a delivery, or a decision.</div>
                          <div className="cards"><div className="empty">Nothing held up.</div></div><div className="add">+ Add here</div></div>
                        <div className="col c5"><h5><span className="ui-dot done"></span>Done<em className="cnt">5</em></h5><div className="hint">Finished and put away.</div>
                          <div className="cards">
                            <div className="card"><span className="ui-check done"></span><div><h4>Open day, nine couples through</h4><p>Three asked for dates. Tea urn was the hero. Repeat the format…</p></div><div className="meta"><span className="kk">Venue</span></div><span className="ui-pill when">15 Jul</span></div>
                            <div className="card"><span className="ui-check done"></span><div><h4>Chase linen order, now shipping Tuesday</h4></div><div className="meta"><span className="kk">Venue</span></div><span className="ui-pill when">15 Jul</span></div>
                            <div className="card"><span className="ui-check done"></span><div><h4>Clear Sunday 11am late checkout with housekeeping</h4></div><div className="meta"><u>Mara & Finn</u></div><span className="ui-pill when">14 Jul</span></div>
                            <div className="card"><span className="ui-check done"></span><div><h4>Deposit invoice settled, Mara & Finn</h4></div><div className="meta"><u>Mara & Finn</u></div><span className="ui-pill when">9 Jul</span></div>
                          </div><div className="add">+ Add here</div></div>
                      </div>
                      <div className="list-view" id="listview" aria-hidden="true">
                        <div className="lhead"><span></span><span>Task</span><span>For</span><span>Owner</span><span>Priority</span><span>Day</span></div>
                        <div className="lgrp"><span className="ui-dot next"></span>To do<em>3</em><small>Agreed and ready to start.</small></div>
                        <div className="lrow"><span className="ui-check"></span><span className="n">Confirm marquee sides with the hire company<small>Terrace plan if dry, marquee if not.</small></span><span className="f"><u>Mara & Finn</u></span><span className="owner"><i>OR</i>Orla</span><span className="p"><b>High</b></span><span className="d">no day</span></div>
                        <div className="lrow"><span className="ui-check"></span><span className="n">Reprint the faded welcome sign before the open day</span><span className="f"><span className="kk">Venue</span></span><span className="owner"><i>SB</i>Sam</span><span className="p"></span><span className="d">no day</span></div>
                        <div className="lrow"><span className="ui-check"></span><span className="n">Send midweek rate to the June 2027 walk-in couple</span><span className="f"><span className="kk">Enquiry</span></span><span className="owner"><i>OR</i>Orla</span><span className="p"></span><span className="d">Fri</span></div>
                        <div className="lgrp"><span className="ui-dot flight"></span>In progress<em>4</em><small>In motion right now.</small></div>
                        <div className="lrow hot"><span className="ui-check"></span><span className="n">Ask whether the ballroom opens at 8am on the Saturday<small>From this morning’s note. If not, the florist comes back twice.</small></span><span className="f"><u>Mara & Finn</u></span><span className="owner"><i>OR</i>Orla</span><span className="p"><b>High</b></span><span className="d">Today</span></div>
                        <div className="lrow"><span className="ui-check"></span><span className="n">Menu tasting at The Orchard<small>The venue team needs the final dietary list.</small></span><span className="f"><u>Mara & Finn</u></span><span className="owner"><i>OR</i>Orla</span><span className="p"><b>High</b></span><span className="d">1 Aug</span></div>
                        <div className="lrow"><span className="ui-check"></span><span className="n">Build the Saturday run-sheet</span><span className="f"><u>Mara & Finn</u></span><span className="owner"><i>SB</i>Sam</span><span className="p"><b>High</b></span><span className="d">Today</span></div>
                        <div className="lrow"><span className="ui-check"></span><span className="n">Order tonic and the good olives</span><span className="f"><span className="kk">Bar</span></span><span className="owner"><i>SB</i>Sam</span><span className="p"></span><span className="d late">14 Jul</span></div>
                        <div className="lgrp"><span className="ui-dot review"></span>Review<em>2</em><small>Being checked before it goes out.</small></div>
                        <div className="lrow"><span className="ui-check"></span><span className="n">Approve the final seating plan</span><span className="f"><u>Mara & Finn</u></span><span className="owner"><i>OR</i>Orla</span><span className="p"><b>High</b></span><span className="d">no day</span></div>
                        <div className="lrow"><span className="ui-check"></span><span className="n">Sign off the recommended-suppliers list</span><span className="f"><span className="kk">Venue</span></span><span className="owner"><i>SB</i>Sam</span><span className="p"></span><span className="d">no day</span></div>
                        <div className="lgrp"><span className="ui-dot done"></span>Done<em>5</em><small>Finished and put away.</small></div>
                        <div className="lrow"><span className="ui-check done"></span><span className="n">Open day, nine couples through</span><span className="f"><span className="kk">Venue</span></span><span className="owner"><i>OR</i>Orla</span><span className="p"></span><span className="d">15 Jul</span></div>
                        <div className="lrow"><span className="ui-check done"></span><span className="n">Chase linen order, now shipping Tuesday</span><span className="f"><span className="kk">Venue</span></span><span className="owner"><i>SB</i>Sam</span><span className="p"></span><span className="d">15 Jul</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="fbar" aria-hidden="true"><span>Search tasks</span><span className="add">+ Add task</span><span className="av">OR</span></div>
                  <div className="cursor" id="tcur" aria-hidden="true"></div>
                </div>
                <button className="replay" type="button" data-scene="tasks"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v5h5"/></svg>Play again</button>
              </figure>
            </div>
          </section>
        </div>
      
      
      <div className="floor">
          <section className="product wide" aria-labelledby="time-h">
            <div className="inner">
              <div className="head rise">
                <div className="copy">
                  <span className="kicker">Timeline · Publish the right part</span>
                  <h2 id="time-h" className="section">The couple gets their own timeline.</h2>
                </div>
                <div className="copy">
                  <p className="lede">Seven dates and a number counting down, in their own account on the venue’s licence. Every date is reviewed before it goes live. The notes behind it never leave the venue.</p>
                  <a className="more" href={PRODUCT_MARKETING_URLS.timeline}>Explore Timeline <span aria-hidden="true">↗</span></a>
                </div>
              </div>
              <figure className="app ui rise" id="time-app" aria-label="Timeline. The couple’s own page for Mara and Finn: 79 days to go, seven dates across a line, then the same dates down the page at night.">
                <div className="rail" aria-hidden="true">
                  <span className="dotmark"></span><span className="sep"></span>
                  <span className="it"><svg viewBox="0 0 24 24"><path d="M6 4h9l4 4v12H6z"/><path d="M9 12h6M9 16h6"/></svg>Notes</span>
                  <span className="it"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>Tasks</span>
                  <span className="it on"><svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/><circle cx="5" cy="7" r="1.5"/><circle cx="5" cy="12" r="1.5"/><circle cx="5" cy="17" r="1.5"/></svg>Timeline</span>
                  <span className="grow"></span><span className="av">OR</span>
                </div>
                <div className="scr">
                  <div className="tl-top"><span className="ui-wm">timeline<i></i></span>
                    <div className="tl-page" id="tlpage">
                      <div className="tl-head">
                        <div className="l"><span className="ui-kicker" style={{ fontSize: "11.5px" }}>The Orchard, events</span><b>Mara & Finn</b><span className="ui-kicker">One of three</span></div>
                        <div className="btns"><span>Add a moment</span><span>Preview</span><span className="ink" id="getlink">Get the link</span></div>
                      </div>
                      <div className="tl-live">Live since 15 July · anyone with the link can read it</div>
                      <span className="ui-kicker" style={{ fontSize: "11.5px", letterSpacing: ".14em" }}>Mara & Finn</span>
                      <div className="tl-hero">
                        <div className="tl-num"><span id="tlnum">0</span><small>days</small></div>
                        <div className="tl-date">Saturday 3 October 2026<span className="sub">Wedding day</span><div className="rule"></div><span className="today">Today is 16 July</span><span className="np">Nothing is planned until 1 August.</span></div>
                      </div>
                      <div className="tl-mode"><span className="ui-kicker" style={{ fontSize: "11.5px", letterSpacing: ".14em" }}>Days away</span><span className="seg2" id="tlseg"><span className="ind"></span><span className="on">Across</span><span>Down</span></span></div>
                      <div className="tl-stack">
                        <div className="tl-across" id="tlacross">
                          <div className="tl-track" id="tltrack"><span className="ln"></span>
                            <div className="ms now down" style={{ left: "0" }}><i></i><span className="lbl">Today, 16 July</span></div>
                            <div className="ms live up" style={{ left: "18%" }}><i></i><span className="lbl">Menu tasting<br />at The Orchard<small>Sat 1 Aug</small><span className="ed">Edit</span><span className="dn">16</span></span></div>
                            <div className="ms down mid" style={{ left: "29%" }}><i></i><span className="lbl"><span className="dn">23</span>Send the invitations<small>Sat 8 Aug</small><span className="ed">Edit</span></span></div>
                            <div className="ms up mid" style={{ left: "47%" }}><i></i><span className="lbl">Final dress fitting<small>Sat 22 Aug</small><span className="ed">Edit</span><span className="dn">37</span></span></div>
                            <div className="ms down mid" style={{ left: "56%" }}><i></i><span className="lbl"><span className="dn">44</span>Choose the<br />evening music<small>Sat 29 Aug</small><span className="ed">Edit</span></span></div>
                            <div className="ms up mid" style={{ left: "65%" }}><i></i><span className="lbl">Final guest numbers<small>Sat 5 Sep</small><span className="ed">Edit</span><span className="dn">51</span></span></div>
                            <div className="ms down mid" style={{ left: "82%" }}><i></i><span className="lbl"><span className="dn">65</span>Venue walk-through<small>Sat 19 Sep</small><span className="ed">Edit</span></span></div>
                            <div className="ms up end" style={{ left: "100%" }}><i></i><span className="lbl">Wedding day<small>Sat 3 Oct</small><span className="ed">Edit</span><span className="dn">79</span></span></div>
                          </div>
                        </div>
                        <div className="tl-down" id="tldown" aria-hidden="true">
                          <ol>
                            <li className="now"><i></i><span className="d">Today</span><span className="n">Thursday 16 July</span></li>
                            <li className="live"><i></i><span className="d">16<small>days</small></span><span className="n">Menu tasting at The Orchard<small>Sat 1 Aug · Edit</small></span></li>
                            <li><i></i><span className="d">23<small>days</small></span><span className="n">Send the invitations<small>Sat 8 Aug · Edit</small></span></li>
                            <li><i></i><span className="d">37<small>days</small></span><span className="n">Final dress fitting<small>Sat 22 Aug · Edit</small></span></li>
                            <li><i></i><span className="d">44<small>days</small></span><span className="n">Choose the evening music<small>Sat 29 Aug · Edit</small></span></li>
                            <li><i></i><span className="d">51<small>days</small></span><span className="n">Final guest numbers<small>Sat 5 Sep · Edit</small></span></li>
                            <li><i></i><span className="d">65<small>days</small></span><span className="n">Venue walk-through<small>Sat 19 Sep · Edit</small></span></li>
                            <li><i></i><span className="d">79<small>days</small></span><span className="n">Wedding day<small>Sat 3 Oct · Edit</small></span></li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="toast" id="tltoast" aria-hidden="true"><i></i>Link copied. Anyone with it can read the timeline.</div>
                </div>
                <button className="replay" type="button" data-scene="timeline"><svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 1 0 2.3-5.7"/><path d="M4 4v5h5"/></svg>Play again</button>
              </figure>
            </div>
          </section>
        </div>
      
      
      <section className="sheet words" aria-labelledby="words-h">
          <div className="inner rise">
            <h2 id="words-h" className="title">Words you will not find here.</h2>
            <p className="lede">If a word only makes sense inside a software company, it is not in the product.</p>
            <p className="nowords" id="nowords" aria-label="Sprint, backlog, epic, story points, velocity, burndown, stakeholder, workflow, dashboard, integration, onboarding, roadmap, OKR, Kanban, sync, bandwidth. Struck through, one by one.">
              <span>sprint</span><span>backlog</span><span>epic</span><span>story points</span><span>velocity</span><span>burndown</span><span>stakeholder</span><span>workflow</span><span>dashboard</span><span>integration</span><span>onboarding</span><span>roadmap</span><span>OKR</span><span>Kanban</span><span>sync</span><span>bandwidth</span>
            </p>
            <p className="yeswords" id="yeswords">You will find <span>a note, a task and a date.</span> That is enough for any project.</p>
          </div>
        </section>
    </>
  );
}
