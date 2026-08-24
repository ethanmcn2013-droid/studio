"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./about.module.css";

type Row = { industry: string; english: string };

const ROWS: Row[] = [
  {
    industry: "Velocity is trending below capacity this sprint.",
    english: "The week ran slower than planned.",
  },
  {
    industry: "Stakeholder alignment required on epic dependencies.",
    english: "Two decisions are waiting on you.",
  },
  {
    industry: "Blocking dependency flagged on the critical path.",
    english: "The venue contract waits on the marquee answer.",
  },
  {
    industry: "Carry-over items to be groomed into next sprint’s backlog.",
    english: "What didn’t finish stays visible. Nothing gets lost.",
  },
];

/**
 * The translation table. Server render and reduced motion both land on
 * the plain-English state, so the content never depends on JavaScript.
 * With motion allowed, the table primes in industry language while it
 * sits below the viewport, then translates itself row by row on arrival.
 */
export function TranslationSection() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [lang, setLang] = useState<"industry" | "english">("english");
  const [touched, setTouched] = useState(false);

  const pick = (next: "industry" | "english") => {
    setLang(next);
    setTouched(true);
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || typeof IntersectionObserver === "undefined") return;

    const rect = root.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    setLang("industry");
    const translate = () => {
      setTouched(true);
      setLang("english");
      observer.disconnect();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          translate();
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -12% 0px" },
    );
    // a keyboard or anchor jump can skip the intersection window;
    // arriving focus still translates
    root.addEventListener("focusin", translate, { once: true });
    observer.observe(root);
    return () => {
      root.removeEventListener("focusin", translate);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <p className="sr-only" role="status">
        {touched
          ? lang === "english"
            ? "Showing plain English."
            : "Showing industry language."
          : ""}
      </p>
      <div
        role="group"
        aria-label="Switch between industry language and plain English"
        className={styles.toggle}
      >
        <span
          className={styles.tThumb}
          data-pos={lang}
          aria-hidden
        />
        <button
          type="button"
          className={styles.tBtn}
          aria-pressed={lang === "industry"}
          onClick={() => pick("industry")}
        >
          Industry
        </button>
        <button
          type="button"
          className={styles.tBtn}
          aria-pressed={lang === "english"}
          onClick={() => pick("english")}
        >
          Plain English
        </button>
      </div>

      <div
        className={`${styles.table} ${styles.tTable}`}
        data-lang={lang}
        data-testid="translation-table"
      >
        {ROWS.map((row, index) => (
          <div key={row.industry} className={styles.tRow}>
            <span className={styles.tNum} aria-hidden>
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className={styles.tIndustry} aria-hidden={lang === "english"}>
              {row.industry}
            </p>
            <span className={styles.tArrow} aria-hidden>
              →
            </span>
            <p className={styles.tEnglish} aria-hidden={lang === "industry"}>
              <span className={styles.tDot} aria-hidden />
              {row.english}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
