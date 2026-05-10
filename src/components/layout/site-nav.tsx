"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { TASKS_URL, ROADMAP_URL, ANALYTICS_URL, NOTES_URL } from "@/lib/product-urls";

/**
 * Minimal sticky nav.
 *
 * Wordmark left, two text links right. Backdrop-blur always on.
 * Hairline border-bottom appears only when scrolled — at rest the
 * page's own content provides the visual separation.
 */
export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--bg) 85%, transparent)",
        borderBottom: scrolled ? "1px solid var(--border-soft)" : "1px solid transparent",
        transition: "border-color 0.2s ease",
      }}
    >
      {/* ── Suite chrome — cross-product strip ──────────────────── */}
      <div
        className="border-b"
        style={{
          background: "color-mix(in srgb, var(--bg-deep) 55%, transparent)",
          borderBottomColor: "var(--border-soft)",
        }}
      >
        <div
          className="mx-auto flex h-7 w-full max-w-[760px] items-center px-6"
          style={{ gap: 16 }}
        >
          <span style={{ fontSize: 11, color: "var(--ink)", fontWeight: 600, letterSpacing: "-0.01em" }}>
            signal studio<span style={{ color: "var(--accent)" }}>.</span>
          </span>
          <span aria-hidden style={{ color: "var(--ink-faint)", fontSize: 10 }}>·</span>
          <a
            href={TASKS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "var(--ink-quiet)", fontWeight: 400, textDecoration: "none", letterSpacing: "-0.01em" }}
          >
            tasks
          </a>
          <a
            href={ROADMAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "var(--ink-quiet)", fontWeight: 400, textDecoration: "none", letterSpacing: "-0.01em" }}
          >
            roadmap
          </a>
          <a
            href={ANALYTICS_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "var(--ink-quiet)", fontWeight: 400, textDecoration: "none", letterSpacing: "-0.01em" }}
          >
            analytics
          </a>
          <a
            href={NOTES_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "var(--ink-quiet)", fontWeight: 400, textDecoration: "none", letterSpacing: "-0.01em" }}
          >
            notes
          </a>
        </div>
      </div>

      <div className="mx-auto flex h-14 w-full max-w-[760px] items-center justify-between px-6">
        {/* Wordmark — links home */}
        <Link href="/" className="wordmark-hover flex items-baseline" aria-label="Signal Studio — home">
          <Wordmark size="sm" animate={false} />
        </Link>

        {/* Nav links */}
        <nav aria-label="Site navigation" className="flex items-center gap-6">
          <Link
            href="/work"
            className="text-[13px] text-ink-quiet transition-colors hover:text-ink"
            style={{ letterSpacing: "0.01em" }}
          >
            Work
          </Link>
          <Link
            href="/about"
            className="text-[13px] text-ink-quiet transition-colors hover:text-ink"
            style={{ letterSpacing: "0.01em" }}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-[13px] text-ink-quiet transition-colors hover:text-ink"
            style={{ letterSpacing: "0.01em" }}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
