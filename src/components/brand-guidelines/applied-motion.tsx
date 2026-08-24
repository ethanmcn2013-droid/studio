"use client";

import { useState, type CSSProperties, type PointerEvent } from "react";

const APPLIED_MOTION = [
  ["Arrival", "The destination says its own name."],
  ["Acknowledgement", "The pressed control answers before the next state."],
  ["Suite handoff", "The current product yields to the destination."],
  ["State change", "The changed object moves, not the whole screen."],
  ["Reveal", "Order appears in the order it should be read."],
] as const;

function AppliedMotionCard({
  title,
  copy,
  index,
}: {
  title: string;
  copy: string;
  index: number;
}) {
  const [sequence, setSequence] = useState(0);
  const [frozen, setFrozen] = useState(false);

  const replay = () => {
    setFrozen(false);
    setSequence((value) => value + 1);
  };

  const replayForPointer = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType === "mouse" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !frozen
    ) {
      replay();
    }
  };

  return (
    <article
      style={{ "--motion-index": index } as CSSProperties}
      data-frozen={frozen || undefined}
      onPointerEnter={replayForPointer}
    >
      <div aria-hidden>
        <span key={sequence} className="guidelines-applied-motion-dot" />
      </div>
      <h4>{title}</h4>
      <p>{copy}</p>
      <div className="guidelines-motion-demo-controls">
        <button type="button" onClick={replay}>
          Replay
        </button>
        <button
          type="button"
          aria-pressed={frozen}
          onClick={() => {
            if (frozen) replay();
            else setFrozen(true);
          }}
        >
          {frozen ? "Resume" : "Freeze"}
        </button>
      </div>
    </article>
  );
}

export function AppliedMotion() {
  return (
    <div className="guidelines-applied-motion">
      {APPLIED_MOTION.map(([title, copy], index) => (
        <AppliedMotionCard key={title} title={title} copy={copy} index={index} />
      ))}
    </div>
  );
}
