"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const operatorLinks = [
  { href: "/hq/vault", label: "vault" },
  { href: "/hq/crm", label: "crm" },
  { href: "/hq/marketing", label: "marketing" },
  { href: "/hq/assets", label: "assets" },
  { href: "/hq/reporting", label: "reporting" },
  { href: "/hq/founders-circle", label: "shareholders" },
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
          <div className="hq-env-nav-links" role="list">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="hq-env-nav-link" role="listitem">
                {link.label}
              </Link>
            ))}
          </div>
          <Link href="/" className="hq-env-nav-exit">
            ← signalstudio.ie
          </Link>
        </div>
      </nav>

      <div className="hq-env-body">{children}</div>
    </div>
  );
}
