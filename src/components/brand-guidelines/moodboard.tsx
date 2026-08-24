"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type MoodMode = "cloud" | "columns";

const IMAGES = [
  { src: "/brand/guidelines/moodboard/run-sheet.webp", alt: "A marked wedding run sheet, clipboard, venue plan, and indigo pen.", w: 1536, h: 1024 },
  { src: "/brand/guidelines/moodboard/venue-preparation.webp", alt: "Venue staff check a run sheet while preparing a table.", w: 1152, h: 1402 },
  { src: "/brand/guidelines/moodboard/workshop-table.webp", alt: "Workshop cards, notebook, ruler, clips, and one indigo card.", w: 1254, h: 1254 },
  { src: "/brand/guidelines/moodboard/irish-city-texture.webp", alt: "Rain on an Irish street beside a white wall, black window, and a small indigo object.", w: 1536, h: 960 },
  { src: "/brand/guidelines/applications/notes-wedding.webp", alt: "Signal Notes wedding project surface.", w: 1280, h: 900 },
  { src: "/brand/guidelines/applications/tasks-board.webp", alt: "Signal Tasks project board.", w: 1280, h: 900 },
  { src: "/brand/guidelines/applications/timeline-wedding.webp", alt: "Signal Timeline public wedding plan.", w: 1280, h: 900 },
  { src: "/brand/guidelines/applications/signal-briefing.webp", alt: "Signal daily briefing surface.", w: 1280, h: 800 },
  { src: "/brand/guidelines/applications/studio-home.webp", alt: "Signal Studio public home page.", w: 1280, h: 800 },
  { src: "/brand/collateral/identity/campaign-poster-preview.png", alt: "Signal Studio campaign poster on an ink field.", w: 3280, h: 4596 },
  { src: "/brand/collateral/venue/venue-onepager-preview.png", alt: "Signal Studio venue one-page guide.", w: 1694, h: 2350 },
  { src: "/brand/collateral/identity/founder-card-front-preview.png", alt: "Signal Studio founder card.", w: 748, h: 522 },
  { src: "/brand/collateral/identity/founder-card-back-preview.png", alt: "Signal Studio founder card reverse.", w: 748, h: 522 },
  { src: "/brand/collateral/identity/email-signature-preview.png", alt: "Signal Studio email signature.", w: 1580, h: 720 },
  { src: "/brand/collateral/social/s1-number-n01-ig-square.png", alt: "Signal Studio numbered social post.", w: 1080, h: 1080 },
  { src: "/brand/collateral/social/s3-beforeafter-owner-ig-portrait.png", alt: "Signal Studio before-and-after campaign post.", w: 1080, h: 1350 },
  { src: "/brand/collateral/cards/cardx-indigo-front-preview.png", alt: "Indigo Signal Studio card front.", w: 748, h: 522 },
  { src: "/brand/collateral/cards/cardx-paper-back-preview.png", alt: "Paper Signal Studio card reverse.", w: 748, h: 522 },
  { src: "/brand/assets/motion/notes-demo.png", alt: "Signal Notes motion study.", w: 1600, h: 900 },
  { src: "/brand/assets/motion/timeline-demo.png", alt: "Signal Timeline motion study.", w: 1600, h: 900 },
] as const;

export function Moodboard() {
  const [mode, setMode] = useState<MoodMode>("cloud");
  const [selected, setSelected] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const open = (index: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setSelected(index);
    dialogRef.current?.showModal();
  };

  const close = () => {
    dialogRef.current?.close();
    setSelected(null);
    openerRef.current?.focus();
  };

  return (
    <div className="guidelines-moodboard">
      <div
        className="guidelines-segmented"
        role="group"
        aria-label="Moodboard layout"
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          setMode((value) => value === "cloud" ? "columns" : "cloud");
        }}
      >
        <button type="button" aria-pressed={mode === "cloud"} onClick={() => setMode("cloud")}>
          Cloud
        </button>
        <button type="button" aria-pressed={mode === "columns"} onClick={() => setMode("columns")}>
          Columns
        </button>
      </div>

      <div className="guidelines-moodboard-grid" data-mode={mode}>
        {IMAGES.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            className="guidelines-moodboard-item"
            style={{ "--mood-index": index } as React.CSSProperties}
            aria-label={`Open image: ${image.alt}`}
            onClick={(event) => open(index, event.currentTarget)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.w}
              height={image.h}
              sizes={mode === "cloud" ? "(max-width: 768px) 45vw, 24vw" : "(max-width: 768px) 50vw, 25vw"}
            />
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="guidelines-moodboard-dialog"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        {selected !== null ? (
          <div>
            <button type="button" onClick={close}>Close</button>
            <Image
              src={IMAGES[selected].src}
              alt={IMAGES[selected].alt}
              width={IMAGES[selected].w}
              height={IMAGES[selected].h}
              sizes="92vw"
            />
            <p>{IMAGES[selected].alt}</p>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
