/** Direction A · the closing sheet: who it is for, and the two doors. */
export function RevealClosing() {
  return (
    <section className="sheet who" aria-labelledby="who-h">
        <div className="inner rise">
          <div>
            <span className="kicker">Who it is for</span>
            <h2 id="who-h" className="title" style={{ marginTop: "18px" }}>Built for the 80%.</h2>
          </div>
          <div>
            <p className="lede">Most people with work to manage do not work in tech. They run venues, sites, classrooms and small studios. They were handed tools built for engineering teams and told to adapt.</p>
            <p className="lede">Signal Studio starts from the other end. Wedding venues are first, because a Saturday is the hardest calm day there is.</p>
            <div className="paths">
              <a className="path" href="/waitlist?source=home_closing&amp;campaign=pre_access_waitlist&amp;artifact=closing_cta&amp;touch=site"><div><h3>Join the waitlist</h3><p>Access opens in stages. We will write to you when your turn comes.</p></div><span className="go" aria-hidden="true">→</span></a>
              <a className="path" href="/venues"><div><h3>For venues and events</h3><p>The Venue Edition, in private preview now.</p></div><span className="go" aria-hidden="true">→</span></a>
            </div>
          </div>
        </div>
      </section>
  );
}
