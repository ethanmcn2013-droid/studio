"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const FRAMES = [
  {
    label: "Notes",
    src: "/brand/guidelines/applications/notes-wedding.webp",
    alt: "Signal Notes showing a venue meeting note for a wedding project.",
  },
  {
    label: "Tasks",
    src: "/brand/guidelines/applications/tasks-board.webp",
    alt: "Signal Tasks showing the wedding project board.",
  },
  {
    label: "Timeline",
    src: "/brand/guidelines/applications/timeline-wedding.webp",
    alt: "Signal Timeline showing the public wedding plan.",
  },
  {
    label: "Signal",
    src: "/brand/guidelines/applications/signal-briefing.webp",
    alt: "Signal showing the daily briefing surface.",
  },
] as const;

export function HeroSequence() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setReduced(query.matches);
      if (query.matches) {
        setActive(FRAMES.length - 1);
        setPlaying(false);
        setPlayed(true);
      }
    };
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reduced || played || playing) return;
    const timer = window.setTimeout(() => setPlaying(true), 2500);
    return () => window.clearTimeout(timer);
  }, [inView, played, playing, reduced]);

  useEffect(() => {
    if (!playing || !inView || reduced) return;
    if (active === FRAMES.length - 1) {
      const settle = window.setTimeout(() => {
        setPlaying(false);
        setPlayed(true);
      }, 900);
      return () => window.clearTimeout(settle);
    }
    const timer = window.setTimeout(() => setActive((index) => index + 1), 1050);
    return () => window.clearTimeout(timer);
  }, [active, inView, playing, reduced]);

  const replay = () => {
    setActive(0);
    setPlayed(false);
    setPlaying(true);
  };

  return (
    <div ref={rootRef} className="guidelines-hero-sequence" data-playing={playing || undefined}>
      <div className="guidelines-hero-frame">
        {FRAMES.map((frame, index) => (
          <Image
            key={frame.label}
            src={frame.src}
            alt={index === active ? frame.alt : ""}
            fill
            priority={index === 0}
            fetchPriority={index === 0 ? "high" : "auto"}
            sizes="(max-width: 900px) 100vw, calc(100vw - 288px)"
            className="guidelines-hero-image"
            data-first={index === 0 || undefined}
            data-active={index === active || undefined}
          />
        ))}
        <div className="guidelines-hero-frame-shade" aria-hidden />
        <p className="guidelines-hero-frame-label" aria-live="polite">
          {FRAMES[active].label}
        </p>
      </div>
      <div className="guidelines-hero-sequence-controls">
        <div role="list" aria-label="Sequence progress">
          {FRAMES.map((frame, index) => (
            <span
              role="listitem"
              key={frame.label}
              data-active={index === active || undefined}
            >
              {frame.label}
            </span>
          ))}
        </div>
        <button type="button" onClick={replay} disabled={playing || reduced}>
          {reduced ? "Sequence settled" : playing ? "Playing once" : "Replay"}
        </button>
      </div>
    </div>
  );
}
