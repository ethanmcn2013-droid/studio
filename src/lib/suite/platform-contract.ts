import platformContract from "../../../contracts/platform-packages.v1.json";

export const PLATFORM_PACKAGE_VERSION = platformContract.version;
export const PLATFORM_PACKAGE_NAMES = platformContract.packages;

const SECRET_KEYS = new Set(platformContract.telemetry.scrub);

export type SuiteTelemetryEvent = Readonly<{
  name: string;
  traceId: string;
  subject?: string;
  workspaceId?: string;
  properties?: Record<string, unknown>;
}>;

export function scrubTelemetry(event: SuiteTelemetryEvent): SuiteTelemetryEvent {
  const properties = Object.fromEntries(
    Object.entries(event.properties ?? {}).filter(([key]) => !SECRET_KEYS.has(key.toLowerCase())),
  );
  return { ...event, properties };
}

export function canUseCapability(
  status: "active" | "revoked" | "expired",
  capability: string,
  requested: string,
): boolean {
  return status === "active" && capability === requested;
}
