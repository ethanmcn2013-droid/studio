"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * A printed card that shows its reverse: hover (or click, or Enter) turns
 * the card over briefly, then it settles back to the front on its own.
 * One-shot with a hold, not a hover-held state, so the gesture reads as
 * "picking the card up to look at the back" rather than a UI toggle.
 *
 * `back` is optional; `backFace` lets a card carry a live-typeset
 * reverse instead of an image (the Founding Partner card's reverse is
 * set in code: the founder's address and the same-day promise).
 *
 * Reduced motion: the turn is instant (no rotation travels), same hold.
 */

const FLIP_MS = 640;
const HOLD_MS = 1150;

export function FlipCard({
  front,
  back,
  backFace,
  frontAlt,
  backAlt,
  width,
  height,
}: {
  front: string;
  back?: string;
  backFace?: React.ReactNode;
  frontAlt: string;
  backAlt: string;
  width: number;
  height: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const busy = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const turn = () => {
    if (busy.current) return;
    busy.current = true;
    setFlipped(true);
    timers.current.push(
      setTimeout(() => {
        setFlipped(false);
        timers.current.push(
          setTimeout(() => {
            busy.current = false;
          }, FLIP_MS),
        );
      }, FLIP_MS + HOLD_MS),
    );
  };

  return (
    <div
      className="dsn-flip"
      data-flipped={flipped}
      role="button"
      tabIndex={0}
      aria-label={`${frontAlt} Turn the card to see the reverse: ${backAlt}`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") turn();
      }}
      onClick={turn}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          turn();
        }
      }}
    >
      <div className="dsn-flip-inner">
        <div className="dsn-flip-face dsn-flip-front">
          <Image
            src={front}
            alt={frontAlt}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, (max-width: 1240px) 50vw, 400px"
            className="h-auto w-full"
          />
        </div>
        <div className="dsn-flip-face dsn-flip-back" aria-hidden>
          {back ? (
            <Image
              src={back}
              alt=""
              width={width}
              height={height}
              sizes="(max-width: 768px) 100vw, (max-width: 1240px) 50vw, 400px"
              className="h-auto w-full"
            />
          ) : (
            (backFace ?? (
              <span className="dsn-flip-blank">
                <i />
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
