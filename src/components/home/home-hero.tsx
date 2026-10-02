import { v } from "./style-vars";

const DONE_GLYPH = (
  <svg className="d" width="20" height="20" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="currentColor" /><path d="M5 8.3 7.1 10.4 11 6" fill="none" stroke="var(--lp-p-canvas)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);
const FILE_GLYPH = (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true"><path d="M4 1.8h5l3 3v9.4H4z" /><path d="M9 1.8v3h3" /></svg>
);
const ON_TRACK = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="6.25" /><path d="M5.4 8.2 7.2 10l3.4-3.8" /></svg>
);

/**
 * Hero: the claim, the call to action and the working Home sample. The
 * sample's label sits on its top edge and says it is live; the same line
 * carries the page's reply once the visitor has done something.
 */
export function HomeHero() {
  return (
    <section className="hero" id="top" aria-labelledby="h1">
      <div className="wrap">
        <p className="stamp mono lp-rise"><b aria-hidden="true"></b><span>Launching January 2027<i> · Wedding venues in private preview</i></span></p>
        <h1 id="h1" className="lp-move">Project management for people <em>not</em> in tech.</h1>
        <p className="lede lp-rise" style={v({ "--lp-i": 1 })}>Signal Studio tells you what needs you today, in words you would use yourself, whether you run a venue, a trade crew, a studio or a school.<span className="more"> Below is a Friday at The Orchard, a wedding venue in Kinsale.</span></p>
        <div className="cta-row lp-rise" style={v({ "--lp-i": 2 })}>
          <a className="btn btn-primary" href="#join">Join the waitlist <svg className="along" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
          <a className="btn btn-ghost" href="#sample">Try the sample <svg className="down" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg></a>
        </div>

        <div className="live lp-rise" style={v({ "--lp-i": 3 })} id="sample">
          <div className="live-label">
            <p>A Friday at The Orchard, a wedding venue in Kinsale.</p>
            <p className="respond" id="respond"><i aria-hidden="true"></i><span>This one is live. Tick a task.</span></p>
          </div>
          <div className="win window capped" id="home" role="region" aria-labelledby="h-sample">
            <h2 id="h-sample" className="vh">Home, a working sample of Signal Studio</h2>
            <div className="win-bar" aria-hidden="true"><span>The Orchard</span><i>/</i><b>Home</b></div>
            <div className="home">
              <div className="home-top">
                <div className="greet-row"><p className="greet">Good morning, Orla</p><span className="datepill">Friday 25 September</span></div>
                <p className="stats"><b data-n="need">5</b> <span data-n="needWord">things need</span> you today<span className="dot">·</span><b className="red" data-n="late">11</b> late across the venue<span className="dot">·</span><b data-n="week">35</b> done this week</p>
                <p className="stuck"><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.5 2h7M4.5 14h7M5 2c0 3 6 3.5 6 6s-6 3-6 6M11 2c0 3-6 3.5-6 6s6 3 6 6" /></svg><span><b>Chase florist deposit</b> has waited 7 days on Fern and Furrow. <button className="link" type="button" id="nudge">Nudge Fern and Furrow</button><span className="dot">·</span>3 more stuck</span></p>
              </div>
              <div className="home-main">
                <p className="grp">Late <span data-n="lateN">3</span><span data-n="lateD"></span></p>
                <ul>
                  <li className="row" data-id="t1" data-late="7 days late">
                    <button className="tick hint" type="button" aria-pressed="false" aria-label="Mark done: Agree the winter price list"><svg className="g" width="20" height="20" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>{DONE_GLYPH}</button>
                    <div><span className="row-t">Agree the winter price list</span><span className="row-p"><i className="pd" style={v({ "--lp-c": "var(--lp-proj-winter)" })}></i>Winter launch<span className="vh">, to do</span></span></div>
                    <span className="row-m late">7 days late</span>
                  </li>
                  <li className="row" data-id="t2" data-late="1 day late">
                    <button className="tick" type="button" aria-pressed="false" aria-label="Mark done: Approve the brochure copy"><svg className="g" width="20" height="20" viewBox="0 0 16 16" aria-hidden="true" style={v({ color: "var(--lp-p-review)" })}><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 3.25a4.75 4.75 0 1 1-4.75 4.75H8Z" fill="currentColor" /></svg>{DONE_GLYPH}</button>
                    <div><span className="row-t">Approve the brochure copy</span><span className="row-p"><i className="pd" style={v({ "--lp-c": "var(--lp-proj-winter)" })}></i>Winter launch<span className="vh">, to check</span></span></div>
                    <span className="row-m late">1 day late</span>
                  </li>
                  <li className="row" data-id="t3" data-late="3 days late">
                    <button className="tick" type="button" aria-pressed="false" aria-label="Mark done: Chase the headcount from Mark"><svg className="g" width="20" height="20" viewBox="0 0 16 16" aria-hidden="true" style={v({ color: "var(--lp-p-text-2)" })}><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 5v3.2l2 1.3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>{DONE_GLYPH}</button>
                    <div><span className="row-t">Chase the headcount from Mark</span><span className="row-p"><i className="pd" style={v({ "--lp-c": "var(--lp-proj-keane)" })}></i>Keane Legal · waiting on Mark</span></div>
                    <span className="row-m late">3 days late</span>
                  </li>
                </ul>
                <p className="grp">Due today <span data-n="todayN">0</span><span data-n="todayD">· 1 done</span></p>
                <ul>
                  <li className="row done" data-id="inv" data-late="Due today">
                    <button className="tick" type="button" aria-pressed="true" aria-label="Mark done: Send the final invoice to Mara and Finn"><svg className="g" width="20" height="20" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>{DONE_GLYPH}</button>
                    <div><span className="row-t">Send the final invoice to Mara and Finn</span><span className="row-p"><i className="pd" style={v({ "--lp-c": "var(--lp-proj-wedding)" })}></i>Mara &amp; Finn</span></div>
                    <span className="row-m">Done</span>
                  </li>
                </ul>
                <p className="grp">Waiting on your approval <span data-n="waitN">2</span><span data-n="waitD"></span></p>
                <ul>
                  <li className="row" data-file="f1">
                    <span className="icon-cell">{FILE_GLYPH}</span>
                    <div><span className="row-t">Heating quote, underfloor.pdf</span><span className="row-p">Barn roof · from Tomás, 23 Sep</span></div>
                    <button className="row-m" type="button"><span data-word="">Approve</span><span className="vh">: Heating quote, underfloor.pdf</span></button>
                  </li>
                  <li className="row" data-file="f2">
                    <span className="icon-cell">{FILE_GLYPH}</span>
                    <div><span className="row-t">Winter brochure v2.pdf</span><span className="row-p">Winter launch · from Siobhán, 23 Sep</span></div>
                    <button className="row-m" type="button"><span data-word="">Approve</span><span className="vh">: Winter brochure v2.pdf</span></button>
                  </li>
                </ul>
              </div>
              <aside className="home-side" aria-label="Next big day and projects">
                <div className="nbd">
                  <small>Next big day</small>
                  <h3>Mara &amp; Finn&apos;s wedding</h3>
                  <p className="days"><b>8</b> days to go, Saturday 3 October</p>
                  <p className="state"><span className="risk"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 3.25a4.75 4.75 0 0 0 0 9.5Z" fill="currentColor" /></svg>At risk</span><span><b>21</b> open</span><span className="lt"><b>2</b> late</span></p>
                  <p className="pace">At this week&apos;s pace the work is done Fri 2 Oct, 1 day to spare.</p>
                  <p className="links"><a className="link" href="#timeline">See the timeline</a><a className="link" href="#tasks">Open its tasks</a></p>
                </div>
                <p className="plist-h">Projects <a className="link" href="#projects">See all 15</a></p>
                <ul className="plist">
                  <li>{ON_TRACK}Garden path lighting<span>2 Oct</span></li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={v({ color: "var(--lp-p-warning)" })}><circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M8 3.25a4.75 4.75 0 0 0 0 9.5Z" fill="currentColor" /></svg>Mara &amp; Finn&apos;s wedding<span><em>At risk</em> · <em className="r">2 late</em> · 3 Oct</span></li>
                  <li>{ON_TRACK}Website photo shoot<span>8 Oct</span></li>
                  <li><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" style={v({ color: "var(--lp-p-danger-text)" })}><circle cx="8" cy="8" r="7" fill="currentColor" /><path d="m5.8 5.8 4.4 4.4m0-4.4-4.4 4.4" stroke="var(--lp-p-canvas)" strokeWidth="1.5" strokeLinecap="round" /></svg>Winter season launch<span><em className="r">Off track · 4 late</em> · 12 Oct</span></li>
                  <li>{ON_TRACK}Staff rota and training<span>16 Oct</span></li>
                </ul>
              </aside>
              <p className="home-foot"><span>A sample. Nothing here is saved or sent.</span></p>
            </div>
            <div className="win-more"><button type="button" id="win-more" aria-expanded="false" aria-controls="home">Show the rest of the sample</button></div>
          </div>
        </div>
      </div>
      {/* Outside the sample's wrapper: a fixed bar must not sit inside anything that moves. */}
      <div className="toast" id="toast"><span id="toast-t"></span><button type="button" id="undo" aria-keyshortcuts="Control+Z">Undo <kbd aria-hidden="true">Ctrl Z</kbd></button></div>
    </section>
  );
}
