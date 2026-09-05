import { createVenueRuntime } from "./transport";
import { VenueIssuanceError, type IssuanceEnvironment } from "./protocol";
export function configuredVenueRuntime() {
  const environment = process.env.VENUE_ISSUANCE_ENVIRONMENT;
  if (process.env.VENUE_ISSUANCE_ENABLED !== "true" || (environment !== "internal_test" && environment !== "production")) throw new VenueIssuanceError("unavailable");
  const origin = process.env.VENUE_ISSUANCE_APP_ORIGIN ?? "";
  const runtime = createVenueRuntime({ origin, allowLocalTest: environment === "internal_test",
    auth: { secret: process.env.VENUE_ISSUANCE_SECRET ?? "", keyEpoch: process.env.VENUE_ISSUANCE_KEY_EPOCH ?? "",
      usageSecret: process.env.SPONSOR_USAGE_SERVICE_SECRET } });
  return { runtime, origin, environment: environment as IssuanceEnvironment };
}
