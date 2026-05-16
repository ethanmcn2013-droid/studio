import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

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

const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https:`,
  `font-src 'self' data:`,
  `connect-src 'self' https://va.vercel-scripts.com`,
  `frame-src 'self'`,
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
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()" },
];

// ── CSP enforce-promotion gate (hardening P2, 2026-05-16) ──────────
// CSP has run Report-Only in production since Plan 4.1 (2026-05-09) —
// the "≥1 deploy cycle in Report-Only" bar is met by history. It is
// kept Report-Only for THIS pass on purpose (the hardening goal's P2
// rail), because there is no report-uri/report-to endpoint collecting
// violations, so promotion would be blind. Next hardening pass:
// (1) swap key to `Content-Security-Policy`, (2) re-add
// `upgrade-insecure-requests` to the csp array (it is a no-op + console
// spam under Report-Only, which is why it is absent above), (3) keep
// `va.vercel-scripts.com` (Vercel Analytics, pre-existing) and `blob:`
// in img-src (client-rendered image data) — both are intentional
// deviations from a generic CSP template, not gaps.

const nextConfig: NextConfig = {
  // Bundle the per-entry dispatch files into the /dispatch + RSS server
  // functions. Without this, readDispatchEntries() in src/lib/changelog.ts
  // hits ENOENT on Vercel (content/dispatch/*.md sits outside the
  // .next/standalone tracing window) and Next falls through to 404.
  outputFileTracingIncludes: {
    "/dispatch": ["./content/dispatch/*.md"],
    "/changelog.rss": ["./content/dispatch/*.md"],
    // The OG generator reads this bundled font off disk at runtime;
    // without this it sits outside the standalone trace and the route
    // renders an empty image on Vercel (the original bug, in a new form).
    "/opengraph-image": ["./src/app/_og-assets/*.ttf"],
  },
  // The apex is a typographic site — one inline SVG logo, no raster
  // images flow through next/image today. This is correct future-proofing:
  // any image that does get optimized is served AVIF→WebP→original.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      // ── Caching (hardening P8) ──────────────────────────────────
      // Hashed assets (/_next/static/*) are already served
      // `max-age=31536000, immutable` by Vercel/Next automatically,
      // and static HTML is CDN-cached with stale-while-revalidate by
      // the Vercel edge — those are platform defaults, not gaps, and
      // fighting them via next.config is fragile, so they're left to
      // the platform.
      //
      // The real gap: /public assets ship `max-age=0, must-revalidate`
      // by default because they aren't content-hashed. The brand SVGs
      // are stable identity assets — give them the year+immutable
      // treatment P8 asks for. Contract: a logo that changes content
      // MUST change filename (or be cache-busted) — same discipline
      // the brand hub already follows for asset versioning.
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

// Bundle analyzer (hardening P6) — only active with ANALYZE=true so it
// never touches a normal or production build. Emits .next/analyze/*.html.
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
})(nextConfig);
