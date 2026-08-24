import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { PRODUCT_MARKETING_URLS } from "@/lib/product-urls";

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

const SOCIALS = [
  {
    label: "X",
    href: "https://x.com/signalstudio_ie",
    title: "Signal Studio on X",
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M18.244 2H21l-6.59 7.53L22 22h-6.828l-4.78-6.234L4.8 22H2l7.06-8.07L1.5 2h6.91l4.32 5.69L18.244 2Zm-2.39 18.4h1.594L7.21 3.512H5.5L15.853 20.4Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@signalstudio_ie",
    title: "Signal Studio on YouTube",
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@signalstudio_ie",
    title: "Signal Studio on TikTok",
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.1z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/signal-studio-ie",
    title: "Signal Studio on LinkedIn",
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M20.452 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.666H9.356V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.602 0 4.268 2.37 4.268 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.117 20.452H3.555V9h3.562v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
      </svg>
    ),
  },
] as const;

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const year = new Date().getFullYear();

  if (compact) {
    return <CompactFooter year={year} />;
  }

  return (
    <footer
      className="site-footer mt-20 w-full border-t border-hairline-soft pb-8 pt-10 md:mt-32 md:pb-10 md:pt-16"
      style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-2 gap-x-6 gap-y-9 px-5 sm:px-6 lg:grid-cols-[1.35fr_repeat(4,1fr)] lg:gap-10">
        <div className="col-span-2 lg:col-span-1">
          <Wordmark size="sm" animate={false} />
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-ink-soft">
            Notes. Tasks. Timeline. One clear system. Built for the work.
          </p>
          <p className="mt-4 text-[12px] text-ink-quiet">
            Made by Signal Studio.
          </p>
          <SocialLinks />
        </div>

        <FooterCol
          heading="Product"
          links={[
            { href: "/waitlist", label: "Waitlist" },
            { href: "/pricing", label: "Pricing" },
            { href: "/venues", label: "Venues" },
            { href: "/students", label: "Students" },
          ]}
        />
        <FooterCol
          heading="Company"
          links={[
            { href: "/about", label: "About" },
            { href: "/principles", label: "Principles" },
            { href: "/press", label: "Press" },
            { href: "/about#contact", label: "Contact" },
          ]}
        />
        <FooterCol
          heading="Resources"
          links={[
            { href: "/dispatch", label: "Dispatch" },
            { href: "/design", label: "Design" },
          ]}
        />
        <FooterCol
          heading="Suite"
          links={[
            { href: PRODUCT_MARKETING_URLS.notes, label: "Notes" },
            { href: PRODUCT_MARKETING_URLS.tasks, label: "Tasks" },
            { href: PRODUCT_MARKETING_URLS.timeline, label: "Timeline" },
          ]}
        />
      </div>

      <div className="mx-auto mt-9 flex w-full max-w-[1240px] flex-col items-start justify-between gap-2 border-t border-hairline-soft px-5 pt-5 text-[12px] text-ink-quiet sm:px-6 md:mt-12 md:flex-row md:items-center md:pt-6">
        <span>&copy; {year} Signal Studio. Made by Signal Studio.</span>
        <span>Clarity, not configuration.</span>
      </div>
      <LegalLinks />
    </footer>
  );
}

function CompactFooter({ year }: { year: number }) {
  const suiteLinks = [
    { href: PRODUCT_MARKETING_URLS.notes, label: "Notes" },
    { href: PRODUCT_MARKETING_URLS.tasks, label: "Tasks" },
    { href: PRODUCT_MARKETING_URLS.timeline, label: "Timeline" },
  ];

  return (
    <footer
      className="site-footer mt-14 w-full border-t border-hairline-soft pb-8 pt-9 md:mt-24 md:pb-10 md:pt-12"
      style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex w-full max-w-[874px] flex-col gap-6 px-6 md:flex-row md:items-end md:justify-between md:gap-8">
        <div>
          <Wordmark size="sm" animate={false} />
          <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-ink-soft">
            Notes. Tasks. Timeline. One clear system. Built for the work.
          </p>
        </div>
        <nav aria-label="Suite">
          <ul className="grid grid-cols-3 gap-x-4 text-[13.5px] text-ink-soft md:flex md:flex-wrap md:gap-x-5 md:gap-y-1">
            {suiteLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="marketing-footer-action inline-flex min-h-11 items-center transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-7 flex w-full max-w-[874px] flex-col items-start justify-between gap-1 border-t border-hairline-soft px-6 pt-4 text-[12px] text-ink-soft md:mt-10 md:flex-row md:items-center md:gap-2 md:pt-5">
        <span>&copy; {year} Signal Studio. Made by Signal Studio.</span>
        <Link
          href="/about#contact"
          className="marketing-footer-action inline-flex min-h-11 items-center transition-colors"
        >
          Contact
        </Link>
      </div>
      <LegalLinks compact />
    </footer>
  );
}

function SocialLinks() {
  return (
    <nav
      aria-label="Signal Studio on social"
      className="-ml-2 mt-3 flex items-center text-ink-quiet"
    >
      {SOCIALS.map(({ label, href, title, svg }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={title}
          aria-label={title}
          className="marketing-footer-action inline-flex h-11 w-11 items-center justify-center transition-colors"
        >
          {svg}
        </a>
      ))}
    </nav>
  );
}

function FooterCol({
  heading,
  links,
}: {
  heading: string;
  links: FooterLink[];
}) {
  return (
    <nav aria-label={heading}>
      <div
        className="mb-3 text-[11px] font-semibold uppercase text-ink-faint"
        style={{ letterSpacing: "var(--tracking-eyebrow)" }}
      >
        {heading}
      </div>
      <ul className="space-y-1 text-[13px] text-ink-soft sm:space-y-2 sm:text-[13.5px]">
        {links.map((link) => (
          <li key={`${heading}-${link.href}`}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="marketing-footer-action inline-flex min-h-11 items-center transition-colors"
              >
                {link.label}
                <span aria-hidden className="footer-external-arrow ml-1 text-[11px] text-ink-faint">
                  &rarr;
                </span>
              </a>
            ) : (
              <Link
                href={link.href}
                className="marketing-footer-action inline-flex min-h-11 items-center transition-colors"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

function LegalLinks({ compact = false }: { compact?: boolean }) {
  const links = [
    { href: "/privacy", label: "Privacy" },
    { href: "/privacy#your-rights", label: "GDPR" },
    { href: "/terms", label: "Terms" },
    { href: "/security", label: "Security" },
    { href: "/accessibility", label: "Accessibility" },
  ];

  return (
    <nav
      aria-label="Legal"
      className={`mx-auto mt-3 w-full ${
        compact ? "max-w-[874px]" : "max-w-[1240px]"
      } ${
        compact
          ? "grid grid-cols-2 gap-x-4 gap-y-0 px-6 text-[12px] text-ink-soft sm:flex sm:flex-wrap sm:items-center sm:gap-x-1"
          : "flex flex-wrap items-center gap-x-1 gap-y-0 px-4 text-[11px] text-ink-quiet sm:px-6 sm:text-[12px]"
      } font-mono uppercase tracking-[0.08em] sm:mt-4`}
      style={{ letterSpacing: "0.08em" }}
    >
      {links.map((link, index) => (
        <span key={link.href} className="inline-flex items-center">
          {!compact && index > 0 && (
            <span aria-hidden className="px-1 opacity-50">
              &middot;
            </span>
          )}
          <Link
            href={link.href}
            className={`marketing-footer-action inline-flex items-center px-2 py-1 transition-colors ${
              compact ? "min-h-11" : "min-h-11"
            }`}
          >
            {link.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
