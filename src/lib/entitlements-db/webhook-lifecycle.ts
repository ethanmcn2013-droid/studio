export class RetryableWebhookError extends Error {
  constructor(
    readonly stage: "perform" | "complete",
    options?: ErrorOptions,
  ) {
    super("Webhook processing did not complete", options);
    this.name = "RetryableWebhookError";
  }
}

/**
 * A completion marker is never written before the side effect succeeds.
 * Therefore a transient privacy-operation failure remains retryable.
 */
export async function runRetryableWebhook<T>(input: {
  alreadyCompleted: () => Promise<boolean>;
  perform: () => Promise<T>;
  markCompleted: () => Promise<void>;
}): Promise<{ deduped: true } | { deduped: false; value: T }> {
  if (await input.alreadyCompleted()) return { deduped: true };
  let value: T;
  try {
    value = await input.perform();
  } catch (cause) {
    throw new RetryableWebhookError("perform", { cause });
  }
  try {
    await input.markCompleted();
  } catch (cause) {
    throw new RetryableWebhookError("complete", { cause });
  }
  return { deduped: false, value };
}
