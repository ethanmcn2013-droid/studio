"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HqCommandPalette } from "@/components/hq/hq-command-palette";
import { HqStatusDot } from "@/components/hq/hq-status-dot";
import { HqIcons } from "@/components/hq/hq-icons";
import {
  HQ_NAV,
  HQ_BOARD_NAV,
  activeHref,
  resolveHqLocation,
  type HqNavGroup,
} from "@/lib/hq/hq-nav";

const BOARD_ROUTES = new Set(["/hq/founders-circle", "/hq/data-room", "/hq/deck"]);

export function HqShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/hq";
  const boardMode = BOARD_ROUTES.has(pathname);
  const authed = pathname !== "/hq/access";
  const groups: HqNavGroup[] = boardMode ? HQ_BOARD_NAV : HQ_NAV;
  const active = activeHref(pathname);
  const crumb = resolveHqLocation(pathname);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Close the mobile drawer on any route change.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  // The access gate stands alone — no rail, no chrome. The page itself gates.
  if (!authed) {
    return <div className="hqx-gate">{children}</div>;
  }

  const openPalette = () => window.dispatchEvent(new Event("hq:open-palette"));

  return (
    <div className="hqx-shell" data-mode={boardMode ? "board" : "operator"} data-collapsed={collapsed || undefined}>
      {/* ── Left rail ─────────────────────────────────────────── */}
      <nav className="hqx-rail" data-open={drawerOpen || undefined} aria-label="Signal HQ navigation">
        <div className="hqx-rail-head">
          <Link href={boardMode ? "/hq/founders-circle" : "/hq"} className="hqx-wordmark" aria-label="Signal HQ home">
            <span className="hqx-wordmark-dot" aria-hidden="true" />
            <span className="hqx-wordmark-text">
              signal hq<span aria-hidden="true">.</span>
            </span>
          </Link>
          <button
            type="button"
            className="hqx-rail-collapse"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            title={collapsed ? "Expand" : "Collapse"}
          >
            <HqIcons.collapse />
          </button>
          <button
            type="button"
            className="hqx-rail-dismiss"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
          >
            <HqIcons.close />
          </button>
        </div>

        <div className="hqx-rail-scroll">
          {groups.map((group) => (
            <div key={group.label} className="hqx-rail-group">
              <span className="hqx-rail-label">{group.label}</span>
              <ul className="hqx-rail-list" role="list">
                {group.items.map((item) => {
                  const Icon = HqIcons[item.icon];
                  const isActive = active === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="hqx-rail-item"
                        aria-current={isActive ? "page" : undefined}
                        data-active={isActive || undefined}
                        title={item.label}
                      >
                        <span className="hqx-rail-icon"><Icon /></span>
                        <span className="hqx-rail-text">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="hqx-rail-foot">
          <button type="button" className="hqx-rail-search" onClick={openPalette}>
            <span className="hqx-rail-icon"><HqIcons.search /></span>
            <span className="hqx-rail-text">Search</span>
            <kbd className="hqx-kbd">⌘K</kbd>
          </button>
          <div className="hqx-account">
            <Link href="/" className="hqx-account-link">
              <span className="hqx-rail-icon"><HqIcons.exit /></span>
              <span className="hqx-rail-text">signalstudio.ie</span>
            </Link>
            <Link href="/hq/logout" className="hqx-account-signout hqx-rail-text">
              Sign out
            </Link>
          </div>
        </div>
      </nav>

      {drawerOpen ? <button type="button" className="hqx-scrim" aria-label="Close navigation" onClick={() => setDrawerOpen(false)} /> : null}

      {/* ── Main column ───────────────────────────────────────── */}
      <div className="hqx-main">
        <header className="hqx-topbar">
          <div className="hqx-topbar-left">
            <button type="button" className="hqx-menu-btn" onClick={() => setDrawerOpen(true)} aria-label="Open navigation">
              <HqIcons.menu />
            </button>
            <nav className="hqx-crumbs" aria-label="Breadcrumb">
              <Link href={crumb.href} className="hqx-crumb-group">{crumb.group}</Link>
              {crumb.page !== crumb.group ? (
                <>
                  <span className="hqx-crumb-sep" aria-hidden="true">/</span>
                  <span className="hqx-crumb-page" aria-current="page">{crumb.page}</span>
                </>
              ) : null}
            </nav>
          </div>
          <div className="hqx-topbar-right">
            <HqStatusDot />
            <button type="button" className="hqx-topbar-cmdk" onClick={openPalette} aria-label="Search everything">
              <HqIcons.search />
              <span className="hqx-topbar-cmdk-text">Search</span>
              <kbd className="hqx-kbd">⌘K</kbd>
            </button>
          </div>
        </header>

        <main id="hq-content" className="hqx-content">{children}</main>
      </div>

      <HqCommandPalette />
    </div>
  );
}
