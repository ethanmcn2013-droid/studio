import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import { COMPANY_META } from "@/lib/hq/company";
import { SOCIAL_PROFILES, type SocialId } from "@/lib/social-profiles";
import { FooterDot } from "./footer-dot";

type FooterLink = {
  href: string;
  label: string;
  external?: boolean;
};

/**
 * The icons only. Which profiles exist, and their addresses, live in
 * src/lib/social-profiles.ts, which the structured data reads as well.
 */
const SOCIAL_ICONS: Record<SocialId, React.ReactNode> = {
  x: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M18.244 2H21l-6.59 7.53L22 22h-6.828l-4.78-6.234L4.8 22H2l7.06-8.07L1.5 2h6.91l4.32 5.69L18.244 2Zm-2.39 18.4h1.594L7.21 3.512H5.5L15.853 20.4Z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
      <path d="M20.452 20.452h-3.554v-5.569c0-1.328-.024-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.94v5.666H9.356V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.602 0 4.268 2.37 4.268 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM7.117 20.452H3.555V9h3.562v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
};

/**
 * The company particulars, on every public page (Companies Act 2014 §151):
 * the registered name, the place of registration and the CRO number.
 * The number is transcribed from the Certificate of Incorporation and held
 * once, in the company record.
 */
const REGISTRATION_LINE = `${COMPANY_META.legalName}. Registered in Ireland. CRO number: ${COMPANY_META.croNumber}.`;

/* Sizes that matter (44px targets, the link pitch, the type) are written out
   in site-footer.css. Tailwind's numeric spacing utilities resolve through
   the design system's scale in this repo, where step 11 is 80px, so
   `min-h-11` is not 44px here. The shell classes below are the footer
   contract's markers (scripts/check-chrome-contract.mjs). */
const WRAP = "site-footer-wrap mx-auto w-full max-w-[1240px] px-5 sm:px-6";
const WRAP_COMPACT = "site-footer-wrap mx-auto w-full max-w-[874px] px-6";
const ACTION = "marketing-footer-action site-footer-target transition-colors";

export function SiteFooter({
  compact = false,
  showDot = false,
}: {
  compact?: boolean;
  showDot?: boolean;
}) {
  const year = new Date().getFullYear();

  if (compact) {
    return <CompactFooter year={year} />;
  }

  return (
    <footer
      className="site-footer mt-20 w-full border-t border-hairline-soft pb-8 pt-10 md:mt-32 md:pb-10 md:pt-16"
      style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
    >
      <div
        className={`${WRAP} site-footer-grid grid grid-cols-2 lg:grid-cols-[1.35fr_repeat(2,1fr)]`}
      >
        <div
          className={
            showDot
              ? "col-span-2 lg:col-span-1 site-footer-brand-with-dot"
              : "col-span-2 lg:col-span-1"
          }
        >
          <Wordmark size="sm" animate={false} />
          <p className="site-footer-promise">
            Tasks, dates, files and people live together. Built for the work.
          </p>
          <SocialLinks />
          {showDot && <FooterDot />}
        </div>

        <FooterCol
          heading="Product"
          links={[
            { href: "/waitlist", label: "Waitlist" },
            { href: "/pricing", label: "Pricing" },
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
      </div>

      <div className={WRAP}>
        <div className="site-footer-bar">
          <span>&copy; {year} Signal Studio. Made by Signal Studio.</span>
          <span>Clarity, not configuration.</span>
        </div>
        <div className="site-footer-particulars">
          <p className="site-footer-registration">{REGISTRATION_LINE}</p>
          <LegalLinks />
        </div>
      </div>
    </footer>
  );
}

function CompactFooter({ year }: { year: number }) {
  return (
    <footer
      className="site-footer mt-14 w-full border-t border-hairline-soft pb-8 pt-9 md:mt-24 md:pb-10 md:pt-12"
      style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
    >
      <div
        className={`${WRAP_COMPACT} flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-8`}
      >
        <div>
          <Wordmark size="sm" animate={false} />
          <p className="site-footer-promise">
            Tasks, dates, files and people live together. Built for the work.
          </p>
        </div>
        <nav aria-label="Signal Studio">
          <ul className="site-footer-links site-footer-links-row">
            {[
              { href: "/waitlist", label: "Waitlist" },
              { href: "/pricing", label: "Pricing" },
              { href: "/about", label: "About" },
              { href: "/about#contact", label: "Contact" },
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={ACTION}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={WRAP_COMPACT}>
        <div className="site-footer-bar">
          <span>&copy; {year} Signal Studio. Made by Signal Studio.</span>
        </div>
        <div className="site-footer-particulars">
          <p className="site-footer-registration">{REGISTRATION_LINE}</p>
          <LegalLinks />
        </div>
      </div>
    </footer>
  );
}

function SocialLinks() {
  return (
    <nav aria-label="Signal Studio on social" className="site-footer-social">
      {SOCIAL_PROFILES.map(({ id, label, href }) => {
        // Each link opens the profile in a new tab, and says so.
        const name = `Signal Studio on ${label} (opens in a new tab)`;
        return (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={name}
            aria-label={name}
            className={ACTION}
          >
            {SOCIAL_ICONS[id]}
          </a>
        );
      })}
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
      <div className="site-footer-heading">{heading}</div>
      <ul className="site-footer-links">
        {links.map((link) => (
          <li key={`${heading}-${link.href}`}>
            {link.external ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={ACTION}
              >
                {link.label}
                <span className="sr-only"> (opens in a new tab)</span>
                <span aria-hidden className="footer-external-arrow ml-1 text-[12px] text-ink-faint">
                  &rarr;
                </span>
              </a>
            ) : (
              <Link href={link.href} className={ACTION}>
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** The legal row keeps the contract's register: mono, uppercase, 0.08em. */
function LegalLinks() {
  const links = [
    { href: "/privacy", label: "Privacy" },
    { href: "/privacy#your-rights", label: "GDPR" },
    { href: "/terms", label: "Terms" },
  ];

  return (
    <nav
      aria-label="Legal"
      className="site-footer-legal font-mono uppercase tracking-[0.08em]"
    >
      {links.map((link, index) => (
        <span key={link.href} className="inline-flex items-center">
          {index > 0 && (
            <span aria-hidden className="opacity-50">
              &middot;
            </span>
          )}
          <Link href={link.href} className={ACTION}>
            {link.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}
