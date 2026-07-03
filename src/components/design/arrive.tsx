"use client";

/**
 * The Arrival — the /design page's only scroll effect.
 *
 * Content enters with a 16px rise over --motion-slow on spring-glide,
 * once, when it crosses into view. One curve, one duration, everywhere
 * on the page — the consistency is the point (motion contract; the
 * page documents its own discipline in §6).
 *
 * Reduced motion: the CSS neutralises the transition entirely, so this
 * observer's class flip is a no-op visual — content is simply present.
 */

import { useEffect, useRef } from "react";

export function Arrive({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            node.classList.add("is-in");
            io.disconnect();
          }
        }
      },
      { threshold: 0.18 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement & HTMLElement>} className={`dsn-arrive ${className}`}>
      {children}
    </Tag>
  );
}
