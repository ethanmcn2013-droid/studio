"use client";

import { useActionState, useEffect, useRef, useState, type FormEvent } from "react";
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

/**
 * The waitlist form at the close of the home page: one call to action, one
 * place it lands. Wired to the real joinWaitlistAction. The address is checked
 * here first, then the server's own message is shown, for success and for
 * failure alike. The address stays in the field if the save fails. Honeypot
 * and tracking fields ride along hidden.
 */
export function HomeWaitlist() {
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

  const done = state.status === "success";
  const serverError = state.status === "error" && dismissed !== state ? state.message : "";
  const error = localError || serverError;
  const useCase = RUNS.find((item) => item.value === run)?.useCase ?? "";

  useEffect(() => {
    if (state.status === "success") doneRef.current?.focus({ preventScroll: true });
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
      problem = "That does not look like an email address. Check it and try again.";
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

  return (
    <>
      <form
        className="wl lp-reveal"
        style={v({ "--lp-i": 2 })}
        id="waitlist-form"
        action={formAction}
        onSubmit={onSubmit}
        noValidate
        hidden={done}
        aria-busy={pending || undefined}
      >
        <input type="hidden" name="source" value="home_close" />
        <input type="hidden" name="campaign" value="pre_access_waitlist" />
        <input type="hidden" name="audience" value={run} />
        <input type="hidden" name="useCase" value={useCase} />
        <input type="hidden" name="artifact" value="close_form" />
        <input type="hidden" name="touch" value="site" />
        <input type="hidden" name="path" value="/" />
        {/* honeypot: real people leave it blank */}
        <input type="text" name="company" hidden tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <label htmlFor="wl-email">Email address</label>
        <div className="wl-row">
          <input
            ref={inputRef}
            id="wl-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            enterKeyHint="send"
            autoCapitalize="off"
            spellCheck={false}
            required
            placeholder="you@example.ie"
            aria-describedby="wl-err wl-note"
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
            className="btn btn-primary"
            type="submit"
            id="wl-submit"
            aria-disabled={pending || undefined}
            style={minWidth ? { minWidth } : undefined}
          >
            <span>{pending ? "Sending" : "Join the waitlist"}</span>{" "}
            <svg className="along" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
        <p key={tries} className={error ? (tries > 1 ? "wl-err again" : "wl-err shown") : "wl-err"} id="wl-err" role="alert">{error}</p>
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
        <span className="vh" role="status">{pending ? "Sending." : ""}</span>
      </form>
      <p className="wl-done" id="wl-done" role="status" tabIndex={-1} hidden={!done} ref={doneRef}>
        <svg width="20" height="20" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="currentColor" /><path d="M5 8.3 7.1 10.4 11 6" fill="none" stroke="var(--lp-floor)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span>{done ? state.message : ""}</span>
      </p>
    </>
  );
}
