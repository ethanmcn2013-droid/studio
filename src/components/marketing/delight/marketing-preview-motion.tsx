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
  ariaLabelledby,
  children,
  product,
  startDelayMs = 0,
}: {
  ariaLabelledby?: string;
  children: ReactNode;
  product: ProductId;
  startDelayMs?: number;
}) {
  const frameRef = useRef<HTMLElement>(null);
  const hasStartedRef = useRef(false);
  const startTimerRef = useRef<number | null>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [observed, setObserved] = useState({
    hasStarted: false,
    isVisible: false,
  });

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    if (typeof IntersectionObserver === "undefined") {
      startTimerRef.current = window.setTimeout(() => {
        hasStartedRef.current = true;
        setObserved({ hasStarted: true, isVisible: true });
      }, startDelayMs);
      return () => {
        if (startTimerRef.current !== null) {
          window.clearTimeout(startTimerRef.current);
        }
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        setObserved((current) => {
          const isVisible = entry.isIntersecting;
          if (
            current.isVisible === isVisible
          ) {
            return current;
          }
          return { ...current, isVisible };
        });

        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          startTimerRef.current = window.setTimeout(() => {
            setObserved((current) => ({
              ...current,
              hasStarted: true,
            }));
          }, startDelayMs);
        }
      },
      {
        // Begin as the frame reaches the lower reading zone, so the opening
        // beat is underway by the time the product proof reaches centre.
        rootMargin: "0px 0px -18% 0px",
        threshold: 0,
      },
    );

    observer.observe(frame);
    return () => {
      observer.disconnect();
      if (startTimerRef.current !== null) {
        window.clearTimeout(startTimerRef.current);
      }
    };
  }, [startDelayMs]);

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
      <figure
        aria-labelledby={ariaLabelledby}
        className="reveal-relay-preview marketing-preview-motion"
        data-motion-started={hasStarted ? "true" : "false"}
        data-motion-state={motionState}
        data-motion-visible={isVisible ? "true" : "false"}
        data-product={product}
        data-relay-motion
        ref={frameRef}
      >
        {children}
      </figure>
    </PreviewMotionContext.Provider>
  );
}
