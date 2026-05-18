/**
 * Suite launcher — the authed variant of signalstudio.ie/.
 *
 * This is NOT a new product. It is the shared cross-product switcher
 * rendered full-page. Mount point: src/app/page.tsx when authed.
 *
 * Design spec: DESIGN.md §14 "Suite shell and auth-aware switcher".
 * Brand voice: one verb per card, no marketing copy, utility surface only.
 *
 * Honest ceiling (stated per spec): perceived continuity, not a true SPA.
 * Hard document navigation still occurs between subdomains.
 */

import Link from "next/link";
import { Wordmark } from "@/components/brand/wordmark";
import {
  TASKS_URL,
  ROADMAP_URL,
  ANALYTICS_URL,
  NOTES_URL,
} from "@/lib/product-urls";

// App entries per Layer 0 allowlist (LAYER0_ROUTE_ALLOWLIST.md)
const PRODUCTS: {
  slug: string;
  word: string;
  label: string;
  url: string;
  description: string;
}[] = [
  // Product order (operator-directed 2026-05-18): Notes → Tasks → Roadmap → Analytics
  {
    slug: "notes",
    word: "notes",
    label: "Open the notebook",
    url: `${NOTES_URL}/app`,
    description: "Capture clarity",
  },
  {
    slug: "tasks",
    word: "tasks",
    label: "Open the workspace",
    url: `${TASKS_URL}/app`,
    description: "Execution clarity",
  },
  {
    slug: "roadmap",
    word: "roadmap",
    label: "Open the roadmap",
    url: `${ROADMAP_URL}/app`,
    description: "Direction clarity",
  },
  {
    slug: "analytics",
    word: "analytics",
    label: "Open the briefing",
    url: `${ANALYTICS_URL}/app`,
    description: "Attention clarity",
  },
];

const INDIGO = "#4f46e5";

export function SuiteLauncher() {
  return (
    <main
      id="main"
      tabIndex={-1}
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        background: "var(--paper, #ffffff)",
      }}
    >
      {/* Chrome — persistent top bar per DESIGN.md §14 */}
      <header
        className="sticky top-0 z-40 w-full"
        style={{
          background: "var(--paper, #ffffff)",
          borderBottom: "1px solid var(--border-soft)",
        }}
      >
        <div
          className="mx-auto flex h-14 w-full items-center justify-between px-6"
          style={{ maxWidth: "80rem" }}
        >
          {/* Left: umbrella wordmark only (launcher IS studio) */}
          <Link
            href="/"
            className="wordmark-hover flex items-baseline"
            aria-label="Signal Studio — suite home"
          >
            <Wordmark size="sm" animate={false} intro={false} />
          </Link>

          {/* Right: escape hatch text link */}
          <a
            href="/?preview=public"
            className="text-[12px] text-ink-quiet hover:text-ink transition-colors"
            style={{ letterSpacing: "0.01em" }}
            aria-label="View the public marketing site"
          >
            View public site
          </a>
        </div>
      </header>

      {/* Launcher body */}
      <div
        className="flex flex-1 flex-col items-center justify-center px-6"
        style={{ paddingTop: "4rem", paddingBottom: "4rem" }}
      >
        <div style={{ maxWidth: "32rem", width: "100%" }}>
          {/* Heading */}
          <p
            className="text-[11px] font-medium uppercase tracking-widest text-ink-quiet"
            style={{ fontFamily: "var(--font-mono-stack)", marginBottom: "1rem" }}
          >
            Signal Studio
          </p>
          <h1
            className="text-[1.5rem] font-semibold tracking-tight text-ink"
            style={{ marginBottom: "2rem", letterSpacing: "-0.03em" }}
          >
            Jump back in.
          </h1>

          {/* Product grid — 2×2 on desktop, single column on mobile */}
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(14rem, 1fr))",
              gap: "0.75rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {PRODUCTS.map((p) => (
              <li key={p.slug}>
                <a
                  href={p.url}
                  className="group flex items-center justify-between gap-3 rounded-xl border bg-paper p-4 no-underline transition-colors hover:border-ink-ghost hover:bg-paper-soft"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <div className="min-w-0">
                    {/* Product wordmark */}
                    <div
                      className="text-[14px] font-semibold tracking-tight text-ink"
                      style={{ letterSpacing: "-0.01em" }}
                    >
                      {p.word}
                      <span style={{ color: INDIGO }}>·</span>
                    </div>
                    {/* App-context label — not a marketing tagline */}
                    <div className="mt-0.5 text-[12px] text-ink-quiet">
                      {p.label}
                    </div>
                  </div>
                  {/* Right arrow — appears on hover */}
                  <span
                    className="shrink-0 text-ink-ghost opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* Footer: sign-out link */}
          <div
            style={{ marginTop: "2.5rem", borderTop: "1px solid var(--border-soft)", paddingTop: "1.5rem" }}
          >
            <p className="text-[12px] text-ink-quiet">
              Not you?{" "}
              <a
                href="https://signalstudio.ie/sign-out"
                className="text-ink-quiet underline underline-offset-2 hover:text-ink transition-colors"
              >
                Sign out
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
