import Link from "next/link";

export function RevealHero() {
  return (
    <section
      className="reveal-hero reveal-hero-v2"
      aria-labelledby="home-title"
    >
      <div className="reveal-hero-v2-inner">
        <p className="reveal-hero-status">
          <span aria-hidden />
          Private preview
        </p>

        <h1 id="home-title" className="reveal-headline-v2">
          Project management for the{" "}
          <span className="reveal-headline-accent">80%</span> not in tech.
        </h1>

        <p className="reveal-lede-v2">
          Notes, tasks, timelines, and the signal that matters. One calm
          system for people with work to manage, not software to manage.
        </p>

        <div className="reveal-hero-actions">
          <a className="reveal-action reveal-action-primary" href="#system">
            See the system at work
            <span aria-hidden>↓</span>
          </a>
          <Link
            className="reveal-action reveal-action-secondary"
            href="/waitlist?source=home_hero&campaign=pre_access_waitlist&artifact=hero_cta&touch=site"
          >
            Join the waitlist
            <span aria-hidden>→</span>
          </Link>
        </div>

        <p className="reveal-sequence" aria-label="Notes to Tasks to Timeline to Signal">
          <span>Notes</span>
          <span aria-hidden>→</span>
          <span>Tasks</span>
          <span aria-hidden>→</span>
          <span>Timeline</span>
          <span aria-hidden>→</span>
          <span>Signal</span>
        </p>
      </div>
    </section>
  );
}
