"use client";

/**
 * The film slot.
 *
 * Built to the spec already ratified for the private film page: 16:9 reserved
 * by `aspect-ratio` so the box never collapses, poster first, click to play,
 * never autoplay, a `.vtt` captions track wired in.
 *
 * No film file exists yet, so the empty state is the state that ships and it
 * is treated as the design problem it actually is: a reserved frame with
 * registration marks, a ghosted play mark, and the honest line about what
 * belongs here. The frame itself is `.reveal-relay-preview`, the same product
 * chrome the timeline sits in, supplied by the page.
 *
 * PANEL 2026-08-03. The 9px "16 : 9" corner mark is gone. It was --ink-ghost
 * on --paper-deep at 1.34:1, a WCAG 1.4.3 failure, and it restated an aspect
 * note the copy column already carried 40px away.
 *
 * When the founder supplies the file, pass `src` (and `captionsSrc`, `poster`)
 * and the same frame becomes the player with nothing else to change.
 */

import { useRef, useState } from "react";

export type FilmSlotProps = Readonly<{
  aspect: string;
  placeholder: string;
  posterAlt: string;
  src?: string;
  poster?: string;
  captionsSrc?: string;
}>;

const CORNERS = ["tl", "tr", "bl", "br"] as const;

function PlayMark() {
  return (
    <span className="vb-film-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M8 5.2v13.6L19 12 8 5.2Z" />
      </svg>
    </span>
  );
}

export function FilmSlot({
  aspect,
  placeholder,
  posterAlt,
  src,
  poster,
  captionsSrc,
}: FilmSlotProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  if (!src) {
    return (
      // No role="img" on purpose. The marks are decoration and the placeholder
      // line is the real, readable state of this slot, so it should reach a
      // screen reader as text rather than as alt copy.
      <div className="vb-film" style={{ aspectRatio: aspect }}>
        {CORNERS.map((corner) => (
          <span
            className="vb-film-crop"
            data-corner={corner}
            key={corner}
            aria-hidden="true"
          />
        ))}

        <div className="vb-film-centre">
          <PlayMark />
          <p className="vb-film-line">{placeholder}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vb-film" style={{ aspectRatio: aspect }}>
      <video
        ref={videoRef}
        className="vb-film-media"
        aria-label={posterAlt}
        poster={poster}
        preload="metadata"
        controls={playing}
        playsInline
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={src} type="video/mp4" />
        <track kind="captions" src={captionsSrc} srcLang="en" label="English" default />
      </video>

      {playing ? null : (
        <button
          type="button"
          className="vb-film-play"
          onClick={() => {
            setPlaying(true);
            void videoRef.current?.play();
          }}
        >
          <PlayMark />
          <span className="vb-film-play-label">Play the film</span>
        </button>
      )}
    </div>
  );
}
