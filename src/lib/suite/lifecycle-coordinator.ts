export type LifecycleAction = "export" | "delete" | "suspend" | "remove-membership" | "revoke-entitlement";
export type LifecycleStore =
  | "notes"
  | "tasks"
  | "timeline"
  | "signal"
  | "studio-entitlements"
  | "derived-briefings"
  | "caches"
  | "logs"
  | "backups";

export type LifecycleRequest = Readonly<{
  action: LifecycleAction;
  subject: string;
  workspaceId?: string;
  requestedAt?: string;
}>;

export type LifecycleOperation = Readonly<{
  idempotencyKey: string;
  action: LifecycleAction;
  store: LifecycleStore;
  subject: string;
  workspaceId?: string;
  destructive: boolean;
}>;

const STORES: readonly LifecycleStore[] = [
  "notes", "tasks", "timeline", "signal", "studio-entitlements",
  "derived-briefings", "caches", "logs", "backups",
];

export function planLifecycle(request: LifecycleRequest): LifecycleOperation[] {
  if (!request.subject.trim()) throw new TypeError("lifecycle subject is required");
  if (request.action !== "export" && request.action !== "suspend" && !request.workspaceId?.trim()) {
    throw new TypeError("workspaceId is required for workspace-scoped lifecycle actions");
  }
  const scope = request.workspaceId ? `:${request.workspaceId}` : "";
  return STORES.map((store) => ({
    idempotencyKey: `suite-lifecycle:v1:${request.action}:${store}:${request.subject}${scope}`,
    action: request.action,
    store,
    subject: request.subject,
    ...(request.workspaceId ? { workspaceId: request.workspaceId } : {}),
    destructive: request.action === "delete" || request.action === "remove-membership" || request.action === "revoke-entitlement",
  }));
}

export async function executeLifecyclePlan(
  operations: readonly LifecycleOperation[],
  executor: (operation: LifecycleOperation) => Promise<void>,
): Promise<{ applied: number; idempotencyKeys: string[] }> {
  const seen = new Set<string>();
  for (const operation of operations) {
    if (seen.has(operation.idempotencyKey)) continue;
    await executor(operation);
    seen.add(operation.idempotencyKey);
  }
  return { applied: seen.size, idempotencyKeys: [...seen] };
}
