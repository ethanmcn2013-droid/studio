"use server";

import { headers } from "next/headers";
import { joinWaitlist } from "@/lib/waitlist";

export type WaitlistFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialWaitlistFormState: WaitlistFormState = {
  status: "idle",
  message: "",
};

function value(formData: FormData, key: string): string | null {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw : null;
}

export async function joinWaitlistAction(
  _prevState: WaitlistFormState,
  formData: FormData,
): Promise<WaitlistFormState> {
  const honeypot = value(formData, "company");
  if (honeypot) {
    return {
      status: "success",
      message: "You are on the list.",
    };
  }

  const headersList = await headers();

  try {
    await joinWaitlist({
      email: value(formData, "email") ?? "",
      name: value(formData, "name"),
      useCase: value(formData, "useCase"),
      note: value(formData, "note"),
      source: value(formData, "source"),
      campaign: value(formData, "campaign"),
      audience: value(formData, "audience"),
      artifact: value(formData, "artifact"),
      touch: value(formData, "touch"),
      path: value(formData, "path"),
      referrer: headersList.get("referer"),
      userAgent: headersList.get("user-agent"),
    });

    return {
      status: "success",
      message: "You are on the list. We will write when the next access window opens.",
    };
  } catch (err) {
    return {
      status: "error",
      message:
        err instanceof Error
          ? err.message
          : "We could not save that. Try again or write to hello@signalstudio.ie.",
    };
  }
}
