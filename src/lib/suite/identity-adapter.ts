import type { Permission, SuiteRole, EntitlementStatus, UserStatus } from "./contracts";

export type IdentitySnapshot = Readonly<{
  subject: string;
  status: UserStatus;
  workspaceId: string;
  role: SuiteRole;
  entitlement?: {
    product: string;
    capability: string;
    status: EntitlementStatus;
    expiresAt?: string;
  };
}>;

export type SuiteAccess = Readonly<{
  subject: string;
  workspaceId: string;
  role: SuiteRole;
  capabilities: ReadonlySet<Permission>;
  entitled: boolean;
}>;

const ROLE_CAPABILITIES: Record<SuiteRole, readonly Permission[]> = {
  owner: ["workspace.read", "workspace.write", "workspace.manage", "object.read", "object.write", "object.share"],
  admin: ["workspace.read", "workspace.write", "workspace.manage", "object.read", "object.write", "object.share"],
  member: ["workspace.read", "workspace.write", "object.read", "object.write", "object.share"],
  guest: ["workspace.read", "object.read"],
};

function entitlementIsLive(entitlement: IdentitySnapshot["entitlement"], now: number): boolean {
  if (!entitlement || entitlement.status !== "active") return false;
  if (!entitlement.expiresAt) return true;
  const expiry = Date.parse(entitlement.expiresAt);
  return Number.isFinite(expiry) && expiry > now;
}

/** Resolve one immutable subject to explicit capabilities, fail closed. */
export function resolveSuiteAccess(
  snapshot: IdentitySnapshot,
  options: { now?: number; requiredProduct?: string; requiredCapability?: string } = {},
): SuiteAccess | null {
  if (!snapshot.subject || !snapshot.workspaceId || snapshot.status !== "active") return null;
  const capabilities = new Set(ROLE_CAPABILITIES[snapshot.role]);
  if (options.requiredCapability && !capabilities.has(options.requiredCapability as Permission)) return null;
  if (options.requiredProduct && snapshot.entitlement?.product !== options.requiredProduct) return null;
  const entitled = entitlementIsLive(snapshot.entitlement, options.now ?? Date.now());
  if (options.requiredProduct || options.requiredCapability) {
    if (!entitled) return null;
  }
  return { subject: snapshot.subject, workspaceId: snapshot.workspaceId, role: snapshot.role, capabilities, entitled };
}
