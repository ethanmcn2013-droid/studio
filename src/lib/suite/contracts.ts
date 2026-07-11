import {
  IOS_APP_URL,
  NOTES_URL,
  SIGNAL_URL,
  TASKS_URL,
  TIMELINE_URL,
} from "@/lib/product-urls";

/** The version of the cross-product shapes in this module. */
export const SUITE_CONTRACT_VERSION = 1 as const;

export type ProductId = "studio" | "tasks" | "timeline" | "signal" | "notes";
export type LinkedProductId = Exclude<ProductId, "studio">;
export type SuiteUserId = string;
export type WorkspaceId = string;
export type OrganizationId = string;

export type ProductSurface =
  | "umbrella"
  | "execution"
  | "direction"
  | "attention"
  | "capture";
export type ProductAccess = "public-first" | "private-first" | "collaboration-first" | "derived";

export type ProductDefinition = Readonly<{
  id: ProductId;
  name: string;
  canonicalUrl: string;
  surface: ProductSurface;
  access: ProductAccess;
}>;

/**
 * The only product/domain registry consumed by suite-aware code in Studio.
 * Product repositories can consume this shape through a versioned package
 * later; the registry is deliberately data-only so that migration is safe.
 */
export const PRODUCT_REGISTRY: Readonly<Record<ProductId, ProductDefinition>> = Object.freeze({
  studio: Object.freeze({
    id: "studio",
    name: "Signal Studio",
    canonicalUrl: process.env.NEXT_PUBLIC_STUDIO_URL ?? "https://signalstudio.ie",
    surface: "umbrella",
    access: "public-first",
  }),
  tasks: Object.freeze({
    id: "tasks",
    name: "Signal Tasks",
    canonicalUrl: TASKS_URL,
    surface: "execution",
    access: "collaboration-first",
  }),
  timeline: Object.freeze({
    id: "timeline",
    name: "Signal Timeline",
    canonicalUrl: TIMELINE_URL,
    surface: "direction",
    access: "public-first",
  }),
  signal: Object.freeze({
    id: "signal",
    name: "Signal",
    canonicalUrl: SIGNAL_URL,
    surface: "attention",
    access: "derived",
  }),
  notes: Object.freeze({
    id: "notes",
    name: "Signal Notes",
    canonicalUrl: NOTES_URL,
    surface: "capture",
    access: "private-first",
  }),
});

export const PRODUCT_IDS = Object.freeze(Object.keys(PRODUCT_REGISTRY) as ProductId[]);

export function isProductId(value: unknown): value is ProductId {
  return typeof value === "string" && PRODUCT_IDS.includes(value as ProductId);
}

export function productUrl(product: ProductId, path = ""): string {
  const base = PRODUCT_REGISTRY[product].canonicalUrl.replace(/\/$/, "");
  return path ? `${base}/${path.replace(/^\//, "")}` : base;
}

export type SuiteObjectRef = Readonly<{
  version: typeof SUITE_CONTRACT_VERSION;
  product: LinkedProductId;
  type: string;
  id: string;
  workspaceId?: WorkspaceId;
  canonicalUrl: string;
  sourceRef?: SuiteObjectRef;
}>;

export type SuiteContext = Readonly<{
  workspaceId?: WorkspaceId;
  projectId?: string;
  objectRef?: SuiteObjectRef;
  sourceProduct: ProductId;
  returnUrl?: string;
}>;

export type SuiteRole = "owner" | "admin" | "member" | "guest";
export type Permission =
  | "workspace.read"
  | "workspace.write"
  | "workspace.manage"
  | "object.read"
  | "object.write"
  | "object.share";

export type UserStatus = "active" | "suspended" | "deleted";
export type SubscriptionStatus = "trialing" | "active" | "past_due" | "canceled";
export type EntitlementStatus = "active" | "revoked" | "expired";

export type SuiteUser = Readonly<{
  id: SuiteUserId;
  displayName?: string;
  status: UserStatus;
}>;

export type Account = Readonly<{
  id: string;
  userId: SuiteUserId;
  provider: "clerk" | "other";
  providerSubject: string;
}>;

export type Organization = Readonly<{
  id: OrganizationId;
  name: string;
  ownerId: SuiteUserId;
}>;

export type Workspace = Readonly<{
  id: WorkspaceId;
  organizationId?: OrganizationId;
  name: string;
  ownerId: SuiteUserId;
  createdAt: string;
}>;

export type Membership = Readonly<{
  workspaceId: WorkspaceId;
  userId: SuiteUserId;
  role: SuiteRole;
  createdAt: string;
}>;

export type Entitlement = Readonly<{
  workspaceId: WorkspaceId;
  product: LinkedProductId;
  capability: string;
  status: EntitlementStatus;
  effectiveAt: string;
  expiresAt?: string;
}>;

export type Subscription = Readonly<{
  id: string;
  workspaceId: WorkspaceId;
  status: SubscriptionStatus;
  provider: "stripe" | "other";
  currentPeriodEndsAt?: string;
}>;

export type Invitation = Readonly<{
  id: string;
  workspaceId: WorkspaceId;
  email?: string;
  role: SuiteRole;
  expiresAt: string;
  acceptedAt?: string;
}>;

export type Session = Readonly<{
  id: string;
  userId: SuiteUserId;
  expiresAt: string;
  revokedAt?: string;
}>;

export type ServiceAccount = Readonly<{
  id: string;
  name: string;
  issuer: string;
  audience: string;
  active: boolean;
}>;

export type SuiteEventEnvelope<TPayload = Record<string, unknown>> = Readonly<{
  version: typeof SUITE_CONTRACT_VERSION;
  eventId: string;
  type: string;
  occurredAt: string;
  actorUserId?: SuiteUserId;
  workspaceId?: WorkspaceId;
  objectRef?: SuiteObjectRef;
  traceId: string;
  payload: TPayload;
}>;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isAbsoluteUrl(value: unknown): value is string {
  if (!isNonEmptyString(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Runtime guard used at object-link boundaries. It rejects malformed or unversioned refs. */
export function isSuiteObjectRef(value: unknown, depth = 0): value is SuiteObjectRef {
  if (depth > 4 || typeof value !== "object" || value === null) return false;
  const ref = value as Record<string, unknown>;
  return (
    ref.version === SUITE_CONTRACT_VERSION &&
    isProductId(ref.product) &&
    ref.product !== "studio" &&
    isNonEmptyString(ref.type) &&
    isNonEmptyString(ref.id) &&
    (ref.workspaceId === undefined || isNonEmptyString(ref.workspaceId)) &&
    isAbsoluteUrl(ref.canonicalUrl) &&
    (ref.sourceRef === undefined || isSuiteObjectRef(ref.sourceRef, depth + 1))
  );
}

export function isSuiteContext(value: unknown): value is SuiteContext {
  if (typeof value !== "object" || value === null) return false;
  const context = value as Record<string, unknown>;
  return (
    (context.workspaceId === undefined || isNonEmptyString(context.workspaceId)) &&
    (context.projectId === undefined || isNonEmptyString(context.projectId)) &&
    isProductId(context.sourceProduct) &&
    (context.objectRef === undefined || isSuiteObjectRef(context.objectRef)) &&
    (context.returnUrl === undefined || isAbsoluteUrl(context.returnUrl))
  );
}

export function createSuiteObjectRef(input: Omit<SuiteObjectRef, "version">): SuiteObjectRef {
  const ref: SuiteObjectRef = { version: SUITE_CONTRACT_VERSION, ...input };
  if (!isSuiteObjectRef(ref)) throw new TypeError("Invalid SuiteObjectRef");
  return ref;
}
