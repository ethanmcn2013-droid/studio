"use client";

// Deliberately isolated from the production product pages until a direction is selected.
import { useEffect, useMemo, useState } from "react";
import styles from "./product-page-lab.module.css";

type Option = "a" | "b" | "c";
type ProductId = "notes" | "tasks" | "timeline" | "signal";

type Product = {
  id: ProductId;
  name: string;
  position: string;
  verb: string;
  headline: string;
  introduction: string;
  boundary: string;
  moment: string;
  proof: [Proof, Proof, Proof];
  story: [Story, Story, Story];
};

type Proof = {
  label: string;
  title: string;
  copy: string;
};

type Story = {
  number: string;
  title: string;
  copy: string;
};

const PRODUCTS: Record<ProductId, Product> = {
  notes: {
    id: "notes",
    name: "Signal Notes",
    position: "Capture clarity",
    verb: "Hold the thought",
    headline: "Catch it before the day carries it away.",
    introduction:
      "A private notebook that opens ready. Write first. Decide what becomes work later.",
    boundary:
      "A note never becomes a task until you choose it. Capture and commitment stay separate.",
    moment: "The caret waits. The thought lands. Nothing else asks for attention.",
    proof: [
      {
        label: "01 · Capture",
        title: "Ready before you are.",
        copy: "The writing field is the first useful thing on screen. No filing decision comes first.",
      },
      {
        label: "02 · Find",
        title: "Your recent thinking stays close.",
        copy: "Search and recency bring the right note back without turning the notebook into a filing system.",
      },
      {
        label: "03 · Promote",
        title: "Work crosses deliberately.",
        copy: "Send an approved action to Tasks. The original note stays intact as context.",
      },
    ],
    story: [
      { number: "08:14", title: "A thought arrives.", copy: "Write it before the first meeting." },
      { number: "12:06", title: "The detail matters again.", copy: "Find the note by the words you remember." },
      { number: "16:42", title: "One line earns action.", copy: "Move that line to Tasks when you are ready." },
    ],
  },
  tasks: {
    id: "tasks",
    name: "Signal Tasks",
    position: "Execution clarity",
    verb: "Run the work",
    headline: "Know what needs doing. Then do it.",
    introduction:
      "One place for the commitments, dates and people that keep real work moving.",
    boundary:
      "Tasks shows the work. It does not grade the person doing it or fill the screen with performance theatre.",
    moment: "The mark resolves when the commitment resolves. A pulse, then quiet.",
    proof: [
      {
        label: "01 · Commit",
        title: "Write the work in plain English.",
        copy: "A task starts as a sentence. Ownership and date stay visible without crowding the action.",
      },
      {
        label: "02 · Arrange",
        title: "See the shape that helps today.",
        copy: "Board, list, timeline and calendar are views of the same work, not separate systems.",
      },
      {
        label: "03 · Finish",
        title: "Completion feels final.",
        copy: "The task closes cleanly and the workspace makes room for what remains.",
      },
    ],
    story: [
      { number: "MON", title: "The week opens.", copy: "Three commitments are due before Friday." },
      { number: "WED", title: "One hand-off moves.", copy: "The owner changes. The work stays clear." },
      { number: "FRI", title: "The last mark closes.", copy: "The project moves without a status meeting." },
    ],
  },
  timeline: {
    id: "timeline",
    name: "Signal Timeline",
    position: "Direction clarity",
    verb: "Explain the work",
    headline: "Turn milestone tasks into a story anyone can follow.",
    introduction:
      "Shape a private owner draft, then publish a calm timeline that opens without an account.",
    boundary:
      "The public copy contains only the milestone wording, dates and states you choose. Private work stays private.",
    moment: "The line travels once. Each marker lands where the story changes.",
    proof: [
      {
        label: "01 · Source",
        title: "Milestones begin in Tasks.",
        copy: "Mark the commitments that change the direction of the project. Timeline brings those markers together.",
      },
      {
        label: "02 · Shape",
        title: "Edit the story, not the source.",
        copy: "Clarify wording, dates, order and visibility in the private owner view.",
      },
      {
        label: "03 · Share",
        title: "Publish a frozen public copy.",
        copy: "Send one revocable link. The viewer sees the plan, not the workspace behind it.",
      },
    ],
    story: [
      { number: "01", title: "The brief is agreed.", copy: "A marker appears from the task that matters." },
      { number: "02", title: "The middle becomes clear.", copy: "Owner wording explains the change in plain English." },
      { number: "03", title: "The link travels.", copy: "A client opens the story without a sign-in wall." },
    ],
  },
  signal: {
    id: "signal",
    name: "Signal",
    position: "Attention clarity",
    verb: "Surface what matters",
    headline: "Start with the change that needs you.",
    introduction:
      "A daily briefing drawn from the work you already hold across Signal Studio.",
    boundary:
      "Signal is a briefing, not another place to manage the work. Read it, act, then leave.",
    moment: "The tick samples the day. One reading rises above the rest.",
    proof: [
      {
        label: "01 · Read",
        title: "The day opens with a briefing.",
        copy: "What moved, what is held up and what needs attention arrive in one short read.",
      },
      {
        label: "02 · Trace",
        title: "Every line points back to work.",
        copy: "Open the source task, note or milestone when you need the detail behind the signal.",
      },
      {
        label: "03 · Leave",
        title: "Attention returns to the work.",
        copy: "No feed and no score. The briefing ends when the useful reading ends.",
      },
    ],
    story: [
      { number: "07:30", title: "The briefing arrives.", copy: "Two changes and one decision need attention." },
      { number: "07:32", title: "The source opens.", copy: "A held-up task has the context needed to act." },
      { number: "07:36", title: "The briefing is done.", copy: "The rest of the day belongs to the work." },
    ],
  },
};

const OPTIONS: Array<{ id: Option; label: string; name: string; thesis: string }> = [
  {
    id: "a",
    label: "A",
    name: "Product proof",
    thesis: "The product demonstrates its value before the page explains it.",
  },
  {
    id: "b",
    label: "B",
    name: "Four gestures",
    thesis: "One suite system. One recognisable motion for each kind of clarity.",
  },
  {
    id: "c",
    label: "C",
    name: "A day in the work",
    thesis: "A small human story shows when the product earns its place.",
  },
];

function Arrow({ direction = "right" }: { direction?: "right" | "down" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={direction === "down" ? styles.arrowDown : undefined}
    >
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function ProductNav({
  product,
  setProduct,
  compact = false,
}: {
  product: ProductId;
  setProduct: (product: ProductId) => void;
  compact?: boolean;
}) {
  return (
    <nav className={`${styles.productNav} ${compact ? styles.productNavCompact : ""}`} aria-label="Product page">
      {(Object.values(PRODUCTS) as Product[]).map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={product === item.id}
          onClick={() => setProduct(item.id)}
        >
          <span>{item.id}</span>
          {!compact ? <small>{item.position.replace(" clarity", "")}</small> : null}
        </button>
      ))}
    </nav>
  );
}

function ProductFilm({
  product,
  large = false,
}: {
  product: ProductId;
  large?: boolean;
}) {
  return (
    <div
      className={`${styles.film} ${large ? styles.filmLarge : ""}`}
      data-product={product}
      aria-label={`${PRODUCTS[product].name} product motion`}
    >
      <div className={styles.filmChrome}>
        <span>signal studio</span>
        <i />
        <i />
        <i />
      </div>

      {product === "notes" ? (
        <div className={styles.notesFilm}>
          <div className={styles.notesInput}>
            <span>Ask Glenmara about supplier access</span>
            <i aria-hidden="true" />
          </div>
          <div className={styles.noteRows}>
            <p><span>Guest list questions</span><small>12:06</small></p>
            <p><span>Room setup from venue call</span><small>09:42</small></p>
            <p><span>Photographer arrival note</span><small>Yesterday</small></p>
          </div>
          <div className={styles.filmCaption}>One thought, held.</div>
        </div>
      ) : null}

      {product === "tasks" ? (
        <div className={styles.tasksFilm}>
          <div className={styles.taskHeading}>
            <span>Final week</span>
            <strong>3 of 5</strong>
          </div>
          {[
            ["Confirm supplier access", "Today", true],
            ["Send final guest count", "Tomorrow", false],
            ["Print table plan", "Friday", false],
          ].map(([title, date, done]) => (
            <div className={styles.taskRow} key={String(title)}>
              <i data-done={done} aria-hidden="true">{done ? "✓" : ""}</i>
              <span>{title}</span>
              <small>{date}</small>
            </div>
          ))}
          <div className={styles.filmCaption}>The commitment resolves.</div>
        </div>
      ) : null}

      {product === "timeline" ? (
        <div className={styles.timelineFilm}>
          <div className={styles.timelineHeading}>
            <span>Aoife &amp; Mark</span>
            <small>03 Apr – 18 Oct</small>
          </div>
          <div className={styles.filmLine}>
            <b aria-hidden="true" />
            {[
              ["03 Apr", "Venue"],
              ["16 Aug", "Guests"],
              ["09 Oct", "Walk-through"],
              ["18 Oct", "The day"],
            ].map(([date, title], index) => (
              <i key={title} style={{ "--i": index } as React.CSSProperties}>
                <span>{date}</span>
                <em />
                <strong>{title}</strong>
              </i>
            ))}
          </div>
          <div className={styles.filmCaption}>The line explains the work.</div>
        </div>
      ) : null}

      {product === "signal" ? (
        <div className={styles.signalFilm}>
          <div className={styles.signalMast}>
            <div><span>Daily Signal</span><small>Sunday, 26 July</small></div>
            <div className={styles.signalBars} aria-hidden="true">
              {[18, 31, 24, 46, 72, 35, 58].map((height, index) => (
                <i key={index} style={{ "--h": `${height}%`, "--i": index } as React.CSSProperties} />
              ))}
            </div>
          </div>
          <article className={styles.signalLead}>
            <span>Needs you</span>
            <h3>Supplier access is still open.</h3>
            <p>The venue walk-through is in nine days. One task has no owner.</p>
          </article>
          <div className={styles.signalIndex}>
            <span>2 changes</span><span>1 decision</span><span>4 minutes</span>
          </div>
          <div className={styles.filmCaption}>A briefing, then quiet.</div>
        </div>
      ) : null}
    </div>
  );
}

function ProofRail({
  product,
  active,
  setActive,
}: {
  product: Product;
  active: number;
  setActive: (index: number) => void;
}) {
  return (
    <section className={styles.proofSection}>
      <header>
        <p>How the product earns its place</p>
        <h2>Three moments. One clear boundary.</h2>
      </header>
      <div className={styles.proofGrid}>
        <div className={styles.proofRail} role="tablist" aria-label={`${product.name} proof`}>
          {product.proof.map((proof, index) => (
            <button
              key={proof.title}
              type="button"
              role="tab"
              aria-selected={active === index}
              onClick={() => setActive(index)}
            >
              <span>{proof.label}</span>
              <strong>{proof.title}</strong>
            </button>
          ))}
        </div>
        <div className={styles.proofDetail} role="tabpanel">
          <span>{product.proof[active].label}</span>
          <h3>{product.proof[active].title}</h3>
          <p>{product.proof[active].copy}</p>
          <div className={styles.proofDiagram} data-step={active}>
            <i />
            <i />
            <i />
            <b aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SharedHeader({
  product,
  setProduct,
}: {
  product: ProductId;
  setProduct: (product: ProductId) => void;
}) {
  return (
    <header className={styles.siteHeader}>
      <a href="#page-main" className={styles.skip}>Skip to page</a>
      <div className={styles.studioMark}>signal studio<span>.</span></div>
      <ProductNav product={product} setProduct={setProduct} compact />
      <button type="button" className={styles.openButton}>Open the app <Arrow /></button>
    </header>
  );
}

function OptionA({
  product,
  setProduct,
  proof,
  setProof,
}: DirectionProps) {
  return (
    <article className={`${styles.direction} ${styles.directionA}`}>
      <SharedHeader product={product.id} setProduct={setProduct} />
      <main id="page-main">
        <section className={styles.heroA}>
          <div className={styles.heroCopy}>
            <p>{product.name} · {product.position}</p>
            <h1>{product.headline}</h1>
            <span>{product.introduction}</span>
            <div className={styles.heroActions}>
              <button type="button">Open {product.id} <Arrow /></button>
              <a href="#product-proof">See how it works <Arrow direction="down" /></a>
            </div>
          </div>
          <div className={styles.filmWrap}>
            <div className={styles.filmLabel}>
              <span>Product proof</span>
              <strong>{product.moment}</strong>
            </div>
            <ProductFilm product={product.id} large />
          </div>
        </section>
        <div id="product-proof">
          <ProofRail product={product} active={proof} setActive={setProof} />
        </div>
        <section className={styles.boundarySection}>
          <p>The boundary</p>
          <h2>{product.boundary}</h2>
        </section>
      </main>
    </article>
  );
}

function OptionB({
  product,
  setProduct,
}: DirectionProps) {
  return (
    <article className={`${styles.direction} ${styles.directionB}`}>
      <SharedHeader product={product.id} setProduct={setProduct} />
      <main id="page-main">
        <section className={styles.heroB}>
          <p>{product.position}</p>
          <div className={styles.gestureWord} data-product={product.id}>
            {product.id}<i aria-hidden="true" />
          </div>
          <h1>{product.verb}.</h1>
          <span>{product.introduction}</span>
          <div className={styles.bActions}>
            <button type="button">Open {product.id}</button>
            <small>{product.moment}</small>
          </div>
        </section>
        <section className={styles.gestureStage}>
          <div className={styles.gestureExplanation}>
            <span>One studio. Four useful gestures.</span>
            <h2>The mark tells you what kind of clarity you are entering.</h2>
            <p>
              Notes waits. Tasks resolves. Timeline travels. Signal reads.
              The movement is part of the product language, not decoration.
            </p>
          </div>
          <ProductFilm product={product.id} large />
        </section>
        <section className={styles.suiteGestureRow}>
          {(Object.values(PRODUCTS) as Product[]).map((item) => (
            <button key={item.id} type="button" onClick={() => setProduct(item.id)} data-active={product.id === item.id}>
              <span>{item.position}</span>
              <strong>{item.id}<i data-product={item.id} /></strong>
              <small>{item.moment}</small>
            </button>
          ))}
        </section>
        <section className={styles.boundarySection}>
          <p>The boundary</p>
          <h2>{product.boundary}</h2>
        </section>
      </main>
    </article>
  );
}

function OptionC({
  product,
  setProduct,
  story,
  setStory,
}: DirectionProps) {
  const moment = product.story[story];
  return (
    <article className={`${styles.direction} ${styles.directionC}`}>
      <SharedHeader product={product.id} setProduct={setProduct} />
      <main id="page-main">
        <section className={styles.heroC}>
          <div className={styles.cIntro}>
            <p>{product.name} · in the work</p>
            <h1>{product.headline}</h1>
            <span>{product.introduction}</span>
          </div>
          <div className={styles.storyControl}>
            {product.story.map((item, index) => (
              <button
                key={item.number}
                type="button"
                aria-pressed={story === index}
                onClick={() => setStory(index)}
              >
                <span>{item.number}</span>
                <strong>{item.title}</strong>
              </button>
            ))}
          </div>
        </section>
        <section className={styles.storyStage}>
          <div className={styles.storyCopy}>
            <span>{moment.number}</span>
            <h2>{moment.title}</h2>
            <p>{moment.copy}</p>
            <i aria-hidden="true">{String(story + 1).padStart(2, "0")}</i>
          </div>
          <ProductFilm product={product.id} large />
        </section>
        <section className={styles.afterStory}>
          <div>
            <p>What stays true</p>
            <h2>{product.boundary}</h2>
          </div>
          <button type="button">Open {product.id} <Arrow /></button>
        </section>
      </main>
    </article>
  );
}

type DirectionProps = {
  product: Product;
  setProduct: (product: ProductId) => void;
  proof: number;
  setProof: (index: number) => void;
  story: number;
  setStory: (index: number) => void;
};

export function ProductPageLab({
  initialOption,
  initialProduct,
}: {
  initialOption: Option;
  initialProduct: ProductId;
}) {
  const [option, setOption] = useState<Option>(initialOption);
  const [productId, setProductId] = useState<ProductId>(initialProduct);
  const [proof, setProof] = useState(0);
  const [story, setStory] = useState(0);
  const product = useMemo(() => PRODUCTS[productId], [productId]);
  const optionMeta = OPTIONS.find((item) => item.id === option) ?? OPTIONS[0];

  function setProduct(next: ProductId) {
    setProductId(next);
    setProof(0);
    setStory(0);
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("option", option);
    url.searchParams.set("product", productId);
    window.history.replaceState({}, "", url);
  }, [option, productId]);

  const props: DirectionProps = {
    product,
    setProduct,
    proof,
    setProof,
    story,
    setStory,
  };

  return (
    <div className={styles.lab}>
      <aside className={styles.reviewBar}>
        <div className={styles.reviewIdentity}>
          <span>Local review · product marketing</span>
          <strong>{optionMeta.name}</strong>
          <p>{optionMeta.thesis}</p>
        </div>
        <div className={styles.reviewControls}>
          <nav className={styles.optionNav} aria-label="Marketing page direction">
            {OPTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={option === item.id}
                onClick={() => setOption(item.id)}
              >
                <span>{item.label}</span>
                <i>
                  <strong>{item.name}</strong>
                  <small>{item.thesis}</small>
                </i>
              </button>
            ))}
          </nav>
          <ProductNav product={productId} setProduct={setProduct} />
        </div>
      </aside>

      <div className={styles.pageFrame}>
        {option === "a" ? <OptionA {...props} /> : null}
        {option === "b" ? <OptionB {...props} /> : null}
        {option === "c" ? <OptionC {...props} /> : null}
      </div>

      <footer className={styles.reviewFooter}>
        <span>Recovered motion language: caret · pulse · sweep · tick.</span>
        <span>Deterministic product scenes. No production data or claims beyond the current suite contract.</span>
      </footer>
    </div>
  );
}
