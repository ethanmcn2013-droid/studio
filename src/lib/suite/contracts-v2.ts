import type { ProductId, SuiteObjectRef, SuiteUserId, WorkspaceId } from "./contracts";

export const SUITE_CONTRACT_V2 = 2 as const;
export const PLANNING_PERIOD_CONTEXTS = [
  "school_year",
  "semester",
  "wedding_season",
  "general",
] as const;
export const WORKSPACE_CONTEXTS = [
  "class",
  "module",
  "wedding",
  "project",
] as const;

export type PlanningPeriodContext = (typeof PLANNING_PERIOD_CONTEXTS)[number];
export type WorkspaceContext = (typeof WORKSPACE_CONTEXTS)[number];
export type CalendarDate = string;
export type Instant = string;
export type PlanningPeriodId = string;

export type PlanningPeriodV2 = Readonly<{
  id: PlanningPeriodId;
  ownerUserId: SuiteUserId;
  name: string;
  contextType: PlanningPeriodContext;
  startDate: CalendarDate;
  endDate: CalendarDate;
  timezone: string;
  position: number;
  revision: number;
  archivedAt?: Instant;
  createdAt: Instant;
  updatedAt: Instant;
}>;

export type WorkspaceV2 = Readonly<{
  id: WorkspaceId;
  ownerUserId: SuiteUserId;
  name: string;
  planningPeriodId: PlanningPeriodId;
  contextType: WorkspaceContext;
  primaryDate?: CalendarDate;
  primaryDateLabel?: string;
  position: number;
  revision: number;
  archivedAt?: Instant;
  createdAt: Instant;
  updatedAt: Instant;
}>;

export type SuiteContextV2 = Readonly<{
  version: typeof SUITE_CONTRACT_V2;
  sourceProduct: ProductId;
  planningPeriodId?: PlanningPeriodId;
  workspaceId?: WorkspaceId;
  projectId?: string;
  objectRef?: SuiteObjectRef;
  returnUrl?: string;
}>;

export const CONTEXT_COPY: Readonly<
  Record<
    PlanningPeriodContext,
    Readonly<{
      period: string;
      workspace: string;
      audience: string;
      workspaceContext: WorkspaceContext;
    }>
  >
> = Object.freeze({
  school_year: Object.freeze({
    period: "School year",
    workspace: "Class",
    audience: "Class Timeline",
    workspaceContext: "class",
  }),
  semester: Object.freeze({
    period: "Semester",
    workspace: "Module",
    audience: "Module Timeline",
    workspaceContext: "module",
  }),
  wedding_season: Object.freeze({
    period: "Wedding season",
    workspace: "Wedding",
    audience: "Couple Timeline",
    workspaceContext: "wedding",
  }),
  general: Object.freeze({
    period: "Active work",
    workspace: "Workspace",
    audience: "Timeline",
    workspaceContext: "project",
  }),
});

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isCalendarDate(value: unknown): value is CalendarDate {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isIanaTimezone(value: unknown): value is string {
  if (!nonEmpty(value)) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function isPlanningPeriodContext(
  value: unknown,
): value is PlanningPeriodContext {
  return PLANNING_PERIOD_CONTEXTS.includes(value as PlanningPeriodContext);
}

export function isWorkspaceContext(value: unknown): value is WorkspaceContext {
  return WORKSPACE_CONTEXTS.includes(value as WorkspaceContext);
}

export function isPlanningPeriodV2(value: unknown): value is PlanningPeriodV2 {
  if (!isRecord(value)) return false;
  return (
    nonEmpty(value.id) &&
    nonEmpty(value.ownerUserId) &&
    nonEmpty(value.name) &&
    isPlanningPeriodContext(value.contextType) &&
    isCalendarDate(value.startDate) &&
    isCalendarDate(value.endDate) &&
    value.startDate <= value.endDate &&
    isIanaTimezone(value.timezone) &&
    Number.isInteger(value.position) &&
    Number.isInteger(value.revision) &&
    nonEmpty(value.createdAt) &&
    nonEmpty(value.updatedAt) &&
    (value.archivedAt === undefined || nonEmpty(value.archivedAt))
  );
}

export function isWorkspaceV2(value: unknown): value is WorkspaceV2 {
  if (!isRecord(value)) return false;
  return (
    nonEmpty(value.id) &&
    nonEmpty(value.ownerUserId) &&
    nonEmpty(value.name) &&
    nonEmpty(value.planningPeriodId) &&
    isWorkspaceContext(value.contextType) &&
    (value.primaryDate === undefined || isCalendarDate(value.primaryDate)) &&
    (value.primaryDateLabel === undefined || nonEmpty(value.primaryDateLabel)) &&
    Number.isInteger(value.position) &&
    Number.isInteger(value.revision) &&
    nonEmpty(value.createdAt) &&
    nonEmpty(value.updatedAt) &&
    (value.archivedAt === undefined || nonEmpty(value.archivedAt))
  );
}

export function isSuiteContextV2(value: unknown): value is SuiteContextV2 {
  if (!isRecord(value) || value.version !== SUITE_CONTRACT_V2) return false;
  const sourceProduct = value.sourceProduct;
  const products: ProductId[] = ["studio", "tasks", "timeline", "signal", "notes"];
  if (!products.includes(sourceProduct as ProductId)) return false;
  if (
    value.planningPeriodId !== undefined &&
    !nonEmpty(value.planningPeriodId)
  ) return false;
  if (value.workspaceId !== undefined && !nonEmpty(value.workspaceId)) return false;
  if (value.projectId !== undefined && !nonEmpty(value.projectId)) return false;
  if (value.returnUrl !== undefined) {
    if (!nonEmpty(value.returnUrl)) return false;
    try {
      const url = new URL(value.returnUrl);
      if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    } catch {
      return false;
    }
  }
  return true;
}
