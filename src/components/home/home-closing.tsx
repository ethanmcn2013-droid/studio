import { HomeWaitlist } from "./home-waitlist";
import { v } from "./style-vars";

/** Plain words, who it is for, the venue card and the waitlist close. */
export function HomeClosing() {
  return (
    <>
      <section className="sec words" id="words" aria-labelledby="h-words">
        <div className="wrap">
          <p className="mono kicker lp-reveal">Plain words</p>
          <h2 id="h-words" className="lp-reveal" style={v({ "--lp-i": 1, marginTop: "20px" })}>Words you will not find here.</h2>
          <p className="sub lp-reveal" style={v({ "--lp-i": 2, marginTop: "22px" })}>Most tools for running work were made by software companies for software companies, and the vocabulary came along. We left it out.</p>
          <ul className="struck lp-reveal" aria-label="Software words we do not use">
            <li style={v({ "--lp-i": 0 })}><del>sprint</del></li>
            <li style={v({ "--lp-i": 1 })}><del>epic</del></li>
            <li style={v({ "--lp-i": 2 })}><del>backlog</del></li>
            <li style={v({ "--lp-i": 3 })}><del>stakeholder</del></li>
            <li style={v({ "--lp-i": 4 })}><del>Kanban</del></li>
            <li style={v({ "--lp-i": 5 })}><del>burndown</del></li>
            <li style={v({ "--lp-i": 6 })}><del>velocity</del></li>
            <li style={v({ "--lp-i": 7 })}><del>story points</del></li>
            <li style={v({ "--lp-i": 8 })}><del>workflow</del></li>
            <li style={v({ "--lp-i": 9 })}><del>dashboard</del></li>
            <li style={v({ "--lp-i": 10 })}><del>swimlane</del></li>
            <li style={v({ "--lp-i": 11 })}><del>deliverable</del></li>
            <li style={v({ "--lp-i": 12 })}><del>resource allocation</del></li>
            <li style={v({ "--lp-i": 13 })}><del>OKR</del></li>
          </ul>
          <p className="plainly lp-reveal">You will find <b>late</b>, <b>waiting</b>, <b>today</b> and <b>done</b>.</p>
        </div>
      </section>

      {/* 11 Who it is for */}
      <section className="sec who" aria-labelledby="h-who">
        <div className="wrap">
          <p className="mono kicker lp-reveal">Who it is for</p>
          <h2 id="h-who" className="vh">Who Signal Studio is for</h2>
          <p className="who-say lp-reveal" style={v({ "--lp-i": 1 })}><b>The person the work runs through.</b> You run a venue. You plan weddings. You have three building jobs on and one van. You teach, and the school play is yours. You have a phone, a laptop and an inbox. <b>You do not have a project manager, and you do not want to become one.</b></p>
          <ul className="plain">
            <li className="lp-reveal"><h3>Plain English</h3><p>“Waiting on Mara.” “Friday is 1h over.” Every screen reads like a note from a colleague.</p></li>
            <li className="lp-reveal" style={v({ "--lp-i": 1 })}><h3>Open it and start</h3><p>It opens on what needs you today, not on a blank page asking you to describe your business.</p></li>
            <li className="lp-reveal" style={v({ "--lp-i": 2 })}><h3>One place</h3><p>Tasks, dates, files and people live together. Ask a question and it reads your files for the answer.</p></li>
          </ul>
        </div>
      </section>

      {/* 12 Venue Edition */}
      <section className="sec venue" id="venue" aria-labelledby="h-venue">
        <div className="wrap">
          <div className="venue-card lp-reveal">
            <div className="venue-top">
              <div style={v({ display: "grid", gap: "20px", justifyItems: "start" })}>
                <p className="pill">Private preview</p>
                <h2 id="h-venue">For venues and events. <span>In private preview with wedding venues.</span></h2>
              </div>
              <div className="side">
                <p className="sub">Every wedding, supper club and open day the venue is running, on one page. You see which day is at risk before the couple does.</p>
                <a className="btn btn-ghost" href="#join">Join the waitlist <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
                <p className="venue-note">One waitlist for everyone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13 Close */}
      <section className="close" id="join" aria-labelledby="h-close">
        <div className="wrap">
          <div className="rings" id="rings" aria-hidden="true"><i></i><i></i></div>
          <p className="mono kicker lp-reveal">Launching January 2027</p>
          <h2 id="h-close" className="lp-reveal" style={v({ "--lp-i": 1 })}>Start your Friday with five things, <em>not</em> fifty.</h2>
          <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>Access opens in stages. We will write to you when your turn comes.</p>
          <HomeWaitlist />
        </div>
      </section>
    </>
  );
}
