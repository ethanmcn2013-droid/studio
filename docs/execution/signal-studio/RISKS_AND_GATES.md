# RISKS AND GATES — Signal Studio Premium Programme

## External / destructive action gates (STOP and surface; prepare everything, execute nothing past the gate)
| Gate | What | Owner action | Programme phase |
|---|---|---|---|
| G-01 | Unified-app cutover (Stages A–D), old-app /app redirects, /app/account redirects | Founder decisions MIGRATION-P08-001…008 — this programme NEVER authors Stage-C redirect commits (P08-008 owns them) | constraint on all |
| G-02 | Clerk dashboard: enable Google/Apple/GitHub providers (identity-only scopes) | Founder dashboard access; operator-todo to file at Phase 2 entry | 2 |
| G-03 | Vercel Blob store provisioning + env on tasks project | Founder Vercel action; operator-todo at Phase 1 entry | 1 |
| G-04 | Stripe live products/prices, Customer Portal config, live keys | Sandbox only until founder acts (docs/STRIPE_SETUP.md) | 4 |
| G-05 | DNS / Vercel domain changes; roadmap.→timeline. redirect deploy | Prepare + preview; deploy only with founder OK, coordinated vs G-01 Stage C | 8 |
| G-06 | Google Workspace: support@ alias; DKIM TXT record | Founder admin console (docs/DKIM_SETUP.md); no support address published until it receives a test message | 8 |
| G-07 | Deleting/replacing demo data in production Turso | Dry-run count + export snapshot + explicit destructive checkpoint; owner-scoped only | 8 |
| G-08 | Sending real email (invites to real people, nudge emails in prod, marketing sends) | DKIM + founder OK; test accounts only until then | 2/5/6 |
| G-09 | In-app dark/premium theme exposure | Founder sign-off vs light-lock (D-013 operator-todo) | 4 |
| G-10 | Google Picker / Drive OAuth console config | Founder cloud-console action; coordinate with P08-005 | later phase of 1 |
| G-11 | Publishing deck changes to external mirrors | CI publishes on main push — deck edits reviewed + rendered BEFORE merge | 8 |

## Programme risks
| Risk | Impact | Mitigation |
|---|---|---|
| R-01 Concurrent committer: another autonomous process commits in these repos (tasks checkout sits on its branch feat/tasks-hero-lab; hero-lab work overlaps Phase 7) | Conflicts, swept commits, duplicated hero effort | Commit own work promptly in own worktrees/branches; before Phase 7, inventory the hero-lab branches (tasks/notes/roadmap feat/*-hero-lab) and integrate rather than duplicate |
| R-02 Unified-app cutover lands mid-programme | Rebase cost | D-000 merge-forward discipline; new code in new modules/tables; avoid shell/chrome edits |
| R-03 Local-disk attachments already in prod | Existing uploads may be lost on redeploy before Phase 1 lands | Phase 1 priority; migration reads old rows, missing bytes marked unrecoverable honestly |
| R-04 Storage quota numbers unapproved | Rework | Config-driven (D-007), one module to change |
| R-05 Turbopack junction issue on this machine | Local build friction | Known env constraint; CI is authoritative for builds |
| R-06 [kb] research load-bearing without verification | Wrong IA decisions | RESEARCH.md follow-ups block Phase 3/4 freeze |
| R-07 Experience-materiality gates on registered pages (homepage hero!) | CI red on Phase 7 | Use fixtures:write → playwright → attest → review-materiality recipe (tasks repo) |
| R-08 tasks checkout dirty/foreign state | Baseline drift | Baseline recorded at 70375f5 (=main~2); re-verify at each phase start per session-start protocol |
| R-09 GDPR consent gate open suite-wide (GA4) | Compliance | Owned by gdpr operator-todos; our analytics events add nothing personal (brief §6.6) |

## Standing rules
- No secrets in commits; rotate anything pasted in chat (existing memory: Turso token rotation still outstanding — surface to founder).
- Migrations reversible; separate schema deploy from UI activation where prudent.
- UI hiding is never permission enforcement; server-side checks tested by direct URL/API.
- Every founder-gated item ALSO becomes `studio/content/hq/operator-todos/<id>.md` (HQ ledger rule) at the phase where it first blocks.
