"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/wordmark";
import { ProductsMegaPanel } from "@/components/layout/products-mega-panel";

const NAV_LINKS = [
  { href: "/design",  label: "Design"  },
  { href: "/pricing", label: "Pricing" },
  { href: "/about",   label: "About"   },
] as const;

export function SiteNav() {
  const [intro, setIntro] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const pathname = usePathname();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const productsTriggerRef = useRef<HTMLButtonElement>(null);
  const productsWrapRef = useRef<HTMLElement>(null);

  const closeProducts = useCallback(() => setProductsOpen(false), []);

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

  // Outside-click dismissal for products panel.
  useEffect(() => {
    if (!productsOpen) return;
    function onDocClick(e: MouseEvent) {
      if (
        productsWrapRef.current &&
        !productsWrapRef.current.contains(e.target as Node)
      ) {
        setProductsOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [productsOpen]);

  if (pathname?.startsWith("/hq")) {
    return null;
  }

  return (
    <header
      ref={productsWrapRef}
      className="sticky top-0 z-40 w-full"
      style={{
        background: "var(--bg)",
        borderBottom: "1px solid var(--border-soft)",
        transition: "border-color var(--motion-base) var(--ease-out)",
      }}
    >
      <div className="mx-auto flex h-14 w-full max-w-[1240px] items-center justify-between px-6">
        <Link href="/" className="wordmark-hover flex min-h-11 items-center" aria-label="Signal Studio, home">
          <Wordmark size="sm" animate={false} intro={intro} />
        </Link>

        <nav aria-label="Site navigation" className="flex items-center gap-4 sm:gap-5">
          {/* Products trigger, opens the full-width mega-panel */}
          <button
            ref={productsTriggerRef}
            type="button"
            aria-expanded={productsOpen}
            aria-controls="products-mega-panel"
            onClick={() => setProductsOpen((o) => !o)}
            className="inline-flex min-h-11 items-center gap-1 text-[13px] transition-colors hover:text-ink"
            style={{
              letterSpacing: "0.01em",
              color: productsOpen ? "var(--ink)" : "var(--ink-quiet)",
            }}
          >
            Products
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: "transform 200ms",
                transform: productsOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>

          <ProductsMegaPanel
            open={productsOpen}
            onClose={closeProducts}
            triggerRef={productsTriggerRef}
          />

          {/* Desktop links, hidden below sm */}
          <Link
            href="/design"
            className="hidden min-h-11 items-center text-[13px] text-ink-quiet transition-colors hover:text-ink sm:inline-flex"
            style={{ letterSpacing: "0.01em" }}
          >
            Design
          </Link>
          <Link
            href="/pricing"
            className="hidden min-h-11 items-center text-[13px] text-ink-quiet transition-colors hover:text-ink sm:inline-flex"
            style={{ letterSpacing: "0.01em" }}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="hidden min-h-11 items-center text-[13px] text-ink-quiet transition-colors hover:text-ink sm:inline-flex"
            style={{ letterSpacing: "0.01em" }}
          >
            About
          </Link>

          {/* Mobile menu trigger, visible below sm only */}
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex h-11 w-11 items-center justify-center text-ink-quiet transition-colors hover:text-ink sm:hidden"
          >
            {/* Hairline hamburger / close, reduced to two strokes for calm aesthetic */}
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

      {/* Mobile nav panel, paper-white, hairline border, no heavy shadow */}
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
        <nav aria-label="All pages" className="mx-auto w-full max-w-[1240px] px-6 py-4">
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
