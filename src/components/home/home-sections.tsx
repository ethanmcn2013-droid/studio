import { Shot } from "./home-shot";
import { v } from "./style-vars";

/** Projects, Timeline, Files and Analytics: each a plate holding the product at one to one. */
export function HomeSections() {
  return (
    <>
      <section className="sec" id="projects" aria-labelledby="h-projects">
        <div className="wrap duo">
          <div className="sec-head">
            <div>
              <p className="mono kicker lp-reveal">Projects</p>
              <h2 id="h-projects" className="lp-reveal" style={v({ "--lp-i": 1 })}>Fifteen things on at once. One page.</h2>
            </div>
            <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>Friday is one day. The venue also has a wedding, a supper club, a roof repair and twelve more on the go. Each one says how it is doing in plain words: on track, at risk, off track.</p>
          </div>
          <div className="plate-wrap lp-reveal">
            <div className="plate-bar">
              <div className="tabs" role="group" aria-label="Projects views" data-for="pl-projects">
                <button type="button" aria-pressed="true">Covers</button><button type="button" aria-pressed="false">Ledger</button><button type="button" aria-pressed="false">One project</button>
              </div>
              <p data-cap="pl-projects" aria-live="polite">A cover for every project: its date, who is on it and how far along it is.</p>
            </div>
            <div className="plate d-only" id="pl-projects" data-tabs="" data-caps="A cover for every project: its date, who is on it and how far along it is.|The same projects as rows, for when you want to compare them.|Open one and it says what is yours, what is late and what the team said last.">
              <figure className="shot on" data-fit="" data-x="252" data-y="60" data-r="1.6" data-minx="249"><Shot name="projects-desk" alt="Projects as covers. 15 active projects, 2 off track, 2 at risk, 10 on track. Mara and Finn's wedding: in 8 days, 23 of 44 done, 2 late, at risk." /></figure>
              <figure className="shot stack" data-fit="" data-x="252" data-y="60" data-r="1.6" data-minx="249"><Shot name="ledger-desk" alt="Projects as a ledger: each project in a row with its health, open tasks, tasks done, next milestone, date and lead." /></figure>
              <figure className="shot stack" data-fit="" data-x="252" data-y="60" data-r="1.6" data-minx="249"><Shot name="project-home-desk" alt="One project, Mara and Finn's wedding: at risk, in 8 days, 23 of 44 tasks done, 2 late, with the team's latest updates." /></figure>
            </div>
            <div className="plate m-only" id="pl-projects-m" data-tabs="" data-follow="pl-projects">
              <figure className="shot on" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 44, "--lp-w": 390, "--lp-h": 620 })}><Shot name="projects-phone" alt="Projects as covers on a phone. 15 active projects. Garden path lighting in 7 days. Mara and Finn's wedding in 8 days, at risk." /></figure>
              <figure className="shot stack" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 44, "--lp-w": 390, "--lp-h": 620 })}><Shot name="ledger-phone" alt="Projects as a ledger on a phone: each project with its health, date and tasks done." /></figure>
              <figure className="shot stack" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 44, "--lp-w": 390, "--lp-h": 620 })}><Shot name="project-home-phone" alt="One project on a phone, Mara and Finn's wedding: at risk, in 8 days, 23 of 44 tasks done." /></figure>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Timeline */}
      <section className="sec" id="timeline" aria-labelledby="h-timeline">
        <div className="wrap duo">
          <div className="sec-head">
            <div>
              <p className="mono kicker lp-reveal">Timeline</p>
              <h2 id="h-timeline" className="lp-reveal" style={v({ "--lp-i": 1 })}>The couple gets their own timeline.</h2>
            </div>
            <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>Mara and Finn see the milestones against the dates: what is done, what is next and how many days are left. It is the same plan the venue works from, on a page made for them.</p>
          </div>
          <div className="plate-wrap lp-reveal">
            <div className="plate fade d-only" style={v({ maxWidth: "1140px" })}>
              <figure className="shot" data-fit="" data-x="288" data-y="176" data-r="1.42" data-sh="1000" data-minx="258"><Shot name="a-timeline-desk" alt="A shared wedding timeline for Mara and Finn. 8 days until the wedding day, Saturday 3 October 2026. 3 of 8 complete. Venue booked, invitations out and RSVPs close are done. Today, Fri 25 Sep: the next milestone is the menu tasting." /></figure>
            </div>
            <div className="plate fade m-only">
              <figure className="shot" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 132, "--lp-w": 390, "--lp-h": 770 })}><Shot name="a-timeline-phone" alt="The shared wedding timeline on a phone. Mara and Finn, 8 days until the wedding day, Saturday 3 October 2026. 3 of 8 complete. Today: the next milestone is the menu tasting." /></figure>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Files */}
      <section className="sec" id="files" aria-labelledby="h-files">
        <div className="wrap split">
          <div className="txt">
            <p className="mono kicker lp-reveal">Files</p>
            <h2 id="h-files" className="lp-reveal" style={v({ "--lp-i": 1 })}>Ask your files a question.</h2>
            <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>Every quote, plan and brochure sits with the project it belongs to. You do not hunt through folders. You ask.</p>
            <p className="quote lp-reveal" style={v({ "--lp-i": 3 })}><b>“Which seating plan did Mara approve?”</b><br />Seating plan v3, on Mon 21 Sep: 118 guests at 15 tables. The answer arrives with the sentence it was read from and the page to open.</p>
          </div>
          <div className="lp-reveal">
            <div className="plate d-only">
              <figure className="shot" data-fit="" data-x="268" data-y="138" data-r="1.36" data-s="0.94" data-minx="249"><Shot name="files-desk" alt="Files answering which seating plan did Mara approve: Seating plan v3, on 21 Sep, 118 guests at 15 tables. v4 has been with Mara since Thu 24 Sep. The quoted line: Approved by Mara, 21 Sep." /></figure>
            </div>
            <div className="plate m-only">
              <figure className="shot" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 128, "--lp-w": 390, "--lp-h": 590 })}><Shot name="files-phone" alt="Files on a phone, answering the question: Seating plan v3, on 21 Sep, 118 guests at 15 tables. v4 has been with Mara since Thu 24 Sep." /></figure>
            </div>
          </div>
        </div>
      </section>

      {/* 8 Analytics */}
      <section className="sec" id="analytics" aria-labelledby="h-analytics">
        <div className="wrap duo">
          <div className="sec-head">
            <div>
              <p className="mono kicker lp-reveal">Analytics</p>
              <h2 id="h-analytics" className="lp-reveal" style={v({ "--lp-i": 1 })}>Charts that end in a sentence.</h2>
            </div>
            <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>Every project drawn the same way, so you can compare them at a glance. Or ask a question and read the answer first, with the chart behind it.</p>
          </div>
          <div className="plate-wrap lp-reveal">
            <div className="plate-bar">
              <div className="tabs" role="group" aria-label="Analytics views" data-for="pl-analytics">
                <button type="button" aria-pressed="true">Every project</button><button type="button" aria-pressed="false">Ask a question</button>
              </div>
              <p data-cap="pl-analytics" aria-live="polite">Tasks finished each week, and whether the date still holds.</p>
            </div>
            <div className="plate d-only" id="pl-analytics" data-tabs="" data-caps="Tasks finished each week, and whether the date still holds.|“Are we on track for the wedding?” Only just: done by Fri 2 Oct, 1 day to spare.">
              <figure className="shot on" data-fit="" data-x="252" data-y="60" data-r="1.6" data-minx="249"><Shot name="analytics-wall-desk" alt="Analytics for all projects: one card each, with a chart of tasks finished each week and a line saying when the work is likely done. Mara and Finn's wedding: at risk, likely done Fri 2 Oct, 1 day to spare." /></figure>
              <figure className="shot stack" data-fit="" data-x="252" data-y="112" data-r="1.6" data-minx="249"><Shot name="analytics-ask-desk" alt="Analytics answering: are we on track for the wedding, Sat 3 Oct? Only just. 17 tasks are due by the wedding, done by Fri 2 Oct at the current pace, 1 day to spare. A line chart shows open tasks falling to zero on 2 Oct." /></figure>
            </div>
            <div className="plate m-only" id="pl-analytics-m" data-tabs="" data-follow="pl-analytics">
              <figure className="shot on" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 60, "--lp-w": 390, "--lp-h": 640 })}><Shot name="analytics-wall-phone" alt="Analytics on a phone: every project with its health, days to go and a small chart of tasks finished each week." /></figure>
              <figure className="shot stack" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 204, "--lp-w": 390, "--lp-h": 640 })}><Shot name="analytics-ask-phone" alt="Analytics on a phone answering: are we on track for the wedding? Only just. Done by Fri 2 Oct, 1 day to spare, with the chart below." /></figure>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
