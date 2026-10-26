import LandingV3 from "./landing-v3";

/* Sets the theme class on the page root before first paint: ?theme=light|dark, else the device setting.
   The client component reads the same value after hydration, so the page never flashes the wrong theme. */
const BOOT = `(function(){try{var t=new URLSearchParams(location.search).get("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";if(new URLSearchParams(location.search).get("theme"))document.documentElement.dataset.lv3Theme=t;var r=document.querySelector(".ss");if(r&&t==="dark")r.classList.add("dark");}catch(e){}})();`;

/**
 * The public home page, redesign v3 (Design canvas, October 2026). The page renders its own header,
 * footer and waitlist; the waitlist posts to the real joinWaitlistAction.
 */
export function LandingPage() {
  return (
    <>
      <LandingV3 />
      <script dangerouslySetInnerHTML={{ __html: BOOT }} />
    </>
  );
}
