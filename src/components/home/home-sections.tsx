import { Shot } from "./home-shot";
import { HomeWaitlist } from "./home-waitlist";
import { v } from "./style-vars";

/** Projects: every project the venue has on, three ways. */
export function HomeProjects() {
  return (
    <section className="sec" id="projects" aria-labelledby="h-projects">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="mono kicker lp-reveal">Projects</p>
            <h2 id="h-projects" className="lp-reveal" style={v({ "--lp-i": 1 })}>Fifteen things on at once. One page.</h2>
          </div>
          <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>The Orchard has a wedding, a supper club, a roof repair and twelve more on the go. Each one says how it is doing in plain words: on track, at risk, off track.</p>
        </div>
        <div className="sec-body lp-reveal">
          <div className="plate-bar">
            <div className="tabs" role="tablist" aria-label="Projects views" data-for="pl-projects">
              <button type="button" role="tab" id="tab-projects-0" aria-selected="true" aria-controls="pl-projects">Covers</button><button type="button" role="tab" id="tab-projects-1" aria-selected="false" aria-controls="pl-projects" tabIndex={-1}>List</button><button type="button" role="tab" id="tab-projects-2" aria-selected="false" aria-controls="pl-projects" tabIndex={-1}>One project</button>
            </div>
            <p className="cap" data-cap="pl-projects" aria-live="polite">A cover for every project: its date, who is on it and how far along it is.</p>
          </div>
          <div className="plate window" id="pl-projects" role="tabpanel" tabIndex={0} aria-labelledby="tab-projects-0" data-tabs="" data-caps="A cover for every project: its date, who is on it and how far along it is.|The same projects as rows, for when you want to compare them.|Open one and it says what is yours, what is late and what the team said last.">
            <Shot name="projects-desk" className="on" fade view={0} alt="Projects as covers. 15 active projects, 2 off track, 2 at risk, 10 on track. Mara and Finn's wedding: in 8 days, 23 of 44 done, 2 late, at risk." />
            <Shot name="ledger-desk" fade view={1} alt="Projects as a list: each project in a row with how it is doing, open tasks, tasks done, its next big date and who leads it." />
            <Shot name="project-home-desk" fade view={2} alt="One project, Mara and Finn's wedding: at risk, in 8 days, 23 of 44 tasks done, 2 late, with the team's latest updates." />
            <Shot name="projects-tablet" className="on" fade view={0} alt="Projects as covers on a tablet. 15 active projects. Mara and Finn's wedding: in 8 days, 23 of 44 done, 2 late, at risk." />
            <Shot name="ledger-tablet" fade view={1} alt="Projects as a list on a tablet: each project in a row with how it is doing, its date and tasks done." />
            <Shot name="project-home-tablet" fade view={2} alt="One project on a tablet, Mara and Finn's wedding: at risk, in 8 days, 23 of 44 tasks done, 2 late." />
            <Shot name="projects-phone" className="on" fade view={0} alt="Projects as covers on a phone. 15 active projects. Garden path lighting in 7 days." />
            <Shot name="ledger-phone" fade view={1} alt="Projects as a list on a phone: each project with how it is doing, its date and tasks done." />
            <Shot name="project-home-phone" fade view={2} alt="One project on a phone, Mara and Finn's wedding: at risk, in 8 days, 23 of 44 tasks done." />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Timeline: the page the couple sees. */
export function HomeTimeline() {
  return (
    <section className="sec" id="timeline" aria-labelledby="h-timeline">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="mono kicker lp-reveal">Timeline</p>
            <h2 id="h-timeline" className="lp-reveal" style={v({ "--lp-i": 1 })}>The couple gets their own timeline.</h2>
          </div>
          <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>Mara and Finn see the big dates: what is done, what is next and how many days are left. It is the same plan the venue works from, on a page made for them.</p>
        </div>
        <div className="sec-body lp-reveal">
          <div className="plate window">
            <Shot name="a-timeline-desk" fade alt="A shared wedding timeline for Mara and Finn. 8 days until the wedding day, Saturday 3 October 2026. 3 of 8 complete. Venue booked, invitations out and RSVPs close are done. Today, Fri 25 Sep: next is the menu tasting." />
            <Shot name="a-timeline-tablet" fade alt="The shared wedding timeline on a tablet. Mara and Finn, 8 days until the wedding day, Saturday 3 October 2026. 3 of 8 complete." />
            <Shot name="a-timeline-phone" fade alt="The shared wedding timeline on a phone. Mara and Finn, 8 days until the wedding day, Saturday 3 October 2026. 3 of 8 complete." />
          </div>
          <p className="cap">A builder&apos;s client sees the same for their extension. A parent sees it for the school play.</p>
        </div>
      </div>
    </section>
  );
}

/** Files: one question, answered, and the quiet prompt that follows it. */
export function HomeFiles() {
  return (
    <section className="sec" id="files" aria-labelledby="h-files">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="mono kicker lp-reveal">Files</p>
            <h2 id="h-files" className="lp-reveal" style={v({ "--lp-i": 1 })}>Ask your files a question.</h2>
          </div>
          <div className="stack">
            <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>Every quote, plan and brochure sits with the project it belongs to. You do not hunt through folders. You ask.</p>
            <p className="quote lp-reveal" style={v({ "--lp-i": 3 })}><b>“Which seating plan did Mara approve?”</b><br />Seating plan v3, on Mon 21 Sep: 118 guests at 15 tables. The answer arrives with the sentence it was read from and the page to open.</p>
          </div>
        </div>
        <div className="sec-body lp-reveal">
          <div className="plate window">
            <Shot name="files-desk" alt="Files answering which seating plan did Mara approve: Seating plan v3, on 21 Sep, 118 guests at 15 tables. v4 has been with Mara since Thu 24 Sep. The quoted line: Approved by Mara, 21 Sep." />
            <Shot name="files-tablet" alt="Files on a tablet, answering which seating plan did Mara approve: Seating plan v3, on 21 Sep, 118 guests at 15 tables." />
            <Shot name="files-phone" alt="Files on a phone, answering the question: Seating plan v3, on 21 Sep, 118 guests at 15 tables. v4 has been with Mara since Thu 24 Sep." />
          </div>
          <div className="prompt">
            <p><b>That is the idea.</b> Leave your email and we will write when you can try it.</p>
            <HomeWaitlist variant="prompt" id="files" source="home_files" artifact="files_prompt" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Analytics: the question first, then every project side by side. */
export function HomeAnalytics() {
  return (
    <section className="sec" id="analytics" aria-labelledby="h-analytics">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="mono kicker lp-reveal">Analytics</p>
            <h2 id="h-analytics" className="lp-reveal" style={v({ "--lp-i": 1 })}>Ask if you will make the date.</h2>
          </div>
          <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>It answers in a sentence first. The chart is there if you want it.</p>
        </div>
        <div className="sec-body lp-reveal">
          <div className="plate-bar">
            <div className="tabs" role="tablist" aria-label="Analytics views" data-for="pl-analytics">
              <button type="button" role="tab" id="tab-analytics-0" aria-selected="true" aria-controls="pl-analytics">Ask a question</button><button type="button" role="tab" id="tab-analytics-1" aria-selected="false" aria-controls="pl-analytics" tabIndex={-1}>Every project</button>
            </div>
            <p className="cap" data-cap="pl-analytics" aria-live="polite">“Are we on track for the wedding?” Only just: done by Fri 2 Oct, 1 day to spare.</p>
          </div>
          <div className="plate window" id="pl-analytics" role="tabpanel" tabIndex={0} aria-labelledby="tab-analytics-0" data-tabs="" data-caps="“Are we on track for the wedding?” Only just: done by Fri 2 Oct, 1 day to spare.|Tasks finished each week, and whether the date still holds.">
            <Shot name="analytics-ask-desk" className="on" view={0} alt="Analytics answering: are we on track for the wedding, Sat 3 Oct? Only just. 17 tasks are due by the wedding, done by Fri 2 Oct at the current pace, 1 day to spare. A line chart shows open tasks falling to zero on 2 Oct." />
            <Shot name="analytics-wall-desk" fade view={1} alt="Analytics for all projects: one card each, with a chart of tasks finished each week and a line saying when the work is likely done. Mara and Finn's wedding: at risk, likely done Fri 2 Oct, 1 day to spare." />
            <Shot name="analytics-ask-tablet" className="on" fade view={0} alt="Analytics on a tablet answering: are we on track for the wedding? Only just. Done by Fri 2 Oct, 1 day to spare." />
            <Shot name="analytics-wall-tablet" fade view={1} alt="Analytics on a tablet: a card for each project, with tasks finished each week and when the work is likely done." />
            <Shot name="analytics-ask-phone" className="on" fade view={0} alt="Analytics on a phone answering: are we on track for the wedding? Only just. Done by Fri 2 Oct, 1 day to spare." />
            <Shot name="analytics-wall-phone" fade view={1} alt="Analytics on a phone: every project with how it is doing, days to go and a small chart of tasks finished each week." />
          </div>
        </div>
      </div>
    </section>
  );
}
