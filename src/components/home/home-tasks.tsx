import { Shot } from "./home-shot";
import { v } from "./style-vars";

/**
 * Tasks, one Friday, in three moments: Home says what has gone quiet, the
 * calendar makes Friday fit, and the board shows the same task once more.
 * Each moment is its words and its capture, so the section reads top to
 * bottom with no script. On a wide, tall screen the three share one pinned
 * stage and the scroll position chooses which is showing.
 */
export function HomeTasks() {
  return (
    <section className="sec friday" id="tasks" aria-labelledby="h-friday">
      <div className="wrap">
        <div className="friday-head">
          <p className="mono kicker lp-reveal">Tasks · One Friday</p>
          <h2 id="h-friday" className="lp-reveal" style={v({ "--lp-i": 1 })}>One Friday at The Orchard. It tells Orla what needs her, and why.</h2>
          <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>Orla owns the venue. Mara&nbsp;and&nbsp;Finn marry in 8 days. Everything below is the real product, with made-up names.</p>
        </div>

        <div className="story" id="story">
          <div className="pin">
            <div className="slate">
              <div className="tabs" id="tabs" role="group" aria-label="Jump to a moment in the day">
                <button type="button" aria-current="true">Home</button><button type="button">Calendar</button><button type="button">Board</button>
              </div>
              <p className="mono">A Friday · The Orchard, Kinsale</p>
            </div>
            <ol className="steps" id="steps">
              <li className="step on" data-step="0" data-name="Home">
                <div className="step-in">
                  <div>
                    <p className="mono"><b>01</b> · Home</p>
                    <h3>It says what has gone quiet.</h3>
                  </div>
                  <p><b>Chase florist deposit has waited 7 days on Fern and Furrow.</b> One line in plain English, with the next move beside it: nudge Fern and Furrow.</p>
                </div>
                {/* A detail of Home, not Home again: the visitor has just used the whole screen above. */}
                <Shot name="home-detail-desk" className="window fade-r" fade spots={[{ x: 267, y: 133, w: 636, h: 30 }]} alt="A detail of Home: Good morning, Orla. 5 things need you today. Chase florist deposit has waited 7 days on Fern and Furrow. Nudge Fern and Furrow." />
                <Shot name="home-tablet" className="window" fade spots={[{ x: 264, y: 136, w: 398, h: 44 }]} alt="Home on a tablet: Good morning, Orla. Chase florist deposit has waited 7 days on Fern and Furrow." />
                <Shot name="home-phone" className="window" spots={[{ x: 8, y: 176, w: 374, h: 46 }]} alt="The nudge on Home: Chase florist deposit has waited 7 days on Fern and Furrow. Nudge Fern and Furrow. 3 more stuck." />
              </li>
              <li className="step" data-step="1" data-name="the calendar">
                <div className="step-in">
                  <div>
                    <p className="mono"><b>02</b> · Calendar</p>
                    <h3>Make Friday fit.</h3>
                  </div>
                  <p><b>Friday is <abbr title="1 hour">1h</abbr> over.</b> The calendar says so before the day does. It offers to make the day fit.</p>
                </div>
                <Shot name="calendar-desk" className="window" fade spots={[{ x: 815, y: 179, w: 204, h: 27 }, { x: 1164, y: 224, w: 136, h: 62 }]} alt="The calendar for 21 to 27 Sep. Friday is 1 hour over. Make Friday fit." />
                <Shot name="calendar-tablet" className="window" fade spots={[{ x: 563, y: 241, w: 210, h: 24 }, { x: 789, y: 312, w: 128, h: 64 }]} alt="The calendar on a tablet. Friday is 1 hour over. Make Friday fit." />
                <Shot name="calendar-phone" className="window" fade spots={[{ x: 110, y: 229, w: 120, h: 28 }]} alt="The calendar on a phone: 21 to 27 Sep, Make Friday fit. Friday 25 Sep is over by 1 hour." />
              </li>
              <li className="step" data-step="2" data-name="the board">
                <div className="step-in">
                  <div>
                    <p className="mono"><b>03</b> · Board</p>
                    <h3>The same task, wherever you look.</h3>
                  </div>
                  <p>On the board it sits in Waiting, with the name of who it is waiting on. <b>You write a task once.</b> The board, the list and the calendar are the same task, so there is nothing to keep in step.</p>
                </div>
                <Shot name="a-board-desk" className="window" fade spots={[{ x: 825, y: 565, w: 244, h: 94 }]} alt="The board. In the Waiting column: Chase florist deposit, 7 days, waiting on Fern and Furrow." />
                <Shot name="board-tablet" className="window fade-r" fade spots={[{ x: 735, y: 486, w: 204, h: 140 }]} alt="The board on a tablet. In the Waiting column: Chase florist deposit, 7 days, waiting on Fern and Furrow." />
                <Shot name="board-task-phone" className="window" spots={[{ x: 24, y: 290, w: 322, h: 102 }]} alt="The board on a phone, Waiting column: Chase florist deposit, 7 days, waiting on Fern and Furrow." />
              </li>
            </ol>
            <div className="progress" aria-hidden="true"><i id="bar"></i></div>
          </div>
        </div>
      </div>
    </section>
  );
}
