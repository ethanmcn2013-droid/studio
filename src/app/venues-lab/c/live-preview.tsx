"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The relay preview shell, with one behaviour added.
 *
 * WHY THIS EXISTS. The two live product surfaces on this page animate on
 * mount. On the homepage they mount near the fold. Here they mount roughly
 * two viewport heights below it, so the Timeline's 1.77s rail draw used to
 * start and finish while the reader was still in the hero, and the only real
 * choreography on the page was never seen by anybody.
 *
 * The fix keeps the surface SERVER-RENDERED — the product is real HTML in the
 * document source, not a client-side placeholder, which is the whole point of
 * embedding it — and replays it once, by key, at the moment it actually
 * enters the viewport. Readers who prefer reduced motion are never remounted,
 * so for them the surface renders once and stays put.
 *
 * No shared component is touched.
 */
export function LivePreview({
  product,
  sample,
  className,
  children,
}: {
  product: string;
  sample: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [pass, setPass] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          setPass((current) => current + 1);
        }
      },
      { threshold: 0.18 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        className ? `reveal-relay-preview ${className}` : "reveal-relay-preview"
      }
      data-product={product}
    >
      <p className="reveal-relay-sample">{sample}</p>
      <div key={pass}>{children}</div>
    </div>
  );
}
