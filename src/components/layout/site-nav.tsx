"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
  const reducedMotion = useReducedMotion();
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

  // Keep the page fixed while an overlay menu is open. Without this, the
  // underlying About copy can scroll and peek beneath the panel on short
  // mobile viewports, which reads as a broken section boundary.
  useEffect(() => {
    if (!mobileOpen && !productsOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen, productsOpen]);

  if (
    pathname?.startsWith("/hq") ||
    pathname === "/__design-lab/brand-guidelines"
  ) {
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
      <div className="mx-auto flex h-[56px] w-full max-w-[1240px] items-center justify-between px-4 sm:h-14 sm:px-6">
        <Link
          href="/"
          prefetch={false}
          className="wordmark-hover flex min-h-[44px] items-center sm:min-h-11"
          aria-label="Signal Studio, home"
        >
          <Wordmark size="sm" animate={false} intro={intro} />
        </Link>

        <nav aria-label="Site navigation" className="flex items-center gap-2 sm:gap-5">
          {/* Products trigger, opens the full-width mega-panel */}
          <button
            ref={productsTriggerRef}
            type="button"
            aria-expanded={productsOpen}
            aria-controls={productsOpen ? "products-mega-panel" : undefined}
            onClick={() => {
              setMobileOpen(false);
              setProductsOpen((open) => !open);
            }}
            onKeyDown={(event) => {
              if (event.key !== "ArrowDown") return;
              event.preventDefault();
              setMobileOpen(false);
              setProductsOpen(true);
              window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                  document
                    .querySelector<HTMLAnchorElement>(
                      "#products-mega-panel .mpanel-card",
                    )
                    ?.focus();
                });
              });
            }}
            className="marketing-nav-action inline-flex min-h-[44px] items-center gap-1 text-[13px] transition-colors sm:min-h-11"
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
              className="site-products-chevron"
              style={{
                transition: "transform 200ms var(--ease-out)",
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
            aria-current={pathname === "/design" ? "page" : undefined}
            className="marketing-nav-action hidden min-h-11 min-w-11 items-center justify-center text-[13px] text-ink-quiet transition-colors sm:inline-flex"
            style={{ letterSpacing: "0.01em" }}
          >
            Design
          </Link>
          <Link
            href="/pricing"
            aria-current={pathname === "/pricing" ? "page" : undefined}
            className="marketing-nav-action hidden min-h-11 min-w-11 items-center justify-center text-[13px] text-ink-quiet transition-colors sm:inline-flex"
            style={{ letterSpacing: "0.01em" }}
          >
            Pricing
          </Link>
          <Link
            href="/about"
            aria-current={pathname === "/about" ? "page" : undefined}
            className="marketing-nav-action hidden min-h-11 min-w-11 items-center justify-center text-[13px] text-ink-quiet transition-colors sm:inline-flex"
            style={{ letterSpacing: "0.01em" }}
          >
            About
          </Link>

          {/* Mobile menu trigger, visible below sm only */}
          <button
            ref={triggerRef}
            type="button"
            aria-expanded={mobileOpen}
            aria-controls={mobileOpen ? "mobile-nav-panel" : undefined}
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => {
              setProductsOpen(false);
              setMobileOpen((open) => !open);
            }}
            className="marketing-nav-action inline-flex h-[44px] w-[44px] items-center justify-center text-ink-quiet transition-colors sm:hidden"
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
      <AnimatePresence initial={false}>
        {mobileOpen ? (
          <motion.div
            key="mobile-nav-panel"
            id="mobile-nav-panel"
            ref={panelRef}
            role="region"
            aria-label="Mobile navigation"
            className="absolute left-0 right-0 top-full sm:hidden"
            initial={
              reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }
            }
            animate={{ opacity: 1, y: 0 }}
            exit={
              reducedMotion ? { opacity: 0 } : { opacity: 0, y: -4 }
            }
            transition={{
              duration: reducedMotion ? 0.01 : 0.2,
              ease: [0.23, 1, 0.32, 1],
            }}
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
                      aria-current={pathname === href ? "page" : undefined}
                      className="marketing-nav-action flex min-h-[44px] items-center border-b text-[14px] text-ink-quiet transition-colors"
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
          </motion.div>
        ) : null}
      </AnimatePresence>

      <noscript>
        <nav
          aria-label="Site navigation without JavaScript"
          className="mx-auto flex min-h-14 w-full max-w-[1240px] flex-wrap items-center gap-x-6 border-t border-border-soft px-6 py-2 text-[13px] text-ink-quiet"
        >
          <Link href="/notes" className="inline-flex min-h-11 items-center">Notes</Link>
          <Link href="/tasks" className="inline-flex min-h-11 items-center">Tasks</Link>
          <Link href="/timeline" className="inline-flex min-h-11 items-center">Timeline</Link>
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="inline-flex min-h-11 items-center">
              {label}
            </Link>
          ))}
        </nav>
      </noscript>
    </header>
  );
}
