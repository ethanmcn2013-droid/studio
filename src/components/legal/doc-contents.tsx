"use client";

/**
 * Contents rail for the long-form trust stack (/privacy, /terms,
 * /security, /accessibility). A quiet, numbered index that lives in
 * the left gutter on wide screens and tracks the section you are
 * reading, concierge-grade orientation for a document, not a stat.
 *
 * Desktop only (lg+). On a phone the document reads top-to-bottom and
 * a sticky rail would steal width it can't spare, same call the
 * ReadingProgress bar makes. The headings carry their own anchors, so
 * deep-linking still works everywhere; the rail is the wide-screen
 * affordance on top.
 *
 * Scroll-spy is a single IntersectionObserver, no library, no scroll
 * handler. The active id is whichever section last crossed the upper
 * third of the viewport, which matches where the eye actually reads.
 */

import { useEffect, useState } from "react";

export interface DocSectionRef {
  id: string;
  heading: string;
}

export function DocContents({ sections }: { sections: readonly DocSectionRef[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      // Bias the "active" line to the top third, the reading line,
      // not the geometric centre.
      { rootMargin: "-12% 0px -68% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-28 hidden lg:block">
      <div
        className="mb-4 text-[10.5px] font-semibold uppercase text-ink-faint"
        style={{
          letterSpacing: "var(--tracking-eyebrow)",
          fontFamily: "var(--font-mono-stack)",
        }}
      >
        On this page
      </div>
      <ol className="flex flex-col gap-px">
        {sections.map((s, i) => {
          const isActive = s.id === active;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-baseline gap-2.5 border-l py-1.5 pl-3.5 no-underline transition-colors"
                style={{
                  borderColor: isActive ? "var(--accent)" : "transparent",
                }}
              >
                <span
                  className="font-mono text-[10px] tabular-nums"
                  style={{ color: isActive ? "var(--accent)" : "var(--ink-soft)" }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[12.5px] leading-[1.45] transition-colors"
                  style={{ color: isActive ? "var(--ink)" : "var(--ink-faint)" }}
                >
                  {s.heading}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
