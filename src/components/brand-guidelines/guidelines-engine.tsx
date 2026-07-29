"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import type {
  GuidelineSection,
  GuidelineSectionId,
} from "@/lib/brand-guidelines/types";

export function GuidelinesEngine({
  sections,
}: {
  sections: readonly GuidelineSection[];
}) {
  const [active, setActive] = useState<GuidelineSectionId>("introduction");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const navigatingRef = useRef(false);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".guidelines-root");
    root?.classList.add("is-enhanced");
    return () => root?.classList.remove("is-enhanced");
  }, []);

  useEffect(() => {
    const requested = window.location.hash.replace("#", "") as GuidelineSectionId;
    const target = sections.find((section) => section.id === requested);
    if (!target) return;

    navigatingRef.current = true;
    const timer = window.setTimeout(() => {
      setActive(target.id);
      document.getElementById(target.id)?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
      navigatingRef.current = false;
    }, 120);
    return () => window.clearTimeout(timer);
  }, [sections]);

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-entered");
          }
        }
        if (navigatingRef.current) return;

        const visible = nodes
          .filter((node) => {
            const box = node.getBoundingClientRect();
            return box.bottom > window.innerHeight * 0.2 && box.top < window.innerHeight * 0.7;
          })
          .sort(
            (a, b) =>
              Math.abs(a.getBoundingClientRect().top - window.innerHeight * 0.24) -
              Math.abs(b.getBoundingClientRect().top - window.innerHeight * 0.24),
          );

        const next = visible[0]?.id as GuidelineSectionId | undefined;
        if (next) setActive(next);
      },
      {
        threshold: [0, 0.2, 0.55],
        rootMargin: "-12% 0px -28% 0px",
      },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    if (navigatingRef.current) return;
    if (!active || window.location.hash === `#${active}`) return;
    window.history.replaceState(null, "", `#${active}`);
  }, [active]);

  useEffect(() => {
    const onHashChange = () => {
      const requested = window.location.hash.replace("#", "") as GuidelineSectionId;
      const target = sections.find((section) => section.id === requested);
      if (!target) return;
      navigatingRef.current = true;
      setActive(target.id);
      document.getElementById(target.id)?.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
      if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = setTimeout(() => {
        navigatingRef.current = false;
      }, 320);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
    };
  }, [sections]);

  useEffect(() => {
    if (!drawerOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = Array.from(
      drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    focusable[0]?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setDrawerOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const navigate = useCallback(
    (id: GuidelineSectionId) => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      navigatingRef.current = true;
      window.history.pushState(null, "", `#${id}`);
      document.getElementById(id)?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
      if (navigationTimerRef.current) clearTimeout(navigationTimerRef.current);
      navigationTimerRef.current = setTimeout(() => {
        navigatingRef.current = false;
      }, reduced ? 80 : 620);
      setDrawerOpen(false);
      setActive(id);
    },
    [],
  );

  const activeSection =
    sections.find((section) => section.id === active) ?? sections[0];

  const nav = (
    <ol className="guidelines-index-list">
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={section.anchor}
            aria-current={section.id === active ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              navigate(section.id);
            }}
          >
            <span>{section.number}</span>
            <span>{section.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <div className="guidelines-reading-progress" aria-hidden />

      <aside className="guidelines-rail" aria-label="Brand guideline chapters">
        <Link href="/" aria-label="Signal Studio, home" className="guidelines-rail-wordmark">
          <Wordmark kind="studio" animate={false} size="sm" />
        </Link>
        <p className="guidelines-rail-title">Brand guidelines</p>
        {nav}
        <p className="guidelines-rail-count">Nine chapters. One system.</p>
      </aside>

      <div className="guidelines-mobile-index">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
          aria-controls="guidelines-mobile-drawer"
          onClick={() => setDrawerOpen(true)}
        >
          <span>{activeSection.number} / 09</span>
          <span>{activeSection.label}</span>
          <span aria-hidden>+</span>
        </button>
      </div>

      {drawerOpen ? (
        <div className="guidelines-drawer-backdrop" role="presentation">
          <div
            id="guidelines-mobile-drawer"
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Brand guideline chapters"
            className="guidelines-drawer"
          >
            <div className="guidelines-drawer-head">
              <Wordmark kind="studio" animate={false} size="sm" />
              <button
                type="button"
                aria-label="Close chapter menu"
                onClick={() => {
                  setDrawerOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                Close
              </button>
            </div>
            {nav}
          </div>
        </div>
      ) : null}
    </>
  );
}
