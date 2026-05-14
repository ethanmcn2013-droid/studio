import { redirect, permanentRedirect } from "next/navigation";

export const dynamic = "force-static";

export default function ChangelogRedirect() {
  permanentRedirect("/dispatch");
  // unreachable
  redirect("/dispatch");
}
