import { FILM } from "@/lib/venue-copy";
import styles from "./venue-a.module.css";

type FilmSlotProps = {
  /** The rendered master. Absent today; the founder supplies the file later. */
  src?: string;
  /** Poster frame, shown before the first click. Never autoplay. */
  poster?: string;
  /** WebVTT captions track. */
  captions?: string;
};

/**
 * The film slot, wearing the house preview chrome.
 *
 * `.reveal-relay-preview` is the house frame for a first-class object, so the
 * film sits inside it rather than in a bespoke box. That is the whole point:
 * when the file arrives it drops into a frame the page already treats as a
 * first-class object.
 *
 * It does NOT wear `.reveal-relay-sample`. That label reads "Sample product
 * view", which is what the two live surfaces above it are and what a film is
 * not. The frame's title and its reserved-state label live beside it in
 * page.tsx, so this box carries two lines rather than four.
 *
 * Built to the spec ratified for the private film page: 16:9 reserved by
 * `aspect-ratio` so the box never collapses or shifts layout, poster first,
 * click to play, never autoplay, a `.vtt` track element wired and ready.
 *
 * No film file exists in the repo today, so the empty state is the state that
 * ships and the state that gets reviewed. It is drawn deliberately, and it is
 * quiet on purpose: the ratified placeholder line alone on the deep ground,
 * with the frame's title, its Reserved mark and its ratified note beside it
 * in page.tsx. An earlier build put an inert play disc here so the frame
 * would read as a film; a disc that cannot play is a control that lies, and
 * a sighted reader who clicks it learns nothing except that the page has a
 * dead button. The rendered master format (16:9, 1920x1080) lives in the
 * comment on FILM in venue-copy.ts, where its audience is: the only reader
 * a production spec serves is the studio, not a venue owner or the partner
 * the page was forwarded to.
 *
 * ACCESSIBILITY. The empty state is a `role="group"` carrying FILM.posterAlt,
 * not a `role="img"`. `role="img"` collapses its subtree, so a screen reader
 * announced the label and never reached the visible placeholder line inside
 * it, giving sighted and non-sighted readers different copy from the same
 * ratified constant.
 */
export function FilmSlot({ src, poster, captions }: FilmSlotProps) {
  return (
    <div className="reveal-relay-preview">
      <div className={styles.filmFrame} style={{ aspectRatio: FILM.aspect }}>
        {src ? (
          <video
            className={styles.filmVideo}
            controls
            preload="none"
            playsInline
            poster={poster}
          >
            <source src={src} type="video/mp4" />
            {captions ? (
              <track
                kind="captions"
                src={captions}
                srcLang="en"
                label="English"
                default
              />
            ) : null}
          </video>
        ) : (
          <div
            className={styles.filmEmpty}
            role="group"
            aria-label={FILM.posterAlt}
          >
            <p className={styles.filmPlaceholder}>{FILM.placeholder}</p>
          </div>
        )}
      </div>
    </div>
  );
}
