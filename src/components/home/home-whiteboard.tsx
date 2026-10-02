import { v } from "./style-vars";

/** Whiteboard: the planning wall, with four sample people working on it. */
export function HomeWhiteboard() {
  return (
    <>
      <section className="sec" id="whiteboard" aria-labelledby="h-wb">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="mono kicker lp-reveal">Whiteboard</p>
              <h2 id="h-wb" className="lp-reveal" style={v({ "--lp-i": 1 })}>One wall. Everyone on it.</h2>
            </div>
            <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>The whole wedding on one wall, with the team moving it about together. You see who is here and what they are touching. Press Tidy and the mess falls into columns.</p>
          </div>
          <div className="lp-reveal">
            <div className="wbx">
              <div className="wb-head">
                <h3>Whiteboard</h3>
                <span className="wb-proj">Mara &amp; Finn&apos;s wedding <span>Wall</span></span>
                <span className="wb-count" id="wb-count"><b>21</b> notes in <b>6</b> groups</span>
                <div className="presence" role="group" aria-label="On this wall now: Aoife, Dara, Dev, Niamh and you">
                  <span>4 here with you</span>
                  <ul aria-hidden="true"><li style={v({ "--lp-who": "var(--lp-av-violet)" })}>AB</li><li style={v({ "--lp-who": "var(--lp-av-green)" })}>DH</li><li style={v({ "--lp-who": "var(--lp-av-teal)" })}>DP</li><li style={v({ "--lp-who": "var(--lp-av-blue)" })}>NW</li><li className="you">You</li></ul>
                </div>
              </div>
              <div className="wb" id="wb" role="group" aria-label="Whiteboard sample for Mara and Finn's wedding. Notes in six groups. Four sample people are moving notes." aria-describedby="wb-keys">
              <div className="frame" data-g="day" style={v({ "--lp-c": "var(--lp-n-indigo)", left: "24px", top: "44px", width: "362px", height: "250px" })}><span>The day <b>4</b></span></div>
              <div className="frame" data-g="suppliers" style={v({ "--lp-c": "var(--lp-n-blue)", left: "439px", top: "44px", width: "362px", height: "250px" })}><span>Suppliers <b>4</b></span></div>
              <div className="frame" data-g="kitchen" style={v({ "--lp-c": "var(--lp-n-teal)", left: "854px", top: "44px", width: "362px", height: "250px" })}><span>Kitchen and bar <b>3</b></span></div>
              <div className="frame" data-g="guests" style={v({ "--lp-c": "var(--lp-n-plum)", left: "854px", top: "352px", width: "362px", height: "250px" })}><span>Guests and seating <b>3</b></span></div>
              <div className="frame" data-g="signage" style={v({ "--lp-c": "var(--lp-n-green)", left: "24px", top: "352px", width: "362px", height: "250px" })}><span>Signage <b>3</b></span></div>
              <div className="frame loose" data-g="ideas" style={v({ "--lp-c": "var(--lp-n-plum)", left: "439px", top: "352px", width: "362px", height: "250px" })}><span>Ideas <b>3</b></span></div>
              <p className="hand" data-h="0" style={v({ left: "445px", top: "354px" })}>Golden hour on the terrace at 19:10</p>
              <p className="hand" data-h="1" style={v({ left: "32px", top: "310px" })}>118 guests, 8 days to go</p>
              <p className="hand" data-h="2" style={v({ left: "589px", top: "310px" })}>Ask Mara before ordering</p>
              <button type="button" className="note" data-g="day" data-s="0" data-j="-3,2,-1.2" aria-label="Brief the whole team on the day, due Fri 2 Oct, Aoife" style={v({ "--lp-c": "var(--lp-n-indigo)", "--lp-a": "var(--lp-av-violet)", "--lp-rot": "-1.2deg", left: "33px", top: "58px" })}><span>Brief the whole team on the day</span><small>Fri 2 Oct<i>AB</i></small></button>
              <button type="button" className="note" data-g="day" data-s="1" data-j="4,-2,0.9" aria-label="Draft a wet-weather plan for the drinks reception, due Wed, Orla" style={v({ "--lp-c": "var(--lp-n-indigo)", "--lp-a": "var(--indigo-600)", "--lp-rot": "0.9deg", left: "214px", top: "54px" })}><span>Draft a wet-weather plan for the drinks reception</span><small>Wed<i>OB</i></small></button>
              <button type="button" className="note" data-g="day" data-s="2" data-j="2,4,1.4" aria-label="Test the festoon lights on the terrace, due Thu, Tomás" style={v({ "--lp-c": "var(--lp-n-indigo)", "--lp-a": "var(--lp-av-blue)", "--lp-rot": "1.4deg", left: "38px", top: "178px" })}><span>Test the festoon lights on the terrace</span><small>Thu<i>TR</i></small></button>
              <button type="button" className="note done" data-g="day" data-s="3" data-j="-4,-1,-0.8" aria-label="Rehearsal timings with Mara and Finn, done, Aoife" style={v({ "--lp-c": "var(--lp-n-indigo)", "--lp-a": "var(--lp-av-violet)", "--lp-rot": "-0.8deg", left: "206px", top: "173px" })}><span>Rehearsal timings with Mara and Finn</span><small>Done<i>AB</i></small></button>
              <button type="button" className="note" data-g="suppliers" data-s="0" data-j="3,3,1.1" aria-label="Confirm marquee sides with Lawlor Hire, due Mon, Aoife" style={v({ "--lp-c": "var(--lp-n-blue)", "--lp-a": "var(--lp-av-violet)", "--lp-rot": "1.1deg", left: "454px", top: "59px" })}><span>Confirm marquee sides with Lawlor Hire</span><small>Mon<i>AB</i></small></button>
              <button type="button" id="n-florist" className="note" data-g="suppliers" data-s="1" data-j="-2,-3,-1.5" aria-label="Chase florist deposit, waiting 7 days, Aoife" style={v({ "--lp-c": "var(--lp-n-blue)", "--lp-a": "var(--lp-av-violet)", "--lp-rot": "-1.5deg", left: "623px", top: "53px" })}><span>Chase florist deposit</span><small>Waiting · 7 days<i>AB</i></small></button>
              <button type="button" className="note" data-g="suppliers" data-s="2" data-j="4,1,0.7" aria-label="Confirm the band's arrival time with The Lindens, due Tue, Dara" style={v({ "--lp-c": "var(--lp-n-blue)", "--lp-a": "var(--lp-av-green)", "--lp-rot": "0.7deg", left: "455px", top: "175px" })}><span>Confirm the band&apos;s arrival time with The Lindens</span><small>Tue<i>DH</i></small></button>
              <button type="button" className="note" data-g="suppliers" data-s="3" data-j="-3,4,-1.1" aria-label="Pay The Lindens' balance, due Tue 6 Oct, Orla" style={v({ "--lp-c": "var(--lp-n-blue)", "--lp-a": "var(--indigo-600)", "--lp-rot": "-1.1deg", left: "622px", top: "178px" })}><span>Pay The Lindens&apos; balance</span><small>Tue 6 Oct<i>OB</i></small></button>
              <button type="button" className="note" data-g="kitchen" data-s="0" data-j="2,-2,1.3" aria-label="Order tonic and the good olives, 2 days late, Dev" style={v({ "--lp-c": "var(--lp-n-teal)", "--lp-a": "var(--lp-av-teal)", "--lp-rot": "1.3deg", left: "868px", top: "54px" })}><span>Order tonic and the good olives</span><small><em>2 days late</em><i>DP</i></small></button>
              <button type="button" className="note" data-g="kitchen" data-s="1" data-j="-4,3,-0.9" aria-label="Menu tasting at The Orchard, due today, Dev" style={v({ "--lp-c": "var(--lp-n-teal)", "--lp-a": "var(--lp-av-teal)", "--lp-rot": "-0.9deg", left: "1036px", top: "59px" })}><span>Menu tasting at The Orchard</span><small>Today<i>DP</i></small></button>
              <button type="button" id="n-stray" className="note" data-g="kitchen" data-s="2" data-j="0,0,4" aria-label="Order prosecco for the drinks reception, due Tue, Dev" style={v({ "--lp-c": "var(--lp-n-teal)", "--lp-a": "var(--lp-av-teal)", "--lp-rot": "4deg", left: "828px", top: "244px" })}><span>Order prosecco for the drinks reception</span><small>Tue<i>DP</i></small></button>
              <button type="button" id="n-final" className="note" data-g="kitchen" data-s="3" data-j="3,-1,1.2" aria-label="Final numbers to the kitchen, due Wed, Aoife" style={v({ "--lp-c": "var(--lp-n-teal)", "--lp-a": "var(--lp-av-violet)", "--lp-rot": "1.2deg", left: "1043px", top: "173px" })}><span>Final numbers to the kitchen</span><small>Wed<i>AB</i></small></button>
              <button type="button" className="note" data-g="guests" data-s="0" data-j="-2,2,0.8" aria-label="Order place card stock, due tomorrow, Aoife" style={v({ "--lp-c": "var(--lp-n-plum)", "--lp-a": "var(--lp-av-violet)", "--lp-rot": "0.8deg", left: "864px", top: "366px" })}><span>Order place card stock</span><small>Tomorrow<i>AB</i></small></button>
              <button type="button" id="n-approve" className="note" data-g="guests" data-s="1" data-j="4,-3,-1.3" aria-label="Approve the seating plan, waiting on Mara, Aoife" style={v({ "--lp-c": "var(--lp-n-plum)", "--lp-a": "var(--lp-av-violet)", "--lp-rot": "-1.3deg", left: "1044px", top: "361px" })}><span>Approve the seating plan</span><small>Waiting on Mara<i>AB</i></small></button>
              <button type="button" className="note" data-g="guests" data-s="2" data-j="-3,1,1" aria-label="Send Mara and Finn the thank-you card, due Wed 7 Oct, Aoife" style={v({ "--lp-c": "var(--lp-n-plum)", "--lp-a": "var(--lp-av-violet)", "--lp-rot": "1deg", left: "863px", top: "483px" })}><span>Send Mara and Finn the thank-you card</span><small>Wed 7 Oct<i>AB</i></small></button>
              <button type="button" className="note" data-g="signage" data-s="0" data-j="2,3,-1.4" aria-label="Reprint the faded welcome sign, 3 days late, Dara" style={v({ "--lp-c": "var(--lp-n-green)", "--lp-a": "var(--lp-av-green)", "--lp-rot": "-1.4deg", left: "38px", top: "367px" })}><span>Reprint the faded welcome sign</span><small><em>3 days late</em><i>DH</i></small></button>
              <button type="button" className="note" data-g="signage" data-s="1" data-j="-4,-2,1.2" aria-label="Table plan easel by the barn door, no date, no owner" style={v({ "--lp-c": "var(--lp-n-green)", "--lp-a": "transparent", "--lp-rot": "1.2deg", left: "206px", top: "362px" })}><span>Table plan easel by the barn door</span><small></small></button>
              <button type="button" className="note" data-g="signage" data-s="2" data-j="3,2,-0.7" aria-label="Arrows from the car park to the orchard, no date, Tomás" style={v({ "--lp-c": "var(--lp-n-green)", "--lp-a": "var(--lp-av-blue)", "--lp-rot": "-0.7deg", left: "39px", top: "484px" })}><span>Arrows from the car park to the orchard</span><small><i>TR</i></small></button>
              <button type="button" className="note" data-g="ideas" data-s="0" data-j="0,0,-2" aria-label="Blankets on the benches if it turns cold, no date, no owner" style={v({ "--lp-c": "var(--lp-n-plum)", "--lp-a": "transparent", "--lp-rot": "-2deg", left: "443px", top: "388px" })}><span>Blankets on the benches if it turns cold</span><small></small></button>
              <button type="button" className="note" data-g="ideas" data-s="1" data-j="0,0,2.5" aria-label="Rings back from Tolland and Sons in time?, no date, no owner" style={v({ "--lp-c": "var(--lp-n-blue)", "--lp-a": "transparent", "--lp-rot": "2.5deg", left: "631px", top: "408px" })}><span>Rings back from Tolland &amp; Sons in time?</span><small></small></button>
              <button type="button" id="n-typed" className="note sel" data-g="ideas" data-s="2" data-j="0,0,-1" aria-label="Sparkler exit at 23:00?, no date, Aoife" style={v({ "--lp-c": "var(--lp-n-plum)", "--lp-a": "var(--lp-av-violet)", "--lp-rot": "-1deg", left: "528px", top: "502px", "--lp-who": "var(--lp-av-violet)" })}><span><span className="tx" data-full="Sparkler exit at 23:00?">Sparkler exit at 23</span><i className="caret"></i></span><small><i>AB</i></small></button>
              <svg className="wb-arrows" aria-hidden="true" focusable="false"><g id="arr-a"><path className="ln" pathLength="1" d="M380 110 L445 110" /><path className="hd" d="M438 105 L445 110 L438 115" /></g><g id="arr-b"><path className="ln" pathLength="1" d="M1122 288 L1122 357" /><path className="hd" d="M1117 350 L1122 357 L1127 350" /></g></svg>
              <span className="dep" id="dep-a" aria-hidden="true" style={v({ left: "412.5px", top: "130px" })}>depends on</span>
              <span className="dep" id="dep-b" aria-hidden="true" style={v({ left: "1178px", top: "322.5px" })}>depends on</span>
              <div className="bubble" id="bubble" aria-hidden="true" style={v({ "--lp-who": "var(--lp-av-blue)", left: "653px", top: "145px" })}><b><i>NW</i>Niamh</b>Fern and Furrow rang back. The deposit lands Monday.</div>
              <div className="cursor" data-who="aoife" aria-hidden="true" style={v({ "--lp-who": "var(--lp-av-violet)", "--lp-x": "662.48px", "--lp-y": "558.16px" })}><svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true"><path d="M2 1.5v15l4.2-3.6 2.7 5.6 2.4-1.1-2.7-5.5H14z" /></svg><b>Aoife</b></div>
              <div className="cursor" data-who="dara" aria-hidden="true" style={v({ "--lp-who": "var(--lp-av-green)", "--lp-x": "926.4px", "--lp-y": "304.48px" })}><svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true"><path d="M2 1.5v15l4.2-3.6 2.7 5.6 2.4-1.1-2.7-5.5H14z" /></svg><b>Dara</b></div>
              <div className="cursor" data-who="dev" aria-hidden="true" style={v({ "--lp-who": "var(--lp-av-teal)", "--lp-x": "1062px", "--lp-y": "328px" })}><svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true"><path d="M2 1.5v15l4.2-3.6 2.7 5.6 2.4-1.1-2.7-5.5H14z" /></svg><b>Dev</b></div>
              <div className="cursor" data-who="niamh" aria-hidden="true" style={v({ "--lp-who": "var(--lp-av-blue)", "--lp-x": "741.08px", "--lp-y": "85.4px" })}><svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true"><path d="M2 1.5v15l4.2-3.6 2.7 5.6 2.4-1.1-2.7-5.5H14z" /></svg><b>Niamh</b></div>
                <div className="wb-tools">
                  <div className="g" aria-hidden="true"><span><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 2.5v10l3-2.4 1.9 3.9 1.6-.8-1.9-3.8h3.9z" /></svg></span><span><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="11" height="11" rx="2" /><path d="M8 5.5v5M5.5 8h5" /></svg></span><span><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4h8M8 4v8.5" /></svg></span><span><svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12.5c3-1 6-4 9.5-8.5M9 3.5h3.8v3.8" /></svg></span></div>
                  <button className="tidy-btn" type="button" id="tidy" aria-pressed="false"><svg width="17" height="17" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 2.5h4v11h-4zM9.5 2.5h4v7h-4z" /></svg><span>Tidy</span></button>
                </div>
              </div>
            </div>
            <p className="wb-foot" id="wb-foot"><span><span className="h-try"><span className="h-fine">Try it. Drag a note, or press Tidy.</span><span className="h-coarse">Try it. Press and hold a note to move it, or press Tidy.</span></span><span className="h-keys" id="wb-keys">Arrow keys move between notes. Enter or Space picks a note up and puts it down. While it is up, the arrow keys move it and Escape puts it back.</span> Nothing here is saved.</span><span>Aoife, Dara, Dev and Niamh are sample people.</span></p>
          </div>
        </div>
      </section>
    </>
  );
}
