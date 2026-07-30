"use client";

import { useState } from "react";

/**
 * The closing dot of /design, and the page's one piece of quiet delight:
 * poke it and it answers with a small volume-held bounce, shadow in sync.
 * Undocumented on purpose — a character moment, not a feature. Because it
 * visibly invites a press, it is a real button with keyboard parity. Reduced
 * motion is handled in the page CSS (the poke class simply does nothing).
 */
export function RestDot() {
  const [poked, setPoked] = useState(false);

  return (
    <button
      type="button"
      className={`dsn-rest relative mb-7 h-11 w-11 cursor-pointer border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--ink)]${poked ? " is-poked" : ""}`}
      aria-label="Poke Dot"
      style={{ touchAction: "manipulation" }}
      onClick={() => {
        // Remove-then-add on the next frame so a second poke restarts cleanly.
        setPoked(false);
        requestAnimationFrame(() => setPoked(true));
      }}
      onAnimationEnd={() => setPoked(false)}
    >
      <span aria-hidden className="absolute left-1/2 top-1/2 h-[18px] w-[16px] -translate-x-1/2 -translate-y-1/2">
        <span className="dsn-rest-dot absolute left-[1px] top-0" />
        <span className="dsn-rest-shadow absolute bottom-0 left-1/2 h-[3px] w-[16px] -translate-x-1/2 rounded-full" />
      </span>
    </button>
  );
}
