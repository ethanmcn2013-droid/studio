"use client";

import { useMemo, useState } from "react";
import type { ProductMarketingDefinition } from "@/lib/product-marketing";
import type { ProductId } from "@/lib/product-urls";
import { TimelineArtifact } from "./timeline-artifact";
import { MARA_FINN_TIMELINE } from "./timeline-fixture";
import styles from "./day-in-work-experience.module.css";

export function DayInWorkExperience({
  product,
  definition,
}: {
  product: ProductId;
  definition: ProductMarketingDefinition;
}) {
  const [moment, setMoment] = useState(0);
  const active = definition.story[moment];

  return (
    <section
      aria-labelledby={`${product}-day-heading`}
      className={styles.section}
      data-day-in-work
      data-product={product}
    >
      <div className={styles.sectionHeader}>
        <div>
          <p>A day in the work</p>
          <h2 id={`${product}-day-heading`}>
            Three moments. One useful place in the day.
          </h2>
        </div>
        <p className={styles.sectionNote}>
          Product proof with deterministic example data. Nothing here reaches a
          live workspace.
        </p>
      </div>

      <div
        aria-label={`${definition.name} moments`}
        className={styles.momentTabs}
        role="tablist"
      >
        {definition.story.map((item, index) => (
          <button
            aria-controls={`${product}-moment-panel`}
            aria-selected={moment === index}
            className={styles.momentTab}
            id={`${product}-moment-${index}`}
            key={item.number}
            onClick={() => setMoment(index)}
            role="tab"
            tabIndex={moment === index ? 0 : -1}
            type="button"
          >
            <span>{item.number}</span>
            <strong>{item.title}</strong>
          </button>
        ))}
      </div>

      <div
        aria-labelledby={`${product}-moment-${moment}`}
        className={`${styles.stage} ${
          product === "timeline" ? styles.timelineStage : ""
        }`}
        id={`${product}-moment-panel`}
        role="tabpanel"
      >
        <div className={styles.storyCopy}>
          <span>{active.number}</span>
          <h3>{active.title}</h3>
          <p>{active.copy}</p>
          <b aria-hidden>{String(moment + 1).padStart(2, "0")}</b>
        </div>
        <ProductScene activeMoment={moment} product={product} />
      </div>
    </section>
  );
}

function ProductScene({
  activeMoment,
  product,
}: {
  activeMoment: number;
  product: ProductId;
}) {
  if (product === "notes") {
    return <NotesScene activeMoment={activeMoment} key={activeMoment} />;
  }
  if (product === "tasks") return <TasksScene activeMoment={activeMoment} />;
  if (product === "timeline") {
    return (
      <div className={`${styles.sceneFrame} ${styles.timelineFrame}`}>
        <SceneChrome
          label="Public artifact"
          receipt="The signed Timeline design"
        />
        <TimelineArtifact embedded timeline={MARA_FINN_TIMELINE} />
      </div>
    );
  }
  return <SignalScene activeMoment={activeMoment} />;
}

function SceneChrome({
  label,
  receipt,
}: {
  label: string;
  receipt: string;
}) {
  return (
    <div className={styles.sceneChrome}>
      <span>{label}</span>
      <small>{receipt}</small>
    </div>
  );
}

function NotesScene({ activeMoment }: { activeMoment: number }) {
  const starter =
    activeMoment === 0
      ? "Ask Orla whether the florist can keep the stems seasonal."
      : activeMoment === 1
        ? "The place cards should use the same paper as the invitations."
        : "Confirm the supplier hand-off before Friday.";
  const [note, setNote] = useState(starter);
  const [promoted, setPromoted] = useState(false);

  return (
    <div className={styles.sceneFrame}>
      <SceneChrome label="Notes" receipt="Private notebook preview" />
      <div className={styles.notesScene}>
        <div className={styles.notesRail}>
          <strong>Today</strong>
          <span>Wedding notes</span>
          <span>Venue walk-through</span>
          <span>Supplier ideas</span>
        </div>
        <div className={styles.noteCanvas}>
          <p>26 July</p>
          <textarea
            aria-label="Example note"
            onChange={(event) => {
              setNote(event.target.value);
              setPromoted(false);
            }}
            value={note}
          />
          <div className={styles.noteMeta}>
            <span>Saved locally in this preview</span>
            <button
              disabled={!note.trim()}
              onClick={() => setPromoted(true)}
              type="button"
            >
              {promoted ? "Sent to Tasks" : "Send line to Tasks"}
            </button>
          </div>
          {promoted ? (
            <p className={styles.sceneReceipt} role="status">
              The note stays intact. One approved line became a task.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type PreviewTask = Readonly<{
  id: string;
  title: string;
  owner: string;
  day: string;
}>;

const PREVIEW_TASKS: readonly PreviewTask[] = [
  {
    id: "run-sheet",
    title: "Approve the Saturday run-sheet",
    owner: "Mara",
    day: "Mon",
  },
  {
    id: "menu",
    title: "Confirm the final menu",
    owner: "Finn",
    day: "Wed",
  },
  {
    id: "music",
    title: "Choose the evening music",
    owner: "Mara",
    day: "Fri",
  },
];

function TasksScene({ activeMoment }: { activeMoment: number }) {
  const [done, setDone] = useState<readonly string[]>(["run-sheet"]);
  const activeId = PREVIEW_TASKS[activeMoment]?.id;

  return (
    <div className={styles.sceneFrame}>
      <SceneChrome label="Tasks" receipt="Working project preview" />
      <div className={styles.tasksScene}>
        <header>
          <div>
            <span>This week</span>
            <h4>The Orchard wedding</h4>
          </div>
          <strong>{done.length} of {PREVIEW_TASKS.length} done</strong>
        </header>
        <div className={styles.taskList}>
          {PREVIEW_TASKS.map((task) => {
            const complete = done.includes(task.id);
            return (
              <button
                aria-pressed={complete}
                className={styles.taskRow}
                data-active={task.id === activeId ? "true" : undefined}
                key={task.id}
                onClick={() =>
                  setDone((current) =>
                    current.includes(task.id)
                      ? current.filter((id) => id !== task.id)
                      : [...current, task.id],
                  )
                }
                type="button"
              >
                <i aria-hidden>{complete ? "✓" : ""}</i>
                <span>
                  <strong>{task.title}</strong>
                  <small>{task.owner}</small>
                </span>
                <time>{task.day}</time>
              </button>
            );
          })}
        </div>
        <p className={styles.sceneHint}>Select a commitment to resolve or reopen it.</p>
      </div>
    </div>
  );
}

const SIGNAL_READINGS = [
  {
    label: "Needs you",
    title: "The run-sheet is waiting on one approval.",
    source: "Saturday run-sheet · Tasks",
  },
  {
    label: "Changed",
    title: "The florist moved the final stem count to Wednesday.",
    source: "Florist hand-off · Tasks",
  },
  {
    label: "Moving well",
    title: "The Orchard reservation milestone is settled.",
    source: "Mara & Finn · Timeline",
  },
] as const;

function SignalScene({ activeMoment }: { activeMoment: number }) {
  const [openReading, setOpenReading] = useState<number | null>(activeMoment);
  const generated = useMemo(() => "Saturday, 26 July · 07:30", []);

  return (
    <div className={styles.sceneFrame}>
      <SceneChrome label="Signal" receipt="Daily briefing preview" />
      <div className={styles.signalScene}>
        <header>
          <p>Good morning, Ethan.</p>
          <span>{generated}</span>
        </header>
        <h4>One decision is holding the day.</h4>
        <div className={styles.readingList}>
          {SIGNAL_READINGS.map((reading, index) => (
            <button
              aria-expanded={openReading === index}
              className={styles.reading}
              key={reading.title}
              onClick={() =>
                setOpenReading((current) => (current === index ? null : index))
              }
              type="button"
            >
              <span>{reading.label}</span>
              <strong>{reading.title}</strong>
              {openReading === index ? <small>{reading.source}</small> : null}
            </button>
          ))}
        </div>
        <p className={styles.sceneHint}>Open a reading to see the work behind it.</p>
      </div>
    </div>
  );
}
