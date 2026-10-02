import Link from "next/link";
import { getConsumerPricingPresentation } from "@/lib/commercial-terms";
import { COMPANY_META } from "@/lib/hq/company";
import { HomeWaitlist } from "./home-waitlist";
import { v } from "./style-vars";

const ARROW = (
  <svg className="along" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const HOURGLASS = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.5 2h7M4.5 14h7M5 2c0 3 6 3.5 6 6s-6 3-6 6M11 2c0 3-6 3.5-6 6s6 3 6 6" /></svg>
);

/** The words struck through, and why: none of them is on this page or in any capture. */
export const STRUCK_WORDS = [
  "sprint",
  "epic",
  "backlog",
  "stakeholder",
  "Kanban",
  "burndown",
  "velocity",
  "story points",
  "workflow",
  "dashboard",
  "swimlane",
  "deliverable",
  "resource allocation",
  "OKR",
] as const;

/** Who it is for: it speaks to everyone the headline names. */
export function HomeWho() {
  return (
    <section className="sec who" id="who" aria-labelledby="h-who">
      <div className="wrap">
        <p className="mono kicker lp-reveal">Who it is for</p>
        <h2 id="h-who" className="vh">Who Signal Studio is for</h2>
        <p className="statement lp-reveal" style={v({ "--lp-i": 1 })}><b>The person the work runs through.</b> You run a venue. You plan weddings. You have three building jobs on and one van. You teach, and the school play is yours. You have a phone, a laptop and an inbox. <b>You do not have a project manager, and you do not want to become one.</b></p>
        <ul className="plain">
          <li className="lp-reveal"><h3>Plain English</h3><p>“Waiting on Mara.” “Friday is <abbr title="1 hour">1h</abbr> over.” Every screen reads like a note from a colleague.</p></li>
          <li className="lp-reveal" style={v({ "--lp-i": 1 })}><h3>Open it and start</h3><p>It opens on what needs you today, not on a blank page asking you to describe your business.</p></li>
          <li className="lp-reveal" style={v({ "--lp-i": 2 })}><h3>One place</h3><p>Tasks, dates, files and people live together. Ask a question and it reads your files for the answer.</p></li>
        </ul>
      </div>
    </section>
  );
}

/** The same first line on Home, for the three other people the headline names. Straight after the sample, so a builder, a teacher or a designer sees themselves before the page goes on about a venue. */
export function HomeYours() {
  return (
    <section className="sec yours" id="yours" aria-labelledby="h-yours">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <p className="mono kicker lp-reveal">Not a venue</p>
            <h2 id="h-yours" className="lp-reveal" style={v({ "--lp-i": 1 })}>The same thing in your words.</h2>
          </div>
          <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>The Orchard is the sample. For a building crew, a school or a studio, the first line on Home would read like this.</p>
        </div>
        <ul className="yours-list">
          <li className="window lp-reveal"><span className="mono">A building crew</span><p>{HOURGLASS}<span><b>Slates for the Kavanagh job</b> have waited 4 days on the supplier.</span></p></li>
          <li className="window lp-reveal" style={v({ "--lp-i": 1 })}><span className="mono">A school</span><p>{HOURGLASS}<span><b>Costumes for the school play</b> are due Friday. 3 not started.</span></p></li>
          <li className="window lp-reveal" style={v({ "--lp-i": 2 })}><span className="mono">A studio</span><p>{HOURGLASS}<span><b>Logo round two</b> has been with the client since Tuesday.</span></p></li>
        </ul>
      </div>
    </section>
  );
}

/** Plain words: the software vocabulary the product leaves out. */
export function HomeWords() {
  return (
    <section className="sec words" id="words" aria-labelledby="h-words">
      <div className="wrap">
        <p className="mono kicker lp-reveal">Plain words</p>
        <h2 id="h-words" className="lp-reveal" style={v({ "--lp-i": 1 })}>Words you will not find here.</h2>
        <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>Most tools for running work were made by software companies for software companies, and the vocabulary came along. We left it out.</p>
        <ul className="struck lp-reveal" aria-label="Software words we do not use">
          {STRUCK_WORDS.map((word, index) => (
            <li key={word} style={v({ "--lp-i": index })}><del>{word}</del></li>
          ))}
        </ul>
        <p className="statement lp-reveal">You will find <b>late</b>, <b>waiting</b>, <b>today</b> and <b>done</b>. <span>And a board and a calendar. They are just called that.</span></p>
      </div>
    </section>
  );
}

/** Venues: who is trying it now, and the two ways in. */
export function HomeVenue() {
  return (
    <section className="sec venue" id="venue" aria-labelledby="h-venue">
      <div className="wrap">
        <div className="venue-card lp-reveal">
          <div className="txt">
            <h2 id="h-venue">Wedding venues are trying it first.</h2>
            <p className="sub">In private preview with wedding venues, before it opens in January 2027.</p>
          </div>
          <div className="side">
            <a className="btn btn-ghost" href="mailto:hello@signalstudio.ie?subject=Trying%20Signal%20Studio%20at%20our%20venue">Run a venue? Ask to try it now {ARROW}</a>
            <p className="venue-note">Everyone else, <a className="tlink" href="#join">join the waitlist</a>.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The close: the form in full, with its optional question, and what joining gets you. */
export function HomeClose() {
  const pricing = getConsumerPricingPresentation();
  return (
    <section className="close" id="join" aria-labelledby="h-close">
      <div className="wrap">
        <p className="mono kicker lp-reveal">Launching January 2027</p>
        <h2 id="h-close" className="lp-reveal" style={v({ "--lp-i": 1 })}>Start your Friday with five things, <em>not</em> fifty.</h2>
        <HomeWaitlist variant="close" source="home_close" artifact="close_form" />
        <div className="wl-note lp-reveal" style={v({ "--lp-i": 3 })}>
          <p id="wl-note">Free to join. No card and no newsletter. One email when it is your turn, from January 2027. There is a free plan, and Pro is {pricing.plans.pro.price} a month.</p>
          <p className="wl-links"><Link className="tlink" href="/pricing" prefetch={false}>See pricing</Link><span aria-hidden="true"> · </span><Link className="tlink" href="/privacy" prefetch={false}>Privacy</Link></p>
          <p>{COMPANY_META.legalName} is registered in Ireland. Questions go to <a className="tlink" href="mailto:hello@signalstudio.ie">hello@signalstudio.ie</a>.</p>
        </div>
      </div>
    </section>
  );
}
