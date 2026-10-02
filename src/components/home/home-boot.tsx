"use client";

import { useEffect, useLayoutEffect } from "react";
import { bootHome, startHome } from "./home-runtime";

/**
 * The inline boot script, first thing inside the page root. In the server's
 * HTML it is an ordinary script and runs while the page is parsed. When
 * React builds the page in the browser (arriving by a client-side link) a
 * script it creates never runs, so there it is typed as plain text, which
 * says so honestly, and bootHome() below does the same work instead.
 */
export function HomeBootScript({ code }: { code: string }) {
  return (
    <script
      type={typeof window === "undefined" ? undefined : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}

/**
 * Starts the home page runtime once the markup is in the document and stops
 * it, with everything it started, when the page leaves. The layout effect
 * settles the theme before paint when the inline boot script did not run.
 */
export function HomeBoot() {
  useLayoutEffect(() => {
    bootHome(document.querySelector(".lp"));
  }, []);
  useEffect(() => startHome(document.querySelector(".lp")), []);
  return null;
}
