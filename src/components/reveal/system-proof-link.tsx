"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

export function SystemProofLink({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanupRef.current?.(), []);

  function moveToProof(event: MouseEvent<HTMLAnchorElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const target = document.getElementById("system");
    const heading = document.getElementById("relay-title");
    if (!target || !heading) return;
    event.preventDefault();
    cleanupRef.current?.();

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finish = () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
      heading.focus({ preventScroll: true });
    };

    if (window.location.hash !== "#system") {
      window.history.pushState(null, "", "#system");
    }
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    if (reduce) {
      finish();
      return;
    }

    let timer = window.setTimeout(finish, 520);
    const onScrollEnd = () => finish();
    window.addEventListener("scrollend", onScrollEnd, { once: true });
    cleanupRef.current = () => {
      window.clearTimeout(timer);
      timer = 0;
      window.removeEventListener("scrollend", onScrollEnd);
    };
  }

  return (
    <a className={className} href="#system" onClick={moveToProof}>
      {children}
    </a>
  );
}
