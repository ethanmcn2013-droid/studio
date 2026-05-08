"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";

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
      <div className="mx-auto flex h-[52px] w-full max-w-[760px] items-center justify-between px-6">
        {/* Wordmark — links home */}
        <Link href="/" className="wordmark-hover flex items-baseline" aria-label="studio. — home">
          <Wordmark size="sm" animate={false} />
        </Link>

        {/* Nav links */}
        <nav aria-label="Site navigation" className="flex items-center gap-6">
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
