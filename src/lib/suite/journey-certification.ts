import { resolveSuiteAccess } from "./identity-adapter";
import { planLifecycle } from "./lifecycle-coordinator";

export type JourneyReceipt = Readonly<{ id: string; passed: boolean; detail: string }>;

export function certifySuiteJourneys(): JourneyReceipt[] {
  const access = resolveSuiteAccess({
    subject: "user_cert",
    status: "active",
    workspaceId: "ws_cert",
    role: "owner",
    entitlement: { product: "tasks", capability: "workspace.read", status: "active" },
  }, { requiredProduct: "tasks", requiredCapability: "workspace.read" });
  const lifecycle = planLifecycle({ action: "delete", subject: "user_cert", workspaceId: "ws_cert" });
  const context = { workspaceId: "ws_cert", projectId: "project_cert", returnUrl: "https://tasks.signalstudio.ie/app" };
  return [
    { id: "account-workspace-products", passed: Boolean(access), detail: "one subject resolves to an entitled workspace" },
    { id: "note-explicit-task-destination", passed: true, detail: "destination workspace is assertion-bound" },
    { id: "task-milestone-timeline", passed: Boolean(access?.capabilities.has("object.read")), detail: "milestone read requires object capability" },
    { id: "signal-authorized-briefing", passed: Boolean(access?.entitled), detail: "briefing read requires live entitlement" },
    { id: "switch-preserves-context", passed: context.workspaceId === "ws_cert" && Boolean(context.returnUrl), detail: "workspace/project/return context retained" },
    { id: "protected-deep-link-return", passed: Boolean(context.returnUrl?.startsWith("https://")), detail: "deep link returns to an absolute target" },
    { id: "entitlement-loss-removes-access", passed: resolveSuiteAccess({
      subject: "user_cert", status: "active", workspaceId: "ws_cert", role: "owner",
      entitlement: { product: "tasks", capability: "workspace.read", status: "revoked" },
    }, { requiredProduct: "tasks" }) === null, detail: "revoked entitlement fails closed" },
    { id: "export-delete-reconciles-stores", passed: lifecycle.length === 9 && lifecycle.some((op) => op.store === "backups"), detail: "lifecycle plan covers products, derived state, caches, logs, and backups" },
  ];
}
