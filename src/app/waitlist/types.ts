// Plain module (NOT "use server"): a server-action file may only export
// async functions, so the form-state type and its initial value live here
// and are shared by actions.ts and the client form.

export type WaitlistFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const initialWaitlistFormState: WaitlistFormState = {
  status: "idle",
  message: "",
};
