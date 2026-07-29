"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";
import type { ProductId } from "@/lib/product-urls";

type PreviewMotionContextValue = {
  hasStarted: boolean;
  isVisible: boolean;
};

const PreviewMotionContext = createContext<PreviewMotionContextValue>({
  // Product heroes render outside this boundary and keep their existing
  // immediate-on-mount choreography.
  hasStarted: true,
  isVisible: true,
});

export function useMarketingPreviewMotion(): PreviewMotionContextValue {
  return useContext(PreviewMotionContext);
}

/**
 * Starts an embedded product proof when its frame enters the visitor's reading
 * zone. The server-rendered settled frame remains present before hydration, so
 * there is no blank placeholder or layout shift.
 */
export function MarketingPreviewMotion({
  children,
  product,
}: {
  children: ReactNode;
  product: ProductId;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [observed, setObserved] = useState({
    hasStarted: false,
    isVisible: false,
  });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    if (typeof IntersectionObserver === "undefined") {
      const fallbackFrame = requestAnimationFrame(() => {
        setObserved({ hasStarted: true, isVisible: true });
      });
      return () => cancelAnimationFrame(fallbackFrame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        setObserved((current) => {
          const isVisible = entry.isIntersecting;
          const hasStarted = current.hasStarted || isVisible;
          if (
            current.hasStarted === hasStarted &&
            current.isVisible === isVisible
          ) {
            return current;
          }
          return { hasStarted, isVisible };
        });
      },
      {
        // Begin as the frame reaches the lower reading zone, so the opening
        // beat is underway by the time the product proof reaches centre.
        rootMargin: "0px 0px -18% 0px",
        threshold: 0,
      },
    );

    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  const hasStarted = observed.hasStarted && !reduceMotion;
  const isVisible = observed.isVisible && !reduceMotion;
  const motionState = !hasStarted
    ? "static"
    : isVisible
      ? "playing"
      : "paused";
  const contextValue = useMemo(
    () => ({ hasStarted, isVisible }),
    [hasStarted, isVisible],
  );

  return (
    <PreviewMotionContext.Provider value={contextValue}>
      <div
        className="reveal-relay-preview marketing-preview-motion"
        data-motion-started={hasStarted ? "true" : "false"}
        data-motion-state={motionState}
        data-motion-visible={isVisible ? "true" : "false"}
        data-product={product}
        data-relay-motion
        ref={frameRef}
      >
        {children}
      </div>
    </PreviewMotionContext.Provider>
  );
}
