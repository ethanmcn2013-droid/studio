"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Root error boundary, Studio.
 *
 * Voice: calm, anxiety-reducing. Never leads with "error" or "fail".
 * Two actions: reset the boundary, or navigate home.
 */
export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[studio-error]", error);
  }, [error]);

  return (
    <div
      id="main"
      tabIndex={-1}
      className="flex min-h-screen flex-col items-center justify-center px-6"
      style={{ background: "var(--bg)" }}
    >
      <div
        className="w-full max-w-[440px] rounded-2xl border p-8 text-center"
        style={{
          background: "var(--bg-elev)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow-3)",
        }}
      >
        <div
          className="mb-3 text-[10.5px] font-semibold uppercase"
          style={{ color: "var(--ink-quiet)", letterSpacing: "var(--tracking-eyebrow)" }}
        >
          Unexpected pause
        </div>

        <h1
          className="text-balance text-[20px] font-semibold leading-snug tracking-[-0.015em]"
          style={{ color: "var(--ink)" }}
        >
          Something didn&rsquo;t load.
        </h1>

        <p
          className="mx-auto mt-2.5 max-w-[38ch] text-[13px] leading-[1.55]"
          style={{ color: "var(--ink-soft)" }}
        >
          Try again, or go back to the products.
        </p>

        {error.digest ? (
          <p
            className="mt-3 font-mono text-[10.5px] tabular-nums"
            style={{ color: "var(--ink-quiet)" }}
          >
            ref &middot; {error.digest}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center rounded-full px-4 py-2 text-[13px] font-medium text-white transition-transform hover:-translate-y-px"
            style={{
              background: "var(--ink)",
              boxShadow: "0 8px 20px -8px rgba(20,21,26,0.4)",
            }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border px-4 py-2 text-[13px] font-medium transition-colors"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-elev)",
              color: "var(--ink-soft)",
            }}
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
