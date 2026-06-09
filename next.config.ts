import type { NextConfig } from "next";

/**
 * ── Security headers (Plan 4.1) ────────────────────────────────────
 * Suite-wide security baseline. Two policy sets:
 *   1. Standard headers (HSTS, X-Content-Type-Options, etc.) shipped
 *      in enforce mode — these don't break anything.
 *   2. Content-Security-Policy shipped in Report-Only mode — logs
 *      violations to console without enforcing. Promote to enforce
 *      mode (`Content-Security-Policy` instead of -Report-Only) once
 *      we've verified no real flows trigger violations.
 *
 * Most restrictive of the four — Studio is the umbrella marketing
 * site with no auth, no payments, no errors-to-Sentry. Only Vercel
 * Analytics adds a third-party host.
 */

const isDev = process.env.NODE_ENV === "development";

// CSP allowlists mirrored from notes/next.config.ts (suite-locked enforce model). Report-Only until cross-suite verification — see audit/ISSUES.md suite-01.
// Clerk's prod Frontend API is a CNAME under our own domain, so the
// wildcard `https://*.signalstudio.ie` covers whatever label Clerk
// uses without a deploy-time guess. Dev instances live on
// *.clerk.accounts.dev; Clerk infra/telemetry on *.clerk.com +
// clerk-telemetry.com; Turnstile bot-protection on Cloudflare.
const clerkHosts =
  "https://*.signalstudio.ie https://*.clerk.accounts.dev https://*.clerk.com https://clerk-telemetry.com";
const turnstile = "https://challenges.cloudflare.com";

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com ${clerkHosts} ${turnstile}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://va.vercel-scripts.com ${clerkHosts}`,
  `frame-src 'self' ${turnstile}`,
  `worker-src 'self' blob:`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
  // upgrade-insecure-requests removed — the directive is ignored in
  // report-only policies and was spamming the console on every page.
  // Add it back when CSP is promoted to enforce mode.
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/students",
        destination: "/students.html",
        permanent: false,
      },
    ];
  },
  experimental: {
    // Tree-shake heavy barrel imports — motion is used across reveal
    // hero, manifesto, products, closing; the full barrel ships ~5× what
    // we call. The other four products carry the same shape (Phase 6.2).
    optimizePackageImports: ["motion"],
  },
  // Bundle the per-entry dispatch files into the /dispatch + RSS server
  // functions. Without this, readDispatchEntries() in src/lib/changelog.ts
  // hits ENOENT on Vercel (content/dispatch/*.md sits outside the
  // .next/standalone tracing window) and Next falls through to 404.
  outputFileTracingIncludes: {
    "/dispatch": ["./content/dispatch/*.md"],
    "/changelog.rss": ["./content/dispatch/*.md"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // The /brand page iframes loader.html same-origin. Site-wide
        // X-Frame-Options: DENY blocks that and renders a broken-doc icon
        // in the phone frame. Allow same-origin framing for this asset only.
        source: "/brand/loader.html",
        headers: securityHeaders.map((h) =>
          h.key === "X-Frame-Options" ? { ...h, value: "SAMEORIGIN" } : h,
        ),
      },
      {
        source: "/brand/business-loan-pack-2026.html",
        headers: securityHeaders.map((h) =>
          h.key === "X-Frame-Options" ? { ...h, value: "SAMEORIGIN" } : h,
        ),
      },
      {
        source: "/brand/pitch-deck-2026.html",
        headers: securityHeaders.map((h) =>
          h.key === "X-Frame-Options" ? { ...h, value: "SAMEORIGIN" } : h,
        ),
      },
    ];
  },
};

export default nextConfig;
