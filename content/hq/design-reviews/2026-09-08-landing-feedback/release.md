# Landing refinement release · 8 September 2026

Scope: the full-width timeline, continuous light/dark timeline surface, and
animated footer Dot. The user explicitly authorized deployment and then
excluded favicon work. Studio favicon changes were reverted in `33a9a188`;
App PR #173 is not included. No data, migration, environment, or pricing change.

Production baseline and rollback target: Studio `e1589703`, deployment
`dpl_r7CQ2GEQuupuaRGwUNWSt76NSWKc`. Remote main matches that revision.
Provider: Vercel project `studio`, `prj_DtQGpGQpnXNoKY7tDv6xIu2MG9cA`,
team `team_veMY72ml10cAawsR0CjN9k5y`. Target: <https://signalstudio.ie/>.

Final gates and rendered verification are in progress. Earlier checks in
`verification.md` describe the prior source, including now-excluded icon work.
Current runs use the same documented serial test method and one-worker build.
