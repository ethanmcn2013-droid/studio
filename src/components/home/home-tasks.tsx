import { Shot } from "./home-shot";
import { v } from "./style-vars";

/** Tasks, one Friday: the pinned story that follows one task through five views, then the same task once more. */
export function HomeTasks() {
  return (
    <>
      <section className="friday" id="tasks" aria-labelledby="h-friday">
        <div className="wrap">
          <div className="friday-head">
            <p className="mono kicker lp-reveal">Tasks · One Friday</p>
            <h2 id="h-friday" className="lp-reveal" style={v({ "--lp-i": 1 })}>Friday 25 September at The Orchard. Mara and Finn marry in 8 days.</h2>
            <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>Orla owns the venue. Follow one task through her morning: Chase florist deposit. Every screenshot from here on is the product, with sample content.</p>
          </div>

          <div className="story">
            <ol className="steps" id="steps">
              <li className="step on" data-step="0">
                <div className="step-in">
                <p className="mono"><b>01</b> · Home</p>
                <h3>It says what has gone quiet.</h3>
                <p><b>Chase florist deposit has waited 7 days on Fern and Furrow.</b> One line in plain English, with the next move beside it: nudge Fern and Furrow.</p>
                </div>
                <figure className="shot m-only" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 118, "--lp-w": 390, "--lp-h": 520 })}><Shot name="home-phone" alt="The nudge on Home: Chase florist deposit has waited 7 days on Fern and Furrow. Nudge Fern and Furrow. 3 more stuck." /><span className="spot dim" style={v({ "--lp-sx": 8, "--lp-sy": 176, "--lp-spw": 374, "--lp-sph": 46 })}></span></figure>
              </li>
              <li className="step" data-step="1">
                <div className="step-in">
                <p className="mono"><b>02</b> · Board</p>
                <h3>The same task, on the board.</h3>
                <p>It sits in Waiting, with the name of who it is waiting on. Nobody copied it there. <b>It is one task.</b></p>
                </div>
                <figure className="shot m-only" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 48, "--lp-w": 390, "--lp-h": 520 })}><Shot name="board-task-phone" alt="The board on a phone, Waiting column: Chase florist deposit, 7 days, waiting on Fern and Furrow." /><span className="spot dim" style={v({ "--lp-sx": 24, "--lp-sy": 290, "--lp-spw": 322, "--lp-sph": 102 })}></span></figure>
              </li>
              <li className="step" data-step="2">
                <div className="step-in">
                <p className="mono"><b>03</b> · List</p>
                <h3>And in the list, with its details.</h3>
                <p>Due Mon 28 Sep. With Aoife. High priority. The same task again, in rows you can sort and total.</p>
                </div>
                <figure className="shot m-only" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 268, "--lp-w": 390, "--lp-h": 520 })}><Shot name="list-task-phone" alt="The list on a phone: Chase florist deposit, due Mon, with Aoife." /><span className="spot dim" style={v({ "--lp-sx": 6, "--lp-sy": 491, "--lp-spw": 378, "--lp-sph": 68 })}></span></figure>
              </li>
              <li className="step" data-step="3">
                <div className="step-in">
                <p className="mono"><b>04</b> · Calendar</p>
                <h3>Make Friday fit.</h3>
                <p><b>Friday is 1h over.</b> The calendar says so before the day does. It offers to make the day fit.</p>
                </div>
                <figure className="shot m-only" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 222, "--lp-w": 390, "--lp-h": 520 })}><Shot name="calendar-phone" alt="The calendar on a phone: 21 to 27 Sep, Make Friday fit. Friday 25 Sep is over by 1 hour." /><span className="spot" style={v({ "--lp-sx": 110, "--lp-sy": 229, "--lp-spw": 120, "--lp-sph": 28 })}></span></figure>
              </li>
              <li className="step" data-step="4">
                <div className="step-in">
                <p className="mono"><b>05</b> · Overview</p>
                <h3>8 days to the wedding. 2 tasks late.</h3>
                <p>Every task for Mara and Finn, laid out on the road to Sat 3 Oct. At this week&apos;s pace the work is done Fri 2 Oct, <b>1 day to spare.</b></p>
                </div>
                <figure className="shot m-only" style={v({ "--lp-sw": 390, "--lp-x": 0, "--lp-y": 66, "--lp-w": 390, "--lp-h": 520 })}><Shot name="overview-phone" alt="Overview on a phone: At risk. 8 days to Mara and Finn's wedding. 21 open, 2 late." /></figure>
              </li>
            </ol>

            <div className="pin">
              <div className="pin-inner">
                <div className="slate">
                  <p className="mono">Fri 25 Sep · The Orchard, Kinsale</p>
                  <div className="tabs" id="tabs" role="group" aria-label="Jump to a moment in the day">
                    <button type="button" aria-current="true">Home</button><button type="button">Board</button><button type="button">List</button><button type="button">Calendar</button><button type="button">Overview</button>
                  </div>
                </div>
                <div className="stage" id="stage">
                  <div className="shot layer on" data-fit="" data-x="262" data-y="70" data-r="1.36" data-s="0.97" data-minx="249"><Shot name="home-desk" alt="Home: Good morning, Orla. 5 things need you today. Chase florist deposit has waited 7 days on Fern and Furrow." /><span className="spot dim" style={v({ "--lp-sx": 267, "--lp-sy": 133, "--lp-spw": 636, "--lp-sph": 30 })}></span></div>
                  <div className="shot layer" data-fit="" data-x="530" data-y="212" data-r="1.36" data-s="0.97" data-minx="249"><Shot name="a-board-desk" alt="The board. In the Waiting column: Chase florist deposit, 7 days, waiting on Fern and Furrow." /><span className="spot dim" style={v({ "--lp-sx": 820, "--lp-sy": 563, "--lp-spw": 242, "--lp-sph": 96 })}></span></div>
                  <div className="shot layer" data-fit="" data-x="249" data-y="170" data-r="1.36" data-s="0.97" data-minx="249"><Shot name="a-list-desk" alt="The list. Chase florist deposit, due Mon 28 Sep, owner Aoife, high priority." /><span className="spot dim" data-clip="" style={v({ "--lp-sx": 251, "--lp-sy": 509, "--lp-spw": 1180, "--lp-sph": 36 })}></span></div>
                  <div className="shot layer" data-fit="" data-ax="r" data-y="160" data-r="1.36" data-s="0.97" data-minx="249"><Shot name="calendar-desk" alt="The calendar for 21 to 27 Sep. Friday is 1 hour over. Make Friday fit." /><span className="spot" style={v({ "--lp-sx": 815, "--lp-sy": 179, "--lp-spw": 204, "--lp-sph": 27 })}></span><span className="spot" style={v({ "--lp-sx": 1158, "--lp-sy": 224, "--lp-spw": 134, "--lp-sph": 62 })}></span></div>
                  <div className="shot layer" data-fit="" data-x="262" data-y="66" data-r="1.36" data-s="0.97" data-minx="249"><Shot name="a-overview-desk" alt="Overview for Mara and Finn's wedding. At risk. 8 days to go, 21 open, 2 late. Every task laid out up to Sat 3 Oct." /><span className="spot" style={v({ "--lp-sx": 268, "--lp-sy": 112, "--lp-spw": 402, "--lp-sph": 30 })}></span></div>
                </div>
                <div className="progress" aria-hidden="true"><i id="bar"></i></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 One task */}
      <section className="one" aria-labelledby="h-one">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <p className="mono kicker lp-reveal">One product</p>
              <h2 id="h-one" className="lp-reveal" style={v({ "--lp-i": 1 })}>One task. Written once. Seen everywhere.</h2>
            </div>
            <p className="sub lp-reveal" style={v({ "--lp-i": 2 })}>You do not keep four lists in step. You just followed Chase florist deposit from Home to the board to the list. Here it is once more, on the Overview. Change it in one place and it has changed in all of them.</p>
          </div>
          <div className="thread">
            <div className="place lp-reveal">
              <p className="mono node"><span>Overview</span><i></i></p>
              <figure className="shot" data-fit="" data-cx="930" data-cy="543" data-r="2.6" data-minx="249"><Shot name="a-overview-desk" alt="Overview: Chase florist deposit as a bar in the Suppliers row, before the wedding on Sat 3 Oct." /><span className="spot dim" style={v({ "--lp-sx": 816, "--lp-sy": 530, "--lp-spw": 192, "--lp-sph": 26 })}></span></figure>
              <p><b>It holds its place in the run-up.</b> A bar in the Suppliers row, on the road to Sat 3 Oct.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
