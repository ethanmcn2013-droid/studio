"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * A printed card that shows its reverse. Fine-pointer hover previews it;
 * click, Enter, or Space pins the chosen face; Escape returns to the front.
 * The interaction never steals a state the reader explicitly selected.
 *
 * `back` is optional; `backFace` lets a card carry a live-typeset
 * reverse instead of an image (the Founding Partner card's reverse is
 * set in code: the founder's address and the same-day promise).
 *
 * Reduced motion: the face changes instantly.
 */

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
  const [locked, setLocked] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const flipped = locked || previewing;
  const toggle = () => {
    setPreviewing(false);
    setLocked((value) => !value);
  };

  return (
    <div
      className="dsn-flip"
      data-flipped={flipped}
      role="button"
      tabIndex={0}
      aria-pressed={locked}
      aria-label={
        locked
          ? `${backAlt} Reverse shown. Activate to return to ${frontAlt}`
          : `${frontAlt} Activate to keep the reverse visible: ${backAlt}`
      }
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse" && !locked) setPreviewing(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === "mouse") setPreviewing(false);
      }}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        } else if (e.key === "Escape" && locked) {
          e.preventDefault();
          setLocked(false);
        }
      }}
    >
      <div className="dsn-flip-inner">
        <div className="dsn-flip-face dsn-flip-front" aria-hidden={flipped}>
          <Image
            src={front}
            alt={frontAlt}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, (max-width: 1240px) 50vw, 400px"
            className="h-auto w-full"
          />
        </div>
        <div className="dsn-flip-face dsn-flip-back" aria-hidden={!flipped}>
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
