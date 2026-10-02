"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { joinWaitlistAction } from "@/app/waitlist/actions";
import { initialWaitlistFormState, type WaitlistFormState } from "@/app/waitlist/types";
import { v } from "./style-vars";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * "What do you run?" Each answer rides along twice: as itself in `audience`,
 * and as the nearest of the waitlist's own use cases in `useCase`, which the
 * server only accepts from its fixed list.
 */
const RUNS = [
  { value: "venue", label: "Venue", useCase: "venues" },
  { value: "trade", label: "Trade", useCase: "trades" },
  { value: "school", label: "School", useCase: "other" },
  { value: "studio", label: "Studio", useCase: "small-business" },
  { value: "other", label: "Something else", useCase: "other" },
] as const;

const ARROW = (
  <svg className="along" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

/* The page has several of these forms and one list. Once any of them has
   joined, the others say so instead of asking again. */
let joined = "";
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
const joinedNow = () => joined;
const joinedOnServer = () => "";

type Variant = "close" | "hero" | "prompt";

/**
 * The waitlist form, in the three places the home page asks for an address:
 * in the hero, in the quiet prompts after the sample and after Files, and at
 * the close. One component, so the checks, the pending state, the error and
 * the success are the same everywhere. Wired to the real joinWaitlistAction.
 * The address is checked here first, then the server's own message is shown,
 * for success and for failure alike. The address stays in the field if the
 * save fails. Honeypot and tracking fields ride along hidden; `source` and
 * `artifact` say which of the forms it was.
 *
 * The closing form keeps the ids the page's links and the runtime land on
 * (`waitlist-form`, `wl-email`); the others take theirs from `id`.
 */
export function HomeWaitlist({
  variant,
  id = variant,
  source,
  artifact,
}: {
  variant: Variant;
  /** Makes this form's ids unique: `wl-<id>-email` and so on. */
  id?: string;
  source: string;
  artifact: string;
}) {
  const [state, formAction, pending] = useActionState(joinWaitlistAction, initialWaitlistFormState);
  const [email, setEmail] = useState("");
  const [run, setRun] = useState("");
  const [localError, setLocalError] = useState("");
  // Counts refusals, so a second wrong try shows the message again rather than sitting still.
  const [tries, setTries] = useState(0);
  // The server's error is cleared by typing, like the local one.
  const [dismissed, setDismissed] = useState<WaitlistFormState | null>(null);
  const [minWidth, setMinWidth] = useState<number | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const elsewhere = useSyncExternalStore(subscribe, joinedNow, joinedOnServer);

  const close = variant === "close";
  const ids = close
    ? { form: "waitlist-form", email: "wl-email", submit: "wl-submit", err: "wl-err", done: "wl-done" }
    : { form: `wl-${id}-form`, email: `wl-${id}-email`, submit: `wl-${id}-submit`, err: `wl-${id}-err`, done: `wl-${id}-done` };

  const own = state.status === "success";
  const done = own || Boolean(elsewhere);
  const doneMessage = own ? state.message : elsewhere;
  const serverError = state.status === "error" && dismissed !== state ? state.message : "";
  const error = localError || serverError;
  const useCase = RUNS.find((item) => item.value === run)?.useCase ?? "";

  useEffect(() => {
    if (state.status === "success") {
      joined = state.message;
      listeners.forEach((listener) => listener());
      doneRef.current?.focus({ preventScroll: true });
    }
    if (state.status === "error") inputRef.current?.focus({ preventScroll: true });
  }, [state]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (pending) {
      event.preventDefault();
      return;
    }
    const input = inputRef.current;
    const value = email.trim();
    let problem = "";
    if (!value) problem = "Enter your email address.";
    else if ((input && !input.checkValidity()) || !EMAIL.test(value))
      problem = "That does not look like an email address.";
    if (problem) {
      event.preventDefault();
      setLocalError(problem);
      setTries((count) => count + 1);
      input?.focus();
      return;
    }
    setLocalError("");
    setDismissed(state);
    // Hold the button's width so "Sending" does not shift the row.
    setMinWidth(buttonRef.current?.offsetWidth);
  }

  /* One line is kept for the error, so it appears without moving anything. A
     longer message, which only the server sends, takes the room it needs. */
  const errorClass = ["wl-err", error ? (tries > 1 ? "again" : "shown") : "", error.length > 48 ? "long" : ""].filter(Boolean).join(" ");

  return (
    <>
      <form
        className={close ? "wl lp-reveal" : `wl wl-${variant}`}
        style={close ? v({ "--lp-i": 2 }) : undefined}
        id={ids.form}
        action={formAction}
        onSubmit={onSubmit}
        noValidate
        hidden={done}
        aria-busy={pending || undefined}
      >
        <input type="hidden" name="source" value={source} />
        <input type="hidden" name="campaign" value="pre_access_waitlist" />
        <input type="hidden" name="audience" value={run} />
        <input type="hidden" name="useCase" value={useCase} />
        <input type="hidden" name="artifact" value={artifact} />
        <input type="hidden" name="touch" value="site" />
        <input type="hidden" name="path" value="/" />
        {/* honeypot: real people leave it blank */}
        <input type="text" name="company" hidden tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <label htmlFor={ids.email} className={close ? undefined : "vh"}>Email address</label>
        <div className="wl-row">
          <input
            ref={inputRef}
            id={ids.email}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            enterKeyHint="send"
            autoCapitalize="off"
            spellCheck={false}
            required
            placeholder="you@example.ie"
            aria-describedby={`${ids.err} wl-note`}
            aria-invalid={error ? true : undefined}
            readOnly={pending}
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (localError) setLocalError("");
              if (serverError) setDismissed(state);
            }}
          />
          <button
            ref={buttonRef}
            className={variant === "prompt" ? "btn btn-ghost" : "btn btn-primary"}
            type="submit"
            id={ids.submit}
            aria-disabled={pending || undefined}
            style={minWidth ? { minWidth } : undefined}
          >
            <span>{pending ? "Sending" : "Join the waitlist"}</span> {ARROW}
          </button>
        </div>
        <p key={tries} className={errorClass} id={ids.err} role="alert">{error}</p>
        {close ? (
          <fieldset>
            <legend>What do you run? <span>You can skip this.</span></legend>
            <div className="chips">
              {RUNS.map((item) => (
                <label key={item.value}>
                  <input
                    type="radio"
                    name="run"
                    value={item.value}
                    checked={run === item.value}
                    disabled={pending}
                    onChange={() => setRun(item.value)}
                    onClick={() => {
                      // A second press on the chosen answer clears it: the question is optional.
                      if (run === item.value) setRun("");
                    }}
                  />
                  {item.label}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}
        <span className="vh" role="status">{pending ? "Sending." : ""}</span>
      </form>
      <p className={close ? "wl-done" : `wl-done wl-done-${variant}`} id={ids.done} role={own ? "status" : undefined} tabIndex={-1} hidden={!done} ref={doneRef}>
        <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="currentColor" /><path d="M5 8.3 7.1 10.4 11 6" fill="none" stroke="var(--lp-floor)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span>{done ? doneMessage : ""}</span>
      </p>
    </>
  );
}
