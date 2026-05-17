"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { ProductSwitcher } from "@/components/layout/product-switcher";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/proof", label: "Proof" },
  { href: "/about", label: "About" },
  { href: "/brand", label: "Brand", prefetch: false },
  { href: "/pricing", label: "Pricing" },
  { href: "/principles", label: "Principles" },
  { href: "/press", label: "Press" },
  { href: "/contact", label: "Contact" },
  { href: "/dispatch", label: "Dispatch" },
] as const;

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [intro, setIntro] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // Close on Escape and return focus to trigger.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Close on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/hq")) {
    return null;
  }

  return (
    <header
      className="sticky top-0 z-40 w-full backdrop-blur-md"
      style={{
        background: "color-mix(in srgb, var(--bg) 85%, transparent)",
        borderBottom: scrolled ? "1px solid var(--border-soft)" : "1px solid transparent",
        transition: "border-color var(--motion-base) var(--ease-out)",
      }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[760px] items-center justify-between px-6">
        <Link href="/" className="wordmark-hover flex items-baseline" aria-label="Signal Studio — home">
          <Wordmark size="sm" animate={false} intro={intro} />
        </Link>

        <nav aria-label="Site navigation" className="flex items-center gap-4 sm:gap-5">
          <ProductSwitcher />

          {/* Desktop links — hidden below sm */}
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
            className="hidden text-[13px] text-ink-quiet transition-colors hover:text-ink sm:inline"
            style={{ letterSpacing: "0.01em" }}
          >
            Contact
          </Link>
          <Link
            href="/dispatch"
            className="hidden text-[13px] text-ink-quiet transition-colors hover:text-ink sm:inline"
            style={{ letterSpacing: "0.01em" }}
          >
            Dispatch
          </Link>

          {/* Mobile menu trigger — visible below sm only */}
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex h-9 w-9 items-center justify-center text-ink-quiet transition-colors hover:text-ink sm:hidden"
          >
            {/* Hairline hamburger / close — reduced to two strokes for calm aesthetic */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden
              style={{
                transition: mobileOpen ? "none" : undefined,
              }}
            >
              {mobileOpen ? (
                <>
                  <line x1="3" y1="3" x2="15" y2="15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  <line x1="15" y1="3" x2="3" y2="15" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="15" y2="6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  <line x1="3" y1="12" x2="15" y2="12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile nav panel — paper-white, hairline border, no heavy shadow */}
      <div
        id="mobile-nav-panel"
        ref={panelRef}
        role="region"
        aria-label="Mobile navigation"
        hidden={!mobileOpen}
        className="sm:hidden"
        style={{
          borderTop: "1px solid var(--border-soft)",
          background: "var(--bg)",
        }}
      >
        <nav aria-label="All pages" className="mx-auto w-full max-w-[760px] px-6 py-4">
          <ul className="flex flex-col" style={{ gap: 0 }}>
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex min-h-[44px] items-center border-b text-[14px] text-ink-quiet transition-colors hover:text-ink"
                  style={{
                    borderColor: "var(--border-soft)",
                    letterSpacing: "0.01em",
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
