"use client";

import { useState } from "react";

/**
 * The closing dot of /design, and the page's one piece of quiet delight:
 * poke it and it answers with a small volume-held bounce, shadow in sync.
 * Undocumented on purpose — a character moment, not a feature. Decorative
 * (parent stays aria-hidden), so no button semantics; reduced motion is
 * handled in the page CSS (the poke class simply does nothing).
 */
export function RestDot() {
  const [poked, setPoked] = useState(false);

  return (
    <div
      className={`dsn-rest relative mb-7 h-[18px] w-[14px] cursor-pointer${poked ? " is-poked" : ""}`}
      aria-hidden
      style={{ touchAction: "manipulation" }}
      onPointerDown={() => {
        // Remove-then-add on the next frame so a second poke restarts cleanly.
        setPoked(false);
        requestAnimationFrame(() => setPoked(true));
      }}
      onAnimationEnd={() => setPoked(false)}
    >
      <span className="dsn-rest-dot absolute top-0" />
      <span className="dsn-rest-shadow absolute bottom-0 left-1/2 h-[3px] w-[16px] -translate-x-1/2 rounded-full" />
    </div>
  );
}
