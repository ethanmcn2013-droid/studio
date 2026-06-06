import { headers } from "next/headers";
import { SuiteSwitcher } from "@/components/layout/suite-switcher-pills";
import { SuiteLauncher } from "@/components/layout/suite-launcher";
import { DirectionCBriefing } from "@/components/reveal/direction-c-briefing";

/**
 * Home page — Direction C variant (branch only).
 *
 * On `direction-c-daily-signal`, the unauthed render is replaced with
 * a Daily Signal briefing — Analytics's product format applied to the
 * studio itself, dated, timestamped, sectioned. The reveal hero stack
 * stays intact in `src/components/reveal/` so a revert is a one-import
 * swap. This branch is a proposal; do NOT merge to main without an
 * explicit umbrella-direction decision.
 *
 * Authed branch unchanged — operator launching the suite gets the
 * SuiteLauncher, not a marketing surface.
 */
export default async function Home() {
  const headersList = await headers();
  const isAuthed = headersList.get("x-signal-authed") === "1";

  if (isAuthed) {
    return (
      <>
        <div className="flex w-full justify-center px-4 pt-[18px]">
          <SuiteSwitcher showUmbrella={false} />
        </div>
        <SuiteLauncher />
      </>
    );
  }

  return <DirectionCBriefing />;
}
