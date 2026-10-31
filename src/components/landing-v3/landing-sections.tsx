"use client";

/**
 * Who it's for. A landing section rebranded one-to-one from a reference clip and taken through the
 * elevation lab (signal-studio-workspace docs/design/labs/landing-sections-2026-10, master.html is
 * the source of truth for geometry, copy and motion). The In practice section that sat with it was
 * removed at the founder's request on 31 October 2026.
 *
 * The markup renders complete on the server; one effect plays the diagonal wave once, on first
 * sight of the grid.
 */
import React, { useEffect, useRef } from "react";
import "./landing-sections.css";

const ICON: Record<string, string> = {
  venue: '<path d="M4 20V10l8-6 8 6v10"/><path d="M9 20v-5a3 3 0 0 1 6 0v5"/>',
  planner: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
  trades: '<path d="M14.5 6.5a4 4 0 0 0-5.3 5.3L4 17l3 3 5.2-5.2a4 4 0 0 0 5.3-5.3l-2.5 2.5-2.5-.5-.5-2.5z"/>',
  crew: '<path d="M4 17h16M6 17v-3a6 6 0 0 1 12 0v3M10 8V6h4v2"/><path d="M4 17v2h16v-2"/>',
  design: '<path d="M12 3l6 7-6 11-6-11z"/><circle cx="12" cy="11" r="1.5"/>',
  photo: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  teach: '<path d="M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z"/>',
  study: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c2 2 10 2 12 0v-5"/>',
  food: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2 6 0 8v10"/>',
  clinic: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>',
  shop: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
  club: '<path d="M6 21V4M6 4h11l-2 4 2 4H6"/>',
};

const PEOPLE: readonly (readonly [icon: string, name: string, sub: string])[] = [
  ["venue", "Wedding venues", "Every couple’s plan"], ["planner", "Event planners", "The run-sheet"],
  ["trades", "Trades", "Jobs and deposits"], ["crew", "Building crews", "Who is on site"],
  ["design", "Designers", "Every client, one view"], ["photo", "Photographers", "Shoots and deliveries"],
  ["teach", "Teachers", "Staff and parents"], ["study", "Students", "Thesis and deadlines"],
  ["food", "Restaurants", "The week’s prep"], ["clinic", "Clinics", "Rotas and follow-ups"],
  ["shop", "Shops", "Orders and suppliers"], ["club", "Club coaches", "Fixtures and kit"],
];

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="lsx-chip"><span className="ring" aria-hidden="true"><i /></span>{children}</span>
);

export function WhoItsFor() {
  const grid = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = grid.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tiles = Array.from(el.children) as HTMLElement[];
    const smooth = (x: number) => x * x * (3 - 2 * x);
    /* The source's wave, to its measured timing: +0.17s per column, row two one column behind,
       each flip 0.6s (0.15 up, 0.15 held, 0.3 down). It runs once, on first sight. */
    const wave = (t: number) => {
      const n = getComputedStyle(el).gridTemplateColumns.split(" ").length;
      let live = false;
      tiles.forEach((tile, i) => {
        const p = t - 0.17 * ((i % n) + Math.floor(i / n));
        let lit = 0;
        if (p > 0 && p < 0.15) lit = smooth(p / 0.15);
        else if (p >= 0.15 && p < 0.3) lit = 1;
        else if (p >= 0.3 && p < 0.6) lit = 1 - smooth((p - 0.3) / 0.3);
        if (p < 0.6) live = true;
        if (lit > 0) tile.style.setProperty("--lit", lit.toFixed(3)); else tile.style.removeProperty("--lit");
      });
      return live;
    };
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let at: number | null = null;
      el.classList.add("waving");
      const step = (now: number) => {
        if (at === null) at = now;
        if (wave((now - at) / 1000 - 0.3) || now - at < 600) raf = requestAnimationFrame(step);
        else { el.classList.remove("waving"); raf = 0; }
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section className="sec lsx" id="who" aria-labelledby="lsx-who-title">
      <div className="wrap"><div className="lsx-c">
        <div className="lsx-head lsx-s1">
          <Chip>Who it’s for</Chip>
          <h2 className="lsx-title" id="lsx-who-title">Built for the work, <span>not the job title.</span></h2>
          <div className="lsx-lede-col">
            <p className="lsx-lede">Signal Studio is for the people the work runs through. Venues, crews, schools and studios. It{" "}opens ready to use, in plain English, with nothing to set up.</p>
            <a className="lsx-btn" href="#waitlist">Join the waitlist
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
          </div>
        </div>
        <ul className="lsx-grid" ref={grid}>
          {PEOPLE.map(([icon, name, sub]) => (
            <li className="lsx-tile" key={name}>
              <span className="lsx-glyph" aria-hidden="true"><svg viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: ICON[icon] }} /></span>
              <span><b>{name}</b><small>{sub}</small></span>
            </li>
          ))}
        </ul>
      </div></div>
    </section>
  );
}
