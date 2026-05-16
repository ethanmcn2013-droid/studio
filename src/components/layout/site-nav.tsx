"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { ProductSwitcher } from "@/components/layout/product-switcher";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [intro, setIntro] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // House wordmark: broadcast once on DOM ready, then quiet. Skipped
  // under reduced motion; the wordmark just sits there, which is right.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = requestAnimationFrame(() => setIntro(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (pathname?.startsWith("/hq")) {
    return null;
  }

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--bg) 85%, transparent)",
        borderBottom: scrolled ? "1px solid var(--border-soft)" : "1px solid transparent",
        transition: "border-color 0.2s ease",
      }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[760px] items-center justify-between px-6">
        <Link href="/" className="wordmark-hover flex items-baseline" aria-label="Signal Studio — home">
          <Wordmark size="sm" animate={false} intro={intro} />
        </Link>

        <nav aria-label="Site navigation" className="flex items-center gap-4 sm:gap-5">
          <ProductSwitcher />
          <Link
            href="/work"
            className="hidden text-[13px] text-ink-quiet transition-colors hover:text-ink sm:inline"
            style={{ letterSpacing: "0.01em" }}
          >
            Work
          </Link>
          <Link
            href="/proof"
            className="hidden text-[13px] text-ink-quiet transition-colors hover:text-ink sm:inline"
            style={{ letterSpacing: "0.01em" }}
          >
            Proof
          </Link>
          <Link
            href="/about"
            className="hidden text-[13px] text-ink-quiet transition-colors hover:text-ink sm:inline"
            style={{ letterSpacing: "0.01em" }}
          >
            About
          </Link>
          <Link
            href="/brand"
            prefetch={false}
            className="hidden text-[13px] text-ink-quiet transition-colors hover:text-ink sm:inline"
            style={{ letterSpacing: "0.01em" }}
          >
            Brand
          </Link>
          <Link
            href="/pricing"
            className="text-[13px] text-ink-quiet transition-colors hover:text-ink"
            style={{ letterSpacing: "0.01em" }}
          >
            Pricing
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
