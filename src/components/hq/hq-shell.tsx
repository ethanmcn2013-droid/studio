"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HqCommandPalette } from "@/components/hq/hq-command-palette";
import { HqStatusDot } from "@/components/hq/hq-status-dot";

const operatorLinks = [
  { href: "/hq/crm", label: "sell" },
  { href: "/hq/design-rooms", label: "make" },
  { href: "/hq/reporting", label: "tell" },
  { href: "/hq/vault", label: "run" },
  { href: "/hq/founders-circle", label: "board" },
];

const boardLinks = [
  { href: "/hq/founders-circle", label: "circle" },
  { href: "/hq/reporting", label: "reporting" },
  { href: "/hq/assets", label: "assets" },
];

export function HqShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const boardMode = pathname === "/hq/founders-circle";
  const links = boardMode ? boardLinks : operatorLinks;
  // The access gate renders this shell pre-auth — keep the live, authed
  // pieces (status dot + palette) off it; they have nothing to read yet.
  const authed = pathname !== "/hq/access";

  return (
    <div className="hq-env" data-mode={boardMode ? "board" : "operator"}>
      <div className="hq-env-strip" aria-hidden="true">
        <div className="hq-env-strip-inner">
          <span className="hq-env-pip" />
          <span className="hq-env-label">
            {boardMode ? "Signal HQ · Board Room" : "Signal HQ · Internal"}
          </span>
        </div>
      </div>

      <nav className="hq-env-nav" aria-label="Signal HQ navigation">
        <div className="hq-env-nav-inner">
          <Link href={boardMode ? "/hq/founders-circle" : "/hq"} className="hq-env-nav-home" aria-label="Signal HQ home">
            signal hq<span className="hq-env-nav-dot" aria-hidden="true">.</span>
          </Link>
          {authed ? <HqStatusDot /> : null}
          <div className="hq-env-nav-links" role="list">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hq-env-nav-link" role="listitem">
                {link.label}
              </Link>
            ))}
          </div>
          {authed ? (
            <button
              type="button"
              className="hq-env-nav-cmdk"
              onClick={() => window.dispatchEvent(new Event("hq:open-palette"))}
              aria-label="Open the command palette"
            >
              jump<kbd>⌘K</kbd>
            </button>
          ) : null}
          <Link href="/" className="hq-env-nav-exit">
            ← signalstudio.ie
          </Link>
        </div>
      </nav>

      <div className="hq-env-body">{children}</div>

      {authed ? <HqCommandPalette /> : null}
    </div>
  );
}
