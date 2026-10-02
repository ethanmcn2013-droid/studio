import type { ReactNode } from "react";
import { HomeBoot, HomeBootScript } from "./home-boot";
import { HomeClosing } from "./home-closing";
import { HomeHeader } from "./home-header";
import { HomeHero } from "./home-hero";
import { HomeSections } from "./home-sections";
import { HomeTasks } from "./home-tasks";
import { HomeWhiteboard } from "./home-whiteboard";
import { SHOT_BOOT } from "./shot-sources";
import "./home.css";

/* Runs while the page is parsed, before anything is painted or fetched.
   It settles the theme on the page root (?theme=light|dark, else the device
   setting, else dark) and marks the root as scripted. The product captures
   carry the dark file in the markup: as the parser adds each one, in the
   light theme it is pointed at its light file, and a capture that sits
   behind another (a later scene, an unopened tab) gives up its src until
   the runtime asks for it. bootHome() in home-runtime.ts is the same thing
   for arrivals by client-side link, where inline scripts do not run. */
const BOOT = `(function(){var d=document.currentScript&&document.currentScript.parentNode;if(!d||/(^| )js( |$)/.test(d.className))return;var t=null;try{t=new URLSearchParams(location.search).get("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=window.matchMedia&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";d.setAttribute("data-theme",t);d.className+=" js";${SHOT_BOOT}if(window.MutationObserver&&window.IntersectionObserver){var mo=new MutationObserver(function(rs){rs.forEach(function(r){for(var i=0;i<r.addedNodes.length;i++){var n=r.addedNodes[i];if(n.nodeName!=="IMG"||!n.getAttribute("data-shot"))continue;var c=r.target.className;if(/(^| )(layer|stack)( |$)/.test(c)&&!/(^| )on( |$)/.test(c)){n.removeAttribute("srcset");n.removeAttribute("src")}else if(t==="light"){var u=S(n.getAttribute("data-shot"),"light");n.setAttribute("srcset",u[1]);n.setAttribute("src",u[0])}}})});mo.observe(d,{childList:true,subtree:true});document.addEventListener("DOMContentLoaded",function(){mo.disconnect()})}})();`;

/**
 * The public home page (founder pick, 2 October 2026: "A, One Friday, with
 * parts of B and C"). Dark first, with a light theme scoped to this root by
 * `data-theme`; the rest of the marketing estate stays light. The global
 * site nav hides itself on `/` and this page renders its own header.
 *
 * The markup is static. home-runtime.ts drives it after hydration and the
 * finished still is in the HTML, so it reads with no script at all.
 * `children` is the locked site footer, which sits inside the root so it
 * takes the page's theme from the design system's own dark mapping.
 */
export function HomePage({ children }: { children: ReactNode }) {
  return (
    <div className="lp" data-theme="dark" suppressHydrationWarning>
      <HomeBootScript code={BOOT} />
      <HomeHeader />
      <main id="main" tabIndex={-1}>
        <HomeHero />
        <HomeTasks />
        <HomeSections />
        <HomeWhiteboard />
        <HomeClosing />
      </main>
      {/* The dot is the mascot. It hops along the line, sends out a signal
          each time it lands, and settles into the ring to make the mark.
          Decorative: hidden from screen readers, still under reduced motion. */}
      <div className="lp-foot">
        <div className="wrap">
          <div className="dotrun" id="dotrun" aria-hidden="true" title="Play it again">
            <span className="dotrun-line"></span>
            <span className="dotrun-ring" id="dotrun-ring"></span>
            <span className="dotrun-dot" id="dotrun-dot"></span>
          </div>
        </div>
      </div>
      <div className="lp-footer">{children}</div>
      <div className="vh" aria-live="polite" id="live"></div>
      <HomeBoot />
    </div>
  );
}
