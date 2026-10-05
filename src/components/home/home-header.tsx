import Link from "next/link";

const SECTIONS = [
  ["projects", "Projects"],
  ["tasks", "Tasks"],
  ["timeline", "Timeline"],
  ["files", "Files"],
  ["analytics", "Analytics"],
  ["whiteboard", "Whiteboard"],
] as const;

/**
 * The landing header: the mark, the six section links in the page's own
 * order, the theme switch and the one filled button. Pricing and About ride
 * along quietly, after the section links on wide screens and at the foot of
 * the phone menu. On a phone the theme switch lives in the menu and the
 * button waits until the hero's own has scrolled away.
 */
export function HomeHeader({ page = "home" }: { page?: "home" | "about" }) {
  const home = page === "home";
  const anchor = (id: string) => `${home ? "" : "/"}#${id}`;
  return (
    <header className="nav" id="nav">
      <div className="wrap">
        <a className="brand" href={home ? "#top" : "/"} aria-label="Signal Studio, home"><svg className="mark" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle className="ring" cx="12" cy="12" r="10.5" /><circle className="dot" cx="12" cy="12" r="4.7" /></svg><span>signal studio</span></a>
        <nav className="nav-links" aria-label="Main" id="navlinks">
          <a href={anchor("projects")}>Projects</a><a href={anchor("tasks")}>Tasks</a><a href={anchor("timeline")}>Timeline</a><a href={anchor("files")}>Files</a><a href={anchor("analytics")}>Analytics</a><a href={anchor("whiteboard")}>Whiteboard</a>
          <span className="nav-quiet"><Link href="/pricing" prefetch={false}>Pricing</Link><Link href="/about" prefetch={false} aria-current={!home ? "page" : undefined}>About</Link></span>
          <span className="nav-marker" id="nav-marker" aria-hidden="true"></span>
        </nav>
        <button className="theme" id="theme" type="button" data-theme-toggle="" aria-label="Switch to light theme">
          <svg className="moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
          <svg className="sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
        </button>
        <a className="btn btn-primary btn-sm" href={anchor("join")}>Join the waitlist</a>
        <details className="menu">
          <summary aria-label="Menu">
            <svg className="bars" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            <svg className="x" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </summary>
          <nav className="menu-panel" aria-label="Main, compact">
            {SECTIONS.map(([id, label]) => (
              <a key={id} href={anchor(id)}>{label}</a>
            ))}
            <span className="menu-quiet"><Link href="/pricing" prefetch={false}>Pricing</Link><Link href="/about" prefetch={false} aria-current={!home ? "page" : undefined}>About</Link></span>
            <button className="menu-theme" type="button" data-theme-toggle="">Switch to light theme</button>
          </nav>
        </details>
      </div>
    </header>
  );
}
