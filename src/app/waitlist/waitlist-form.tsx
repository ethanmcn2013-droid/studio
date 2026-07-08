"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  initialWaitlistFormState,
  joinWaitlistAction,
} from "./actions";

type WaitlistFormProps = {
  source: string;
  campaign?: string;
  audience?: string;
  artifact?: string;
  touch?: string;
  path?: string;
  defaultUseCase?: string;
};

const USE_CASES = [
  { value: "weddings", label: "Wedding or event planning" },
  { value: "venues", label: "Venue Edition" },
  { value: "students", label: "Student work" },
  { value: "freelance", label: "Freelance client work" },
  { value: "trades", label: "Trades or site work" },
  { value: "small-business", label: "Small business rhythm" },
  { value: "other", label: "Something else" },
] as const;

export function WaitlistForm(props: WaitlistFormProps) {
  const [state, action] = useActionState(
    joinWaitlistAction,
    initialWaitlistFormState,
  );

  return (
    <form
      action={action}
      className="waitlist-form"
      aria-label="Join the Signal Studio waitlist"
    >
      <input type="hidden" name="source" value={props.source} />
      <input type="hidden" name="campaign" value={props.campaign ?? ""} />
      <input type="hidden" name="audience" value={props.audience ?? ""} />
      <input type="hidden" name="artifact" value={props.artifact ?? ""} />
      <input type="hidden" name="touch" value={props.touch ?? "site"} />
      <input type="hidden" name="path" value={props.path ?? "/waitlist"} />

      <label className="waitlist-field">
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
        />
      </label>

      <label className="waitlist-field">
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" placeholder="Optional" />
      </label>

      <label className="waitlist-field waitlist-field--full">
        <span>What should Signal Studio help with?</span>
        <select name="useCase" defaultValue={props.defaultUseCase ?? ""}>
          <option value="">Choose one</option>
          {USE_CASES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="waitlist-field waitlist-field--full">
        <span>One line of context</span>
        <textarea
          name="note"
          rows={4}
          placeholder="What are you trying to run without the noise?"
        />
      </label>

      <label className="waitlist-pot" aria-hidden="true">
        Company
        <input
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <div className="waitlist-form-foot">
        <SubmitButton />
        <p
          className="waitlist-form-message"
          data-state={state.status}
          aria-live="polite"
        >
          {state.message || "No newsletter. No launch theatre. Just the access window."}
        </p>
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="waitlist-submit">
      {pending ? "Joining" : "Join the waitlist"}
    </button>
  );
}
