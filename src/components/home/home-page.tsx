import type { ReactNode } from "react";
import { HomeBoot, HomeBootScript } from "./home-boot";
import { HomeClose, HomeVenue, HomeWho, HomeWords, HomeYours } from "./home-closing";
import { HomeHeader } from "./home-header";
import { HomeHero } from "./home-hero";
import { HomeAnalytics, HomeFiles, HomeProjects, HomeTimeline } from "./home-sections";
import { HomeTasks } from "./home-tasks";
import { HomeWhiteboard } from "./home-whiteboard";
import { THEME_KEY } from "./theme-color";
import "./home.css";

/* Runs while the page is parsed, before anything is painted or fetched.
   It settles the theme on the page root (?theme=light|dark, else the
   visitor's last choice, else the device setting, else dark) and marks the
   root as scripted. The product captures carry the dark file in the markup:
   in the light theme each one is pointed at its light file as the parser
   adds it, before it is fetched. bootHome() in home-runtime.ts is the same
   thing for arrivals by client-side link, where inline scripts do not run. */
const BOOT = `(function(){var d=document.currentScript&&document.currentScript.parentNode;if(!d||/(^| )js( |$)/.test(d.className))return;var t=null;try{t=new URLSearchParams(location.search).get("theme")}catch(e){}if(t!=="light"&&t!=="dark"){try{t=localStorage.getItem("${THEME_KEY}")}catch(e){}}if(t!=="light"&&t!=="dark")t=window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.setAttribute("data-theme",t);d.className+=" js";if(t==="light"&&window.MutationObserver){var f=function(n){if(n.nodeName==="IMG"&&n.getAttribute("data-shot")){n.setAttribute("srcset",n.getAttribute("srcset").replace(/-dark-/g,"-light-"));n.setAttribute("src",n.getAttribute("src").replace("-dark-","-light-"))}};var mo=new MutationObserver(function(rs){rs.forEach(function(r){for(var i=0;i<r.addedNodes.length;i++){var n=r.addedNodes[i];if(n.nodeType!==1)continue;f(n);var q=n.querySelectorAll("img[data-shot]");for(var k=0;k<q.length;k++)f(q[k])}})});mo.observe(d,{childList:true,subtree:true});document.addEventListener("DOMContentLoaded",function(){mo.disconnect()})}})();`;

/**
 * The public home page (founder pick, 2 October 2026: "A, One Friday, with
 * parts of B and C"; round 2 the same day). Dark first, with a light theme
 * scoped to this root by `data-theme`; the rest of the marketing estate stays
 * light. The global site nav hides itself on `/` and this page renders its
 * own header.
 *
 * The order is the header's: the sample, who it is for, Projects, the Friday
 * story, Timeline, Files, the same thing in other trades' words, Analytics,
 * Whiteboard, plain words, venues and the form.
 *
 * The markup is static and complete: every frame has its size in the HTML,
 * so the page is its final length before any script runs and reads with no
 * script at all. home-runtime.ts drives it after hydration. `children` is
 * the shared site footer, which sits inside the root so it takes the page's
 * theme from the design system's own dark mapping.
 */
export function HomePage({ children }: { children: ReactNode }) {
  return (
    <div className="lp" data-theme="dark" suppressHydrationWarning>
      <HomeBootScript code={BOOT} />
      <HomeHeader />
      <noscript>
        <p className="noscript">This page reads in full without JavaScript. The sample, the tabs and the whiteboard need it to respond.</p>
      </noscript>
      <main id="main" tabIndex={-1}>
        <HomeHero />
        <HomeWho />
        <HomeProjects />
        <HomeTasks />
        <HomeTimeline />
        <HomeFiles />
        <HomeYours />
        <HomeAnalytics />
        <HomeWhiteboard />
        <HomeWords />
        <HomeVenue />
        <HomeClose />
      </main>
      {/* The dot is the mascot. It hops along the line, sends out a signal
          each time it lands, and settles into the ring to make the mark. It
          plays once; the button plays it again. Still under reduced motion. */}
      <div className="lp-foot">
        <div className="wrap">
          <button className="dotrun" id="dotrun" type="button" aria-label="Play the dot run again">
            <span className="dotrun-line"></span>
            <span className="dotrun-ring" id="dotrun-ring"></span>
            <span className="dotrun-dot" id="dotrun-dot"></span>
            <span className="dotrun-cap mono" aria-hidden="true">Play it again</span>
          </button>
        </div>
      </div>
      <div className="lp-footer">{children}</div>
      <div className="vh" aria-live="polite" id="live"></div>
      <HomeBoot />
    </div>
  );
}
